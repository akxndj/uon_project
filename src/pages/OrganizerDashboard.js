import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/organizer.css";

function OrganizerDashboard() {
  const navigate = useNavigate();

  // Local event data
  const [events, setEvents] = useState([
    { id: 1, name: "Career Workshop", participants: 80 },
    { id: 2, name: "Tech Meetup", participants: 45 },
  ]);

  // Handle Delete Event
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmDelete) {
      // Remove the event from the state list (simulate backend delete)
      const updatedEvents = events.filter((event) => event.id !== id);
      setEvents(updatedEvents);
      alert("Event deleted successfully!");
    }
  };

  // Handle Edit Event
  const handleEdit = (id) => {
    // Redirect to the Edit Event page with the event ID
    navigate(`/organizer/edit-event/${id}`);
  };

  return (
    <div className="organizer-page">
      <div className="organizer-dashboard">
        {/* Page Title */}
        <h1 className="organizer-title">Organizer Dashboard</h1>

        {/* Events Management Section */}
        <div className="organizer-section">
          <h2>My Events</h2>

          {/* Event List */}
          <div className="organizer-list">
            {events.map((event) => (
              <div className="organizer-card" key={event.id}>
                {/* Event Basic Info */}
                <p>
                  <strong>{event.name}</strong> — Participants:{" "}
                  {event.participants}
                </p>

                {/* Buttons: View, Edit, Delete */}
                <div className="organizer-buttons">
                  {/* View Event Details */}
                  <Link
                    to={`/organizer/events/${event.id}`}
                    className="organizer-btn primary"
                  >
                    View
                  </Link>

                  {/* Edit Event */}
                  <button
                    className="organizer-btn"
                    onClick={() => handleEdit(event.id)}
                  >
                    Edit
                  </button>

                  {/* Delete Event */}
                  <button
                    className="organizer-btn danger"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create New Event Button */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/organizer/create-event" className="organizer-create-btn">
              Create New Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;
