import { useState, useEffect, useCallback } from 'react';
import {
    collection, query, orderBy, limit, onSnapshot,
    addDoc, doc, updateDoc, increment, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
    LIMITS, COOLDOWN_MS, REACTION_KEYS, emptyReactions,
} from '../data/guestbook';

export { LIMITS };

const LAST_POST_KEY = 'gb_last_post';
const REACTED_KEY = 'gb_reacted';

const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const writeJSON = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage diblokir: abaikan */ }
};

// status: 'loading' | 'ready' | 'error' | 'offline' (env Firebase belum diisi)
// messages: terbaru di depan. addMessage() async -> string error atau null.
export default function useGuestbook() {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState(db ? 'loading' : 'offline');

    useEffect(() => {
        if (!db) return undefined;
        const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(50));
        return onSnapshot(
            q,
            (snap) => {
                setMessages(snap.docs.map((d) => {
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
                }));
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
            await addDoc(collection(db, 'guestbook'), {
                name, message, avatar,
                createdAt: serverTimestamp(),
                reactions: emptyReactions(),
            });
            writeJSON(LAST_POST_KEY, Date.now());
            return null;
        } catch (err) {
            console.error('Guestbook:', err);
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
