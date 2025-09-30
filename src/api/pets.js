// Mock API for featured pets

/**
 * Simulates fetching featured pets from a backend.
 * Returns an array of 6 pets with name, thumbnailUrl, and description.
 */
export async function fetchFeaturedPets() {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      name: 'Buddy',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
      description: '4 yaşında, enerjik ve eğitimli',
    },
    {
      name: 'Delta',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=600&auto=format&fit=crop',
      description: 'Sevecen ve uysal',
    },
    {
      name: 'Mia',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600&auto=format&fit=crop',
      description: 'Çocuklarla çok uyumlu',
    },
    {
      name: 'Lucy',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop',
      description: 'Kucak delisi',
    },
    {
      name: 'Charlie',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=600&auto=format&fit=crop',
      description: 'Akıllı ve sosyal',
    },
    {
      name: 'Daisy',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=600&auto=format&fit=crop',
      description: 'Sessiz ve uyumlu',
    },
  ];
}


