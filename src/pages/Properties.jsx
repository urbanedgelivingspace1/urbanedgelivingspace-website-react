import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import PropertyCard from '../components/PropertyCard';
import './Properties.css';
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
  
  // New state for property category (buy/rental) toggle
  const [propertyCategory, setPropertyCategory] = useState('buy');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  // Refs
  const filtersSectionRef = useRef(null);

  // Hardcoded options
  const propertyTypeOptions = ['Residential', 'Commercial', 'Group Housing', 'Apartment', 'Villa', 'Penthouse'];
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
  
  // Mobile filter temp states (for pending changes)
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [tempSelectedPropertyTypes, setTempSelectedPropertyTypes] = useState([]);
  const [tempSelectedBHKs, setTempSelectedBHKs] = useState([]);
  const [tempLocationFilter, setTempLocationFilter] = useState('');
  const [tempSelectedAmenities, setTempSelectedAmenities] = useState([]);
  const [tempPropertyCategory, setTempPropertyCategory] = useState('buy');

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
    propertyCategory,
    properties
  ]);
  
  // Initialize temp states when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      setTempSearchTerm(searchTerm);
      setTempSelectedPropertyTypes([...selectedPropertyTypes]);
      setTempSelectedBHKs([...selectedBHKs]);
      setTempLocationFilter(locationFilter);
      setTempSelectedAmenities([...selectedAmenities]);
      setTempPropertyCategory(propertyCategory);
    }
  }, [isDrawerOpen]);

