import "dotenv/config";
import dns from "node:dns";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import progressRoutes from "./routes/progress.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Some networks block Atlas' SRV lookup; use public DNS as a fallback.
try { dns.setServers(["8.8.8.8", "1.1.1.1"]); } catch { /* ignore */ }

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

/* ---- MongoDB connection, cached so serverless (Vercel) reuses it ---- */
const cache = globalThis._aktivMongo || (globalThis._aktivMongo = { conn: null, promise: null });

async function connectDB() {
  if (!MONGO_URI) throw new Error("MONGO_URI is missing. Add it to Server/.env (or Vercel environment variables).");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing. Add it to Server/.env (or Vercel environment variables).");
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000, bufferCommands: false });
  }
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}

function explain(err) {
  const m = err.message || "";
  if (/bad auth|Authentication failed/i.test(m)) return "MongoDB rejected the username or password in MONGO_URI. Reset the database user's password in Atlas > Database Access and update MONGO_URI.";
  if (/ECONNREFUSED|ENOTFOUND|querySrv/i.test(m)) return "Can't reach MongoDB. Check the cluster address in MONGO_URI and your network.";
  if (/whitelist|IP|Server selection timed out/i.test(m)) return "MongoDB blocked the connection. In Atlas > Network Access, allow 0.0.0.0/0.";
  return m;
}

/* ---- App ---- */
const app = express();
const origins = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((s) => s.trim());
app.use(cors({ origin: (origin, cb) => cb(null, !origin || origins.includes("*") || origins.includes(origin)) }));
app.use(express.json());

app.get("/", (_req, res) => res.json({ name: "aktiv API", ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 }));

// Make sure MongoDB is connected before any API route runs.
app.use("/api", async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    res.status(503).json({ message: explain(err) });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/progress", progressRoutes);

app.use(notFound);
app.use(errorHandler);

/* ---- Local dev only: Vercel runs the exported app itself ---- */
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => console.log(`aktiv server running on :${PORT}`));
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", explain(err));
      process.exit(1);
    });
}

export default app;
