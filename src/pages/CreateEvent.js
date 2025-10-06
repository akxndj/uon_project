import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/organizer.css"; // Reuse form styles

function CreateEvent() {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New event data:", eventData);
    alert("Event created successfully!");
    navigate("/organizer");
  };

  return (
    <div className="organizer-page">
      <div className="form-container">
        <div className="form-card">
          <h1>Create New Event</h1>

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
            <button type="submit" className="form-btn">
              Create Event
            </button>
          </form>

          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <Link to="/organizer" className="form-link">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
