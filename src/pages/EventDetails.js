import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/user.css";
import "../styles/eventDetails.css";
import { useToast } from "../context/ToastContext";

const getUserId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("user");
};

function EventDetails() {
  const { id } = useParams();
  console.log("Event ID from URL:", id);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const userId = useMemo(() => getUserId(), []);
  const { push } = useToast();

  useEffect(() => {
const fetchEvent = async () => {

  try {

    const res = await fetch(`http://localhost:9999/api/events/${id}`);

    const data = await res.json();

    console.log("Loaded event:", data);

    if (!data || data.message) {
      setEvent(null);
    } else {
      setEvent(data);
      setRegistrationCount(data.registered || 0);
    }

  } catch (err) {

    console.error("Fetch error:", err);
    setEvent(null);

  } finally {

    setLoading(false);

  }

};

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="admin-dashboard"><div className="admin-section">Loading event details...</div></div>;
  }

  if (!event) {
    return (
      <div className="admin-dashboard">
        <div className="admin-section">
          <h2>Event not found</h2>
          <Link to="/home">Back to Home</Link>
        </div>
      </div>
    );
  }

  const isFull = registrationCount >= event.capacity;
  const showMobileCTA = !alreadyRegistered && !isFull;
  const isAdmin = localStorage.getItem("role") === "admin";

  const handleShare = async () => {
    const shareData = {
      title: event.name,
      text: event.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Share cancelled", error);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      push({
        title: "Link copied",
        message: "Event link ready to share.",
        tone: "info",
      });
    } catch (error) {
      push({
        title: "Unable to copy",
        message: "Please copy the URL manually.",
        tone: "danger",
      });
    }
  };

const submitReport = async () => {
  if (!reportReason) return;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    alert("User not found. Please login again.");
    return;
  }

  try {
    await fetch("http://localhost:9999/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: event._id,
        userId: user.id,
        reason: reportReason,
      }),
    });

    alert("Report submitted successfully");
    setShowReportModal(false);
    setReportReason("");

  } catch (err) {
    console.error(err);
    alert("Error submitting report");
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

  const inputStyle = {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const cancelBtn = {
    marginRight: "10px",
    padding: "6px 12px",
    background: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
  };

  const submitBtn = {
    padding: "6px 12px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-section">
        
        <div className="admin-header">
          <div>
            <h1 className="admin-title">{event.name}</h1>
            <p className="admin-subtitle">
              View event details and manage participation.
            </p>
          </div>
        </div>

        <div className="admin-list-scroll">
          <div className="admin-card">
            <div className="admin-card__identity">
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p>
                <strong>Participants:</strong> {registrationCount}/{event.capacity}
              </p>
              <p><strong>Maximum Capacity:</strong> {event.capacity}</p>
              <p><strong>Description:</strong> {event.description}</p>
            </div>

            <div className="event-summary-actions">
              {!alreadyRegistered && !isFull && (
              <Link to={`/register/${event._id}`} className="btn btn--secondary">
              Register Now
              </Link>
              )}
              <button onClick={() => setShowReportModal(true)} className="btn btn--info" style={{backgroundColor: "orange"}}>Report</button>
              <button
                type="button"
                className="btn btn--info"
                onClick={handleShare}
              >
                Share
              </button>

              <button
                type="button"
                className="admin-btn danger"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>

          {showMobileCTA && (
            <div className="event-mobile-cta">
              <Link to={`/register/${event._id || event._id}`} className="btn btn--primary">
                Register Now
              </Link>
              <button type="button" className="btn btn--ghost" onClick={handleShare}>
                Share
              </button>
            </div>
          )}
        </div>

        <div className="admin-footer">
          {isAdmin && (
  <Link to="/admin" className="view-all-btn">
    Back to Dashboard
  </Link>
)}
        </div>

      </div>

      {showReportModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginBottom: "10px" }}>Report Event</h3>

            <textarea
              placeholder="Enter reason..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              style={inputStyle}
            />

            <div style={{ marginTop: "15px", textAlign: "right" }}>
              <button onClick={() => setShowReportModal(false)} style={cancelBtn}>
                Cancel
              </button>

              <button onClick={submitReport} style={submitBtn}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default EventDetails;