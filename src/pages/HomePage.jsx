import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Phone,
  ArrowRight,
  Building2,
  MapPin,
  Home,
  KeyRound,
  Handshake,
  MapPinned,
  MessagesSquare,
  CalendarCheck2,
} from "lucide-react";

import { useProperties } from "../hooks/useProperties";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { getExcerpt } from "../components/blog/blogText";
import {
  LISTING_TYPE_OPTIONS,
  propertyFiltersToParams,
} from "../components/property/PropertyFilters";
import PropertyCard from "../components/PropertyCard";
import TestimonialCarousel from "../components/shared/TestimonialCarousel";
import WhatsAppButton from "../components/shared/WhatsAppButton";
import SEOHead from "../components/shared/SEOHead";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import { ORGANIZATION, organizationSchema } from "../lib/seo";
import { useLanguage } from "../i18n/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import "./HomePage.css";
import "./HomePage.modern.css";
import propertyImage from "../assets/property-hero-960.webp";
import propertyImageLarge from "../assets/property-hero-1600.webp";
import whyChooseUsSmall from "../assets/why-urbanedge-720.webp";
import whyChooseUsLarge from "../assets/why-urbanedge-1200.webp";

const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const current = ref.current;
    if (!current || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold },
    );

    observer.observe(current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

const AnimateOnScroll = ({ children, className = "", direction = "none" }) => {
  const { ref, isVisible } = useInView();
  const directionClass = direction !== "none" ? `slide-${direction}` : "";
  return (
    <div
      ref={ref}
      className={`scroll-animate ${directionClass} ${className} ${isVisible ? "in-view" : ""}`}
    >
      {children}
    </div>
  );
};

const HERO_LISTING_TABS = LISTING_TYPE_OPTIONS.filter((opt) => ["buy", "rent"].includes(opt.value));
const HERO_BUDGET_OPTIONS = [
  { label: { en: "Under ₹50 Lakh", gu: "₹50 લાખથી ઓછું", hi: "₹50 लाख से कम" }, maxPrice: 5_000_000 },
  { label: { en: "₹50 Lakh – ₹1 Cr", gu: "₹50 લાખ – ₹1 કરોડ", hi: "₹50 लाख – ₹1 करोड़" }, minPrice: 5_000_000, maxPrice: 10_000_000 },
  { label: { en: "₹1 Cr – ₹2 Cr", gu: "₹1 કરોડ – ₹2 કરોડ", hi: "₹1 करोड़ – ₹2 करोड़" }, minPrice: 10_000_000, maxPrice: 20_000_000 },
  { label: { en: "₹2 Cr+", gu: "₹2 કરોડથી વધુ", hi: "₹2 करोड़ से अधिक" }, minPrice: 20_000_000 },
];

const HOME_COPY = {
  en: {
    featuredKicker: "Residential opportunities", blogKicker: "Useful reading", welcomeKicker: "Local residential specialists", whyKicker: "Practical support",
    rentTitle: "Rental & Property Management Support", rentText: "Own a property? Explore UrbanEdge rental-management services, eligibility and the current Guaranteed Rent offering.", learnMore: "Explore Rental Management",
    why: [
      ["Local market knowledge", "Focused guidance for Gandhinagar, Ahmedabad and the property corridors UrbanEdge actively serves."],
      ["Direct property assistance", "Speak to a real team for shortlisting, questions and next-step guidance."],
      ["Site-visit coordination", "Move from online discovery to an organised property visit without unnecessary back-and-forth."],
      ["Buy, rent and residential support", "One place for apartments, villas, bungalows, penthouses, rentals and related residential services."],
      ["Owner and landlord support", "Property management, rental solutions and leasing assistance where supported by the business."],
      ["Clear, human communication", "Straightforward information and contact paths instead of generic marketplace clutter."],
    ],
  },
  gu: {
    featuredKicker: "રેસિડેન્શિયલ વિકલ્પો", blogKicker: "ઉપયોગી માર્ગદર્શન", welcomeKicker: "સ્થાનિક રેસિડેન્શિયલ નિષ્ણાતો", whyKicker: "ઉપયોગી સહાય",
    rentTitle: "રેન્ટલ અને પ્રોપર્ટી મેનેજમેન્ટ સહાય", rentText: "પ્રોપર્ટી માલિક છો? UrbanEdgeની રેન્ટલ મેનેજમેન્ટ સેવાઓ, પાત્રતા અને હાલની Guaranteed Rent ઓફર વિશે જાણો.", learnMore: "રેન્ટલ મેનેજમેન્ટ જુઓ",
    why: [
      ["સ્થાનિક માર્કેટની જાણકારી", "ગાંધીનગર, અમદાવાદ અને UrbanEdge સેવા આપતા પ્રોપર્ટી વિસ્તારો માટે કેન્દ્રિત માર્ગદર્શન."],
      ["સીધી પ્રોપર્ટી સહાય", "શોર્ટલિસ્ટ, પ્રશ્નો અને આગળના પગલા માટે અમારી ટીમ સાથે સીધી વાત કરો."],
      ["સાઇટ વિઝિટ સંકલન", "બિનજરૂરી વિલંબ વિના ઓનલાઇન શોધથી ગોઠવેલી પ્રોપર્ટી વિઝિટ સુધી પહોંચો."],
      ["ખરીદ, ભાડું અને રેસિડેન્શિયલ સહાય", "ફ્લેટ, વિલા, બંગલો, પેન્ટહાઉસ, રેન્ટલ અને સંબંધિત સેવાઓ એક જ જગ્યાએ."],
      ["માલિકો માટે સહાય", "વ્યવસાયના સપોર્ટેડ સ્કોપમાં પ્રોપર્ટી મેનેજમેન્ટ, રેન્ટલ અને લીઝિંગ સહાય."],
      ["સ્પષ્ટ અને માનવીય વાતચીત", "સામાન્ય માર્કેટપ્લેસના ગૂંચવાડા વિના સીધી માહિતી અને સંપર્કના માર્ગ."],
    ],
  },
  hi: {
    featuredKicker: "रेजिडेंशियल अवसर", blogKicker: "उपयोगी मार्गदर्शन", welcomeKicker: "स्थानीय रेजिडेंशियल विशेषज्ञ", whyKicker: "व्यावहारिक सहायता",
    rentTitle: "रेंटल और प्रॉपर्टी मैनेजमेंट सहायता", rentText: "क्या आप प्रॉपर्टी मालिक हैं? UrbanEdge की रेंटल मैनेजमेंट सेवाएँ, पात्रता और मौजूदा Guaranteed Rent पेशकश देखें।", learnMore: "रेंटल मैनेजमेंट देखें",
    why: [
      ["स्थानीय मार्केट की जानकारी", "गांधीनगर, अहमदाबाद और UrbanEdge के सक्रिय प्रॉपर्टी क्षेत्रों के लिए केंद्रित मार्गदर्शन।"],
      ["सीधी प्रॉपर्टी सहायता", "शॉर्टलिस्ट, सवाल और अगले कदम के लिए हमारी टीम से सीधे बात करें।"],
      ["साइट विजिट समन्वय", "बिना अनावश्यक देरी के ऑनलाइन खोज से व्यवस्थित प्रॉपर्टी विजिट तक पहुँचें।"],
      ["खरीद, किराया और रेजिडेंशियल सहायता", "अपार्टमेंट, विला, बंगला, पेंटहाउस, रेंटल और संबंधित सेवाएँ एक ही जगह।"],
      ["मालिकों के लिए सहायता", "व्यवसाय के समर्थित दायरे में प्रॉपर्टी मैनेजमेंट, रेंटल और लीजिंग सहायता।"],
      ["साफ और मानवीय संवाद", "सामान्य मार्केटप्लेस की उलझन के बिना सीधी जानकारी और संपर्क के रास्ते।"],
    ],
  },
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activeListingType, setActiveListingType] = useState(
    HERO_LISTING_TABS[0]?.value ?? "buy",
  );
  const [keyword, setKeyword] = useState("");
  const [locality, setLocality] = useState("");
  const [bhk, setBhk] = useState("");
  const [budgetIndex, setBudgetIndex] = useState("");
  const [localities, setLocalities] = useState([]);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("properties")
      .select("locality")
      .eq("is_published", true)
      .not("locality", "is", null)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setLocalities(
          Array.from(new Set(data.map((row) => row.locality).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const budget = budgetIndex === "" ? {} : HERO_BUDGET_OPTIONS[Number(budgetIndex)] || {};
    const params = propertyFiltersToParams({
      listingType: activeListingType,
      search: keyword.trim() || undefined,
      locality: locality || undefined,
      bhk: bhk ? [bhk] : [],
      ...budget,
    });
    const query = new URLSearchParams(params).toString();
    navigate(query ? `/properties?${query}` : "/properties");
  };

  return (
    <section className="homepage-hero" aria-labelledby="homepage-hero-title">
      <img
        className="homepage-hero-background"
        src={propertyImage}
        srcSet={`${propertyImage} 960w, ${propertyImageLarge} 1600w`}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        width="1600"
        height="1068"
      />
      <div className="homepage-hero-overlay" />
      <div className="homepage-hero-content">
        <p className="homepage-hero-eyebrow">UrbanEdge Living Space</p>
        <h1 id="homepage-hero-title">{t("hero.title")}</h1>
        <p>{t("hero.subtitle")}</p>

        <form className="homepage-hero-search" onSubmit={handleSearch} role="search">
          <div className="homepage-hero-tabs" aria-label="Listing type">
            {HERO_LISTING_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                aria-pressed={activeListingType === tab.value}
                className={`homepage-hero-tab ${activeListingType === tab.value ? "homepage-hero-tab--active" : ""}`}
                onClick={() => setActiveListingType(tab.value)}
              >
                {t(`filters.${tab.value}`)}
              </button>
            ))}
          </div>
          <div className="homepage-hero-search-grid">
            <label className="sr-only" htmlFor="hero-locality">{t("filters.location")}</label>
            <select id="hero-locality" value={locality} onChange={(event) => setLocality(event.target.value)}>
              <option value="">{t("filters.allLocations")}</option>
              {localities.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
            <label className="sr-only" htmlFor="hero-bhk">{t("filters.bhk")}</label>
            <select id="hero-bhk" value={bhk} onChange={(event) => setBhk(event.target.value)}>
              <option value="">{t("filters.anyBhk")}</option>
              {["1", "2", "3", "4", "5", "6+"].map((item) => <option value={item} key={item}>{item} BHK</option>)}
            </select>
            <label className="sr-only" htmlFor="hero-budget">{t("filters.priceRange")}</label>
            <select id="hero-budget" value={budgetIndex} onChange={(event) => setBudgetIndex(event.target.value)}>
              <option value="">{t("filters.anyBudget")}</option>
              {HERO_BUDGET_OPTIONS.map((item, index) => <option value={index} key={index}>{item.label[language] || item.label.en}</option>)}
            </select>
            <div className="homepage-hero-keyword">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={t("hero.searchPlaceholder")}
                aria-label={t("hero.searchPlaceholder")}
              />
            </div>
            <Button type="submit" variant="primary">{t("hero.search")}</Button>
          </div>
        </form>

        <div className="homepage-hero-stats" aria-label="UrbanEdge service highlights">
          <div className="homepage-hero-stat">
            <MapPin className="homepage-hero-stat-icon-svg" aria-hidden="true" />
            <span className="homepage-hero-stat-label">{t("hero.local")}</span>
          </div>
          <div className="homepage-hero-stat">
            <MessagesSquare className="homepage-hero-stat-icon-svg" aria-hidden="true" />
            <span className="homepage-hero-stat-label">{t("hero.guidance")}</span>
          </div>
          <div className="homepage-hero-stat">
            <CalendarCheck2 className="homepage-hero-stat-icon-svg" aria-hidden="true" />
            <span className="homepage-hero-stat-label">{t("common.scheduleVisit")}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const FEATURED_FETCH_LIMIT = 20;

const FeaturedPropertiesSection = () => {
  const { t, language } = useLanguage();
  const copy = HOME_COPY[language] || HOME_COPY.en;
  const { data: featuredData, isLoading: loadingFeatured } = useProperties({
    isFeatured: true,
    pageSize: FEATURED_FETCH_LIMIT,
    sortBy: "newest",
  });
  const properties = featuredData?.data ?? [];
  const isLoading = loadingFeatured;

  return (
    <section className="homepage-featured-properties">
      <div className="homepage-section-heading-row">
        <div>
          <p className="homepage-section-kicker">{copy.featuredKicker}</p>
          <h2 className="homepage-section-title">{t("home.featured")}</h2>
        </div>
        <Link to="/properties" className="homepage-text-link">
          {t("home.viewAll")} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="homepage-property-list">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="rect" height={300} className="homepage-property-card-wrap" />
          ))
        ) : properties.length ? (
          properties.map((property) => (
            <div key={property.id} className="homepage-property-card-wrap">
              {property.is_featured && <Badge variant="primary" size="small" className="homepage-featured-badge">{t("home.featuredBadge")}</Badge>}
              <PropertyCard property={{ ...property, image: property.image_url || propertyImage }} showWhatsApp={false} />
            </div>
          ))
        ) : (
          <div className="homepage-empty-state">
            <h3>{t("home.noPropertiesTitle")}</h3>
            <p>{t("home.noPropertiesText")}</p>
            <div className="homepage-empty-actions">
              <Button as={Link} to="/properties" variant="secondary">{t("home.browseProperties")}</Button>
              <Button as={Link} to="/contact-us" variant="primary">{t("home.shareRequirement")}</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const WHY_CHOOSE_ICONS = [MapPinned, MessagesSquare, CalendarCheck2, Home, KeyRound, Handshake];

const BlogPreviewSection = () => {
  const { t, language } = useLanguage();
  const copy = HOME_COPY[language] || HOME_COPY.en;
  const { data, isLoading } = useBlogPosts({ pageSize: 3, sortBy: "newest" });
  const posts = data?.data ?? [];

  return (
    <section className="homepage-latest-news">
      <div className="homepage-section-heading-row">
        <div>
          <p className="homepage-section-kicker">{copy.blogKicker}</p>
          <h2 className="homepage-section-title">{t("home.latestGuides")}</h2>
        </div>
        <Link to="/blog" className="homepage-text-link">{t("nav.guides")} <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className="homepage-news-grid">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} variant="rect" height={240} />)
        ) : posts.length ? (
          posts.map((post) => (
            <Link to={`/blog/${post.slug || post.id}`} key={post.id} className="homepage-news-item card-hover">
              {post.image_url && <img src={post.image_url} alt="" className="homepage-news-image" loading="lazy" />}
              <div className="homepage-news-content">
                {post.category && <Badge variant="primary" size="small">{post.category}</Badge>}
                <h3>{post.title}</h3>
                <p>{getExcerpt(post, 110)}</p>
                <span className="homepage-news-readmore">{t("home.readMore")} <ArrowRight size={16} aria-hidden="true" /></span>
              </div>
            </Link>
          ))
        ) : (
          <p>{t("home.noGuides")}</p>
        )}
      </div>
    </section>
  );
};

