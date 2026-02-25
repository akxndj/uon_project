import React from "react";
import { Link } from "react-router-dom";
import EventStatusBadge from "./EventStatusBadge";
import "./EventCard.css";

const formatDate = (input) => {
  if (!input) return "TBA";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const determineTone = (registered, capacity) => {
  if (capacity === 0) return "full";
  if (registered >= capacity) return "full";
  if (registered / capacity >= 0.75) return "limited";
  return "open";
};

const EventCard = ({ event }) => {
  const {
    eventId,
    name,
    date,
    location,
    description,
    fee,
    included,
    image,
    capacity,
    registrations = 0,
  } = event;

  const tone = determineTone(registrations, capacity);

  return (
    <article className="event-card">
      <div className="event-card__media">
        <img src={image} alt={name} loading="lazy" />
        <EventStatusBadge tone={tone} />
      </div>

      <div className="event-card__body">
        <h3>{name}</h3>
        <div className="event-card__meta">
          <div>
            <span className="meta-icon" aria-hidden="true">
              📅
            </span>
            <span>{formatDate(date)}</span>
          </div>
          <div>
            <span className="meta-icon" aria-hidden="true">
              📍
            </span>
            <span>{location}</span>
          </div>
          <div>
            <span>Included: {included}</span>
          </div>
          <div>
            <span>
            <span>Fee: {fee}</span>
            </span>
          </div>
        </div>
        <p className="event-card__description">Description: {description}</p>

        <div className="event-card__capacity">
          <span>
            {registrations}/{capacity} attending
          </span>
          <div className="capacity-bar">
            <div
              className={`capacity-bar__fill capacity-bar__fill--${tone}`}
              style={{
                width: `${Math.min(
                  capacity ? (registrations / capacity) * 100 : 0,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      <footer className="event-card__footer">
        <Link to={`/events/${eventId}`} className="btn btn--primary">
          View Details
        </Link>
        <Link to={`/register/${eventId}`} className="btn btn--secondary">
          Register
        </Link>
      </footer>
    </article>
  );
};

export default EventCard;
