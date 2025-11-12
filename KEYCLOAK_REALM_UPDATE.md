# 🔄 Keycloak Realm Güncelleme - pawcial → pawcial-dev

## ✅ Frontend'de Yapılan Değişiklikler

### 1. `src/config/keycloak.js`
```javascript
realm: 'pawcial-dev'  // ✅ Güncellendi
```

### 2. `.env.development`
```env
VITE_KEYCLOAK_REALM=pawcial-dev  # ✅ Güncellendi
```

### 3. `.env.production`
```env
VITE_KEYCLOAK_REALM=pawcial-dev  # ✅ Güncellendi
```

---

## ⚠️ Backend'de Yapılması Gerekenler

### 1. Backend `application.properties`

Backend projenizde `src/main/resources/application.properties` dosyasını açın:

**ÖNCE (ESKİ):**
```properties
quarkus.oidc.auth-server-url=https://keycloak.guven.uk/realms/pawcial
```

**SONRA (YENİ):**
```properties
quarkus.oidc.auth-server-url=https://keycloak.guven.uk/realms/pawcial-dev
```

### 2. Backend `.env.dev` (Varsa)

**ÖNCE (ESKİ):**
```env
QUARKUS_OIDC_AUTH_SERVER_URL=https://keycloak.guven.uk/realms/pawcial
```

**SONRA (YENİ):**
```env
QUARKUS_OIDC_AUTH_SERVER_URL=https://keycloak.guven.uk/realms/pawcial-dev
```

### 3. Backend'i Yeniden Başlatın

```bash
# Backend'i durdurun (Ctrl+C)
# Yeniden başlatın:
./mvnw quarkus:dev
```

Backend console'da şunu görmelisiniz:
```
INFO  [io.quarkus.oidc] OIDC server url: https://keycloak.guven.uk/realms/pawcial-dev
```

---

## 🔐 Keycloak'ta Yapılması Gerekenler

### Senaryo 1: Realm İsmini Değiştirdiyseniz

Keycloak Admin Console'da (`https://keycloak.guven.uk/admin`):

1. **Sol üstteki realm dropdown'ından `pawcial-dev` realm'ini seçin**
2. **Clients > pawcial-frontend-dev** client'ını kontrol edin:
   - ✅ Client ID: `pawcial-frontend-dev`
   - ✅ Valid Redirect URIs: `http://localhost:5173/*`
   - ✅ Web origins: `http://localhost:5173`

3. **Realm Roles** kontrol edin:
   - ✅ `admin` rolü var mı?
   - ✅ `moderator` rolü var mı?
   - ✅ `user` rolü var mı?

### Senaryo 2: Yeni Realm Oluşturduysanız

#### A. Client Oluşturun

**Clients > Create client:**

```
General Settings:
  Client type: OpenID Connect
  Client ID: pawcial-frontend-dev

Capability config:
  Client authentication: OFF
  Authorization: OFF
  Authentication flow:
    ☑ Standard flow
    ☑ Direct access grants

Login settings:
  Root URL: http://localhost:5173
  Valid redirect URIs: http://localhost:5173/*
  Valid post logout redirect URIs: http://localhost:5173/*
  Web origins: http://localhost:5173
```

#### B. Realm Roles Oluşturun

**Realm roles > Create role:**

1. Role name: `admin`
2. Role name: `moderator`
3. Role name: `user`
4. Role name: `volunteer`

#### C. Kullanıcılara Rol Atayın

**Users > [Kullanıcı seçin] > Role mapping > Assign role:**

- Admin kullanıcıya: `admin` rolü
- Diğer kullanıcılara: `user` rolü

---

## 🧪 Test Etme

### 1. Tarayıcı Cache'ini Temizleyin

```javascript
// Browser console'da:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. Yeniden Giriş Yapın

1. `http://localhost:5173/login` adresine gidin
2. "Keycloak ile Giriş Yap" butonuna tıklayın
3. Keycloak sizi `pawcial-dev` realm'ine yönlendirmeli
4. URL şöyle olmalı: `https://keycloak.guven.uk/realms/pawcial-dev/protocol/openid-connect/...`

### 3. Console Log'larını Kontrol Edin

Browser console'da:
```javascript
✅ Kullanıcı giriş yaptı: [username]
🔧 Keycloak realm: pawcial-dev
```

### 4. Token'ı İnceleyin

Browser console'da:
```javascript
const token = localStorage.getItem('keycloak-token');
// jwt.io'ya gidip token'ı decode edin
// "iss" field'ı şu olmalı: "https://keycloak.guven.uk/realms/pawcial-dev"
```

---

## 🐛 Sorun Giderme

### Sorun 1: "Realm does not exist"

**Hata:**
```
Keycloak initialization error: Realm does not exist
```

**Çözüm:**
- Keycloak Admin Console'da `pawcial-dev` realm'inin var olduğunu kontrol edin
- Realm isminin doğru yazıldığından emin olun (büyük/küçük harf duyarlı)

### Sorun 2: "Invalid redirect URI"

**Hata:**
```
Invalid parameter: redirect_uri
```

**Çözüm:**
- Keycloak'ta `pawcial-frontend-dev` client'ının "Valid Redirect URIs" kısmını kontrol edin
- `http://localhost:5173/*` eklenmeli

### Sorun 3: Backend Token Kabul Etmiyor

**Hata:**
```
Backend log: Token validation failed: Invalid issuer
```

**Çözüm:**
- Backend `application.properties` dosyasında realm ismini güncelleyin
- Backend'i yeniden başlatın

### Sorun 4: Roller Kayboldu

**Hata:**
- Giriş yapabiliyorsunuz ama admin sekmesi görünmüyor

**Çözüm:**
- Yeni realm'de roller oluşturulmalı
- Kullanıcılara roller atanmalı
- Keycloak Admin Console > Users > [User] > Role mapping

---

## 📋 Checklist

Frontend ve Backend'de realm güncellendikten sonra:

- [ ] Frontend dev server yeniden başlatıldı (`npm run dev`)
- [ ] Backend dev server yeniden başlatıldı (`./mvnw quarkus:dev`)
- [ ] Tarayıcı cache temizlendi (`localStorage.clear()`)
- [ ] Keycloak'ta `pawcial-dev` realm'i mevcut
- [ ] Keycloak'ta `pawcial-frontend-dev` client mevcut
- [ ] Keycloak'ta realm roles mevcut (admin, user, etc.)
- [ ] Test kullanıcısına roller atandı
- [ ] Login sayfasında giriş yapıldı
- [ ] Console'da hata yok
- [ ] Token'da realm ismi doğru (`iss` field)
- [ ] Backend token'ı kabul ediyor
- [ ] Admin rolü olan kullanıcı admin sekmesini görüyor

---

## 🎯 Backend Console Başarılı Log'ları

```
INFO  [io.quarkus.oidc] OIDC server url: https://keycloak.guven.uk/realms/pawcial-dev
INFO  [io.quarkus.oidc] OIDC server is available
DEBUG [io.qu.oi.ru.BearerAuthenticationMechanism] Bearer access token is available
INFO  [your.package.Resource] User authenticated: [username]
```

---

Hazırlayan: AI Assistant
Tarih: 12 Kasım 2025
Realm: pawcial → pawcial-dev

