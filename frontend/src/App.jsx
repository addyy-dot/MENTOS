import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components & guards
import Navbar from './components/Navbar';
import { RoleGuard, GuestGuard } from './components/RoleGuard';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EditProfile from './pages/EditProfile';
import MenteeDashboard from './pages/MenteeDashboard';
import MentorSearch from './pages/MentorSearch';
import MentorProfile from './pages/MentorProfile';
import MyRequests from './pages/MyRequests';
import Feedback from './pages/Feedback';
import MentorDashboard from './pages/MentorDashboard';
import IncomingRequests from './pages/IncomingRequests';
import ScheduleSession from './pages/ScheduleSession';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Guest Routes */}
                <Route
                  path="/"
                  element={
                    <GuestGuard>
                      <Home />
                    </GuestGuard>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <GuestGuard>
                      <Login />
                    </GuestGuard>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <GuestGuard>
                      <Register />
                    </GuestGuard>
                  }
                />

                {/* Common Protected Routes */}
                <Route
                  path="/profile/edit"
                  element={
                    <RoleGuard allowedRoles={['mentee', 'mentor']}>
                      <EditProfile />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/mentor/:id"
                  element={
                    <RoleGuard allowedRoles={['mentee', 'mentor']}>
                      <MentorProfile />
                    </RoleGuard>
                  }
                />

                {/* Mentee (Student) Protected Routes */}
                <Route
                  path="/mentee-dashboard"
                  element={
                    <RoleGuard allowedRoles={['mentee']}>
                      <MenteeDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <RoleGuard allowedRoles={['mentee']}>
                      <MentorSearch />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/my-requests"
                  element={
                    <RoleGuard allowedRoles={['mentee']}>
                      <MyRequests />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/feedback/:requestId"
                  element={
                    <RoleGuard allowedRoles={['mentee']}>
                      <Feedback />
                    </RoleGuard>
                  }
                />

                {/* Mentor Protected Routes */}
                <Route
                  path="/mentor-dashboard"
                  element={
                    <RoleGuard allowedRoles={['mentor']}>
                      <MentorDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/incoming-requests"
                  element={
                    <RoleGuard allowedRoles={['mentor']}>
                      <IncomingRequests />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/schedule/:requestId"
                  element={
                    <RoleGuard allowedRoles={['mentor']}>
                      <ScheduleSession />
                    </RoleGuard>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <RoleGuard allowedRoles={['admin']}>
                      <AdminDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <RoleGuard allowedRoles={['admin']}>
                      <ManageUsers />
                    </RoleGuard>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Fixed RouteGuard typo that might occur when typing quickly
const RouteStyle = ({ children }) => children;

export default App;
