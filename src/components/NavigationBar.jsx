// src/components/NavigationBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FaHome,
  FaInfoCircle,
  FaBuilding,
  FaBlog,
  FaEnvelope,
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
      setScrolled(window.pageYOffset > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo">
        <Link to="/">Real<span>Estate</span>Pro</Link>
      </div>
      <div className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation menu">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
      <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
        <li>
          <NavLink exact to="/" onClick={() => setMenuOpen(false)} activeClassName="active">
            <FaHome className="nav-icon" /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about-us" onClick={() => setMenuOpen(false)} activeClassName="active">
            <FaInfoCircle className="nav-icon" /> About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/properties" onClick={() => setMenuOpen(false)} activeClassName="active">
            <FaBuilding className="nav-icon" /> Properties
          </NavLink>
        </li>
        <li>
          <NavLink to="/blog" onClick={() => setMenuOpen(false)} activeClassName="active">
            <FaBlog className="nav-icon" /> Blog
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact-us" onClick={() => setMenuOpen(false)} activeClassName="active">
            <FaEnvelope className="nav-icon" /> Contact Us
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
