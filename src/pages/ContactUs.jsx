import React from 'react';
import { MapPin, Phone, Mail, Navigation } from 'lucide-react';
import ContactForm from '../components/forms/ContactForm';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import SEOHead from '../components/shared/SEOHead';
import Button from '../components/ui/Button';
import { organizationSchema, breadcrumbSchema, ORGANIZATION } from '../lib/seo';
import { useLanguage } from '../i18n/LanguageContext';
import './ContactUs.css';
import './ContactUs.modern.css';

const ContactUs = () => {
  const { t } = useLanguage();
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  const telHref = `tel:${ORGANIZATION.telephone.replace(/[^+\d]/g, '')}`;
  const fullAddress = `${ORGANIZATION.streetAddress}, ${ORGANIZATION.addressLocality}, ${ORGANIZATION.addressRegion} ${ORGANIZATION.postalCode}`;

  return (
    <div className="contact-us-page">
      <SEOHead
        title="Contact UrbanEdge Living Space"
        description="Contact UrbanEdge Living Space for residential property buying, renting, selling, site visits and property services in Gandhinagar and Ahmedabad."
        path="/contact-us"
        jsonLd={[organizationSchema(), breadcrumbSchema(breadcrumbItems)]}
      />

      <section className="contact-hero">
        <div className="hero-overlay" />
        <div className="hero-content container fade-in">
          <p className="contact-hero__eyebrow">UrbanEdge Living Space</p>
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.subtitle')}</p>
          <div className="contact-hero__actions">
            <Button as="a" href={telHref} variant="secondary">
              <Phone size={17} aria-hidden="true" /> {t('contact.phone')}
            </Button>
            <WhatsAppButton variant="inline" label={t('contact.whatsapp')} />
          </div>
        </div>
      </section>

      <section className="contact-form-section container">
        <div className="contact-page-grid">
          <div className="contact-form-card">
            <h2>Tell us what you need</h2>
            <p>Share your property requirement and our team can respond with the next practical step.</p>
            <ContactForm />
          </div>

          <aside className="contact-details" aria-labelledby="contact-info-heading">
            <p className="contact-section-kicker">Direct contact</p>
            <h2 id="contact-info-heading">{t('contact.information')}</h2>

            <div className="contact-detail-list">
              <a href={telHref} className="contact-detail-item">
                <span className="contact-detail-icon"><Phone size={18} aria-hidden="true" /></span>
                <span><strong>{t('contact.phone')}</strong>{ORGANIZATION.telephone}</span>
              </a>
              <a href={`mailto:${ORGANIZATION.email}`} className="contact-detail-item">
                <span className="contact-detail-icon"><Mail size={18} aria-hidden="true" /></span>
                <span><strong>{t('contact.email')}</strong>{ORGANIZATION.email}</span>
              </a>
              <a href={ORGANIZATION.mapsDirections} target="_blank" rel="noopener noreferrer" className="contact-detail-item">
                <span className="contact-detail-icon"><MapPin size={18} aria-hidden="true" /></span>
                <span><strong>{t('contact.office')}</strong>{fullAddress}</span>
              </a>
            </div>

            <div className="contact-details__actions">
              <WhatsAppButton
                variant="inline"
                message="Hi, I'd like to discuss a property requirement with UrbanEdge Living Space."
                label={t('contact.whatsapp')}
              />
              <Button
                as="a"
                href={ORGANIZATION.mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                <Navigation size={17} aria-hidden="true" /> {t('contact.directions')}
              </Button>
            </div>
          </aside>
        </div>

        <div className="contact-map-section">
          <div className="contact-map-heading">
            <div>
              <p className="contact-section-kicker">Visit our office</p>
              <h2>{t('contact.office')}</h2>
            </div>
            <Button
              as="a"
              href={ORGANIZATION.mapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              <Navigation size={17} aria-hidden="true" /> {t('contact.directions')}
            </Button>
          </div>
          <div className="map-container">
            <iframe
              title={t('contact.mapTitle')}
              src={ORGANIZATION.mapsEmbed}
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
