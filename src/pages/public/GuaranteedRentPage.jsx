// src/pages/public/GuaranteedRentPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Handshake, Wallet, CalendarClock, BadgeCheck, Home } from 'lucide-react';
import SEOHead from '../../components/shared/SEOHead';
import WhatsAppButton from '../../components/shared/WhatsAppButton';
import Button from '../../components/ui/Button';
import { organizationSchema, breadcrumbSchema } from '../../lib/seo';
import { useLanguage } from '../../i18n/LanguageContext';
import './GuaranteedRentPage.css';

/**
 * GuaranteedRentPage (Package 4.5, new)
 *
 * Per the redesign plan's "Guaranteed Rent page (new)" spec: "Hero →
 * What is Guaranteed Rent? → How it works (3 steps) → Benefits →
 * Eligibility → FAQs → WhatsApp CTA. No DB needed — static content or
 * a CMS field in site_settings." Built as static content (no
 * `site_settings` table/column exists yet, and adding one would be an
 * out-of-scope schema change per this package's file lock) — every
 * section below is component-local copy, no Supabase query.
 *
 * Route (`/guaranteed-rent`) and the Homepage CTA linking to it are
 * both outside this package's declared "Files to Modify" list
 * (`App.jsx`, `HomePage.jsx`) — see the Pre-Implementation Validation
 * Note in IMPLEMENTATION_STATE.md for why those two minimal, additive
 * touches were necessary and how they were scoped.
 */
const ICONS = [Home, Handshake, Wallet];
const BENEFIT_ICONS = [ShieldCheck, CalendarClock, BadgeCheck];

