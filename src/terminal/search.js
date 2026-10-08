/**
 * Mesin pencari miniature untuk terminal `wick`.
 *
 * Dirancang untuk korpus kecil (puluhan dokumen), tapi tetap memakai cara
 * yang benar: tokenisasi, inverted index, pembobotan field, skor akin BM25,
 * plus toleransi typo. Jadi menambah data di src/data otomatis langsung
 * terindeks tanpa perlu mendaftarkan kata kunci baru.
 */

const STOPWORDS = new Set([
    'ada', 'adalah', 'agar', 'akan', 'atau', 'bagi', 'banyak', 'belum', 'bisa',
    'dalam', 'dari', 'dengan', 'dan', 'hanya', 'hari', 'ini', 'itu',
    'jika', 'karena', 'kepada', 'ketika', 'maka', 'masih', 'oleh', 'pada',
    'saja', 'sampai', 'sangat', 'satu', 'saya', 'sebagai', 'sebuah', 'sedang',
    'sehingga', 'serta', 'setelah', 'seperti', 'sudah', 'supaya', 'tapi',
    'telah', 'tentang', 'terhadap', 'tersebut', 'tetapi', 'tidak', 'untuk',
    'yaitu', 'yang',
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'are', 'was',
    'not', 'but', 'you', 'your',
]);

// Bobot per field. Judul jauh lebih informsif daripada isi artikel.
const FIELD_WEIGHTS = { title: 3.2, tags: 2.4, subtitle: 1.7, body: 1 };
const K1 = 1.4; // saturasi term frequency
const B = 0.72; // normalisasi panjang dokumen
const MIN_FUZZY_LEN = 5; // di bawah ini, toleransi typo tidak diaktifkan

/** Normalisasi: lowercase, buang aksen, sisakan alnum dan beberapa simbol teknis. */
export const normalize = (value) =>
    String(value ?? '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9+#._/-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Tokenisasi: hanya kata utuh yang masuk query.
 *
 * Prefix TIDAK dimasukkan sebagai token terpisah. Kalau dia ikut, satu
 * kata kunci dihitung dua kali (meny-google "react" jadi 2 token), dan
 * suffix pendek ikut memaksa setiap dokumen mencocokkan. Pencarian
 * search-as-you-type ditangani di resolveCandidates sebagai tingkat
 * kecocokan tersendiri, bukan dengan menggandakan token.
 */
export const tokenize = (value) => {
    const words = [];
    for (const word of normalize(value).split(' ')) {
        if (!word) continue;
        if (STOPWORDS.has(word) || word.length < 2) continue;
        words.push(word);
    }
    return [...new Set(words)];
};

/** Levenshtein dengan batas abort agar murah untuk kandidat sedikit. */
export function editDistance(a, b, max = 2) {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i += 1) {
        const curr = [i];
        let best = i;
        for (let j = 1; j <= b.length; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
            if (curr[j] < best) best = curr[j];
        }
        if (best > max) return max + 1;
        prev = curr;
    }
    return prev[b.length];
}

/**
 * Membangun inverted index dari dokumen.
 * doc: { id, type, title, subtitle?, tags?, body?, fields? }
 */
export function buildIndex(docs) {
    const documents = docs.map((doc) => {
        const custom = Object.fromEntries(
            Object.entries(doc.fields || {}).map(([k, v]) => [k, normalize(v)])
        );
        const fields = {
            title: normalize(doc.title),
            tags: normalize((doc.tags || []).join(' ')),
            subtitle: normalize(doc.subtitle || ''),
            body: normalize(doc.body || ''),
            ...custom,
        };
        const length = Object.values(fields).reduce((n, v) => n + tokenize(v).length, 0);
        return { ...doc, fields, length };
    });

    const postings = new Map();
    for (const doc of documents) {
        for (const text of Object.values(doc.fields)) {
            for (const token of tokenize(text)) {
                let ids = postings.get(token);
                if (!ids) postings.set(token, (ids = new Set()));
                ids.add(doc.id);
            }
        }
    }

    const docById = new Map(documents.map((d) => [d.id, d]));
    const totalLength = documents.reduce((n, d) => n + d.length, 0) || 1;
    return { documents, docById, postings, totalLength, avgLength: totalLength / Math.max(documents.length, 1) };
}

