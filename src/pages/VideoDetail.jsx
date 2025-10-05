import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchVideoById } from '../api/videos.js'
import EpisodeCard from '../components/EpisodeCard.jsx'

export default function VideoDetail() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchVideoById(id)
      .then((data) => { if (mounted) { setVideo(data); setLoading(false) } })
      .catch((err) => { if (mounted) { setError(err?.message || 'Beklenmeyen bir hata oluştu'); setLoading(false) } })
    return () => { mounted = false }
  }, [id])

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="section-title">Video</h1>
          <p className="section-lead">Yükleniyor...</p>
          <div className="card-row videos">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="video-card" style={{ background: '#f5f5f5', height: '220px' }} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error || !video) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="section-title">Video</h1>
          <p style={{ color: '#b00020', textAlign: 'center' }}>{error || 'Video bulunamadı'}</p>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link className="btn btn-soft" to="/">Ana sayfaya dön</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="container">
        <nav style={{ marginBottom: '1rem' }}>
          <Link className="link" to="/">← Ana sayfa</Link>
        </nav>
        <h1 className="section-title">{video.title}</h1>
        {video.description && (
          <p className="section-lead">{video.description}</p>
        )}

        <div className="card-row videos">
          {video.episodes?.map((ep) => (
            <EpisodeCard key={ep.no} episode={ep} />
          ))}
        </div>
      </div>
    </main>
  )
}


