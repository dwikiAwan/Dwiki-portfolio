import { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfoliodata';
import profileImg from '../assets/profile.jpg';
import DecryptText from './reactbits/DecryptText';
import { FileText, Download, User } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function About() {
    const [isNameVisible, setIsNameVisible] = useState(false);

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 w-full">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="relative rounded-[2.5rem] p-[2px] bg-[linear-gradient(135deg,#4285F4,#34A853,#FBBC05,#EA4335)] shadow-xl"
            >
                <div className="bg-white/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl rounded-[calc(2.5rem-2px)] p-8 md:p-14 flex flex-col md:flex-row items-center gap-12 md:gap-16 transition-colors duration-300">
                    
                    {/* Foto Profil Interaktif */}
                    <div className="relative flex-shrink-0 group perspective-1000">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#FBBC05] rounded-full opacity-20 blur-2xl transition-opacity duration-500"></div>
                        <motion.div
                            drag
                            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                            dragElastic={0.4} 
                            whileDrag={{ scale: 1.1, rotate: 5, cursor: "grabbing" }}
                            whileHover={{ scale: 1.05, cursor: "grab" }}
                            className="relative w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-white dark:border-[#202124] shadow-2xl bg-gray-100 dark:bg-gray-800 z-10 touch-none"
                        >
                            <img
                                src={profileImg}
                                alt={portfolioData.name}
                                className="w-full h-full object-cover rounded-full pointer-events-none"
                            />
                        </motion.div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Tarik Foto ↑
                        </div>
                    </div>

                    {/* Teks Deskripsi Detail */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center md:text-left flex-1 space-y-6"
                    >
                        <div>
                           <h2 className="text-xs font-bold tracking-widest uppercase text-[#5F6368] dark:text-[#9AA0A6] mb-3 flex items-center justify-center md:justify-start gap-2">
    {/* Ikon Profil */}
    <User className="w-3.5 h-3.5 text-[#1A73E8]" /> 
    
    {/* Efek Electric Text menggunakan kombinasi teks bersinar dan animasi kecil */}
    <span className="relative bg-gradient-to-r from-[#1A73E8] via-[#4285F4] to-[#8AB4F8] bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_8px_rgba(26,115,232,0.5)]">
        Tentang Saya
    </span>
</h2>
                            
                            <motion.div 
                                variants={itemVariants}
                                onViewportEnter={() => setIsNameVisible(true)}
                                className="text-3xl md:text-4xl font-extrabold text-[#202124] dark:text-white flex flex-wrap justify-center md:justify-start items-center gap-2 min-h-[3rem]"
                            >
                                <span>Halo, saya</span>
                                <span className="text-[#27dd30] dark:text-[#3fe707]">
                                    {isNameVisible && (
                                        <DecryptText delay={200} speed={80}>
                                            {portfolioData.name}
                                        </DecryptText>
                                    )}
                                </span>
                            </motion.div>
                        </div>

                        <div className="space-y-3 text-sm md:text-base text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed">
                            <p>
                                Lulusan S1 Teknik Informatika yang saat ini aktif berkhidmah sebagai Staff LPTSI | UNIDA Gontor. Saya memiliki ketertarikan mendalam dan pengalaman praktis dalam membangun solusi digital modern yang efisien, aman, dan berpusat pada pengguna.
                            </p>
                            <p>
                                Fokus keahlian saya mencakup pengembangan aplikasi berbasis web & mobile, perancangan infrastruktur cloud yang handal, hingga manajemen administrasi jaringan komputer skala institusi.
                            </p>
                        </div>

                        {/* Badge Keahlian */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-1">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#E8F0FE] dark:bg-[#174EA6]/20 text-[#1967D2] dark:text-[#8AB4F8] border border-[#D2E3FC] dark:border-[#174EA6]/50">
                                Web Dev
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#E6F4EA] dark:bg-[#0D652D]/20 text-[#137333] dark:text-[#81C995] border border-[#CEEAD6] dark:border-[#0D652D]/50">
                                Android
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#FEF7E0] dark:bg-[#E37400]/20 text-[#B06000] dark:text-[#FDE293] border border-[#FEEDFC] dark:border-[#E37400]/50">
                                Cloud Infra
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#FCE8E6] dark:bg-[#A50E0E]/20 text-[#C5221F] dark:text-[#F28B82] border border-[#FAD2CF] dark:border-[#A50E0E]/50">
                                Jaringan
                            </span>
                        </div>

                        {/* Tombol Aksi CV/Resume */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
                            <a 
                                href="/cv-dwiki-kurniawan.pdf" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A73E8] hover:bg-blue-600 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Lihat CV / Resume</span>
                            </a>
                            <a 
                                href="/cv-dwiki-kurniawan.pdf" 
                                download="CV-Dwiki-Kurniawan.pdf"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#202124] dark:text-white font-semibold text-xs transition-all border border-gray-200 dark:border-gray-700 cursor-pointer"
                            >
                                <Download className="w-4 h-4 text-[#34A853]" />
                                <span>Download PDF</span>
                            </a>
                        </div>

                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}