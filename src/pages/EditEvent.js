import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/organizer.css";

function EditEvent() {
  const { id } = useParams(); // Get event ID from URL
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

  useEffect(() => {
    const existingEvent = {
      id,
      name: "Career Workshop",
      date: "2025-03-05",
      location: "Online (Zoom)",
      description: "Learn resume building and interview skills.",
      eligibility: "All students",
      fee: "Free",
      includes: "Workshop materials",
      image: "/defaultPic.png",
    };

    setEventData(existingEvent);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEventData({ ...eventData, image: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Event:", eventData);
    alert("Event updated successfully!");
    navigate("/organizer");
  };

  return (
    <div className="organizer-edit-page">
      <div className="form-card">
        <h1>Edit Event</h1>

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
              rows="4"
              style={{
                width: "100%",
                minHeight: "100px",
                resize: "none",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontFamily: "inherit",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
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
              placeholder="e.g. Free / $10 / $25"
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
            <label>Event Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {eventData.image && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={eventData.image}
                  alt="Preview"
                  style={{
                    width: "200px",
                    height: "auto",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            )}
          </div>

          <button type="submit" className="organizer-save-btn">
            Save Changes
          </button>
        </form>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <Link to="/organizer" className="organizer-action-btn">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EditEvent;
