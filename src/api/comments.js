/**
 * Mock API for event comments
 */

// Mock comments data
const mockComments = {
  1: [
    {
      id: 1,
      author: 'Ayşe Demir',
      date: '22 Ekim 2024',
      rating: 5,
      text: 'Bu harika bir etkinlikti! Dr. Ayşe çok bilgili ve sabırlı. Yavru köpeğim Max sadece iki saatte çok şey öğrendi. Tüm yeni köpek sahiplerine kesinlikle tavsiye ederim.',
      likes: 12
    },
    {
      id: 2,
      author: 'Mehmet Kaya',
      date: '21 Ekim 2024',
      rating: 5,
      text: 'Çok iyi organize edilmiş bir etkinlik. Konum harikaydı ve talimatlar netti. Köpeğim diğer köpeklerden biraz dikkati dağıldı ama yine de temel komutları öğrenmeyi başardık.',
      likes: 5
    },
    {
      id: 3,
      author: 'Zeynep Özkan',
      date: '20 Ekim 2024',
      rating: 4,
      text: 'Güzel bir deneyimdi. Eğitmen çok profesyonel ve köpeklerle iletişimi harika. Sadece biraz daha pratik yapma fırsatı olsaydı daha iyi olurdu.',
      likes: 8
    }
  ],
  2: [
    {
      id: 4,
      author: 'Can Yılmaz',
      date: '18 Ekim 2024',
      rating: 5,
      text: 'Tasma tasarım atölyesi çok eğlenceliydi! Kendi tasmamı yapmak harika bir deneyimdi. Eğitmenler çok yardımcıydı.',
      likes: 15
    },
    {
      id: 5,
      author: 'Elif Şahin',
      date: '17 Ekim 2024',
      rating: 4,
      text: 'Malzemeler kaliteliydi ve tasarım süreci çok keyifliydi. Köpeğim yeni tasmasını çok sevdi!',
      likes: 7
    }
  ],
  3: [
    {
      id: 6,
      author: 'Burak Çelik',
      date: '15 Ekim 2024',
      rating: 5,
      text: 'Polimer kil charm atölyesi süperdi! Köpeğim için özel bir charm yaptım. Çok detaylı ve yaratıcı bir etkinlik.',
      likes: 9
    }
  ]
}

/**
 * Fetches comments for a specific event
 * @param {string|number} eventId - The ID of the event
 * @returns {Promise<Array>} - A promise that resolves to an array of comments
 */
export async function fetchEventComments(eventId) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockComments[eventId] || [];
}

/**
 * Adds a new comment to an event
 * @param {string|number} eventId - The ID of the event
 * @param {string} text - The comment text
 * @param {number} rating - The rating (1-5)
 * @returns {Promise<Object>} - A promise that resolves to the new comment
 */
export async function addEventComment(eventId, text, rating) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newComment = {
    id: Date.now(),
    author: 'Anonim Kullanıcı', // In a real app, this would come from user authentication
    date: new Date().toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    rating: rating,
    text: text,
    likes: 0
  };

  // Add to mock data
  if (!mockComments[eventId]) {
    mockComments[eventId] = [];
  }
  mockComments[eventId].unshift(newComment);

  return newComment;
}

