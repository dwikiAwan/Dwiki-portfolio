import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';

const googleDotColors = [
    "bg-[#4285F4] shadow-[0_0_15px_rgba(66,133,244,0.6)]",
    "bg-[#34A853] shadow-[0_0_15px_rgba(52,168,83,0.6)]",
    "bg-[#FBBC05] shadow-[0_0_15px_rgba(251,188,5,0.6)]",
    "bg-[#EA4335] shadow-[0_0_15px_rgba(234,67,53,0.6)]",
];

const badgeColors = [
    "text-accent bg-accent-wash dark:bg-[#174EA6]/30 border border-accent-line dark:border-[#174EA6]/50",
    "text-success-ink bg-success-wash dark:bg-[#0D652D]/30 border border-success-line dark:border-[#0D652D]/50",
    "text-warn-ink bg-warn-wash dark:bg-[#E37400]/30 border border-warn-line dark:border-[#E37400]/50",
    "text-danger-ink bg-danger-wash dark:bg-[#A50E0E]/30 border border-danger-line dark:border-[#A50E0E]/50",
];

export default function JourneyTab({ portfolioData }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-5xl mx-auto py-6">
            <div className="relative">
                {/* Garis Pusat (Timeline Center Line) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-[#4285F4] via-[#34A853] to-[#EA4335] rounded-full opacity-40 hidden md:block"></div>

                <div className="space-y-12">
                    {portfolioData.growth.map((item, index) => {
                        const isEven = index % 2 === 0; // Menentukan posisi kiri atau kanan
                        const dotColor = googleDotColors[index % googleDotColors.length];
                        const badgeColor = badgeColors[index % badgeColors.length];

                        return (
                            <div key={index} className="relative flex flex-col md:flex-row items-center">
                                
                                {/* Bagian Kiri */}
                                <div className={`w-full md:w-1/2 px-4 md:px-8 ${isEven ? 'md:text-right md:pr-16' : 'md:order-last md:text-left md:pl-16'}`}>
                                    <motion.div
                                        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        whileHover={{ y: -6, scale: 1.01 }}
                                        className="bg-surface/95 dark:bg-[#1E1E20]/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-line dark:border-gray-800 shadow-lg hover:shadow-2xl hover:border-accent/50 dark:hover:border-[#8AB4F8]/50 transition-all duration-300 relative group text-left"
                                    >
                                        {/* Tahun & Badge */}
                                        <div className={`flex items-center gap-2 mb-3 flex-wrap ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                                            <span className={`text-xs font-extrabold px-3.5 py-1 rounded-full ${badgeColor}`}>
                                                {item.period}
                                            </span>
                                            {item.institution && (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-surface-2 dark:bg-gray-800 text-ink dark:text-gray-300 border border-line dark:border-gray-700">
                                                    <Landmark className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                                    {item.institution}
                                                </span>
                                            )}
                                        </div>

                                        {/* Headline / Judul Utama */}
                                        {/* Judul */}
                                        <h3 className="text-xl font-extrabold text-ink dark:text-white tracking-tight mb-1 group-hover:text-accent dark:group-hover:text-[#8AB4F8] transition-colors">
                                            {item.title}
                                        </h3>

                                        {/* Subtitle: institusi */}
                                        {item.institution && (
                                            <p className={`flex items-center gap-1.5 mb-3 text-sm font-semibold text-accent dark:text-[#8AB4F8] ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                                                <Landmark className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                                {item.institution}
                                            </p>
                                        )}

                                        {/* Deskripsi */}
                                        <p className="text-ink-2 dark:text-[#9AA0A6] text-sm md:text-base leading-relaxed">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Titik Node Tengah  */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-surface dark:bg-[#1E1E20] border-4 border-accent items-center justify-center shadow-md z-20">
                                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
                                </div>

                                {/* Ruong Kosong Sebelah Kanan untuk Keseimbangan Layout Zig-Zag */}
                                <div className={`hidden md:block w-1/2 ${isEven ? 'md:order-last' : ''}`}></div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}