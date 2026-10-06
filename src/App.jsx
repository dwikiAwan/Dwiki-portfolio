import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleFinish = useCallback(() => setIsLoading(false), []);
  // Grid animasi penuh-halaman dimatikan di mobile & saat reduce-motion aktif
  const showGrid = true;

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <Router>
      {isLoading && <LoadingScreen onFinish={handleFinish} />}

      <div className="relative min-h-screen bg-[#F8F9FA] dark:bg-[#121212] text-[#202124] dark:text-white font-sans overflow-x-clip transition-colors duration-300 flex flex-col justify-between">

        {/* Background ShapeGrid konsisten di semua halaman */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-70 dark:opacity-35 transition-colors duration-500">
          {showGrid && <ShapeGrid
            squareSize={100}
            speed={0.2}
            direction="right"
            borderColor={isDarkMode ? "#34A853" : "#3683e9"}
            hoverFillColor={isDarkMode ? "#0D652D33" : "#E8F0FE"}
            shape="square"
            hoverTrailAmount={4}
          />}
        </div>

        {/* Konten Utama & Navigasi */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          
          {/* Bagian ini yang mengatur agar halaman berganti secara bersih */}
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
          <footer className="relative mt-20 overflow-hidden bg-white/60 dark:bg-[#1A1A1A]/60 backdrop-blur-xs transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#34A853] to-transparent animate-pulse"></div>
            
            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              © 2026 Dwiki Kurniawan • Built with React, Tailwind CSS & Google Style
            </div>
          </footer>
        </div>
  <FloatingTerminal />
      </div>
    </Router>
  );
}