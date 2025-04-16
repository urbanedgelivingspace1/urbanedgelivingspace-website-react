// src/pages/ContactUs.jsx
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
      setSuccessMessage('Thank you for contacting us!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  
    setSubmitting(false);
  };  

  return (
    <div className="contact-us-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Contact Us</h1>
          <p>We’re here to help you with any questions, bookings, or special requests.</p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="contact-form-section container">
        <h2>Get in Touch with UrbanEdge Living</h2>
        <p>Our team is available to assist you with any inquiries. Please feel free to contact us using the form below.</p>
        
        <div className="form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name"
                name="name" 
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
                value={formData.message} 
                onChange={handleChange} 
                required
              />
            </div>
            <button type="submit" className="send-button" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>

          {/* Contact Details */}
          <div className="contact-details">
            <h3>Contact Details</h3>
            <p>+44 7903 766625</p>
            <p>+44 7490 136565</p>
            <p>urbanedgeliving@projection.me</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
