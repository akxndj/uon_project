import React, { useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import schoolLogo from "../assets/schoolLogo.png";
import "./Navbar.css";

const roleHierarchy = {
  guest: [],
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

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");
  const isLoggedIn = !!role;
  const currentRole = role || "guest";

  const links = useMemo(() => {
    if (!isLoggedIn) {
      return navConfig.guest;
    }

    const capabilities = roleHierarchy[currentRole] || [];

    let combined = [];

    capabilities.forEach((r) => {
      if (navConfig[r]) {
        combined = [...combined, ...navConfig[r]];
      }
    });

    return Array.from(
      new Map(combined.map((item) => [item.to, item])).values()
    );
  }, [currentRole, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="site-header">
      <div className="page-shell site-header__inner">
        <div className="site-header__brand">
          <img src={schoolLogo} alt="logo" />
          <span className="brand-name">Event Platform</span>
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
          {isLoggedIn && (
            <button className="btn btn--ghost" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;