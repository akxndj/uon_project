import React from "react";
import { Link } from "react-router-dom";
import "../styles/user.css";
import defaultPic from "../assets/defaultPic.png";

function Home() {
  // Fake event data (can be replaced with API later)
  const events = [
    {
      id: "1",
      name: "Orientation Week",
      date: "2025-02-15",
      location: "Callaghan Campus",
      description:
        "Welcome new students to the campus, explore facilities and student life.",
      image: defaultPic,
    },
    {
      id: "2",
      name: "Career Workshop",
      date: "2025-03-05",
      location: "Online (Zoom)",
      description: "Learn resume building, networking, and interview skills.",
      image: defaultPic,
    },
    {
      id: "3",
      name: "AI Seminar",
      date: "2025-04-10",
      location: "NUspace Building",
      description: "Talks by experts about the latest AI trends and research.",
      image: defaultPic,
    },
  ];

  return (
    <div className="home-container">
      <h2 className="home-title">Upcoming Events</h2>

      {/* Event cards list */}
      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            {/* Event image */}
            <img src={event.image} alt={event.name} className="event-img" />

            {/* Event info */}
            <div className="event-info">
              <h3>{event.name}</h3>
              <p>Date: {event.date}</p>
              <p>Location: {event.location}</p>
              <p className="description">Description: {event.description}</p>

              {/* Link to event details */}
              <Link to={`/events/${event.id}`} className="event-link">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
