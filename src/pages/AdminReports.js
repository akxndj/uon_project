import React, { useEffect, useState } from "react";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [eventsMap, setEventsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:9999/api/reports");
      const data = await res.json();

      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setReports(sorted);
      fetchExtraData(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExtraData = async (reportsData) => {
    const events = {};
    const users = {};

    for (let r of reportsData) {
      if (!events[r.eventId]) {
        try {
          const res = await fetch(`http://localhost:9999/api/events/${r.eventId}`);
          const data = await res.json();
          events[r.eventId] = data.name || "Unknown Event";
        } catch {
          events[r.eventId] = "Deleted Event";
        }
      }

      if (!users[r.userId]) {
        try {
          const res = await fetch(`http://localhost:9999/api/users/${r.userId}`);
          const data = await res.json();
          users[r.userId] = data.email || "Unknown User";
        } catch {
          users[r.userId] = "Unknown User";
        }
      }
    }

    setEventsMap(events);
    setUsersMap(users);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:9999/api/reports/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-section">
        <h2>All Reported Events</h2>

        {reports.length === 0 && <p>No reports found</p>}

        {reports.map((report) => (
          <div
            key={report._id}
            className="admin-card"
            style={{
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "10px",
              background: "#ffffff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              
              <div>
                <p>
  <strong>Event:</strong>{" "}
  <a
    href={`/events/${report.eventId}`}
    style={{
      color: "#007bff",
      textDecoration: "underline",
      cursor: "pointer"
    }}
  >
    {eventsMap[report.eventId] || "Loading..."}
  </a>
</p>
                <p><strong>User:</strong> {usersMap[report.userId] || "Loading..."}</p>
                <p><strong>Reason:</strong> {report.reason}</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    background:
                      report.status === "accepted"
                        ? "#d4edda"
                        : report.status === "rejected"
                        ? "#f8d7da"
                        : "#fff3cd",
                    color:
                      report.status === "accepted"
                        ? "#155724"
                        : report.status === "rejected"
                        ? "#721c24"
                        : "#856404",
                  }}
                >
                  {report.status.toUpperCase()}
                </span>
              </div>

            </div>

            <div style={{ marginTop: "15px" }}>
              {report.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(report._id, "accepted")}
                    style={{
                      marginRight: "10px",
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "5px",
                    }}
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(report._id, "rejected")}
                    style={{
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "5px",
                    }}
                  >
                    Reject
                  </button>
                </>
              )}

              {report.status !== "pending" && (
                <button
                  onClick={() => updateStatus(report._id, "pending")}
                  style={{
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "5px",
                  }}
                >
                  Undo
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminReports;