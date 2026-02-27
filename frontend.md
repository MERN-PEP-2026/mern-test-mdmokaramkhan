# Frontend — MERN Task Manager

A responsive single-page application built with **React 19**, **Vite**, and **React Router 7** for managing personal tasks with full CRUD and status tracking.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.2.0 | UI library |
| React DOM | ^19.2.0 | DOM rendering |
| React Router DOM | ^7.13.1 | Client-side routing |
| Axios | ^1.13.5 | HTTP client |
| Vite | ^7.3.1 | Build tool & dev server |
| ESLint | — | Code linting |

---

## Project Structure

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

---

## Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_BACKEND_URL=/api
```

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Base URL for API requests. Use `/api` in dev (proxied by Vite) or the full backend URL in production. |

> In development, Vite proxies all `/api` requests to `http://localhost:3000`.

---

## Getting Started

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

The dev server runs on `http://localhost:5173`.

---

## Pages

### `/` — Register
New user registration form with fields for **name**, **email**, and **password**. Validates input, displays error messages, and redirects to `/login` on success.

### `/login` — Login
User sign-in form with **email** and **password**. On success, stores the JWT in `localStorage` and redirects to `/dashboard`. Displays API error messages inline.

### `/dashboard` — Dashboard *(protected)*
The main application view. Redirects to `/login` if no token is found in `localStorage`.

**Features:**
- **Sidebar** with task filters (All, Pending, In Progress, Completed), a progress bar, task count badges, and a logout button
- **Task list** filtered by the active status tab
- **Create task** button that opens the `TaskForm`
- **Mobile responsive** — sidebar becomes a slide-in drawer toggled by a hamburger button

---

## Components

### `TaskCard`
Displays a single task with its title, description, status badge, and creation date.

- **Quick advance** button to move the task to the next status (`pending → in_progress → completed`)
- **Edit mode** — toggled inline; allows updating title, description, and status via a dropdown
- **Delete** with a confirmation step to prevent accidental removal

### `TaskForm`
A form for creating a new task.

- Fields: **title** (required), **description** (optional), **status** (dropdown: pending / in_progress / completed)
- Validates that title is not empty before submitting
- Calls the `createTask` API function and notifies the parent on success

---

## API Client (`src/api/api.js`)

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
```js
Authorization: Bearer <token>
```

---

## Routing

Defined in `App.jsx`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Register` | Default route — registration page |
| `/login` | `Login` | Login page |
| `/dashboard` | `Dashboard` | Protected task dashboard |

---

## Styling

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

---

## Authentication

- JWT is stored in `localStorage` under the key `token`
- The Dashboard checks for the token on mount and redirects to `/login` if absent
- Logging out clears the token from `localStorage` and redirects to `/login`

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Production build to `dist/` |
| Preview | `npm run preview` | Serve the production build locally |
| Lint | `npm run lint` | Run ESLint |
