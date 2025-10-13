import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";
import events from "../data/events";
import { getRegistrationCount } from "../utils/registrationStorage";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

function AdminEventsPage() {
  const { push } = useToast();
  const { confirm } = useModal();
  const [eventList, setEvents] = useState(
    events.map((event) => ({
      ...event,
      participants: getRegistrationCount(event.id),
    }))
  );

  useEffect(() => {
    const refreshParticipants = () => {
      setEvents((current) =>
        current.map((event) => ({
          ...event,
          participants: getRegistrationCount(event.id),
        }))
      );
    };

    refreshParticipants();
    if (typeof window === "undefined") return undefined;
    const handleStorage = ({ key }) => {
      if (key === "eventRegistrations") {
        refreshParticipants();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Handle delete confirmation
  const handleDelete = async (id) => {
    const targetEvent = eventList.find((event) => event.id === id);
    const approved = await confirm({
      title: `Remove ${targetEvent?.name || "this event"}?`,
      description:
        "The event will be archived for all attendees and hidden from discovery.",
      confirmLabel: "Delete event",
      cancelLabel: "Cancel",
      tone: "danger",
      size: "md",
      render: () =>
        targetEvent ? (
          <div className="modal-details">
            <p>
              You are about to remove <strong>{targetEvent.name}</strong>.
            </p>
            <ul className="modal-details__list">
              <li>
                <span>Date:</span> {targetEvent.date}
              </li>
              <li>
                <span>Location:</span> {targetEvent.location}
              </li>
              <li>
                <span>Capacity:</span> {targetEvent.capacity}
              </li>
              <li>
                <span>Registered:</span> {targetEvent.participants}
              </li>
            </ul>
          </div>
        ) : null,
    });

    if (!approved) return;

    let deletedName = "";
    setEvents((current) => {
      const target = current.find((event) => event.id === id);
      if (target) {
        deletedName = target.name;
      }
      return current.filter((event) => event.id !== id);
    });
    if (deletedName) {
      push({
        title: "Event removed",
        message: `"${deletedName}" is no longer listed.`,
        tone: "info",
      });
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-section">
        <h1 className="admin-title">All Events</h1>

        {/* Event List */}
        <div className="admin-list">
          {eventList.map((event) => (
            <div className="admin-card" key={event.id}>
              <p>
                <strong>{event.name}</strong> — Participants:{" "}
                {event.participants}/{event.capacity}
              </p>

              <div className="admin-buttons">
                {/* View details */}
                <Link
                  to={`/admin/events/${event.id}`}
                  className="admin-btn primary"
                >
                  View
                </Link>

                {/* Edit event */}
                <Link
                  to={`/admin/edit-event/${event.id}`}
                  className="admin-btn"
                >
                  Edit
                </Link>

                {/* Delete event */}
                <button
                  className="admin-btn danger"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Back to dashboard */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/admin" className="view-all-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminEventsPage;
