import React from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/user.css";
import defaultPic from "../assets/defaultPic.png"; // Import default image

function EventDetails() {
  const { id } = useParams();

  // Fake event data (can replace with API later)
  const events = [
    {
      id: "1",
      name: "Orientation Week",
      date: "2025-02-15",
      location: "Callaghan Campus",
      description: "Welcome new students and explore campus life.",
      eligibility: "All new students",
      fee: "Free",
      includes: "Campus tour, welcome pack, free lunch",
      image: "", // No image provided
    },
    {
      id: "2",
      name: "Career Workshop",
      date: "2025-03-05",
      location: "Online (Zoom)",
      description: "Learn resume building, networking, and interview skills.",
      eligibility: "All students interested in career prep",
      fee: "Free",
      includes: "Resume templates, mock interview session",
      image: "/customCareer.png", // Custom image provided
    },
    {
      id: "3",
      name: "AI Seminar",
      date: "2025-04-10",
      location: "NUspace Building",
      description: "Talks by experts about the latest AI trends and research.",
      eligibility: "All students & staff",
      fee: "$10 (includes refreshments)",
      includes: "Seminar materials, networking session, refreshments",
      image: null, // No image provided
    },
  ];

  // Find event by id from URL
  const event = events.find((e) => e.id === id);

  // If no event found
  if (!event) {
    return (
      <div>
        <h2>Event not found</h2>
        {/* Link back to home */}
        <Link to="/home">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="details-card">
      {/* Show event image (or default if missing) */}
      <img src={event.image || defaultPic} alt={event.name} />

      {/* Show event details */}
      <div className="details-info">
        <h2>{event.name}</h2>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Description:</strong> {event.description}
        </p>
        <p>
          <strong>Eligibility:</strong> {event.eligibility}
        </p>
        <p>
          <strong>Fee:</strong> {event.fee}
        </p>
        <p>
          <strong>Includes:</strong> {event.includes}
        </p>

        {/* Action buttons */}
        <div className="details-buttons">
          <Link to={`/register/${event.id}`} className="event-link">
            Register Now
          </Link>
          <Link to="/home" className="event-link back-btn">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
