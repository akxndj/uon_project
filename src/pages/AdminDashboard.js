import React from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";

function AdminDashboard() {
  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* Two big blocks for navigation */}
        <div className="admin-menu">
          {/* Manage Events */}
          <Link to="/admin/events" className="admin-menu-card">
            <img
              src="/images/admin-events.png"
              alt="Manage Events"
              className="admin-menu-img"
            />
            <h2>Manage Events</h2>
          </Link>

          {/* Manage Users */}
          <Link to="/admin/users" className="admin-menu-card">
            <img
              src="/images/admin-users.png"
              alt="Manage Users"
              className="admin-menu-img"
            />
            <h2>Manage Users</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
