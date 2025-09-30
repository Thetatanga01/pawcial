import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFeaturedPets } from '../api/pets.js'
import { fetchTrainingVideos } from '../api/videos.js'

export default function Home() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [videos, setVideos] = useState([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [videosError, setVideosError] = useState(null)

  useEffect(() => {
    let mounted = true
    fetchFeaturedPets()
      .then((data) => { if (mounted) { setPets(data); setLoading(false) } })
      .catch((err) => { if (mounted) { setError(err?.message || 'Beklenmeyen bir hata oluştu'); setLoading(false) } })
    fetchTrainingVideos()
      .then((data) => { if (mounted) { setVideos(data); setVideosLoading(false) } })
      .catch((err) => { if (mounted) { setVideosError(err?.message || 'Beklenmeyen bir hata oluştu'); setVideosLoading(false) } })
    return () => { mounted = false }
  }, [])

  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="hero-title">Mükemmel Dostunu Bul</h1>
          <p className="hero-subtitle">Sıcak bir yuva bekleyen sevgi dolu patili dostlar dünyasını keşfedin. Sahiplendirme sürecinizde baştan sona yanınızdayız.</p>
          <a className="btn btn-primary" href="#sahiplendirme">Bir Evcil Hayvan Sahiplen</a>
        </div>
      </section>

      <section id="sahiplendirme" className="section">
        <div className="container">
          <h2 className="section-title">Öne Çıkan Patiler</h2>
          {loading && (
            <div className="card-row">
              {Array.from({ length: 6 }).map((_, i) => (
                <article key={i} className="pet-card">
                  <div style={{ width: '100%', height: 140, background: '#f5f5f5' }} />
                  <div className="pet-meta">
                    <h3 style={{ background: '#f5f5f5', height: 16, width: '40%' }} />
                    <p style={{ background: '#f5f5f5', height: 14, width: '70%', marginTop: 6 }} />
                  </div>
                </article>
              ))}
            </div>
          )}
          {error && <p style={{ textAlign: 'center', color: '#b00020' }}>{error}</p>}
          {!loading && !error && (
            <div className="card-row">
              {pets.map((pet) => (
                <Link to={`/pets/${encodeURIComponent(pet.name.toLowerCase())}`} className="pet-card link-reset" key={pet.name}>
                  <img src={pet.thumbnailUrl} alt={`${pet.name} adlı hayvan`} />
                  <div className="pet-meta">
                    <h3>{pet.name}</h3>
                    <p>{pet.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="egitim" className="section section-alt">
        <div className="container">
          <h2 className="section-title">Eğitim Videoları</h2>
          {videosLoading && (
            <div className="card-row videos">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="video-card">
                  <div style={{ width: '100%', height: 160, background: '#f5f5f5' }} />
                  <div className="pet-meta">
                    <h3 style={{ background: '#f5f5f5', height: 16, width: '50%', margin: '10px 12px 14px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {videosError && <p style={{ textAlign: 'center', color: '#b00020' }}>{videosError}</p>}
          {!videosLoading && !videosError && (
            <div className="card-row videos">
              {videos.map((v) => (
                <Link to={`/videos/${v.id}`} className="video-card link-reset" key={v.id}>
                  <img src={v.thumbnailUrl} alt={v.title} />
                  <span className="chip">{v.episodeCount} bölüm</span>
                  <h3>{v.title}</h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section-alt split">
        <div className="container split-grid">
          <div className="split-media"><img src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=900&auto=format&fit=crop" alt="Eğitmen portresi" /></div>
          <div className="split-content"><h3>Eğitmen Eşliğinde Köpeklerle Yürüyüş Etkinlikleri</h3><p>Uzman eğitmenlerle sosyalleşme ve egzersiz dolu yürüyüşlere katılın.</p><a className="btn btn-primary" href="#">Etkinliklere Göz At</a></div>
        </div>
      </section>

      <section id="magaza" className="section split">
        <div className="container split-grid reverse">
          <div className="split-media"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop" alt="Tasarımcı portresi" /></div>
          <div className="split-content"><h3>Tasarım Evcil Hayvan Ürünleri</h3><p>Dayanıklı ve şık tasmalar, oyuncaklar ve daha fazlası.</p><a className="btn btn-soft" href="#">Mağazayı Ziyaret Et</a></div>
        </div>
      </section>

      <section id="topluluk" className="section">
        <div className="container">
          <h2 className="section-title">Forumdan Öne Çıkanlar</h2>
          <ul className="forum-list">
            <li><a href="#">Yeni köpeğim için en iyi mama markası hangisi?</a><span>24 yanıt • son 2 gün</span></li>
            <li><a href="#">Kedim mobilyaları tırmalıyor, ne yapabilirim?</a><span>16 yanıt • son 5 gün</span></li>
            <li><a href="#">Ankara’da köpek dostu park ve kafe önerileri</a><span>18 yanıt • son 1 gün</span></li>
            <li><a href="#">Evde pozitif köpek eğitimi için ipuçları</a><span>8 yanıt • son 7 gün</span></li>
          </ul>
          <div className="forum-cta"><a className="btn btn-primary" href="#">Foruma Git</a></div>
        </div>
      </section>
    </main>
  )
}


