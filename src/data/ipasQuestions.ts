import { IPASQuestion } from '../types/game';

export const IPAS_QUESTIONS: IPASQuestion[] = [
  // 1 - 10: Alam, Ekosistem & Tumbuhan
  {
    id: 1,
    topic: 'Tumbuhan & Fotosintesis',
    grade: 'Kelas 4',
    question: 'Zat hijau daun pada tumbuhan yang berfungsi menyerap energi sinar matahari untuk proses fotosintesis disebut...',
    options: ['Klorofil', 'Stomata', 'Kambium', 'Xilem'],
    correctIndex: 0,
    explanation: 'Klorofil adalah zat hijau daun yang menangkap energi cahaya matahari untuk mengubah air dan karbon dioksida menjadi glukosa dan oksigen.',
    funFact: 'Tahukah kamu? Oksigen yang kita hirup setiap hari sebagian besar dihasilkan dari fotosintesis tumbuhan dan fitoplankton di laut!'
  },
  {
    id: 2,
    topic: 'Makhluk Hidup & Lingkungan',
    grade: 'Kelas 5',
    question: 'Dalam rantai makanan di sawah: Padi -> Belalang -> Katak -> Ular -> Elang. Makhluk hidup yang berperan sebagai produsen adalah...',
    options: ['Belalang', 'Padi', 'Katak', 'Elang'],
    correctIndex: 1,
    explanation: 'Padi berperan sebagai produsen karena mampu membuat makanannya sendiri melalui fotosintesis, sedangkan hewan lainnya adalah konsumen.',
    funFact: 'Produsen adalah dasar dari semua rantai makanan di bumi!'
  },
  {
    id: 3,
    topic: 'Wujud Benda & Materi',
    grade: 'Kelas 4',
    question: 'Peristiwa perubahan wujud benda dari padat menjadi gas tanpa melalui fase cair disebut...',
    options: ['Mencair', 'Menguap', 'Menyublim', 'Mengembun'],
    correctIndex: 2,
    explanation: 'Menyublim adalah perubahan wujud dari padat langsung menjadi gas, contohnya kapur barus (kamper) atau es kering (dry ice) di suhu ruang.',
    funFact: 'Kapur barus di dalam lemari lama-kelamaan mengecil dan habis karena menyublim menjadi aroma harum.'
  },
  {
    id: 4,
    topic: 'Tubuh & Panca Indra',
    grade: 'Kelas 5',
    question: 'Bagian mata yang berfungsi mengatur banyaknya cahaya yang masuk ke dalam bola mata adalah...',
    options: ['Pupil', 'Retina', 'Kornea', 'Lensa mata'],
    correctIndex: 0,
    explanation: 'Pupil akan mengecil saat berada di tempat yang terang untuk membatasi cahaya, dan membesar saat berada di tempat yang redup.',
    funFact: 'Mata manusia dapat membedakan sekitar 10 juta warna yang berbeda!'
  },
  {
    id: 5,
    topic: 'Energi & Gaya',
    grade: 'Kelas 4',
    question: 'Gaya yang bekerja saat kamu mengerem sepeda sehingga laju sepeda melambat dan berhenti adalah gaya...',
    options: ['Gravitasi', 'Pegas', 'Gesek', 'Magnet'],
    correctIndex: 2,
    explanation: 'Gaya gesek terjadi saat kampas rem bergesekan dengan roda sepeda, menghasilkan gaya yang berlawanan dengan arah gerak sepeda.',
    funFact: 'Gaya gesek juga membantu kita berjalan tanpa terpeleset di atas lantai.'
  },
  {
    id: 6,
    topic: 'Bumi & Tata Surya',
    grade: 'Kelas 6',
    question: 'Perputaran Bumi pada porosnya yang membutuhkan waktu sekitar 24 jam menyebabkan terjadinya...',
    options: [
      'Pergantian siang dan malam',
      'Perubahan musim di bumi',
      'Pasang surut air laut',
      'Perbedaan lamanya siang dan malam'
    ],
    correctIndex: 0,
    explanation: 'Rotasi bumi (berputar pada porosnya) menyebabkan pergantian siang dan malam. Sementara revolusi bumi mengelilingi matahari menyebabkan pergantian musim.',
    funFact: 'Bumi berputar dengan kecepatan sekitar 1.670 km/jam di garis khatulistiwa!'
  },
  {
    id: 7,
    topic: 'Energi & Gaya',
    grade: 'Kelas 5',
    question: 'Perubahan energi yang terjadi pada panel surya (solar cell) adalah...',
    options: [
      'Energi kimia menjadi energi listrik',
      'Energi cahaya menjadi energi listrik',
      'Energi listrik menjadi energi gerak',
      'Energi panas menjadi energi bunyi'
    ],
    correctIndex: 1,
    explanation: 'Panel surya menyerap foton dari sinar matahari dan mengubahnya menjadi arus listrik melalui efek fotovoltaik.',
    funFact: 'Matahari memancarkan cukup energi ke bumi dalam satu jam untuk memenuhi kebutuhan listrik seluruh dunia selama satu tahun!'
  },
  {
    id: 8,
    topic: 'Makhluk Hidup & Lingkungan',
    grade: 'Kelas 5',
    question: 'Hubungan antara lebah yang mengisap nektar bunga sambil membantu penyerbukan bunga merupakan contoh simbiosis...',
    options: ['Komensalisme', 'Parasitisme', 'Mutualisme', 'Amensalisme'],
    correctIndex: 2,
    explanation: 'Simbiosis mutualisme adalah hubungan yang saling menguntungkan. Lebah mendapat makanan (nektar), sedangkan bunga terbantu proses penyerbukannya.',
    funFact: 'Lebah madu berkomunikasi dengan sesamanya menggunakan tarian getaran khusus!'
  },
  {
    id: 9,
    topic: 'Bumi & Tata Surya',
    grade: 'Kelas 6',
    question: 'Planet terbesar di dalam sistem Tata Surya kita yang memiliki ciri khas bintik merah raksasa adalah...',
    options: ['Mars', 'Saturnus', 'Jupiter', 'Neptunus'],
    correctIndex: 2,
    explanation: 'Jupiter adalah planet gas terbesar di Tata Surya. Bintik merah raksasanya adalah badai besar yang telah berlangsung selama ratusan tahun.',
    funFact: 'Lebih dari 1.300 planet seukuran Bumi bisa muat di dalam Jupiter!'
  },
  {
    id: 10,
    topic: 'Wujud Benda & Materi',
    grade: 'Kelas 4',
    question: 'Munculnya titik-titik air di dinding luar gelas yang berisi es dingin adalah contoh peristiwa...',
    options: ['Membeku', 'Mengembun (kondensasi)', 'Mencair', 'Menyublim'],
    correctIndex: 1,
    explanation: 'Uap air di udara sekitar gelas mengalami pendinginan saat menyentuh dinding gelas es, sehingga berubah wujud menjadi air cair (mengembun).',
    funFact: 'Embun pagi di dedaunan juga terbentuk dengan cara yang sama ketika suhu udara turun di malam hari.'
  },

  // 11 - 20: Ilmu Pengetahuan Sosial, Budaya & Geografi Indonesia
  {
    id: 11,
    topic: 'Keragaman Budaya Nusantara',
    grade: 'Kelas 4',
    question: 'Rumah adat khas suku Minangkabau di Sumatera Barat yang memiliki atap runcing menyerupai tanduk kerbau disebut...',
    options: ['Rumah Gadang', 'Rumah Joglo', 'Rumah Tongkonan', 'Rumah Honai'],
    correctIndex: 0,
    explanation: 'Rumah Gadang memiliki atap berbentuk gonjong (seperti tanduk kerbau) dan merupakan rumah adat kebanggaan masyarakat Minangkabau.',
    funFact: 'Desain gonjong Rumah Gadang melambangkan kemenangan dan kejayaan masyarakat Minang masa lampau.'
  },
  {
    id: 12,
    topic: 'Kenampakan Alam & Peta',
    grade: 'Kelas 5',
    question: 'Selat yang memisahkan Pulau Jawa dan Pulau Sumatera serta menjadi jalur pelayaran yang sangat sibuk adalah...',
    options: ['Selat Malaka', 'Selat Sunda', 'Selat Bali', 'Selat Makassar'],
    correctIndex: 1,
    explanation: 'Selat Sunda menghubungkan Laut Jawa dengan Samudra Hindia dan memisahkan Pulau Jawa di timur dengan Pulau Sumatera di barat.',
    funFact: 'Di tengah Selat Sunda terdapat Gunung Anak Krakatau yang terkenal di dunia.'
  },
  {
    id: 13,
    topic: 'Sejarah & Kerajaan Indonesia',
    grade: 'Kelas 5',
    question: 'Candi Borobudur yang megah di Magelang, Jawa Tengah, merupakan peninggalan bersejarah dari corak agama...',
    options: ['Hindu', 'Buddha', 'Islam', 'Konghucu'],
    correctIndex: 1,
    explanation: 'Candi Borobudur dibangun pada masa Dinasti Syailendra sekitar abad ke-8 dan merupakan candi Buddha terbesar di dunia.',
    funFact: 'Candi Borobudur tersusun dari sekitar 2 juta bongkahan batu vulkanik tanpa menggunakan semen perekat!'
  },
  {
    id: 14,
    topic: 'Ekonomi & Pelestarian Alam',
    grade: 'Kelas 4',
    question: 'Kegiatan menyalurkan barang atau jasa dari pihak produsen kepada pihak konsumen disebut kegiatan...',
    options: ['Produksi', 'Konsumsi', 'Distribusi', 'Investasi'],
    correctIndex: 2,
    explanation: 'Distribusi adalah proses penyaluran barang/jasa dari pembuat (produsen) ke pembeli (konsumen). Pelakunya disebut distributor.',
    funFact: 'Kurir paket dan pedagang pasar adalah contoh profesi di bidang distribusi!'
  },
  {
    id: 15,
    topic: 'Keragaman Budaya Nusantara',
    grade: 'Kelas 4',
    question: 'Alat musik tradisional dari Jawa Barat yang terbuat dari bambu dan dimainkan dengan cara digoyangkan adalah...',
    options: ['Gamelan', 'Kolintang', 'Angklung', 'Saluang'],
    correctIndex: 2,
    explanation: 'Angklung adalah alat musik multitonal berbahan bambu yang telah diakui oleh UNESCO sebagai Warisan Budaya Takbenda Dunia.',
    funFact: 'Angklung berasal dari tradisi upacara menghormati Dewi Sri (Dewi Kesuburan) pada masa lalu.'
  },
  {
    id: 16,
    topic: 'Kenampakan Alam & Peta',
    grade: 'Kelas 5',
    question: 'Garis khayal yang membagi bumi menjadi dua belahan sama besar (Utara dan Selatan) serta melintasi Kota Pontianak adalah...',
    options: ['Garis Bujur', 'Garis Khatulistiwa (Ekuator)', 'Garis Meridian', 'Garis Balik'],
    correctIndex: 1,
    explanation: 'Garis Khatulistiwa (Ekuator) adalah garis lintang 0 derajat. Indonesia dilewati khatulistiwa sehingga beriklim tropis.',
    funFact: 'Di Tugu Khatulistiwa Pontianak, setiap tanggal 21-23 Maret terjadi fenomena matahari tepat di atas kepala tanpa bayangan!'
  },
  {
    id: 17,
    topic: 'Sejarah & Kerajaan Indonesia',
    grade: 'Kelas 5',
    question: 'Patih perkasa dari Kerajaan Majapahit yang mengucapkan "Sumpah Palapa" untuk menyatukan Nusantara bernama...',
    options: ['Hayam Wuruk', 'Gajah Mada', 'Raden Wijaya', 'Kertanegara'],
    correctIndex: 1,
    explanation: 'Mahapatih Gajah Mada bersumpah tidak akan menikmati kesenangan duniawi (palapa) sebelum berhasil menyatukan kepulauan Nusantara di bawah Majapahit.',
    funFact: 'Sumpah Palapa diucapkan sekitar tahun 1336 Masehi di hadapan Ratu Tribhuwana Tunggadewi.'
  },
  {
    id: 18,
    topic: 'Ekonomi & Pelestarian Alam',
    grade: 'Kelas 4',
    question: 'Kebutuhan manusia yang paling mendasar dan mutlak harus dipenuhi untuk bertahan hidup (seperti makanan, pakaian, tempat tinggal) disebut kebutuhan...',
    options: ['Primer', 'Sekunder', 'Tersier', 'Tambahan'],
    correctIndex: 0,
    explanation: 'Kebutuhan primer (pokok) meliputi pangan (makanan), sandang (pakaian), dan papan (rumah) yang wajib terpenuhi.',
    funFact: 'Kebutuhan sekunder seperti buku bacaan atau ponsel baru dipenuhi setelah kebutuhan primer tercukupi.'
  },
  {
    id: 19,
    topic: 'Makhluk Hidup & Lingkungan',
    grade: 'Kelas 5',
    question: 'Kegiatan menanam kembali hutan yang gundul atau rusak untuk mencegah erosi dan banjir dinamakan...',
    options: ['Terasering', 'Reboisasi', 'Irigasi', 'Evolusi'],
    correctIndex: 1,
    explanation: 'Reboisasi adalah upaya penghijauan kembali kawasan hutan yang telah gundul agar tanah tetap subur, air tersimpan, dan bencana tanah longsor dicegah.',
    funFact: 'Akar pohon di hutan berfungsi bagaikan spons raksasa yang menyerap dan menyimpan cadangan air hujan.'
  },
  {
    id: 20,
    topic: 'Tubuh & Panca Indra',
    grade: 'Kelas 5',
    question: 'Organ pernapasan manusia tempat terjadinya pertukaran gas oksigen (O2) dengan karbon dioksida (CO2) adalah...',
    options: ['Trakea', 'Alveolus', 'Bronkus', 'Laring'],
    correctIndex: 1,
    explanation: 'Alveolus adalah kantung udara kecil yang berada di dalam paru-paru dengan dinding tipis yang dikelilingi pembuluh darah kapiler.',
    funFact: 'Paru-paru manusia memiliki sekitar 600 juta alveolus yang jika dibentangkan luasnya setara lapangan tenis!'
  },

  // 21 - 30: Pengetahuan Lanjutan IPAS SD
  {
    id: 21,
    topic: 'Energi & Gaya',
    grade: 'Kelas 5',
    question: 'Sifat magnet yang benar adalah jika dua kutub magnet yang senama (sejenis) didekatkan, maka keduanya akan...',
    options: ['Tarik-menarik', 'Tolak-menolak', 'Diam saja', 'Mengeluarkan panas'],
    correctIndex: 1,
    explanation: 'Kutub magnet yang sejenis (Utara dengan Utara, atau Selatan dengan Selatan) akan saling tolak-menolak, sedangkan yang berlawanan jenis akan saling tarik-menarik.',
    funFact: 'Kereta Maglev di Jepang melayang di atas rel memanfaatkan prinsip tolak-menolak kutub magnet ini!'
  },
  {
    id: 22,
    topic: 'Bumi & Tata Surya',
    grade: 'Kelas 6',
    question: 'Peristiwa ketika posisi Bulan berada tepat di antara Matahari dan Bumi sehingga cahaya matahari terhalang oleh Bulan disebut...',
    options: ['Gerhana Matahari', 'Gerhana Bulan', 'Bulan Purnama', 'Bulan Sabit'],
    correctIndex: 0,
    explanation: 'Pada Gerhana Matahari, bayangan Bulan jatuh ke permukaan Bumi karena posisi lurus Matahari - Bulan - Bumi.',
    funFact: 'Saat gerhana matahari total terjadi, suasana di siang hari bisa berubah menjadi gelap seperti senja selama beberapa menit!'
  },
  {
    id: 23,
    topic: 'Kenampakan Alam & Peta',
    grade: 'Kelas 5',
    question: 'Pada sebuah peta, warna biru tua biasanya digunakan untuk melambangkan kenampakan alam berupa...',
    options: ['Dataran rendah', 'Pegunungan tinggi', 'Lautan dalam', 'Danau dangkal'],
    correctIndex: 2,
    explanation: 'Warna biru pada peta melambangkan perairan. Semakin tua warna birunya, semakin dalam kedalaman perairan atau laut tersebut.',
    funFact: 'Warna hijau pada peta biasanya menandakan dataran rendah yang subur, sedangkan cokelat menandakan pegunungan.'
  },
  {
    id: 24,
    topic: 'Sejarah & Kerajaan Indonesia',
    grade: 'Kelas 5',
    question: 'Kerajaan maritim bercorak Buddha tertua di Nusantara yang berpusat di wilayah Palembang, Sumatera Selatan adalah...',
    options: ['Kerajaan Tarumanegara', 'Kerajaan Sriwijaya', 'Kerajaan Mataram Kuno', 'Kerajaan Singasari'],
    correctIndex: 1,
    explanation: 'Sriwijaya adalah kerajaan maritim besar yang menguasai Selat Malaka dan menjadi pusat perdagangan serta penyebaran agama Buddha di Asia Tenggara.',
    funFact: 'Banyak pendeta dan pelajar dari Tiongkok dan India datang ke Sriwijaya untuk belajar bahasa Sansekerta dan ajaran Buddha.'
  },
  {
    id: 25,
    topic: 'Wujud Benda & Materi',
    grade: 'Kelas 4',
    question: 'Benda padat memiliki ciri-ciri khusus, yaitu...',
    options: [
      'Bentuk dan volumenya selalu tetap',
      'Bentuk mengikuti wadahnya tapi volumenya tetap',
      'Bentuk dan volumenya berubah mengisi ruangan',
      'Mudah ditekan dan mengalir'
    ],
    correctIndex: 0,
    explanation: 'Benda padat memiliki partikel yang tersusun sangat rapat dan teratur, sehingga bentuk dan volumenya tidak berubah jika dipindahkan.',
    funFact: 'Batu, pensil, dan buku adalah contoh benda padat di sekeliling kita.'
  },
  {
    id: 26,
    topic: 'Tumbuhan & Fotosintesis',
    grade: 'Kelas 4',
    question: 'Bagian tumbuhan yang berfungsi menyerap air dan zat hara mineral dari dalam tanah adalah...',
    options: ['Daun', 'Akar', 'Batang', 'Bunga'],
    correctIndex: 1,
    explanation: 'Akar menancap di tanah untuk menyerap air serta mineral hara, sekaligus menjadi penopang agar tumbuhan berdiri kokoh.',
    funFact: 'Beberapa tumbuhan memiliki akar khusus, seperti akar napas pada pohon bakau (mangrove) di pesisir pantai.'
  },
  {
    id: 27,
    topic: 'Keragaman Budaya Nusantara',
    grade: 'Kelas 4',
    question: 'Tari Saman yang dibawakan secara berkelompok dengan gerakan tepukan dada dan tangan yang sangat cepat serta kompak berasal dari provinsi...',
    options: ['Sumatera Utara', 'Aceh', 'Riau', 'Jambi'],
    correctIndex: 1,
    explanation: 'Tari Saman adalah tarian tradisional suku Gayo dari Provinsi Aceh yang sarat nilai kebersamaan, persatuan, dan kekompakan.',
    funFact: 'Tari Saman diakui UNESCO sebagai Warisan Budaya Takbenda karena keunikan gerak serempaknya tanpa iringan alat musik melodis!'
  },
  {
    id: 28,
    topic: 'Energi & Gaya',
    grade: 'Kelas 4',
    question: 'Benda dapat terlihat oleh mata kita karena...',
    options: [
      'Mata memancarkan sinar ke benda tersebut',
      'Benda memantulkan cahaya ke dalam mata kita',
      'Udara di sekitar benda menghantarkan panas',
      'Benda memiliki gaya gravitasi'
    ],
    correctIndex: 1,
    explanation: 'Kita bisa melihat sebuah benda karena benda tersebut terkena cahaya lalu memantulkannya masuk ke pupil mata kita.',
    funFact: 'Di ruangan yang benar-benar gelap tanpa sepercik cahaya pun, mata kita tidak akan bisa melihat benda apa pun!'
  },
  {
    id: 29,
    topic: 'Ekonomi & Pelestarian Alam',
    grade: 'Kelas 5',
    question: 'Prinsip 3R dalam pengelolaan sampah untuk menjaga kebersihan lingkungan adalah singkatan dari...',
    options: [
      'Reduce, Reuse, Recycle',
      'Repair, Remove, Return',
      'Replant, Refresh, Rebuild',
      'Refill, Resell, Replace'
    ],
    correctIndex: 0,
    explanation: 'Reduce (mengurangi sampah), Reuse (menggunakan kembali barang yang masih layak), dan Recycle (mendaur ulang sampah menjadi produk baru bermanfaat).',
    funFact: 'Satu botol plastik membutuhkan waktu hingga 450 tahun untuk bisa terurai secara alami di dalam tanah!'
  },
  {
    id: 30,
    topic: 'Bumi & Tata Surya',
    grade: 'Kelas 6',
    question: 'Lapisan udara yang menyelimuti bumi dan berfungsi melindungi kehidupan di bumi dari radiasi berbahaya sinar ultraviolet serta meteor adalah...',
    options: ['Litosfer', 'Hidrosfer', 'Atmosfer', 'Biosfer'],
    correctIndex: 2,
    explanation: 'Atmosfer memiliki lapisan ozon yang menyerap radiasi UV dari matahari dan lapisan mesosfer yang membakar meteor sebelum menabrak bumi.',
    funFact: 'Tanpa atmosfer, suhu di bumi pada siang hari bisa mencapai 100°C dan di malam hari bisa anjlok hingga -150°C!'
  }
];

export const getQuestionsForGame = (count: 15 | 30): IPASQuestion[] => {
  if (count === 15) {
    // Pick 15 well-distributed questions across all topics
    return IPAS_QUESTIONS.slice(0, 15);
  }
  return IPAS_QUESTIONS;
};
