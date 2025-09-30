import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from '../context/AuthContext';
import MainLayout from './layout/MainLayout';
import PrivateRoute from './common/PrivateRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import EmailVerificationPage from '../pages/EmailVerificationPage';
import DashboardPage from '../pages/DashboardPage';
import InventoryPage from '../pages/InventoryPage';
import PurchasingPage from '../pages/PurchasingPage';
import ReceivingPage from '../pages/ReceivingPage';
import SalesPage from '../pages/SalesPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import UsersPage from '../pages/UsersPage';
import NotFoundPage from '../pages/NotFoundPage';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            
            {/* Protected Routes */}
            <Route element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="inventory/*" element={<InventoryPage />} />
              <Route 
                path="purchasing" 
                element={
                  <PrivateRoute roles={['manager', 'purchaser']}>
                    <PurchasingPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="receiving" 
                element={
                  <PrivateRoute roles={['manager', 'receiver']}>
                    <ReceivingPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="sales" 
                element={
                  <PrivateRoute roles={['manager', 'cashier']}>
                    <SalesPage />
                  </PrivateRoute>
                } 
              />
              <Route path="reports/*" element={<ReportsPage />} />
              <Route 
                path="settings" 
                element={
                  <PrivateRoute roles={['admin', 'manager']}>
                    <SettingsPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="users" 
                element={
                  <PrivateRoute roles={['admin']}>
                    <UsersPage />
                  </PrivateRoute>
                } 
              />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;