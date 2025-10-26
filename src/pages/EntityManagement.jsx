import { useState, useEffect, useRef, useCallback } from 'react'
import { getDictionaryItems } from '../api/dictionary.js'

/**
 * Generic Entity Management Component
 * Dinamik olarak farklı entity'ler için kullanılabilir
 */
export default function EntityManagement({ 
  entityConfig,
  apiHelpers
}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  // Search values per backend param (from entityConfig.searchFields)
  const [searchTerm, setSearchTerm] = useState('') // fallback (when no searchFields provided)
  const [searchValues, setSearchValues] = useState({})
  const [showAll, setShowAll] = useState(false) // Backend'in 'all' parametresi
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  // Debounce
  const searchDebounceRef = useRef(null)
  const [notification, setNotification] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null) // { title, message, onConfirm, confirmText, type, icon }
  const [dictionaries, setDictionaries] = useState({})

  // Form data
  const [formData, setFormData] = useState(
    entityConfig.fields.reduce((acc, field) => {
      acc[field.name] = ''
      return acc
    }, {})
  )

  // Notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Initialize searchValues based on config
  useEffect(() => {
    const fields = Array.isArray(entityConfig.searchFields) ? entityConfig.searchFields : []
    const initial = fields.reduce((acc, f) => { acc[f] = ''; return acc }, {})
    setSearchValues(initial)
    setSearchTerm('')
    setCurrentPage(0)
  }, [entityConfig])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0)
  }, [showAll, searchTerm, JSON.stringify(searchValues)])

  // Debounced load
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }
    searchDebounceRef.current = setTimeout(() => {
      loadItems()
    }, 600)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [showAll, searchTerm, JSON.stringify(searchValues), currentPage, pageSize])

  // Load dictionaries
  useEffect(() => {
    loadDictionaries()
  }, [])

  const loadItems = useCallback(async () => {
    setLoading(true)
    try {
      // Eğer arama metni varsa search endpoint'ini kullanmayı deneyelim; yoksa paged getAll
      const fields = Array.isArray(entityConfig.searchFields) ? entityConfig.searchFields : []
      const hasPerFieldSearch = fields.some((f) => (searchValues[f] || '').toString().trim() !== '')
      const hasSearch = hasPerFieldSearch || (!!searchTerm && searchTerm.trim())
      let response
      if (hasSearch && apiHelpers.search) {
        // Build extra params only for fields with value
        const extraParams = {}
        if (fields.length > 0) {
          fields.forEach((field) => {
            const v = (searchValues[field] || '').toString().trim()
            if (v) extraParams[field] = v
          })
        }
        // If there are per-field params, don't send generic 'search'
        const params = {
          all: showAll,
          page: currentPage,
          size: pageSize
        }
        if (fields.length === 0 && searchTerm.trim()) {
          params.search = searchTerm.trim()
        }
        response = await apiHelpers.search(params, extraParams)
      } else {
        response = await apiHelpers.getAll({
          all: showAll,
          page: currentPage,
          size: pageSize
        })
      }

      setItems(response.content || [])
      setTotalElements(response.totalElements || 0)
      setTotalPages(response.totalPages || 0)
      setHasNext(response.hasNext || false)
      setHasPrevious(response.hasPrevious || false)
    } catch (error) {
      console.error('Error loading items:', error)
      showNotification(`${entityConfig.labelPlural} yüklenirken hata oluştu`, 'error')
      setItems([])
      setTotalElements(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }, [apiHelpers, showAll, searchTerm, searchValues, currentPage, pageSize, entityConfig.labelPlural, entityConfig.searchFields])

  const loadDictionaries = async () => {
    try {
      const selectFields = entityConfig.fields.filter(f => f.type === 'select')
      console.log('Loading select fields:', selectFields)
      
      const fieldData = await Promise.all(
        selectFields.map(async (field) => {
          try {
            let data = []
            
            if (field.dictionary) {
              // Load from dictionary API
              console.log(`Loading dictionary: ${field.dictionary}`)
              data = await getDictionaryItems(field.dictionary)
              console.log(`Loaded ${data.length} items from dictionary ${field.dictionary}`)
            } else if (field.entityEndpoint) {
              // Load from entity API
              const url = `http://localhost:8000/api/${field.entityEndpoint}`
              console.log(`Loading entity from: ${url}`)
              const response = await fetch(url)
              console.log(`Entity response status: ${response.status}`)
              
              if (response.ok) {
                const entities = await response.json()
                console.log(`Loaded ${entities.length} entities from ${field.entityEndpoint}`)
                
                // Transform entity data to dictionary format
                const valueField = field.entityValueField || 'code'
                const labelField = field.entityLabelField || 'name'
                
                data = entities.map(entity => ({
                  code: entity[valueField] || entity.id || entity.code,
                  label: entity[labelField] || entity.name || entity.commonName || entity.label || entity.code
                }))
                console.log(`Transformed ${field.name} data:`, data)
              } else {
                console.error(`Failed to load entity ${field.entityEndpoint}: ${response.status}`)
              }
            }
            
            return { key: field.name, data }
          } catch (error) {
            console.error(`Error loading field ${field.name}:`, error)
            return { key: field.name, data: [] }
          }
        })
      )

      const dictionariesObj = fieldData.reduce((acc, { key, data }) => {
        acc[key] = data
        return acc
      }, {})

      console.log('Final dictionaries object:', dictionariesObj)
      setDictionaries(dictionariesObj)
    } catch (error) {
      console.error('Error loading dictionaries:', error)
    }
  }

  const handleCreate = () => {
    setEditingItem(null)
    const initialData = entityConfig.fields.reduce((acc, field) => {
      acc[field.name] = ''
      return acc
    }, {})
    setFormData(initialData)
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    const editData = entityConfig.fields.reduce((acc, field) => {
      acc[field.name] = item[field.name] || ''
      return acc
    }, {})
    setFormData(editData)
    setIsModalOpen(true)
  }

  const handleToggleActive = (item) => {
    // Backend'de DELETE endpoint artık toggle olarak çalışıyor
    const itemName = entityConfig.getDisplayName ? entityConfig.getDisplayName(item) : item.id
    const isCurrentlyActive = item.isActive
    const action = isCurrentlyActive ? 'arşivlemek' : 'tekrar aktif etmek'
    const actionPast = isCurrentlyActive ? 'arşivlendi' : 'aktif edildi'
    const icon = isCurrentlyActive ? '📦' : '✅'
    const modalType = isCurrentlyActive ? 'warning' : 'success'
    
    setConfirmModal({
      title: isCurrentlyActive ? 'Kaydı Arşivle' : 'Kaydı Aktif Et',
      message: `"${itemName}" kaydını ${action} istediğinizden emin misiniz?`,
      icon: icon,
      type: modalType,
      confirmText: isCurrentlyActive ? 'Arşivle' : 'Aktif Et',
      onConfirm: async () => {
        try {
          await apiHelpers.delete(item.id) // Backend'de toggle olarak çalışıyor
          showNotification(`${entityConfig.labelSingle} başarıyla ${actionPast}!`, 'success')
          loadItems()
        } catch (error) {
          console.error('Error toggling item active status:', error)
          showNotification('İşlem başarısız: ' + error.message, 'error')
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingItem) {
        await apiHelpers.update(editingItem.id, formData)
        showNotification(`${entityConfig.labelSingle} başarıyla güncellendi!`, 'success')
      } else {
        await apiHelpers.create(formData)
        showNotification(`${entityConfig.labelSingle} başarıyla eklendi!`, 'success')
      }

      setIsModalOpen(false)
      setEditingItem(null)
      loadItems()
    } catch (error) {
      console.error('Error saving item:', error)
      showNotification('Kayıt işlemi başarısız: ' + error.message, 'error')
    }
  }

  // Server-side filtering aktif, items doğrudan kullanılacak
  const filteredItems = items

  const renderField = (field) => {
    const value = formData[field.name] || ''

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <input
            type={field.type}
            id={field.name}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            required={field.required}
            placeholder={field.placeholder}
            className="form-input-dict"
          />
        )

      case 'textarea':
        return (
          <textarea
            id={field.name}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            required={field.required}
            placeholder={field.placeholder}
            className="form-input-dict"
            rows={field.rows || 4}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            id={field.name}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            required={field.required}
            className="form-input-dict"
          />
        )

      case 'select':
        // Entity endpoint veya dictionary'den gelen data
        const options = dictionaries[field.name] || []
        
        if (field.dictionary || field.entityEndpoint) {
          return (
            <select
              id={field.name}
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              required={field.required}
              className="form-input-dict"
            >
              <option value="">Seçiniz</option>
              {options.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          )
        } else if (field.options) {
          // Static options
          return (
            <select
              id={field.name}
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              required={field.required}
              className="form-input-dict"
            >
              <option value="">Seçiniz</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )
        }
        break

      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={field.name}
            checked={value === true || value === 'true'}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
            className="form-checkbox"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="dictionary-management">
      <div className="dictionary-content" style={{ gridColumn: '1 / -1' }}>
        <div className="dictionary-header">
          <div className="dictionary-title-section">
            <h2>
              <span className="dictionary-icon-large">{entityConfig.icon}</span>
              {entityConfig.labelPlural}
            </h2>
            <p className="dictionary-subtitle">
              {entityConfig.description || `Tüm ${entityConfig.labelPlural.toLowerCase()} yönetin`}
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            + Yeni {entityConfig.labelSingle} Ekle
          </button>
        </div>

        <div className="dictionary-toolbar">
          <div className="search-box-group">
            {Array.isArray(entityConfig.searchFields) && entityConfig.searchFields.length > 0 ? (
              entityConfig.searchFields.map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={`🔍 ${field} ...`}
                  value={searchValues[field] || ''}
                  onChange={(e) => setSearchValues({ ...searchValues, [field]: e.target.value })}
                  className="search-input"
                  style={{ flex: 1 }}
                />
              ))
            ) : (
              <input
                type="text"
                placeholder={`🔍 ${entityConfig.labelSingle} ara...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                style={{ flex: 2 }}
              />
            )}
            {(searchTerm || (Object.values(searchValues).some(v => (v || '').toString().trim() !== ''))) && (
              <button
                className="btn-clear-search"
                onClick={() => { setSearchTerm(''); setSearchValues(Object.fromEntries((entityConfig.searchFields||[]).map(f => [f, '']))); }}
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
                  {entityConfig.tableColumns.map((col, idx) => (
                    <th key={idx} style={col.width ? { width: col.width } : {}}>
                      {col.label}
                    </th>
                  ))}
                  <th style={{ width: '120px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={entityConfig.tableColumns.length + 2} className="empty-state">
                      {searchTerm ? 'Arama sonucu bulunamadı' : `Henüz ${entityConfig.labelSingle.toLowerCase()} eklenmemiş`}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => {
                    const isActive = item.isActive
                    return (
                      <tr key={item.id} className={!isActive ? 'row-inactive' : ''}>
                        <td>{index + 1}</td>
                        {entityConfig.tableColumns.map((col, idx) => (
                          <td key={idx}>
                            {col.render ? col.render(item[col.field], item) : (item[col.field] || '-')}
                            {idx === 0 && !isActive && <span className="badge-archived">Arşiv</span>}
                          </td>
                        ))}
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
                              onClick={() => handleToggleActive(item)}
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
              Gösterilen: {items.length === 0 ? 0 : (currentPage * pageSize) + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} / {totalElements}
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
                  const showPage = (
                    i === 0 ||
                    i === totalPages - 1 ||
                    (i >= currentPage - 1 && i <= currentPage + 1)
                  )
                  if (!showPage) {
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
                  setCurrentPage(0)
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
          <div className="modal-dict modal-dict-large">
            <div className="modal-dict-header">
              <h3>{editingItem ? `${entityConfig.labelSingle} Düzenle` : `Yeni ${entityConfig.labelSingle} Ekle`}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-dict-body">
              <div className={entityConfig.formLayout === 'single' ? '' : 'form-grid-2'}>
                {entityConfig.fields.map((field) => (
                  <div 
                    key={field.name} 
                    className="form-group-dict"
                    style={field.fullWidth ? { gridColumn: '1 / -1' } : {}}
                  >
                    <label htmlFor={field.name}>
                      {field.label} {field.required && '*'}
                    </label>
                    {renderField(field)}
                    {field.hint && (
                      <small className="form-hint">{field.hint}</small>
                    )}
                  </div>
                ))}
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

