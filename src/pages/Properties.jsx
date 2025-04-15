// src/pages/Properties.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import PropertyCard from '../components/PropertyCard';
import './Properties.css';
import propertyImage from '../assets/property.jpg';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            placeholder="🔍 Search by name, location, or description..."
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
