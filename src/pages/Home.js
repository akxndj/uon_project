import React, { useEffect, useMemo, useState } from "react";
import "../styles/user.css";
import eventsCatalogue from "../data/events";
import { getRegistrationCount } from "../utils/registrationStorage";
import EventCard from "../components/EventCard";

const getCampuses = (events) => {
  const unique = new Set(events.map((event) => event.location));
  return Array.from(unique);
};

function Home() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [events, setEvents] = useState(() =>
    eventsCatalogue.map((event) => ({
      ...event,
      registrations: getRegistrationCount(event.id),
    }))
  );

  const campuses = useMemo(() => getCampuses(events), [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !search ||
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());
      const matchesLocation =
        locationFilter === "all" ||
        event.location.toLowerCase() === locationFilter.toLowerCase();
      return matchesSearch && matchesLocation;
    });
  }, [events, search, locationFilter]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const refresh = () => {
      setEvents(
        eventsCatalogue.map((event) => ({
          ...event,
          registrations: getRegistrationCount(event.id),
        }))
      );
    };
    refresh();
    const handleStorage = ({ key }) => {
      if (key === "eventRegistrations") {
        refresh();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="home-shell page-shell">
      <section className="home-hero">
        <h1>Discover events across UoN</h1>
        <p>
          Explore upcoming workshops, networking nights, and campus experiences.
          Filter by campus or search by keyword to find the perfect event.
        </p>
      </section>

      <section className="home-controls">
        <div className="control-group">
          <label htmlFor="search-events">Search</label>
          <input
            id="search-events"
            type="search"
            placeholder="Search by name or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="filter-location">Location</label>
          <select
            id="filter-location"
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
          >
            <option value="all">All locations</option>
            {campuses.map((campus) => (
              <option key={campus} value={campus}>
                {campus}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="home-grid">
        {filteredEvents.length ? (
          filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <div className="home-empty">
            <h3>No events match your filters</h3>
            <p>Try adjusting your search or location to discover more events.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
