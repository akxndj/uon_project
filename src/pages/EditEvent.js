import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/organizer.css";
import { useToast } from "../context/ToastContext";
import OrganizerEventWizard from "../components/OrganizerEventWizard";
import { getEventById } from "../data/events";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const target = getEventById(id);
    if (target) {
      setInitialData(target);
    }
    setLoading(false);
  }, [id]);

  const handleSubmit = async (payload) => {
    console.log("Updated event:", payload);
    push({
      title: "Event updated",
      message: `"${payload.name}" changes have been saved.`,
      tone: "success",
    });
    navigate("/organizer");
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
            <Link to="/organizer" className="btn btn--primary">
              Back to Dashboard
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
      </div>
    </div>
  );
}

export default EditEvent;
