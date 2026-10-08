import { useCallback, useEffect, useRef, useState } from 'react';

// Feed artikel real-time dari dev.to API publik (tanpa API key).
// Endpoint: https://dev.to/api/articles?tag=<tag>&per_page=<n>
const API = 'https://dev.to/api/articles';
const PAGE_SIZE = 12;
const CACHE_KEY = 'wick_feed_cache';
const CACHE_TTL = 5 * 60 * 1000;
const TIMEOUT = 8000;

export const FEED_TAGS = ['react', 'javascript', 'tailwindcss', 'firebase', 'docker', 'python'];

// Cache ringan di localStorage supaya halaman blog tidak kosong saat offline
const readCache = (tag) => {
    try {
        const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        const hit = raw?.[tag];
        if (!hit) return null;
        return Date.now() - hit.at < CACHE_TTL ? { items: hit.items, at: hit.at, cached: true } : null;
    } catch {
        return null;
    }
};

const writeCache = (tag, items) => {
    try {
        const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        raw[tag] = { items: items.slice(0, PAGE_SIZE), at: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(raw));
    } catch { /* storage penuh atau diblokir: abaikan */ }
};

const normalize = (raw) => ({
    id: `devto-${raw.id}`,
    title: raw.title,
    summary: raw.description || '',
    author: raw.user?.name || raw.user?.username || 'dev.to',
    authorUrl: raw.user?.username ? `https://dev.to/${raw.user.username}` : 'https://dev.to',
    avatar: raw.user?.profile_image_90 || '',
    image: raw.cover_image || raw.social_image || '',
    url: raw.url,
    tags: (raw.tag_list || []).slice(0, 4),
    readTime: raw.reading_time_minutes ? `${raw.reading_time_minutes} min read` : '',
    reactions: raw.public_reactions_count || 0,
    comments: raw.comments_count || 0,
    date: raw.readable_publish_date || '',
    publishedAt: raw.published_at || ''
});

/**
 * status: 'loading' | 'ready' | 'stale' | 'error'
 * refresh() mengambil ulang feed dan mengabaikan cache.
 */
export default function useLiveArticles(tag = 'react') {
    const [articles, setArticles] = useState([]);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');
    const [updatedAt, setUpdatedAt] = useState(null);
    const [live, setLive] = useState(false);
    const abortRef = useRef(null);

    const fetchArticles = useCallback(async (targetTag, { force = false } = {}) => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const cached = force ? null : readCache(targetTag);

        const timeout = setTimeout(() => controller.abort(), TIMEOUT);
        // Cache & status awal dipasang setelah satu tick agar tidak memicu cascading render
        await Promise.resolve();
        if (!controller.signal.aborted) {
            if (cached) {
                setArticles(cached.items);
                setUpdatedAt(cached.at);
                setStatus('stale');
            } else if (!force) {
                setStatus('loading');
            }
        }

        try {
            const res = await fetch(`${API}?tag=${encodeURIComponent(targetTag)}&per_page=${PAGE_SIZE}`, {
                signal: controller.signal,
                headers: { accept: 'application/vnd.forem.api-v1+json' }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (!Array.isArray(data)) throw new Error('Format tidak dikenali');
            const items = data.map(normalize);
            setArticles(items);
            setUpdatedAt(Date.now());
            setStatus('ready');
            setError('');
            writeCache(targetTag, items);
        } catch (err) {
            if (err.name === 'AbortError') return;
            setError(err.message || 'Gagal memuat artikel');
            setArticles((prev) => {
                if (prev.length) {
                    setStatus('stale');
                    return prev;
                }
                setStatus('error');
                return prev;
            });
        } finally {
            clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            await Promise.resolve();
            if (!cancelled) await fetchArticles(tag);
        };
        run();
        return () => { cancelled = true; abortRef.current?.abort(); };
    }, [tag, fetchArticles]);

    // Auto refresh setiap 5 menit selama tab aktif
    useEffect(() => {
        const id = setInterval(() => {
            if (document.visibilityState === 'visible') fetchArticles(tag, { force: true });
        }, 5 * 60 * 1000);
        return () => clearInterval(id);
    }, [tag, fetchArticles]);

    const refresh = useCallback(() => {
        setLive(true);
        fetchArticles(tag, { force: true }).finally(() => setLive(false));
    }, [tag, fetchArticles]);

    return { articles, status, error, updatedAt, live, refresh };
}