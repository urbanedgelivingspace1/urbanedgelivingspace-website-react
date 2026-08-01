// src/pages/HomePage.jsx

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Phone,
  ArrowRight,
  Building2,
  Award,
  Users,
  MessageCircle,
  TrendingUp,
  Network,
  ShieldCheck,
} from "lucide-react";

import { useProperties } from "../hooks/useProperties";
import { useBlogPosts } from "../hooks/useBlogPosts";
import {
  LISTING_TYPE_OPTIONS,
  propertyFiltersToParams,
} from "../components/property/PropertyFilters";
import PropertyCard from "../components/PropertyCard";
import TestimonialCarousel from "../components/shared/TestimonialCarousel";
import WhatsAppButton from "../components/shared/WhatsAppButton";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Skeleton from "../components/ui/Skeleton";
import { ORGANIZATION } from "../lib/seo";
import "./HomePage.css";
import propertyImage from "../assets/property.jpg";
import urbanEdgeLogo from "../assets/UrbanEdge_Living_Space_Logo_HD.jpg";
import whyChooseUs from "../assets/whyChooseUs.jpg";

/* NOTE ON THIS FILE
   ------------------
   The source you uploaded had gone through a rich-text -> markdown
   conversion that strips real JSX tags (<div>, <section>, <img>, etc.),
   leaving only text/attributes/comments behind. Everything below has
   been reconstructed from what survived. The Hero section (the part
   you asked me to change) is solid — I built it fresh against the
   logic that was visible. The other sections are a faithful best-effort
   rebuild based on className names and comments that survived, but you
   should diff them against your real working file before shipping,
   since exact wrapper markup for those sections couldn't be recovered
   byte-for-byte. */

/* ------------------------------------------------------------------ */
/* Shared scroll-reveal helpers                                        */
/* ------------------------------------------------------------------ */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const current = ref.current;
    if (!current) return undefined;

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
    return () => observer.unobserve(current);
  }, [threshold]);

  return { ref, isVisible };
};

