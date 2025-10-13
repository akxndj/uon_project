import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/user.css";
import "../styles/eventDetails.css";
import { getEventById } from "../data/events";
import defaultPic from "../assets/defaultPic.png";
import {
  getRegistrationCount,
  isUserRegistered,
} from "../utils/registrationStorage";
import { useToast } from "../context/ToastContext";

const getUserId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("userId") || "12345";
};

const getTone = (registered, capacity) => {
  if (!capacity) return "danger";
  if (registered >= capacity) return "danger";
  if (registered / capacity >= 0.75) return "warning";
  return "info";
};

function EventDetails() {
  const { id } = useParams();
  const [registrationCount, setRegistrationCount] = useState(0);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const event = useMemo(() => getEventById(id), [id]);
  const userId = useMemo(() => getUserId(), []);
  const { push } = useToast();

  useEffect(() => {
    if (!event) return;
    setRegistrationCount(getRegistrationCount(event.id));
    if (userId) {
      setAlreadyRegistered(isUserRegistered(userId, event.id));
    }
  }, [event, userId]);

  const availableSpots = event
    ? Math.max(event.capacity - registrationCount, 0)
    : 0;
  const isFull = event ? registrationCount >= event.capacity : false;

  // If no event found
  if (!event) {
    return (
      <div>
        <h2>Event not found</h2>
        {/* Link back to home */}
        <Link to="/home">Back to Home</Link>
      </div>
    );
  }

  const tone = getTone(registrationCount, event.capacity);

  const handleShare = async () => {
    const shareData = {
      title: event.name,
      text: event.description,
      url: window.location.href,
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
      console.error("Clipboard error", error);
      push({
        title: "Unable to copy",
        message: "Please copy the URL manually.",
        tone: "danger",
      });
    }
  };

  const handleAddToCalendar = () => {
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
      title: "Calendar ready",
      message: "Event added to your downloads as an .ics file.",
      tone: "success",
    });
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "agenda", label: "Agenda", hidden: !event.agenda?.length },
    { id: "faq", label: "FAQs", hidden: !event.faq?.length },
    { id: "contact", label: "Contact" },
  ].filter((tab) => !tab.hidden);

  const showMobileCTA = !alreadyRegistered && !isFull;

  return (
    <div className="event-detail-page page-shell">
      <section className="event-hero">
        <div className="event-hero__media" aria-hidden="true">
          <img src={event.image || defaultPic} alt="" />
          <div className="event-hero__overlay" />
        </div>
        <div className="event-hero__content">
          <h1>{event.name}</h1>
          <div className="event-hero__meta">
            <span className="event-hero__meta-item">
              <span aria-hidden="true">📅</span>
              <span>{event.date}</span>
            </span>
            <span className="event-hero__meta-item">
              <span aria-hidden="true">📍</span>
              <span>{event.location}</span>
            </span>
            <span className="event-hero__meta-item">
              <span aria-hidden="true">🎟️</span>
              <span>
                {registrationCount}/{event.capacity} attending
              </span>
            </span>
          </div>
        </div>
      </section>

      <div className="event-detail-layout">
        <section className="event-detail-body">
          <div className="event-detail-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={
                  activeTab === tab.id
                    ? "event-tab event-tab--active"
                    : "event-tab"
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="event-detail-section" role="tabpanel">
              <h3>About this event</h3>
              <p>{event.description}</p>

              <div className="event-detail-grid">
                <div>
                  <h4>Eligibility</h4>
                  <p>{event.eligibility || "Open to all"}</p>
                </div>
                <div>
                  <h4>Fee</h4>
                  <p>{event.fee || "Free"}</p>
                </div>
                <div>
                  <h4>Includes</h4>
                  <p>{event.includes || "Event resources"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "agenda" && event.agenda?.length ? (
            <div className="event-detail-section" role="tabpanel">
              <h3>Agenda</h3>
              <ul className="event-agenda">
                {event.agenda.map((item) => (
                  <li key={`${item.time}-${item.title}`}>
                    <span>{item.time}</span>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {activeTab === "faq" && event.faq?.length ? (
            <div className="event-detail-section" role="tabpanel">
              <h3>Frequently Asked Questions</h3>
              <div className="event-faq">
                {event.faq.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ) : null}

          {activeTab === "contact" && (
            <div className="event-detail-section" role="tabpanel">
              <h3>Contact</h3>
              <p>
                <strong>{event.contact?.name || "Event Team"}</strong>
                <br />
                <a href={`mailto:${event.contact?.email || "events@uon.edu.au"}`}>
                  {event.contact?.email || "events@uon.edu.au"}
                </a>
              </p>
              <p>
                Need to cancel? Head to your dashboard and remove your
                registration so another student can join.
              </p>
            </div>
          )}
        </section>

        <aside className="event-detail-summary">
          <div className="event-summary-header">
            <h2>Event Overview</h2>
            {alreadyRegistered ? (
              <div className="status-banner info">
                You are registered for this event.
              </div>
            ) : isFull ? (
              <div className="status-banner danger">
                This event is at capacity.
              </div>
            ) : (
              <div className="status-banner">
                Spots available — secure your place now.
              </div>
            )}
          </div>

          <div className="event-summary-row">
            <span>Date</span>
            <span>{event.date}</span>
          </div>
          <div className="event-summary-row">
            <span>Location</span>
            <span>{event.location}</span>
          </div>
          <div className="event-summary-row">
            <span>Capacity</span>
            <span>
              {registrationCount}/{event.capacity}
            </span>
          </div>
          <div className="event-summary-progress">
            <span>{availableSpots} spots remaining</span>
            <div className="capacity-meter">
              <div
                className={`capacity-meter__fill capacity-meter__fill--${tone}`}
                style={{
                  width: `${Math.min(
                    event.capacity
                      ? (registrationCount / event.capacity) * 100
                      : 0,
                    100
                  ).toFixed(2)}%`,
                }}
              />
            </div>
          </div>

          <div className="event-summary-actions">
            {!alreadyRegistered && !isFull && (
              <Link to={`/register/${event.id}`} className="btn btn--primary">
                Register Now
              </Link>
            )}
            <button
              type="button"
              className="btn btn--info"
              onClick={handleShare}
            >
              Share Event
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleAddToCalendar}
            >
              Add to Calendar
            </button>
            <Link to="/home" className="btn btn--secondary">
              Back to Home
            </Link>
          </div>
        </aside>
      </div>

      {showMobileCTA && (
        <div className="event-mobile-cta">
          <Link to={`/register/${event.id}`} className="btn btn--primary">
            Register Now
          </Link>
          <button type="button" className="btn btn--ghost" onClick={handleShare}>
            Share
          </button>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
