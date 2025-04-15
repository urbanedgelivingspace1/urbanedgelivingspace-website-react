// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Properties from './pages/Properties';
import ContactUs from './pages/ContactUs';
import Blog from './pages/Blog';
import AdminUpload from './pages/AdminUpload'; // Import the AdminUpload component
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin'; // Import the AdminLogin component
import PropertyDetail from './components/PropertyDetail'; // Import the PropertyDetail component
import './App.css'; // Import global styles

// Main application component with routing
function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin-secret-upload" element={<AdminUpload />} /> {/* Redirect to HomePage for any unknown routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} /> {/* Redirect to HomePage for any unknown routes */}
        <Route path="/properties/:id" element={<PropertyDetail />} /> {/* Route for property details */}
        <Route path="*" element={<HomePage />} /> {/* Redirect to HomePage for any unknown routes */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
