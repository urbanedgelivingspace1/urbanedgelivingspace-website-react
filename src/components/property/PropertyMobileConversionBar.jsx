import React from "react";
import { Phone, CalendarDays } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useProperty } from "../../hooks/useProperty";
import { ORGANIZATION } from "../../lib/seo";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  buildPropertyWhatsAppMessage,
  formatPropertyPrice,
} from "../../lib/propertyPresentation";
import { buildWhatsAppHref } from "../shared/WhatsAppButton";
import "./PropertyMobileConversionBar.css";

export default function PropertyMobileConversionBar() {
  const { t } = useLanguage();
  const location = useLocation();
  const match = location.pathname.match(/^\/properties\/([^/]+)$/);
  const identifier = match?.[1];
  const { data: property } = useProperty(identifier, { enabled: Boolean(identifier) });

  if (!identifier || !property) return null;

  const telHref = `tel:${ORGANIZATION.telephone.replace(/[^+\d]/g, "")}`;
  const whatsappHref = buildWhatsAppHref(buildPropertyWhatsAppMessage(property));
  const price = formatPropertyPrice(property, {
    shortPrefix: true,
    labels: {
      onRequest: t("price.onRequest"),
      startingFrom: t("price.startingFrom"),
      from: t("price.from"),
    },
  });

  return (
    <aside className="property-mobile-bar" aria-label="Property contact actions">
      {price && <span className="property-mobile-bar__price">{price}</span>}
      <div className="property-mobile-bar__actions">
        <a href={telHref} className="property-mobile-bar__action">
          <Phone size={18} aria-hidden="true" />
          <span>{t("common.call")}</span>
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="property-mobile-bar__action property-mobile-bar__action--whatsapp"
        >
          <FaWhatsapp aria-hidden="true" />
          <span>{t("common.whatsapp")}</span>
        </a>
        <button
          type="button"
          className="property-mobile-bar__action property-mobile-bar__action--visit"
          onClick={() => window.dispatchEvent(new CustomEvent("urbanedge:open-site-visit"))}
        >
          <CalendarDays size={18} aria-hidden="true" />
          <span>{t("common.scheduleVisit")}</span>
        </button>
      </div>
    </aside>
  );
}
