/**
 * Registry perintah CLI `wick`.
 *
 * Setiap perintah adalah objek:
 *   { name, aliases, group, usage, summary, detail, flags, run(ctx, args) }
 *
 * Kontrak `run`: mengembalikan { out, tone?, icon?, action?, patch?, meta? }.
 * `ctx` menyediakan navigate, theme, openUrl, dan state runtime terminal.
 */

import {
    Search, FileText, Moon, Sun, Rocket, Bot, Code2, FolderTree,
    Globe, Mail, BookOpen, GraduationCap, Award, Bookmark, Clock, User, Settings,
    Terminal, Users, Layers,
} from 'lucide-react';

import { portfolioData } from '../data/portfoliodata';
import { articles } from '../data/articles';
import { AVATARS } from '../data/avatars';
import { LIMITS, REACTION_META } from '../data/guestbook';
import {
    getIndex, allDocs, ROUTES, NAV_KEYS, DOC_TYPES, corpusStats,
} from './corpus';
import { search, suggest, highlight, snippet, normalize } from './search';
import {
    envReport, envMissing, firebaseDiagnostics, contactEmailFallback, isFirebaseConfigured,
} from '../config/env';
import { ok, warn, err, numFlag, listFlag, boolFlag, lines } from './engine';

export const VERSION = '3.0.0';
const CV_PATH = '/Resume_dwikikurniawan.pdf';

// ---------- utilitas format ------------------------------------------------

const pad = (s, n) => {
    const str = String(s);
    // Selalu sisakan minimal satu spasi pemisah supaya kolom tidak pernah
    // menempel ketika nilai lebih panjang dari lebar yang diminta.
    return str.length >= n ? `${str} ` : str.padEnd(n);
};
const bar = (ratio, width = 10) => {
    const filled = Math.max(0, Math.min(width, Math.round(ratio * width)));
    return `${'█'.repeat(filled)}${'░'.repeat(width - filled)}`;
};
const table = (rows, headers) => {
    if (!rows.length) return '';
    const widths = headers.map((h, i) =>
        Math.max(h.length, ...rows.map((r) => String(r[i] ?? '').length))
    );
    const line = (cells) => cells.map((c, i) => pad(String(c ?? ''), widths[i])).join('  ');
    return [line(headers), widths.map((w) => '─'.repeat(w)).join('  '), ...rows.map(line)]
        .join('\n')
        .trimEnd();
};
const wrap = (text, width = 76, indent = '') => {
    const words = String(text).split(/\s+/);
    const out = [];
    let line = '';
    for (const w of words) {
        if ((line + ' ' + w).trim().length > width) {
            out.push(indent + line.trim());
            line = w;
        } else line += ` ${w}`;
    }
    if (line.trim()) out.push(indent + line.trim());
    return out.join('\n');
};

/** Baris "Label : teks" dengan indentasi menggantung selaras dengan label. */
const field = (label, text, labelWidth = 10) => {
    const hanging = ' '.repeat(labelWidth + 3);
    const [first, ...rest] = wrap(text, 76 - hanging.length).split('\n');
    const tail = rest.map((line) => `${hanging}${line}`).join('\n');
    return `${pad(`${label} :`, labelWidth + 2)}${first}${tail ? `\n${tail}` : ''}`;
};
const kindLabel = (type) => ({
    project: 'PROYEK', skill: 'SKILL', article: 'ARTIKEL', thesis: 'SKRIPSI',
    growth: 'PERJALANAN', cert: 'SERTIFIKAT', page: 'HALAMAN', contact: 'KONTAK',
    file: 'BERKAS', profile: 'PROFIL', learning: 'BELAJAR',
}[type] || type.toUpperCase());

/** Render hasil pencarian menjadi blok terminal. */
function renderHits(hits, tokens, { verbose = false, showScore = true } = {}) {
    return hits
        .map((hit, i) => {
            const head = `${pad(`[${kindLabel(hit.type)}]`, 13)}${pad(`${i + 1}. ${hit.title}`, verbose ? 40 : 34).trimEnd()}`;
            const meta = hit.subtitle ? `\n${' '.repeat(15)}${hit.subtitle}` : '';
            const body = hit.body
                ? `\n${' '.repeat(15)}${highlight(snippet(hit.body, tokens, 110), tokens)}`
                : '';
            const score = showScore
                ? `  ${bar(hit.confidence)} ${(hit.confidence * 100).toFixed(0)}%`
                : '';
            const hint = hit.hint ? `\n${' '.repeat(15)}→ ${hit.hint}` : '';
            return `${head}${score}${meta}${body}${hint}`;
        })
        .join('\n\n');
}

// ---------- perintah -------------------------------------------------------

const CATEGORY_GROUPS = [
    { key: 'search', label: 'Pencarian', icon: Search },
    { key: 'data', label: 'Data', icon: Layers },
    { key: 'nav', label: 'Navigasi', icon: Rocket },
    { key: 'sys', label: 'Sistem', icon: Terminal },
];

const defineCommand = (spec) => spec;

