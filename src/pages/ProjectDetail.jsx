import { useParams, Link } from 'react-router-dom';
import { portfolioData } from '../data/portfoliodata';
import { ArrowLeft, ExternalLink, AlertTriangle, Lightbulb, Wrench } from 'lucide-react';
import GithubIcon from '../components/GithubIcon';
import { motion } from 'framer-motion';

export default function ProjectDetail() {
    const { id } = useParams();
    
    // daftar proyek dari portfoliodata
    const projects = portfolioData?.projects || [];
    
    //proyek berdasarkan ID string/number atau indeks array jika id berupa angka
    let project = projects.find((p) => String(p.id) === String(id));
    if (!project && !isNaN(id)) {
        project = projects[Number(id)];
    }

    // Jika proyek tidak ditemukan
    if (!project) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-28 text-center font-mono">
                <h1 className="text-3xl font-bold mb-4 text-ink dark:text-white">404: Proyek Tidak Ditemukan</h1>
                <p className="text-ink-2 dark:text-gray-400 mb-8 text-sm">Maaf, data studi kasus untuk proyek ini tidak tersedia dalam sistem atau URL salah.</p>
                <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-hover transition-all text-xs">
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
            {/* Tombol Kembali ke Arsip Pryek */}
            <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-accent dark:text-[#8AB4F8] mb-8 hover:underline">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Arsip Proyek
            </Link>

            {/* Header Proyek */}
            <div className="mb-10 bg-surface/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-line dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="px-3.5 py-1.5 bg-accent-wash dark:bg-blue-950/40 text-accent dark:text-[#8AB4F8] text-xs font-bold rounded-full border border-accent-line dark:border-blue-900 uppercase tracking-wider">
                        {project.category || 'Web'}
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 text-ink dark:text-white">
                    {project.title}
                </h1>
                <p className="text-sm md:text-base text-ink-2 dark:text-gray-300 leading-relaxed font-sans">
                    {project.description}
                </p>
            </div>

            {/* Galeri Screenshot: 3 foto per proyek */}
            {project.images?.length > 0 && (
                <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {project.images.map((img, i) => (
                        <figure
                            key={img}
                            className={`overflow-hidden rounded-[2rem] border border-line dark:border-gray-800 bg-surface/90 dark:bg-[#1E1E20]/90 shadow-sm ${i === 0 ? 'sm:col-span-2' : ''}`}
                        >
                            <img
                                src={img}
                                alt={`${project.title} - tangkapan layar ${i + 1}`}
                                loading="lazy"
                                className="w-full aspect-[16/10] object-cover"
                            />
                        </figure>
                    ))}
                </div>
            )}

            {/* Bagian Studi Kasus: Tantangan & Solusi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="p-8 bg-surface/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl border border-line dark:border-gray-800 rounded-[2rem] shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-bold mb-3 text-danger-ink flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Tantangan / Masalah
                        </h3>
                        <p className="text-xs md:text-sm text-ink-2 dark:text-gray-300 leading-relaxed">
                            {project.problem || "Menghadirkan efisiensi dan pengalaman interaktif yang mulus bagi pengguna pada platform web modern serta menjaga performa yang stabil."}
                        </p>
                    </div>
                </div>

                <div className="p-8 bg-surface/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl border border-line dark:border-gray-800 rounded-[2rem] shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-bold mb-3 text-success-ink flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" /> Solusi Arsitektur
                        </h3>
                        <p className="text-xs md:text-sm text-ink-2 dark:text-gray-300 leading-relaxed">
                            {project.solution || "Menerapkan komponen modular berbasis React dengan manajemen state yang bersih, optimasi animasi, serta struktur kode yang mudah diskalakan."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tech Stack yang Digunakan */}
            <div className="mb-10 p-8 bg-surface/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl border border-line dark:border-gray-800 rounded-[2rem] shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-4 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-warn-ink" /> Tech Stack & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech, index) => (
                        <span key={index} className="px-3.5 py-1.5 bg-surface-2 dark:bg-gray-800 text-ink dark:text-gray-200 text-xs font-bold rounded-xl border border-line dark:border-gray-700">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Tombol Aksi Tautan Eksternal */}
            <div className="flex flex-wrap items-center gap-4">
                {project.liveUrl && (
                    <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                    </a>
                )}
                {project.githubUrl && (
                    <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-6 py-3.5 bg-surface-2 dark:bg-gray-800 hover:bg-surface-3 dark:hover:bg-gray-700 text-ink dark:text-white font-bold rounded-xl text-xs transition-all shadow-sm border border-line dark:border-gray-700 flex items-center gap-2 cursor-pointer"
                    >
                        {/* Ikon GitHub */}
                        <GithubIcon className="w-4 h-4" />
                        <span>GitHub Repository</span>
                    </a>
                )}
            </div>
        </motion.div>
    );
}