const HomePage = () => {
  const { t, language } = useLanguage();
  const copy = HOME_COPY[language] || HOME_COPY.en;
  const contactMessage = "Hi, I'm interested in UrbanEdge Living Space properties.";
  const telHref = `tel:${ORGANIZATION.telephone.replace(/[^+\d]/g, "")}`;

  return (
    <div className="homepage">
      <SEOHead
        title="Residential Real Estate in Gandhinagar & Ahmedabad"
        description="Find apartments, villas, penthouses, rentals and residential property opportunities in Gandhinagar and Ahmedabad with local support from UrbanEdge Living Space."
        path="/"
        jsonLd={organizationSchema()}
      />
      <HeroSection />

      <div className="homepage-container">
        <AnimateOnScroll className="homepage-welcome-section">
          <div className="homepage-welcome-image">
            <img src="/urbanedge-logo-640.webp" alt="UrbanEdge Living Space" className="homepage-logo" loading="lazy" width="640" height="640" />
          </div>
          <div className="homepage-welcome-content">
            <p className="homepage-section-kicker">{copy.welcomeKicker}</p>
            <h2>{t("home.welcomeTitle")}</h2>
            <p>{t("home.welcomeText")}</p>
            <Button as={Link} to="/about-us" variant="secondary">{t("home.learnAbout")}</Button>
          </div>
        </AnimateOnScroll>

        <FeaturedPropertiesSection />

        <section className="homepage-why-choose">
          <AnimateOnScroll direction="left" className="homepage-why-choose-image">
            <img
              src={whyChooseUsSmall}
              srcSet={`${whyChooseUsSmall} 720w, ${whyChooseUsLarge} 1200w`}
              sizes="(max-width: 820px) 100vw, 46vw"
              alt="UrbanEdge residential property assistance"
              loading="lazy"
              decoding="async"
              width="1200"
              height="799"
            />
          </AnimateOnScroll>
          <AnimateOnScroll direction="right" className="homepage-why-choose-content">
            <p className="homepage-section-kicker">{copy.whyKicker}</p>
            <h2>{t("home.whyTitle")}</h2>
            <div className="homepage-why-choose-grid">
              {copy.why.map(([title, text], index) => {
                const Icon = WHY_CHOOSE_ICONS[index];
                return (
                <article key={title} className="homepage-why-choose-item">
                  <div className="homepage-why-choose-icon"><Icon size={20} aria-hidden="true" /></div>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </article>
                );
              })}
            </div>
          </AnimateOnScroll>
        </section>

        <AnimateOnScroll className="homepage-guaranteed-rent-band">
          <div className="homepage-guaranteed-rent-inner">
            <Building2 size={34} className="homepage-guaranteed-rent-icon" aria-hidden="true" />
            <h2>{copy.rentTitle}</h2>
            <p>{copy.rentText}</p>
            <div className="homepage-guaranteed-rent-actions">
              <Button as={Link} to="/guaranteed-rent" variant="primary">{copy.learnMore}</Button>
              <WhatsAppButton variant="inline" message="Hi, I'd like to know more about UrbanEdge rental and property management services." label={t("nav.whatsapp")} />
            </div>
          </div>
        </AnimateOnScroll>

        <section className="homepage-testimonials">
          <h2 className="homepage-section-title">{t("home.clientsSay")}</h2>
          <TestimonialCarousel />
        </section>

        <BlogPreviewSection />

        <section className="homepage-contact-cta-band">
          <div className="homepage-contact-cta-inner">
            <h2>{t("home.readyTitle")}</h2>
            <p>{t("home.readyText")}</p>
            <div className="homepage-contact-cta-actions">
              <a href={telHref} className="homepage-contact-cta-phone"><Phone size={18} aria-hidden="true" /> {ORGANIZATION.telephone}</a>
              <WhatsAppButton variant="inline" message={contactMessage} label={t("nav.whatsapp")} />
            </div>
          </div>
        </section>
      </div>

      <WhatsAppButton variant="floating" message={contactMessage} />
    </div>
  );
};

export default HomePage;
