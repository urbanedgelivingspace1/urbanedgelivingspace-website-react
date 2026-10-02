// src/App.jsx
import React, { lazy, Suspense } from "react";

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
import ProtectedRoute from "./components/layout/ProtectedRoute";
import UserProtectedRoute from "./components/layout/UserProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import PropertyMobileConversionBar from "./components/property/PropertyMobileConversionBar";

const AboutUs = lazy(() => import("./pages/AboutUsModern"));
const Properties = lazy(() => import("./pages/Properties"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const OurTeam = lazy(() => import("./pages/OurTeam"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/public/Login"));
const SignUp = lazy(() => import("./pages/public/SignUp"));
const ResetPassword = lazy(() => import("./pages/public/ResetPassword"));
const AdminLogin = lazy(() => import("./pages/public/AdminLogin"));
const PropertyDetailPage = lazy(() => import("./pages/public/PropertyDetailPage"));
const GuaranteedRentPage = lazy(() => import("./pages/public/GuaranteedRentPage"));
const NotFoundPage = lazy(() => import("./pages/public/NotFoundPage"));
const ServicesPage = lazy(() => import("./pages/public/ServicesPage"));
const PrivacyPage = lazy(() => import("./pages/public/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/public/TermsPage"));

const AdminUpload = lazy(() => import("./pages/AdminUpload"));
const AdminRegister = lazy(() => import("./pages/AdminRegister"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const AdminDashboardPage = lazy(() => import("./components/admin/AdminDashboardPage"));
const PropertyModule = lazy(() => import("./components/admin/PropertyModule"));
const BlogModule = lazy(() => import("./components/admin/BlogModule"));
const LeadsModule = lazy(() => import("./components/admin/LeadsModule"));
const TestimonialsModule = lazy(() => import("./components/admin/TestimonialsModule"));
const SettingsModule = lazy(() => import("./components/admin/SettingsModule"));
const AdminUsers = lazy(() => import("./components/AdminUsers"));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NavigationBar />

        <main className="app-main transition">
          <ScrollToTop />
          <ErrorBoundary>
            <Suspense fallback={<div className="route-loading" role="status">Loading…</div>}>
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
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <PropertyMobileConversionBar />
        </main>

        <Footer />
      </Router>
    </HelmetProvider>
  );
}

export default App;
