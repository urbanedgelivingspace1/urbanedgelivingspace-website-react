import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "../../components/shared/SEOHead";
import { ORGANIZATION } from "../../lib/seo";
import { useLanguage } from "../../i18n/LanguageContext";
import "./LegalPage.css";

export default function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <div className="legal-page">
      <SEOHead title="Privacy Policy" description="Draft privacy information for the UrbanEdge Living Space website." path="/privacy" />
      <article className="legal-page__article">
        <h1>{t("legal.privacyTitle")}</h1>
        <p className="legal-page__meta">{t("legal.updated")}</p>
        <p className="legal-page__draft">{t("legal.draft")}</p>

        <p>
          This draft explains the information the UrbanEdge Living Space website currently collects and the customer features that use it. It must be reviewed against the business's approved operating, retention and legal practices before publication as final policy.
        </p>

        <h2>Information collected</h2>
        <ul>
          <li>Name, phone number, email address and messages submitted through enquiry and contact forms.</li>
          <li>Property interest, requested site-visit details and the property connected to an enquiry.</li>
          <li>Account information used for sign-in, profile details and saved properties.</li>
          <li>Basic website usage and performance information collected by the site's analytics and hosting tools.</li>
        </ul>

        <h2>How the website uses information</h2>
        <ul>
          <li>To respond to enquiries and coordinate property information or site visits.</li>
          <li>To provide account, profile and saved-property features.</li>
          <li>To operate, secure and understand the performance of the website.</li>
        </ul>

        <h2>Service providers and external services</h2>
        <p>
          The website uses Supabase for application data and authentication and Vercel tools for hosting analytics and performance insights. Links to WhatsApp, Google Maps, Instagram and other external services are governed by those services' own privacy practices.
        </p>

        <h2>Retention, access and deletion</h2>
        <p>
          Final retention periods, request-verification steps and deletion procedures require business and legal approval. Until that process is approved, contact UrbanEdge Living Space to ask for a review of personal information connected to your enquiry or account.
        </p>

        <h2>Contact</h2>
        <p>
          Email <a href={`mailto:${ORGANIZATION.email}`}>{ORGANIZATION.email}</a> or call <a href={`tel:${ORGANIZATION.telephone.replace(/[^+\d]/g, "")}`}>{ORGANIZATION.telephone}</a> with privacy questions.
        </p>

        <p>Also read the <Link to="/terms">Website Terms</Link>.</p>
      </article>
    </div>
  );
}
