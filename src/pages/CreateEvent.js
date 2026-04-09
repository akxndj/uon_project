import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/organizer.css";
import { useToast } from "../context/ToastContext";
import OrganizerEventWizard from "../components/OrganizerEventWizard";
import ReturnButton from "../components/ReturnButton";

function CreateEvent() {
  const navigate = useNavigate();
  const { push } = useToast();

  const handleSubmit = async (formData) => {
    try {
      const eventId = Date.now().toString();
      const user = JSON.parse(localStorage.getItem("user"));

      formData.set("eventId", eventId);
      formData.set("createdBy", user.id);

      const response = await fetch("http://localhost:9999/api/events", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      push({
        title: "Event created",
        message: `"${data.event.name}" is now ready to publish.`,
        tone: "success",
      });

      navigate("/organizer");
    } catch (error) {
      console.error(error);

      push({
        title: "Error",
        message: "Failed to create event",
        tone: "danger",
      });
    }
  };

  return (
    <div className="organizer-page">
      <div className="organizer-dashboard">
        <ReturnButton fallback="/organizer" />
        <OrganizerEventWizard
          initialData={null}
          submitLabel="Create Event"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default CreateEvent;