import { useState } from 'react';
import { portfolioData } from '../data/portfoliodata';
import { ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Blog() {
    const [activeTab, setActiveTab] = useState('articles'); // 'articles' atau 'gallery'
    const [articlePage, setArticlePage] = useState(1);
    const [galleryPage, setGalleryPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null); // State untuk modal view photo
    const itemsPerPage = 6;

    // Data galeri visual dengan deskripsi tambahan
    const galleryItems = [
        { 
            id: 1, 
            title: "Workspace & Desk Setup 2026", 
            description: "Konfigurasi meja kerja minimalis dengan pencahayaan hangat untuk produktivitas coding harian.",
            image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80", 
            category: "Setup" 
        },
        { 
            id: 2, 
            title: "UI/UX Wireframing Dwekfolio", 
            description: "Sketsa awal perancangan antarmuka Google Material Design yang terintegrasi dengan kustom CLI.",
            image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80", 
            category: "Design" 
        },
        { 
            id: 3, 
            title: "Coding Session & Terminal Vibe", 
            description: "Sesi debugging larut malam menggunakan React, Tailwind CSS, dan Framer Motion.",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", 
            category: "Dev Life" 
        },
    ];

    const articles = portfolioData?.blogs || [];

    // Logika Pagination Artikel
    const totalArticlePages = Math.ceil(articles.length / itemsPerPage);
    const currentArticles = articles.slice((articlePage - 1) * itemsPerPage, articlePage * itemsPerPage);

    // Logika Pagination Galeri
    const totalGalleryPages = Math.ceil(galleryItems.length / itemsPerPage);
    const currentGallery = galleryItems.slice((galleryPage - 1) * itemsPerPage, galleryPage * itemsPerPage);

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-black mb-2 text-[#202124] dark:text-white">Tech Journal & Gallery</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm">
                Catatan petualangan koding, artikel teknologi, serta galeri visual seputar dunia perkembangan teknologi.
            </p>

            {/* Tombol Tab Navigasi (Articles vs Gallery) */}
            <div className="flex gap-3 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                <button 
                    onClick={() => { setActiveTab('articles'); setArticlePage(1); }}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        activeTab === 'articles' 
                            ? 'bg-[#1A73E8] text-white shadow-md' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    📝 Tech Articles ({articles.length})
                </button>
                <button 
                    onClick={() => { setActiveTab('gallery'); setGalleryPage(1); }}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        activeTab === 'gallery' 
                            ? 'bg-[#34A853] text-white shadow-md' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    🖼️ Visual Gallery ({galleryItems.length})
                </button>
            </div>

            {/* Konten Berdasarkan Tab yang Dipilih */}
            {activeTab === 'articles' ? (
                <div className="space-y-6">
                    {currentArticles.length > 0 ? (
                        currentArticles.map((blog) => (
                            <motion.article 
                                key={blog.id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    <span>{blog.date}</span>
                                    <span>•</span>
                                    <span>{blog.readTime}</span>
                                </div>
                                <h2 className="text-xl font-bold mb-2 text-[#202124] dark:text-white hover:text-[#1A73E8] dark:hover:text-[#34A853] transition-colors cursor-pointer">
                                    {blog.title}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {blog.summary}
                                </p>
                            </motion.article>
                        ))
                    ) : (
                        <div className="py-12 text-center text-gray-500 text-sm">Tidak ada artikel ditemukan.</div>
                    )}

                    {/* Pagination Artikel */}
                    {totalArticlePages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-4">
                            <button
                                onClick={() => setArticlePage(prev => Math.max(prev - 1, 1))}
                                disabled={articlePage === 1}
                                className="p-2.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </button>
                            <span className="text-xs font-bold px-3 py-2 text-gray-600 dark:text-gray-300">
                                Halaman {articlePage} dari {totalArticlePages}
                            </span>
                            <button
                                onClick={() => setArticlePage(prev => Math.min(prev + 1, totalArticlePages))}
                                disabled={articlePage === totalArticlePages}
                                className="p-2.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentGallery.length > 0 ? (
                            currentGallery.map((item) => (
                                <motion.div 
                                    key={item.id} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-[#1A1A1C] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 relative cursor-pointer" onClick={() => setSelectedImage(item)}>
                                            <img 
                                                src={item.image} 
                                                alt={item.title} loading="lazy" 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="px-4 py-2 bg-white/90 dark:bg-black/80 text-[#202124] dark:text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5">
                                                    <Eye className="w-3.5 h-3.5" /> View Photo
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full inline-block mb-2">
                                                {item.category}
                                            </span>
                                            <h3 className="font-bold text-base text-[#202124] dark:text-white mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-5 pb-5 pt-0">
                                        <button 
                                            onClick={() => setSelectedImage(item)}
                                            className="w-full py-2.5 bg-gray-50 dark:bg-gray-800/60 hover:bg-[#34A853] hover:text-white text-[#202124] dark:text-gray-200 rounded-xl text-xs font-bold transition-all border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View Photo
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-500 text-sm">Tidak ada galeri visual ditemukan.</div>
                        )}
                    </div>

                    {/* Pagination Galeri */}
                    {totalGalleryPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-6">
                            <button
                                onClick={() => setGalleryPage(prev => Math.max(prev - 1, 1))}
                                disabled={galleryPage === 1}
                                className="p-2.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </button>
                            <span className="text-xs font-bold px-3 py-2 text-gray-600 dark:text-gray-300">
                                Halaman {galleryPage} dari {totalGalleryPages}
                            </span>
                            <button
                                onClick={() => setGalleryPage(prev => Math.min(prev + 1, totalGalleryPages))}
                                disabled={galleryPage === totalGalleryPages}
                                className="p-2.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* MODAL LIGHTBOX VIEW PHOTO */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-[#1E1E20] rounded-[2rem] max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 relative"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
                                <img 
                                    src={selectedImage.image} 
                                    alt={selectedImage.title} 
                                    className="w-full h-full object-contain max-h-[60vh]"
                                />
                            </div>
                            <div className="p-6">
                                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full inline-block mb-2">
                                    {selectedImage.category}
                                </span>
                                <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">
                                    {selectedImage.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {selectedImage.description}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}