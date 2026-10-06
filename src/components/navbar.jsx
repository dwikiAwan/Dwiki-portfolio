import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GooeyNav from './reactbits/GooeyNav';

export default function Navbar() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false;
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark');
            return true;
        }
        return false;
    });

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    const navItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/#about" },
        { label: "Growth", href: "/#growth" },
        { label: "Projects", href: "/projects" },
        { label: "Blog", href: "/blog" },
        { label: "CLI", href: "/terminal" },
        { label: "Contact", href: "/contact" },
    ];

    const handleMobileNavClick = (href) => {
        setMobileMenuOpen(false);
        if (href === '/') {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href.startsWith('/#')) {
            const elementId = href.replace('/#', '');
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    const el = document.getElementById(elementId);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 150);
            } else {
                const el = document.getElementById(elementId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(href);
        }
    };

    return (
        <>
            <style>{`
                @keyframes borderRun {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-border-run {
                    background-size: 200% 200%;
                    animation: borderRun 3s ease infinite;
                }
            `}</style>

            {/* Navbar Utama*/}
            <nav className={`fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl p-[2px] rounded-[26px] shadow-2xl transition-colors duration-500 animate-border-run ${
    isDarkMode 
        ? 'bg-[linear-gradient(270deg,#10B981,#34D399,#FBBF24,#FFFFFF,#34D399,#10B981)]' 
        : 'bg-[linear-gradient(270deg,#C5221F,#EA4335,#FBBC05,#EA4335,#C5221F)]'
}`}>
                <div className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-[24px] px-6 py-2.5 flex items-center justify-between transition-colors duration-300">
                    
                    {/* Logo / Nama */}
                    <div 
                        onClick={() => navigate('/')} 
                        className="font-bold text-base md:text-lg text-[#202124] dark:text-white flex items-center gap-2 cursor-pointer transition-colors duration-300"
                    >
                        <span className={`w-3 h-3 rounded-full inline-block transition-colors duration-300 ${isDarkMode ? 'bg-[#34A853]' : 'bg-[#4285F4]'}`}></span>
                        <span>d'wick.port</span>
                    </div>

                    {/* GooeyNav untuk Layar Besar (Desktop) */}
                    <div className="hidden lg:block">
                        <GooeyNav
                            items={navItems}
                            particleCount={12}
                            particleDistances={[70, 10]}
                            particleR={80}
                            initialActiveIndex={0}
                            animationTime={500}
                            timeVariance={200}
                            colors={[1, 2, 3, 4]}
                        />
                    </div>

                    {/* Aksi Kanan: Tombol Dark Mode & Tombol Hamburger (HP) */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center shadow-xs"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? '🌙' : '☀️'}
                        </button>

                        {/* Tombol Garis 3 (Hamburger) khusus untuk Layar HP / Mobile */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center shadow-xs"
                            aria-label="Toggle Mobile Menu"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Dropdown Menu HP (Tampil jika mobileMenuOpen true) */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-2 bg-white/95 dark:bg-[#1E1E20]/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col space-y-2 transition-all">
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleMobileNavClick(item.href)}
                                className="text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#202124] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </nav>
        </>
    );
}