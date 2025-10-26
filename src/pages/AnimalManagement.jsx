import { useState, useEffect } from 'react'
import { getAnimals, createAnimal, updateAnimal, deleteAnimal } from '../api/animals.js'
import { getDictionaryItems } from '../api/dictionary.js'

export default function AnimalManagement() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAll, setShowAll] = useState(false) // Backend'in 'all' parametresi
  const [notification, setNotification] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null) // { title, message, onConfirm, confirmText, type, isActive }

  // Dictionary states
  const [species, setSpecies] = useState([])
  const [allBreeds, setAllBreeds] = useState([]) // Tüm ırklar (filtrelenmemiş)
  const [breeds, setBreeds] = useState([]) // Filtrelenmiş ırklar
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [sexes, setSexes] = useState([])
  const [temperaments, setTemperaments] = useState([])
  const [healthFlags, setHealthFlags] = useState([])

  // Form data - Backend Swagger'a göre güncellenmiş (DOĞRU FIELD İSİMLERİ)
  const [formData, setFormData] = useState({
    name: '',
    speciesId: '',
    breedId: '',
    sex: '',
    color: '',
    size: '',
    trainingLevel: '',
    birthDate: '',
    sterilized: false,
    isMixed: false,
    originNote: '',
    temperamentCodes: [],    // Backend'in beklediği field ismi
    healthFlagCodes: []      // Backend'in beklediği field ismi
  })

  // Notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Load animals when showAll or searchTerm changes
  useEffect(() => {
    loadAnimals()
  }, [showAll, searchTerm])

  // Load dictionary data
  useEffect(() => {
    loadDictionaries()
  }, [])

  // Filter breeds when species changes
  useEffect(() => {
    if (formData.speciesId && allBreeds.length > 0) {
      const filteredBreeds = allBreeds.filter(breed => breed.speciesId === formData.speciesId)
      console.log('Filtering breeds for species:', formData.speciesId, 'Found:', filteredBreeds.length)
      setBreeds(filteredBreeds)
    } else {
      setBreeds([])
    }
  }, [formData.speciesId, allBreeds])

  const loadAnimals = async () => {
    setLoading(true)
    try {
      const data = await getAnimals({
        all: showAll,
        search: searchTerm
      })
      setAnimals(data)
    } catch (error) {
      console.error('Error loading animals:', error)
      showNotification('Hayvanlar yüklenirken hata oluştu', 'error')
      setAnimals([])
    } finally {
      setLoading(false)
    }
  }

  const loadDictionaries = async () => {
    try {
      // Load species from entity API
      const loadSpecies = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/species')
          if (response.ok) {
            const entities = await response.json()
            return entities.map(entity => ({
              code: entity.id,
              label: entity.commonName || entity.scientificName
            }))
          }
          return []
        } catch (error) {
          console.error('Error loading species:', error)
          return []
        }
      }

      // Load breeds from entity API (with speciesId)
      const loadBreeds = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/breeds')
          if (response.ok) {
            const entities = await response.json()
            return entities.map(entity => ({
              code: entity.id,
              label: entity.name,
              speciesId: entity.speciesId // speciesId'yi tutuyoruz
            }))
          }
          return []
        } catch (error) {
          console.error('Error loading breeds:', error)
          return []
        }
      }

      // Load all required data (Backend Swagger'a göre güncellenmiş)
      const [
        speciesData,
        breedsData,
        colorsData,
        sizesData,
        sexesData,
        temperamentsData,
        healthFlagsData
      ] = await Promise.all([
        loadSpecies(),
        loadBreeds(),
        getDictionaryItems('color').catch(() => []),
        getDictionaryItems('size').catch(() => []),
        getDictionaryItems('sex').catch(() => []),
        getDictionaryItems('temperament').catch(() => []),
        getDictionaryItems('health-flag').catch(() => [])
      ])

      setSpecies(speciesData)
      setAllBreeds(breedsData) // Tüm ırkları saklıyoruz
      setBreeds([]) // Başlangıçta boş
      setColors(colorsData)
      setSizes(sizesData)
      setSexes(sexesData)
      setTemperaments(temperamentsData)
      setHealthFlags(healthFlagsData)
    } catch (error) {
      console.error('Error loading dictionaries:', error)
    }
  }

  const handleCreate = () => {
    setEditingAnimal(null)
    setFormData({
      name: '',
      speciesId: '',
      breedId: '',
      sex: '',
      color: '',
      size: '',
      trainingLevel: '',
      birthDate: '',
      sterilized: false,
      isMixed: false,
      originNote: '',
      temperamentCodes: [],
      healthFlagCodes: []
    })
    setIsModalOpen(true)
  }

  const handleEdit = (animal) => {
    setEditingAnimal(animal)
    
    console.log('Editing animal from backend:', animal)
    console.log('Available fields:', Object.keys(animal))
    
    // Backend'den gelen değerleri direkt map et (Swagger'a göre güncellenmiş)
    // Backend RESPONSE'da: temperaments, healthFlags (array)
    // Backend REQUEST'te: temperamentCodes, healthFlagCodes (array)
    const formValues = {
      name: animal.name || '',
      speciesId: animal.speciesId || '',
      breedId: animal.breedId || '',
      sex: animal.sex || '',
      color: animal.color || '',
      size: animal.size || '',
      trainingLevel: animal.trainingLevel || '',
      birthDate: animal.birthDate || '',
      sterilized: animal.sterilized || false,
      isMixed: animal.isMixed || false,
      originNote: animal.originNote || '',
      temperamentCodes: animal.temperaments || [],  // Response'da 'temperaments', form'da 'temperamentCodes'
      healthFlagCodes: animal.healthFlags || []     // Response'da 'healthFlags', form'da 'healthFlagCodes'
    }
    
    console.log('Form values after mapping:', formValues)
    
    setFormData(formValues)
    setIsModalOpen(true)
  }

  // Species değiştiğinde breed'i temizle
  const handleSpeciesChange = (newSpeciesId) => {
    setFormData({ 
      ...formData, 
      speciesId: newSpeciesId,
      breedId: '' // Breed'i temizle
    })
  }

  const handleToggleActive = (animal) => {
    // Backend'de DELETE endpoint artık toggle olarak çalışıyor
    // Backend'den isActive bilgisi artık geliyor ✅
    const isCurrentlyActive = animal.isActive
    const action = isCurrentlyActive ? 'arşivlemek' : 'tekrar aktif etmek'
    const actionPast = isCurrentlyActive ? 'arşivlendi' : 'aktif edildi'
    const icon = isCurrentlyActive ? '📦' : '✅'
    const modalType = isCurrentlyActive ? 'warning' : 'success'
    
    setConfirmModal({
      title: isCurrentlyActive ? 'Kaydı Arşivle' : 'Kaydı Aktif Et',
      message: `"${animal.name}" adlı hayvanı ${action} istediğinizden emin misiniz?`,
      icon: icon,
      type: modalType,
      confirmText: isCurrentlyActive ? 'Arşivle' : 'Aktif Et',
      onConfirm: async () => {
        try {
          await deleteAnimal(animal.id) // Backend'de toggle olarak çalışıyor
          showNotification(`Hayvan başarıyla ${actionPast}!`, isCurrentlyActive ? 'success' : 'success')
          loadAnimals()
        } catch (error) {
          console.error('Error toggling animal active status:', error)
          showNotification('İşlem başarısız: ' + error.message, 'error')
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      console.log('Submitting animal data:', formData)
      console.log('Editing animal?', !!editingAnimal)
      
      if (editingAnimal) {
        console.log('Updating animal ID:', editingAnimal.id)
        await updateAnimal(editingAnimal.id, formData)
        showNotification('Hayvan başarıyla güncellendi!', 'success')
      } else {
        console.log('Creating new animal')
        await createAnimal(formData)
        showNotification('Hayvan başarıyla eklendi!', 'success')
      }

      setIsModalOpen(false)
      setEditingAnimal(null)
      loadAnimals()
    } catch (error) {
      console.error('Error saving animal:', error)
      showNotification('Kayıt işlemi başarısız: ' + error.message, 'error')
    }
  }

  // Client-side filtering (fallback for when backend doesn't support search yet)
  const filteredAnimals = searchTerm 
    ? animals.filter(animal =>
        animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.speciesName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breedName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : animals // No client-side filtering if no search term (backend will handle it)

  return (
    <div className="dictionary-management">
      <div className="dictionary-content" style={{ gridColumn: '1 / -1' }}>
        <div className="dictionary-header">
          <div className="dictionary-title-section">
            <h2>
              <span className="dictionary-icon-large">🐾</span>
              Hayvanlar
            </h2>
            <p className="dictionary-subtitle">
              Tüm hayvanları yönetin
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            + Yeni Hayvan Ekle
          </button>
        </div>

        <div className="dictionary-toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 İsim, tür veya ırk ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="toolbar-filters">
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
                className="filter-checkbox"
              />
              <span className="filter-checkbox-text">
                📦 Arşivlenmişleri de göster
              </span>
            </label>
          </div>
          <div className="toolbar-info">
            <span className="item-count">
              {animals.length} kayıt
              {showAll && <span className="inactive-badge"> (arşiv dahil)</span>}
            </span>
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
                  <th style={{ width: '50px' }}>#</th>
                  <th style={{ width: '18%' }}>İsim</th>
                  <th style={{ width: '12%' }}>Tür</th>
                  <th style={{ width: '12%' }}>Irk</th>
                  <th style={{ width: '10%' }}>Cinsiyet</th>
                  <th style={{ width: '10%' }}>Renk</th>
                  <th style={{ width: '10%' }}>Boyut</th>
                  <th style={{ width: '13%' }}>Doğum Tarihi</th>
                  <th style={{ width: '120px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnimals.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="empty-state">
                      {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz hayvan eklenmemiş'}
                    </td>
                  </tr>
                ) : (
                  filteredAnimals.map((animal, index) => {
                    // Backend'den isActive artık kesin olarak geliyor ✅
                    const isActive = animal.isActive
                    return (
                      <tr key={animal.id} className={!isActive ? 'row-inactive' : ''}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{animal.name}</strong>
                          {!isActive && <span className="badge-archived">Arşiv</span>}
                        </td>
                        <td>{animal.speciesName || '-'}</td>
                        <td>{animal.breedName || '-'}</td>
                        <td>{animal.sex || '-'}</td>
                        <td>{animal.color || '-'}</td>
                        <td>{animal.size || '-'}</td>
                        <td>{animal.birthDate || '-'}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(animal)}
                              title="Düzenle"
                            >
                              ✏️
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleToggleActive(animal)}
                              title="Arşivle / Aktif Et (Toggle)"
                            >
                              🔄
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
          <div className="modal-dict modal-dict-xlarge">
            <div className="modal-dict-header">
              <h3>{editingAnimal ? '🐾 Hayvanı Düzenle' : '🐾 Yeni Hayvan Ekle'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-dict-body modal-animal-form">
              {/* Temel Bilgiler Bölümü */}
              <div className="form-section">
                <h4 className="form-section-title">ℹ️ Temel Bilgiler</h4>
                <div className="form-grid-2">
                {/* İsim */}
                <div className="form-group-dict">
                  <label htmlFor="name">İsim *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Örn: Max"
                    className="form-input-dict"
                  />
                </div>

                {/* Tür */}
                <div className="form-group-dict">
                  <label htmlFor="speciesId">Tür *</label>
                  <select
                    id="speciesId"
                    value={formData.speciesId}
                    onChange={(e) => handleSpeciesChange(e.target.value)}
                    required
                    className="form-input-dict"
                  >
                    <option value="">Seçiniz</option>
                    {species.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Irk */}
                <div className="form-group-dict">
                  <label htmlFor="breedId">Irk</label>
                  <select
                    id="breedId"
                    value={formData.breedId}
                    onChange={(e) => setFormData({ ...formData, breedId: e.target.value })}
                    className="form-input-dict"
                    disabled={!formData.speciesId}
                  >
                    <option value="">
                      {formData.speciesId ? 'Seçiniz' : 'Önce tür seçin'}
                    </option>
                    {breeds.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <small className="form-hint">
                    {breeds.length === 0 && formData.speciesId 
                      ? 'Bu tür için henüz ırk eklenmemiş' 
                      : 'Önce bir tür seçin'}
                  </small>
                </div>

                {/* Cinsiyet */}
                <div className="form-group-dict">
                  <label htmlFor="sex">Cinsiyet</label>
                  <select
                    id="sex"
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    className="form-input-dict"
                  >
                    <option value="">Seçiniz</option>
                    {sexes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Renk */}
                <div className="form-group-dict">
                  <label htmlFor="color">Renk</label>
                  <select
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="form-input-dict"
                  >
                    <option value="">Seçiniz</option>
                    {colors.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Boyut */}
                <div className="form-group-dict">
                  <label htmlFor="size">Boyut</label>
                  <select
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="form-input-dict"
                  >
                    <option value="">Seçiniz</option>
                    {sizes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Eğitim Seviyesi */}
                <div className="form-group-dict">
                  <label htmlFor="trainingLevel">Eğitim Seviyesi</label>
                  <select
                    id="trainingLevel"
                    value={formData.trainingLevel}
                    onChange={(e) => setFormData({ ...formData, trainingLevel: e.target.value })}
                    className="form-input-dict"
                  >
                    <option value="">Seçiniz</option>
                    <option value="NONE">Yok</option>
                    <option value="BASIC">Temel</option>
                    <option value="INTERMEDIATE">Orta</option>
                    <option value="ADVANCED">İleri</option>
                  </select>
                </div>

                {/* Doğum Tarihi */}
                <div className="form-group-dict">
                  <label htmlFor="birthDate">Doğum Tarihi</label>
                  <input
                    type="date"
                    id="birthDate"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="form-input-dict"
                  />
                </div>
                </div>
              </div>

              {/* Özellikler Bölümü */}
              <div className="form-section">
                <h4 className="form-section-title">📋 Özellikler</h4>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="sterilized"
                      checked={formData.sterilized}
                      onChange={(e) => setFormData({ ...formData, sterilized: e.target.checked })}
                      className="form-checkbox-modern"
                    />
                    <label htmlFor="sterilized" className="checkbox-label">
                      <span className="checkbox-icon">✂️</span>
                      <div className="checkbox-text">
                        <strong>Kısırlaştırılmış</strong>
                        <small>Hayvan kısırlaştırma ameliyatı geçirmiş</small>
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="isMixed"
                      checked={formData.isMixed}
                      onChange={(e) => setFormData({ ...formData, isMixed: e.target.checked })}
                      className="form-checkbox-modern"
                    />
                    <label htmlFor="isMixed" className="checkbox-label">
                      <span className="checkbox-icon">🧬</span>
                      <div className="checkbox-text">
                        <strong>Melez</strong>
                        <small>Hayvan karma ırk</small>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Menşe Notu */}
              <div className="form-section">
                <h4 className="form-section-title">📝 Menşe Notu</h4>
                <div className="form-group-dict">
                  <textarea
                    id="originNote"
                    value={formData.originNote}
                    onChange={(e) => setFormData({ ...formData, originNote: e.target.value })}
                    placeholder="Hayvanın kökeni, nereden geldiği, bulunduğu koşullar vb. bilgiler..."
                    className="form-input-dict"
                    rows="3"
                  />
                </div>
              </div>

              {/* Davranış ve Sağlık Bölümü */}
              <div className="form-section">
                <h4 className="form-section-title">🩺 Davranış ve Sağlık</h4>
                <div className="form-grid-2">
                  {/* Mizaç - Multi Select */}
                  <div className="form-group-dict">
                    <label htmlFor="temperamentCodes">🐕 Mizaç</label>
                    <select
                      id="temperamentCodes"
                      multiple
                      value={formData.temperamentCodes}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                        setFormData({ ...formData, temperamentCodes: selectedOptions })
                      }}
                      className="form-input-dict form-input-multiselect"
                      size={6}
                    >
                      {temperaments.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <small className="form-hint-multiselect">
                      💡 Birden fazla seçim için Ctrl/Cmd tuşuna basılı tutun
                    </small>
                  </div>

                  {/* Sağlık Durumu - Multi Select */}
                  <div className="form-group-dict">
                    <label htmlFor="healthFlagCodes">💊 Sağlık Durumu</label>
                    <select
                      id="healthFlagCodes"
                      multiple
                      value={formData.healthFlagCodes}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                        setFormData({ ...formData, healthFlagCodes: selectedOptions })
                      }}
                      className="form-input-dict form-input-multiselect"
                      size={6}
                    >
                      {healthFlags.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <small className="form-hint-multiselect">
                      💡 Birden fazla seçim için Ctrl/Cmd tuşuna basılı tutun
                    </small>
                  </div>
                </div>
              </div>

              <div className="modal-dict-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAnimal ? 'Güncelle' : 'Kaydet'}
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

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="modal-overlay-confirm">
          <div className={`modal-confirm modal-confirm-${confirmModal.type}`}>
            <div className="modal-confirm-header">
              <span className="modal-confirm-icon">{confirmModal.icon}</span>
              <h3 className="modal-confirm-title">{confirmModal.title}</h3>
            </div>
            <div className="modal-confirm-body">
              <p className="modal-confirm-message">{confirmModal.message}</p>
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
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm()
                  setConfirmModal(null)
                }}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

