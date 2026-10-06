import Hero from '../components/hero';
import About from '../components/About';
import Growth from '../components/Growth';
import ProjectsSection from '../components/projectssection';
import ContactSection from '../components/contactsection';
import LiveComment from '../components/LiveComment'; // <--- Impor widget chat melayang

export default function Home() {
    return (
        <div className="flex flex-col space-y-12 md:space-y-20 relative">
            <section className="min-h-[85vh] flex items-center justify-center">
                <Hero />
            </section>
            
            <section id="about" className="min-h-screen flex items-center justify-center">
                <About />
            </section>
            
            <section className="min-h-screen flex items-center justify-center">
                <Growth />
            </section>
            
            <section className="min-h-screen flex items-center justify-center">
                <ProjectsSection />
            </section>
            
            <section className="min-h-screen flex items-center justify-center">
                <ContactSection />
            </section>

            {/* Widget YouTube Live Chat Melayang (Fixed di Pojok Kanan Bawah Halaman Home) */}
            <LiveComment />
        </div>
    );
}