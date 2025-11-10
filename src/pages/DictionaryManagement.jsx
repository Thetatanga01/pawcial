import { useState, useEffect } from 'react'
import { 
  getDictionaryItems, 
  createDictionaryItem,
  updateDictionaryItem,
  deleteDictionaryItem,
  hardDeleteDictionaryItem
} from '../api/dictionary.js'
import { createApiHelpers } from '../api/genericApi.js'
import { getUserFriendlyErrorMessage, NOTIFICATION_DURATION, ERROR_NOTIFICATION_DURATION, normalizeTurkish } from '../utils/errorHandler.js'

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
  { id: 'leash-behavior', name: 'LeashBehavior', label: 'Tasma Davranışı', icon: '🦮', supportsUpdate: true },
  { id: 'med-event-type', name: 'MedEventType', label: 'Tıbbi Olay Tipi', icon: '🩺', supportsUpdate: true },
  { id: 'observation-category', name: 'ObservationCategory', label: 'Gözlem Kategorisi', icon: '👁️', supportsUpdate: true },
  { id: 'organization', name: 'Organization', label: 'Organizasyon', icon: '🏛️', supportsUpdate: true },
  { id: 'outcome-type', name: 'OutcomeType', label: 'Sonuç Tipi', icon: '🎯', supportsUpdate: true },
  { id: 'placement-status', name: 'PlacementStatus', label: 'Yerleştirme Durumu', icon: '📍', supportsUpdate: true },
  { id: 'placement-type', name: 'PlacementType', label: 'Yerleştirme Tipi', icon: '🏡', supportsUpdate: true },
  { id: 'proficiency-level', name: 'ProficiencyLevel', label: 'Uzmanlık Seviyesi', icon: '⭐', supportsUpdate: true },
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