const AnimateOnScroll = ({ children, className = "", direction = "none" }) => {
  const { ref, isVisible } = useInView();
  const directionClass = direction !== "none" ? `slide-${direction}` : "";

  return (
    <div
      ref={ref}
      className={`scroll-animate ${directionClass} ${className} ${
        isVisible ? "in-view" : ""
      }`}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero — full-bleed photo, headline, Buy/Rent/Commercial tabs +       */
/* keyword search, and a trust strip with a LIVE property count.      */
/* ------------------------------------------------------------------ */
const HERO_LISTING_TABS = LISTING_TYPE_OPTIONS.filter(
  (opt) => opt.value !== "all",
);

// How many rows to request when counting total live listings for the
// hero stat. If useProperties/Supabase exposes an exact server-side
// `count` (typical of a `.select("*", { count: "exact" })` query), that
// value is used directly and this limit is irrelevant to the number
// shown — it only matters for the client-side-count fallback below.
// Raise it if the portfolio ever grows past 500 active listings.
const HERO_STATS_FETCH_LIMIT = 500;

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeListingType, setActiveListingType] = useState(
    HERO_LISTING_TABS[0]?.value ?? "buy",
  );
  const [keyword, setKeyword] = useState("");

  // Live count of listed properties — replaces the old hardcoded "51+".
  const { data: statsData, isLoading: loadingPropertyCount } = useProperties({
    pageSize: HERO_STATS_FETCH_LIMIT,
  });

  // Prefer a server-side total if the hook exposes one (cheaper — no
  // need to pull every row just to count them). Fall back to counting
  // whatever rows came back if it doesn't expose a count field yet.
  const totalPropertiesCount =
    statsData?.count ?? statsData?.total ?? statsData?.data?.length ?? null;

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
    <section className="homepage-hero">
      <div className="homepage-hero-overlay" />

      <div className="homepage-hero-content">
        <h1>Find Your Home in Gandhinagar</h1>
        <p>
          Explore premium properties with unmatched quality and expert
          service.
        </p>

        <form
          className="homepage-hero-search"
          onSubmit={handleSearch}
          role="search"
        >
          <div
            className="homepage-hero-tabs"
            role="tablist"
            aria-label="Listing type"
          >
            {HERO_LISTING_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={activeListingType === tab.value}
                className={`homepage-hero-tab ${
                  activeListingType === tab.value
                    ? "homepage-hero-tab--active"
                    : ""
                }`}
                onClick={() => setActiveListingType(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="homepage-hero-search-bar">
            <Search
              className="homepage-hero-search-icon"
              size={18}
              aria-hidden="true"
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by locality, project, or keyword"
              aria-label="Search properties"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </div>
        </form>

        <div className="homepage-hero-stats">
          <div className="homepage-hero-stat">
            <Building2
              className="homepage-hero-stat-icon-svg"
              aria-hidden="true"
            />
            <span className="homepage-hero-stat-value">
              {loadingPropertyCount
                ? "50+"
                : totalPropertiesCount != null
                  ? `${totalPropertiesCount}+`
                  : "50+"}
            </span>
            <span className="homepage-hero-stat-label">Properties</span>
          </div>

          <div className="homepage-hero-stat">
            <Users
              className="homepage-hero-stat-icon-svg"
              aria-hidden="true"
            />
            <span className="homepage-hero-stat-value">Trusted</span>
            <span className="homepage-hero-stat-label">
              Property Guidance
            </span>
          </div>

          <div className="homepage-hero-stat">
            <ShieldCheck
              className="homepage-hero-stat-icon-svg"
              aria-hidden="true"
            />
            <span className="homepage-hero-stat-value">100%</span>
            <span className="homepage-hero-stat-label">RERA Registered</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Featured Properties — server-fetched via `useProperties`, falling  */
/* back to the newest listings if nothing is flagged `is_featured`.   */
/* ------------------------------------------------------------------ */
const FEATURED_SKELETON_COUNT = 4;
const FEATURED_SECTION_MIN = 4;
const FEATURED_FETCH_LIMIT = 20;

function FeaturedPropertiesSkeleton() {
  return (
    <>
      {Array.from({ length: FEATURED_SKELETON_COUNT }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rect"
          height={280}
          className="homepage-property-card-wrap"
        />
      ))}
    </>
  );
}

const FeaturedPropertiesSection = () => {
  const { data: featuredData, isLoading: loadingFeatured } = useProperties({
    isFeatured: true,
    pageSize: FEATURED_FETCH_LIMIT,
    sortBy: "newest",
  });

  const featuredProperties = featuredData?.data ?? [];
  const featuredCount = featuredProperties.length;
  const fillerCount = Math.max(FEATURED_SECTION_MIN - featuredCount, 0);

  const { data: fillerData, isLoading: loadingFiller } = useProperties(
    { isFeatured: false, pageSize: fillerCount, sortBy: "newest" },
    { enabled: !loadingFeatured && fillerCount > 0 },
  );

  const fillerProperties = fillerData?.data ?? [];
  const properties = [...featuredProperties, ...fillerProperties];
  const isLoading = loadingFeatured || (fillerCount > 0 && loadingFiller);

  return (
    <section className="homepage-featured">
      <h2>Featured Properties</h2>

      <div className="homepage-featured-grid">
        {isLoading ? (
          <FeaturedPropertiesSkeleton />
        ) : properties.length ? (
          properties.map((prop) => (
            <div
              key={prop.id}
              className="card-hover homepage-property-card-wrap"
            >
              {prop.is_featured && (
                <Badge
                  variant="primary"
                  size="small"
                  className="homepage-property-badge"
                >
                  Featured
                </Badge>
              )}
              <PropertyCard
                property={{ ...prop, image: prop.image_url || propertyImage }}
                showWhatsApp={false}
              />
            </div>
          ))
        ) : (
          <p>No properties available right now.</p>
        )}
      </div>

      <Link to="/properties" className="homepage-featured-cta">
        View All Properties
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Why Choose Us — 6 points, including "RERA registered projects only".*/
/* ------------------------------------------------------------------ */
const WHY_CHOOSE_POINTS = [
  {
    icon: Award,
    title: "Proven Track Record",
    text: "A consistent history of successful sales, rentals, and satisfied clients.",
  },
  {
    icon: Users,
    title: "Personalized Service",
    text: "Every client gets a tailored search, not a generic listing dump.",
  },
  {
    icon: MessageCircle,
    title: "Transparent Communication",
    text: "Clear updates at every step — no surprises, no hidden terms.",
  },
  {
    icon: TrendingUp,
    title: "Expert Negotiation",
    text: "We work to get you the best possible terms on every deal.",
  },
  {
    icon: Network,
    title: "Trusted Network",
    text: "A vetted circle of legal, financial, and construction partners.",
  },
  {
    icon: ShieldCheck,
    title: "RERA Registered Projects Only",
    text: "Every project we list is verified and compliant, for your peace of mind.",
  },
];

/* ------------------------------------------------------------------ */
/* Blog Preview — server-fetched via `useBlogPosts`, links to the     */
/* real per-post slug (falling back to id).                           */
/* ------------------------------------------------------------------ */
const BLOG_PREVIEW_SKELETON_COUNT = 3;

function BlogPreviewSkeleton() {
  return (
    <>
      {Array.from({ length: BLOG_PREVIEW_SKELETON_COUNT }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rect"
          height={190}
          className="homepage-news-image"
        />
      ))}
    </>
  );
}

const BlogPreviewSection = () => {
  const { data, isLoading } = useBlogPosts({ pageSize: 3, sortBy: "newest" });
  const posts = data?.data ?? [];

  return (
    <section className="homepage-news">
      <h2>Latest Blog Posts</h2>

      <div className="homepage-news-grid">
        {isLoading ? (
          <BlogPreviewSkeleton />
        ) : posts.length ? (
          posts.map((post) => (
            <Link
              to={`/blog/${post.slug || post.id}`}
              key={post.id}
              className="homepage-news-item card-hover"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="homepage-news-image"
                  loading="lazy"
                />
              )}
              {post.category && (
                <Badge
                  variant="primary"
                  size="small"
                  className="homepage-news-category"
                >
                  {post.category}
                </Badge>
              )}
              <h3>{post.title}</h3>
              <p>{(post.excerpt || post.content || "").slice(0, 110)}...</p>
              <span className="homepage-news-date">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="homepage-news-readmore">
                Read More
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))
        ) : (
          <p>No blog posts available yet.</p>
        )}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page assembly — all 8 homepage sections.                            */
/* ------------------------------------------------------------------ */
const HomePage = () => {
  const guaranteedRentMessage =
    "Hi, I'd like to know more about the Guaranteed Rent program.";
  const contactMessage =
    "Hi, I'm interested in UrbanEdge Living Space properties.";
  const telHref = `tel:${ORGANIZATION.telephone.replace(/[^+\d]/g, "")}`;

  return (
    <main className="homepage">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Welcome */}
      <AnimateOnScroll className="homepage-welcome">
        <img
          src={urbanEdgeLogo}
          alt="UrbanEdge Living Space Logo"
          className="homepage-logo"
          loading="lazy"
        />
        <h2>Welcome to UrbanEdge Living Space</h2>
        <p>
          At UrbanEdge Living Space, we are committed to providing you with a
          curated selection of premium properties and unparalleled service.
          Our expert team is here to guide you every step of the way.
        </p>
        <Button as={Link} to="/about" variant="secondary">
          Learn More About Us
        </Button>
      </AnimateOnScroll>

      {/* 3. Featured Properties */}
      <FeaturedPropertiesSection />

      {/* 4. Why Choose Us */}
      <section className="homepage-why-choose">
        <AnimateOnScroll
          direction="left"
          className="homepage-why-choose-image"
        >
          <img
            src={whyChooseUs}
            alt="Why Choose Us"
            className="card-hover"
            loading="lazy"
          />
        </AnimateOnScroll>

        <AnimateOnScroll
          direction="right"
          className="homepage-why-choose-content"
        >
          <h2>Why Choose Us?</h2>
          <div className="homepage-why-choose-grid">
            {WHY_CHOOSE_POINTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="homepage-why-choose-point">
                <Icon size={28} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* 5. Guaranteed Rent CTA */}
      <AnimateOnScroll className="homepage-guaranteed-rent">
        <Building2
          size={36}
          className="homepage-guaranteed-rent-icon"
          aria-hidden="true"
        />
        <h2>Earn Guaranteed Rental Income</h2>
        <p>
          Let us manage your property end-to-end and receive a fixed,
          guaranteed rental payout — every month, regardless of vacancy.
        </p>

        {/* Package 4.5 built the dedicated Guaranteed Rent page;
            "Learn More" now points there instead of the interim
            Contact Us fallback. HomePage.jsx is not in 4.5's
            declared file-lock scope — flagged as an unavoidable
            minimal touch in IMPLEMENTATION_STATE.md (same pattern
            as App.jsx's route registration above). */}
        <Button
          as={Link}
          to="/guaranteed-rent"
          variant="primary"
          size="medium"
        >
          Learn More
        </Button>
        <WhatsAppButton
          variant="inline"
          message={guaranteedRentMessage}
          label="WhatsApp Us"
        />
      </AnimateOnScroll>

      {/* 6. Testimonials */}
      <section className="homepage-testimonials">
        <h2>What Our Clients Say</h2>
        <TestimonialCarousel />
      </section>

      {/* 7. Blog Preview */}
      <BlogPreviewSection />

      {/* 8. Contact CTA band */}
      <section className="homepage-contact-cta">
        <h2>Ready to find your property?</h2>
        <p>
          Talk to our team today — we're here to help you buy, rent, or
          invest with confidence.
        </p>
        <a href={telHref} className="homepage-contact-phone">
          <Phone size={18} aria-hidden="true" />
          {ORGANIZATION.telephone}
        </a>
        <WhatsAppButton
          variant="inline"
          message={contactMessage}
          label="WhatsApp Us"
        />
      </section>

      {/* Floating WhatsApp button, present on the homepage per the
          redesign plan's site-wide floating-button requirement. */}
      <WhatsAppButton variant="floating" message={contactMessage} />
    </main>
  );
};

export default HomePage;
