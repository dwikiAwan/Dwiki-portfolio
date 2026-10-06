import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, X, ChevronDown, Code, Bot, Rocket, Shield, Terminal } from 'lucide-react';

export default function LiveComment() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
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

    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('code'); // State untuk pilihan ikon profil
    const [errorMsg, setErrorMsg] = useState('');
    const chatContainerRef = useRef(null);

    // Daftar pilihan ikon/avatar
    const avatarList = [
        { id: 'code', icon: Code, label: 'Coder' },
        { id: 'bot', icon: Bot, label: 'Bot' },
        { id: 'rocket', icon: Rocket, label: 'Rocket' },
        { id: 'shield', icon: Shield, label: 'Shield' },
        { id: 'terminal', icon: Terminal, label: 'Terminal' },
    ];

    // Helper untuk merender ikon berdasarkan string avatar
    const renderAvatarIcon = (avatarId, className = "w-3.5 h-3.5") => {
        switch (avatarId) {
            case 'bot': return <Bot className={className} />;
            case 'rocket': return <Rocket className={className} />;
            case 'shield': return <Shield className={className} />;
            case 'terminal': return <Terminal className={className} />;
            default: return <Code className={className} />;
        }
    };

    // Sinkronisasi dengan localStorage
    useEffect(() => {
        localStorage.setItem('portfolio_guestbook', JSON.stringify(messages));
    }, [messages]);

    // Auto scroll ke bawah saat ada pesan baru
    useEffect(() => {
        if (isOpen && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Fungsi sanitasi ketat untuk mencegah XSS / Malware
    const sanitizeInput = (input) => {
        return input
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/["']/g, "")
            .replace(/[/\\]/g, "")
            .trim();
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        
        const cleanName = sanitizeInput(name);
        const cleanText = sanitizeInput(text);

        if (!cleanName || !cleanText) {
            setErrorMsg('Nama/pesan tidak boleh kosong atau mengandung karakter terlarang!');
            return;
        }

        if (cleanName.length > 25 || cleanText.length > 150) {
            setErrorMsg('Nama maksimal 25 karakter & pesan maksimal 150 karakter.');
            return;
        }

        setErrorMsg('');
        const newMessage = {
            id: Date.now(),
            name: cleanName,
            message: cleanText,
            time: "Baru saja",
            avatar: selectedAvatar, // Menyimpan ikon yang dipilih
            reactions: { fire: 0, like: 0, lightning: 0 }
        };

        setMessages([...messages, newMessage]);
        setText('');
        setSelectedAvatar('code');
    };

    // Tombol Mengapung dengan Efek Electric Glow
    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50 p-[2px] rounded-full animate-border-run bg-[linear-gradient(270deg,#4285F4,#34A853,#FBBC05,#EA4335,#4285F4)] shadow-2xl">
                <motion.button 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-[#121212] text-white px-5 py-3.5 rounded-full transition-transform flex items-center gap-2 cursor-pointer shadow-inner"
                    aria-label="Open Live Chat"
                >
                    <MessageSquare className="w-5 h-5 text-[#4285F4]" />
                    <span className="text-xs font-bold pr-1">Live Chat</span>
                </motion.button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 p-[2px] rounded-[22px] animate-border-run bg-[linear-gradient(270deg,#4285F4,#34A853,#FBBC05,#EA4335,#4285F4)] shadow-2xl">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-80 sm:w-88 bg-[#18181b] dark:bg-[#121212] text-white rounded-[20px] overflow-hidden flex flex-col h-[480px]"
            >
                {/* Header ala YouTube Live Chat */}
                <div className="bg-[#202023] px-4 py-3 flex items-center justify-between border-b border-gray-800">
                    <div className="flex items-center gap-2 select-none">
                        <span className="text-xs font-bold text-gray-200 flex items-center gap-1">
                            Top chat <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 text-[10px] font-bold">LIVE</span>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Close Chat"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Notifikasi Error Validasi */}
                {errorMsg && (
                    <div className="mx-3 mt-2 p-2 bg-red-950/80 border border-red-800 text-red-300 text-[10px] rounded-lg">
                        ⚠️ {errorMsg}
                    </div>
                )}

                {/* Area Daftar Pesan (Vertical Scroll / Feed) */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar text-xs"
                >
                    {messages.map((m) => (
                        <div key={m.id} className="flex items-start gap-2.5 leading-relaxed">
                            <div className="p-1.5 rounded-full bg-gray-800 text-[#34A853] shrink-0 mt-0.5">
                                {renderAvatarIcon(m.avatar, "w-3.5 h-3.5")}
                            </div>
                            <div className="overflow-hidden">
                                <span className="font-semibold text-gray-400 mr-2">@{m.name}</span>
                                <span className="text-gray-200">{m.message}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / Kolom Input Chat & Pemilihan Ikon */}
                <div className="p-3 bg-[#202023] border-t border-gray-800">
                    <form onSubmit={handleSendMessage} className="flex flex-col gap-2.5">
                        
                        {/* Pilihan Ikon Profil Mini */}
                        <div className="flex items-center justify-between gap-1">
                            {avatarList.map((item) => {
                                const IconComp = item.icon;
                                const isSelected = selectedAvatar === item.id;
                                return (
                                    <button
                                        type="button"
                                        key={item.id}
                                        onClick={() => setSelectedAvatar(item.id)}
                                        title={item.label}
                                        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                                            isSelected 
                                                ? 'bg-[#1A73E8] text-white border-[#1A73E8] scale-105 shadow-md' 
                                                : 'bg-[#121212] text-gray-400 border-gray-700 hover:bg-gray-800'
                                        }`}
                                    >
                                        <IconComp className="w-3.5 h-3.5" />
                                    </button>
                                );
                            })}
                        </div>

                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nama / Panggilan..."
                            maxLength={25}
                            className="w-full bg-[#121212] text-xs px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-[#1A73E8] text-white"
                            required
                        />
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Mulai chat disini..."
                                maxLength={150}
                                className="flex-1 bg-[#121212] text-xs px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-[#1A73E8] text-white"
                                required
                            />
                            <button 
                                type="submit" 
                                className="bg-[#1A73E8] hover:bg-blue-600 p-2 rounded-xl text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                                aria-label="Send Message"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}