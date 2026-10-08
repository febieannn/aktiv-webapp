import { Routes, Route, NavLink, Link, Navigate, useLocation } from "react-router-dom";
import Login from "./commpoents/login.jsx";
import Signup from "./commpoents/signup.jsx";
import HomePage from "./pages/homepage.jsx";
import Home, { YourActivities } from "./pages/home.jsx";
import Activity from "./pages/Activity.jsx";
import Progress from "./pages/Progress.jsx";
import Settings from "./pages/Settings.jsx";
import { getToken } from "./api.js";

/* Redirect to /login when there is no session token */
const Private = ({ children }) => (getToken() ? children : <Navigate to="/login" replace />);

/* Public header: landing, login, signup */
function PublicNav() {
  return (
    <header className="nav">
      <Link to="/" className="logo">aktiv</Link>
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
      <Link to="/home" className="logo">aktiv</Link>
      <nav className="nav-links">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/activities">Activities</NavLink>
        <NavLink to="/progress">Progress</NavLink>
        <a href="/home#how-it-works">How it works</a>
      </nav>
      <div className="nav-actions">
        <button className="icon-btn" aria-label="Notifications">🔔</button>
        <Link to="/settings" className="user-chip">
          <span className="avatar sm">JD</span> Username
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span className="logo">aktiv</span>
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
