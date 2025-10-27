import { useState } from 'react'
import DictionaryManagement from './DictionaryManagement.jsx'
import EntityManagement from './EntityManagement.jsx'
import { 
  SPECIES_CONFIG, 
  BREED_CONFIG, 
  FACILITY_CONFIG,
  ZONE_CONFIG,
  UNIT_CONFIG,
  ASSET_CONFIG
} from '../config/entityConfigs.js'
import { createApiHelpers } from '../api/genericApi.js'

// Dictionary configurations (sadece dictionary'ler, entity'ler değil)
const DICTIONARIES = [
  { id: 'asset-status', name: 'AssetStatus', label: 'Varlık Durumu', icon: '📦', type: 'dictionary' },
  { id: 'asset-type', name: 'AssetType', label: 'Varlık Tipi', icon: '🏷️', type: 'dictionary' },
  { id: 'color', name: 'Color', label: 'Renk', icon: '🎨', type: 'dictionary' },
  { id: 'domestic-status', name: 'DomesticStatus', label: 'Evcillik Durumu', icon: '🏠', type: 'dictionary' },
  { id: 'dose-route', name: 'DoseRoute', label: 'Doz Yolu', icon: '💉', type: 'dictionary' },
  { id: 'event-type', name: 'EventType', label: 'Etkinlik Tipi', icon: '📅', type: 'dictionary' },
  { id: 'facility-type', name: 'FacilityType', label: 'Tesis Tipi', icon: '🏢', type: 'dictionary' },
  { id: 'health-flag', name: 'HealthFlag', label: 'Sağlık Durumu', icon: '🏥', type: 'dictionary' },
  { id: 'hold-type', name: 'HoldType', label: 'Bekleme Tipi', icon: '⏸️', type: 'dictionary' },
  { id: 'med-event-type', name: 'MedEventType', label: 'Tıbbi Olay Tipi', icon: '🩺', type: 'dictionary' },
  { id: 'observation-category', name: 'ObservationCategory', label: 'Gözlem Kategorisi', icon: '👁️', type: 'dictionary' },
  { id: 'organization', name: 'Organization', label: 'Organizasyon', icon: '🏛️', type: 'dictionary' },
  { id: 'outcome-type', name: 'OutcomeType', label: 'Sonuç Tipi', icon: '🎯', type: 'dictionary' },
  { id: 'placement-status', name: 'PlacementStatus', label: 'Yerleştirme Durumu', icon: '📍', type: 'dictionary' },
  { id: 'placement-type', name: 'PlacementType', label: 'Yerleştirme Tipi', icon: '🏡', type: 'dictionary' },
  { id: 'service-type', name: 'ServiceType', label: 'Hizmet Tipi', icon: '🔧', type: 'dictionary' },
  { id: 'sex', name: 'Sex', label: 'Cinsiyet', icon: '⚧️', type: 'dictionary' },
  { id: 'size', name: 'Size', label: 'Boyut', icon: '📏', type: 'dictionary' },
  { id: 'source-type', name: 'SourceType', label: 'Kaynak Tipi', icon: '📥', type: 'dictionary' },
  { id: 'temperament', name: 'Temperament', label: 'Mizaç', icon: '😊', type: 'dictionary' },
  { id: 'training-level', name: 'TrainingLevel', label: 'Eğitim Seviyesi', icon: '🎓', type: 'dictionary' },
  { id: 'unit-type', name: 'UnitType', label: 'Birim Tipi', icon: '📊', type: 'dictionary' },
  { id: 'vaccine', name: 'Vaccine', label: 'Aşı', icon: '💊', type: 'dictionary' },
  { id: 'volunteer-area', name: 'VolunteerAreaDictionary', label: 'Gönüllü Bölgesi', icon: '🗺️', type: 'dictionary' },
  { id: 'volunteer-status', name: 'VolunteerStatus', label: 'Gönüllü Durumu', icon: '👋', type: 'dictionary' },
  { id: 'zone-purpose', name: 'ZonePurpose', label: 'Bölge Amacı', icon: '🌍', type: 'dictionary' }
]

// Entity configurations
const ENTITIES = [
  { id: 'assets', config: ASSET_CONFIG, apiEndpoint: 'assets', icon: '📦', label: 'Varlıklar' },
  { id: 'breeds', config: BREED_CONFIG, apiEndpoint: 'breeds', icon: '🐕', label: 'Irklar' },
  { id: 'facilities', config: FACILITY_CONFIG, apiEndpoint: 'facilities', icon: '🏢', label: 'Tesisler' },
  { id: 'species', config: SPECIES_CONFIG, apiEndpoint: 'species', icon: '🦁', label: 'Türler' },
  { id: 'units', config: UNIT_CONFIG, apiEndpoint: 'facility-units', icon: '🚪', label: 'Birimler' },
  { id: 'zones', config: ZONE_CONFIG, apiEndpoint: 'facility-zones', icon: '🗺️', label: 'Bölgeler' }
]

export default function PredefinitionsManagement() {
  const [selectedItem, setSelectedItem] = useState(DICTIONARIES[0])
  const [sidebarSearchTerm, setSidebarSearchTerm] = useState('')

  // Tüm itemleri birleştir ve sırala
  const allItems = [
    ...DICTIONARIES.map(d => ({ ...d, type: 'dictionary' })),
    ...ENTITIES.map(e => ({ ...e, type: 'entity' }))
  ].sort((a, b) => a.label.localeCompare(b.label, 'tr'))

  // Filtreleme
  const filteredItems = allItems.filter(item =>
    item.label.toLowerCase().includes(sidebarSearchTerm.toLowerCase()) ||
    item.name?.toLowerCase().includes(sidebarSearchTerm.toLowerCase())
  )

  return (
    <div className="dictionary-management">
      <div className="dictionary-sidebar">
        <div className="dictionary-sidebar-header">
          <h3>Ön Tanımlamalar</h3>
          <span className="dictionary-count">{filteredItems.length}</span>
        </div>
        
        {/* Sidebar Search Input */}
        <div className="dictionary-sidebar-search">
          <input
            type="text"
            placeholder="🔍 Tanım ara..."
            value={sidebarSearchTerm}
            onChange={(e) => setSidebarSearchTerm(e.target.value)}
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
          {filteredItems.map((item) => (
            <button
              key={item.id}
              className={`dictionary-item ${selectedItem.id === item.id ? 'active' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              <span className="dictionary-icon">{item.icon}</span>
              <span className="dictionary-label">{item.label}</span>
              {item.type === 'entity' && <span className="entity-badge">Entity</span>}
            </button>
          ))}
          {filteredItems.length === 0 && (
            <div className="dictionary-empty-search">
              <p>Sonuç bulunamadı</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {selectedItem.type === 'dictionary' ? (
          <DictionaryManagement selectedDictionaryId={selectedItem.id} />
        ) : (
          <EntityManagement 
            entityConfig={selectedItem.config}
            apiHelpers={createApiHelpers(selectedItem.apiEndpoint)}
          />
        )}
      </div>
    </div>
  )
}

