// API Configuration
// Tarayıcıdan erişilebilir backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Development için localhost kullan
export const isDevelopment = import.meta.env.DEV;

// API base URL'i al (development'ta localhost, production'da relative path)
export function getApiBaseUrl() {
  // Development mode'da (npm run dev) localhost kullan
  if (isDevelopment) {
    return 'http://localhost:8000/api';
  }
  // Production build'de (npm run build) relative path kullan
  // Nginx reverse proxy sayesinde /api -> backend:8000/api olacak
  return '/api';
}

