import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/organizer.css";
import { useToast } from "../context/ToastContext";
import OrganizerEventWizard from "../components/OrganizerEventWizard";
import ReturnButton from "../components/ReturnButton";

function CreateEvent() {
  const navigate = useNavigate();
  const { push } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    if (loading) return;
    setLoading(true);

    try {
      const eventId = Date.now().toString();
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        throw new Error("User not logged in");
      }

      formData.set("eventId", eventId);
      formData.set("createdBy", user.id);

      const response = await fetch("http://localhost:9999/api/events", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Create failed");
      }

      push({
        title: "Event created",
        message: `"${data.event?.name || formData.get("name")}" is now ready to publish.`,
        tone: "success",
      });

      navigate("/organizer");

    } catch (error) {
      console.error(error);

      push({
        title: "Error",
        message: error.message || "Failed to create event",
        tone: "danger",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="organizer-page">
      <div className="organizer-dashboard">

        <ReturnButton fallback="/organizer" />

        <OrganizerEventWizard
          initialData={null}
          submitLabel={loading ? "Creating..." : "Create Event"}
          onSubmit={handleSubmit}
        />

      </div>
    </div>
  );
}

export default CreateEvent;