import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/organizer.css";
import { useToast } from "../context/ToastContext";
import OrganizerEventWizard from "../components/OrganizerEventWizard";

function EditEvent() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load event from backend
  useEffect(() => {

    const fetchEvent = async () => {

      try {

        const res = await fetch(`http://localhost:9999/api/events/${id}`);
        const data = await res.json();

        setInitialData(data);

      } catch (err) {
        console.error("Error loading event:", err);
      }

      setLoading(false);

    };

    fetchEvent();

  }, [id]);



  // Submit updated event
  const handleSubmit = async (payload) => {

  console.log("Payload being sent:", payload);

  try {

    const res = await fetch(`http://localhost:9999/api/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Server response:", data);

    push({
      title: "Event updated",
      message: `"${payload.name}" changes saved.`,
      tone: "success"
    });

    navigate("/admin/events");

  } catch (err) {
    console.error("Update error:", err);
  }

};



  if (loading) {
    return (
      <div className="organizer-page">
        <div className="organizer-dashboard">
          <p>Loading event data...</p>
        </div>
      </div>
    );
  }



  if (!initialData) {
    return (
      <div className="organizer-page">
        <div className="organizer-dashboard">
          <div className="organizer-empty">
            <p>We couldn't find this event.</p>
            <Link to="/admin/events" className="btn btn--primary">
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="organizer-page">
      <div className="organizer-dashboard">

        <OrganizerEventWizard
          initialData={initialData}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />

        <div style={{ marginTop: "20px" }}>
          <button
            className="btn btn--secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditEvent;