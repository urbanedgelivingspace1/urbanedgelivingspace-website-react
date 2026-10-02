// src/components/forms/SiteVisitForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdCalendarToday } from 'react-icons/md';
import { supabase } from '../../lib/supabaseClient';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import './SiteVisitForm.css';

/**
 * SiteVisitForm (Package 4.3, new)
 *
 * New form for the property detail page's "site-visit modal" (Blueprint
 * gap item #26). There is no dedicated `site_visits` table in the live
 * schema (Part A Section 7 lists only the 6 existing tables, and 2.1's
 * migration didn't add one) and adding one is a schema change outside
 * this package's scope ("Do not invent schema changes... do not
 * generate SQL"). This reuses the same `form_submissions` table as
 * `InquiryForm`, distinguishing itself only via a `message` value that
 * clearly states it's a site-visit request with the requested
 * date/time folded in — the same pragmatic approach already used for
 * both existing lead-capture forms on this project. Logged below as a
 * Known Deviation for whichever future package introduces a proper
 * `site_visits` table with its own status pipeline.
 */
function SiteVisitForm({ property, onSuccess }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
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
      if (!formData.name || !formData.phone || !formData.preferredDate) {
        setErrorMessage(t('forms.required'));
        return;
      }
      if (formData.phone.length < 8) {
        setErrorMessage(t('forms.invalidPhone'));
        return;
      }

      const visitLine = `Site visit requested for ${formData.preferredDate}${
        formData.preferredTime ? ` around ${formData.preferredTime}` : ''
      }.`;
      const message = [visitLine, formData.message].filter(Boolean).join(' ');

      const { error } = await supabase.from('form_submissions').insert([
        {
          name: formData.name,
          phone: formData.phone,
          message,
          property_id: property?.id,
          property_name: property?.name || 'Unknown property',
        },
      ]);

      if (error) {
        console.error('Site visit submission failed:', error);
        throw new Error('submission_failed');
      }

      setSuccessMessage(t('forms.visitSuccess'));
      setFormData({ name: '', phone: '', preferredDate: '', preferredTime: '', message: '' });
      onSuccess?.();
    } catch (err) {
      console.error('Site visit request error:', err);
      setErrorMessage(t('forms.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form className="site-visit-form" onSubmit={handleSubmit} aria-label={t('forms.visitForm')}>
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
      <div className="site-visit-form__row">
        <Input
          label={t('forms.preferredDate')}
          name="preferredDate"
          type="date"
          min={today}
          value={formData.preferredDate}
          onChange={handleChange}
          required
        />
        <Input
          label={t('forms.preferredTime')}
          name="preferredTime"
          type="time"
          value={formData.preferredTime}
          onChange={handleChange}
        />
      </div>
      <Textarea
        label={t('forms.notes')}
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder={t('forms.notesPlaceholder')}
        rows={3}
      />

      <Button type="submit" fullWidth loading={submitting}>
        <MdCalendarToday /> {submitting ? t('forms.sending') : t('forms.requestVisit')}
      </Button>

      <p className="form-privacy-notice">
        {t('forms.privacyPrefix')} <Link to="/privacy">{t('common.privacyPolicy')}</Link>.
      </p>

      {successMessage && (
        <p className="site-visit-form__success" role="alert">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="site-visit-form__error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}

export default SiteVisitForm;
