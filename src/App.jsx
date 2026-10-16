import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import TerminalShell from './pages/TerminalShell';
import ProjectsPage from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ShapeGrid from './components/reactbits/ShapeGrid';
import LoadingScreen from './components/LoadingScreen';
import FloatingTerminal from './components/FloatingTerminal';
import { FloatingDockProvider } from './hooks/useFloatingDock.jsx';

const readGridColors = () => {
  const styles = getComputedStyle(document.documentElement);
  return {
    border: styles.getPropertyValue('--color-grid').trim() || '#4285f4',
    fill: styles.getPropertyValue('--color-grid-fill').trim() || '#eaf0f9',
  };
};

// Dinding sponsor: tool yang membangun situs ini (slug Simple Icons, nama untuk tooltip).
const FOOTER_LOGOS = [
  ['react', 'React', 'https://react.dev'],
  ['tailwindcss', 'Tailwind CSS', 'https://tailwindcss.com'],
  ['vite', 'Vite', 'https://vite.dev'],
  ['vercel', 'Vercel', 'https://vercel.com'],
  ['cloudflare', 'Cloudflare', 'https://cloudflare.com'],
  ['firebase', 'Firebase', 'https://firebase.google.com'],
  ['framer', 'Framer Motion', 'https://www.framer.com/motion/'],
  ['reactrouter', 'React Router', 'https://reactrouter.com'],
  ['lucide', 'Lucide', 'https://lucide.dev'],
  ['threedotjs', 'Three.js', 'https://threejs.org'],
  ['/logos/idwebhosting.png', 'IDWebHosting', 'https://idwebhost.com'],
];

const logoSrc = (key) => (key.startsWith('/') ? key : `https://cdn.simpleicons.org/${key}`);

function FooterLogo({ src, name, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={name}
      aria-label={name}
      className="rounded-xl p-[2px] bg-[linear-gradient(270deg,#4285F4,#34A853,#FBBC05,#EA4335,#4285F4)] animate-border-run shadow-md"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-gray-200">
        {/* Inisial hanya terlihat kalau file logonya gagal dimuat */}
        <span className="text-[10px] font-black text-[#0b4bd8]">{name.slice(0, 3).toUpperCase()}</span>
        <img
          src={logoSrc(src)}
          alt=""
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute h-6 w-6 rounded-md bg-gray-200 object-contain p-0.5"
        />
      </span>
    </a>
  );
}

// Loading screen .
const BOOT_KEY = 'dwekfolio:booted';
const hasVisited = () => {
  try { return sessionStorage.getItem(BOOT_KEY) === '1'; } catch { return false; }
};

// refresh scroll per halaman
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(() => !hasVisited());
  const handleFinish = useCallback(() => {
    try { sessionStorage.setItem(BOOT_KEY, '1'); } catch { /* storage diblokir: abaikan */ }
    setIsLoading(false);
  }, []);
  const [gridColors, setGridColors] = useState(readGridColors);

  // hijau di dark.
  useEffect(() => {
    const sync = () => setGridColors(readGridColors());
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    sync();
    return () => observer.disconnect();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <FloatingDockProvider>
      {isLoading && <LoadingScreen onFinish={handleFinish} />}

      <div className="relative min-h-screen bg-page dark:bg-[#121212] text-ink dark:text-white font-sans overflow-x-clip transition-colors duration-300 flex flex-col justify-between">

        {/* Background ShapeGrid*/}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-70 dark:opacity-35 transition-colors duration-500">
          <ShapeGrid
            squareSize={100}
            speed={14}
            direction="right"
            borderColor={gridColors.border}
            hoverFillColor={gridColors.fill}
            shape="square"
            hoverTrailAmount={3}
            trailFade={1.6}
          />
        </div>

        {/* Konten Utama & Navigasi */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          
          {/* Konten Halaman */}
          <div className="flex-grow pt-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terminal" element={<TerminalShell />} />
            </Routes>
          </div>
          
          {/* Footer */}
          <footer className="relative mt-20 bg-surface/60 dark:bg-[#1A1A1A]/60 border-t border-line dark:border-gray-800 backdrop-blur-xs transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#34A853] to-transparent animate-pulse"></div>

            <div className="py-6 px-6 flex flex-col items-center gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-3 dark:text-gray-500">Built with</span>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
                {FOOTER_LOGOS.map(([src, name, url]) => (
                  <FooterLogo key={src} src={src} name={name} url={url} />
                ))}
              </div>
            </div>
          </footer>
        </div>

        <FloatingTerminal />
      </div>
      </FloatingDockProvider>
    </Router>
  );
}