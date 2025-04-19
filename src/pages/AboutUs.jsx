// src/pages/AboutUs.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './AboutUs.css';
import propertyImage from '../assets/property.jpg'; // High-res luxury property image
import Testimonial from '../components/Testimonial';

const AboutUs = () => {
  // Parallax effect on the hero section
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

  // Testimonials data
  const testimonials = [
    {
      text: 'UrbanEdge Living transformed my rental experience with exceptional service.',
      author: 'Jane Doe',
      photo: propertyImage,
    },
    {
      text: 'A luxurious experience from start to finish. Truly outstanding.',
      author: 'John Smith',
      photo: propertyImage,
    },
  ];

  // --- Contact form state & handlers ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const { data, error } = await supabase
      .from('form_submissions')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
      ]);

    if (error) {
      console.error('Form submission error:', error);
      setErrorMessage(`Error: ${error.message}`);
    } else {
      setSuccessMessage('Thank you! We will get back to you shortly.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }

    setSubmitting(false);
  };
  // --- end Contact form logic ---

  return (
    <div className="aboutus-page">
      {/* Hero Section */}
      <header className="aboutus-hero" role="banner" aria-label="About UrbanEdge Living">
        <div className="aboutus-hero-overlay" aria-hidden="true"></div>
        <div className="aboutus-hero-content fade-in" tabIndex="0">
          <h1>About UrbanEdge Living</h1>
          <p className="aboutus-hero-subtitle">
            Experience luxury living and refined property solutions.
          </p>
          <a href="#/listings" className="aboutus-cta-button" role="button">
            Explore Listings
          </a>
        </div>
      </header>

      <main>
        {/* Our Story */}
        <section className="aboutus-story-section aboutus-container" aria-labelledby="our-story-heading">
          <div className="aboutus-story-image">
            <img 
              src={propertyImage} 
              alt="Luxurious property exterior" 
              loading="lazy"
            />
          </div>
          <div className="aboutus-story-content">
            <h2 id="our-story-heading">Our Story</h2>
            <p>
              Discover a world where premium properties meet tailored service.
              Watch our introductory video to see how we create exceptional living experiences.
            </p>
            <div 
              className="aboutus-video-placeholder" 
              aria-label="Introductory video placeholder"
            ></div>
            <a href="#/contact-us" className="aboutus-cta-button" role="button">
              Request Consultation
            </a>
          </div>
        </section>

        {/* Who We Are */}
        <section className="aboutus-who-section aboutus-container aboutus-section--reverse" aria-labelledby="who-we-are-heading">
          <div className="aboutus-who-content">
            <h2 id="who-we-are-heading">Who We Are</h2>
            <p>
              We are a team of property experts driven by a passion for excellence.
              Our core values—integrity, innovation, and luxury—guide every decision.
            </p>
            <a href="#/our-team" className="aboutus-cta-button aboutus-secondary-button" role="button">
              Meet Our Team
            </a>
          </div>
          <div className="aboutus-who-image">
            <img 
              src={propertyImage} 
              alt="Our team in action" 
              loading="lazy"
            />
          </div>
        </section>

        {/* What We Offer */}
        <section className="aboutus-offer-section aboutus-container" aria-labelledby="what-we-offer-heading">
          <h2 id="what-we-offer-heading" className="section-title">What We Offer</h2>
          <div className="aboutus-offer-cards">
            <article className="aboutus-offer-card">
              <img src={propertyImage} alt="Property Management" loading="lazy" />
              <h3>Property Management</h3>
              <p>Seamless management services for hassle-free living.</p>
            </article>
            <article className="aboutus-offer-card">
              <img src={propertyImage} alt="Rental Solutions" loading="lazy" />
              <h3>Rental Solutions</h3>
              <p>Flexible rental options to suit both landlords and tenants.</p>
            </article>
            <article className="aboutus-offer-card">
              <img src={propertyImage} alt="Luxury Leasing" loading="lazy" />
              <h3>Luxury Leasing</h3>
              <p>Exclusive properties with premium amenities and services.</p>
            </article>
          </div>
        </section>

        {/* Testimonials */}
        <section className="aboutus-testimonials" aria-labelledby="testimonials-heading">
          <div className="aboutus-container">
            <h2 id="testimonials-heading" className="section-title">Client Testimonials</h2>
            <div className="aboutus-testimonial-list">
              {testimonials.map((t, i) => (
                <Testimonial key={i} testimonial={t} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className="aboutus-contact-section aboutus-container" aria-labelledby="contact-us-heading">
          <div className="aboutus-contact-form">
            <h2 id="contact-us-heading">Contact Us</h2>
            <form onSubmit={handleSubmit} aria-label="Contact form">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 1234567890"
                value={formData.phone}
                onChange={handleChange}
              />

              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="How can we help?"
                value={formData.message}
                onChange={handleChange}
                required
              />

              <button type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Message'}
              </button>

              {successMessage && <p className="success-message" role="alert">{successMessage}</p>}
              {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}
            </form>
          </div>

          <div className="aboutus-contact-details" aria-labelledby="contact-info-heading">
            <h3 id="contact-info-heading">Contact Information</h3>
            <p><strong>Phone:</strong> +91 74870 94556</p>
            <p><strong>Phone:</strong> +91 79846 19362</p>
            <p><strong>Email:</strong> urbanedgelivingspace@gmail.com</p>

            <h4>Office Address</h4>
            <p>UrbanEdge Living Space Office<br/>Shiholi Moti, Gandhinagar 382355</p>

            <h4>Business Hours</h4>
            <p>
              Mon – Fri: 9:00 AM – 6:00 PM<br/>
              Sat: 10:00 AM – 4:00 PM<br/>
              Sun: Closed
            </p>

            <div className="map-container">
              <iframe
                title="UrbanEdge Living Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.0349841636835!2d72.73002327532032!3d23.241813979020765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395dd51d5ba695b1%3A0x99bd44906e708c19!2sRadhe%20residency!5e0!3m2!1sen!2sin!4v1744967575679!5m2!1sen!2sin"
                width="100%"
                height="250"
                frameBorder="0"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                aria-hidden="false"
                tabIndex="0"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
