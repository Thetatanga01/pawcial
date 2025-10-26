import { useState, useEffect } from 'react'
import { 
  getDictionaryItems, 
  createDictionaryItem,
  updateDictionaryItem,
  deleteDictionaryItem 
} from '../api/dictionary.js'

// Dictionary configurations
// supportsUpdate: Backend'de PUT endpoint'i var mı? (Swagger'dan kontrol edildi - 2025-10-25)
// ✅ Tüm dictionary'ler artık PUT endpoint'i destekliyor!
const DICTIONARIES = [
  { id: 'asset-status', name: 'AssetStatus', label: 'Varlık Durumu', icon: '📦', supportsUpdate: true },
  { id: 'asset-type', name: 'AssetType', label: 'Varlık Tipi', icon: '🏷️', supportsUpdate: true },
  { id: 'color', name: 'Color', label: 'Renk', icon: '🎨', supportsUpdate: true },
  { id: 'domestic-status', name: 'DomesticStatus', label: 'Evcillik Durumu', icon: '🏠', supportsUpdate: true },
  { id: 'dose-route', name: 'DoseRoute', label: 'Doz Yolu', icon: '💉', supportsUpdate: true },
  { id: 'event-type', name: 'EventType', label: 'Etkinlik Tipi', icon: '📅', supportsUpdate: true },
  { id: 'facility-type', name: 'FacilityType', label: 'Tesis Tipi', icon: '🏢', supportsUpdate: true },
  { id: 'health-flag', name: 'HealthFlag', label: 'Sağlık Durumu', icon: '🏥', supportsUpdate: true },
  { id: 'hold-type', name: 'HoldType', label: 'Bekleme Tipi', icon: '⏸️', supportsUpdate: true },
  { id: 'med-event-type', name: 'MedEventType', label: 'Tıbbi Olay Tipi', icon: '🩺', supportsUpdate: true },
  { id: 'observation-category', name: 'ObservationCategory', label: 'Gözlem Kategorisi', icon: '👁️', supportsUpdate: true },
  { id: 'outcome-type', name: 'OutcomeType', label: 'Sonuç Tipi', icon: '🎯', supportsUpdate: true },
  { id: 'placement-status', name: 'PlacementStatus', label: 'Yerleştirme Durumu', icon: '📍', supportsUpdate: true },
  { id: 'placement-type', name: 'PlacementType', label: 'Yerleştirme Tipi', icon: '🏡', supportsUpdate: true },
  { id: 'service-type', name: 'ServiceType', label: 'Hizmet Tipi', icon: '🔧', supportsUpdate: true },
  { id: 'sex', name: 'Sex', label: 'Cinsiyet', icon: '⚧️', supportsUpdate: true },
  { id: 'size', name: 'Size', label: 'Boyut', icon: '📏', supportsUpdate: true },
  { id: 'source-type', name: 'SourceType', label: 'Kaynak Tipi', icon: '📥', supportsUpdate: true },
  { id: 'temperament', name: 'Temperament', label: 'Mizaç', icon: '😊', supportsUpdate: true },
  { id: 'training-level', name: 'TrainingLevel', label: 'Eğitim Seviyesi', icon: '🎓', supportsUpdate: true },
  { id: 'unit-type', name: 'UnitType', label: 'Birim Tipi', icon: '📊', supportsUpdate: true },
  { id: 'vaccine', name: 'Vaccine', label: 'Aşı', icon: '💊', supportsUpdate: true },
  { id: 'volunteer-area', name: 'VolunteerAreaDictionary', label: 'Gönüllü Bölgesi', icon: '🗺️', supportsUpdate: true },
  { id: 'volunteer-status', name: 'VolunteerStatus', label: 'Gönüllü Durumu', icon: '👋', supportsUpdate: true },
  { id: 'zone-purpose', name: 'ZonePurpose', label: 'Bölge Amacı', icon: '🌍', supportsUpdate: true }
]

