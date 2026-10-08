/**
 * Konstanta domain guestbook — sumber tunggal untuk UI, hook, dan CLI.
 *
 * PENTING: Firestore Rules (src/lib/firestore.rules) adalah salinan manual
 * dari nilai di bawah, karena Rules berjalan di bahasa terpisah dan tidak
 * bisa meng-import modul JS. Kalau nilai di sini berubah, Rules WAJIB ikut
 * diperbarui atau penulisan akan ditolak server.
 */

export const LIMITS = {
    name: 30,
    message: 250,
};

export const COOLDOWN_MS = 30_000;

/** Kunci ini harus identik dengan yang diizinkan Rules. */
export const REACTION_META = [
    { key: 'fire', label: '[fire]', name: 'Fire' },
    { key: 'like', label: '[like]', name: 'Like' },
    { key: 'lightning', label: '[zap]', name: 'Lightning' },
];

export const REACTION_KEYS = REACTION_META.map((r) => r.key);

export const emptyReactions = (overrides = {}) => ({
    ...Object.fromEntries(REACTION_KEYS.map((k) => [k, 0])),
    ...overrides,
});

export const GUESTBOOK_STATUS = {
    loading: 'Mengambil data',
    ready: 'Real-time aktif',
    error: 'Gagal terhubung ke Firestore',
    offline: 'Offline - .env.local belum diisi',
};
