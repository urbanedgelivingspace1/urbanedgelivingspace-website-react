import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import PropertyCard from '../components/PropertyCard';
import './Properties.css';
import propertyImage from '../assets/property.jpg';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setProperties(data);
        setFilteredProperties(data); // Initialize filtered properties
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const filterProperties = () => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      const filtered = properties.filter((property) => {
        // Check if each field exists and matches the search term
        const nameMatch = property.name?.toLowerCase().includes(lowerCaseSearchTerm);
        const descriptionMatch = property.description?.toLowerCase().includes(lowerCaseSearchTerm);
        const locationMatch = property.location?.toLowerCase().includes(lowerCaseSearchTerm);
        const propertyTypeMatch = property.property_type?.toLowerCase().includes(lowerCaseSearchTerm);
        const priceRangeMatch = property.price_range?.toLowerCase().includes(lowerCaseSearchTerm);

        // Return true if any of the fields match
        return nameMatch || descriptionMatch || locationMatch || propertyTypeMatch || priceRangeMatch;
      });

      setFilteredProperties(filtered);
    };

    filterProperties();
  }, [searchTerm, properties]);

  return (
    <div className="properties-page">
      {/* Hero Section */}
      <header className="properties-hero" role="banner">
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="hero-content fade-in" tabIndex="0">
          <h1>Discover Your Ideal Property</h1>
          <p>Explore premium listings curated for luxury, comfort, and convenience.</p>
        </div>
      </header>

      {/* Main content wrapper */}
      <main className="explore-properties container" aria-labelledby="explore-listings-heading">
        <div className="section-header">
          <h2 id="explore-listings-heading">Explore Our Latest Listings</h2>
          <p>
            Browse by city, configuration, or lifestyle preferences. All listings are RERA approved and verified.
          </p>
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search by name, location, description, type, or price range..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
            aria-label="Search properties"
          />
        </div>

        {filteredProperties.length > 0 ? (
          <div className="property-grid">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={{
                  id: property.id,
                  title: property.name,
                  description: property.description,
                  location: property.location,
                  image: property.image_url || propertyImage,
                  property_type: property.property_type,
                  price_range: property.price_range,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No properties match your search. Try a different keyword.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Properties;