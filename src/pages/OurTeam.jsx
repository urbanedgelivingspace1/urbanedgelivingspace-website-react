// src/components/OurTeam.jsx
import React from 'react';
import './OurTeam.css';

const teamMembers = [
  {
    name: 'Mantavya Patel',
    role: 'CEO & Founder',
    image: '/images/team/mantavya.jpg',
    description: 'Mantavya leads Urban Edge Living Space with a strategic vision, driving innovation and excellence in the real estate sector. His leadership inspires growth and ensures the company’s values are reflected in every project.',
  },
  {
    name: 'Riya Patel',
    role: 'Co-Founder & Adviser',
    image: '/images/team/riya.jpg',
    description: "Riya plays a pivotal role in shaping the company's creative direction. Her expertise in design and strategic insight ensures a seamless blend of functionality and aesthetic appeal in every initiative.",
  },
  {
    name: 'Narendrasinh M. Vihol',
    role: 'Legal Expert',
    image: '/images/team/narendrasinh.jpg',
    description: 'Narendrasinh is a trusted legal expert at Urban Edge Living Space. He delivers strategic legal guidance, ensuring robust compliance and safeguarding our operations with integrity and precision.',
  },
  {
    name: 'VPxGrowth',
    role: 'Website Development & Maintenance',
    image: '/images/team/vpxgrowth.jpg',
    description: "VPxGrowth is responsible for the development and maintenance of Urban Edge Living Space's website. They ensure a robust digital foundation, crafting intuitive interfaces, implementing cutting-edge solutions, and maintaining a seamless and reliable online experience that supports the company's growth.",
  },
];

const OurTeam = () => (
  <section className="our-team">
    <div className="our-team__container">
      <header className="our-team__header">
        <h1 className="our-team__title">Meet Our Team</h1>
        <p className="our-team__subtitle">
          We are a team of dedicated professionals who work together to provide the best service possible.
        </p>
      </header>

      <div className="our-team__grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <div className="team-card__image-wrapper">
              <img
                src={member.image}
                alt={member.name}
                className="team-card__image"
              />
            </div>
            <div className="team-card__content">
              <h2 className="team-card__name">{member.name}</h2>
              <h3 className="team-card__role">{member.role}</h3>
              <p className="team-card__description">{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default OurTeam;