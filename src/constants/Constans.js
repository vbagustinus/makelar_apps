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

export const birdColors = [
  // --- BASIC COLORS ---
  {
    id: 1,
    name: 'Blue Bar',
    description:
      'Bluish-gray base color with two dark wing bars — the wild-type pigeon color.',
  },
  {
    id: 2,
    name: 'Blue Check',
    description: 'Blue-gray with darker checkered markings on the wings.',
  },
  {
    id: 3,
    name: 'T-Check',
    description:
      'Darkest check pattern, forming a “T” shape on the wing coverts.',
  },
  {
    id: 4,
    name: 'Blue Spread',
    description:
      'Blue base color spread evenly over the plumage, removing visible bars.',
  },
  {
    id: 5,
    name: 'Ash Red Bar',
    description:
      'Ash-red body with typical wing bars; genetically dominant over blue.',
  },
  {
    id: 6,
    name: 'Ash Red Check',
    description: 'Ash-red base with checkered pattern wings.',
  },
  {
    id: 7,
    name: 'Ash Red Spread',
    description:
      'Uniform ash-red coloration over the whole body; bars are invisible.',
  },
  {
    id: 8,
    name: 'Brown Bar',
    description: 'Brown base color with visible dark brown wing bars.',
  },
  {
    id: 9,
    name: 'Brown Check',
    description: 'Brown base with darker checkered pattern.',
  },
  {
    id: 10,
    name: 'Brown Spread',
    description: 'Even brown tone across the body due to the spread gene.',
  },
  {
    id: 11,
    name: 'Recessive Red',
    description: 'Solid brick-red color that masks all other patterns.',
  },
  {
    id: 12,
    name: 'Recessive Yellow',
    description: 'Pale golden-yellow form of recessive red (dilute version).',
  },
  {
    id: 13,
    name: 'Black',
    description:
      'Uniform black color; usually the result of the spread gene on blue base.',
  },
  {
    id: 14,
    name: 'Dun',
    description: 'Dilute form of black, giving a soft brownish-gray tone.',
  },
  {
    id: 15,
    name: 'Silver (Dilute Blue)',
    description:
      'Pale silvery-gray tone with faint wing markings; dilute of blue.',
  },
  {
    id: 16,
    name: 'Khaki',
    description: 'Dilute form of brown; light tan/beige color tone.',
  },
  {
    id: 17,
    name: 'Lavender',
    description:
      'Ash-red plus spread or dilute gene, producing a lilac-gray color.',
  },
  {
    id: 18,
    name: 'Smoky',
    description:
      'Soft, darker tone caused by a modifying gene that affects feather pigment.',
  },
  {
    id: 19,
    name: 'Dirty',
    description:
      'Modifier that darkens the overall tone, especially on primary feathers.',
  },
  {
    id: 20,
    name: 'Slate',
    description:
      'Dark bluish-gray with a cool undertone; darker than silver but lighter than black.',
  },

  // --- PATTERN & MARKING VARIANTS ---
  {
    id: 21,
    name: 'Grizzle',
    description:
      'White flecking or mixture of white and color, creating a salt-and-pepper look.',
  },
  {
    id: 22,
    name: 'Undergrizzle',
    description:
      'Hidden grizzle effect under primary feathers; subtle lightening of the plumage.',
  },
  {
    id: 23,
    name: 'Tigered',
    description:
      'Irregular dark or light flecks across the body; similar to mottling.',
  },
  {
    id: 24,
    name: 'Mottle',
    description: 'White spots on a colored background; common in fancy breeds.',
  },
  {
    id: 25,
    name: 'Pied',
    description:
      'Irregular patches of white and colored feathers spread over the body.',
  },
  {
    id: 26,
    name: 'Splash',
    description: 'Mostly white plumage with scattered patches of color.',
  },
  {
    id: 27,
    name: 'Self-Color',
    description:
      'Solid single color without visible pattern (e.g., Self Blue, Self Red).',
  },
  {
    id: 28,
    name: 'Frosted',
    description:
      'Light white tips on feathers, giving a frosty or snowy effect.',
  },
  {
    id: 29,
    name: 'Bronze',
    description: 'Brownish-metallic tone on the wing coverts or neck.',
  },
  {
    id: 30,
    name: 'Opal',
    description:
      'Feathers show a metallic, opalescent sheen; often pale with a glossy shine.',
  },
  {
    id: 31,
    name: 'Reduced',
    description:
      'Pastel or soft grayish tone caused by the “reduced” gene; rare mutation.',
  },
  {
    id: 32,
    name: 'Almond',
    description:
      'Creamy color base with scattered flecks of darker colors; very distinct pattern.',
  },
  {
    id: 33,
    name: 'Andalusian',
    description:
      'Mixture of spread ash-red and black; smoky bluish-gray appearance.',
  },
  {
    id: 34,
    name: 'Bronze T-Check',
    description: 'Dark T-check pattern with bronze overlay; metallic finish.',
  },
  {
    id: 35,
    name: 'Milky',
    description: 'Pale milky-gray with a creamy look; recessive gene effect.',
  },
  {
    id: 36,
    name: 'Qualmond',
    description:
      'Blend of “almond” and “qual” genes; produces grayish-brown irregular spotting.',
  },
  {
    id: 37,
    name: 'Indigo',
    description:
      'Rich dark bluish-purple tone; modifies the normal blue pigment.',
  },
  {
    id: 38,
    name: 'Barless Blue',
    description: 'Blue base without wing bars; simple clean look.',
  },
  {
    id: 39,
    name: 'Barless Brown',
    description: 'Brown base with no visible wing bars.',
  },
  {
    id: 40,
    name: 'Barless Ash Red',
    description: 'Ash-red without wing bars; smooth tone.',
  },

  // --- DILUTES, RARES, AND MODIFIERS ---
  {
    id: 41,
    name: 'Faded',
    description:
      'Lightened feather edges, giving a faded washed-out appearance.',
  },
  {
    id: 42,
    name: 'Ice',
    description:
      'Very pale blue-white tone with icy shimmer; often in show breeds.',
  },
  {
    id: 43,
    name: 'Cream',
    description:
      'Soft pale yellow-white tone, sometimes from recessive yellow dilutes.',
  },
  {
    id: 44,
    name: 'Pearl',
    description: 'Iridescent sheen like pearl on neck feathers.',
  },
  {
    id: 45,
    name: 'Checker Bronze',
    description: 'Check pattern combined with bronze highlights.',
  },
  {
    id: 46,
    name: 'Velvet',
    description:
      'Deep soft blackish tone with non-reflective matte appearance.',
  },
  {
    id: 47,
    name: 'Chocolate',
    description:
      'Rich dark brown tone similar to cocoa; can appear in fancy breeds.',
  },
  {
    id: 48,
    name: 'Cream Bar',
    description: 'Pale cream body with faint bar markings; dilute variant.',
  },
  {
    id: 49,
    name: 'Opal Check',
    description: 'Check pattern with opalescent or pearly sheen.',
  },
  {
    id: 50,
    name: 'Dominant Opal',
    description: 'Dominant opal mutation producing a washed-out silver effect.',
  },
  {
    id: 51,
    name: 'Recessive Opal',
    description: 'Subtle opal sheen, less intense than dominant version.',
  },
  {
    id: 52,
    name: 'Spread Brown',
    description: 'Brown spread evenly across body; soft chocolate look.',
  },
  {
    id: 53,
    name: 'Ash Yellow',
    description: 'Ash-red diluted to yellowish tone; light creamy red.',
  },
  {
    id: 54,
    name: 'Silver Dun',
    description:
      'Combination of dilute and spread giving soft silver-brown body.',
  },
  {
    id: 55,
    name: 'Dilute Grizzle',
    description: 'Very pale grizzle, giving speckled cream-white look.',
  },
  {
    id: 56,
    name: 'Opal Spread',
    description: 'Uniform silvery opal look over the entire body.',
  },
  {
    id: 57,
    name: 'Dirty Spread',
    description: 'Dark spread color enhanced by “dirty” modifier; near-black.',
  },
  {
    id: 58,
    name: 'Reduced Blue Bar',
    description: 'Blue-bar pattern but pastel due to reduced gene.',
  },
  {
    id: 59,
    name: 'Reduced Brown',
    description: 'Soft tan pastel brown caused by reduced gene.',
  },
  {
    id: 60,
    name: 'Reduced Ash Red',
    description: 'Pale peachy red tone with soft spread pattern.',
  },
  {
    id: 61,
    name: 'Albino',
    description:
      'Completely white plumage with red eyes due to absence of pigment.',
  },
  {
    id: 62,
    name: 'White',
    description:
      'Pure white feathers; masks all underlying colors or patterns.',
  },
  {
    id: 63,
    name: 'Patternless',
    description: 'Uniform color without visible bars or checks.',
  },
  {
    id: 64,
    name: 'Other',
    description: 'Other or unidentified color pattern not listed above.',
  },
];

