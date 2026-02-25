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
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", roles: ["user"] },
    { id: 2, name: "Bob", roles: ["user", "organizer"] },
    { id: 3, name: "Charlie", roles: ["user"] },
    { id: 4, name: "Diana", roles: ["user", "organizer"] },
    { id: 5, name: "Ethan", roles: ["user", "organizer", "admin"] },
    { id: 6, name: "Fiona", roles: ["user"] },
    { id: 7, name: "Grace", roles: ["user"] },
    { id: 8, name: "Henry", roles: ["user"] },
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
    push({
      title: "Roles updated",
      message: `${updatedUser?.name} now has ${updatedUser?.roles.join(", ")} access.`,
      tone: "success",
    });
  };

  const handleDelete = async (id) => {
    const target = users.find((user) => user.id === id);

    const approved = await confirm({
      title: "Delete user?",
      body: (
        <p>
          Are you sure you want to remove{" "}
          <strong>{target?.name}</strong>? They will lose access immediately.
        </p>
      ),
      confirmLabel: "Delete user",
      cancelLabel: "Cancel",
      tone: "danger",
    });

    if (!approved) return;

    setUsers(users.filter((user) => user.id !== id));

    push({
      title: "User deleted",
      message: `${target?.name} has been removed.`,
      tone: "info",
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

  return (
    <div className="admin-dashboard">
      <div className="admin-section">

        {/* 固定 Header */}
        <div className="admin-header">
          <h1 className="admin-title">Manage Users</h1>
          <p className="admin-subtitle">
            Each account includes user access. Organizer adds event creation, 
            and admin includes all permissions.
          </p>
        </div>

        {/* 可滚动区域 */}
        <div className="admin-list-scroll">
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
                        onChange={(e) =>
                          toggleRole(user.id, "organizer", e.target.checked)
                        }
                      />
                      Organizer
                    </label>

                    <label className="role-toggle">
                      <input
                        type="checkbox"
                        checked={user.roles.includes("admin")}
                        onChange={(e) =>
                          toggleRole(user.id, "admin", e.target.checked)
                        }
                      />
                      Admin
                    </label>
                  </div>

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
        </div>

        {/* 固定 Footer */}
        <div className="admin-footer">
          <Link to="/admin" className="view-all-btn">
            Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AdminUsersPage;