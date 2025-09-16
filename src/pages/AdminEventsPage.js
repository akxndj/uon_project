import React from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";

function AdminEventsPage() {
  const events = [
    { id: 1, name: "Orientation Week", participants: 120 },
    { id: 2, name: "Career Workshop", participants: 80 },
    { id: 3, name: "AI Seminar", participants: 150 },
    { id: 4, name: "Hackathon", participants: 200 },
    { id: 5, name: "Networking Night", participants: 60 },
    { id: 6, name: "Research Showcase", participants: 90 },
  ];

  return (
    <div className="admin-dashboard">
      {/* Main container */}
      <div className="admin-section">
        <h1 className="admin-title">All Events</h1>

        <div className="admin-list">
          {events.map((event) => (
            <div className="admin-card" key={event.id}>
              <p>
                <strong>{event.name}</strong> — Participants:{" "}
                {event.participants}
              </p>
              <div className="admin-buttons">
                {/* Go to event details page */}
                <Link
                  to={`/admin/events/${event.id}`}
                  className="admin-btn primary"
                >
                  View
                </Link>
                {/* Button to edit event */}
                <button className="admin-btn">Edit</button>
                {/* Button to delete event */}
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

export default AdminEventsPage;
