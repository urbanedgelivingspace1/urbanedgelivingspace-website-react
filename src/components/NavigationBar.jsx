import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, UserRound, ChevronDown } from "lucide-react";
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
  const drawerRef = useRef(null);

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
    const backgroundNodes = [
      document.querySelector(".app-main"),
      document.querySelector(".footer"),
    ].filter(Boolean);
    const priorInert = backgroundNodes.map((node) => ({ node, inert: node.inert }));
    backgroundNodes.forEach((node) => {
      node.inert = true;
    });

    const drawer = drawerRef.current;
    const focusable = () =>
      Array.from(
        drawer?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) || [],
      ).filter((element) => element.getClientRects().length > 0);
    requestAnimationFrame(() => focusable()[0]?.focus());

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key === "Tab") {
        const items = focusable();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      priorInert.forEach(({ node, inert }) => {
        node.inert = inert;
      });
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const primaryLinks = [
    { to: "/properties", label: t("nav.exploreProperties") },
    { to: "/services", label: t("nav.services") },
    { to: "/blog", label: t("nav.guides") },
  ];
  const mobileLinks = [
    { to: "/", label: t("nav.home"), end: true },
    ...primaryLinks,
    { to: "/about-us", label: t("nav.about") },
    { to: "/our-team", label: t("navigation.team") },
    { to: "/contact-us", label: t("nav.contact") },
  ];

  return (
    <>
      {menuOpen && (
        <button
          type="button"
          className="navbar-overlay"
          aria-label={t("navigation.close")}
          tabIndex={-1}
          onClick={closeMenu}
        />
      )}

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <nav className="navbar" aria-label="Primary navigation">
          <Link className="navbar-brand" to="/" onClick={closeMenu} aria-label="UrbanEdge Living Space home">
            <img
              src="/urbanedge-logo-640.webp"
              alt="UrbanEdge Living Space"
              className="navbar-brand__logo"
            />
          </Link>

          <div className="navbar-desktop-actions">
            <ul className="navbar-menu navbar-menu--desktop">
              {primaryLinks.map(({ to, label, end }) => (
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
              <li className="navbar-menu__group">
                <NavLink to="/about-us" className={({ isActive }) => (isActive ? "active" : "")}>
                  {t("nav.about")} <ChevronDown size={14} aria-hidden="true" />
                </NavLink>
                <ul className="navbar-submenu" aria-label={t("navigation.aboutGroup")}>
                  <li><NavLink to="/about-us">{t("nav.about")}</NavLink></li>
                  <li><NavLink to="/our-team">{t("navigation.team")}</NavLink></li>
                </ul>
              </li>
              <li>
                <NavLink to="/contact-us" className={({ isActive }) => (isActive ? "active" : "")}>
                  {t("nav.contact")}
                </NavLink>
              </li>
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
              aria-label={menuOpen ? t("navigation.close") : t("navigation.open")}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div
            id="mobile-navigation-menu"
            ref={drawerRef}
            className={`navbar-drawer ${menuOpen ? "is-open" : ""}`}
            aria-hidden={!menuOpen}
            role="dialog"
            aria-modal="true"
            aria-label={t("navigation.open")}
          >
            <div className="navbar-drawer__brand">
              <img src="/urbanedge-logo-640.webp" alt="" aria-hidden="true" />
            </div>
            <ul className="navbar-menu navbar-menu--mobile">
              {mobileLinks.map(({ to, label, end }) => (
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
