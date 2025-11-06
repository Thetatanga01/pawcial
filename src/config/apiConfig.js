// API Configuration
// Tarayıcıdan erişilebilir backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.72:8000/api';

// Development için localhost kullan
export const isDevelopment = import.meta.env.DEV;

// API base URL'i al (development'ta localhost, production'da server IP)
export function getApiBaseUrl() {
  // Development mode'da (npm run dev) localhost kullan
  if (isDevelopment) {
    return 'http://localhost:8000/api';
  }
  // Production build'de (npm run build) server IP kullan
  return 'http://192.168.0.72:8000/api';
}

