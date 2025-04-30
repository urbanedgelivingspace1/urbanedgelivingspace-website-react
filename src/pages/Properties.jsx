import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import PropertyCard from '../components/PropertyCard';
import './Properties.css';
import propertyImage from '../assets/property.jpg';
import {
  Search,
  MapPin,
  Home,
  Building,
  Filter,
  X,
  ChevronDown,
  RefreshCw,
  Briefcase,
  Sliders
} from 'lucide-react';

const Properties = () => {
  // Main state variables
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedBHKs, setSelectedBHKs] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  // Refs
  const filtersSectionRef = useRef(null);

  // Hardcoded options
  const propertyTypeOptions = ['Residential', 'Commercial', 'Rental', 'Group Housing', 'Apartment', 'Villa', 'Penthouse'];
  const bhkOptions = ['1', '2', '3', '4', '5', '6+'];
  const amenitiesOptions = ['Swimming Pool', 'Gym', 'Garden', 'Security', 'Parking', 'Power Backup', 'Club House'];
  const locationOptions = ['Coming Soon'];

  // Advanced filters
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favourites, setFavourites] = useState([]);

  // Feature flags
  const ENABLE_FAVOURITES = true;
  const ENABLE_VIRTUAL_TOURS = true;

  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Apply filters on any filter state change
  useEffect(() => {
    applyFilters();
  }, [
    searchTerm,
    selectedPropertyTypes,
    selectedBHKs,
    selectedAmenities,
    locationFilter,
    sortOption,
    properties
  ]);

  // Swipe-down to close drawer
  useEffect(() => {
    const dr = drawerRef.current;
    if (!dr) return;

    let startY = 0, currentY = 0;
    const onTouchStart = e => {
      startY = e.touches[0].clientY;
      const onTouchMove = ev => { currentY = ev.touches[0].clientY; };
      const onTouchEnd = () => {
        if (currentY - startY > 60) setIsDrawerOpen(false);
        dr.removeEventListener('touchmove', onTouchMove);
        dr.removeEventListener('touchend', onTouchEnd);
      };
      dr.addEventListener('touchmove', onTouchMove);
      dr.addEventListener('touchend', onTouchEnd);
    };
    dr.addEventListener('touchstart', onTouchStart);
    return () => dr.removeEventListener('touchstart', onTouchStart);
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const term = searchTerm.toLowerCase().trim();
    let filtered = properties.filter(p => {
      const textMatch =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.location?.toLowerCase().includes(term) ||
        p.property_type?.toLowerCase().includes(term);

      const typeMatch =
        selectedPropertyTypes.length === 0 ||
        selectedPropertyTypes.includes(p.property_type);

      const bhkMatch =
        selectedBHKs.length === 0 ||
        selectedBHKs.includes(String(p.bhk)) ||
        (selectedBHKs.includes('6+') && p.bhk >= 6);

      const locationMatch =
        !locationFilter ||
        p.location?.toLowerCase().includes(locationFilter.toLowerCase());

      const amenitiesMatch =
        selectedAmenities.length === 0 ||
        selectedAmenities.every(a => p.amenities?.includes(a));

      return textMatch && typeMatch && bhkMatch && locationMatch && amenitiesMatch;
    });

    filtered = sortProperties(filtered, sortOption);
    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  const sortProperties = (list, sortBy) =>
    sortBy === 'oldest'
      ? [...list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      : [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Toggle helpers
  const toggleArrayItem = (item, setter, state) =>
    setter(state.includes(item) ? state.filter(i => i !== item) : [...state, item]);

  const togglePropertyType = type => toggleArrayItem(type, setSelectedPropertyTypes, selectedPropertyTypes);
  const toggleBHK = bhk => toggleArrayItem(bhk, setSelectedBHKs, selectedBHKs);
  const toggleAmenity = amenity => toggleArrayItem(amenity, setSelectedAmenities, selectedAmenities);
  const toggleFavourite = id => toggleArrayItem(id, setFavourites, favourites);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedPropertyTypes([]);
    setSelectedBHKs([]);
    setSelectedAmenities([]);
    setLocationFilter('');
    setSortOption('newest');
  };

  const scrollToFilters = () => filtersSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

  // New function to handle search from hero section
  const handleHeroSearch = (e) => {
    e.preventDefault();
    applyFilters();
    scrollToFilters();
  };

  // Pagination
  const indexOfLast = currentPage * propertiesPerPage;
  const indexOfFirst = indexOfLast - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const paginate = num => setCurrentPage(num);

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    count += selectedPropertyTypes.length;
    count += selectedBHKs.length;
    count += selectedAmenities.length;
    if (locationFilter) count++;
    return count;
  };

  // Reusable filter components
  const FilterContent = () => (
    <>
      {/* Search + Reset */}
      <div className="search-and-reset">
        <div className="search-bar-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-bar"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
        <button className="btn-reset-all" onClick={resetAllFilters}>
          <RefreshCw size={16} /> Reset All Filters
        </button>
      </div>

      {/* Filters Panel */}
      <div className="filters-panel">
        {/* Property Type */}
        <div className="filter-group">
          <label><Home size={16} /> Property Type</label>
          <div className="checkbox-group">
            {propertyTypeOptions.map(type => (
              <div key={type} className="checkbox-option">
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  checked={selectedPropertyTypes.includes(type)}
                  onChange={() => togglePropertyType(type)}
                />
                <label htmlFor={`type-${type}`}>{type}</label>
              </div>
            ))}
          </div>
          {selectedPropertyTypes.length > 0 && (
            <button className="checkbox-clear" onClick={() => setSelectedPropertyTypes([])}>Clear</button>
          )}
        </div>

        {/* BHK Configuration */}
        <div className="filter-group">
          <label><Building size={16} /> BHK Configuration</label>
          <div className="checkbox-group">
            {bhkOptions.map(bhk => (
              <div key={bhk} className="checkbox-option">
                <input
                  type="checkbox"
                  id={`bhk-${bhk}`}
                  checked={selectedBHKs.includes(bhk)}
                  onChange={() => toggleBHK(bhk)}
                />
                <label htmlFor={`bhk-${bhk}`}>{bhk === '6+' ? '6+ BHK' : `${bhk} BHK`}</label>
              </div>
            ))}
          </div>
          {selectedBHKs.length > 0 && (
            <button className="checkbox-clear" onClick={() => setSelectedBHKs([])}>Clear</button>
          )}
        </div>

        {/* Location */}
        <div className="filter-group">
          <label><MapPin size={16} /> Location</label>
          <div className="filter-dropdown-container">
            <select
              className="filter-dropdown"
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {locationOptions.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            {locationFilter && (
              <button className="filter-clear" onClick={() => setLocationFilter('')}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="advanced-filters-toggle">
        <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
          <Sliders size={16} />
          {showAdvancedFilters ? 'Hide' : 'Show'} Amenities
          <ChevronDown size={16} className={showAdvancedFilters ? 'rotate' : ''} />
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="advanced-filters">
          <div className="filter-group">
            <label><Briefcase size={16} /> Amenities</label>
            <div className="checkbox-group">
              {amenitiesOptions.map(amenity => (
                <div key={amenity} className="checkbox-option">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  <label htmlFor={`amenity-${amenity}`}>{amenity}</label>
                </div>
              ))}
            </div>
            {selectedAmenities.length > 0 && (
              <button className="checkbox-clear" onClick={() => setSelectedAmenities([])}>Clear</button>
            )}
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {getActiveFilterCount() > 0 && (
        <div className="active-filters-container">
          <div className="active-filters-title">Active Filters:</div>
          <div className="active-filters">
            {searchTerm && (
              <span className="filter-tag">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')}><X size={14} /></button>
              </span>
            )}
            {selectedPropertyTypes.map(type => (
              <span key={type} className="filter-tag">
                {type}
                <button onClick={() => togglePropertyType(type)}><X size={14} /></button>
              </span>
            ))}
            {selectedBHKs.map(bhk => (
              <span key={bhk} className="filter-tag">
                {bhk} BHK
                <button onClick={() => toggleBHK(bhk)}><X size={14} /></button>
              </span>
            ))}
            {locationFilter && (
              <span className="filter-tag">
                Location Coming Soon: {locationFilter}
                <button onClick={() => setLocationFilter('')}><X size={14} /></button>
              </span>
            )}
            {selectedAmenities.map(amenity => (
              <span key={amenity} className="filter-tag">
                {amenity}
                <button onClick={() => toggleAmenity(amenity)}><X size={14} /></button>
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="properties-page">
      {/* Hero Section */}
      <header className="properties-hero" role="banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Discover Your Dream Property</h1>
          <p>Find exclusive listings in the most coveted locations.</p>
          <form className="hero-search" onSubmit={handleHeroSearch}>
            <input
              type="text"
              placeholder="Search by location, type, features..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button type="submit">Find Properties</button>
          </form>
        </div>
      </header>

      <main className="container main-content">
        {/* Desktop Filter Sidebar */}
        <div className="filter-card" ref={filtersSectionRef}>
          <div className="filters-title">
            <Filter size={20} />
            <span>Filter Properties</span>
            {getActiveFilterCount() > 0 && <span className="filter-badge">{getActiveFilterCount()}</span>}
          </div>

          {/* Reusing the FilterContent component for desktop */}
          <FilterContent />
        </div>

        {/* Results Section */}
        <section className="results-section">
          <div className="results-info">
            <div className="results-count">
              Showing <strong>{currentProperties.length}</strong> of <strong>{filteredProperties.length}</strong>
            </div>
            <div className="results-controls">
              <div className="results-sorting">
                <label htmlFor="sort-options">Sort by:</label>
                <select id="sort-options" value={sortOption} onChange={e => setSortOption(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
              <div className="view-toggle">
                <button className={`view-btn ${viewMode==='grid'? 'active':''}`} onClick={()=>setViewMode('grid')}>Grid</button>
                <button className={`view-btn ${viewMode==='list'? 'active':''}`} onClick={()=>setViewMode('list')}>List</button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading properties...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchProperties}>Try Again</button>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredProperties.length > 0 ? (
                <div className={`property-${viewMode}`}>
                  {currentProperties.map(p => (
                    <PropertyCard
                      key={p.id}
                      property={{
                        id: p.id,
                        property_type: p.property_type,
                        title: p.name,
                        description: p.description,
                        location: p.location,
                        image: p.image_url || propertyImage,
                        carpet_area: p.carpet_area,
                        bhk: p.bhk,
                        price: p.price,
                        amenities: p.amenities || [],
                        date_added: p.created_at,
                        agent: p.agent,
                      }}
                      isFavorite={favourites.includes(p.id)}
                      onToggleFavorite={() => toggleFavourite(p.id)}
                      viewMode={viewMode}
                      enableVirtualTour={ENABLE_VIRTUAL_TOURS && p.has_virtual_tour}
                    />
                  ))}
                </div>
                ) : (
                  <div className="no-results">
                    <h3>No properties found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                    <button className="no-results-btn" onClick={resetAllFilters}>
                      <RefreshCw size={16} /> Reset All Filters
                    </button>
                  </div>
                )}

                {filteredProperties.length > propertiesPerPage && (
                  <div className="pagination">
                    <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1}>&laquo;</button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const num = i + 1;
                      if (num === 1 || num === totalPages || Math.abs(num - currentPage) <= 1) {
                        return <button key={num} className={currentPage === num ? 'active' : ''} onClick={() => paginate(num)}>{num}</button>;
                      }
                      if ((num === 2 && currentPage > 3) || (num === totalPages - 1 && currentPage < totalPages - 2)) {
                        return <span key={num} className="page-ellipsis">…</span>;
                      }
                      return null;
                    })}
                    <button onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)} disabled={currentPage === totalPages}>&raquo;</button>
                  </div>
                )}
              </>
            )}
        </section>
      </main>

      {/* Mobile Filter Toggle */}
      <button
        className="mobile-filter-toggle"
        aria-label="Open filters"
        onClick={() => setIsDrawerOpen(true)}
      >
        <Filter size={24} />
        {getActiveFilterCount() > 0 && <span className="filter-badge mobile-badge">{getActiveFilterCount()}</span>}
      </button>

      {/* Filter Drawer Overlay */}
      <div
        className={`filter-drawer-overlay ${isDrawerOpen ? 'visible' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Filter Drawer */}
      <aside
        ref={drawerRef}
        className={`filter-drawer ${isDrawerOpen ? 'visible' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="filter-drawer-handle" />
        <div className="filter-drawer-header">
          <div className="filter-drawer-title">
            <Filter size={20} /> Filters
            {getActiveFilterCount() > 0 && <span className="filter-badge">{getActiveFilterCount()}</span>}
          </div>
          <button
            className="filter-drawer-close"
            aria-label="Close filters"
            onClick={() => setIsDrawerOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="filter-drawer-content">
          {/* Reusing the FilterContent component for mobile */}
          <FilterContent />
        </div>
        <div className="filter-drawer-actions">
          <button
            className="filter-drawer-cancel"
            onClick={() => {
              resetAllFilters();
              setIsDrawerOpen(false);
            }}
          >
            <X size={16} /> Reset All
          </button>
          <button
            className="filter-drawer-apply"
            onClick={() => {
              applyFilters();
              setIsDrawerOpen(false);
            }}
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Properties;