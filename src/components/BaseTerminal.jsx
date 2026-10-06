import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { portfolioData as d } from '../data/portfoliodata';

const COMMANDS = ['help', 'about', 'skills', 'projects', 'contact', 'cv', 'resume', 'search', 'mode', 'nav', 'clear'];
const ROUTES = { home: '/', projects: '/projects', blog: '/blog', contact: '/contact', terminal: '/terminal' };
const CV_URL = '/cv-dwiki-kurniawan.pdf';

const HELP = [
    'Perintah tersedia (wajib awalan wick):',
    '- wick about            (Info profil)',
    '- wick skills           (Daftar keahlian)',
    '- wick projects         (Daftar proyek)',
    '- wick cv / wick resume (Buka CV)',
    '- wick search [kata]    (Cari proyek, skill, skripsi, sertifikat)',
    '- wick mode [light/dark](Ganti tema)',
    '- wick nav to [home/projects/blog/contact/terminal]',
    '- wick contact          (Info kontak)',
    '- wick clear            (Bersihkan layar)',
    'Tips: panah ↑/↓ untuk riwayat, Tab untuk melengkapi perintah.',
].join('\n');

// Index pencarian dibangun dari portfolioData agar selalu sinkron
const buildIndex = () => [
    ...d.projects.map((p) => ({ text: [p.title, p.description, ...(p.techStack || [])].join(' '), info: `Proyek: ${p.title} (${(p.techStack || []).join(', ')})` })),
    ...d.skillCategories.flatMap((c) => c.skills.map((s) => ({ text: `${s.name} ${c.category}`, info: `Skill: ${s.name} — ${c.category}` }))),
    ...d.certifications.map((c) => ({ text: `${c.title} ${c.issuer}`, info: `Sertifikasi: ${c.title} (${c.issuer}, ${c.year})` })),
    { text: `${d.thesis.title} ${d.thesis.tech.join(' ')} skripsi tugas akhir`, info: `Skripsi: ${d.thesis.title}` },
];

