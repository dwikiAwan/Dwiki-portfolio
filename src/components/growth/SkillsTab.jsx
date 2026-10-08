import { motion } from 'framer-motion';
import { getIcon } from '../icons';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};


export default function SkillsTab({ skillCategories }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                {skillCategories.map((group, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative rounded-[2rem] p-[2px] bg-[linear-gradient(to_bottom_right,#EA4335,#FBBC05,#34A853,#4285F4)] shadow-lg group"
                    >
                        <div className="bg-surface dark:bg-[#1E1E20] rounded-[calc(2rem-2px)] p-8 h-full flex flex-col justify-between transition-colors duration-300">
                            <div>
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-line dark:border-gray-800">
                                    <span className={`w-3 h-3 rounded-full ${group.dotColor} shadow-sm group-hover:scale-125 transition-transform duration-300`}></span>
                                    <h3 className="font-bold text-xl text-ink dark:text-white tracking-tight">
                                        {group.category}
                                    </h3>
                                </div>

                                <div className="space-y-5">
                                    {group.skills.map(({ name, level, icon }, idx) => {
                                        const Icon = getIcon(icon);
                                        return (
                                            <div key={idx} className="space-y-1.5">
                                                <div className="flex justify-between items-center text-sm font-semibold text-ink dark:text-gray-200">
                                                    <span className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                                                        {name}
                                                    </span>
                                                    <span className={`text-xs font-extrabold ${group.textColor}`}>
                                                        {level}%
                                                    </span>
                                                </div>

                                                <div className="w-full bg-surface-2 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${level}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                                        className={`h-full rounded-full bg-gradient-to-r ${group.accentColor}`}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-line dark:border-gray-800/80 flex items-center justify-between text-xs text-ink-3 dark:text-gray-500 font-mono">
                                <span>Core Competency</span>
                                <span>Verified</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}