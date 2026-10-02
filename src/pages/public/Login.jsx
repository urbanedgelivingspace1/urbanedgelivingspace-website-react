// src/pages/public/Login.jsx
//
// New (Auth & Favourites Architecture Plan §2/§4) — single shared login
// surface for public users AND admins (replaces AdminLogin.jsx's role).
// Email/password, magic link, and Google are all offered; whichever
// succeeds lands the person here (or straight back here for OAuth/magic
// link) with a session, and usePostAuthRedirect does the post-auth
// branch: /admin if admin_users says so, otherwise /dashboard (or
// wherever they were headed before being sent to /login).
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

const Login = () => {
  const { t } = useLanguage();
  // Handles the redirect once a session appears — from this form's own
  // signIn() call below, or from a Google/magic-link redirect landing
  // back on this page with a session already set.
  usePostAuthRedirect();

  const { signIn, signInWithGoogle, signInWithMagicLink } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await signIn(email.trim().toLowerCase(), password);
      // usePostAuthRedirect takes it from here once the session lands.
    } catch (err) {
      console.error('Sign-in failed:', err);
      setErrorMsg(
        err.message === 'Invalid login credentials'
          ? t('auth.invalidCredentials')
          : t('auth.signInError'),
      );
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      setErrorMsg(t('auth.enterEmail'));
      return;
    }
    setMagicLoading(true);
    setErrorMsg('');
    try {
      await signInWithMagicLink(email.trim().toLowerCase());
      setMagicSent(true);
    } catch (err) {
      console.error('Magic-link sign-in failed:', err);
      setErrorMsg(t('auth.magicError'));
    } finally {
      setMagicLoading(false);
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

  return (
    <div className="auth-page">
      <SEOHead title="Sign In" path="/login" noindex />
      <div className="auth-card">
        <h1>{t('auth.signIn')}</h1>
        <p className="auth-subtitle">{t('auth.signInSubtitle')}</p>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}
        {magicSent && (
          <p className="auth-success">
            {t('auth.magicSent')}
          </p>
        )}

        <form onSubmit={handleLogin} className="auth-form">
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
            label={t('auth.password')}
            name="password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            showLabel={t('auth.showPassword')}
            hideLabel={t('auth.hidePassword')}
          />
          <Button type="submit" variant="primary" size="medium" fullWidth loading={loading}>
            {t('auth.signIn')}
          </Button>
        </form>

        <button
          type="button"
          className="auth-link-btn"
          onClick={handleMagicLink}
          disabled={magicLoading}
        >
          {magicLoading ? t('auth.sending') : t('auth.magic')}
        </button>

        <div className="auth-divider">
          <span>{t('auth.or')}</span>
        </div>

        <Button variant="outline" size="medium" fullWidth onClick={handleGoogle}>
          {t('auth.google')}
        </Button>

        <div className="auth-footer-links">
          <Link to="/reset-password">{t('auth.forgot')}</Link>
          <Link to="/signup">{t('auth.createLink')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
