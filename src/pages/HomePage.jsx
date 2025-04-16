// src/pages/HomePage.jsx
import React, { useRef, useEffect, useState, memo } from 'react';
import PropertyCard from '../components/PropertyCard';
import Testimonial from '../components/Testimonial';
import './HomePage.css';

import propertyImage from '../assets/property.jpg';
import testimonialMen from '../assets/review1.jpg';
import testimonialFemale from '../assets/reviewfemale.jpg';

/* --------------------------------------------------------------
   Custom Hook: useInView
   Encapsulates IntersectionObserver logic for reveal animations.
-------------------------------------------------------------- */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentElem = ref.current;
    if (!currentElem) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    observer.observe(currentElem);

    return () => observer.unobserve(currentElem);
  }, [threshold]);

  return { ref, isVisible };
};

/* --------------------------------------------------------------
   AnimateOnScroll Component
   Wraps content and applies an animation class based on visibility.
   The prop `direction` can be "left", "right", or "none".
   When "left" or "right" is provided, a corresponding slide offset is applied.
   When "none" (or omitted), only a fade-in effect is used.
-------------------------------------------------------------- */
const AnimateOnScroll = ({ children, className = '', direction = 'none' }) => {
  const { ref, isVisible } = useInView();
  const directionClass = direction !== 'none' ? `slide-${direction}` : '';
  return (
    <div
      ref={ref}
      className={`scroll-animate ${directionClass} ${className} ${isVisible ? 'in-view' : ''}`}
    >
      {children}
    </div>
  );
};

/* --------------------------------------------------------------
   BackgroundOverlay Component 
   Renders an SVG overlay for added visual texture.
-------------------------------------------------------------- */
const BackgroundOverlay = memo(() => (
  <svg className="background-overlay" viewBox="0 0 1440 320" aria-hidden="true">
    <path fill="rgba(0,31,63,0.2)" d="M0,256L1440,32L1440,320L0,320Z"></path>
  </svg>
));

/* --------------------------------------------------------------
   HeroSection Component with Parallax effect
-------------------------------------------------------------- */
const HeroSection = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.homepage-hero');
      if (hero) {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="homepage-hero" aria-label="Hero Section">
      <BackgroundOverlay />
      {/* Use fade-in only for main header content */}
      <AnimateOnScroll direction="none" className="homepage-hero-content">
        <h1>Discover Your Next Home</h1>
        <p>Explore premium properties with unmatched quality and expert service.</p>
        <div className="homepage-cta-buttons">
          <a href="#/properties" className="homepage-cta-button">Explore Properties</a>
          <a href="#/contact-us" className="homepage-cta-button homepage-secondary">Contact Us</a>
        </div>
      </AnimateOnScroll>
    </section>
  );
};

/* --------------------------------------------------------------
   Static Data 
   Data for properties, testimonials, whyChoosePoints, and newsItems.
-------------------------------------------------------------- */
const PROPERTIES = [
  {
    id: 1,
    title: 'Luxury Apartment in Downtown',
    description: 'Experience upscale city living with stunning skyline views and state-of-the-art amenities.',
    image: propertyImage,
    price: '$2,500 / month',
    location: 'Downtown',
  },
  {
    id: 2,
    title: 'Spacious Villa with Garden',
    description: 'Enjoy modern comfort and elegance in a private villa complete with lush gardens and a pool.',
    image: propertyImage,
    price: '$750,000',
    location: 'Greenwood Estates',
  },
];

const TESTIMONIALS = [
  {
    text: 'RealEstatePro made my property buying experience seamless and stress-free!',
    author: 'John Doe',
    photo: testimonialMen,
  },
  {
    text: 'Their attention to detail and exceptional service truly stand out.',
    author: 'Jane Smith',
    photo: testimonialFemale,
  },
];

const WHY_CHOOSE_POINTS = [
  'Personalized property recommendations',
  'Expert local market knowledge',
  'Unparalleled customer service',
  'Transparent transactions',
];

