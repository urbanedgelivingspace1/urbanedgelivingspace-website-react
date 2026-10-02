import React from "react";
import { Link } from "react-router-dom";
import { MapPinned, SearchCheck, CalendarCheck2, MessagesSquare } from "lucide-react";
import SEOHead from "../components/shared/SEOHead";
import { organizationSchema, breadcrumbSchema } from "../lib/seo";
import Button from "../components/ui/Button";
import TestimonialCarousel from "../components/shared/TestimonialCarousel";
import { useLanguage } from "../i18n/LanguageContext";
import offerImageOne from "../assets/service-management-720.webp";
import offerImageTwo from "../assets/service-rental-720.webp";
import offerImageThree from "../assets/service-luxury-720.webp";
import "./AboutUs.css";

const CONTENT = {
  en: {
    hero: "About UrbanEdge Living Space", subtitle: "Local residential property guidance for Gandhinagar and Ahmedabad.", explore: "Explore Properties",
    storyTitle: "How we help", lead: "UrbanEdge Living Space helps buyers, tenants and property owners make practical residential property decisions.",
    paragraphs: ["Our team supports property shortlisting, questions, site-visit coordination and direct follow-up across the Gandhinagar-Ahmedabad market.", "We focus on clear information and a useful next step. Property names, prices, availability, project details and RERA information are shown only when they are available from the current listing data."],
    processTitle: "A simple property journey", process: [["Share your requirement", "Tell us whether you want to buy, rent, sell or manage a residential property."], ["Review suitable options", "Explore current inventory and shortlist properties that match your location, configuration and budget."], ["Plan the next step", "Coordinate questions, site visits and direct conversations with the UrbanEdge team."]],
    offerTitle: "Property services", offers: [["Property Management", "Practical coordination for owners within an agreed service scope."], ["Rental Solutions", "Rental discovery and coordination support for owners and tenants."], ["Luxury Leasing", "Leasing assistance for premium residential inventory when available."]],
    testimonials: "Client Testimonials", team: "Meet Our Team", cta: "Ready to discuss your requirement?", ctaText: "Contact the local team and share the property, area or service you need.", contact: "Contact UrbanEdge",
  },
  gu: {
    hero: "UrbanEdge Living Space વિશે", subtitle: "ગાંધીનગર અને અમદાવાદ માટે સ્થાનિક રેસિડેન્શિયલ પ્રોપર્ટી માર્ગદર્શન.", explore: "પ્રોપર્ટીઝ જુઓ",
    storyTitle: "અમે કેવી રીતે મદદ કરીએ છીએ", lead: "UrbanEdge Living Space ખરીદદારો, ભાડુઆતો અને પ્રોપર્ટી માલિકોને સરળ અને ઉપયોગી નિર્ણય લેવામાં મદદ કરે છે.",
    paragraphs: ["અમારી ટીમ ગાંધીનગર-અમદાવાદ માર્કેટમાં પ્રોપર્ટી શોર્ટલિસ્ટ, પ્રશ્નો, સાઇટ વિઝિટ અને સીધા ફોલોઅપમાં મદદ કરે છે.", "અમે સ્પષ્ટ માહિતી અને યોગ્ય આગળનું પગલું આપીએ છીએ. પ્રોપર્ટી નામ, કિંમત, ઉપલબ્ધતા, પ્રોજેક્ટ અને RERA માહિતી હાલના લિસ્ટિંગ ડેટામાં હોય ત્યારે જ બતાવવામાં આવે છે."],
    processTitle: "સરળ પ્રોપર્ટી પ્રક્રિયા", process: [["જરૂરિયાત જણાવો", "ખરીદ, ભાડું, વેચાણ અથવા મેનેજમેન્ટ માટે તમારી જરૂરિયાત જણાવો."], ["યોગ્ય વિકલ્પ જુઓ", "લોકેશન, કન્ફિગરેશન અને બજેટ પ્રમાણે હાલની પ્રોપર્ટી શોર્ટલિસ્ટ કરો."], ["આગળનું પગલું ગોઠવો", "UrbanEdge ટીમ સાથે પ્રશ્નો, સાઇટ વિઝિટ અને સીધી વાતચીત ગોઠવો."]],
    offerTitle: "પ્રોપર્ટી સેવાઓ", offers: [["પ્રોપર્ટી મેનેજમેન્ટ", "સહમત સર્વિસ સ્કોપમાં માલિકો માટે ઉપયોગી સંકલન."], ["રેન્ટલ સોલ્યુશન્સ", "માલિકો અને ભાડુઆતો માટે રેન્ટલ શોધ અને સંકલન સહાય."], ["લક્ઝરી લીઝિંગ", "ઉપલબ્ધ પ્રીમિયમ રેસિડેન્શિયલ પ્રોપર્ટી માટે લીઝિંગ સહાય."]],
    testimonials: "ક્લાયન્ટ અભિપ્રાય", team: "અમારી ટીમને મળો", cta: "તમારી જરૂરિયાત વિશે વાત કરવી છે?", ctaText: "સ્થાનિક ટીમનો સંપર્ક કરો અને પ્રોપર્ટી, વિસ્તાર અથવા સર્વિસ જણાવો.", contact: "UrbanEdgeનો સંપર્ક કરો",
  },
  hi: {
    hero: "UrbanEdge Living Space के बारे में", subtitle: "गांधीनगर और अहमदाबाद के लिए स्थानीय रेजिडेंशियल प्रॉपर्टी मार्गदर्शन।", explore: "प्रॉपर्टीज़ देखें",
    storyTitle: "हम कैसे मदद करते हैं", lead: "UrbanEdge Living Space खरीदारों, किराएदारों और प्रॉपर्टी मालिकों को व्यावहारिक रेजिडेंशियल प्रॉपर्टी निर्णय लेने में मदद करता है।",
    paragraphs: ["हमारी टीम गांधीनगर-अहमदाबाद मार्केट में प्रॉपर्टी शॉर्टलिस्ट, सवाल, साइट विजिट और सीधे फॉलो-अप में मदद करती है।", "हम साफ जानकारी और उपयोगी अगला कदम देते हैं। प्रॉपर्टी नाम, कीमत, उपलब्धता, प्रोजेक्ट और RERA जानकारी तभी दिखाई जाती है जब वह मौजूदा लिस्टिंग डेटा में उपलब्ध हो।"],
    processTitle: "सरल प्रॉपर्टी प्रक्रिया", process: [["अपनी जरूरत बताएं", "खरीद, किराया, बिक्री या मैनेजमेंट के लिए अपनी जरूरत बताएं।"], ["सही विकल्प देखें", "लोकेशन, कॉन्फिगरेशन और बजट के अनुसार मौजूदा प्रॉपर्टी शॉर्टलिस्ट करें।"], ["अगला कदम तय करें", "UrbanEdge टीम के साथ सवाल, साइट विजिट और सीधी बातचीत तय करें।"]],
    offerTitle: "प्रॉपर्टी सेवाएँ", offers: [["प्रॉपर्टी मैनेजमेंट", "सहमत सेवा दायरे में मालिकों के लिए व्यावहारिक समन्वय।"], ["रेंटल सॉल्यूशंस", "मालिकों और किराएदारों के लिए रेंटल खोज और समन्वय सहायता।"], ["लक्ज़री लीज़िंग", "उपलब्ध प्रीमियम रेजिडेंशियल प्रॉपर्टी के लिए लीज़िंग सहायता।"]],
    testimonials: "क्लाइंट अनुभव", team: "हमारी टीम से मिलें", cta: "अपनी जरूरत पर बात करना चाहते हैं?", ctaText: "स्थानीय टीम से संपर्क करें और प्रॉपर्टी, क्षेत्र या सेवा बताएं।", contact: "UrbanEdge से संपर्क करें",
  },
};

