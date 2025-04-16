import React from 'react';

const teamMembers = [
  {
    name: 'Mantavya Patel',
    role: 'CEO & Founder',
    description: 'Mantavya leads Urban Edge Living Space with a strategic vision, driving innovation and excellence in the real estate sector. His leadership inspires growth and ensures the company’s values are reflected in every project.',
  },
  {
    name: 'Riya Patel',
    role: 'Co-Founder & Adviser',
    description: 'Riya plays a pivotal role in shaping the company\'s creative direction. Her expertise in design and strategic insight ensures a seamless blend of functionality and aesthetic appeal in every initiative.',
  },
  {
    name: 'Narendrasinh M. Vihol',
    role: 'Head of Marketing',
    description: 'With over 15 years of experience, Narendrasinh spearheads marketing strategies that keep Urban Edge Living Space ahead of industry trends. His innovative campaigns effectively connect the company with its audience.',
  },
  {
    name: 'VPxGrowth',
    role: 'Website Development & Maintenance',
    description: 'VPxGrowth is responsible for the development and maintenance of Urban Edge Living Space\'s website. They ensure a robust digital foundation, crafting intuitive interfaces, implementing cutting-edge solutions, and maintaining a seamless and reliable online experience that supports the company\'s growth.',
  },
];

const OurTeam = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Meet Our Team</h1>
        <p style={styles.subtitle}>
          We are a team of dedicated professionals who work together to provide the best service possible.
        </p>
      </div>

      <div style={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <div key={index} style={styles.teamMemberCard}>
            <img src={member.image} alt={member.name} style={styles.profileImage} />
            <h2 style={styles.name}>{member.name}</h2>
            <h3 style={styles.role}>{member.role}</h3>
            <p style={styles.description}>{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
    fontFamily: '"Roboto", sans-serif',
  },
  header: {
    marginBottom: '3rem',
    color: '#333',
  },
  subtitle: {
    fontSize: '1.2rem',
    fontWeight: '300',
    color: '#666',
    marginTop: '1rem',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
    width: '100%',
    maxWidth: '1200px',
  },
  teamMemberCard: {
    background: 'white',
    padding: '2.5rem',
    borderRadius: '15px',
    boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    textAlign: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    border: '1px solid #eee',
    '&:hover': {
      transform: 'translateY(-10px)',
    },
  },
  profileImage: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '1rem',
    border: '6px solid #007bff',
  },
  name: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '0.5rem',
  },
  role: {
    fontSize: '1.2rem',
    color: '#007bff',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '1.5rem',
    lineHeight: '1.7',
    fontStyle: 'italic',
  },
};

export default OurTeam;
