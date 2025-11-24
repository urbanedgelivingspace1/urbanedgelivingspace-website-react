// src/components/HeroSection.jsx
import React from 'react';
import { FaArrowDown } from 'react-icons/fa';
import './HeroSection.css';

// HeroSection component displays the main banner with call-to-action buttons and a scroll hint
const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay animate__animated animate__fadeIn">
        <h1 className="animate__animated animate__slideInDown">Welcome to RealEstatePro</h1>
        <p className="animate__animated animate__slideInUp">Experience luxury living and exceptional property services.</p>
        <div className="hero-cta">
          <a href="/properties" className="btn btn-primary transition">Discover Properties</a>
          <a href="/contact-us" className="btn btn-secondary transition">Get in Touch</a>
        </div>
        <a href="#scroll-down" className="scroll-hint transition">
          <FaArrowDown />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
