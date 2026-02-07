import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user.css";

function Login() {
  // Username and password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:9999/api/login", 
      {method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, password})
      });
    
    const data = await response.json();

    if(!response.ok)
    {
      throw new Error(data.message || "Login Failed")
      
    }

    alert("Login Successful")
    /* let role = "user"; // Default role is user
    if (username === "admin") role = "admin";
    else if (username === "organizer") role = "organizer";

    // Save role in localStorage
    localStorage.setItem("role", role);

    // Redirect based on role
    if (role === "admin") navigate("/admin");
    else if (role === "organizer") navigate("/organizer"); */
    navigate("/home"); // Normal user goes to Home page
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Login</h1>

        {/* Login form */}
        <form onSubmit={handleLogin}>
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
