// src/components/forms/InquiryForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdSend } from 'react-icons/md';
import { supabase } from '../../lib/supabaseClient';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import './InquiryForm.css';

/**
 * InquiryForm (Package 4.3)
 *
 * Relocated + rebuilt from `components/PropertyPriceForm.jsx` (Blueprint
 * Section 13, row 28: "Becomes components/forms/InquiryForm.jsx under
 * the new structure | Replace (relocate + rebuild)"). Rebuilt on the
 * shared `ui/Input`, `ui/Textarea`, `ui/Button` primitives (1.3) instead
 * of raw form markup, matching the equalization goal flagged in Part A
 * Section 9F. The submit logic (validation rules, success/error
 * messaging, `form_submissions` insert shape) is carried over unchanged
 * from `PropertyPriceForm.jsx` — this package doesn't touch the
 * `form_submissions` table-name/shape known deviation, only the form's
 * own markup and component composition.
 */
function InquiryForm({ property }) {
  const { t } = useLanguage();
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
      if (!formData.name || !formData.phone) {
        setErrorMessage(t('forms.required'));
        return;
      }
      if (formData.phone.length < 8) {
        setErrorMessage(t('forms.invalidPhone'));
        return;
      }

      const { error } = await supabase.from('form_submissions').insert([
        {
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          property_id: property?.id,
          property_name: property?.name || 'Unknown property',
        },
      ]);

      if (error) {
        console.error('Property inquiry submission failed:', error);
        throw new Error('submission_failed');
      }

      setSuccessMessage(t('forms.inquirySuccess'));
      setFormData({
        name: '',
        phone: '',
        message: `I'm interested in ${property?.name || 'this property'}. Please share price details.`,
      });
    } catch (err) {
      console.error('Property inquiry error:', err);
      setErrorMessage(t('forms.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} aria-label={t('forms.inquiryForm')}>
      <Input
        label={t('forms.fullName')}
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder={t('forms.namePlaceholder')}
        required
        autoComplete="name"
      />
      <Input
        label={t('forms.phone')}
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder={t('forms.phonePlaceholder')}
        required
        autoComplete="tel"
      />
      <Textarea
        label={t('forms.message')}
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder={t('forms.inquiryPlaceholder')}
        rows={3}
      />

      <Button type="submit" fullWidth loading={submitting}>
        <MdSend /> {submitting ? t('forms.sending') : t('forms.requestPrice')}
      </Button>

      <p className="form-privacy-notice">
        {t('forms.privacyPrefix')} <Link to="/privacy">{t('common.privacyPolicy')}</Link>.
      </p>

      {successMessage && (
        <p className="inquiry-form__success" role="alert">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="inquiry-form__error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}

export default InquiryForm;
