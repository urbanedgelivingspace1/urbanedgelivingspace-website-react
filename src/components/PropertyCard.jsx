// src/components/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaHome, FaDollarSign } from 'react-icons/fa';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  // support both shapes: { title, image, ... } or { name, image_url, ... }
  const title = property.title || property.name;
  const image = property.image || property.image_url;
  return (
    <Link to={`/properties/${property.id}`} className="property-card-link">
      <div className="property-card">
        <div className="card-image">
          <img
            src={image}
            alt={title}
            className="property-image"
          />
        </div>
        <div className="property-details">
          <h3 className="property-title">{title}</h3>

          {property.location && (
            <p className="property-location">
              <FaMapMarkerAlt className="icon" /> {property.location}
            </p>
          )}

          {property.property_type && (
            <p className="property-type">
              <FaHome className="icon" /> {property.property_type}
            </p>
          )}

          {property.price_range && (
            <p className="property-price">
              <FaDollarSign className="icon" /> {property.price_range}
            </p>
          )}

          {/* if you want a short teaser: */}
          {property.description && (
            <p className="property-description">
              {property.description.length > 70
                ? property.description.slice(0, 67) + '…'
                : property.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
