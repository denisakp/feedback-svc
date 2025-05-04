# 📨 Feedback API

A NestJS-based backend challenge project to collect and manage anonymous feedback between authenticated users, with
admin-level metrics and security in mind.

## 🛠️ Features

- **Authentication system** (email + password, JWT)
- **Anonymous feedback submission**
- **Feedback listing for authenticated users**
- **Admin-only system metrics**
- **Role-based access control (RBAC)**
- **Swagger API documentation**
- **MongoDB with Mongoose**
- **Unit testing (WIP)**

---

## 📁 Project Structure

```
src/
├── admins/         → Admin endpoints (system metrics)
├── auth/           → Login, registration, JWT strategies, role guards
├── database/       → MongoDB connection and shared schemas
├── feedbacks/      → Feedback CRUD logic (DTOs, schema, service, controller)
├── users/          → User management
└── main.ts         → App bootstrap
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (`npm install -g pnpm`)
- MongoDB (local or Atlas)

### Installation

```bash
pnpm install
```

### Running the app

```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

---

## 🧪 Running Tests

```bash
pnpm test
```

---

## 📘 API Documentation

Once the app is running, Swagger is available at:

```
http://localhost:3000/api
```

---

## 👮 Authentication

The app uses a full authentication system with JWT. You must register and login to access feedback endpoints.

Roles available:
- `user` → can send/receive feedback
- `admin` → can access system metrics

---

## 📊 Admin Metrics

Accessible via `/admin/metrics` (requires `admin` role):

- Total number of feedbacks
- Number of active users
- (Optional) Feedback stats over time

---

## 🧰 Tech Stack

- **NestJS** (TypeScript)
- **MongoDB + Mongoose**
- **Passport.js** (Local + JWT strategy)
- **Swagger** for API documentation
- **Jest** for unit testing
