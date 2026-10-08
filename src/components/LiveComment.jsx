import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, TriangleAlert, X, ChevronDown } from 'lucide-react';
import { AVATARS } from '../data/avatars';
import Avatar from './Avatar';
import { useFloatingDock } from '../hooks/useFloatingDock';
import useGuestbook, { LIMITS } from '../hooks/useGuestbook';

const BORDER = 'animate-border-run bg-[linear-gradient(270deg,#4285F4,#34A853,#FBBC05,#EA4335,#4285F4)] shadow-2xl';

export default function LiveComment() {
    const { messages, addMessage } = useGuestbook();
    const { chatOpen, setChatOpen, closeChat } = useFloatingDock();
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('code');
    const [errorMsg, setErrorMsg] = useState('');
    const chatRef = useRef(null);

    // Feed chat: pesan terlama di atas, terbaru di bawah
    const feed = [...messages].reverse();

    useEffect(() => {
        if (chatOpen && chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages, chatOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        const err = await addMessage(name, text, selectedAvatar);
        setErrorMsg(err || '');
        if (!err) { setText(''); setSelectedAvatar('code'); }
    };

    if (!chatOpen) {
        return (
            <div className={`fixed bottom-6 right-6 z-50 p-[2px] rounded-full ${BORDER}`}>
                <motion.button
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={setChatOpen} aria-label="Open Live Chat"
                    className="bg-[#121212] text-white px-5 py-3.5 rounded-full flex items-center gap-2 cursor-pointer shadow-inner"
                >
                    <MessageSquare className="w-5 h-5 text-[#4285F4]" />
                    <span className="text-xs font-bold pr-1">Live Chat</span>
                </motion.button>
            </div>
        );
    }

    return (
        // Di layar sempit panel chat melebar sampai hampir tepi kiri, jadi ia
        // diangkat keluar dari baris tombol CLI (yang tetap bisa diklik).
        <div className={`fixed bottom-[5.25rem] right-4 sm:bottom-6 sm:right-6 z-50 p-[2px] rounded-[22px] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)] ${BORDER}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-80 max-w-full bg-[#18181b] text-white rounded-[20px] overflow-hidden flex flex-col h-[min(480px,calc(100dvh-8rem))] sm:h-[480px] sm:max-h-[75vh]"
            >
                <div className="bg-[#202023] px-4 py-3 flex items-center justify-between border-b border-gray-800">
                    <span className="text-xs font-bold text-gray-200 flex items-center gap-1 select-none">
                        Guest chat <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 text-[10px] font-bold">LIVE</span>
                        <button onClick={closeChat} className="text-gray-400 hover:text-white transition-colors cursor-pointer" aria-label="Close Chat">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {errorMsg && (
                    <div role="alert" className="mx-3 mt-2 p-2 bg-red-950/80 border border-red-800 text-red-300 text-[10px] rounded-lg flex items-start gap-1.5">
                        <TriangleAlert className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar text-xs">
                    {feed.map((m) => (
                        <div key={m.id} className="flex items-start gap-2.5 leading-relaxed">
                            <div className="p-1.5 rounded-full bg-gray-800 text-[#34A853] shrink-0 mt-0.5"><Avatar id={m.avatar} className="w-3.5 h-3.5" /></div>
                            <div className="overflow-hidden break-words">
                                <span className="font-semibold text-gray-400 mr-2">@{m.name}</span>
                                <span className="text-gray-200">{m.message}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-3 bg-[#202023] border-t border-gray-800">
                    <form onSubmit={handleSend} className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between gap-1">
                            {AVATARS.map((item) => (
                                <button type="button" key={item.id} onClick={() => setSelectedAvatar(item.id)} title={item.label} aria-label={item.label}
                                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                                        selectedAvatar === item.id ? 'bg-primary text-white border-primary scale-105 shadow-md' : 'bg-[#121212] text-gray-400 border-gray-700 hover:bg-gray-800'
                                    }`}>
                                    <Avatar id={item.id} className="w-3.5 h-3.5" />
                                </button>
                            ))}
                        </div>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama / Panggilan..." maxLength={LIMITS.name} required aria-label="Nama"
                            className="w-full bg-[#121212] text-xs px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-accent text-white" />
                        <div className="flex items-center gap-2">
                            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Mulai chat di sini..." maxLength={LIMITS.message} required aria-label="Pesan"
                                className="flex-1 min-w-0 bg-[#121212] text-xs px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-accent text-white" />
                            <button type="submit" aria-label="Send Message" className="bg-primary hover:bg-primary-hover p-2 rounded-xl text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer">
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
