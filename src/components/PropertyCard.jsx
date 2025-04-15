// src/components/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  return (
    <Link to={`/properties/${property.id}`} className="property-card-link">
      <div className="property-card">
        <div className="card-image">
          <img
            src={property.image}
            alt={property.title}
            className="property-image"
          />
          <div className="overlay">
            <FaSearch className="search-icon" />
          </div>
        </div>
        <div className="property-details">
          <h3 className="property-title">{property.title}</h3>
          <p className="property-location">{property.location}</p>
          <p className="property-description">“{property.description}”</p>
          <div className="property-meta">
            <span className="property-type">{property.property_type}</span>
            <span className="property-price">{property.price_range}</span>
          </div>
          <span className="view-details-btn">View Details →</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
