// Bu dosya yedek - gerekirse kullanın
// PKCE olmadan basit versiyonu test etmek için bu kodu kullanabilirsiniz

import { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '../config/keycloak';

const KeycloakContext = createContext(undefined);

export const KeycloakProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    console.log('🔑 Keycloak initialization starting (NO PKCE)...');
    
    keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        // PKCE'yi kaldırdık - sadece test için
        enableLogging: true,
      })
      .then((auth) => {
        console.log('🔑 Keycloak init completed. Authenticated:', auth);
        setAuthenticated(auth);
        setInitialized(true);
        setLoading(false);

        if (auth && keycloak.token) {
          console.log('✅ User is authenticated');
          localStorage.setItem('keycloak-token', keycloak.token);
          
          keycloak.loadUserInfo().then((info) => {
            console.log('✅ User info loaded:', info);
            setUserInfo(info);
          });
        }
      })
      .catch((error) => {
        console.error('❌ Keycloak initialization error:', error);
        setLoading(false);
      });
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout({ redirectUri: window.location.origin });
  const register = () => keycloak.register();
  const hasRole = (role) => keycloak.hasRealmRole(role);
  const hasAnyRole = (roles) => roles.some((role) => keycloak.hasRealmRole(role));

  return (
    <KeycloakContext.Provider
      value={{
        keycloak,
        initialized,
        authenticated,
        loading,
        login,
        logout,
        register,
        token: keycloak.token,
        userInfo,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error('useKeycloak must be used within KeycloakProvider');
  }
  return context;
};

