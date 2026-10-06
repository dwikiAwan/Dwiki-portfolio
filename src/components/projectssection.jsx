import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { portfolioData } from '../data/portfoliodata';
import ProjectCard from './ProjectCard';

const categories = ['All', 'Frontend', 'Fullstack', 'Data'];

export default function ProjectsSection() {
    const [filter, setFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);
    const navigate = useNavigate();

    const displayedProjects = (filter === 'All'
        ? portfolioData.projects
        : portfolioData.projects.filter((p) => p.category === filter)
    ).slice(0, 3);

    return (
        <section id="projects" className="pt-6 pb-20 px-6 max-w-6xl mx-auto scroll-mt-28 transition-colors duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                <span className="text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#174EA6]/20 px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#D2E3FC] dark:border-[#174EA6]/50">
                    Project Portfolio
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124] dark:text-white mt-4">Featured Projects</h2>
                <p className="text-[#5F6368] dark:text-[#9AA0A6] mt-2 max-w-xl mx-auto text-base">
                    Proyek unggulan dari implementasi kode, sistem, dan aplikasi nyata.
                </p>
            </motion.div>

            <div className="flex justify-center gap-3 mb-14 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                            filter === cat
                                ? 'bg-[#1A73E8] text-white shadow-md scale-105'
                                : 'bg-gray-100 dark:bg-gray-800 text-[#5F6368] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {displayedProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} onClick={() => setSelectedProject(project)} />
                ))}
            </div>

            <div className="text-center">
                <Link to="/projects" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#1A73E8] hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all hover:scale-105">
                    <span>Lihat Semua Daftar Proyek</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                        className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-[#202124] rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full border border-gray-200 dark:border-gray-700 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={() => setSelectedProject(null)} aria-label="Tutup" className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer">
                                &times;
                            </button>
                            <span className="text-xs font-bold px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-[#1A73E8] dark:text-[#8AB4F8] border border-blue-100 dark:border-blue-900 rounded-full inline-block mb-4">
                                {selectedProject.category}
                            </span>
                            <h3 className="text-2xl md:text-3xl font-extrabold text-[#202124] dark:text-white mb-4">{selectedProject.title}</h3>
                            <p className="text-[#5F6368] dark:text-[#9AA0A6] text-base leading-relaxed mb-6">{selectedProject.description}</p>
                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-[#202124] dark:text-white uppercase tracking-wider mb-3">Teknologi yang Digunakan:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.techStack?.map((t) => (
                                        <span key={t} className="bg-[#E8F0FE] dark:bg-[#174EA6]/20 text-[#1A73E8] dark:text-[#8AB4F8] border border-[#D2E3FC] dark:border-[#174EA6]/50 text-xs font-semibold px-3.5 py-1.5 rounded-lg">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => { const id = selectedProject.id; setSelectedProject(null); navigate(`/projects/${id}`); }}
                                    className="flex-1 text-center py-3.5 bg-[#1A73E8] hover:bg-blue-600 text-white font-medium rounded-2xl transition-colors shadow-sm text-sm cursor-pointer"
                                >
                                    Buka Halaman Case Study Lengkap &rarr;
                                </button>
                                <button onClick={() => setSelectedProject(null)} className="px-6 py-3.5 bg-gray-100 dark:bg-gray-800 text-[#202124] dark:text-gray-300 font-medium rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm cursor-pointer">
                                    Tutup
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