export default function DictionaryManagement({ selectedDictionaryId }) {
  // Eğer prop olarak id verilmişse, o dictionary'yi seç
  const initialDict = selectedDictionaryId 
    ? DICTIONARIES.find(d => d.id === selectedDictionaryId) || DICTIONARIES[0]
    : DICTIONARIES[0]
  
  const [selectedDictionary, setSelectedDictionary] = useState(initialDict)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ code: '', label: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarSearchTerm, setSidebarSearchTerm] = useState('') // Sol menü için arama
  const [showAll, setShowAll] = useState(false) // Arşivlenmiş kayıtları göster
  const [notification, setNotification] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null) // { title, message, onConfirm, confirmText, type, icon }

  // Notification gösterme fonksiyonu
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    const duration = type === 'error' ? ERROR_NOTIFICATION_DURATION : NOTIFICATION_DURATION
    setTimeout(() => setNotification(null), duration)
  }

  // selectedDictionaryId prop değiştiğinde dictionary'yi güncelle
  useEffect(() => {
    if (selectedDictionaryId) {
      const dict = DICTIONARIES.find(d => d.id === selectedDictionaryId)
      if (dict) {
        setSelectedDictionary(dict)
      }
    }
  }, [selectedDictionaryId])

  useEffect(() => {
    loadDictionaryItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDictionary.id, showAll])

  const loadDictionaryItems = async () => {
    setLoading(true)
    try {
      // Dictionary için dictionary API kullan (showAll parametresi ile)
      const data = await getDictionaryItems(selectedDictionary.id, showAll)
      console.log('Loaded dictionary items:', data, 'showAll:', showAll)
      
      // Backend'den gelen data'da id yok, code'u id olarak kullan
      // Bazı dictionary'lerde (örn: proficiency-level) label yerine name kullanılıyor
      const itemsWithId = Array.isArray(data) ? data.map(item => ({ 
        ...item, 
        id: item.code,
        label: item.label || item.name // name varsa onu label olarak kullan
      })) : []
      setItems(itemsWithId)
    } catch (error) {
      console.error('Error loading items:', error)
      showNotification(getUserFriendlyErrorMessage(error, 'Veri yüklenirken hata oluştu'), 'error')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingItem(null)
    
    // Organization için ek alanlar
    if (selectedDictionary.id === 'organization') {
      setFormData({ 
        code: '', 
        label: '', 
        organizationType: '', 
        contactPhone: '', 
        contactEmail: '', 
        address: '', 
        notes: '' 
      })
    } else {
      setFormData({ code: '', label: '' })
    }
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    
    // Organization için ek alanlar
    if (selectedDictionary.id === 'organization') {
      setFormData({ 
        code: item.code, 
        label: item.label,
        organizationType: item.organizationType || '',
        contactPhone: item.contactPhone || '',
        contactEmail: item.contactEmail || '',
        address: item.address || '',
        notes: item.notes || ''
      })
    } else {
      setFormData({ code: item.code, label: item.label })
    }
    setIsModalOpen(true)
  }

  const handleToggle = (item) => {
    const isCurrentlyActive = item.isActive !== false // Default true if not specified
    const action = isCurrentlyActive ? 'arşivlemek' : 'tekrar aktif etmek'
    const actionPast = isCurrentlyActive ? 'arşivlendi' : 'aktif edildi'
    const icon = isCurrentlyActive ? '📦' : '✅'
    const modalType = isCurrentlyActive ? 'warning' : 'success'
    
    setConfirmModal({
      title: isCurrentlyActive ? 'Kaydı Arşivle' : 'Kaydı Aktif Et',
      message: `"${item.label}" kaydını ${action} istediğinizden emin misiniz?`,
      icon: icon,
      type: modalType,
      confirmText: isCurrentlyActive ? 'Arşivle' : 'Aktif Et',
      onConfirm: async () => {
        try {
          // Dictionary için dictionary API kullan
          await deleteDictionaryItem(selectedDictionary.id, item.code)
          showNotification(`Kayıt başarıyla ${actionPast}!`, 'success')
          // Listeyi yeniden yükle
          await loadDictionaryItems()
        } catch (error) {
          console.error('Error toggling item:', error)
          showNotification(getUserFriendlyErrorMessage(error, 'İşlem başarısız'), 'error')
        }
        setConfirmModal(null)
      }
    })
  }

  const handleHardDelete = (item) => {
    setConfirmModal({
      title: '⚠️ Kalıcı Silme',
      message: `"${item.label}" kaydını KALICI olarak silmek istediğinizden emin misiniz?\n\n⚠️ BU İŞLEM GERİ ALINAMAZ!\n\nDictionary kayıtları zaman sınırlaması olmadan kalıcı olarak silinebilir.`,
      icon: '🗑️',
      type: 'danger',
      confirmText: 'Kalıcı Olarak Sil',
      onConfirm: async () => {
        try {
          await hardDeleteDictionaryItem(selectedDictionary.id, item.code)
          showNotification('Kayıt kalıcı olarak silindi!', 'success')
          // Listeyi yeniden yükle
          await loadDictionaryItems()
        } catch (error) {
          console.error('Error hard deleting item:', error)
          showNotification(getUserFriendlyErrorMessage(error, 'İşlem başarısız'), 'error')
        }
        setConfirmModal(null)
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingItem) {
        // Update
        if (selectedDictionary.id === 'organization') {
          const updateData = {
            label: formData.label,
            organizationType: formData.organizationType,
            contactPhone: formData.contactPhone,
            contactEmail: formData.contactEmail,
            address: formData.address,
            notes: formData.notes
          }
          await updateDictionaryItem(selectedDictionary.id, editingItem.code, updateData)
        } else {
          await updateDictionaryItem(selectedDictionary.id, editingItem.code, { label: formData.label })
        }
        showNotification('Kayıt başarıyla güncellendi!', 'success')
      } else {
        // Create
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
      showNotification(getUserFriendlyErrorMessage(error, 'Kayıt işlemi başarısız'), 'error')
    }
  }

  const filteredItems = items.filter(item => {
    // Backend'den gelen veriler zaten showAll parametresine göre filtrelenmiş
    // Sadece arama filtresi uygula
    const searchLower = searchTerm.toLowerCase()
    const code = (item.code || '').toString().toLowerCase()
    const label = (item.label || '').toString().toLowerCase()
    return code.includes(searchLower) || label.includes(searchLower)
  })

  // Sol menüdeki sözlükleri filtrele (Türkçe karakter desteği ile)
  console.log('🔍 Sidebar search term:', sidebarSearchTerm)
  
  const filteredDictionaries = DICTIONARIES.filter(dict => {
    if (!sidebarSearchTerm.trim()) return true // Arama yoksa hepsini göster
    
    console.log('Checking dictionary:', dict.label)
    
    const searchNormalized = normalizeTurkish(sidebarSearchTerm)
    const labelNormalized = normalizeTurkish(dict.label)
    const nameNormalized = normalizeTurkish(dict.name)
    
    console.log('Normalized values:', {
      searchNormalized,
      labelNormalized,
      nameNormalized
    })
    
    const labelMatch = labelNormalized.includes(searchNormalized)
    const nameMatch = nameNormalized.includes(searchNormalized)
    const matches = labelMatch || nameMatch
    
    console.log('Match result:', {
      label: dict.label,
      labelMatch,
      nameMatch,
      matches
    })
    
    return matches
  })
  
  console.log('Filtered dictionaries count:', filteredDictionaries.length)

  return (
    <div className="dictionary-management">
      {/* Sidebar sadece prop verilmediğinde göster */}
      {!selectedDictionaryId && (
      <div className="dictionary-sidebar">
        <div className="dictionary-sidebar-header">
          <h3>Ön Tanımlamalar</h3>
          <span className="dictionary-count">{filteredDictionaries.length}</span>
        </div>
        
        {/* Sidebar Search Input */}
        <div className="dictionary-sidebar-search">
          <input
            type="text"
            placeholder="🔍 Tanım ara..."
            value={sidebarSearchTerm}
            onChange={(e) => {
              console.log('📝 Input onChange:', e.target.value)
              setSidebarSearchTerm(e.target.value)
            }}
            onInput={(e) => {
              console.log('⌨️ Input onInput:', e.target.value)
            }}
            className="sidebar-search-input"
          />
          {sidebarSearchTerm && (
            <button
              className="sidebar-search-clear"
              onClick={() => setSidebarSearchTerm('')}
              title="Temizle"
            >
              ✕
            </button>
          )}
        </div>

        <div className="dictionary-list">
          {filteredDictionaries.map((dict) => (
            <button
              key={dict.id}
              className={`dictionary-item ${selectedDictionary.id === dict.id ? 'active' : ''}`}
              onClick={() => setSelectedDictionary(dict)}
            >
              <span className="dictionary-icon">{dict.icon}</span>
              <span className="dictionary-label">{dict.label}</span>
              {dict.isEntity && <span className="entity-badge">Entity</span>}
            </button>
          ))}
          {filteredDictionaries.length === 0 && (
            <div className="dictionary-empty-search">
              <p>Sonuç bulunamadı</p>
            </div>
          )}
        </div>
      </div>
      )}

      <div className="dictionary-content" style={selectedDictionaryId ? { gridColumn: '1 / -1' } : {}}>
        <div className="dictionary-header">
          <div className="dictionary-title-section">
            <h2>
              <span className="dictionary-icon-large">{selectedDictionary.icon}</span>
              {selectedDictionary.label}
            </h2>
            <p className="dictionary-subtitle">
              {selectedDictionary.name || selectedDictionary.label} tablosunu yönetin
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
          <div className="toolbar-actions">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
                className="checkbox-input"
              />
              <span>Arşivi Göster</span>
            </label>
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
                  filteredItems.map((item, index) => {
                    const isActive = item.isActive !== false // Default true if not specified
                    return (
                      <tr key={item.code} style={!isActive ? { opacity: 0.6 } : {}}>
                        <td>{index + 1}</td>
                        <td>
                          <span className="code-badge">{item.code}</span>
                          {!isActive && <span className="badge-archived">Arşiv</span>}
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
                            title="Arşivle / Aktif Et"
                          >
                              🔄
                          </button>
                          <button
                            className="action-btn hard-delete"
                            onClick={() => handleHardDelete(item)}
                            title="Kalıcı Sil (Dictionary'ler için zaman sınırı yok)"
                          >
                              🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                    )
                  })
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
                    : 'Büyük harfle, alt çizgi ile yazın'}
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

              {/* Organization için ek alanlar */}
              {selectedDictionary.id === 'organization' && (
                <>
                  <div className="form-group-dict">
                    <label htmlFor="organizationType">Organizasyon Tipi</label>
                    <input
                      type="text"
                      id="organizationType"
                      value={formData.organizationType || ''}
                      onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                      placeholder="Örn: Dernek, Vakıf, Belediye"
                      className="form-input-dict"
                    />
                  </div>

                  <div className="form-group-dict">
                    <label htmlFor="contactPhone">İletişim Telefonu</label>
                    <input
                      type="tel"
                      id="contactPhone"
                      value={formData.contactPhone || ''}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+90 5XX XXX XX XX"
                      className="form-input-dict"
                    />
                  </div>

                  <div className="form-group-dict">
                    <label htmlFor="contactEmail">İletişim E-posta</label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={formData.contactEmail || ''}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="ornek@email.com"
                      className="form-input-dict"
                    />
                  </div>

                  <div className="form-group-dict">
                    <label htmlFor="address">Adres</label>
                    <textarea
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Organizasyon adresi..."
                      className="form-input-dict"
                      rows={3}
                    />
                  </div>

                  <div className="form-group-dict">
                    <label htmlFor="notes">Notlar</label>
                    <textarea
                      id="notes"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Ek bilgiler..."
                      className="form-input-dict"
                      rows={3}
                    />
                  </div>
                </>
              )}

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

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="modal-overlay-confirm">
          <div className={`modal-confirm modal-confirm-${confirmModal.type}`}>
            <div className="modal-confirm-header">
              <span className="modal-confirm-icon">{confirmModal.icon}</span>
              <h3 className="modal-confirm-title">{confirmModal.title}</h3>
            </div>
            <div className="modal-confirm-body">
              <p className="modal-confirm-message" style={{ whiteSpace: 'pre-line' }}>{confirmModal.message}</p>
            </div>
            <div className="modal-confirm-footer">
              <button 
                type="button" 
                className="btn-confirm-cancel" 
                onClick={() => setConfirmModal(null)}
              >
                İptal
              </button>
              <button 
                type="button" 
                className={`btn-confirm-action btn-confirm-${confirmModal.type}`}
                onClick={confirmModal.onConfirm}
              >
                {confirmModal.confirmText}
              </button>
            </div>
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

