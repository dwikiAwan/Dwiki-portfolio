import { articles } from './articles';

export const portfolioData = {
    name: "Dwiki Kurniawan",
    title: "Software Engineer & Informatics Graduate",
    tagline: "Membangun solusi digital yang efisien, terstruktur, dan berorientasi pada data.",
    about: "Lulusan S1 Teknik Informatika dengan ketertarikan mendalam pada pengembangan perangkat lunak modern, arsitektur web, dan sistem berbasis teknologi Google.",
    email: "dwikikurniawan0002@gmail.com",

    // TODO: isi URL profil asli. Tombol yang URL-nya kosong tidak akan ditampilkan.
    socials: {
        github:  "https://github.com/dwikiAwan",    
        linkedin: "https://www.linkedin.com/in/dwiki-awan/",   
        instagram: "https://www.instagram.com/dwiki.awann/"   
    },

    // Sumber tunggal data skill (dipakai Growth.jsx dan CLI `wick skills`)
    skillCategories: [
        {
            category: "Web Development",
            accentColor: "from-[#4285F4] to-[#1A73E8]",
            dotColor: "bg-[#4285F4]",
            textColor: "text-[#4285F4] dark:text-[#8AB4F8]",
            skills: [
                { name: "React & Vite", level: 90, icon: "zap" },
                { name: "Tailwind CSS v4", level: 88, icon: "palette" },
                { name: "Laravel", level: 70, icon: "wrench" },
                { name: "JavaScript / ES6+", level: 85, icon: "code" }
            ]
        },
        {
            category: "Android Development",
            accentColor: "from-[#34A853] to-[#0D652D]",
            dotColor: "bg-[#34A853]",
            textColor: "text-success-ink dark:text-[#81C995]",
            skills: [
                { name: "Kotlin / Java", level: 82, icon: "bot" },
                { name: "Android Studio", level: 80, icon: "smartphone" },
                { name: "Mobile UI Design", level: 78, icon: "sparkles" }
            ]
        },
        {
            category: "Cloud & Network Engineering",
            accentColor: "from-[#FBBC05] to-[#EA4335]",
            dotColor: "bg-[#FBBC05]",
            textColor: "text-warn-ink dark:text-[#FDE293]",
            skills: [
                { name: "Google Cloud Platform (GCP)", level: 75, icon: "cloud" },
                { name: "Cisco Routing & Switching", level: 85, icon: "globe" },
                { name: "MikroTik Administration", level: 82, icon: "plug" }
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
            id: "dwekfolio",
            title: "Dwekfolio - Website Portfolio",
            category: "Frontend",
            description: "Website portofolio pribadi bergaya Google Design dengan terminal CLI interaktif, guestbook real-time, dan mode terang/gelap.",
            problem: "Portofolio statis umumnya kaku dan membuat rekruter sulit memahami kemampuan teknis seorang developer.",
            solution: "Membangun SPA berbasis komponen React dengan Tailwind CSS, Framer Motion, React Router, dan guestbook Firebase Firestore real-time, dilengkapi CLI 'wick' untuk menjelajah data.",
            techStack: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Firebase"],
            liveUrl: "",
            githubUrl: "https://github.com/dwikiAwan/Dwiki-portfolio"
        },
        {
            id: "fraction-app",
            title: "FractionApp - Media Belajar Pecahan (Skripsi)",
            category: "Android",
            description: "Aplikasi media pembelajaran matematika pecahan untuk siswa kelas 5 SD menggunakan metode gamifikasi, dibuat sebagai tugas akhir S1 Teknik Informatika.",
            problem: "Pembelajaran matematika pecahan untuk siswa kelas 5 SD cenderung monoton sehingga minat dan daya retensi belajar menurun.",
            solution: "Merancang dan membangun aplikasi Android native dengan Jetpack Compose serta pendekatan gamifikasi (poin, level, tantangan) agar proses belajar lebih menarik dan interaktif.",
            techStack: ["Android", "Kotlin", "Jetpack Compose", "Firebase"],
            liveUrl: "",
            githubUrl: "https://github.com/dwikiAwan/FranctionApp"
        },
        {
            id: "ml-cloud-capstone",
            title: "Capstone Machine Learning di Google Cloud",
            category: "Cloud & ML",
            description: "Capstone project Bangkit Academy: backend machine learning berbasis Node.js dan FastAPI yang di-deploy ke Google App Engine dan diakses aplikasi Android.",
            problem: "Model machine learning di sisi server harus melayani request dari aplikasi mobile secara stabil, scalable, dan konsisten antar lingkungan.",
            solution: "Mengkontainerisasi layanan dengan Docker, mengarsipkan arsitektur serverless di Google App Engine, dan mendokumentasikan RESTful API untuk pipeline ML dan tim Android.",
            techStack: ["Python", "FastAPI", "Node.js", "Docker", "Google App Engine"],
            liveUrl: "",
            githubUrl: "https://github.com/dwikiAwan/submission-Penerapan-Machine-Learning-dengan-Google-Cloud"
        },
        {
            id: "asclepius-server",
            title: "Asclepius Server - Backend Pendamping Health App",
            category: "Backend",
            description: "Backend JavaScript untuk aplikasi kesehatan, dibuat saat mempelajari penerapan machine learning dengan Google Cloud.",
            problem: "Model machine learning perlu endpoint yang rapi agar hasil prediksi bisa dikonsumsi aplikasi mobile dengan format yang konsisten.",
            solution: "Membangun service API backend sebagai penghubung antara pipeline machine learning dan konsumen aplikasi mobile.",
            techStack: ["JavaScript", "Node.js", "Machine Learning"],
            liveUrl: "",
            githubUrl: "https://github.com/dwikiAwan/asclepius-server"
        },
        {
            id: "bookshelf-api",
            title: "Bookshelf API with Google Cloud",
            category: "Cloud & ML",
            description: "Backend Bookshelf API yang di-deploy ke layanan Google Cloud, latihan penerapan arsitektur cloud pada project Dicoding.",
            problem: "Menyimpan dan menyajikan data buku butuh backend yang konsisten dan mudah di-deploy tanpa mengelola server secara manual.",
            solution: "Membangun REST API Bookshelf di Node.js lalu mendeploy-nya ke layanan Google Cloud dengan praktik arsitektur cloud yang baik.",
            techStack: ["JavaScript", "Node.js", "Google Cloud"],
            liveUrl: "",
            githubUrl: "https://github.com/dwikiAwan/BookshelfAPI_backend-with-Google-Cloud"
        },
        {
            id: "crud-php",
            title: "CRUD PHP - Aplikasi CRUD Sederhana",
            category: "Backend",
            description: "Program CRUD sederhana dengan PHP dan MySQL sebagai latihan fundamental pemrograman backend.",
            problem: "Pemula sering belum memahami hubungan antara CRUD, basis data relasional, dan pemrosesan form.",
            solution: "Membangun aplikasi CRUD PHP dengan MySQL yang memisahkan operasi create, read, update, delete pada satu sumber data.",
            techStack: ["PHP", "MySQL"],
            liveUrl: "",
            githubUrl: "https://github.com/dwikiAwan/CRUD-php"
        }
    ],

    // Artikel livedi src/data/articles.js (sumber tunggal isi artikel, bukan ringkasan saja).
    get blogs() {
        return articles;
    }
};
