import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Phone,
  ArrowRight,
  Building2,
  Users,
  MapPin,
  Home,
  KeyRound,
  Handshake,
  MapPinned,
  MessagesSquare,
  CalendarCheck2,
} from "lucide-react";

import { useProperties, usePropertiesCount } from "../hooks/useProperties";
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
import "./HomePage.css";
import "./HomePage.modern.css";
import propertyImage from "../assets/property.jpg";
import urbanEdgeLogo from "../assets/UrbanEdge_Living_Space_Logo_HD.jpg";
import whyChooseUs from "../assets/whyChooseUs.jpg";

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

const HERO_LISTING_TABS = LISTING_TYPE_OPTIONS.filter((opt) => opt.value !== "all");

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeListingType, setActiveListingType] = useState(
    HERO_LISTING_TABS[0]?.value ?? "buy",
  );
  const [keyword, setKeyword] = useState("");
  const { data: statsData, isLoading, isError } = usePropertiesCount();
  const count = statsData?.count;

  const handleSearch = (event) => {
    event.preventDefault();
    const params = propertyFiltersToParams({
      listingType: activeListingType,
      search: keyword.trim() || undefined,
    });
    const query = new URLSearchParams(params).toString();
    navigate(query ? `/properties?${query}` : "/properties");
  };

  return (
    <section className="homepage-hero" aria-labelledby="homepage-hero-title">
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
                {tab.label}
              </button>
            ))}
          </div>
          <div className="homepage-hero-search-bar">
            <Search className="homepage-hero-search-icon" size={18} aria-hidden="true" />
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t("hero.searchPlaceholder")}
              aria-label={t("hero.searchPlaceholder")}
            />
            <Button type="submit" variant="primary">{t("hero.search")}</Button>
          </div>
        </form>

        <div className="homepage-hero-stats" aria-label="UrbanEdge service highlights">
          <div className="homepage-hero-stat">
            <Building2 className="homepage-hero-stat-icon-svg" aria-hidden="true" />
            <span className="homepage-hero-stat-value">
              {isLoading ? <Skeleton variant="text" width={42} height="1em" /> : isError || count == null ? "Active" : `${count}+`}
            </span>
            <span className="homepage-hero-stat-label">{t("hero.listings")}</span>
          </div>
          <div className="homepage-hero-stat">
            <Users className="homepage-hero-stat-icon-svg" aria-hidden="true" />
            <span className="homepage-hero-stat-value">Direct</span>
            <span className="homepage-hero-stat-label">{t("hero.guidance")}</span>
          </div>
          <div className="homepage-hero-stat">
            <MapPin className="homepage-hero-stat-icon-svg" aria-hidden="true" />
            <span className="homepage-hero-stat-value">Local</span>
            <span className="homepage-hero-stat-label">{t("hero.local")}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const FEATURED_SECTION_MIN = 4;
const FEATURED_FETCH_LIMIT = 20;

const FeaturedPropertiesSection = () => {
  const { t } = useLanguage();
  const { data: featuredData, isLoading: loadingFeatured } = useProperties({
    isFeatured: true,
    pageSize: FEATURED_FETCH_LIMIT,
    sortBy: "newest",
  });
  const featuredProperties = featuredData?.data ?? [];
  const fillerCount = Math.max(FEATURED_SECTION_MIN - featuredProperties.length, 0);
  const { data: fillerData, isLoading: loadingFiller } = useProperties(
    { isFeatured: false, pageSize: fillerCount, sortBy: "newest" },
    { enabled: !loadingFeatured && fillerCount > 0 },
  );
  const properties = [...featuredProperties, ...(fillerData?.data ?? [])];
  const isLoading = loadingFeatured || (fillerCount > 0 && loadingFiller);

  return (
    <section className="homepage-featured-properties">
      <div className="homepage-section-heading-row">
        <div>
          <p className="homepage-section-kicker">Residential opportunities</p>
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

const WHY_CHOOSE_POINTS = [
  { icon: MapPinned, title: "Local market knowledge", text: "Focused guidance for Gandhinagar, Ahmedabad and the property corridors UrbanEdge actively serves." },
  { icon: MessagesSquare, title: "Direct property assistance", text: "Speak to a real team for shortlisting, questions and next-step guidance." },
  { icon: CalendarCheck2, title: "Site-visit coordination", text: "Move from online discovery to an organised property visit without unnecessary back-and-forth." },
  { icon: Home, title: "Buy, rent and residential support", text: "One place for apartments, villas, bungalows, penthouses, rentals and related residential services." },
  { icon: KeyRound, title: "Owner and landlord support", text: "Property management, rental solutions and leasing assistance where supported by the business." },
  { icon: Handshake, title: "Clear, human communication", text: "Straightforward information and contact paths instead of generic marketplace clutter." },
];

const BlogPreviewSection = () => {
  const { t } = useLanguage();
  const { data, isLoading } = useBlogPosts({ pageSize: 3, sortBy: "newest" });
  const posts = data?.data ?? [];

  return (
    <section className="homepage-latest-news">
      <div className="homepage-section-heading-row">
        <div>
          <p className="homepage-section-kicker">Useful reading</p>
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
  const { t } = useLanguage();
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
            <img src={urbanEdgeLogo} alt="UrbanEdge Living Space" className="homepage-logo" loading="lazy" />
          </div>
          <div className="homepage-welcome-content">
            <p className="homepage-section-kicker">Local residential specialists</p>
            <h2>{t("home.welcomeTitle")}</h2>
            <p>{t("home.welcomeText")}</p>
            <Button as={Link} to="/about-us" variant="secondary">{t("home.learnAbout")}</Button>
          </div>
        </AnimateOnScroll>

        <FeaturedPropertiesSection />

        <section className="homepage-why-choose">
          <AnimateOnScroll direction="left" className="homepage-why-choose-image">
            <img src={whyChooseUs} alt="UrbanEdge residential property assistance" loading="lazy" />
          </AnimateOnScroll>
          <AnimateOnScroll direction="right" className="homepage-why-choose-content">
            <p className="homepage-section-kicker">Practical support</p>
            <h2>{t("home.whyTitle")}</h2>
            <div className="homepage-why-choose-grid">
              {WHY_CHOOSE_POINTS.map(({ icon: Icon, title, text }) => (
                <article key={title} className="homepage-why-choose-item">
                  <div className="homepage-why-choose-icon"><Icon size={20} aria-hidden="true" /></div>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </article>
              ))}
            </div>
          </AnimateOnScroll>
        </section>

        <AnimateOnScroll className="homepage-guaranteed-rent-band">
          <div className="homepage-guaranteed-rent-inner">
            <Building2 size={34} className="homepage-guaranteed-rent-icon" aria-hidden="true" />
            <h2>Rental & Property Management Support</h2>
            <p>Own a property? Explore UrbanEdge rental-management services, eligibility and the current Guaranteed Rent offering.</p>
            <div className="homepage-guaranteed-rent-actions">
              <Button as={Link} to="/guaranteed-rent" variant="primary">Learn More</Button>
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
