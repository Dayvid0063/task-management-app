# Task Management Application

A full-stack task manager where a registered user can create, view, update and delete their own tasks. Built with Nuxt 4 and MongoDB, with authentication, per-user data scoping, input validation and consistent error handling.

---

## Tech Stack

| Layer            | Choice                                             |
| ---------------- | -------------------------------------------------- |
| Framework        | [Nuxt 4](https://nuxt.com/) (Vue 3, Nitro server)  |
| Language         | TypeScript (server, models, stores), Vue SFCs (UI) |
| Database         | MongoDB via [Mongoose](https://mongoosejs.com/)    |
| Validation       | [Zod](https://zod.dev/)                            |
| Authentication   | JWT (`jsonwebtoken`) in an httpOnly cookie, `bcryptjs` for hashing |
| State (auth)     | [Pinia](https://pinia.vuejs.org/)                  |
| Styling          | Tailwind CSS with CSS-variable design tokens       |

---

## Features

- **Authentication** — register, log in, log out, session persistence
- **Task CRUD** — create, list, view a single task, update, delete
- **Per-user scoping** — each user only sees and manages their own tasks
- **Dashboard** — task counts by status and a list of recent tasks
- **Validation & error handling** — clear messages for invalid input, correct HTTP status codes
- **Responsive UI** — works on desktop and mobile, with a collapsible sidebar

---

## Prerequisites

- **Node.js** 20+ and npm
- **Docker** and Docker Compose (used to run MongoDB locally)

---

## Getting Started

From the project root:

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment variables**

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

Then generate a session secret and paste it into `.env` as `NUXT_SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

See [Environment Variables](#environment-variables) for the full list.

**3. Start MongoDB**

```bash
docker compose up -d
```

This starts a MongoDB container on `localhost:27017`. Confirm it is healthy with `docker compose ps`.

**4. Run the app**

```bash
npm run dev
```

The app is available at **http://localhost:your running port**. Register an account to get started.

To stop MongoDB later: `docker compose down`.

---

## Environment Variables

| Variable               | Description                                  | Example                                      |
| ---------------------- | -------------------------------------------- | -------------------------------------------- |
| `NUXT_MONGODB_URI`     | MongoDB connection string                    | `mongodb://127.0.0.1:27017/taskmanager`      |
| `NUXT_SESSION_SECRET`  | Secret used to sign session JWTs             | *(generate with the command above)*          |

Both are consumed via Nuxt's `runtimeConfig`. The `.env` is git-ignored; `.env.example` documents the required keys.

---

## Available Scripts

| Script            | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the dev server              |
| `npm run build`   | Build for production              |
| `npm run preview` | Preview the production build      |

---

## Project Structure

```
task-management-app/
├── app/
│   ├── assets/css/main.css          # Tailwind entry + color tokens
│   ├── components/Layout/Sidebar.vue
│   ├── layouts/dashboard.vue
│   ├── middleware/tm-user-auth.ts   # client-side route guard
│   ├── pages/
│   │   ├── index.vue                # landing page
│   │   ├── login.vue
│   │   ├── register.vue
│   │   └── dashboard/
│   │       ├── index.vue            # dashboard (stats + recent tasks)
│   │       └── tasks/
│   │           ├── index.vue        # task list
│   │           ├── form.vue         # create / edit (dual mode)
│   │           └── [id].vue         # task detail
│   ├── stores/taskManagerUser.ts    # auth store (Pinia)
│   └── utils/taskStatus.ts          # status labels + badge colors
├── server/
│   ├── api/
│   │   ├── auth/                     # register, login, logout, me
│   │   ├── tasks/                    # CRUD (collection + [id])
│   │   └── dashboard.get.ts          # status counts + recent tasks
│   ├── models/                       # user.model.ts, task.model.ts
│   ├── plugins/db.ts                 # connects to MongoDB on boot
│   └── utils/                        # db.ts, auth.ts, task-validation.ts
├── docker-compose.yml                # local MongoDB
├── nuxt.config.ts
├── tailwind.config.ts
└── .env.example
```

---

## API Reference

All `/api/tasks` and `/api/dashboard` routes require an authenticated session (the cookie set at login) and are scoped to the current user.

### Auth

| Method | Endpoint             | Description                     |
| ------ | -------------------- | ------------------------------- |
| POST   | `/api/auth/register` | Create an account and sign in   |
| POST   | `/api/auth/login`    | Sign in                         |
| POST   | `/api/auth/logout`   | Sign out (clears the cookie)    |
| GET    | `/api/auth/me`       | Get the current user            |

### Tasks

| Method | Endpoint           | Description                      |
| ------ | ------------------ | -------------------------------- |
| GET    | `/api/tasks`       | List the user's tasks            |
| POST   | `/api/tasks`       | Create a task                    |
| GET    | `/api/tasks/:id`   | Get a single task                |
| PUT    | `/api/tasks/:id`   | Update a task                    |
| DELETE | `/api/tasks/:id`   | Delete a task                    |

### Dashboard

| Method | Endpoint          | Description                          |
| ------ | ----------------- | ------------------------------------ |
| GET    | `/api/dashboard`  | Task counts by status + recent tasks |

**Task shape**

```
title        string    required
description  string    optional
status       string    one of: todo | in_progress | done  (default: todo)
dueDate      date      required
createdAt    date      set automatically
updatedAt    date      set automatically
```

---

## Design Decisions & Assumptions

**Authentication**
- Sessions use a JWT stored in an **httpOnly, SameSite=Lax cookie**, so the token is not readable from JavaScript (mitigating XSS token theft) and is sent automatically with requests.
- Passwords are hashed with bcrypt. The hash field is `select: false`, so it is never returned by ordinary queries; the login route explicitly re-selects it to verify credentials.
- Login returns the **same error for an unknown email and a wrong password**, to avoid revealing which emails are registered.

**Per-user scoping**
- Every task belongs to an `owner`. All task queries filter by the authenticated user, so a user only ever sees their own data.
- A request for a task owned by another user returns **404, not 403** — this avoids confirming that another user's task exists.

**Validation & error handling**
- Input is validated with **Zod at the API boundary**, returning `400` with a readable message. The Mongoose schema (`required`, `enum`) acts as a second-layer backstop.
- A malformed task id returns **404** rather than letting a database cast error surface as a `500`.
- Status codes are used consistently: `201` on create, `400` for invalid input, `401` when unauthenticated, `404` when not found.

**Data model**
- `title` and `dueDate` are treated as **required** (the brief lists due date as a task field). `description` is **optional**.
- `status` is constrained to `todo | in_progress | done` and defaults to `todo`.
- "Created date" is provided by Mongoose `timestamps` (`createdAt` / `updatedAt`).

**Architecture**
- Route middleware guards the UI on the client (redirecting unauthenticated users to login), while the API **independently enforces auth on every request** — so protection never depends on the client.
- Only **authentication** uses a shared Pinia store; task pages call the API directly, since task data is page-local and doesn't need global state.
- `PUT` accepts **partial payloads** (patch-like) and runs schema validators on update.
- The dashboard uses a **single endpoint** that returns status counts (via a MongoDB aggregation) and recent tasks together, to avoid multiple round-trips.
- Colors are defined once as **CSS variables** and mapped into Tailwind, so the theme can change by swapping variables.

**Local infrastructure**
- `docker-compose` runs **MongoDB only**; the app runs via npm. This keeps setup to two commands and avoids containerizing the dev app unnecessarily.

---

## Known Limitations

- MongoDB runs as a **single node** locally, so multi-document transactions aren't available (not required by this app).
- Due dates are stored at **UTC midnight**, so a user in a far-negative UTC offset could see a due date rendered one day earlier. Production would use explicit timezone handling.
- The task list is **not paginated** — fine at the expected scale, but would be added for large datasets.

---

## Possible Improvements

- Automated tests (Vitest) for the validation schemas and route handlers.
- Task filtering, sorting, and search; pagination on the list.
- Optimistic UI updates and toast notifications.
- Rate limiting on auth endpoints and refresh-token rotation.
