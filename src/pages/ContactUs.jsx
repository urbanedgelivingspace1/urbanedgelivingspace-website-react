// src/pages/ContactUs.jsx
import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import ContactForm from '../components/forms/ContactForm';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import SEOHead from '../components/shared/SEOHead';
import { organizationSchema, breadcrumbSchema, ORGANIZATION } from '../lib/seo';
import './ContactUs.css';

/**
 * ContactUs (Package 4.5)
 *
 * Rebuilt as the site's single canonical source of contact details.
 * Previously, this page and `AboutUs.jsx` each hardcoded their own
 * phone number and office address, and the two had drifted out of
 * sync (Blueprint Section 10, item 30 / `lib/seo.js`'s own header
 * comment flagged this exact discrepancy as "Phase 4 scope"). This
 * package resolves it: every contact detail below is read from
 * `ORGANIZATION` in `lib/seo.js`, which already matched this page's
 * numbers (not AboutUs's) — the same address/phone already wired
 * site-wide via `WhatsAppButton`'s `WHATSAPP_NUMBER` and the JSON-LD
 * `organizationSchema()`. AboutUs.jsx now links here instead of
 * duplicating the form or the details.
 *
 * The form itself is delegated to the new shared `ContactForm`
 * component (`components/forms/ContactForm.jsx`) instead of
 * hand-rolled markup, and the two previously-separate phone numbers/
 * click targets are now real `tel:`/`mailto:` links (redesign plan's
 * "no click-to-call" gap).
 */
const ContactUs = () => {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  const telHref = `tel:+${ORGANIZATION.telephone.replace(/[^\d]/g, '')}`;
  const fullAddress = `${ORGANIZATION.streetAddress}, ${ORGANIZATION.addressLocality}, ${ORGANIZATION.addressRegion} ${ORGANIZATION.postalCode}`;

  return (
    <div className="contact-us-page">
      <SEOHead
        title="Contact Us"
        description="Get in touch with UrbanEdge Living Space for property viewings, listings, and partnership inquiries in Gandhinagar."
        path="/contact-us"
        jsonLd={[organizationSchema(), breadcrumbSchema(breadcrumbItems)]}
      />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container fade-in">
          <h1>Contact UrbanEdge Living</h1>
          <p>
            Ready to find your dream property? Our expert team is here to guide
            you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="contact-form-section container">
        <div className="form-container">
          <ContactForm />

          {/* Contact Details */}
          <div className="contact-details" aria-labelledby="contact-info-heading">
            <h3 id="contact-info-heading">Contact Information</h3>
            <p>
              <strong>Phone:</strong>{' '}
              <a href={telHref} className="contact-details__link">
                {ORGANIZATION.telephone}
              </a>
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${ORGANIZATION.email}`} className="contact-details__link">
                {ORGANIZATION.email}
              </a>
            </p>

            <h4>
              <MapPin size={16} aria-hidden="true" /> Office Address
            </h4>
            <p>{fullAddress}</p>

            <h4>
              <Clock size={16} aria-hidden="true" /> Business Hours
            </h4>
            <p>
              Mon - Fri: 9:00 AM - 6:00 PM
              <br />
              Sat: 10:00 AM - 4:00 PM
              <br />
              Sun: Closed
            </p>

            <WhatsAppButton
              variant="inline"
              message="Hi, I'd like to get in touch about UrbanEdge Living Space properties."
              label="Chat on WhatsApp"
              className="contact-details__whatsapp"
            />

            {/* Google Maps Embed */}
            <div className="map-container">
              <iframe
                title="UrbanEdge Living Office"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14670.579401370644!2d72.6478357!3d23.1831588!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2bf0469b056b%3A0x9be13844a7842440!2sSANSKRUTI!5e0!3m2!1sen!2sin!4v1752990682824!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                aria-hidden="false"
                tabIndex="0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
