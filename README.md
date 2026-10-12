# aktiv

Practice-coding platform. `Client` is React + Vite, `Server` is Express + MongoDB.

## Deployment

The root `render.yaml` configures the Render web service to build and start from
`Server`. If the service was created or configured in the Render dashboard,
open **Settings → Build & Deploy** and set **Root Directory** to `Server`
(not `src`), **Build Command** to `npm install`, and **Start Command** to
`npm start`. Otherwise Render looks for `package.json` at the repository root.
Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in the Render service's
environment. Include `https://aktiv-webapp-5xbk.vercel.app` in `CLIENT_URL`;
the server also allows `http://localhost:5173` for local development.

For the Vercel client, set `VITE_API_URL` to
`https://aktiv-webapp-1.onrender.com` in the Production, Preview, and
Development environments. The client adds `/api` automatically. Local Vite
development proxies `/api` to Render, so local requests do not depend on browser
CORS settings. Restart `npm run dev` after changing the Vite configuration.