const NEWS_ITEMS = [
  {
    id: 1,
    title: 'Market Trends 2025',
    description: 'An in-depth analysis of the current real estate market trends.',
    image: propertyImage,
  },
  {
    id: 2,
    title: 'Tips for Home Buyers',
    description: 'Essential tips and advice for buying your first home.',
    image: propertyImage,
  },
  {
    id: 3,
    title: 'Luxury Homes on the Rise',
    description: 'Discover the latest trends in luxury real estate.',
    image: propertyImage,
  },
];

/* --------------------------------------------------------------
   HomePage Component
   Composes the entire homepage layout.
-------------------------------------------------------------- */
const HomePage = () => {
  return (
    <div className="homepage-container">
      <HeroSection />

      {/* Welcome / About Section */}
      <AnimateOnScroll direction="none" className="homepage-welcome-section homepage-box">
        <div className="homepage-welcome-image">
          <img
            src={propertyImage}
            alt="Welcome to RealEstatePro"
            className="card-hover"
            loading="lazy"
          />
        </div>
        <div className="homepage-welcome-content">
          <h2>Welcome to RealEstatePro</h2>
          <p className="text-background-overlay">
            At RealEstatePro, we are committed to providing you with a curated selection of premium properties and unparalleled service. Our expert team is here to guide you every step of the way.
          </p>
          <a href="#/about-us" className="homepage-cta-button">
            Learn More About Us
          </a>
        </div>
      </AnimateOnScroll>

      {/* Featured Properties Section */}
      <AnimateOnScroll direction="none" className="homepage-featured-properties homepage-box">
        <h2 className="homepage-section-title">Featured Properties</h2>
        <div className="homepage-property-list">
          {PROPERTIES.map((property) => (
            <div key={property.id} className="card-hover">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
        <div className="homepage-cta-container">
          <a href="#/properties" className="homepage-cta-button homepage-secondary">
            View All Listings
          </a>
        </div>
      </AnimateOnScroll>

      {/* Why Choose Us Section */}
      <div className="homepage-why-choose homepage-box">
        {/* Description slides in from right */}
        <AnimateOnScroll direction="right" className="homepage-why-choose-content">
          <div className="text-border connected-right">
            <h2>Why Choose Us?</h2>
            <ul className="homepage-why-choose-list">
              {WHY_CHOOSE_POINTS.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </AnimateOnScroll>
        {/* Image slides in from left */}
        <AnimateOnScroll direction="left" className="homepage-why-choose-image">
          <img
            src={propertyImage}
            alt="Why Choose RealEstatePro"
            className="card-hover"
            loading="lazy"
          />
        </AnimateOnScroll>
      </div>

      {/* Guaranteed Rent Section */}
      <div className="homepage-guaranteed-rent homepage-box">
        {/* Image slides in from left */}
        <AnimateOnScroll direction="left" className="homepage-guaranteed-rent-image">
          <img
            src={propertyImage}
            alt="Guaranteed Rent Program"
            className="card-hover"
            loading="lazy"
          />
        </AnimateOnScroll>
        {/* Description slides in from right */}
        <AnimateOnScroll direction="right" className="homepage-guaranteed-rent-content">
          <div className="text-border connected-left">
            <h2>Guaranteed Rent</h2>
            <p>
              Enjoy peace of mind with our guaranteed rent program. We ensure timely rental payments and a hassle-free process, so you can invest with confidence.
            </p>
          </div>
          <a href="#/services" className="homepage-cta-button">
            Learn More
          </a>
        </AnimateOnScroll>
      </div>

      {/* Testimonials Section */}
      <AnimateOnScroll direction="none" className="homepage-testimonials homepage-box">
        <h2 className="homepage-section-title">What Our Clients Say</h2>
        <div className="homepage-testimonial-list">
          {TESTIMONIALS.map((testimonial, index) => (
            <div key={index} className="card-hover">
              <Testimonial testimonial={testimonial} />
            </div>
          ))}
        </div>
      </AnimateOnScroll>

      {/* Latest News & Articles Section */}
      <AnimateOnScroll direction="none" className="homepage-latest-news homepage-box">
        <h2 className="homepage-section-title">Latest News</h2>
        <div className="homepage-news-grid">
          {NEWS_ITEMS.map((news) => (
            <div key={news.id} className="card-hover">
              <PropertyCard property={news} />
            </div>
          ))}
        </div>
      </AnimateOnScroll>
    </div>
  );
};

export default HomePage;
