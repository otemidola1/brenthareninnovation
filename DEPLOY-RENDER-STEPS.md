# Step-by-step: Deploy database + API live on Render

Follow these steps in order. You’ll create a **PostgreSQL database** and a **Web Service** (your API) that uses it.

---

## Part 1: Create the PostgreSQL database

1. Go to **[Render Dashboard](https://dashboard.render.com)** and sign in.

2. Click **New +** (top right) → **PostgreSQL**.

3. Fill in:
   - **Name:** `guesthouse-db` (or any name you like)
   - **Database:** leave default (e.g. `guesthouse`)
   - **User:** leave default (e.g. `guesthouse`)
   - **Region:** choose closest to you
   - **Plan:** **Free**

4. Click **Create Database**.

5. Wait until the status is **Available** (green).

6. Open the database → go to the **Info** tab.

7. Under **Connections**, find **Internal Database URL**. It looks like:
   ```text
   postgres://guesthouse:xxxxx@dpg-xxxxx-a.oregon-postgres.render.com/guesthouse
   ```

8. Click **Copy** next to **Internal Database URL** and save it somewhere safe (e.g. Notepad). You’ll paste it in Part 2 as `DATABASE_URL`.

---

## Part 2: Create the Web Service (your API)

1. In the Render dashboard, click **New +** → **Web Service**.

2. **Connect your repo:**
   - If you see **otemidola1/brenthareninnovation**, select it.
   - If not, click **Connect account** / **Connect repository** and connect GitHub, then select **brenthareninnovation**.

3. Configure the service:

   | Field | Value |
   |--------|--------|
   | **Name** | `guesthouse-api` (or any name) |
   | **Region** | Same as your database (e.g. Oregon) |
   | **Branch** | `main` |
   | **Root Directory** | `guesthouse/server` if repo root contains `guesthouse`; otherwise `server` ← **critical** |
   | **Runtime** | **Node** |
   | **Build Command** | `npm install` ← use this exactly (do **not** use `npm run build`) |
   | **Start Command** | `npm start` |
   | **Plan** | **Free** |

4. **Environment variables** (click **Advanced** or scroll to Environment):

   Click **Add Environment Variable** and add these **one by one**:

   | Key | Value |
   |-----|--------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | Paste the **Internal Database URL** you copied in Part 1, step 8. |
   | `JWT_SECRET` | Any long random string (e.g. 32+ characters). You can use a generator like [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) or type random letters/numbers. |
   | `FRONTEND_URL` | `http://localhost:5173` (for now; change later if you deploy the frontend to a URL). |

5. Click **Create Web Service**.

6. Render will **build** then **start** your app. Wait until the status is **Live** (green).

7. If deploy fails, open **Logs** and check the error message (you can share it to debug).

---

## Part 3: Check that the database is live

1. On your Web Service page, copy the **URL** at the top (e.g. `https://guesthouse-api.onrender.com`).

2. In the browser, open:
   ```text
   https://YOUR-SERVICE-URL/api/rooms
   ```
   Replace `YOUR-SERVICE-URL` with your actual URL.

3. You should see JSON with a list of rooms (seeded by the app). That means:
   - The API is running.
   - It’s connected to PostgreSQL.
   - Tables were created and seed data was inserted.

4. **Admin login** (for your app’s admin panel):
   - Email: `admin@brentharen.com`
   - Password: `admin`
   (Change this after first login.)

---

## Part 4: Use the live API from your frontend

1. **Local frontend (Vite):**  
   In your frontend, the API is usually called at `/api` (proxied). To point at Render instead:
   - In `src/services/api.js`, set the base URL to your Render Web Service URL, e.g.:
     ```text
     const API_URL = 'https://guesthouse-api.onrender.com/api';
     ```
   - Or use an env variable like `VITE_API_URL` and set it in `.env` (e.g. `VITE_API_URL=https://guesthouse-api.onrender.com/api`), then use that in `api.js`.

2. **CORS:**  
   The backend already has `cors()` enabled, so requests from a different origin (e.g. localhost or a deployed frontend) should work. If you get CORS errors, we can tighten the CORS config to your frontend URL.

3. **FRONTEND_URL:**  
   When you deploy the frontend (e.g. to Render or Vercel), come back to the Web Service → **Environment** → set `FRONTEND_URL` to that frontend URL (e.g. `https://your-frontend.onrender.com`).

---

## Quick reference

| What | Where |
|------|--------|
| Database | Render Dashboard → your PostgreSQL service → **Info** → Internal Database URL |
| API (Web Service) | Render Dashboard → your Web Service → **URL** at top |
| Logs | Web Service → **Logs** tab |
| Env vars | Web Service → **Environment** tab |
| Admin login | `admin@brentharen.com` / `admin` |

---

## Troubleshooting

- **Build fails:** Check **Logs**; often it’s wrong **Root Directory**. Use `server` if your repo root is the `guesthouse` folder; use `guesthouse/server` if your repo root is the parent folder that contains `guesthouse`. Build Command must be `npm install`.
- **Start / crash after build:** Check **Logs** for Node errors. Common causes:
  - Missing **DATABASE_URL**: Add it in the Web Service → **Environment**. Use the **Internal Database URL** from your PostgreSQL service (Info tab), not the External one.
  - Missing **JWT_SECRET**: Add a long random string (e.g. 32+ characters).
  - Node version: The server expects Node 18+. If Render uses an older Node, set env var **NODE_VERSION** = `18` (or `20`) in the Web Service.
- **“Database connection” / “Connection refused”:** Use the **Internal** Database URL (not External). Ensure the database status is **Available** and in the same region as the Web Service. The app now retries the DB connection several times on startup.
- **CORS errors from Vercel frontend:** In the Web Service → **Environment**, set **FRONTEND_URL** to your exact Vercel URL (e.g. `https://your-app.vercel.app`).
- **Free tier:** Web Service sleeps after ~15 min of no traffic; first request may take 30–60 seconds to wake up.
