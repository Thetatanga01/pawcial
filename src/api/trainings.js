// Mock API for trainings/workshops

export async function fetchTrainings({ type = 'all', sort = 'instructor' } = {}) {
  await new Promise((r) => setTimeout(r, 300));

  const list = [
    { id: 'ayse-yilmaz-1', title: 'Köpek Eğitiminin Temelleri', instructor: 'Ayşe Yılmaz', type: 'education', duration: '45 Dakika', date: '2025-11-05', time: '—', tag: 'Eğitim', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop', category: 'Success', topic: 'Liderlik' },
    { id: 'mehmet-kaya-1', title: 'İleri Düzey Köpek Eğitimi', instructor: 'Mehmet Kaya', type: 'education', duration: '1 Saat 15 Dakika', date: '2025-11-07', time: '—', tag: 'Eğitim', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop', category: 'Success', topic: 'Yetkinlik Gelişimi' },
    { id: 'fatma-demir-1', title: 'Seramik Mama Kabı Atölyesi', instructor: 'Fatma Demir', type: 'workshop', duration: '—', date: '2025-11-08', time: '14:00', tag: 'Atölye', image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=800&auto=format&fit=crop', category: 'Culture', topic: 'Tasarım' },
    { id: 'team-1', title: 'Köpek Beslenmesi', instructor: 'Uzman Kadro', type: 'education', duration: '1 Saat', date: '2025-11-10', time: '—', tag: 'Eğitim', image: 'https://images.unsplash.com/photo-1596495578065-3b3b2fd3b5f3?q=80&w=800&auto=format&fit=crop', category: 'Culture', topic: 'Sağlık' },
    { id: 'canan-ozturk-1', title: 'Tasma Tasarım Atölyesi', instructor: 'Canan Öztürk', type: 'workshop', duration: '—', date: '2025-11-03', time: '16:00', tag: 'Atölye', image: 'https://images.unsplash.com/photo-1543466835-7c51b35a68d2?q=80&w=800&auto=format&fit=crop', category: 'Success', topic: 'Pazarlama' },
    { id: 'ahmet-celik-1', title: 'Köpek Davranışları', instructor: 'Ahmet Çelik', type: 'education', duration: '1 Saat', date: '2025-11-11', time: '—', tag: 'Eğitim', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop', category: 'Success', topic: 'Girişimcilik' },
    { id: 'zeynep-arslan-1', title: 'Ev Yapımı Mama Eğitimi', instructor: 'Zeynep Arslan', type: 'education', duration: '1 Saat 30 Dakika', date: '2025-11-12', time: '—', tag: 'Eğitim', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop', category: 'Culture', topic: 'Yemek' },
    { id: 'mehmet-kaya-2', title: 'Davranış Atölyesi', instructor: 'Mehmet Kaya', type: 'workshop', duration: '—', date: '2025-11-12', time: '10:00', tag: 'Atölye', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop', category: 'Success', topic: 'Satış' }
  ];

  const filtered = type === 'all' ? list : list.filter(i => i.type === type);
  const sorted = [...filtered].sort((a, b) => a.instructor.localeCompare(b.instructor));
  return sorted;
}


