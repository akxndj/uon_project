import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/user.css";

function Registration() {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id: eventId } = useParams(); // Get eventId from URL (e.g., /register/:id)
  const userId = localStorage.getItem("userId") || "12345"; // Mock userId

  // Handle event registration
  const handleRegister = async () => {
    try {
      console.log("Registering:", { userId, eventId });
      setSuccess(true);
      setTimeout(() => navigate("/user"), 3000);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        {!success ? (
          <>
            <h1>Event Registration</h1>
            <p>Click the button below to register for this event.</p>
            <button onClick={handleRegister} className="form-btn">
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
