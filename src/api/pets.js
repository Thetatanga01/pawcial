// Mock API for pets - unified backend simulation

/**
 * Simulates fetching pets from a backend with pagination support.
 * This is the main API that will be replaced with real backend.
 * 
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.featured - If 'true', returns only featured pets (default: false)
 * @returns {Promise<Object>} - Response with pets array and pagination info
 */
export async function fetchPets(options = {}) {
  const { page = 1, limit = 20, featured = false, gender, breed, age } = options;
  
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // All pets data - this would come from backend
  const allPets = [
    {
      id: 'buddy',
      name: 'Buddy',
      thumbnailUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
      description: '4 yaşında, enerjik ve eğitimli',
    },
    {
      id: 'delta',
      name: 'Delta',
      thumbnailUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=600&auto=format&fit=crop',
      description: '2 yaşında, sevecen ve uysal',
    },
    {
      id: 'mia',
      name: 'Mia',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600&auto=format&fit=crop',
      description: '3 yaşında, çocuklarla çok uyumlu',
    },
    {
      id: 'lucy',
      name: 'Lucy',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop',
      description: '10 yaşında, kucak delisi',
    },
    {
      id: 'charlie',
      name: 'Charlie',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=600&auto=format&fit=crop',
      description: '5 yaşında, akıllı ve sosyal',
    },
    {
      id: 'daisy',
      name: 'Daisy',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=600&auto=format&fit=crop',
      description: '1 yaşında, sessiz ve uyumlu',
    },
    {
      id: 'max',
      name: 'Max',
      thumbnailUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop',
      description: '2 yaşında, oyuncu ve neşeli',
    },
    {
      id: 'luna',
      name: 'Luna',
      thumbnailUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop',
      description: '6 yaşında, sakin ve sevecen',
    },
    {
      id: 'rocky',
      name: 'Rocky',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
      description: '7 yaşında, güçlü ve sadık',
    },
    {
      id: 'bella',
      name: 'Bella',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=600&auto=format&fit=crop',
      description: '3 yaşında, zeki ve eğitimli',
    },
    {
      id: 'oscar',
      name: 'Oscar',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
      description: '4 yaşında, dost canlısı ve aktif',
    },
    {
      id: 'sophie',
      name: 'Sophie',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=600&auto=format&fit=crop',
      description: '8 yaşında, nazik ve uyumlu',
    },
    {
      id: 'zeus',
      name: 'Zeus',
      thumbnailUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop',
      description: '5 yaşında, büyük ve sevecen',
    },
    {
      id: 'ruby',
      name: 'Ruby',
      thumbnailUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop',
      description: '2 yaşında, enerjik ve oyuncu',
    },
    {
      id: 'jack',
      name: 'Jack',
      thumbnailUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=600&auto=format&fit=crop',
      description: '6 yaşında, sadık ve koruyucu',
    },
    {
      id: 'molly',
      name: 'Molly',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600&auto=format&fit=crop',
      description: '1 yaşında, sevimli ve uysal',
    },
    {
      id: 'rex',
      name: 'Rex',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop',
      description: '9 yaşında, güçlü ve cesur',
    },
    {
      id: 'lily',
      name: 'Lily',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=600&auto=format&fit=crop',
      description: '3 yaşında, narin ve sevecen',
    },
    {
      id: 'toby',
      name: 'Toby',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=600&auto=format&fit=crop',
      description: '4 yaşında, neşeli ve dost canlısı',
    },
    {
      id: 'grace',
      name: 'Grace',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
      description: '7 yaşında, zarif ve akıllı',
    },
  ];

  // Enrich with attributes used for list filtering
  const enrichedPets = allPets.map((p) => ({
    ...p,
    breed: getPetBreed(p.id),
    gender: getPetGender(p.id),
    ageYears: parseInt(getPetAge(p.id)) || 0,
  }));

  // Filter for featured pets if requested
  let pets = featured ? enrichedPets.slice(0, 6) : enrichedPets;

  // Apply optional filters
  if (gender && gender !== 'Tümü') {
    pets = pets.filter((p) => p.gender === gender);
  }
  if (breed && breed !== 'Tümü') {
    pets = pets.filter((p) => p.breed === breed);
  }
  if (age && age !== 'Tümü') {
    if (age === '10+') {
      pets = pets.filter((p) => p.ageYears >= 10);
    } else {
      const ageNum = parseInt(age);
      pets = pets.filter((p) => p.ageYears === ageNum);
    }
  }

  // Calculate pagination
  const totalPets = pets.length;
  const totalPages = Math.ceil(totalPets / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPets = pets.slice(startIndex, endIndex);

  return {
    pets: paginatedPets,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalPets,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    // Useful for building filter dropdowns client-side
    meta: {
      breeds: Array.from(new Set(enrichedPets.map((p) => p.breed))).sort(),
      genders: Array.from(new Set(enrichedPets.map((p) => p.gender))).sort(),
      ages: Array.from(new Set(enrichedPets.map((p) => p.ageYears))).sort((a,b)=>a-b),
    },
  };
}

/**
 * Convenience function for fetching featured pets (for home page)
 * @returns {Promise<Array>} - Array of 6 featured pets
 */
export async function fetchFeaturedPets() {
  const response = await fetchPets({ featured: true });
  return response.pets;
}

/**
 * Convenience function for fetching all pets (for pets page)
 * @returns {Promise<Array>} - Array of all pets
 */
export async function fetchAllPets() {
  const response = await fetchPets({ limit: 20 });
  return response.pets;
}

/**
 * Fetches detailed information for a specific pet
 * @param {string} petId - The ID of the pet
 * @returns {Promise<Object|null>} - Detailed pet information or null if not found
 */
export async function fetchPetById(petId) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  const response = await fetchPets({ limit: 20 });
  const pet = response.pets.find(p => p.id === petId);
  
  if (!pet) {
    return null;
  }

  // Add detailed information for the pet detail page
  return {
    ...pet,
    breed: getPetBreed(pet.id),
    age: getPetAge(pet.id),
    gender: getPetGender(pet.id),
    size: getPetSize(pet.id),
    color: getPetColor(pet.id),
    health: getPetHealth(pet.id),
    training: getPetTraining(pet.id),
    character: getPetCharacter(pet.id),
    history: getPetHistory(pet.id),
    images: getPetImages(pet.id)
  };
}

