import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const PropertyManager = () => {
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
    about_location: ''
  };

  const [propertyData, setPropertyData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
  }, []);

  const handleChange = (e) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
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
        ),
      };

      const { error } = await supabase.from('properties').insert([payload]);
      if (error) throw error;

      setPropertyData(initialState);
      setImageFile(null);
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

  return (
    <div className="property-module">
      {/* ------------------------------------------------------------
          Property Form Section
      ------------------------------------------------------------- */}
      <section className="property-form">
        <h2>➕ Add New Property</h2>
        <form onSubmit={handleSubmit}>
          {Object.entries(initialState).map(([key]) => (
            <input
              key={key}
              type="text"
              name={key}
              value={propertyData[key]}
              onChange={handleChange}
              placeholder={key.replace(/_/g, ' ').toUpperCase()}
              required={['name', 'location'].includes(key)}
            />
          ))}

          <input type="file" accept="image/*" onChange={handleImageChange} />

          <button type="submit" disabled={uploading}>
            {uploading ? 'Saving...' : 'Upload Property'}
          </button>

          {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
        </form>
      </section>

      {/* ------------------------------------------------------------
          Existing Properties Section
      ------------------------------------------------------------- */}
      <section className="property-list">
        <h2 style={{ gridColumn: '1 / -1' }}>🏠 Existing Properties</h2>
        {properties.length === 0 ? (
          <p style={{ gridColumn: '1 / -1' }}>No properties found.</p>
        ) : (
          properties.map((property) => (
            <div key={property.id} className="property-card">
              <h3>{property.name}</h3>
              <p>{property.location}</p>
              <p><strong>BHK:</strong> {property.bhk}</p>
              <p><strong>Carpet Area:</strong> {property.carpet_area}</p>
              <p><strong>Possession:</strong> {property.possession}</p>
              {property.image_url && (
                <img
                  src={property.image_url}
                  alt={property.name}
                  className="property-image"
                />
              )}
              <div className="property-actions">
                <button onClick={() => deleteProperty(property.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default PropertyManager;
