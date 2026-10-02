import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  KeyRound,
  Sparkles,
  Handshake,
  CalendarCheck2,
  ShieldCheck,
} from "lucide-react";
import SEOHead from "../../components/shared/SEOHead";
import Button from "../../components/ui/Button";
import WhatsAppButton from "../../components/shared/WhatsAppButton";
import { breadcrumbSchema, organizationSchema } from "../../lib/seo";
import { useLanguage } from "../../i18n/LanguageContext";
import "./ServicesPage.css";

const SERVICES = [
  {
    id: "property-management",
    titleKey: "services.management",
    icon: Building2,
  },
  {
    id: "rental-solutions",
    titleKey: "services.rentals",
    icon: KeyRound,
  },
  {
    id: "luxury-leasing",
    titleKey: "services.leasing",
    icon: Sparkles,
  },
  {
    id: "guaranteed-rent",
    titleKey: "services.guaranteed",
    icon: ShieldCheck,
    link: "/guaranteed-rent",
  },
  {
    id: "buy-sell-rent",
    titleKey: "services.assistance",
    icon: Handshake,
  },
  {
    id: "site-visits",
    titleKey: "services.visits",
    icon: CalendarCheck2,
  },
];

const SERVICE_COPY = {
  en: {
    cards: [
      "Coordination support for day-to-day residential property requirements, based on the service scope agreed with the owner.",
      "Support with rental discovery, owner-tenant coordination and practical next steps for available homes.",
      "Leasing assistance for premium residential properties where matching inventory and owner requirements are available.",
      "A rental-management offering for eligible properties, subject to evaluation and a signed agreement containing the final terms.",
      "Local shortlisting and coordination for residential buying, selling and renting across Gandhinagar and Ahmedabad.",
      "Help moving from online discovery to an organised visit for a property that is currently available for viewing.",
    ],
    details: "View service details", cta: "Tell us what you need", ctaText: "Share your location, property type and whether you want to buy, rent, sell or manage a property.",
  },
  gu: {
    cards: [
      "માલિક સાથે સહમત સર્વિસ સ્કોપ પ્રમાણે દૈનિક રેસિડેન્શિયલ પ્રોપર્ટી જરૂરિયાતો માટે સંકલન સહાય.",
      "ઉપલબ્ધ ઘરો માટે રેન્ટલ શોધ, માલિક-ભાડુઆત સંકલન અને ઉપયોગી આગળના પગલાં માટે સહાય.",
      "મેચ થતી ઇન્વેન્ટરી અને માલિકની જરૂરિયાત હોય ત્યારે પ્રીમિયમ રેસિડેન્શિયલ પ્રોપર્ટી માટે લીઝિંગ સહાય.",
      "પાત્ર પ્રોપર્ટી માટે મૂલ્યાંકન અને અંતિમ શરતો ધરાવતા સહી કરેલા કરારને આધિન રેન્ટલ મેનેજમેન્ટ ઓફર.",
      "ગાંધીનગર અને અમદાવાદમાં ઘર ખરીદવા, વેચવા અને ભાડે લેવા માટે સ્થાનિક શોર્ટલિસ્ટ અને સંકલન.",
      "હાલમાં વિઝિટ માટે ઉપલબ્ધ પ્રોપર્ટીની ઓનલાઇન શોધથી ગોઠવેલી સાઇટ વિઝિટ સુધીની સહાય.",
    ],
    details: "સર્વિસની વિગતો જુઓ", cta: "તમારી જરૂરિયાત જણાવો", ctaText: "લોકેશન, પ્રોપર્ટી પ્રકાર અને તમે ખરીદવા, ભાડે લેવા, વેચવા કે મેનેજ કરવા માંગો છો તે જણાવો.",
  },
  hi: {
    cards: [
      "मालिक के साथ सहमत सेवा दायरे के अनुसार रोजमर्रा की रेजिडेंशियल प्रॉपर्टी जरूरतों के लिए समन्वय सहायता।",
      "उपलब्ध घरों के लिए रेंटल खोज, मालिक-किराएदार समन्वय और व्यावहारिक अगले कदम में सहायता।",
      "मेल खाती इन्वेंटरी और मालिक की जरूरत उपलब्ध होने पर प्रीमियम रेजिडेंशियल प्रॉपर्टी के लिए लीजिंग सहायता।",
      "पात्र प्रॉपर्टी के लिए मूल्यांकन और अंतिम शर्तों वाले हस्ताक्षरित समझौते के अधीन रेंटल मैनेजमेंट पेशकश।",
      "गांधीनगर और अहमदाबाद में घर खरीदने, बेचने और किराए पर लेने के लिए स्थानीय शॉर्टलिस्ट और समन्वय।",
      "अभी विजिट के लिए उपलब्ध प्रॉपर्टी की ऑनलाइन खोज से व्यवस्थित साइट विजिट तक सहायता।",
    ],
    details: "सेवा की जानकारी देखें", cta: "अपनी जरूरत बताएं", ctaText: "लोकेशन, प्रॉपर्टी प्रकार और आप खरीदना, किराए पर लेना, बेचना या मैनेज करना चाहते हैं—यह साझा करें।",
  },
};

export default function ServicesPage() {
  const { t, language } = useLanguage();
  const copy = SERVICE_COPY[language] || SERVICE_COPY.en;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ];

  return (
    <div className="services-page">
      <SEOHead
        title="Property Services"
        description="Residential property guidance, rental solutions, property management and site-visit assistance in Gandhinagar and Ahmedabad."
        path="/services"
        jsonLd={[organizationSchema(), breadcrumbSchema(breadcrumbs)]}
      />
      <header className="services-hero">
        <p>UrbanEdge Living Space</p>
        <h1>{t("services.title")}</h1>
        <span>{t("services.subtitle")}</span>
      </header>

      <div className="services-grid container">
        {SERVICES.map(({ id, titleKey, icon: Icon, link }, index) => (
          <article className="services-card" id={id} key={id}>
            <Icon aria-hidden="true" />
            <h2>{t(titleKey)}</h2>
            <p>{copy.cards[index]}</p>
            {link && <Link to={link}>{copy.details}</Link>}
          </article>
        ))}
      </div>

      <section className="services-cta container">
        <h2>{copy.cta}</h2>
        <p>{copy.ctaText}</p>
        <div>
          <Button as={Link} to="/contact-us">{t("common.contact")}</Button>
          <WhatsAppButton variant="inline" label={t("common.whatsapp")} />
        </div>
      </section>
    </div>
  );
}
