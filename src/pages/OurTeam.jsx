import React from 'react';
import { User, Award, Briefcase, Scale, Code } from 'lucide-react';
import vpxgrowth from '../assets/vpxgrowth.png';
import mantavya from '../assets/mantavya.jpg';
import lawyer from '../assets/lawyer.jpg';
import RiyaMantavya from '../assets/riya-mantavya.jpg';
import RiyaYug from '../assets/riya-Yug.jpg';

// Using placeholder images - replace with your actual imports
const teamMembers = [
  {
    name: 'Mantavya Patel',
    role: 'Senior Sales Executive',
    image: mantavya,
    description: 'A veteran in property negotiation, Mantavya specializes in high-value commercial acquisitions and elite residential investments.',
    icon: Award
  },
  {
    name: 'Riya Patel',
    role: 'Senior Sales Executive',
    image: RiyaMantavya,
    description: 'Riya curates our luxury portfolio, offering bespoke consultation for clients seeking premium living spaces and refined aesthetics.',
    icon: Award
  },
  {
    name: 'Riya Patel',
    role: 'Sales Executive',
    image: RiyaYug,
    description: 'Bringing dynamic market agility, dedicated to matching clients with their perfect starter homes and investment opportunities.',
    icon: Briefcase
  },
  {
    name: 'Narendrasinh M. Vihol',
    role: 'Legal Expert',
    image: lawyer,
    description: 'Narendrasinh ensures ironclad compliance and provides expert counsel to safeguard every transaction and contract.',
    icon: Scale
  },
  {
    name: 'VPxGrowth',
    role: 'Web Development Partner',
    image: vpxgrowth,
    description: 'VPxGrowth powers our digital infrastructure, ensuring a seamless, secure, and world-class property browsing experience.',
    icon: Code
  },
];

const OurTeam = () => {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.tagline}>THE EXPERTS</span>
          <h2 style={styles.title}>Meet Our Agents</h2>
          <p style={styles.subtitle}>
            A collective of industry leaders dedicated to redefining the standard of real estate excellence.
          </p>
        </div>

        {/* Team Grid */}
        <div style={styles.grid}>
          {teamMembers.map((member, idx) => {
            const IconComponent = member.icon;
            return (
              <div key={idx} style={styles.card}>
                {/* Image Container with aspect ratio control */}
                <div style={styles.imageWrapper}>
                  <div style={styles.imageInner}>
                    <img 
                      src={member.image} 
                      alt={member.name}
                      style={styles.image}
                      loading="lazy"
                    />
                    <div style={styles.overlay}></div>
                  </div>
                  <div style={styles.iconBadge}>
                    <IconComponent size={20} color="#c5a47e" />
                  </div>
                </div>

                {/* Content */}
                <div style={styles.content}>
                  <div style={styles.contentHeader}>
                    <h3 style={styles.name}>{member.name}</h3>
                    <p style={styles.role}>{member.role}</p>
                  </div>
                  <div style={styles.divider}></div>
                  <p style={styles.description}>{member.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: '#f8fafc',
    padding: '5rem 1.5rem',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tagline: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#c5a47e',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#0f172a',
    fontWeight: '700',
    margin: '0 0 1rem 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.6',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#eef2f6',
    overflow: 'hidden',
  },
  imageInner: {
    position: 'relative',
    width: '100%',
    paddingTop: '115%', // 4:5 portrait aspect ratio - perfect for professional headshots
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'contain', // Changed from cover to contain - shows full image
    objectPosition: 'center',
    transition: 'transform 0.5s ease, filter 0.3s ease',
    filter: 'grayscale(5%)',
    backgroundColor: '#f8fafc', // Background color for any gaps
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(15,23,42,0.05) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  iconBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '48px',
    height: '48px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
  },
  content: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    textAlign: 'center',
  },
  contentHeader: {
    marginBottom: '0.5rem',
  },
  name: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.3px',
  },
  role: {
    fontSize: '0.75rem',
    color: '#c5a47e',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    margin: '0',
  },
  divider: {
    height: '2px',
    width: '50px',
    background: 'linear-gradient(90deg, transparent, #c5a47e, transparent)',
    margin: '1.25rem auto',
  },
  description: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.7',
    margin: '0',
  },
};

// Add hover effects via a style tag
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @media (hover: hover) {
    .team-card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
      border-color: #c5a47e;
    }
    .team-card-hover:hover img {
      transform: scale(1.03);
      filter: grayscale(0%);
    }
    .team-card-hover:hover .overlay {
      opacity: 1;
    }
    .team-card-hover:hover .icon-badge {
      transform: scale(1.1) rotate(5deg);
    }
  }
  
  @media (max-width: 768px) {
    .team-grid-responsive {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
      gap: 1.5rem !important;
    }
  }
`;

if (!document.head.querySelector('style[data-team-styles]')) {
  styleSheet.setAttribute('data-team-styles', 'true');
  document.head.appendChild(styleSheet);
}

// Update component to use class names
const OurTeamEnhanced = () => {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.tagline}>THE EXPERTS</span>
          <h2 style={styles.title}>Meet Our Agents</h2>
          <p style={styles.subtitle}>
            A collective of industry leaders dedicated to redefining the standard of real estate excellence.
          </p>
        </div>

        <div style={styles.grid} className="team-grid-responsive">
          {teamMembers.map((member, idx) => {
            const IconComponent = member.icon;
            return (
              <div key={idx} style={styles.card} className="team-card-hover">
                <div style={styles.imageWrapper}>
                  <div style={styles.imageInner}>
                    <img 
                      src={member.image} 
                      alt={member.name}
                      style={styles.image}
                      loading="lazy"
                    />
                    <div style={styles.overlay} className="overlay"></div>
                  </div>
                  <div style={styles.iconBadge} className="icon-badge">
                    <IconComponent size={20} color="#c5a47e" />
                  </div>
                </div>

                <div style={styles.content}>
                  <div style={styles.contentHeader}>
                    <h3 style={styles.name}>{member.name}</h3>
                    <p style={styles.role}>{member.role}</p>
                  </div>
                  <div style={styles.divider}></div>
                  <p style={styles.description}>{member.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurTeamEnhanced;