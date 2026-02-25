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
  <div className="admin-dashboard">
    <div className="admin-section">

      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">{event.name}</h1>
          <p className="admin-subtitle">
            View event details and manage participation.
          </p>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="admin-list-scroll">
        <div className="admin-card">
          
          <div className="admin-card__identity">
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p>
              <strong>Participants:</strong>{" "}
              {registrationCount}/{event.capacity}
            </p>
            <p><strong>Maximum Capacity:</strong> {event.capacity}</p>
            <p><strong>Description:</strong> {event.description}</p>
          </div>

          {/* 操作按钮 */}
          <div className="admin-buttons" style={{ marginTop: "20px" }}>
            <Link
              to={`/organizer/edit-event/${event.id}`}
              className="admin-btn"
            >
              Edit
            </Link>

            <button
              type="button"
              className="admin-btn danger"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="admin-footer">
        <Link to="/organizer" className="view-all-btn">
          Back to Dashboard
        </Link>
      </div>

    </div>
  </div>
  );
}

export default EventDetails;
