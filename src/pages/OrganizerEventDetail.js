import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/organizer.css";

import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

function OrganizerEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const { confirm } = useModal();

  // Find event by id from URL
  const [event, setEventId] = useState([])
  useEffect(() => { 
    const fetchEvent = async() => { 
      try{
        const res = await fetch(`http://localhost:9999/api/events/${id}`);
        if(!res.ok) throw new Error("No event with this id found");
        const data = await res.json();

        setEventId(data);
      }
      catch(err){
        console.error("No event found", err);
      }
    }
    fetchEvent();
  }, []);


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
  const handleDelete = async () => {
    const approved = await confirm({
      title: `Delete ${event?.name || "this event"}?`,
      description:
        "Attendees will lose their registrations and the event will be removed from organiser listings.",
      confirmLabel: "Delete event",
      cancelLabel: "Cancel",
      tone: "danger",
      size: "md",
      render: () => (
        <div className="modal-details">
          <p>
            Are you sure you want to delete <strong>{event.name}</strong>?
          </p>
          <ul className="modal-details__list">
            <li>
              <span>Date:</span> {event.date}
            </li>
            <li>
              <span>Location:</span> {event.location}
            </li>
            <li>
              <span>Capacity:</span> {event.capacity}
            </li>
            <li>
              <span>Registered:</span> {event.registered}
            </li>
          </ul>
        </div>
      ),
    });

    if (!approved) return;

    push({
      title: "Event deleted",
      message: `"${event.name}" has been removed.`,
      tone: "info",
    });
    navigate("/organizer");
  };

  /* const handleEmail = async() => {
    const subject = prompt("Enter subject of email");
    const message = prompt("Enter body of email");
    try{
      const res = await fetch(`http://localhost:9999/api/registrations/${id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({subject, message}),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message);
      if (data.previewUrl) {
        window.open(data.previewUrl, "_blank");
      }

      }
    catch(error){
      console.error("Failed to send email", error);
    }


  } */

  return (
  <div className="admin-dashboard">
    <div className="page-shell">
      <div className="admin-section">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">{event.name}</h1>
            <p className="admin-subtitle">
              Track performance and manage this event.
            </p>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="admin-list-scroll">
          <div className="admin-card">

            <div className="admin-card__identity">
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p>
                <strong>Participants:</strong> {event.registered}/{event.capacity}
              </p>
              <p><strong>Maximum Capacity:</strong> {event.capacity}</p>
              <p><strong>Description:</strong> {event.description}</p>
            </div>

            <div className="admin-buttons" style={{ marginTop: "25px" }}>
              <button className="admin-btn" onClick={handleEdit}>
                Edit
              </button>

              <button
                className="admin-btn danger"
                onClick={handleDelete}
              >
                Delete
              </button>
              <Link to = {`/events/${id}/email`} className = "admin-btn">
                Email Attendees
              </Link>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="admin-footer">
          <Link to="/organizer" className="view-all-btn">
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  </div>
);
}

export default OrganizerEventDetails;
