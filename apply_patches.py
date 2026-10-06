"""Jalankan dari root proyek:  python apply_patches.py
Menerapkan perubahan kecil pada file yang sudah ada. Aman dijalankan ulang."""
import os, re, sys

def rd(p): return open(p, encoding='utf-8').read()
def wr(p, s): open(p, 'w', encoding='utf-8', newline='').write(s)

def sub(path, old, new, regex=False):
    if not os.path.exists(path):
        print(f'SKIP (tidak ada): {path}'); return
    s = rd(path)
    if (re.search(old, s, re.S) if regex else old in s):
        s = re.sub(old, new, s, count=1, flags=re.S) if regex else s.replace(old, new, 1)
        wr(path, s); print(f'OK   {path}: {old[:40]!r}')
    else:
        print(f'--   {path}: pola tidak ditemukan (mungkin sudah diterapkan)')

def git_rename(a, b):
    """Rename aman untuk filesystem case-insensitive."""
    if os.path.exists(a) and os.path.basename(a) in os.listdir(os.path.dirname(a)):
        tmp = a + '.tmp'; os.rename(a, tmp); os.rename(tmp, b); print(f'OK   rename {a} -> {b}')

R = 'src/components/reactbits/'
# 1. Case-sensitivity & typo
git_rename(R + 'MagicRIngs.css', R + 'MagicRings.css')
sub(R + 'ShapeGrid.jsx', "'./shapegrid.css'", "'./ShapeGrid.css'")
sub('src/components/navbar.jsx', 'round6', 'round')
sub('src/pages/ProjectDetail.jsx', 'project.link', 'project.liveUrl')
sub('src/pages/ProjectDetail.jsx', 'project.github', 'project.githubUrl')

# 3. Dead code & data tunggal
for f in ('LiveMarqueeTicker.jsx', 'LiveGuestbookTicker.jsx'):
    p = 'src/components/' + f
    if os.path.exists(p): os.remove(p); print('DEL ', p)
sub('src/components/Growth.jsx', r"const skillCategories = \[.*?\n    \];", "const skillCategories = portfolioData.skillCategories;", regex=True)

# 4. Tema persisten, lazy three.js, reduced motion
L = 'src/components/LoadingScreen.jsx'
sub(L, "import { useState, useEffect } from 'react';", "import { useState, useEffect, lazy, Suspense } from 'react';")
sub(L, "import MagicRings from './reactbits/MagicRings';",
"""// three.js (~600 KB) hanya dimuat saat loading screen tampil
const MagicRingsLazy = lazy(() => import('./reactbits/MagicRings'));

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function MagicRings(props) {
    if (prefersReducedMotion()) return null;
    return <Suspense fallback={null}><MagicRingsLazy {...props} /></Suspense>;
}

const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};""")
sub(L, "useState('select-theme')", "useState(() => (localStorage.getItem('theme') ? 'ready-command' : 'select-theme'))")
sub(L, "const [selectedTheme, setSelectedTheme] = useState('light');", "const [selectedTheme, setSelectedTheme] = useState(getInitialTheme);")

A = 'src/App.jsx'
sub(A, "import { useState, useEffect } from 'react';", "import { useState, useEffect, useCallback } from 'react';")
sub(A, "const [isDarkMode, setIsDarkMode] = useState(false);",
"""const [isDarkMode, setIsDarkMode] = useState(false);
  const handleFinish = useCallback(() => setIsLoading(false), []);
  // Grid animasi penuh-halaman dimatikan di mobile & saat reduce-motion aktif
  const [showGrid] = useState(() => window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches);""")
sub(A, "onFinish={() => setIsLoading(false)}", "onFinish={handleFinish}")
sub(A, "<ShapeGrid", "{showGrid && <ShapeGrid")
sub(A, r"hoverTrailAmount=\{4\}\s*/>", "hoverTrailAmount={4}\n          />}", regex=True)
sub(A, "font-sans overflow-hidden", "font-sans overflow-x-clip")
sub(A, "Background Shap qeGrid", "Background ShapeGrid")
sub(A, "<FloatingTerminal />", "  <FloatingTerminal />")

sub('src/pages/Blog.jsx', "alt={item.title}", 'alt={item.title} loading="lazy"')

css = 'src/index.css'
if os.path.exists(css) and 'prefers-reduced-motion' not in rd(css):
    wr(css, rd(css) + """
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .animate-marquee, .animate-border-run, .animate-ping, .animate-pulse, .animate-bounce {
    animation: none !important;
  }
}
""")
    print('OK   index.css (reduced motion)')
print('\nSelesai. Jalankan: npm run lint && npm run build')
