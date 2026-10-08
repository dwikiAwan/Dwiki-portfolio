import { motion } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';

export default function ProjectCard({ project, index = 0, onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -10, rotate: [0, -1.5, 1.5, -1, 0], transition: { duration: 0.5, ease: 'easeInOut' } }}
            className="relative rounded-[2.5rem] p-[2px] bg-[linear-gradient(to_bottom_right,#EA4335,#FBBC05,#34A853,#4285F4)] shadow-lg flex flex-col group cursor-pointer"
            onClick={onClick}
        >
            <div className="bg-surface dark:bg-[#1E1E20] rounded-[calc(2.5rem-2px)] p-8 flex flex-col justify-between h-full transition-colors duration-300">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold px-3 py-1 bg-accent-wash dark:bg-blue-950/40 text-accent dark:text-[#8AB4F8] border border-accent-line dark:border-blue-900 rounded-full">
                            {project.category || 'Web'}
                        </span>
                        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                            {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub Repository" className="text-ink-3 hover:text-black dark:hover:text-white">
                                    <Code className="w-4 h-4" />
                                </a>
                            )}
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label="Live Demo" className="text-ink-3 hover:text-accent">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-ink dark:text-white mb-3 group-hover:text-accent dark:group-hover:text-[#8AB4F8] transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-ink-2 dark:text-[#9AA0A6] text-sm leading-relaxed mb-6 line-clamp-3">
                        {project.description}
                    </p>
                </div>
                <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.techStack?.map((t) => (
                            <span key={t} className="bg-surface-2 dark:bg-gray-800 text-ink dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-lg border border-line dark:border-gray-700">
                                {t}
                            </span>
                        ))}
                    </div>
                    <div className="inline-flex items-center text-sm font-semibold text-accent dark:text-[#8AB4F8] group-hover:translate-x-1 transition-transform">
                        Lihat Detail &rarr;
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
