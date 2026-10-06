import { useState } from 'react';
import { MessageSquare, Flame, ThumbsUp, Zap, Code, Bot, Rocket, Shield, Terminal } from 'lucide-react';

export default function LiveMarqueeTicker() {
    const [messages] = useState(() => {
        const saved = localStorage.getItem('portfolio_guestbook');
        if (saved) {
            try { return JSON.parse(saved); } catch { return []; }
        }
        return [
            { 
                id: 1, 
                name: "Tim Rekrutmen", 
                message: "Keren banget portofolionya, interaktif dan rapi!", 
                time: "Baru saja",
                avatar: "rocket",
                reactions: { fire: 5, like: 12, lightning: 3 }
            }
        ];
    });

    const renderAvatarIcon = (avatarId, className = "w-3.5 h-3.5") => {
        switch (avatarId) {
            case 'bot': return <Bot className={className} />;
            case 'rocket': return <Rocket className={className} />;
            case 'shield': return <Shield className={className} />;
            case 'terminal': return <Terminal className={className} />;
            default: return <Code className={className} />;
        }
    };

    if (messages.length === 0) return null;

    // Duplikat array pesan agar perputaran animasi infinite marquee berjalan mulus tanpa jeda kosong
    const duplicatedMessages = [...messages, ...messages];

    return (
        <div className="w-full max-w-5xl mx-auto px-6 pt-24 pb-4">
            {/* Kontainer utama diletakkan di bawah navbar dengan gaya melayang minimalis */}
            <div className="bg-white/80 dark:bg-[#1E1E20]/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden py-2.5 relative flex items-center">
                
                {/* Label Indikator Live di Sebelah Kiri (Fix tidak ikut bergeser) */}
                <div className="absolute left-0 z-20 bg-gradient-to-r from-white dark:from-[#1E1E20] via-white dark:via-[#1E1E20] to-transparent pl-4 pr-6 py-2 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-[#1A73E8]" /> Live Stream:
                    </span>
                </div>

                {/* Area Konten yang Bergerak Horizontal */}
                <div className="overflow-hidden whitespace-nowrap w-full pl-32">
                    <div className="animate-marquee flex items-center gap-4">
                        {duplicatedMessages.map((m, index) => (
                            <div 
                                key={`${m.id}-${index}`} 
                                className="inline-flex items-center gap-2.5 bg-gray-50 dark:bg-black/40 px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs shrink-0 shadow-2xs"
                            >
                                <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/45 text-[#1A73E8]">
                                    {renderAvatarIcon(m.avatar)}
                                </span>
                                <span className="font-bold text-[#202124] dark:text-white">@{m.name}:</span>
                                <span className="text-gray-600 dark:text-gray-300 max-w-[200px] truncate">{m.message}</span>
                                
                                {/* Ringkasan Reaksi */}
                                <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700 text-[10px] text-gray-400">
                                    <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-500" />{m.reactions?.fire || 0}</span>
                                    <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3 text-blue-500" />{m.reactions?.like || 0}</span>
                                    <span className="flex items-center gap-0.5"><Zap className="w-3 h-3 text-yellow-500" />{m.reactions?.lightning || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}