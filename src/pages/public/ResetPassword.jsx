// src/pages/public/ResetPassword.jsx
//
// New (Auth & Favourites Architecture Plan §2) — two modes in one page:
// 1. "request" — enter your email, get a reset link.
// 2. "update"  — landed here via that emailed link (Supabase fires a
//    PASSWORD_RECOVERY auth event once the recovery token in the URL is
//    exchanged for a session); shows a "set new password" form instead.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import SEOHead from '../../components/shared/SEOHead';
import { useLanguage } from '../../i18n/LanguageContext';
import './AuthPages.css';

const ResetPassword = () => {
  const { t } = useLanguage();
  const { resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('request'); // 'request' | 'update'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setMode('update');
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await resetPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      console.error('Password reset request failed:', err);
      setErrorMsg(t('auth.resetError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await updatePassword(newPassword);
      setUpdated(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      console.error('Password update failed:', err);
      setErrorMsg(t('auth.updateError'));
      setLoading(false);
    }
  };

  if (mode === 'update') {
    return (
      <div className="auth-page">
        <SEOHead title="Set a New Password" path="/reset-password" noindex />
        <div className="auth-card">
          <h1>{t('auth.setNew')}</h1>
          {updated ? (
            <p className="auth-success">{t('auth.updated')}</p>
          ) : (
            <>
              {errorMsg && <p className="auth-error">{errorMsg}</p>}
              <form onSubmit={handleUpdate} className="auth-form">
                <PasswordInput
                  label={t('auth.newPassword')}
                  name="newPassword"
                  placeholder={t('auth.newPassword')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  showLabel={t('auth.showPassword')}
                  hideLabel={t('auth.hidePassword')}
                />
                <Button type="submit" variant="primary" size="medium" fullWidth loading={loading}>
                  {t('auth.update')}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <SEOHead title="Reset Password" path="/reset-password" noindex />
      <div className="auth-card">
        <h1>{t('auth.reset')}</h1>
        <p className="auth-subtitle">{t('auth.resetSubtitle')}</p>
        {sent ? (
          <p className="auth-success">{t('auth.resetSent')}</p>
        ) : (
          <>
            {errorMsg && <p className="auth-error">{errorMsg}</p>}
            <form onSubmit={handleRequest} className="auth-form">
              <Input
                label={t('auth.email')}
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Button type="submit" variant="primary" size="medium" fullWidth loading={loading}>
                {t('auth.sendReset')}
              </Button>
            </form>
          </>
        )}
        <div className="auth-footer-links">
          <Link to="/login">{t('auth.back')}</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
