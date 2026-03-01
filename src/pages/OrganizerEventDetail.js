import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/organizer.css";
import { getEventById } from "../data/events";
import { getRegistrationCount } from "../utils/registrationStorage";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

function OrganizerEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const { confirm } = useModal();

  // Find event by id from URL
  const event = useMemo(() => getEventById(id), [id]);
  const [participants, setParticipants] = useState(
    event ? getRegistrationCount(event.id) : 0
  );

  useEffect(() => {
    if (!event) return;
    const refreshParticipants = () =>
      setParticipants(getRegistrationCount(event.id));

    refreshParticipants();
    if (typeof window === "undefined") return undefined;
    const handleStorage = ({ key }) => {
      if (key === "eventRegistrations") {
        refreshParticipants();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [event]);

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
              <span>Registered:</span> {participants}
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
                <strong>Participants:</strong> {participants}/{event.capacity}
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
