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
    capacity: ""
  });

  // LOAD EVENT FROM DATABASE
  useEffect(() => {

    const loadEvent = async () => {

      try {

        const res = await fetch(`http://localhost:9999/api/events/${id}`);
        const data = await res.json();

        setEventData(data);

      } catch (err) {

        console.error(err);

      }

    };

    loadEvent();

  }, [id]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setEventData({
      ...eventData,
      [name]: value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await fetch(`http://localhost:9999/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
      });

      push({
        title: "Event updated",
        message: `"${eventData.name}" details saved.`,
        tone: "success"
      });

      navigate("/admin/events");

    } catch (err) {

      console.error(err);

    }

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
              value={eventData.date?.slice(0,10)}
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
            />
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