/**
 * Pencocokan satu token ke index, dari yang paling kuat:
 *   exact  — token ada persis di korpus
 *   prefix — token adalah awalan sebuah istilah ("rea" -> "react")
 *   fuzzy  — token berbeda 1-2 huruf dari sebuah istilah
 */
const resolveCandidates = (index, token, fuzzy) => {
    const exact = index.postings.get(token);
    if (exact?.size) return { ids: exact, tier: 'exact' };

    // Prefix untuk search-as-you-type: token adalah awalan sebuah istilah.
    const prefixIds = new Set();
    for (const [candidate, postings] of index.postings) {
        if (candidate.length > token.length && candidate.startsWith(token)) {
            postings.forEach((id) => prefixIds.add(id));
        }
    }
    if (prefixIds.size) return { ids: prefixIds, tier: 'prefix' };

    if (!fuzzy || token.length < MIN_FUZZY_LEN) return { ids: new Set(), tier: 'none' };

    const ids = new Set();
    const maxDist = token.length >= 8 ? 2 : 1;
    for (const [candidate, postings] of index.postings) {
        if (candidate.length < MIN_FUZZY_LEN || !postings.size) continue;
        if (candidate.includes('+') || candidate.includes('#')) continue; // "c++", "c#"
        if (editDistance(token, candidate, maxDist) <= maxDist) postings.forEach((id) => ids.add(id));
    }
    return { ids, tier: 'fuzzy' };
};

/**
 * Skor satu token terhadap satu dokumen.
 * Mengembalikan { score, matched } di mana matched =True bila benar-benar ada.
 */
const scoreToken = (doc, token) => {
    let score = 0;
    let matched = false;

    for (const [field, text] of Object.entries(doc.fields)) {
        if (!text) continue;
        const weight = FIELD_WEIGHTS[field] ?? 0.8;
        const at = text.indexOf(token);
        if (at === -1) continue;

        matched = true;
        const startsWord = at === 0 || text[at - 1] === ' ';
        const endsWord = at + token.length >= text.length || text[at + token.length] === ' ';
        score += weight * (startsWord && endsWord ? 3 : startsWord ? 1.8 : 0.6);
    }
    return { score, matched };
};

/**
 * Cari dokumen. Semua token query dianggap wajib ada (AND), kecuali query
 * diawali `or:`. Inilah yang membuat hasil tidak berair.
 *
 * Sebuah token dianggap "terpenuhi" baik oleh kecocokan persis maupun oleh
 * prefix/fuzzy — kalau tidak, toleransi typo justru tidak akan pernah
 * mengembalikan apa pun pada query multi-kata.
 */
