import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CompaniesPage from './pages/CompaniesPage';
import NewRequestPage from './pages/NewRequestPage';
import QuoteRequestPage from './pages/QuoteRequestPage';
import DocumentsPage from './pages/DocumentsPage';
import CompliancePage from './pages/CompliancePage';
import MairieDashboardPage from './pages/MairieDashboardPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/layout/Layout';
import ToastContainer from './components/ui/Toast';

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/new-request" element={<NewRequestPage />} />
          <Route path="/quote-request" element={<QuoteRequestPage />} />
          <Route path="/quote-request/step/:stepNumber" element={<QuoteRequestPage />} />
          <Route path="/quote-request/draft/:id" element={<QuoteRequestPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/mairie-dashboard" element={<MairieDashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </>
  );
}

export default App;