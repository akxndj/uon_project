import React from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/organizer.css";

function OrganizerEventDetails() {
  const { id } = useParams();

  // Fake data (replace with API later)
  const events = [
    {
      id: 1,
      name: "Career Workshop",
      date: "2025-03-05",
      location: "Online (Zoom)",
      participants: 80,
      description: "Learn resume building and interview skills.",
    },
    {
      id: 2,
      name: "Tech Meetup",
      date: "2025-04-15",
      location: "NUspace",
      participants: 45,
      description: "Networking for students and professionals.",
    },
  ];

  // Find event by id from URL
  const event = events.find((e) => e.id.toString() === id);

  // If no event found
  if (!event) {
    return (
      <div className="organizer-dashboard">
        <h2>Event not found</h2>
        {/* Back button */}
        <Link to="/organizer" className="organizer-action-btn">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="organizer-dashboard">
      <div className="organizer-section">
        {/* Event title */}
        <h1 className="organizer-title">{event.name}</h1>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Participants:</strong> {event.participants}
        </p>
        <p>
          <strong>Description:</strong> {event.description}
        </p>

        {/* Buttons for edit and delete */}
        <div className="organizer-buttons" style={{ marginTop: "20px" }}>
          <button className="organizer-action-btn edit">Edit</button>
          <button className="organizer-action-btn danger">Delete</button>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/organizer" className="organizer-action-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrganizerEventDetails;
