import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './PropertyPriceForm.css';
import { MdSend } from 'react-icons/md';

const PropertyPriceForm = ({ property }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: `I'm interested in ${property?.name || 'this property'}. Please share price details.`,
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Basic validation
      if (!formData.name || !formData.phone) {
        throw new Error('Please fill in all required fields.');
      }

      if (formData.phone.length < 8) {
        throw new Error('Please enter a valid phone number.');
      }

      const { data, error } = await supabase.from('form_submissions').insert([
        {
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          property_id: property?.id,
          property_name: property?.name || 'Unknown property',
        },
      ]);

      if (error) {
        console.error('Submission error:', error);
        throw new Error(error.message);
      }

      setSuccessMessage('Thank you! We’ll contact you soon with price details.');
      setFormData({
        name: '',
        phone: '',
        message: `I'm interested in ${property?.name || 'this property'}. Please share price details.`,
      });
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ppf-form" onSubmit={handleSubmit} aria-label="Property price inquiry form">
      <div className="ppf-field">
        <label htmlFor="name">Full Name<span className="ppf-required">*</span></label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
        />
      </div>

      <div className="ppf-field">
        <label htmlFor="phone">Phone Number<span className="ppf-required">*</span></label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your phone number"
          required
        />
      </div>

      <div className="ppf-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message"
          rows={3}
        />
      </div>

      <button type="submit" className="ppf-submit-btn" disabled={submitting}>
        {submitting ? 'Sending...' : (
          <>
            <MdSend /> Request Price Details
          </>
        )}
      </button>

      {successMessage && <p className="ppf-success-message" role="alert">{successMessage}</p>}
      {errorMessage && <p className="ppf-error-message" role="alert">{errorMessage}</p>}
    </form>
  );
};

export default PropertyPriceForm;
