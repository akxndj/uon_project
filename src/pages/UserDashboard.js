import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/user.css";
import defaultPic from "../assets/defaultPic.png";
/* import { getEventById } from "../data/events";
import {
  cancelRegistration as cancelStoredRegistration,
  getUserRegistrations,
  getRegistrationCount,
} from "../utils/registrationStorage"; */
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
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.studentId || null;
};

function UserDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const userId = useMemo(() => getUserId(), []);
  const { push } = useToast();
  const { confirm } = useModal();

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:9999/api/registrations");
      const data = await response.json();

     const userEvents = data
      .filter((reg) =>
      reg.attendees.some((att) => att.studentId === userId)
      )
      .map((reg) => reg.eventId);

      
      const eventPromises = userEvents.map((eventId) =>
        fetch(`http://localhost:9999/api/events/${eventId}`).then((res) => res.json())
      );

      const events = await Promise.all(eventPromises);
      setRegistrations(events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const upcoming = registrations.filter((event) => {
    const eventDate = new Date(event.startTime || event.date);
    return eventDate >= new Date();
    
  });

  const past = registrations.filter((event) => {
    const eventDate = new Date(event.endTime || event.date);
    return eventDate < new Date();
  });

  const sortedUpcoming = useMemo(
    () =>
      [...upcoming].sort(
        (a, b) =>
          new Date(a.startTime || a.date) -
          new Date(b.startTime || b.date)
      ),
    [upcoming]
  );

  const nextEvent = sortedUpcoming[0];

  const cancelRegistration = async (event) => {
  if (!userId) return;

  const approved = await confirm({
    title: `Cancel ${event.name}?`,
    description: "You'll lose your seat and may need to re-register if spots remain.",
    confirmLabel: "Cancel registration",
    cancelLabel: "Keep my seat",
    tone: "warning",
    size: "sm",
  });

  if (!approved) return;

  try {
    const response = await fetch(
      `http://localhost:9999/api/registrations/${event._id}`,
      {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }


    fetchEvents();

    push({
      title: "Registration cancelled",
      message: `You are no longer attending ${event.name}.`,
      tone: "info",
    });

  } catch (err) {
    push({
      title: "Error",
      message: err.message || "Failed to cancel registration",
      tone: "error",
    });
  }
  };

  const handleShare = async (event) => {
    const shareData = {
      title: event.name,
      text: event.description,
      url: `${window.location.origin}/events/${event._id}`,
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

    const ICS = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//UoN Event Platform//EN\nBEGIN:VEVENT\nUID:${event._id}@uon.edu.au\nDTSTAMP:${toICSDate(
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

      <section className="user-metrics">
        <article>
          <span>Upcoming</span>
          <strong>{upcoming.length}</strong>
        </article>
        <article>
          <span>Past</span>
          <strong>{past.length}</strong>
        </article>
        <article>
          <span>Total</span>
          <strong>{registrations.length}</strong>
        </article>
      </section>

      <section className="user-highlight">
        <div>
          <h2>Next Up</h2>
          {nextEvent ? (
            <>
              <p className="user-highlight__title">{nextEvent.name}</p>
              <p className="user-highlight__meta">
                📅 {nextEvent.date} &nbsp; • &nbsp; 📍 {nextEvent.location}
              </p>
              <div className="user-highlight__actions">
                <Link
                  to={`/events/${nextEvent._id}`}
                  className="btn btn--secondary"
                >
                  View Details
                </Link>
                <button
                  type="button"
                  className="btn btn--info"
                  onClick={() => addToCalendar(nextEvent)}
                >
                  Add to Calendar
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => handleShare(nextEvent)}
                >
                  Share
                </button>
              </div>
            </>
          ) : (
            <div className="user-empty">
              <p>You don't have any upcoming registrations yet.</p>
              <Link to="/home" className="btn btn--primary">
                Discover Events
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="user-section">
        <h2>Upcoming</h2>
        {upcoming.length ? (
          <div className="user-grid">
            {upcoming.map((event) => {
              const tone = capacityTone(
                event.registered,
                event.capacity
              );
              return (
                <article className="user-card" key={event._id}>
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
                        {event.registered}/{event.capacity} attending
                      </span>
                      <div className="capacity-meter">
                        <div
                          className={`capacity-meter__fill capacity-meter__fill--${tone}`}
                          style={{
                            width: `${Math.min(
                              (event.registered / event.capacity) *
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
                      to={`/events/${event._id}`}
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
                   {<button
                      type="button"
                      className="btn btn--danger"
                      onClick={() => cancelRegistration(event)}
                    >
                      Cancel Registration
                    </button> }
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
