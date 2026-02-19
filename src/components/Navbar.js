import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import schoolLogo from "../assets/schoolLogo.png";
import "./Navbar.css";

const roleCapabilities = {
  user: ["user"],
  organizer: ["user", "organizer"],
  admin: ["user", "organizer", "admin"],
};

const navConfig = {
  guest: [
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register-account" },
  ],
  user: [
    { label: "Home", to: "/home" },
    { label: "Attending", to: "/user" },
  ],
  organizer: [
    { label: "My Events", to: "/organizer" },
  ],
  admin: [
    { label: "Admin Panel", to: "/admin" },
    { label: "All Events", to: "/admin/events" },
    { label: "Manage Users", to: "/admin/users" },
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

  const roles = useMemo(() => {
    return roleCapabilities[role] || [];
  }, [role]);

  /* admin > organizer > user */
  const activeRole = useMemo(() => {
    if (roles.includes("admin")) return "admin";
    if (roles.includes("organizer")) return "organizer";
    if (roles.includes("user")) return "user";
    return "guest";
  }, [roles]);

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

    let combined = [];

    roles.forEach((r) => {
      if (navConfig[r]) {
        combined = [...combined, ...navConfig[r]];
      }
    });

    return Array.from(
      new Map(combined.map((item) => [item.to, item])).values()
    );
  }, [roles, role]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    setRole(null);
    navigate("/login");
  };

  const headerClass = `site-header ${roleThemes[activeRole]}`;

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

        <nav className="site-header__nav">
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
          {roles.includes("organizer") && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate("/organizer/create-event")}
            >
              Create Event
            </button>
          )}

          {role && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
