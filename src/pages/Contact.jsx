import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Check, Copy, FileText, Flame, Handshake, Mail, Rocket, Send, ThumbsUp, TriangleAlert, Zap } from 'lucide-react';
import { portfolioData } from '../data/portfoliodata';
import { AVATARS } from '../data/avatars';
import Avatar from '../components/Avatar';
import useGuestbook, { LIMITS } from '../hooks/useGuestbook';

const ITEMS_PER_PAGE = 4;
const card = 'bg-surface/90 dark:bg-[#1E1E20]/90 backdrop-blur-xl border-2 border-[#FBBC05]/60 shadow-md transition-colors duration-300';

const SOCIAL = [
    {
        key: 'github', label: 'GitHub',
        cls: 'bg-surface-2/80 dark:bg-black/30 hover:bg-surface-3 dark:hover:bg-black/50 text-ink dark:text-white',
        path: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z',
    },
    {
        key: 'linkedin', label: 'LinkedIn',
        cls: 'bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] dark:text-[#70B5F9]',
        path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
    },
    {
        key: 'instagram', label: 'Instagram',
        cls: 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400',
        path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    },
];

export default function Contact() {
    const [copied, setCopied] = useState(false);
    const { messages, addMessage, react } = useGuestbook();
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('code');
    const [errorMsg, setErrorMsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
    const currentMessages = messages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const socials = SOCIAL.filter((s) => portfolioData.socials?.[s.key]);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(portfolioData.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = await addMessage(name, text, selectedAvatar);
        setErrorMsg(err || '');
        if (err) return;
        setName(''); setText(''); setSelectedAvatar('code'); setCurrentPage(1);
    };

    const reactions = [
        { type: 'fire', Icon: Flame, cls: 'bg-orange-500/10 hover:bg-orange-500/20 text-warn-ink dark:text-orange-400' },
        { type: 'like', Icon: ThumbsUp, cls: 'bg-blue-500/10 hover:bg-blue-500/20 text-accent dark:text-blue-400' },
        { type: 'lightning', Icon: Zap, cls: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-warn-ink dark:text-yellow-400' },
    ];
    const pageBtn = 'p-2 rounded-xl border border-line dark:border-gray-800 bg-surface-2 dark:bg-black/30 disabled:opacity-40 text-ink-2 dark:text-gray-300 hover:bg-surface-3 dark:hover:bg-gray-800 transition-colors';

    return (
        <div className="py-12 px-6 max-w-4xl mx-auto space-y-12">
            {socials.length > 0 && (
                <div className={`${card} rounded-[2rem] p-6 text-center`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-4">Social Connect</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {socials.map((s) => (
                            <a key={s.key} href={portfolioData.socials[s.key]} target="_blank" rel="noreferrer"
                                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all border border-line dark:border-gray-800 ${s.cls}`}>
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d={s.path} /></svg>
                                <span>{s.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className={`${card} rounded-[2.5rem] p-8 md:p-14 text-center`}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success-wash dark:bg-emerald-950/40 text-success-ink dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 border border-success-line dark:border-emerald-800">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Ready to Build Cool Stuff
                    <Rocket className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-ink dark:text-white tracking-tight mb-4">
                    Let's Make Things Happen.
                    <Handshake className="inline w-9 h-9 md:w-11 md:h-11 ml-1 align-[-3px]" aria-hidden="true" />
                </h1>
                <p className="text-ink-2 dark:text-[#9AA0A6] mt-2 max-w-lg mx-auto text-base md:text-lg leading-relaxed mb-10">
                    Lagi cari tim untuk membangun web, mobile, cloud, sampai jaringan? Hit me up, mari ngobrol santai dan build proyek bareng!
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
                    <a href={`mailto:${portfolioData.email}`} className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-4 rounded-2xl shadow-md transition-all text-sm flex items-center justify-center gap-2 group">
                        <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform" /><span>Send Email</span>
                    </a>
                    <button onClick={handleCopyEmail} className="w-full sm:w-auto bg-surface-2/80 dark:bg-gray-800/80 hover:bg-surface-3 dark:hover:bg-gray-700 text-ink dark:text-white font-semibold px-8 py-4 rounded-2xl transition-all text-sm border border-line dark:border-gray-700 flex items-center justify-center gap-2">
                        {copied ? <Check className="w-4 h-4 text-success-ink" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Email Copied to Clipboard!' : 'Copy Email'}
                    </button>
                    <a href="/Resume_dwikikurniawan.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-surface-2/80 dark:bg-gray-800/80 hover:bg-surface-3 dark:hover:bg-gray-700 text-ink dark:text-white font-semibold px-8 py-4 rounded-2xl transition-all text-sm border border-line dark:border-gray-700 flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4 text-warn-ink" /><span>View / Download CV</span>
                    </a>
                </div>
            </motion.div>

            <div className={`${card} rounded-[2.5rem] p-8 md:p-12`}>
                <h2 className="text-2xl font-black mb-2 text-ink dark:text-white flex items-center gap-2">
                    <BookOpen className="w-6 h-6 shrink-0" aria-hidden="true" />
                    Guest Chat
                </h2>
                <p className="text-sm text-ink-2 dark:text-gray-400 mb-1">Pilih ikon, tinggalkan pesan, dan berinteraksi di dinding pengunjung.</p>
                <p className="text-xs text-ink-3 mb-6">Pesan tersimpan di Firebase dan tampil real-time untuk semua pengunjung.</p>

                {errorMsg && (
                    <div role="alert" className="mb-4 p-3 bg-danger-wash dark:bg-red-950/50 border border-danger-line dark:border-red-800 text-danger-ink dark:text-red-400 text-xs rounded-xl font-medium flex items-start gap-2">
                        <TriangleAlert className="w-4 h-4 shrink-0 mt-px" aria-hidden="true" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mb-10">
                    <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-ink-3 mb-2">Pilih Ikon Profilmu</span>
                        <div className="flex flex-wrap gap-3">
                            {AVATARS.map((item) => (
                                <button type="button" key={item.id} onClick={() => setSelectedAvatar(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                        selectedAvatar === item.id ? 'bg-primary text-white border-primary shadow-md scale-105' : 'bg-surface-2/80 dark:bg-black/30 text-ink-2 dark:text-gray-300 border-line dark:border-gray-700 hover:bg-surface-3 dark:hover:bg-gray-800'
                                    }`}>
                                    <Avatar id={item.id} /><span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="gb-name" className="block text-xs font-bold uppercase tracking-wider text-ink-3 mb-1.5">Nama / Panggilan</label>
                        <input id="gb-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="cth: Teman Koding" maxLength={LIMITS.name} required
                            className="w-full px-4 py-3 rounded-xl border border-line-strong dark:border-gray-700 bg-surface-2/80 dark:bg-black/40 text-sm focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                        <label htmlFor="gb-text" className="block text-xs font-bold uppercase tracking-wider text-ink-3 mb-1.5">Pesan Singkat</label>
                        <textarea id="gb-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ketik pesan atau sapaan di sini..." rows="3" maxLength={LIMITS.message} required
                            className="w-full px-4 py-3 rounded-xl border border-line-strong dark:border-gray-700 bg-surface-2/80 dark:bg-black/40 text-sm focus:outline-none focus:border-accent"></textarea>
                    </div>
                    <button type="submit" className="px-6 py-3 bg-success-solid hover:bg-[#12672e] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2">
                        <Send className="w-4 h-4" /> Kirim Pesan
                    </button>
                </form>

                <div className="mb-8 p-4 bg-surface-2/80 dark:bg-black/40 rounded-2xl border border-line dark:border-gray-800 overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-3 dark:text-gray-400">Live Visitor Stream</span>
                    </div>
                    <div className="overflow-hidden whitespace-nowrap w-full">
                        <div className="animate-marquee flex items-center gap-4">
                            {[...messages, ...messages].map((m, i) => (
                                <div key={`${m.id}-${i}`} className="min-w-[260px] max-w-[260px] bg-surface/90 dark:bg-[#1E1E20]/90 p-3 rounded-xl border border-line dark:border-gray-700 shrink-0 shadow-xs flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-accent-wash dark:bg-blue-950/40 text-accent shrink-0"><Avatar id={m.avatar} /></div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-accent truncate">@{m.name}</p>
                                        <p className="text-xs text-ink-2 dark:text-gray-300 truncate mt-0.5">{m.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-3">Semua Pesan ({messages.length})</h3>
                        <span className="text-xs text-ink-3 font-mono">Halaman {currentPage} dari {totalPages || 1}</span>
                    </div>
                    <AnimatePresence mode="wait">
                        {currentMessages.map((msg) => (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key={msg.id}
                                className="p-4 bg-surface-2/80 dark:bg-black/30 border border-line dark:border-gray-800 rounded-2xl space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm text-ink dark:text-white flex items-center gap-2.5">
                                        <span className="p-1.5 rounded-lg bg-accent-wash dark:bg-blue-950/40 text-accent"><Avatar id={msg.avatar} /></span>
                                        {msg.name}
                                    </span>
                                    <span className="text-xs text-ink-3 font-mono">{msg.time}</span>
                                </div>
                                <p className="text-sm text-ink-2 dark:text-gray-300 pl-9 break-words">{msg.message}</p>
                                <div className="flex items-center gap-3 pt-2 pl-9">
                                    {reactions.map(({ type, Icon, cls }) => (
                                        <button key={type} onClick={() => react(msg.id, type)} aria-label={`Reaksi ${type}`}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${cls}`}>
                                            <Icon className="w-3.5 h-3.5" /><span>{msg.reactions?.[type] || 0}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-6">
                            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className={pageBtn} aria-label="Sebelumnya"><ChevronLeft className="w-4 h-4" /></button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button key={page} onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentPage === page ? 'bg-primary text-white shadow-md' : 'bg-surface-2 dark:bg-black/30 text-ink-2 dark:text-gray-300 border border-line dark:border-gray-800 hover:bg-surface-3 dark:hover:bg-gray-800'}`}>
                                    {page}
                                </button>
                            ))}
                            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={pageBtn} aria-label="Berikutnya"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
