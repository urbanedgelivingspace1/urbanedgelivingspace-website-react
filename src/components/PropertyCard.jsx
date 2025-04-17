// src/components/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaRuler } from 'react-icons/fa';
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
        </div>
        <div className="property-details">
          <h3 className="property-title">{property.title}</h3>
          <p className="property-location">
            <FaMapMarkerAlt className="icon" /> {property.location}
          </p>
          <p className="property-bhk">
            <FaBed className="icon" /> {property.bhk} BHK
          </p>
          <p className="property-sq">
            <FaRuler className="icon" /> {property.sq} Sq Ft
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
