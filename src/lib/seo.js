// src/lib/seo.js
// Shared SEO and public business constants.

export const SITE_NAME = "UrbanEdge Living Space";

export const DEFAULT_TITLE =
  "UrbanEdge Living Space | Real Estate in Gandhinagar & Ahmedabad";

export const DEFAULT_DESCRIPTION =
  "UrbanEdge Living Space helps buyers, tenants, investors and property owners discover residential real estate across Gandhinagar and Ahmedabad with direct local support.";

export const DEFAULT_LOGO_IMAGE = "/urbanedge-logo-640.webp";
export const DEFAULT_OG_IMAGE = DEFAULT_LOGO_IMAGE;

// Canonical public business details. These values are consolidated from the
// contact details already used by the repository; do not duplicate them in
// Navbar/Footer/Contact/WhatsApp components.
export const ORGANIZATION = {
  name: SITE_NAME,
  telephone: "+91-9408663544",
  whatsappNumber: "919408663544",
  email: "urbanedgelivingspace@gmail.com",
  streetAddress:
    "Shop no. 130, Sanskruti by Kaavyaratna, near Dholeshwar Park, Randesan",
  addressLocality: "Gandhinagar",
  addressRegion: "Gujarat",
  postalCode: "382421",
  addressCountry: "IN",
  instagram: "https://www.instagram.com/urbanedgelivingspace_official/",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14670.579401370644!2d72.6478357!3d23.1831588!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2bf0469b056b%3A0x9be13844a7842440!2sSANSKRUTI!5e0!3m2!1sen!2sin!4v1752990682824!5m2!1sen!2sin",
  mapsDirections:
    "https://www.google.com/maps/search/?api=1&query=Sanskruti%20by%20Kaavyaratna%20Randesan%20Gandhinagar",
};

const DEFAULT_OG_TYPE = "website";
const DEFAULT_TWITTER_CARD = "summary_large_image";

export function getSiteUrl() {
  const configured = import.meta.env.VITE_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

export function resolveUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = getSiteUrl();
  if (!base) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function buildTitle(pageTitle) {
  if (!pageTitle) return DEFAULT_TITLE;
  return pageTitle.includes(SITE_NAME)
    ? pageTitle
    : `${pageTitle} | ${SITE_NAME}`;
}

export function truncateDescription(text, maxLength = 160) {
  if (!text) return DEFAULT_DESCRIPTION;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const truncated = clean.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1)}…`;
}

export function buildMeta({
  title,
  description,
  path = typeof window !== "undefined" ? window.location.pathname : "/",
  image,
  type = DEFAULT_OG_TYPE,
  noindex = false,
} = {}) {
  return {
    title: buildTitle(title),
    description: truncateDescription(description || DEFAULT_DESCRIPTION),
    canonical: resolveUrl(path),
    image: image ? resolveUrl(image) : resolveUrl(DEFAULT_OG_IMAGE),
    type,
    twitterCard: DEFAULT_TWITTER_CARD,
    noindex,
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: ORGANIZATION.name,
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    url: getSiteUrl(),
    logo: resolveUrl(DEFAULT_LOGO_IMAGE),
    image: resolveUrl(DEFAULT_LOGO_IMAGE),
    sameAs: [ORGANIZATION.instagram],
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION.streetAddress,
      addressLocality: ORGANIZATION.addressLocality,
      addressRegion: ORGANIZATION.addressRegion,
      postalCode: ORGANIZATION.postalCode,
      addressCountry: ORGANIZATION.addressCountry,
    },
  };
}

export function breadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: resolveUrl(item.path),
    })),
  };
}

export function blogPostingSchema(post = {}, { path } = {}) {
  const publishedDate = post?.created_at
    ? new Date(post.created_at).toISOString()
    : undefined;
  const modifiedDate = post?.updated_at
    ? new Date(post.updated_at).toISOString()
    : publishedDate;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post?.title || SITE_NAME,
    description: post?.seo_description || post?.excerpt || DEFAULT_DESCRIPTION,
    url: resolveUrl(path || `/blog/${post?.slug || post?.id}`),
    ...(post?.image_url ? { image: resolveUrl(post.image_url) } : {}),
    ...(publishedDate ? { datePublished: publishedDate } : {}),
    ...(modifiedDate ? { dateModified: modifiedDate } : {}),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function realEstateListingSchema(property = {}, { path } = {}) {
  const priceType = property?.price_type;
  const priceValue =
    typeof property?.price === "number" ? property.price : Number(property?.price);
  const hasPrice = Number.isFinite(priceValue) && priceValue > 0;
  const offers =
    hasPrice && priceType !== "on_request"
      ? { "@type": "Offer", priceCurrency: "INR", price: String(priceValue) }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property?.name || SITE_NAME,
    description:
      property?.about_property || property?.description || DEFAULT_DESCRIPTION,
    url: resolveUrl(path || `/properties/${property?.slug || property?.id}`),
    ...(offers ? { offers } : {}),
    ...(property?.location
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: property.location,
          },
        }
      : {}),
  };
}
