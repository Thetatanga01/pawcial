import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchSocialEvents } from '../api/events.js'

export default function Events() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [highlightedDay, setHighlightedDay] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 6
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 9)) // October 2024

  useEffect(() => {
    let mounted = true
    fetchSocialEvents()
      .then((data) => { if (mounted) { setEvents(data); setLoading(false) } })
      .catch((err) => { if (mounted) { setError(err?.message || 'Beklenmeyen bir hata oluştu'); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !filterType || event.type === filterType
      const matchesDate = !filterDate || event.date.includes(filterDate)
      const matchesLocation = !filterLocation || event.location === filterLocation
      return matchesSearch && matchesType && matchesDate && matchesLocation
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
  const startIndex = (currentPage - 1) * eventsPerPage
  const endIndex = startIndex + eventsPerPage
  const currentEvents = filteredEvents.slice(startIndex, endIndex)


  const handleCalendarView = (day) => {
    setHighlightedDay(day)
    // Scroll to calendar section
    const calendarSection = document.querySelector('.calendar-section')
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCalendarEventClick = (eventId) => {
    navigate(`/events/${eventId}`)
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
    setHighlightedDay(null) // Clear highlight when changing months
  }

  const getMonthName = (date) => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ]
    return months[date.getMonth()]
  }

  const getCalendarDays = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day)
    }
    return days
  }

  // Calendar events derived from the main events data
  const calendarEvents = events.map(event => ({
    id: event.id,
    date: event.date,
    title: event.title,
    image: event.image
  }))

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="events-title">Pawcial Events</h1>
          <p className="events-subtitle">Loading events...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="events-title">Pawcial Events</h1>
          <p style={{ color: '#b00020', textAlign: 'center' }}>{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Pawcial Etkinlikleri</h1>
        <p className="section-lead">
          Evcil hayvan severler ve tüylü dostları için topluluk etkinliklerimize katılın. Rehberli köpek yürüyüşlerinden evcil hayvan temalı atölyelere kadar herkes için bir şeyler var.
        </p>
        
        <div className="events-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Etkinlik ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
              <option value="">Tür</option>
              <option value="workshop">Atölye</option>
              <option value="walk">Yürüyüş</option>
              <option value="meeting">Buluşma</option>
            </select>
            <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="filter-select">
              <option value="">Tarih</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
            <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="filter-select">
              <option value="">Konum</option>
              <option value="park">Park</option>
              <option value="cafe">Kafe</option>
              <option value="workshop">Atölye</option>
            </select>
          </div>
        </div>

            <div className="events-list">
              {currentEvents.map((event) => (
                <div key={event.id} className="event-card-large">
                  <button
                    className="calendar-icon-btn"
                    onClick={() => handleCalendarView(new Date(event.date).getDate())}
                    title="Takvimde göster"
                  >
                    📅
                  </button>
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                  </div>
              <div className="event-details">
                <div className="event-date">{event.displayDate}</div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                    <div className="event-buttons">
                      <Link to={`/events/${event.id}`} className="btn btn-primary btn-small">Detaylar</Link>
                      {new Date(event.date) >= new Date().setHours(0, 0, 0, 0) && (
                        <button className="btn btn-success btn-small">Katıl</button>
                      )}
                    </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Önceki
            </button>
            <span className="pagination-info">
              Sayfa {currentPage} / {totalPages}
            </span>
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </button>
          </div>
        )}

        <div className="calendar-section">
          <div className="calendar-header">
            <h2>{getMonthName(currentMonth)} {currentMonth.getFullYear()}</h2>
            <div className="calendar-nav">
              <button 
                className="calendar-nav-btn" 
                onClick={() => navigateMonth(-1)}
              >
                ‹
              </button>
              <button 
                className="calendar-nav-btn" 
                onClick={() => navigateMonth(1)}
              >
                ›
              </button>
            </div>
          </div>
          
          <div className="calendar-grid">
            <div className="calendar-days">
              <div className="day-header">Pzt</div>
              <div className="day-header">Sal</div>
              <div className="day-header">Çar</div>
              <div className="day-header">Per</div>
              <div className="day-header">Cum</div>
              <div className="day-header">Cmt</div>
              <div className="day-header">Paz</div>
            </div>
            
            <div className="calendar-dates">
              {getCalendarDays(currentMonth).map((date, i) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                const day = date.getDate()
                const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                const dayEvents = calendarEvents.filter(e => e.date === currentDate)
                
                return (
                  <div key={i} className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${highlightedDay === day && isCurrentMonth ? 'highlighted' : ''}`}>
                    <span className="day-number">{day}</span>
                    {isCurrentMonth && dayEvents.length > 0 && (
                      <div className="calendar-events-container">
                        {dayEvents.map((event, eventIndex) => (
                          <div 
                            key={eventIndex} 
                            className="calendar-event clickable-calendar-event"
                            onClick={() => handleCalendarEventClick(event.id)}
                            title={`${event.title} - Detayları görüntülemek için tıklayın`}
                          >
                            <img src={event.image} alt={event.title} />
                            <div className="event-title-small">{event.title}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