const PROCESS_ICONS = [MessagesSquare, SearchCheck, CalendarCheck2];
const OFFER_IMAGES = [offerImageOne, offerImageTwo, offerImageThree];

export default function AboutUsModern() {
  const { language } = useLanguage();
  const content = CONTENT[language] || CONTENT.en;
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "About UrbanEdge", path: "/about-us" }];

  return (
    <div className="aboutus-page">
      <SEOHead title="About UrbanEdge Living Space" description="Learn how UrbanEdge Living Space supports residential buyers, tenants and property owners across Gandhinagar and Ahmedabad." path="/about-us" jsonLd={[organizationSchema(), breadcrumbSchema(breadcrumbItems)]} />
      <header className="aboutus-hero"><div className="aboutus-hero-overlay" aria-hidden="true" /><div className="aboutus-hero-content fade-in"><h1>{content.hero}</h1><p className="aboutus-hero-subtitle">{content.subtitle}</p><Button as={Link} to="/properties">{content.explore}</Button></div></header>
      <div>
        <section className="aboutus-story-section aboutus-container" aria-labelledby="our-story-heading">
          <div className="aboutus-story-header"><h2 id="our-story-heading" className="section-title">{content.storyTitle}</h2><p className="aboutus-story-lead">{content.lead}</p></div>
          <div className="aboutus-story-body"><div className="aboutus-story-image"><img src="/urbanedge-logo-640.webp" alt="UrbanEdge Living Space" loading="lazy" width="640" height="640" /></div><div className="aboutus-story-content">{content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<Button as={Link} to="/our-team" variant="outline"><MapPinned size={17} aria-hidden="true" /> {content.team}</Button></div></div>
        </section>
        <section className="aboutus-values-section aboutus-container" aria-labelledby="about-process-heading"><h2 id="about-process-heading" className="section-title">{content.processTitle}</h2><div className="aboutus-values-grid">{content.process.map(([title, text], index) => { const Icon = PROCESS_ICONS[index]; return <article className="aboutus-value-card" key={title}><div className="aboutus-value-icon"><Icon /></div><h3>{title}</h3><p>{text}</p></article>; })}</div></section>
        <section className="aboutus-offer-section aboutus-container" aria-labelledby="what-we-offer-heading"><h2 id="what-we-offer-heading" className="section-title">{content.offerTitle}</h2><div className="aboutus-offer-cards">{content.offers.map(([title, text], index) => <article className="aboutus-offer-card" key={title}><img src={OFFER_IMAGES[index]} alt="" loading="lazy" decoding="async" width="720" height="480" /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
        <section className="aboutus-testimonials" aria-labelledby="testimonials-heading"><div className="aboutus-container"><h2 id="testimonials-heading" className="section-title">{content.testimonials}</h2><TestimonialCarousel className="aboutus-testimonial-carousel" /></div></section>
        <section className="aboutus-contact-cta aboutus-container" aria-labelledby="contact-cta-heading"><h2 id="contact-cta-heading">{content.cta}</h2><p>{content.ctaText}</p><Button as={Link} to="/contact-us">{content.contact}</Button></section>
      </div>
    </div>
  );
}
