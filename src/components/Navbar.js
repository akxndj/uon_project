import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import schoolLogo from "../assets/schoolLogo.png";

function Navbar() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  // keep checking role in localStorage (so nav updates when login/logout)
  useEffect(() => {
    const checkRole = () => setRole(localStorage.getItem("role"));
    const interval = setInterval(checkRole, 500);
    return () => clearInterval(interval);
  }, []);

  // logout: clear role + go back to login page
  const handleLogout = () => {
    localStorage.removeItem("role");
    setRole(null);
    navigate("/login");
  };

  // navbar background color depends on role
  const getNavStyle = (role) => {
    let bgColor = "#1976d2"; // default blue
    if (role === "admin") bgColor = "#2e7d32"; // green for admin
    if (role === "organizer") bgColor = "#f57c00"; // orange for organizer

    return {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "5px 15px",
      backgroundColor: bgColor,
      color: "white",
    };
  };

  return (
    <nav style={getNavStyle(role)}>
      {/* Logo and app name */}
      <div style={styles.brand}>
        <img src={schoolLogo} alt="logo" style={{ height: "50px" }} />
        <h2 style={styles.logoText}>UoN Event Platform</h2>
      </div>

      {/* Different links based on role */}
      <div style={styles.links}>
        {!role && (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register-account" style={styles.link}>
              Register
            </Link>
          </>
        )}

        {role === "user" && (
          <>
            <Link to="/home" style={styles.link}>
              Home
            </Link>
            <Link to="/user" style={styles.link}>
              User Dashboard
            </Link>
            <button onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          </>
        )}

        {role === "organizer" && (
          <>
            <Link to="/organizer" style={styles.link}>
              Organizer Dashboard
            </Link>
            <button onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          </>
        )}

        {role === "admin" && (
          <>
            <Link to="/admin" style={styles.link}>
              Admin Dashboard
            </Link>
            <button onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

// some css styles
const styles = {
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoImg: {
    height: "80px",
    width: "80px",
  },
  logoText: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  logout: {
    background: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Navbar;
