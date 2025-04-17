// src/pages/HomePage.jsx
import React, { useRef, useEffect, useState, memo } from 'react';
import { supabase } from '../lib/supabaseClient';
import PropertyCard from '../components/PropertyCard';
import Testimonial from '../components/Testimonial';
import './HomePage.css';

import propertyImage from '../assets/property.jpg';
import testimonialMen from '../assets/review1.jpg';
import testimonialFemale from '../assets/reviewfemale.jpg';

const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentElem = ref.current;
    if (!currentElem) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(currentElem);
    return () => observer.unobserve(currentElem);
  }, [threshold]);

  return { ref, isVisible };
};

const AnimateOnScroll = ({ children, className = '', direction = 'none' }) => {
  const { ref, isVisible } = useInView();
  const directionClass = direction !== 'none' ? `slide-${direction}` : '';
  return (
    <div
      ref={ref}
      className={`scroll-animate ${directionClass} ${className} ${
        isVisible ? 'in-view' : ''
      }`}
    >
      {children}
    </div>
  );
};

const BackgroundOverlay = memo(() => (
  <svg className="background-overlay" viewBox="0 0 1440 320" aria-hidden="true">
    <path fill="rgba(0,31,63,0.2)" d="M0,256L1440,32L1440,320L0,320Z"></path>
  </svg>
));

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
      <AnimateOnScroll className="homepage-hero-content">
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

const HomePage = () => {
  const [featuredProps, setFeaturedProps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: false })
        .limit(3);  // ← only fetch 3

      if (error) {
        console.error('Error fetching featured properties:', error);
      } else {
        setFeaturedProps(data);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="homepage-container">
      <HeroSection />

      <AnimateOnScroll className="homepage-welcome-section homepage-box">
        <div className="homepage-welcome-image">
          <img
            src={propertyImage}
            alt="Welcome to RealEstatePro"
            className="card-hover"
            loading="lazy"
          />
        </div>
        <div className="homepage-welcome-content">
          <h2>Welcome to UrbanEdge Living Space</h2>
          <p className="text-background-overlay">
            At UrbanEdge Living Space, we are committed to providing you with a curated selection of premium properties and unparalleled service. Our expert team is here to guide you every step of the way.
          </p>
          <a href="#/about-us" className="homepage-cta-button">
            Learn More About Us
          </a>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll className="homepage-featured-properties homepage-box">
        <h2 className="homepage-section-title">Featured Properties</h2>
        <div className="homepage-property-list">
          {loading ? (
            <p>Loading properties...</p>
          ) : featuredProps.length > 0 ? (
            featuredProps.map(prop => (
              <div key={prop.id} className="card-hover">
                <PropertyCard
                  property={{
                    id: prop.id,
                    title: prop.name,
                    description: prop.description,
                    location: prop.location,
                    image: prop.image_url || propertyImage,
                    property_type: prop.property_type,
                    price_range: prop.price_range,
                  }}
                />
              </div>
            ))
          ) : (
            <p>No featured properties available.</p>
          )}
        </div>
        <div className="homepage-cta-container">
          <a href="#/properties" className="homepage-cta-button homepage-secondary">
            View All Listings
          </a>
        </div>
      </AnimateOnScroll>
      <div className="homepage-why-choose homepage-box">
        <AnimateOnScroll direction="right" className="homepage-why-choose-content">
          <div className="text-border connected-right">
            <h2>Why Choose Us?</h2>
            <ul className="homepage-why-choose-list">
              {WHY_CHOOSE_POINTS.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll direction="left" className="homepage-why-choose-image">
          <img
            src={propertyImage}
            alt="Why Choose RealEstatePro"
            className="card-hover"
            loading="lazy"
          />
        </AnimateOnScroll>
      </div>

      <div className="homepage-guaranteed-rent homepage-box">
        <AnimateOnScroll direction="left" className="homepage-guaranteed-rent-image">
          <img
            src={propertyImage}
            alt="Guaranteed Rent Program"
            className="card-hover"
            loading="lazy"
          />
        </AnimateOnScroll>
        <AnimateOnScroll direction="right" className="homepage-guaranteed-rent-content">
          <div className="text-border connected-left">
            <h2>Support under 24 hours</h2>
            <p>
              Enjoy peace of mind with our support under 24 hours. We ensure timely support calls and a hassle-free process, so you can invest with confidence.
            </p>
          </div>
          <a href="#/contact-us" className="homepage-cta-button">
            Learn More
          </a>
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll className="homepage-testimonials homepage-box">
        <h2 className="homepage-section-title">What Our Clients Say</h2>
        <div className="homepage-testimonial-list">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card-hover">
              <Testimonial testimonial={t} />
            </div>
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll className="homepage-latest-news homepage-box">
        <h2 className="homepage-section-title">Latest News</h2>
        <div className="homepage-news-grid">
          {NEWS_ITEMS.map((news) => (
            <div key={news.id} className="news-card card-hover">
              <img src={news.image} alt={news.title} className="news-image" loading="lazy" />
              <div className="news-content">
                <h3 className="news-title">{news.title}</h3>
                <p className="news-description">{news.description}</p>
                <a href="#/blog" className="news-readmore">Read More →</a>
              </div>
            </div>
          ))}
        </div>
      </AnimateOnScroll>
    </div>
  );
};

export default HomePage;
