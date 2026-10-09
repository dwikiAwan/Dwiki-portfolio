import { useState, useEffect, useCallback } from 'react';
import {
    collection, query, orderBy, limit, onSnapshot,
    doc, updateDoc, increment, serverTimestamp,
    writeBatch, getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
    LIMITS, COOLDOWN_MS, REACTION_KEYS, emptyReactions,
    MAX_PER_WINDOW, QUOTA_WINDOW_MS,
} from '../data/guestbook';

export { LIMITS };

const LAST_POST_KEY = 'gb_last_post';
const REACTED_KEY = 'gb_reacted';
const CACHE_KEY = 'gb_cache';

const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const writeJSON = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage diblokir: abaikan */ }
};

// Cache ringan di localStorage (pola sama seperti useLiveArticles) supaya chat
// tidak kosong setelah refresh saat Firestore lambat atau read-nya gagal.
const readCache = () => {
    try {
        const items = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        return Array.isArray(items) ? items : [];
    } catch { return []; }
};

// status: 'loading' | 'ready' | 'error' | 'offline' (env Firebase belum diisi)
// messages: terbaru di depan. addMessage() async -> string error atau null.
export default function useGuestbook() {
    const [messages, setMessages] = useState(() => (db ? readCache() : []));
    const [status, setStatus] = useState(db ? 'loading' : 'offline');

    useEffect(() => {
        if (!db) return undefined;
        const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(50));
        return onSnapshot(
            q,
            (snap) => {
                const items = snap.docs.map((d) => {
                    const x = d.data({ serverTimestamps: 'estimate' });
                    return {
                        id: d.id,
                        name: x.name,
                        message: x.message,
                        avatar: x.avatar,
                        reactions: emptyReactions(x.reactions),
                        time: x.createdAt?.toDate
                            ? x.createdAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Baru saja',
                    };
                });
                setMessages(items);
                writeJSON(CACHE_KEY, items);
                setStatus('ready');
            },
            (err) => { console.error('Guestbook:', err); setStatus('error'); }
        );
    }, []);

    const addMessage = useCallback(async (rawName, rawText, avatar = 'code') => {
        if (!db) return 'Guestbook belum dikonfigurasi (cek file .env.local).';
        const name = rawName.trim();
        const message = rawText.trim();
        if (!name || !message) return 'Nama dan pesan tidak boleh kosong.';
        if (name.length > LIMITS.name || message.length > LIMITS.message) {
            return `Nama maksimal ${LIMITS.name} karakter dan pesan maksimal ${LIMITS.message} karakter.`;
        }
        const wait = COOLDOWN_MS - (Date.now() - readJSON(LAST_POST_KEY, 0));
        if (wait > 0) return `Tunggu ${Math.ceil(wait / 1000)} detik sebelum mengirim pesan lagi.`;

        try {
            // Kuota harian dan pesan ditulis dalam satu batch: Rules membaca
            // nilai counter SETELAH increment (getAfter), jadi bot yang
            // menulis langsung ke Firestore tanpa batch akan ditolak.
            const quotaRef = doc(db, 'guestbookQuota', 'current');
            const snap = await getDoc(quotaRef);
            const w = snap.exists() ? snap.data().windowStart?.toMillis?.() : 0;
            const expired = !snap.exists() || Date.now() - w >= QUOTA_WINDOW_MS;
            if (!expired && snap.data().count >= MAX_PER_WINDOW) {
                return `Kuota ${MAX_PER_WINDOW} pesan per 24 jam sudah habis. Coba lagi besok.`;
            }

            const batch = writeBatch(db);
            if (expired) {
                batch.set(quotaRef, { count: 1, windowStart: serverTimestamp() });
            } else {
                batch.update(quotaRef, { count: increment(1) });
            }
            batch.set(doc(collection(db, 'guestbook')), {
                name, message, avatar,
                createdAt: serverTimestamp(),
                reactions: emptyReactions(),
            });
            await batch.commit();

            writeJSON(LAST_POST_KEY, Date.now());
            return null;
        } catch (err) {
            console.error('Guestbook:', err);
            if (err.code === 'permission-denied') {
                return 'Kuota pesan harian sudah habis. Coba lagi nanti.';
            }
            return 'Gagal mengirim pesan. Coba lagi nanti.';
        }
    }, []);

    // Satu reaksi per jenis per pesan per browser (pagar tipis, bukan pengaman utama)
    const react = useCallback(async (id, type) => {
        if (!db || !REACTION_KEYS.includes(type)) return;
        const key = `${id}:${type}`;
        const done = readJSON(REACTED_KEY, []);
        if (done.includes(key)) return;
        writeJSON(REACTED_KEY, [...done, key]);
        try {
            await updateDoc(doc(db, 'guestbook', id), { [`reactions.${type}`]: increment(1) });
        } catch (err) {
            console.error('Guestbook:', err);
            writeJSON(REACTED_KEY, done);
        }
    }, []);

    return { messages, status, addMessage, react };
}
