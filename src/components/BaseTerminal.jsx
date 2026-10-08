import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eraser, Search, Terminal as TerminalIcon } from 'lucide-react';
import { runLine, COMPLETION_TOKENS } from '../terminal/run';
import { VERSION, findCommand } from '../terminal/commands';
import { NAV_KEYS, getIndex } from '../terminal/corpus';
import { suggest } from '../terminal/search';
import { portfolioData } from '../data/portfoliodata';
import { articles } from '../data/articles';
import useGuestbook from '../hooks/useGuestbook';

const ARTICLE_IDS = articles.map((a) => a.id);
const PROJECT_IDS = portfolioData.projects.map((p) => p.id);

const BANNER = [
    `wick-shell v${VERSION} — search engine + CLI portofolio`,
    '',
    'Semua perintah diawali "wick". Mulai dari:',
    '  wick help          daftar lengkap perintah',
    '  wick commands      ringkasan satu baris per perintah',
    '  wick find <kata>   cari di seluruh data proyek',
    '',
    'Contoh: wick find react --type=project',
    'Contoh: wick articles | wick grep react',
    'Tip: Tab untuk melengkapi, ↑/↓ untuk riwayat, Ctrl+L untuk clear.',
];

const TONE_CLASS = {
    ok: 'text-emerald-300',
    warn: 'text-amber-300',
    error: 'text-rose-400',
    cmd: 'text-white font-bold',
    dim: 'text-gray-500',
};

/**
 * Argumen yang diharapkan tiap perintah, dipakai untuk Tab completion.
 * Sengaja ditulis manual: daftar ini soal UX, bukan sumber kebenaran data.
 */
const commandArgs = (cmd) => {
    if (!cmd) return [];
    if (cmd.name === 'nav') return ['to', ...NAV_KEYS, ...PROJECT_IDS];
    if (cmd.name === 'theme') return ['light', 'dark', 'toggle'];
    if (cmd.name === 'read') return ARTICLE_IDS;
    if (cmd.name === 'project') return PROJECT_IDS;
    if (cmd.name === 'where') return ['project', 'skill', 'article', 'thesis', 'cert', 'page', 'contact'];
    return [];
};

/** Lengkapi input: nama perintah, argumen perintah, lalu kata kunci korpus. */
function complete(input) {
    const parts = input.split(/\s+/);

    // Posisi 1: nama perintah atau alias.
    if (parts.length <= 1) {
        const prefix = (parts[0] || '').toLowerCase();
        if (!prefix) return { input: 'wick ', suggestions: [] };
        const matches = COMPLETION_TOKENS.filter((c) => c.startsWith(prefix) && c !== prefix);
        if (matches.length === 1) return { input: `wick ${matches[0]} `, suggestions: [] };
        return { input, suggestions: matches.slice(0, 8) };
    }

    // Posisi 2: argumen milik perintah tersebut.
    if (parts.length === 2) {
        const partial = parts[1].toLowerCase();
        const options = commandArgs(findCommand(parts[1].toLowerCase()));
        const matches = options.filter((a) => a.startsWith(partial) && a !== partial);
        if (matches.length === 1) return { input: `wick ${parts[1]} ${matches[0]} `, suggestions: [] };
        return { input, suggestions: matches.slice(0, 8) };
    }

    // Posisi 3+: teks bebas — kamus korpus adalah autocomplete terbaik di sini.
    return { input, suggestions: suggest(getIndex(), parts[parts.length - 1].toLowerCase(), 6) };
}

