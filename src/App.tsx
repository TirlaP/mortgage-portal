import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Auth pages
import Login from './pages/auth/Login';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// SOPs pages
import SOPs from './pages/sops/SOPs';
import SOPDetail from './pages/sops/SOPDetail';
import SOPEdit from './pages/sops/SOPEdit';

// Scripts pages
import Scripts from './pages/scripts/Scripts';
import ScriptDetail from './pages/scripts/ScriptDetail';
import ScriptEdit from './pages/scripts/ScriptEdit';

// Forms pages
import Forms from './pages/forms/Forms';
import FormDetail from './pages/forms/FormDetail';
import FormEdit from './pages/forms/FormEdit';

// Tools pages
import Tools from './pages/tools/Tools';
import MortgageCalculator from './pages/tools/MortgageCalculator';
import RateComparisonTool from './pages/tools/RateComparisonTool';
import DocumentFinder from './pages/tools/DocumentFinder';
import ClosingCostEstimator from './pages/tools/ClosingCostEstimator';
import PropertyLookupTool from './pages/tools/PropertyLookupTool';
import SchedulingAssistant from './pages/tools/SchedulingAssistant';
import LoanProgramFinder from './pages/tools/LoanProgramFinder';
import DataExportTool from './pages/tools/DataExportTool';

// Settings
import Settings from './pages/settings/Settings';

// Auth context
import { AuthProvider, useAuth, UserRole } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';

// Content protection
import { applyContentProtection } from './utils/contentProtection';

// UI Components
import { Toaster } from './components/ui/toaster';

const App: React.FC = () => {
  useEffect(() => {
    // Apply content protection when app loads
    applyContentProtection('medium');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes with MainLayout */}
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </RequireAuth>
            } 
          />
          
          {/* SOPs routes */}
          <Route 
            path="/sops" 
            element={
              <RequireAuth>
                <MainLayout>
                  <SOPs />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/sops/:id" 
            element={
              <RequireAuth>
                <MainLayout>
                  <SOPDetail />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/sops/edit/:id" 
            element={
              <RequireAuth allowedRoles={[UserRole.ADMIN]}>
                <MainLayout>
                  <SOPEdit />
                </MainLayout>
              </RequireAuth>
            } 
          />
          
          {/* Scripts routes */}
          <Route 
            path="/scripts" 
            element={
              <RequireAuth>
                <MainLayout>
                  <Scripts />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/scripts/:id" 
            element={
              <RequireAuth>
                <MainLayout>
                  <ScriptDetail />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/scripts/edit/:id" 
            element={
              <RequireAuth allowedRoles={[UserRole.ADMIN]}>
                <MainLayout>
                  <ScriptEdit />
                </MainLayout>
              </RequireAuth>
            } 
          />
          
          {/* Forms routes */}
          <Route 
            path="/forms" 
            element={
              <RequireAuth>
                <MainLayout>
                  <Forms />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/forms/:id" 
            element={
              <RequireAuth>
                <MainLayout>
                  <FormDetail />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/forms/edit/:id" 
            element={
              <RequireAuth allowedRoles={[UserRole.ADMIN]}>
                <MainLayout>
                  <FormEdit />
                </MainLayout>
              </RequireAuth>
            } 
          />
          
          {/* Tools routes */}
          <Route 
            path="/tools" 
            element={
              <RequireAuth>
                <MainLayout>
                  <Tools />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/tools/calculator" 
            element={
              <RequireAuth>
                <MainLayout>
                  <MortgageCalculator />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/tools/rates" 
            element={
              <RequireAuth>
                <MainLayout>
                  <RateComparisonTool />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/tools/docs" 
            element={
              <RequireAuth>
                <MainLayout>
                  <DocumentFinder />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/tools/closing-costs" 
            element={
              <RequireAuth>
                <MainLayout>
                  <ClosingCostEstimator />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/tools/property" 
            element={
              <RequireAuth>
                <MainLayout>
                  <PropertyLookupTool />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/tools/schedule" 
            element={
              <RequireAuth>
                <MainLayout>
                  <SchedulingAssistant />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/tools/programs" 
            element={
              <RequireAuth>
                <MainLayout>
                  <LoanProgramFinder />
                </MainLayout>
              </RequireAuth>
            } 
          />
          <Route 
            path="/tools/export" 
            element={
              <RequireAuth allowedRoles={[UserRole.ADMIN]}>
                <MainLayout>
                  <DataExportTool />
                </MainLayout>
              </RequireAuth>
            } 
          />
          
          {/* Settings route */}
          <Route 
            path="/settings" 
            element={
              <RequireAuth>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </RequireAuth>
            } 
          />
          
          {/* Redirect root to dashboard if logged in, otherwise to login */}
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" />} 
          />
          
          {/* Catch all - redirect to dashboard */}
          <Route 
            path="*" 
            element={<Navigate to="/dashboard" />} 
          />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;