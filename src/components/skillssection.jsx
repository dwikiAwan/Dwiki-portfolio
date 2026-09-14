import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfoliodata';
import CursorGrid from './reactbits/CursorGrid';

export default function SkillsSection() {
    return (
        <section id="skills" className="py-16 px-6 max-w-6xl mx-auto scroll-mt-28 scroll-mt-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl font-bold text-[#202124]">Google Skills Matrix</h2>
                <p className="text-gray-600 mt-2">Kompetensi teknis yang dikuasai selama studi Teknik Informatika.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {portfolioData.skills.map((group, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-lg transition-all"
                    >
                        <h3 className="font-semibold text-lg text-[#4285F4] mb-4">{group.category}</h3>
                        <div className="flex flex-wrap gap-2">
                            {group.items.map((skill, idx) => (
                                <span key={idx} className="bg-gray-100 text-[#202124] text-sm px-3 py-1.5 rounded-lg font-medium hover:bg-blue-50 hover:text-[#4285F4] transition-colors">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}