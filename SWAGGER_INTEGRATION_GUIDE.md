# Swagger/OpenAPI Integration Guide

## 📋 Genel Bakış

Bundan sonra tüm backend entegrasyonları için **Swagger UI** kullanılacaktır.

**Swagger UI URL:** http://localhost:8000/swagger-ui/

## 🎯 Neden Swagger/OpenAPI?

1. ✅ **Güncel Dokümantasyon**: Backend'deki her değişiklik otomatik olarak Swagger'da görünür
2. ✅ **Doğru Request/Response Formatları**: DTO'lar ve şemalar net bir şekilde görünür
3. ✅ **Kolay Test**: Swagger UI üzerinden direkt test yapılabilir
4. ✅ **Hata Azaltma**: Manuel dokümantasyon hatalarını önler
5. ✅ **Standart**: OpenAPI 3.0 standardı kullanılır

## 🔧 Swagger UI Kullanımı

### 1. Swagger UI'a Erişim
```bash
# Browser'da aç
open http://localhost:8000/swagger-ui/

# Veya direkt:
http://localhost:8000/swagger-ui/
```

### 2. Endpoint Kategorileri

Swagger UI'da göreceğiniz ana kategoriler:

- **Dictionary Endpoints**: 
  - Colors, Sizes, Sexes, Temperaments, vs.
  - GET, POST, PUT, PATCH operations
  
- **Animal Endpoints**: 
  - Animal CRUD operations
  - Animal-Breed compositions
  - Animal events, observations
  
- **Person & Volunteer Endpoints**:
  - Person management
  - Volunteer activities
  - Core volunteer areas
  
- **Other Entities**:
  - Breeds
  - Species
  - Facility Units

### 3. Endpoint'i Test Etme

1. Swagger UI'da endpoint'e tıklayın
2. **"Try it out"** butonuna basın
3. Gerekli parametreleri doldurun
4. **"Execute"** butonuna basın
5. Response'u görüntüleyin

### 4. Request Schema'sını Görme

Her endpoint için:
- **Parameters**: URL parametreleri, query params
- **Request body**: JSON şeması ve örnek
- **Responses**: Olası response'lar ve şemaları
  - 200: Başarılı
  - 201: Created
  - 400: Bad Request
  - 404: Not Found
  - 500: Internal Server Error

## 📝 Frontend Entegrasyon Süreci

### Adım 1: Swagger'da Endpoint'i İncele

```
1. http://localhost:8000/swagger-ui/ adresine git
2. İlgili endpoint'i bul (örn: POST /api/animals)
3. Schema'sını incele:
   - Request DTO nedir?
   - Response DTO nedir?
   - Zorunlu alanlar neler?
   - Data type'lar neler?
```

### Adım 2: API Helper Fonksiyonu Oluştur

```javascript
// src/api/{entity}.js
export async function createAnimal(data) {
  const response = await fetch('http://localhost:8000/api/animals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HTTP ${response.status}: ${error}`)
  }
  
  return await response.json()
}
```

### Adım 3: Test Et

1. Swagger UI'da test et
2. Frontend'de test et
3. Error handling'i kontrol et

## 🔍 Örnek: Dictionary Endpoint Analizi

### GET /api/colors

**Swagger'da görünen bilgiler:**

```yaml
GET /api/colors
Parameters:
  - all: boolean (query, optional, default: false)
Responses:
  200:
    description: OK
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: '#/components/schemas/ColorDto'

ColorDto:
  type: object
  properties:
    code: string
    label: string
```

**Frontend implementation:**

```javascript
export async function getColors(all = false) {
  const url = `http://localhost:8000/api/colors${all ? '?all=true' : ''}`
  const response = await fetch(url)
  return await response.json()
}
```

## 🎨 Örnek: Animal Endpoint (Kompleks)

### POST /api/animals

**Swagger'da görünen:**

```yaml
POST /api/animals
Request Body:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/CreateAnimalRequest'

CreateAnimalRequest:
  type: object
  required:
    - name
    - speciesId
    - sexCode
  properties:
    name: string
    speciesId: integer (int64)
    sexCode: string
    dateOfBirth: string (date)
    colorCodes: array of string
    # ... diğer alanlar
```

**Frontend implementation:**

```javascript
export async function createAnimal(animalData) {
  // Swagger'daki schema'ya uygun şekilde
  const payload = {
    name: animalData.name,
    speciesId: parseInt(animalData.speciesId),
    sexCode: animalData.sexCode,
    dateOfBirth: animalData.dateOfBirth, // ISO format
    colorCodes: animalData.colorCodes || [],
    // ... diğer alanlar
  }
  
  const response = await fetch('http://localhost:8000/api/animals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  
  if (!response.ok) {
    throw new Error(`Failed to create animal: ${response.status}`)
  }
  
  return await response.json()
}
```

## 📊 Mevcut Entegrasyonlar

### ✅ Tamamlanan

1. **Dictionary Management** (25 tablo)
   - GET /api/{dictionary-types}
   - POST /api/{dictionary-types}
   - PUT /api/{dictionary-types}/{code}
   - PATCH /api/{dictionary-types}/{code}/toggle

### 🚧 Planlanan

2. **Animal Management**
   - CRUD operations
   - Animal-Breed relationships
   - Animal events & observations

3. **Person & Volunteer Management**
   - Person CRUD
   - Volunteer activities
   - Volunteer area assignments

4. **Breed & Species Management**
   - Species list
   - Breed management

## 🛠️ Best Practices

### 1. Schema Validation

Swagger'daki schema'lara göre frontend'de de validation yapın:

```javascript
function validateAnimalData(data) {
  if (!data.name) throw new Error('Name is required')
  if (!data.speciesId) throw new Error('Species is required')
  if (!data.sexCode) throw new Error('Sex is required')
  // ... diğer validationlar
}
```

### 2. Type Safety (TypeScript kullanıyorsanız)

Swagger'dan otomatik type generation yapılabilir:

```typescript
interface ColorDto {
  code: string
  label: string
}

interface CreateAnimalRequest {
  name: string
  speciesId: number
  sexCode: string
  dateOfBirth?: string
  colorCodes?: string[]
  // ...
}
```

### 3. Error Handling

Swagger'daki response codes'a göre:

```javascript
async function apiCall() {
  try {
    const response = await fetch(url, options)
    
    if (response.status === 400) {
      // Bad Request - validation error
      const error = await response.json()
      alert(`Validation error: ${error.message}`)
    } else if (response.status === 404) {
      // Not Found
      alert('Resource not found')
    } else if (response.status === 500) {
      // Server Error
      alert('Server error, please try again')
    } else if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
```

## 📚 Kaynaklar

- **Swagger UI**: http://localhost:8000/swagger-ui/
- **OpenAPI Spec**: http://localhost:8000/q/openapi (JSON format)
- **Dev UI**: http://localhost:8000/q/dev-ui

## 🎯 Sonraki Adımlar

1. ✅ Dictionary Management tamamlandı
2. 🔜 Animal Management entegrasyonu
3. 🔜 Person/Volunteer Management entegrasyonu
4. 🔜 Breed/Species Management entegrasyonu

---

**NOT**: Swagger UI her zaman güncel bilgiyi gösterir. Herhangi bir backend değişikliğinden sonra mutlaka Swagger'ı kontrol edin!

