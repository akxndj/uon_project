import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";
import { getRegistrationCount } from "../utils/registrationStorage";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

function AdminEventsPage() {
  const { push } = useToast();
  const { confirm } = useModal();
  const [query, setQuery] = useState("");
const [eventList, setEvents] = useState([]);
useEffect(() => {
  fetch("http://localhost:9999/api/events")
    .then((res) => res.json())
    .then((data) => {
      setEvents(data);
      setLoading(false);
    })
    .catch((err) => console.error(err));
}, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshParticipants = () => {
      setEvents((current) =>
        current.map((event) => ({
          ...event,
          participants: getRegistrationCount(event._id),
        }))
      );
    };

    refreshParticipants();
    setLoading(false);

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
    const targetEvent = eventList.find((event) => event._id === id);
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
              {new Date(targetEvent.date).toLocaleDateString("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
})}
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

try {

  await fetch(`http://localhost:9999/api/events/${id}`, {
    method: "DELETE"
  });

  setEvents((prev) =>
    prev.filter((event) => event._id !== id)
  );

  push({
    title: "Event deleted",
    message: `${targetEvent?.name || "Event"} has been removed.`,
    tone: "info",
  });

} catch (err) {
  console.error(err);
}

    let deletedName = "";
    setEvents((current) => {
      const target = current.find((event) => event._id === id);
      if (target) {
        deletedName = target.name;
      }
      return current.filter((event) => event._id !== id);
    });
    if (deletedName) {
      push({
        title: "Event removed",
        message: `"${deletedName}" is no longer listed.`,
        tone: "info",
      });
    }
  };

  const filteredEvents = useMemo(() => {
    if (!query) return eventList;
    const needle = query.toLowerCase();
    return eventList.filter(
      (event) =>
        event.name.toLowerCase().includes(needle) ||
        event.location.toLowerCase().includes(needle)
    );
  }, [eventList, query]);

  const totalRegistrations = useMemo(
    () =>
      eventList.reduce((sum, event) => sum + (event.participants || 0), 0),
    [eventList]
  );

  const nearCapacity = useMemo(
    () =>
      eventList.filter((event) => {
        if (!event.capacity) return false;
        return event.participants / event.capacity >= 0.8;
      }).length,
    [eventList]
  );
  if (loading) {
  return (
    <div className="loading">
      Loading events...
    </div>
  );
}
  

  return (
  <div className="admin-dashboard">
    <div className="admin-section">

      {/* 固定 Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Manage Events</h1>
          <p className="admin-subtitle">
            Review upcoming sessions, manage capacity, and keep listings healthy.
          </p>
        </div>
        <div className="admin-search">
          <label htmlFor="admin-event-search">Search</label>
          <input
            id="admin-event-search"
            type="search"
            placeholder="Search by name or location"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      {/* 固定 Metrics */}
      <section className="admin-metrics">
        <article>
          <span>Total Events</span>
          <strong>{eventList.length}</strong>
        </article>
        <article>
          <span>Total Registrations</span>
          <strong>{totalRegistrations}</strong>
        </article>
        <article>
          <span>Near Capacity</span>
          <strong>{nearCapacity}</strong>
        </article>
      </section>

      {/* 可滚动列表区域 */}
      <div className="admin-list-scroll">
        <div className="admin-list">
          {filteredEvents.map((event) => (
            <div className="admin-card" key={event._id}>
              <div className="admin-card__identity">
                <strong>{event.name}</strong>
                <p className="admin-card__meta">
                  📍 {event.location} &nbsp; • &nbsp; 📅 {event.date}
                </p>
                <div className="admin-card__stats">
                  <span>
                    Participants: {event.participants}/{event.capacity}
                  </span>
                </div>
              </div>

              <div className="admin-buttons">
                <Link
                  to={`/admin/events/${event._id}`}
                  className="admin-btn primary"
                >
                  View
                </Link>

                <Link
                  to={`/admin/edit-event/${event._id}`}
                  className="admin-btn"
                >
                  Edit
                </Link>

                <button
                  className="admin-btn danger"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!filteredEvents.length && (
            <div className="admin-empty">
              <p>No events match your search.</p>
            </div>
          )}
        </div>
      </div>

      <div className="admin-footer">
        <Link to="/admin" className="view-all-btn">
          Back to Dashboard
        </Link>
      </div>

    </div>
  </div>
  );
}

export default AdminEventsPage;
