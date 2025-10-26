import { useState, useEffect } from 'react'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)
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

  // Load items
  useEffect(() => {
    loadItems()
  }, [])

  // Load dictionaries
  useEffect(() => {
    loadDictionaries()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await apiHelpers.getAll()
      setItems(data || [])
    } catch (error) {
      console.error('Error loading items:', error)
      showNotification(`${entityConfig.labelPlural} yüklenirken hata oluştu`, 'error')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

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

  const handleDelete = async (item) => {
    const itemName = entityConfig.getDisplayName ? entityConfig.getDisplayName(item) : item.id
    if (!confirm(`"${itemName}" kaydını silmek istediğinizden emin misiniz?`)) return

    try {
      await apiHelpers.delete(item.id)
      showNotification(`${entityConfig.labelSingle} başarıyla silindi!`, 'success')
      loadItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      showNotification('Silme işlemi başarısız: ' + error.message, 'error')
    }
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

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true
    const searchFields = entityConfig.searchFields || ['name', 'code']
    return searchFields.some(field => 
      item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

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
          <div className="search-box">
            <input
              type="text"
              placeholder={`${entityConfig.labelSingle} ara...`}
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
                  filteredItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      {entityConfig.tableColumns.map((col, idx) => (
                        <td key={idx}>
                          {col.render ? col.render(item[col.field], item) : (item[col.field] || '-')}
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
    </div>
  )
}

