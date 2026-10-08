/* eslint-disable react-refresh/only-export-components */
import { useContext, useState, useMemo, useCallback } from 'react';
import { FloatingDockContext } from './FloatingDockContext';

/**
 * Terminal dan live chat saling eksklusif: hanya satu boleh terbuka.
 * Membuka live chat menutup terminal, dan sebaliknya.
 */
export function FloatingDockProvider({ children }) {
    const [terminalOpen, setTerminalOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    const openTerminal = useCallback(() => {
        setChatOpen(false);
        setTerminalOpen(true);
    }, []);
    const closeTerminal = useCallback(() => setTerminalOpen(false), []);
    const openChat = useCallback(() => {
        setTerminalOpen(false);
        setChatOpen(true);
    }, []);
    const closeChat = useCallback(() => setChatOpen(false), []);

    const value = useMemo(
        () => ({
            terminalOpen,
            setTerminalOpen: openTerminal,
            closeTerminal,
            chatOpen,
            setChatOpen: openChat,
            closeChat,
        }),
        [terminalOpen, chatOpen, openTerminal, closeTerminal, openChat, closeChat]
    );

    return <FloatingDockContext.Provider value={value}>{children}</FloatingDockContext.Provider>;
}

export function useFloatingDock() {
    const context = useContext(FloatingDockContext);
    if (!context) throw new Error('useFloatingDock harus dipakai di dalam FloatingDockProvider');
    return context;
}
