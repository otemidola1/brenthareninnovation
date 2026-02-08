# Deploying to Render with Live PostgreSQL

The app uses **PostgreSQL** when `DATABASE_URL` is set (e.g. on Render). Locally it still uses SQLite if `DATABASE_URL` is not set.

---

## Option A: Blueprint (one-click)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect the repo **otemidola1/brenthareninnovation**.
3. Render will read `render.yaml` and create:
   - A **PostgreSQL** database (`guesthouse-db`)
   - A **Web Service** (`guesthouse-api`) that gets `DATABASE_URL` and `JWT_SECRET` automatically.
4. After deploy, set **FRONTEND_URL** in the Web Service **Environment** to your frontend URL (e.g. `https://your-frontend.onrender.com` or your Vite dev URL for testing).
5. Open the Web Service URL; the API will sync tables and run the seed (admin user + rooms).

---

## Option B: Manual setup

### 1. Create PostgreSQL database

1. **New** → **PostgreSQL**.
2. Name: `guesthouse-db`, Plan: **Free**.
3. Create. Copy the **Internal Database URL** (or use the one from the **Info** tab).

### 2. Create Web Service (backend)

1. **New** → **Web Service**.
2. Connect the same repo; set **Root Directory** to `server`.
3. **Build:** `npm install`
4. **Start:** `npm start`
5. **Environment:**
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = paste the Internal Database URL from step 1
   - `JWT_SECRET` = a long random string (generate one)
   - `FRONTEND_URL` = your frontend URL (e.g. `https://...onrender.com` or `http://localhost:5173` for local dev)
6. Deploy. On first start the app will create tables and seed admin + rooms.

---

## After deploy

- **API base URL:** `https://guesthouse-api.onrender.com` (or the URL Render gives you).
- **Admin login:** `admin@brentharen.com` / `admin` (change password after first login).
- If you deploy the frontend (e.g. as a static site on Render or Vercel), set its API base URL to this backend URL and set `FRONTEND_URL` on the backend to that frontend URL.

## Free tier notes

- The free Web Service **spins down** after ~15 min of no traffic; first request may be slow.
- Free PostgreSQL has a 1 GB limit and is removed after 90 days if not upgraded; you can re-create it or upgrade when needed.
