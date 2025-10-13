import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/organizer.css";

const createInitialData = (data) => {
  const fallbackAgenda = [{ time: "", title: "" }];

  const extractTime = (value) => {
    if (!value) return "";
    if (value.includes("T")) {
      return value.split("T")[1]?.slice(0, 5) || "";
    }
    return value;
  };

  return {
    name: data?.name || "",
    description: data?.description || "",
    image: data?.image || "",
    date: data?.date || "",
    startTime: extractTime(data?.startTime),
    endTime: extractTime(data?.endTime),
    location: data?.location || "",
    capacity: data?.capacity ? String(data.capacity) : "",
    fee: data?.fee || "",
    includes: data?.includes || "",
    eligibility: data?.eligibility || "",
    contact: {
      name: data?.contact?.name || "",
      email: data?.contact?.email || "",
    },
    agenda:
      data?.agenda && data.agenda.length
        ? data.agenda.map((item) => ({
            time: item.time || "",
            title: item.title || "",
          }))
        : fallbackAgenda,
  };
};

const OrganizerEventWizard = ({
  initialData,
  submitLabel,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState(() => createInitialData(initialData));
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const steps = useMemo(
    () => [
      { id: "basics", label: "Basics" },
      { id: "schedule", label: "Schedule & Venue" },
      { id: "ticketing", label: "Capacity & Ticketing" },
      { id: "communications", label: "Communications & Agenda" },
      { id: "review", label: "Review" },
    ],
    []
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateContact = (field, value) => {
    setForm((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }));
  };

  const updateAgenda = (index, field, value) => {
    setForm((current) => {
      const agenda = [...current.agenda];
      agenda[index] = { ...agenda[index], [field]: value };
      return { ...current, agenda };
    });
  };

  const addAgendaItem = () => {
    setForm((current) => ({
      ...current,
      agenda: [...current.agenda, { time: "", title: "" }],
    }));
  };

  const removeAgendaItem = (index) => {
    setForm((current) => {
      if (current.agenda.length === 1) return current;
      const agenda = current.agenda.filter((_, idx) => idx !== index);
      return { ...current, agenda };
    });
  };

  const validateStep = () => {
    const step = steps[stepIndex]?.id;
    const nextErrors = {};

    if (step === "basics") {
      if (!form.name.trim()) nextErrors.name = "Event name is required.";
      if (!form.description.trim())
        nextErrors.description = "Description is required.";
    }

    if (step === "schedule") {
      if (!form.date) nextErrors.date = "Select a date.";
      if (!form.startTime) nextErrors.startTime = "Provide a start time.";
      if (!form.location.trim())
        nextErrors.location = "Enter the event location.";
    }

    if (step === "ticketing") {
      if (!form.capacity || Number(form.capacity) <= 0) {
        nextErrors.capacity = "Capacity must be greater than zero.";
      }
    }

    if (step === "communications") {
      if (!form.contact.name.trim())
        nextErrors.contactName = "Contact name is required.";
      if (!form.contact.email.trim())
        nextErrors.contactEmail = "Contact email is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStepIndex((idx) => Math.min(idx + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setStepIndex((idx) => Math.max(idx - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const cleanedAgenda = form.agenda
      .filter((item) => item.time || item.title)
      .map((item) => ({
        time: item.time,
        title: item.title,
      }));

    const payload = {
      ...form,
      capacity: Number(form.capacity),
      startTime: form.startTime
        ? `${form.date}T${form.startTime}`
        : form.startTime,
      endTime: form.endTime ? `${form.date}T${form.endTime}` : form.endTime,
      agenda: cleanedAgenda,
    };

    await onSubmit(payload);
  };

  const renderBasics = () => (
    <div className="wizard-panel">
      <div className="form-group">
        <label>Event Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          rows="4"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
        {errors.description && (
          <span className="field-error">{errors.description}</span>
        )}
      </div>

      <div className="form-group">
        <label>Hero Image URL</label>
        <input
          type="text"
          value={form.image}
          onChange={(event) => updateField("image", event.target.value)}
          placeholder="/images/my-event.jpg"
        />
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="wizard-panel">
      <div className="form-row">
        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={(event) => updateField("date", event.target.value)}
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
        <div className="form-group">
          <label>Start Time *</label>
          <input
            type="time"
            value={form.startTime}
            onChange={(event) => updateField("startTime", event.target.value)}
          />
          {errors.startTime && (
            <span className="field-error">{errors.startTime}</span>
          )}
        </div>
        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            value={form.endTime}
            onChange={(event) => updateField("endTime", event.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Location *</label>
        <input
          type="text"
          value={form.location}
          onChange={(event) => updateField("location", event.target.value)}
        />
        {errors.location && (
          <span className="field-error">{errors.location}</span>
        )}
      </div>
    </div>
  );

  const renderTicketing = () => (
    <div className="wizard-panel">
      <div className="form-row">
        <div className="form-group">
          <label>Capacity *</label>
          <input
            type="number"
            min="1"
            value={form.capacity}
            onChange={(event) => updateField("capacity", event.target.value)}
          />
          {errors.capacity && (
            <span className="field-error">{errors.capacity}</span>
          )}
        </div>
        <div className="form-group">
          <label>Fee</label>
          <input
            type="text"
            value={form.fee}
            onChange={(event) => updateField("fee", event.target.value)}
            placeholder="e.g. Free / $10"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Eligibility</label>
          <input
            type="text"
            value={form.eligibility}
            onChange={(event) => updateField("eligibility", event.target.value)}
            placeholder="e.g. All students"
          />
        </div>
        <div className="form-group">
          <label>Includes</label>
          <input
            type="text"
            value={form.includes}
            onChange={(event) => updateField("includes", event.target.value)}
            placeholder="e.g. Refreshments, resources"
          />
        </div>
      </div>
    </div>
  );

  const renderCommunications = () => (
    <div className="wizard-panel">
      <div className="form-row">
        <div className="form-group">
          <label>Contact Name *</label>
          <input
            type="text"
            value={form.contact.name}
            onChange={(event) => updateContact("name", event.target.value)}
          />
          {errors.contactName && (
            <span className="field-error">{errors.contactName}</span>
          )}
        </div>
        <div className="form-group">
          <label>Contact Email *</label>
          <input
            type="email"
            value={form.contact.email}
            onChange={(event) => updateContact("email", event.target.value)}
          />
          {errors.contactEmail && (
            <span className="field-error">{errors.contactEmail}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <div className="agenda-header">
          <label>Agenda</label>
          <button type="button" onClick={addAgendaItem}>
            + Add item
          </button>
        </div>
        <div className="agenda-list">
          {form.agenda.map((item, index) => (
            <div className="agenda-item" key={`agenda-${index}`}>
              <input
                type="time"
                value={item.time}
                onChange={(event) =>
                  updateAgenda(index, "time", event.target.value)
                }
              />
              <input
                type="text"
                value={item.title}
                placeholder="Session title"
                onChange={(event) =>
                  updateAgenda(index, "title", event.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeAgendaItem(index)}
                disabled={form.agenda.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="wizard-panel review">
      <h3>Event Summary</h3>
      <div className="review-grid">
        <div>
          <strong>Name</strong>
          <span>{form.name || "Not set"}</span>
        </div>
        <div>
          <strong>Date</strong>
          <span>{form.date || "Not set"}</span>
        </div>
        <div>
          <strong>Time</strong>
          <span>
            {form.startTime || "--"} - {form.endTime || "--"}
          </span>
        </div>
        <div>
          <strong>Location</strong>
          <span>{form.location || "Not set"}</span>
        </div>
        <div>
          <strong>Capacity</strong>
          <span>{form.capacity || "0"}</span>
        </div>
        <div>
          <strong>Fee</strong>
          <span>{form.fee || "Free"}</span>
        </div>
        <div>
          <strong>Eligibility</strong>
          <span>{form.eligibility || "Open"}</span>
        </div>
        <div>
          <strong>Contact</strong>
          <span>
            {form.contact.name} ({form.contact.email})
          </span>
        </div>
      </div>

      <div className="review-description">
        <strong>Description</strong>
        <p>{form.description}</p>
      </div>

      {form.agenda.filter((item) => item.time || item.title).length ? (
        <div className="review-agenda">
          <strong>Agenda</strong>
          <ul>
            {form.agenda
              .filter((item) => item.time || item.title)
              .map((item, index) => (
                <li key={`review-${index}`}>
                  <span>{item.time || "--:--"}</span>
                  <span>{item.title || "Session"}</span>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      <div className="status-banner info">
        Double-check the details before publishing.
      </div>
    </div>
  );

  const renderStep = () => {
    const step = steps[stepIndex]?.id;
    if (step === "basics") return renderBasics();
    if (step === "schedule") return renderSchedule();
    if (step === "ticketing") return renderTicketing();
    if (step === "communications") return renderCommunications();
    return renderReview();
  };

  return (
    <div className="organizer-wizard">
      <div className="wizard-stepper" role="tablist">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={
              index === stepIndex
                ? "wizard-step wizard-step--active"
                : index < stepIndex
                ? "wizard-step wizard-step--completed"
                : "wizard-step"
            }
          >
            <span className="wizard-step__number">{index + 1}</span>
            <span className="wizard-step__label">{step.label}</span>
          </div>
        ))}
      </div>

      {renderStep()}

      <div className="wizard-actions">
        <div>
          {stepIndex > 0 ? (
            <button type="button" className="btn btn--ghost" onClick={handlePrevious}>
              Back
            </button>
          ) : onCancel ? (
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancel
            </button>
          ) : (
            <Link to="/organizer" className="btn btn--ghost">
              Cancel
            </Link>
          )}
        </div>
        <div>
          {stepIndex < steps.length - 1 ? (
            <button type="button" className="btn btn--primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSubmit}
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerEventWizard;
