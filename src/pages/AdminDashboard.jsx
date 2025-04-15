// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import TestimonialsModule from '../components/TestimonialsModule';
import BlogPostsModule from '../components/BlogPostsModule';
import PropertyModule from '../components/PropertyModule';
import LeadsModule from '../components/LeadsModule';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState('testimonials');

  // On mount, verify that the admin is authenticated.
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin-auth') === 'true';
    if (!isLoggedIn) {
      window.location.href = '/admin-login';
    }
  }, []);

  // Clears admin authentication and redirects to login.
  const logout = () => {
    localStorage.removeItem('admin-auth');
    window.location.href = '/admin-login';
  };

  // Render the active module based on current tab selection.
  const renderCurrentModule = () => {
    switch (currentTab) {
      case 'testimonials':
        return <TestimonialsModule />;
      case 'blogs':
        return <BlogPostsModule />;
      case 'properties':
        return <PropertyModule />;
      case 'leads':
        return <LeadsModule />;
      default:
        return <TestimonialsModule />;
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard 🛠️</h1>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </header>

      <nav className="dashboard-nav">
        <button
          onClick={() => setCurrentTab('testimonials')}
          className={tabButtonClass(currentTab, 'testimonials')}
        >
          Testimonials
        </button>
        <button
          onClick={() => setCurrentTab('blogs')}
          className={tabButtonClass(currentTab, 'blogs')}
        >
          Blogs
        </button>
        <button
          onClick={() => setCurrentTab('properties')}
          className={tabButtonClass(currentTab, 'properties')}
        >
          Properties
        </button>
        <button
          onClick={() => setCurrentTab('leads')}
          className={tabButtonClass(currentTab, 'leads')}
        >
          Leads
        </button>
      </nav>

      <main className="dashboard-main">{renderCurrentModule()}</main>
    </div>
  );
};

// Helper function to conditionally apply the active class.
const tabButtonClass = (currentTab, tabName) =>
  currentTab === tabName ? 'tab-button active' : 'tab-button';

export default AdminDashboard;
