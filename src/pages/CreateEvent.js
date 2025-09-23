import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/organizer.css"; // Reuse form styles

function CreateEvent() {
  const navigate = useNavigate();

  // Form state
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    eligibility: "",
    fee: "",
    includes: "",
    image: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New event data:", eventData);

    // TODO: Call API here (POST /api/events)
    // fetch("/api/events", { method: "POST", body: JSON.stringify(eventData) })

    alert("Event created successfully!");
    navigate("/organizer"); // Go back to organizer dashboard after success
  };

  return (
    <div className="create-event-page">
      <div className="form-card">
        <h1>Create New Event</h1>

        {/* Event creation form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Eligibility</label>
            <input
              type="text"
              name="eligibility"
              value={eventData.eligibility}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Fee</label>
            <input
              type="text"
              name="fee"
              value={eventData.fee}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Includes</label>
            <input
              type="text"
              name="includes"
              value={eventData.includes}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Image URL (optional)</label>
            <input
              type="text"
              name="image"
              value={eventData.image}
              onChange={handleChange}
              placeholder="/defaultPic.png"
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="organizer-action-btn">
            Create Event
          </button>
        </form>

        {/* Link back to dashboard */}
        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <Link to="/organizer" className="organizer-action-btn">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
