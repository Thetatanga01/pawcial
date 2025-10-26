import { useState, useEffect } from 'react'
import { getAnimals, createAnimal, updateAnimal, deleteAnimal } from '../api/animals.js'
import { getDictionaryItems } from '../api/dictionary.js'

export default function AnimalManagement() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)

  // Dictionary states
  const [species, setSpecies] = useState([])
  const [allBreeds, setAllBreeds] = useState([]) // Tüm ırklar (filtrelenmemiş)
  const [breeds, setBreeds] = useState([]) // Filtrelenmiş ırklar
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [sexes, setSexes] = useState([])
  const [temperaments, setTemperaments] = useState([])
  const [domesticStatuses, setDomesticStatuses] = useState([])
  const [healthFlags, setHealthFlags] = useState([])

  // Form data - Backend Swagger'a göre güncellenmiş
  const [formData, setFormData] = useState({
    name: '',
    speciesId: '',
    breedId: '',
    sex: '',          // sexCode → sex
    color: '',        // colorCode → color
    size: '',         // sizeCode → size
    trainingLevel: '', // Yeni field
    birthDate: '',
    sterilized: false,  // Yeni boolean field
    isMixed: false,     // Yeni boolean field
    originNote: ''      // Yeni field
  })

  // Notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Load animals
  useEffect(() => {
    loadAnimals()
  }, [])

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
      const data = await getAnimals()
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

      // Load all required data
      const [
        speciesData,
        breedsData,
        colorsData,
        sizesData,
        sexesData,
        temperamentsData,
        domesticStatusesData,
        healthFlagsData
      ] = await Promise.all([
        loadSpecies(),
        loadBreeds(),
        getDictionaryItems('color').catch(() => []),
        getDictionaryItems('size').catch(() => []),
        getDictionaryItems('sex').catch(() => []),
        getDictionaryItems('temperament').catch(() => []),
        getDictionaryItems('domestic-status').catch(() => []),
        getDictionaryItems('health-flag').catch(() => [])
      ])

      setSpecies(speciesData)
      setAllBreeds(breedsData) // Tüm ırkları saklıyoruz
      setBreeds([]) // Başlangıçta boş
      setColors(colorsData)
      setSizes(sizesData)
      setSexes(sexesData)
      setTemperaments(temperamentsData)
      setDomesticStatuses(domesticStatusesData)
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
      originNote: ''
    })
    setIsModalOpen(true)
  }

  const handleEdit = (animal) => {
    setEditingAnimal(animal)
    
    console.log('Editing animal from backend:', animal)
    console.log('Available fields:', Object.keys(animal))
    
    // Backend'den gelen değerleri direkt map et (Swagger'a göre güncellenmiş)
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
      originNote: animal.originNote || ''
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

  const handleDelete = async (animal) => {
    if (!confirm(`"${animal.name}" adlı hayvanı silmek istediğinizden emin misiniz?`)) return

    try {
      await deleteAnimal(animal.id)
      showNotification('Hayvan başarıyla silindi!', 'success')
      loadAnimals()
    } catch (error) {
      console.error('Error deleting animal:', error)
      showNotification('Silme işlemi başarısız: ' + error.message, 'error')
    }
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

  const filteredAnimals = animals.filter(animal =>
    animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.speciesName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breedName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              placeholder="İsim veya tür ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="toolbar-info">
            <span className="item-count">{filteredAnimals.length} kayıt</span>
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
                  <th style={{ width: '25%' }}>İsim</th>
                  <th style={{ width: '15%' }}>Tür</th>
                  <th style={{ width: '15%' }}>Irk</th>
                  <th style={{ width: '10%' }}>Cinsiyet</th>
                  <th style={{ width: '10%' }}>Renk</th>
                  <th style={{ width: '15%' }}>Doğum Tarihi</th>
                  <th style={{ width: '120px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnimals.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz hayvan eklenmemiş'}
                    </td>
                  </tr>
                ) : (
                  filteredAnimals.map((animal, index) => (
                    <tr key={animal.id}>
                      <td>{index + 1}</td>
                      <td><strong>{animal.name}</strong></td>
                      <td>{animal.speciesName || animal.speciesId}</td>
                      <td>{animal.breedName || animal.breedId}</td>
                      <td>{animal.sexCode}</td>
                      <td>{animal.colorCode}</td>
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
                            onClick={() => handleDelete(animal)}
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
        <div className="modal-overlay-dict">
          <div className="modal-dict modal-dict-large">
            <div className="modal-dict-header">
              <h3>{editingAnimal ? 'Hayvanı Düzenle' : 'Yeni Hayvan Ekle'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-dict-body">
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

                {/* Renk */}
                <div className="form-group-dict">
                  <label htmlFor="colorCode">Renk</label>
                  <select
                    id="colorCode"
                    value={formData.colorCode}
                    onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
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
                  <label htmlFor="sizeCode">Boyut</label>
                  <select
                    id="sizeCode"
                    value={formData.sizeCode}
                    onChange={(e) => setFormData({ ...formData, sizeCode: e.target.value })}
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

                {/* Cinsiyet */}
                <div className="form-group-dict">
                  <label htmlFor="sexCode">Cinsiyet *</label>
                  <select
                    id="sexCode"
                    value={formData.sexCode}
                    onChange={(e) => setFormData({ ...formData, sexCode: e.target.value })}
                    required
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

                {/* Mizaç - Multi Select */}
                <div className="form-group-dict">
                  <label htmlFor="temperamentCodes">Mizaç (Çoklu Seçim)</label>
                  <select
                    id="temperamentCodes"
                    multiple
                    value={formData.temperamentCodes}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                      setFormData({ ...formData, temperamentCodes: selectedOptions })
                    }}
                    className="form-input-dict form-input-multiselect"
                    size={5}
                  >
                    {temperaments.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <small className="form-hint">
                    Birden fazla seçim için Ctrl (Windows) veya Cmd (Mac) tuşuna basılı tutun
                  </small>
                </div>

                {/* Evcillik Durumu */}
                <div className="form-group-dict">
                  <label htmlFor="domesticStatusCode">Evcillik Durumu</label>
                  <select
                    id="domesticStatusCode"
                    value={formData.domesticStatusCode}
                    onChange={(e) => setFormData({ ...formData, domesticStatusCode: e.target.value })}
                    className="form-input-dict"
                  >
                    <option value="">Seçiniz</option>
                    {domesticStatuses.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sağlık Durumu */}
                <div className="form-group-dict">
                  <label htmlFor="healthFlagCode">Sağlık Durumu</label>
                  <select
                    id="healthFlagCode"
                    value={formData.healthFlagCode}
                    onChange={(e) => setFormData({ ...formData, healthFlagCode: e.target.value })}
                    className="form-input-dict"
                  >
                    <option value="">Seçiniz</option>
                    {healthFlags.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
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

              {/* Açıklama */}
              <div className="form-group-dict">
                <label htmlFor="description">Açıklama</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hayvan hakkında ek bilgiler..."
                  className="form-input-dict"
                  rows="4"
                />
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
    </div>
  )
}

