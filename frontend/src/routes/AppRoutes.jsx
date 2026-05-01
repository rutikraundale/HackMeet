import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const SignIn = lazy(() => import("../pages/SignIn"));
const SignUp = lazy(() => import("../pages/SignUp"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const UsersProfile = lazy(() => import("../pages/UsersProfile"));
const Message = lazy(() => import("../pages/Message"));
const Discover = lazy(() => import("../pages/Discover"));
const FindTeams = lazy(() => import("../pages/FindTeams"));
const TeamBuilder = lazy(() => import("../pages/TeamBuilder"));
const HackathonDetail = lazy(() => import("../pages/HackathonDetail"));
const Projects = lazy(() => import("../pages/Projects"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const Notifications = lazy(() => import("../pages/Notifications"));

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to={user?.isAdmin ? "/admin" : "/dashboard"} replace />;
  }
  return children;
};

const Protected = ({ children, adminOnly }) => (
  <ProtectedRoute adminOnly={adminOnly}>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
        <Route path="/discover" element={<Protected><Discover /></Protected>} />
        <Route path="/find-teams" element={<Protected><FindTeams /></Protected>} />
        <Route path="/team-builder" element={<Protected><TeamBuilder /></Protected>} />
        <Route path="/hackathon/:id" element={<Protected><HackathonDetail /></Protected>} />
        <Route path="/admin" element={<Protected adminOnly><AdminDashboard /></Protected>} />
        <Route path="/notifications" element={<Protected><Notifications /></Protected>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;