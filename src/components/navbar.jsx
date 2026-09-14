export default function Navbar() {
    const handleScrollTo = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const navbarHeight = 90; // Perkiraan tinggi navbar melayang + jarak aman
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-4xl bg-white/85 backdrop-blur-md border border-gray-200/80 shadow-lg rounded-[20px] px-6 py-3.5 transition-all">
            <div className="flex items-center justify-between">
                {/* Logo / Nama */}
                <div className="font-bold text-base md:text-lg text-[#202124] flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#4285F4] rounded-full inline-block"></span>
                    <span>Dwiki.Portfolio</span>
                </div>

                {/* Menu Navigasi dengan Fungsi Klik Presisi */}
                <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                    <a href="#about" onClick={(e) => handleScrollTo(e, 'about')} className="hover:text-[#4285F4] transition-colors cursor-pointer">About</a>
                    <a href="#skills" onClick={(e) => handleScrollTo(e, 'skills')} className="hover:text-[#4285F4] transition-colors cursor-pointer">Skills</a>
                    <a href="#growth" onClick={(e) => handleScrollTo(e, 'growth')} className="hover:text-[#4285F4] transition-colors cursor-pointer">Growth</a>
                    <a href="#projects" onClick={(e) => handleScrollTo(e, 'projects')} className="hover:text-[#4285F4] transition-colors cursor-pointer">Projects</a>
                    <a href="#contact" onClick={(e) => handleScrollTo(e, 'contact')} className="hover:text-[#4285F4] transition-colors cursor-pointer">Contact</a>
                </div>
            </div>
        </nav>
    );
}