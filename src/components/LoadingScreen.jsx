import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MagicRings from './reactbits/MagicRings';

const codeSnippets = [
    "Initializing Dwiki_Portfolio_v2026...",
    "Loading About Me, Skills & Experience...",
    "Compiling Projects & Testimonials...",
    "Mounting Google-style UI components...",
    "Portfolio ready. Welcome!"
];

export default function LoadingScreen({ onFinish }) {
    const [step, setStep] = useState('select-theme');
    const [selectedTheme, setSelectedTheme] = useState('light');
    const [currentLine, setCurrentLine] = useState(0);
    const [isSplitting, setIsSplitting] = useState(false);

    const handleConfirmTheme = (theme) => {
        setSelectedTheme(theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        setStep('ready-command');
    };

    const handleRunCommand = () => {
        setStep('running-terminal');
    };

    useEffect(() => {
        if (step !== 'running-terminal') return;

        const timer = setInterval(() => {
            setCurrentLine((prev) => {
                if (prev < codeSnippets.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsSplitting(true);
                        setTimeout(onFinish, 800);
                    }, 1000);
                    return prev;
                }
            });
        }, 600);

        return () => clearInterval(timer);
    }, [step, onFinish]);

    const glowPulseAnimation = {
        boxShadow: selectedTheme === 'dark' ? [
            "0 0 100px rgba(52, 168, 83, 0.4), 0 0 200px rgba(52, 168, 83, 0.2)",
            "0 0 200px rgba(52, 168, 83, 0.7), 0 0 400px rgba(52, 168, 83, 0.35)",
            "0 0 100px rgba(52, 168, 83, 0.4), 0 0 200px rgba(52, 168, 83, 0.2)"
        ] : [
            "0 0 100px rgba(66, 133, 244, 0.4), 0 0 200px rgba(66, 133, 244, 0.2)",
            "0 0 200px rgba(66, 133, 244, 0.7), 0 0 400px rgba(66, 133, 244, 0.35)",
            "0 0 100px rgba(66, 133, 244, 0.4), 0 0 200px rgba(66, 133, 244, 0.2)"
        ]
    };

    const pulseTransition = {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-auto flex items-center justify-center font-mono">

            {/* Background MagicRings */}
            <div className="absolute inset-0 z-10 opacity-60 pointer-events-none flex items-center justify-center scale-125 md:scale-150">
                <MagicRings
                    color={selectedTheme === 'dark' ? '#34A853' : '#508ae7'}
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
                className="absolute top-0 left-0 w-1/2 h-full bg-[#F8F9FA]/90 dark:bg-[#121212]/90 backdrop-blur-xs z-20 transition-colors duration-500"
            />

            {/* Panel Kanan Tirai */}
            <motion.div
                initial={{ x: 0 }}
                animate={isSplitting ? { x: "100%" } : { x: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="absolute top-0 right-0 w-1/2 h-full bg-[#F8F9FA]/90 dark:bg-[#121212]/90 backdrop-blur-xs z-20 transition-colors duration-500"
            />

            {/* Konten Utama */}
            <motion.div
                animate={isSplitting ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-30 flex flex-col items-center justify-center text-[#202124] dark:text-white px-4 select-none w-full max-w-md"
            >
                <motion.div
                    animate={step === 'running-terminal' ? glowPulseAnimation : {}}
                    transition={pulseTransition}
                    className="w-full rounded-[2.2rem]"
                >
                    
                    {/* TAHAP 1: PILIH VIBE */}
                    {step === 'select-theme' && (
                        <div className="bg-white dark:bg-[#1A1A1C] border-2 border-gray-300 dark:border-gray-600 p-8 rounded-[2rem] shadow-2xl w-full text-center transition-colors">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-xl shadow-inner">
                                🎨
                            </div>
                            <h3 className="text-2xl font-black mb-2 text-[#202124] dark:text-white">Pilih Vibe Portofolio</h3>
                            <p className="text-xs font-sans font-medium text-gray-600 dark:text-gray-300 mb-6">
                                Tentukan mode tampilan awal sebelum sistem dikompilasi sepenuhnya.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    onClick={() => setSelectedTheme('light')}
                                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all shadow-sm ${
                                        selectedTheme === 'light' 
                                            ? 'border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8] scale-105' 
                                            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    ☀ Light Mode
                                </button>
                                <button
                                    onClick={() => setSelectedTheme('dark')}
                                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all shadow-sm ${
                                        selectedTheme === 'dark' 
                                            ? 'border-[#34A853] bg-[#E6F4EA] dark:bg-emerald-950/80 text-[#137333] dark:text-[#81C995] scale-105' 
                                            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    🌙 Dark Mode
                                </button>
                            </div>

                            <button
                                onClick={() => handleConfirmTheme(selectedTheme)}
                                className="w-full py-4 bg-[#1A73E8] hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-lg transition-all text-sm tracking-wide"
                            >
                                Yes, Lanjutkan &rarr;
                            </button>
                        </div>
                    )}

                    {/* TAHAP 2: SUDO APT DWEKFOLIO */}
                    {step === 'ready-command' && (
                        <div className="bg-white/95 dark:bg-[#1A1A1C]/95 backdrop-blur-md border-2 border-gray-300 dark:border-gray-600 p-8 rounded-[2rem] shadow-2xl w-full transition-colors">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-bold">system-setup ~ bash</span>
                            </div>

                            <p className="text-xs font-sans text-gray-600 dark:text-gray-300 mb-3 font-medium">
                                Jalankan perintah sistem ini untuk menginstal modul portfolio:
                            </p>

                            <div className="bg-gray-100 dark:bg-black/80 p-4 rounded-xl border border-gray-300 dark:border-gray-700 font-mono text-sm mb-6 flex items-center justify-between shadow-inner">
                                <span className="text-[#34A853] font-extrabold">wick apt install d'wick.port</span>
                                <span className="animate-pulse text-xs bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">ready</span>
                            </div>

                            <button
                                onClick={handleRunCommand}
                                className="w-full py-4 bg-[#34A853] hover:bg-green-700 text-white font-extrabold rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 tracking-wide"
                            >
                                <span>▶ RUN</span>
                            </button>
                        </div>
                    )}

                    {/* TAHAP 3: TERMINAL INSTALASI BERJALAN */}
                    {step === 'running-terminal' && (
                        <div className="bg-white/95 dark:bg-[#1A1A1C]/95 backdrop-blur-md border-2 border-gray-300 dark:border-gray-600 p-6 rounded-2xl w-full shadow-2xl transition-colors">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-bold">dwiki-portfolio-terminal ~ executing</span>
                            </div>

                            <div className="space-y-2 text-sm min-h-[140px]">
                                <div className="text-gray-500 dark:text-gray-400 text-xs mb-3 font-mono">
                                    $ wick apt install d'wick.port -y
                                </div>

                                {codeSnippets.slice(0, currentLine + 1).map((snippet, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className="text-[#34A853] font-bold">&gt;</span>
                                        <span className={idx === currentLine ? "text-[#34A853] font-bold animate-pulse" : "text-gray-700 dark:text-gray-200 font-medium"}>
                                            {snippet}
                                        </span>
                                    </div>
                                ))}

                                {currentLine === codeSnippets.length - 1 && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-base font-bold text-[#34A853]"
                                    >
                                        <span>Selamat Datang!</span>
                                        <span className="text-2xl animate-bounce">😊</span>
                                    </motion.div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700 font-bold">
                                <span>{currentLine === codeSnippets.length - 1 ? "Status: Ready!" : "Status: Compiling"}</span>
                                <span>{currentLine === codeSnippets.length - 1 ? "🚀" : "⚙️"}</span>
                            </div>
                        </div>
                    )}

                </motion.div>
            </motion.div>
        </div>
    );
}