import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchVideoSeries } from '../api/videos.js'
import EpisodeCard from '../components/EpisodeCard.jsx'

export default function VideoDetail() {
  const { id } = useParams()
  const [series, setSeries] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    fetchVideoSeries(id)
      .then((data) => { if (mounted) { setSeries(data); setLoading(false) } })
      .catch((err) => { if (mounted) { setError(err?.message || 'Beklenmeyen bir hata oluştu'); setLoading(false) } })
    return () => { mounted = false }
  }, [id])

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
        </div>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="container">
        <h2 className="section-title">{series.title}</h2>
        <div className="card-row videos">
          {series.episodes.map((ep) => (
            <EpisodeCard key={ep.no} episode={ep} />
          ))}
        </div>
      </div>
    </main>
  )
}


