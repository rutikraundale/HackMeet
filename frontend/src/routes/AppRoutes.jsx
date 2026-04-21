import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import UsersProfile from "../pages/UsersProfile";
import DashboardLayout from "../layouts/DashboardLayout";
import Message from "../pages/Message";
import Teammates from "../pages/Teammates";
import Discover from "../pages/Discover";
import TeamBuilder from "../pages/TeamBuilder";
import HackathonDetail from "../pages/HackathonDetail";
import Projects from "../pages/Projects";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const Protected = ({ children, adminOnly }) => (
  <ProtectedRoute adminOnly={adminOnly}>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes — redirect to dashboard if already logged in */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="/users-profile/:id" element={<Protected><UsersProfile /></Protected>} />
      <Route path="/messages" element={<Protected><Message /></Protected>} />
      <Route path="/messages/:id" element={<Protected><Message /></Protected>} />
      <Route path="/projects" element={<Protected><Projects /></Protected>} />
      <Route path="/teammates" element={<Protected><Teammates /></Protected>} />
      <Route path="/discover" element={<Protected><Discover /></Protected>} />
      <Route path="/team-builder" element={<Protected><TeamBuilder /></Protected>} />
      <Route path="/hackathon/:id" element={<Protected><HackathonDetail /></Protected>} />
      <Route path="/admin" element={<Protected adminOnly><AdminDashboard /></Protected>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;