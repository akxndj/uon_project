import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/user.css";
/* import { getEventById } from "../data/events";
import {
  getRegistrationCount,
  isUserRegistered,
  registerUser,
} from "../utils/registrationStorage"; */
import { useToast } from "../context/ToastContext";
import ReturnButton from "../components/ReturnButton";

const getUserId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("user");
};

function Registration() {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registrationCount, setRegistrationCount] = useState(0);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const navigate = useNavigate();
  const { id: eventId } = useParams(); // Get eventId from URL (e.g., /register/:id)
  const userId = useMemo(() => getUserId(), []);
  //const event = useMemo(() => getEventById(eventId), [eventId]);
  const [event, setEvent] = useState(null);
  
  const { push } = useToast();
  const fallbackPath = event ? `/events/${event.id}` : "/home";

  /* useEffect(() => {
    if (!event) return;
    setRegistrationCount(getRegistrationCount(event.id));
    if (userId) {
      setAlreadyRegistered(isUserRegistered(userId, event.id));
    }
  }, [event, userId]); */
  useEffect(() => {
      const fetchEvent = async () => {
        try {
          const res = await fetch(`http://localhost:9999/api/events/${eventId}`);
          if (!res.ok) throw new Error("Event not found");
          const data = await res.json();
          setEvent(data);
        } catch (err) {
          console.error(err);
          setEvent(null);
        }
      };
  
      fetchEvent();
    }, [eventId]);

    useEffect(() => {
      const fetchRegistration = async () => {
      try {
        const res = await fetch(
          `http://localhost:9999/api/registrations/${eventId}`
        );

        if (!res.ok) return;

        const data = await res.json();

        setRegistrationCount(data.registeredAttendees);
        setAlreadyRegistered(data.attendees.includes(userId));

      } catch (err) {
        console.error("Error fetching registration:", err);
      }
    };

    fetchRegistration();
  }, [eventId, userId]);

  useEffect(() => {
    if (!success) return;
    const redirect = setTimeout(() => navigate("/user"), 3000);
    return () => clearTimeout(redirect);
  }, [success, navigate]);

  if (!event) {
    return (
      <div className="registration-shell page-shell">
        <ReturnButton fallback={fallbackPath} />
        <div className="registration-card">
          <h1>Event not found</h1>
          <p>The event you are trying to register for does not exist.</p>
        </div>
      </div>
    );
  }

  const isFull = registrationCount >= event.capacity;

  // Handle event registration
  /* const handleRegister = async () => {
    try {
      const result = registerUser(userId, event.id, event.capacity);
      if (!result.success) {
        const reason =
          result.reason === "already-registered"
            ? "You have already registered for this event."
            : result.reason === "capacity-reached"
            ? "Registration is closed because the event is at maximum capacity."
            : "We could not process your registration.";
        setErrorMessage(reason);
        return;
      }

      setErrorMessage("");
      setSuccess(true);
      setRegistrationCount(getRegistrationCount(event.id));
      setAlreadyRegistered(true);
      push({
        title: "Registration confirmed",
        message: `${event.name} has been added to your events.`,
        tone: "success",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      push({
        title: "Registration failed",
        message: "Something went wrong. Please try again.",
        tone: "danger",
      });
    }
  }; */
  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:9999/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Registration failed");
        return;
      }

      setSuccess(true);
      setRegistrationCount(data.registration.registeredAttendees);
      setAlreadyRegistered(true);

      push({
        title: "Registration confirmed",
        message: `${event.name} has been added to your events.`,
        tone: "success",
      });

    } catch (error) {
      console.error("Registration failed:", error);
      push({
        title: "Registration failed",
        message: "Something went wrong. Please try again.",
        tone: "danger",
      });
    }
  };

  return (
    <div className="registration-shell page-shell">
      <ReturnButton fallback={fallbackPath} />

      <header className="registration-hero">
        <div>
          <p className="registration-kicker">Event Registration</p>
          <h1>{event.name}</h1>
          <p className="registration-summary">
            Reserve your seat in seconds. Your registration will appear in your
            dashboard automatically.
          </p>
        </div>
        <div className="registration-meta">
          <div>
            <span>Date</span>
            <strong>{event.date}</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{event.location}</strong>
          </div>
        </div>
      </header>

      <div className="registration-grid">
        <section className="registration-card">
          <h2>Registration Status</h2>
          <div className="registration-stats">
            <div>
              <span>Capacity</span>
              <strong>{event.capacity}</strong>
            </div>
            <div>
              <span>Registered</span>
              <strong>{registrationCount}</strong>
            </div>
            <div>
              <span>Availability</span>
              <strong>{isFull ? "Full" : "Open"}</strong>
            </div>
          </div>

          {alreadyRegistered && (
            <p className="capacity-message success">
              You are already registered for this event.
            </p>
          )}
          {!alreadyRegistered && isFull && (
            <p className="capacity-message warning">
              Registration is closed because the event is full.
            </p>
          )}
          {errorMessage && (
            <p className="capacity-message warning">{errorMessage}</p>
          )}

          <button
            onClick={handleRegister}
            className="form-btn"
            disabled={alreadyRegistered || isFull}
          >
            Confirm Registration
          </button>
        </section>

        <section className="registration-card registration-card--secondary">
          {!success ? (
            <>
              <h2>What happens next</h2>
              <ul className="registration-list">
                <li>Your spot is saved instantly.</li>
                <li>You can view or cancel in the My Events dashboard.</li>
                <li>We will remind you before the event starts.</li>
              </ul>
            </>
          ) : (
            <div className="registration-success">
              <h2>Registration Successful!</h2>
              <p>You have successfully registered for this event.</p>
              <p>Redirecting to your dashboard...</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Registration;
