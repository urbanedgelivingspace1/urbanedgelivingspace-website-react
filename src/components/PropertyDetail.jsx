// PropertyDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './PropertyDetail.css';
import defaultImage from '../assets/property.jpg';
import PropertyPriceForm from './PropertyPriceForm';

// All icons
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
  MdOutlineCalendarToday,
  MdOutlineLocationOn,
  MdHome,
  MdOutlinePets,
  MdLocalDining,
  MdOutlineSportsSoccer,
  MdLocalLaundryService,
  MdAir,
  MdFireExtinguisher,
  MdClose,
} from 'react-icons/md';
import {
  FaTree,
  FaUtensils,
  FaCogs,
  FaBolt,
  FaSwimmer,
  FaPlay,
  FaBicycle,
  FaDoorOpen,
  FaBed,
  FaRuler,
  FaDownload,
  FaBuilding,
  FaRulerCombined,
  FaRegBuilding,
  FaIdCard,
} from 'react-icons/fa';
import {
  GiPathDistance,
  GiHomeGarage,
  GiFireplace,
  GiTennisCourt,
} from 'react-icons/gi';

// Amenity icon mapping
const amenityIconMap = [
  { keywords: ['pool', 'swim'], icon: <MdPool /> },
  { keywords: ['wifi', 'internet'], icon: <MdWifi /> },
  { keywords: ['parking', 'garage'], icon: <MdLocalParking /> },
  { keywords: ['security', 'guard'], icon: <MdSecurity /> },
  { keywords: ['gym', 'fitness', 'workout'], icon: <MdFitnessCenter /> },
  { keywords: ['elevator', 'lift'], icon: <MdElevator /> },
  { keywords: ['garden', 'park', 'tree'], icon: <FaTree /> },
  { keywords: ['clubhouse'], icon: <FaUtensils /> },
  { keywords: ['maintenance'], icon: <FaCogs /> },
  { keywords: ['power backup', 'electricity'], icon: <FaBolt /> },
  { keywords: ['pet', 'animal'], icon: <MdOutlinePets /> },
  { keywords: ['restaurant', 'dining'], icon: <MdLocalDining /> },
  { keywords: ['sports', 'soccer', 'cricket'], icon: <MdOutlineSportsSoccer /> },
  { keywords: ['laundry'], icon: <MdLocalLaundryService /> },
  { keywords: ['ac', 'air condition'], icon: <MdAir /> },
  { keywords: ['fire', 'extinguisher'], icon: <MdFireExtinguisher /> },
  { keywords: ['bicycle', 'cycling'], icon: <FaBicycle /> },
  { keywords: ['play', 'playground'], icon: <FaPlay /> },
  { keywords: ['tennis'], icon: <GiTennisCourt /> },
  { keywords: ['path', 'distance'], icon: <GiPathDistance /> },
  { keywords: ['open area'], icon: <FaDoorOpen /> },
  { keywords: ['bedroom'], icon: <FaBed /> },
  { keywords: ['garage'], icon: <GiHomeGarage /> },
  { keywords: ['fireplace'], icon: <GiFireplace /> },
];

