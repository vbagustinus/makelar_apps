export const propertyCategories = [
  {
    id: 1,
    name: 'Rumah',
    description: 'Hunian residensial individu.',
  },
  {
    id: 2,
    name: 'Apartemen',
    description: 'Unit hunian di gedung bertingkat.',
  },
  {
    id: 3,
    name: 'Tanah',
    description: 'Lahan kosong untuk dikembangkan.',
  },
  {
    id: 4,
    name: 'Ruko',
    description: 'Bangunan ganda untuk toko dan hunian.',
  },
  {
    id: 5,
    name: 'Kantor',
    description: 'Ruang komersial untuk kegiatan bisnis.',
  },
  {
    id: 6,
    name: 'Kos/Kontrakan',
    description: 'Properti untuk disewakan per kamar atau unit kecil.',
  },
  {
    id: 7,
    name: 'Industri/Gudang',
    description: 'Properti untuk penyimpanan, logistik, atau manufaktur.',
  },
];
export const propertyStatuses = [
  {
    id: 1,
    name: 'Dijual',
    description: 'Properti ini sedang ditawarkan untuk dibeli.',
    color: '#007BFF', // Warna biru
  },
  {
    id: 2,
    name: 'Disewakan',
    description:
      'Properti ini sedang ditawarkan untuk disewa (bulanan/tahunan).',
    color: '#28A745', // Warna hijau
  },
  {
    id: 3,
    name: 'Terjual',
    description: 'Properti telah berhasil dijual kepada pembeli baru.',
    color: '#DC3545', // Warna merah (sudah laku)
  },
  {
    id: 4,
    name: 'Disewakan (Terisi)',
    description: 'Properti telah berhasil disewakan dan saat ini terisi.',
    color: '#FFC107', // Warna kuning (terisi/inactive)
  },
  // Anda bisa menambahkan status lain seperti:
  // { id: 5, name: "Lelang", description: "Properti sedang dalam proses lelang.", color: "#6F42C1" },
];

export const certificateTypes = [
  {
    id: 1,
    name: 'SHM (Sertifikat Hak Milik)',
    description:
      'Hak kepemilikan terkuat dan penuh atas tanah dan bangunan. Berlaku tanpa batas waktu.',
  },
  {
    id: 2,
    name: 'HGB (Hak Guna Bangunan)',
    description:
      'Hak untuk mendirikan dan memiliki bangunan di atas tanah milik negara atau pihak lain, dengan jangka waktu tertentu (maksimal 30 tahun dan dapat diperpanjang).',
  },
  {
    id: 3,
    name: 'AJB (Akta Jual Beli)',
    description:
      'Bukti pengalihan hak atas tanah dan bangunan dari penjual kepada pembeli. Belum menjadi sertifikat resmi (masih perlu ditingkatkan).',
  },
  {
    id: 4,
    name: 'HGU (Hak Guna Usaha)',
    description:
      'Hak untuk mengusahakan tanah yang dikuasai negara dalam jangka waktu tertentu (untuk perkebunan besar).',
  },
  {
    id: 5,
    name: 'Girik/Letter C',
    description:
      'Bukti kepemilikan adat atas tanah, bukan sertifikat resmi (perlu konversi).',
  },
  {
    id: 6,
    name: 'Strata Title',
    description:
      'Kepemilikan atas unit di bangunan vertikal (seperti apartemen/kondominium).',
  },
];