export default function BaseTerminal({ onClose }) {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState(() => BANNER.map((text) => ({ text, tone: 'ok' })));
    const [suggestions, setSuggestions] = useState([]);
    const [copiedAt, setCopiedAt] = useState(null);
    const navigate = useNavigate();
    const logsEndRef = useRef(null);
    const historyRef = useRef([]);
    const historyPosRef = useRef(-1);
    const guestbook = useGuestbook();

    // Tema ditulis lewat fungsi, bukan di dalam render.
    const setTheme = useCallback((mode) => {
        document.documentElement.classList.toggle('dark', mode === 'dark');
        localStorage.setItem('theme', mode);
    }, []);

    const ctx = useMemo(
        () => ({
            navigate,
            setTheme,
            toggleTheme: () => {
                const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
                setTheme(next);
                return { out: `Tema diubah ke ${next === 'dark' ? 'Dark' : 'Light'} Mode`, tone: 'ok' };
            },
            get history() {
                return historyRef.current;
            },
            resetHistory: () => {
                historyRef.current = [];
            },
            guestbook,
            openUrl: (url) => window.open(url, '_blank', 'noopener,noreferrer'),
            closeTerminal: () => onClose?.(),
        }),
        [navigate, setTheme, guestbook, onClose]
    );

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [logs, suggestions]);

    const handleCommand = (e) => {
        e.preventDefault();
        const raw = input.trim();
        if (!raw) return;

        historyRef.current = [...historyRef.current, raw].slice(-100);
        historyPosRef.current = -1;
        setInput('');
        setSuggestions([]);

        const result = runLine(raw, ctx);

        if (result.clear) {
            setLogs([{ text: 'Layar dibersihkan. Ketik wick help.', tone: 'ok', icon: Eraser }]);
            return;
        }

        // meta.text adalah versi polos (tanpa sorotan) untuk disalin pengguna.
        setLogs((prev) => [
            ...prev,
            { text: `$ ${raw}`, tone: 'cmd' },
            { text: result.out, tone: result.tone, icon: result.icon, copy: result.meta?.text },
        ]);

        if (result.action?.type === 'navigate') {
            setTimeout(() => navigate(result.action.to), result.delay || 400);
        } else if (result.action?.type === 'open') {
            setTimeout(() => ctx.openUrl(result.action.to), result.delay || 300);
        } else if (result.action?.type === 'close') {
            setTimeout(() => onClose?.(), 300);
        }
    };

    const handleKeyDown = (e) => {
        const h = historyRef.current;

        if (e.key === 'Tab') {
            e.preventDefault();
            const result = complete(input);
            setInput(result.input);
            setSuggestions(result.suggestions);
            return;
        }

        if (e.key === 'ArrowUp' && h.length) {
            e.preventDefault();
            historyPosRef.current =
                historyPosRef.current === -1 ? h.length - 1 : Math.max(historyPosRef.current - 1, 0);
            setInput(h[historyPosRef.current]);
            return;
        }

        if (e.key === 'ArrowDown' && historyPosRef.current !== -1) {
            e.preventDefault();
            historyPosRef.current += 1;
            if (historyPosRef.current >= h.length) {
                historyPosRef.current = -1;
                setInput('');
            } else {
                setInput(h[historyPosRef.current]);
            }
            return;
        }

        if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLogs([{ text: 'Layar dibersihkan.', tone: 'ok', icon: Eraser }]);
            return;
        }

        if (e.key === 'Escape') {
            setInput('');
            setSuggestions([]);
        }
    };

    const copyLog = async (entry) => {
        if (!entry.copy) return;
        try {
            await navigator.clipboard.writeText(entry.copy);
            setCopiedAt(entry.text);
            setTimeout(() => setCopiedAt(null), 1200);
        } catch {
            /* clipboard ditolak browser: abaikan */
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/95 text-emerald-400 p-4 font-mono overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-2 text-xs sm:text-sm mb-4 pr-2 no-scrollbar">
                {logs.map((log, i) => {
                    const Icon = log.icon;
                    const clickable = Boolean(log.copy);
                    return (
                        <div
                            key={i}
                            onClick={() => copyLog(log)}
                            title={clickable ? 'Klik untuk menyalin teks polos' : undefined}
                            className={`flex items-start gap-2 ${TONE_CLASS[log.tone] || TONE_CLASS.ok} ${
                                clickable ? 'cursor-copy hover:bg-white/5 rounded px-1 -mx-1' : ''
                            }`}
                        >
                            {Icon ? <Icon className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" /> : null}
                            <span className="whitespace-pre-line break-words">
                                {log.text}
                                {copiedAt === log.text ? (
                                    <span className="ml-2 text-[#34A853]">tersalin</span>
                                ) : null}
                            </span>
                        </div>
                    );
                })}

                {suggestions.length > 0 && (
                    <div className="flex items-start gap-2 text-sky-300">
                        <Search className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="break-words">{suggestions.join('   ')}</span>
                    </div>
                )}

                <div ref={logsEndRef} />
            </div>

            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-3 border-t border-gray-800 shrink-0">
                <TerminalIcon className="w-4 h-4 text-[#34A853] shrink-0" aria-hidden="true" />
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Input perintah terminal"
                    autoComplete="off"
                    spellCheck="false"
                    autoCapitalize="off"
                    placeholder="ketik wick help, lalu Tab untuk melengkapi…"
                    className="w-full bg-transparent text-white focus:outline-none text-xs sm:text-sm font-mono"
                />
                <button
                    type="submit"
                    className="bg-success-solid hover:bg-[#12672e] p-2 rounded-xl text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                    aria-label="Jalankan perintah"
                >
                    <ChevronRight className="w-3 h-3" />
                </button>
            </form>
        </div>
    );
}
