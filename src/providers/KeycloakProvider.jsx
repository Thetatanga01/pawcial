import { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '../config/keycloak';

const KeycloakContext = createContext(undefined);

export const KeycloakProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        messageReceiveTimeout: 10000,
      })
      .then((auth) => {
        setAuthenticated(auth);
        setInitialized(true);
        setLoading(false);

        if (auth && keycloak.token) {
          // Token'ı localStorage'a kaydet (opsiyonel)
          localStorage.setItem('keycloak-token', keycloak.token);

          // Kullanıcı bilgilerini al
          keycloak.loadUserInfo()
            .then((info) => {
              console.log('✅ Kullanıcı giriş yaptı:', info.preferred_username || info.email);
              setUserInfo(info);
            })
            .catch((err) => {
              console.error('Kullanıcı bilgileri yüklenemedi:', err);
            });

          // Token refresh
          keycloak.onTokenExpired = () => {
            keycloak
              .updateToken(30)
              .then((refreshed) => {
                if (refreshed) {
                  localStorage.setItem('keycloak-token', keycloak.token);
                }
              })
              .catch(() => {
                console.error('Token yenilenemedi, lütfen tekrar giriş yapın');
                keycloak.login();
              });
          };
        }
      })
      .catch((error) => {
        console.error('Keycloak başlatılamadı:', error);
        setLoading(false);
      });
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    localStorage.removeItem('keycloak-token');
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  const register = () => {
    keycloak.register();
  };

  const hasRole = (role) => {
    return keycloak.hasRealmRole(role);
  };

  const hasAnyRole = (roles) => {
    return roles.some((role) => keycloak.hasRealmRole(role));
  };

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