export default function DictionaryManagement() {
  const [selectedDictionary, setSelectedDictionary] = useState(DICTIONARIES[0])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ code: '', label: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)

  // Notification gösterme fonksiyonu
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    loadDictionaryItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDictionary.id])

  const loadDictionaryItems = async () => {
    setLoading(true)
    try {
      // Backend API entegrasyonu
      const data = await getDictionaryItems(selectedDictionary.id)
      console.log('Loaded dictionary items:', data)
      // Backend'den gelen data'da id yok, code'u id olarak kullanıyoruz
      const itemsWithId = data.map(item => ({ ...item, id: item.code }))
      setItems(itemsWithId)
    } catch (error) {
      console.error('Error loading dictionary items:', error)
      showNotification('Veri yüklenirken hata oluştu. Backend sunucusunun çalıştığından emin olun.', 'error')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingItem(null)
    setFormData({ code: '', label: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({ code: item.code, label: item.label })
    setIsModalOpen(true)
  }

  const handleToggle = async (item) => {
    if (!confirm(`"${item.label}" kaydını deaktive etmek istediğinizden emin misiniz? (Tekrar aktif etmek için backend'e erişim gerekir)`)) return
    
    try {
      // Backend API entegrasyonu - Toggle (soft delete)
      await deleteDictionaryItem(selectedDictionary.id, item.code)
      setItems(items.filter(i => i.code !== item.code))
      showNotification('Kayıt başarıyla deaktive edildi!', 'success')
    } catch (error) {
      console.error('Error toggling item:', error)
      showNotification('İşlem başarısız: ' + error.message, 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingItem) {
        // Backend API entegrasyonu - Update (sadece label)
        await updateDictionaryItem(selectedDictionary.id, editingItem.code, { label: formData.label })
        showNotification('Kayıt başarıyla güncellendi!', 'success')
      } else {
        // Backend API entegrasyonu - Create
        await createDictionaryItem(selectedDictionary.id, formData)
        showNotification('Kayıt başarıyla eklendi!', 'success')
      }
      
      setIsModalOpen(false)
      setEditingItem(null)
      setFormData({ code: '', label: '' })
      
      // Listeyi yenile
      await loadDictionaryItems()
    } catch (error) {
      console.error('Error saving item:', error)
      showNotification('Kayıt işlemi başarısız: ' + error.message, 'error')
    }
  }

  const filteredItems = items.filter(item =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="dictionary-management">
      <div className="dictionary-sidebar">
        <div className="dictionary-sidebar-header">
          <h3>Sözlük Tabloları</h3>
          <span className="dictionary-count">{DICTIONARIES.length}</span>
        </div>
        <div className="dictionary-list">
          {DICTIONARIES.map((dict) => (
            <button
              key={dict.id}
              className={`dictionary-item ${selectedDictionary.id === dict.id ? 'active' : ''}`}
              onClick={() => setSelectedDictionary(dict)}
            >
              <span className="dictionary-icon">{dict.icon}</span>
              <span className="dictionary-label">{dict.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dictionary-content">
        <div className="dictionary-header">
          <div className="dictionary-title-section">
            <h2>
              <span className="dictionary-icon-large">{selectedDictionary.icon}</span>
              {selectedDictionary.label}
            </h2>
            <p className="dictionary-subtitle">
              {selectedDictionary.name} tablosunu yönetin
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            + Yeni Ekle
          </button>
        </div>

        <div className="dictionary-toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Kod veya etiket ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="toolbar-info">
            <span className="item-count">{filteredItems.length} kayıt</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Yükleniyor...</p>
          </div>
        ) : (
          <div className="dictionary-table-container">
            <table className="dictionary-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>ID</th>
                  <th style={{ width: '30%' }}>Kod</th>
                  <th style={{ width: '50%' }}>Etiket</th>
                  <th style={{ width: '120px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz kayıt yok'}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item.code}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="code-badge">{item.code}</span>
                      </td>
                      <td>{item.label}</td>
                      <td>
                        <div className="action-buttons">
                          {selectedDictionary.supportsUpdate && (
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(item)}
                              title="Düzenle"
                            >
                              ✏️
                            </button>
                          )}
                          <button
                            className="action-btn delete"
                            onClick={() => handleToggle(item)}
                            title="Deaktive Et"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay-dict">
          <div className="modal-dict">
            <div className="modal-dict-header">
              <h3>{editingItem ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-dict-body">
              <div className="form-group-dict">
                <label htmlFor="code">Kod *</label>
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="Örn: FRIENDLY"
                  className="form-input-dict"
                  disabled={!!editingItem}
                  style={editingItem ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                />
                <small className="form-hint">
                  {editingItem 
                    ? 'Kod değiştirilemez (sadece etiket güncellenebilir)' 
                    : 'Büyük harfle, alt çizgi ile yazın (örn: FRIENDLY, LAP_LOVER)'}
                </small>
              </div>
              <div className="form-group-dict">
                <label htmlFor="label">Etiket *</label>
                <input
                  type="text"
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                  placeholder="Örn: Aktif"
                  className="form-input-dict"
                />
                <small className="form-hint">Kullanıcı dostu açıklama</small>
              </div>
              <div className="modal-dict-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'success' ? '✓' : '✕'}
            </span>
            <span className="notification-message">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}

