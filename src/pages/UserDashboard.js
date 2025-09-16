import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/user.css";
import defaultPic from "../assets/defaultPic.png";

function UserDashboard() {
  // Fake data (can be replaced with API later)
  const [registrations, setRegistrations] = useState([
    {
      id: "1",
      name: "Orientation Week",
      date: "2025-02-15",
      location: "Callaghan Campus",
      image: defaultPic, // Default image
    },
    {
      id: "2",
      name: "Career Workshop",
      date: "2025-03-05",
      location: "Online (Zoom)",
      image: defaultPic, // Default image
    },
  ]);

  // Cancel event registration
  const cancelRegistration = (id) => {
    setRegistrations(registrations.filter((event) => event.id !== id));
    console.log(`Cancelled registration for event ${id}`);
    // TODO: Call backend API: DELETE /api/registrations/:id
  };

  return (
    <div className="dashboard-container">
      {/* Page title */}
      <h1 className="dashboard-title">User Dashboard</h1>
      <h2 className="dashboard-subtitle">My Registered Events</h2>

      {registrations.length > 0 ? (
        <div className="event-list">
          {registrations.map((event) => (
            <div className="event-card" key={event.id}>
              {/* Event image */}
              <img src={event.image} alt={event.name} className="event-img" />

              {/* Event info */}
              <div className="event-info">
                <h3>{event.name}</h3>
                <p>Date: {event.date}</p>
                <p>Location: {event.location}</p>

                {/* Action buttons */}
                <div className="event-buttons">
                  <button
                    onClick={() => cancelRegistration(event.id)}
                    className="event-link back-btn"
                  >
                    Cancel Registration
                  </button>
                  <Link to={`/events/${event.id}`} className="event-link">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not registered for any events yet.</p>
      )}

      <hr />
      {/* Button to go back to home */}
      <Link to="/Home" className="event-link back-btn">
        Back to Home
      </Link>
    </div>
  );
}

export default UserDashboard;
