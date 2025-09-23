import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar"; // Navbar

// Pages
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import Register from "./pages/RegisterUser";
import AdminEventDetails from "./pages/AdminEventDetails";
import CreateEvent from "./pages/CreateEvent";
import OrganizerEventDetail from "./pages/OrganizerEventDetail";

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar appears on all pages */}
      <Routes>
        {/* Register page */}
        <Route path="/register-account" element={<Register />} />

        {/* Default route → Login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/events/:id" element={<AdminEventDetails />} />

        {/* User routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/register/:id" element={<Registration />} />
        <Route path="/user" element={<UserDashboard />} />

        {/* Organizer routes */}
        <Route path="/organizer/create-event" element={<CreateEvent />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route
          path="/organizer/events/:id"
          element={<OrganizerEventDetail />}
        />
      </Routes>
    </Router>
  );
}

export default App;