const CONTENT = {
  en: {
    steps: [
      ['1. Property Review', 'UrbanEdge reviews the property, location, condition, rental context and the service scope the owner needs.'],
      ['2. Proposal and Agreement', 'If the property is eligible, the proposed rent, duration, responsibilities, conditions and payment terms are documented for review. The service starts only after both sides sign.'],
      ['3. Rental Management', 'UrbanEdge coordinates tenant and property-management tasks within the signed scope. Any payment follows the schedule and conditions stated in that agreement.'],
    ],
    benefits: [
      ['Documented Commercial Terms', 'The agreed rent, schedule, duration and conditions are set out before the arrangement begins.'],
      ['One Coordination Point', 'Owners have one team for tenant communication and day-to-day coordination included in the service scope.'],
      ['Clear Responsibilities', 'The agreement records what UrbanEdge handles, what the owner handles and how exceptions are managed.'],
    ],
    eligibility: [
      'Residential property in an area currently served by UrbanEdge Living Space',
      'A property that is rentable or can be prepared for rental',
      'Ownership and property documents available for review',
      'Owner acceptance of the final written commercial and service terms',
    ],
    faqs: [
      ['How is the proposed rent decided?', 'The team reviews the property, comparable rentals, condition and current demand before presenting a proposal. The final amount applies only if it is accepted in the signed agreement.'],
      ['What happens if the property is vacant?', 'Vacancy treatment depends on the signed agreement. The website does not promise a payment during vacancy unless the final agreement expressly provides for it and its conditions are met.'],
      ['Who handles repairs and maintenance?', 'The final agreement defines routine coordination, owner responsibilities, approval limits and the treatment of major or structural work.'],
      ['How long is the agreement?', 'Duration is decided case by case and is confirmed only in the written agreement.'],
    ],
  },
  gu: {
    steps: [
      ['1. પ્રોપર્ટી રિવ્યૂ', 'UrbanEdge પ્રોપર્ટી, લોકેશન, હાલત, રેન્ટલ માર્કેટ અને માલિકને જરૂરી સર્વિસ સ્કોપની સમીક્ષા કરે છે.'],
      ['2. પ્રપોઝલ અને કરાર', 'પ્રોપર્ટી પાત્ર હોય તો ભાડું, સમયગાળો, જવાબદારીઓ, શરતો અને ચુકવણીની વિગતો રિવ્યૂ માટે લખિતમાં આપવામાં આવે છે. બંને પક્ષ સહી કર્યા પછી જ સેવા શરૂ થાય છે.'],
      ['3. રેન્ટલ મેનેજમેન્ટ', 'UrbanEdge સહી કરેલા સ્કોપ મુજબ ટેનન્ટ અને પ્રોપર્ટી મેનેજમેન્ટનું સંકલન કરે છે. ચુકવણી તે કરારમાં લખેલા સમયપત્રક અને શરતો મુજબ થાય છે.'],
    ],
    benefits: [
      ['લખિત કોમર્શિયલ શરતો', 'વ્યવસ્થા શરૂ થાય તે પહેલાં ભાડું, સમયપત્રક, સમયગાળો અને શરતો લખિતમાં નક્કી થાય છે.'],
      ['એક સંપર્ક ટીમ', 'સર્વિસ સ્કોપમાં આવતી ટેનન્ટ વાતચીત અને રોજિંદા સંકલન માટે એક ટીમ મળે છે.'],
      ['સ્પષ્ટ જવાબદારીઓ', 'કરારમાં UrbanEdge અને માલિકની જવાબદારીઓ તથા અપવાદોની પ્રક્રિયા લખાય છે.'],
    ],
    eligibility: ['UrbanEdge હાલમાં સેવા આપે તે વિસ્તારમાં રેસિડેન્શિયલ પ્રોપર્ટી', 'ભાડે આપી શકાય તેવી અથવા તૈયાર કરી શકાય તેવી પ્રોપર્ટી', 'માલિકી અને પ્રોપર્ટીના દસ્તાવેજ રિવ્યૂ માટે ઉપલબ્ધ', 'અંતિમ લખિત કોમર્શિયલ અને સર્વિસ શરતો માટે માલિકની સંમતિ'],
    faqs: [
      ['પ્રસ્તાવિત ભાડું કેવી રીતે નક્કી થાય છે?', 'ટીમ પ્રોપર્ટી, આસપાસના ભાડા, હાલત અને હાલની માંગ તપાસીને પ્રપોઝલ આપે છે. સહી કરેલા કરારમાં સ્વીકાર્યા પછી જ અંતિમ રકમ લાગુ થાય છે.'],
      ['પ્રોપર્ટી ખાલી રહે તો શું થાય?', 'ખાલી રહેવાની શરતો સહી કરેલા કરાર પર આધારિત છે. અંતિમ કરારમાં સ્પષ્ટ જોગવાઈ અને શરતો પૂરી ન થાય ત્યાં સુધી વેબસાઇટ ચુકવણીનું વચન આપતી નથી.'],
      ['રિપેર અને મેન્ટેનન્સ કોણ સંભાળે?', 'અંતિમ કરાર રૂટિન સંકલન, માલિકની જવાબદારી, મંજૂરી મર્યાદા અને મોટા કામની પ્રક્રિયા નક્કી કરે છે.'],
      ['કરાર કેટલા સમયનો હોય છે?', 'સમયગાળો કેસ પ્રમાણે નક્કી થાય છે અને માત્ર લખિત કરારમાં પુષ્ટિ થાય છે.'],
    ],
  },
  hi: {
    steps: [
      ['1. प्रॉपर्टी समीक्षा', 'UrbanEdge प्रॉपर्टी, लोकेशन, स्थिति, रेंटल संदर्भ और मालिक को जरूरी सेवा के दायरे की समीक्षा करता है।'],
      ['2. प्रस्ताव और एग्रीमेंट', 'प्रॉपर्टी योग्य होने पर किराया, अवधि, जिम्मेदारियाँ, शर्तें और भुगतान विवरण लिखित समीक्षा के लिए दिए जाते हैं। दोनों पक्षों के साइन करने के बाद ही सेवा शुरू होती है।'],
      ['3. रेंटल मैनेजमेंट', 'UrbanEdge साइन किए गए दायरे में टेनेंट और प्रॉपर्टी-मैनेजमेंट कार्यों का समन्वय करता है। भुगतान उसी एग्रीमेंट में लिखे समय और शर्तों के अनुसार होता है।'],
    ],
    benefits: [
      ['लिखित कमर्शियल शर्तें', 'व्यवस्था शुरू होने से पहले किराया, समय, अवधि और शर्तें लिखित में तय होती हैं।'],
      ['एक संपर्क टीम', 'सेवा के दायरे में टेनेंट बातचीत और रोजमर्रा के समन्वय के लिए एक टीम मिलती है।'],
      ['स्पष्ट जिम्मेदारियाँ', 'एग्रीमेंट बताता है कि UrbanEdge क्या संभालेगा, मालिक क्या संभालेगा और अपवाद कैसे निपटेंगे।'],
    ],
    eligibility: ['UrbanEdge के मौजूदा सेवा क्षेत्र में रेजिडेंशियल प्रॉपर्टी', 'किराए योग्य या किराए के लिए तैयार की जा सकने वाली प्रॉपर्टी', 'मालिकाना और प्रॉपर्टी दस्तावेज समीक्षा के लिए उपलब्ध', 'अंतिम लिखित कमर्शियल और सेवा शर्तों पर मालिक की सहमति'],
    faqs: [
      ['प्रस्तावित किराया कैसे तय होता है?', 'टीम प्रॉपर्टी, आसपास के किराए, स्थिति और मौजूदा मांग की समीक्षा करके प्रस्ताव देती है। साइन किए गए एग्रीमेंट में स्वीकार होने के बाद ही अंतिम राशि लागू होती है।'],
      ['प्रॉपर्टी खाली रहे तो क्या होता है?', 'खाली रहने की व्यवस्था साइन किए गए एग्रीमेंट पर निर्भर है। जब तक अंतिम एग्रीमेंट में स्पष्ट प्रावधान न हो और उसकी शर्तें पूरी न हों, वेबसाइट भुगतान का वादा नहीं करती।'],
      ['मरम्मत और मेंटेनेंस कौन संभालता है?', 'अंतिम एग्रीमेंट नियमित समन्वय, मालिक की जिम्मेदारी, मंजूरी सीमा और बड़े काम की प्रक्रिया तय करता है।'],
      ['एग्रीमेंट कितने समय का होता है?', 'अवधि हर प्रॉपर्टी के अनुसार तय होती है और केवल लिखित एग्रीमेंट में पुष्टि होती है।'],
    ],
  },
};

