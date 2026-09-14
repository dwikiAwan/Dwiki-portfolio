import { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfoliodata';

export default function ProjectsSection() {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Frontend', 'Fullstack', 'Data'];

  const filteredProjects = filter === 'All' 
    ? portfolioData.projects 
    : portfolioData.projects.filter(p => p.category === filter);

  return (
      <section id="projects" className="py-16 px-6 max-w-6xl mx-auto scroll-mt-28 scroll-mt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <span className="text-xs font-bold text-[#34A853] bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">Project Portfolio</span>
        <h2 className="text-3xl font-bold text-[#202124] mt-3">Featured Projects</h2>
        <p className="text-gray-600 mt-2">Hasil implementasi kode dan sistem yang dibangun selama studi.</p>
      </motion.div>

      {/* Tombol Filter Kategori */}
      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat 
                ? 'bg-[#4285F4] text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-[#4285F4] rounded-md">{project.category}</span>
                <span className="text-xs text-gray-400 font-mono">0{index + 1}</span>
              </div>
              <h3 className="text-lg font-bold text-[#202124] mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{project.description}</p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tech.map((t, idx) => (
                  <span key={idx} className="bg-gray-100 text-[#202124] text-xs font-medium px-2.5 py-1 rounded-md">
                    {t}
                  </span>
                ))}
              </div>
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-sm font-semibold text-[#4285F4] hover:underline"
              >
                Lihat Repository &rarr;
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}