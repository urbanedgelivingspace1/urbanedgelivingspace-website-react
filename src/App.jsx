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
import AdminUpload from './pages/AdminUpload'; // Admin Upload component
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin'; // Admin Login component
import PropertyDetail from './components/PropertyDetail'; // Property Detail component
import './index.css'; // Global styles
import AdminRegister from './pages/AdminRegister';
import './App.css'; // App-specific styles

// Main application component with semantic layout for accessibility
function App() {
  return (
    <Router>
      {/* NavigationBar should internally use semantic <nav> tags */}
      <NavigationBar />

      {/* Main content wrapped in a semantic <main> tag with added transition effects */}
      <main className="app-main transition">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin-secret-upload" element={<AdminUpload />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer ideally uses a semantic <footer> element internally */}
      <Footer />
    </Router>
  );
}

export default App;
