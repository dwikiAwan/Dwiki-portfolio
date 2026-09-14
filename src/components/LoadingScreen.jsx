import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MagicRings from './reactbits/MagicRings';

const codeSnippets = [
    "Initializing Dwiki_Portfolio_v2026...",
    "Loading React, Vite & Tailwind CSS...",
    "Compiling Academic & Thesis modules...",
    "Mounting Smile-themed UI components...",
    "System ready. Welcome!"
];

export default function LoadingScreen({ onFinish }) {
    const [currentLine, setCurrentLine] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const [isSplitting, setIsSplitting] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentLine((prev) => {
                if (prev < codeSnippets.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(timer);
                    setIsDone(true);
                    // Jeda setelah emote muncul, lalu mulai tirai terbelah
                    setTimeout(() => {
                        setIsSplitting(true);
                        setTimeout(onFinish, 5000); // Waktu tirai terbuka penuh sebelum unmount
                    }, 5000);
                    return prev;
                }
            });
        }, 2000); // Kecepatan pergantian teks baris

        return () => clearInterval(timer);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-auto flex items-center justify-center">

            {/* 1. Background MagicRings diposisikan penuh di latar belakang agar sangat luas dan jelas */}
            <div className="absolute inset-0 z-10 opacity-60 pointer-events-none flex items-center justify-center scale-125 md:scale-150">
                <MagicRings
                    color="#4285F4"
                    colorTwo="#34A853"
                    ringCount={8}
                    speed={1.2}
                    baseRadius={0.45}
                    radiusStep={0.12}
                />
            </div>

            {/* Panel Kiri Tirai */}
            <motion.div
                initial={{ x: 0 }}
                animate={isSplitting ? { x: "-100%" } : { x: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="absolute top-0 left-0 w-1/2 h-full bg-[#F8F9FA]/90 backdrop-blur-xs border-r border-gray-200/50 z-20"
            />

            {/* Panel Kanan Tirai */}
            <motion.div
                initial={{ x: 0 }}
                animate={isSplitting ? { x: "100%" } : { x: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="absolute top-0 right-0 w-1/2 h-full bg-[#F8F9FA]/90 backdrop-blur-xs border-l border-gray-200/50 z-20"
            />

            {/* Konten Terminal di Tengah */}
            <motion.div
                animate={isSplitting ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-30 flex flex-col items-center justify-center text-[#202124] px-4 font-mono select-none w-full max-w-lg"
            >
                {/* Kotak Terminal Coding */}
                <div className="bg-white/95 backdrop-blur-md border border-gray-200 p-6 rounded-2xl shadow-2xl w-full">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                        <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
                        <span className="text-xs text-gray-500 ml-2">dwiki-portfolio-terminal ~ bash</span>
                    </div>

                    <div className="space-y-2 text-sm min-h-[120px]">
                        {codeSnippets.slice(0, currentLine + 1).map((snippet, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <span className="text-[#34A853] font-bold">&gt;</span>
                                <span className={idx === currentLine ? "text-[#4285F4] font-semibold animate-pulse" : "text-gray-700"}>
                                    {snippet}
                                </span>
                            </div>
                        ))}

                        {/* Emote Senyum saat selesai */}
                        {isDone && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-base font-sans font-bold text-[#4285F4]"
                            >
                                <span>✨ Selamat Datang!</span>
                                <span className="text-2xl animate-bounce">😊</span>
                            </motion.div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-gray-100">
                        <span>{isDone ? "Status: Ready!" : "Status: Compiling"}</span>
                        <span>{isDone ? "🚀" : "⚙️"}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}