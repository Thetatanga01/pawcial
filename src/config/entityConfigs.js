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
  description: 'Kişi bilgilerini yönetin',
  searchFields: ['fullName', 'email', 'phone', 'organizationName'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'fullName',
      label: 'Ad Soyad / Tam Ad',
      type: 'text',
      required: true,
      placeholder: 'Örn: Ahmet Yılmaz',
      hint: 'Kişinin tam adı'
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
      name: 'organizationCode',
      label: 'Organizasyon',
      type: 'select',
      dictionary: 'organization',
      required: false,
      hint: 'Kişi bir organizasyona bağlıysa seçiniz'
    },
    {
      name: 'notes',
      label: 'Notlar',
      type: 'textarea',
      required: false,
      fullWidth: true,
      rows: 3,
      placeholder: 'Kişi hakkında ek bilgiler...'
    }
  ],

  tableColumns: [
    { field: 'fullName', label: 'Ad Soyad', width: '25%' },
    { field: 'email', label: 'E-posta', width: '20%' },
    { field: 'phone', label: 'Telefon', width: '15%' },
    { 
      field: 'organization', 
      label: 'Organizasyon', 
      width: '25%',
      render: (value) => value?.label || '-'
    }
  ],

  getDisplayName: (item) => item.fullName || 'İsimsiz'
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
  searchFields: ['name', 'type', 'city'],
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
      name: 'type',
      label: 'Tesis Tipi',
      type: 'select',
      dictionary: 'facility-type',
      required: false
    },
    {
      name: 'country',
      label: 'Ülke',
      type: 'text',
      required: false,
      placeholder: 'Örn: Turkey'
    },
    {
      name: 'city',
      label: 'Şehir',
      type: 'text',
      required: false,
      placeholder: 'Örn: Istanbul'
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
    { field: 'type', label: 'Tip', width: '15%' },
    { field: 'city', label: 'Şehir', width: '15%' },
    { field: 'country', label: 'Ülke', width: '15%' }
  ],

  getDisplayName: (item) => item.name
};

export const ZONE_CONFIG = {
  icon: '🗺️',
  labelSingle: 'Tesis Bölgesi',
  labelPlural: 'Tesis Bölgeleri',
  description: 'Tesis bölgelerini yönetin',
  searchFields: ['name', 'facilityName'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'facilityId',
      label: 'Tesis',
      type: 'select',
      entityEndpoint: 'facilities',
      entityValueField: 'id',
      entityLabelField: 'name',
      required: true
    },
    {
      name: 'name',
      label: 'Bölge Adı',
      type: 'text',
      required: true,
      placeholder: 'Örn: A Blok Kafesler'
    },
    {
      name: 'purpose',
      label: 'Bölge Amacı',
      type: 'select',
      dictionary: 'zone-purpose',
      required: false
    }
  ],

  tableColumns: [
    { field: 'name', label: 'Bölge Adı', width: '30%' },
    { 
      field: 'facilityName', 
      label: 'Tesis', 
      width: '30%',
      render: (fieldValue, item) => item.facilityName || '-'
    },
    { field: 'purpose', label: 'Amaç', width: '25%' }
  ],

  getDisplayName: (item) => item.name
};

export const ASSET_CONFIG = {
  icon: '📦',
  labelSingle: 'Varlık',
  labelPlural: 'Varlıklar',
  description: 'Varlık kayıtlarını yönetin',
  searchFields: ['name', 'code', 'facilityName'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'code',
      label: 'Kod',
      type: 'text',
      required: true,
      placeholder: 'Örn: ASSET001'
    },
    {
      name: 'facilityId',
      label: 'Tesis',
      type: 'select',
      entityEndpoint: 'facilities',
      entityValueField: 'id',
      entityLabelField: 'name',
      required: true
    },
    {
      name: 'name',
      label: 'Varlık Adı',
      type: 'text',
      required: true,
      placeholder: 'Örn: Mama Kabı #12'
    },
    {
      name: 'type',
      label: 'Varlık Tipi',
      type: 'select',
      dictionary: 'asset-type',
      required: false
    },
    {
      name: 'status',
      label: 'Varlık Durumu',
      type: 'select',
      dictionary: 'asset-status',
      required: false
    },
    {
      name: 'serialNo',
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
      name: 'warrantyEnd',
      label: 'Garanti Bitiş',
      type: 'date',
      required: false
    }
  ],

  tableColumns: [
    { field: 'code', label: 'Kod', width: '15%' },
    { field: 'name', label: 'Varlık Adı', width: '25%' },
    { 
      field: 'facilityName', 
      label: 'Tesis', 
      width: '20%',
      render: (fieldValue, item) => item.facilityName || '-'
    },
    { field: 'type', label: 'Tip', width: '15%' },
    { field: 'status', label: 'Durum', width: '15%' }
  ],

  getDisplayName: (item) => `${item.code} - ${item.name}`
};

export const UNIT_CONFIG = {
  icon: '🚪',
  labelSingle: 'Birim',
  labelPlural: 'Birimler',
  description: 'Tesis birimlerini yönetin',
  searchFields: ['code', 'facilityName'],
  formLayout: 'grid',
  
  fields: [
    {
      name: 'facilityId',
      label: 'Tesis',
      type: 'select',
      entityEndpoint: 'facilities',
      entityValueField: 'id',
      entityLabelField: 'name',
      required: true
    },
    {
      name: 'code',
      label: 'Birim Kodu',
      type: 'text',
      required: true,
      placeholder: 'Örn: UNIT001'
    },
    {
      name: 'name',
      label: 'Birim Adı',
      type: 'text',
      required: false,
      placeholder: 'Örn: A Blok Kafes 1'
    },
    {
      name: 'type',
      label: 'Birim Tipi',
      type: 'select',
      dictionary: 'unit-type',
      required: false
    },
    {
      name: 'capacity',
      label: 'Kapasite',
      type: 'number',
      required: false,
      placeholder: '0'
    }
  ],

  tableColumns: [
    { field: 'code', label: 'Kod', width: '15%' },
    { field: 'name', label: 'Birim Adı', width: '25%' },
    { 
      field: 'facilityName', 
      label: 'Tesis', 
      width: '25%',
      render: (fieldValue, item) => item.facilityName || '-'
    },
    { field: 'type', label: 'Tip', width: '15%' },
    { field: 'capacity', label: 'Kapasite', width: '10%' }
  ],

  getDisplayName: (item) => item.code || item.name
};

