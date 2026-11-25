/**
 * ============================================================
 * SUMBER TUNGGAL KONTEN — ubah semua teks di sini, bukan di UI.
 * Profil: Randy Frederick Leonardy — Software Engineer & AI/IoT Developer
 * Bahasa: Nuansa profesional-organik, berakar dari pemahaman mendalam.
 * ============================================================
 */

export const site = {
  name: 'Randy Frederick Leonardy',
  role: 'Software Engineer · AI & IoT Developer',
  location: 'Jakarta, Indonesia',
  email: 'randy021104@gmail.com',
  cvPath: '/cv/cv-randy-frederick-leonardy.pdf',
  tagline: 'Menghubungkan kecerdasan buatan, visi komputer, IoT, dan arsitektur web modern untuk memecahkan tantangan operasional nyata.',
}

export const navLinks = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Proyek', href: '#proyek' },
  { label: 'Perjalanan', href: '#perjalanan' },
  { label: 'Keahlian', href: '#keahlian' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Kontak', href: '#kontak' },
]

export const hero = {
  title: 'Tumbuh dari akar masalah.',
  statement:
    'Saya Randy Frederick Leonardy — mahasiswa Teknik Informatika & pengembang AI/IoT. Berfokus pada perancangan sistem edge cerdas, visi komputer, dan dashboard spasial interaktif yang memberikan dampak nyata di lapangan.',
  primaryCta: { label: 'Lihat Proyek', href: '#proyek' },
  secondaryCta: { label: 'Hubungi Saya', href: '#kontak' },
  image: {
    src: '/images/hero/hero-bg.webp',
    alt: 'Latar siluet hutan hujan tropis saat fajar (placeholder)',
    width: 1600,
    height: 1200,
  },
}

export const about = {
  statement:
    'Menghubungkan kecerdasan buatan, komputasi edge, dan antarmuka interaktif untuk menyelesaikan tantangan operasional di lapangan.',
  paragraphs: [
    'Saya adalah mahasiswa Teknik Informatika (semester 7, IPK 3.91/4.00) di Universitas Bunda Mulia dengan ketertarikan mendalam pada Artificial Intelligence, Computer Vision, IoT, dan Full-Stack Engineering.',
    'Berpengalaman merancang sistem pelacakan kontainer real-time berbasis GNSS-RTK dan OCR ISO 6346, hingga membangun dashboard interaktif spasial untuk digitalisasi inventaris fasilitas dan pergudangan. Cara kerja saya berakar pada pemahaman masalah secara menyeluruh di lapangan sebelum merancang arsitektur sistem.',
  ],
  principles: [
    {
      title: 'Akar masalah di lapangan',
      body: 'Dari kalibrasi sensor edge hingga kemudahan antarmuka pengguna, solusi terbaik lahir dari pemahaman utuh atas tantangan riil di lapangan.',
    },
    {
      title: 'Presisi & terukur',
      body: 'Setiap keputusan teknis dan model dievaluasi dengan metrik yang jelas, akurat, dan dapat direproduksi.',
    },
    {
      title: 'Arsitektur andal & adaptif',
      body: 'Membangun pipeline offline-first yang andal di edge dan sistem web yang responsif, cepat, serta aman.',
    },
  ],
  portrait: {
    src: '/images/about/profile.webp',
    alt: 'Potret Randy Frederick Leonardy',
    width: 520,
    height: 650,
  },
}

