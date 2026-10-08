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
import { FloatingDockProvider } from './hooks/useFloatingDock.jsx';

const readGridColors = () => {
  const styles = getComputedStyle(document.documentElement);
  return {
    border: styles.getPropertyValue('--color-grid').trim() || '#4285f4',
    fill: styles.getPropertyValue('--color-grid-fill').trim() || '#eaf0f9',
  };
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const handleFinish = useCallback(() => setIsLoading(false), []);
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
          <footer className="relative mt-20 overflow-hidden bg-surface/60 dark:bg-[#1A1A1A]/60 border-t border-line dark:border-gray-800 backdrop-blur-xs transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#34A853] to-transparent animate-pulse"></div>
            
            <div className="py-8 text-center text-sm text-ink-3 dark:text-gray-400">
              © 2026 Dwiki Kurniawan • Built with React, Tailwind CSS & Google Style
            </div>
          </footer>
        </div>

        <FloatingTerminal />
      </div>
      </FloatingDockProvider>
    </Router>
  );
}