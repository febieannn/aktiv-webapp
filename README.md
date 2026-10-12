# aktiv

Practice-coding platform. `Client` is React + Vite, `Server` is Express + MongoDB.

## Deployment

The root `render.yaml` configures the Render web service to build and start from
`Server`. Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in the Render service's
environment; `CLIENT_URL` should be the deployed Vercel client origin.

For the Vercel client, set `VITE_API_URL` to the Render server URL followed by
`/api` (for example, `https://your-server.onrender.com/api`).
