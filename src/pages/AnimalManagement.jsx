import { useState, useEffect, useCallback, useRef } from 'react'
import { getAnimals, createAnimal, updateAnimal, deleteAnimal, searchAnimals } from '../api/animals.js'
import { getDictionaryItems } from '../api/dictionary.js'
import { createApiHelpers } from '../api/genericApi.js'

const animalEventApi = createApiHelpers('animal-events')
const personsApi = createApiHelpers('persons')

export default function AnimalManagement() {
  // View mode: 'list' or 'events'
  const [viewMode, setViewMode] = useState('list')
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState(null)
  const [showAll, setShowAll] = useState(false) // Backend'in 'all' parametresi
  const [notification, setNotification] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null) // { title, message, onConfirm, confirmText, type, isActive }
  
  // Animal Events states
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [eventDictionaries, setEventDictionaries] = useState({})
  // Person search state
  const [personSearchTerm, setPersonSearchTerm] = useState('')
  const [personSearchResults, setPersonSearchResults] = useState([])
  const [personSearchLoading, setPersonSearchLoading] = useState(false)
  const personSearchDebounceRef = useRef(null)
  const [eventFormData, setEventFormData] = useState({
    animalId: '',
    eventType: '',
    eventAt: '',
    facilityId: '',
    unitId: '',
    fromFacilityId: '',
    toFacilityId: '',
    fromUnitId: '',
    toUnitId: '',
    outcomeType: '',
    sourceType: '',
    holdType: '',
    personId: '',
    volunteerId: '',
    medEventType: '',
    vaccineCode: '',
    medicationName: '',
    doseText: '',
    route: '',
    labTestName: '',
    details: ''
  })
  
  // Events pagination
  const [eventsPage, setEventsPage] = useState(0)
  const [eventsPageSize, setEventsPageSize] = useState(20)
  const [eventsTotalElements, setEventsTotalElements] = useState(0)
  const [eventsTotalPages, setEventsTotalPages] = useState(0)
  const [eventsHasNext, setEventsHasNext] = useState(false)
  const [eventsHasPrevious, setEventsHasPrevious] = useState(false)
  
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

  // Handle animal row click
  const handleAnimalClick = (animal) => {
    setSelectedAnimal(animal)
    setViewMode('events')
    loadAnimalEvents(animal.id)
    loadEventDictionaries()
  }

  // Load animal events
  const loadAnimalEvents = async (animalId) => {
    setEventsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8000/api/animal-events/animal/${animalId}?page=${eventsPage}&size=${eventsPageSize}&all=${showAllEvents}`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          setEvents(data.content || [])
          setEventsTotalElements(data.totalElements || 0)
          setEventsTotalPages(data.totalPages || 0)
          setEventsHasNext(data.hasNext || false)
          setEventsHasPrevious(data.hasPrevious || false)
        } else {
          setEvents(Array.isArray(data) ? data : [])
          setEventsTotalElements(Array.isArray(data) ? data.length : 0)
          setEventsTotalPages(1)
        }
      }
    } catch (error) {
      console.error('Error loading events:', error)
      showNotification('Etkinlikler yüklenirken hata oluştu', 'error')
      setEvents([])
    } finally {
      setEventsLoading(false)
    }
  }

  const loadEventDictionaries = async () => {
    try {
      const [
        eventTypesRaw, 
        facilitiesRaw, 
        unitsRaw,
        sourceTypesRaw,
        outcomeTypesRaw,
        holdTypesRaw,
        medEventTypesRaw,
        vaccinesRaw,
        doseRoutesRaw,
        volunteersRaw
      ] = await Promise.all([
        // EventType entity'den çek (dictionary değil!)
        fetch('http://localhost:8000/api/event-types')
          .then(res => res.json())
          .then(data => (data.content || data))
          .catch(() => []),
        fetch('http://localhost:8000/api/facilities')
          .then(res => res.json())
          .then(data => (data.content || data))
          .catch(() => []),
        fetch('http://localhost:8000/api/facility-units')
          .then(res => res.json())
          .then(data => (data.content || data))
          .catch(() => []),
        getDictionaryItems('source-type').catch(() => []),
        getDictionaryItems('outcome-type').catch(() => []),
        getDictionaryItems('hold-type').catch(() => []),
        getDictionaryItems('med-event-type').catch(() => []),
        getDictionaryItems('vaccine').catch(() => []),
        getDictionaryItems('dose-route').catch(() => []),
        fetch('http://localhost:8000/api/volunteers')
          .then(res => res.json())
          .then(data => (data.content || data))
          .catch(() => [])
      ])

      // EventType: sadece aktif olanları al
      const eventTypes = (eventTypesRaw || [])
        .filter(et => et.isActive !== false)
        .map(et => ({ code: et.code || et.id, label: et.name || et.label }))
      
      const facilities = (facilitiesRaw || [])
        .filter(f => f.isActive !== false)
        .map(f => ({ code: f.id, label: f.name }))

      const units = (unitsRaw || [])
        .filter(u => u.isActive !== false)
        .map(u => ({ code: u.id, label: u.code || u.name }))

      const sourceTypes = (sourceTypesRaw || []).filter(st => st.isActive !== false)
      const outcomeTypes = (outcomeTypesRaw || []).filter(ot => ot.isActive !== false)
      const holdTypes = (holdTypesRaw || []).filter(ht => ht.isActive !== false)
      const medEventTypes = (medEventTypesRaw || []).filter(mt => mt.isActive !== false)
      const vaccines = (vaccinesRaw || []).filter(v => v.isActive !== false)
      const doseRoutes = (doseRoutesRaw || []).filter(dr => dr.isActive !== false)
      
      const volunteers = (volunteersRaw || [])
        .filter(v => v.isActive !== false)
        .map(v => ({ code: v.id, label: v.personFullName || `Volunteer ${v.id}` }))

      setEventDictionaries({
        eventType: eventTypes,
        facilityId: facilities,
        unitId: units,
        sourceType: sourceTypes,
        outcomeType: outcomeTypes,
        holdType: holdTypes,
        medEventType: medEventTypes,
        vaccineCode: vaccines,
        route: doseRoutes,
        volunteerId: volunteers
      })
    } catch (error) {
      console.error('Error loading event dictionaries:', error)
    }
  }

  // Person search (active only)
  const searchPersons = async (term) => {
    if (!term || term.trim().length < 2) {
      setPersonSearchResults([])
      return
    }
    setPersonSearchLoading(true)
    try {
      const data = await personsApi.search({ page: 0, size: 10 }, { fullName: term })
      const items = (data.content || data || [])
        .filter(p => p.isActive !== false)
        .map(p => ({ id: p.id, label: p.fullName }))
      setPersonSearchResults(items)
    } catch (err) {
      console.error('Error searching persons:', err)
      setPersonSearchResults([])
    } finally {
      setPersonSearchLoading(false)
    }
  }

  // Debounce person search
  useEffect(() => {
    if (personSearchDebounceRef.current) clearTimeout(personSearchDebounceRef.current)
    
    // Only search if personId is not already selected
    if (eventFormData.personId && personSearchTerm) {
      // User has already selected someone, don't search again
      return
    }
    
    personSearchDebounceRef.current = setTimeout(() => {
      searchPersons(personSearchTerm)
    }, 400)
    return () => {
      if (personSearchDebounceRef.current) clearTimeout(personSearchDebounceRef.current)
    }
  }, [personSearchTerm, eventFormData.personId])

  const handleCreateEvent = () => {
    setEditingEvent(null)
    // today yyyy-mm-ddTHH:MM (datetime-local format)
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const hh = String(today.getHours()).padStart(2, '0')
    const min = String(today.getMinutes()).padStart(2, '0')
    const todayStr = `${yyyy}-${mm}-${dd}T${hh}:${min}`

    // default event type = first active option if available
    // Wait a bit for dictionaries to load if they haven't yet
    setTimeout(() => {
      const defaultEventType = (eventDictionaries.eventType && eventDictionaries.eventType.length > 0 && eventDictionaries.eventType[0]?.code) || ''
      setEventFormData(prev => ({
        ...prev,
        eventType: defaultEventType || prev.eventType
      }))
    }, 100)

    setEventFormData({
      animalId: selectedAnimal.id,
      eventType: (eventDictionaries.eventType && eventDictionaries.eventType.length > 0 && eventDictionaries.eventType[0]?.code) || '',
      eventAt: todayStr,
      facilityId: '',
      unitId: '',
      fromFacilityId: '',
      toFacilityId: '',
      fromUnitId: '',
      toUnitId: '',
      outcomeType: '',
      sourceType: '',
      holdType: '',
      personId: '',
      volunteerId: '',
      medEventType: '',
      vaccineCode: '',
      medicationName: '',
      doseText: '',
      route: '',
      labTestName: '',
      details: ''
    })
    setPersonSearchTerm('')
    setPersonSearchResults([])
    setIsEventModalOpen(true)
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    
    // Backend'den gelen eventAt formatını datetime-local input için düzenle
    let eventAtValue = event.eventAt || ''
    if (eventAtValue) {
      // Backend format: "2025-10-31T14:30:00" veya "2025-10-31T14:30:00.000"
      // datetime-local format: "2025-10-31T14:30"
      eventAtValue = eventAtValue.substring(0, 16) // İlk 16 karakter: yyyy-MM-ddTHH:mm
    }
    
    setEventFormData({
      animalId: event.animalId || selectedAnimal.id,
      eventType: event.eventType || '',
      eventAt: eventAtValue,
      facilityId: event.facilityId || '',
      unitId: event.unitId || '',
      fromFacilityId: event.fromFacilityId || '',
      toFacilityId: event.toFacilityId || '',
      fromUnitId: event.fromUnitId || '',
      toUnitId: event.toUnitId || '',
      outcomeType: event.outcomeType || '',
      sourceType: event.sourceType || '',
      holdType: event.holdType || '',
      personId: event.personId || '',
      volunteerId: event.volunteerId || '',
      medEventType: event.medEventType || '',
      vaccineCode: event.vaccineCode || '',
      medicationName: event.medicationName || '',
      doseText: event.doseText || '',
      route: event.route || '',
      labTestName: event.labTestName || '',
      details: event.details || ''
    })
    // If editing and person is selected, show person name in search field
    setPersonSearchTerm(event.personName || '')
    setPersonSearchResults([])
    setIsEventModalOpen(true)
  }

  const handleToggleEventActive = (event) => {
    const isCurrentlyActive = event.isActive
    const action = isCurrentlyActive ? 'arşivlemek' : 'tekrar aktif etmek'
    const actionPast = isCurrentlyActive ? 'arşivlendi' : 'aktif edildi'
    const icon = isCurrentlyActive ? '📦' : '✅'
    const modalType = isCurrentlyActive ? 'warning' : 'success'
    
    setConfirmModal({
      title: isCurrentlyActive ? 'Etkinliği Arşivle' : 'Etkinliği Aktif Et',
      message: `Bu etkinliği ${action} istediğinizden emin misiniz?`,
      icon: icon,
      type: modalType,
      confirmText: isCurrentlyActive ? 'Arşivle' : 'Aktif Et',
      onConfirm: async () => {
        try {
          await animalEventApi.delete(event.id)
          showNotification(`Etkinlik başarıyla ${actionPast}!`, 'success')
          loadAnimalEvents(selectedAnimal.id)
        } catch (error) {
          console.error('Error toggling event:', error)
          showNotification('İşlem başarısız: ' + error.message, 'error')
        }
      }
    })
  }

  const handleEventSubmit = async (e) => {
    e.preventDefault()

    try {
      const eventType = eventFormData.eventType
      
      // Event type'a göre sadece gerekli alanları gönder
      const cleanedData = Object.entries(eventFormData).reduce((acc, [key, value]) => {
        // eventAt için timezone ekle
        if (key === 'eventAt' && value) {
          const date = new Date(value)
          const tzOffset = -date.getTimezoneOffset()
          const tzHours = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, '0')
          const tzMins = String(Math.abs(tzOffset) % 60).padStart(2, '0')
          const tzSign = tzOffset >= 0 ? '+' : '-'
          acc[key] = `${value}:00${tzSign}${tzHours}:${tzMins}`
          return acc
        }

        // Boş değerleri null yap
        if (value === '') {
          acc[key] = null
          return acc
        }

        // Event type'a göre filtrele
        // INTAKE için sadece sourceType, facilityId
        if (eventType === 'INTAKE' && ['outcomeType', 'holdType', 'unitId', 'fromFacilityId', 'toFacilityId', 'fromUnitId', 'toUnitId', 'medEventType', 'vaccineCode', 'medicationName', 'doseText', 'route', 'labTestName'].includes(key)) {
          return acc // Bu alanları gönderme
        }
        
        // TRANSFER için sadece from/to facilities ve units
        if (eventType === 'TRANSFER' && ['sourceType', 'outcomeType', 'holdType', 'facilityId', 'unitId', 'medEventType', 'vaccineCode', 'medicationName', 'doseText', 'route', 'labTestName'].includes(key)) {
          return acc
        }
        
        // OUTCOME için sadece outcomeType, facilityId
        if (eventType === 'OUTCOME' && ['sourceType', 'holdType', 'unitId', 'fromFacilityId', 'toFacilityId', 'fromUnitId', 'toUnitId', 'medEventType', 'vaccineCode', 'medicationName', 'doseText', 'route', 'labTestName'].includes(key)) {
          return acc
        }
        
        // HOLD_START/HOLD_END için sadece holdType, facilityId, unitId
        if ((eventType === 'HOLD_START' || eventType === 'HOLD_END') && ['sourceType', 'outcomeType', 'fromFacilityId', 'toFacilityId', 'fromUnitId', 'toUnitId', 'medEventType', 'vaccineCode', 'medicationName', 'doseText', 'route', 'labTestName'].includes(key)) {
          return acc
        }
        
        // MEDICAL için sadece medical alanları
        if (eventType === 'MEDICAL' && ['sourceType', 'outcomeType', 'holdType', 'fromFacilityId', 'toFacilityId', 'fromUnitId', 'toUnitId', 'unitId'].includes(key)) {
          return acc
        }

        acc[key] = value
        return acc
      }, {})

      console.log('Sending to backend:', cleanedData)

      if (editingEvent) {
        await animalEventApi.update(editingEvent.id, cleanedData)
        showNotification('Etkinlik başarıyla güncellendi!', 'success')
      } else {
        await animalEventApi.create(cleanedData)
        showNotification('Etkinlik başarıyla eklendi!', 'success')
      }

      setIsEventModalOpen(false)
      setEditingEvent(null)
      loadAnimalEvents(selectedAnimal.id)
    } catch (error) {
      console.error('Error saving event:', error)
      showNotification('Kayıt işlemi başarısız: ' + error.message, 'error')
    }
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedAnimal(null)
    setEvents([])
    setEventsPage(0)
  }

  // Reload events when pagination changes
  useEffect(() => {
    if (viewMode === 'events' && selectedAnimal) {
      loadAnimalEvents(selectedAnimal.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsPage, eventsPageSize, showAllEvents, viewMode, selectedAnimal])

  // Artık filtering backend'de yapılıyor - animals direkt kullanılıyor // No client-side filtering if no search term (backend will handle it)

  // Render events view
  if (viewMode === 'events' && selectedAnimal) {
    return (
      <div className="dictionary-management">
        <div className="dictionary-content" style={{ gridColumn: '1 / -1' }}>
          <div className="dictionary-header">
            <div className="dictionary-title-section">
              <button 
                className="btn btn-secondary" 
                onClick={handleBackToList}
                style={{ marginBottom: '10px' }}
              >
                ← Hayvanlar Listesine Dön
              </button>
              <h2>
                <span className="dictionary-icon-large">📅</span>
                {selectedAnimal.name} - Etkinlikler
              </h2>
              <p className="dictionary-subtitle">
                {selectedAnimal.speciesName} • {selectedAnimal.breedName || 'Bilinmeyen Irk'} • 
                {selectedAnimal.sex && ` ${selectedAnimal.sex}`}
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleCreateEvent}>
              + Yeni Etkinlik Ekle
            </button>
          </div>

          <div className="dictionary-toolbar">
            <div className="toolbar-filters">
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={showAllEvents}
                  onChange={(e) => setShowAllEvents(e.target.checked)}
                  className="filter-checkbox"
                />
                <span className="filter-checkbox-text">
                  📦 Arşivlenmişleri de göster
                </span>
              </label>
            </div>
            <div className="toolbar-info">
              <span className="item-count">
                Toplam {eventsTotalElements} etkinlik
                {eventsTotalElements > 0 && ` (Sayfa ${eventsPage + 1} / ${eventsTotalPages})`}
                {showAllEvents && <span className="inactive-badge"> arşiv dahil</span>}
              </span>
            </div>
          </div>

          {eventsLoading ? (
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
                    <th style={{ width: '18%' }}>Etkinlik Tipi</th>
                    <th style={{ width: '13%' }}>Tarih</th>
                    <th style={{ width: '13%' }}>Oluşturulma</th>
                    <th style={{ width: '18%' }}>Tesis</th>
                    <th style={{ width: '15%' }}>İlgili Kişi</th>
                    <th style={{ width: '23%' }}>Notlar</th>
                    <th style={{ width: '120px' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        Henüz etkinlik eklenmemiş
                      </td>
                    </tr>
                  ) : (
                    events.map((event, index) => {
                      const isActive = event.isActive
                      return (
                        <tr key={event.id} className={!isActive ? 'row-inactive' : ''}>
                          <td>{index + 1}</td>
                          <td>
                            {event.eventTypeLabel ? `${event.eventTypeLabel} (${event.eventType})` : (event.eventType || '-')}
                            {!isActive && <span className="badge-archived">Arşiv</span>}
                          </td>
                          <td>
                            {event.eventAt ? new Date(event.eventAt).toLocaleString('tr-TR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </td>
                          <td>
                            {event.createdAt ? new Date(event.createdAt).toLocaleString('tr-TR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </td>
                          <td>{event.facilityName || '-'}</td>
                          <td>{event.personName || '-'}</td>
                          <td>{event.details || '-'}</td>
                          <td>
                            <div className="action-buttons">
                              {event.isReadOnly ? (
                                <button
                                  className="action-btn view"
                                  onClick={() => handleEditEvent(event)}
                                  title="Görüntüle"
                                >
                                  👁️
                                </button>
                              ) : (
                                <>
                                  <button
                                    className="action-btn edit"
                                    onClick={() => handleEditEvent(event)}
                                    title="Düzenle"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="action-btn delete"
                                    onClick={() => handleToggleEventActive(event)}
                                    title="Arşivle / Aktif Et"
                                  >
                                    🔄
                                  </button>
                                </>
                              )}
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

          {/* Events Pagination */}
          {!eventsLoading && eventsTotalElements > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Gösterilen: {events.length === 0 ? 0 : (eventsPage * eventsPageSize) + 1}-{Math.min((eventsPage + 1) * eventsPageSize, eventsTotalElements)} / {eventsTotalElements}
              </div>
              
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => setEventsPage(0)}
                  disabled={!eventsHasPrevious}
                  title="İlk sayfa"
                >
                  ⏮
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => setEventsPage(eventsPage - 1)}
                  disabled={!eventsHasPrevious}
                  title="Önceki sayfa"
                >
                  ◀
                </button>
                
                <div className="pagination-pages">
                  {Array.from({ length: eventsTotalPages }, (_, i) => {
                    const showPage = (
                      i === 0 ||
                      i === eventsTotalPages - 1 ||
                      (i >= eventsPage - 1 && i <= eventsPage + 1)
                    )
                    if (!showPage) {
                      if (i === eventsPage - 2 || i === eventsPage + 2) {
                        return <span key={i} className="pagination-ellipsis">...</span>
                      }
                      return null
                    }
                    return (
                      <button
                        key={i}
                        className={`pagination-page ${i === eventsPage ? 'active' : ''}`}
                        onClick={() => setEventsPage(i)}
                      >
                        {i + 1}
                      </button>
                    )
                  })}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => setEventsPage(eventsPage + 1)}
                  disabled={!eventsHasNext}
                  title="Sonraki sayfa"
                >
                  ▶
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => setEventsPage(eventsTotalPages - 1)}
                  disabled={!eventsHasNext}
                  title="Son sayfa"
                >
                  ⏭
                </button>
              </div>

              <div className="pagination-size-selector">
                <label htmlFor="eventsPageSize">Sayfa başına:</label>
                <select
                  id="eventsPageSize"
                  value={eventsPageSize}
                  onChange={(e) => {
                    setEventsPageSize(Number(e.target.value))
                    setEventsPage(0)
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

          {/* Event Modal */}
          {isEventModalOpen && (
            <div className="modal-overlay-dict">
              <div className="modal-dict modal-dict-large">
                <div className="modal-dict-header">
                  <h3>
                    {editingEvent?.isReadOnly ? '👁️ Etkinlik Detayları' : (editingEvent ? '📅 Etkinliği Düzenle' : '📅 Yeni Etkinlik Ekle')}
                    {' - '}
                    <span style={{ fontWeight: 'normal', color: '#666' }}>{selectedAnimal.name}</span>
                  </h3>
                  <button className="modal-close-btn" onClick={() => setIsEventModalOpen(false)}>
                    ✕
                  </button>
                </div>
                <form onSubmit={handleEventSubmit} className="modal-dict-body">
                  <fieldset disabled={editingEvent?.isReadOnly} style={{ border: 'none', padding: 0, margin: 0 }}>
                  <div className="form-grid-2">

                    {/* Event Type */}
                    <div className="form-group-dict">
                      <label htmlFor="eventType">Etkinlik Tipi *</label>
                      <select
                        id="eventType"
                        value={eventFormData.eventType}
                        onChange={(e) => {
                          const newType = e.target.value
                          // Event type değiştiğinde diğer type'lara ait alanları temizle
                          setEventFormData({
                            ...eventFormData,
                            eventType: newType,
                            // Tüm özel alanları temizle
                            sourceType: '',
                            outcomeType: '',
                            holdType: '',
                            facilityId: '',
                            unitId: '',
                            fromFacilityId: '',
                            toFacilityId: '',
                            fromUnitId: '',
                            toUnitId: '',
                            medEventType: '',
                            vaccineCode: '',
                            medicationName: '',
                            doseText: '',
                            route: '',
                            labTestName: ''
                          })
                        }}
                        required
                        disabled={editingEvent?.isReadOnly}
                        className="form-input-dict"
                      >
                        <option value="">Seçiniz</option>
                        {(eventDictionaries.eventType || []).map((opt) => (
                          <option key={opt.code} value={opt.code}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Event Date */}
                    <div className="form-group-dict">
                      <label htmlFor="eventAt">Etkinlik Tarihi ve Saati *</label>
                      <input
                        type="datetime-local"
                        id="eventAt"
                        value={eventFormData.eventAt}
                        onChange={(e) => setEventFormData({ ...eventFormData, eventAt: e.target.value })}
                        required
                        disabled={editingEvent?.isReadOnly}
                        className="form-input-dict"
                      />
                      <small className="form-hint">Tarih ve saat seçiniz</small>
                    </div>

                    {/* INTAKE: Source Type */}
                    {eventFormData.eventType === 'INTAKE' && (
                      <div className="form-group-dict">
                        <label htmlFor="sourceType">Kaynak Tipi *</label>
                        <select
                          id="sourceType"
                          value={eventFormData.sourceType}
                          onChange={(e) => setEventFormData({ ...eventFormData, sourceType: e.target.value })}
                          required
                          className="form-input-dict"
                        >
                          <option value="">Seçiniz</option>
                          {(eventDictionaries.sourceType || []).map((opt) => (
                            <option key={opt.code} value={opt.code}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* TRANSFER: From/To Facilities and Units */}
                    {eventFormData.eventType === 'TRANSFER' && (
                      <>
                        <div className="form-group-dict">
                          <label htmlFor="fromFacilityId">Kaynak Tesis *</label>
                          <select
                            id="fromFacilityId"
                            value={eventFormData.fromFacilityId}
                            onChange={(e) => setEventFormData({ ...eventFormData, fromFacilityId: e.target.value })}
                            required
                            className="form-input-dict"
                          >
                            <option value="">Seçiniz</option>
                            {(eventDictionaries.facilityId || []).map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group-dict">
                          <label htmlFor="fromUnitId">Kaynak Birim *</label>
                          <select
                            id="fromUnitId"
                            value={eventFormData.fromUnitId}
                            onChange={(e) => setEventFormData({ ...eventFormData, fromUnitId: e.target.value })}
                            required
                            className="form-input-dict"
                          >
                            <option value="">Seçiniz</option>
                            {(eventDictionaries.unitId || []).map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group-dict">
                          <label htmlFor="toFacilityId">Hedef Tesis *</label>
                          <select
                            id="toFacilityId"
                            value={eventFormData.toFacilityId}
                            onChange={(e) => setEventFormData({ ...eventFormData, toFacilityId: e.target.value })}
                            required
                            className="form-input-dict"
                          >
                            <option value="">Seçiniz</option>
                            {(eventDictionaries.facilityId || []).map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group-dict">
                          <label htmlFor="toUnitId">Hedef Birim *</label>
                          <select
                            id="toUnitId"
                            value={eventFormData.toUnitId}
                            onChange={(e) => setEventFormData({ ...eventFormData, toUnitId: e.target.value })}
                            required
                            className="form-input-dict"
                          >
                            <option value="">Seçiniz</option>
                            {(eventDictionaries.unitId || []).map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {/* OUTCOME: Outcome Type */}
                    {eventFormData.eventType === 'OUTCOME' && (
                      <div className="form-group-dict">
                        <label htmlFor="outcomeType">Sonuç Tipi *</label>
                        <select
                          id="outcomeType"
                          value={eventFormData.outcomeType}
                          onChange={(e) => setEventFormData({ ...eventFormData, outcomeType: e.target.value })}
                          required
                          className="form-input-dict"
                        >
                          <option value="">Seçiniz</option>
                          {(eventDictionaries.outcomeType || []).map((opt) => (
                            <option key={opt.code} value={opt.code}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* HOLD_START/HOLD_END: Hold Type and Unit */}
                    {(eventFormData.eventType === 'HOLD_START' || eventFormData.eventType === 'HOLD_END') && (
                      <>
                        <div className="form-group-dict">
                          <label htmlFor="holdType">Bekleme Tipi *</label>
                          <select
                            id="holdType"
                            value={eventFormData.holdType}
                            onChange={(e) => setEventFormData({ ...eventFormData, holdType: e.target.value })}
                            required
                            className="form-input-dict"
                          >
                            <option value="">Seçiniz</option>
                            {(eventDictionaries.holdType || []).map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group-dict">
                          <label htmlFor="unitId">Birim *</label>
                          <select
                            id="unitId"
                            value={eventFormData.unitId}
                            onChange={(e) => setEventFormData({ ...eventFormData, unitId: e.target.value })}
                            required
                            className="form-input-dict"
                          >
                            <option value="">Seçiniz</option>
                            {(eventDictionaries.unitId || []).map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {/* MEDICAL: Medical Event Type */}
                    {eventFormData.eventType === 'MEDICAL' && (
                      <>
                        <div className="form-group-dict">
                          <label htmlFor="medEventType">Tıbbi Olay Tipi *</label>
                          <select
                            id="medEventType"
                            value={eventFormData.medEventType}
                            onChange={(e) => setEventFormData({ ...eventFormData, medEventType: e.target.value })}
                            required
                            className="form-input-dict"
                          >
                            <option value="">Seçiniz</option>
                            {(eventDictionaries.medEventType || []).map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group-dict">
                          <label htmlFor="vaccineCode">Aşı</label>
                          <select
                            id="vaccineCode"
                            value={eventFormData.vaccineCode}
                            onChange={(e) => setEventFormData({ ...eventFormData, vaccineCode: e.target.value })}
                            className="form-input-dict"
                          >
                            <option value="">Seçiniz</option>
                            {(eventDictionaries.vaccineCode || []).map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group-dict">
                          <label htmlFor="medicationName">İlaç Adı</label>
                          <input
                            type="text"
                            id="medicationName"
                            value={eventFormData.medicationName}
                            onChange={(e) => setEventFormData({ ...eventFormData, medicationName: e.target.value })}
                            className="form-input-dict"
                            placeholder="İlaç adı"
                          />
                        </div>
                        <div className="form-group-dict">
                          <label htmlFor="doseText">Doz</label>
                          <input
                            type="text"
                            id="doseText"
                            value={eventFormData.doseText}
                            onChange={(e) => setEventFormData({ ...eventFormData, doseText: e.target.value })}
                            className="form-input-dict"
                            placeholder="Örn: 10mg"
                          />
                        </div>
                      </>
                    )}

                    {/* Facility - sadece TRANSFER olmayan event type'lar için */}
                    {eventFormData.eventType !== 'TRANSFER' && (
                      <div className="form-group-dict">
                        <label htmlFor="facilityId">Tesis</label>
                        <select
                          id="facilityId"
                          value={eventFormData.facilityId}
                          onChange={(e) => setEventFormData({ ...eventFormData, facilityId: e.target.value })}
                          className="form-input-dict"
                        >
                          <option value="">Seçiniz</option>
                          {(eventDictionaries.facilityId || []).map((opt) => (
                            <option key={opt.code} value={opt.code}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Person (searchable) */}
                    <div className="form-group-dict" style={{ position: 'relative' }}>
                      <label htmlFor="personSearch">İlgili Kişi</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          id="personSearch"
                          value={personSearchTerm}
                          onChange={(e) => {
                            setPersonSearchTerm(e.target.value)
                            if (!e.target.value) {
                              setEventFormData({ ...eventFormData, personId: '' })
                            }
                          }}
                          placeholder="Kişi adı ile ara... (min 2 karakter)"
                          className="form-input-dict"
                          autoComplete="off"
                        />
                        {personSearchLoading && (
                          <div style={{ 
                            position: 'absolute', 
                            right: '10px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            fontSize: '12px',
                            color: '#999'
                          }}>
                            ⏳ Aranıyor...
                          </div>
                        )}
                      </div>
                      {personSearchTerm.length > 0 && personSearchTerm.length < 2 && (
                        <small className="form-hint" style={{ color: '#f59e0b' }}>
                          En az 2 karakter girin
                        </small>
                      )}
                      {!eventFormData.personId && personSearchTerm.length >= 2 && personSearchResults.length > 0 && (
                        <div style={{ 
                          position: 'absolute', 
                          zIndex: 1000, 
                          background: '#fff', 
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          width: '100%',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          marginTop: '4px'
                        }}>
                          {personSearchResults.map((p) => (
                            <div
                              key={p.id}
                              style={{ 
                                padding: '10px 12px', 
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#f0f9ff'}
                              onMouseLeave={(e) => e.target.style.background = '#fff'}
                              onClick={() => {
                                // First set the person info
                                setEventFormData({ ...eventFormData, personId: p.id })
                                setPersonSearchTerm(p.label)
                                // Then clear results immediately
                                setPersonSearchResults([])
                              }}
                            >
                              {p.label}
                            </div>
                          ))}
                        </div>
                      )}
                      {!eventFormData.personId && personSearchTerm.length >= 2 && personSearchResults.length === 0 && !personSearchLoading && (
                        <small className="form-hint" style={{ color: '#ef4444' }}>
                          Sonuç bulunamadı
                        </small>
                      )}
                      {eventFormData.personId && (
                        <small className="form-hint" style={{ color: '#10b981' }}>
                          ✓ Kişi seçildi - {personSearchTerm}
                          {' '}
                          <button
                            type="button"
                            onClick={() => {
                              setEventFormData({ ...eventFormData, personId: '' })
                              setPersonSearchTerm('')
                            }}
                            style={{
                              fontSize: '11px',
                              padding: '2px 6px',
                              marginLeft: '8px',
                              cursor: 'pointer',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '3px'
                            }}
                          >
                            Temizle
                          </button>
                        </small>
                      )}
                      {!eventFormData.personId && personSearchTerm.length < 2 && (
                        <small className="form-hint">
                          Veteriner, bakıcı vb.
                        </small>
                      )}
                    </div>

                    {/* Details (Notes) */}
                    <div className="form-group-dict" style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="details">Notlar</label>
                      <textarea
                        id="details"
                        value={eventFormData.details}
                        onChange={(e) => setEventFormData({ ...eventFormData, details: e.target.value })}
                        placeholder="Etkinlik detayları, gözlemler vb."
                        className="form-input-dict"
                        rows="4"
                      />
                    </div>
                  </div>
                  </fieldset>

                  <div className="modal-dict-footer">
                    {editingEvent?.isReadOnly ? (
                      <button type="button" className="btn btn-primary" onClick={() => setIsEventModalOpen(false)}>
                        Kapat
                      </button>
                    ) : (
                      <>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEventModalOpen(false)}>
                          İptal
                        </button>
                        <button type="submit" className="btn btn-primary">
                          {editingEvent ? 'Güncelle' : 'Kaydet'}
                        </button>
                      </>
                    )}
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
      </div>
    )
  }

  // Render animals list view
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
              Tüm hayvanları yönetin - Etkinlikleri görmek için hayvana tıklayın
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
                      <tr 
                        key={animal.id} 
                        className={!isActive ? 'row-inactive' : ''}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleAnimalClick(animal)}
                        title="Hayvan etkinliklerini görüntülemek için tıklayın"
                      >
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
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="action-buttons">
                            <button
                              className="action-btn edit"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(animal)
                              }}
                              title="Düzenle"
                            >
                              ✏️
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleActive(animal)
                              }}
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

