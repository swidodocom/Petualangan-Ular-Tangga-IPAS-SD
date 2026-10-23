export interface AvatarDefinition {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  themeColor: string;
  bgColor: string;
  badge: string;
}

export const AVATARS: AvatarDefinition[] = [
  {
    id: 'bio_explorer',
    name: 'Siti Safira',
    title: 'Peneliti Alam Cilik',
    description: 'Ahli tumbuhan, fotosintesis, dan pelestarian satwa langka.',
    image: '/src/assets/images/avatar_bio_explorer_1792755774204.jpg',
    themeColor: '#10b981', // emerald
    bgColor: 'rgba(16, 185, 129, 0.2)',
    badge: '🌿 Ahli Botani'
  },
  {
    id: 'space_scientist',
    name: 'Bima Galaksi',
    title: 'Astronom Muda',
    description: 'Pakar tata surya, energi cahaya, gravitasi, dan satelit.',
    image: '/src/assets/images/avatar_space_scientist_1792755774688.jpg',
    themeColor: '#3b82f6', // blue
    bgColor: 'rgba(59, 130, 246, 0.2)',
    badge: '🚀 Penjelajah Antariksa'
  },
  {
    id: 'culture_ranger',
    name: 'Kirana Nusantara',
    title: 'Duta Budaya & Sejarah',
    description: 'Mengetahui peta Indonesia, rumah adat, dan kerajaan Nusantara.',
    image: '/src/assets/images/avatar_culture_ranger_1792755776083.jpg',
    themeColor: '#f59e0b', // amber
    bgColor: 'rgba(245, 158, 11, 0.2)',
    badge: '🗺️ Duta Nusantara'
  },
  {
    id: 'ai_prof_kancil',
    name: 'Prof. Kancil AI',
    title: 'Guru Cerdas Sains',
    description: 'Karakter bot AI cerdas yang bijaksana dan gemar berbagi fakta sains.',
    image: '/src/assets/images/avatar_ai_prof_kancil_1792755775640.jpg',
    themeColor: '#8b5cf6', // purple
    bgColor: 'rgba(139, 92, 246, 0.2)',
    badge: '🎓 Profesor Cilik'
  }
];

export const HERO_COVER_IMAGE = '/src/assets/images/hero_cover_ipas_1792755774215.jpg';
