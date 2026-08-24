# CivicFix — Mumbai Civic Accountability Platform

CivicFix helps citizens report civic issues (potholes, garbage, water leakage, etc.) across Mumbai, guides them through BMC's official WhatsApp grievance channel, and publicly tracks the resulting Grievance ID on a live citywide map.

This README explains how to get the project running on a fresh computer.

---

## 1. Prerequisites

Before starting, make sure the following are installed:

- **Node.js** (v18 or higher recommended) — [Download here](https://nodejs.org)
- **npm** (comes bundled with Node.js)
- A code editor (VS Code recommended, but not required)

To check if Node and npm are already installed, open a terminal and run:
```bash
node --version
npm --version
```
If these return version numbers instead of an error, you're good to go.

---

## 2. Project Structure

```
civicfix/
├── src/               → React frontend source code
├── public/            → Static frontend assets
├── server/            → Node.js + Express backend
│   ├── index.js       → Backend entry point
│   └── civicfix.db    → SQLite database (auto-created on first run)
├── package.json       → Frontend dependencies
└── README.md          → This file
```

The app has **two parts that must run at the same time**: the frontend (React) and the backend (Express + SQLite). They run as two separate processes.

---

## 3. Setup Instructions

### Step 1 — Unzip / Clone the Project
Extract the project folder (or clone it if using Git) to a location of your choice.

### Step 2 — Install Frontend Dependencies
Open a terminal in the project's root folder and run:
```bash
npm install
```
This installs React, Tailwind, Leaflet, and all other frontend packages listed in `package.json`.

### Step 3 — Install Backend Dependencies
Navigate into the `server` folder and install its dependencies separately:
```bash
cd server
npm install
cd ..
```
The backend has its own `package.json` (Express, CORS, and the SQLite driver), separate from the frontend.

---

## 4. Running the Project

You need **two terminals open at the same time** — one for the backend, one for the frontend.

### Terminal 1 — Start the Backend
```bash
cd server
node index.js
```
You should see output like:
```
CivicFix Backend Server listening on http://localhost:4000
Connected to SQLite database at: .../server/civicfix.db
Database initialized: issues table ready.
```
Leave this terminal running. This starts the Express server on **port 4000**, which handles saving and retrieving civic issue reports.

> **Note:** The first time this runs, it will automatically create a fresh `civicfix.db` file with an empty `issues` table — this is expected.

### Terminal 2 — Start the Frontend
Open a **second, separate terminal** (don't close the first one), navigate to the project root, and run:
```bash
npm run dev
```
This starts the React development server, usually on **http://localhost:5173** (or `http://localhost:3000`, depending on your setup — check the terminal output for the exact URL).

### Step 3 — Open the App
Open the URL shown in Terminal 2's output (e.g., `http://localhost:5173`) in your browser.

---

## 5. Verifying Everything Works

1. **Check the backend directly:** Open `http://localhost:4000/issues` in your browser. You should see either `[]` (empty array, if no reports exist yet) or a list of JSON issue objects. If you see an error instead, the backend isn't running — go back to Terminal 1.
2. **Log in** on the app's login screen (enter any username and any 4-digit code — authentication is simplified for this prototype).
3. **Check the Home page** — you should see a map of Mumbai load correctly.
4. **Try staging a test report** through "Report Issue," then refresh the page and confirm it still appears — this confirms the frontend and backend are properly connected.

---

## 6. Common Issues & Fixes

| Problem | Likely Cause | Fix |
|---|---|---|
| Frontend loads but map/issues don't appear | Backend isn't running | Make sure Terminal 1 (`node index.js`) is still running and shows no errors |
| `curl`/browser shows "connection refused" on port 4000 | Backend crashed or wasn't started | Re-run `node index.js` inside `/server` and check for error messages |
| `npm install` fails with permission errors | Node/npm installation issue | Try running the terminal as administrator, or reinstall Node.js |
| "Port already in use" error | Another process is already using port 4000 or the frontend's port | Close other terminals/processes, or restart your computer |
| Zip file wouldn't extract / files missing | `node_modules` was excluded when zipping (intentional) | Just run `npm install` in both the root folder and `/server` as described in Step 3 — this regenerates everything needed |
| App shows old/stale data after changes | Browser cache | Hard refresh the page (Ctrl + Shift + R) |

---

## 7. Stopping the Project

To stop either server, click into its terminal and press:
```
Ctrl + C
```
Do this for both the frontend and backend terminals when you're done.

---

## 8. Tech Stack Summary

- **Frontend:** React.js, Tailwind CSS, Leaflet.js (OpenStreetMap)
- **Backend:** Node.js, Express.js, SQLite
- **Additional:** A standalone C++ module (`engine.cpp`, if included) demonstrating DBSCAN-based duplicate report clustering — this runs independently and is not required for the web app itself

---

*For questions about the project itself (features, purpose, roadmap), refer to the project report shared separately with the team.*
