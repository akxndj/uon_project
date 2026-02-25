import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user.css";
import ReturnButton from "../components/ReturnButton";

/**
 * Frontend MOCK switch
 * true  = use mock login (NO backend / NO MongoDB)
 * false = use real backend API
 */
const USE_MOCK = true;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    //MOCK LOGIN (Frontend Only)

    if (USE_MOCK) {
      const mockUser = {
        id: "u1",
        email: email || "mock@test.com",
        name: "Mock User",
        role: "organizer",
      };

      localStorage.setItem("token", "mock-token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("role", mockUser.role);

      console.log("MOCK LOGIN:", mockUser);

      // Redirect based on role (optional)
      if (mockUser.role === "admin") navigate("/admin");
      else if (mockUser.role === "organizer") navigate("/organizer");
      else navigate("/home");

      return;
    }

    /* =========================
       REAL BACKEND LOGIN
       ========================= */
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login Failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user?.role || "user");

      alert("Login Successful");

      if (data.user?.role === "admin") navigate("/admin");
      else if (data.user?.role === "organizer") navigate("/organizer");
      else navigate("/home");

    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <ReturnButton fallback="/home" />
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@test.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="any password"
              required
            />
          </div>

          <button type="submit" className="form-btn">
            Login
          </button>
        </form>

        {USE_MOCK && (
          <p style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
            MOCK MODE ENABLED (Frontend only)
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
