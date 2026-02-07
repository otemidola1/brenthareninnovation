# Guest House Reservation System – Architecture

## Overview

Full-stack guest house reservation website: React (Vite) frontend and Node.js (Express) backend with SQLite and Sequelize ORM.

## Stack

- **Frontend:** React 19, React Router 7, Vite 7, Lucide React
- **Backend:** Node.js, Express 5, Sequelize 6, SQLite3
- **Auth:** JWT (jsonwebtoken), bcryptjs for password hashing
- **Email:** Nodemailer (Ethereal in dev; configure SMTP in production)

## Project Structure

```
guesthouse/
├── server/                 # Backend
│   ├── middleware/
│   │   └── auth.js         # JWT optionalAuth, requireAuth, requireAdmin
│   ├── routes/
│   │   ├── auth.js         # Register, login, me, change-password, forgot/reset password
│   │   ├── bookings.js     # CRUD, check-in/check-out, list (filtered by user/admin)
│   │   ├── rooms.js        # List, availability, CRUD (create/update/delete admin only)
│   │   ├── reviews.js      # List (approved), create (auth), patch/delete (admin)
│   │   ├── users.js        # List (admin only)
│   │   └── cards.js        # List/add/delete/setDefault (auth, scoped to user)
│   ├── services/
│   │   ├── emailService.js  # Nodemailer send
│   │   └── emailTemplates.js
│   ├── models.js           # Sequelize User, Room, Booking, Review, SavedCard
│   ├── seed.js             # Admin user + default rooms if empty
│   └── server.js           # Express app, rate limit on /api/auth, CORS, routes
├── src/
│   ├── components/         # Navbar, Footer, ProtectedRoute, RoomCard, ReservationWizard, etc.
│   ├── context/
│   │   └── AuthContext.jsx # login, register, logout, user, loading
│   ├── pages/              # Home, Login, Register, Rooms, Reservation, Dashboard, Admin, Terms, Privacy, FAQ
│   └── services/
│       └── api.js          # Frontend API client (auth, rooms, bookings, reviews, cards, users)
├── database.sqlite         # SQLite DB (created by Sequelize)
└── vite.config.js         # Proxy /api to backend port
```

## Database Schema

- **User:** name, email (unique), password (hashed), role (guest/admin), phone, resetToken, resetTokenExpiry
- **Room:** name, type, price, guests, description, image, housekeepingStatus, priority, lastCleaned, assignedTo
- **Booking:** checkIn, checkOut, guests, status, roomType, realCheckInTime, realCheckOutTime; belongs to User and Room
- **Review:** rating (1–5), comment, approved, roomType; belongs to User
- **SavedCard:** last4, brand, token, expiryMonth, expiryYear, isDefault; belongs to User

Indexes: User (email), Booking (UserId, RoomId, checkIn/checkOut, status).

## Authentication & Authorization

- **Register:** Password strength (min 8 chars, upper, lower, number). Email normalized (trim, lowercase). Duplicate email rejected.
- **Login:** Email/password; JWT issued (1d). Rate limit on `/api/auth` (20 requests per 15 min).
- **Protected routes:** `requireAuth` sets `req.user` from JWT; 401 if missing/invalid.
- **Admin routes:** `requireAdmin` used after `requireAuth` for rooms CRUD, users list, booking check-in/check-out, review approve/delete.
- **Scoping:** Bookings list returns all for admin, only own for guest. Cards and review create use `req.user.id`.

## Booking Flow

1. User selects room (by name/type), dates, guests in ReservationWizard.
2. Frontend sends POST `/api/bookings` with roomType, checkIn, checkOut, guests (auth required).
3. Backend validates dates, finds Room by name or type, checks availability (no overlapping non-cancelled booking for that RoomId), creates Booking with UserId from token and RoomId.
4. Confirmation email sent (if SMTP configured). Frontend redirects to dashboard.

Availability: GET `/api/rooms/availability?roomType=&checkIn=&checkOut=` returns `{ available: boolean }`.

## Security

- JWT_SECRET and PORT from environment (see `.env.example`).
- Passwords hashed with bcrypt (rounds 10).
- Auth rate limiting on `/api/auth`.
- CORS enabled; in production restrict origin.
- Inputs trimmed/normalized; validation on register, reset password, booking, review.
- Booking create uses `req.user.id`; PATCH booking allowed only for owner or admin.

## Running

1. **Backend:** `cd server && npm install && npm start` (default port 3000). DB syncs and seeds if empty.
2. **Frontend:** `npm install && npm run dev` (port 5173). API proxy forwards `/api` to backend.
3. **Env:** Copy `.env.example` to `.env` in project root or `server/` and set `JWT_SECRET`, optional `FRONTEND_URL`, `SMTP_*` for email.

## Default Admin

After seed: email `admin@brentharen.com`, password `admin`. Change in production.