// Swipe-down to close drawer
useEffect(() => {
  // Only attach listener when drawer is open
  if (!isDrawerOpen || !drawerRef.current) return;
  
  const dr = drawerRef.current;
  let startY = 0, currentY = 0;
  
  // Define all functions at the same level
  const onTouchMove = (ev) => { 
    currentY = ev.touches[0].clientY; 
  };
  
  const onTouchEnd = () => {
    if (currentY - startY > 60) {
      setIsDrawerOpen(false);
    }
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  };
  
  const onTouchStart = (e) => {
    startY = e.touches[0].clientY;
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  };
  
  dr.addEventListener('touchstart', onTouchStart);
  
  return () => {
    dr.removeEventListener('touchstart', onTouchStart);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  };
}, [isDrawerOpen]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      // Normalize property data to ensure consistent formats
      const normalizedData = data.map(property => ({
        ...property,
        // Ensure amenities is always an array
        amenities: Array.isArray(property.amenities) ? property.amenities : 
                   (property.amenities ? [property.amenities] : []),
        // Ensure property_type is a string
        property_type: property.property_type ? String(property.property_type) : '',
        // Ensure location is a string
        location: property.location ? String(property.location) : '',
        // Ensure bhk is a number
        bhk: Number(property.bhk) || 0
      }));
      
      setProperties(normalizedData);
      setFilteredProperties(normalizedData);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

const applyFilters = () => {
  const term = searchTerm.toLowerCase().trim();
  
  let filtered = properties.filter(property => {
    // Search term filter - check across multiple fields
    const textMatch = !term || [
      property.name,
      property.description,
      property.location,
      property.property_type
    ].some(field => 
      field && String(field).toLowerCase().includes(term)
    );
    
    // Property type filter - Check if ANY of the selected types is INCLUDED in the property type
    const typeMatch = selectedPropertyTypes.length === 0 || 
      (property.property_type && 
       selectedPropertyTypes.some(type => 
         property.property_type.toLowerCase().includes(type.toLowerCase())
       ));
    
    // BHK configuration filter
    const bhkMatch = selectedBHKs.length === 0 || 
      selectedBHKs.some(bhk => {
        if (bhk === '6+') return property.bhk >= 6;
        return property.bhk === parseInt(bhk, 10);
      });
    
    // Location filter - Check if the location filter term is included in the property location
    const locationMatch = !locationFilter || 
      (property.location && 
       property.location.toLowerCase().includes(locationFilter.toLowerCase()));
    
    // Amenities filter - Check if ANY of the property's amenities INCLUDES the selected amenities
    const amenitiesMatch = selectedAmenities.length === 0 || 
      (Array.isArray(property.amenities) && 
       selectedAmenities.every(amenity => 
         property.amenities.some(a => 
           a && a.toLowerCase().includes(amenity.toLowerCase())
         )
       ));
       
    // Property category filter (buy/rental)
    const categoryMatch = propertyCategory === 'all' || 
      (propertyCategory === 'buy' && 
       (!property.property_type || 
        !property.property_type.toLowerCase().includes('rental'))) ||
      (propertyCategory === 'rental' && 
       property.property_type && 
       property.property_type.toLowerCase().includes('rental'));
    
    return textMatch && typeMatch && bhkMatch && locationMatch && amenitiesMatch && categoryMatch;
  });

  // Apply sorting
  filtered = sortProperties(filtered, sortOption);
  
  setFilteredProperties(filtered);
  setCurrentPage(1); // Reset to first page when filters change
};

  const sortProperties = (list, sortBy) => {
    if (!Array.isArray(list)) return [];
    
    return [...list].sort((a, b) => {
      // Make sure created_at exists and is a valid date
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      
      return sortBy === 'oldest' 
        ? dateA - dateB 
        : dateB - dateA;
    });
  };

  // Toggle helpers with improved handling
  const toggleArrayItem = (item, setter, state) => {
    if (!item) return;
    
    const exists = state.includes(item);
    if (exists) {
      setter(state.filter(i => i !== item));
    } else {
      setter([...state, item]);
    }
  };

  const togglePropertyType = type => toggleArrayItem(type, setSelectedPropertyTypes, selectedPropertyTypes);
  const toggleBHK = bhk => toggleArrayItem(bhk, setSelectedBHKs, selectedBHKs);
  const toggleAmenity = amenity => toggleArrayItem(amenity, setSelectedAmenities, selectedAmenities);
  const toggleFavourite = id => toggleArrayItem(id, setFavourites, favourites);
  
  // Mobile temp toggle helpers
  const toggleTempPropertyType = type => toggleArrayItem(type, setTempSelectedPropertyTypes, tempSelectedPropertyTypes);
  const toggleTempBHK = bhk => toggleArrayItem(bhk, setTempSelectedBHKs, tempSelectedBHKs);
  const toggleTempAmenity = amenity => toggleArrayItem(amenity, setTempSelectedAmenities, tempSelectedAmenities);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedPropertyTypes([]);
    setSelectedBHKs([]);
    setSelectedAmenities([]);
    setLocationFilter('');
    setSortOption('newest');
    setPropertyCategory('buy'); // Reset to buy by default
  };
  
  const resetTempFilters = () => {
    setTempSearchTerm('');
    setTempSelectedPropertyTypes([]);
    setTempSelectedBHKs([]);
    setTempSelectedAmenities([]);
    setTempLocationFilter('');
    setTempPropertyCategory('all'); // Reset to buy by default
  };

  const scrollToFilters = () => {
    filtersSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle search from hero section
  const handleHeroSearch = (e) => {
    e.preventDefault();
    // Apply filters and scroll to results
    applyFilters();
    scrollToFilters();
  };
  
  // Apply mobile filters
  const applyMobileFilters = () => {
    setSearchTerm(tempSearchTerm);
    setSelectedPropertyTypes(tempSelectedPropertyTypes);
    setSelectedBHKs(tempSelectedBHKs);
    setLocationFilter(tempLocationFilter);
    setSelectedAmenities(tempSelectedAmenities);
    setPropertyCategory(tempPropertyCategory);
    setIsDrawerOpen(false);
  };

  // Pagination
  const indexOfLast = currentPage * propertiesPerPage;
  const indexOfFirst = indexOfLast - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  
  const paginate = num => {
    if (num < 1 || num > totalPages) return;
    setCurrentPage(num);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    count += selectedPropertyTypes.length;
    count += selectedBHKs.length;
    count += selectedAmenities.length;
    if (locationFilter) count++;
    if (propertyCategory !== 'all') count++;
    return count;
  };
  
  const getTempActiveFilterCount = () => {
    let count = 0;
    if (tempSearchTerm) count++;
    count += tempSelectedPropertyTypes.length;
    count += tempSelectedBHKs.length;
    count += tempSelectedAmenities.length;
    if (tempLocationFilter) count++;
    if (tempPropertyCategory !== 'all') count++;
    return count;
  };

  // Reusable filter components for desktop
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

        {/* Property Category */}
        <div className="filter-group">
          <label><Building size={16} /> Property Category</label>
          <div className="filter-category-toggle">

            <button 
              className={`category-btn ${propertyCategory === 'rental' ? 'active' : ''}`} 
              onClick={() => setPropertyCategory('rental')}
            >
              For Rent
            </button>
            <button 
              className={`category-btn ${propertyCategory === 'all' ? 'active' : ''}`} 
              onClick={() => setPropertyCategory('all')}
            >
              All
            </button>
          </div>
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
            {propertyCategory !== 'all' && (
              <span className="filter-tag">
                {propertyCategory === 'buy' ? 'For Sale' : 'For Rent'}
                <button onClick={() => setPropertyCategory('all')}><X size={14} /></button>
              </span>
            )}
            {selectedBHKs.map(bhk => (
              <span key={bhk} className="filter-tag">
                {bhk === '6+' ? '6+ BHK' : `${bhk} BHK`}
                <button onClick={() => toggleBHK(bhk)}><X size={14} /></button>
              </span>
            ))}
            {locationFilter && (
              <span className="filter-tag">
                Location: {locationFilter}
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
  
  // Mobile filters content
  const MobileFilterContent = () => (
    <>
      {/* Search + Reset */}
      <div className="search-and-reset">
        <div className="search-bar-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-bar"
            placeholder="Search by name or location..."
            value={tempSearchTerm}
            onChange={e => setTempSearchTerm(e.target.value)}
          />
          {tempSearchTerm && (
            <button className="search-clear" onClick={() => setTempSearchTerm('')} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
        <button className="btn-reset-all" onClick={resetTempFilters}>
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
                  id={`mobile-type-${type}`}
                  checked={tempSelectedPropertyTypes.includes(type)}
                  onChange={() => toggleTempPropertyType(type)}
                />
                <label htmlFor={`mobile-type-${type}`}>{type}</label>
              </div>
            ))}
          </div>
          {tempSelectedPropertyTypes.length > 0 && (
            <button className="checkbox-clear" onClick={() => setTempSelectedPropertyTypes([])}>Clear</button>
          )}
        </div>

        {/* Property Category */}
        <div className="filter-group">
          <label><Building size={16} /> Property Category</label>
          <div className="filter-category-toggle">
            <button 
              className={`category-btn ${tempPropertyCategory === 'rental' ? 'active' : ''}`} 
              onClick={() => setTempPropertyCategory('rental')}
            >
              For Rent
            </button>
            <button 
              className={`category-btn ${tempPropertyCategory === 'all' ? 'active' : ''}`} 
              onClick={() => setTempPropertyCategory('all')}
            >
              All
            </button>
          </div>
        </div>

        {/* BHK Configuration */}
        <div className="filter-group">
          <label><Building size={16} /> BHK Configuration</label>
          <div className="checkbox-group">
            {bhkOptions.map(bhk => (
              <div key={bhk} className="checkbox-option">
                <input
                  type="checkbox"
                  id={`mobile-bhk-${bhk}`}
                  checked={tempSelectedBHKs.includes(bhk)}
                  onChange={() => toggleTempBHK(bhk)}
                />
                <label htmlFor={`mobile-bhk-${bhk}`}>{bhk === '6+' ? '6+ BHK' : `${bhk} BHK`}</label>
              </div>
            ))}
          </div>
          {tempSelectedBHKs.length > 0 && (
            <button className="checkbox-clear" onClick={() => setTempSelectedBHKs([])}>Clear</button>
          )}
        </div>

        {/* Location */}
        <div className="filter-group">
          <label><MapPin size={16} /> Location</label>
          <div className="filter-dropdown-container">
            <select
              className="filter-dropdown"
              value={tempLocationFilter}
              onChange={e => setTempLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {locationOptions.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            {tempLocationFilter && (
              <button className="filter-clear" onClick={() => setTempLocationFilter('')}>
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
                    id={`mobile-amenity-${amenity}`}
                    checked={tempSelectedAmenities.includes(amenity)}
                    onChange={() => toggleTempAmenity(amenity)}
                  />
                  <label htmlFor={`mobile-amenity-${amenity}`}>{amenity}</label>
                </div>
              ))}
            </div>
            {tempSelectedAmenities.length > 0 && (
              <button className="checkbox-clear" onClick={() => setTempSelectedAmenities([])}>Clear</button>
            )}
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {getTempActiveFilterCount() > 0 && (
        <div className="active-filters-container">
          <div className="active-filters-title">Active Filters:</div>
          <div className="active-filters">
            {tempSearchTerm && (
              <span className="filter-tag">
                Search: {tempSearchTerm}
                <button onClick={() => setTempSearchTerm('')}><X size={14} /></button>
              </span>
            )}
            {tempSelectedPropertyTypes.map(type => (
              <span key={type} className="filter-tag">
                {type}
                <button onClick={() => toggleTempPropertyType(type)}><X size={14} /></button>
              </span>
            ))}
            {tempPropertyCategory !== 'all' && (
              <span className="filter-tag">
                {tempPropertyCategory === 'buy' ? 'For Sale' : 'For Rent'}
                <button onClick={() => setTempPropertyCategory('all')}><X size={14} /></button>
              </span>
            )}
            {tempSelectedBHKs.map(bhk => (
              <span key={bhk} className="filter-tag">
                {bhk === '6+' ? '6+ BHK' : `${bhk} BHK`}
                <button onClick={() => toggleTempBHK(bhk)}><X size={14} /></button>
              </span>
            ))}
            {tempLocationFilter && (
              <span className="filter-tag">
                Location: {tempLocationFilter}
                <button onClick={() => setTempLocationFilter('')}><X size={14} /></button>
              </span>
            )}
            {tempSelectedAmenities.map(amenity => (
              <span key={amenity} className="filter-tag">
                {amenity}
                <button onClick={() => toggleTempAmenity(amenity)}><X size={14} /></button>
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
              Showing <strong>{currentProperties.length}</strong> of <strong>{filteredProperties.length}</strong> properties
            </div>
            <div className="results-controls">
              <div className="results-sorting">
                <label htmlFor="sort-options">Sort by:</label>
                <select id="sort-options" value={sortOption} onChange={e => setSortOption(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
              {/* Property Category Toggle (Replacing Grid/List View) */}
              <div className="property-category-toggle">
                <button 
                  className={`category-btn ${propertyCategory === 'rental' ? 'active' : ''}`} 
                  onClick={() => setPropertyCategory('rental')}
                >
                  For Rent
                </button>
                <button 
                  className={`category-btn ${propertyCategory === 'all' ? 'active' : ''}`} 
                  onClick={() => setPropertyCategory('all')}
                >
                  All
                </button>
              </div>
            </div>
          </div>
          <div className={`properties-list ${viewMode}`}>
            {loading ? (
              <div className="loading">Loading properties...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : currentProperties.length === 0 ? (
              <div className="no-results">No properties found matching your criteria.</div>
            ) : (
              currentProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavourite={favourites.includes(property.id)}
                  onToggleFavourite={() => toggleFavourite(property.id)}
                  viewMode={viewMode}
                />
              ))
            )}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={currentPage === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}  
        </section>
        {/* Mobile Filter Drawer */}
        <div className={`mobile-filter-drawer ${isDrawerOpen ? 'open' : ''}`} ref={drawerRef}>
          <div className="drawer-header">
            <h2>Filter Properties</h2>
            {getTempActiveFilterCount() > 0 && (
              <span className="filter-badge">{getTempActiveFilterCount()}</span>
            )}
            <button className="btn-close" onClick={() => setIsDrawerOpen(false)}>
              <X size={20} />
            </button>
          </div>
          {/* Reusing the MobileFilterContent component for mobile */}
          <MobileFilterContent />
          <button className="btn-apply-filters" onClick={applyMobileFilters}>Apply Filters</button>
        </div>
      </main>
      {/* Mobile Filter Button */}
      <button className="btn-mobile-filters" onClick={() => setIsDrawerOpen(true)}>
        <Filter size={20} />
        {getTempActiveFilterCount() > 0 && (
          <span className="filter-badge">{getTempActiveFilterCount()}</span>
        )}
        Filters
      </button>
    </div>
  );
}
export default Properties;