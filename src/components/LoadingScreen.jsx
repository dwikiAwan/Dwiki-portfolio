import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Cog, Moon, Palette, Rocket, Sun } from 'lucide-react';
// three.js (~600 KB) hanya dimuat saat loading screen tampil
const MagicRingsLazy = lazy(() => import('./reactbits/MagicRings'));

// MagicRings selalu dirender (mobile + desktop, tanpa pengecualian
// reduced-motion), jadi tidak perlu lagi cabang gradien statis.
function MagicRings(props) {
    return <Suspense fallback={null}><MagicRingsLazy {...props} /></Suspense>;
}

const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
};

const codeSnippets = [
    "Initializing Dwiki_Portfolio_v2026...",
    "Loading About Me, Skills & Experience...",
    "Compiling Projects & Testimonials...",
    "Mounting Google-style UI components...",
    "Portfolio ready. Welcome!"
];

export default function LoadingScreen({ onFinish }) {
    // Pilihan vibe selalu ditampilkan, apa pun tema yang tersimpan sebelumnya
    const [step, setStep] = useState('select-theme');
    const [selectedTheme, setSelectedTheme] = useState(getInitialTheme);
    const [currentLine, setCurrentLine] = useState(0);
    const [isSplitting, setIsSplitting] = useState(false);

    // Terapkan tema tersimpan lebih dulu supaya splash tidak berkedip saat mount
    useEffect(() => {
        applyTheme(getInitialTheme());
    }, []);

    const handleSelectTheme = (theme) => {
        setSelectedTheme(theme);
        applyTheme(theme);
    };

    const handleConfirmTheme = (theme) => {
        setSelectedTheme(theme);
        applyTheme(theme);
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
                className="absolute top-0 left-0 w-1/2 h-full bg-page/90 dark:bg-[#121212]/90 backdrop-blur-xs z-20 transition-colors duration-500"
            />

            {/* Panel Kanan Tirai */}
            <motion.div
                initial={{ x: 0 }}
                animate={isSplitting ? { x: "100%" } : { x: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="absolute top-0 right-0 w-1/2 h-full bg-page/90 dark:bg-[#121212]/90 backdrop-blur-xs z-20 transition-colors duration-500"
            />

            {/* Konten Utama */}
            <motion.div
                animate={isSplitting ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-30 flex flex-col items-center justify-center text-ink dark:text-white px-4 select-none w-full max-w-md"
            >
                <motion.div
                    animate={step === 'running-terminal' ? glowPulseAnimation : {}}
                    transition={pulseTransition}
                    className="w-full rounded-[2.2rem]"
                >
                    
                    {/* TAHAP 1: PILIH VIBE */}
                    {step === 'select-theme' && (
                        <div className="bg-surface dark:bg-[#1A1A1C] border-2 border-line-strong dark:border-gray-600 p-8 rounded-[2rem] shadow-2xl w-full text-center transition-colors">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-wash dark:bg-blue-900/60 flex items-center justify-center shadow-inner">
                                <Palette className="w-6 h-6" aria-hidden="true" />
                            </div>
                            <h3 className="text-2xl font-black mb-2 text-ink dark:text-white">Pilih Vibe Portofolio</h3>
                            <p className="text-xs font-sans font-medium text-ink-2 dark:text-gray-300 mb-6">
                                Tentukan mode tampilan awal sebelum sistem dikompilasi sepenuhnya.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    onClick={() => handleSelectTheme('light')}
                                    aria-pressed={selectedTheme === 'light'}
                                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                                        selectedTheme === 'light' 
                                            ? 'border-accent bg-accent-wash text-accent scale-105' 
                                            : 'border-line-strong dark:border-gray-700 bg-surface-2 dark:bg-gray-800 text-ink dark:text-gray-300 hover:bg-surface-3 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Sun className="w-4 h-4" aria-hidden="true" />
                                    Light Mode
                                </button>
                                <button
                                    onClick={() => handleSelectTheme('dark')}
                                    aria-pressed={selectedTheme === 'dark'}
                                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                                        selectedTheme === 'dark' 
                                            ? 'border-[#34A853] bg-success-wash dark:bg-emerald-950/80 text-success-ink dark:text-[#81C995] scale-105' 
                                            : 'border-line-strong dark:border-gray-700 bg-surface-2 dark:bg-gray-800 text-ink dark:text-gray-300 hover:bg-surface-3 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Moon className="w-4 h-4" aria-hidden="true" />
                                    Dark Mode
                                </button>
                            </div>

                            <p className="text-[11px] font-sans text-ink-3 dark:text-gray-400 mb-4">
                                Preview langsung aktif. Bisa diubah kapan saja lewat tombol di navbar.
                            </p>

                            <button
                                onClick={() => handleConfirmTheme(selectedTheme)}
                                className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-2xl shadow-lg transition-all text-sm tracking-wide"
                            >
                                Yes, Lanjutkan &rarr;
                            </button>
                        </div>
                    )}

                    {/* TAHAP 2: SUDO APT DWEKFOLIO */}
                    {step === 'ready-command' && (
                        <div className="bg-surface/95 dark:bg-[#1A1A1C]/95 backdrop-blur-md border-2 border-line-strong dark:border-gray-600 p-8 rounded-[2rem] shadow-2xl w-full transition-colors">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line dark:border-gray-700">
                                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                <span className="text-xs text-ink-3 dark:text-gray-400 ml-2 font-bold">system-setup ~ bash</span>
                            </div>

                            <p className="text-xs font-sans text-ink-2 dark:text-gray-300 mb-3 font-medium">
                                Jalankan perintah sistem ini untuk menginstal modul portfolio:
                            </p>

                            <div className="bg-surface-2 dark:bg-black/80 p-4 rounded-xl border border-line-strong dark:border-gray-700 font-mono text-sm mb-6 flex items-center justify-between shadow-inner">
                                <span className="text-success-ink font-extrabold">wick apt install d'wick.port</span>
                                <span className="animate-pulse text-xs bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">ready</span>
                            </div>

                            <button
                                onClick={handleRunCommand}
                                className="w-full py-4 bg-success-solid hover:bg-[#12672e] text-white font-extrabold rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 tracking-wide"
                            >
                                <span>▶ RUN</span>
                            </button>
                        </div>
                    )}

                    {/* TAHAP 3: TERMINAL INSTALASI BERJALAN */}
                    {step === 'running-terminal' && (
                        <div className="bg-surface/95 dark:bg-[#1A1A1C]/95 backdrop-blur-md border-2 border-line-strong dark:border-gray-600 p-6 rounded-2xl w-full shadow-2xl transition-colors">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line dark:border-gray-700">
                                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                <span className="text-xs text-ink-3 dark:text-gray-400 ml-2 font-bold">dwiki-portfolio-terminal ~ executing</span>
                            </div>

                            <div className="space-y-2 text-sm min-h-[140px]">
                                <div className="text-ink-3 dark:text-gray-400 text-xs mb-3 font-mono">
                                    $ wick apt install d'wick.port -y
                                </div>

                                {codeSnippets.slice(0, currentLine + 1).map((snippet, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className="text-success-ink font-bold">&gt;</span>
                                        <span className={idx === currentLine ? "text-success-ink font-bold animate-pulse" : "text-ink dark:text-gray-200 font-medium"}>
                                            {snippet}
                                        </span>
                                    </div>
                                ))}

                                {currentLine === codeSnippets.length - 1 && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="mt-4 pt-3 border-t border-line dark:border-gray-700 flex items-center justify-center gap-2 text-base font-bold text-success-ink"
                                    >
                                        <span>Selamat Datang!</span>
                                        <Rocket className="w-6 h-6 animate-bounce" aria-hidden="true" />
                                    </motion.div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-between items-center text-xs text-ink-3 dark:text-gray-400 pt-3 border-t border-line dark:border-gray-700 font-bold">
                                <span>{currentLine === codeSnippets.length - 1 ? "Status: Ready!" : "Status: Compiling"}</span>
                                {currentLine === codeSnippets.length - 1
                                    ? <Rocket className="w-4 h-4" aria-hidden="true" />
                                    : <Cog className="w-4 h-4 animate-spin" aria-hidden="true" />}
                            </div>
                        </div>
                    )}

                </motion.div>
            </motion.div>
        </div>
    );
}