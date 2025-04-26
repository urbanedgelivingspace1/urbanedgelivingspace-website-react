import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './PropertyDetail.css';
import defaultImage from '../assets/property.jpg';
import PropertyContactForm from './PropertyContactForm';

import {
  MdCheckCircle,
  MdPool,
  MdWifi,
  MdLocalParking,
  MdSecurity,
  MdFitnessCenter,
  MdElevator,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
import { FaUtensils, FaTree, FaCogs, FaBolt, FaDownload, FaBuilding, FaRulerCombined } from 'react-icons/fa';
import { GiPathDistance, GiHomeGarage } from 'react-icons/gi';

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

      if (error) {
        console.error('Error fetching property:', error);
        return;
      }
      setProperty(data);
    };

    fetchProperty();
  }, [id]);

  if (!property) return <div className="pd-loading">Loading Property Details...</div>;

  // Data processing remains similar but moved to separate functions for clarity
  const { configurations, amenities } = processPropertyData(property);
  const { truncated, isLong, fullDesc } = processDescription(property);

  return (
    <div className="pd-page">
      {/* Hero Section */}
      <section className="pd-hero" aria-label="Property overview">
        <img 
          src={property.image_url || defaultImage} 
          alt={property.name} 
          className="pd-hero-img"
          loading="lazy"
        />
        <div className="pd-hero-content">
          <h1>{property.name}</h1>
          <div className="pd-hero-meta">
            <p className="pd-location">
              <MdCheckCircle aria-hidden="true" />
              {property.location || 'Location not specified'}
            </p>
            <p className="pd-price">
              {property.price && `₹${property.price.toLocaleString()}`}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="pd-main-grid">
        {/* Primary Content Column */}
        <div className="pd-primary-content">
          <Section title="About the Property" initialOpen={true}>
            <DescriptionText
              fullDesc={fullDesc}
              truncated={truncated}
              isLong={isLong}
              showFullDesc={showFullDesc}
              toggle={() => setShowFullDesc(!showFullDesc)}
            />
          </Section>

          <Section title="Key Features">
            <QuickInfoGrid property={property} />
          </Section>

          {configurations.length > 0 && (
            <Section title="Floor Plans & Pricing">
              <ConfigurationsTable configurations={configurations} />
            </Section>
          )}

          {amenities.length > 0 && (
            <Section title="Amenities & Facilities">
              <AmenitiesGrid amenities={amenities} />
            </Section>
          )}

          {property.about_builder_company && (
            <Section title="About the Developer">
              <p>{property.about_builder_company}</p>
            </Section>
          )}

          {property.about_location && (
            <Section title="About the Location">
              <p>{property.about_location}</p>
            </Section>
          )}
        </div>

        {/* Secondary Content Column */}
        <div className="pd-secondary-content">
          <Section title="At a Glance" variant="card">
            <QuickFacts property={property} />
          </Section>

          {property.google_map_location && (
            <Section title="Location" variant="card">
              <LocationMap location={property.google_map_location} />
            </Section>
          )}

          {/* Property Contact Form: Inquiries */}
          <Section title="Inquire About This Property" variant="card">
          <PropertyContactForm property={property} />
          </Section>

          {property.brochure_url && (
            <Section variant="card">
              <BrochureDownload url={property.brochure_url} />
            </Section>
          )}
        </div>
      </main>
    </div>
  );
};

// Sub-components for better maintainability
const Section = ({ title, children, variant, initialOpen }) => (
  <section className={`pd-section ${variant ? `pd-section--${variant}` : ''}`}>
    {title && <h2 className="pd-section-title">{title}</h2>}
    <div className="pd-section-content">{children}</div>
  </section>
);

const DescriptionText = ({ fullDesc, truncated, isLong, showFullDesc, toggle }) => (
  <>
    <div className="pd-description-text" aria-expanded={isLong ? showFullDesc : undefined}>
      {showFullDesc ? fullDesc : truncated}
    </div>
    {isLong && (
      <button 
        className="pd-toggle-btn"
        onClick={toggle}
        aria-label={`${showFullDesc ? 'Collapse' : 'Expand'} description`}
      >
        {showFullDesc ? <><MdExpandLess /> Show Less</> : <><MdExpandMore /> Show More</>}
      </button>
    )}
  </>
);

