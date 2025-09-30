import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import PetDetail from './pages/PetDetail.jsx'
import VideoDetail from './pages/VideoDetail.jsx'

export default function App() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <span className="logo-dot"></span>
            <span className="brand-name">Pawcial</span>
          </div>
          <nav className="nav">
            <a href="/#sahiplendirme">Sahiplendirme</a>
            <a href="/#egitim">Eğitim</a>
            <a href="/#topluluk">Topluluk</a>
            <a href="/#magaza">Mağaza</a>
          </nav>
          <div className="actions">
            <a className="link" href="#">Giriş</a>
            <button className="avatar" aria-label="Profil"></button>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets/:id" element={<PetDetail />} />
        <Route path="/videos/:id" element={<VideoDetail />} />
      </Routes>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-left">
            <div className="brand"><span className="logo-dot"></span><span className="brand-name">Pawcial</span></div>
            <p>© <span>{currentYear}</span> Pawcial. Tüm hakları saklıdır.</p>
          </div>
          <nav className="footer-nav"><a href="#">Hakkımızda</a><a href="#">Gizlilik Politikası</a><a href="#">Hizmet Şartları</a></nav>
        </div>
      </footer>
    </>
  );
}
