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
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const userId = useMemo(() => getUserId(), []);
  const { push } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:9999/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        
        setEvent(data);
        // Ensure this matches your API field name (e.g., registeredCount or currentParticipants)
        setRegistrationCount(data.registeredCount || 0);
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

  return (
    <div className="admin-dashboard">
      <div className="admin-section">
        
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">{event.name}</h1>
            <p className="admin-subtitle">
              View event details and manage participation.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
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
                <Link to={`/register/${event._id || event.id}`} className="btn btn--primary">
                  Register Now
                </Link>
              )}
              
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
          </div> {/* End admin-card */}

          {showMobileCTA && (
            <div className="event-mobile-cta">
              <Link to={`/register/${event._id || event.id}`} className="btn btn--primary">
                Register Now
              </Link>
              <button type="button" className="btn btn--ghost" onClick={handleShare}>
                Share
              </button>
            </div>
          )}
        </div> {/* End admin-list-scroll */}

        {/* Footer */}
        <div className="admin-footer">
          <Link to="/organizer" className="view-all-btn">
            Back to Dashboard
          </Link>
        </div>

      </div> {/* End admin-section */}
    </div> /* End admin-dashboard */
  );
}

export default EventDetails;