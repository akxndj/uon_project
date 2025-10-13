import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/admin.css";
import { getEventById } from "../data/events";
import { getRegistrationCount } from "../utils/registrationStorage";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

function AdminEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const { confirm } = useModal();

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

  // Handle edit navigation
  const handleEdit = () => {
    navigate(`/admin/edit-event/${id}`);
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    const approved = await confirm({
      title: `Delete ${event?.name || "this event"}?`,
      description:
        "This event will be removed from the catalogue along with all registrations.",
      confirmLabel: "Delete event",
      cancelLabel: "Cancel",
      tone: "danger",
      size: "md",
      render: () =>
        event ? (
          <div className="modal-details">
            <p>
              Are you sure you want to delete{" "}
              <strong>{event.name}</strong>?
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
        ) : null,
    });

    if (!approved) return;

    push({
      title: "Event deleted",
      message: `"${event.name}" has been removed.`,
      tone: "info",
    });
    navigate("/admin");
  };

  // If no event found
  if (!event) {
    return (
      <div className="admin-dashboard">
        <h2>Event not found</h2>
        <Link to="/admin" className="view-all-btn">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-section">
        {/* Event details */}
        <h1 className="admin-title">{event.name}</h1>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Participants:</strong> {participants}/{event.capacity}
        </p>
        <p>
          <strong>Maximum Capacity:</strong> {event.capacity}
        </p>
        <p>
          <strong>Description:</strong> {event.description}
        </p>

        {/* Action buttons */}
        <div className="admin-buttons" style={{ marginTop: "20px" }}>
          <button className="admin-btn" onClick={handleEdit}>
            Edit
          </button>
          <button className="admin-btn danger" onClick={handleDelete}>
            Delete
          </button>
        </div>

        {/* Back button */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/admin" className="view-all-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminEventDetails;
