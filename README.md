# MediSathi AI - Intelligent Medication Adherence

MediSathi is a premium healthcare platform designed to improve medication adherence through AI insights, caregiver integration, and a patient-centric interface.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide React, Recharts
- **Backend**: Node.js, Express, SQLite3
- **Authentication**: JWT, BcryptJS

## Getting Started

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Seed the Database
To populate the project with mock data for testing, run:
```bash
cd server
node seed.js
```

### 3. Run the Project
```bash
# Start the backend (from /server)
node index.js

# Start the frontend (from root)
npm run dev
```

## Mock Data Credentials
The following users are available after seeding:

| Role | Email | Password |
|------|-------|----------|
| **Patient** | john@example.com | password123 |
| **Caregiver** | jane@example.com | password123 |
| **Doctor** | house@example.com | password123 |
| **Patient** | alice@example.com | password123 |

## Project Structure
- `/src`: Frontend React application
  - `/dashboards`: Specialized dashboards for Patients and Caregivers
  - `/pages`: Authentication and main entry pages
- `/server`: Node.js Express API and SQLite database
