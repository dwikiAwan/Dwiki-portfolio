import { motion } from 'framer-motion';
import CursorGrid from './reactbits/CursorGrid';

export default function Hero() {
    return (
        <div className="relative flex flex-col justify-center min-h-[85vh] pt-20 pb-16 px-6 overflow-hidden transition-colors duration-300">
            {/* Background Halus */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <CursorGrid color="#4285F4" maxOpacity={0.25} radius={120} gridOpacity={0.03} />
            </div>

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-5xl mx-auto text-center"
            >
                {/* Material-style Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F0FE] dark:bg-[#174EA6]/20 text-[#1967D2] dark:text-[#8AB4F8] text-sm font-medium mb-8 border border-[#D2E3FC] dark:border-[#174EA6]/50 transition-colors duration-300">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4285F4] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4285F4]"></span>
                    </span>
                    Fresh graduate • Informatics Engineering
                </div>

                {/* Headline dengan Efek Ayunan Tertiuap Angin & Bisa Ditarik */}
                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold text-[#202124] dark:text-white tracking-tighter leading-[1.05] mb-6 select-none transition-colors duration-300">
                    <motion.span 
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.4}
                        animate={{ rotate: [-3, 3, -3] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block cursor-grab active:cursor-grabbing origin-top"
                    >
                        Pray.
                    </motion.span>{' '}
                    <motion.span 
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.4}
                        animate={{ rotate: [2, -2, 2] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block cursor-grab active:cursor-grabbing origin-top"
                    >
                        Code.
                    </motion.span>{' '}
                    <motion.span 
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.4}
                        animate={{ rotate: [-2, 4, -2] }}
                        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block cursor-grab active:cursor-grabbing origin-top"
                    >
                        Sleep.
                    </motion.span>
                    <br className="hidden md:block" />
                    &amp; <motion.span 
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.5}
                        animate={{ rotate: [3, -3, 3] }}
                        transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.2 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block text-[#4285F4] cursor-grab active:cursor-grabbing origin-top"
                    >
                        coffee.
                    </motion.span>
                </h1>

                {/* Sub-headline */}
                <p className="text-lg md:text-xl text-[#5F6368] dark:text-[#9AA0A6] max-w-2xl mx-auto mb-10 leading-relaxed font-normal transition-colors duration-300">
                    Eksplorasi teknologi tanpa batas, merakit solusi digital fungsional dengan performa paling terbaik.
                </p>

                {/* Tombol Navigasi */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a 
                        href="#projects" 
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#1A73E8] hover:bg-[#1558D6] text-white font-medium rounded-full transition-colors shadow-sm"
                    >
                        Lihat Proyek
                    </a>
                    <a 
                        href="#about" 
                        className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-[#202124] text-[#1A73E8] dark:text-[#8AB4F8] font-medium rounded-full border border-[#DADCE0] dark:border-[#5F6368] hover:bg-[#F8F9FA] dark:hover:bg-[#303134] transition-colors"
                    >
                        Tentang Saya
                    </a>
                </div>
            </motion.section>
        </div>
    );
}