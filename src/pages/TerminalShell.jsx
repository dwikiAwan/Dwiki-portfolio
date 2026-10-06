import BaseTerminal from '../components/BaseTerminal';

export default function TerminalShell() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 font-mono">
            <h1 className="text-2xl font-black mb-2 text-[#202124] dark:text-white">Terminal CLI & AI Bot Playground</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs">Laboratorium command-line interaktif.</p>

            <div className="rounded-2xl border border-gray-700 shadow-2xl h-[420px] overflow-hidden">
                <BaseTerminal isFloating={false} />
            </div>
        </div>
    );
}