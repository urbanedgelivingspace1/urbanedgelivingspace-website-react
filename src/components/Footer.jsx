// src/components/Footer.jsx
import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/properties">Properties</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact-us">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Subscribe</h4>
          <p>Subscribe for exclusive offers and latest news.</p>
          <form onSubmit={(e) => { e.preventDefault(); /* Handle submit logic */ }}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="https://www.instagram.com/urbanedgelivingspace_official/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 RealEstatePro. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
