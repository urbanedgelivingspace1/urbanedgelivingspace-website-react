import React from "react";
import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ORGANIZATION } from "../lib/seo";
import { buildWhatsAppHref } from "./shared/WhatsAppButton";
import { useLanguage } from "../i18n/LanguageContext";
import "./Footer.css";

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const telHref = `tel:${ORGANIZATION.telephone.replace(/[^+\d]/g, "")}`;
  const fullAddress = `${ORGANIZATION.streetAddress}, ${ORGANIZATION.addressLocality}, ${ORGANIZATION.addressRegion} ${ORGANIZATION.postalCode}`;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo-link" aria-label="UrbanEdge Living Space home">
            <img
              src="/UrbanEdge_Living_Space_Logo_HD.jpg"
              alt="UrbanEdge Living Space"
              className="footer-logo"
              loading="lazy"
            />
          </Link>
          <p>{t("footer.descriptor")}</p>
          <div className="footer-socials">
            <a
              href={ORGANIZATION.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="UrbanEdge Living Space on Instagram"
            >
              <Instagram size={19} aria-hidden="true" />
            </a>
            <a
              href={buildWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with UrbanEdge Living Space on WhatsApp"
              className="footer-social-whatsapp"
            >
              <FaWhatsapp aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h2>{t("footer.properties")}</h2>
          <ul className="footer-links">
            <li><Link to="/properties?listing=buy">{t("footer.buy")}</Link></li>
            <li><Link to="/properties?listing=rent">{t("footer.rent")}</Link></li>
            <li><Link to="/properties">{t("footer.allProperties")}</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>{t("footer.company")}</h2>
          <ul className="footer-links">
            <li><Link to="/about-us">{t("footer.about")}</Link></li>
            <li><Link to="/our-team">{t("footer.team")}</Link></li>
            <li><Link to="/blog">{t("footer.guides")}</Link></li>
            <li><Link to="/contact-us">{t("footer.contact")}</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>{t("footer.services")}</h2>
          <ul className="footer-links">
            <li><Link to="/guaranteed-rent">{t("footer.guaranteedRent")}</Link></li>
            <li><Link to="/about-us">{t("footer.propertyManagement")}</Link></li>
            <li><Link to="/about-us">{t("footer.rentalSolutions")}</Link></li>
            <li><Link to="/about-us">{t("footer.luxuryLeasing")}</Link></li>
          </ul>
        </div>

        <div className="footer-col footer-contact">
          <h2>{t("footer.contact")}</h2>
          <a href={telHref}><Phone size={16} aria-hidden="true" /> {ORGANIZATION.telephone}</a>
          <a href={`mailto:${ORGANIZATION.email}`}><Mail size={16} aria-hidden="true" /> {ORGANIZATION.email}</a>
          <a href={ORGANIZATION.mapsDirections} target="_blank" rel="noopener noreferrer">
            <MapPin size={16} aria-hidden="true" /> {fullAddress}
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {year} UrbanEdge Living Space. {t("footer.rights")}</p>
      </div>
    </footer>
  );
};

export default Footer;
