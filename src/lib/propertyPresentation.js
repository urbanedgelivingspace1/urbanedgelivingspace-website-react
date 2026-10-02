const COMPACT_NUMBER_FORMAT = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

function toPositiveNumber(value) {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function normalizeBhkValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const text = String(value).trim();
  if (!text) return null;
  return /bhk/i.test(text) ? text.replace(/\s*bhk/i, " BHK") : `${text} BHK`;
}

export function getPropertyTypes(property = {}) {
  const value = property.property_type;
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return value ? [String(value).trim()].filter(Boolean) : [];
}

export function formatPropertyType(property = {}) {
  const values = getPropertyTypes(property);
  return values.length ? values.join(" • ") : null;
}

export function formatPropertyConfiguration(property = {}, { includeType = false } = {}) {
  const min = toPositiveNumber(property.bhk_min);
  const max = toPositiveNumber(property.bhk_max);
  let bhk = null;

  if (min && max) {
    bhk = min === max ? `${COMPACT_NUMBER_FORMAT.format(min)} BHK` : `${COMPACT_NUMBER_FORMAT.format(min)}–${COMPACT_NUMBER_FORMAT.format(max)} BHK`;
  } else if (min) {
    bhk = `${COMPACT_NUMBER_FORMAT.format(min)}+ BHK`;
  } else {
    bhk = normalizeBhkValue(property.bhk);
  }

  if (!includeType || !bhk) return bhk;

  const specificType = getPropertyTypes(property).find((type) =>
    /villa|bungalow|penthouse|studio/i.test(type),
  );
  return specificType ? `${bhk} ${specificType}` : bhk;
}

export function formatCompactInr(value) {
  const price = toPositiveNumber(value);
  if (!price) return null;
  if (price >= 10_000_000) return `₹${COMPACT_NUMBER_FORMAT.format(price / 10_000_000)} Cr`;
  if (price >= 100_000) return `₹${COMPACT_NUMBER_FORMAT.format(price / 100_000)} Lakh`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatPropertyPrice(
  property = {},
  {
    shortPrefix = false,
    labels = {
      onRequest: "Price on Request",
      startingFrom: "Starting from",
      from: "From",
    },
  } = {},
) {
  const formatted = formatCompactInr(property.price);
  const priceType = property.price_type || (formatted ? "exact" : "on_request");
  if (priceType === "on_request" || !formatted) return labels.onRequest;
  if (priceType === "starting_from") {
    return `${shortPrefix ? labels.from : labels.startingFrom} ${formatted}`;
  }
  return formatted;
}

export function formatPropertyStatus(property = {}) {
  const explicit =
    property.availability_status ||
    property.availability ||
    property.construction_status ||
    property.property_status;
  if (explicit && typeof explicit === "string") return explicit.trim() || null;

  if (!property.possession) return null;
  const date = new Date(property.possession);
  if (Number.isNaN(date.getTime())) return String(property.possession);
  return `Possession ${date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  })}`;
}

export function getPublicPropertyId(property = {}) {
  return property.property_id || property.public_id || property.id || null;
}

export function buildPropertyWhatsAppMessage(property = {}) {
  const title = property.name || property.title || "Property";
  const configuration = formatPropertyConfiguration(property, { includeType: true });
  const publicId = getPublicPropertyId(property);

  return [
    "Hello UrbanEdge Living Space,",
    "",
    "I'm interested in:",
    `Property: ${title}`,
    property.location ? `Location: ${property.location}` : null,
    configuration ? `Configuration: ${configuration}` : null,
    publicId ? `Property ID: ${publicId}` : null,
    "",
    "Please share more details.",
  ]
    .filter(Boolean)
    .join("\n");
}
