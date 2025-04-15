import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const TestimonialsModule = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', feedback: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [editingImageFile, setEditingImageFile] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setTestimonials(data);
  };

  const handleAddChange = (e) => {
    setNewTestimonial({ ...newTestimonial, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem('admin-auth') === 'true';
    if (!isLoggedIn) return alert('Please log in to add a testimonial.');

    try {
      let image_url = '';
      if (imageFile) {
        const path = `testimonial_${Date.now()}.${imageFile.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('property-images').upload(path, imageFile);
        if (error) throw error;
        const { data } = supabase.storage.from('property-images').getPublicUrl(path);
        image_url = data.publicUrl;
      }

      const { error: insertError } = await supabase.from('testimonials').insert([
        { ...newTestimonial, image_url }
      ]);
      if (insertError) throw insertError;

      setNewTestimonial({ name: '', role: '', feedback: '' });
      setImageFile(null);
      fetchTestimonials();
    } catch (err) {
      alert('Failed to upload testimonial: ' + err.message);
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditingData({ name: t.name, role: t.role, feedback: t.feedback });
  };

  const handleEditChange = (e) => {
    setEditingData({ ...editingData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem('admin-auth') === 'true';
    if (!isLoggedIn) return alert('Please log in to edit a testimonial.');

    try {
      let updatedData = { ...editingData };
      if (editingImageFile) {
        const path = `testimonial_${Date.now()}.${editingImageFile.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('property-images').upload(path, editingImageFile);
        if (error) throw error;
        const { data } = supabase.storage.from('property-images').getPublicUrl(path);
        updatedData.image_url = data.publicUrl;
      }

      await supabase.from('testimonials').update(updatedData).eq('id', id);
      setEditingId(null);
      setEditingImageFile(null);
      fetchTestimonials();
    } catch (err) {
      alert('Failed to update testimonial: ' + err.message);
    }
  };

  const deleteTestimonial = async (id) => {
    const isLoggedIn = localStorage.getItem('admin-auth') === 'true';
    if (!isLoggedIn) return alert('Please log in to delete a testimonial.');

    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      await supabase.from('testimonials').delete().eq('id', id);
      fetchTestimonials();
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#2c3e50' }}>🌟 Testimonials</h2>

      <form onSubmit={handleUpload} style={formStyle}>
        <input type="text" name="name" placeholder="Name" value={newTestimonial.name} onChange={handleAddChange} required style={inputStyle} />
        <input type="text" name="role" placeholder="Role/Title" value={newTestimonial.role} onChange={handleAddChange} required style={inputStyle} />
        <textarea name="feedback" placeholder="Feedback" value={newTestimonial.feedback} onChange={handleAddChange} required style={textareaStyle} />
        <input type="file" onChange={handleImageChange} />
        <button type="submit" style={buttonStyle}>Add Testimonial</button>
      </form>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {testimonials.map((t) => (
          <div key={t.id} style={cardStyle}>
            {editingId === t.id ? (
              <form onSubmit={(e) => handleEditSubmit(e, t.id)} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input type="text" name="name" value={editingData.name} onChange={handleEditChange} required style={inputStyle} />
                <input type="text" name="role" value={editingData.role} onChange={handleEditChange} required style={inputStyle} />
                <textarea name="feedback" value={editingData.feedback} onChange={handleEditChange} required style={textareaStyle} />
                <input type="file" onChange={(e) => setEditingImageFile(e.target.files[0])} />
                <div>
                  <button type="submit" style={buttonStyle}>Save</button>
                  <button type="button" onClick={() => setEditingId(null)} style={cancelButtonStyle}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {t.image_url && <img src={t.image_url} alt={t.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />}
                  <div>
                    <h4 style={{ margin: 0 }}>{t.name}</h4>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#777' }}>{t.role}</p>
                  </div>
                </div>
                <p style={{ marginTop: '0.75rem' }}>{t.feedback}</p>
                <div>
                  <button onClick={() => startEdit(t)} style={buttonStyle}>Edit</button>
                  <button onClick={() => deleteTestimonial(t.id)} style={cancelButtonStyle}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- Styles ----------
const inputStyle = {
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '80px',
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  background: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const cancelButtonStyle = {
  ...buttonStyle,
  background: '#e74c3c',
  marginLeft: '0.5rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginBottom: '2rem',
  maxWidth: '500px',
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '1rem',
  background: '#fafafa',
};

export default TestimonialsModule;
