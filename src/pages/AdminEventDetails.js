import React from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/admin.css";

function AdminEventDetails() {
  const { id } = useParams();

  // Fake data (can be replaced with API later)
  const events = [
    {
      id: 1,
      name: "Orientation Week",
      date: "2025-02-15",
      location: "Callaghan Campus",
      participants: 120,
      description: "Welcome new students and explore campus life.",
    },
    {
      id: 2,
      name: "Career Workshop",
      date: "2025-03-05",
      location: "Online (Zoom)",
      participants: 80,
      description: "A workshop to prepare for your future career.",
    },
  ];

  // Find event by id from URL
  const event = events.find((e) => e.id.toString() === id);

  // If no event found
  if (!event) {
    return (
      <div className="admin-dashboard">
        <h2>Event not found</h2>
        {/* Button to go back */}
        <Link to="/admin" className="view-all-btn">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-section">
        {/* Show event name */}
        <h1 className="admin-title">{event.name}</h1>
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
        <div className="admin-buttons" style={{ marginTop: "20px" }}>
          <button className="admin-btn">Edit</button>
          <button className="admin-btn danger">Delete</button>
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

export default AdminEventDetails;