const GUARANTEED_RENT_WHATSAPP_MESSAGE =
  "Hi, I'd like to know more about the Guaranteed Rent program.";

const GuaranteedRentPage = () => {
  const { language, t } = useLanguage();
  const content = CONTENT[language] || CONTENT.en;
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Guaranteed Rent', path: '/guaranteed-rent' },
  ];

  return (
    <div className="guaranteed-rent-page">
      <SEOHead
        title="Guaranteed Rent Rental Management"
        description="Learn how eligible properties may qualify for an UrbanEdge rental-management arrangement, subject to evaluation and signed commercial terms."
        path="/guaranteed-rent"
        jsonLd={[organizationSchema(), breadcrumbSchema(breadcrumbItems)]}
      />

      {/* Hero */}
      <header className="gr-hero">
        <div className="gr-hero-overlay" aria-hidden="true"></div>
        <div className="gr-hero-content">
          <ShieldCheck size={40} className="gr-hero-icon" aria-hidden="true" />
          <h1>{t('guaranteed.title')}</h1>
          <p>{t('guaranteed.subtitle')}</p>
          <WhatsAppButton
            variant="inline"
            message={GUARANTEED_RENT_WHATSAPP_MESSAGE}
            label="WhatsApp Us"
          />
        </div>
      </header>

      <div className="gr-container">
        {/* What is Guaranteed Rent? */}
        <section className="gr-section" aria-labelledby="gr-what-heading">
          <h2 id="gr-what-heading">{t('guaranteed.what')}</h2>
          <p>{t('guaranteed.qualification')}</p>
        </section>

        {/* How it works */}
        <section className="gr-section" aria-labelledby="gr-how-heading">
          <h2 id="gr-how-heading">{t('guaranteed.how')}</h2>
          <div className="gr-steps">
            {content.steps.map(([title, description], index) => {
              const Icon = ICONS[index];
              return (
                <div className="gr-step-card" key={title}>
                  <Icon size={28} className="gr-step-icon" aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits */}
        <section className="gr-section" aria-labelledby="gr-benefits-heading">
          <h2 id="gr-benefits-heading">{t('guaranteed.benefits')}</h2>
          <div className="gr-benefits">
            {content.benefits.map(([title, description], index) => {
              const Icon = BENEFIT_ICONS[index];
              return (
                <div className="gr-benefit-card" key={title}>
                  <Icon size={24} className="gr-benefit-icon" aria-hidden="true" />
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Eligibility */}
        <section className="gr-section" aria-labelledby="gr-eligibility-heading">
          <h2 id="gr-eligibility-heading">{t('guaranteed.eligibility')}</h2>
          <ul className="gr-eligibility-list">
            {content.eligibility.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        <section className="gr-section" aria-labelledby="gr-faq-heading">
          <h2 id="gr-faq-heading">{t('guaranteed.faq')}</h2>
          <div className="gr-faq-list">
            {content.faqs.map(([question, answer]) => (
              <details className="gr-faq-item" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* WhatsApp CTA band */}
        <section className="gr-cta-band" aria-labelledby="gr-cta-heading">
          <h2 id="gr-cta-heading">{t('guaranteed.cta')}</h2>
          <p>{t('guaranteed.ctaText')}</p>
          <div className="gr-cta-actions">
            <WhatsAppButton
              variant="inline"
              message={GUARANTEED_RENT_WHATSAPP_MESSAGE}
              label="WhatsApp Us"
            />
            <Button as={Link} to="/contact-us" variant="outline">
              Contact Us Instead
            </Button>
          </div>
        </section>
        <p className="gr-disclaimer">{t('guaranteed.disclaimer')}</p>
      </div>
    </div>
  );
};

export default GuaranteedRentPage;
