import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/user.css";
import { useToast } from "../context/ToastContext";
import ReturnButton from "../components/ReturnButton";

function Register() {
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { push } = useToast();

  // Handle register form submit
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Collect all registration data
      const userData = {
        firstName,
        lastName,
        username,
        email,
        studentId,
        phone,
        password,
      };

      console.log("Registering user:", userData);

      // TODO: Replace with real API call
      // await fetch("/api/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(userData),
      // });

      // Simulate successful registration
      push({
        title: "Account created",
        message: "Please sign in to continue.",
        tone: "success",
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      push({
        title: "Registration failed",
        message: "Please try again.",
        tone: "danger",
      });
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <ReturnButton fallback="/login" />
        <h1>Register Account</h1>

        {/* Register form */}
        <form onSubmit={handleRegister}>
          {/* First Name */}
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Username */}
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Student ID */}
          <div className="form-group">
            <label>Student ID:</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0412 345 678"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="form-btn">
            Register
          </button>
        </form>

        {/* Link to login page */}
        <p>
          Already have an account?{" "}
          <Link to="/login" className="form-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
