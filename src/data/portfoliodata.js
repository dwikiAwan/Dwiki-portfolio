import { articles } from './articles';

export const portfolioData = {
    name: "Dwiki Kurniawan",
    title: "Software Engineer & Informatics Graduate",
    tagline: "Membangun solusi digital yang efisien, terstruktur, dan berorientasi pada data.",
    about: "Lulusan S1 Teknik Informatika dengan pengalaman sebagai Staff IT dan Dukungan Teknis. Seorang pembelajar berkelanjutan yang berkomitmen untuk terus menguasai perkembangan teknologi, dengan fokus mendalam pada pengembangan perangkat lunak full-stack (Web & Mobile), perancangan infrastruktur cloud, serta manajemen administrasi jaringan komputer skala luas. Siap mendedikasikan keahlian dalam membangun solusi digital modern yang andal, aman, dan mudah digunakan, guna mendukung stabilitas serta operasional teknologi inovatif yang adaptif.",
    email: "dwikikurniawan0002@gmail.com",

    // social connect
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
                { name: "React JS", level: 90, icon: "zap", slug: "react", url: "https://react.dev" },
                { name: "Tailwind CSS v4", level: 88, icon: "palette", slug: "tailwindcss", url: "https://tailwindcss.com" },
                { name: "Laravel", level: 70, icon: "wrench", slug: "laravel", url: "https://laravel.com" },
                { name: "JavaScript", level: 85, icon: "code", slug: "javascript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" }
            ]
        },
        {
            category: "Android Development",
            accentColor: "from-[#34A853] to-[#0D652D]",
            dotColor: "bg-[#34A853]",
            textColor: "text-success-ink dark:text-[#81C995]",
            skills: [
                { name: "Kotlin & Jetpack Compose", level: 90, icon: "bot", slug: "kotlin", url: "https://kotlinlang.org" },
                { name: "React Native", level: 60, icon: "code", slug: "react", url: "https://reactnative.dev" },
                { name: "Android Studio", level: 80, icon: "smartphone", slug: "androidstudio", url: "https://developer.android.com/studio" },
                { name: "Mobile UI Design", level: 70, icon: "sparkles" }

            ]
        },
        {
            category: "Cloud & Network Engineering",
            accentColor: "from-[#FBBC05] to-[#EA4335]",
            dotColor: "bg-[#FBBC05]",
            textColor: "text-warn-ink dark:text-[#FDE293]",
            skills: [
                { name: "Google Cloud Platform (GCP)", level: 75, icon: "cloud", slug: "googlecloud", url: "https://cloud.google.com" },
                { name: "Cisco Routing & Switching", level: 85, icon: "globe", slug: "cisco", url: "https://www.cisco.com" },
                { name: "MikroTik Administration", level: 82, icon: "plug", slug: "mikrotik", url: "https://mikrotik.com" },
                { name: "IP Configuration", level: 90, icon: "network" },
                { name: "Instalasi Topologi Jaringan", level: 90, icon: "network" }
            ]
        },
        {
            category: "Database",
            accentColor: "from-[#4285F4] to-[#0D652D]",
            dotColor: "bg-[#4285F4]",
            textColor: "text-accent dark:text-[#8AB4F8]",
            skills: [
                { name: "Firebase", level: 88, icon: "database", slug: "firebase", url: "https://firebase.google.com" },
                { name: "MySQL", level: 85, icon: "database", slug: "mysql", url: "https://www.mysql.com" },
                { name: "PostgreSQL", level: 78, icon: "database", slug: "postgresql", url: "https://www.postgresql.org" }
            ]
        }
    ],

    // Urut kronologis
    growth: [
    {
        period: "2016 - 2022",
        title: "Kulliyatul Mu'allimin Al-Islamiyyah (KMI)",
        institution: "Pondok Modern Darussalam Gontor",
        description: "Mendapat pendidikan dasar dan menengah di Pondok Modern Darussalam Gontor, mempelajari ilmu agama, bahasa, dan keterampilan dasar yang membentuk karakter serta disiplin belajar."
    },
    {
        period: "2022 - 2026",
        title: "S1 Teknik Informatika",
        institution: "Universitas Darussalam Gontor",
        description: "Mempelajari dasar-dasar ilmu komputer, algoritma, pemrograman, dan pengembangan perangkat lunak"
    },
    {
        period: "2023 - 2024",
        title: "Divisi Akademik",
        institution: "HIMATIF (Himpunan Mahasiswa Teknik Informatika)",
        description: "Mengelola urusan akademik himpunan: administrasi dan penjadwalan mata kuliah, koordinasi dengan dosen, serta program pendampingan belajar bagi mahasiswa Teknik Informatika."
    },
    {
        period: "2023 - 2026",
        title: "Staff LPTSI",
        institution: "UNIDA Gontor",
        description: "Menjadi staff Lembaga Pengembangan Teknologi dan Sistem Informasi (LPTSI) UNIDA Gontor, mengelola infrastruktur IT dan pengembangan sistem internal."
    },
    {
        period: "2024",
        title: "Bangkit Academy",
        institution: "Cohort Cloud Computing 2024",
        description: "Mengikuti program Cloud Computing bersama Google Skills Boost dan mitra industri, mencakup provisioning infrastruktur, jaringan, keamanan cloud, hingga capstone project."
    },
    {
        period: "2025 - Sekarang",
        title: "Pengembangan Portofolio & Profesional",
        institution: "Pengembangan Diri",
        description: "Membangun portofolio proyek nyata, mengasah skill teknis, dan berkolaborasi dalam tim untuk menyiapkan karier profesional di bidang software engineering."
    }
],

    thesis: {
        title: "Pengembangan Aplikasi Media Pembelajaran Matematika Pecahan kelas 5 SD Berbasis Android dengan metode gamifikasi",
        description: "Penelitian akhir S1 yang merancang dan membangun aplikasi Android sebagai media belajar pecahan untuk siswa kelas 5 SD, memakai pendekatan gamifikasi agar proses belajar lebih menarik dan interaktif.",
        tech: ["Android", "Kotlin", "Jetpack Compose", "Firebase"],
        status: "Lulus dengan Predikat Memuaskan (S.Kom.)"
    },

    // TODO: tambahkan `url` kredensial asli; tambah entri baru hanya jika sertifikatnya sudah ada.
    certifications: [
        // Dicoding Certificates
        { issuer: "Dicoding", title: "Belajar Dasar Pemrograman Web", year: "2024", url: "https://www.dicoding.com/certificates/JLX14EG65X72" },
        { issuer: "Dicoding", title: "Belajar Dasar Cloud Computing", year: "2024", url: "https://www.dicoding.com/certificates/98XW57880PM3" },
        { issuer: "Dicoding", title: "Belajar Dasar Machine Learning", year: "2024", url: "https://www.dicoding.com/certificates/1RXYWWE89ZVM" },
        { issuer: "Dicoding", title: "Belajar Membuat Aplikasi Android untuk Pemula", year: "2024", url: "https://www.dicoding.com/certificates/MEPJOOWKQZ3V" },
        { issuer: "Dicoding", title: "Belajar Fundamental Aplikasi Android", year: "2024", url: "https://www.dicoding.com/certificates/RVZK002JMZD5" },
        { issuer: "Dicoding", title: "Belajar Membuat Front-End Web untuk Pemula", year: "2024", url: "https://www.dicoding.com/certificates/98XW070GWXM3" },

        // Credly Badges
        { issuer: "Credly / Google", title: "Google Cloud Fundamentals: Core Infrastructure", year: "2024", url: "https://www.credly.com/badges/e103a79f-a30a-482a-92d3-83df96c14f36/public_url" },
        { issuer: "Credly / Google", title: "Deploy to Kubernetes in Google Cloud", year: "2024", url: "https://www.credly.com/badges/87919d90-aeec-4476-966e-59fa68c98770/public_url" },
        { issuer: "Credly / Google", title: "Set Up and Configure a Cloud Environment in Google Cloud", year: "2024", url: "https://www.credly.com/badges/d089c61e-d04f-478c-addb-babfe1c6108f/public_url" },

        // Google Skills Badges
        { issuer: "Google Skills", title: "Google Cloud Fundamentals: Core Infrastructure", year: "2024", url: "https://www.skills.google/public_profiles/107a4dd9-1dff-4edc-b134-71c3a8af1fdb/badges/11735204" },
        { issuer: "Google Skills", title: "Deploy to Kubernetes in Google Cloud", year: "2024", url: "https://www.skills.google/public_profiles/107a4dd9-1dff-4edc-b134-71c3a8af1fdb/badges/11727758" },
        { issuer: "Google Skills", title: "Build and Deploy Machine Learning Solutions on Vertex AI", year: "2024", url: "https://www.skills.google/public_profiles/107a4dd9-1dff-4edc-b134-71c3a8af1fdb/badges/11745914" },
        { issuer: "Google Skills", title: "Perform Foundational Data, ML, and AI Tasks in Google Cloud", year: "2024", url: "https://www.skills.google/public_profiles/107a4dd9-1dff-4edc-b134-71c3a8af1fdb/badges/11961526" },
        { issuer: "Google Skills", title: "Build and Secure Networks in Google Cloud", year: "2024", url: "https://www.skills.google/public_profiles/107a4dd9-1dff-4edc-b134-71c3a8af1fdb/badges/11962881" },

        // Google Skills Profile (overview)
        { issuer: "Google Skills", title: "Profil Sertifikasi Lengkap", year: "2024", url: "https://www.skills.google/profile/badges?credential_type=skill_badge" },

        // Google Drive Documents (Transkrip / Sertifikat Pendukung)
        { issuer: "Google Drive", title: "Transkrip Nilai / Sertifikat Pendukung 1", year: "2024", url: "https://drive.google.com/file/d/19cxejjEOD0_IFvN_UPuGxnumzXTYfWLQ/view?usp=sharing" },
        { issuer: "Google Drive", title: "Transkrip Nilai / Sertifikat Pendukung 2", year: "2024", url: "https://drive.google.com/file/d/1MLWbtL6yuGMc3VJ97fxaMxFtCCMPAaFl/view?usp=sharing" },

        // Existing entries (dipertahankan)
        { issuer: "Google / Platform Industri", title: "Google Cloud Skill Boost", year: "2024" },
        { issuer: "Dicoding / Platform Global", title: "Cloud Computing", year: "2024" }
    ],

    currentlyLearning: [
        "Advanced TypeScript Patterns",
        "Docker & Containerization for Production",
        "Cloud Architecture (AWS / Google Cloud Basic)"
    ],

    // liveUrl / githubUrl kosong = tombol disembunyikan. Isi dengan URL nyata.
    // Urutan pertama = proyek unggulan yang ditampilkan di halaman Home (/projects section).
    projects: [
        {
            id: "fraction-app",
            title: "FractionApp - Media Belajar Pecahan (Skripsi)",
            category: "Android",
            description: "Aplikasi media pembelajaran matematika pecahan untuk siswa kelas 5 SD menggunakan metode gamifikasi, dibuat sebagai tugas akhir S1 Teknik Informatika.",
            problem: "Pembelajaran matematika pecahan untuk siswa kelas 5 SD cenderung monoton sehingga minat dan daya retensi belajar menurun.",
            solution: "Merancang dan membangun aplikasi Android native dengan Jetpack Compose serta pendekatan gamifikasi (poin, level, tantangan) agar proses belajar lebih menarik dan interaktif.",
            techStack: ["Android", "Kotlin", "Jetpack Compose", "Firebase"],
            images: ["/projects/fraction-app-1.webp"],
            liveUrl: "",
            githubUrl: "https://github.com/dwikiAwan/FranctionApp"
        },
        {
            id: "eduagrocaru",
            title: "EduAgroCaru - Marketplace & Wisata Edukasi",
            category: "Full Stack & Cloud",
            description: "Sistem informasi integrasi marketplace produk pertanian dan reservasi kunjungan kebun agrowisata edukasi dalam satu platform, dilengkapi dashboard admin dan laporan keuangan otomatis.",
            problem: "Pengelolaan destinasi agrowisata edukasi seringkali memisahkan pemesanan produk dan reservasi kunjungan secara manual, sehingga pencatatan kas dan laporan keuangan menjadi kurang transparan.",
            solution: "Membangun platform all-in-one dengan backend Laravel dan frontend React: modul marketplace produk, reservasi kunjungan, admin dashboard, serta pelaporan keuangan otomatis berdasarkan kategori pemasukan.",
            techStack: ["Laravel", "React", "MySQL", "REST API", "Admin Dashboard"],
            images: ["/projects/eduagrocaru-1.webp"],
            liveUrl: "",
            githubUrl: "https://github.com/dwikiAwan/eduagrocaru"
        },
        {
            id: "sertifchain",
            title: "SertifChain - Verifikasi Sertifikat Digital",
            category: "Blockchain",
            description: "Sistem verifikasi keaslian sertifikat digital berbasis blockchain untuk memastikan tidak ada pemalsuan dokumen, dengan proses issuer upload dan validasi publik.",
            problem: "Sertifikat fisik atau digital sering diragukan kebenarannya sehingga diperlukan mekanisme verifikasi yang terpercaya dan terintegrasi.",
            solution: "Membangun arsitektur verifikasi sertifikat yang menyimpan data ke penyimpanan terpercaya (blockchain) sehingga hanya issuer yang dapat mengunggah dan publik dapat memvalidasi keasliannya.",
            techStack: ["Blockchain", "Smart Contract", "API Backend", "Frontend"],
            images: ["/projects/sertifchain-1.webp"],
            liveUrl: "",
            githubUrl: "https://github.com/dwikiAwan/Sertifchain"
        },
        {
            id: "ml-cloud-capstone",
            title: "Capstone Machine Learning di Google Cloud",
            category: "Cloud & ML",
            description: "Capstone project Bangkit Academy: backend machine learning berbasis Node.js dan FastAPI yang di-deploy ke Google App Engine dan diakses aplikasi Android.",
            problem: "Model machine learning di sisi server harus melayani request dari aplikasi mobile secara stabil, scalable, dan konsisten antar lingkungan.",
            solution: "Mengkontainerisasi layanan dengan Docker, mengarsipkan arsitektur serverless di Google App Engine, dan mendokumentasikan RESTful API untuk pipeline ML dan tim Android.",
            techStack: ["Python", "FastAPI", "Node.js", "Docker", "Google App Engine"],
            images: ["/projects/ml-cloud-capstone-1.webp"],
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
            images: ["/projects/asclepius-server-1.webp"],
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
            images: ["/projects/bookshelf-api-1.webp"],
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
            images: ["/projects/crud-php-1.webp"],
            liveUrl: "",
            githubUrl: "https://github.com/dwikiAwan/CRUD-php"
        }
    ],

    // Artikel livedi src/data/articles.js (sumber tunggal isi artikel, bukan ringkasan saja).
    get blogs() {
        return articles;
    }
};
