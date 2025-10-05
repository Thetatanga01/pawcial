import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Pets from './pages/Pets.jsx'
import PetDetail from './pages/PetDetail.jsx'
import VideoDetail from './pages/VideoDetail.jsx'
import Events from './pages/Events.jsx'
import EventDetail from './pages/EventDetail.jsx'
import Adopt from './pages/Adopt.jsx'
import Training from './pages/Training.jsx'

export default function App() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  // Function to determine if a nav item is active
  const isActive = (path) => {
    // Only highlight if we're on a dedicated subpage, not on home page
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="site-header">
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
            <a className="link" href="#">Giriş</a>
            <button className="avatar" aria-label="Profil"></button>
          </div>
        </div>
      </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/videos/:id" element={<VideoDetail />} />
            <Route path="/adopt/:id" element={<Adopt />} />
            <Route path="/training" element={<Training />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
          </Routes>

      <footer className="site-footer">
        <div className="container footer-inner">
              <div className="footer-left">
                <Link to="/" className="brand"><span className="logo-dot"></span><span className="brand-name">Pawcial</span></Link>
                <p>© <span>{currentYear}</span> Pawcial. Tüm hakları saklıdır.</p>
              </div>
          <nav className="footer-nav"><a href="#">Hakkımızda</a><a href="#">Gizlilik Politikası</a><a href="#">Hizmet Şartları</a></nav>
        </div>
      </footer>
    </>
  );
}
