// src/App.jsx
import React from "react";

import "./styles/tokens.css";
import "./styles/typography.css";
import "./styles/global.css";
import "./App.css";

import { HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import Properties from "./pages/Properties";
import ContactUs from "./pages/ContactUs";
import Blog from "./pages/Blog";
import AdminUpload from "./pages/AdminUpload";
import AdminDashboardPage from "./components/admin/AdminDashboardPage";
import AdminLogin from "./pages/public/AdminLogin";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/SignUp";
import ResetPassword from "./pages/public/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import UserProtectedRoute from "./components/layout/UserProtectedRoute";
import PropertyModule from "./components/admin/PropertyModule";
import BlogModule from "./components/admin/BlogModule";
import LeadsModule from "./components/admin/LeadsModule";
import TestimonialsModule from "./components/admin/TestimonialsModule";
import SettingsModule from "./components/admin/SettingsModule";
import AdminUsers from "./components/AdminUsers";
import AdminRegister from "./pages/AdminRegister";
import BlogDetail from "./pages/BlogDetail";
import OurTeam from "./pages/OurTeam";
import PropertyDetailPage from "./pages/public/PropertyDetailPage";
import GuaranteedRentPage from "./pages/public/GuaranteedRentPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import PropertyMobileConversionBar from "./components/property/PropertyMobileConversionBar";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NavigationBar />

        <main className="app-main transition">
          <ScrollToTop />
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/admin-secret-upload" element={<AdminUpload />} />
              <Route path="/mppateL123" element={<Navigate to="/login" replace />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<UserProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="properties" element={<PropertyModule />} />
                  <Route path="blog" element={<BlogModule />} />
                  <Route path="leads" element={<LeadsModule />} />
                  <Route path="testimonials" element={<TestimonialsModule />} />
                  <Route path="settings" element={<SettingsModule />} />
                  <Route path="admins" element={<AdminUsers />} />
                </Route>
              </Route>
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/admin-register" element={<AdminRegister />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/our-team" element={<OurTeam />} />
              <Route path="/guaranteed-rent" element={<GuaranteedRentPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
          <PropertyMobileConversionBar />
        </main>

        <Footer />
      </Router>
    </HelmetProvider>
  );
}

export default App;
