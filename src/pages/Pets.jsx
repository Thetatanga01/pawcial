import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPets } from '../api/pets.js'

export default function Pets() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination (2 rows x 5 = 10 per page)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filters
  const [gender, setGender] = useState('Tümü')
  const [breed, setBreed] = useState('Tümü')
  const [age, setAge] = useState('Tümü')

  // Options for filters (from API meta)
  const [breedOptions, setBreedOptions] = useState(['Tümü'])
  const [genderOptions, setGenderOptions] = useState(['Tümü'])
  const [ageOptions, setAgeOptions] = useState(['Tümü'])

  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 })

  // Fetch pets whenever page or filters change
  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchPets({ page: currentPage, limit: itemsPerPage, gender, breed, age })
      .then((res) => {
        if (!mounted) return
        setPets(res.pets)
        setPagination(res.pagination)
        // Fill options once
        setBreedOptions(['Tümü', ...(res.meta?.breeds || [])])
        setGenderOptions(['Tümü', ...(res.meta?.genders || [])])
        const ageList = (res.meta?.ages || []).map((n) => (n >= 10 ? '10+' : String(n)))
        const uniqueAges = Array.from(new Set(ageList))
        setAgeOptions(['Tümü', ...uniqueAges])
        setLoading(false)
      })
      .catch((err) => {
        if (mounted) { setError(err?.message || 'Beklenmeyen bir hata oluştu'); setLoading(false) }
      })
    return () => { mounted = false }
  }, [currentPage, gender, breed, age])

  // Reset page to 1 when filters change
  useEffect(() => { setCurrentPage(1) }, [gender, breed, age])

  if (loading) {
    return (
      <main className="section pets-page">
        <div className="container">
          <h1 className="section-title">Sahiplendirme</h1>
          <p className="section-lead">Sıcak bir yuva bekleyen sevgi dolu patili dostlar dünyasını keşfedin.</p>
          <div className="card-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="pet-card" style={{ background: '#f5f5f5', height: '200px' }} />
            ))}
          </div>
          <div className="card-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="pet-card" style={{ background: '#f5f5f5', height: '200px' }} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="section pets-page">
        <div className="container">
          <h1 className="section-title">Sahiplendirme</h1>
          <p style={{ textAlign: 'center', color: '#b00020' }}>{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="section pets-page">
      <div className="container">
        <h1 className="section-title">Sahiplendirme</h1>
        <p className="section-lead">Sıcak bir yuva bekleyen sevgi dolu patili dostlar dünyasını keşfedin. Sahiplendirme sürecinizde baştan sona yanınızdayız.</p>

        {/* Filters */}
        <div className="events-filters">
          <div className="filter-container">
            <select value={breed} onChange={(e) => setBreed(e.target.value)} className="filter-select">
              <option value="Tümü">Cins</option>
              {breedOptions.slice(1).map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="filter-select">
              <option value="Tümü">Cinsiyet</option>
              {genderOptions.slice(1).map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select value={age} onChange={(e) => setAge(e.target.value)} className="filter-select">
              <option value="Tümü">Yaş</option>
              {ageOptions.slice(1).map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        
        {/* Row 1: Pets 1-5 */}
        <div className="card-row">
          {pets.slice(0, 5).map((pet) => (
            <Link to={`/pets/${pet.id}`} key={pet.id} className="pet-card">
              <img src={pet.thumbnailUrl} alt={pet.name} />
              <div className="pet-meta">
                <h3>{pet.name}</h3>
                <p>{pet.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Row 2: Pets 6-10 */}
        <div className="card-row">
          {pets.slice(5, 10).map((pet) => (
            <Link to={`/pets/${pet.id}`} key={pet.id} className="pet-card">
              <img src={pet.thumbnailUrl} alt={pet.name} />
              <div className="pet-meta">
                <h3>{pet.name}</h3>
                <p>{pet.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination" style={{ marginTop: '1.5rem' }}>
          <button className="btn btn-soft" disabled={!pagination.hasPrevPage} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Önceki</button>
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              className={`btn ${pagination.currentPage === i + 1 ? 'btn-primary' : 'btn-soft'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="btn btn-soft" disabled={!pagination.hasNextPage} onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}>Sonraki</button>
        </div>
      </div>
    </main>
  )
}
