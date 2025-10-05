// Mock API for social events

/**
 * Simulates fetching social events from a backend.
 * Returns an array of events with id, title, date, and image.
 */
export async function fetchSocialEvents() {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: 1,
      title: 'Köpek Yürüyüş Etkinliği',
      date: '2025-11-02',
      displayDate: '2 EKIM',
      description: 'Diğer hayvanseverlerle tanışmak ve köpeklerinizle keyifli bir yürüyüş yapmak için bize katılın.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop',
      type: 'walk',
      location: 'park',
      createdAt: '2024-10-01',
    },
    {
      id: 2,
      title: 'Kedi Kafe Buluşması Etkinliği',
      date: '2025-11-02',
      displayDate: '5 EKIM',
      description: 'Kedilerle dolu bir ortamda kahve içerken diğer kedi severlerle tanışın.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=400&auto=format&fit=crop',
      type: 'meeting',
      location: 'cafe',
      createdAt: '2024-10-02',
    },
    {
      id: 3,
      title: 'Tasma Tasarım Atölyesi',
      date: '2025-11-08',
      displayDate: '8 EKIM',
      description: 'Köpeğiniz için özel tasma tasarlayın ve yapın.',
      image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=400&auto=format&fit=crop',
      type: 'workshop',
      location: 'workshop',
      createdAt: '2024-10-03',
    },
    {
      id: 4,
      title: 'Polimer Kil Charm Atölyesi',
      date: '2024-10-10',
      displayDate: '10 EKIM',
      description: 'Evcil hayvanınız için özel charm yapın.',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop',
      type: 'workshop',
      location: 'workshop',
      createdAt: '2024-10-04',
    },
    {
      id: 5,
      title: 'Köpeğimle Parkta Yoga',
      date: '2024-10-15',
      displayDate: '15 EKIM',
      description: 'Köpeğinizle birlikte yoga yaparak hem kendinizi hem de köpeğinizi rahatlatın.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop',
      type: 'workshop',
      location: 'park',
      createdAt: '2024-10-05',
    },
    {
      id: 6,
      title: 'Pati Koşusu',
      date: '2024-10-22',
      displayDate: '22 EKIM',
      description: 'Köpeğinizle birlikte koşarak hem egzersiz yapın hem de eğlenin.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=400&auto=format&fit=crop',
      type: 'walk',
      location: 'park',
      createdAt: '2024-10-06',
    },
    {
      id: 7,
      title: 'Sahiplendirme Şenliği',
      date: '2024-10-25',
      displayDate: '25 EKIM',
      description: 'Sahiplendirme sürecinde olan hayvanlarla tanışın ve onlara yuva olun.',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop',
      type: 'meeting',
      location: 'park',
      createdAt: '2024-10-07',
    },
    {
      id: 8,
      title: 'Köpek Eğitimi Atölyesi',
      date: '2024-10-28',
      displayDate: '28 EKIM',
      description: 'Köpeğinizin temel eğitimini öğrenin ve uygulayın.',
      image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=400&auto=format&fit=crop',
      type: 'workshop',
      location: 'workshop',
      createdAt: '2024-10-08',
    },
    {
      id: 9,
      title: 'Hayvan Sevgisi Festivali',
      date: '2024-11-30',
      displayDate: '30 EKIM',
      description: 'Hayvan sevgisini kutlayan özel festival etkinliği.',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop',
      type: 'meeting',
      location: 'park',
      createdAt: '2024-10-09',
    },
    {
      id: 10,
      title: 'Kedi Bakım Atölyesi',
      date: '2024-11-02',
      displayDate: '2 KASIM',
      description: 'Kedilerinizin bakımı hakkında bilgi edinin ve pratik yapın.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
      type: 'workshop',
      location: 'workshop',
      createdAt: '2024-10-10',
    },
    {
      id: 11,
      title: 'Sabah Yoga Seansı',
      date: '2024-10-15',
      displayDate: '15 EKIM',
      description: 'Sabah erken saatlerde köpeğinizle birlikte yoga yapın.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop',
      type: 'workshop',
      location: 'park',
      createdAt: '2024-10-11',
    },
    {
      id: 12,
      title: 'Akşam Yürüyüşü',
      date: '2024-10-22',
      displayDate: '22 EKIM',
      description: 'Gün batımında köpeğinizle birlikte yürüyüş yapın.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=400&auto=format&fit=crop',
      type: 'walk',
      location: 'park',
      createdAt: '2024-10-12',
    }
      ];
    }

    /**
     * Fetches a single event by ID
     * @param {string|number} eventId - The ID of the event
     * @returns {Promise<Object|null>} - A promise that resolves to the event or null if not found
     */
    export async function fetchEventById(eventId) {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 300));

      const events = await fetchSocialEvents();
      const event = events.find(e => e.id == eventId);
      
      if (!event) {
        return null;
      }

      // Add additional details for the event detail page
      return {
        ...event,
        about: getEventAbout(event.type),
        whatToBring: getEventWhatToBring(event.type),
        registration: getEventRegistration(event.type),
        time: getEventTime(event.type),
        instructor: getEventInstructor(event.type)
      };
    }

    function getEventAbout(type) {
      const aboutTexts = {
        'walk': 'Bu yürüyüş etkinliğinde köpeğinizle birlikte diğer hayvanseverlerle tanışacak ve güzel bir gün geçireceksiniz. Rehberli yürüyüş sırasında köpek eğitimi ipuçları da alabilirsiniz.',
        'workshop': 'Bu atölye çalışmasında köpeğiniz için özel ürünler tasarlayacak ve yapacaksınız. Uzman eğitmenler eşliğinde pratik yapma fırsatı bulacaksınız.',
        'meeting': 'Bu buluşmada diğer hayvanseverlerle tanışacak ve deneyimlerinizi paylaşacaksınız. Köpeğiniz de sosyalleşme fırsatı bulacak.'
      };
      return aboutTexts[type] || 'Bu etkinlik hakkında detaylı bilgiler yakında eklenecek.';
    }

    function getEventWhatToBring(type) {
      const whatToBringTexts = {
        'walk': 'Köpeğiniz için tasma, su kabı, su ve ödül maması getirin. Köpeğinizin aşıları güncel olmalı ve iyi sağlık durumunda olmalıdır.',
        'workshop': 'Atölye için gerekli malzemeler sağlanacaktır. Sadece köpeğinizin boyutlarına uygun ölçüleri getirmeniz yeterli.',
        'meeting': 'Köpeğiniz için temel ihtiyaçlarını getirin. Etkinlik sırasında ikramlar sağlanacaktır.'
      };
      return whatToBringTexts[type] || 'Etkinlik için gerekli malzemeler listesi yakında eklenecek.';
    }

    function getEventRegistration(type) {
      const registrationTexts = {
        'walk': 'Sınırlı sayıda katılımcı kabul edilmektedir. Erken kayıt önerilir. Katılım ücretsizdir ancak önceden kayıt yaptırmanız gerekmektedir.',
        'workshop': 'Atölye için 50 TL katılım ücreti alınmaktadır. Malzemeler dahildir. Online ödeme güvenli ödeme ağ geçidi üzerinden yapılabilir.',
        'meeting': 'Buluşma etkinliği ücretsizdir. Katılım için önceden kayıt yaptırmanız gerekmektedir.'
      };
      return registrationTexts[type] || 'Kayıt bilgileri yakında eklenecek.';
    }

    function getEventTime(type) {
      const timeTexts = {
        'walk': '09:00 - 11:00',
        'workshop': '14:00 - 16:00',
        'meeting': '19:00 - 21:00'
      };
      return timeTexts[type] || '10:00 - 12:00';
    }

    function getEventInstructor(type) {
      const instructorTexts = {
        'walk': 'Dr. Mehmet Yılmaz, Veteriner Hekim',
        'workshop': 'Ayşe Kaya, Profesyonel Tasarımcı',
        'meeting': 'Zeynep Özkan, Hayvan Hakları Aktivisti'
      };
      return instructorTexts[type] || 'Dr. Ayşe Yılmaz, Sertifikalı Köpek Eğitmeni';
    }