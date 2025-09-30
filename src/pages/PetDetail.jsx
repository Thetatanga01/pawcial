import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchFeaturedPets } from '../api/pets.js'

export default function PetDetail() {
  const { id } = useParams()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    fetchFeaturedPets()
      .then((data) => { if (mounted) { setPets(data); setLoading(false) } })
      .catch((err) => { if (mounted) { setError(err?.message || 'Beklenmeyen bir hata oluştu'); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  const pet = useMemo(() => {
    const slug = decodeURIComponent(id || '').toLowerCase()
    return pets.find((p) => p.name.toLowerCase() === slug)
  }, [id, pets])

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <p>Yükleniyor...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="section">
        <div className="container">
          <p style={{ color: '#b00020' }}>{error}</p>
          <p><Link className="btn btn-soft" to="/">Geri dön</Link></p>
        </div>
      </main>
    )
  }

  if (!pet) {
    return (
      <main className="section">
        <div className="container">
          <h2 className="section-title">Hayvan bulunamadı</h2>
          <p>Aradığınız hayvan mevcut değil.</p>
          <p><Link className="btn btn-primary" to="/">Ana sayfaya dön</Link></p>
        </div>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="container split-grid">
        <div className="split-media">
          <img src={pet.thumbnailUrl} alt={`${pet.name} görseli`} />
        </div>
        <div className="split-content">
          <h3>{pet.name}</h3>
          <p>{pet.description}</p>
          <div style={{ marginTop: 14 }}>
            <Link className="btn btn-soft" to="/">Geri</Link>
            <a className="btn btn-primary" style={{ marginLeft: 10 }} href="#">Sahiplen</a>
          </div>
        </div>
      </div>
    </main>
  )
}


