// components/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');

  const fetchAdmins = async () => {
    const { data, error } = await supabase.from('admins').select('id, username');
    if (!error) setAdmins(data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash(newAdmin.password, 10);

    const { error } = await supabase.from('admins').insert([
      { username: newAdmin.username, password_hash: hash }
    ]);

    if (error) {
      setMsg('Error adding admin');
    } else {
      setMsg('Admin added!');
      setNewAdmin({ username: '', password: '' });
      fetchAdmins();
    }
  };

  const deleteAdmin = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    const { error } = await supabase.from('admins').delete().eq('id', id);
    if (!error) fetchAdmins();
  };

  return (
    <div>
      <h2>👥 Admin Users</h2>
      <form onSubmit={handleAddAdmin}>
        <input
          type="text"
          placeholder="Username"
          value={newAdmin.username}
          onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={newAdmin.password}
          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          required
        /><br />
        <button type="submit">Add Admin</button>
        {msg && <p>{msg}</p>}
      </form>

      <ul style={{ marginTop: '1.5rem' }}>
        {admins.map((admin) => (
          <li key={admin.id} style={{ marginBottom: '0.5rem' }}>
            {admin.username}
            <button onClick={() => deleteAdmin(admin.id)} style={{ marginLeft: '1rem', background: 'red', color: 'white' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
