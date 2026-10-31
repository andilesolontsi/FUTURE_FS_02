# Task 2: Client Lead Management System (Mini CRM)

**Internship track:** Full Stack Web Development  
**Repository name:** FUTURE_FS_02  
**Project:** LeadDesk — Client Lead Management System

## 1. Introduction
The purpose of this project is to develop a simple customer relationship management (CRM) application that helps an administrator organise potential clients generated through website contact forms. The application keeps lead information in one place and supports follow-up activities.

## 2. Objectives
- Store and display client lead information.
- Track the progress of each lead through clear statuses.
- Record notes and schedule follow-up dates.
- Provide secure administrator access.
- Demonstrate CRUD operations, backend API integration and database management.

## 3. Technologies used
React and Vite were used to build the responsive frontend. Node.js and Express provide the backend REST API. MongoDB stores lead and administrator records, with Mongoose used for database modelling. JSON Web Tokens manage authenticated sessions and bcryptjs hashes the administrator password.

## 4. Main functionality
1. **Administrator sign-in:** An administrator signs in using credentials configured securely in the server environment.
2. **Lead dashboard:** Summary cards show total leads and the number of new, contacted and converted leads.
3. **Lead management:** The administrator can create, view, edit and delete lead records.
4. **Lead status:** Each lead can be marked New, Contacted or Converted.
5. **Notes and follow-ups:** The administrator can add timestamped notes and set a follow-up date for a lead.
6. **Search and filtering:** Leads can be searched by name, email or source and filtered by status.

## 5. Database design
The Lead collection stores the client's name, email address, lead source, status, optional follow-up date, notes and timestamps. Each note stores its text and creation time. The User collection stores the administrator email and a securely hashed password. The application uses MongoDB so records persist between sessions.

## 6. Security and validation
The API protects lead-management routes with JWT authentication. Passwords are hashed using bcryptjs. Express Helmet adds common security headers, login attempts are rate-limited, and the API validates required fields, email format, status values and note length. Secret values are kept in a local environment file and are excluded from Git using `.gitignore`.

## 7. Running the application
The project includes a README with installation and run instructions. MongoDB must be available, dependencies must be installed in both the `server` and `client` folders, and the server environment variables must be configured before starting the API and React development server.

## 8. Conclusion
LeadDesk demonstrates a full-stack workflow for managing client leads. It addresses the key requirements in Task 2 by combining a lead listing, status updates, notes and follow-ups, secure administrator access, a backend API and persistent database storage.

## 9. Evidence to include with final GitHub submission
After running the project, capture screenshots of: (1) the sign-in screen, (2) the dashboard and lead list, (3) the add/edit lead form, and (4) a lead profile showing notes and follow-up information. Add the screenshots to the public GitHub repository if requested by the internship evaluator.
