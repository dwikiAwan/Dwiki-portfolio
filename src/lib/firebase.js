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

let cachedDb = null;

export { isFirebaseConfigured };
export const firebaseConfig = firebaseEnv;

export const db = isFirebaseConfigured
    ? (cachedDb ?? getFirestore(initializeApp(firebaseEnv)))
    : null;
