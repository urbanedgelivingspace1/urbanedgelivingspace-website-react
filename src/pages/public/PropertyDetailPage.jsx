// src/pages/public/PropertyDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MdCheckCircle,
  MdExpandMore,
  MdExpandLess,
  MdOutlineCalendarToday,
  MdOutlineLocationOn,
  MdHome,
  MdFitnessCenter,
  MdLocalParking,
  MdOutlinePhotoLibrary,
  MdOutlineCalendarMonth,
} from "react-icons/md";
import {
  FaBed,
  FaRuler,
  FaDownload,
  FaBuilding,
  FaRulerCombined,
  FaRegBuilding,
  FaIdCard,
} from "react-icons/fa";
import { Heart, Phone } from "lucide-react";

import { useProperty } from "../../hooks/useProperty";
import { useProperties } from "../../hooks/useProperties";
import { useFavouriteState } from "../../hooks/useFavouriteState";
import AmenitiesGrid, {
  parseAmenities,
} from "../../components/property/AmenitiesGrid";
import ConfigurationsTable, {
  parseConfigurations,
} from "../../components/property/ConfigurationsTable";
import InquiryForm from "../../components/forms/InquiryForm";
import SiteVisitForm from "../../components/forms/SiteVisitForm";
import WhatsAppButton from "../../components/shared/WhatsAppButton";
import SEOHead from "../../components/shared/SEOHead";
import {
  organizationSchema,
  breadcrumbSchema,
  realEstateListingSchema,
  ORGANIZATION,
} from "../../lib/seo";
import Skeleton from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import defaultImage from "../../assets/property-hero-1600.webp";
import PropertyCard from "../../components/PropertyCard";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  buildPropertyWhatsAppMessage,
  formatPropertyConfiguration,
  formatPropertyPrice,
  formatPropertyStatus,
  formatPropertyType,
  getPublicPropertyId,
} from "../../lib/propertyPresentation";
import "./PropertyDetailPage.css";

const LISTING_TYPE_META = {
  buy: { labelKey: "cards.forSale", modifier: "buy" },
  rent: { labelKey: "cards.forRent", modifier: "rent" },
  commercial: { labelKey: "cards.commercial", modifier: "commercial" },
};

/**
 * Long-form free-text fields (`about_property`, `about_builder_company`,
 * `about_location`, `explore_neighbourhood`) are entered as a single
 * string with no guaranteed paragraph breaks. In practice several rows
 * (e.g. "Atmos by Solaire") were saved with section labels like
 * "Project Layout:", "Amenities:", "Nearby Landmarks:" run directly
 * into the previous sentence with no space or newline at all, which
 * `white-space: pre-line` can't fix on its own since there's no `\n`
 * to preserve.
 *
 * This is a display-layer patch, not a data fix: it heuristically
 * inserts a paragraph break before anything that looks like a
 * "Label:" section header, and adds a space after any period that's
 * missing one. It won't be 100% perfect on every possible string, but
 * it turns the current garbled paragraphs back into readable sections
 * without needing a DB migration. The underlying `about_property`
 * (etc.) content should still be cleaned up at the source (admin
 * form / import script) going forward.
 */
function formatLongText(text) {
  if (!text) return "";

  let formatted = text;

  // Ensure a space after any period directly glued to the next word
  // (fixes "LLP.Project Layout" -> "LLP. Project Layout").
  formatted = formatted.replace(/\.(?=[A-Za-z0-9])/g, ". ");

  // Insert a paragraph break before short Title-Case "Label:" style
  // section headers (1-4 words, may include "&"), whether or not
  // they were preceded by punctuation.
  formatted = formatted.replace(
    /([.!?]\s+|^)([A-Z][\w'-]*(?:\s(?:&\s)?[\w'-]+){0,3}:)/g,
    (match, sep, label, offset) => (offset === 0 ? label : `\n\n${label}`),
  );

  // Break out a trailing "In short, ..." summary onto its own paragraph.
  formatted = formatted.replace(/\s+(In short,)/g, "\n\n$1");

  return formatted.trim();
}