export const pigeonTypes = [
  // Racing & Flying
  {
    id: 1,
    name: 'Racing Homer',
    description:
      'A fast and intelligent pigeon breed used for racing and homing competitions worldwide.',
  },
  {
    id: 2,
    name: 'Homing Pigeon',
    description:
      'The ancestor of modern racing pigeons, bred for long-distance message delivery.',
  },
  {
    id: 3,
    name: 'Tippler',
    description:
      'Known for its endurance and ability to fly for many hours without landing.',
  },
  {
    id: 4,
    name: 'Birmingham Roller',
    description:
      'Performs backward somersaults in the air during flight; a true aerial acrobat.',
  },
  {
    id: 5,
    name: 'Oriental Roller',
    description:
      'An ancient breed from the Middle East, famous for its aerial rolling displays.',
  },
  {
    id: 6,
    name: 'Tumbler',
    description:
      'A group of breeds that tumble or roll in flight; includes English and Budapest types.',
  },
  {
    id: 7,
    name: 'Highflyer',
    description:
      'Bred to soar to extreme heights; popular in India, Serbia, and Central Europe.',
  },
  {
    id: 8,
    name: 'Carrier Pigeon',
    description:
      'Historic messenger pigeon used before the development of modern Racing Homers.',
  },

  // Fancy & Exhibition
  {
    id: 9,
    name: 'Fantail',
    description:
      'A beautiful pigeon with a fan-shaped tail, resembling a peacock; very popular worldwide.',
  },
  {
    id: 10,
    name: 'Indian Fantail',
    description:
      'A larger Fantail variety from India, standing upright with a wide tail display.',
  },
  {
    id: 11,
    name: 'Jacobin',
    description:
      'Recognized by its hood of feathers encircling the head; elegant and ornamental.',
  },
  {
    id: 12,
    name: 'Frillback',
    description: 'Has distinctive curled feathers on the body and wing shield.',
  },
  {
    id: 13,
    name: 'Modena',
    description:
      'Originating from Italy, known for its colorful plumage and compact body.',
  },
  {
    id: 14,
    name: 'Chinese Owl',
    description:
      'Small fancy pigeon with a round chest and frilled neck feathers.',
  },
  {
    id: 15,
    name: 'Capuchine (Old Dutch Capuchine)',
    description:
      'Elegant breed with a feather hood behind the head; used for show.',
  },
  {
    id: 16,
    name: 'Saxon Fairy Swallow',
    description:
      'German fancy breed with contrasting body and wing colors; very ornamental.',
  },
  {
    id: 17,
    name: 'Lahore',
    description:
      'Large, gentle, and beautifully colored pigeon originating from Pakistan.',
  },
  {
    id: 18,
    name: 'Trumpeter',
    description:
      'Produces a unique cooing or “trumpet” sound; includes Bokhara and English varieties.',
  },
  {
    id: 19,
    name: 'Helmet Pigeon',
    description:
      'Has a distinctive colored head contrasting with its white body, resembling a helmet.',
  },
  {
    id: 20,
    name: 'Swallow Pigeon',
    description:
      'Beautifully patterned fancy breed with markings similar to a swallow bird.',
  },
  {
    id: 21,
    name: 'Archangel',
    description: 'Metallic-colored fancy pigeon known for its glossy plumage.',
  },
  {
    id: 22,
    name: 'Nuremberg Lark',
    description:
      'German breed with a buff chest and grayish body; bred for beauty.',
  },
  {
    id: 23,
    name: 'Ice Pigeon',
    description:
      'Named for its pale blue or “icy” plumage; from Central Europe.',
  },
  {
    id: 24,
    name: 'Saxon Monk',
    description:
      'German ornamental breed with distinctive cap-like head markings.',
  },

  // Utility & Meat
  {
    id: 25,
    name: 'King Pigeon',
    description:
      'Large-bodied pigeon developed for meat production and exhibitions.',
  },
  {
    id: 26,
    name: 'Giant Runt',
    description:
      'One of the largest pigeon breeds; used for both meat and show purposes.',
  },
  {
    id: 27,
    name: 'Strasser',
    description:
      'European utility breed with a strong body, raised for meat production.',
  },
  {
    id: 28,
    name: 'Mondaine',
    description:
      'Swiss and French breed, heavy-bodied, mainly used for utility purposes.',
  },
  {
    id: 29,
    name: 'Texan Pioneer',
    description:
      'American dual-purpose pigeon known for rapid growth and calm temperament.',
  },

  // Regional / Specialty
  {
    id: 30,
    name: 'Damascene',
    description: 'Beautiful metallic gray breed originating from Syria.',
  },
  {
    id: 31,
    name: 'German Beauty Homer',
    description: 'Derived from racing pigeons, bred for elegant show features.',
  },
  {
    id: 32,
    name: 'Antwerp Smerle',
    description:
      'Belgian breed; one of the ancestors of modern racing pigeons.',
  },
  {
    id: 33,
    name: 'Budapest Short-faced Tumbler',
    description: 'Small fancy pigeon from Hungary; compact and stylish.',
  },
  {
    id: 34,
    name: 'Vienna Highflyer',
    description: 'Austrian breed known for endurance and high-altitude flight.',
  },
  {
    id: 35,
    name: 'Prague Short-faced Tumbler',
    description: 'Czech fancy breed with a very short beak and elegant stance.',
  },
  {
    id: 36,
    name: 'Czech Ice Pigeon',
    description:
      'Fancy pigeon with a distinctive bluish-ice hue from the Czech Republic.',
  },
  {
    id: 37,
    name: 'Polish Lynx',
    description:
      'Strong and large-bodied breed from Poland, also used for utility.',
  },
  {
    id: 38,
    name: 'English Short-faced Tumbler',
    description:
      'Classic English show pigeon with a tiny beak and compact head.',
  },
  {
    id: 39,
    name: 'Saxon Field Pigeon',
    description: 'Traditional German field breed with unique color markings.',
  },

  // Miscellaneous
  {
    id: 40,
    name: 'Other',
    description:
      'For any local, hybrid, or unclassified pigeon breeds not listed above.',
  },
];

