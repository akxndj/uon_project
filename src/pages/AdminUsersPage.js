import React from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";

function AdminUsersPage() {
  // Fake data (can be replaced with API later)
  const users = [
    { id: 1, name: "Alice", role: "student" },
    { id: 2, name: "Bob", role: "organizer" },
    { id: 3, name: "Charlie", role: "student" },
    { id: 4, name: "Diana", role: "student" },
    { id: 5, name: "Ethan", role: "organizer" },
    { id: 6, name: "Fiona", role: "student" },
  ];

  return (
    <div className="admin-dashboard">
      {/* Main container */}
      <div className="admin-section">
        <h1 className="admin-title">All Users</h1>

        <div className="admin-list">
          {users.map((user) => (
            <div className="admin-card" key={user.id}>
              <p>
                <strong>{user.name}</strong> — Role: {user.role}
              </p>
              <div className="admin-buttons">
                {/* Button to change user role */}
                <button className="admin-btn">Change Role</button>
                {/* Button to delete user */}
                <button className="admin-btn danger">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Button to go back to dashboard */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/admin" className="view-all-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;
