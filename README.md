# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

// ======================= Frontend Tasks =======================
//
// Overall requirements:
// - Build role-based frontend (User / Organizer / Admin)
// - Implement navigation and page routing
// - Create clean and consistent UI with CSS
// - Connect to backend APIs once available (replace mock data)
//
// ----------------------- User Side -----------------------
// Tasks:
// - Home page: display list of events
// - Event details page: show event info + default image if none
// - Registration page: allow students to register
// - User dashboard: show registered events, cancel registration
//
// Completed:
// - EventDetails page with mock data + fallback image
// - UserDashboard with registered events, cancel + view buttons
// - Registration page (basic mock-up)
//
// ----------------------- Organizer Side -----------------------
// Tasks:
// - Organizer dashboard: show organizer’s own events
// - Create new event page: form for event creation
// - Buttons for Edit / Delete events
//
// Completed:
// - OrganizerDashboard with mock events
// - CreateEvent page (form fully working on frontend, redirects after submit)
//
// ----------------------- Admin Side -----------------------
// Tasks:
// - Admin dashboard: show events and users (limit 5 each)
// - View all events/users pages
// - Event detail page (for admin view)
// - User management: change role, delete user
// - Event management: edit, delete
//
// Completed:
// - AdminDashboard with events + users preview
// - AdminEventsPage + AdminEventDetails
// - AdminUsersPage
//
// ----------------------- UI / CSS -----------------------
// Tasks:
// - Consistent navbar per role (User=blue, Organizer=orange, Admin=green)
// - Card layout for events and users
// - Buttons styled for primary / danger / create actions
//
// Completed:
// - CSS base styles done (forms, dashboards, cards, buttons)
//
// ----------------------- Pending -----------------------
// 1. Login & Registration page title color issue
// - Currently displayed as orange (inherited from Organizer CSS)
// - Should be blue
// 2. User registration form needs extra fields
// - Add "First Name" and "Last Name"
// - Currently only has name/email/studentId/password
// 3. Replace mock data with real data
// - All events/users/registrations are hardcoded mock data
// - Should be replaced with API calls (GET/POST/PUT/DELETE)
// 4. Delete / Edit buttons not functional
// - Currently, all delete and edit buttons do nothing
// - Need to add proper edit pages and delete logic (API integration)
// ==============================================================

## Recent Frontend Updates

- Introduced global design system (Inter/Playfair typography, theme tokens, refreshed header with role-aware CTA).
- Added reusable toast notifications and modal confirmation system replacing `alert`/`confirm` flows.
- Centralised mock event catalogue (`src/data/events.js`) with capacity, agenda, and contact metadata plus localStorage-backed registration utilities.
- Reworked Home/Browse page with filterable event cards, capacity badges, and shared `EventCard` component.
- Redesigned Event Details page: hero banner, sticky summary sidebar, tabbed content (Overview/Agenda/Contact), share + calendar actions, mobile register CTA.
- Overhauled Organizer Dashboard: hero summary, KPI tiles, segmented event cards (upcoming/past) with live capacity indicators.
- Built shared `OrganizerEventWizard` powering both create/edit flows (basics → schedule → ticketing → communications → review) with validation and agenda editing.
- Updated User Dashboard: splits upcoming vs past registrations, modern cards with capacity meters, and adds share / add-to-calendar / cancel actions.
- Refreshed styling across organizer/user views to align with the new design language.

## UI Refinement Roadmap

### Phase 0 — Prep Work
- [ ] Audit current CSS/asset usage and remove unused styles.
- [ ] Capture screenshots of current Home, Event Detail, Registration, and dashboard screens for before/after comparison.
- [ ] Finalise typography and color palette (e.g., Inter/Playfair + UoN navy/gold) and place assets in `src/assets/brand/`.

### Phase 1 — Design System & Global Layout
- [x] Centralise tokens for color, typography, spacing, and shadows in a theme file.
- [x] Rebuild the global header with role-aware navigation, notification icon, and organiser “Create Event” CTA.
- [x] Establish responsive container/grid utilities for consistent page paddings and widths.
- [x] Introduce reusable toast and modal components to replace browser `alert`/`confirm`.

### Phase 2 — Event Discovery & Detail Experience
- [x] Redesign the Home/Browse view into filterable event cards with capacity/status badges and metadata icons.
- [x] Create reusable `EventCard` and `EventStatusBadge` components shared across lists and dashboards.
- [x] Rework the Event Detail page with a hero banner, sticky summary sidebar (date, venue, capacity meter, CTA), and tabbed content (Overview, Agenda, Contact).
- [x] Add share + calendar actions and a sticky mobile “Register” bar.

### Phase 3 — Organizer Tools
- [x] Refresh the Organizer Dashboard with metric tiles (Events Live, Registrations Today), segmented event lists, and quick actions.
- [x] Convert Create Event into a guided wizard (Basics → Schedule & Venue → Ticketing/Capacity → Communications → Review) with contextual tips.
- [x] Update Edit Event to mirror the wizard layout and show live registration/capacity metrics.
- [ ] Build ticket management tables/cards supporting waitlists, price edits, and exports.

### Phase 4 — Attendee Journey
- [x] Split “My Registrations” into Upcoming/Past views with capacity progress bars and share/calendar actions.
- [ ] Enhance registration success with QR code, calendar buttons, related events, and organiser contact info.
- [ ] Implement a mobile “event pass” view optimised for on-site check-in.
- [ ] Add contextual help and support entry points within the user dashboard.

### Phase 5 — Communication & Engagement
- [ ] Create an organiser communication hub for templates, scheduling, and delivery stats.
- [ ] Surface automated notification settings (reminders, updates, thank-you notes) per event.
- [ ] Add an in-app notification center for attendees/admins highlighting upcoming events and changes.
- [ ] Integrate analytics widgets (attendance conversion, ticket sales pace) into the admin dashboard.

### Phase 6 — Polish & Accessibility
- [ ] Introduce light/dark mode toggle while maintaining contrast compliance.
- [ ] Ensure all interactive components include focus states, ARIA labels, and keyboard navigation.
- [ ] Add subtle micro-interactions (hover states, success animations) without hurting performance.
- [ ] Conduct a UX review with representative organiser/attendee users and iterate on findings.
