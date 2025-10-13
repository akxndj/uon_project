import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/user.css";
import defaultPic from "../assets/defaultPic.png";
import { getEventById } from "../data/events";
import {
  cancelRegistration as cancelStoredRegistration,
  getUserRegistrations,
  getRegistrationCount,
} from "../utils/registrationStorage";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

const capacityTone = (registrations, capacity) => {
  if (!capacity) return "danger";
  const ratio = registrations / capacity;
  if (ratio >= 1) return "danger";
  if (ratio >= 0.8) return "warning";
  return "success";
};

const getUserId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("userId") || "12345";
};

function UserDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const userId = useMemo(() => getUserId(), []);
  const { push } = useToast();
  const { confirm } = useModal();

  const loadRegistrations = () => {
    if (!userId) {
      setRegistrations([]);
      return;
    }

    const eventIds = getUserRegistrations(userId);
    const detailedEvents = eventIds
      .map((eventId) => getEventById(eventId))
      .filter(Boolean)
      .map((event) => ({
        ...event,
        registrationCount: getRegistrationCount(event.id),
      }));
    setRegistrations(detailedEvents);
  };

  useEffect(() => {
    loadRegistrations();
    if (typeof window === "undefined") return undefined;
    // Re-run when storage updates via other tabs
    const handleStorage = ({ key }) => {
      if (key === "eventRegistrations") {
        loadRegistrations();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const upcoming = registrations.filter((event) => {
    const eventDate = new Date(event.startTime || `${event.date}T09:00`);
    return eventDate >= new Date();
  });

  const past = registrations.filter((event) => {
    const eventDate = new Date(event.endTime || event.date);
    return eventDate < new Date();
  });

  const cancelRegistration = async (event) => {
    if (!userId) return;
    const approved = await confirm({
      title: `Cancel ${event.name}?`,
      description: "You'll lose your seat and may need to re-register if spots remain.",
      confirmLabel: "Cancel registration",
      cancelLabel: "Keep my seat",
      tone: "warning",
      size: "sm",
      render: () => (
        <div className="modal-details">
          <p>
            Are you sure you want to cancel your registration for{" "}
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
              <span>Currently Registered:</span> {event.registrationCount}
            </li>
          </ul>
        </div>
      ),
    });

    if (!approved) return;

    cancelStoredRegistration(userId, event.id);
    loadRegistrations();
    push({
      title: "Registration cancelled",
      message: `You are no longer attending ${event.name}.`,
      tone: "info",
    });
  };

  const handleShare = async (event) => {
    const shareData = {
      title: event.name,
      text: event.description,
      url: `${window.location.origin}/events/${event.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Share cancelled", error);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      push({
        title: "Link copied",
        message: "Event link ready to share.",
        tone: "info",
      });
    } catch (error) {
      push({
        title: "Unable to copy",
        message: "Please copy the URL manually.",
        tone: "danger",
      });
    }
  };

  const addToCalendar = (event) => {
    const start = new Date(event.startTime || `${event.date}T09:00`);
    const end = new Date(event.endTime || `${event.date}T11:00`);

    const pad = (value) => value.toString().padStart(2, "0");
    const toICSDate = (date) =>
      `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
        date.getUTCDate()
      )}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;

    const ICS = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//UoN Event Platform//EN\nBEGIN:VEVENT\nUID:${event.id}@uon.edu.au\nDTSTAMP:${toICSDate(
      new Date()
    )}\nDTSTART:${toICSDate(start)}\nDTEND:${toICSDate(
      end
    )}\nSUMMARY:${event.name}\nDESCRIPTION:${event.description}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;

    const blob = new Blob([ICS], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.name.replace(/\s+/g, "-")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    push({
      title: "Calendar downloaded",
      message: "Import the .ics file to add this event to your calendar.",
      tone: "success",
    });
  };

  return (
    <div className="user-dashboard page-shell">
      <header className="user-dashboard__header">
        <div>
          <h1>My Events</h1>
          <p>Keep track of upcoming registrations and revisit past sessions.</p>
        </div>
        <Link to="/home" className="btn btn--secondary">
          Browse Events
        </Link>
      </header>

      <section className="user-section">
        <h2>Upcoming</h2>
        {upcoming.length ? (
          <div className="user-grid">
            {upcoming.map((event) => {
              const tone = capacityTone(
                event.registrationCount,
                event.capacity
              );
              return (
                <article className="user-card" key={event.id}>
                  <div className="user-card__media">
                    <img src={event.image || defaultPic} alt={event.name} />
                    <span className={`badge badge--${tone}`}>
                      {tone === "danger"
                        ? "At Capacity"
                        : tone === "warning"
                        ? "Limited"
                        : "Registered"}
                    </span>
                  </div>
                  <div className="user-card__body">
                    <h3>{event.name}</h3>
                    <p className="user-card__meta">
                      📅 {event.date} &nbsp; • &nbsp; 📍 {event.location}
                    </p>
                    <p className="user-card__description">
                      {event.description}
                    </p>
                    <div className="user-card__capacity">
                      <span>
                        {event.registrationCount}/{event.capacity} attending
                      </span>
                      <div className="capacity-meter">
                        <div
                          className={`capacity-meter__fill capacity-meter__fill--${tone}`}
                          style={{
                            width: `${Math.min(
                              (event.registrationCount / event.capacity) *
                                100,
                              100
                            ).toFixed(2)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <footer className="user-card__actions">
                    <Link
                      to={`/events/${event.id}`}
                      className="btn btn--secondary"
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      className="btn btn--info"
                      onClick={() => addToCalendar(event)}
                    >
                      Add to Calendar
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => handleShare(event)}
                    >
                      Share
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger"
                      onClick={() => cancelRegistration(event)}
                    >
                      Cancel Registration
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="user-empty">
            <p>You haven't registered for any upcoming events.</p>
            <Link to="/home" className="btn btn--primary">
              Discover Events
            </Link>
          </div>
        )}
      </section>

      <section className="user-section">
        <h2>Past Events</h2>
        {past.length ? (
          <div className="user-grid">
            {past.map((event) => (
              <article className="user-card past" key={event.id}>
                <div className="user-card__media">
                  <img src={event.image || defaultPic} alt={event.name} />
                  <span className="badge badge--neutral">Past</span>
                </div>
                <div className="user-card__body">
                  <h3>{event.name}</h3>
                  <p className="user-card__meta">
                    📅 {event.date} &nbsp; • &nbsp; 📍 {event.location}
                  </p>
                  <p className="user-card__description">
                    {event.description}
                  </p>
                </div>
                <footer className="user-card__actions">
                  <Link to={`/events/${event.id}`} className="btn btn--ghost">
                    View Details
                  </Link>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <div className="user-empty">
            <p>Past events you attend will show up here for easy reference.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default UserDashboard;
