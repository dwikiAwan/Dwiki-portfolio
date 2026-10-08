import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, X } from 'lucide-react';
import BaseTerminal from './BaseTerminal';
import { useFloatingDock } from '../hooks/useFloatingDock';

export default function FloatingTerminal() {
    const { pathname } = useLocation();
    const { terminalOpen, setTerminalOpen, footerInView } = useFloatingDock();
    const isOpen = terminalOpen;
    const setIsOpen = setTerminalOpen;

    // Halaman /terminal sudah punya jendela terminal penuh, jadi tombol
    // floating disembunyikan agar tidak ada dua terminal yang bertumpuk.
    // Widget juga menyingkir saat footer masuk layar, bukan menutupinya.
    if (pathname === '/terminal' || footerInView) return null;

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 left-6 z-50 p-[2px] rounded-full animate-border-run bg-[linear-gradient(270deg,#4285F4,#34A853,#FBBC05,#EA4335,#4285F4)] shadow-2xl">
                <motion.button 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-[#121212] text-white px-5 py-3.5 rounded-full transition-transform flex items-center gap-2 cursor-pointer shadow-inner"
                    aria-label="Open Floating Terminal"
                >
                    <Terminal className="w-5 h-5 text-[#34A853]" />
                    <span className="text-xs font-bold pr-1">CLI</span>
                </motion.button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 left-6 z-50 p-[2px] rounded-[22px] animate-border-run bg-[linear-gradient(270deg,#4285F4,#34A853,#FBBC05,#EA4335,#4285F4)] shadow-2xl">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-[calc(100vw-3rem)] sm:w-[22rem] bg-[#18181b] dark:bg-[#121212] text-emerald-400 rounded-[20px] overflow-hidden flex flex-col h-[65vh] sm:h-[26rem] font-mono shadow-2xl"
            >
                <div className="bg-[#202023] px-4 py-3 flex items-center justify-between gap-2 border-b border-gray-800 text-white shrink-0">
                    <div className="flex items-center gap-2 select-none min-w-0">
                        <Terminal className="w-4 h-4 text-[#34A853] shrink-0" />
                        <span className="text-xs font-bold text-gray-200 truncate">wick-shell ~ cli</span>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                        aria-label="Close Terminal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-hidden">
                    <BaseTerminal onClose={() => setIsOpen(false)} />
                </div>
            </motion.div>
        </div>
    );
}