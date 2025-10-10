import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/organizer.css";

function OrganizerEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fake data
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
      <div className="organizer-page">
        <div className="organizer-dashboard">
          <h2>Event not found</h2>
          <Link to="/organizer" className="organizer-action-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // === Handle Edit ===
  const handleEdit = () => {
    navigate(`/organizer/edit-event/${id}`);
  };

  // === Handle Delete ===
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${event.name}"?`
    );
    if (confirmDelete) {
      alert(`"${event.name}" has been deleted successfully.`);
      navigate("/organizer");
    }
  };

  return (
    <div className="organizer-page">
      <div className="organizer-dashboard">
        <div className="organizer-section">
          {/* Event title */}
          <h1 className="organizer-title">{event.name}</h1>

          {/* Event details */}
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

          {/* Buttons */}
          <div className="organizer-buttons" style={{ marginTop: "25px" }}>
            <button className="organizer-action-btn edit" onClick={handleEdit}>
              Edit
            </button>

            <button
              className="organizer-action-btn danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>

          {/* Back button */}
          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <Link to="/organizer" className="organizer-action-btn">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerEventDetails;
