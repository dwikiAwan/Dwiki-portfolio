import { useState } from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import SkillsAnalytics from './components/skillsanalytics';
import AcademicSection from './components/academicsection';
import GrowthJourney from './components/growthjourney';
import ProjectsSection from './components/projectssection';
import ContactSection from './components/contactsection';
import ShapeGrid from './components/reactbits/ShapeGrid';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Tampilkan Loading Screen saat pertama kali dimuat */}
      {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}

      {/* Konten Utama Portofolio */}
      <div className="relative min-h-screen bg-[#F8F9FA] text-[#202124] font-sans overflow-hidden">

        {/* Background Utama ShapeGrid */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-70">
          <ShapeGrid
            squareSize={60}
            speed={0.6}
            direction="right"
            borderColor="#E2E8F0"
            hoverFillColor="#E8F0FE"
            shape="square"
            hoverTrailAmount={4}
          />
        </div>

        {/* Seluruh Konten Website */}
        <div className="relative z-10">
          <Navbar />
          <Hero />
          <SkillsAnalytics />
          <AcademicSection />
          <GrowthJourney />
          <ProjectsSection />
          <ContactSection />
          <footer className="py-8 text-center text-sm text-gray-500 border-t border-gray-200 mt-20 bg-white/60 backdrop-blur-xs">
            © 2026 Dwiki Kurniawan, S.Kom. • Built with React, Tailwind CSS & Google Style
          </footer>
        </div>

      </div>
    </>
  );
}