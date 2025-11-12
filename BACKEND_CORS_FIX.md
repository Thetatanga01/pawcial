# 🔧 Backend CORS Yapılandırması - Keycloak ile

## ⚠️ Problem
Frontend'den backend'e Keycloak token'ı ile istek gönderilirken CORS hatası:
```
Access to XMLHttpRequest at 'http://localhost:8000/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## ✅ Çözüm: Backend application.properties

Backend projenizde **`src/main/resources/application.properties`** dosyasına şu satırları ekleyin:

```properties
# =============================================================================
# CORS Configuration - Frontend Access
# =============================================================================
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:5173,http://localhost:3000,http://localhost:8000
quarkus.http.cors.methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
quarkus.http.cors.headers=accept,authorization,content-type,x-requested-with
quarkus.http.cors.exposed-headers=*
quarkus.http.cors.access-control-max-age=3600
quarkus.http.cors.access-control-allow-credentials=true
```

### 🔑 Kritik Noktalar

1. **`authorization` header'ı mutlaka eklenmelidir!**
   - Keycloak token'ı `Authorization: Bearer <token>` formatında gönderiliyor
   - Bu header'a izin verilmezse CORS hatası alırsınız

2. **`OPTIONS` method'u mutlaka eklenmelidir!**
   - Browser preflight request için OPTIONS kullanır
   - Authorization header olduğu için preflight request gönderilir

3. **Origins listesine frontend URL'i eklenmelidir!**
   - `http://localhost:5173` (Vite default port)
   - `http://localhost:3000` (alternatif)

---

## 🐳 Docker veya .env.dev Kullanıyorsanız

`.env.dev` dosyanıza ekleyin:

```env
QUARKUS_HTTP_CORS=true
QUARKUS_HTTP_CORS_ORIGINS=http://localhost:5173,http://localhost:3000
QUARKUS_HTTP_CORS_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
QUARKUS_HTTP_CORS_HEADERS=accept,authorization,content-type,x-requested-with
QUARKUS_HTTP_CORS_EXPOSED_HEADERS=*
QUARKUS_HTTP_CORS_ACCESS_CONTROL_MAX_AGE=3600
QUARKUS_HTTP_CORS_ACCESS_CONTROL_ALLOW_CREDENTIALS=true
```

---

## 🧪 Test Etme

### 1. Backend'i Yeniden Başlatın

```bash
./mvnw quarkus:dev
```

### 2. Browser Console'da Test

```javascript
// Token'ı al
const token = localStorage.getItem('keycloak-token');

// Test isteği gönder
fetch('http://localhost:8000/temperaments?size=10', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('✅ Response status:', r.status);
  return r.json();
})
.then(d => console.log('✅ Data:', d))
.catch(e => console.error('❌ Error:', e));
```

### 3. Network Tab'ını İnceleyin

Browser Developer Tools > Network tab:

1. **İlk istek: OPTIONS (Preflight)**
   ```
   Request URL: http://localhost:8000/temperaments
   Request Method: OPTIONS
   Status Code: 200 OK (veya 204 No Content)
   
   Response Headers:
   Access-Control-Allow-Origin: http://localhost:5173
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
   Access-Control-Allow-Headers: accept, authorization, content-type, x-requested-with
   Access-Control-Allow-Credentials: true
   ```

2. **İkinci istek: GET (Asıl istek)**
   ```
   Request URL: http://localhost:8000/temperaments?size=10
   Request Method: GET
   Status Code: 200 OK
   
   Request Headers:
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI...
   Content-Type: application/json
   ```

---

## 🔍 Backend Log'larını Kontrol Edin

Backend console'da şunu görmelisiniz:

```
INFO  [io.quarkus.http] (Quarkus Main Thread) CORS filter configured with origins: 
  http://localhost:5173, http://localhost:3000
```

---

## ❌ Hata Devam Ederse

### Senaryo 1: "No 'Access-Control-Allow-Origin' header"

**Neden:** Backend CORS ayarları aktif değil veya yanlış yapılandırılmış

**Çözüm:**
```bash
# Backend console'da CORS log'larını kontrol edin
./mvnw quarkus:dev

# "CORS filter configured" mesajını görmelisiniz
```

### Senaryo 2: "Authorization header is not allowed"

**Neden:** `authorization` header'ı allowed-headers listesinde değil

**Çözüm:**
```properties
# application.properties'de şu satırın olduğundan emin olun:
quarkus.http.cors.headers=accept,authorization,content-type,x-requested-with
```

### Senaryo 3: "Preflight request doesn't pass access control check"

**Neden:** OPTIONS method'u desteklenmiyor

**Çözüm:**
```properties
# application.properties'de şu satırın olduğundan emin olun:
quarkus.http.cors.methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
```

---

## 🎯 Production İçin CORS Ayarları

Production'da tüm origin'lere izin vermek yerine sadece gerçek domain'inize izin verin:

```properties
# Production application.properties
quarkus.http.cors=true
quarkus.http.cors.origins=https://pawcial.com,https://www.pawcial.com
quarkus.http.cors.methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
quarkus.http.cors.headers=accept,authorization,content-type,x-requested-with
quarkus.http.cors.exposed-headers=*
quarkus.http.cors.access-control-max-age=86400
quarkus.http.cors.access-control-allow-credentials=true
```

**ÖNEMLİ:** Production'da `*` wildcard **kullanmayin**! Güvenlik riski oluşturur.

---

## 📋 Checklist

Backend CORS çalışıyor mu kontrol edin:

- [ ] `quarkus.http.cors=true` eklenmiş
- [ ] `origins` listesinde `http://localhost:5173` var
- [ ] `methods` listesinde `OPTIONS` var
- [ ] `headers` listesinde `authorization` var (lowercase!)
- [ ] Backend yeniden başlatıldı
- [ ] Browser console'da CORS hatası yok
- [ ] Network tab'da OPTIONS request başarılı (200/204)
- [ ] GET/POST request'ler başarılı (200)

---

## 🆘 Son Çare: Programmatic CORS Filter

Eğer `application.properties` çalışmazsa, Java kod ile CORS filter ekleyin:

```java
package com.pawcial.config;

import io.quarkus.vertx.http.runtime.filters.Filters;
import io.vertx.core.http.HttpMethod;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;

@ApplicationScoped
public class CorsFilter {

    public void configureCors(@Observes Filters filters) {
        filters.register(rc -> {
            rc.response()
                .putHeader("Access-Control-Allow-Origin", "http://localhost:5173")
                .putHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
                .putHeader("Access-Control-Allow-Headers", "accept, authorization, content-type, x-requested-with")
                .putHeader("Access-Control-Allow-Credentials", "true")
                .putHeader("Access-Control-Max-Age", "3600");

            if (rc.request().method() == HttpMethod.OPTIONS) {
                rc.response().setStatusCode(204).end();
            } else {
                rc.next();
            }
        }, 100);
    }
}
```

---

Hazırlayan: AI Assistant
Tarih: 12 Kasım 2025
Backend: Quarkus + Keycloak
Frontend: React + Vite + Axios

