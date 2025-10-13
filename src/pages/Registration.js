import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/user.css";
import { getEventById } from "../data/events";
import {
  getRegistrationCount,
  isUserRegistered,
  registerUser,
} from "../utils/registrationStorage";
import { useToast } from "../context/ToastContext";

const getUserId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("userId") || "12345";
};

function Registration() {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registrationCount, setRegistrationCount] = useState(0);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const navigate = useNavigate();
  const { id: eventId } = useParams(); // Get eventId from URL (e.g., /register/:id)
  const userId = useMemo(() => getUserId(), []);
  const event = useMemo(() => getEventById(eventId), [eventId]);
  const { push } = useToast();

  useEffect(() => {
    if (!event) return;
    setRegistrationCount(getRegistrationCount(event.id));
    if (userId) {
      setAlreadyRegistered(isUserRegistered(userId, event.id));
    }
  }, [event, userId]);

  useEffect(() => {
    if (!success) return;
    const redirect = setTimeout(() => navigate("/user"), 3000);
    return () => clearTimeout(redirect);
  }, [success, navigate]);

  if (!event) {
    return (
      <div className="form-container">
        <div className="form-card">
          <h1>Event not found</h1>
          <p>The event you are trying to register for does not exist.</p>
        </div>
      </div>
    );
  }

  const isFull = registrationCount >= event.capacity;

  // Handle event registration
  const handleRegister = async () => {
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
  };

  return (
    <div className="form-container">
      <div className="form-card">
        {!success ? (
          <>
            <h1>Event Registration</h1>
            <h2>{event.name}</h2>
            <p>
              <strong>Date:</strong> {event.date}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Maximum Capacity:</strong> {event.capacity}
            </p>
            <p>
              <strong>Currently Registered:</strong> {registrationCount}
            </p>
            {alreadyRegistered && (
              <p className="capacity-message">
                You have already registered for this event.
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
          </>
        ) : (
          <>
            <h2>Registration Successful!</h2>
            <p>You have successfully registered for this event.</p>
            <p>Redirecting to your dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Registration;
