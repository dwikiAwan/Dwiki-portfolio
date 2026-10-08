import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function AcademicTab({ portfolioData }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Kartu Skripsi */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="relative rounded-[2.5rem] p-[2px] bg-[linear-gradient(to_bottom_right,#EA4335,#FBBC05,#34A853,#4285F4)] shadow-lg flex flex-col"
                >
                    <div className="bg-surface dark:bg-[#1E1E20] rounded-[calc(2.5rem-2px)] p-8 md:p-10 flex flex-col justify-between h-full transition-colors duration-300">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-danger-ink bg-danger-wash dark:bg-red-950/40 border border-danger-line dark:border-red-900 px-3.5 py-1.5 rounded-full">
                                    S1 Thesis / Tugas Akhir
                                </span>
                                <span className="text-xs font-semibold text-success-ink bg-success-wash dark:bg-green-950/40 border border-success-line dark:border-green-900 px-3 py-1 rounded-md">
                                    {portfolioData.thesis.status}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-ink dark:text-white mt-2 mb-3 leading-snug">
                                {portfolioData.thesis.title}
                            </h3>
                            <p className="text-ink-2 dark:text-[#9AA0A6] text-sm leading-relaxed mb-6">
                                {portfolioData.thesis.description}
                            </p>
                        </div>

                        <div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {portfolioData.thesis.tech.map((t, idx) => (
                                    <span key={idx} className="bg-surface-2 dark:bg-gray-800 text-ink dark:text-gray-300 text-xs px-3 py-1 rounded-lg font-medium border border-line dark:border-gray-700">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <a 
                                href="https://library.unida.gontor.ac.id/ethesis/3804" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-2xl transition-colors shadow-sm text-sm"
                            >
                                <span>Lihat Dokumen Skripsi Resmi</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Kartu Sertifikasi */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="relative rounded-[2.5rem] p-[2px] bg-[linear-gradient(to_bottom_right,#4285F4,#34A853,#FBBC05,#EA4335)] shadow-lg flex flex-col"
                >
                    <div className="bg-surface dark:bg-[#1E1E20] rounded-[calc(2.5rem-2px)] p-8 md:p-10 flex flex-col justify-between h-full transition-colors duration-300">
                        <div>
                            <span className="text-xs font-bold text-warn-ink bg-warn-wash dark:bg-yellow-950/40 border border-warn-line dark:border-yellow-900 px-3.5 py-1.5 rounded-full inline-block mb-4">
                                Skills & Certifications
                            </span>
                            
                            <h3 className="text-2xl font-bold text-ink dark:text-white mb-6">
                                Lencana & Kredensial
                            </h3>

                            <div className="space-y-4 mb-6">
                                {portfolioData.certifications.map((cert, index) => (
                                    <motion.a 
                                        key={index}
                                        href={cert.url || "https://www.cloudskillsboost.google/"} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        className="block border-l-4 border-[#4285F4] pl-4 py-2 bg-surface-2/50 dark:bg-gray-800/40 rounded-r-xl hover:bg-accent-wash/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-ink dark:text-white text-sm group-hover:text-accent dark:group-hover:text-[#8AB4F8] transition-colors">
                                                {cert.title}
                                            </h4>
                                            <span className="text-xs text-ink-3 group-hover:translate-x-1 transition-transform">↗</span>
                                        </div>
                                        <p className="text-xs text-ink-2 dark:text-[#9AA0A6] mt-0.5">
                                            {cert.issuer} • {cert.year}
                                        </p>
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-line dark:border-gray-800">
                            <p className="text-xs font-semibold text-ink-2 dark:text-[#9AA0A6] mb-2.5 flex items-center gap-1.5">
                                <Rocket className="w-3.5 h-3.5 shrink-0 animate-pulse" aria-hidden="true" />
                                Sedang Dipelajari (Currently Learning):
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {portfolioData.currentlyLearning.map((item, idx) => (
                                    <span key={idx} className="text-xs bg-accent-wash dark:bg-[#174EA6]/20 text-accent dark:text-[#8AB4F8] border border-accent-line dark:border-[#174EA6]/50 px-3 py-1 rounded-lg font-medium">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}