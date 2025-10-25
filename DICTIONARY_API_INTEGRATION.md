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

Frontend kodu aşağıdaki endpoint yapısını beklemektedir:

### 1. Liste Getir (GET)
```
GET /api/{dictionary-type}
Response: Array<DictionaryItem>
```

**Örnek:**
```
GET /api/domestic-status
Response: [
  { "id": 1, "code": "DOMESTIC", "label": "Evcil" },
  { "id": 2, "code": "WILD", "label": "Yabani" }
]
```

### 2. Yeni Kayıt Ekle (POST)
```
POST /api/{dictionary-type}
Content-Type: application/json
Body: {
  "code": "DOMESTIC",
  "label": "Evcil"
}
Response: DictionaryItem (created item with id)
```

### 3. Kayıt Güncelle (PUT)
```
PUT /api/{dictionary-type}/{id}
Content-Type: application/json
Body: {
  "code": "DOMESTIC",
  "label": "Evcil"
}
Response: DictionaryItem (updated item)
```

### 4. Kayıt Sil (DELETE)
```
DELETE /api/{dictionary-type}/{id}
Response: 204 No Content
```

## Dictionary Type URL Mapping

Frontend'de kullanılan ID'ler ile backend endpoint'leri:

| Frontend ID | Backend Endpoint | Description |
|------------|------------------|-------------|
| `asset-status` | `/api/asset-status` | Varlık Durumu |
| `asset-type` | `/api/asset-type` | Varlık Tipi |
| `color` | `/api/color` | Renk |
| `domestic-status` | `/api/domestic-status` | Evcillik Durumu |
| `dose-route` | `/api/dose-route` | Doz Yolu |
| `event-type` | `/api/event-type` | Etkinlik Tipi |
| `facility-type` | `/api/facility-type` | Tesis Tipi |
| `health-flag` | `/api/health-flag` | Sağlık Durumu |
| `hold-type` | `/api/hold-type` | Bekleme Tipi |
| `med-event-type` | `/api/med-event-type` | Tıbbi Olay Tipi |
| `observation-category` | `/api/observation-category` | Gözlem Kategorisi |
| `outcome-type` | `/api/outcome-type` | Sonuç Tipi |
| `placement-status` | `/api/placement-status` | Yerleştirme Durumu |
| `placement-type` | `/api/placement-type` | Yerleştirme Tipi |
| `service-type` | `/api/service-type` | Hizmet Tipi |
| `sex` | `/api/sex` | Cinsiyet |
| `size` | `/api/size` | Boyut |
| `source-type` | `/api/source-type` | Kaynak Tipi |
| `temperament` | `/api/temperament` | Mizaç |
| `training-level` | `/api/training-level` | Eğitim Seviyesi |
| `unit-type` | `/api/unit-type` | Birim Tipi |
| `vaccine` | `/api/vaccine` | Aşı |
| `volunteer-area` | `/api/volunteer-area-dictionary` | Gönüllü Bölgesi |
| `volunteer-status` | `/api/volunteer-status` | Gönüllü Durumu |
| `zone-purpose` | `/api/zone-purpose` | Bölge Amacı |

## Kod Dosyaları

### Frontend
- **Component:** `/src/pages/DictionaryManagement.jsx`
- **API Helper:** `/src/api/dictionary.js`
- **Routing:** `/src/pages/Admin.jsx`

### Backend Entegrasyonu Gereken İşlemler

1. **CORS Ayarları:** Backend'de `http://localhost:5173` origin'ine izin verilmeli
2. **Endpoint'ler:** Yukarıdaki tabloda belirtilen tüm endpoint'ler oluşturulmalı
3. **Response Format:** JSON formatında dönen response'lar `id`, `code`, `label` alanlarını içermeli
4. **Error Handling:** HTTP status kodları doğru şekilde kullanılmalı (200, 201, 204, 400, 404, 500)

## Kullanım

1. Admin paneline giriş: `http://localhost:5173/admin`
2. Sol menüden "Sözlük Tabloları" seçeneğine tıklayın
3. 25 dictionary'den birini seçin
4. CRUD işlemlerini gerçekleştirin:
   - **Create:** "+ Yeni Ekle" butonu
   - **Read:** Tablo otomatik olarak yüklenir
   - **Update:** Satırdaki ✏️ butonuna tıklayın
   - **Delete:** Satırdaki 🗑️ butonuna tıklayın

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
# List
curl http://localhost:8000/api/domestic-status

# Create
curl -X POST http://localhost:8000/api/domestic-status \
  -H "Content-Type: application/json" \
  -d '{"code":"DOMESTIC","label":"Evcil"}'

# Update
curl -X PUT http://localhost:8000/api/domestic-status/1 \
  -H "Content-Type: application/json" \
  -d '{"code":"DOMESTIC","label":"Evcil Hayvan"}'

# Delete
curl -X DELETE http://localhost:8000/api/domestic-status/1
```

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

