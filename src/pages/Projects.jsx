import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, FolderGit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { portfolioData } from '../data/portfoliodata';
import ProjectCard from '../components/ProjectCard';

const PER_PAGE = 6;

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const projects = portfolioData.projects || [];
    const categories = ['All', ...new Set(projects.map((p) => p.category || 'Web'))];
    const q = searchQuery.toLowerCase();

    const filtered = projects.filter((p) =>
        (selectedCategory === 'All' || (p.category || 'Web') === selectedCategory) &&
        (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const current = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const pageBtn = 'p-2.5 rounded-xl bg-surface dark:bg-[#1E1E20] border border-line dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-2 dark:hover:bg-gray-800 transition-colors cursor-pointer';

    return (
        <div className="py-16 px-6 max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl md:text-5xl font-black text-ink dark:text-white mb-3 flex items-center gap-3">
                    <FolderGit2 className="w-8 h-8 text-accent dark:text-[#8AB4F8]" />
                    <span>Arsip Proyek</span>
                </h1>
                <p className="text-sm text-ink-2 dark:text-gray-400 max-w-xl">Jelajahi seluruh karya, aplikasi, dan sistem yang pernah saya bangun.</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl p-4 rounded-2xl border border-line dark:border-gray-800 shadow-sm">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                selectedCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-surface-2 dark:bg-black/30 text-ink-2 dark:text-gray-300 hover:bg-surface-3 dark:hover:bg-gray-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text" value={searchQuery} aria-label="Cari proyek"
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder="Cari proyek..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-line dark:border-gray-700 bg-surface-2 dark:bg-black/40 text-xs focus:outline-none focus:border-accent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {current.length > 0 ? current.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} onClick={() => navigate(`/projects/${project.id}`)} />
                )) : (
                    <div className="col-span-full py-12 text-center text-ink-3">Tidak ada proyek yang ditemukan.</div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className={pageBtn} aria-label="Halaman sebelumnya">
                        <ChevronLeft className="w-4 h-4 text-ink-2 dark:text-gray-300" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page} onClick={() => setCurrentPage(page)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                currentPage === page ? 'bg-primary text-white shadow-md' : 'bg-surface dark:bg-[#1E1E20] border border-line dark:border-gray-800 text-ink-2 dark:text-gray-300 hover:bg-surface-2 dark:hover:bg-gray-800'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={pageBtn} aria-label="Halaman berikutnya">
                        <ChevronRight className="w-4 h-4 text-ink-2 dark:text-gray-300" />
                    </button>
                </div>
            )}
        </div>
    );
}
