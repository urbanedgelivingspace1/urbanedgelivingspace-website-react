import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import {
  MapPin,
  BedDouble,
  Ruler,
  Building2,
  Heart,
  ShieldCheck,
  Star,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import { buildWhatsAppHref } from "./shared/WhatsAppButton";
import Skeleton from "./ui/Skeleton";
import { useFavouriteState } from "../hooks/useFavouriteState";
import defaultImage from "../assets/property.jpg";
import "./PropertyCard.css";

const LISTING_TYPE_META = {
  buy: { label: "For Sale", modifier: "buy" },
  rent: { label: "For Rent", modifier: "rent" },
  commercial: { label: "Commercial", modifier: "commercial" },
};

function formatBhk(property) {
  const min = property.bhk_min;
  const max = property.bhk_max;
  if (min != null && max != null) return min === max ? `${min} BHK` : `${min}-${max} BHK`;
  if (property.bhk) return String(property.bhk).includes('BHK') ? property.bhk : `${property.bhk} BHK`;
  return null;
}

function formatPrice(property) {
  const priceType = property.price_type || (property.price ? "exact" : "on_request");
  const price = typeof property.price === "number" ? property.price : Number(property.price);
  const hasPrice = Number.isFinite(price) && price > 0;
  if (priceType === "on_request" || !hasPrice) return { label: "Price on Request", showPerSqft: false };
  const formatted = `₹${price.toLocaleString("en-IN")}`;
  if (priceType === "starting_from") return { label: `Starting from ${formatted}`, showPerSqft: false };
  return { label: formatted, showPerSqft: true };
}

function isFeaturedProperty(value) {
  return value === true || value === 1 || value === "true" || value === "1";
}

function buildPropertyMessage(property, title, bhkLabel) {
  return [
    'Hello UrbanEdge Living Space,',
    '',
    "I'm interested in:",
    `Property: ${title}`,
    property.location ? `Location: ${property.location}` : null,
    bhkLabel ? `Configuration: ${bhkLabel}` : null,
    property.id ? `Property ID: ${property.id}` : null,
    '',
    'Please share more details.',
  ].filter(Boolean).join('\n');
}

const PropertyCard = ({
  property,
  isFavourite,
  onToggleFavourite,
  viewMode = "grid",
  showWhatsApp = true,
  showListingBadgeWhenFeatured = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(property.image || property.image_url || defaultImage);
  const [localFavourite, setLocalFavourite] = useState(false);
  const favouriteState = useFavouriteState();

  const title = property.title || property.name || 'Property';
  const propertyTypeList = Array.isArray(property.property_type)
    ? property.property_type.filter(Boolean)
    : property.property_type ? [property.property_type] : [];
  const propertyType = propertyTypeList.length ? propertyTypeList.join(" • ") : "Residential";
  const listingMeta = LISTING_TYPE_META[property.listing_type] || null;
  const bhkLabel = formatBhk(property);
  const { label: priceLabel, showPerSqft } = formatPrice(property);
  const fallbackFavourite = favouriteState.isFavourite?.(property.id);
  const favourite = onToggleFavourite ? Boolean(isFavourite) : (fallbackFavourite ?? localFavourite);
  const isFeatured = isFeaturedProperty(property.is_featured);
  const detailsPath = `/properties/${property.slug || property.id}`;

  const handleToggleFavourite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (onToggleFavourite) {
      onToggleFavourite();
    } else {
      const nextValue = !(fallbackFavourite ?? localFavourite);
      setLocalFavourite(nextValue);
      favouriteState.toggleFavourite?.(property.id);
    }
  };

  const whatsappHref = buildWhatsAppHref(buildPropertyMessage(property, title, bhkLabel));

  return (
    <article className={`property-card ${viewMode === "list" ? "property-card--list" : ""}`}>
      <Link
        to={detailsPath}
        className={`property-card-link ${viewMode === "list" ? "property-card-link--list" : ""}`}
        aria-label={`View details for ${title}`}
      >
        <div className="card-image">
          {!imageLoaded && <Skeleton variant="rect" className="card-image-skeleton" />}
          <img
            src={imageSrc}
            alt={`${title}${property.location ? ` in ${property.location}` : ''}`}
            className={`property-image ${imageLoaded ? "is-loaded" : ""}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              if (imageSrc !== defaultImage) setImageSrc(defaultImage);
              setImageLoaded(true);
            }}
            loading="lazy"
            decoding="async"
          />

          {listingMeta && (!isFeatured || showListingBadgeWhenFeatured) && (
            <span className={`property-listing-badge property-listing-badge--${listingMeta.modifier}`}>
              {listingMeta.label}
            </span>
          )}

          {isFeatured && (
            <span className="property-featured-badge"><Star size={12} strokeWidth={2.5} /> Featured</span>
          )}

          <div className="property-type">
            <Building2 className="type-icon" size={16} aria-hidden="true" />
            <span>{propertyType}</span>
          </div>
        </div>

        <div className="property-details">
          <div className="property-title-row">
            <h3 className="property-title">{title}</h3>
            {property.rera_no && (
              <span className="property-rera-badge" title={`RERA No. ${property.rera_no}`}>
                <ShieldCheck size={12} aria-hidden="true" /> RERA
              </span>
            )}
          </div>

          {property.location && (
            <div className="property-location"><MapPin className="icon" size={16} aria-hidden="true" /><span>{property.location}</span></div>
          )}

          <div className="property-meta">
            {bhkLabel && <div className="meta-item"><BedDouble className="meta-icon" size={18} aria-hidden="true" /><span>{bhkLabel}</span></div>}
            {property.carpet_area && <div className="meta-item"><Ruler className="meta-icon" size={18} aria-hidden="true" /><span>{property.carpet_area} sq. yd.</span></div>}
            {property.developed_by && (
              <div className="meta-item meta-item--developer" title={`Developed by ${property.developed_by}`}>
                <UserRound className="meta-icon" size={18} aria-hidden="true" /><span>{property.developed_by}</span>
              </div>
            )}
          </div>

          <div className="property-price">
            <span className="price">{priceLabel}</span>
            {showPerSqft && property.price_per_sqft && <span className="price-per"> (₹{property.price_per_sqft}/sq.ft)</span>}
          </div>

          <span className="property-card-view-details">View Details <ArrowUpRight size={15} aria-hidden="true" /></span>
        </div>
      </Link>

      <div className="card-quick-actions">
        <button
          type="button"
          className={`quick-action-btn quick-action-btn--favourite ${favourite ? "is-active" : ""}`}
          onClick={handleToggleFavourite}
          aria-pressed={favourite}
          aria-label={favourite ? "Remove from saved properties" : "Save property"}
        >
          <Heart size={16} fill={favourite ? "currentColor" : "none"} aria-hidden="true" />
        </button>
        {showWhatsApp && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-action-btn quick-action-btn--whatsapp"
            onClick={(event) => event.stopPropagation()}
            aria-label={`Ask about ${title} on WhatsApp (opens in a new tab)`}
          >
            <FaWhatsapp aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
};

export default PropertyCard;
