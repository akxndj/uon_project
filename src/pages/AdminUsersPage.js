import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";

function AdminUsersPage() {
  // Fake data (can be replaced with API later)
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", role: "student" },
    { id: 2, name: "Bob", role: "organizer" },
    { id: 3, name: "Charlie", role: "student" },
    { id: 4, name: "Diana", role: "student" },
    { id: 5, name: "Ethan", role: "organizer" },
    { id: 6, name: "Fiona", role: "student" },
  ]);

  // Handle role change
  const handleRoleChange = (id, newRole) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    alert(`User role updated to "${newRole}" successfully!`);
  };

  // Handle delete
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      alert("User deleted successfully!");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Main container */}
      <div className="admin-section">
        <h1 className="admin-title">All Users</h1>

        <div className="admin-list">
          {users.map((user) => (
            <div className="admin-card" key={user.id}>
              <p>
                <strong>{user.name}</strong> — Role:{" "}
                <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
                  {user.role}
                </span>
              </p>

              <div className="admin-buttons">
                {/* Change Role dropdown */}
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="admin-role-select"
                >
                  <option value="student">Student</option>
                  <option value="organizer">Organizer</option>
                  <option value="admin">Admin</option>
                </select>

                {/* Delete button */}
                <button
                  className="admin-btn danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Back button */}
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
