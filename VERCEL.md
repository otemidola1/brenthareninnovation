# Connect the frontend on Vercel to your Render API

Your **frontend** is on Vercel and your **API (webservice)** runs on Render. To connect them:

---

## 1. Set the API URL on Vercel

1. Open **[Vercel Dashboard](https://vercel.com/dashboard)** and select your project (guesthouse frontend).
2. Go to **Settings** → **Environment Variables**.
3. Add a new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Render Web Service URL + `/api`  
     Example: `https://guesthouse-api.onrender.com/api`  
     (Use your actual Render URL, e.g. `https://brenthareninnovation-4.onrender.com/api` if that’s your service.)
   - **Environment:** Production (and Preview if you want).
4. Save, then trigger a **new deployment** (Deployments → ⋮ → Redeploy) so the new variable is applied.

---

## 2. Set the frontend URL on Render (CORS & password reset)

1. Open **[Render Dashboard](https://dashboard.render.com)** → your **Web Service** (API).
2. Go to **Environment**.
3. Set **FRONTEND_URL** to your Vercel site URL, e.g.:
   - `https://your-project.vercel.app`
   (Use your real Vercel URL, with no trailing slash.)
4. Save. Render will redeploy automatically.

---

## 3. Check it works

- Open your Vercel site and log in or load rooms. Requests should go to the Render API.
- If you see CORS errors in the browser console, confirm **FRONTEND_URL** on Render matches your Vercel URL exactly (including `https://`).

---

## Summary

| Where   | Variable        | Value |
|---------|-----------------|--------|
| **Vercel** | `VITE_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |
| **Render** | `FRONTEND_URL` | `https://YOUR-VERCEL-SITE.vercel.app` |

Local dev is unchanged: without `VITE_API_URL`, the app uses `/api` and the Vite proxy to your local backend.
