# Brentharen Innovations – Guest House Reservation Website

A full-stack guest house reservation system with user authentication, room browsing, booking flow, and admin panel.

## Features

- **Authentication:** Sign up, login, JWT sessions, password reset, role-based access (guest/admin)
- **Rooms:** List, filter by type/price/guests, availability check, room detail
- **Reservations:** Multi-step wizard (room → dates → guest details → review & confirm), availability enforcement, confirmation emails
- **User dashboard:** My bookings, cancel, write review after check-out
- **Admin panel:** Overview, bookings, guests, reviews (approve), rooms (CRUD), housekeeping, settings
- **Pages:** Home, Rooms, Reservation, About, Contact, Terms, Privacy, FAQ

## Tech Stack

- **Frontend:** React 19, Vite 7, React Router 7, Lucide React
- **Backend:** Node.js, Express 5, Sequelize 6, SQLite3
- **Auth:** JWT, bcryptjs; rate limiting on auth routes

## Quick Start

1. **Install dependencies**
   - Root (frontend): `npm install`
   - Backend: `cd server && npm install`

2. **Environment (optional)**  
   Copy `.env.example` to `.env` and set `JWT_SECRET` (and optionally `FRONTEND_URL`, `SMTP_*` for email).

3. **Run**
   - Start backend: `cd server && npm start` (listens on port 3000)
   - Start frontend: `npm run dev` (port 5173; proxies `/api` to backend)

4. **Default admin (after first run)**  
   Email: `admin@brentharen.com`  
   Password: `admin`

## Scripts

- `npm run dev` – Start Vite dev server
- `npm run build` – Production build
- `npm run preview` – Preview production build
- `npm run lint` – ESLint
- **Server:** `npm start` in `server/` – Start API and sync DB

## Documentation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design, database schema, auth, and security notes.
