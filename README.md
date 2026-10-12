# aktiv

Practice-coding platform. `Client` is React + Vite, `Server` is Express + MongoDB.

## Deployment

The root `render.yaml` configures the Render web service to build and start from
`Server`. If the service was created or configured in the Render dashboard,
open **Settings → Build & Deploy** and set **Root Directory** to `Server`
(not `src`), **Build Command** to `npm install`, and **Start Command** to
`npm start`. Otherwise Render looks for `package.json` at the repository root.
Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in the Render service's
environment. `CLIENT_URL` should include the deployed Vercel origin; the server
also allows `http://localhost:5173` for local development.

For the Vercel client, set `VITE_API_URL` to the Render server URL followed by
`/api` (for example, `https://aktiv-webapp-1.onrender.com/api`). Local Vite
development uses this Render API URL by default; restart `npm run dev` after
changing `VITE_API_URL`.
