[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ZroWLq75)
# -mern-test-template

# MERN Task Manager

A full-stack task management application built with the **MERN** stack (MongoDB, Express, React, Node.js). Users can register, log in, and manage personal tasks with full CRUD operations and status tracking.

---

## Overview

| Layer | Technology | Port |
|-------|------------|------|
| Frontend | React 19 + Vite + React Router 7 | `5173` |
| Backend | Node.js + Express 5 | `3000` |
| Database | MongoDB + Mongoose | — |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone <repo-url>
cd mern-test-mdmokaramkhan
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:5173
PORT=3000
```

```bash
npm run dev     # Start with nodemon (auto-reload)
npm start       # Start in production
```

### 3. Set up the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_BACKEND_URL=/api
```

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Serve production build locally
npm run lint      # Run ESLint
```

---

## Backend

A REST API built with **Node.js**, **Express 5**, and **MongoDB** that handles user authentication and task management.

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ≥18 | Runtime |
| Express | ^5.2.1 | Web framework |
| MongoDB + Mongoose | ^9.2.3 | Database & ODM |
| JSON Web Token | ^9.0.3 | Authentication |
| bcrypt | ^6.0.0 | Password hashing |
| dotenv | ^17.3.1 | Environment variables |
| cors | ^2.8.6 | Cross-origin requests |
| nodemon | ^3.1.9 | Dev auto-restart |

### Project Structure

```
backend/
├── app.js                        # Express app setup, middleware, routes
├── server.js                     # Entry point — starts HTTP server
├── config/
│   └── db.js                     # MongoDB connection via Mongoose
├── models/
│   ├── users.js                  # User schema
│   └── tasks.js                  # Task schema
├── controllers/
│   ├── auth.controller.js        # Register & login handlers
│   ├── user.controller.js        # User management handlers
│   └── task.controller.js        # Task CRUD handlers
├── routes/
│   ├── auth.routes.js            # /api/auth endpoints
│   └── task.routes.js            # /api/tasks endpoints (protected)
├── middlewares/
│   └── auth.middleware.js        # JWT verification middleware
├── services/
│   ├── auth.service.js           # Auth business logic
│   ├── user.service.js           # User business logic
│   └── task.service.js           # Task business logic
└── .env                          # Environment variables (not committed)
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Secret key for signing JWTs |
| `CLIENT_ORIGIN` | Frontend origin allowed by CORS |
| `PORT` | Port the server listens on (default: 3000) |

### Database Models

#### User

```js
{
  name:      String  // required
  email:     String  // required, unique
  password:  String  // required, hashed with bcrypt
  createdAt: Date    // auto
  updatedAt: Date    // auto
}
```

#### Task

```js
{
  title:       String   // required
  description: String   // required
  status:      String   // enum: 'pending' | 'in_progress' | 'completed', default: 'pending'
  createdBy:   ObjectId // ref: User, required
  createdAt:   Date     // auto
  updatedAt:   Date     // auto
}
```

### API Reference

**Base URL:** `http://localhost:3000`

#### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Authenticate and receive a JWT | No |

**POST `/api/auth/register`**

```json
// Request
{ "name": "Jane Doe", "email": "jane@example.com", "password": "securepassword" }

// Response 201
{ "success": true, "message": "User registered successfully", "data": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com" } }
```

**POST `/api/auth/login`**

```json
// Request
{ "email": "jane@example.com", "password": "securepassword" }

// Response 200
{ "success": true, "message": "Login successful", "data": { "user": { ... }, "token": "<jwt>" } }
```

#### Task Routes — `/api/tasks`

