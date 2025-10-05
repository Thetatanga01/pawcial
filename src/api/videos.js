// Mock API for training videos and episodes

/**
 * Fetches training video series for the home page
 * @returns {Promise<Array>} - Array of video series with id, title, thumbnailUrl, episodeCount
 */
export async function fetchTrainingVideos() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: 'basic-obedience',
      title: 'Temel İtaat Eğitimi',
      thumbnailUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
      episodeCount: 6
    },
    {
      id: 'puppy-care',
      title: 'Yavru Köpek Bakımı',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=600&auto=format&fit=crop',
      episodeCount: 5
    },
    {
      id: 'leash-walking',
      title: 'Tasmalı Yürüyüş',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
      episodeCount: 4
    },
    {
      id: 'house-training',
      title: 'Tuvalet Eğitimi',
      thumbnailUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=600&auto=format&fit=crop',
      episodeCount: 3
    }
  ];
}

/**
 * Fetches a single video series by ID with episodes
 * @param {string} videoId
 * @returns {Promise<Object|null>} - Video series with episodes
 */
export async function fetchVideoById(videoId) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const catalog = {
    'basic-obedience': {
      id: 'basic-obedience',
      title: 'Temel İtaat Eğitimi',
      description: 'Köpeğinizle temel komutlar ve pozitif pekiştirme teknikleri.',
      episodes: [
        { no: 1, title: 'Otur ve Bekle', duration: '06:32', thumbnailUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 2, title: 'Yat ve Kal', duration: '05:18', thumbnailUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 3, title: 'Gel Komutu', duration: '07:41', thumbnailUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 4, title: 'Hayır ve Bırak', duration: '04:55', thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 5, title: 'Tasma Eğitimi Giriş', duration: '08:03', thumbnailUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 6, title: 'Genelleme ve Pekiştirme', duration: '09:27', thumbnailUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=600&auto=format&fit=crop', videoUrl: '' }
      ]
    },
    'puppy-care': {
      id: 'puppy-care',
      title: 'Yavru Köpek Bakımı',
      description: 'Yavrunuzun sağlıklı ve mutlu büyümesi için pratik bilgiler.',
      episodes: [
        { no: 1, title: 'Beslenme Temelleri', duration: '05:12', thumbnailUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 2, title: 'Sosyalleşme', duration: '07:02', thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 3, title: 'Tuvalet Rutini', duration: '06:01', thumbnailUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 4, title: 'Güvenli Oyun', duration: '04:36', thumbnailUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 5, title: 'Veteriner Kontrolleri', duration: '03:58', thumbnailUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop', videoUrl: '' }
      ]
    },
    'leash-walking': {
      id: 'leash-walking',
      title: 'Tasmalı Yürüyüş',
      description: 'Tasma çekiştirmeyi azaltma ve birlikte uyumlu yürüyüş.',
      episodes: [
        { no: 1, title: 'Doğru Tasmanın Seçimi', duration: '04:22', thumbnailUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 2, title: 'Başlangıç Alıştırmaları', duration: '06:44', thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 3, title: 'Dikkat Dağıtıcılarla Yürüyüş', duration: '07:09', thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 4, title: 'Rutin Oluşturma', duration: '05:30', thumbnailUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=600&auto=format&fit=crop', videoUrl: '' }
      ]
    },
    'house-training': {
      id: 'house-training',
      title: 'Tuvalet Eğitimi',
      description: 'Ev içi kazaları azaltmak için plan ve yöntemler.',
      episodes: [
        { no: 1, title: 'Program Kurma', duration: '04:45', thumbnailUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 2, title: 'İşaretleri Anlamak', duration: '05:57', thumbnailUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop', videoUrl: '' },
        { no: 3, title: 'Kazalarla Baş Etme', duration: '03:49', thumbnailUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop', videoUrl: '' }
      ]
    }
  };

  return catalog[videoId] || null;
}


