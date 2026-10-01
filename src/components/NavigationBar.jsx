import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import WhatsAppButton from "./shared/WhatsAppButton";
import LanguageSwitcher from "./shared/LanguageSwitcher";
import { useLanguage } from "../i18n/LanguageContext";
import "./NavigationBar.css";

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const toggleRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1040) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const navLinks = [
    { to: "/", label: t("nav.home"), end: true },
    { to: "/properties?listing=buy", label: t("nav.buy") },
    { to: "/properties?listing=rent", label: t("nav.rent") },
    { to: "/properties", label: t("nav.properties") },
    { to: "/guaranteed-rent", label: t("nav.services") },
    { to: "/blog", label: t("nav.guides") },
    { to: "/about-us", label: t("nav.about") },
    { to: "/contact-us", label: t("nav.contact") },
  ];

  return (
    <>
      {menuOpen && (
        <button
          type="button"
          className="navbar-overlay"
          aria-label="Close navigation"
          onClick={closeMenu}
        />
      )}

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <nav className="navbar" aria-label="Primary navigation">
          <Link className="navbar-brand" to="/" onClick={closeMenu} aria-label="UrbanEdge Living Space home">
            <img
              src="/UrbanEdge_Living_Space_Logo_HD.jpg"
              alt="UrbanEdge Living Space"
              className="navbar-brand__logo"
            />
          </Link>

          <div className="navbar-desktop-actions">
            <ul className="navbar-menu navbar-menu--desktop">
              {navLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
            <NavLink
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="navbar-account"
              aria-label={isAuthenticated ? t("nav.account") : t("nav.signIn")}
            >
              <UserRound size={18} aria-hidden="true" />
            </NavLink>
            <WhatsAppButton variant="inline" label={t("nav.whatsapp")} className="navbar-whatsapp" />
          </div>

          <div className="navbar-mobile-actions">
            <LanguageSwitcher />
            <button
              ref={toggleRef}
              type="button"
              className="navbar-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div
            id="mobile-navigation-menu"
            className={`navbar-drawer ${menuOpen ? "is-open" : ""}`}
            aria-hidden={!menuOpen}
          >
            <div className="navbar-drawer__brand">
              <img src="/UrbanEdge_Living_Space_Logo_HD.jpg" alt="" aria-hidden="true" />
            </div>
            <ul className="navbar-menu navbar-menu--mobile">
              {navLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={closeMenu}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    tabIndex={menuOpen ? 0 : -1}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  onClick={closeMenu}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {isAuthenticated ? t("nav.account") : t("nav.signIn")}
                </NavLink>
              </li>
            </ul>
            <WhatsAppButton
              variant="inline"
              label={t("nav.whatsapp")}
              className="navbar-drawer__whatsapp"
              tabIndex={menuOpen ? 0 : -1}
            />
          </div>
        </nav>
      </header>
    </>
  );
};

export default NavigationBar;
