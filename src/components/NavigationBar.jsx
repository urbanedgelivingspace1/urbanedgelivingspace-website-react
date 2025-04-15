// src/components/NavigationBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FaHome,
  FaInfoCircle,
  FaBuilding,
  FaBlog,
  FaEnvelope,
  FaUser,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import './NavigationBar.css';

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: <FaHome /> },
    { to: '/about-us', label: 'About Us', icon: <FaInfoCircle /> },
    { to: '/properties', label: 'Properties', icon: <FaBuilding /> },
    { to: '/blog', label: 'Blog', icon: <FaBlog /> },
    { to: '/contact-us', label: 'Contact Us', icon: <FaEnvelope /> },
    { to: '/admin-login', label: 'Login / Register', icon: <FaUser /> },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          UrbanEdge <span>Living</span>
        </Link>
      </div>
      <div className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
      <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
        {navLinks.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
