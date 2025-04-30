import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const { data, error } = await supabase
      .from('form_submissions')
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      }]);

    if (error) {
      console.error('Form submission error:', error.message, error.details);
      setErrorMessage(`Error: ${error.message}`);
    } else {
      console.log('Form submitted:', data);
      setSuccessMessage('Thank you for contacting us! We will get back to you shortly.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }

    setSubmitting(false);
  };

  return (
    <div className="contact-us-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container fade-in">
          <h1>Contact UrbanEdge Living</h1>
          <p>Ready to find your dream property? Our expert team is here to guide you every step of the way.</p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="contact-form-section container">
        <h2>Get in Touch</h2>
        <p>Have questions about listings, property viewings, or partnerships? Send us a message below.</p>

        <div className="form-container">
          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit} aria-label="Contact form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+91 1234567890"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Brief subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="send-button" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>

            {successMessage && <p className="success-message" role="alert">{successMessage}</p>}
            {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}
          </form>

          {/* Contact Details */}
          <div className="contact-details" aria-labelledby="contact-info-heading">
            <h3 id="contact-info-heading">Contact Information</h3>
           <p><strong>Phone:</strong> +91 9408663544</p>
            <p><strong>Email:</strong> urbanedgelivingspace@gmail.com</p>

            <h4>Office Address</h4>
            <p>UrbanEdge living space office<br/>Shiholi Moti, Gandhinagar 382355</p>

            <h4>Business Hours</h4>
            <p>Mon - Fri: 9:00 AM - 6:00 PM<br/>Sat: 10:00 AM - 4:00 PM<br/>Sun: Closed</p>

            {/* Google Maps Embed */}
            <div className="map-container">
              <iframe
                title="UrbanEdge Living Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.0349841636835!2d72.73002327532032!3d23.241813979020765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395dd51d5ba695b1%3A0x99bd44906e708c19!2sRadhe%20residency!5e0!3m2!1sen!2sin!4v1744967575679!5m2!1sen!2sin"
                width="100%"
                height="200"
                frameBorder="0"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
