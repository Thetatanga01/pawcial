# Dictionary Management - Backend API Entegrasyonu

## Genel Bakış

Admin panelinde tüm dictionary/lookup table'ları yönetmek için bir sistem oluşturuldu. Bu sistem 25 farklı dictionary tablosunu yönetebilmektedir.

## Dictionary Listesi

1. **AssetStatus** - Varlık Durumu
2. **AssetType** - Varlık Tipi
3. **Color** - Renk
4. **DomesticStatus** - Evcillik Durumu
5. **DoseRoute** - Doz Yolu
6. **EventType** - Etkinlik Tipi
7. **FacilityType** - Tesis Tipi
8. **HealthFlag** - Sağlık Durumu
9. **HoldType** - Bekleme Tipi
10. **MedEventType** - Tıbbi Olay Tipi
11. **ObservationCategory** - Gözlem Kategorisi
12. **OutcomeType** - Sonuç Tipi
13. **PlacementStatus** - Yerleştirme Durumu
14. **PlacementType** - Yerleştirme Tipi
15. **ServiceType** - Hizmet Tipi
16. **Sex** - Cinsiyet
17. **Size** - Boyut
18. **SourceType** - Kaynak Tipi
19. **Temperament** - Mizaç
20. **TrainingLevel** - Eğitim Seviyesi
21. **UnitType** - Birim Tipi
22. **Vaccine** - Aşı
23. **VolunteerAreaDictionary** - Gönüllü Bölgesi
24. **VolunteerStatus** - Gönüllü Durumu
25. **ZonePurpose** - Bölge Amacı

## Data Model

Her dictionary kaydı aşağıdaki yapıya sahiptir:

```kotlin
data class CreateDomesticStatusRequest(
    val code: String,    // Örn: "ACTIVE", "DOMESTIC", "WILD"
    val label: String    // Örn: "Aktif", "Evcil", "Yabani"
)
```

## Backend API Endpoint'leri

Backend **GERÇEK** endpoint yapısı:

### 1. Liste Getir (GET)
```
GET /api/{dictionary-types}  ← plural (çoğul)
Response: Array<DictionaryItem>
```

**Örnek:**
```
GET /api/domestic-statuses
Response: [
  { "code": "DOMESTICATED", "label": "Evcil" },
  { "code": "WILD", "label": "Yabani" }
]
```

**NOT:** Response'da `id` alanı YOK. Code alanı unique identifier olarak kullanılıyor.

### 2. Yeni Kayıt Ekle (POST)
```
POST /api/{dictionary-types}
Content-Type: application/json
Body: {
  "code": "DOMESTIC",
  "label": "Evcil"
}
Response: 204 No Content (veya created item)
```

### 3. Kayıt Güncelle (PUT) - ✅ YENİ!
```
PUT /api/{dictionary-types}/{code}
Content-Type: application/json
Body: {
  "label": "Yeni Etiket"
}
Response: 200 OK
{
  "code": "WHITE",
  "label": "Yeni Etiket"
}
```

**NOT:** Sadece **label** güncellenebilir. Code immutable (değiştirilemez).

### 4. Toggle - Aktif/Pasif (PATCH)
```
PATCH /api/{dictionary-types}/{code}/toggle
Response: 204 No Content
```

**NOT:** Toggle işlemi soft delete yapıyor - GET sadece aktif kayıtları döndürüyor.

## Dictionary Type URL Mapping

Frontend'de kullanılan ID'ler ile backend endpoint'leri:

| Frontend ID | Backend Endpoint (Plural) | Description |
|------------|---------------------------|-------------|
| `asset-status` | `/api/asset-statuses` | Varlık Durumu |
| `asset-type` | `/api/asset-types` | Varlık Tipi |
| `color` | `/api/colors` | Renk |
| `domestic-status` | `/api/domestic-statuses` | Evcillik Durumu |
| `dose-route` | `/api/dose-routes` | Doz Yolu |
| `event-type` | `/api/event-types` | Etkinlik Tipi |
| `facility-type` | `/api/facility-types` | Tesis Tipi |
| `health-flag` | `/api/health-flags` | Sağlık Durumu |
| `hold-type` | `/api/hold-types` | Bekleme Tipi |
| `med-event-type` | `/api/med-event-types` | Tıbbi Olay Tipi |
| `observation-category` | `/api/observation-categories` | Gözlem Kategorisi |
| `outcome-type` | `/api/outcome-types` | Sonuç Tipi |
| `placement-status` | `/api/placement-statuses` | Yerleştirme Durumu |
| `placement-type` | `/api/placement-types` | Yerleştirme Tipi |
| `service-type` | `/api/service-types` | Hizmet Tipi |
| `sex` | `/api/sexes` | Cinsiyet |
| `size` | `/api/sizes` | Boyut |
| `source-type` | `/api/source-types` | Kaynak Tipi |
| `temperament` | `/api/temperaments` | Mizaç |
| `training-level` | `/api/training-levels` | Eğitim Seviyesi |
| `unit-type` | `/api/unit-types` | Birim Tipi |
| `vaccine` | `/api/vaccines` | Aşı |
| `volunteer-area` | `/api/volunteer-area-dictionaries` | Gönüllü Bölgesi |
| `volunteer-status` | `/api/volunteer-statuses` | Gönüllü Durumu |
| `zone-purpose` | `/api/zone-purposes` | Bölge Amacı |

