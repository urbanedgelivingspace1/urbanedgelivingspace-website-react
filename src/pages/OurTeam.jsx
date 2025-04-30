// src/components/OurTeam.jsx
import React from 'react';
import './OurTeam.css';
import vpxgrowth from '../assets/vpxgrowth.png';
import mantavya from '../assets/mantavya.jpg';
import lawyer from '../assets/lawyer.jpg';

const teamMembers = [
  {
    name: 'Mantavya Patel',
    role: 'CEO & Founder',
    image: mantavya,
    description:
      'Mantavya leads Urban Edge Living Space with strategic foresight, driving innovation and excellence across all ventures.',
  },
  {
    name: 'Riya Patel',
    role: 'Co-Founder & Creative Adviser',
    image: '/images/team/riya.jpg',
    description:
      'Riya shapes the company’s creative vision, blending functionality with elegance in every project and decision.',
  },
  {
    name: 'Narendrasinh M. Vihol',
    role: 'Legal Expert',
    image: lawyer,
    description:
      'Narendrasinh ensures full legal compliance and provides expert counsel to protect and strengthen operations.',
  },
  {
    name: 'VPxGrowth',
    role: 'Web Development Partner',
    image: vpxgrowth,
    description:
      'VPxGrowth is the digital backbone of our website, ensuring seamless performance and a premium user experience.',
  },
];

const OurTeam = () => {
  return (
    <section className="our-team-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Core Team</h2>
          <p className="section-subtitle">
            Meet the people who lead our vision, innovation, and client success.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, idx) => (
            <div className="team-card" key={idx}>
              <div className="team-card-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-card-details">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-description">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
