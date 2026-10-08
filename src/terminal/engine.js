/**
 * Parser dan runner perintah terminal.
 *
 * Mendukung sintaks CLI sungguhan:
 *   wick projects                    perintah sederhana
 *   wick find react --type=project   flag --key=value
 *   wick articles | wick grep react  pipeline antar perintah
 *   wick help nav                    dokumentasi satu perintah
 */

export const PREFIX = 'wick';
export const PREFIXES = ['wick', 'w', '$'];

export const ok = (out, extra = {}) => ({ out, tone: 'ok', ...extra });
export const warn = (out) => ({ out, tone: 'warn' });
export const err = (out) => ({ out, tone: 'error' });

/**
 * Uraikan satu segmen perintah.
 * Mengembalikan { name, rest, args, phrase, flags } dengan argumen
 * multi-kata dipertahankan sebagai `phrase` agar bisa dipakai di pipeline.
 */
export function tokenize(input) {
    const raw = String(input || '').trim();
    if (!raw) return { name: '', rest: '', args: [], phrase: '', flags: {} };

    const parts = raw.match(/"[^"]*"|'[^']*'|\S+/g) || [];
    const unquote = (s) => s.replace(/^["']|["']$/g, '');
    const words = parts.map(unquote);

    // Buang prefix berulang: "wick wick help" tetap valid.
    let i = 0;
    while (i < words.length && PREFIXES.includes(words[i].toLowerCase())) i += 1;

    const flags = {};
    const positional = [];
    for (const word of words.slice(i)) {
        // Terima -n dan --name, dengan atau tanpa =value (konvensi Unix).
        const flag = /^-{1,2}([a-z][\w-]*)(?:=(.*))?$/i.exec(word);
        if (flag) flags[flag[1].toLowerCase()] = flag[2] === undefined ? true : flag[2];
        else positional.push(word);
    }

    return {
        name: (positional[0] || '').toLowerCase(),
        rest: words.slice(i + 1).join(' '),
        args: positional.slice(1),
        phrase: positional.slice(1).join(' '),
        flags,
    };
}

/** Pisahkan input jadi segmen pipeline (`| grep react`). */
export function splitPipeline(input) {
    const segments = [];
    let buf = '';
    let quoted = false;
    for (const ch of String(input || '')) {
        if (ch === '"' || ch === "'") quoted = !quoted;
        if (ch === '|' && !quoted) {
            segments.push(buf);
            buf = '';
            continue;
        }
        buf += ch;
    }
    segments.push(buf);
    return segments.map((s) => s.trim()).filter(Boolean);
}

/** "--limit=5" -> 5, dengan fallback bila tidak valid. */
export const numFlag = (flags, key, fallback) => {
    const v = flags[key];
    if (v === undefined || v === true) return fallback;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

/** "--type=project,article" -> ['project', 'article'] */
export const listFlag = (flags, key) => {
    const v = flags[key];
    if (v === undefined || v === true) return null;
    return String(v).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
};

export const boolFlag = (flags, key) => flags[key] !== undefined && flags[key] !== 'false';

/** Bar kosong diabaikan saat menghitung/menyaring output. */
export const lines = (out) => String(out || '').split('\n').filter((l) => l.trim().length);
