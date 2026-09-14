import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfoliodata';
import CursorGrid from './reactbits/CursorGrid';

export default function AcademicSection() {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-32">
      {/* Skripsi S1 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between"
      >
        <div>
          <span className="text-xs font-bold text-[#EA4335] bg-red-50 px-3 py-1 rounded-full">S1 Thesis / Tugas Akhir</span>
          <h3 className="text-xl font-bold text-[#202124] mt-4 mb-2">{portfolioData.thesis.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{portfolioData.thesis.description}</p>
        </div>
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {portfolioData.thesis.tech.map((t, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium">{t}</span>
            ))}
          </div>
          <span className="text-xs font-semibold text-[#34A853] bg-green-50 px-3 py-1 rounded-md inline-block">
            {portfolioData.thesis.status}
          </span>
        </div>
      </motion.div>

      {/* Sertifikasi & Growth Badges */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between"
      >
        <div>
          <span className="text-xs font-bold text-[#FBBC05] bg-yellow-50 px-3 py-1 rounded-full">Skills & Certifications</span>
          <h3 className="text-xl font-bold text-[#202124] mt-4 mb-4">Lencana & Kredensial</h3>
          <div className="space-y-4">
            {portfolioData.certifications.map((cert, index) => (
              <div key={index} className="border-l-4 border-[#4285F4] pl-4 py-1">
                <h4 className="font-semibold text-[#202124] text-sm">{cert.title}</h4>
                <p className="text-xs text-gray-500">{cert.issuer} • {cert.year}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">🚀 Sedang Dipelajari (Currently Learning):</p>
          <div className="flex flex-wrap gap-1.5">
            {portfolioData.currentlyLearning.map((item, idx) => (
              <span key={idx} className="text-xs bg-blue-50 text-[#4285F4] px-2.5 py-1 rounded-md font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}