export const portfolioData = {
    name: "Dwiki Kurniawan",
    title: "Software Engineer & Informatics Graduate",
    tagline: "Membangun solusi digital yang efisien, terstruktur, dan berorientasi pada data.",
    about: "Lulusan S1 Teknik Informatika dengan ketertarikan mendalam pada pengembangan perangkat lunak modern, arsitektur web, dan sistem berbasis teknologi Google.",
    email: "dwikikurniawan0002@gmail.com",

    // TODO: isi URL profil asli. Tombol yang URL-nya kosong tidak akan ditampilkan.
    socials: {
        github: "",     // contoh: "https://github.com/username-kamu"
        linkedin: "",   // contoh: "https://www.linkedin.com/in/username-kamu"
        instagram: ""   // contoh: "https://www.instagram.com/username-kamu"
    },

    // Sumber tunggal data skill (dipakai Growth.jsx dan CLI `wick skills`)
    skillCategories: [
        {
            category: "Web Development",
            accentColor: "from-[#4285F4] to-[#1A73E8]",
            dotColor: "bg-[#4285F4]",
            textColor: "text-[#4285F4] dark:text-[#8AB4F8]",
            skills: [
                { name: "React & Vite", level: 90, icon: "⚡" },
                { name: "Tailwind CSS v4", level: 88, icon: "🎨" },
                { name: "Laravel", level: 70, icon: "🛠️" },
                { name: "JavaScript / ES6+", level: 85, icon: "💻" }
            ]
        },
        {
            category: "Android Development",
            accentColor: "from-[#34A853] to-[#0D652D]",
            dotColor: "bg-[#34A853]",
            textColor: "text-[#137333] dark:text-[#81C995]",
            skills: [
                { name: "Kotlin / Java", level: 82, icon: "🤖" },
                { name: "Android Studio", level: 80, icon: "📱" },
                { name: "Mobile UI Design", level: 78, icon: "✨" }
            ]
        },
        {
            category: "Cloud & Network Engineering",
            accentColor: "from-[#FBBC05] to-[#EA4335]",
            dotColor: "bg-[#FBBC05]",
            textColor: "text-[#B06000] dark:text-[#FDE293]",
            skills: [
                { name: "Google Cloud Platform (GCP)", level: 75, icon: "☁️" },
                { name: "Cisco Routing & Switching", level: 85, icon: "🌐" },
                { name: "MikroTik Administration", level: 82, icon: "🔌" }
            ]
        }
    ],

    // Urut kronologis
    growth: [
        { period: "2016 - 2022", title: "Pondok Modern Darussalam Gontor", description: "Santri Pondok Modern Darussalam Gontor" },
        { period: "2022 - 2026", title: "Pendidikan S1 Teknik Informatika", description: "Mempelajari fundamental ilmu komputer, struktur data, algoritma, serta rekayasa perangkat lunak." },
        { period: "2025 - Sekarang", title: "Pengembangan Portofolio & Profesional", description: "Membangun proyek skala penuh dan siap berkontribusi di industri teknologi." },
        { period: "2026", title: "Staff LPTSI", description: "Menjadi salah satu staff LPTSI UNIDA Gontor." }
    ],

    thesis: {
        title: "Pengembangan Aplikasi Media Pembelajaran Matematika Pecahan kelas 5 SD Berbasis Android dengan metode gamifikasi",
        description: "Penelitian akhir S1 yang merancang dan membangun aplikasi Android sebagai media belajar pecahan untuk siswa kelas 5 SD, memakai pendekatan gamifikasi agar proses belajar lebih menarik dan interaktif.",
        tech: ["Android", "Kotlin", "Jetpack Compose", "Firebase"],
        status: "Lulus dengan Predikat Memuaskan (S.Kom.)"
    },

    // TODO: tambahkan `url` kredensial asli; tambah entri baru hanya jika sertifikatnya sudah ada.
    certifications: [
        { issuer: "Google / Platform Industri", title: "Google Cloud Skill Boost", year: "2024" },
        { issuer: "Dicoding / Platform Global", title: "Cloud Computing", year: "2024" }
    ],

    currentlyLearning: [
        "Advanced TypeScript Patterns",
        "Docker & Containerization for Production",
        "Cloud Architecture (AWS / Google Cloud Basic)"
    ],

    // liveUrl / githubUrl kosong = tombol disembunyikan. Isi dengan URL nyata.
    projects: [
        {
            id: "1",
            title: "Sistem Portofolio Google Style",
            category: "Frontend",
            description: "Website portofolio pribadi yang dirancang dengan estetika Google Skills & Growth menggunakan React dan Tailwind CSS.",
            problem: "Portofolio biasa sering kali kaku dan kurang interaktif bagi rekruter muda.",
            solution: "Membangun antarmuka berbasis komponen React dengan Framer Motion, Tailwind CSS, dan komponen kustom interaktif.",
            techStack: ["React", "Tailwind CSS", "Vite", "Framer Motion"],
            liveUrl: "",
            githubUrl: ""
        },
        {
            id: "2",
            title: "Aplikasi Manajemen Tugas (Task Management)",
            category: "Fullstack",
            description: "Aplikasi CRUD berbasis web untuk mengelola produktivitas harian dengan antarmuka yang bersih dan responsif.",
            problem: "Kebutuhan pengelolaan tugas harian yang terstruktur dan cepat bagi pengguna umum.",
            solution: "Membuat aplikasi CRUD web responsif dengan backend terintegrasi.",
            techStack: ["React", "Node.js", "Express", "Tailwind CSS"],
            liveUrl: "",
            githubUrl: ""
        },
        {
            id: "data-analytics",
            title: "Analisis Data & Visualisasi Performa",
            category: "Data",
            description: "Dashboard analitik interaktif untuk memproses dataset industri dan menyajikannya dalam bentuk grafik matang.",
            problem: "Kesulitan membaca dataset mentah dalam jumlah besar secara visual.",
            solution: "Membangun dashboard analitik interaktif menggunakan pustaka pemrosesan data Python.",
            techStack: ["Python", "Pandas", "Tailwind CSS"],
            liveUrl: "",
            githubUrl: ""
        }
    ],

    blogs: [
        {
            id: "optimizing-react-purity",
            title: "Mengatasi Error Purity dan Cascading Renders pada React 19",
            date: "Oktober 2026",
            readTime: "4 min read",
            summary: "Tips dan trik membersihkan peringatan ESLint terkait fungsi tidak murni di dalam React Hooks."
        }
    ]
};
