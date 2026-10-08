/**
 * Executor perintah: menyatukan parser, registry perintah, dan pipeline.
 *
 * `runLine(input, ctx)` adalah satu-satunya fungsi yang dipanggil komponen
 * terminal. Semua logika parsing dan pipeline ada di sini, bukan di komponen.
 */

import { tokenize, splitPipeline, PREFIXES } from './engine';
import { COMMANDS, findCommand } from './commands';

const HELP_ON_UNKNOWN = (name) =>
    `Perintah tidak dikenal: '${name}'.\nCoba: wick commands, atau wick help ${name}`;

/** Perintah filter yang masuk akal tanpa prefix, karena jadi ujung pipeline. */
const PIPE_STAGES = new Set(['grep', 'g', 'head', 'first', 'wc', 'sort', 'json', 'echo']);

/** Apakah baris ini sudah diawali prefix yang valid? */
const hasPrefix = (segment) => PREFIXES.includes(String(segment).trim().split(/\s+/)[0]?.toLowerCase());

/** Menjalankan satu segmen (tanpa pipeline) dan menormalkan hasilnya. */
function runSegment(segment, ctx, stdin = null) {
    const parsed = tokenize(segment);

    // Perintah kosong setelah prefix: perlakukan sebagai help.
    if (!parsed.name) {
        return { out: "Kosong. Ketik 'wick help' atau 'wick commands'.", tone: 'warn' };
    }

    const cmd = findCommand(parsed.name);
    if (!cmd) return { out: HELP_ON_UNKNOWN(parsed.name), tone: 'error' };

    try {
        const result = cmd.run(ctx, parsed, stdin) || {};
        return {
            ...result,
            // out selalu string: perintah boleh mengembalikan array/objek,
            // komponen terminal tidak boleh ikut memikul penerjemahan itu.
            out: String(result.out ?? ''),
            tone: result.tone || 'ok',
            command: cmd.name,
        };
    } catch (error) {
        // Satu perintah rusak tidak boleh mematikan seluruh terminal.
        return {
            out: `Perintah '${cmd.name}' gagal: ${error?.message || error}`,
            tone: 'error',
        };
    }
}

/**
 * Jalankan satu baris input, termasuk pipeline.
 * ctx harus menyediakan: navigate, setTheme, toggleTheme, history, resetHistory,
 * guestbook, openUrl, closeTerminal.
 */
export function runLine(input, ctx) {
    const segments = splitPipeline(input);

    if (!segments.length) {
        return { out: "Kosong. Ketik 'wick help' atau 'wick commands'.", tone: 'warn' };
    }

    // Prefix wajib, kecuali baris itu memang tahap pipeline.
    const firstName = tokenize(segments[0]).name;
    if (!hasPrefix(segments[0]) && !(PIPE_STAGES.has(firstName) && segments.length > 1)) {
        return {
            out: `Perintah harus diawali "wick". Contoh: wick ${firstName || 'help'}\nKetik: wick commands`,
            tone: 'warn',
        };
    }

    let stdin = null;
    let last = null;
    for (const segment of segments) {
        last = runSegment(segment, ctx, stdin);
        if (last.clear || last.tone === 'error') break;
        stdin = last;
    }
    return last || { out: '', tone: 'ok' };
}

/** Seluruh nama perintah + alias, untuk Tab completion. */
export const COMPLETION_TOKENS = COMMANDS.flatMap((c) => [c.name, ...c.aliases]);

/** Didukung CLI ini (untuk pesan bantuan). */
export { COMMANDS, findCommand };