const QuickInfoGrid = ({ property }) => (
  <div className="pd-quick-grid">
    <InfoItem label="Property Type" value={property.property_type} />
    <InfoItem label="BHK Configuration" value={property.bhk} />
    <InfoItem label="Area" value={property.carpet_area ? `${property.carpet_area} sq. yards` : null} />
    <InfoItem 
      label="Possession Date" 
      value={property.possession ? new Date(property.possession).toLocaleDateString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' }) : null} 
    />
    <InfoItem label="Total Units" value={property.no_of_units} />
    <InfoItem label="RERA Number" value={property.rera_no} />
    <InfoItem label="Developer" value={property.developed_by} />
    <InfoItem label="Project Area" value={property.project_area} />
    <InfoItem label="Towers" value={property.towers} />
    <InfoItem label="Floors" value={property.floor} />
    <InfoItem label="View" value={property.property_view} />
    <InfoItem label="Alloted Parking" value={property.parking} />
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="pd-info-item">
    <strong>{label}</strong>
    <span>{value || '—'}</span>
  </div>
);

const ConfigurationsTable = ({ configurations }) => (
  <div className="pd-table-container">
    <table className="pd-config-table">
      <thead>
        <tr>
          <th>Unit Type</th>
          <th>Area (sq.ft)</th>
          <th>Price Range</th>
        </tr>
      </thead>
      <tbody>
        {configurations.map((cfg, idx) => (
          <tr key={idx}>
            <td>{cfg.type || '—'}</td>
            <td>{cfg.area || '—'}</td>
            <td>{cfg.price ? `$${cfg.price.toLocaleString()}` : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AmenitiesGrid = ({ amenities }) => (
  <div className="pd-amenities-grid">
    {amenities.map((item, i) => (
      <AmenityItem key={i} name={item} />
    ))}
  </div>
);

const AmenityItem = ({ name }) => {
  const icon = getAmenityIcon(name);
  return (
    <div className="pd-amenity-item">
      <span className="pd-amenity-icon" aria-hidden="true">{icon}</span>
      <span className="pd-amenity-label">{name}</span>
    </div>
  );
};

const QuickFacts = ({ property }) => {
  const getDownloadLink = (driveUrl) => {
    const match = driveUrl?.match(/\/d\/(.*?)\//);
    if (!match) return null;
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  };

  const handleDownload = () => {
    const downloadUrl = getDownloadLink(property.google_drive_url);
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "Brochure.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="pd-quick-facts">
      <InfoCard icon={<FaBuilding />} label="Project Type" value={property.property_type || "Coming Soon"} />
      <InfoCard icon={<FaRulerCombined />} label="Total Area" value={property.project_area || "Coming Soon"} />
      <InfoCard icon={<MdLocalParking />} label="Price" value={property.price ? `₹${property.price.toLocaleString()}` : "Coming Soon"} />
      
      <div className="pd-info-card">
        <div className="pd-info-card-icon"><FaDownload /></div>
        <div className="pd-info-card-content">
          <div className="pd-info-card-label">Download Brochure</div>
          <div className="pd-info-card-value">
            {property.google_drive_url ? (
              <button
                onClick={handleDownload}
                className="pd-download-link"
                style={{
                  color: '#007BFF',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 'inherit',
                }}
              >
                Click to Download
              </button>
            ) : (
              <span style={{ fontStyle: 'italic', color: '#888' }}>Coming Soon</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="pd-info-card">
    <div className="pd-info-card-icon">{icon}</div>
    <div className="pd-info-card-content">
      <div className="pd-info-card-label">{label}</div>
      <div className="pd-info-card-value">{value || '—'}</div>
    </div>
  </div>
);

const LocationMap = ({ location }) => {
  // Extract the src if the location is an iframe string
  const extractSrc = (input) => {
    const match = input.match(/src=["']([^"']+)["']/);
    return match ? match[1] : input;
  };

  const mapSrc = extractSrc(location);

  return (
    <div className="pd-map-container">
      <iframe
        src={mapSrc}
        title="Property Location"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        style={{ width: '100%', height: '450px', border: 0 }}
      />
    </div>
  );
};

const BrochureDownload = ({ url }) => (
  <a href={url} className="pd-brochure-download" download>
    <FaDownload />
    Download Full Brochure
  </a>
);

// Helper functions
const processPropertyData = (property) => {
  // Configurations processing
  let configurations = [];
  try {
    const rawCfg = JSON.parse(property.floor_space_pricing || '[]');
    configurations = Array.isArray(rawCfg) ? rawCfg : [];
  } catch {
    configurations = [];
  }

  // Amenities processing
  let amenities = [];
  try {
    let raw = property.amenities;
  
    // If raw is a string, try parsing it as JSON
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw);
      } catch {
        // If parsing fails, split the string by commas
        raw = raw.split(',').map((item) => item.trim());
      }
    }
  
    // If raw is an array, clean up each item
    if (Array.isArray(raw)) {
      amenities = raw.map((item) => {
        let s = String(item).trim();
        // Remove surrounding quotes
        if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
          s = s.slice(1, -1);
        }
        // Remove unwanted brackets or escape characters
        // eslint-disable-next-line no-useless-escape
        s = s.replace(/[\[\]\\]/g, ''); // Remove unwanted brackets or escape characters
        return s.trim();
            });
          }

          // Final cleanup: remove any remaining double quotes
          amenities = amenities.map((item) => item.replace(/"/g, '').trim());
        } catch {
          amenities = [];
        }

  return { configurations, amenities };
};

const processDescription = (property) => {
  const fullDesc = property.about_property || 'No description available.';
  const limit = 300;
  const isLong = fullDesc.length > limit;
  const truncated = isLong ? `${fullDesc.slice(0, limit).trim()}…` : fullDesc;
  return { fullDesc, truncated, isLong };
};

const getAmenityIcon = (name) => {
  const key = name.toLowerCase();
  if (key.includes('pool')) return <MdPool />;
  if (key.includes('wifi')) return <MdWifi />;
  if (key.includes('parking')) return <MdLocalParking />;
  if (key.includes('security')) return <MdSecurity />;
  if (key.includes('gym')) return <MdFitnessCenter />;
  if (key.includes('elevator')) return <MdElevator />;
  if (key.includes('garden')) return <FaTree />;
  if (key.includes('generator')) return <FaBolt />;
  if (key.includes('cctv')) return <FaCogs />;
  if (key.includes('garage')) return <GiHomeGarage />;
  if (key.includes('dining')) return <FaUtensils />;
  if (key.includes('path')) return <GiPathDistance />;
  if (key.includes('clubhouse')) return <MdFitnessCenter />;
  if (key.includes('water')) return <MdCheckCircle />; // Placeholder for water supply
  if (key.includes('power')) return <MdCheckCircle />; // Placeholder for power backup
  if (key.includes('fire')) return <MdCheckCircle />; // Placeholder for fire safety
  if (key.includes('internet')) return <MdCheckCircle />; // Placeholder for internet
  if (key.includes('playground')) return <MdCheckCircle />; // Placeholder for playground
  if (key.includes('sports')) return <MdCheckCircle />; // Placeholder for sports facilities
  if (key.includes('balcony')) return <MdCheckCircle />; // Placeholder for balcony
  if (key.includes('terrace')) return <MdCheckCircle />; // Placeholder for terrace
  if (key.includes('garden')) return <MdCheckCircle />; // Placeholder for garden
  if (key.includes('lobby')) return <MdCheckCircle />; // Placeholder for lobby
  if (key.includes('courtyard')) return <MdCheckCircle />; // Placeholder for courtyard
  if (key.includes('landscaping')) return <MdCheckCircle />; // Placeholder for landscaping

  return <MdCheckCircle />;
};

export default PropertyDetail;