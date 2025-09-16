import React from "react";
import { Link } from "react-router-dom";
import "../styles/organizer.css";

function OrganizerDashboard() {
  // Fake data (can be replaced with API later)
  const events = [
    { id: 1, name: "Career Workshop", participants: 80 },
    { id: 2, name: "Tech Meetup", participants: 45 },
  ];

  return (
    <div className="organizer-dashboard">
      <h1 className="organizer-title">Organizer Dashboard</h1>

      {/* Events management */}
      <div className="organizer-section">
        <h2>My Events</h2>

        <div className="organizer-list">
          {events.map((event) => (
            <div className="organizer-card" key={event.id}>
              <p>
                <strong>{event.name}</strong> — Participants:{" "}
                {event.participants}
              </p>
              <div className="organizer-buttons">
                {/* Go to event details page */}
                <Link
                  to={`/organizer/events/${event.id}`}
                  className="organizer-btn primary"
                >
                  View
                </Link>
                {/* Button to edit event */}
                <button className="organizer-btn">Edit</button>
                {/* Button to delete event */}
                <button className="organizer-btn danger">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Button to create a new event */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/organizer/create-event" className="organizer-create-btn">
            Create New Event
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;
