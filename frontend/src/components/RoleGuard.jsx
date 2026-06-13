import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Spinner for loading states
export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-brand-violet/20 border-t-brand-violet rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-semibold animate-pulse tracking-wide">Loading MENTos...</p>
      </div>
    </div>
  );
};

// Route Guard for Protected Pages
export const RoleGuard = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check -> Redirect to corresponding dashboard if unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'mentor') {
      return <Navigate to="/mentor-dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/mentee-dashboard" replace />;
    }
  }

  return children;
};

// Route Guard for Guest Pages (Home, Login, Register)
export const GuestGuard = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Already logged in -> Redirect to dashboard
  if (user) {
    if (user.role === 'mentor') {
      return <Navigate to="/mentor-dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'mentee') {
      return <Navigate to="/mentee-dashboard" replace />;
    }
  }

  return children;
};
