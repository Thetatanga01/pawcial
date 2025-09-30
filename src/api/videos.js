// Mock API for training videos

/**
 * Simulates fetching training videos from a backend.
 * Returns an array of 4 videos with title, thumbnailUrl, and episodeCount.
 */
export async function fetchTrainingVideos() {
  await new Promise((r) => setTimeout(r, 400));

  return [
    {
      id: 'temel-itaat',
      title: 'Temel İtaat',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=800&auto=format&fit=crop',
      episodeCount: 4,
    },
    {
      id: 'tasma-egitimi',
      title: 'Tasma Eğitimi',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=800&auto=format&fit=crop',
      episodeCount: 3,
    },
    {
      id: 'davranis-sorunlari',
      title: 'Davranış Sorunları',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=800&auto=format&fit=crop',
      episodeCount: 6,
    },
    {
      id: 'yavru-kopek',
      title: 'Yavru Köpek',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
      episodeCount: 5,
    },
  ];
}

/**
 * Returns a mock series (episodes) for a given video id
 */
export async function fetchVideoSeries(id) {
  await new Promise((r) => setTimeout(r, 350));
  const base = {
    'temel-itaat': {
      title: 'Temel İtaat',
      episodes: [
        { no: 1, title: 'Otur ve Bekle', duration: '08:24', thumbnailUrl: 'https://images.unsplash.com/photo-1558944351-dd30efb5f957?q=80&w=600&auto=format&fit=crop' },
        { no: 2, title: 'Gel Komutu', duration: '06:11', thumbnailUrl: 'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?q=80&w=600&auto=format&fit=crop' },
        { no: 3, title: 'Yatma ve Kalk', duration: '07:45', thumbnailUrl: 'https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=600&auto=format&fit=crop' },
        { no: 4, title: 'Pozitif Pekiştirme', duration: '05:52', thumbnailUrl: 'https://images.unsplash.com/photo-1543466835-7c51b35a68d2?q=80&w=600&auto=format&fit=crop' },
      ],
    },
    'tasma-egitimi': {
      title: 'Tasma Eğitimi',
      episodes: [
        { no: 1, title: 'Tasmaya Alıştırma', duration: '09:02', thumbnailUrl: 'https://images.unsplash.com/photo-1535961653907-7d3c8908b9e5?q=80&w=600&auto=format&fit=crop' },
        { no: 2, title: 'Yanımda Yürü', duration: '07:36', thumbnailUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=600&auto=format&fit=crop' },
        { no: 3, title: 'Çekişi Azaltma', duration: '05:44', thumbnailUrl: 'https://images.unsplash.com/photo-1529676468690-d2dca28042c5?q=80&w=600&auto=format&fit=crop' },
      ],
    },
    'davranis-sorunlari': {
      title: 'Davranış Sorunları',
      episodes: [
        { no: 1, title: 'Ayrılık Kaygısı', duration: '10:10', thumbnailUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=600&auto=format&fit=crop' },
        { no: 2, title: 'Aşırı Havlama', duration: '06:29', thumbnailUrl: 'https://images.unsplash.com/photo-1558944351-dd30efb5f957?q=80&w=600&auto=format&fit=crop' },
        { no: 3, title: 'Isırma ve Saldırganlık', duration: '08:03', thumbnailUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=600&auto=format&fit=crop' },
        { no: 4, title: 'Ev İçi Tuvalet', duration: '05:50', thumbnailUrl: 'https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=600&auto=format&fit=crop' },
        { no: 5, title: 'Zıplama', duration: '04:26', thumbnailUrl: 'https://images.unsplash.com/photo-1558944351-dd30efb5f957?q=80&w=600&auto=format&fit=crop' },
        { no: 6, title: 'Korku ve Sosyalleşme', duration: '07:18', thumbnailUrl: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=600&auto=format&fit=crop' },
      ],
    },
    'yavru-kopek': {
      title: 'Yavru Köpek',
      episodes: [
        { no: 1, title: 'İlk Günler', duration: '06:21', thumbnailUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop' },
        { no: 2, title: 'Tuvalet Eğitimi', duration: '07:42', thumbnailUrl: 'https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=600&auto=format&fit=crop' },
        { no: 3, title: 'Isırma Kontrolü', duration: '05:58', thumbnailUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=600&auto=format&fit=crop' },
        { no: 4, title: 'Temel Komutlar', duration: '08:05', thumbnailUrl: 'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?q=80&w=600&auto=format&fit=crop' },
        { no: 5, title: 'Sosyalleşme', duration: '06:09', thumbnailUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=600&auto=format&fit=crop' },
      ],
    },
  }
  const data = base[id]
  if (!data) throw new Error('Video serisi bulunamadı')
  return data
}


