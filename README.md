# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


dwekfolio/
├── public/                 # Aset statis bawaan Vite
├── src/
│   ├── assets/             # Folder gambar/media
│   │   └── profile.png
│   │
│   ├── components/         # Folder komponen utama
│   │   ├── reactbits/      # Folder komponen efek animasi khusus
│   │   │   ├── CursorGrid.jsx
│   │   │   ├── DecryptText.jsx
│   │   │   ├── MagicRings.jsx
│   │   │   └── ShapeGrid.jsx
│   │   │
│   │   ├── About.jsx
│   │   ├── academicsection.jsx
│   │   ├── contactsection.jsx
│   │   ├── growthjourney.jsx
│   │   ├── Hero.jsx        
│   │   ├── LoadingScreen.jsx
│   │   ├── navbar.jsx
│   │   ├── projectssection.jsx
│   │   └── skillsanalytics.jsx
│   │
│   ├── data/               # Folder penyimpanan data portofolio
│   │   └── portfoliodata.js
│   │
│   ├── App.jsx             # File root komponen (pengatur layout utama)
│   ├── main.jsx            # Entry point React (bawaan Vite)
│   └── index.css           # File CSS utama (tempat import Tailwind)
│
├── package.json            # Konfigurasi npm & dependencies
├── tailwind.config.js      # Konfigurasi Tailwind CSS
└── vite.config.js          # Konfigurasi Vite