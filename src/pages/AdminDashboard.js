import React from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";

function AdminDashboard() {
  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-menu">
          <Link to="/admin/events" className="admin-menu-card">
            <div className="admin-menu-icon">📅</div>
            <h2>Manage Events</h2>
          </Link>

          <Link to="/admin/users" className="admin-menu-card">
            <div className="admin-menu-icon">👥</div>
            <h2>Manage Users</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
