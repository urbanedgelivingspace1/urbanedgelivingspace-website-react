// src/pages/HomePage.jsx
import React, { useRef, useEffect, useState, memo } from 'react';
import { supabase } from '../lib/supabaseClient';
import PropertyCard from '../components/PropertyCard';
import Testimonial from '../components/Testimonial';
import './HomePage.css';

import propertyImage from '../assets/property.jpg';
import urbanEdgeLogo from '../assets/UrbanEdge_Living_Space_Logo_HD.jpg';
import whyChooseUs from '../assets/whyChooseUs.jpg';

const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const current = ref.current;
    if (!current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    observer.observe(current);
    return () => observer.unobserve(current);
  }, [threshold]);

  return { ref, isVisible };
};

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

const BackgroundOverlay = memo(() => (
  <svg className="background-overlay" viewBox="0 0 1440 320" aria-hidden="true">
    <path fill="rgba(0,31,63,0.2)" d="M0,256L1440,32L1440,320L0,320Z" />
  </svg>
));

const HeroSection = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.homepage-hero');
      if (hero) hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
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

const TESTIMONIALS = [];

const WHY_CHOOSE_POINTS = [
  'A Proven Track Record of Excellence',
  'Tailored and Personalized Services',
  'Clear and Transparent Communication',
  'Expert Negotiation Skills',
  'Comprehensive End-to-End Support',
  'A Trusted Network of Professionals',
  'Innovative and Effective Marketing Strategies',
  'A Results-Oriented Approach to Success',
];

const HomePage = () => {
  const [featuredProps, setFeaturedProps] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Fetch featured properties
  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: false })
        .limit(3);
      if (error) console.error('Error fetching featured properties:', error);
      else setFeaturedProps(data);
      setLoadingProps(false);
    };
    fetchFeatured();
  }, []);

  // Fetch latest 3 blog posts
  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, content, image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) console.error('Error fetching blog posts:', error);
      else setBlogPosts(data);
      setLoadingBlogs(false);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="homepage-container">
      <HeroSection />

      {/* Welcome Section with Logo */}
      <AnimateOnScroll className="homepage-welcome-section homepage-box">
        <div className="homepage-welcome-image logo-container">
          <img
            src={urbanEdgeLogo}
            alt="UrbanEdge Living Space Logo"
            className="homepage-logo"
            loading="lazy"
          />
        </div>
        <div className="homepage-welcome-content">
          <h2>Welcome to UrbanEdge Living Space</h2>
          <p className="text-background-overlay">
            At UrbanEdge Living Space, we are committed to providing you with a curated selection of premium properties and unparalleled service. Our expert team is here to guide you every step of the way.
          </p>
          <a href="#/about-us" className="homepage-cta-button">Learn More About Us</a>
        </div>
      </AnimateOnScroll>

      {/* Featured Properties */}
      <AnimateOnScroll className="homepage-featured-properties homepage-box">
        <h2 className="homepage-section-title">Featured Properties</h2>
        <div className="homepage-property-list">
          {loadingProps ? (
            <p>Loading properties...</p>
          ) : featuredProps.length ? (
            featuredProps.map(prop => (
              <div key={prop.id} className="card-hover">
                <PropertyCard
                  property={{
                    id: prop.id,
                    property_type: prop.property_type,
                    title: prop.name,
                    description: prop.description,
                    location: prop.location,
                    image: prop.image_url || propertyImage,
                    carpet_area: prop.carpet_area,
                    bhk: prop.bhk,
                  }}
                />
              </div>
            ))
          ) : (
            <p>No featured properties available.</p>
          )}
        </div>
        <div className="homepage-cta-container">
        <a href="#/properties" className="homepage-cta-button homepage-secondary homepage-view-listings-button">View All Listings</a>
        </div>
      </AnimateOnScroll>

      {/* Why Choose */}
      <div className="homepage-why-choose homepage-box">
        <AnimateOnScroll direction="right" className="homepage-why-choose-content">
          <div className="text-border connected-right">
            <h2>Why Choose Us?</h2>
            <ul className="homepage-why-choose-list">
              {WHY_CHOOSE_POINTS.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll direction="left" className="homepage-why-choose-image">
          <img src={whyChooseUs} alt="Why Choose Us" className="card-hover" loading="lazy" />
        </AnimateOnScroll>
      </div>

      {/* Testimonials */}
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

      {/* Latest Blog Posts */}
      <AnimateOnScroll className="homepage-latest-news homepage-box">
        <h2 className="homepage-section-title">Latest Blog Posts</h2>
        <div className="homepage-news-grid">
          {loadingBlogs ? (
            <p>Loading blog posts...</p>
          ) : blogPosts.length ? (
            blogPosts.map(post => (
              <div key={post.id} className="news-card card-hover">
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="news-image" loading="lazy" />
                )}
                <div className="news-content">
                  <h3 className="news-title">{post.title}</h3>
                  <p className="news-description">{post.content.slice(0, 100)}...</p>
                  <a href="#/blog" className="news-readmore">Read More →</a>
                </div>
              </div>
            ))
          ) : (
            <p>No blog posts available.</p>
          )}
        </div>
      </AnimateOnScroll>
    </div>
  );
};

export default HomePage;


