import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";

function AdminEventsPage() {
  // Initial mock event data
  const [events, setEvents] = useState([
    { id: 1, name: "Orientation Week", participants: 120 },
    { id: 2, name: "Career Workshop", participants: 80 },
    { id: 3, name: "AI Seminar", participants: 150 },
    { id: 4, name: "Hackathon", participants: 200 },
    { id: 5, name: "Networking Night", participants: 60 },
    { id: 6, name: "Research Showcase", participants: 90 },
  ]);

  // Handle delete confirmation
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmDelete) {
      setEvents(events.filter((event) => event.id !== id));
      alert("Event deleted successfully!");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-section">
        <h1 className="admin-title">All Events</h1>

        {/* Event List */}
        <div className="admin-list">
          {events.map((event) => (
            <div className="admin-card" key={event.id}>
              <p>
                <strong>{event.name}</strong> — Participants:{" "}
                {event.participants}
              </p>

              <div className="admin-buttons">
                {/* View details */}
                <Link
                  to={`/admin/events/${event.id}`}
                  className="admin-btn primary"
                >
                  View
                </Link>

                {/* Edit event */}
                <Link
                  to={`/admin/edit-event/${event.id}`}
                  className="admin-btn"
                >
                  Edit
                </Link>

                {/* Delete event */}
                <button
                  className="admin-btn danger"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Back to dashboard */}
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
