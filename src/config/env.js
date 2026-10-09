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
    { key: 'VITE_FIREBASE_APPCHECK_DEBUG_TOKEN', secret: true, required: false, desc: 'App Check debug token (DEV ONLY, jangan pernah di Vercel)' },
    { key: 'VITE_RECAPTCHA_SITE_KEY', secret: true, required: false, desc: 'reCAPTCHA v3 site key untuk App Check' },
    { key: 'VITE_SITE_URL', secret: false, required: false, desc: 'URL produksi situs' },
    { key: 'VITE_CONTACT_EMAIL', secret: false, required: false, desc: 'Email kontak (fallback)' },
];

// WAJIB ditulis eksplisit satu per satu. Akses `import.meta.env[key]`
// (dinamis) membuat Vite menyuntikkan SELURUH objek env ke bundle, termasuk
// VITE_FIREBASE_APPCHECK_DEBUG_TOKEN yang seharusnya tidak pernah masuk browser.
// Daftar eksplisit = hanya kunci di sini yang bisa bocor ke bundle.
const STATIC_ENV = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_APPCHECK_DEBUG_TOKEN: import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN,
    VITE_RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
    VITE_CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL,
};

const raw = (key) => {
    const v = STATIC_ENV[key];
    return typeof v === 'string' ? v.trim() : v == null ? '' : String(v);
};

// Hanya http/https yang diizinkan. Menolak javascript:, data:, dan vbscript:
// mencegah URL dari env atau data eksternal jadi vektor XSS saat dipakai di
// href/src. Input tidak valid -> string kosong, bukan url aslinya.
export const safeUrl = (value) => {
    try {
        const { protocol } = new URL(String(value ?? '').trim());
        return protocol === 'http:' || protocol === 'https:' ? String(value).trim() : '';
    } catch {
        return '';
    }
};

// Sensor nilai untuk kunci non-secret: sisakan 4 karakter terakhir supaya
// tetap bisa dikoreksi tanpa membuka nilai penuh di layar.
// Kunci secret:true tidak boleh menampilkan karakter apa pun — panjang
// nilai saja sudah membantu penyerang, jadi cukup Status isi/kosong.
export const mask = (value, secret = false) => {
    if (secret) return String(value ?? '') ? 'TERISI' : '(kosong)';
    const v = String(value ?? '');
    if (!v) return '(kosong)';
    if (v.length <= 4) return '*'.repeat(v.length);
    return `${'*'.repeat(Math.min(v.length - 4, 12))}${v.slice(-4)}`;
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
            // Kunci secret ditampilkan sebagai TERISI/kosong saja; kunci
            // non-secret tetap disensor supaya output terminal aman di-share.
            value: mask(value, secret),
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

/** URL situs: hanya http/https yang boleh, sisanya ditolak. */
export const siteUrl = () => safeUrl(raw('VITE_SITE_URL'));
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