export const projects = [
  {
    id: 'container-tracking-rtk-ocr',
    title: 'Sistem Pelacakan Kontainer Cerdas (GNSS-RTK & ISO 6346 OCR)',
    year: '2026',
    role: 'AI & IoT Developer',
    category: 'IoT · Computer Vision · Edge AI',
    description:
      'Sistem pelacakan kontainer real-time pada depot logistik maritim terkemuka menggunakan u-blox ZED-F9P GNSS-RTK (akurasi tingkat sentimeter), transmisi XBee, dan matriks rotasi 2D UTM. Terintegrasi modul OCR berbasis OpenCV & EasyOCR untuk ekstraksi serial ISO 6346 serta sinkronisasi edge offline-first (SQLite & FastAPI) guna memangkas pencatatan manual dan pemborosan BBM alat berat.',
    image: {
      src: '/images/projects/project-1.webp',
      alt: 'Sistem pelacakan kontainer GNSS-RTK dan OCR depot logistik maritim',
      width: 800,
      height: 620,
    },
    url: 'https://github.com/Naturehumans',
  },
  {
    id: 'spatial-asset-dashboard',
    title: 'Dashboard Tata Letak Spasial & Denah Fasilitas Interaktif',
    year: '2026',
    role: 'Full-Stack Developer',
    category: 'Full-Stack · Interactive Canvas · GIS',
    description:
      'Dashboard web full-stack untuk digitalisasi denah fasilitas korporat dan inventaris gudang logistik maritim terkemuka. Mengimplementasikan algoritma Ray-Casting (point-in-polygon) pada canvas interaktif React-Konva untuk deteksi poligon ruangan otomatis dan penataan aset drag-and-drop, didukung backend asinkron FastAPI, PostgreSQL, container Docker, serta sistem RBAC & audit trail.',
    image: {
      src: '/images/projects/project-2.webp',
      alt: 'Dashboard denah interaktif fasilitas dan pergudangan korporat',
      width: 800,
      height: 620,
    },
    url: 'https://github.com/Naturehumans',
  },
  {
    id: 'simplicity-video-ai',
    title: 'Simplicity — AI Video Interaction Platform',
    year: '2025',
    role: 'Frontend & AI Developer',
    category: 'AI Application · Video Interaction',
    description:
      'Platform antarmuka interaksi video bertenaga kecerdasan buatan dengan hierarki informasi intuitif, tata letak minimalis, dan alur kerja sederhana yang mengutamakan kenyamanan pengguna serta aksesibilitas tinggi.',
    image: {
      src: '/images/projects/project-3.webp',
      alt: 'Antarmuka aplikasi interaksi video AI Simplicity',
      width: 800,
      height: 620,
    },
    url: 'https://github.com/Naturehumans',
  },
  {
    id: 'gym-membership-system',
    title: 'Sistem Manajemen Keanggotaan Gym',
    year: '2024',
    role: 'Full-Stack Mobile Developer',
    category: 'Mobile App · Flutter & Firebase',
    description:
      'Aplikasi mobile berbasis Flutter dan Firebase untuk digitalisasi registrasi serta manajemen keanggotaan pusat kebugaran secara menyeluruh. Menghubungkan sudut pandang admin gym dan member dengan sinkronisasi data real-time, Firebase Auth, dan basis data Firestore yang aman.',
    image: {
      src: '/images/projects/project-4.webp',
      alt: 'Aplikasi mobile manajemen keanggotaan gym berbasis Flutter dan Firebase',
      width: 800,
      height: 620,
    },
    url: 'https://github.com/Naturehumans',
  },
  {
    id: 'sentiment-analysis-nlp',
    title: 'Klasifikasi Sentimen Opini Publik (NLP)',
    year: '2024',
    role: 'Machine Learning Developer',
    category: 'Natural Language Processing · Machine Learning',
    description:
      'Model klasifikasi Natural Language Processing (NLP) berbasis Logistic Regression untuk mengelompokkan sentimen komentar publik (positif, netral, negatif) pada dataset skala besar melalui pembersihan data terstruktur dan rekayasa fitur linguistik presisi tinggi.',
    image: {
      src: '/images/projects/project-5.webp',
      alt: 'Model klasifikasi sentimen teks NLP',
      width: 800,
      height: 620,
    },
    url: 'https://github.com/Naturehumans',
  },
]

export const timeline = [
  {
    period: '2022',
    role: 'Admin dan Pengelola Alur Teknis',
    org: 'Retail E-Commerce Otomotif',
    summary:
      'Mengawali langkah profesional dengan mengelola operasional e-commerce, sistem katalog produk, dan otomasi komunikasi pelanggan. Mengasah ketelitian dalam pencatatan transaksi keuangan serta penyelesaian kendala teknis harian.',
  },
  {
    period: '2023',
    role: 'Mahasiswa Teknik Informatika',
    org: 'Universitas Bunda Mulia',
    summary:
      'Memulai studi sarjana dengan fokus utama pada rekayasa perangkat lunak, sistem cerdas, dan visi komputer. Membangun fondasi algoritma yang kokoh serta menjaga konsistensi akademik dengan capaian IPK 3.91.',
  },
  {
    period: '2023 - 2024',
    role: 'Pengembang Mobile dan Web',
    org: 'Riset Solusi Digital',
    summary:
      'Merancang aplikasi mobile manajemen gym berbasis Flutter dan Firebase dengan sinkronisasi data instan. Mendalami arsitektur cloud, keamanan otentikasi pengguna, dan integrasi antarmuka yang responsif.',
  },
  {
    period: '2024',
    role: 'Pengembang Pembelajaran Mesin',
    org: 'Riset Model Cerdas',
    summary:
      'Membangun model pemrosesan bahasa alami untuk klasifikasi sentimen opini publik skala besar menggunakan Logistic Regression. Melakukan rekayasa fitur linguistik dan pembersihan data terstruktur demi memastikan prediksi akurat.',
  },
  {
    period: '2025',
    role: 'Visual Creator dan Kontributor AI',
    org: 'Adobe Stock',
    summary:
      'Menganalisis tren visual industri kreatif global dan memproduksi aset visual resolusi tinggi dengan kecerdasan buatan generatif. Mengoptimalkan performa konten melalui riset kata kunci dan metadata strategis.',
  },
  {
    period: '2025 - 2026',
    role: 'Pengembang Web dan Komputasi Spasial',
    org: 'Proyek Solusi Cerdas',
    summary:
      'Mengembangkan antarmuka interaksi video Simplicity serta mendalami kanvas interaktif React-Konva. Menerapkan algoritma Ray-Casting untuk deteksi poligon ruangan otomatis yang menjadi cikal bakal digitalisasi denah fasilitas.',
  },
  {
    period: '2026',
    role: 'Artificial Intelligence Intern',
    org: 'Perusahaan Logistik Maritim Terkemuka',
    summary:
      'Mengembangkan sistem pelacakan kontainer real-time berbasis sensor GNSS-RTK akurasi sentimeter dan OCR ISO 6346 otomatis. Membangun pipeline edge offline-first Python serta SQLite, merakit dashboard denah aset interaktif, dan menerapkan Lean Six Sigma untuk efisiensi bahan bakar alat berat.',
  },
  {
    period: 'Masa Depan',
    role: 'Next Opportunity',
    org: 'Siap Bertumbuh Bersama',
    summary:
      'Sulur perjalanan ini terus merambat membuka dahan baru. Terbuka penuh untuk peluang kerja sama, rekayasa kecerdasan buatan, komputasi edge, maupun arsitektur perangkat lunak skala besar.',
    isNextOpportunity: true,
  },
]

