import { useParams, Link } from 'react-router-dom';
import { portfolioData } from '../data/portfoliodata';
import { ArrowLeft, ExternalLink, AlertTriangle, Lightbulb, Wrench } from 'lucide-react'; // Hapus Github dari sini
import { motion } from 'framer-motion';

export default function ProjectDetail() {
    const { id } = useParams();
    
    // Ambil daftar proyek dari portfoliodata
    const projects = portfolioData?.projects || [];
    
    // Cari proyek berdasarkan ID string/number atau indeks array jika id berupa angka
    let project = projects.find((p) => String(p.id) === String(id));
    if (!project && !isNaN(id)) {
        project = projects[Number(id)];
    }

    // Jika proyek tidak ditemukan
    if (!project) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-28 text-center font-mono">
                <h1 className="text-3xl font-bold mb-4 text-[#202124] dark:text-white">404: Proyek Tidak Ditemukan</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">Maaf, data studi kasus untuk proyek ini tidak tersedia dalam sistem atau URL salah.</p>
                <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A73E8] text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all text-xs">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Arsip Proyek
                </Link>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-6 py-16"
        >
            {/* Tombol Kembali ke Arsip Proyek */}
            <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] mb-8 hover:underline">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Arsip Proyek
            </Link>

            {/* Header Proyek */}
            <div className="mb-10 bg-white/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-[#1A73E8] dark:text-[#8AB4F8] text-xs font-bold rounded-full border border-blue-100 dark:border-blue-900 uppercase tracking-wider">
                        {project.category || 'Web'}
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 text-[#202124] dark:text-white">
                    {project.title}
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    {project.description}
                </p>
            </div>

            {/* Bagian Studi Kasus: Tantangan & Solusi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="p-8 bg-white/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-bold mb-3 text-[#EA4335] flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Tantangan / Masalah
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {project.problem || "Menghadirkan efisiensi dan pengalaman interaktif yang mulus bagi pengguna pada platform web modern serta menjaga performa yang stabil."}
                        </p>
                    </div>
                </div>

                <div className="p-8 bg-white/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-bold mb-3 text-[#34A853] flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" /> Solusi Arsitektur
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {project.solution || "Menerapkan komponen modular berbasis React dengan manajemen state yang bersih, optimasi animasi, serta struktur kode yang mudah diskalakan."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tech Stack yang Digunakan */}
            <div className="mb-10 p-8 bg-white/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#FBBC05]" /> Tech Stack & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech, index) => (
                        <span key={index} className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-[#202124] dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Tombol Aksi Tautan Eksternal */}
            <div className="flex flex-wrap items-center gap-4">
                {project.liveUrl && (
                    <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-6 py-3.5 bg-[#1A73E8] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                    </a>
                )}
                {project.githubUrl && (
                    <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-6 py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#202124] dark:text-white font-bold rounded-xl text-xs transition-all shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-2 cursor-pointer"
                    >
                        {/* Menggunakan SVG inline untuk ikon GitHub */}
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        <span>GitHub Repository</span>
                    </a>
                )}
            </div>
        </motion.div>
    );
}