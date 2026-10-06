import { motion } from 'framer-motion';

const googleDotColors = [
    "bg-[#4285F4] shadow-[0_0_15px_rgba(66,133,244,0.6)]",
    "bg-[#34A853] shadow-[0_0_15px_rgba(52,168,83,0.6)]",
    "bg-[#FBBC05] shadow-[0_0_15px_rgba(251,188,5,0.6)]",
    "bg-[#EA4335] shadow-[0_0_15px_rgba(234,67,53,0.6)]",
];

const badgeColors = [
    "text-[#1A73E8] bg-[#E8F0FE] dark:bg-[#174EA6]/30 border border-[#D2E3FC] dark:border-[#174EA6]/50",
    "text-[#137333] bg-[#E6F4EA] dark:bg-[#0D652D]/30 border border-[#CEEAD6] dark:border-[#0D652D]/50",
    "text-[#B06000] bg-[#FEF7E0] dark:bg-[#E37400]/30 border border-[#FEEDFC] dark:border-[#E37400]/50",
    "text-[#C5221F] bg-[#FCE8E6] dark:bg-[#A50E0E]/30 border border-[#FAD2CF] dark:border-[#A50E0E]/50",
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
                                
                                {/* Bagian Kiri (Untuk urutan Genap di layar besar) */}
                                <div className={`w-full md:w-1/2 px-4 md:px-8 ${isEven ? 'md:text-right md:pr-16' : 'md:order-last md:text-left md:pl-16'}`}>
                                    <motion.div
                                        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        whileHover={{ y: -6, scale: 1.01 }}
                                        className="bg-white/95 dark:bg-[#1E1E20]/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl hover:border-[#1A73E8]/50 dark:hover:border-[#8AB4F8]/50 transition-all duration-300 relative group text-left"
                                    >
                                        {/* Tahun & Badge */}
                                        <div className={`flex items-center gap-2 mb-3 flex-wrap ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                                            <span className={`text-xs font-extrabold px-3.5 py-1 rounded-full ${badgeColor}`}>
                                                {item.period}
                                            </span>
                                            {item.institution && (
                                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                    🏫 {item.institution}
                                                </span>
                                            )}
                                        </div>

                                        {/* Headline / Judul Utama */}
                                        <h3 className="text-xl font-extrabold text-[#202124] dark:text-white tracking-tight mb-2 group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                                            {item.title}
                                        </h3>

                                        {/* Deskripsi Detail */}
                                        <p className="text-[#5F6368] dark:text-[#9AA0A6] text-sm md:text-base leading-relaxed">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Titik Node Tengah (Center Dot) */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#1E1E20] border-4 border-[#1A73E8] items-center justify-center shadow-md z-20">
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