> All task routes require a valid JWT: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks` | Get all tasks for the authenticated user |
| GET | `/api/tasks/:id` | Get a single task by ID |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Authentication Flow

1. **Register** — password is hashed with `bcrypt` before storing in MongoDB
2. **Login** — credentials validated, a signed JWT is returned (expires in **7 days**)
3. **Protected routes** — `auth.middleware.js` extracts and verifies the JWT from the `Authorization: Bearer <token>` header, then attaches the decoded user to `req.user`

### Backend Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start with nodemon (auto-reload) |
| Start | `npm start` | Start in production |
| Test | `npm test` | Run with nodemon |

---

## Frontend

A responsive single-page application built with **React 19**, **Vite**, and **React Router 7** for managing personal tasks with full CRUD and status tracking.

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.2.0 | UI library |
| React DOM | ^19.2.0 | DOM rendering |
| React Router DOM | ^7.13.1 | Client-side routing |
| Axios | ^1.13.5 | HTTP client |
| Vite | ^7.3.1 | Build tool & dev server |
| ESLint | — | Code linting |

### Project Structure

```
frontend/
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration & dev proxy
├── package.json
├── .env                          # Frontend environment variables
└── src/
    ├── main.jsx                  # React entry — wraps App with BrowserRouter
    ├── App.jsx                   # Route definitions
    ├── index.css                 # Global styles, CSS variables, animations
    ├── App.css                   # App-level styles
    ├── api/
    │   └── api.js                # Axios instance & all API call functions
    ├── pages/
    │   ├── Register.jsx          # User registration page
    │   ├── Login.jsx             # User login page
    │   └── Dashboard.jsx         # Main task management dashboard
    └── components/
        ├── TaskCard.jsx          # Individual task display, edit & delete
        └── TaskForm.jsx          # New task creation form
```

### Pages

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Register` | Default route — registration page |
| `/login` | `Login` | Login page |
| `/dashboard` | `Dashboard` | Protected task dashboard |

**`/` — Register:** New user registration form with fields for name, email, and password. Validates input, displays error messages, and redirects to `/login` on success.

**`/login` — Login:** User sign-in form with email and password. On success, stores the JWT in `localStorage` and redirects to `/dashboard`.

**`/dashboard` — Dashboard (protected):** The main application view. Redirects to `/login` if no token is found in `localStorage`.
- **Sidebar** with task filters (All, Pending, In Progress, Completed), a progress bar, task count badges, and a logout button
- **Task list** filtered by the active status tab
- **Create task** button that opens the `TaskForm`
- **Mobile responsive** — sidebar becomes a slide-in drawer toggled by a hamburger button

### Components

**`TaskCard`** — Displays a single task with title, description, status badge, and creation date.
- Quick advance button to move the task to the next status (`pending → in_progress → completed`)
- Inline edit mode — allows updating title, description, and status via dropdown
- Delete with confirmation step to prevent accidental removal

**`TaskForm`** — Form for creating a new task.
- Fields: title (required), description (optional), status dropdown
- Validates that title is not empty before submitting

### API Client (`src/api/api.js`)

All backend communication is centralised here. Axios is configured with `VITE_BACKEND_URL` as the base URL.

| Function | Method | Endpoint | Auth |
|----------|--------|----------|------|
| `registerUser(data)` | POST | `/auth/register` | No |
| `loginUser(data)` | POST | `/auth/login` | No |
| `getTasks()` | GET | `/tasks` | Yes |
| `createTask(data)` | POST | `/tasks` | Yes |
| `updateTask(id, data)` | PUT | `/tasks/:id` | Yes |
| `deleteTask(id)` | DELETE | `/tasks/:id` | Yes |

Authenticated requests automatically attach the JWT from `localStorage`:
```
Authorization: Bearer <token>
```

### Styling

Global styles and design tokens are defined in `index.css` using CSS custom properties:

```css
/* Colour palette */
--primary, --primary-hover, --primary-light
--success, --warning, --danger
--bg-primary, --bg-secondary, --bg-card
--text-primary, --text-secondary, --text-muted

/* Spacing, radius, shadows */
--radius-sm, --radius-md, --radius-lg, --radius-xl
--shadow-sm, --shadow-md, --shadow-lg
```

**Animations:** `shimmer`, `fadeIn`, `slideIn` — used for loading states, page transitions, and drawer entry.

**Responsive breakpoint:** The sidebar collapses into a mobile drawer below `768px`.

### Frontend Authentication

- JWT is stored in `localStorage` under the key `token`
- The Dashboard checks for the token on mount and redirects to `/login` if absent
- Logging out clears the token from `localStorage` and redirects to `/login`

### Frontend Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Production build to `dist/` |
| Preview | `npm run preview` | Serve the production build locally |
| Lint | `npm run lint` | Run ESLint |