function PropertyDetailPage() {
  const { id } = useParams();
  const { data: property, isLoading, isError } = useProperty(id);
  const { t } = useLanguage();
  const favouriteState = useFavouriteState();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);

  useEffect(() => {
    const openSiteVisit = () => setShowSiteVisitModal(true);
    window.addEventListener("urbanedge:open-site-visit", openSiteVisit);
    return () => window.removeEventListener("urbanedge:open-site-visit", openSiteVisit);
  }, []);

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (isError || !property) {
    return (
      <div className="pdp-error-container">
        <SEOHead title="Property Not Found" noindex />
        <h1>{t("property.notFoundTitle")}</h1>
        <p>{t("property.notFoundText")}</p>
        <div className="pdp-error-actions">
          <Button as={Link} to="/properties">{t("common.browseProperties")}</Button>
          <Button as={Link} to="/contact-us" variant="outline">{t("common.contact")}</Button>
          <WhatsAppButton variant="inline" label={t("common.whatsapp")} />
        </div>
      </div>
    );
  }

  const amenities = parseAmenities(property.amenities);
  const configurations = parseConfigurations(property.floor_space_pricing);
  const { truncated, isLong, fullDesc } = processDescription(property);
  const listingMeta = LISTING_TYPE_META[property.listing_type] || null;
  const identifier = property.slug || property.id;
  const configuration = formatPropertyConfiguration(property, { includeType: true });
  const price = formatPropertyPrice(property, {
    labels: {
      onRequest: t("price.onRequest"),
      startingFrom: t("price.startingFrom"),
      from: t("price.from"),
    },
  });
  const propertyStatus = formatPropertyStatus(property);
  const publicId = getPublicPropertyId(property);
  const isFavourite = favouriteState.isFavourite(property.id);
  const telHref = `tel:${ORGANIZATION.telephone.replace(/[^+\d]/g, "")}`;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: property.name, path: `/properties/${identifier}` },
  ];

  const propertyMessage = buildPropertyWhatsAppMessage(property);
  return (
    <div className="pdp-page">
      <SEOHead
        title={`${property.name}${property.location ? ` — ${property.location}` : ""}`}
        description={property.about_property}
        path={`/properties/${identifier}`}
        image={property.image_url}
        type="product"
        jsonLd={[
          organizationSchema(),
          realEstateListingSchema(property, {
            path: `/properties/${identifier}`,
          }),
          breadcrumbSchema(breadcrumbItems),
        ]}
      />

      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link to="/properties">Properties</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{property.name}</span>
      </nav>

      {/* Hero */}
      <section className="pdp-hero" aria-label="Property overview">
        <div className="pdp-hero-image-container">
          <img
            src={property.image_url || defaultImage}
            alt={property.name}
            className="pdp-hero-img"
            loading="eager"
            fetchpriority="high"
          />
          <div className="pdp-hero-badges">
            {listingMeta && (
              <span
                className={`pdp-listing-badge pdp-listing-badge--${listingMeta.modifier}`}
              >
                {t(listingMeta.labelKey)}
              </span>
            )}
            {formatPropertyType(property) && (
              <span className="pdp-property-badge">
                {formatPropertyType(property)}
              </span>
            )}
            {publicId && <span className="pdp-property-badge">{t("property.propertyId")}: {publicId}</span>}
            {propertyStatus && <span className="pdp-property-badge">{propertyStatus}</span>}
          </div>
          {property.google_drive_url && (
            <a
              href={property.google_drive_url}
              target="_blank"
              rel="noopener noreferrer"
              className="pdp-gallery-btn"
              aria-label={t("property.gallery")}
            >
              <MdOutlinePhotoLibrary /> {t("property.gallery")}
            </a>
          )}
        </div>

        <div className="pdp-hero-content">
          <div className="pdp-hero-title-section">
            <h1>{property.name}</h1>
            {property.rera_no && (
              <span
                className="pdp-rera-badge"
                title={`RERA No. ${property.rera_no}`}
              >
                <FaIdCard aria-hidden="true" /> RERA {property.rera_no}
              </span>
            )}
            <p className="pdp-location">
              <MdOutlineLocationOn aria-hidden="true" />
              {property.location || t("property.locationMissing")}
            </p>
            <p className="pdp-price">{price}</p>
          </div>

          <div className="pdp-hero-meta">
            <div className="pdp-hero-highlights">
              {configuration && (
                <div className="pdp-highlight-item">
                  <FaBed aria-hidden="true" />
                  <span>{configuration}</span>
                </div>
              )}
              {property.carpet_area && (
                <div className="pdp-highlight-item">
                  <FaRuler aria-hidden="true" />
                  <span>{property.carpet_area} sq. yards</span>
                </div>
              )}
              {property.developed_by && (
                <div className="pdp-highlight-item">
                  <FaRegBuilding aria-hidden="true" />
                  <span>{property.developed_by}</span>
                </div>
              )}
            </div>

            <div className="pdp-hero-actions">
              <Button
                as="a"
                href="#pdp-inquiry"
                variant="primary"
                className="pdp-contact-btn"
              >
                {t("common.enquire")}
              </Button>
              <Button as="a" href={telHref} variant="outline" className="pdp-contact-btn">
                <Phone size={17} aria-hidden="true" /> {t("common.call")}
              </Button>
              <WhatsAppButton
                variant="inline"
                message={propertyMessage}
                label={t("common.whatsapp")}
              />
              <Button
                type="button"
                variant="outline"
                className="pdp-contact-btn"
                onClick={() => setShowSiteVisitModal(true)}
              >
                <MdOutlineCalendarMonth /> {t("common.scheduleVisit")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="pdp-save-btn"
                aria-pressed={isFavourite}
                onClick={() => favouriteState.toggleFavourite(property.id)}
              >
                <Heart size={17} fill={isFavourite ? "currentColor" : "none"} aria-hidden="true" />
                {isFavourite ? t("property.saved") : t("property.save")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="pdp-main-grid">
        <div className="pdp-primary-content">
          <Section title={t("property.about")} icon={<MdHome />} initialOpen>
            <DescriptionText
              fullDesc={fullDesc}
              truncated={truncated}
              isLong={isLong}
              showFullDesc={showFullDesc}
              toggle={() => setShowFullDesc(!showFullDesc)}
              t={t}
            />
          </Section>

          <Section title={t("property.keyDetails")} icon={<MdCheckCircle />}>
            <QuickInfoGrid property={property} t={t} configuration={configuration} status={propertyStatus} />
          </Section>

          {configurations.length > 0 && (
            <Section
              title={t("property.floorPlans")}
              icon={<MdOutlineCalendarMonth />}
            >
              <div className="pdp-table-scroll">
                <ConfigurationsTable configurations={configurations} />
              </div>
            </Section>
          )}

          {amenities.length > 0 && (
            <Section title={t("property.amenities")} icon={<MdFitnessCenter />}>
              <AmenitiesGrid amenities={amenities} />
            </Section>
          )}

          {property.about_builder_company && (
            <Section title={t("property.developer")} icon={<FaBuilding />}>
              <p className="pdp-developer-info">
                {formatLongText(property.about_builder_company)}
              </p>
            </Section>
          )}

          <NearbyConnectivity property={property} t={t} />
        </div>

        <div className="pdp-secondary-content">
          <Section title={t("property.overview")} variant="card">
            <QuickFacts property={property} t={t} />
          </Section>

          {property.google_map_location && (
            <Section
              title={t("property.map")}
              variant="card"
              icon={<MdOutlineLocationOn />}
            >
              <LocationMap location={property.google_map_location} />
            </Section>
          )}

          <Section
            title={t("property.interested")}
            variant="card"
            icon={<MdCheckCircle />}
            id="pdp-inquiry"
          >
            <InquiryForm property={property} />
          </Section>

          <Section variant="card">
            <Button
              type="button"
              variant="outline"
              fullWidth
              className="pdp-site-visit-btn"
              onClick={() => setShowSiteVisitModal(true)}
            >
              <MdOutlineCalendarMonth /> {t("property.scheduleVisit")}
            </Button>
          </Section>
        </div>
      </div>

      <RelatedProperties property={property} t={t} />

      <p className="pdp-disclaimer">{t("property.disclaimer")}</p>

      <Modal
        isOpen={showSiteVisitModal}
        onClose={() => setShowSiteVisitModal(false)}
        title={t("property.scheduleVisit")}
      >
        <SiteVisitForm
          property={property}
          onSuccess={() => setShowSiteVisitModal(false)}
        />
      </Modal>

    </div>
  );
}

// Sub-components
const Section = ({ title, children, variant, initialOpen, icon, id }) => (
  <section
    id={id}
    className={`pdp-section ${variant ? `pdp-section--${variant}` : ""}`}
  >
    {title && (
      <h2 className="pdp-section-title">
        {icon && <span className="pdp-section-icon">{icon}</span>}
        {title}
      </h2>
    )}
    <div className="pdp-section-content">{children}</div>
  </section>
);

const DescriptionText = ({
  fullDesc,
  truncated,
  isLong,
  showFullDesc,
  toggle,
  t,
}) => (
  <>
    <div
      className="pdp-description-text"
      aria-expanded={isLong ? showFullDesc : undefined}
    >
      {showFullDesc ? fullDesc : truncated}
    </div>
    {isLong && (
      <button
        className="pdp-toggle-btn"
        onClick={toggle}
        aria-label={showFullDesc ? t("property.showLess") : t("property.showMore")}
      >
        {showFullDesc ? (
          <>
            <MdExpandLess /> {t("property.showLess")}
          </>
        ) : (
          <>
            <MdExpandMore /> {t("property.showMore")}
          </>
        )}
      </button>
    )}
  </>
);

const QuickInfoGrid = ({ property, t, configuration, status }) => (
  <div className="pdp-quick-grid">
    <InfoItem
      icon={<FaBuilding />}
      label={t("property.type")}
      value={formatPropertyType(property)}
    />
    <InfoItem icon={<FaBed />} label={t("property.configuration")} value={configuration} />
    <InfoItem
      icon={<FaRuler />}
      label={t("property.carpetArea")}
      value={property.carpet_area ? `${property.carpet_area} sq. yards` : null}
    />
    <InfoItem
      icon={<MdOutlineCalendarToday />}
      label={t("property.possession")}
      value={
        property.possession
          ? new Date(property.possession).toLocaleDateString("en-UK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : null
      }
    />
    <InfoItem
      icon={<FaBuilding />}
      label={t("property.totalUnits")}
      value={property.no_of_units}
    />
    <InfoItem
      icon={<FaIdCard />}
      label={t("property.reraNumber")}
      value={property.rera_no}
    />
    <InfoItem
      icon={<FaRegBuilding />}
      label={t("property.developer")}
      value={property.developed_by}
    />
    <InfoItem
      icon={<FaRulerCombined />}
      label={t("property.projectArea")}
      value={property.project_area}
    />
    <InfoItem icon={<FaBuilding />} label={t("property.towers")} value={property.towers} />
    <InfoItem icon={<FaBuilding />} label={t("property.floors")} value={property.floor} />
    <InfoItem
      icon={<MdOutlineLocationOn />}
      label={t("property.view")}
      value={property.property_view}
    />
    <InfoItem
      icon={<MdLocalParking />}
      label={t("property.parking")}
      value={property.parking}
    />
    <InfoItem icon={<MdCheckCircle />} label={t("property.status")} value={status} />
  </div>
);

const InfoItem = ({ icon, label, value }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="pdp-info-item">
      {icon && <span className="pdp-info-icon">{icon}</span>}
      <div className="pdp-info-content">
        <strong>{label}</strong>
        <span>{value}</span>
      </div>
    </div>
  );
};

const QuickFacts = ({ property, t }) => (
  <div className="pdp-quick-facts">
    <InfoCard
      icon={<FaBuilding />}
      label={t("property.type")}
      value={formatPropertyType(property)}
    />
    <InfoCard
      icon={<FaRulerCombined />}
      label={t("property.totalArea")}
      value={property.project_area}
    />
    {property.brochure_url && <BrochureDownload url={property.brochure_url} label={t("property.brochure")} />}
  </div>
);

const InfoCard = ({ icon, label, value }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="pdp-info-card">
      <div className="pdp-info-card-icon">{icon}</div>
      <div className="pdp-info-card-content">
        <div className="pdp-info-card-label">{label}</div>
        <div className="pdp-info-card-value">{value}</div>
      </div>
    </div>
  );
};

