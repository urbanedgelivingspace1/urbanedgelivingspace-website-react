import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const PropertyModule = () => {
  const initialState = {
    name: '',
    location: '',
    bhk: '',
    carpet_area: '',
    possession: '', // Expected as YYYY-MM-DD
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

  // State for adding new properties.
  const [propertyData, setPropertyData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);

  // State for listing properties.
  const [properties, setProperties] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // State for editing a property.
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(initialState);
  const [editingImageFile, setEditingImageFile] = useState(null);

  // Fetch properties from Supabase.
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

  // Handle changes for new property form.
  const handleChange = (e) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  // Handle changes for editing property form.
  const handleEditChange = (e) => {
    setEditingData({ ...editingData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEditImageChange = (e) => {
    setEditingImageFile(e.target.files[0]);
  };

  // Submit new property.
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
      setSuccessMsg('✅ Property uploaded successfully!');
      fetchProperties();
    } catch (err) {
      alert('Error uploading: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Delete property.
  const deleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
      alert('Error deleting property: ' + error.message);
    } else {
      setProperties(properties.filter((property) => property.id !== id));
    }
  };

  // Set the property for editing.
  const startEdit = (property) => {
    setEditingId(property.id);
    // Pre-fill editing data. Convert JSON arrays back to CSV if needed.
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

  // Cancel editing.
  const cancelEdit = () => {
    setEditingId(null);
    setEditingData(initialState);
    setEditingImageFile(null);
  };

  // Submit edit.
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
      {/* ------------------------------------------------------------
          Property Form Section (Add New)
      ------------------------------------------------------------- */}
      <section className="property-form">
        <h2>➕ Add New Property</h2>
        <form onSubmit={handleSubmit}>
          {Object.entries(initialState).map(([key]) =>
            key === 'possession' ? (
              <div key={key} className="form-group">
                <label htmlFor="possession" style={{ textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="date"
                  id="possession"
                  name="possession"
                  value={propertyData.possession}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <div key={key} className="form-group">
                <input
                  type="text"
                  name={key}
                  value={propertyData[key]}
                  onChange={handleChange}
                  placeholder={key.replace(/_/g, ' ').toUpperCase()}
                  required={['name', 'location'].includes(key)}
                />
              </div>
            )
          )}

          <div className="form-group">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <button type="submit" disabled={uploading}>
            {uploading ? 'Saving...' : 'Upload Property'}
          </button>

          {successMsg && <p>{successMsg}</p>}
        </form>
      </section>

      {/* ------------------------------------------------------------
          Existing Properties Section (Editable)
      ------------------------------------------------------------- */}
      <section className="property-list">
        <h2>🏠 Existing Properties</h2>
        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          properties.map((property) => (
            <div key={property.id} className="property-card">
              {editingId === property.id ? (
                // Edit Form for the property.
                <form onSubmit={handleEditSubmit}>
                  {Object.entries(initialState).map(([key]) =>
                    key === 'possession' ? (
                      <div key={key} className="form-group">
                        <label htmlFor={`edit-${key}`} style={{ textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                          {key.replace(/_/g, ' ')}
                        </label>
                        <input
                          type="date"
                          id={`edit-${key}`}
                          name={key}
                          value={editingData.possession || ''}
                          onChange={handleEditChange}
                          required
                        />
                      </div>
                    ) : (
                      <div key={key} className="form-group">
                        <input
                          type="text"
                          name={key}
                          value={editingData[key] || ''}
                          onChange={handleEditChange}
                          placeholder={key.replace(/_/g, ' ').toUpperCase()}
                          required={['name', 'location'].includes(key)}
                        />
                      </div>
                    )
                  )}
                  <div className="form-group">
                    <label style={{ textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>IMAGE</label>
                    <input type="file" accept="image/*" onChange={handleEditImageChange} />
                  </div>
                  <div className="property-actions">
                    <button type="submit" disabled={uploading} className="btn btn-save">
                      {uploading ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={cancelEdit} className="btn btn-cancel">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Read-only display with Edit and Delete options.
                <>
                  <h3>{property.name}</h3>
                  <p>{property.location}</p>
                  <p>
                    <strong>BHK:</strong> {property.bhk}
                  </p>
                  <p>
                    <strong>Carpet Area:</strong> {property.carpet_area}
                  </p>
                  <p>
                    <strong>Possession:</strong> {property.possession}
                  </p>
                  {property.image_url && (
                    <img src={property.image_url} alt={property.name} className="property-image" />
                  )}
                  <div className="property-actions">
                    <button onClick={() => startEdit(property)} className="btn btn-edit">
                      Edit
                    </button>
                    <button onClick={() => deleteProperty(property.id)} className="btn btn-delete">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default PropertyModule;
