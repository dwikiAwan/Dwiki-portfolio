// Artikel tulis sendiri. Dipakai Blog.jsx (tab "Artikel Saya") dan CLI `wick search`.
// Konten ditulis penuh supaya bisa dibaca tanpa keluar dari situs.

export const articles = [
    {
        id: "react-19-purity",
        title: "Mengatasi Error Purity dan Cascading Renders pada React 19",
        date: "Oktober 2026",
        readTime: "6 min read",
        tags: ["React", "Performance"],
        summary: "Peringatan purity di React 19 muncul karena ada efek samping di dalam proses render. Berikut cara saya menelusuri sumbernya sampai ke render beruntun.",
        content: [
            { type: "p", text: "Peringatan 'A component was changed by an impure function' muncul saat React menemukan penulisan state di tengah proses render. Gejalanya cukup khas: satu state berubah, lalu semua komponen yang membacanya render ulang. Penyebabnya biasanya ada di fungsi yang dipanggil saat render, bukan di dalam event handler." },
            { type: "h", text: "Dari mana efek sampingnya masuk" },
            { type: "p", text: "Pada proyek saya penyebabnya adalah pemanggilan fungsi navigasi langsung di dalam body komponen." },
            { type: "code", text: "// salah: efek samping terjadi saat render\nfunction Wrapper() {\n  const navigate = useNavigate();\n  navigate('/projects'); // menulis state router saat render\n  return null;\n}" },
            { type: "p", text: "Perbaikannya cukup memindahkan navigasi ke dalam useEffect, dengan dependensi yang benar." },
            { type: "code", text: "useEffect(() => {\n  navigate('/projects', { replace: true });\n}, [navigate]);" },
            { type: "h", text: "Kenapa render-nya beruntun" },
            { type: "p", text: "Cascading render terjadi ketika penulisan state terjadi saat fase commit. React harus menyelesaikan render ulang itu sebelum lanjut ke pekerjaan berikutnya, sehingga satu penulisan kecil bisa menunda banyak pekerjaan lain dalam satu frame. Solusinya bukan sprints, tapi memindahkan pekerjaan yang tidak perlu ke tempat yang benar: event handler, useMemo, atau callback." },
            { type: "list", items: [
                "Cek apakah ada state yang ditulis di luar event handler, useEffect, atau callback.",
                "Pindahkan perhitungan mahal ke useMemo atau useCallback dengan dependensi yang sempit.",
                "Naikkan state hanya kalau benar-benar dipakai beberapa anak sekaligus, jangan di setiap kartu."
            ]},
            { type: "p", text: "Setelah perubahan ini, profiler React tidak lagi menunjukkan render beruntun dan bundle utuh turun sekitar 40 KB." }
        ]
    },
    {
        id: "tailwind-v4-dark-mode",
        title: "Strategi Mode Gelap dengan Tailwind CSS v4 Tanpa Flash Putih",
        date: "Oktober 2026",
        readTime: "7 min read",
        tags: ["Tailwind CSS", "Dark Mode"],
        summary: "Tailwind v4 memakai konfigurasi berbasis CSS. Ini cara saya menyambungkan class dark ke localStorage dan prefers-color-scheme tanpa kedipan.",
        content: [
            { type: "p", text: "Masalah klasik mode gelap di SPA adalah flash putih: halaman dirender dengan tema terang, lalu JavaScript baru memasang tema gelap beberapa ratus milidetik kemudian. Penyebabnya logika tema baru dijalankan setelah React selesai mount." },
            { type: "h", text: "Terapkan tema sebelum render" },
            { type: "p", text: "Solusinya melakukan satu hal kecil di dalam head HTML: skrip inline pendek yang membaca localStorage, memasang class, lalu selesai sebelum browser menggambar body." },
            { type: "code", text: "<script>\n  const theme = localStorage.getItem('theme');\n  document.documentElement.classList.toggle('dark', theme === 'dark');\n</script>" },
            { type: "h", text: "Token warna di Tailwind v4" },
            { type: "p", text: "Tailwind v4 tidak lagi memakai file tailwind.config.js. Semua token ditulis di CSS lewat directive @theme, dan mode gelap memakai variant kustom supaya tidak bergantung pada strategi media query bawaan." },
            { type: "code", text: "@import \"tailwindcss\";\n@custom-variant dark (&:where(.dark, .dark *));\n\n@theme {\n  --color-surface: #ffffff;\n  --color-ink: #1f1f1f;\n}" },
            { type: "p", text: "Dengan begitu setiap komponen cukup menulis bg-surface dan text-ink, lalu dua tema berbagi satu nama token. Tidak ada lagi pasangan dark:bg-white dark:text-gray-900 yang mudah lupa di satu sudut komponen." }
        ]
    },
    {
        id: "firestore-guestbook-rules",
        title: "Membangun Guestbook Real-Time dengan Firestore Rules yang Ketat",
        date: "September 2026",
        readTime: "8 min read",
        tags: ["Firebase", "Security"],
        summary: "Validasi di client bukan pengaman. Saya menulis Rules Firestore agar guestbook tidak bisa disalahgunakan meski test mode masih aktif.",
        content: [
            { type: "p", text: "Membangun guestbook terlihat mudah: satu koleksi, satu onSnapshot. Yang sering terlewat adalah siapa pun bisa menulis ke koleksi itu kalau Rules masih dalam mode test. Validasi panjang di client hanya demi kenyamanan pengguna, bukan untuk keamanan." },
            { type: "h", text: "Anatomi Rules minimal" },
            { type: "code", text: "rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /guestbook/{msgId} {\n      allow read: if true;\n      allow create: if request.resource.data.name is string\n        && request.resource.data.name.size() > 0\n        && request.resource.data.name.size() <= 30\n        && request.resource.data.message is string\n        && request.resource.data.message.size() <= 250;\n      allow update: if request.resource.data\n                       .diff(resource.data)\n                       .affectedKeys()\n                       .hasOnly(['reactions']);\n      allow delete: if false;\n    }\n  }\n}" },
            { type: "h", text: "Pisahkan izin baca dan izin tulis" },
            { type: "p", text: "Membaca boleh terbuka supaya guestbook tetap real-time untuk semua pengunjung, tapi menulis harus melewati pemeriksaan panjang dan tipe. Untuk update, izinkan hanya field reactions yang berubah supaya pengguna tidak bisa menyunting pesan orang lain lewat request buatan sendiri." },
            { type: "list", items: [
                "Buka test mode hanya saat sedang mengembangkan, lalu publish Rules.",
                "Aktifkan Firebase App Check (reCAPTCHA v3) untuk menahan bot.",
                "Tambahkan jeda kirim di sisi client sebagai lapisan kedua, bukan satu-satunya."
            ]},
            { type: "p", text: "Aturan praktis: setiap validate yang penting harus ditulis ulang di server. Client selalu bisa dimanipulasi." }
        ]
    },
    {
        id: "skripsi-gamifikasi",
        title: "Merancang Gamifikasi untuk Skripsi Media Belajar Pecahan Kelas 5 SD",
        date: "September 2026",
        readTime: "9 min read",
        tags: ["Android", "Kotlin", "Gamification"],
        summary: "Skripsi saya menguji apakah poin, level, dan tantangan harian meningkatkan keterlibatan belajar pecahan. Ini temuan dan keputusan desain yang saya pakai.",
        content: [
            { type: "p", text: "Topik skripsi saya: aplikasi media pembelajaran matematika pecahan untuk siswa kelas 5 SD dengan metode gamifikasi. Fokusnya bukan membuat game, tapi menguji apakah lapisan motivasional sederhana bisa meningkatkan keterlibatan siswa pada materi yang secara matematis cukup abstrak." },
            { type: "h", text: "Tiga mekanisme yang dipakai" },
            { type: "list", items: [
                "Poin bertahap: tiap latihan benar menambah poin, poin menaikkan level dan membuka materi berikutnya.",
                "Tantangan harian: lima soal acak per hari dengan batas waktu, jadi ada alasan untuk membuka aplikasi tiap hari.",
                "Lencana prestasi: badge untuk konsistensi mengerjakan latihan, disimpan lokal agar tetap bisa memberi penghargaan tanpa internet."
            ]},
            { type: "h", text: "Keputusan teknis" },
            { type: "p", text: "Dibangun dengan Kotlin dan Jetpack Compose. Compose menghemat banyak baris dibanding XML karena komponen bisa disusun ulang sebagai fungsi. Firebase dipakai untuk sinkronisasi progres antar perangkat, dengan fallback lokal ketika perangkat sedang offline." },
            { type: "code", text: "data class Fraction(\n  val numerator: Int,\n  val denominator: Int\n) {\n  fun simplified(): Fraction {\n    val divisor = gcd(numerator, denominator)\n    return Fraction(numerator / divisor, denominator / divisor)\n  }\n}" },
            { type: "h", text: "Temuan" },
            { type: "p", text: "Keterlibatan mingguan naik, tapi materi yang terlalu abstrak tetap menjadi hambatan utama. Kesimpulannya: gamifikasi menutup kesenjangan disiplin, bukan kesenjangan pemahaman." }
        ]
    },
    {
        id: "docker-app-engine",
        title: "Deploy Backend FastAPI ke Google App Engine dengan Docker",
        date: "Agustus 2026",
        readTime: "8 min read",
        tags: ["Docker", "GCP", "Python"],
        summary: "Catatan capstone Bangkit: kontainerisasi backend machine learning, lalu deploy ke App Engine sampai request dari Android tersambung stabil.",
        content: [
            { type: "p", text: "Backend capstone project saya menerima request prediksi dari aplikasi Android. Ada dua kebutuhan utama: lingkungan harus identik antara laptop dan server, dan autoscaling harus bekerja tanpa saya menyentuh server." },
            { type: "h", text: "Dockerfile minimal" },
            { type: "code", text: "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8080\"]" },
            { type: "p", text: "Port 8080 bukan pilihan acak, itu port yang diminta App Engine. Container yang hanya listen di localhost akan terlihat mati dari luar, dan gejalanya biasanya berupa connection timeout, bukan error yang jelas." },
            { type: "h", text: "Serverless dan biaya" },
            { type: "p", text: "Instance yang selalu hidup akan dikenai biaya terus-menerus. App Engine mematikan instance yang menganggur lalu membangunkannya lagi saat request datang, jadi untuk API yang dipanggil sesekali pola ini jauh lebih murah. Untuk model machine learning yang besar, memuat model di memori tetap mahal, jadi saya menyimpannya sebagai singleton di luar handler." }
        ]
    },
    {
        id: "restful-api-kontrak",
        title: "Menulis RESTful API yang Mudah Dikonsumsi Tim Mobile",
        date: "Agustus 2026",
        readTime: "6 min read",
        tags: ["REST API", "Backend"],
        summary: "Kontrak API menentukan seberapa cepat tim frontend bisa integrasi. Bentuk response yang konsisten dan error yang bisa dibaca developer menghemat hari.",
        content: [
            { type: "p", text: "Ketika backend dan mobile dikerjakan tim berbeda, misunderstand datang dari hal kecil: field nullable yang tidak dideklarasikan, kode error yang berubah-ubah, timestamp tanpa zona waktu. Semua bisa dicegah dengan kontrak yang ditulis jelas." },
            { type: "h", text: "Bentuk response yang konsisten" },
            { type: "code", text: "{\n  \"status\": \"success\",\n  \"data\": [ { \"id\": 1, \"label\": \"output\" } ],\n  \"meta\": { \"count\": 1 }\n}" },
            { type: "list", items: [
                "Timestamp selalu ISO 8601 dengan zona waktu, contoh 2026-08-14T09:20:00Z.",
                "Field numerik tidak pernah diubah jadi string hanya demi-ALASAN parsing di sisi klien.",
                "Kode error punya nama, bukan hanya angka: MODEL_NOT_READY lebih berguna dari 500."
            ]},
            { type: "p", text: "Aturan paling berdampak: setiap response error harus memberi tahu apa yang perlu diperbaiki klien. Pesan seperti invalid input memaksa frontend menebak, sedangkan numerator harus lebih besar dari 0 langsung bisa diimplementasikan." }
        ]
    },
    {
        id: "canvas-grid-animasi",
        title: "Grid Animasi di Canvas: Efek Latar yang Tetap Ringan",
        date: "Juli 2026",
        readTime: "7 min read",
        tags: ["Canvas", "Performance"],
        summary: "Saya membandingkan animasi grid dengan CSS, SVG, dan canvas. Canvas menang saat jumlah elemen banyak, tapi harus dijaga aksesibilitasnya.",
        content: [
            { type: "p", text: "Efek latar grid yang bergerak dipakai di hampir setiap portofolio modern. Ada beberapa cara membuatnya: pseudo-element CSS, SVG pattern, atau canvas. Perbedaannya baru terasa kalau jumlah elemennya banyak." },
            { type: "h", text: "Kapan canvas menang" },
            { type: "p", text: "Gradient CSS yang diulang untuk ratusan sel grid akan membebani thread utama karena tiap perubahan memicu pekerjaan layout. Canvas cukup menggambar ulang pixel buffer per frame, dan jumlah sel tidak lagi jadi masalah." },
            { type: "code", text: "function drawGrid(ctx, w, h, offset) {\n  const size = 40;\n  ctx.strokeStyle = 'rgba(66,133,244,0.15)';\n  ctx.beginPath();\n  for (let x = -size + offset.x; x < w + size; x += size) {\n    ctx.moveTo(x, 0);\n    ctx.lineTo(x, h);\n  }\n  for (let y = -size + offset.y; y < h + size; y += size) {\n    ctx.moveTo(0, y);\n    ctx.lineTo(w, y);\n  }\n  ctx.stroke();\n}" },
            { type: "h", text: "Jangan lupa prefers-reduced-motion" },
            { type: "p", text: "Animasi terus-menerus adalah salah satu pemicu utama gangguan pada pengguna dengan gangguan vestibular. Karena itu animasi wajib berhenti ketika media query prefers-reduced-motion aktif, bukan hanya membuatnya lebih halus." }
        ]
    },
    {
        id: "terminal-ui",
        title: "Membangun CLI Interaktif di dalam Browser",
        date: "Juli 2026",
        readTime: "8 min read",
        tags: ["CLI", "UX"],
        summary: "Terminal di portofolio ini bukan hiasan. Saya bahas parsing input, riwayat perintah, dan autocomplete yang terasa seperti alat sungguhan.",
        content: [
            { type: "p", text: "Bagian favorit saya dari portofolio ini adalah terminal yang benar-benar berfungsi: wick about, wick projects, wick nav to blog. Terlihat seperti tambahan sampai kamu sadar pengunjung bisa menjelajah isi situs tanpa mouse." },
            { type: "h", text: "Struktur perintah" },
            { type: "p", text: "Setiap perintah dipetakan ke fungsi yang mengembalikan output dan ikon, jadi menambah perintah baru cukup satu entri di daftar tanpa menyentuh bagian parsing." },
            { type: "code", text: "case 'search': {\n  const hits = searchIndex.filter((row) =>\n    row.text.toLowerCase().includes(arg.toLowerCase())\n  );\n  return {\n    out: hits.map((h) => h.info).join('\\n') || 'Tidak ada hasil.'\n  };\n}" },
            { type: "h", text: "Autocomplete dengan Tab" },
            { type: "p", text: "Autocomplete diimplementasikan dengan menyaring daftar perintah berdasarkan prefix yang sudah diketik. Match pertama langsung disisipkan, sisanya ditampilkan sebagai saran. Detail kecil inilah yang membuat terminal terasa seperti alat sungguhan, bukan sekadar input teks dengan font monospace." },
            { type: "list", items: [
                "Simpan input di array state, bukan di node DOM, supaya mudah di-backspace.",
                "Panah atas dan panah bawah menelusuri riwayat perintah.",
                "Escape membersihkan layar, Enter menjalankan perintah."
            ]}
        ]
    },
    {
        id: "git-solo",
        title: "Kebijakan Git untuk Proyek Solo",
        date: "Juni 2026",
        readTime: "5 min read",
        tags: ["Git", "Workflow"],
        summary: "Feature branch tetap berjalan meski cuma satu orang. Riwayat commit yang rapi adalah dokumentasi gratis untuk diri sendiri di masa depan.",
        content: [
            { type: "p", text: "Bekerja sendiri sering membuat orang langsung commit ke main. Akibatnya: satu commit besar, tidak ada rollback yang aman, dan riwayat yang sulit dibaca enam bulan kemudian." },
            { type: "h", text: "Aturan yang saya pakai" },
            { type: "list", items: [
                "Satu branch per fitur: feat/nama-fitur atau fix/nama-bug.",
                "Commit message berbentuk feat:, fix:, docs:, refactor:.",
                "Pull Request ke main sebagai checklist, walau tidak ada reviewer lain."
            ]},
            { type: "code", text: "git checkout -b feat/terminal-autocomplete\n# ... pekerjaan ...\ngit add -A\ngit commit -m \"feat(terminal): autocomplete perintah dengan Tab\"\ngit checkout main\ngit merge --no-ff feat/terminal-autocomplete" },
            { type: "p", text: "Merge dengan --no-ff menyimpan konteks bahwa fitur pernah berdiri sebagai branch tersendiri. Informasi itu berguna saat membaca git log beberapa tahun kemudian." }
        ]
    },
    {
        id: "jaringan-dasar",
        title: "Konsep Jaringan yang Sering Dipakai Saat Wawancara",
        date: "Juni 2026",
        readTime: "7 min read",
        tags: ["Networking", "MikroTik"],
        summary: "Routing, switching, dan VLAN dibahas lewat topologi lab Packet Tracer, bukan hafalan. Berikut beberapa konsep yang paling sering muncul.",
        content: [
            { type: "p", text: "Jaringan internet adalah bidang saya yang paling praktis, dan juga yang paling sering ditanyakan saat wawancara meski lowongannya posisi perangkat lunak. Lab kecil di Cisco Packet Tracer cukup untuk memahami sebagian besar konsep yang diuji." },
            { type: "h", text: "Perbandingan yang sering ditanyakan" },
            { type: "list", items: [
                "Hub versus switch: hub meneruskan frame ke semua port, switch belajar MAC address lalu hanya mengirim ke port yang tepat.",
                "Router versus Layer 3 switch: router memutuskan berdasarkan IP di layer 3, sedangkan Layer 3 switch melakukan hal serupa di perangkat khusus.",
                "Static route versus dynamic: static diisi manual dan sederhana, dynamic dipropagasi otomatis oleh protokol seperti OSPF."
            ]},
            { type: "h", text: "VLAN sebagai isolasi" },
            { type: "p", text: "VLAN memisahkan satu jaringan fisik menjadi beberapa broadcast domain, sehingga kepadatan broadcast di satu VLAN tidak memengaruhi VLAN lain. Di lingkungan kampus saya pernah memakainya untuk memisahkan trafik tamu dari trafik internal." },
            { type: "p", text: "Konsep yang paling sering membuat orang salah menjawab adalah layer OSI. Kabel LAN bekerja di layer 1 dan 2, switch di layer 2, router di layer 3, dan protokol seperti HTTP di layer 7. Kalau soal menyebut alamat IP, jawabannya hampir selalu berada di layer 3 atau ke atas." }
        ]
    },
    {
        id: "php-crud-pola",
        title: "Pola CRUD Sederhana yang Tidak Cepat Rusak",
        date: "Mei 2026",
        readTime: "6 min read",
        tags: ["PHP", "Backend"],
        summary: "CRUD dengan PHP dan MySQL terlihat sepele sampai datanya mulai bercabang. Ini versi yang masih rapi setelah tabel berisi ribuan baris.",
        content: [
            { type: "p", text: "Proyek CRUD PHP adalah latihan fundamental, dan begitulah nilainya: mempelajari apa yang terjadi antara form dan tabel. Tantangannya bukan menulis INSERT, tapi menjaga agar kode tetap terbaca setelah fitur bertambah." },
            { type: "h", text: "Prepared statement, selalu" },
            { type: "code", text: "$stmt = $pdo->prepare(\n  'INSERT INTO products (name, price) VALUES (:name, :price)'\n);\n$stmt->execute([\n  'name' => $name,\n  'price' => (float) $price,\n]);" },
            { type: "p", text: "Prepared statement melindungi dari SQL injection sekaligus memisahkan kode dari data, sehingga nama produk yang mengandung tanda kutip tidak lagi merusak query." },
            { type: "h", text: "Pisahkan validasi dari penyimpanan" },
            { type: "p", text: "Validasi input, pemrosesan, dan tampilan sebaiknya berada di lapisan berbeda. Saat aturan bisnis berubah, cukup satu file yang perlu disentuh, bukan seluruh aplikasi." }
        ]
    },
    {
        id: "ml-pipeline-produksi",
        title: "Pipeline Machine Learning dari Notebook ke Produksi",
        date: "Mei 2026",
        readTime: "8 min read",
        tags: ["Machine Learning", "GCP"],
        summary: "Notebook yang akurat tinggi belum tentu berguna di produksi. Endpoint inferensi yang benar butuh beberapa pekerjaan tambahan yang sering dilewatkan.",
        content: [
            { type: "p", text: "Pelajaran terbesar dari project machine learning di Dicoding: notebook dengan akurasi tinggi belum tentu berguna ketika dipakai aplikasi nyata. Yang dibutuhkan adalah layanan yang bisa menjawab request secara berulang dengan hasil yang konsisten." },
            { type: "h", text: "Langkah yang sering dilewatkan" },
            { type: "list", items: [
                "Versioning model dan dependensi supaya hasil bisa direproduksi.",
                "Validasi input di endpoint, bukan hanya di notebook.",
                "Endpoint yang mengembalikan nilai keyakinan, bukan hanya label.",
                "Logging request supaya bisa ditelusuri ketika prediksi terasa aneh."
            ]},
            { type: "p", text: "Bagian yang paling sering menimbulkan masalah adalah perbedaan format data antara training dan inference. Di notebook kolom tanggal masih berupa teks, sedangkan di aplikasi sudah menjadi timestamp. Model yang dilatih dengan format berbeda akan gagal diam-diam, dan gejalanya baru muncul saat sudah berjalan di produksi." }
        ]
    }
];

export const articleTags = [
    "Semua",
    ...new Set(articles.flatMap((a) => a.tags || []))
];