export const skills = [
  { name: 'AI & Computer Vision', level: 93, note: 'OpenCV, EasyOCR, deteksi serial ISO 6346, dan inferensi AI' },
  { name: 'IoT & Edge Computing', level: 89, note: 'GNSS-RTK u-blox, XBee, UTM 2D rotation, SQLite edge' },
  { name: 'Full-Stack Web Development', level: 91, note: 'React, React-Konva, HTML5 Canvas, Tailwind CSS, REST API' },
  { name: 'Backend & Database Systems', level: 88, note: 'FastAPI asinkron, Python, PostgreSQL, Docker, JWT & RBAC' },
  { name: 'Mobile Development', level: 83, note: 'Flutter, Firebase Auth, Firestore real-time data sync' },
  { name: 'Machine Learning & Data Analysis', level: 86, note: 'Scikit-Learn, NLP, Logistic Regression, Lean Six Sigma' },
]

export const gallery = [
  {
    src: '/images/gallery/gallery-1.webp',
    alt: 'Meja kerja dan riset pengembangan model AI serta kalibrasi sensor IoT',
    width: 600,
    height: 750,
    caption: 'Eksperimen model & sensor edge, pukul lima pagi',
  },
  {
    src: '/images/gallery/gallery-2.webp',
    alt: 'Terminal pengembangan dengan log pipeline GNSS-RTK dan inferensi OCR',
    width: 600,
    height: 600,
    caption: 'Terminal log sistem pelacakan real-time',
  },
  {
    src: '/images/gallery/gallery-3.webp',
    alt: 'Arsitektur pemetaan koordinat depot kontainer dan algoritma Ray-Casting',
    width: 600,
    height: 800,
    caption: 'Sketsa arsitektur pemetaan spasial & Ray-Casting',
  },
  {
    src: '/images/gallery/gallery-4.webp',
    alt: 'Pengujian modul OCR ISO 6346 dan evaluasi akurasi ekstraksi serial kontainer',
    width: 600,
    height: 450,
    caption: 'Pengujian akurasi modul OCR kontainer ISO 6346',
  },
  {
    src: '/images/gallery/gallery-5.webp',
    alt: 'Sesi debugging dan optimasi backend FastAPI serta PostgreSQL',
    width: 600,
    height: 720,
    caption: 'Sesi integrasi backend dan container Docker',
  },
  {
    src: '/images/gallery/gallery-6.webp',
    alt: 'Grafik evaluasi model dan analisis efisiensi operasional',
    width: 600,
    height: 520,
    caption: 'Evaluasi presisi model dan metrik efisiensi',
  },
]

export const socials = [
  { label: 'GitHub', url: 'https://github.com/Naturehumans' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/randyfrederickleonardy' },
  { label: 'Email', url: 'mailto:randy021104@gmail.com' },
]

export const contact = {
  heading: 'Mari diskusikan solusi yang berakar dari masalah nyata.',
  blurb:
    'Terbuka untuk peluang kolaborasi dalam rekayasa perangkat lunak, sistem AI, visi komputer, IoT terdistribusi, atau proyek teknologi lainnya. Silakan tinggalkan pesan atau hubungi langsung.',
  honeypotName: 'website',
}

export const footer = {
  line: 'Dibangun dengan prinsip ketelitian dan ketahanan sistem.',
  musicNote: 'Musik latar: jazz instrumental (opsional). Ganti berkas di public/audio.',
}
