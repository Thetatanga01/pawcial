import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useKeycloak } from './providers/KeycloakProvider.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Pets from './pages/Pets.jsx'
import PetDetail from './pages/PetDetail.jsx'
import VideoDetail from './pages/VideoDetail.jsx'
import Events from './pages/Events.jsx'
import EventDetail from './pages/EventDetail.jsx'
import Login from './pages/Login.jsx'
import Adopt from './pages/Adopt.jsx'
import Training from './pages/Training.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { authenticated, loading, login, logout, userInfo, hasRole } = useKeycloak();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Check if user is admin
  const isAdmin = authenticated && hasRole('admin');
  
  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };
  
  // Function to determine if a nav item is active
  const isActive = (path) => {
    // Only highlight if we're on a dedicated subpage, not on home page
    return location.pathname.startsWith(path);
  };

  // Check if we're on admin page to hide header/footer
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="logo-dot"></span>
            <span className="brand-name">Pawcial</span>
          </Link>
          <nav className="nav">
            <Link 
              to="/pets" 
              className={isActive('/pets') ? 'active' : ''}
            >
              Sahiplendirme
            </Link>
            <Link 
              to="/training" 
              className={isActive('/training') ? 'active' : ''}
            >
              Eğitim
            </Link>
            <Link 
              to="/events" 
              className={isActive('/events') ? 'active' : ''}
            >
              Etkinlikler
            </Link>
            <Link 
              to="/#topluluk" 
              className={isActive('/community') ? 'active' : ''}
            >
              Topluluk
            </Link>
            <Link 
              to="/#magaza" 
              className={isActive('/store') ? 'active' : ''}
            >
              Mağaza
            </Link>
          </nav>
              <div className="actions">
                {loading ? (
                  <span>Yükleniyor...</span>
                ) : authenticated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    {isAdmin ? (
                      <Link 
                        to="/admin" 
                        className="link"
                        style={{ 
                          cursor: 'pointer',
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        {userInfo?.name || userInfo?.preferred_username || userInfo?.email || 'Kullanıcı'}
                      </Link>
                    ) : (
                      <span className="link">
                        {userInfo?.name || userInfo?.preferred_username || userInfo?.email || 'Kullanıcı'}
                      </span>
                    )}
                    <button 
                      className="link" 
                      onClick={() => setShowLogoutModal(true)}
                      style={{ 
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'inherit',
                        font: 'inherit',
                        fontSize: '0.875rem',
                        opacity: 0.7
                      }}
                    >
                      Çıkış
                    </button>
                  </div>
                ) : (
                  <button 
                    className="link" 
                    onClick={login}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'inherit',
                      font: 'inherit'
                    }}
                  >
                    Giriş
                  </button>
                )}
              </div>
        </div>
      </header>}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/videos/:id" element={<VideoDetail />} />
            <Route path="/training" element={<Training />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes - Giriş yapmış kullanıcılar için */}
            <Route 
              path="/adopt/:id" 
              element={
                <ProtectedRoute>
                  <Adopt />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes - Sadece admin rolüne sahip kullanıcılar için */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>

      {!isAdminPage && <footer className="site-footer">
        <div className="container footer-inner">
              <div className="footer-left">
                <Link to="/" className="brand"><span className="logo-dot"></span><span className="brand-name">Pawcial</span></Link>
                <p>© <span>{currentYear}</span> Pawcial. Tüm hakları saklıdır.</p>
              </div>
          <nav className="footer-nav"><a href="#">Hakkımızda</a><a href="#">Gizlilik Politikası</a><a href="#">Hizmet Şartları</a></nav>
        </div>
      </footer>}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#333'
            }}>
              Çıkış Yap
            </h3>
            <p style={{ 
              margin: '0 0 1.5rem 0',
              color: '#666',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              Uygulamadan çıkış yapmak istediğinizden emin misiniz?
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  padding: '0.625rem 1.25rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                İptal
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.625rem 1.25rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#ff6b6b',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#ff5252'}
                onMouseLeave={(e) => e.target.style.background = '#ff6b6b'}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