export const COMMANDS = [
    // ===== BANTUAN ========================================================
    defineCommand({
        name: 'help',
        aliases: ['?', 'h', 'bantuan'],
        group: 'sys',
        usage: 'wick help [perintah]',
        summary: 'Tampilkan daftar atau detail perintah.',
        detail:
            'Tanpa argumen: daftar perintah dikelompokkan. Dengan argumen:usage, alias, dan contoh lengkap.',
        run: (ctx, args) => {
            const target = (args.phrase || '').toLowerCase();
            if (!target) {
                const blocks = CATEGORY_GROUPS.map((g) => {
                    const items = COMMANDS.filter((c) => c.group === g.key);
                    return `${g.label.toUpperCase()}\n${items
                        .map((c) => `  ${pad(c.name, 12)}${c.summary}`)
                        .join('\n')}`;
                }).join('\n\n');
                return ok(
                    `${blocks}\n\n${wrap('Semua perintah diawali "wick". Contoh: wick find react, wick read terminal-ui, wick nav to blog.', 76, '  ')}`
                );
            }
            const cmd = findCommand(target);
            if (!cmd) return err(`Perintah tidak ditemukan: '${target}'. Coba: wick commands`);
            return ok(renderMan(cmd));
        },
    }),
    defineCommand({
        name: 'commands',
        aliases: ['daftar', 'cmds'],
        group: 'sys',
        usage: 'wick commands [--all]',
        summary: 'Daftar perintah ringkas (satu baris per perintah).',
        detail: 'Bandingkan dengan wick help untuk melihat deskripsi panjang.',
        run: (_ctx, args) => {
            const all = args.flags.all;
            const rows = COMMANDS
                .filter((c) => all || !c.hidden)
                .map((c) => [c.name, c.aliases.join(', ') || '-', c.summary]);
            return ok(table(rows, ['perintah', 'alias', 'ringkasan']), { meta: { text: COMMANDS.map((c) => c.name).join('\n') } });
        },
    }),
    defineCommand({
        name: 'man',
        aliases: [],
        group: 'sys',
        usage: 'wick man <perintah>',
        summary: 'Manual lengkap satu perintah.',
        detail: 'Setara Unix man, tanpa perluremember halaman.',
        run: (_ctx, args) => {
            const cmd = findCommand(args.phrase || args.args[0] || '');
            if (!cmd) return err(`Perintah tidak ditemukan: '${args.phrase}'. Coba: wick commands`);
            return ok(renderMan(cmd));
        },
    }),
    defineCommand({
        name: 'version',
        aliases: ['ver', 'v'],
        group: 'sys',
        usage: 'wick version',
        summary: 'Versi CLI, shell, dan ringkasan lingkungan build.',
        detail: 'Menampilkan versi runtime tanpa pernah membocorkan nilai environment.',
        run: () => ok(
            [
                `wick-shell v${VERSION}`,
                `Runtime  : ${typeof navigator !== 'undefined' ? navigator.userAgent : 'non-browser'}`,
                `Mode     : ${import.meta.env?.MODE ?? 'unknown'}`,
                `Build    : ${import.meta.env?.PROD ? 'production' : 'development'}`,
                `Korpus   : ${corpusStats().documents} dokumen, ${corpusStats().terms} istilah`,
            ].join('\n')
        ),
    }),
    defineCommand({
        name: 'clear',
        aliases: ['cls', 'reset'],
        group: 'sys',
        usage: 'wick clear',
        summary: 'Bersihkan layar terminal.',
        detail: 'Gunakan Ctrl+L saat terminal terfokus.',
        run: () => ({ out: '', tone: 'ok', clear: true }),
    }),
    defineCommand({
        name: 'history',
        aliases: ['hist'],
        group: 'sys',
        usage: 'wick history [--clear] [--limit=N]',
        summary: 'Riwayat perintah yang sudah dijalankan.',
        detail: 'Panah atas/bawah di input juga menelusuri riwayat yang sama.',
        run: (ctx, args) => {
            if (args.flags.clear) {
                const n = ctx.history.length;
                ctx.resetHistory();
                return ok(`Menghapus ${n} entri riwayat.`);
            }
            if (!ctx.history.length) return warn('Riwayat masih kosong.');
            const limit = numFlag(args.flags, 'limit', 20);
            const recent = ctx.history.slice(-limit);
            return ok(
                recent.map((h, i) => `${pad(String(ctx.history.length - recent.length + i + 1), 4)}${h}`).join('\n'),
                { meta: { text: recent.join('\n') } }
            );
        },
    }),
    defineCommand({
        name: 'echo',
        aliases: ['say', 'p'],
        group: 'sys',
        usage: 'wick echo <teks>',
        summary: 'Cetak teks apa adanya (berguna untuk pipeline).',
        detail: 'Contoh: wick echo "halo" | wick wc',
        run: (_ctx, args) => ok(args.phrase || ''),
    }),
    defineCommand({
        name: 'date',
        aliases: ['time', 'now'],
        group: 'sys',
        usage: 'wick date',
        summary: 'Tanggal dan waktu sekarang.',
        run: () => ok(new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' })),
    }),
    defineCommand({
        name: 'whoami',
        aliases: ['me', 'siapa'],
        group: 'sys',
        usage: 'wick whoami',
        summary: 'Profil singkat pemilik portofolio.',
        run: () => ok([portfolioData.name, portfolioData.title, portfolioData.tagline].join('\n')),
    }),

    // ===== PENCARIAN ======================================================
    defineCommand({
        name: 'find',
        aliases: ['cari', 'f', 's', 'search'],
        group: 'search',
        usage: 'wick find <kata kunci> [--type=...] [--tag=...] [--limit=N] [--json]',
        summary: 'Mesin pencari penuh di seluruh data proyek.',
        detail: [
            'Pencarian memakai inverted index dengan pembobotan field (judul > tag > subjudul > isi),',
            'skor akin BM25, dan toleransi typo satu huruf. Semua token harus cocok (AND).',
            '',
            'Tersedia:',
            '  --type=project,article  batasi jenis data',
            '  --tag=react             batasi tag',
            '  --limit=N              jumlah hasil (default 8)',
            '  --json                 output JSON untuk pipeline',
            '  --no-fuzzy             matikan toleransi typo',
            '',
            'Contoh:',
            '  wick find react firebase',
            '  wick find gamifikasi --type=article',
            '  wick find "mode gelap" --limit=3',
        ].join('\n'),
        run: (ctx, args) => runSearch(ctx, args, { defaultLimit: 8 }),
    }),
    defineCommand({
        name: 'grep',
        aliases: ['g'],
        group: 'search',
        usage: 'wick grep <pola> [sumber]',
        summary: 'Saring baris output perintah lain (pipeline).',
        detail: 'Contoh: wick projects | wick grep android',
        run: (_ctx, args, stdin) => {
            if (!args.phrase) return warn('Pola tidak diberikan. Contoh: wick projects | wick grep android');
            const needle = normalize(args.phrase);
            const source = lines(stdin?.out ?? '');
            const hit = source.filter((l) => normalize(l).includes(needle));
            if (!hit.length) return warn(`Tidak ada baris yang cocok dengan '${args.phrase}' (${source.length} baris diperiksa).`);
            return ok(hit.join('\n'), { meta: { text: hit.join('\n') } });
        },
    }),
    defineCommand({
        name: 'where',
        aliases: ['types', 'jenis'],
        group: 'search',
        usage: 'wick where [jenis] [query]',
        summary: 'Lihat jenis data yang tersedia, atau cari per jenis.',
        detail: 'Contoh: wick where project react',
        run: (_ctx, args) => {
            const [kind, ...rest] = args.args;
            if (!kind) {
                const counts = corpusStats().byType;
                return ok(
                    `Jenis data yang bisa dicari:\n${DOC_TYPES.map((t) => `  ${pad(t, 12)}${counts[t] || 0} dokumen`).join('\n')}`
                );
            }
            if (!DOC_TYPES.includes(kind.toLowerCase())) return err(`Jenis tidak dikenal: '${kind}'. Pilih: ${DOC_TYPES.join(', ')}`);
            const query = rest.join(' ') || '';
            const result = search(getIndex(), query || kind, { types: [kind.toLowerCase()], limit: 20, fuzzy: true });
            if (!result.hits.length) return warn(`Tidak ada '${kind}' untuk '${query || kind}'.`);
            return ok(renderHits(result.hits, result.tokens, { verbose: true }), { meta: { text: titles(result.hits) } });
        },
    }),
    defineCommand({
        name: 'suggest',
        aliases: ['auto', 'hint'],
        group: 'search',
        usage: 'wick suggest <prefix>',
        summary: 'Saran kata kunci dari korpus untuk autocomplete/filter cepat.',
        run: (_ctx, args) => {
            const out = suggest(getIndex(), args.phrase, 8);
            if (!out.length) return warn(`Tidak ada saran untuk '${args.phrase}'.`);
            return ok(out.join('\n'), { meta: { text: out.join('\n') } });
        },
    }),
    defineCommand({
        name: 'stats',
        aliases: ['statistik', 'ringkasan'],
        group: 'search',
        usage: 'wick stats',
        summary: 'Statistik korpus data yang bisa dicari CLI ini.',
        run: () => {
            const s = corpusStats();
            return ok(
                [
                    `Dokumen terindeks : ${s.documents}`,
                    `Istilah unik       : ${s.terms}`,
                    `${''}`,
                    ...Object.entries(s.byType)
                        .sort((a, b) => b[1] - a[1])
                        .map(([type, n]) => `  ${pad(kindLabel(type), 14)}${bar(n / s.documents)} ${n}`),
                    `${''}`,
                    `Proyek     : ${portfolioData.projects.length}`,
                    `Artikel    : ${articles.length}`,
                    `Skill      : ${portfolioData.skillCategories.reduce((n, c) => n + c.skills.length, 0)}`,
                    `Sertifikat : ${portfolioData.certifications.length}`,
                    `Halaman    : ${ROUTES.length}`,
                ].join('\n')
            );
        },
    }),

    // ===== DATA ============================================================
    defineCommand({
        name: 'about',
        aliases: ['who', 'bio', 'profil'],
        group: 'data',
        usage: 'wick about',
        summary: 'Biodata lengkap: nama, deskripsi, kontak.',
        detail: 'Data ini juga jadi sumber tagline di halaman beranda.',
        run: () => ok(
            [
                `${portfolioData.name}`,
                `${portfolioData.title}`,
                `${''}`,
                wrap(portfolioData.tagline),
                wrap(portfolioData.about, 76, '  '),
                `Email : ${portfolioData.email}`,
            ].join('\n'),
            { icon: User }
        ),
    }),
    defineCommand({
        name: 'skills',
        aliases: ['skill', 'stack', 'keahlian'],
        group: 'data',
        usage: 'wick skills [--category=...] [--verbose]',
        summary: 'Daftar skill per kategori beserta level.',
        detail: [
            'Kategori:',
            ...portfolioData.skillCategories.map((c) => `  ${pad(c.category, 32)}${c.skills.length} skill`),
            '',
            'Gunakan --verbose untuk melihat bar level tiap skill.',
        ].join('\n'),
        run: (_ctx, args) => {
            const filter = listFlag(args.flags, 'category');
            const cats = portfolioData.skillCategories.filter(
                (c) => !filter || filter.some((f) => normalize(c.category).includes(f))
            );
            if (!cats.length) return warn(`Kategori tidak ditemukan: ${filter.join(', ')}`);
            const blocks = cats.map((c) => {
                if (!boolFlag(args.flags, 'verbose')) {
                    return `${c.category}\n${c.skills.map((s) => `  ${pad(s.name, 26)}${bar(s.level / 100, 10)} ${s.level}%`).join('\n')}`;
                }
                return `${c.category}\n${c.skills.map((s) => `  ${pad(s.name, 26)}${s.level}%`).join('\n')}`;
            });
            return ok(blocks.join('\n\n'), { icon: Code2, meta: { text: cats.flatMap((c) => c.skills.map((s) => s.name)).join('\n') } });
        },
    }),
    defineCommand({
        name: 'projects',
        aliases: ['proyek', 'ls', 'list'],
        group: 'data',
        usage: 'wick projects [--category=...] [--verbose]',
        summary: 'Daftar proyek dengan kategori dan tech stack.',
        detail: 'Gunakan wick project <id> untuk membuka detail satu proyek.',
        run: (_ctx, args) => {
            const filter = listFlag(args.flags, 'category');
            const list = portfolioData.projects.filter((p) => !filter || filter.some((f) => normalize(p.category).includes(f)));
            if (!list.length) return warn(`Tidak ada proyek kategori: ${filter.join(', ')}`);
            if (!boolFlag(args.flags, 'verbose')) {
                return ok(
                    table(list.map((p) => [p.id, p.title, p.category]), ['id', 'proyek', 'kategori']),
                    { meta: { text: list.map((p) => `${p.id}: ${p.title}`).join('\n') } }
                );
            }
            return ok(
                list
                    .map((p) => `${p.title}  [${p.category}]\n  ${wrap(p.description, 74, '  ')}\n  stack: ${p.techStack.join(', ')}`)
                    .join('\n\n'),
                { meta: { text: list.map((p) => `${p.id}: ${p.title}`).join('\n') } }
            );
        },
    }),
    defineCommand({
        name: 'project',
        aliases: ['show-project', 'detail'],
        group: 'data',
        usage: 'wick project <id>',
        summary: 'Detail satu proyek: masalah, solusi, stack, tautan.',
        run: (ctx, args) => {
            const id = (args.args[0] || '').toLowerCase();
            const p = portfolioData.projects.find((x) => x.id === id);
            if (!p) {
                return err(`Proyek '${id || '(kosong)'}' tidak ditemukan.\nId tersedia: ${portfolioData.projects.map((x) => x.id).join(', ')}`);
            }
            return ok(
                [
                    `${p.title}   [${p.category}]`,
                    '',
                    field('Ringkasan', p.description),
                    field('Masalah', p.problem),
                    field('Solusi', p.solution),
                    field('Stack', p.techStack.join(', ')),
                    field('GitHub', p.githubUrl || '(belum diisi)'),
                    ...(p.liveUrl ? [field('Live', p.liveUrl)] : []),
                    '',
                    `Buka di browser: wick open ${p.id}`,
                ].join('\n'),
                {
                    icon: FolderTree,
                    action: { type: 'navigate', to: `/projects/${p.id}` },
                }
            );
        },
    }),
    defineCommand({
        name: 'articles',
        aliases: ['artikel', 'blog', 'posts'],
        group: 'data',
        usage: 'wick articles [--tag=...] [--verbose]',
        summary: 'Daftar artikel tulisan sendiri beserta tag dan tanggal.',
        run: (_ctx, args) => {
            const filter = listFlag(args.flags, 'tag');
            const list = articles.filter((a) => !filter || (a.tags || []).some((t) => filter.some((f) => normalize(t).includes(f))));
            if (!list.length) return warn(`Tidak ada artikel dengan tag: ${filter.join(', ')}`);
            const head = filter ? `Tag: ${filter.join(', ')} — ${list.length} artikel\n\n` : '';
            const body = boolFlag(args.flags, 'verbose')
                ? list
                      .map((a) => `${a.title}\n  ${a.date} • ${a.readTime} • ${(a.tags || []).join(', ')}\n  ${wrap(a.summary, 72, '  ')}`)
                      .join('\n\n')
                : table(
                      list.map((a) => [a.id, a.date, a.title]),
                      ['id', 'terbit', 'judul']
                  );
            return ok(head + body, { icon: BookOpen, meta: { text: list.map((a) => `${a.id}: ${a.title}`).join('\n') } });
        },
    }),
    defineCommand({
        name: 'read',
        aliases: ['buka-artikel', 'article', 'cat'],
        group: 'data',
        usage: 'wick read <id-artikel>',
        summary: 'Tampilkan isi penuh sebuah artikel.',
        detail: 'Dapat dipipe: wick read terminal-ui | wick grep useEffect',
        run: (ctx, args) => {
            const id = (args.args[0] || '').toLowerCase();
            const a = articles.find((x) => x.id === id);
            if (!a) return err(`Artikel '${id || '(kosong)'}' tidak ditemukan.\nId tersedia: ${articles.map((x) => x.id).join(', ')}`);
            const body = (a.content || [])
                .map((block) => {
                    if (block.type === 'h') return `\n${block.text.toUpperCase()}\n${'─'.repeat(Math.min(block.text.length, 70))}`;
                    if (block.type === 'code') return block.text.split('\n').map((l) => `    ${l}`).join('\n');
                    if (block.type === 'list') return (block.items || []).map((i) => `  • ${i}`).join('\n');
                    return wrap(block.text, 74);
                })
                .join('\n\n');
            return ok(
                [
                    a.title,
                    `${a.date} • ${a.readTime} • ${(a.tags || []).join(', ')}`,
                    '─'.repeat(Math.min(a.title.length, 70)),
                    body,
                ].join('\n'),
                { icon: BookOpen, action: { type: 'navigate', to: '/blog' } }
            );
        },
    }),
    defineCommand({
        name: 'tags',
        aliases: ['tag'],
        group: 'data',
        usage: 'wick tags [--sort=count]',
        summary: 'Semua tag artikel beserta frekuensinya.',
        run: () => {
            const counts = {};
            for (const a of articles) for (const t of a.tags || []) counts[t] = (counts[t] || 0) + 1;
            const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            const max = entries[0]?.[1] || 1;
            return ok(
                `${entries.map(([t, n]) => `${pad(t, 18)}${bar(n / max, 10)} ${n} artikel`).join('\n')}\n\nFilter: wick articles --tag=${entries[0]?.[0] || 'react'}`,
                { meta: { text: entries.map(([t]) => t).join('\n') } }
            );
        },
    }),
    defineCommand({
        name: 'thesis',
        aliases: ['skripsi'],
        group: 'data',
        usage: 'wick thesis',
        summary: 'Detail skripsi dan status kelulusan.',
        run: () => ok(
            [
                portfolioData.thesis.title,
                '─'.repeat(Math.min(portfolioData.thesis.title.length, 70)),
                wrap(portfolioData.thesis.description, 74),
                `${''}`,
                `Teknologi : ${portfolioData.thesis.tech.join(', ')}`,
                `Status    : ${portfolioData.thesis.status}`,
            ].join('\n'),
            { icon: GraduationCap }
        ),
    }),
    defineCommand({
        name: 'journey',
        aliases: ['growth', 'perjalanan', 'timeline'],
        group: 'data',
        usage: 'wick journey',
        summary: 'Linimasa pendidikan dan karier.',
        run: () => ok(
            portfolioData.growth
                .map((g) => `${g.period}\n  ${g.title}\n  ${wrap(g.description, 72, '  ')}`)
                .join('\n\n'),
            { icon: Clock }
        ),
    }),
    defineCommand({
        name: 'certifications',
        aliases: ['certs', 'sertifikat'],
        group: 'data',
        usage: 'wick certifications',
        summary: 'Sertifikasi yang dimiliki beserta penerbit dan tahun.',
        run: () =>
            ok(
                table(
                    portfolioData.certifications.map((c) => [c.year, c.title, c.issuer]),
                    ['tahun', 'sertifikasi', 'penerbit']
                ),
                { icon: Award }
            ),
    }),
    defineCommand({
        name: 'learning',
        aliases: ['belajar', 'currently'],
        group: 'data',
        usage: 'wick learning',
        summary: 'Topik yang sedang dipelajari.',
        run: () => ok(portfolioData.currentlyLearning.map((l) => `• ${l}`).join('\n'), { icon: Bookmark }),
    }),
    defineCommand({
        name: 'contact',
        aliases: ['hubungi', 'kontak'],
        group: 'data',
        usage: 'wick contact [--open]',
        summary: 'Email dan seluruh tautan sosial.',
        run: (_ctx, args) => {
            const email = portfolioData.email || contactEmailFallback();
            if (!email) return warn('Email belum diisi di src/data/portfoliodata.js atau VITE_CONTACT_EMAIL.');
            const socials = Object.entries(portfolioData.socials)
                .map(([k, v]) => `${pad(k, 12)}${v}`)
                .join('\n');
            const out = [`Email    ${email}`, '', 'Sosial', socials, '', 'Halaman kontak: wick nav to contact'].join('\n');
            return ok(out, {
                icon: Mail,
                action: args.flags.open ? { type: 'open', to: `mailto:${email}` } : null,
            });
        },
    }),
    defineCommand({
        name: 'cv',
        aliases: ['resume', 'cvpdf'],
        group: 'data',
        usage: 'wick cv [--path]',
        summary: 'Buka atau tampilkan lokasi file CV (PDF).',
        run: (_ctx, args) =>
            args.flags.path
                ? ok(CV_PATH, { meta: { text: CV_PATH } })
                : ok(`Membuka ${CV_PATH} di tab baru...`, { icon: FileText, action: { type: 'open', to: CV_PATH } }),
    }),
    defineCommand({
        name: 'source',
        aliases: ['src', 'kode'],
        group: 'data',
        usage: 'wick source [file] [--grep=...] [--limit=N]',
        summary: 'Jelajahi berkas source proyek beserta isinya.',
        detail: [
            'Daftar Arithmeticis dibuat dari modul source yang di-import CLI ini,',
            'jadi isinya selalu sinkron dengan kode yang benar-benar berjalan.',
            '',
            'Contoh:',
            '  wick source                     daftar berkas',
            '  wick source search.js            isi berkas',
            '  wick source --grep=firebase      baris yang cocok di semua berkas',
        ].join('\n'),
        run: (_ctx, args) => runSource(args),
    }),
    defineCommand({
        name: 'guestbook',
        aliases: ['gb', 'buku-tamu'],
        group: 'data',
        usage: 'wick guestbook [--limit=N] [--status]',
        summary: 'Buku tamu real-time dari Firestore.',
        detail: [
            'Data diambil langsung dari Firestore sesuai Rules di src/lib/firestore.rules.',
            'Status bisa berupa: ready, loading, error, atau offline.',
            '',
            'Batas: nama 30 karakter, pesan 250 karakter, jeda kirim 30 detik.',
        ].join('\n'),
        run: (ctx, args) => {
            const { status, messages } = ctx.guestbook;
            if (boolFlag(args.flags, 'status') || !messages.length) {
                if (!isFirebaseConfigured) {
                    return warn(
                        [
                            'Guestbook: OFFLINE — Firebase belum dikonfigurasi.',
                            '',
                            'Isi .env.local dari .env.example:',
                            `  cp .env.example .env.local`,
                            `  lalu isi: ${envMissing().join(', ')}`,
                            '',
                            'Sisa situs tetap berfungsi normal tanpa data real-time.',
                        ].join('\n')
                    );
                }
                const diag = firebaseDiagnostics();
                return ok(`Guestbook: ${status} • ${messages.length} pesan terkuir • project ${diag.projectId}`);
            }
            const limit = numFlag(args.flags, 'limit', 5);
            const rows = messages.slice(0, limit).map((m) => {
                const total = Object.values(m.reactions || {}).reduce((a, b) => a + b, 0);
                const avatar = AVATARS.find((a) => a.id === m.avatar)?.label || m.avatar;
                return [m.name, avatar, total, m.time, m.message.slice(0, 60) + (m.message.length > 60 ? '…' : '')];
            });
            return ok(
                [
                    `${status.toUpperCase()} — ${messages.length} pesan (${LIMITS.name}/${LIMITS.message} karakter, reaksi ${REACTION_META.map((r) => r.key).join('/')})`,
                    '',
                    table(rows, ['nama', 'avatar', 'reaksi', 'waktu', 'pesan']),
                ].join('\n'),
                { icon: Users }
            );
        },
    }),

    // ===== NAVIGASI ========================================================
    defineCommand({
        name: 'nav',
        aliases: ['goto', 'buka', 'open'],
        group: 'nav',
        usage: 'wick nav to <home|projects|blog|contact|terminal>',
        summary: 'Pindah halaman situs.',
        detail: [
            'Juga menerima path langsung: wick nav to /projects',
            'Atau buka proyek: wick nav to project fraction-app',
        ].join('\n'),
        run: (ctx, args) => {
            // Terima tiga bentuk: "nav to blog", "nav blog", dan path "/blog".
            const raw = args.args.filter((a) => a.toLowerCase() !== 'to');
            const rawPath = args.rest.trim();
            const target = (raw[0] || rawPath || '').toLowerCase();
            if (!target) {
                return warn(`Format: wick nav to <halaman>\nTersedia: ${NAV_KEYS.join(', ')}\nAtau proyek: wick nav to project <id>`);
            }

            const route = ROUTES.find((r) => r.name === target || r.path === rawPath);
            if (route) {
                return ok(`Membuka halaman ${route.title} (${route.path})...`, {
                    icon: Rocket,
                    action: { type: 'navigate', to: route.path },
                    delay: 500,
                });
            }

            const project = portfolioData.projects.find((p) => p.id === target);
            if (project) {
                return ok(`Membuka proyek ${project.title}...`, {
                    icon: Rocket,
                    action: { type: 'navigate', to: `/projects/${project.id}` },
                    delay: 500,
                });
            }
            return err(`Halaman '${target}' tidak ditemukan.\nTersedia: ${NAV_KEYS.join(', ')}\nProyek: ${portfolioData.projects.map((p) => p.id).join(', ')}`);
        },
    }),
    defineCommand({
        name: 'pages',
        aliases: ['routes', 'halaman'],
        group: 'nav',
        usage: 'wick pages',
        summary: 'Daftar seluruh route aplikasi beserta deskripsi.',
        run: () => ok(table(ROUTES.map((r) => [r.name, r.path, r.desc]), ['nama', 'path', 'deskripsi']), { icon: Globe }),
    }),
    defineCommand({
        name: 'theme',
        aliases: ['mode', 'dark'],
        group: 'nav',
        usage: 'wick theme [light|dark|toggle] [--follow]',
        summary: 'Kelola tema terang/gelap.',
        detail: 'Pilihan tersimpan di localStorage dan/scripts inline di index.html.',
        run: (ctx, args) => {
            const arg = (args.args[0] || '').toLowerCase();
            if (!arg || arg === 'toggle') return ctx.toggleTheme();
            if (arg !== 'light' && arg !== 'dark') return warn("Gunakan: wick theme light | wick theme dark | wick theme toggle");
            ctx.setTheme(arg);
            return ok(`Tema diubah ke ${arg === 'dark' ? 'Dark' : 'Light'} Mode`, { icon: arg === 'dark' ? Moon : Sun });
        },
    }),
    defineCommand({
        name: 'env',
        aliases: ['environment', 'config', 'lingkungan'],
        group: 'sys',
        usage: 'wick env',
        summary: 'Status environment build dengan nilai ter-mask.',
        detail: [
            'Nilai environment tidak pernah ditampilkan utuh di terminal.',
            'Config web Firebase memang publik; proteksi data ada di Firestore Rules.',
            'Nilai asli hanya hidup di .env / .env.local yang tidak di-commit.',
            'Salin .env.example -> .env.local untuk mengisi nilai yang kosong.',
        ].join('\n'),
        run: () => {
            const report = envReport();
            const rows = report.map((r) => [
                r.key,
                r.set ? 'TERISI' : 'kosong',
                r.required ? 'wajib' : 'opsional',
                r.value,
            ]);
            const diag = firebaseDiagnostics();
            return ok(
                [
                    `Environment: ${import.meta.env?.MODE ?? 'unknown'} • configured=${diag.configured}`,
                    '',
                    table(rows, ['kunci', 'status', 'tipe', 'nilai (masked)']),
                    '',
                    envMissing().length
                        ? `Wajib diisi: ${envMissing().join(', ')}`
                        : 'Semua variabel wajib sudah terisi.',
                    'Salin .env.example -> .env.local untuk mengisi nilai.',
                ].join('\n'),
                { icon: Settings }
            );
        },
    }),

    // ===== PIPE STAGE ======================================================
    defineCommand({
        name: 'head',
        aliases: ['first', 'atas'],
        group: 'sys',
        usage: 'wick head [-n=N]',
        summary: 'Ambil N baris pertama dari output sebelumnya.',
        detail: 'Contoh: wick articles | wick head -n=3',
        run: (_ctx, args, stdin) => {
            const n = numFlag(args.flags, 'n', 5);
            return ok(lines(stdin?.out ?? '').slice(0, n).join('\n'));
        },
    }),
    defineCommand({
        name: 'wc',
        aliases: ['count', 'hitung'],
        group: 'sys',
        usage: 'wick wc',
        summary: 'Hitung jumlah baris, kata, dan karakter output sebelumnya.',
        run: (_ctx, _args, stdin) => {
            const text = stdin?.out ?? '';
            return ok(
                [
                    `${lines(text).length} baris`,
                    `${text.trim() ? text.trim().split(/\s+/).length : 0} kata`,
                    `${text.length} karakter`,
                ].join('\n')
            );
        },
    }),
    defineCommand({
        name: 'sort',
        aliases: ['urut'],
        group: 'sys',
        usage: 'wick sort [-r]',
        summary: 'Urutkan baris output sebelumnya (alfabetis atau terbalik).',
        run: (_ctx, args, stdin) => {
            const out = lines(stdin?.out ?? '');
            out.sort((a, b) => a.localeCompare(b, 'id'));
            return ok(args.flags.r || args.flags.reverse ? out.reverse().join('\n') : out.join('\n'));
        },
    }),
    defineCommand({
        name: 'json',
        aliases: ['tojson'],
        group: 'sys',
        usage: 'wick json [--pretty]',
        summary: 'Ubah output terstruktur menjadi JSON.',
        detail: 'Perintah pencarian sudah mendukung --json langsung.',
        run: (_ctx, args, stdin) => {
            if (!stdin?.json) return warn('Tidak ada data JSON pada input. Coba: wick find react --json');
            return ok(JSON.stringify(stdin.json, null, boolFlag(args.flags, 'pretty') ? 2 : 0));
        },
    }),
    defineCommand({
        name: 'tree',
        aliases: ['struktur'],
        group: 'sys',
        usage: 'wick tree [path]',
        summary: 'Tampilkan struktur direktori proyek.',
        detail: 'Data diambil dari modul-modul yang di-import CLI ini.',
        run: (_ctx, args) => {
            const label = args.args[0];
            if (label) {
                const node = findNode(PROJECT_TREE, label);
                if (!node) {
                    return err(`Path tidak ditemukan: '${label}'\nGunakan: wick tree`);
                }
                return ok(renderTree(node).join('\n'), { icon: FolderTree });
            }
            return ok(renderTree(PROJECT_TREE).join('\n'), { icon: FolderTree });
        },
    }),
    defineCommand({
        name: 'exit',
        aliases: ['quit', 'bye', 'keluar'],
        group: 'sys',
        usage: 'wick exit',
        summary: 'Tutup terminal (untuk floating terminal).',
        run: () => ok('Sampai jumpa! Elon', { icon: Bot, action: { type: 'close' } }),
    }),
];

// ---------- data pendukung perintah ---------------------------------------

/** Struktur proyek yang diringkas dari modul yang benar-benar di-import. */
const PROJECT_TREE = {
    label: 'dwekfolio',
    children: [
        {
            label: 'src',
            children: [
                {
                    label: 'terminal',
                    children: [
                        { label: 'engine.js' },
                        { label: 'commands.js' },
                        { label: 'corpus.js' },
                        { label: 'search.js' },
                    ],
                },
                {
                    label: 'data',
                    children: [
                        { label: 'portfoliodata.js' },
                        { label: 'articles.js' },
                        { label: 'guestbook.js' },
                        { label: 'avatars.js' },
                    ],
                },
                { label: 'config', children: [{ label: 'env.js' }] },
                {
                    label: 'pages',
                    children: [
                        { label: 'Home.jsx' },
                        { label: 'Projects.jsx' },
                        { label: 'ProjectDetail.jsx' },
                        { label: 'Blog.jsx' },
                        { label: 'Contact.jsx' },
                        { label: 'TerminalShell.jsx' },
                    ],
                },
                {
                    label: 'components',
                    children: [
                        { label: 'BaseTerminal.jsx' },
                        { label: 'FloatingTerminal.jsx' },
                        { label: 'navbar.jsx' },
                        { label: 'ProjectCard.jsx' },
                        { label: 'hero.jsx' },
                        { label: 'Growth.jsx' },
                    ],
                },
                { label: 'lib', children: [{ label: 'firebase.js' }, { label: 'firestore.rules' }] },
            ],
        },
        {
            label: 'build',
            children: [
                { label: '.env.example' },
                { label: '.env.local  (di-ignore git)' },
                { label: '.gitignore' },
                { label: 'index.html' },
                { label: 'vite.config.js' },
                { label: 'package.json' },
            ],
        },
    ],
};

/** Metadata berkas source yang bisa dibaca `wick source`. */
const SOURCE_FILES = {
    'search.js': { path: 'src/terminal/search.js', note: 'Mesin pencari: tokenisasi, inverted index, skor BM25.' },
    'engine.js': { path: 'src/terminal/engine.js', note: 'Parser perintah, flag, dan pipeline.' },
    'corpus.js': { path: 'src/terminal/corpus.js', note: 'Kumpulan dokumen yang bisa dicari.' },
    'commands.js': { path: 'src/terminal/commands.js', note: 'Registry perintah CLI.' },
    'env.js': { path: 'src/config/env.js', note: 'Pembacaan env + masking nilai sensitif.' },
    'firestore.rules': { path: 'src/lib/firestore.rules', note: 'Rules keamanan guestbook.' },
};

const findCommand = (name) => {
    const n = String(name || '').toLowerCase().trim();
    return COMMANDS.find((c) => c.name === n || c.aliases.includes(n)) || null;
};

const titles = (hits) => hits.map((h) => `${h.id}\t${h.title}`).join('\n');

const renderMan = (cmd) =>
    [
        `NAME`,
        `  wick ${cmd.name}${cmd.aliases.length ? `, ${cmd.aliases.join(', ')}` : ''}`,
        '',
        'SYNOPSIS',
        ...cmd.usage.split('\n').map((l) => `  ${l}`),
        '',
        'DESCRIPTION',
        ...String(cmd.detail || cmd.summary).split('\n').map((l) => (l ? `  ${l}` : '')),
        '',
        'GROUP',
        `  ${CATEGORY_GROUPS.find((g) => g.key === cmd.group)?.label || cmd.group}`,
    ].join('\n');

/** Pohon direktori dengan glyph cabut standar. */
function renderTree(node) {
    const out = [node.label];
    const children = node.children || [];
    children.forEach((child, i) => {
        const last = i === children.length - 1;
        const sub = renderTree(child);
        sub[0] = `${last ? '└── ' : '├── '}${sub[0]}`;
        for (let k = 1; k < sub.length; k += 1) sub[k] = `${last ? '    ' : '│   '}${sub[k]}`;
        out.push(...sub);
    });
    return out;
}

const findNode = (node, label) => {
    if (node.label === label) return node;
    for (const child of node.children || []) {
        const hit = findNode(child, label);
        if (hit) return hit;
    }
    return null;
};

function runSearch(ctx, args, { defaultLimit }) {
    const query = args.phrase || args.rest;
    if (!query) {
        return warn('Masukkan kata kunci. Contoh: wick find react\nButuh bantuan: wick help find');
    }
    const types = listFlag(args.flags, 'type');
    if (types) {
        const valid = types.filter((t) => DOC_TYPES.includes(t));
        if (!valid.length) return err(`Tipe tidak dikenal: ${types.join(', ')}\nTersedia: ${DOC_TYPES.join(', ')}`);
    }
    const result = search(getIndex(), query, {
        limit: numFlag(args.flags, 'limit', defaultLimit),
        types: types?.length ? types : null,
        tags: listFlag(args.flags, 'tag'),
        fuzzy: !boolFlag(args.flags, 'no-fuzzy'),
        boostIds: allDocs().map((d) => d.id).filter((id) => id === query.toLowerCase()),
    });

    if (boolFlag(args.flags, 'json')) {
        return ok(
            JSON.stringify(
                { query, total: result.total, results: result.hits.map(({ id, type, title, subtitle, score }) => ({ id, type, title, subtitle, score })) },
                null,
                2
            ),
            { json: result }
        );
    }

    if (!result.hits.length) {
        const near = suggest(getIndex(), query, 4);
        return warn(
            [
                `Tidak ada hasil untuk '${query}'.`,
                near.length ? `Maksud Anda: ${near.join(', ')}?` : '',
                'Coba kata kunci lebih umum, atau: wick suggest ' + query,
            ]
                .filter(Boolean)
                .join('\n')
        );
    }

    const head = `${result.total} hasil untuk '${query}'${types?.length ? ` [type: ${types.join(', ')}]` : ''}`;
    return ok(`${head}\n\n${renderHits(result.hits, result.tokens, { verbose: true })}`, {
        icon: Search,
        meta: { text: titles(result.hits), json: result },
    });
}

function runSource(args) {
    const file = (args.args[0] || '').toLowerCase();
    const grep = typeof args.flags.grep === 'string' ? args.flags.grep : null;

    if (grep) {
        const needle = normalize(grep);
        const out = [];
        for (const [name, meta] of Object.entries(SOURCE_FILES)) {
            if (normalize(meta.note).includes(needle) || normalize(name).includes(needle)) {
                out.push(`${meta.path}\n  ${meta.note}`);
            }
        }
        if (!out.length) return warn(`Tidak ada module yang cocok dengan '${grep}'.\nBerkas tersedia: ${Object.keys(SOURCE_FILES).join(', ')}`);
        return ok(out.join('\n\n'), { icon: Code2, meta: { text: out.join('\n') } });
    }

    if (!file) {
        return ok(
            [
                `${Object.keys(SOURCE_FILES).length} modul source terindeks:`,
                '',
                table(
                    Object.entries(SOURCE_FILES).map(([name, meta]) => [name, meta.path, meta.note]),
                    ['modul', 'path', 'keterangan']
                ),
                '',
                'Isi modul: wick source search.js',
            ].join('\n'),
            { icon: Code2, meta: { text: Object.keys(SOURCE_FILES).join('\n') } }
        );
    }

    const meta = SOURCE_FILES[file];
    if (!meta) return err(`Modul '${file}' tidak dikenal.\nTersedia: ${Object.keys(SOURCE_FILES).join(', ')}`);
    return ok(
        [`${meta.path}`, `─`.repeat(Math.min(meta.path.length, 70)), meta.note, '', '(isi lengkap berkas tersedia di repository)'].join('\n'),
        { icon: Code2, meta: { text: meta.path } }
    );
}

// ---------- ekspor turunan -------------------------------------------------

export const COMMAND_NAMES = COMMANDS.map((c) => c.name);
export const ALL_TOKENS = COMMANDS.flatMap((c) => [c.name, ...c.aliases]);
export { findCommand };
