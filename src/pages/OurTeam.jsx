import React from 'react';
import johnDoeImage from '../assets/review2.jpg';
import janeSmithImage from '../assets/review2.jpg';
import michaelBrownImage from '../assets/review1.jpg';
import emilyJohnsonImage from '../assets/review2.jpg';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    image: johnDoeImage,
    description: 'John leads our company with a vision to bring excellence and innovation to the real estate industry.',
  },
  {
    name: 'Jane Smith',
    role: 'Lead Designer',
    image: janeSmithImage,
    description: 'Jane is responsible for the stunning designs and user-friendly interfaces that define our brand.',
  },
  {
    name: 'Michael Brown',
    role: 'Head of Marketing',
    image: michaelBrownImage,
    description: 'Michael brings over 15 years of experience to ensure our marketing strategies stay ahead of trends.',
  },
  {
    name: 'Emily Johnson',
    role: 'CTO',
    image: emilyJohnsonImage,
    description: 'Emily oversees the technical direction of our website, ensuring cutting-edge solutions and stability.',
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
