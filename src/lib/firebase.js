import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
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

// App Check sengaja tidak dipakai: reCAPTCHA Enterprise (satu-satunya provider
// web yang masih didukung) butuh Blaze. Spam ditahan di src/lib/firestore.rules.

export { isFirebaseConfigured };
export const firebaseConfig = firebaseEnv;

export const db = app ? getFirestore(app) : null;
