import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './PropertyDetail.css';
import defaultImage from '../assets/property.jpg';

// React Icons
import { MdCheckCircle } from 'react-icons/md';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

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

  const configurations = Array.isArray(property.configuration)
    ? property.configuration
    : JSON.parse(property.configuration || '[]');

  const amenities = Array.isArray(property.amenities)
    ? property.amenities
    : (property.amenities || '').split(',').map(a => a.trim());

  return (
    <div className="pd-page">
      {/* Hero Section */}
      <div className="pd-hero">
        <img src={defaultImage} alt={property.name} className="pd-hero-img" />
        <div className="pd-hero-text">
          <h1>{property.name}</h1>
          <p>{property.location}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pd-content">
        {/* Description */}
        <section className="pd-description">
          <h2>About the Project</h2>
          <p>{property.description}</p>
        </section>

        {/* Quick Info */}
        <section className="pd-quick-info">
          <div><strong>Project Area:</strong> {property.project_area}</div>
          <div><strong>Ownership:</strong> {property.ownership}</div>
          <div><strong>Total Towers:</strong> {property.total_towers}</div>
          <div><strong>Total Floors:</strong> {property.total_floors}</div>
          <div><strong>View:</strong> {property.property_view}</div>
          <div><strong>Parking:</strong> {property.parking}</div>
          <div><strong>RERA No.:</strong> {property.rera_number}</div>
          <div><strong>Launch Date:</strong> {property.launch_date}</div>
          <div><strong>Possession Date:</strong> {property.possession_date}</div>
          <div><strong>Price Range:</strong> {property.price_range}</div>
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
                {configurations.map((config, index) => (
                  <tr key={index}>
                    <td>{config.type}</td>
                    <td>{config.area}</td>
                    <td>{config.price || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Amenities (tick only) */}
        {amenities.length > 0 && (
          <section className="pd-amenities">
            <h2>Amenities</h2>
            <div className="pd-amenities-grid">
              {amenities.map((item, i) => (
                <div className="pd-amenity-item" key={i}>
                  <span className="pd-icon"><MdCheckCircle /></span>
                  <span className="pd-label">{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Brochure */}
        {property.brochure_url && (
          <section className="pd-brochure">
            <a href={property.brochure_url} target="_blank" rel="noopener noreferrer" className="pd-download-brochure">
              📥 Download Brochure
            </a>
          </section>
        )}

        {/* Map */}
        {property.map_embed_url && (
          <section className="pd-map">
            <h2>Location</h2>
            <iframe
              src={property.map_embed_url}
              title="Property Location"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </section>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