export default function BaseTerminal({ isFloating = false }) {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState([
        isFloating ? 'Dwiki Terminal v2.0.26' : 'D Terminal Shell v2.0.26 (Search & Navigation Enabled)',
        "⚠️ Catatan: Semua perintah wajib diawali dengan kata 'wick'.",
        "Ketik 'wick help' untuk melihat daftar perintah yang tersedia.",
    ]);
    const navigate = useNavigate();
    const logsEndRef = useRef(null);
    const history = useRef([]);
    const historyPos = useRef(-1);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [logs]);

    // Mengembalikan { out, after?, delay?, clear? }
    const execute = (raw) => {
        const words = raw.split(/\s+/);
        if (words[0].toLowerCase() !== 'wick') {
            return { out: '🤖 Bot Warning: Perintah harus diawali dengan kata "wick" (Contoh: wick help).' };
        }
        const cmd = (words[1] || '').toLowerCase();
        const arg = (words[2] || '').toLowerCase();
        const query = words.slice(2).join(' ').toLowerCase();

        switch (cmd) {
            case '':
            case 'help':
                return { out: HELP };
            case 'about':
                return { out: `${d.name} — ${d.title}\n${d.about}` };
            case 'skills':
                return { out: d.skillCategories.map((c) => `${c.category}: ${c.skills.map((s) => s.name).join(', ')}`).join('\n') };
            case 'projects':
                return { out: d.projects.map((p, i) => `${i + 1}. ${p.title} [${p.category}]`).join('\n') };
            case 'contact':
                return { out: `Email: ${d.email}\nProfil sosial tersedia di halaman Contact.` };
            case 'cv':
            case 'resume':
                return { out: '📄 Membuka berkas CV / Resume...', delay: 600, after: () => window.open(CV_URL, '_blank') };
            case 'mode':
                if (arg !== 'light' && arg !== 'dark') return { out: "⚠️ Gunakan 'wick mode light' atau 'wick mode dark'." };
                document.documentElement.classList.toggle('dark', arg === 'dark');
                localStorage.setItem('theme', arg);
                return { out: arg === 'dark' ? '🌙 Tema diubah ke Dark Mode' : '☀️ Tema diubah ke Light Mode' };
            case 'nav': {
                const dest = (words[3] || '').toLowerCase();
                if (arg !== 'to' || !dest) return { out: '⚠️ Format: wick nav to [home/projects/blog/contact/terminal]' };
                if (ROUTES[dest] === undefined) return { out: `⚠️ Halaman '${dest}' tidak ditemukan.\nTersedia: ${Object.keys(ROUTES).join(', ')}.` };
                return { out: `🚀 Mengalihkan ke halaman ${dest.toUpperCase()}...`, delay: 800, after: () => navigate(ROUTES[dest]) };
            }
            case 'search': {
                if (!query) return { out: '⚠️ Masukkan kata kunci. Contoh: wick search react' };
                const hits = buildIndex().filter((i) => i.text.toLowerCase().includes(query));
                return { out: hits.length ? `🔍 Hasil untuk '${query}':\n${hits.map((h) => `- ${h.info}`).join('\n')}` : `❌ Tidak ada data untuk '${query}'.` };
            }
            case 'clear':
                return { clear: true };
            default:
                return { out: `Perintah tidak dikenal: 'wick ${cmd}'. Ketik 'wick help' untuk bantuan.` };
        }
    };

    const handleCommand = (e) => {
        e.preventDefault();
        const raw = input.trim();
        if (!raw) return;
        history.current.push(raw);
        historyPos.current = -1;
        setInput('');

        const res = execute(raw);
        if (res.clear) {
            setLogs(['🧹 Layar dibersihkan.', "Ketik 'wick help' untuk melihat daftar perintah yang tersedia."]);
            return;
        }
        setLogs((prev) => [...prev, `$ ${raw}`, res.out]);
        if (res.after) setTimeout(res.after, res.delay || 0);
    };

    const handleKeyDown = (e) => {
        const h = history.current;
        if (e.key === 'ArrowUp' && h.length) {
            e.preventDefault();
            historyPos.current = historyPos.current === -1 ? h.length - 1 : Math.max(historyPos.current - 1, 0);
            setInput(h[historyPos.current]);
        } else if (e.key === 'ArrowDown' && historyPos.current !== -1) {
            e.preventDefault();
            historyPos.current += 1;
            if (historyPos.current >= h.length) { historyPos.current = -1; setInput(''); }
            else setInput(h[historyPos.current]);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const parts = input.split(/\s+/);
            if (parts.length === 1 && 'wick'.startsWith(parts[0].toLowerCase()) && parts[0]) setInput('wick ');
            else if (parts.length === 2 && parts[0].toLowerCase() === 'wick') {
                const match = COMMANDS.filter((c) => c.startsWith(parts[1].toLowerCase()));
                if (match.length === 1) setInput(`wick ${match[0]} `);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/95 text-emerald-400 p-4 font-mono overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-2 text-xs sm:text-sm mb-4 pr-2 no-scrollbar">
                {logs.map((log, i) => (
                    <div key={i} className={log.startsWith('$') ? 'text-white font-bold whitespace-pre-line' : 'whitespace-pre-line text-emerald-300'}>
                        {log}
                    </div>
                ))}
                <div ref={logsEndRef} />
            </div>
            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-3 border-t border-gray-800 shrink-0">
                <span className="text-[#34A853] font-bold text-xs sm:text-sm">$</span>
                <input
                    type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    aria-label="Input perintah terminal" autoComplete="off" spellCheck="false"
                    placeholder="ketik contoh: wick help, wick mode dark..."
                    className="w-full bg-transparent text-white focus:outline-none text-xs sm:text-sm font-mono"
                />
                <button type="submit" className="bg-[#34A853] hover:bg-emerald-600 p-2 rounded-xl text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer" aria-label="Execute Command">
                    <Send className="w-3 h-3" />
                </button>
            </form>
        </div>
    );
}
