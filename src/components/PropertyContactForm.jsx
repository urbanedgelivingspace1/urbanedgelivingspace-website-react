import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './PropertyContactForm.css';

const PropertyContactForm = ({ property = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyId: property.id || '',
    propertyName: property.name || ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      propertyId: property.id || '',
      propertyName: property.name || ''
    }));
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const { data, error } = await supabase
      .from('form_submissions')  // Change to the relevant table for property inquiries
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        property_id: formData.propertyId,
        property_name: formData.propertyName
      }]);

    if (error) {
      console.error('Form submission error:', error.message, error.details);
      setErrorMessage(`Error: ${error.message}`);
    } else {
      console.log('Form submitted:', data);
      setSuccessMessage('Thank you for your inquiry! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '', propertyId: property.id, propertyName: property.name });
    }

    setSubmitting(false);
  };

  return (
    <div className="property-contact-form">
      <h2>Inquire About {property.name}</h2>
      <p>Please fill out the form below, and our team will contact you shortly.</p>

      <form onSubmit={handleSubmit} className="contact-form" aria-label="Property inquiry form">
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

        <div className="form-group full-width">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="How can we assist you?"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={submitting} className="submit-btn">
          {submitting ? 'Sending...' : 'Send Inquiry'}
        </button>

        {successMessage && <p className="success-message" role="alert">{successMessage}</p>}
        {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default PropertyContactForm;
