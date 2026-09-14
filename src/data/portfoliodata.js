export const portfolioData = {
  name: "Dwiki Kurniawan",
  title: "Software Engineer & Informatics Graduate",
  tagline: "Membangun solusi digital yang efisien, terstruktur, dan berorientasi pada data.",
  about: "Lulusan S1 Teknik Informatika dengan ketertarikan mendalam pada pengembangan perangkat lunak modern, arsitektur web, dan sistem berbasis teknologi Google.",
  email: "dwikikurniawan0002@gmail.com",
  
  // 1. Tech Stack dengan Tingkat Penguasaan (Proficiency) ala Google Analytics Style
  skills: [
    { name: "React.js / Next.js", level: 90, category: "Frontend" },
    { name: "JavaScript / TypeScript", level: 85, category: "Frontend" },
    { name: "Tailwind CSS / UI", level: 92, category: "Frontend" },
    { name: "Node.js / Express", level: 80, category: "Backend" },
    { name: "Python / Data Analysis", level: 78, category: "Backend" },
    { name: "PostgreSQL / MySQL", level: 82, category: "Database" },
    { name: "Git, Docker & Linux", level: 75, category: "DevOps" },
  ],

  // 2. Growth Journey & Milestone
  growth: [
    { period: "2016 - 2022", title: "Pondok Modern Darussalam Gontor", description: "Santri Pondok Modern Darussalam Gontor"},
    { period: "2022 - 2026", title: "Pendidikan S1 Teknik Informatika", description: "Mempelajari fundamental ilmu komputer, struktur data, algoritma, serta rekayasa perangkat lunak." },
    { period: "2026", title: "Staff LPTSI", description: "Menjadi salah satu staff LPTSI UNIDA Gontor." },
    { period: "2025 - Sekarang", title: "Pengembangan Portofolio & Profesional", description: "Membangun proyek skala penuh dan siap berkontribusi di industri teknologi." },
  ],

  // 3. Skripsi / Tugas Akhir S1
  thesis: {
    title: "Pengembangan Aplikasi Media Pembelajaran Matematika kelas 5 SD Berbasis Android dengan metode gamifikasi",
    description: "Penelitian akhir strata 1 yang berfokus pada perancangan arsitektur perangkat lunak responsif dan efisiensi query database skala menengah.",
    tech: ["React", "Python", "REST API", "PostgreSQL"],
    status: "Lulus dengan Predikat Memuaskan (S.Kom.)"
  },

  // 4. Sertifikasi & Badges ala Google Skills
  certifications: [
    { issuer: "Google / Platform Industri", title: "Google Cloud Skill Boost", year: "2024" },
    { issuer: "Dicoding / Platform Global", title: "Cloud Computing", year: "2024" },
    { issuer: "Kampus / Organisasi", title: "Sertifikasi .....", year: "2025" }
  ],

  // 5. Currently Learning (Kurva Pertumbuhan Aktif)
  currentlyLearning: [
    "Advanced TypeScript Patterns",
    "Docker & Containerization for Production",
    "Cloud Architecture (AWS / Google Cloud Basic)"
  ],

  // 6. Proyek dengan Kategori untuk Fitur Filter
  projects: [
    {
      id: 1,
      title: "Sistem Portofolio Google Style",
      category: "Frontend",
      description: "Website portofolio pribadi yang dirancang dengan estetika Google Skills & Growth menggunakan React dan Tailwind CSS.",
      tech: ["React", "Tailwind CSS", "Vite"],
      link: "#"
    },
    {
      id: 2,
      title: "Aplikasi Manajemen Tugas (Task Management)",
      category: "Fullstack",
      description: "Aplikasi CRUD berbasis web untuk mengelola produktivitas harian dengan antarmuka yang bersih dan responsif.",
      tech: ["React", "Node.js", "Express"],
      link: "#"
    },
    {
      id: 3,
      title: "Analisis Data & Visualisasi Performa",
      category: "Data",
      description: "Dashboard analitik interaktif untuk memproses dataset industri dan menyajikannya dalam bentuk grafik matang.",
      tech: ["Python", "Pandas", "Tailwind CSS"],
      link: "#"
    }
  ]
};