// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {AuthProvider} from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy loaded components for performance
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Dashboard = lazy(() => import('./components/layout/Dashboard'));
const ProfileForm = lazy(() => import('./components/profile/ProfileForm'));

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Header />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfileForm />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
          <Footer />
          <Toaster position="top-right" reverseOrder={false} />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};

export default App;