## Kod Dosyaları

### Frontend
- **Component:** `/src/pages/DictionaryManagement.jsx`
- **API Helper:** `/src/api/dictionary.js`
- **Routing:** `/src/pages/Admin.jsx`

### Backend Entegrasyonu Gereken İşlemler

1. **CORS Ayarları:** Backend'de `http://localhost:5173` origin'ine izin verilmeli ✅
2. **Endpoint'ler:** Yukarıdaki tabloda belirtilen tüm endpoint'ler mevcut ✅
3. **Response Format:** JSON formatında sadece `code` ve `label` alanları var (`id` YOK) ✅
4. **Error Handling:** HTTP status kodları doğru şekilde kullanılmalı (200, 204, 400, 404, 500) ✅
5. **Soft Delete:** Toggle endpoint'i ile soft delete pattern implement edilmiş ✅

## Kullanım

1. Admin paneline giriş: `http://localhost:5173/admin`
2. Sol menüden "Sözlük Tabloları" seçeneğine tıklayın
3. 25 dictionary'den birini seçin
4. CRUD işlemlerini gerçekleştirin:
   - **Create:** "+ Yeni Ekle" butonu ile yeni kayıt ekleyin
   - **Read:** Tablo otomatik olarak yüklenir (sadece aktif kayıtlar)
   - **Update:** ✏️ butonuna tıklayarak label'ı düzenleyin ✅ (Kod değiştirilemez)
   - **Toggle/Delete:** 🗑️ butonuna tıklayarak deaktive edin (soft delete)

## Mock Data

Backend henüz hazır değilse, sistem otomatik olarak mock data gösterir:
- ACTIVE - Aktif
- INACTIVE - Pasif
- PENDING - Beklemede

## Önemli Notlar

1. **Validation:** Code alanı genellikle büyük harf ve alt çizgi içermeli (örn: `DOMESTIC_CAT`)
2. **Unique Constraint:** Her dictionary içinde code alanı unique olmalı
3. **İlişkisel Bağımlılıklar:** Dictionary kayıtlarının silinmesi diğer tablolardaki kayıtları etkileyebilir
4. **Cache:** Dictionary verileri sık değişmediği için cache mekanizması eklenebilir

## Test Senaryoları

### 1. Başarılı İşlemler
```bash
# List (sadece aktif kayıtlar)
curl http://localhost:8000/api/domestic-statuses

# Create
curl -X POST http://localhost:8000/api/domestic-statuses \
  -H "Content-Type: application/json" \
  -d '{"code":"SEMI_WILD","label":"Yarı Vahşi"}'

# Update (sadece label) - ✅ YENİ!
curl -X PUT http://localhost:8000/api/domestic-statuses/DOMESTICATED \
  -H "Content-Type: application/json" \
  -d '{"label":"Evcil (Updated)"}'

# Toggle (soft delete / reactivate)
curl -X PATCH http://localhost:8000/api/domestic-statuses/DOMESTICATED/toggle
```

**NOT:** 
- ✅ PUT endpoint'i eklendi - sadece **label** güncellenebilir
- Code alanı immutable (değiştirilemez)
- Toggle ile soft delete yapılıyor

### 2. Hata Senaryoları
- Duplicate code
- Invalid ID
- Missing required fields
- Foreign key constraint violations

## Güvenlik

- Admin paneline erişim sadece yetkili kullanıcılar için olmalı
- JWT veya session-based authentication kullanılmalı
- CSRF koruması eklenmeliçin backend'de token mekanizması olmalı
- Input validation her zaman backend'de yapılmalı

## Gelecek Geliştirmeler

1. Bulk import/export (Excel, CSV)
2. Audit log (kim, ne zaman, ne değiştirdi)
3. Soft delete (silme yerine deaktif etme)
4. Sıralama ve sayfalama
5. İlişkili kayıt sayısını gösterme (X yerde kullanılıyor)
6. Çoklu dil desteği (label_en, label_tr)

