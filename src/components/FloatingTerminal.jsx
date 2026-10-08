import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, X } from 'lucide-react';
import BaseTerminal from './BaseTerminal';

export default function FloatingTerminal() {
    const [isOpen, setIsOpen] = useState(false);

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
                className="w-80 sm:w-88 bg-[#18181b] dark:bg-[#121212] text-emerald-400 rounded-[20px] overflow-hidden flex flex-col h-[420px] font-mono shadow-2xl"
            >
                <div className="bg-[#202023] px-4 py-3 flex items-center justify-between border-b border-gray-800 text-white">
                    <div className="flex items-center gap-2 select-none">
                        <Terminal className="w-4 h-4 text-[#34A853]" />
                        <span className="text-xs font-bold text-gray-200">wick-shell ~ cli</span>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Close Terminal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden">
                    <BaseTerminal onClose={() => setIsOpen(false)} />
                </div>
            </motion.div>
        </div>
    );
}