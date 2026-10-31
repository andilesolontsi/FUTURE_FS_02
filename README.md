# FUTURE_FS_02 — Client Lead Management System (Mini CRM)

A full-stack mini CRM built for the Future Interns Full Stack Web Development, Task 2 brief.

## Features
- Secure administrator sign-in using bcrypt password hashing and JWT sessions.
- Lead listing with name, email, source, status and follow-up date.
- Create, view, edit and delete leads (CRUD).
- Update lead status: New, Contacted or Converted.
- Add timestamped notes to a lead.
- Search leads and filter by status.
- Summary cards showing total, new, contacted and converted leads.
- MongoDB persistence, input validation, Helmet security headers and login rate limiting.
- Responsive desktop and mobile interface.

## Technology
- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JSON Web Tokens and bcryptjs

## Requirements
Install Node.js 18+ and have MongoDB running locally, or create a MongoDB Atlas database.

## Run locally
1. Open a terminal in the `server` folder and install packages:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env`. Set `MONGODB_URI`, and replace `JWT_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` with your own values. The server creates the configured admin account on first start.
3. Start the API:
   ```bash
   npm run dev
   ```
   API runs at `http://localhost:5000`.
4. Open a second terminal in the `client` folder and install packages:
   ```bash
   npm install
   ```
5. Start the frontend:
   ```bash
   npm run dev
   ```
6. Visit the local URL printed by Vite (normally `http://localhost:5173`) and sign in using the admin credentials configured in `server/.env`.

For a hosted API, set `VITE_API_URL` in the client environment to the API base URL, ending in `/api`. Set `CLIENT_ORIGIN` on the server to the deployed frontend origin.

## API overview
All lead routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| POST | `/api/auth/login` | Sign in and receive JWT |
| GET | `/api/leads` | List/search/filter leads |
| POST | `/api/leads` | Create a lead |
| PATCH | `/api/leads/:id` | Update lead details/status |
| DELETE | `/api/leads/:id` | Delete a lead |
| POST | `/api/leads/:id/notes` | Add a note/follow-up record |

## Data model
A lead stores `name`, `email`, `source`, `status`, `followUp`, timestamped `notes`, and creation/update timestamps. Status is restricted to `new`, `contacted`, or `converted`. Administrator records store a hashed password, never a plain-text password.

## Suggested manual test checklist
- Sign in with the configured administrator account; verify an incorrect password is rejected.
- Create a lead with a valid name, email and source.
- Search by name/email/source and filter by each status.
- Change a lead from New to Contacted, then Converted.
- Add a note and confirm it appears with a timestamp.
- Set a follow-up date and confirm it appears in the table and profile.
- Edit a lead and delete a test lead.
- Refresh the browser and confirm saved records remain in MongoDB.

## GitHub submission
The internship brief requires a **public** repository named exactly `FUTURE_FS_02` for Task 2. Create that repository on GitHub, then upload/push the contents of this folder. Do not upload your real `.env` file or publish passwords/secrets. Keep only `.env.example` in the repository.
