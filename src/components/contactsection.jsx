import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { portfolioData } from '../data/portfoliodata';

export default function ContactSection() {
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(portfolioData.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <section id="contact" className="py-24 px-6 max-w-5xl mx-auto scroll-mt-28 transition-colors duration-300">
            {/* Pembungkus Utama dengan Border Gradient Google Style */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-[2.5rem] p-[3px] bg-[linear-gradient(to_bottom_right,#EA4335,#FBBC05,#34A853,#4285F4)] shadow-2xl"
            >
                <div className="bg-white dark:bg-[#1E1E20] rounded-[calc(2.5rem-3px)] p-8 md:p-12 relative overflow-hidden transition-colors duration-300">
                    
                    {/* 1. STATUS BAR & QUICK STATS */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Open for Remote & Full-time Work 🚀
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            📍 Ponorogo, East Java • UTC+7
                        </div>
                    </div>

                    {/* HERO TEXT */}
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight mb-3">
                            Let's Build Something Epic Together. 🤝
                        </h2>
                        <p className="text-[#5F6368] dark:text-[#9AA0A6] text-sm md:text-base leading-relaxed">
                            Punya ide aplikasi, butuh kolaborasi backend/frontend, atau ingin ngobrol seputar arsitektur web? Mari wujudkan lewat ekosistem yang solid.
                        </p>
                    </div>

                    {/* 2. MINI FAQ / COLLABORATION SNAPSHOT (3 Kartu Info Cepat) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 text-center">
                            <div className="text-lg mb-1">⚡</div>
                            <h3 className="font-bold text-sm text-[#202124] dark:text-white mb-1">Fast Response</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Respon kilat via Email atau call ae.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 text-center">
                            <div className="text-lg mb-1">🛠️</div>
                            <h3 className="font-bold text-sm text-[#202124] dark:text-white mb-1">Tech Stack Ready</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">React, Tailwind, Node.js, Python, hingga Cloud & Jaringan.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 text-center">
                            <div className="text-lg mb-1">🎯</div>
                            <h3 className="font-bold text-sm text-[#202124] dark:text-white mb-1">Project Focus</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Web App modern, Dashboard Analitik, Sistem Interaktif, Network Design.</p>
                        </div>
                    </div>

                    {/* 3. DUAL CTA HUB & QUICK ACTIONS */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate('/contact')}
                            className="w-full sm:w-auto bg-[#1A73E8] hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-md transition-all text-sm flex items-center justify-center gap-2 group"
                        >
                            <span>Contact</span>
                            <span className="group-hover:translate-x-1 transition-transform">✨</span>
                        </button>
                        
                        <button
                            onClick={handleCopyEmail}
                            className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#202124] dark:text-white font-semibold px-6 py-3.5 rounded-2xl transition-all text-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2"
                        >
                            {copied ? '🎉 Email Copied!' : '📋 Copy Email'}
                        </button>

                        <button
                            onClick={() => navigate('/terminal')}
                            className="w-full sm:w-auto bg-black text-emerald-400 hover:bg-gray-900 font-mono font-semibold px-6 py-3.5 rounded-2xl transition-all text-xs border border-emerald-500/40 flex items-center justify-center gap-2"
                        >
                            <span>$ open_terminal.sh</span>
                        </button>
                    </div>

                </div>
            </motion.div>
        </section>
    );
}