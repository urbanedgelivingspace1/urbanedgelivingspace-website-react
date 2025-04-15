import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const LeadsModule = () => {
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    console.log("Fetched leads:", data, "Error:", error); // 🐞 Debug log

    if (error) {
      console.error('Error fetching leads:', error.message);
    } else {
      setLeads(data);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const deleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const { error } = await supabase.from('form_submissions').delete().eq('id', id);
      if (error) {
        console.error('Error deleting lead:', error.message);
      } else {
        fetchLeads();
      }
    }
  };

  return (
    <div style={styles.module}>
      <h2>📩 Leads</h2>
      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <div style={styles.list}>
          {leads.map((lead) => (
            <div key={lead.id} style={styles.card}>
              <h4>{lead.name}</h4>
              <p><strong>Email:</strong> {lead.email}</p>
              <p><strong>Phone:</strong> {lead.phone}</p>
              <p><strong>Subject:</strong> {lead.subject}</p>
              <p><strong>Message:</strong> {lead.message}</p>
              <p style={styles.time}>
                <strong>Submitted at:</strong> {new Date(lead.created_at).toLocaleString()}
              </p>
              <button style={styles.deleteBtn} onClick={() => deleteLead(lead.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  module: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  card: {
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  time: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '1rem',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s ease',
  },
  deleteBtnHover: {
    backgroundColor: '#c82333',
  },
  deleteBtnActive: {
    backgroundColor: '#bd2130',
  },
};

export default LeadsModule;
