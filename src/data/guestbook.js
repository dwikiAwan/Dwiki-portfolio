export const LIMITS = {
    name: 30,
    message: 250,
};

export const COOLDOWN_MS = 30_000;

/** Kuota tulis global per jendela 24 jam. Harus identik dengan batas di Rules. */
export const MAX_PER_WINDOW = 50;
export const QUOTA_WINDOW_MS = 24 * 60 * 60 * 1000;

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
