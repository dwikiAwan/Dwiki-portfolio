import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfoliodata';
import CursorGrid from './reactbits/CursorGrid';

export default function SkillsAnalytics() {
  return (
    <section id="skills" className="py-16 px-6 max-w-6xl mx-auto scroll-mt-28 scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-xs font-bold text-[#4285F4] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">Google Skills Analytics</span>
        <h2 className="text-3xl font-bold text-[#202124] mt-3">Metrik Penguasaan Teknologi</h2>
        <p className="text-gray-600 mt-2">Tingkat kompetensi teknis berdasarkan jam terbang studi dan proyek.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-xs">
        {portfolioData.skills.map((skill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-[#202124]">
              <span>{skill.name}</span>
              <span className="text-[#4285F4]">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-[#4285F4] h-full rounded-full"
              ></motion.div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}