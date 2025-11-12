# 🔐 Keycloak Admin Rolü Atama Rehberi

## 📋 Admin Rolü Atama Adımları

### 1. Keycloak Admin Console'a Giriş

`https://keycloak.guven.uk/admin` adresine gidin ve admin hesabıyla giriş yapın.

### 2. Realm'i Seçin

Sol üstte **pawcial** realm'inin seçili olduğundan emin olun.

### 3. Realm Roles Kontrolü

1. Sol menüden **Realm roles** seçeneğine tıklayın
2. **admin** rolünün olduğunu kontrol edin
3. Yoksa:
   - **Create role** butonuna tıklayın
   - **Role name:** `admin` yazın
   - **Description:** `Administrator role with full access`
   - **Save** butonuna tıklayın

### 4. Kullanıcıya Admin Rolü Atama

#### Yöntem 1: Kullanıcı Üzerinden

1. Sol menüden **Users** seçeneğine tıklayın
2. Admin yapmak istediğiniz kullanıcıyı bulun (email veya username ile arayabilirsiniz)
3. Kullanıcıya tıklayın
4. **Role mapping** tab'ına gidin
5. **Assign role** butonuna tıklayın
6. **Filter by realm roles** seçeneğini seçin
7. **admin** rolünü bulun ve seçin
8. **Assign** butonuna tıklayın

#### Yöntem 2: Role Üzerinden

1. Sol menüden **Realm roles** seçeneğine tıklayın
2. **admin** rolüne tıklayın
3. **Users in role** tab'ına gidin
4. **Add users** butonuna tıklayın
5. Kullanıcıları seçin
6. **Add** butonuna tıklayın

### 5. Test Etme

1. Kullanıcı hesabından çıkış yapın
2. Tekrar giriş yapın
3. Ana sayfada header'da **ADMIN** badge'i görünmeli
4. Navigation'da **⚙️ Admin** sekmesi görünmeli

---

## 🔍 Rol Kontrolü

### Browser Console'da Test

```javascript
// Browser console'da şunu çalıştırın:
import { useKeycloak } from './providers/KeycloakProvider';
const { hasRole, userInfo } = useKeycloak();

console.log('Admin mi?', hasRole('admin'));
console.log('Kullanıcı bilgileri:', userInfo);
```

### Keycloak Token'ı İnceleme

1. `https://jwt.io` adresine gidin
2. Browser console'da: `localStorage.getItem('keycloak-token')` komutunu çalıştırın
3. Token'ı kopyalayın
4. jwt.io'ya yapıştırın
5. **Payload** kısmında `realm_access.roles` dizisinde `admin` olmalı

---

## 🎯 Rol Yapısı

### Realm Roles (Önerilen)

Frontend'de `hasRole('admin')` şu şekilde kontrol eder:

```javascript
keycloak.hasRealmRole('admin')
```

Token'da şu şekilde görünür:

```json
{
  "realm_access": {
    "roles": ["admin", "user", "offline_access", "uma_authorization"]
  }
}
```

### Client Roles (Alternatif)

Eğer client-specific roller kullanmak isterseniz:

1. **Clients** > **pawcial-frontend-dev** > **Roles** > **Create role**
2. `admin` rolünü oluşturun
3. Kullanıcılara atayın

Frontend'de kullanım:

```javascript
// KeycloakProvider.jsx'de hasRole fonksiyonunu güncelleyin:
const hasRole = (role) => {
  return keycloak.hasRealmRole(role) || keycloak.hasResourceRole(role, 'pawcial-frontend-dev');
};
```

---

## 🛠️ Sorun Giderme

### Sorun 1: Admin sekmesi görünmüyor

**Çözüm:**
1. Browser console'u açın
2. `localStorage.clear()` çalıştırın
3. Sayfayı yenileyin ve tekrar giriş yapın
4. Token'ın yenilendiğinden emin olun

### Sorun 2: hasRole('admin') false döndürüyor

**Kontrol Listesi:**
- ✅ Keycloak'ta `admin` rolü oluşturuldu mu?
- ✅ Kullanıcıya `admin` rolü atandı mı?
- ✅ Kullanıcı çıkış yapıp tekrar giriş yaptı mı?
- ✅ Token yenilendi mi? (`localStorage.getItem('keycloak-token')`)

**Test:**
```javascript
// Browser console'da:
console.log('Keycloak token:', localStorage.getItem('keycloak-token'));
console.log('Authenticated:', keycloak.authenticated);
console.log('Realm roles:', keycloak.realmAccess?.roles);
```

### Sorun 3: Token'da admin rolü var ama frontend görmüyor

**Çözüm:**
1. KeycloakProvider'da `hasRole` fonksiyonunu kontrol edin:
```javascript
const hasRole = (role) => {
  console.log('Checking role:', role);
  console.log('User roles:', keycloak.realmAccess?.roles);
  return keycloak.hasRealmRole(role);
};
```
2. Console log'larını inceleyin

---

## 📚 Diğer Roller

Projenize başka roller de ekleyebilirsiniz:

### Moderator Rolü

```javascript
// KeycloakProvider'da:
const isModerator = hasAnyRole(['admin', 'moderator']);

// App.jsx'de:
{isModerator && (
  <Link to="/moderation">Moderasyon</Link>
)}
```

### Volunteer Rolü

```javascript
{hasRole('volunteer') && (
  <Link to="/volunteer-dashboard">Gönüllü Paneli</Link>
)}
```

### Multiple Roles Check

```javascript
// Admin veya Moderator
const canManageContent = hasAnyRole(['admin', 'moderator']);

// App.jsx'de:
{canManageContent && (
  <Link to="/content-management">İçerik Yönetimi</Link>
)}
```

---

## 🎨 UI Önerileri

### Role-based Badge'ler

```jsx
{hasRole('admin') && <span className="badge-admin">ADMIN</span>}
{hasRole('moderator') && <span className="badge-moderator">MODERATOR</span>}
{hasRole('volunteer') && <span className="badge-volunteer">GÖNÜLLÜ</span>}
```

### Role-based Navigation

```jsx
<nav>
  {/* Herkes için */}
  <Link to="/">Ana Sayfa</Link>
  
  {/* Giriş yapmış kullanıcılar için */}
  {authenticated && (
    <Link to="/profile">Profilim</Link>
  )}
  
  {/* Admin için */}
  {hasRole('admin') && (
    <Link to="/admin">Admin Paneli</Link>
  )}
  
  {/* Admin veya Moderator için */}
  {hasAnyRole(['admin', 'moderator']) && (
    <Link to="/moderation">Moderasyon</Link>
  )}
</nav>
```

---

## ✅ Başarılı Kurulum Kontrolü

Admin rolü başarıyla atandıysa:

1. ✅ Kullanıcı giriş yaptığında header'da **ADMIN** badge'i görünür
2. ✅ Navigation'da **⚙️ Admin** sekmesi görünür
3. ✅ `/admin` sayfasına erişebilir
4. ✅ Console'da: `hasRole('admin')` true döner

---

## 📞 Destek

Sorun yaşarsanız:
1. Browser console log'larını kontrol edin
2. Keycloak Admin Console'da kullanıcının rollerini kontrol edin
3. JWT token'ı jwt.io'da inceleyin
4. Token'ı yenilemek için çıkış yapıp tekrar giriş yapın

Hazırlayan: AI Assistant
Tarih: 12 Kasım 2025

