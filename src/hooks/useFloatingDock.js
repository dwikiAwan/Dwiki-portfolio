import { createContext, useContext } from 'react';

/**
 * Konteks bersama untuk widget yang menempel di layar.
 *
 * Terminal dan live chat sama-sama duduk di sisi bawah, jadi mereka perlu tahu
 * apakah satu sedang terbuka supaya tidak saling menimpa. Konteks ini juga
 * membawa deteksi footer: widget disembunyikan saat footer masuk layar, bukan
 * menutupi isinya.
 */
export const FloatingDockContext = createContext(null);

export function useFloatingDock() {
    const context = useContext(FloatingDockContext);
    if (!context) throw new Error('useFloatingDock harus dipakai di dalam FloatingDockProvider');
    return context;
}
