import React, { useMemo, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "../styles/organizer.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    eligibility: data?.eligibility || "All students",
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

const onlyTextRegex = /^[A-Za-z0-9\s.,!?]*$/;

const OrganizerEventWizard = ({
  initialData,
  submitLabel,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState(() => createInitialData(initialData));
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) setForm(createInitialData(initialData));
  }, [initialData]);

  const today = new Date().toISOString().split("T")[0];

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
    if (!form.name.trim()) {
      nextErrors.name = "Event name is required.";
    } else if (!onlyTextRegex.test(form.name)) {
      nextErrors.name = "No special characters allowed.";
    }

    const wordCount = form.description
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (!onlyTextRegex.test(form.description)) {
      nextErrors.description = "No special characters allowed.";
    } else if (wordCount > 200) {
      nextErrors.description = "Max 200 words.";
    }
  }

  if (step === "schedule") {
  if (!form.date) {
    nextErrors.date = "Select a date.";
  } else if (form.date < today) {
    nextErrors.date = "Cannot select past date.";
  }

  if (!form.startTime) {
    nextErrors.startTime = "Provide a start time.";
  }

  if (form.startTime && form.endTime && form.endTime <= form.startTime) {
    nextErrors.endTime = "End time must be after start time.";
  }

  if (!form.location.trim()) {
    nextErrors.location = "Enter the event location.";
  }
}

  if (step === "ticketing") {
    if (!form.capacity || Number(form.capacity) <= 0) {
      nextErrors.capacity = "Capacity must be greater than zero.";
    }

    if (form.fee && (!/^\d+$/.test(form.fee) || Number(form.fee) > 999)) {
      nextErrors.fee = "Fee must be a number ≤ 999.";
    }

    if (form.includes && !onlyTextRegex.test(form.includes)) {
      nextErrors.includes = "No special characters allowed.";
    }
  }

  if (step === "communications") {
  if (!form.contact.name.trim()) {
    nextErrors.contactName = "Contact name is required.";
  } else if (form.contact.name.length > 50) {
    nextErrors.contactName = "Max 50 characters.";
  }

  if (!form.contact.email.trim()) {
    nextErrors.contactEmail = "Contact email is required.";
  } else if (form.contact.email.length > 50) {
    nextErrors.contactEmail = "Max 50 characters.";
  } else if (!emailRegex.test(form.contact.email)) {
    nextErrors.contactEmail = "Invalid email format.";
  }
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

  const originalStep = stepIndex;

  // 🔴 强制验证所有步骤
  for (let i = 0; i < steps.length - 1; i++) { // 不包含 review
    setStepIndex(i);

    const isValid = validateStep();
    if (!isValid) {
      return; // ❗只要有一个 step 错，直接拦
    }
  }

  setStepIndex(originalStep);

  // ✅ 原提交逻辑（不动）
  const cleanedAgenda = form.agenda
    .filter((item) => item.time || item.title)
    .map((item) => ({
      time: item.time,
      title: item.title,
    }));

  const formData = new FormData();

  formData.append("name", form.name);
  formData.append("description", form.description);
  formData.append("date", form.date);
  formData.append("location", form.location);
  formData.append("capacity", form.capacity);
  formData.append("fee", form.fee);
  formData.append("eligibility", form.eligibility);
  formData.append("included", form.includes);
  formData.append("createdBy", "organizer");
  formData.append("registered", 0);

  if (form.image) {
    formData.append("image", form.image);
  }

  cleanedAgenda.forEach((item, index) => {
    formData.append(`agenda[${index}][time]`, item.time);
    formData.append(`agenda[${index}][title]`, item.title);
  });

  await onSubmit(formData);
};

  const renderBasics = () => (
    <div className="wizard-panel">
      <div className="form-group">
        <label>Event Name *</label>
        <input
          type="text"
          value={form.name}
          className={errors.name ? "input-error" : ""}
          onChange={(event) => updateField("name", event.target.value)}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          rows="8"
          className={`event-textarea ${errors.description ? "input-error" : ""}`}
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Describe your event in detail..."
        />
        {errors.description && (
          <span className="field-error">{errors.description}</span>
        )}
      </div>

      <div className="form-group">
        <label>Upload Event Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => updateField("image", event.target.files[0])}
        />

        {form.image && (
          <img
            src={URL.createObjectURL(form.image)}
            alt="preview"
            style={{ width: "250px", marginTop: "10px", borderRadius: "8px" }}
          />
        )}
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
            min={today}
            className={errors.date ? "input-error" : ""}
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
            className={errors.startTime ? "input-error" : ""}
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
          className={errors.location ? "input-error" : ""}
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
            className={errors.capacity ? "input-error" : ""}
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
            type="number"
            max="999"
            className={errors.fee ? "input-error" : ""}
            value={form.fee}
            onChange={(event) => updateField("fee", event.target.value)}
          />
          {errors.fee && <span className="field-error">{errors.fee}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Eligibility</label>
          <input
            type="text"
            value={form.eligibility}
            onChange={(event) => updateField("eligibility", event.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Includes</label>
          <input
            type="text"
            value={form.includes}
            className={errors.includes ? "input-error" : ""}
            onChange={(event) => updateField("includes", event.target.value)}
          />
          {errors.includes && <span className="field-error">{errors.includes}</span>}
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
            maxLength={50}
            value={form.contact.name}
            className={errors.contactName ? "input-error" : ""}
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
            maxLength={50}
            value={form.contact.email}
            className={errors.contactEmail ? "input-error" : ""}
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
        <div><strong>Name</strong><span>{form.name || "Not set"}</span></div>
        <div><strong>Date</strong><span>{form.date || "Not set"}</span></div>
        <div><strong>Time</strong><span>{form.startTime || "--"} - {form.endTime || "--"}</span></div>
        <div><strong>Location</strong><span>{form.location || "Not set"}</span></div>
        <div><strong>Capacity</strong><span>{form.capacity || "0"}</span></div>
        <div><strong>Fee</strong><span>{form.fee || "Free"}</span></div>
        <div><strong>Eligibility</strong><span>{form.eligibility || "Open"}</span></div>
        <div><strong>Contact</strong><span>{form.contact.name} ({form.contact.email})</span></div>
      </div>

      <div className="review-description">
        <strong>Description</strong>
        <p>{form.description}</p>
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
      {renderStep()}

      <div className="wizard-actions">
        <div className="wizard-actions">
  <button className="btn btn-secondary" onClick={handlePrevious}>
    ← Back
  </button>

  {stepIndex < steps.length - 1 ? (
    <button className="btn btn-primary" onClick={handleNext}>
      Next →
    </button>
  ) : (
    <button className="btn btn-primary" onClick={handleSubmit}>
      {submitLabel}
    </button>
  )}
</div>
      </div>
    </div>
  );
};

export default OrganizerEventWizard;