const LocationMap = ({ location }) => {
  const extractSrc = (input) => {
    const match = input.match(/src=["']([^"']+)["']/);
    return match ? match[1] : input;
  };
  const mapSrc = extractSrc(location);

  return (
    <div className="pdp-map-container">
      <iframe
        src={mapSrc}
        title="Property Location"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="pdp-map-iframe"
      />
    </div>
  );
};

const BrochureDownload = ({ url, label }) => (
  <a
    href={url}
    className="pdp-brochure-download"
    target="_blank"
    rel="noopener noreferrer"
    download
  >
    <FaDownload />
    <span>{label}</span>
  </a>
);

function normalizeConnectivity(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return Object.values(value);
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const NearbyConnectivity = ({ property, t }) => {
  const structured = normalizeConnectivity(
    property.nearby_connectivity || property.connectivity,
  );
  const narrative = [property.about_location, property.explore_neighbourhood]
    .filter(Boolean)
    .map(formatLongText);
  if (!structured.length && !narrative.length) return null;

  return (
    <Section title={t("property.nearby")} icon={<MdOutlineLocationOn />}>
      {structured.length > 0 && (
        <div className="pdp-connectivity-grid">
          {structured.map((item, index) => {
            const landmark = item.landmark || item.name || item.title;
            if (!landmark) return null;
            return (
              <article className="pdp-connectivity-item" key={`${landmark}-${index}`}>
                <strong>{landmark}</strong>
                {item.distance && <span>{item.distance}</span>}
                {(item.travel_time || item.time) && <span>{item.travel_time || item.time}</span>}
              </article>
            );
          })}
        </div>
      )}
      {narrative.length > 0 && (
        <div className="pdp-connectivity-narrative">
          <p className="pdp-connectivity-intro">{t("property.nearbyIntro")}</p>
          {narrative.map((text, index) => <p key={index}>{text}</p>)}
        </div>
      )}
    </Section>
  );
};

const RelatedProperties = ({ property, t }) => {
  const numericBhk = Number(property.bhk_min || property.bhk);
  const filters = {
    locality: property.locality || undefined,
    bhk: Number.isFinite(numericBhk) && numericBhk > 0 ? [String(numericBhk)] : [],
    pageSize: 5,
    sortBy: "newest",
  };
  const { data } = useProperties(filters, { enabled: Boolean(property.locality) });
  const related = (data?.data || []).filter((item) => item.id !== property.id).slice(0, 4);
  if (!related.length) return null;

  return (
    <section className="pdp-related" aria-labelledby="pdp-related-heading">
      <h2 id="pdp-related-heading">{t("property.related")}</h2>
      <div className="pdp-related-grid">
        {related.map((item) => <PropertyCard key={item.id} property={item} />)}
      </div>
    </section>
  );
};

const PropertyDetailSkeleton = () => (
  <div className="pdp-page">
    <div className="pdp-skeleton-hero">
      <Skeleton variant="rect" height={360} />
    </div>
    <div className="pdp-main-grid">
      <div className="pdp-primary-content">
        <Skeleton variant="text" lines={4} />
        <Skeleton variant="rect" height={160} />
        <Skeleton variant="rect" height={200} />
      </div>
      <div className="pdp-secondary-content">
        <Skeleton variant="rect" height={220} />
        <Skeleton variant="rect" height={260} />
      </div>
    </div>
  </div>
);

const processDescription = (property) => {
  const rawText = property.about_property || "No description available.";
  const fullDesc = formatLongText(rawText);
  const limit = 300;
  const isLong = fullDesc.length > limit;
  const truncated = isLong ? `${fullDesc.slice(0, limit).trim()}…` : fullDesc;
  return { fullDesc, truncated, isLong };
};

export default PropertyDetailPage;
