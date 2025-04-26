import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaRulerCombined, FaBuilding } from 'react-icons/fa';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const title = property.title || property.name;
  const image = property.image || property.image_url;
  const propertyType = property.property_type?.trim() || 'Residential'; // ✅ ensures actual DB value is used

  return (
    <Link to={`/properties/${property.id}`} className="property-card-link">
      <div className="property-card">
        <div className="card-image">
          <img
            src={image}
            alt={title}
            className="property-image"
          />
          <div className="property-type">
            <FaBuilding className="type-icon" />
            <span>{propertyType}</span>
          </div>
        </div>
        
        <div className="property-details">
          <h3 className="property-title">{title}</h3>

          {property.location && (
            <div className="property-location">
              <FaMapMarkerAlt className="icon" />
              <span>{property.location}</span>
            </div>
          )}

          <div className="property-meta">
            {property.bhk && (
              <div className="meta-item">
                <FaBed className="meta-icon" />
                <span>{property.bhk} BHK</span>
              </div>
            )}
            {property.carpet_area && (
              <div className="meta-item">
                <FaRulerCombined className="meta-icon" />
                <span>{property.carpet_area} sq.yard</span>
              </div>
            )}
          </div>

          {property.price && (
            <div className="property-price">
              <span className="price">${property.price.toLocaleString()}</span>
              {property.price_per_sqft && (
                <span className="price-per"> (${property.price_per_sqft}/sq.ft)</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
