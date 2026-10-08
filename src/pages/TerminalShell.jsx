import { useState } from 'react';
import BaseTerminal from '../components/BaseTerminal';

const CHEATSHEET = [
    ['Cari data apa pun', 'wick find react'],
    ['Batasi jenis data', 'wick find docker --type=project'],
    ['Baca artikel penuh', 'wick read terminal-ui'],
    ['Rincian proyek', 'wick project fraction-app'],
    ['Saring output', 'wick articles | wick grep react'],
    ['Hitung baris', 'wick projects | wick wc'],
    ['Cari di artikel', 'wick find gamifikasi --type=article'],
    ['Status environment', 'wick env'],
    ['Pindah halaman', 'wick nav to blog'],
    ['Ganti tema', 'wick theme dark'],
];

export default function TerminalShell() {
    const [fullscreen, setFullscreen] = useState(false);

    return (
        <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-page dark:bg-[#121212] p-4' : 'max-w-4xl mx-auto px-6 py-12 font-mono'}`}>
            <div className="flex items-start justify-between gap-4 mb-6 font-sans">
                <div>
                    <h1 className="text-2xl font-black mb-2 text-ink dark:text-white">Terminal CLI &amp; Search Engine</h1>
                    <p className="text-ink-2 dark:text-gray-300 text-xs max-w-xl">
                        Laboratorium command-line interaktif. Seluruh data portofolio — proyek, skill,
                        artikel, skripsi, sertifikat, rute halaman, dan status environment — bisa
                        diakses lewat CLI ini, termasuk lewat pencarian dengan toleransi typo.
                    </p>
                </div>
                <button
                    onClick={() => setFullscreen((v) => !v)}
                    className="text-xs font-bold px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-ink dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                >
                    {fullscreen ? 'Kecilkan' : 'Layar penuh'}
                </button>
            </div>

            <div className="grid gap-6 font-sans lg:grid-cols-[1fr_240px]">
                <div className={`rounded-2xl border border-gray-700 shadow-2xl overflow-hidden ${fullscreen ? 'h-[calc(100vh-8rem)]' : 'h-[520px]'}`}>
                    <div className="bg-[#202023] px-4 py-3 flex items-center gap-2 border-b border-gray-800 text-white">
                        <span className="w-3 h-3 rounded-full bg-[#EA4335]" />
                        <span className="w-3 h-3 rounded-full bg-[#FBBC05]" />
                        <span className="w-3 h-3 rounded-full bg-[#34A853]" />
                        <span className="ml-2 text-xs font-bold text-gray-300">wick-shell — zsh</span>
                    </div>
                    <div className="h-[calc(100%-45px)]">
                        <BaseTerminal />
                    </div>
                </div>

                <aside className="font-mono">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-ink-3 dark:text-gray-400 mb-3">
                        Cheatsheet
                    </h2>
                    <ul className="space-y-2">
                        {CHEATSHEET.map(([label, command]) => (
                            <li key={command}>
                                <p className="text-[11px] text-ink-3 dark:text-gray-500">{label}</p>
                                <code className="text-[11px] text-[#34A853] break-all">{command}</code>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
}
