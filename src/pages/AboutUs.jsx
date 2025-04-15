// src/pages/AboutUs.jsx
import React, { useEffect } from 'react';
import './AboutUs.css';
import propertyImage from '../assets/property.jpg'; // High-res luxury property image
import Testimonial from '../components/Testimonial';

const AboutUs = () => {
  // Parallax effect on the hero section for a dynamic experience
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('.aboutus-hero');
      if (hero) {
        hero.style.backgroundPositionY = `${window.pageYOffset * 0.5}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      text: 'UrbanEdge Living transformed my rental experience with exceptional service.',
      author: 'Jane Doe',
      photo: propertyImage, // Replace with actual testimonial photo if available
    },
    {
      text: 'A luxurious experience from start to finish. Truly outstanding.',
      author: 'John Smith',
      photo: propertyImage,
    },
  ];

  return (
    <div className="aboutus-page">
      {/* Hero Section with Parallax & Fade-In */}
      <section className="aboutus-hero" role="banner" aria-label="About UrbanEdge Living">
        <div className="aboutus-hero-overlay" aria-hidden="true"></div>
        <div className="aboutus-hero-content fade-in">
          <h1>About UrbanEdge Living</h1>
          <p className="aboutus-hero-subtitle">
            Experience luxury living and refined property solutions.
          </p>
          <a href="/listings" className="aboutus-cta-button">Explore Listings</a>
        </div>
      </section>

      {/* About Story Section with Enhanced Storytelling */}
      <section className="aboutus-story-section aboutus-container">
        <div className="aboutus-story-image">
          <img 
            src={propertyImage} 
            alt="Luxurious property exterior" 
            loading="lazy"
          />
        </div>
        <div className="aboutus-story-content">
          <h2>Our Story</h2>
          <p>
            Discover a world where premium properties meet tailored service.
            Watch our introductory video to see how we create exceptional living experiences.
          </p>
          {/* Video/Animation Placeholder */}
          <div 
            className="aboutus-video-placeholder" 
            aria-label="Introductory video placeholder"
          ></div>
          <a href="/contact-us" className="aboutus-cta-button">Request Consultation</a>
        </div>
      </section>

      {/* Who We Are Section with Reverse Layout */}
      <section className="aboutus-who-section aboutus-container aboutus-section--reverse">
        <div className="aboutus-who-content">
          <h2>Who We Are</h2>
          <p>
            We are a team of property experts driven by a passion for excellence.
            Our core values—integrity, innovation, and luxury—guide every decision.
          </p>
          <a href="/our-team" className="aboutus-cta-button aboutus-secondary-button">Meet Our Team</a>
        </div>
        <div className="aboutus-who-image">
          <img 
            src={propertyImage} 
            alt="Our team in action" 
            loading="lazy"
          />
        </div>
      </section>

      {/* What We Offer Section with Service Cards */}
      <section className="aboutus-offer-section aboutus-container">
        <h2 className="section-title">What We Offer</h2>
        <div className="aboutus-offer-cards">
          <div className="aboutus-offer-card">
            <img src={propertyImage} alt="Property Management" loading="lazy" />
            <h3>Property Management</h3>
            <p>Seamless management services for hassle-free living.</p>
          </div>
          <div className="aboutus-offer-card">
            <img src={propertyImage} alt="Rental Solutions" loading="lazy" />
            <h3>Rental Solutions</h3>
            <p>Flexible rental options to suit both landlords and tenants.</p>
          </div>
          <div className="aboutus-offer-card">
            <img src={propertyImage} alt="Luxury Leasing" loading="lazy" />
            <h3>Luxury Leasing</h3>
            <p>Exclusive properties with premium amenities and services.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="aboutus-testimonials">
        <div className="aboutus-container">
          <h2 className="section-title">Client Testimonials</h2>
          <div className="aboutus-testimonial-list">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section with Form & Map */}
      <section className="aboutus-contact-section aboutus-container">
        <div className="aboutus-contact-form">
          <h2>Contact Us</h2>
          <form>
            <label htmlFor="name">Your Name</label>
            <input id="name" type="text" placeholder="Your Name" required />

            <label htmlFor="email">Your Email</label>
            <input id="email" type="email" placeholder="Your Email" required />

            <label htmlFor="phone">Your Phone Number</label>
            <input id="phone" type="tel" placeholder="Your Phone Number" />

            <label htmlFor="message">Your Message</label>
            <textarea id="message" rows="5" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
        <div className="aboutus-contact-map">
          {/* Map integration placeholder */}
          <p>Interactive Map Placeholder</p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
