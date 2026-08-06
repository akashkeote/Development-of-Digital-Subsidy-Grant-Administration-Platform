import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
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

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: ('citizen' | 'verifier' | 'district_officer' | 'admin')[] }) => {
  const { currentRole } = useApp();
  
  // Admin has universal access
  if (currentRole === 'admin') {
    return <>{children}</>;
  }
  
  if (!allowedRoles.includes(currentRole)) {
    // Redirect unauthorized users to their respective dashboards
    if (currentRole === 'citizen') return <Navigate to="/citizen/dashboard" replace />;
    if (currentRole === 'verifier') return <Navigate to="/verification/dashboard" replace />;
    if (currentRole === 'district_officer') return <Navigate to="/district/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

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
        <Route path="/citizen/dashboard" element={<ProtectedRoute allowedRoles={['citizen']}><PageTransition><CitizenDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/schemes/:id/apply" element={<ProtectedRoute allowedRoles={['citizen']}><PageTransition><ApplicationForm /></PageTransition></ProtectedRoute>} />
        <Route path="/schemes/:id/upload" element={<ProtectedRoute allowedRoles={['citizen']}><PageTransition><UploadDocumentsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/citizen/tracking" element={<ProtectedRoute allowedRoles={['citizen']}><PageTransition><ApplicationTrackingPage /></PageTransition></ProtectedRoute>} />
        <Route path="/citizen/installments" element={<ProtectedRoute allowedRoles={['citizen']}><PageTransition><InstallmentTrackingPage /></PageTransition></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['citizen', 'verifier', 'district_officer', 'admin']}><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute allowedRoles={['citizen', 'verifier', 'district_officer', 'admin']}><PageTransition><NotificationsPage /></PageTransition></ProtectedRoute>} />

        {/* Officer & Staff Routes */}
        <Route path="/verification/dashboard" element={<ProtectedRoute allowedRoles={['verifier']}><PageTransition><VerificationOfficerDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/district/dashboard" element={<ProtectedRoute allowedRoles={['district_officer']}><PageTransition><DistrictOfficerDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />

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
