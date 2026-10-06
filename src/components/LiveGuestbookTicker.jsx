import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Flame, ThumbsUp, Zap } from 'lucide-react';

export default function LiveGuestbookTicker() {
    // Lazy initialization untuk membaca localStorage tanpa useEffect
    const [messages] = useState(() => {
        const savedMessages = localStorage.getItem('portfolio_guestbook');
        if (savedMessages) {
            try {
                return JSON.parse(savedMessages);
            } catch {
                return [];
            }
        }
        return [
            { 
                id: 1, 
                name: "Tim Rekrutmen", 
                message: "Keren banget portofolionya, interaktif dan rapi!", 
                time: "Baru saja",
                reactions: { fire: 5, like: 12, lightning: 3 }
            }
        ];
    });

    if (messages.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto px-6 my-8">
            <div className="bg-white/70 dark:bg-[#1E1E20]/70 backdrop-blur-md rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden">
                
                {/* Header Ticker */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-[#1A73E8]" /> Live Visitor Feed (YouTube Chat Style)
                        </span>
                    </div>
                    <span className="text-xs text-gray-400">Total: {messages.length} pesan</span>
                </div>

                {/* Kontainer Live Stream / Ticker Cards */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                    {messages.map((m) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={m.id} 
                            className="min-w-[280px] max-w-[280px] bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shrink-0 shadow-xs flex flex-col justify-between space-y-2"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-[#1A73E8] truncate">@{m.name}</span>
                                    <span className="text-[10px] text-gray-400 font-mono">{m.time}</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{m.message}</p>
                            </div>

                            {/* Badge Reaksi Ringkas */}
                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500">
                                <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> {m.reactions?.fire || 0}</span>
                                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-blue-500" /> {m.reactions?.like || 0}</span>
                                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> {m.reactions?.lightning || 0}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}