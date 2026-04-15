import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/signup";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/profile";
import UsersProfile from "../pages/UsersProfile";
import DashboardLayout from "../layouts/DashboardLayout";
import Message from "../pages/Message";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        }
      />
      <Route
        path="/users-profile"
        element={
          <DashboardLayout>
            <UsersProfile />
          </DashboardLayout>
        }
      />
      <Route
        path="/messages"
        element={
          <DashboardLayout>
            <Message />
          </DashboardLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;