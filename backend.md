# Backend — MERN Task Manager

A REST API built with **Node.js**, **Express 5**, and **MongoDB** that handles user authentication and task management.

---

## Tech Stack

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

---

## Project Structure

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

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:5173
PORT=3000
```

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Secret key for signing JWTs |
| `CLIENT_ORIGIN` | Frontend origin allowed by CORS |
| `PORT` | Port the server listens on (default: 3000) |

---

## Getting Started

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start development server (auto-reloads with nodemon)
npm run dev

# Start production server
npm start
```

The server runs on `http://localhost:3000`.

---

## Database Models

### User

```js
{
  name:      String  // required
  email:     String  // required, unique
  password:  String  // required, hashed with bcrypt
  createdAt: Date    // auto
  updatedAt: Date    // auto
}
```

### Task

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

---

## API Reference

### Base URL
```
http://localhost:3000
```

---

### Auth Routes — `/api/auth`

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com" }
}
```

---

#### `POST /api/auth/login`
Authenticate a user and receive a JWT.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com" },
    "token": "<jwt>"
  }
}
```

---

### Task Routes — `/api/tasks`

> All task routes require a valid JWT in the `Authorization` header:
> ```
> Authorization: Bearer <token>
> ```

#### `POST /api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Fix login bug",
  "description": "Users can't log in on mobile",
  "status": "pending"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { "_id": "...", "title": "Fix login bug", "status": "pending", ... }
}
```

---

#### `GET /api/tasks`
Get all tasks for the authenticated user.

**Response `200`:**
```json
{
  "success": true,
  "data": [ { "_id": "...", "title": "...", "status": "...", ... } ]
}
```

---

#### `GET /api/tasks/:id`
Get a single task by ID.

**Response `200`:**
```json
{
  "success": true,
  "data": { "_id": "...", "title": "...", "status": "...", ... }
}
```

---

#### `PUT /api/tasks/:id`
Update a task.

**Request Body** (all fields optional):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": { "_id": "...", "title": "Updated title", "status": "in_progress", ... }
}
```

---

#### `DELETE /api/tasks/:id`
Delete a task.

**Response `200`:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Authentication Flow

1. **Register** — password is hashed with `bcrypt` before storing in MongoDB
2. **Login** — credentials validated, a signed JWT is returned (expires in **7 days**)
3. **Protected routes** — `auth.middleware.js` extracts and verifies the JWT from the `Authorization: Bearer <token>` header, then attaches the decoded user to `req.user`

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start with nodemon (auto-reload) |
| Start | `npm start` | Start in production |
| Test | `npm test` | Run with nodemon |
