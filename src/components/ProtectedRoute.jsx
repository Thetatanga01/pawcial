import { Navigate } from 'react-router-dom';
import { useKeycloak } from '../providers/KeycloakProvider';

const ProtectedRoute = ({ children, roles }) => {
  const { authenticated, loading, hasAnyRole } = useKeycloak();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        Yükleniyor...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !hasAnyRole(roles)) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem',
        gap: '1rem'
      }}>
        <h2>Yetkisiz Erişim</h2>
        <p>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        <button onClick={() => window.history.back()}>Geri Dön</button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

