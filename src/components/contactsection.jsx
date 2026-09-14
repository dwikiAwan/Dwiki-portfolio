import { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfoliodata';
import CursorGrid from './reactbits/CursorGrid';

export default function ContactSection() {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(portfolioData.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="contact" className="py-16 px-6 max-w-4xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm"
            >
                <span className="text-xs font-bold text-[#4285F4] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">Get In Touch</span>
                <h2 className="text-3xl font-bold text-[#202124] mt-3">Mari Terhubung & Berkolaborasi</h2>
                <p className="text-gray-600 mt-2 max-w-lg mx-auto text-sm">
                    Terbuka untuk peluang kerja sebagai Software Engineer, kolaborasi proyek teknologi, atau diskusi seputar pengembangan web.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <a
                        href={`mailto:${portfolioData.email}`}
                        className="bg-[#4285F4] hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-xl shadow-sm transition-all text-sm w-full sm:w-auto"
                    >
                        Kirim Email Langsung
                    </a>
                    <button
                        onClick={handleCopyEmail}
                        className="bg-gray-100 hover:bg-gray-200 text-[#202124] font-medium px-6 py-3 rounded-xl transition-all text-sm w-full sm:w-auto"
                    >
                        {copied ? '✅ Email Berhasil Disalin!' : '📋 Salin Alamat Email'}
                    </button>
                </div>
            </motion.div>
        </section>
    );
}