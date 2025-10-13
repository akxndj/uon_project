const REGISTRATIONS_KEY = "eventRegistrations";

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : {};
  } catch (error) {
    console.warn("Unable to parse registration store", error);
    return {};
  }
};

const getStoredRegistrations = () => {
  if (typeof window === "undefined") return {};
  return safeParse(window.localStorage.getItem(REGISTRATIONS_KEY));
};

const saveRegistrations = (value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(value));
};

export const getEventRegistrations = (eventId) => {
  const registrations = getStoredRegistrations();
  return registrations[eventId] || [];
};

export const getRegistrationCount = (eventId) =>
  getEventRegistrations(eventId).length;

export const isUserRegistered = (userId, eventId) =>
  getEventRegistrations(eventId).includes(userId);

export const canRegister = (userId, eventId, capacity) => {
  if (!userId || !eventId) {
    return { allowed: false, reason: "missing-data" };
  }

  if (isUserRegistered(userId, eventId)) {
    return { allowed: false, reason: "already-registered" };
  }

  const currentCount = getRegistrationCount(eventId);
  if (typeof capacity === "number" && currentCount >= capacity) {
    return { allowed: false, reason: "capacity-reached" };
  }

  return { allowed: true };
};

export const registerUser = (userId, eventId, capacity) => {
  const status = canRegister(userId, eventId, capacity);
  if (!status.allowed) {
    return { success: false, reason: status.reason };
  }

  const registrations = getStoredRegistrations();
  const eventRegistrations = getEventRegistrations(eventId);

  registrations[eventId] = [...eventRegistrations, userId];
  saveRegistrations(registrations);

  return { success: true };
};

export const cancelRegistration = (userId, eventId) => {
  const registrations = getStoredRegistrations();
  const eventRegistrations = getEventRegistrations(eventId);

  if (!eventRegistrations.length) return;

  registrations[eventId] = eventRegistrations.filter((id) => id !== userId);
  saveRegistrations(registrations);
};

export const getUserRegistrations = (userId) => {
  if (!userId) return [];
  const registrations = getStoredRegistrations();

  return Object.entries(registrations)
    .filter(([, users]) => users.includes(userId))
    .map(([eventId]) => eventId);
};
