import { useEffect, useMemo, useState } from 'react';
import { FloatingDockContext } from '../hooks/useFloatingDock';

/** Menyatukan status widget melayang: terminal, live chat, dan footer. */
export function FloatingDockProvider({ children }) {
    const [terminalOpen, setTerminalOpen] = useState(false);
    const [footerInView, setFooterInView] = useState(false);

    useEffect(() => {
        const footer = document.querySelector('footer');
        if (!footer) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => setFooterInView(entry.isIntersecting),
            // Sisakan sedikit jarak agar widget hilang sebelum footer sampai.
            { rootMargin: '0px 0px -32px 0px' }
        );
        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    const value = useMemo(
        () => ({ terminalOpen, setTerminalOpen, footerInView }),
        [terminalOpen, footerInView]
    );

    return <FloatingDockContext.Provider value={value}>{children}</FloatingDockContext.Provider>;
}
