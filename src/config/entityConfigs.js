// Entity configuration definitions

export const SPECIES_CONFIG = {
  icon: '🦁',
  labelSingle: 'Tür',
  labelPlural: 'Türler',
  description: 'Hayvan türlerini yönetin',
  searchFields: ['scientificName', 'commonName'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'scientificName',
      label: 'Bilimsel Adı',
      type: 'text',
      required: true,
      placeholder: 'Örn: Canis lupus familiaris',
      hint: 'Latince bilimsel isim'
    },
    {
      name: 'commonName',
      label: 'Yaygın Adı',
      type: 'text',
      required: false,
      placeholder: 'Örn: Köpek'
    },
    {
      name: 'domesticStatus',
      label: 'Evcillik Durumu',
      type: 'select',
      dictionary: 'domestic-status',
      required: false
    }
  ],

  tableColumns: [
    { field: 'scientificName', label: 'Bilimsel Adı', width: '40%' },
    { field: 'commonName', label: 'Yaygın Adı', width: '30%' },
    { field: 'domesticStatus', label: 'Evcillik Durumu', width: '30%' }
  ],

  getDisplayName: (item) => item.commonName || item.scientificName
};

export const BREED_CONFIG = {
  icon: '🐕',
  labelSingle: 'Irk',
  labelPlural: 'Irklar',
  description: 'Hayvan ırklarını yönetin',
  searchFields: ['name', 'speciesName'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'name',
      label: 'Irk Adı',
      type: 'text',
      required: true,
      placeholder: 'Örn: Golden Retriever'
    },
    {
      name: 'speciesId',
      label: 'Tür',
      type: 'select',
      entityEndpoint: 'species',
      entityLabelField: 'commonName',
      entityValueField: 'id',
      required: true,
      hint: 'Önce Türler bölümünden tür ekleyin'
    },
    {
      name: 'origin',
      label: 'Menşei',
      type: 'text',
      required: false,
      placeholder: 'Örn: İskoçya',
      fullWidth: true
    }
  ],

  tableColumns: [
    { field: 'name', label: 'Irk Adı', width: '35%' },
    { field: 'speciesName', label: 'Tür', width: '25%' },
    { field: 'origin', label: 'Menşei', width: '40%' }
  ],

  getDisplayName: (item) => item.name
};

export const PERSON_CONFIG = {
  icon: '👤',
  labelSingle: 'Kişi',
  labelPlural: 'Kişiler',
  description: 'Kişi ve organizasyon bilgilerini yönetin',
  searchFields: ['fullName', 'email', 'phone', 'organizationName'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'fullName',
      label: 'Ad Soyad / Tam Ad',
      type: 'text',
      required: true,
      placeholder: 'Örn: Ahmet Yılmaz',
      hint: 'Kişinin tam adı veya organizasyon adı'
    },
    {
      name: 'email',
      label: 'E-posta',
      type: 'email',
      required: false,
      placeholder: 'ornek@email.com'
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'tel',
      required: false,
      placeholder: '+90 5XX XXX XX XX'
    },
    {
      name: 'address',
      label: 'Adres',
      type: 'textarea',
      required: false,
      fullWidth: true,
      rows: 2,
      placeholder: 'İletişim adresi...'
    },
    {
      name: 'isOrganization',
      label: 'Organizasyon mu?',
      type: 'checkbox',
      required: false,
      hint: 'Bu kayıt bir organizasyon ise işaretleyin'
    },
    {
      name: 'organizationName',
      label: 'Organizasyon Adı',
      type: 'text',
      required: false,
      placeholder: 'Örn: Hayvan Dostları Derneği',
      hint: 'Organizasyon ise buraya adını girin'
    },
    {
      name: 'organizationType',
      label: 'Organizasyon Tipi',
      type: 'text',
      required: false,
      placeholder: 'Örn: Dernek, Vakıf, NGO',
      hint: 'Organizasyon türü'
    },
    {
      name: 'notes',
      label: 'Notlar',
      type: 'textarea',
      required: false,
      fullWidth: true,
      rows: 3,
      placeholder: 'Kişi veya organizasyon hakkında ek bilgiler...'
    }
  ],

  tableColumns: [
    { field: 'fullName', label: 'Ad Soyad', width: '25%' },
    { field: 'email', label: 'E-posta', width: '20%' },
    { field: 'phone', label: 'Telefon', width: '15%' },
    { field: 'organizationName', label: 'Organizasyon', width: '20%' },
    { field: 'isOrganization', label: 'Org?', width: '10%', render: (value) => value ? '✓' : '✗' }
  ],

  getDisplayName: (item) => item.fullName || item.organizationName || 'İsimsiz'
};

