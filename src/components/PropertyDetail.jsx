import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './PropertyDetail.css';
import defaultImage from '../assets/property.jpg';
import { MdCheckCircle } from 'react-icons/md';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.error('Error fetching property:', error);
      else setProperty(data);
    };
    fetchProperty();
  }, [id]);

  if (!property) return <p>Loading...</p>;

  // Parse configurations
  let configurations = [];
  try {
    const raw = JSON.parse(property.floor_space_pricing || '[]');
    if (Array.isArray(raw) && raw.every(item => typeof item === 'object')) {
      configurations = raw;
    }
  } catch {
    configurations = [];
  }

  // Parse amenities
  let amenities = [];
  try {
    let raw = property.amenities;

    // Handle stringified array or nested stringified arrays
    if (typeof raw === 'string') {
      while (typeof raw === 'string') {
        raw = JSON.parse(raw);
      }
    }

    if (Array.isArray(raw)) {
      amenities = raw;
    } else if (typeof raw === 'string') {
      amenities = raw.split(',').map(a => a.trim());
    }
  } catch {
    amenities = (property.amenities || '').split(',').map(a => a.trim());
  }

  // Description toggle logic
  const fullDesc = property.about_property || 'No description available.';
  const limit = 300;
  const isLong = fullDesc.length > limit;
  const truncated = isLong ? fullDesc.slice(0, limit).trim() + '…' : fullDesc;

  return (
    <div className="pd-page">
      {/* Hero Section */}
      <div className="pd-hero">
        <img
          src={property.image_url || defaultImage}
          alt={property.name}
          className="pd-hero-img"
        />
        <div className="pd-hero-text">
          <h1>{property.name}</h1>
          <p>{property.location || 'Location not specified'}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pd-content">

        {/* About the Project */}
        <section className="pd-description">
          <h2>About the Project</h2>
          <p className={`pd-desc-text ${showFullDesc ? 'expanded' : ''}`}>
            {showFullDesc ? fullDesc : truncated}
          </p>
          {isLong && (
            <button className="pd-toggle-btn" onClick={() => setShowFullDesc(!showFullDesc)}>
              {showFullDesc ? 'Show Less' : 'Show More'}
            </button>
          )}
        </section>

        {/* Quick Info */}
        <section className="pd-quick-info">
          <div><strong>BHK:</strong> {property.bhk || '—'}</div>
          <div><strong>Carpet Area:</strong> {property.carpet_area || '—'}</div>
          <div><strong>Possession Date:</strong> {property.possession || '—'}</div>
          <div><strong>Units:</strong> {property.no_of_units || '—'}</div>
          <div><strong>RERA No.:</strong> {property.rera_no || '—'}</div>
          <div><strong>Developed By:</strong> {property.developed_by || '—'}</div>
          <div><strong>Property Type:</strong> {property.property_type || '—'}</div>
          <div><strong>Project Area:</strong> {property.project_area || '—'}</div>
          <div><strong>Ownership:</strong> {property.ownership || '—'}</div>
          <div><strong>Towers & Floors:</strong> {property.towers_floor || '—'}</div>
          <div><strong>View:</strong> {property.property_view || '—'}</div>
          <div><strong>Parking:</strong> {property.parking || '—'}</div>
        </section>

        {/* Configurations */}
        {configurations.length > 0 && (
          <section className="pd-config">
            <h2>Configurations</h2>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Area</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {configurations.map((cfg, idx) => (
                  <tr key={idx}>
                    <td>{cfg.type || '—'}</td>
                    <td>{cfg.area || '—'}</td>
                    <td>{cfg.price || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <section className="pd-amenities">
            <h2>Amenities</h2>
            <div className="pd-amenities-grid">
              {amenities.map((item, i) => (
                <div className="pd-amenity-item" key={i}>
                  <MdCheckCircle className="pd-icon" />
                  <span className="pd-label">{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Builder Info */}
        {property.about_builder_company && (
          <section className="pd-builder-info">
            <h2>About the Builder</h2>
            <p>{property.about_builder_company}</p>
          </section>
        )}

        {/* Location Section */}
        {(property.about_location || property.explore_neighbourhood || property.google_map_location) && (
          <section className="pd-location-info">
            <h2>Location Details</h2>

            {property.about_location && (
              <div className="pd-location-about">
                <h4>About Location</h4>
                <p>{property.about_location}</p>
              </div>
            )}

            {property.explore_neighbourhood && (
              <div className="pd-neighbourhood">
                <h4>Explore Neighbourhood</h4>
                <p>{property.explore_neighbourhood}</p>
              </div>
            )}

            {property.google_map_location && (
              <div className="pd-map-embed">
                <h4>Map</h4>
                <iframe
                  src={property.google_map_location}
                  title="Google Map Location"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
          </section>
        )}

        {/* Brochure */}
        {property.brochure_url && (
          <section className="pd-brochure">
            <a
              href={property.brochure_url}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-download-brochure"
            >
              📥 Download Brochure
            </a>
          </section>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
