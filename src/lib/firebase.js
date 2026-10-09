import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { firebaseEnv, isFirebaseConfigured, firebaseDiagnostics } from '../config/env';

// Config web Firebase memang public by design; yang melindungi data adalah
// Firestore Rules (src/lib/firestore.rules). Karena itu isinya dibaca lewat
// src/config/env.js dan tidak pernah dicetak mentah ke konsol.
if (import.meta.env.DEV) {
    const d = firebaseDiagnostics();
    console.info(
        `[firebase] configured=${d.configured} project=${d.projectId ?? '-'} ` +
        `apiKey=${d.hasApiKey} appId=${d.hasAppId} missing=${d.missing.length}`
    );
}

const app = isFirebaseConfigured ? initializeApp(firebaseEnv) : null;

// App Check hanya dipasang kalau site key tersedia: itu yang menahan
// bot/spam. Tanpa key, diabaikan diam-diam supaya tidak memblokir situs.
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
if (app && recaptchaSiteKey) {
    initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
    });
} else if (import.meta.env.DEV) {
    console.info('[firebase] App Check nonaktif (VITE_RECAPTCHA_SITE_KEY belum diisi)');
}

export { isFirebaseConfigured };
export const firebaseConfig = firebaseEnv;

export const db = app ? getFirestore(app) : null;
