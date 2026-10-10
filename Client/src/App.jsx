import { Routes, Route, NavLink, Link, Navigate, useLocation } from "react-router-dom";
import Login from "./commpoents/login.jsx";
import Signup from "./commpoents/signup.jsx";
import HomePage from "./pages/homepage.jsx";
import Home, { YourActivities } from "./pages/home.jsx";
import Activity from "./pages/Activity.jsx";
import Progress from "./pages/Progress.jsx";
import Settings from "./pages/Settings.jsx";
import { getToken } from "./api.js";
import API_URL from "./api";

const response = await fetch(`${API_URL}/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
  }),
});

const data = await response.json();

const Private = ({ children }) => (getToken() ? children : <Navigate to="/login" replace />);

/* Public header: landing, login, signup */
function PublicNav() {
  return (
    <header className="nav">
      <img src="/aktiv.png" alt="Aktiv Logo" width="95" />
      <nav className="nav-links">
        <a href="/#top">Home</a>
        <a href="/#features">Features</a>
        <a href="/#how">How it works</a>
        <a href="/#why">About</a>
      </nav>
      <div className="nav-actions">
        <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
        <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
      </div>
    </header>
  );
}

/* Signed-in header */
function AppNav() {
  return (
    <header className="nav">
     <img src="/aktiv.png" alt="Aktiv Logo" width="95" />
      <nav className="nav-links">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/activities">Activities</NavLink>
        <NavLink to="/progress">Progress</NavLink>
        <a href="/home#how-it-works">How it works</a>
      </nav>
      <div className="nav-actions">
        <Link to="/settings" className="user-chip">
         Settings
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <img src="/aktiv.png" alt="Aktiv Logo" width="95" />
      <nav>
        <a href="#">About</a><a href="#">Features</a><a href="#">Contact</a>
        <a href="#">Privacy Policy</a><a href="#">Terms</a>
      </nav>
    </footer>
  );
}

const PUBLIC = ["/", "/login", "/signup"];

export default function App() {
  const { pathname } = useLocation();
  const isPublic = PUBLIC.includes(pathname);
  const isEditor = pathname.startsWith("/activity/");

  return (
    <div className="app">
      {!isEditor && (isPublic ? <PublicNav /> : <AppNav />)}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Private><Home /></Private>} />
          <Route path="/activities" element={<Private><YourActivities /></Private>} />
          <Route path="/progress" element={<Private><Progress /></Private>} />
          <Route path="/settings" element={<Private><Settings /></Private>} />
          <Route path="/activity/:id" element={<Private><Activity /></Private>} />
        </Routes>
      </main>
      {!isEditor && <Footer />}
    </div>
  );
}