// Helper functions to generate pet details
function getPetBreed(id) {
  const breeds = {
    'buddy': 'Golden Retriever Mix',
    'delta': 'Labrador Mix',
    'mia': 'Beagle Mix',
    'lucy': 'Cocker Spaniel Mix',
    'charlie': 'Border Collie Mix',
    'daisy': 'Jack Russell Mix',
    'max': 'German Shepherd Mix',
    'luna': 'Husky Mix',
    'rocky': 'Rottweiler Mix',
    'bella': 'Poodle Mix',
    'oscar': 'Boxer Mix',
    'sophie': 'Shih Tzu Mix',
    'zeus': 'Great Dane Mix',
    'ruby': 'Dalmatian Mix',
    'jack': 'Bulldog Mix',
    'molly': 'Chihuahua Mix',
    'rex': 'Doberman Mix',
    'lily': 'Maltese Mix',
    'toby': 'Terrier Mix',
    'grace': 'Whippet Mix'
  };
  return breeds[id] || 'Mixed Breed';
}

function getPetAge(id) {
  const ages = {
    'buddy': '4 years',
    'delta': '2 years',
    'mia': '3 years',
    'lucy': '10 years',
    'charlie': '5 years',
    'daisy': '1 year',
    'max': '2 years',
    'luna': '6 years',
    'rocky': '7 years',
    'bella': '3 years',
    'oscar': '4 years',
    'sophie': '8 years',
    'zeus': '5 years',
    'ruby': '2 years',
    'jack': '6 years',
    'molly': '1 year',
    'rex': '9 years',
    'lily': '3 years',
    'toby': '4 years',
    'grace': '7 years'
  };
  return ages[id] || 'Unknown';
}

