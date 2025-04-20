// src/components/PropertyModule.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FaMapMarkerAlt, FaBed, FaRuler } from 'react-icons/fa';
import './PropertyModule.css';

const PropertyModule = () => {
  const initialState = {
    name: '',
    location: '',
    bhk: '',
    carpet_area: '',
    possession: '',
    no_of_units: '',
    rera_no: '',
    developed_by: '',
    property_type: '',
    project_area: '',
    ownership: '',
    towers_floor: '',
    property_view: '',
    parking: '',
    about_property: '',
    key_features: '',
    amenities: '',
    floor_space_pricing: '',
    google_map_location: '',
    explore_neighbourhood: '',
    about_builder_company: '',
    about_location: '',
    google_drive_url: '',
    image_url: ''
  };

  const LOCAL_STORAGE_KEY = 'draft_property_form';

  const [propertyData, setPropertyData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(initialState);
  const [editingImageFile, setEditingImageFile] = useState(null);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('id', { ascending: false });
    if (error) {
      console.error('Error fetching properties:', error);
    } else {
      setProperties(data);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin-auth') === 'true';
    if (!isLoggedIn) {
      window.location.href = '/admin-login';
    } else {
      fetchProperties();
    }

    const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDraft) {
      try {
        setPropertyData(JSON.parse(savedDraft));
      } catch (err) {
        console.warn('Failed to parse saved draft:', err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const updatedData = { ...propertyData, [e.target.name]: e.target.value };
    setPropertyData(updatedData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  };

  const handleEditChange = (e) => {
    setEditingData({ ...editingData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEditImageChange = (e) => {
    setEditingImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setSuccessMsg('');
    try {
      let image_url = '';

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(path, imageFile);
        if (uploadError) throw uploadError;

        const { data: publicURLData } = supabase.storage
          .from('property-images')
          .getPublicUrl(path);
        image_url = publicURLData.publicUrl;
      }

      const payload = {
        ...propertyData,
        image_url,
        amenities: JSON.stringify(
          propertyData.amenities.split(',').map((a) => a.trim())
        ),
        floor_space_pricing: JSON.stringify(
          propertyData.floor_space_pricing.split(',').map((a) => a.trim())
        )
      };

      const { error } = await supabase.from('properties').insert([payload]);
      if (error) throw error;

      setPropertyData(initialState);
      setImageFile(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSuccessMsg('✅ Property uploaded successfully!');
      fetchProperties();
    } catch (err) {
      alert('Error uploading: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
      alert('Error deleting property: ' + error.message);
    } else {
      setProperties(properties.filter((property) => property.id !== id));
    }
  };

  const startEdit = (property) => {
    setEditingId(property.id);
    setEditingData({
      ...property,
      amenities: Array.isArray(property.amenities)
        ? property.amenities.join(', ')
        : property.amenities,
      floor_space_pricing: Array.isArray(property.floor_space_pricing)
        ? property.floor_space_pricing.join(', ')
        : property.floor_space_pricing,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData(initialState);
    setEditingImageFile(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let image_url = editingData.image_url || '';

      if (editingImageFile) {
        const ext = editingImageFile.name.split('.').pop();
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(path, editingImageFile);
        if (uploadError) throw uploadError;

        const { data: publicURLData } = supabase.storage
          .from('property-images')
          .getPublicUrl(path);
        image_url = publicURLData.publicUrl;
      }

      const payload = {
        ...editingData,
        image_url,
        amenities: JSON.stringify(
          editingData.amenities.split(',').map((a) => a.trim())
        ),
        floor_space_pricing: JSON.stringify(
          editingData.floor_space_pricing.split(',').map((a) => a.trim())
        )
      };

      const { error } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', editingId);
      if (error) throw error;

      setEditingId(null);
      setEditingData(initialState);
      setEditingImageFile(null);
      fetchProperties();
    } catch (err) {
      alert('Error updating property: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="property-module">
      {/* Add Property Form */}
      <section className="property-form">
        <h2>➕ Add New Property</h2>
        <form onSubmit={handleSubmit}>
        {Object.entries(initialState).map(([key]) => {
          if (key === 'image_url') return null; // Skip the image_url field for text inputs
          return (
            <div key={key} className="form-group">
              <label htmlFor={key}>
                {key.replace(/_/g, ' ').toUpperCase()}
              </label>
              <input
                type={key === 'possession' ? 'date' : 'text'}
                id={key}
                name={key}
                value={propertyData[key] || ''} // Ensure the value is always a string
                onChange={handleChange}
                required={['name', 'location'].includes(key)}
              />
            </div>
          );
        })}
          <div className="form-group">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <button type="submit" disabled={uploading}>
            {uploading ? 'Saving...' : 'Upload Property'}
          </button>

          {successMsg && <p>{successMsg}</p>}
        </form>
      </section>

      {/* Property List */}
      <section className="property-list">
        <h2>🏠 Existing Properties</h2>
        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          properties.map((property) => (
            <div key={property.id} className="property-card">
              {property.image_url && (
                <img
                  src={property.image_url}
                  alt={property.name}
                  className="property-image"
                />
              )}
              <div className="property-details">
                <h3>{property.name}</h3>
                <p className="property-location">
                  <FaMapMarkerAlt className="icon" /> {property.location}
                </p>
                <p className="property-bhk">
                  <FaBed className="icon" /> {property.bhk} BHK
                </p>
                <p className="property-sq">
                  <FaRuler className="icon" /> {property.carpet_area} Sq Ft
                </p>
              </div>
              <div className="property-actions">
                <button onClick={() => startEdit(property)} className="btn btn-edit">
                  Edit
                </button>
                <button onClick={() => deleteProperty(property.id)} className="btn btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Edit Modal */}
      {editingId !== null && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Edit Property</h2>
            <form onSubmit={handleEditSubmit}>
            {Object.entries(initialState).map(([key]) => {
            if (key === 'image_url') return null; // Skip the image_url field for text inputs
            return (
              <div key={key} className="form-group">
                <label htmlFor={`edit-${key}`}>
                  {key.replace(/_/g, ' ').toUpperCase()}
                </label>
                <input
                  type={key === 'possession' ? 'date' : 'text'}
                  id={`edit-${key}`}
                  name={key}
                  value={editingData[key] || ''} // Ensure the value is always a string
                  onChange={handleEditChange}
                  required={['name', 'location'].includes(key)}
                />
              </div>
            );
          })}
              <div className="form-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleEditImageChange} />
              </div>

              <div className="modal-actions">
                <button type="submit" disabled={uploading} className="btn btn-save">
                  {uploading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={cancelEdit} className="btn btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyModule;
