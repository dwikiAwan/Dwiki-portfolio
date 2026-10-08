/**
 * Satu-satunya pintu masuk untuk nilai environment.
 *
 * Aturan main:
 * 1. Nilai asli hanya boleh hidup di file yang di-ignore git (.env, .env.local).
 * 2. Apa pun yang keluar dari modul ini ke UI/terminal HARUS lewat mask(),
 *    bukan nilai mentah.
 * 3. Jangan pernah console.log nilai aslinya — cukup status ter-mask.
 */

// Kunci yang boleh dibaca aplikasi. Kalau butuh menambah, daftarkan di sini
// supaya tetap bisa diaudit lewat `wick env`.
const SCHEMA = [
    { key: 'VITE_FIREBASE_API_KEY', secret: true, required: true, desc: 'Firebase Web API key' },
    { key: 'VITE_FIREBASE_AUTH_DOMAIN', secret: true, required: true, desc: 'Firebase auth domain' },
    { key: 'VITE_FIREBASE_PROJECT_ID', secret: false, required: true, desc: 'Firebase project ID' },
    { key: 'VITE_FIREBASE_STORAGE_BUCKET', secret: false, required: false, desc: 'Storage bucket' },
    { key: 'VITE_FIREBASE_MESSAGING_SENDER_ID', secret: false, required: false, desc: 'Messaging sender ID' },
    { key: 'VITE_FIREBASE_APP_ID', secret: false, required: false, desc: 'Firebase app ID' },
    { key: 'VITE_FIREBASE_APPCHECK_DEBUG_TOKEN', secret: true, required: false, desc: 'App Check debug token' },
    { key: 'VITE_SITE_URL', secret: false, required: false, desc: 'URL produksi situs' },
    { key: 'VITE_CONTACT_EMAIL', secret: false, required: false, desc: 'Email kontak (fallback)' },
];

const raw = (key) => {
    const v = import.meta.env?.[key];
    return typeof v === 'string' ? v.trim() : v == null ? '' : String(v);
};

// Sensor nilai: sisakan 4 karakter terakhir supaya tetap bisa dikoreksi
// tanpa membuka kredensial penuh di layar.
export const mask = (value, keep = 4) => {
    const v = String(value ?? '');
    if (!v) return '(kosong)';
    if (v.length <= keep) return '*'.repeat(v.length);
    return `${'*'.repeat(Math.min(v.length - keep, 12))}${v.slice(-keep)}`;
};

/** Status tiap kunci env tanpa pernah membocorkan nilainya. */
export const envReport = () =>
    SCHEMA.map(({ key, secret, required, desc }) => {
        const value = raw(key);
        return {
            key,
            desc,
            required,
            secret,
            set: value.length > 0,
            // Untuk non-secret tetap disensor penuh: output terminal bisa
            // direkam layar / di-share, jadi tidak ada nilai yang tampil mentah.
            value: value ? mask(value) : '(kosong)',
        };
    });

export const envMissing = () => envReport().filter((r) => r.required && !r.set).map((r) => r.key);

export const firebaseEnv = {
    apiKey: raw('VITE_FIREBASE_API_KEY'),
    authDomain: raw('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: raw('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: raw('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: raw('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: raw('VITE_FIREBASE_APP_ID'),
};

/** Writable untuk pengujian / runtime override dari terminal. */
export const setEnvOverride = (key, value) => {
    if (!SCHEMA.some((s) => s.key === key)) return false;
    import.meta.env[key] = value;
    return true;
};

export const siteUrl = () => raw('VITE_SITE_URL');
export const contactEmailFallback = () => raw('VITE_CONTACT_EMAIL');

// Tiga nilai inti ini menentukan apakah Firebase bisa hidup.
export const isFirebaseConfigured = Boolean(
    firebaseEnv.apiKey && firebaseEnv.projectId && firebaseEnv.appId
);

/** Diagnostik aman untuk log: hanya bool + id, tanpa nilai kredensial. */
export const firebaseDiagnostics = () => ({
    configured: isFirebaseConfigured,
    projectId: firebaseEnv.projectId || null,
    hasApiKey: Boolean(firebaseEnv.apiKey),
    hasAppId: Boolean(firebaseEnv.appId),
    missing: envMissing(),
});