export const VOLUNTEER_CONFIG = {
  icon: '🙋',
  labelSingle: 'Gönüllü',
  labelPlural: 'Gönüllüler',
  description: 'Gönüllü kayıtlarını yönetin',
  searchFields: ['personFullName', 'volunteerAreaCode', 'volunteerStatusCode'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'personId',
      label: 'Kişi ID',
      type: 'number',
      required: true,
      placeholder: 'Kişi ID giriniz',
      hint: 'Önce kişi kaydı oluşturulmalı'
    },
    {
      name: 'volunteerAreaCode',
      label: 'Gönüllü Alanı',
      type: 'select',
      dictionary: 'volunteer-area',
      required: true
    },
    {
      name: 'volunteerStatusCode',
      label: 'Gönüllü Durumu',
      type: 'select',
      dictionary: 'volunteer-status',
      required: true
    },
    {
      name: 'startDate',
      label: 'Başlangıç Tarihi',
      type: 'date',
      required: false
    },
    {
      name: 'notes',
      label: 'Notlar',
      type: 'textarea',
      required: false,
      fullWidth: true,
      rows: 3
    }
  ],

  tableColumns: [
    { field: 'personId', label: 'Kişi ID', width: '15%' },
    { field: 'volunteerAreaCode', label: 'Alan', width: '25%' },
    { field: 'volunteerStatusCode', label: 'Durum', width: '20%' },
    { field: 'startDate', label: 'Başlangıç', width: '20%' }
  ],

  getDisplayName: (item) => `Gönüllü #${item.id}`
};

export const FACILITY_CONFIG = {
  icon: '🏢',
  labelSingle: 'Tesis',
  labelPlural: 'Tesisler',
  description: 'Tesis kayıtlarını yönetin',
  searchFields: ['name', 'facilityTypeCode', 'address'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'name',
      label: 'Tesis Adı',
      type: 'text',
      required: true,
      placeholder: 'Örn: Ana Bakım Merkezi'
    },
    {
      name: 'facilityTypeCode',
      label: 'Tesis Tipi',
      type: 'select',
      dictionary: 'facility-type',
      required: true
    },
    {
      name: 'capacity',
      label: 'Kapasite',
      type: 'number',
      required: false,
      placeholder: '0'
    },
    {
      name: 'operationalDate',
      label: 'Açılış Tarihi',
      type: 'date',
      required: false
    },
    {
      name: 'address',
      label: 'Adres',
      type: 'textarea',
      required: false,
      fullWidth: true,
      rows: 3
    }
  ],

  tableColumns: [
    { field: 'name', label: 'Tesis Adı', width: '30%' },
    { field: 'facilityTypeCode', label: 'Tip', width: '20%' },
    { field: 'capacity', label: 'Kapasite', width: '15%' },
    { field: 'operationalDate', label: 'Açılış', width: '20%' }
  ],

  getDisplayName: (item) => item.name
};

export const ZONE_CONFIG = {
  icon: '🗺️',
  labelSingle: 'Bölge',
  labelPlural: 'Bölgeler',
  description: 'Tesis bölgelerini yönetin',
  searchFields: ['name', 'zonePurposeCode'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'facilityId',
      label: 'Tesis ID',
      type: 'number',
      required: true,
      placeholder: 'Tesis ID giriniz'
    },
    {
      name: 'name',
      label: 'Bölge Adı',
      type: 'text',
      required: true,
      placeholder: 'Örn: A Blok Kafesler'
    },
    {
      name: 'zonePurposeCode',
      label: 'Bölge Amacı',
      type: 'select',
      dictionary: 'zone-purpose',
      required: true
    },
    {
      name: 'capacity',
      label: 'Kapasite',
      type: 'number',
      required: false,
      placeholder: '0'
    },
    {
      name: 'description',
      label: 'Açıklama',
      type: 'textarea',
      required: false,
      fullWidth: true,
      rows: 3
    }
  ],

  tableColumns: [
    { field: 'name', label: 'Bölge Adı', width: '30%' },
    { field: 'facilityId', label: 'Tesis ID', width: '15%' },
    { field: 'zonePurposeCode', label: 'Amaç', width: '25%' },
    { field: 'capacity', label: 'Kapasite', width: '15%' }
  ],

  getDisplayName: (item) => item.name
};

export const ASSET_CONFIG = {
  icon: '📦',
  labelSingle: 'Varlık',
  labelPlural: 'Varlıklar',
  description: 'Varlık kayıtlarını yönetin',
  searchFields: ['name', 'assetTypeCode', 'assetStatusCode'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'name',
      label: 'Varlık Adı',
      type: 'text',
      required: true,
      placeholder: 'Örn: Mama Kabı #12'
    },
    {
      name: 'assetTypeCode',
      label: 'Varlık Tipi',
      type: 'select',
      dictionary: 'asset-type',
      required: true
    },
    {
      name: 'assetStatusCode',
      label: 'Varlık Durumu',
      type: 'select',
      dictionary: 'asset-status',
      required: true
    },
    {
      name: 'serialNumber',
      label: 'Seri No',
      type: 'text',
      required: false,
      placeholder: 'SN-12345'
    },
    {
      name: 'purchaseDate',
      label: 'Satın Alma Tarihi',
      type: 'date',
      required: false
    },
    {
      name: 'description',
      label: 'Açıklama',
      type: 'textarea',
      required: false,
      fullWidth: true,
      rows: 3
    }
  ],

  tableColumns: [
    { field: 'name', label: 'Varlık Adı', width: '25%' },
    { field: 'assetTypeCode', label: 'Tip', width: '20%' },
    { field: 'assetStatusCode', label: 'Durum', width: '15%' },
    { field: 'serialNumber', label: 'Seri No', width: '20%' }
  ],

  getDisplayName: (item) => item.name
};

