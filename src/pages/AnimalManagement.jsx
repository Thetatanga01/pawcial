import { useState, useEffect, useCallback, useRef } from 'react'
import { getAnimals, createAnimal, updateAnimal, deleteAnimal, searchAnimals } from '../api/animals.js'
import { getDictionaryItems } from '../api/dictionary.js'

export default function AnimalManagement() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState(null)
  const [showAll, setShowAll] = useState(false) // Backend'in 'all' parametresi
  const [notification, setNotification] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null) // { title, message, onConfirm, confirmText, type, isActive }
  
  // Search filters
  const [searchName, setSearchName] = useState('')
  const [searchSpecies, setSearchSpecies] = useState('')
  const [searchBreed, setSearchBreed] = useState('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  
  // Debounce timer ref
  const searchDebounceRef = useRef(null)

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

  // Load animals - checks if any search filter is active
  const loadAnimals = useCallback(async () => {
    setLoading(true)
    try {
      // Eğer herhangi bir search filtresi varsa /search endpoint'ini kullan
      const hasSearchFilters = searchName.trim() || searchSpecies.trim() || searchBreed.trim()
      
      let response
      if (hasSearchFilters) {
        response = await searchAnimals({
          name: searchName,
          speciesName: searchSpecies,
          breedName: searchBreed,
          all: showAll,
          page: currentPage,
          size: pageSize
        })
      } else {
        // Filtre yoksa normal getAnimals endpoint'i kullan
        response = await getAnimals({ 
          all: showAll,
          page: currentPage,
          size: pageSize
        })
      }
      
      // Pagination response yapısı: { content, page, size, totalElements, totalPages, hasNext, hasPrevious }
      setAnimals(response.content || [])
      setTotalElements(response.totalElements || 0)
      setTotalPages(response.totalPages || 0)
      setHasNext(response.hasNext || false)
      setHasPrevious(response.hasPrevious || false)
    } catch (error) {
      console.error('Error loading animals:', error)
      showNotification('Hayvanlar yüklenirken hata oluştu', 'error')
      setAnimals([])
      setTotalElements(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }, [searchName, searchSpecies, searchBreed, showAll, currentPage, pageSize])

  // Reset page to 0 when search filters change
  useEffect(() => {
    setCurrentPage(0)
  }, [searchName, searchSpecies, searchBreed, showAll])

  // Debounce search - 600ms delay after user stops typing
  useEffect(() => {
    // Clear previous timer
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    // Set new timer - debounce only for search/filter changes, not for pagination
    searchDebounceRef.current = setTimeout(() => {
      loadAnimals()
    }, 600)

    // Cleanup
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }
    }
  }, [searchName, searchSpecies, searchBreed, showAll, currentPage, loadAnimals])

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

  // Artık filtering backend'de yapılıyor - animals direkt kullanılıyor // No client-side filtering if no search term (backend will handle it)

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
          <div className="search-box-group">
            <input
              type="text"
              placeholder="🐾 Hayvan adı..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
              style={{ flex: 2 }}
            />
            <input
              type="text"
              placeholder="🦁 Tür (Köpek, Kedi...)"
              value={searchSpecies}
              onChange={(e) => setSearchSpecies(e.target.value)}
              className="search-input"
              style={{ flex: 1.5 }}
            />
            <input
              type="text"
              placeholder="🐕 Irk (Golden, Husky...)"
              value={searchBreed}
              onChange={(e) => setSearchBreed(e.target.value)}
              className="search-input"
              style={{ flex: 1.5 }}
            />
            {(searchName || searchSpecies || searchBreed) && (
              <button
                className="btn-clear-search"
                onClick={() => {
                  setSearchName('')
                  setSearchSpecies('')
                  setSearchBreed('')
                }}
                title="Aramayı temizle"
              >
                ✕
              </button>
            )}
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
              Toplam {totalElements} kayıt
              {totalElements > 0 && ` (Sayfa ${currentPage + 1} / ${totalPages})`}
              {showAll && <span className="inactive-badge"> arşiv dahil</span>}
            </span>
            {(searchName || searchSpecies || searchBreed) && (
              <span className="search-indicator">🔍 Arama aktif</span>
            )}
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
                {animals.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="empty-state">
                      {(searchName || searchSpecies || searchBreed) ? 'Arama sonucu bulunamadı' : 'Henüz hayvan eklenmemiş'}
                    </td>
                  </tr>
                ) : (
                  animals.map((animal, index) => {
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

        {/* Pagination Controls */}
        {!loading && totalElements > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Gösterilen: {animals.length === 0 ? 0 : (currentPage * pageSize) + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} / {totalElements}
            </div>
            
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(0)}
                disabled={!hasPrevious}
                title="İlk sayfa"
              >
                ⏮
              </button>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!hasPrevious}
                title="Önceki sayfa"
              >
                ◀
              </button>
              
              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => {
                  // Show only 5 pages at a time
                  const showPage = (
                    i === 0 || // First page
                    i === totalPages - 1 || // Last page
                    (i >= currentPage - 1 && i <= currentPage + 1) // Current page ±1
                  )
                  
                  if (!showPage) {
                    // Show ellipsis
                    if (i === currentPage - 2 || i === currentPage + 2) {
                      return <span key={i} className="pagination-ellipsis">...</span>
                    }
                    return null
                  }
                  
                  return (
                    <button
                      key={i}
                      className={`pagination-page ${i === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!hasNext}
                title="Sonraki sayfa"
              >
                ▶
              </button>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={!hasNext}
                title="Son sayfa"
              >
                ⏭
              </button>
            </div>

            <div className="pagination-size-selector">
              <label htmlFor="pageSize">Sayfa başına:</label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(0) // Reset to first page
                }}
                className="page-size-select"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
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