function getPetGender(id) {
  const genders = {
    'buddy': 'Erkek',
    'delta': 'Dişi',
    'mia': 'Dişi',
    'lucy': 'Dişi',
    'charlie': 'Erkek',
    'daisy': 'Dişi',
    'max': 'Erkek',
    'luna': 'Dişi',
    'rocky': 'Erkek',
    'bella': 'Dişi',
    'oscar': 'Erkek',
    'sophie': 'Dişi',
    'zeus': 'Erkek',
    'ruby': 'Dişi',
    'jack': 'Erkek',
    'molly': 'Dişi',
    'rex': 'Erkek',
    'lily': 'Dişi',
    'toby': 'Erkek',
    'grace': 'Dişi'
  };
  return genders[id] || 'Bilinmiyor';
}

function getPetSize(id) {
  const sizes = {
    'buddy': 'Büyük',
    'delta': 'Orta',
    'mia': 'Orta',
    'lucy': 'Küçük',
    'charlie': 'Büyük',
    'daisy': 'Küçük',
    'max': 'Büyük',
    'luna': 'Büyük',
    'rocky': 'Büyük',
    'bella': 'Orta',
    'oscar': 'Büyük',
    'sophie': 'Küçük',
    'zeus': 'Büyük',
    'ruby': 'Orta',
    'jack': 'Orta',
    'molly': 'Küçük',
    'rex': 'Büyük',
    'lily': 'Küçük',
    'toby': 'Orta',
    'grace': 'Orta'
  };
  return sizes[id] || 'Orta';
}

function getPetColor(id) {
  const colors = {
    'buddy': 'Altın',
    'delta': 'Siyah',
    'mia': 'Kahverengi',
    'lucy': 'Beyaz',
    'charlie': 'Siyah & Beyaz',
    'daisy': 'Kahverengi & Beyaz',
    'max': 'Kahverengi',
    'luna': 'Gri & Beyaz',
    'rocky': 'Siyah',
    'bella': 'Beyaz',
    'oscar': 'Kahverengi',
    'sophie': 'Beyaz',
    'zeus': 'Siyah',
    'ruby': 'Beyaz & Siyah',
    'jack': 'Kahverengi',
    'molly': 'Kahverengi',
    'rex': 'Siyah',
    'lily': 'Beyaz',
    'toby': 'Kahverengi',
    'grace': 'Gri'
  };
  return colors[id] || 'Karışık';
}

function getPetHealth(id) {
  return 'Aşılı, Kısırlaştırılmış';
}

function getPetTraining(id) {
  return 'Temel itaat';
}

function getPetCharacter(id) {
  const characters = {
    'buddy': 'Dost canlısı, Enerjik, Kucak sevgisi',
    'delta': 'Sakin, Nazik, Çocuklarla iyi',
    'mia': 'Oyuncu, Sosyal, İlgi sevgisi',
    'lucy': 'Tatlı, Kucak delisi, Sessiz',
    'charlie': 'Akıllı, Aktif, Sadık',
    'daisy': 'Sessiz, Nazik, Uyumlu',
    'max': 'Oyuncu, Mutlu, Enerjik',
    'luna': 'Sakin, Nazik, Bağımsız',
    'rocky': 'Güçlü, Koruyucu, Sadık',
    'bella': 'Akıllı, Zarif, Uslu',
    'oscar': 'Dost canlısı, Aktif, Sosyal',
    'sophie': 'Nazik, Tatlı, Sakin',
    'zeus': 'Nazik dev, Sakin, Koruyucu',
    'ruby': 'Enerjik, Oyuncu, Eğlenceli',
    'jack': 'Sadık, Koruyucu, Cesur',
    'molly': 'Tatlı, Küçük, Kucak delisi',
    'rex': 'Güçlü, Cesur, Koruyucu',
    'lily': 'Narin, Tatlı, Nazik',
    'toby': 'Mutlu, Dost canlısı, Enerjik',
    'grace': 'Zarif, Sakin, Kibarlık'
  };
  return characters[id] || 'Dost canlısı, Sevecen';
}

function getPetHistory(id) {
  return 'Yerel barınaktan kurtarıldı';
}

function getPetImages(id) {
  // Return multiple images for the gallery
  return [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800&auto=format&fit=crop'
  ];
}

