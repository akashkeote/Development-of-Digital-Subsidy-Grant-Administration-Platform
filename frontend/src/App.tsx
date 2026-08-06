import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AnimatePresence } from 'motion/react';
import { PageTransition } from './components/PageTransition';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { SchemeListingPage } from './pages/SchemeListingPage';
import { NodalAgenciesPage } from './pages/NodalAgenciesPage';
import { GuidelinesPage } from './pages/GuidelinesPage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { GrievancePage } from './pages/GrievancePage';

// Citizen Pages
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ApplicationForm } from './pages/ApplicationForm';
import { UploadDocumentsPage } from './pages/UploadDocumentsPage';
import { ApplicationTrackingPage } from './pages/ApplicationTrackingPage';
import { InstallmentTrackingPage } from './pages/InstallmentTrackingPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';

// Officer Dashboards
import { VerificationOfficerDashboard } from './pages/VerificationOfficerDashboard';
import { DistrictOfficerDashboard } from './pages/DistrictOfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

import { ChatbotWidget } from './components/ChatbotWidget';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore React Router v6 typings don't include key on Routes but AnimatePresence needs it */}
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Registration /></PageTransition>} />
        <Route path="/schemes" element={<PageTransition><SchemeListingPage /></PageTransition>} />
        <Route path="/nodal-agencies" element={<PageTransition><NodalAgenciesPage /></PageTransition>} />
        <Route path="/guidelines" element={<PageTransition><GuidelinesPage /></PageTransition>} />
        <Route path="/api-docs" element={<PageTransition><ApiDocsPage /></PageTransition>} />
        <Route path="/help" element={<PageTransition><HelpCenterPage /></PageTransition>} />
        <Route path="/grievance" element={<PageTransition><GrievancePage /></PageTransition>} />

        {/* Citizen Routes */}
        <Route path="/citizen/dashboard" element={<PageTransition><CitizenDashboard /></PageTransition>} />
        <Route path="/schemes/:id/apply" element={<PageTransition><ApplicationForm /></PageTransition>} />
        <Route path="/schemes/:id/upload" element={<PageTransition><UploadDocumentsPage /></PageTransition>} />
        <Route path="/citizen/tracking" element={<PageTransition><ApplicationTrackingPage /></PageTransition>} />
        <Route path="/citizen/installments" element={<PageTransition><InstallmentTrackingPage /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
        <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />

        {/* Officer & Staff Routes */}
        <Route path="/verification/dashboard" element={<PageTransition><VerificationOfficerDashboard /></PageTransition>} />
        <Route path="/district/dashboard" element={<PageTransition><DistrictOfficerDashboard /></PageTransition>} />
        <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

import { ErrorBoundary } from './ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <AnimatedRoutes />
          <ChatbotWidget />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
