/**
 * Mock API for detailed event information and images
 */

// Mock event details data - matches event IDs from events.js
const mockEventDetails = {
  1: { // Köpek Yürüyüş Etkinliği
    id: 1,
    about: 'Bu yürüyüş etkinliğinde köpeğinizle birlikte diğer hayvanseverlerle tanışacak ve güzel bir gün geçireceksiniz. Rehberli yürüyüş sırasında köpek eğitimi ipuçları da alabilirsiniz. Etkinlik sırasında veteriner hekimimiz köpeklerinizin sağlık durumunu kontrol edecek ve sorularınızı yanıtlayacak.',
    whatToBring: 'Köpeğiniz için tasma, su kabı, su ve ödül maması getirin. Köpeğinizin aşıları güncel olmalı ve iyi sağlık durumunda olmalıdır. Rahat yürüyüş ayakkabıları ve hava durumuna uygun kıyafetler giyin.',
    registration: 'Sınırlı sayıda katılımcı kabul edilmektedir. Erken kayıt önerilir. Katılım ücretsizdir ancak önceden kayıt yaptırmanız gerekmektedir. Kayıt için aşağıdaki formu doldurun.',
    whatWeDid: 'Etkinlik sırasında köpeklerimizle birlikte 3 km yürüyüş yaptık. Veteriner hekimimiz her köpeğin sağlık kontrolünü gerçekleştirdi. Sosyalleşme oyunları oynadık ve temel itaat komutları üzerinde çalıştık. Katılımcılar arasında deneyim paylaşımı yapıldı.',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=800&auto=format&fit=crop'
    ]
  },
  2: { // Kedi Kafe Buluşması Etkinliği
    id: 2,
    about: 'Kedilerle dolu bir ortamda kahve içerken diğer kedi severlerle tanışın. Bu özel buluşmada kedilerinizle birlikte rahat bir ortamda sosyalleşme fırsatı bulacaksınız. Kedi bakımı ve eğitimi hakkında deneyim paylaşımı yapılacak.',
    whatToBring: 'Kediniz için taşıma çantası, su kabı ve sevdiği oyuncakları getirin. Kedinizin aşıları güncel olmalı ve sosyal ortamlara uyumlu olmalıdır. Rahat kıyafetler giyin.',
    registration: 'Kedi kafe buluşması ücretsizdir. Sınırlı sayıda kedi kabul edilmektedir. Önceden kayıt yaptırmanız gerekmektedir. Kedi sağlık raporu istenebilir.',
    whatWeDid: 'Kedilerimizle birlikte kedi kafede keyifli vakit geçirdik. Kedi bakımı hakkında deneyim paylaşımı yaptık. Kediler arasında sosyalleşme sağlandı. Kedi eğitimi teknikleri öğrenildi.',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596495578065-3b3b2fd3b5f3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559235038-1b6a9a6f2e9a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=800&auto=format&fit=crop'
    ]
  },
  3: { // Tasma Tasarım Atölyesi
    id: 3,
    about: 'Bu atölye çalışmasında köpeğiniz için özel tasma tasarlayacak ve yapacaksınız. Uzman eğitmenler eşliğinde pratik yapma fırsatı bulacaksınız. Malzeme seçiminden montaja kadar tüm süreçleri öğreneceksiniz.',
    whatToBring: 'Atölye için gerekli malzemeler sağlanacaktır. Sadece köpeğinizin boyutlarına uygun ölçüleri getirmeniz yeterli. Yaratıcılığınızı getirmeyi unutmayın!',
    registration: 'Atölye için 50 TL katılım ücreti alınmaktadır. Malzemeler dahildir. Online ödeme güvenli ödeme ağ geçidi üzerinden yapılabilir. Kayıt sonrası onay e-postası gönderilecektir.',
    whatWeDid: 'Katılımcılar kendi tasmalarını tasarladı ve yaptı. Farklı deri türleri ve renklerle çalıştık. Kişiselleştirme teknikleri öğrenildi. Herkes köpeği için özel bir tasma oluşturdu.',
    images: [
      'https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543466835-7c51b35a68d2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
    ]
  },
  4: { // Polimer Kil Charm Atölyesi
    id: 4,
    about: 'Bu atölye çalışmasında köpeğiniz için özel charm yapın. Polimer kil kullanarak yaratıcı tasarımlar oluşturacağız. Uzman eğitmenler eşliğinde pratik yapma fırsatı bulacaksınız.',
    whatToBring: 'Atölye için gerekli malzemeler sağlanacaktır. Sadece köpeğinizin boyutlarına uygun ölçüleri getirmeniz yeterli. Yaratıcılığınızı getirmeyi unutmayın!',
    registration: 'Atölye için 75 TL katılım ücreti alınmaktadır. Malzemeler dahildir. Online ödeme güvenli ödeme ağ geçidi üzerinden yapılabilir.',
    whatWeDid: 'Polimer kil ile çeşitli charm tasarımları yaptık. Fırınlama teknikleri öğrenildi. Her katılımcı köpeği için özel charm oluşturdu. Yaratıcı süreçler ve teknikler paylaşıldı.',
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=800&auto=format&fit=crop'
    ]
  },
  5: { // Köpeğimle Parkta Yoga
    id: 5,
    about: 'Köpeğinizle birlikte yoga yaparak hem kendinizi hem de köpeğinizi rahatlatın. Uzman eğitmenler eşliğinde köpek dostu yoga pozisyonları öğreneceksiniz. Doğal ortamda meditasyon ve nefes çalışmaları yapılacak.',
    whatToBring: 'Köpeğiniz için temel ihtiyaçlarını getirin. Rahat yoga kıyafetleri ve mat getirin. Etkinlik sırasında ikramlar sağlanacaktır.',
    registration: 'Yoga etkinliği ücretsizdir. Katılım için önceden kayıt yaptırmanız gerekmektedir. Sınırlı sayıda katılımcı kabul edilmektedir.',
    whatWeDid: 'Köpeklerimizle birlikte yoga pozisyonları yaptık. Rahatlama teknikleri öğrenildi. Köpek dostu egzersizler uygulandı. Meditasyon ve nefes çalışmaları yapıldı.',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop'
    ]
  },
  6: { // Pati Koşusu
    id: 6,
    about: 'Köpeğinizle birlikte koşarak hem egzersiz yapın hem de eğlenin. Bu etkinlikte köpeğinizin enerjisini doğru yönde kullanmayı öğreneceksiniz. Farklı koşu teknikleri ve köpek koşu eğitimi verilecek.',
    whatToBring: 'Köpeğiniz için koşu tasması, su kabı ve su getirin. Rahat koşu ayakkabıları ve spor kıyafetleri giyin. Köpeğinizin sağlık durumu koşu için uygun olmalıdır.',
    registration: 'Koşu etkinliği ücretsizdir. Katılım için önceden kayıt yaptırmanız gerekmektedir. Köpeğinizin sağlık raporu istenebilir.',
    whatWeDid: 'Köpeklerimizle birlikte 5 km koşu yaptık. Koşu teknikleri öğrenildi. Köpek koşu eğitimi verildi. Enerji kontrolü ve dayanıklılık çalışmaları yapıldı.',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop'
    ]
  },
  7: { // Sahiplendirme Şenliği
    id: 7,
    about: 'Sahiplendirme sürecinde olan hayvanlarla tanışın ve onlara yuva olun. Bu özel şenlikte sahiplendirme sürecindeki hayvanlarımızla tanışma fırsatı bulacaksınız. Veteriner hekimlerimiz sağlık kontrollerini gerçekleştirecek.',
    whatToBring: 'Aile üyelerinizi getirin. Sahiplendirme için gerekli belgeleri hazırlayın. Sabırlı ve sevgi dolu bir yaklaşım sergileyin.',
    registration: 'Sahiplendirme şenliği ücretsizdir. Katılım için önceden kayıt yaptırmanız gerekmektedir. Sahiplendirme süreci hakkında bilgilendirme yapılacaktır.',
    whatWeDid: 'Sahiplendirme sürecindeki hayvanlarla tanışma fırsatı bulduk. Veteriner hekimlerimiz sağlık kontrollerini gerçekleştirdi. Sahiplendirme süreci hakkında bilgilendirme yapıldı. Birçok hayvan yeni yuvalarını buldu.',
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596495578065-3b3b2fd3b5f3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559235038-1b6a9a6f2e9a?q=80&w=800&auto=format&fit=crop'
    ]
  },
  8: { // Köpek Eğitimi Atölyesi
    id: 8,
    about: 'Köpeğinizin temel eğitimini öğrenin ve uygulayın. Uzman eğitmenler eşliğinde temel itaat komutları, davranış düzeltme teknikleri ve pozitif eğitim yöntemleri öğreneceksiniz.',
    whatToBring: 'Köpeğiniz için tasma, ödül mamaları ve sevdiği oyuncakları getirin. Köpeğinizin aşıları güncel olmalıdır. Sabırlı ve tutarlı bir yaklaşım sergileyin.',
    registration: 'Eğitim atölyesi için 100 TL katılım ücreti alınmaktadır. Malzemeler dahildir. Online ödeme güvenli ödeme ağ geçidi üzerinden yapılabilir.',
    whatWeDid: 'Temel itaat komutları öğrenildi ve uygulandı. Davranış düzeltme teknikleri gösterildi. Pozitif eğitim yöntemleri öğrenildi. Köpek sahipleri arasında deneyim paylaşımı yapıldı.',
    images: [
      'https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543466835-7c51b35a68d2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop'
    ]
  },
  9: { // Hayvan Sevgisi Festivali
    id: 9,
    about: 'Hayvan sevgisini kutlayan özel festival etkinliği. Bu festivalde hayvan hakları, bakımı ve sevgisi hakkında bilgilendirme yapılacak. Çeşitli aktiviteler ve yarışmalar düzenlenecek.',
    whatToBring: 'Aile üyelerinizi getirin. Hayvan sevgisi ve bakımı hakkında merak ettiğiniz soruları hazırlayın. Festival ruhuna uygun kıyafetler giyin.',
    registration: 'Festival etkinliği ücretsizdir. Katılım için önceden kayıt yaptırmanız gerekmektedir. Etkinlik programı kayıt sonrası gönderilecektir.',
    whatWeDid: 'Hayvan sevgisi festivali düzenlendi. Hayvan hakları hakkında bilgilendirme yapıldı. Çeşitli aktiviteler ve yarışmalar gerçekleştirildi. Hayvan bakımı hakkında deneyim paylaşımı yapıldı.',
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596495578065-3b3b2fd3b5f3?q=80&w=800&auto=format&fit=crop'
    ]
  },
  10: { // Kedi Bakım Atölyesi
    id: 10,
    about: 'Kedilerinizin bakımı hakkında bilgi edinin ve pratik yapın. Uzman veteriner hekimler eşliğinde kedi bakımı, beslenmesi, sağlık kontrolleri ve temel bakım teknikleri öğreneceksiniz.',
    whatToBring: 'Kedinizi getirin (isteğe bağlı). Kedi bakımı hakkında merak ettiğiniz soruları hazırlayın. Not almak için defter getirin.',
    registration: 'Bakım atölyesi için 60 TL katılım ücreti alınmaktadır. Malzemeler dahildir. Online ödeme güvenli ödeme ağ geçidi üzerinden yapılabilir.',
    whatWeDid: 'Kedi bakımı teknikleri öğrenildi ve uygulandı. Beslenme hakkında bilgilendirme yapıldı. Sağlık kontrolleri gösterildi. Kedi sahipleri arasında deneyim paylaşımı yapıldı.',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596495578065-3b3b2fd3b5f3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559235038-1b6a9a6f2e9a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=800&auto=format&fit=crop'
    ]
  },
  11: { // Sabah Yoga Seansı
    id: 11,
    about: 'Sabahın erken saatlerinde köpeğinizle birlikte yoga yaparak güne enerjik başlayın. Doğal ortamda meditasyon ve nefes çalışmaları yapılacak. Köpek dostu yoga pozisyonları öğreneceksiniz.',
    whatToBring: 'Köpeğiniz için temel ihtiyaçlarını getirin. Rahat yoga kıyafetleri ve mat getirin. Sabah erken saatte olacağı için sıcak kıyafetler giyin.',
    registration: 'Sabah yoga seansı ücretsizdir. Katılım için önceden kayıt yaptırmanız gerekmektedir. Sabah erken saatte olacağı için erken gelmeniz önerilir.',
    whatWeDid: 'Sabah erken saatte köpeklerimizle birlikte yoga yaptık. Güne enerjik başladık. Meditasyon ve nefes çalışmaları yapıldı. Köpek dostu egzersizler uygulandı.',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop'
    ]
  },
  12: { // Akşam Yürüyüşü
    id: 12,
    about: 'Gün batımında köpeğinizle birlikte yürüyüş yapın. Bu özel akşam yürüyüşünde günün yorgunluğunu atacak ve köpeğinizle kaliteli zaman geçireceksiniz. Akşam saatlerinde köpek eğitimi ipuçları da alabilirsiniz.',
    whatToBring: 'Köpeğiniz için tasma, su kabı, su ve ödül maması getirin. Akşam saatlerinde olacağı için sıcak kıyafetler giyin. Reflektörlü kıyafetler önerilir.',
    registration: 'Akşam yürüyüşü ücretsizdir. Katılım için önceden kayıt yaptırmanız gerekmektedir. Akşam saatlerinde olacağı için güvenlik önlemleri alınacaktır.',
    whatWeDid: 'Akşam saatlerinde köpeklerimizle birlikte yürüyüş yaptık. Gün batımında güzel manzaralar eşliğinde egzersiz yaptık. Akşam köpek eğitimi teknikleri öğrenildi. Rahatlama ve sosyalleşme sağlandı.',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop'
    ]
  }
}

/**
 * Fetches detailed event information including images
 * @param {string|number} eventId - The ID of the event
 * @returns {Promise<Object|null>} - A promise that resolves to the event details or null if not found
 */
export async function fetchEventDetails(eventId) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockEventDetails[eventId] || null;
}
