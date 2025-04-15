import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import bcrypt from 'bcryptjs';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
  
    try {
      const username = formData.username.trim().toLowerCase(); // sanitize input
  
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username);
  
      console.log('Supabase response:', { data, error });
  
      if (error) {
        setErrorMsg('Something went wrong while fetching admin');
        return;
      }
  
      if (!data || data.length === 0) {
        setErrorMsg('Admin not found');
        return;
      }
  
      const admin = data[0]; // grab the first admin
      const passwordMatch = await bcrypt.compare(formData.password, admin.password_hash);
  
      if (!passwordMatch) {
        setErrorMsg('Incorrect password');
        return;
      }
  
      // Login success
      localStorage.setItem('admin-auth', 'true');
      window.location.href = '/admin-dashboard';
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Unexpected error. Try again.');
    } finally {
      setLoading(false);
    }
  };   

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '1rem' }}>🔐 Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f2f2f2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    marginTop: '1rem',
    color: 'red',
    fontWeight: '500',
  },
};

export default AdminLogin;
