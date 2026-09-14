import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfoliodata';
import profileImg from '../assets/profile.png';
import CursorGrid from './reactbits/CursorGrid';
import BlurText from './reactbits/blurtext';

export default function Hero() {
    return (
        <div id="hero" className="pt-32 md:pt-30" scroll-mt-32> { }
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative py-16 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xs my-6"
            >
                <CursorGrid color="#4285F4" maxOpacity={0.5} radius={130} gridOpacity={0.04} />

                <div className="relative z-10 flex-1 text-center md:text-left">
                    <span className="bg-blue-50 text-[#4285F4] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 inline-block border border-blue-100 shadow-xs">
                        Google Growth & Skills Inspired Portfolio
                    </span>

                    <div className="mt-2">
                        <BlurText
                            text={`Halo, Saya ${portfolioData.name}`}
                            delay={120}
                            className="text-4xl md:text-5xl font-extrabold text-[#202124] tracking-tight"
                        />
                    </div>

                    <p className="text-lg text-gray-600 mt-4 max-w-xl">
                        {portfolioData.tagline}
                    </p>

                    <div className="mt-8 flex gap-4 justify-center md:justify-start">
                        <a href="#projects" className="bg-[#4285F4] hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-xl shadow-sm transition-all hover:scale-105">
                            Lihat Proyek
                        </a>
                        <a href="#skills" className="bg-gray-100 hover:bg-gray-200 text-[#202124] font-medium px-6 py-3 rounded-xl transition-all hover:scale-105">
                            Eksplor Skills
                        </a>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative z-10 flex-shrink-0"
                >
                    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-tr from-[#4285F4] via-[#34A853] to-[#FBBC05] p-1">
                        <img
                            src={profileImg}
                            alt={portfolioData.name}
                            className="w-full h-full object-cover rounded-full bg-white"
                        />
                    </div>
                </motion.div>
            </motion.section>
        </div>
    );
}