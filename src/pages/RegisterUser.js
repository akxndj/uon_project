import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/user.css";

function Register() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle register form submit
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // TODO: Replace with real API call
      console.log("Registering user:", { name, email, studentId, password });

      // Simulate successful registration
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register. Try again.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Register Account</h1>

        {/* Register form */}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Student ID:</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

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