export const genderOptions = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
  { id: 3, name: 'Unknown' }, // optional, in case the breeder doesn’t know yet
];

export const eyeColorOptions = [
  { id: 1, name: 'White' },
  { id: 2, name: 'Black / Java Red' },
  { id: 3, name: 'Yellow / Corn' },
  { id: 4, name: 'Red' },
  { id: 5, name: 'Orange' },
  { id: 6, name: 'Pearl / Silver' },
  { id: 7, name: 'Brown' },
  { id: 8, name: 'Mixed / Mosaic' },
  { id: 9, name: 'Other' }, // fallback if color doesn’t match listed ones
];

export const maleColors = [
  '#FFB300', // Amber (kontras kuat, tetap maskulin)
  '#8BC34A', // Fresh Green
  '#FFA726', // Soft Orange
  '#00ACC1', // Cerulean (masih cukup kontras)
  '#A1887F', // Coffee Brown
  '#C0CA33', // Lime Olive
  '#F57C00', // Burnt Orange
  '#795548', // Earthy Brown
  '#AED581', // Light Avocado
  '#D4E157', // Light Lime
];

export const femaleColors = [
  '#FF7043', // Coral
  '#F06292', // Watermelon
  '#FDD835', // Bright Yellow
  '#4DB6AC', // Aqua Teal
  '#FF8A65', // Soft Tangerine
  '#DCE775', // Yellow Green
  '#FFAB91', // Light Coral
  '#E1BEE7', // Lavender Pink (masih kontras)
  '#A5D6A7', // Mint Green
  '#FFF176', // Sunny Yellow
];
