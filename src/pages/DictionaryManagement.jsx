import { useState, useEffect } from 'react'
import { 
  getDictionaryItems, 
  createDictionaryItem, 
  updateDictionaryItem, 
  deleteDictionaryItem 
} from '../api/dictionary.js'

const DICTIONARIES = [
  { id: 'asset-status', name: 'AssetStatus', label: 'Varlık Durumu', icon: '📦' },
  { id: 'asset-type', name: 'AssetType', label: 'Varlık Tipi', icon: '🏷️' },
  { id: 'color', name: 'Color', label: 'Renk', icon: '🎨' },
  { id: 'domestic-status', name: 'DomesticStatus', label: 'Evcillik Durumu', icon: '🏠' },
  { id: 'dose-route', name: 'DoseRoute', label: 'Doz Yolu', icon: '💉' },
  { id: 'event-type', name: 'EventType', label: 'Etkinlik Tipi', icon: '📅' },
  { id: 'facility-type', name: 'FacilityType', label: 'Tesis Tipi', icon: '🏢' },
  { id: 'health-flag', name: 'HealthFlag', label: 'Sağlık Durumu', icon: '🏥' },
  { id: 'hold-type', name: 'HoldType', label: 'Bekleme Tipi', icon: '⏸️' },
  { id: 'med-event-type', name: 'MedEventType', label: 'Tıbbi Olay Tipi', icon: '🩺' },
  { id: 'observation-category', name: 'ObservationCategory', label: 'Gözlem Kategorisi', icon: '👁️' },
  { id: 'outcome-type', name: 'OutcomeType', label: 'Sonuç Tipi', icon: '🎯' },
  { id: 'placement-status', name: 'PlacementStatus', label: 'Yerleştirme Durumu', icon: '📍' },
  { id: 'placement-type', name: 'PlacementType', label: 'Yerleştirme Tipi', icon: '🏡' },
  { id: 'service-type', name: 'ServiceType', label: 'Hizmet Tipi', icon: '🔧' },
  { id: 'sex', name: 'Sex', label: 'Cinsiyet', icon: '⚧️' },
  { id: 'size', name: 'Size', label: 'Boyut', icon: '📏' },
  { id: 'source-type', name: 'SourceType', label: 'Kaynak Tipi', icon: '📥' },
  { id: 'temperament', name: 'Temperament', label: 'Mizaç', icon: '😊' },
  { id: 'training-level', name: 'TrainingLevel', label: 'Eğitim Seviyesi', icon: '🎓' },
  { id: 'unit-type', name: 'UnitType', label: 'Birim Tipi', icon: '📊' },
  { id: 'vaccine', name: 'Vaccine', label: 'Aşı', icon: '💊' },
  { id: 'volunteer-area', name: 'VolunteerAreaDictionary', label: 'Gönüllü Bölgesi', icon: '🗺️' },
  { id: 'volunteer-status', name: 'VolunteerStatus', label: 'Gönüllü Durumu', icon: '👋' },
  { id: 'zone-purpose', name: 'ZonePurpose', label: 'Bölge Amacı', icon: '🌍' }
]

export default function DictionaryManagement() {
  const [selectedDictionary, setSelectedDictionary] = useState(DICTIONARIES[0])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ code: '', label: '' })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadDictionaryItems()
  }, [selectedDictionary])

  const loadDictionaryItems = async () => {
    setLoading(true)
    try {
      // Backend API entegrasyonu
      const data = await getDictionaryItems(selectedDictionary.id)
      setItems(data)
    } catch (error) {
      console.error('Error loading dictionary items:', error)
      // Hata durumunda mock data göster
      setItems([
        { id: 1, code: 'ACTIVE', label: 'Aktif' },
        { id: 2, code: 'INACTIVE', label: 'Pasif' },
        { id: 3, code: 'PENDING', label: 'Beklemede' }
      ])
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

  const handleDelete = async (item) => {
    if (!confirm(`"${item.label}" kaydını silmek istediğinizden emin misiniz?`)) return
    
    try {
      // Backend API entegrasyonu
      await deleteDictionaryItem(selectedDictionary.id, item.id)
      setItems(items.filter(i => i.id !== item.id))
      alert('Kayıt başarıyla silindi!')
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Silme işlemi başarısız: ' + error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingItem) {
        // Backend API entegrasyonu - Update
        const updatedItem = await updateDictionaryItem(selectedDictionary.id, editingItem.id, formData)
        setItems(items.map(i => i.id === editingItem.id ? { ...i, ...updatedItem } : i))
        alert('Kayıt başarıyla güncellendi!')
      } else {
        // Backend API entegrasyonu - Create
        const newItem = await createDictionaryItem(selectedDictionary.id, formData)
        setItems([...items, newItem])
        alert('Kayıt başarıyla eklendi!')
      }
      
      setIsModalOpen(false)
      setFormData({ code: '', label: '' })
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Kayıt işlemi başarısız: ' + error.message)
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
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        <span className="code-badge">{item.code}</span>
                      </td>
                      <td>{item.label}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(item)}
                            title="Düzenle"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(item)}
                            title="Sil"
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
        <div className="modal-overlay-dict" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dict" onClick={(e) => e.stopPropagation()}>
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
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  placeholder="Örn: ACTIVE"
                  className="form-input-dict"
                />
                <small className="form-hint">Büyük harfle, alt çizgi ile yazın</small>
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
    </div>
  )
}

