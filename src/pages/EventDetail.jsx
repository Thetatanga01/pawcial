import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchEventById } from '../api/events.js'
import { fetchEventDetails } from '../api/eventDetails.js'
import { fetchEventComments, addEventComment } from '../api/comments.js'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [eventDetails, setEventDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [rating, setRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    Promise.all([
      fetchEventById(id),
      fetchEventDetails(id)
    ])
      .then(([eventData, detailsData]) => { 
        if (mounted) { 
          setEvent(eventData); 
          setEventDetails(detailsData);
          setLoading(false) 
        } 
      })
      .catch((err) => { if (mounted) { setError(err?.message || 'Beklenmeyen bir hata oluştu'); setLoading(false) } })
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    let mounted = true
    fetchEventComments(id)
      .then((data) => { if (mounted) { setComments(data); setCommentsLoading(false) } })
      .catch((err) => { if (mounted) { setCommentsLoading(false) } })
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    if (isImageModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isImageModalOpen, selectedImageIndex, eventDetails?.images])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || rating === 0) return

    setSubmitting(true)
    try {
      const comment = await addEventComment(id, newComment, rating)
      setComments(prev => [comment, ...prev])
      setNewComment('')
      setRating(0)
    } catch (err) {
      console.error('Yorum eklenirken hata:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRatingClick = (value) => {
    setRating(value)
  }

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index)
  }

  const handleThumbnailScroll = (direction) => {
    if (!eventDetails?.images) return
    
    const maxStartIndex = Math.max(0, eventDetails.images.length - 4)
    
    if (direction === 'left') {
      setThumbnailStartIndex(prev => Math.max(0, prev - 1))
    } else {
      setThumbnailStartIndex(prev => Math.min(maxStartIndex, prev + 1))
    }
  }

  const isPastEvent = new Date(event?.date) < new Date().setHours(0, 0, 0, 0)
  const visibleThumbnails = eventDetails?.images?.slice(thumbnailStartIndex, thumbnailStartIndex + 4) || []

  const handleMainImageClick = () => {
    setIsImageModalOpen(true)
  }

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false)
  }

  const handleImageNavigation = (direction) => {
    if (!eventDetails?.images) return
    
    if (direction === 'next') {
      setSelectedImageIndex(prev => (prev + 1) % eventDetails.images.length)
    } else {
      setSelectedImageIndex(prev => (prev - 1 + eventDetails.images.length) % eventDetails.images.length)
    }
  }

  const handleKeyDown = (e) => {
    if (!isImageModalOpen) return
    
    if (e.key === 'Escape') {
      handleCloseImageModal()
    } else if (e.key === 'ArrowLeft') {
      handleImageNavigation('prev')
    } else if (e.key === 'ArrowRight') {
      handleImageNavigation('next')
    }
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="section-title">Yükleniyor...</h1>
          <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>Etkinlik bilgileri yükleniyor.</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="section-title">Hata!</h1>
          <p style={{ textAlign: 'center', color: '#b00020' }}>{error}</p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn-soft" onClick={() => navigate('/events')}>Etkinliklere Dön</button>
          </div>
        </div>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="section-title">Etkinlik Bulunamadı</h1>
          <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>Aradığınız etkinlik mevcut değil.</p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn-soft" onClick={() => navigate('/events')}>Etkinliklere Dön</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="container">
        <div className="event-detail-header">
          <button 
            className="event-detail-back-btn"
            onClick={() => navigate('/events')}
            title="Etkinliklere dön"
          >
            ← Etkinliklere Dön
          </button>
          <h1 className="event-detail-title">{event.title}</h1>
          <p className="event-detail-description">{event.description}</p>
        </div>

        <div className="event-detail-content">
          <div className="event-detail-main">
            <section className="event-detail-section">
              <h2>Etkinlik Hakkında</h2>
              <p>{eventDetails?.about || event.about || 'Bu etkinlik hakkında detaylı bilgiler yakında eklenecek.'}</p>
            </section>

            {isPastEvent ? (
              <section className="event-detail-section">
                <h2>Neler Yaptık</h2>
                <p>{eventDetails?.whatWeDid || 'Bu etkinlikte yapılan aktiviteler hakkında detaylı bilgiler yakında eklenecek.'}</p>
              </section>
            ) : (
              <section className="event-detail-section">
                <h2>Getirilecekler</h2>
                <p>{eventDetails?.whatToBring || event.whatToBring || 'Etkinlik için gerekli malzemeler listesi yakında eklenecek.'}</p>
              </section>
            )}

            {!isPastEvent ? (
              <section className="event-detail-section">
                <h2>Kayıt</h2>
                <p>{eventDetails?.registration || event.registration || 'Kayıt bilgileri yakında eklenecek.'}</p>
                <button className="btn btn-primary event-register-btn">Şimdi Kayıt Ol</button>
              </section>
            ) : (
              <section className="event-detail-section">
                <h2>Etkinlik Görselleri</h2>
                <div className="event-gallery">
                  <div className="event-gallery-main">
                    <img 
                      src={eventDetails?.images?.[selectedImageIndex] || event.image} 
                      alt={event.title} 
                      className="event-gallery-main-image clickable-image" 
                      onClick={handleMainImageClick}
                      title="Resmi büyütmek için tıklayın"
                    />
                  </div>
                  {eventDetails?.images && eventDetails.images.length > 0 && (
                    <div className="event-gallery-thumbnails-container">
                      {thumbnailStartIndex > 0 && (
                        <button 
                          className="gallery-nav-btn gallery-nav-left"
                          onClick={() => handleThumbnailScroll('left')}
                        >
                          ‹
                        </button>
                      )}
                      <div className="event-gallery-thumbnails">
                        {visibleThumbnails.map((image, index) => {
                          const actualIndex = thumbnailStartIndex + index
                          return (
                            <img 
                              key={actualIndex}
                              src={image} 
                              alt={`${event.title} - Görsel ${actualIndex + 1}`} 
                              className={`event-gallery-thumb ${actualIndex === selectedImageIndex ? 'active' : ''}`}
                              onClick={() => handleThumbnailClick(actualIndex)}
                            />
                          )
                        })}
                      </div>
                      {thumbnailStartIndex < (eventDetails.images.length - 4) && (
                        <button 
                          className="gallery-nav-btn gallery-nav-right"
                          onClick={() => handleThumbnailScroll('right')}
                        >
                          ›
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          <div className="event-detail-sidebar">
            <div className="event-details-card">
              <h3>Etkinlik Detayları</h3>
              <div className="event-detail-item">
                <span className="event-detail-icon">📅</span>
                <span>{event.displayDate}</span>
              </div>
              <div className="event-detail-item">
                <span className="event-detail-icon">🕐</span>
                <span>{event.time || '10:00 - 12:00'}</span>
              </div>
              <div className="event-detail-item">
                <span className="event-detail-icon">📍</span>
                <span>{event.location || 'Merkez Park'}</span>
              </div>
              <div className="event-detail-item">
                <span className="event-detail-icon">👨‍🏫</span>
                <span>{event.instructor || 'Dr. Ayşe Yılmaz, Sertifikalı Köpek Eğitmeni'}</span>
              </div>
            </div>

            <div className="event-location-card">
              <h3>Konum Haritası</h3>
              <div className="map-placeholder">
                <p>Harita yükleniyor...</p>
              </div>
              <button className="btn btn-primary location-btn">
                <span>🧭</span>
                Yol Tarifi Al
              </button>
            </div>
          </div>
        </div>

        <section className="comments-section">
          <h2>Yorumlar ve Değerlendirmeler</h2>
          
          <div className="add-comment-form">
            <div className="comment-user-info">
              <div className="comment-avatar">👤</div>
              <div className="comment-form-content">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Deneyiminizi paylaşın..."
                  className="comment-textarea"
                />
                <div className="comment-form-actions">
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= rating ? 'filled' : ''}`}
                        onClick={() => handleRatingClick(star)}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmitComment}
                    disabled={submitting || !newComment.trim() || rating === 0}
                  >
                    {submitting ? 'Gönderiliyor...' : 'Gönder'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="comments-list">
            {commentsLoading ? (
              <p>Yorumlar yükleniyor...</p>
            ) : comments.length === 0 ? (
              <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-date">{comment.date}</span>
                  </div>
                  <div className="comment-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star ${i < comment.rating ? 'filled' : ''}`}>⭐</span>
                    ))}
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    <button className="comment-action-btn">
                      👍 {comment.likes}
                    </button>
                    <button className="comment-action-btn">Yanıtla</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Image Modal */}
        {isImageModalOpen && eventDetails?.images && eventDetails.images.length > 0 && (
          <div className="image-modal-overlay" onClick={handleCloseImageModal}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="image-modal-close" 
                onClick={handleCloseImageModal}
                aria-label="Kapat"
              >
                ×
              </button>
              
              {eventDetails.images.length > 1 && (
                <button 
                  className="image-modal-nav image-modal-prev"
                  onClick={() => handleImageNavigation('prev')}
                  aria-label="Önceki resim"
                >
                  ‹
                </button>
              )}
              
              <img 
                src={eventDetails.images[selectedImageIndex]} 
                alt={`${event.title} - Görsel ${selectedImageIndex + 1}`} 
                className="image-modal-image" 
              />
              
              {eventDetails.images.length > 1 && (
                <button 
                  className="image-modal-nav image-modal-next"
                  onClick={() => handleImageNavigation('next')}
                  aria-label="Sonraki resim"
                >
                  ›
                </button>
              )}
              
              <div className="image-modal-counter">
                {selectedImageIndex + 1} / {eventDetails.images.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
