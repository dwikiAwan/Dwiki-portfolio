import { useState, useEffect, useCallback } from 'react';

const KEY = 'portfolio_guestbook';
export const LIMITS = { name: 30, message: 250 };

const SEED = [{
    id: 1,
    name: 'Contoh Pengunjung',
    message: 'Ini pesan contoh. Pesan tersimpan lokal di browser kamu saja.',
    time: 'Contoh',
    avatar: 'rocket',
    reactions: { fire: 0, like: 0, lightning: 0 },
}];

const load = () => {
    try {
        const saved = localStorage.getItem(KEY);
        return saved ? JSON.parse(saved) : SEED;
    } catch {
        return SEED;
    }
};

// Urutan penyimpanan: terbaru di depan. React sudah meng-escape teks,
// jadi cukup trim + batas panjang (tidak perlu mengubah karakter).
export default function useGuestbook() {
    const [messages, setMessages] = useState(load);

    useEffect(() => {
        try {
            localStorage.setItem(KEY, JSON.stringify(messages));
        } catch {
            /* storage penuh atau diblokir: abaikan */
        }
    }, [messages]);

    // Mengembalikan string error, atau null jika berhasil
    const addMessage = useCallback((rawName, rawText, avatar = 'code') => {
        const name = rawName.trim();
        const message = rawText.trim();
        if (!name || !message) return 'Nama dan pesan tidak boleh kosong.';
        if (name.length > LIMITS.name || message.length > LIMITS.message) {
            return `Nama maksimal ${LIMITS.name} karakter dan pesan maksimal ${LIMITS.message} karakter.`;
        }
        setMessages((prev) => [{
            id: Date.now(),
            name,
            message,
            time: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            avatar,
            reactions: { fire: 0, like: 0, lightning: 0 },
        }, ...prev]);
        return null;
    }, []);

    const react = useCallback((id, type) => {
        setMessages((prev) => prev.map((m) => (
            m.id === id ? { ...m, reactions: { ...m.reactions, [type]: (m.reactions?.[type] || 0) + 1 } } : m
        )));
    }, []);

    return { messages, addMessage, react };
}
