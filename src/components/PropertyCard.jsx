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
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";
import { buildWhatsAppHref } from "./shared/WhatsAppButton";
import Skeleton from "./ui/Skeleton";
import { useFavouriteState } from "../hooks/useFavouriteState";
import { useLanguage } from "../i18n/LanguageContext";
import {
  buildPropertyWhatsAppMessage,
  formatPropertyConfiguration,
  formatPropertyPrice,
  formatPropertyStatus,
  formatPropertyType,
} from "../lib/propertyPresentation";
import defaultImage from "../assets/property-hero-960.webp";
import "./PropertyCard.css";
import "./PropertyCard.modern.css";

const LISTING_TYPE_META = {
  buy: { labelKey: "cards.forSale", modifier: "buy" },
  rent: { labelKey: "cards.forRent", modifier: "rent" },
  commercial: { labelKey: "cards.commercial", modifier: "commercial" },
};

function isFeaturedProperty(value) {
  return value === true || value === 1 || value === "true" || value === "1";
}

const PropertyCard = ({
  property,
  isFavourite,
  onToggleFavourite,
  viewMode = "grid",
  showWhatsApp = true,
  showListingBadgeWhenFeatured = true,
}) => {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(property.image || property.image_url || defaultImage);
  const [localFavourite, setLocalFavourite] = useState(false);
  const favouriteState = useFavouriteState();

  const title = property.title || property.name || 'Property';
  const propertyType = formatPropertyType(property);
  const listingMeta = LISTING_TYPE_META[property.listing_type] || null;
  const bhkLabel = formatPropertyConfiguration(property);
  const propertyStatus = formatPropertyStatus(property);
  const priceLabel = formatPropertyPrice(property, {
    labels: {
      onRequest: t("price.onRequest"),
      startingFrom: t("price.startingFrom"),
      from: t("price.from"),
    },
  });
  const showPerSqft = property.price_type !== "on_request" && Boolean(property.price);
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

  const whatsappHref = buildWhatsAppHref(buildPropertyWhatsAppMessage(property));

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

          {(listingMeta || isFeatured) && (
            <div className="property-badges-left">
              {listingMeta && (!isFeatured || showListingBadgeWhenFeatured) && (
                <span className={`property-listing-badge property-listing-badge--${listingMeta.modifier}`}>
                  {t(listingMeta.labelKey)}
                </span>
              )}
              {isFeatured && (
                <span className="property-featured-badge"><Star size={12} strokeWidth={2.5} /> {t("cards.featured")}</span>
              )}
            </div>
          )}

          {propertyType && (
            <div className="property-type">
              <Building2 className="type-icon" size={16} aria-hidden="true" />
              <span>{propertyType}</span>
            </div>
          )}
        </div>

        <div className="property-details">
          <div className="property-title-row">
            <h3 className="property-title">{title}</h3>
            {property.rera_no && (
              <span className="property-rera-badge" title={`RERA No. ${property.rera_no}`}>
                <ShieldCheck size={12} aria-hidden="true" /> {t("cards.rera")}
              </span>
            )}
          </div>

          {property.location && (
            <div className="property-location"><MapPin className="icon" size={16} aria-hidden="true" /><span>{property.location}</span></div>
          )}

          <div className="property-meta">
            {bhkLabel && <div className="meta-item"><BedDouble className="meta-icon" size={18} aria-hidden="true" /><span>{bhkLabel}</span></div>}
            {property.carpet_area && <div className="meta-item"><Ruler className="meta-icon" size={18} aria-hidden="true" /><span>{property.carpet_area} sq. yd.</span></div>}
            {propertyStatus && (
              <div className="meta-item meta-item--status">
                <CalendarClock className="meta-icon" size={18} aria-hidden="true" /><span>{propertyStatus}</span>
              </div>
            )}
          </div>

          <div className="property-price">
            <span className="price">{priceLabel}</span>
            {showPerSqft && property.price_per_sqft && <span className="price-per"> (₹{property.price_per_sqft}/sq.ft)</span>}
          </div>

          <span className="property-card-view-details">{t("cards.viewDetails")} <ArrowUpRight size={15} aria-hidden="true" /></span>
        </div>
      </Link>

      <div className="card-quick-actions">
        <button
          type="button"
          className={`quick-action-btn quick-action-btn--favourite ${favourite ? "is-active" : ""}`}
          onClick={handleToggleFavourite}
          aria-pressed={favourite}
          aria-label={favourite ? t("cards.remove") : t("cards.save")}
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
            aria-label={`${t("cards.ask")}: ${title}`}
          >
            <FaWhatsapp aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
};

export default PropertyCard;