const getAmenityIcon = (name) => {
  const lowerName = name.toLowerCase();
  for (const { keywords, icon } of amenityIconMap) {
    if (keywords.some((kw) => lowerName.includes(kw))) return icon;
  }
  return <MdCheckCircle />;
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
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
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const closeContactModal = () => {
    setShowContactForm(false);
  };

  if (loading) {
    return (
      <div className="pd-loading-container">
        <div className="pd-loading">Loading Property Details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pd-error-container">
        <div className="pd-error">Property not found or unavailable. Please try again later.</div>
      </div>
    );
  }

  const { configurations, amenities } = processPropertyData(property);
  const { truncated, isLong, fullDesc } = processDescription(property);

  return (
    <div className="pd-page">
      {/* Property Header */}
      <section className="pd-hero" aria-label="Property overview">
        <div className="pd-hero-image-container">
          <img
            src={property.image_url || defaultImage}
            alt={property.name}
            className="pd-hero-img"
            loading="lazy"
          />
          {property.property_type && (
            <div className="pd-property-badge">{property.property_type}</div>
          )}
        </div>

        <div className="pd-hero-content">
          <div className="pd-hero-title-section">
            <h1>{property.name}</h1>
            <p className="pd-location">
              <MdOutlineLocationOn aria-hidden="true" />
              {property.location || 'Location not specified'}
            </p>
          </div>

          <div className="pd-hero-meta">
            <div className="pd-hero-highlights">
              {property.bhk && (
                <div className="pd-highlight-item">
                  <FaBed aria-hidden="true" />
                  <span>{property.bhk}</span>
                </div>
              )}
              {property.carpet_area && (
                <div className="pd-highlight-item">
                  <FaRuler aria-hidden="true" />
                  <span>{property.carpet_area} sq. yards</span>
                </div>
              )}
              {property.developed_by && (
                <div className="pd-highlight-item">
                  <FaRegBuilding aria-hidden="true" />
                  <span>{property.developed_by}</span>
                </div>
              )}
            </div>

            <button
              className="pd-contact-btn"
              onClick={() => setShowContactForm(true)}
              aria-label="Contact us for price"
            >
              Request Price Details
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="pd-main-grid">
        <div className="pd-primary-content">
          <Section title="About" icon={<MdHome />} initialOpen>
            <DescriptionText
              fullDesc={fullDesc}
              truncated={truncated}
              isLong={isLong}
              showFullDesc={showFullDesc}
              toggle={() => setShowFullDesc(!showFullDesc)}
            />
          </Section>

          <Section title="Key Details" icon={<MdCheckCircle />}>
            <QuickInfoGrid property={property} />
          </Section>

          {amenities.length > 0 && (
            <Section title="Amenities & Facilities" icon={<MdFitnessCenter />}>
              <AmenitiesGrid amenities={amenities} />
            </Section>
          )}

          {property.about_builder_company && (
            <Section title="About the Developer" icon={<FaBuilding />}>
              <p className="pd-developer-info">{property.about_builder_company}</p>
            </Section>
          )}

          {property.about_location && (
            <Section title="Location Highlights" icon={<MdOutlineLocationOn />}>
              <p className="pd-location-info">{property.about_location}</p>
            </Section>
          )}
        </div>

        <div className="pd-secondary-content">
          <Section title="Property Overview" variant="card">
            <QuickFacts property={property} />
          </Section>

          {property.google_map_location && (
            <Section title="Map Location" variant="card" icon={<MdOutlineLocationOn />}>
              <LocationMap location={property.google_map_location} />
            </Section>
          )}

          <Section title="Interested in this Property?" variant="card" icon={<MdCheckCircle />}>
            <PropertyPriceForm property={property} />
          </Section>

          {property.brochure_url && (
            <Section variant="card">
              <BrochureDownload url={property.brochure_url} />
            </Section>
          )}
        </div>
      </main>

      {/* Floating Contact Form Modal */}
      {showContactForm && (
        <div className="pd-modal-backdrop" onClick={closeContactModal}>
          <div className="pd-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="pd-modal-header">
              <h3 className="pd-modal-title">Request Price Details</h3>
              <button className="pd-modal-close-btn" onClick={closeContactModal} aria-label="Close form">
                <MdClose />
              </button>
            </div>
            
            <div className="pd-modal-body">
              <div className="pd-modal-property-info">
                <img 
                  src={property.image_url || defaultImage} 
                  alt={property.name} 
                  className="pd-modal-property-img"
                />
                <div className="pd-modal-property-details">
                  <h4>{property.name}</h4>
                  <div className="pd-modal-property-location">
                    <MdOutlineLocationOn />
                    <span>{property.location || 'Location not specified'}</span>
                  </div>
                  {property.bhk && (
                    <div className="pd-modal-property-spec">
                      <FaBed />
                      <span>{property.bhk}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <PropertyPriceForm property={property} />
            </div>
            
            <div className="pd-modal-footer">
              <button className="pd-modal-cancel-btn" onClick={closeContactModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components with improved styling
const Section = ({ title, children, variant, initialOpen, icon }) => (
  <section className={`pd-section ${variant ? `pd-section--${variant}` : ''}`}>
    {title && (
      <h2 className="pd-section-title">
        {icon && <span className="pd-section-icon">{icon}</span>}
        {title}
      </h2>
    )}
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
    <InfoItem 
      icon={<FaBuilding />}
      label="Property Type" 
      value={property.property_type} 
    />
    <InfoItem 
      icon={<FaBed />}
      label="BHK Configuration" 
      value={property.bhk} 
    />
    <InfoItem 
      icon={<FaRuler />}
      label="Carpet Area" 
      value={property.carpet_area ? `${property.carpet_area} sq. yards` : null} 
    />
    <InfoItem 
      icon={<MdOutlineCalendarToday />}
      label="Possession Date" 
      value={property.possession ? new Date(property.possession).toLocaleDateString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' }) : null} 
    />
    <InfoItem 
      icon={<FaBuilding />}
      label="Total Units" 
      value={property.no_of_units} 
    />
    <InfoItem 
      icon={<FaIdCard />}
      label="RERA Number" 
      value={property.rera_no} 
    />
    <InfoItem 
      icon={<FaRegBuilding />}
      label="Developer" 
      value={property.developed_by} 
    />
    <InfoItem 
      icon={<FaRulerCombined />}
      label="Project Area" 
      value={property.project_area} 
    />
    <InfoItem 
      icon={<FaBuilding />}
      label="Towers" 
      value={property.towers} 
    />
    <InfoItem 
      icon={<FaBuilding />}
      label="Floors" 
      value={property.floor} 
    />
    <InfoItem 
      icon={<MdOutlineLocationOn />}
      label="View" 
      value={property.property_view} 
    />
    <InfoItem 
      icon={<MdLocalParking />}
      label="Alloted Parking" 
      value={property.parking} 
    />
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="pd-info-item">
    {icon && <span className="pd-info-icon">{icon}</span>}
    <div className="pd-info-content">
      <strong>{label}</strong>
      <span>{value || '—'}</span>
    </div>
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
            <td className="pd-price-cell">{cfg.price ? `$${cfg.price.toLocaleString()}` : 'Contact for Price'}</td>
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
      link.setAttribute("download", "Property_Brochure.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="pd-quick-facts">
      <InfoCard 
        icon={<FaBuilding />} 
        label="Property Type" 
        value={property.property_type || "Coming Soon"} 
      />
      
      <InfoCard 
        icon={<FaRulerCombined />} 
        label="Total Area" 
        value={property.project_area || "Coming Soon"} 
      />
      
      {property.google_drive_url && (
        <div className="pd-info-card pd-download-card">
          <div className="pd-info-card-icon"><FaDownload /></div>
          <div className="pd-info-card-content">
            <div className="pd-info-card-label">Property Brochure</div>
            <button
              onClick={handleDownload}
              className="pd-download-button"
              aria-label="Download property brochure"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
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
        className="pd-map-iframe"
      />
    </div>
  );
};

const BrochureDownload = ({ url }) => (
  <a href={url} className="pd-brochure-download" download>
    <FaDownload />
    <span>Download Property Brochure</span>
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
        s = s.replace(/[\[\]\\]/g, '');
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

export default PropertyDetail;