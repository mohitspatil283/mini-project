import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { FacilityDetailsPage } from './pages/FacilityDetailsPage';
import { CostComparisonPage } from './pages/CostComparisonPage';
import { NearbyMapPage } from './pages/NearbyMapPage';
import { ServicesPage } from './pages/ServicesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';

// Registered User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { SavedFacilitiesPage } from './pages/user/SavedFacilitiesPage';
import { MyReportsPage } from './pages/user/MyReportsPage';
import { UserProfilePage } from './pages/user/UserProfilePage';

// Representative Pages
import { RepDashboard } from './pages/rep/RepDashboard';
import { RepFacilityPage } from './pages/rep/RepFacilityPage';
import { RepCostsPage } from './pages/rep/RepCostsPage';
import { RepRevisionsPage } from './pages/rep/RepRevisionsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminFacilitiesPage } from './pages/admin/AdminFacilitiesPage';
import { AdminVerificationPage } from './pages/admin/AdminVerificationPage';
import { AdminCostsPage } from './pages/admin/AdminCostsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

export const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <Header />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/facility/:id" element={<FacilityDetailsPage />} />
          <Route path="/compare" element={<CostComparisonPage />} />
          <Route path="/map" element={<NearbyMapPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Registered User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'FACILITY_REPRESENTATIVE']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/saved"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'FACILITY_REPRESENTATIVE']}>
                <SavedFacilitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/reports"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'FACILITY_REPRESENTATIVE']}>
                <MyReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Facility Representative Routes */}
          <Route
            path="/rep/dashboard"
            element={
              <ProtectedRoute allowedRoles={['FACILITY_REPRESENTATIVE', 'ADMIN']}>
                <RepDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rep/facility"
            element={
              <ProtectedRoute allowedRoles={['FACILITY_REPRESENTATIVE', 'ADMIN']}>
                <RepFacilityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rep/costs"
            element={
              <ProtectedRoute allowedRoles={['FACILITY_REPRESENTATIVE', 'ADMIN']}>
                <RepCostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rep/revisions"
            element={
              <ProtectedRoute allowedRoles={['FACILITY_REPRESENTATIVE', 'ADMIN']}>
                <RepRevisionsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/facilities"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminFacilitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verification"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminVerificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/costs"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminCostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminAuditLogsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <CompareFloatingBar />
      <Footer />
    </div>
  );
};
export default App;