export function search(index, rawQuery, options = {}) {
    const { limit = 8, types = null, tags = null, fuzzy = true, boostIds = [] } = options;
    const query = String(rawQuery || '').trim();
    if (!query) return { hits: [], total: 0, tokens: [] };

    const anyOf = /^or:/i.test(query);
    const tokens = tokenize(anyOf ? query.slice(3) : query);
    if (!tokens.length) return { hits: [], total: 0, tokens: [] };

    const boostSet = new Set(boostIds);
    const N = index.documents.length;
    const scored = [];

    for (const doc of index.documents) {
        if (types?.length && !types.includes(doc.type)) continue;
        if (tags?.length && !tags.some((t) => (doc.tags || []).some((dt) => normalize(dt) === normalize(t)))) continue;

        let docScore = 0;
        let strongTokens = 0; // cocok persis / prefix
        let weakTokens = 0;   // hanya cocok lewat toleransi typo

        for (const token of tokens) {
            const { ids, tier } = resolveCandidates(index, token, fuzzy);
            if (!ids.size || !ids.has(doc.id)) continue;

            const { score, matched } = scoreToken(doc, token);
            if (!matched) {
                // Kandidat dari fuzzy mungkin milik dokumen lain; tanpa teks
                // yang benar-benar memuat token, ini hanya sinyal lemah.
                weakTokens += 1;
                docScore += (ids.size / (N + 1)) * 0.6;
                continue;
            }

            const idf = Math.log(1 + (N - ids.size + 0.5) / (ids.size + 0.5));
            const lengthNorm = 1 - B + B * (doc.length / index.avgLength);
            const tierFactor = tier === 'exact' ? 1 : 0.7;
            docScore += ((score * idf * lengthNorm) / (K1 + 1)) * tierFactor;

            if (tier === 'exact') strongTokens += 1;
            else weakTokens += 1;
        }

        const satisfied = strongTokens + weakTokens;
        const enough = anyOf ? satisfied > 0 : satisfied === tokens.length;
        if (!enough) continue;

        // Dokumen yang memuat semua token mendahului yang hanya cocok sebagian.
        docScore *= 1 + (strongTokens / tokens.length) * 0.9;
        if (weakTokens > strongTokens) docScore *= 0.6;
        if (boostSet.has(doc.id)) docScore *= 1.6;

        scored.push({
            doc,
            score: docScore,
            strongTokens,
            exact: strongTokens === tokens.length,
        });
    }

    scored.sort(
        (a, b) =>
            b.score - a.score ||
            Number(b.exact) - Number(a.exact) ||
            a.doc.title.localeCompare(b.doc.title)
    );

    const peak = scored[0]?.score || 1;
    const hits = scored.slice(0, limit).map(({ doc, score, exact, strongTokens, weakTokens }) => {
        // Confidence combines two things: how far it ranks at the top AND how
        // complete the match is. Normalizing the score against the peak alone
        // makes a single typo match look like 100%, which is a lie.
        const rank = Math.max(0.04, Math.min(1, score / peak));
        const completeness = strongTokens / tokens.length;
        const quality = weakTokens > strongTokens ? 0.55 : 0.55 + 0.45 * completeness;
        return {
            ...doc,
            score: Number(score.toFixed(3)),
            confidence: Number((rank * quality).toFixed(3)),
            exact,
            partial: `${strongTokens}/${tokens.length} token`,
        };
    });

    return { hits, total: scored.length, tokens };
}

/** Saran untuk autocomplete: token yang muncul di korpus berawalan `prefix`. */
export function suggest(index, prefix, limit = 6) {
    const p = normalize(prefix);
    if (!p) return [];
    const out = new Map();
    for (const [token, ids] of index.postings) {
        if (token.includes(' ') || ids.size < 1) continue;
        if (!token.startsWith(p)) continue;
        const weight = ids.size <= 3 ? 2 : 1; // istilah niche lebih berguna
        if (!out.has(token) || out.get(token).weight < weight) out.set(token, { token, weight });
    }
    return [...out.values()]
        .sort((a, b) => b.weight - a.weight || a.token.length - b.token.length)
        .slice(0, limit)
        .map((s) => s.token);
}

/** Sorotan hasil: token cocok dibungkus `*` supaya terminal bisa mewarnainya. */
export function highlight(text, tokens, marker = '*') {
    let out = String(text ?? '');
    for (const token of [...new Set(tokens)].sort((a, b) => b.length - a.length)) {
        if (token.length < 2) continue;
        out = out.replace(new RegExp(`(${escapeRe(token)})`, 'ig'), `${marker}$1${marker}`);
    }
    return out.replace(/\*{3}/g, '**').replace(/\*{4,}/g, '**');
}

/** Potong teks panjang di sekitar kecocokan pertama. */
export function snippet(text, tokens, length = 120) {
    const flat = String(text ?? '').replace(/\s+/g, ' ').trim();
    if (flat.length <= length) return flat;
    const lower = flat.toLowerCase();
    const at = tokens.reduce((best, t) => {
        const i = lower.indexOf(t);
        return i !== -1 && (best === -1 || i < best) ? i : best;
    }, -1);
    if (at === -1) return `${flat.slice(0, length).trimEnd()}…`;
    const start = Math.max(0, at - Math.floor(length / 3));
    return `${start > 0 ? '…' : ''}${flat.slice(start, start + length).trim()}…`;
}
