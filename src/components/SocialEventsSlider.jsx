import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSocialEvents } from '../api/events.js'

export default function SocialEventsSlider() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    let mounted = true
    fetchSocialEvents()
      .then((data) => { if (mounted) { setEvents(data); setLoading(false) } })
      .catch((err) => { if (mounted) { setError(err?.message || 'Beklenmeyen bir hata oluştu'); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (events.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (events.length - 2)) % (events.length - 2))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!isPaused && events.length > 0) {
      intervalRef.current = setInterval(nextSlide, 5000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isPaused, events.length])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`)
  }

  if (loading) {
    return (
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Etkinliklerimiz</h2>
          <div className="slider-container">
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ width: '33.33%', background: '#f5f5f5', height: '250px', borderRadius: '16px' }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Etkinliklerimiz</h2>
          <p style={{ textAlign: 'center', color: '#b00020' }}>{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section section-alt">
      <div className="container">
        <h2 className="section-title">Etkinliklerimiz</h2>
        <div 
          className="slider-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="slider-wrapper">
            <button 
              className="slider-nav slider-nav-prev" 
              onClick={prevSlide}
              aria-label="Önceki etkinlik"
            >
              ‹
            </button>
            
            <div className="slider-track" style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}>
              {events.map((event) => (
                <div key={event.id} className="slider-slide">
                  <div 
                    className="event-card clickable-event-card"
                    onClick={() => handleEventClick(event.id)}
                    title={`${event.title} - Detayları görüntülemek için tıklayın`}
                  >
                    <img src={event.image} alt={event.title} />
                    <div className="event-content">
                      <h3>{event.title}</h3>
                      <p className="event-date">{event.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="slider-nav slider-nav-next" 
              onClick={nextSlide}
              aria-label="Sonraki etkinlik"
            >
              ›
            </button>
          </div>
          
          <div className="slider-dots">
            {Array.from({ length: events.length - 2 }).map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Etkinlik ${index + 1}'e git`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
