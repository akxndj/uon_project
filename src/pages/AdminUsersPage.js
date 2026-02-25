import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";

const roleOrder = ["user", "organizer", "admin"];

const normalizeRoles = (roles) => {
  const unique = Array.from(new Set(roles));
  if (!unique.includes("user")) unique.push("user");
  if (unique.includes("admin") && !unique.includes("organizer")) {
    unique.push("organizer");
  }
  return roleOrder.filter((role) => unique.includes(role));
};

function AdminUsersPage() {
  // Fake data (can be replaced with API later)
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", roles: ["user"] },
    { id: 2, name: "Bob", roles: ["user", "organizer"] },
    { id: 3, name: "Charlie", roles: ["user"] },
    { id: 4, name: "Diana", roles: ["user", "organizer"] },
    { id: 5, name: "Ethan", roles: ["user", "organizer", "admin"] },
    { id: 6, name: "Fiona", roles: ["user"] },
  ]);
  const { push } = useToast();
  const { confirm } = useModal();

  const toggleRole = (id, role, enabled) => {
    const updatedUsers = users.map((user) => {
      if (user.id !== id) return user;
      const current = normalizeRoles(user.roles || []);
      let next = current;
      if (role === "user") {
        next = current;
      } else if (enabled) {
        next = normalizeRoles([...current, role]);
      } else {
        next = current.filter((r) => r !== role);
        next = normalizeRoles(next);
      }
      return { ...user, roles: next };
    });

    setUsers(updatedUsers);
    const updatedUser = updatedUsers.find((user) => user.id === id);
    const rolesLabel = updatedUser?.roles?.join(", ") || "user";
    push({
      title: "Roles updated",
      message: `${updatedUser?.name || "User"} now has ${rolesLabel} access.`,
      tone: "success",
    });
  };

  const normalizedUsers = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        roles: normalizeRoles(user.roles || []),
      })),
    [users]
  );

  // Handle delete
  const handleDelete = async (id) => {
    const target = users.find((user) => user.id === id);
    const approved = await confirm({
      title: "Delete user?",
      body: (
        <p>
          Are you sure you want to remove{" "}
          <strong>{target?.name || "this user"}</strong>? They will lose access
          immediately.
        </p>
      ),
      confirmLabel: "Delete user",
      cancelLabel: "Cancel",
      tone: "danger",
    });

    if (!approved) return;

    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    push({
      title: "User deleted",
      message: target ? `${target.name} has been removed.` : "User removed.",
      tone: "info",
    });
  };

  return (
    <div className="admin-dashboard">
      {/* Main container */}
      <div className="admin-section">
        <h1 className="admin-title">Manage Users</h1>
        <p className="admin-subtitle">
          Each account includes user access. Organizer adds event creation, and
          admin includes all permissions.
        </p>

        <div className="admin-list">
          {normalizedUsers.map((user) => (
            <div className="admin-card" key={user.id}>
              <div className="admin-card__identity">
                <strong>{user.name}</strong>
                <div className="role-list">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className={`role-chip role-chip--${role}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="admin-buttons">
                <div className="admin-role-group">
                  <label className="role-toggle">
                    <input type="checkbox" checked disabled />
                    User
                  </label>
                  <label className="role-toggle">
                    <input
                      type="checkbox"
                      checked={user.roles.includes("organizer")}
                      onChange={(event) =>
                        toggleRole(user.id, "organizer", event.target.checked)
                      }
                    />
                    Organizer
                  </label>
                  <label className="role-toggle">
                    <input
                      type="checkbox"
                      checked={user.roles.includes("admin")}
                      onChange={(event) =>
                        toggleRole(user.id, "admin", event.target.checked)
                      }
                    />
                    Admin
                  </label>
                </div>

                {/* Delete button */}
                <button
                  className="admin-btn danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Back button */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/admin" className="view-all-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;
