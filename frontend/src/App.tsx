import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
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
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AccessibilityPage } from './pages/AccessibilityPage';

// Citizen Pages
import { CitizenDashboard } from './pages/CitizenDashboard';
import { VleDashboard } from './pages/VleDashboard';
import { ApplicationForm } from './pages/ApplicationForm';
import { UploadDocumentsPage } from './pages/UploadDocumentsPage';
import { ApplicationTrackingPage } from './pages/ApplicationTrackingPage';
import { InstallmentTrackingPage } from './pages/InstallmentTrackingPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';

// Officer & Staff Routes
import { L1VerificationDashboard } from './pages/L1VerificationDashboard';
import { L1History } from './pages/L1History';
import { L2SanctionDashboard } from './pages/L2SanctionDashboard';
import { L2Reports } from './pages/L2Reports';
import { L3FinanceDashboard } from './pages/L3FinanceDashboard';
import { L3Logs } from './pages/L3Logs';
import { AdminDashboard } from './pages/AdminDashboard';
import { VleLedger } from './pages/VleLedger';

import { ChatbotWidget } from './components/ChatbotWidget';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: UserRole[] }) => {
  const { currentRole } = useApp();
  
  if (!allowedRoles.includes(currentRole)) {
    // Redirect unauthorized users to their respective strictly segregated dashboards
    if (currentRole === 'citizen') return <Navigate to="/citizen/dashboard" replace />;
    if (currentRole === 'vle') return <Navigate to="/vle/dashboard" replace />;
    if (currentRole === 'l1_officer') return <Navigate to="/l1-verification/dashboard" replace />;
    if (currentRole === 'l2_officer') return <Navigate to="/l2-sanction/dashboard" replace />;
    if (currentRole === 'l3_officer') return <Navigate to="/l3-finance/dashboard" replace />;
    if (currentRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <ScrollToTop />
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
        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
        <Route path="/accessibility" element={<PageTransition><AccessibilityPage /></PageTransition>} />

        {/* Citizen Routes */}
        <Route path="/citizen/dashboard" element={<ProtectedRoute allowedRoles={['citizen']}><PageTransition><CitizenDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/schemes/:id/apply" element={<ProtectedRoute allowedRoles={['citizen', 'vle']}><PageTransition><ApplicationForm /></PageTransition></ProtectedRoute>} />
        <Route path="/schemes/:id/upload" element={<ProtectedRoute allowedRoles={['citizen', 'vle']}><PageTransition><UploadDocumentsPage /></PageTransition></ProtectedRoute>} />
        <Route path="/citizen/tracking" element={<ProtectedRoute allowedRoles={['citizen', 'vle']}><PageTransition><ApplicationTrackingPage /></PageTransition></ProtectedRoute>} />
        <Route path="/citizen/installments" element={<ProtectedRoute allowedRoles={['citizen']}><PageTransition><InstallmentTrackingPage /></PageTransition></ProtectedRoute>} />
        
        {/* VLE Routes */}
        <Route path="/vle/dashboard" element={<ProtectedRoute allowedRoles={['vle']}><PageTransition><VleDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/vle/ledger" element={<ProtectedRoute allowedRoles={['vle']}><PageTransition><VleLedger /></PageTransition></ProtectedRoute>} />

        {/* Shared Authenticated Routes */}
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['citizen', 'vle']}><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute allowedRoles={['citizen', 'vle', 'l1_officer', 'l2_officer', 'l3_officer', 'admin']}><PageTransition><NotificationsPage /></PageTransition></ProtectedRoute>} />

        {/* Strictly Segregated Officer & Admin Routes */}
        <Route path="/l1-verification/dashboard" element={<ProtectedRoute allowedRoles={['l1_officer']}><PageTransition><L1VerificationDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/l1-verification/history" element={<ProtectedRoute allowedRoles={['l1_officer']}><PageTransition><L1History /></PageTransition></ProtectedRoute>} />
        <Route path="/l2-sanction/dashboard" element={<ProtectedRoute allowedRoles={['l2_officer']}><PageTransition><L2SanctionDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/l2-sanction/reports" element={<ProtectedRoute allowedRoles={['l2_officer']}><PageTransition><L2Reports /></PageTransition></ProtectedRoute>} />
        <Route path="/l3-finance/dashboard" element={<ProtectedRoute allowedRoles={['l3_officer']}><PageTransition><L3FinanceDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/l3-finance/logs" element={<ProtectedRoute allowedRoles={['l3_officer']}><PageTransition><L3Logs /></PageTransition></ProtectedRoute>} />
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

