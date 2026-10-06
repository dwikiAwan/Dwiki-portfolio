import { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfoliodata';
import { ExternalLink, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FolderGit2 } from 'lucide-react';

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6;
    const navigate = useNavigate();

    const projects = portfolioData?.projects || [];
    const categories = ['All', ...new Set(projects.map(p => p.category || 'Web'))];

    // Filter berdasarkan kategori dan pencarian
    const filteredProjects = projects.filter(project => {
        const matchesCategory = selectedCategory === 'All' || (project.category || 'Web') === selectedCategory;
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Logika Pagination (Membatasi 6 proyek per halaman)
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="py-16 px-6 max-w-6xl mx-auto space-y-8">
            <div>
               <h1 className="text-3xl md:text-5xl font-black text-[#202124] dark:text-white mb-3 flex items-center gap-3">
    {/* Real icon di sebelah kiri teks */}
    <FolderGit2 className="w-8 h-8 text-[#1A73E8] dark:text-[#8AB4F8]" />
    <span>Arsip Proyek</span>
</h1>  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
                    Jelajahi seluruh karya, aplikasi, dan sistem yang pernah saya bangun.
                </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                selectedCategory === cat
                                    ? 'bg-[#1A73E8] text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-black/30 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Cari proyek..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/40 text-xs focus:outline-none focus:border-[#1A73E8]"
                    />
                </div>
            </div>

            {/* Grid Proyek dengan Desain Card Sesuai Project Section & Efek Tertiup Angin */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProjects.length > 0 ? (
                    currentProjects.map((project, index) => (
                        <motion.div
                            key={project.id || index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            // Efek animasi tertiup angin (sway/wave) saat kursor mendekat
                            whileHover={{ 
                                y: -10, 
                                rotate: [0, -1.5, 1.5, -1, 0],
                                transition: { duration: 0.5, ease: "easeInOut" } 
                            }}
                            className="relative rounded-[2.5rem] p-[2px] bg-[linear-gradient(to_bottom_right,#EA4335,#FBBC05,#34A853,#4285F4)] shadow-lg flex flex-col group cursor-pointer"
                            onClick={() => navigate(`/projects/${project.id || index}`)}
                        >
                            <div className="bg-white dark:bg-[#1E1E20] rounded-[calc(2.5rem-2px)] p-8 flex flex-col justify-between h-full transition-colors duration-300">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-[#1A73E8] dark:text-[#8AB4F8] border border-blue-100 dark:border-blue-900 rounded-full">
                                            {project.category || 'Web'}
                                        </span>
                                        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                                            {project.github && (
                                                <a href={project.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white" title="GitHub Repository">
                                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                                    </svg>
                                                </a>
                                            )}
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1A73E8]" title="Live Demo">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-3 group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-[#5F6368] dark:text-[#9AA0A6] text-sm leading-relaxed mb-6 line-clamp-3">
                                        {project.description}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        {project.techStack?.map((t, idx) => (
                                            <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="inline-flex items-center text-sm font-semibold text-[#1A73E8] dark:text-[#8AB4F8] group-hover:translate-x-1 transition-transform">
                                        Lihat Detail &rarr;
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        Tidak ada proyek yang ditemukan.
                    </div>
                )}
            </div>

            {/* Navigasi Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        aria-label="Previous Page"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    currentPage === page
                                        ? 'bg-[#1A73E8] text-white shadow-md'
                                        : 'bg-white dark:bg-[#1E1E20] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        aria-label="Next Page"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            )}
        </div>
    );
}