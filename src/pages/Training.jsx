import { useEffect, useState } from 'react'
import { fetchTrainings } from '../api/trainings.js'

export default function Training() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')
  const [topic, setTopic] = useState('all')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchTrainings({ type })
      .then((data) => { if (mounted) { setItems(data); setLoading(false) } })
      .catch((err) => { if (mounted) { setError(err?.message || 'Beklenmeyen bir hata oluştu'); setLoading(false) } })
    return () => { mounted = false }
  }, [type])

  const current = items
    .filter(i => category === 'all' || i.category === category)
    .filter(i => topic === 'all' || i.topic === topic)

  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Eğitimler</h1>
        <p className="section-lead">Uzman eğitmenlerden eğitim ve atölyeler</p>

        <div className="trainings-layout">
          <aside className="trainings-sidebar">
            <div className="search-container" style={{ marginBottom: '1rem' }}>
              <input className="search-input" placeholder="İlgi duyduğun eğitimi ara" />
            </div>
            <nav className="tree-menu">
              <div className="tree-group">
                <button className={`tree-link ${type==='all' ? 'active' : ''}`} onClick={() => setType('all')}>Tüm Eğitimler</button>
                <button className={`tree-link ${type==='education' ? 'active' : ''}`} onClick={() => setType('education')}>Eğitimler</button>
                <button className={`tree-link ${type==='workshop' ? 'active' : ''}`} onClick={() => setType('workshop')}>Atölyeler</button>
              </div>
              <div className="tree-heading">Success</div>
              <ul className="tree-list">
                {['Finans','Girişimcilik','Satış','Pazarlama','Liderlik','Yetkinlik Gelişimi','Sürdürülebilirlik'].map((t) => (
                  <li key={t}><button className={`tree-item ${topic===t ? 'active' : ''}`} onClick={() => { setCategory('Success'); setTopic(t) }}>{t}</button></li>
                ))}
              </ul>
              <div className="tree-heading">Culture</div>
              <ul className="tree-list">
                {['Sinema','Tarih','Sağlık','Yemek','Tasarım'].map((t) => (
                  <li key={t}><button className={`tree-item ${topic===t ? 'active' : ''}`} onClick={() => { setCategory('Culture'); setTopic(t) }}>{t}</button></li>
                ))}
              </ul>
              <div style={{ marginTop: '8px' }}>
                <button className="btn btn-soft" onClick={() => { setCategory('all'); setTopic('all') }}>Filtreleri Temizle</button>
              </div>
            </nav>
          </aside>
          <section className="trainings-content">
            {loading && (
              <div className="trainings-grid-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="event-card-large" style={{ height: 220 }} />
                ))}
              </div>
            )}
            {error && <p style={{ textAlign: 'center', color: '#b00020' }}>{error}</p>}
            {!loading && !error && (
              <div className="trainings-grid-3">
                {current.map((it) => (
                  <div key={it.id} className="training-card">
                    <img src={it.image} alt={it.title} />
                    <div className="training-meta">
                      <h3 className="training-instructor">{it.instructor}</h3>
                      <p className="training-title">{it.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        
      </div>
    </main>
  )
}


