import { useState } from 'react'
import { Link } from 'react-router-dom'
import DictionaryManagement from './DictionaryManagement.jsx'

export default function Admin() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const stats = [
    { label: 'Toplam Hayvan', value: '156', change: '+12', icon: '🐾' },
    { label: 'Aktif Etkinlik', value: '24', change: '+3', icon: '📅' },
    { label: 'Toplam Kullanıcı', value: '1,234', change: '+45', icon: '👥' },
    { label: 'Başvurular', value: '89', change: '+8', icon: '📝' }
  ]

  const recentActivities = [
    { action: 'Yeni hayvan eklendi', item: 'Max (Golden Retriever)', time: '5 dakika önce' },
    { action: 'Etkinlik güncellendi', item: 'Pati Festivali 2024', time: '1 saat önce' },
    { action: 'Yeni başvuru', item: 'Ahmet Yılmaz - Luna için', time: '2 saat önce' },
    { action: 'Video yüklendi', item: 'Köpek Eğitimi 101', time: '3 saat önce' },
    { action: 'Etkinlik oluşturuldu', item: 'Sokak Hayvanları Buluşması', time: '5 saat önce' }
  ]

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'dictionaries', label: 'Sözlük Tabloları', icon: '📚' },
    { id: 'pets', label: 'Hayvanlar', icon: '🐾' },
    { id: 'events', label: 'Etkinlikler', icon: '📅' },
    { id: 'videos', label: 'Videolar', icon: '🎥' },
    { id: 'users', label: 'Kullanıcılar', icon: '👥' },
    { id: 'applications', label: 'Başvurular', icon: '📝' },
    { id: 'comments', label: 'Yorumlar', icon: '💬' },
    { id: 'settings', label: 'Ayarlar', icon: '⚙️' }
  ]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-brand">
            <span className="logo-dot"></span>
            <span className="brand-name">Pawcial Admin</span>
          </Link>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">MG</div>
            <div className="admin-user-details">
              <div className="admin-user-name">Mustafa Güven</div>
              <div className="admin-user-role">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <button 
            className="admin-toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h1 className="admin-page-title">
            {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
          <div className="admin-header-actions">
            <button className="admin-notification-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>
            <Link to="/" className="admin-view-site-btn">
              Siteye Git →
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content">
          {activeSection === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="admin-stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="admin-stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-info">
                      <div className="stat-label">{stat.label}</div>
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-change positive">{stat.change} bu ay</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Content Grid */}
              <div className="admin-dashboard-grid">
                {/* Recent Activities */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Son Aktiviteler</h3>
                    <button className="admin-card-action">Tümünü Gör</button>
                  </div>
                  <div className="admin-card-body">
                    <div className="activity-list">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="activity-item">
                          <div className="activity-icon">•</div>
                          <div className="activity-content">
                            <div className="activity-action">{activity.action}</div>
                            <div className="activity-item-name">{activity.item}</div>
                          </div>
                          <div className="activity-time">{activity.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Hızlı İşlemler</h3>
                  </div>
                  <div className="admin-card-body">
                    <div className="quick-actions">
                      <button className="quick-action-btn">
                        <span className="quick-action-icon">🐕</span>
                        <span className="quick-action-label">Hayvan Ekle</span>
                      </button>
                      <button className="quick-action-btn">
                        <span className="quick-action-icon">📅</span>
                        <span className="quick-action-label">Etkinlik Oluştur</span>
                      </button>
                      <button className="quick-action-btn">
                        <span className="quick-action-icon">🎥</span>
                        <span className="quick-action-label">Video Yükle</span>
                      </button>
                      <button className="quick-action-btn">
                        <span className="quick-action-icon">📢</span>
                        <span className="quick-action-label">Duyuru Yap</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Onay Bekleyen İşlemler</h3>
                  <span className="badge">5</span>
                </div>
                <div className="admin-card-body">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Tür</th>
                        <th>Açıklama</th>
                        <th>Tarih</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="table-badge">Başvuru</span></td>
                        <td>Mehmet Demir - Bella için sahiplenme başvurusu</td>
                        <td>24 Eki 2025</td>
                        <td>
                          <button className="table-action-btn success">✓</button>
                          <button className="table-action-btn danger">✕</button>
                        </td>
                      </tr>
                      <tr>
                        <td><span className="table-badge">Yorum</span></td>
                        <td>Yeni yorum onay bekliyor</td>
                        <td>24 Eki 2025</td>
                        <td>
                          <button className="table-action-btn success">✓</button>
                          <button className="table-action-btn danger">✕</button>
                        </td>
                      </tr>
                      <tr>
                        <td><span className="table-badge">Etkinlik</span></td>
                        <td>Kış Festivali - Etkinlik güncelleme talebi</td>
                        <td>23 Eki 2025</td>
                        <td>
                          <button className="table-action-btn success">✓</button>
                          <button className="table-action-btn danger">✕</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Dictionary Management Section */}
          {activeSection === 'dictionaries' && (
            <DictionaryManagement />
          )}

          {/* Placeholder for other sections */}
          {activeSection !== 'dashboard' && activeSection !== 'dictionaries' && (
            <div className="admin-placeholder">
              <div className="placeholder-icon">
                {menuItems.find(item => item.id === activeSection)?.icon}
              </div>
              <h2>{menuItems.find(item => item.id === activeSection)?.label}</h2>
              <p>Bu bölüm için içerik yakında eklenecek.</p>
              <button className="btn btn-primary">
                {activeSection === 'pets' && '+ Yeni Hayvan Ekle'}
                {activeSection === 'events' && '+ Yeni Etkinlik Ekle'}
                {activeSection === 'videos' && '+ Yeni Video Ekle'}
                {activeSection === 'users' && '+ Yeni Kullanıcı Ekle'}
                {activeSection === 'applications' && 'Başvuruları Görüntüle'}
                {activeSection === 'comments' && 'Yorumları Görüntüle'}
                {activeSection === 'settings' && 'Ayarları Düzenle'}
                {activeSection === 'dictionaries' && 'Sözlük Tablosu Seç'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


