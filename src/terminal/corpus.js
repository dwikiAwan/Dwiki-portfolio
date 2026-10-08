/**
 * Korpus data untuk mesin pencari & perintah terminal.
 *
 * Prinsip: ini satu-satunya tempat yang tahu "data apa saja yang ada di
 * proyek". Semua dokumen diturunkan dari sumber aslinya (src/data,
 * src/config, routing aplikasi), jadi tidak ada duplikasi yang bisa basi.
 */

import { portfolioData } from '../data/portfoliodata';
import { articles } from '../data/articles';
import { AVATARS } from '../data/avatars';
import { buildIndex } from './search';
import { envReport } from '../config/env';

export const ROUTES = [
    { name: 'home', path: '/', title: 'Beranda', desc: 'Hero, tentang, growth, dan kontak.' },
    { name: 'projects', path: '/projects', title: 'Daftar Proyek', desc: 'Grid seluruh proyek.' },
    { name: 'blog', path: '/blog', title: 'Blog', desc: 'Artikel tulisan sendiri + feed dev.to real-time.' },
    { name: 'contact', path: '/contact', title: 'Kontak', desc: 'Form kontak dan tautan sosial.' },
    { name: 'terminal', path: '/terminal', title: 'Terminal Shell', desc: 'CLI penuh dalam layar penuh.' },
];

export const NAV_KEYS = ROUTES.map((r) => r.name);

const articleText = (a) =>
    (a.content || [])
        .map((block) => {
            if (block.type === 'p' || block.type === 'h') return block.text;
            if (block.type === 'code') return block.text;
            if (block.type === 'list') return (block.items || []).join(' ');
            return '';
        })
        .join(' ');

/** Dokumen untuk satu proyek. */
const projectDocs = () =>
    portfolioData.projects.map((p) => ({
        id: `project:${p.id}`,
        type: 'project',
        title: p.title,
        subtitle: `${p.category} — ${p.description}`,
        tags: [p.category, ...(p.techStack || [])],
        body: [p.description, p.problem, p.solution, (p.techStack || []).join(' ')].join(' '),
        meta: { project: p },
        route: `/projects/${p.id}`,
        hint: `wick project ${p.id}`,
    }));

/** Dokumen untuk tiap skill, dikelompokkan per kategori. */
const skillDocs = () =>
    portfolioData.skillCategories.flatMap((c) =>
        c.skills.map((s) => ({
            id: `skill:${c.category}:${s.name}`,
            type: 'skill',
            title: s.name,
            subtitle: `${c.category} — level ${s.level}%`,
            tags: [c.category, `level-${s.level}`],
            body: `${s.name} ${c.category} proficiency level ${s.level} percent`,
            meta: { skill: s, category: c },
        }))
    );

const articleDocs = () =>
    articles.map((a) => ({
        id: `article:${a.id}`,
        type: 'article',
        title: a.title,
        subtitle: `${a.date} — ${a.readTime}`,
        tags: a.tags || [],
        body: `${a.summary} ${articleText(a)}`,
        meta: { article: a },
        route: '/blog',
        hint: `wick read ${a.id}`,
    }));

const miscDocs = () => [
    {
        id: 'profile',
        type: 'profile',
        title: portfolioData.name,
        subtitle: portfolioData.title,
        tags: ['profile', 'identity', portfolioData.title],
        body: `${portfolioData.tagline} ${portfolioData.about} ${portfolioData.email}`,
        meta: {},
    },
    {
        id: 'thesis',
        type: 'thesis',
        title: portfolioData.thesis.title,
        subtitle: `Skripsi — ${portfolioData.thesis.status}`,
        tags: ['skripsi', 'thesis', ...portfolioData.thesis.tech],
        body: `${portfolioData.thesis.description} ${portfolioData.thesis.tech.join(' ')}`,
        meta: { thesis: portfolioData.thesis },
    },
    ...portfolioData.growth.map((g, i) => ({
        id: `growth:${i}`,
        type: 'growth',
        title: g.title,
        subtitle: g.period,
        tags: ['perjalanan', 'education', 'journey'],
        body: g.description,
        meta: { growth: g },
    })),
    ...portfolioData.certifications.map((c, i) => ({
        id: `cert:${i}`,
        type: 'cert',
        title: c.title,
        subtitle: `${c.issuer} — ${c.year}`,
        tags: ['sertifikasi', 'certificate', c.issuer],
        body: `${c.title} ${c.issuer} ${c.year} certification`,
        meta: { cert: c },
    })),
    {
        id: 'learning',
        type: 'learning',
        title: 'Sedang dipelajari',
        subtitle: portfolioData.currentlyLearning.length + ' topik',
        tags: ['learning', 'sekarang', 'currently learning'],
        body: portfolioData.currentlyLearning.join(' '),
        meta: {},
    },
    ...ROUTES.map((r) => ({
        id: `route:${r.name}`,
        type: 'page',
        title: r.title,
        subtitle: r.path,
        tags: ['halaman', 'page', 'route'],
        body: r.desc,
        route: r.path,
        hint: `wick nav to ${r.name}`,
    })),
    ...Object.entries(portfolioData.socials).map(([name, url]) => ({
        id: `social:${name}`,
        type: 'contact',
        title: `${name} — ${url.replace(/^https?:\/\//, '')}`,
        subtitle: portfolioData.email,
        tags: ['sosial', 'social', 'kontak', name],
        body: `${name} ${url} ${portfolioData.email} contact social profile`,
        meta: { name, url },
    })),
    {
        id: 'contact',
        type: 'contact',
        title: 'Email',
        subtitle: portfolioData.email,
        tags: ['kontak', 'contact', 'email'],
        body: `${portfolioData.email} hubungi kontak saya available untukHIBIT project`,
        meta: { email: portfolioData.email },
    },
    {
        id: 'cv',
        type: 'file',
        title: 'Resume / CV (PDF)',
        subtitle: '/Resume_dwikikurniawan.pdf',
        tags: ['cv', 'resume', 'pdf', 'download', 'unduhan'],
        body: 'Curriculum vitae resume download pdf biodata',
        meta: { path: '/Resume_dwikikurniawan.pdf' },
        hint: 'wick cv',
    },
];

let cachedIndex = null;

/** Index dibangun sekali lalu dipakai ulang; sumbernya immutable per sesi. */
export const getIndex = () => {
    if (!cachedIndex) cachedIndex = buildIndex([...miscDocs(), ...projectDocs(), ...skillDocs(), ...articleDocs()]);
    return cachedIndex;
};

export const allDocs = () => getIndex().documents;

export const DOC_TYPES = [
    'project',
    'skill',
    'article',
    'thesis',
    'growth',
    'cert',
    'page',
    'contact',
    'file',
    'profile',
    'learning',
];

export { articles, AVATARS };

/** Statistik korpus — dipakai `wick stats`. */
export const corpusStats = () => {
    const docs = allDocs();
    const byType = {};
    for (const doc of docs) byType[doc.type] = (byType[doc.type] || 0) + 1;
    const terms = new Set();
    for (const doc of docs) terms.add(...Object.keys(doc.fields));
    return {
        documents: docs.length,
        terms: getIndex().postings.size,
        fields: terms.size,
        byType,
    };
};

export { envReport };
