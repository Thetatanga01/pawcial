import axios from 'axios';
import keycloak from '../config/keycloak';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // CORS için credentials göndermesine izin ver
  withCredentials: false, // Keycloak token Authorization header'da gidiyor, cookie değil
  // Timeout ayarları
  timeout: 30000, // 30 saniye
});

// Request interceptor - Token ekleme
api.interceptors.request.use(
  async (config) => {
    console.log('🔧 Interceptor çalıştı - URL:', config.url);
    console.log('🔧 Method:', config.method);
    console.log('🔧 Keycloak instance:', keycloak);
    console.log('🔧 Keycloak authenticated:', keycloak.authenticated);
    console.log('🔧 Keycloak token exists:', !!keycloak.token);
    
    // Keycloak token varsa ekle
    if (keycloak.token) {
      try {
        // Token'ı yenile (30 saniye kalmışsa)
        await keycloak.updateToken(30);
        
        // Authorization header'ı ekle
        config.headers['Authorization'] = `Bearer ${keycloak.token}`;
        
        console.log('✅ Authorization header eklendi!');
        console.log('✅ Token (ilk 50 karakter):', keycloak.token.substring(0, 50));
        console.log('✅ Headers:', JSON.stringify(config.headers, null, 2));
      } catch (error) {
        console.error('❌ Token refresh failed:', error);
        keycloak.login();
        return Promise.reject(error);
      }
    } else {
      console.warn('⚠️ TOKEN YOK! Keycloak authenticated:', keycloak.authenticated);
      console.warn('⚠️ Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Error handling
api.interceptors.response.use(
  (response) => {
    // Başarılı response
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.config.method?.toUpperCase(), response.config.url, '- Status:', response.status);
    }
    return response;
  },
  async (error) => {
    // Hata detayları
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', error.message);
      console.error('❌ Error details:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    
    // CORS hatası kontrolü
    if (error.message === 'Network Error') {
      console.error('❌ CORS Hatası! Backend CORS ayarlarını kontrol edin.');
      console.error('Backend şu header\'lara izin vermelidir:');
      console.error('  - Access-Control-Allow-Origin: http://localhost:5173');
      console.error('  - Access-Control-Allow-Headers: authorization, content-type');
      console.error('  - Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH');
    }
    
    // 401 Unauthorized - Token geçersiz
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Token geçersiz, login\'e yönlendiriliyor');
      keycloak.login();
    }
    
    // 403 Forbidden - Yetki yok
    if (error.response?.status === 403) {
      console.error('❌ 403 Forbidden - Bu işlem için yetkiniz yok');
    }
    
    return Promise.reject(error);
  }
);

export default api;

