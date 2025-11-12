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
  
  // Check if user is admin
  const isAdmin = authenticated && hasRole('admin');
  
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
            
            {/* Admin sekmesi - sadece admin rolü olan kullanıcılar için */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className={isActive('/admin') ? 'active' : ''}
                style={{ color: '#ff6b6b' }}
              >
                ⚙️ Admin
              </Link>
            )}
          </nav>
              <div className="actions">
                {loading ? (
                  <span>Yükleniyor...</span>
                ) : authenticated ? (
                  <>
                    <span className="link" style={{ marginRight: '1rem' }}>
                      Hoş geldin, {userInfo?.preferred_username || userInfo?.name || 'Kullanıcı'}
                      {isAdmin && (
                        <span style={{ 
                          marginLeft: '0.5rem', 
                          padding: '0.15rem 0.5rem',
                          background: '#ff6b6b',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          ADMIN
                        </span>
                      )}
                    </span>
                    <button 
                      className="link" 
                      onClick={logout}
                      style={{ 
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'inherit',
                        font: 'inherit'
                      }}
                    >
                      Çıkış
                    </button>
                  </>
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
    </>
  );
}
