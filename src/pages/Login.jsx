import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKeycloak } from '../providers/KeycloakProvider'

export default function Login() {
  const { login, register, authenticated, loading } = useKeycloak()
  const navigate = useNavigate()

  // Eğer kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (authenticated && !loading) {
      navigate('/')
    }
  }, [authenticated, loading, navigate])

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="login-container">
            <div className="login-card">
              <div className="login-header">
                <h1 className="login-title">Yükleniyor...</h1>
                <p className="login-subtitle">Lütfen bekleyin</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="container">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Pawcial'e Hoş Geldiniz</h1>
              <p className="login-subtitle">Devam etmek için giriş yapın</p>
            </div>

            <div className="login-form">
              <button 
                onClick={login}
                className="btn btn-primary login-btn"
                style={{ marginBottom: '1rem' }}
              >
                Keycloak ile Giriş Yap
              </button>

              <button 
                onClick={register}
                className="btn login-btn"
                style={{ 
                  background: 'transparent',
                  border: '2px solid var(--primary)',
                  color: 'var(--primary)'
                }}
              >
                Kayıt Ol
              </button>
            </div>

            <div className="social-login">
              <div className="divider">
                <span>Bilgilendirme</span>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <p>
                  🔐 Güvenli giriş için Keycloak kimlik doğrulama sistemi kullanılmaktadır.
                </p>
                <p style={{ marginTop: '0.5rem' }}>
                  Sosyal medya hesaplarınızla (Google, Facebook, GitHub) giriş yapabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
