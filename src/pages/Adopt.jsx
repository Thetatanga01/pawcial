import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchPetById } from '../api/pets.js'

export default function Adopt() {
  const { id } = useParams()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchPetById(id)
      .then((data) => { if (mounted) { setPet(data); setLoading(false) } })
      .catch((err) => { if (mounted) { setError(err?.message || 'Beklenmeyen bir hata oluştu'); setLoading(false) } })
    return () => { mounted = false }
  }, [id])

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="section-title">Yuva Ol</h1>
          <p className="section-lead">Yükleniyor...</p>
        </div>
      </main>
    )
  }

  if (error || !pet) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="section-title">Yuva Ol</h1>
          <p style={{ color: '#b00020' }}>{error || 'Hayvan bulunamadı'}</p>
          <p><Link className="btn btn-soft" to="/pets">Geri dön</Link></p>
        </div>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="container">
        <div className="pet-detail-back">
          <Link className="btn btn-soft" to={`/pets/${pet.id}`}>Geri</Link>
        </div>
        <h1 className="section-title">{pet.name} için Yuva Ol</h1>
        <p className="section-lead">Kısa formu doldurun, ekibimiz sizinle iletişime geçsin.</p>

        <div className="split-grid" style={{ gap: '24px', alignItems: 'flex-start' }}>
          <div className="split-content">
            <div className="event-details-card">
            <form className="form-grid" onSubmit={(e) => { e.preventDefault(); alert('Başvurunuz alındı!'); }}>
              <div className="form-field">
                <label htmlFor="fullName">Ad Soyad</label>
                <input id="fullName" type="text" required className="search-input" />
              </div>
              <div className="form-field">
                <label htmlFor="email">E-posta</label>
                <input id="email" type="email" required className="search-input" />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Telefon</label>
                <input id="phone" type="tel" required className="search-input" />
              </div>
              <div className="form-field">
                <label htmlFor="homeType">Yaşam Alanı</label>
                <select id="homeType" required className="filter-select">
                  <option value="">Seçin</option>
                  <option value="apartment">Apartman</option>
                  <option value="house">Müstakil Ev</option>
                  <option value="with-garden">Bahçeli</option>
                </select>
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="message">Kısa Mesaj</label>
                <textarea id="message" rows={4} placeholder={`${pet.name} ile neden ilgileniyorsunuz?`} className="comment-textarea" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button className="btn btn-primary" type="submit">Başvuruyu Gönder</button>
              </div>
            </form>
            </div>
          </div>

          <div className="split-media">
            <div className="pet-card">
              <img src={pet.thumbnailUrl || pet.images?.[0]} alt={pet.name} />
              <div className="pet-meta">
                <h3>{pet.name}</h3>
                <p>{pet.description || pet.breed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


