import { useEffect, useMemo, useState } from 'react';
import { articles, articleTags } from '../data/articles';
import useLiveArticles, { FEED_TAGS } from '../hooks/useLiveArticles';
import {
    ChevronLeft, ChevronRight, Eye, Images, NotebookPen, X,
    Search, RefreshCw, Radio, Clock, MessageCircle, Heart, ArrowLeft, Rss
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PER_PAGE = 6;

const buttonBase = 'px-5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer inline-flex items-center gap-1.5';
const tabActive = 'bg-primary text-white shadow-md';
const tabIdle = 'bg-surface-2 dark:bg-gray-800 text-ink-2 dark:text-gray-300 hover:bg-surface-3 dark:hover:bg-gray-700';

const paginationBtn = 'p-2.5 rounded-xl bg-surface dark:bg-[#1E1E20] border border-line dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-2 dark:hover:bg-gray-800 cursor-pointer';

function formatTime(epoch, now = Date.now()) {
    if (!epoch) return null;
    const diff = Math.floor((now - epoch) / 1000);
    if (diff < 60) return 'baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    return `${Math.floor(diff / 3600)} jam lalu`;
}

// Viewer artikel: p, h, code, list
function ArticleBody({ content }) {
    if (!content?.length) return null;
    return (
        <div className="space-y-4">
            {content.map((block, i) => {
                if (block.type === 'h') {
                    return (
                        <h3 key={i} className="text-base md:text-lg font-bold text-ink dark:text-white pt-2">
                            {block.text}
                        </h3>
                    );
                }
                if (block.type === 'code') {
                    return (
                        <pre key={i} className="p-4 rounded-2xl bg-[#202124] text-[#E8EAED] text-xs leading-relaxed overflow-x-auto font-mono border border-gray-700">
                            <code>{block.text}</code>
                        </pre>
                    );
                }
                if (block.type === 'list') {
                    return (
                        <ul key={i} className="space-y-2 pl-1">
                            {block.items.map((item, j) => (
                                <li key={j} className="flex gap-2 text-sm text-ink-2 dark:text-gray-300 leading-relaxed">
                                    <span className="text-accent dark:text-[#8AB4F8] mt-1.5 shrink-0">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    );
                }
                return (
                    <p key={i} className="text-sm text-ink-2 dark:text-gray-300 leading-relaxed">
                        {block.text}
                    </p>
                );
            })}
        </div>
    );
}

export default function Blog() {
    const [activeTab, setActiveTab] = useState('mine'); // 'mine' | 'feed' | 'gallery'
    const [articlePage, setArticlePage] = useState(1);
    const [galleryPage, setGalleryPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [reading, setReading] = useState(null);
    const [tag, setTag] = useState('Semua');
    const [query, setQuery] = useState('');
    const [feedTag, setFeedTag] = useState(FEED_TAGS[0]);

    const { articles: feed, status, error, updatedAt, live, refresh } = useLiveArticles(feedTag);

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
            description: "Sesi debugging menggunakan React, Tailwind CSS, dan Framer Motion.",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
            category: "Dev Life"
        }
    ];

    // Waktu relatif perlu dihitung ulang tiap menit, jadi simpan clock lokal
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 60_000);
        return () => clearInterval(id);
    }, []);
    const lastSync = updatedAt ? formatTime(updatedAt, now) : null;

    // Pagination direset lewat handler, bukan efek, agar tidak cascading render.
    const switchTab = (next) => {
        setActiveTab(next);
        setArticlePage(1);
        setGalleryPage(1);
        setReading(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const setFilterTag = (next) => { setTag(next); setArticlePage(1); };
    const setSearch = (next) => { setQuery(next); setArticlePage(1); };
    const setFeed = (next) => { setFeedTag(next); };

    const filteredArticles = useMemo(() => {
        const q = query.trim().toLowerCase();
        return articles.filter((a) => {
            const matchTag = tag === 'Semua' || (a.tags || []).includes(tag);
            const matchQuery = !q
                || a.title.toLowerCase().includes(q)
                || a.summary.toLowerCase().includes(q)
                || (a.tags || []).some((t) => t.toLowerCase().includes(q));
            return matchTag && matchQuery;
        });
    }, [tag, query]);

    const totalArticlePages = Math.max(1, Math.ceil(filteredArticles.length / PER_PAGE));
    const currentArticles = filteredArticles.slice((articlePage - 1) * PER_PAGE, articlePage * PER_PAGE);

    const totalGalleryPages = Math.max(1, Math.ceil(galleryItems.length / PER_PAGE));
    const currentGallery = galleryItems.slice((galleryPage - 1) * PER_PAGE, galleryPage * PER_PAGE);

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-black mb-2 text-ink dark:text-white">Tech Journal & Gallery</h1>
            <p className="text-ink-2 dark:text-gray-300 mb-8 text-sm">
                Artikel tulis sendiri, feed teknologi real-time dari dev.to, plus galeri visual.
            </p>

            {/* Navigasi tab utama */}
            <div className="flex flex-wrap gap-3 mb-6 border-b border-line dark:border-gray-800 pb-4">
                <button
                    onClick={() => switchTab('mine')}
                    className={`${buttonBase} ${activeTab === 'mine' ? tabActive : tabIdle}`}
                    aria-pressed={activeTab === 'mine'}
                >
                    <NotebookPen className="w-4 h-4 shrink-0" aria-hidden="true" />
                    Artikel Saya ({articles.length})
                </button>
                <button
                    onClick={() => switchTab('feed')}
                    className={`${buttonBase} ${activeTab === 'feed' ? tabActive : tabIdle}`}
                    aria-pressed={activeTab === 'feed'}
                >
                    <Rss className="w-4 h-4 shrink-0" aria-hidden="true" />
                    Live Feed ({feed.length})
                </button>
                <button
                    onClick={() => switchTab('gallery')}
                    className={`${buttonBase} ${activeTab === 'gallery' ? tabActive : tabIdle}`}
                    aria-pressed={activeTab === 'gallery'}
                >
                    <Images className="w-4 h-4 shrink-0" aria-hidden="true" />
                    Visual Gallery ({galleryItems.length})
                </button>
            </div>

            {activeTab === 'mine' && (
                <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex flex-wrap gap-2">
                            {articleTags.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilterTag(t)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                        tag === t
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-surface-2 dark:bg-gray-800 text-ink-2 dark:text-gray-300 hover:bg-surface-3 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="w-4 h-4 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari artikel..."
                                aria-label="Cari artikel"
                                className="w-full pl-9 pr-4 py-2 rounded-xl border border-line dark:border-gray-700 bg-surface-2 dark:bg-black/40 text-xs focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {currentArticles.length > 0 ? currentArticles.map((blog) => (
                            <motion.article
                                key={blog.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-surface dark:bg-[#1A1A1C] border border-line dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {(blog.tags || []).map((t) => (
                                        <span key={t} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent-wash dark:bg-[#174EA6]/20 text-accent dark:text-[#8AB4F8] border border-accent-line dark:border-[#174EA6]/50">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-ink-3 dark:text-gray-400 mb-2">
                                    <span>{blog.date}</span>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                                </div>
                                <button
                                    onClick={() => setReading(blog)}
                                    className="text-left w-full cursor-pointer"
                                >
                                    <h2 className="text-xl font-bold mb-2 text-ink dark:text-white hover:text-accent dark:hover:text-[#8AB4F8] transition-colors">
                                        {blog.title}
                                    </h2>
                                </button>
                                <p className="text-sm text-ink-2 dark:text-gray-300 leading-relaxed">
                                    {blog.summary}
                                </p>
                                <button
                                    onClick={() => setReading(blog)}
                                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-accent dark:text-[#8AB4F8] hover:underline cursor-pointer"
                                >
                                    Baca artikel lengkap <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </motion.article>
                        )) : (
                            <div className="py-12 text-center text-ink-3 text-sm">Tidak ada artikel yang cocok dengan pencarian.</div>
                        )}

                        {totalArticlePages > 1 && (
                            <div className="flex justify-center items-center gap-2 pt-4">
                                <button
                                    onClick={() => setArticlePage((p) => Math.max(p - 1, 1))}
                                    disabled={articlePage === 1}
                                    className={paginationBtn}
                                    aria-label="Halaman sebelumnya"
                                >
                                    <ChevronLeft className="w-4 h-4 text-ink-2 dark:text-gray-300" />
                                </button>
                                <span className="text-xs font-bold px-3 py-2 text-ink-2 dark:text-gray-300">
                                    Halaman {articlePage} dari {totalArticlePages}
                                </span>
                                <button
                                    onClick={() => setArticlePage((p) => Math.min(p + 1, totalArticlePages))}
                                    disabled={articlePage === totalArticlePages}
                                    className={paginationBtn}
                                    aria-label="Halaman berikutnya"
                                >
                                    <ChevronRight className="w-4 h-4 text-ink-2 dark:text-gray-300" />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {activeTab === 'feed' && (
                <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {FEED_TAGS.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFeed(t)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer capitalize ${
                                        feedTag === t
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-surface-2 dark:bg-gray-800 text-ink-2 dark:text-gray-300 hover:bg-surface-3 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    #{t}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={refresh}
                            disabled={live}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 dark:bg-gray-800 text-ink-2 dark:text-gray-300 text-xs font-bold border border-line dark:border-gray-700 hover:bg-surface-3 dark:hover:bg-gray-700 transition-all cursor-pointer disabled:opacity-60 self-start"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${live ? 'animate-spin' : ''}`} />
                            {live ? 'Memuat...' : 'Segarkan'}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-6 text-xs text-ink-3 dark:text-gray-400">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold ${
                            status === 'ready'
                                ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                                : status === 'stale'
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400'
                                    : status === 'error'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                        : 'bg-surface-2 dark:bg-gray-800 text-ink-3'
                        }`}>
                            <Radio className="w-3 h-3" />
                            {status === 'ready' && 'Live'}
                            {status === 'stale' && 'Cache'}
                            {status === 'loading' && 'Memuat...'}
                            {status === 'error' && 'Gagal'}
                        </span>
                        {lastSync && <span>diperbarui {lastSync}</span>}
                        {error && <span className="text-red-500">{error}</span>}
                    </div>

                    {feed.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {feed.map((item) => (
                                <motion.article
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col bg-surface dark:bg-[#1A1A1C] border border-line dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                >
                                    {item.image && (
                                        <img src={item.image} alt="" loading="lazy" className="h-36 w-full object-cover" />
                                    )}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-xs text-ink-3 dark:text-gray-400 mb-2">
                                            {item.avatar && <img src={item.avatar} alt="" className="w-5 h-5 rounded-full" />}
                                            <a href={item.authorUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent truncate">
                                                {item.author}
                                            </a>
                                            <span>•</span>
                                            <span>{item.date}</span>
                                        </div>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base font-bold text-ink dark:text-white hover:text-accent dark:hover:text-[#8AB4F8] transition-colors leading-snug"
                                        >
                                            {item.title}
                                        </a>
                                        <p className="mt-2 text-xs text-ink-2 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">
                                            {item.summary}
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {item.tags.map((t) => (
                                                <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-2 dark:bg-gray-800 text-ink-2 dark:text-gray-300">
                                                    #{t}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex items-center gap-4 text-[11px] text-ink-3 dark:text-gray-400">
                                            <span className="inline-flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{item.reactions}</span>
                                            <span className="inline-flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{item.comments}</span>
                                            {item.readTime && <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{item.readTime}</span>}
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-sm text-ink-3">
                            {status === 'loading'
                                ? 'Mengambil artikel terbaru...'
                                : status === 'error'
                                    ? 'Tidak bisa memuat feed. Periksa koneksi lalu tekan Segarkan.'
                                    : 'Belum ada artikel.'}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'gallery' && (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentGallery.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-surface dark:bg-[#1A1A1C] border border-line dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="h-48 overflow-hidden bg-surface-2 dark:bg-gray-800 relative cursor-pointer" onClick={() => setSelectedImage(item)}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="px-4 py-2 bg-surface/90 dark:bg-black/80 text-ink dark:text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5">
                                                <Eye className="w-3.5 h-3.5" /> View Photo
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <span className="text-xs font-bold px-2.5 py-1 bg-success-wash dark:bg-emerald-950/40 text-success-ink dark:text-emerald-400 rounded-full inline-block mb-2">
                                            {item.category}
                                        </span>
                                        <h3 className="font-bold text-base text-ink dark:text-white mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-ink-2 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-5 pb-5 pt-0">
                                    <button
                                        onClick={() => setSelectedImage(item)}
                                        className="w-full py-2.5 bg-surface-2 dark:bg-gray-800/60 hover:bg-success-solid hover:text-white text-ink dark:text-gray-200 rounded-xl text-xs font-bold transition-all border border-line dark:border-gray-700 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Eye className="w-3.5 h-3.5" /> View Photo
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {totalGalleryPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-6">
                            <button onClick={() => setGalleryPage((p) => Math.max(p - 1, 1))} disabled={galleryPage === 1} className={paginationBtn} aria-label="Halaman sebelumnya">
                                <ChevronLeft className="w-4 h-4 text-ink-2 dark:text-gray-300" />
                            </button>
                            <span className="text-xs font-bold px-3 py-2 text-ink-2 dark:text-gray-300">
                                Halaman {galleryPage} dari {totalGalleryPages}
                            </span>
                            <button onClick={() => setGalleryPage((p) => Math.min(p + 1, totalGalleryPages))} disabled={galleryPage === totalGalleryPages} className={paginationBtn} aria-label="Halaman berikutnya">
                                <ChevronRight className="w-4 h-4 text-ink-2 dark:text-gray-300" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal pembaca artikel */}
            <AnimatePresence>
                {reading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setReading(null)}
                        className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
                    >
                        <motion.article
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface dark:bg-[#1E1E20] rounded-[2rem] max-w-3xl w-full my-8 shadow-2xl border border-line dark:border-gray-800 overflow-hidden"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <button
                                        onClick={() => setReading(null)}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent dark:text-[#8AB4F8] hover:underline cursor-pointer shrink-0"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                                    </button>
                                    <button
                                        onClick={() => setReading(null)}
                                        aria-label="Tutup artikel"
                                        className="w-9 h-9 rounded-full bg-surface-2 dark:bg-gray-800 text-ink-2 hover:text-ink dark:hover:text-white flex items-center justify-center cursor-pointer shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {(reading.tags || []).map((t) => (
                                        <span key={t} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent-wash dark:bg-[#174EA6]/20 text-accent dark:text-[#8AB4F8] border border-accent-line dark:border-[#174EA6]/50">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <h1 className="text-2xl md:text-3xl font-black text-ink dark:text-white mb-3 leading-tight">
                                    {reading.title}
                                </h1>
                                <div className="flex items-center gap-3 text-xs text-ink-3 dark:text-gray-400 mb-6 pb-6 border-b border-line dark:border-gray-800">
                                    <span>{reading.date}</span>
                                    <span>•</span>
                                    <span>{reading.readTime}</span>
                                </div>
                                <ArticleBody content={reading.content} />
                            </div>
                        </motion.article>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal lightbox galeri */}
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
                            className="bg-surface dark:bg-[#1E1E20] rounded-[2rem] max-w-2xl w-full overflow-hidden shadow-2xl border border-line dark:border-gray-800 relative"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
                                <img src={selectedImage.image} alt={selectedImage.title} className="w-full h-full object-contain max-h-[60vh]" />
                            </div>
                            <div className="p-6">
                                <span className="text-xs font-bold px-2.5 py-1 bg-success-wash dark:bg-emerald-950/40 text-success-ink dark:text-emerald-400 rounded-full inline-block mb-2">
                                    {selectedImage.category}
                                </span>
                                <h3 className="text-xl font-bold text-ink dark:text-white mb-2">
                                    {selectedImage.title}
                                </h3>
                                <p className="text-sm text-ink-2 dark:text-gray-300 leading-relaxed">
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