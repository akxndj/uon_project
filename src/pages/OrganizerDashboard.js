import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/organizer.css";
import eventsCatalogue from "../data/events";
import { getRegistrationCount } from "../utils/registrationStorage";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getStatus = (event) => {
  const now = new Date();
  const start = parseDate(event.startTime || `${event.date}T09:00`);
  const end = parseDate(event.endTime);
  if (start && start > now) return "upcoming";
  if (end && end < now) return "past";
  if (!start && parseDate(event.date) && parseDate(event.date) < now)
    return "past";
  return "live";
};

const capacityTone = (participants, capacity) => {
  if (!capacity) return "danger";
  const ratio = participants / capacity;
  if (ratio >= 1) return "danger";
  if (ratio >= 0.8) return "warning";
  return "success";
};

function OrganizerDashboard() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { confirm } = useModal();
  const [eventList, setEvents] = useState(() =>
    eventsCatalogue.map((event) => ({
      ...event,
      participants: getRegistrationCount(event.id),
      status: getStatus(event),
    }))
  );

  useEffect(() => {
    const refresh = () => {
      setEvents(
        eventsCatalogue.map((event) => ({
          ...event,
          participants: getRegistrationCount(event.id),
          status: getStatus(event),
        }))
      );
    };
    refresh();
    if (typeof window === "undefined") return undefined;
    const handleStorage = ({ key }) => {
      if (key === "eventRegistrations") {
        refresh();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const metrics = useMemo(() => {
    const total = eventList.length;
    const totalRegistrations = eventList.reduce(
      (sum, event) => sum + event.participants,
      0
    );
    const nearCapacity = eventList.filter(
      (event) => capacityTone(event.participants, event.capacity) !== "success"
    ).length;
    const past = eventList.filter((event) => event.status === "past").length;
    return {
      total,
      totalRegistrations,
      nearCapacity,
      past,
    };
  }, [eventList]);

  const upcomingEvents = eventList.filter(
    (event) => event.status === "upcoming" || event.status === "live"
  );
  const pastEvents = eventList.filter((event) => event.status === "past");

  const handleDelete = async (id) => {
    const targetEvent = eventList.find((event) => event.id === id);
    const approved = await confirm({
      title: `Delete ${targetEvent?.name || "this event"}?`,
      description:
        "Attendees will lose their registration and the event will be removed from listings.",
      confirmLabel: "Delete event",
      cancelLabel: "Keep event",
      tone: "danger",
      size: "md",
      render: () =>
        targetEvent ? (
          <div className="modal-details">
            <p>
              Are you sure you want to remove <strong>{targetEvent.name}</strong>?
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
        title: "Event deleted",
        message: `"${deletedName}" has been removed.`,
        tone: "info",
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/organizer/edit-event/${id}`);
  };

  return (
    <div className="organizer-page">
      <div className="organizer-dashboard">
        <section className="organizer-hero">
          <div>
            <h1>My Events</h1>
            <p>
              Track performance, manage live events, and keep an eye on capacity
              in one place.
            </p>
          </div>
          <Link to="/organizer/create-event" className="btn btn--primary">
            + Create Event
          </Link>
        </section>

        <section className="organizer-metrics">
          <article>
            <span>Total Events</span>
            <strong>{metrics.total}</strong>
          </article>
          <article>
            <span>Total Registrations</span>
            <strong>{metrics.totalRegistrations}</strong>
          </article>
          <article>
            <span>Near Capacity</span>
            <strong>{metrics.nearCapacity}</strong>
          </article>
          <article>
            <span>Past Events</span>
            <strong>{metrics.past}</strong>
          </article>
        </section>

        <section className="organizer-section">
          <header className="organizer-section__header">
            <h2>Upcoming & Live</h2>
          </header>
          {upcomingEvents.length ? (
            <div className="organizer-grid">
              {upcomingEvents.map((event) => {
                const tone = capacityTone(event.participants, event.capacity);
                return (
                  <article className="organizer-event-card" key={event.id}>
                    <div className="organizer-event-card__header">
                      <h3>{event.name}</h3>
                      <span className={`badge badge--${tone}`}>
                        {tone === "danger"
                          ? "At Capacity"
                          : tone === "warning"
                          ? "Limited"
                          : "Open"}
                      </span>
                    </div>
                    <p className="organizer-event-card__date">
                      📅 {event.date} &nbsp; • &nbsp; 📍 {event.location}
                    </p>
                    <p className="organizer-event-card__description">
                      {event.description}
                    </p>
                    <div className="organizer-event-card__capacity">
                      <span>
                        {event.participants}/{event.capacity} registered
                      </span>
                      <div className="capacity-meter">
                        <div
                          className={`capacity-meter__fill capacity-meter__fill--${tone}`}
                          style={{
                            width: `${Math.min(
                              (event.participants / event.capacity) * 100,
                              100
                            ).toFixed(2)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <footer>
                      <Link
                        to={`/organizer/events/${event.id}`}
                        className="btn btn--secondary"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => handleEdit(event.id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </button>
                    </footer>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="organizer-empty">
              <p>No upcoming events. Create one to get started.</p>
            </div>
          )}
        </section>

        <section className="organizer-section">
          <header className="organizer-section__header">
            <h2>Past Events</h2>
          </header>
          {pastEvents.length ? (
            <div className="organizer-grid organizer-grid--past">
              {pastEvents.map((event) => (
                <article className="organizer-event-card past" key={event.id}>
                  <div className="organizer-event-card__header">
                    <h3>{event.name}</h3>
                    <span className="badge badge--neutral">Past</span>
                  </div>
                  <p className="organizer-event-card__date">
                    📅 {event.date} &nbsp; • &nbsp; 📍 {event.location}
                  </p>
                  <p className="organizer-event-card__description">
                    {event.description}
                  </p>
                  <div className="organizer-event-card__capacity">
                    <span>
                      {event.participants}/{event.capacity} attended
                    </span>
                  </div>
                  <footer>
                    <Link
                      to={`/organizer/events/${event.id}`}
                      className="btn btn--secondary"
                    >
                      View Summary
                    </Link>
                  </footer>
                </article>
              ))}
            </div>
          ) : (
            <div className="organizer-empty">
              <p>No past events yet. They will appear here after completion.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default OrganizerDashboard;
