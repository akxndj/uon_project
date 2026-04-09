import React, { useEffect, useState } from "react";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [eventsMap, setEventsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [organisersMap, setOrganisersMap] = useState({});
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

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
    const organisers = {};

    for (let r of reportsData) {
      if (!events[r.eventId]) {
        try {
          const eventRes = await fetch(
            `http://localhost:9999/api/events/${r.eventId}`
          );
          const eventData = await eventRes.json();

          events[r.eventId] = eventData.name || "Unknown Event";

          if (eventData.createdBy) {
            try {
              const organiserRes = await fetch(
                `http://localhost:9999/api/users/${eventData.createdBy}`
              );
              const organiserData = await organiserRes.json();

              organisers[r.eventId] =
                organiserData.email || "Unknown Organiser";
            } catch {
              organisers[r.eventId] = "Unknown Organiser";
            }
          } else {
            organisers[r.eventId] = "Unknown Organiser";
          }
        } catch {
          events[r.eventId] = "Deleted Event";
          organisers[r.eventId] = "Unknown Organiser";
        }
      }

      if (!users[r.userId]) {
        try {
          const userRes = await fetch(
            `http://localhost:9999/api/users/${r.userId}`
          );
          const userData = await userRes.json();

          users[r.userId] = userData.email || "Unknown User";
        } catch {
          users[r.userId] = "Unknown User";
        }
      }
    }

    setEventsMap(events);
    setUsersMap(users);
    setOrganisersMap(organisers);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAcceptClick = (report) => {
    setSelectedReport(report);
    setConfirmModal(true);
  };

  const confirmAccept = async () => {
    if (!selectedReport) return;

    try {
      await fetch(
        `http://localhost:9999/api/reports/${selectedReport._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "accepted" }),
        }
      );

      setConfirmModal(false);
      window.location.href = `/admin/events?highlight=${selectedReport.eventId}`;
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (report, status) => {
    try {
      await fetch(
        `http://localhost:9999/api/reports/${report._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  };

  const btn = {
    padding: "6px 12px",
    borderRadius: "5px",
    border: "none",
    color: "white",
    cursor: "pointer",
  };

const emailOrganiser = (email) => {
  const subject = encodeURIComponent("Reported Event Issue");
  const body = encodeURIComponent(
    "Hello, your event has been reported. Please review it."
  );

  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
    "_blank"
  );
};

  return (
    <div className="admin-dashboard">
      <div className="admin-section">
        <h2>All Reported Events</h2>

        {reports.length === 0 && <p>No reports found</p>}

        <div
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          {reports.map((report) => (
            <div
              key={report._id}
              className="admin-card"
              style={{
                marginBottom: "20px",
                padding: "15px",
                borderRadius: "10px",
                background: "#ffffff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p>
                    <strong>Event:</strong>{" "}
                    <a
                      href={`/events/${report.eventId}`}
                      style={{
                        color: "#007bff",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {eventsMap[report.eventId] || "Loading..."}
                    </a>
                  </p>

                  <p>
                    <strong>Reported By:</strong>{" "}
                    {usersMap[report.userId] || "Loading..."}
                  </p>

                  <p>
                    <strong>Organiser:</strong>{" "}
                    {organisersMap[report.eventId] || "Loading..."}
                  </p>

                  <p>
                    <strong>Reason:</strong> {report.reason}
                  </p>
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
                      onClick={() => handleAcceptClick(report)}
                      style={{
                        ...btn,
                        background: "#28a745",
                        marginRight: "10px",
                      }}
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateStatus(report, "rejected")}
                      style={{
                        ...btn,
                        background: "#dc3545",
                        marginRight: "10px",
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}

                {report.status !== "pending" && (
                  <button
                    onClick={() => updateStatus(report, "pending")}
                    style={{
                      ...btn,
                      background: "#6c757d",
                      marginRight: "10px",
                    }}
                  >
                    Undo
                  </button>
                )}

                {organisersMap[report.eventId] &&
                  organisersMap[report.eventId] !== "Unknown Organiser" && (
                    <button
                      onClick={() =>
                        emailOrganiser(organisersMap[report.eventId])
                      }
                      style={{
                        ...btn,
                        background: "#007bff",
                      }}
                    >
                      Email Organiser
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {confirmModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Confirm Action</h3>

            <p style={{ marginTop: "10px", lineHeight: "1.5" }}>
              If you accept this report, you will be redirected to Manage Events
              and the reported event will be highlighted.
            </p>

            <div
              style={{
                marginTop: "15px",
                textAlign: "right",
              }}
            >
              <button
                onClick={() => setConfirmModal(false)}
                style={{
                  ...btn,
                  background: "#6c757d",
                  marginRight: "10px",
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmAccept}
                style={{
                  ...btn,
                  background: "#28a745",
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReports;