import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user.css";

function Login() {
  // Username and password state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle login form submit
  const handleLogin = (e) => {
    e.preventDefault();

    let role = "user"; // Default role is user
    if (username === "admin") role = "admin";
    else if (username === "organizer") role = "organizer";

    // Save role in localStorage
    localStorage.setItem("role", role);

    // Redirect based on role
    if (role === "admin") navigate("/admin");
    else if (role === "organizer") navigate("/organizer");
    else navigate("/home"); // Normal user goes to Home page
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Login</h1>

        {/* Login form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
