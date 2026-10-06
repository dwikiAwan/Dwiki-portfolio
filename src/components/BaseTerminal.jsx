import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { portfolioData } from '../data/portfoliodata';
import { Send } from 'lucide-react';

export default function BaseTerminal({ isFloating = false }) {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState([
        isFloating ? "Dwiki Terminal v2.0.26" : "D Terminal Shell v2.0.26 (AI Bot, Search & Navigation Enabled)",
        "⚠️ Catatan: Semua perintah wajib diawali dengan kata 'wick'.",
        "Ketik 'wick help' untuk melihat daftar perintah yang tersedia."
    ]);
    
    const navigate = useNavigate();
    const logsEndRef = useRef(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [logs]);

    const handleCommand = (e) => {
        e.preventDefault();
        const rawInput = input.trim();
        if (!rawInput) return;

        const parts = rawInput.toLowerCase().split(' ');
        let response = "";

        if (parts[0] !== 'wick') {
            response = `🤖 Bot Warning: Perintah harus diawali dengan kata "wick" (Contoh: wick help).`;
            setLogs(prev => [...prev, `$ ${rawInput}`, response]);
            setInput('');
            return;
        }

        const cmd = parts[1];
        const subCmd = parts[2];
        const query = parts.slice(2).join(' ');

        switch (cmd) {
            case 'help':
                response = "Perintah tersedia (wajib awalan wick):\n- wick about (Info profil)\n- wick skills (Daftar keahlian)\n- wick projects (Daftar proyek)\n- wick cv / wick resume (Unduh/Lihat CV)\n- wick search [keyword] (Cari data)\n- wick mode [light/dark] (Ganti tema)\n- wick nav to [home/contact] (Navigasi)\n- wick contact (Info kontak)\n- wick clear (Bersihkan layar)";
                break;
            case 'about':
                response = "Dwiki Kurniawan - Software Engineer & Staff LPTSI UNIDA Gontor. Ahli dalam pengembangan web, mobile, dan infrastruktur cloud.";
                break;
            case 'skills':
                response = "Frontend: React, Tailwind CSS, Framer Motion\nBackend: Node.js, Python\nInfrastruktur: Cloud & Network Administration.";
                break;
            case 'projects':
                response = "1. Dwekfolio v2 (Modern Google-inspired Portfolio)\n2. Task Management App\n3. Data Analytics Dashboard";
                break;
            case 'contact':
                response = `Email: ${portfolioData?.email || 'dwiki@example.com'} | GitHub / LinkedIn / Instagram tersedia di halaman Contact.`;
                break;
            case 'cv':
            case 'resume':
                response = "📄 Membuka berkas CV / Resume Dwiki Kurniawan...";
                setLogs(prev => [...prev, `$ ${rawInput}`, response]);
                setInput('');
                setTimeout(() => {
                    window.open('/cv-dwiki-kurniawan.pdf', '_blank');
                }, 600);
                return;
            case 'mode': {
                const allowedModes = ['light', 'dark'];
                if (!allowedModes.includes(subCmd)) {
                    response = `⚠️ Validasi Gagal: Gunakan perintah 'wick mode light' atau 'wick mode dark'.`;
                } else {
                    if (subCmd === 'dark') {
                        document.documentElement.classList.add('dark');
                        localStorage.setItem('theme', 'dark');
                        response = "🌙 Tema berhasil diubah ke: Dark Mode";
                    } else {
                        document.documentElement.classList.remove('dark');
                        localStorage.setItem('theme', 'light');
                        response = "☀️ Tema berhasil diubah ke: Light Mode";
                    }
                }
                break;
            }
            case 'nav':
    if (subCmd === 'to' && parts[3]) {
        const destination = parts[3].toLowerCase();
        
        // Daftarkan semua rute halaman yang ada di App.jsx
        const validRoutes = {
            'home': '/',
            'projects': '/projects',
            'blog': '/blog',
            'contact': '/contact',
            'terminal': '/terminal'
        };

        if (validRoutes[destination] !== undefined) {
            response = `🚀 Navigasi berhasil! Mengalihkan ke halaman ${destination.toUpperCase()}...`;
            setLogs(prev => [...prev, `$ ${rawInput}`, response]);
            setInput('');
            setTimeout(() => {
                navigate(validRoutes[destination]);
            }, 800);
            return;
        } else {
            response = `⚠️ Halaman '${destination}' tidak ditemukan.\nDestinasi tersedia: home, projects, blog, contact, terminal.`;
        }
    } else {
        response = "⚠️ Format navigasi salah. Gunakan: wick nav to [home/projects/blog/contact/terminal]";
    }
    break;
            case 'search': {
                if (!query) {
                    response = "⚠️ Masukkan kata kunci pencarian. Contoh: wick search react";
                } else {
                    const database = [
                        { keyword: 'gontor', info: "UNIDA Gontor - Tempat Dwiki berbakti dan mengelola infrastruktur jaringan." },
                        { keyword: 'react', info: "React.js digunakan sebagai framework utama portofolio." },
                        { keyword: 'tailwind', info: "Tailwind CSS dipakai untuk styling Material Design." },
                        { keyword: 'rekrutmen', info: "Dwiki saat ini terbuka untuk peluang karir sebagai Software Engineer." }
                    ];

                    const results = database.filter(item => item.keyword.includes(query) || query.includes(item.keyword));
                    if (results.length > 0) {
                        response = `🔍 Hasil pencarian untuk '${query}':\n` + results.map(r => `- ${r.info}`).join('\n');
                    } else {
                        response = `❌ Maaf, data dengan kata kunci '${query}' tidak ditemukan.`;
                    }
                }
                break;
            }
            case 'clear':
                setLogs(["🧹 Layar dibersihkan.", "Ketik 'wick help' untuk melihat daftar perintah yang tersedia."]);
                setInput('');
                return;
            default:
                response = `Perintah tidak dikenal: 'wick ${cmd}'. Ketik 'wick help' untuk bantuan.`;
                break;
        }

        setLogs(prev => [...prev, `$ ${rawInput}`, response]);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-black/95 text-emerald-400 p-4 font-mono overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-2 text-xs sm:text-sm mb-4 pr-2 no-scrollbar">
                {logs.map((log, index) => (
                    <div key={index} className={log.startsWith('$') ? 'text-white font-bold whitespace-pre-line' : 'whitespace-pre-line text-emerald-300'}>
                        {log}
                    </div>
                ))}
                <div ref={logsEndRef} />
            </div>

            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-3 border-t border-gray-800 shrink-0">
                <span className="text-[#34A853] font-bold text-xs sm:text-sm">$</span>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="ketik contoh: wick help, wick mode dark..."
                    className="w-full bg-transparent text-white focus:outline-none text-xs sm:text-sm font-mono"
                />
                <button 
                    type="submit" 
                    className="bg-[#34A853] hover:bg-emerald-600 p-2 rounded-xl text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                    aria-label="Execute Command"
                >
                    <Send className="w-3 h-3" />
                </button>
            </form>
        </div>
    );
}