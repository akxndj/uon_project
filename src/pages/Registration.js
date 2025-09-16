import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/user.css";

function Registration() {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id: eventId } = useParams(); // Get eventId from URL (e.g., /register/:id)

  // Get userId from localStorage (mock for now)
  const userId = localStorage.getItem("userId") || "12345"; // Mock userId

  // Handle event registration
  const handleRegister = async () => {
    try {
      // Simulate API call
      console.log("Registering:", { userId, eventId });

      // TODO: Replace with real API call
      // await fetch("/api/registrations", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ userId, eventId }),
      // });

      setSuccess(true);

      // Redirect to User Dashboard after 3 seconds
      setTimeout(() => navigate("/user"), 3000);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div>
      <h1>Event Registration</h1>

      {/* Show registration form if not successful */}
      {!success ? (
        <div>
          <p>Click the button below to register for this event.</p>
          <button onClick={handleRegister}>Confirm Registration</button>
        </div>
      ) : (
        /* Show success message if registered */
        <div>
          <h2>Registration Successful!</h2>
          <p>You have successfully registered for this event.</p>
          <p>Redirecting to your dashboard...</p>
        </div>
      )}
    </div>
  );
}

export default Registration;
