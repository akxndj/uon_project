import React from "react";
import "./EventCard.css";

const toneClass = {
  open: "badge--success",
  limited: "badge--warning",
  full: "badge--danger",
};

const labelMap = {
  open: "Open",
  limited: "Limited",
  full: "At Capacity",
};

const EventStatusBadge = ({ tone = "open" }) => {
  const className = ["badge", toneClass[tone] || toneClass.open]
    .filter(Boolean)
    .join(" ");

  return <span className={className}>{labelMap[tone] || labelMap.open}</span>;
};

export default EventStatusBadge;
