// src/pages/public/Signup.jsx
//
// New (Auth & Favourites Architecture Plan §2) — public account
// creation. Email/password + Google. A `profiles` row is created
// automatically by the `handle_new_user` DB trigger (Phase A migration)
// for every sign-up method, so this page never inserts into `profiles`
// itself.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePostAuthRedirect } from '../../hooks/usePostAuthRedirect';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import SEOHead from '../../components/shared/SEOHead';
import { useLanguage } from '../../i18n/LanguageContext';
import './AuthPages.css';

const Signup = () => {
  const { t } = useLanguage();
  // Only fires the redirect if Supabase returns a session immediately
  // (i.e. email confirmation is disabled in the dashboard). If
  // confirmation is required, `session` stays null and we show the
  // "check your email" message below instead.
  usePostAuthRedirect();

  const { signUp, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmSent, setConfirmSent] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { session } = await signUp(
        email.trim().toLowerCase(),
        password,
        fullName.trim(),
      );
      if (!session) {
        setConfirmSent(true);
        setLoading(false);
      }
      // If a session came back immediately, usePostAuthRedirect handles it.
    } catch (err) {
      console.error('Account creation failed:', err);
      setErrorMsg(t('auth.createError'));
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMsg('');
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in failed:', err);
      setErrorMsg(t('auth.googleError'));
    }
  };

  if (confirmSent) {
    return (
      <div className="auth-page">
        <SEOHead title="Create Account" path="/signup" noindex />
        <div className="auth-card">
          <h1>{t('auth.almost')}</h1>
          <p className="auth-subtitle">
            {t('auth.confirm')} <strong>{email}</strong>
          </p>
          <Link to="/login">
            <Button variant="primary" size="medium" fullWidth>
              {t('auth.goSignIn')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <SEOHead title="Create Account" path="/signup" noindex />
      <div className="auth-card">
        <h1>{t('auth.create')}</h1>
        <p className="auth-subtitle">{t('auth.createSubtitle')}</p>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}

        <form onSubmit={handleSignup} className="auth-form">
          <Input
            label={t('auth.fullName')}
            name="fullName"
            type="text"
            placeholder={t('auth.fullName')}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
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
          <PasswordInput
            label={t('auth.newPassword')}
            name="password"
            placeholder={t('auth.newPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            showLabel={t('auth.showPassword')}
            hideLabel={t('auth.hidePassword')}
          />
          <Button type="submit" variant="primary" size="medium" fullWidth loading={loading}>
            {t('auth.create')}
          </Button>
        </form>

        <div className="auth-divider">
          <span>{t('auth.or')}</span>
        </div>

        <Button variant="outline" size="medium" fullWidth onClick={handleGoogle}>
          {t('auth.google')}
        </Button>

        <div className="auth-footer-links">
          <Link to="/login">{t('auth.existing')}</Link>
        </div>
        <p className="auth-privacy">
          {t('auth.privacy')} <Link to="/terms">{t('common.terms')}</Link> · <Link to="/privacy">{t('common.privacyPolicy')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
