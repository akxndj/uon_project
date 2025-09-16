import React from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";

function AdminDashboard() {
  const events = [
    { id: 1, name: "Orientation Week", participants: 120 },
    { id: 2, name: "Career Workshop", participants: 80 },
    { id: 3, name: "AI Seminar", participants: 150 },
    { id: 4, name: "Hackathon", participants: 200 },
    { id: 5, name: "Networking Night", participants: 60 },
    { id: 6, name: "Research Showcase", participants: 90 },
  ];

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
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Show events list */}
      <section className="admin-section">
        <h2>Events</h2>
        <div className="admin-list">
          {events.slice(0, 5).map((event) => (
            <div className="admin-card" key={event.id}>
              <p>
                <strong>{event.name}</strong> — Participants:{" "}
                {event.participants}
              </p>
              <div className="admin-buttons">
                {/* go to event details page */}
                <Link
                  to={`/admin/events/${event.id}`}
                  className="admin-btn primary"
                >
                  View
                </Link>
                {/* edit event */}
                <button className="admin-btn">Edit</button>
                {/* delete event */}
                <button className="admin-btn danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {/* show all events button */}
        <Link to="/admin/events" className="view-all-btn">
          View All Events
        </Link>
      </section>

      {/* Show users list */}
      <section className="admin-section">
        <h2>Users</h2>
        <div className="admin-list">
          {users.slice(0, 5).map((user) => (
            <div className="admin-card" key={user.id}>
              <p>
                <strong>{user.name}</strong> — Role: {user.role}
              </p>
              <div className="admin-buttons">
                {/* change user role */}
                <button className="admin-btn">Change Role</button>
                {/* delete user */}
                <button className="admin-btn danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {/* show all users button */}
        <Link to="/admin/users" className="view-all-btn">
          View All Users
        </Link>
      </section>
    </div>
  );
}

export default AdminDashboard;
