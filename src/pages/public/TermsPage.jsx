import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "../../components/shared/SEOHead";
import { ORGANIZATION } from "../../lib/seo";
import { useLanguage } from "../../i18n/LanguageContext";
import "./LegalPage.css";

export default function TermsPage() {
  const { t } = useLanguage();
  return (
    <div className="legal-page">
      <SEOHead title="Website Terms" description="Draft website terms for UrbanEdge Living Space." path="/terms" />
      <article className="legal-page__article">
        <h1>{t("legal.termsTitle")}</h1>
        <p className="legal-page__meta">{t("legal.updated")}</p>
        <p className="legal-page__draft">{t("legal.draft")}</p>

        <p>
          These draft terms describe the current public website and must be approved by the business and qualified legal counsel before they are treated as final terms.
        </p>

        <h2>Website purpose</h2>
        <p>
          The website helps visitors discover properties, read property guides, save listings and contact UrbanEdge Living Space. Website content is general information and does not itself create a property transaction, tenancy or service agreement.
        </p>

        <h2>Property information</h2>
        <p>
          Prices, availability, specifications, images, possession information, RERA details and project information may change. Visitors should confirm current information with UrbanEdge Living Space or the relevant developer before making a decision or payment.
        </p>

        <h2>Accounts</h2>
        <p>
          Account features are provided for personal use, including profiles and saved properties. Users are responsible for protecting their sign-in credentials and for providing accurate information when contacting the business.
        </p>

        <h2>Services and separate agreements</h2>
        <p>
          Property management, rental arrangements, Guaranteed Rent and other services depend on eligibility, scope and the separately agreed commercial terms. Website descriptions do not replace a signed agreement.
        </p>

        <h2>External links</h2>
        <p>
          The website may link to WhatsApp, Google Maps, Instagram, brochures or other third-party services. UrbanEdge Living Space does not control those external services or their availability.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these draft terms can be sent to <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a>.
        </p>

        <p>See the <Link to="/privacy">Privacy Policy</Link> for information about website data use.</p>
      </article>
    </div>
  );
}
