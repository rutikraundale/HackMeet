import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/signup";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/profile";
import UsersProfile from "../pages/UsersProfile";
import DashboardLayout from "../layouts/DashboardLayout";
import Message from "../pages/Message";
import Teammates from "../pages/Teammates";
import Discover from "../pages/Discover";
import TeamBuilder from "../pages/TeamBuilder";
import HackathonDetail from "../pages/HackathonDetail";
import Projects from "../pages/Projects";

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
        path="/users-profile/:id"
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
      <Route
        path="/messages/:id"
        element={
          <DashboardLayout>
            <Message/>
          </DashboardLayout>
        }
      />
      <Route
        path="/projects"
        element={
          <DashboardLayout>
            <Projects />
          </DashboardLayout>
        }
      />
      <Route
        path="/teammates"
        element={
          <DashboardLayout>
            <Teammates />
          </DashboardLayout>
        }
      />
      <Route
        path="/discover"
        element={
          <DashboardLayout>
            <Discover />
          </DashboardLayout>
        }
      />
      <Route
        path="/team-builder"
        element={
          <DashboardLayout>
            <TeamBuilder />
          </DashboardLayout>
        }
      />
      <Route
        path="/hackathon/:id"
        element={
          <DashboardLayout>
            <HackathonDetail />
          </DashboardLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;