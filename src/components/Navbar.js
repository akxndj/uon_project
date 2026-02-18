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

  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

  // 🔥 模拟通知数据（之后可改成后端 fetch）
  useEffect(() => {
    const demoNotifications = [
      {
        id: 1,
        message: "Your event has been approved",
        sender: "Admin",
        eventTitle: "Tech Conference 2026",
        isRead: false,
      },
      {
        id: 2,
        message: "New user registered for your event",
        sender: "System",
        eventTitle: "AI Workshop",
        isRead: false,
      },
    ];

    setNotifications(demoNotifications);
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

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

          {/* 🔔 通知系统 */}
          <div
            className="notification-wrapper"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="icon-btn">
              🔔
              {unreadCount > 0 && (
                <span className="notification-dot"></span>
              )}
            </button>

            {showDropdown && (
              <div className="notification-dropdown">
                {notifications.length === 0 ? (
                  <div className="notification-empty">
                    No notifications
                  </div>
                ) : (
                  notifications.map(item => (
                    <div
                      key={item.id}
                      className={`notification-item ${
                        item.isRead ? "" : "unread"
                      }`}
                      onMouseEnter={() => markAsRead(item.id)}
                      onClick={() => navigate("/notifications")}
                    >
                      <strong>{item.message}</strong>
                      <div className="notification-meta">
                        From {item.sender} · {item.eventTitle}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

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
