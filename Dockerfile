# Build aşaması
FROM node:20-alpine AS build

WORKDIR /app

# Package files'ı kopyala ve dependencies'i yükle
COPY package.json package-lock.json ./
RUN npm ci

# Source kodları kopyala ve build et
COPY . .
RUN npm run build

# Runtime aşaması - Nginx ile serve et
FROM nginx:1.25-alpine

# Nginx konfigürasyonu (SPA routing için)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build edilmiş dosyaları kopyala
COPY --from=build /app/dist /usr/share/nginx/html

# Healthcheck ekle
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

