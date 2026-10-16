import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { getIcon } from '../icons';

// Dinding logo: semua skill digabung jadi satu daftar tanpa kategori, tanpa card,
// melayang langsung di atas ShapeGrid.
export default function SkillsTab({ skillCategories }) {
    // Susun round-robin per kategori supaya urutannya bercampur, bukan dikelompokkan.
    const rows = [];
    skillCategories.forEach((c) => c.skills.forEach((s, i) => { rows[i] = rows[i] ? [...rows[i], s] : [s]; }));
    const skills = rows.flat();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl mx-auto px-6 py-10"
        >
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-x-4 gap-y-9">
                {skills.map(({ name, icon, slug, url }) => {
                    const Icon = getIcon(icon);
                    const mark = slug ? (
                        <img
                            src={`https://cdn.simpleicons.org/${slug}`}
                            alt=""
                            loading="lazy"
                            className="w-8 h-8 shrink-0"
                        />
                    ) : (
                        <Icon className="w-8 h-8 shrink-0 text-ink-3 dark:text-gray-400" aria-hidden="true" />
                    );

                    if (!url) {
                        return (
                            <span key={name} className="flex flex-col items-center gap-2.5 text-center text-sm font-semibold text-ink-3 dark:text-gray-400">
                                {mark}{name}
                            </span>
                        );
                    }
                    return (
                        <a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/tech flex flex-col items-center gap-2.5 text-center text-sm font-semibold text-ink-2 dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                        >
                            {mark}
                            {name}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover/tech:opacity-60 transition-opacity" aria-hidden="true" />
                        </a>
                    );
                })}
            </div>
        </motion.div>
    );
}