import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, GraduationCap, Rocket } from 'lucide-react';
import { portfolioData } from '../data/portfoliodata';

// Impor sub-komponen tab yang telah dipecah
import SkillsTab from './growth/SkillsTab';
import AcademicTab from './growth/AcademicTab';
import JourneyTab from './growth/JourneyTab';

export default function Growth() {
    const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'academic', atau 'journey'

    // Data komprehensif Skills Matrix
    const skillCategories = portfolioData.skillCategories;

    return (
        <section id="growth" className="pt-6 pb-24 px-6 max-w-6xl mx-auto scroll-mt-28 transition-colors duration-300">
            {/* Header Utama Section Growth */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
            >
                <span className="text-xs font-bold text-success-ink dark:text-[#81C995] bg-success-wash dark:bg-emerald-950/40 px-4 py-1.5 rounded-full uppercase tracking-wider border border-success-line dark:border-emerald-800">
                    Growth Hub
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-ink dark:text-white mt-4">
                    Growth & Capabilities
                </h2>
                <p className="text-ink-2 dark:text-[#9AA0A6] mt-2 max-w-xl mx-auto text-base">
                    Eksplorasi kompetensi teknis, rekam jejak akademik, serta kurva pembelajaran.
                </p>
            </motion.div>

            {/* Tab Navigasi Utama */}
            <div className="flex justify-center gap-2 md:gap-4 mb-14 flex-wrap">
                <button
                    onClick={() => setActiveTab('skills')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                        activeTab === 'skills'
                            ? 'bg-primary text-white shadow-md scale-105'
                            : 'bg-surface-2 dark:bg-gray-800 text-ink-2 dark:text-gray-300 hover:bg-surface-3 dark:hover:bg-gray-700'
                    }`}
                >
                    <BarChart3 className="w-4 h-4 shrink-0" aria-hidden="true" /> Skills & Analytics
                </button>
                <button
                    onClick={() => setActiveTab('academic')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                        activeTab === 'academic'
                            ? 'bg-success-solid text-white shadow-md scale-105'
                            : 'bg-surface-2 dark:bg-gray-800 text-ink-2 dark:text-gray-300 hover:bg-surface-3 dark:hover:bg-gray-700'
                    }`}
                >
                    <GraduationCap className="w-4 h-4 shrink-0" aria-hidden="true" /> Academic Background
                </button>
                <button
                    onClick={() => setActiveTab('journey')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                        activeTab === 'journey'
                            ? 'bg-[#FBBC05] text-black shadow-md scale-105'
                            : 'bg-surface-2 dark:bg-gray-800 text-ink-2 dark:text-gray-300 hover:bg-surface-3 dark:hover:bg-gray-700'
                    }`}
                >
                    <Rocket className="w-4 h-4 shrink-0" aria-hidden="true" /> Growth Journey
                </button>
            </div>

            {/* Area Konten Berdasarkan Tab yang Dipanggil dari File Terpisah */}
            <div className="transition-all duration-300">
                {activeTab === 'skills' && <SkillsTab skillCategories={skillCategories} />}
                {activeTab === 'academic' && <AcademicTab portfolioData={portfolioData} />}
                {activeTab === 'journey' && <JourneyTab portfolioData={portfolioData} />}
            </div>
        </section>
    );
}