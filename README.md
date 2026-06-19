# CausalFunnel Analytics Assignment

A full-stack User Analytics & Session Tracking application built as part of the CausalFunnel Full Stack Engineer assignment.

The application tracks user interactions such as page views and clicks, stores them in MongoDB, and provides a professional analytics dashboard for visualizing sessions, user journeys, and click heatmaps.

---

## Live Demo

### Frontend (Vercel)

[Frontend Live Link]([YOUR_VERCEL_URL](https://causal-funnel-analytics-five.vercel.app/)

### Backend (Render)

[Backend API Link](https://causalfunnel-analytics.onrender.com)

### GitHub Repository

[GitHub Repository](https://github.com/Arpit-3000/CausalFunnel-Analytics)

---

## Project Overview

This project helps track and analyze user behavior on a website.

### Features

* Session Tracking
* Page View Tracking
* Click Event Tracking
* Session Analytics Dashboard
* User Journey Visualization
* Click Heatmap View
* Session Search
* Event Filtering
* Analytics Overview Cards
* Responsive UI

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* Recharts

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Deployment

* Frontend: Vercel
* Backend: Render

### Version Control

* Git
* GitHub

---

## Development Resources

During development:

* UI inspiration and layout planning were created using Figma.
* ChatGPT was used as a development assistant for code guidance, debugging, architecture suggestions, and implementation support.
* GitHub was used for source code management and version control.
* Vercel was used for frontend deployment.
* Render was used for backend deployment.

---

## Event Tracking

The application tracks:

### Page View Event

```json
{
  "sessionId": "abc123",
  "eventType": "page_view",
  "pageUrl": "/home",
  "timestamp": "2026-06-18T10:00:00Z"
}
```

### Click Event

```json
{
  "sessionId": "abc123",
  "eventType": "click",
  "pageUrl": "/home",
  "timestamp": "2026-06-18T10:00:10Z",
  "clickX": 240,
  "clickY": 310
}
```

---

## Dashboard Features

### Sessions View

* View all tracked sessions
* Total event count per session
* First seen timestamp
* Last seen timestamp
* Session search functionality
* 
### Heatmap View

* Visual representation of click activity
* Page-specific click analysis
* Interactive heatmap display

### Analytics Overview

* Total Sessions
* Total Events
* Total Clicks
* Total Page Views
* Event Activity Trends
* Session Trends
* Event Distribution Charts

---

## Project Structure

```bash
CausalFunnel-Analytics/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

Backend API Endpoints
Base URL
http://localhost:5000
Event & Session APIs
Create Event
POST /api/events

Create and store a new tracking event.

Get All Sessions
GET /api/sessions

Fetch all user sessions with event counts and session information.

Get Session By ID
GET /api/sessions/:sessionId

Retrieve all events belonging to a specific session.

Get Heatmap Data
GET /api/heatmap?pageUrl=/pricing

Retrieve click coordinates for generating page heatmaps.

Get Overall Statistics
GET /api/stats

Returns:

Total Sessions
Total Events
Total Clicks
Total Page Views
Get All Tracked Pages
GET /api/pages

Returns all unique tracked page URLs.

Analytics APIs
Events Trend
GET /api/analytics/events-trend?days=7

Returns event activity trend data for the specified number of days.

Default: 7 Days

Event Distribution
GET /api/analytics/event-distribution

Returns distribution of tracked event types.

Example:

Click Events
Page Views
Session Trend
GET /api/analytics/session-trend?days=7

Returns daily session growth trend.

Default: 7 Days

Health Check
Server Status
GET /health

Used to verify that the backend server is running successfully.

Response:

{
  "status": "ok"
}

## Local Setup

### Clone Repository

```bash
git clone https://github.com/Arpit-3000/CausalFunnel-Analytics
```

---

## Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

## Backend Setup

```bash
cd Backend
npm install
nodemon server.js
```

or

```bash
npm run dev
```

Backend will run on:

```bash
http://localhost:5000
```

---

## Environment Variables

Create a `.env` file inside the Backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV = development/production
```

---

## Assumptions & Trade-offs

- React + Vite was chosen for a fast and efficient frontend development experience, while Node.js, Express.js, and MongoDB provide a scalable full-stack architecture.
- Session IDs are generated and stored locally to track user activity across page navigations without requiring authentication.
- The UI design was inspired by modern analytics platforms such as Mixpanel, PostHog, Microsoft Clarity, and Google Analytics, with layouts initially planned using Figma.
- Heatmap visualization uses click coordinate data and overlay markers to provide a simple but effective representation of user interaction patterns.
- Frontend is deployed on Vercel and Backend on Render, enabling quick deployment and seamless integration with GitHub for CI/CD workflows.
- ChatGPT was used as a development assistant for implementation guidance, debugging, architecture discussions, and documentation support.
---

## Author

Arpit Srivastava

Built as part of the CausalFunnel Full Stack Engineer Assignment.
