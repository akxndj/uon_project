import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import schoolLogo from "../assets/schoolLogo.png";
import "./Navbar.css";

const navConfig = {
  guest: [
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register-account" },
  ],
  user: [
    { label: "Home", to: "/home" },
    { label: "My Events", to: "/user" },
  ],
  organizer: [
    { label: "Dashboard", to: "/organizer" },
    { label: "My Events", to: "/organizer" },
  ],
  admin: [
    { label: "Dashboard", to: "/admin" },
    { label: "Events", to: "/admin/events" },
    { label: "Users", to: "/admin/users" },
  ],
};

const roleThemes = {
  guest: "site-header--guest",
  user: "site-header--user",
  organizer: "site-header--organizer",
  admin: "site-header--admin",
};

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  useEffect(() => {
    const syncRole = () => setRole(localStorage.getItem("role"));
    syncRole();
    window.addEventListener("storage", syncRole);
    window.addEventListener("focus", syncRole);
    return () => {
      window.removeEventListener("storage", syncRole);
      window.removeEventListener("focus", syncRole);
    };
  }, []);

  const links = useMemo(() => {
    if (!role) return navConfig.guest;
    return navConfig[role] || navConfig.guest;
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    setRole(null);
    navigate("/login");
  };

  const headerClass = `site-header ${
    role ? roleThemes[role] : roleThemes.guest
  }`;

  return (
    <header className={headerClass}>
      <div className="page-shell site-header__inner">
        <div className="site-header__brand">
          <img src={schoolLogo} alt="University of Newcastle" />
          <div className="site-header__branding-copy">
            <span className="brand-kicker">University of Newcastle</span>
            <span className="brand-name">Event Platform</span>
          </div>
        </div>

        <nav className="site-header__nav" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "site-header__link site-header__link--active"
                  : "site-header__link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          {role === "organizer" && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate("/organizer/create-event")}
            >
              Create Event
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            aria-label="Notifications"
            title="Notifications"
          >
            🔔
          </button>
          {role ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
