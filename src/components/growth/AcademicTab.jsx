import { motion } from 'framer-motion';

export default function AcademicTab({ portfolioData }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Kartu Skripsi */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="relative rounded-[2.5rem] p-[2px] bg-[linear-gradient(to_bottom_right,#EA4335,#FBBC05,#34A853,#4285F4)] shadow-lg flex flex-col"
                >
                    <div className="bg-white dark:bg-[#1E1E20] rounded-[calc(2.5rem-2px)] p-8 md:p-10 flex flex-col justify-between h-full transition-colors duration-300">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-[#EA4335] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-3.5 py-1.5 rounded-full">
                                    S1 Thesis / Tugas Akhir
                                </span>
                                <span className="text-xs font-semibold text-[#34A853] bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 px-3 py-1 rounded-md">
                                    {portfolioData.thesis.status}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-[#202124] dark:text-white mt-2 mb-3 leading-snug">
                                {portfolioData.thesis.title}
                            </h3>
                            <p className="text-[#5F6368] dark:text-[#9AA0A6] text-sm leading-relaxed mb-6">
                                {portfolioData.thesis.description}
                            </p>
                        </div>

                        <div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {portfolioData.thesis.tech.map((t, idx) => (
                                    <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-lg font-medium border border-gray-200 dark:border-gray-700">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <a 
                                href="https://library.unida.gontor.ac.id/ethesis/3804" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-[#1A73E8] hover:bg-blue-600 text-white font-medium rounded-2xl transition-colors shadow-sm text-sm"
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
                    <div className="bg-white dark:bg-[#1E1E20] rounded-[calc(2.5rem-2px)] p-8 md:p-10 flex flex-col justify-between h-full transition-colors duration-300">
                        <div>
                            <span className="text-xs font-bold text-[#FBBC05] bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-900 px-3.5 py-1.5 rounded-full inline-block mb-4">
                                Skills & Certifications
                            </span>
                            
                            <h3 className="text-2xl font-bold text-[#202124] dark:text-white mb-6">
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
                                        className="block border-l-4 border-[#4285F4] pl-4 py-2 bg-gray-50/50 dark:bg-gray-800/40 rounded-r-xl hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-[#202124] dark:text-white text-sm group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                                                {cert.title}
                                            </h4>
                                            <span className="text-xs text-gray-400 group-hover:translate-x-1 transition-transform">↗</span>
                                        </div>
                                        <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-0.5">
                                            {cert.issuer} • {cert.year}
                                        </p>
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-xs font-semibold text-[#5F6368] dark:text-[#9AA0A6] mb-2.5 flex items-center gap-1.5">
                                <span className="animate-pulse">🚀</span> Sedang Dipelajari (Currently Learning):
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {portfolioData.currentlyLearning.map((item, idx) => (
                                    <span key={idx} className="text-xs bg-[#E8F0FE] dark:bg-[#174EA6]/20 text-[#1A73E8] dark:text-[#8AB4F8] border border-[#D2E3FC] dark:border-[#174EA6]/50 px-3 py-1 rounded-lg font-medium">
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