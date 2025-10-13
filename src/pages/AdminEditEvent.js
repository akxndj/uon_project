import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/admin.css";
import { useToast } from "../context/ToastContext";

function AdminEditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();

  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    eligibility: "",
    fee: "",
    includes: "",
    image: "",
    capacity: "",
  });

  useEffect(() => {
    const existingEvent = {
      id,
      name: "AI Seminar",
      date: "2025-05-12",
      location: "NUspace Room 401",
      description: "Explore the future of Artificial Intelligence.",
      eligibility: "All students & staff",
      fee: "$10",
      includes: "Certificate & refreshments",
      image: "/defaultPic.png",
      capacity: 150,
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
    push({
      title: "Event updated",
      message: `"${eventData.name}" details have been saved.`,
      tone: "success",
    });
    navigate("/admin");
  };

  return (
    <div className="admin-edit-page">
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
            <label>Maximum Capacity</label>
            <input
              type="number"
              name="capacity"
              value={eventData.capacity}
              onChange={handleChange}
              min="1"
              required
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

          <button type="submit" className="admin-action-btn">
            Save Changes
          </button>
        </form>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <Link to="/admin" className="admin-action-btn">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminEditEvent;
