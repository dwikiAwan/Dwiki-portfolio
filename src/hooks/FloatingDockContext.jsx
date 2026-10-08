import { createContext } from 'react';

/**
 * Konteks bersama untuk widget yang menempel di layar.
 *
 * Terminal dan live chat sama-sama duduk di sisi bawah. Ketika keduanya
 * terbuka, widget yang dibuka terakhir akan di atas (z-index lebih tinggi).
 * Widget tetap di atas footer, tidak menghilang saat footer masuk layar.
 */
export const FloatingDockContext = createContext(null);