import React from "react";
import { Phone, CalendarDays } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useProperty } from "../../hooks/useProperty";
import { ORGANIZATION } from "../../lib/seo";
import { buildWhatsAppHref } from "../shared/WhatsAppButton";
import "./PropertyMobileConversionBar.css";

function formatPrice(property) {
  if (!property) return null;
  const price = typeof property.price === "number" ? property.price : Number(property.price);
  if (!Number.isFinite(price) || price <= 0 || property.price_type === "on_request") {
    return "Price on Request";
  }
  const value = `₹${price.toLocaleString("en-IN")}`;
  return property.price_type === "starting_from" ? `From ${value}` : value;
}

function buildPropertyMessage(property) {
  const bhk = property.bhk ||
    (property.bhk_min != null
      ? property.bhk_min === property.bhk_max
        ? `${property.bhk_min} BHK`
        : `${property.bhk_min}-${property.bhk_max} BHK`
      : null);

  return [
    "Hello UrbanEdge Living Space,",
    "",
    "I'm interested in:",
    `Property: ${property.name || property.title || "Property"}`,
    property.location ? `Location: ${property.location}` : null,
    bhk ? `Configuration: ${bhk}` : null,
    property.id ? `Property ID: ${property.id}` : null,
    "",
    "Please share more details.",
  ]
    .filter(Boolean)
    .join("\n");
}

export default function PropertyMobileConversionBar() {
  const location = useLocation();
  const match = location.pathname.match(/^\/properties\/([^/]+)$/);
  const identifier = match?.[1];
  const { data: property } = useProperty(identifier, { enabled: Boolean(identifier) });

  if (!identifier || !property) return null;

  const telHref = `tel:${ORGANIZATION.telephone.replace(/[^+\d]/g, "")}`;
  const whatsappHref = buildWhatsAppHref(buildPropertyMessage(property));
  const price = formatPrice(property);

  return (
    <aside className="property-mobile-bar" aria-label="Property contact actions">
      {price && <span className="property-mobile-bar__price">{price}</span>}
      <div className="property-mobile-bar__actions">
        <a href={telHref} className="property-mobile-bar__action">
          <Phone size={18} aria-hidden="true" />
          <span>Call</span>
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="property-mobile-bar__action property-mobile-bar__action--whatsapp"
        >
          <FaWhatsapp aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
        <a href="#pdp-inquiry" className="property-mobile-bar__action property-mobile-bar__action--visit">
          <CalendarDays size={18} aria-hidden="true" />
          <span>Enquire</span>
        </a>
      </div>
    </aside>
  );
}
