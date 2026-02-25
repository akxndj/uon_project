import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/organizer.css";
import { useToast } from "../context/ToastContext";
import OrganizerEventWizard from "../components/OrganizerEventWizard";
import ReturnButton from "../components/ReturnButton";

function CreateEvent() {
  const navigate = useNavigate();
  const { push } = useToast();

  const handleSubmit = async (payload) => {
    console.log("New event data:", payload);
    push({
      title: "Event created",
      message: `"${payload.name}" is now ready to publish.`,
      tone: "success",
    });
    navigate("/organizer");
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
