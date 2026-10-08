import BaseTerminal from '../components/BaseTerminal';

export default function TerminalShell() {
    return (
        <div className="w-full px-3 sm:px-6 py-8 font-mono flex flex-col h-[calc(100dvh-6rem)]">
            <div className="w-full max-w-3xl mx-auto flex flex-col flex-1 min-h-0">
                <div className="mb-3 shrink-0 flex flex-wrap items-end justify-between gap-x-6 gap-y-1 font-sans">
                    <div className="min-w-0">
                        <h1 className="text-lg sm:text-xl font-black text-ink dark:text-white">
                            Terminal CLI &amp; Search Engine
                        </h1>
                        <p className="text-ink-2 dark:text-gray-300 text-[11px] sm:text-xs">
                            Laboratorium command-line interaktif.
                        </p>
                    </div>
                    <p className="text-[11px] text-ink-3 dark:text-gray-500 shrink-0">
                        Ketik <code className="text-[#34A853]">wick help</code> untuk daftar perintah,{' '}
                        <code className="text-[#34A853]">wick help &lt;perintah&gt;</code> untuk detail.
                    </p>
                </div>

                <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-800 text-white shrink-0">
                        <span className="w-3 h-3 rounded-full bg-[#EA4335]" />
                        <span className="w-3 h-3 rounded-full bg-[#FBBC05]" />
                        <span className="w-3 h-3 rounded-full bg-[#34A853]" />
                        <span className="ml-2 text-xs font-bold text-gray-300 truncate">wick-shell — zsh</span>
                    </div>
                    <div className="flex-1 min-h-0">
                        <BaseTerminal />
                    </div>
                </div>
            </div>
        </div>
    );
}
