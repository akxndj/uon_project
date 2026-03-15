import React, { useEffect, useMemo, useState } from "react";
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

  const [users, setUsers] = useState([]);
  const { push } = useToast();
  const { confirm } = useModal();

  useEffect(() => {
    fetch("http://localhost:9999/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);


  // UPDATE USER ROLE
  const toggleRole = async (id, role, enabled) => {

    const newRole = enabled ? role : "user";

    try {

      await fetch(`http://localhost:9999/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: newRole })
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );

      push({
        title: "Role Updated",
        message: `User role changed to ${newRole}`,
        tone: "info"
      });

    } catch (err) {
      console.error(err);
    }
  };


  // DELETE USER
const handleDelete = async (id) => {

  const target = users.find((user) => user._id === id);

  const approved = await confirm({
    title: "Delete user?",
    body: (
      <p>
        Are you sure you want to remove{" "}
        <strong>{target?.firstName} {target?.lastName}</strong>?
      </p>
    ),
    confirmLabel: "Delete user",
    cancelLabel: "Cancel",
    tone: "danger",
  });

  if (!approved) return;

  try {

    await fetch(`http://localhost:9999/api/users/${id}`, {
      method: "DELETE"
    });

    setUsers(users.filter((user) => user._id !== id));

    push({
      title: "User deleted",
      message: `${target?.firstName} has been removed.`,
      tone: "info",
    });

  } catch (err) {
    console.error(err);
  };

    if (!approved) return;

    setUsers(users.filter((user) => user._id !== id));

    push({
      title: "User deleted",
      message: `${target?.firstName} has been removed.`,
      tone: "info",
    });
  };


  const normalizedUsers = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        roles: normalizeRoles(user.roles ? user.roles : [user.role]),
      })),
    [users]
  );


  return (
    <div className="admin-dashboard">
      <div className="admin-section">

        <div className="admin-header">
          <h1 className="admin-title">Manage Users</h1>
          <p className="admin-subtitle">
            Each account includes user access. Organizer adds event creation,
            and admin includes all permissions.
          </p>
        </div>


        <div className="admin-list-scroll">
          <div className="admin-list">

            {normalizedUsers.map((user) => (
              <div className="admin-card" key={user._id}>

                <div className="admin-card__identity">
                  <strong>{user.firstName} {user.lastName}</strong>

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
                          toggleRole(user._id, "organizer", e.target.checked)
                        }
                      />
                      Organizer
                    </label>

                    <label className="role-toggle">
                      <input
                        type="checkbox"
                        checked={user.roles.includes("admin")}
                        onChange={(e) =>
                          toggleRole(user._id, "admin", e.target.checked)
                        }
                      />
                      Admin
                    </label>

                  </div>


                  <button
                    className="admin-btn danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        </div>


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