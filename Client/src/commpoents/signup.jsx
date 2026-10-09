import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { AuthArt, Field, GoogleButton } from "./login.jsx";

export default function Signup() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.password !== f.confirm) return setError("Passwords don't match. Re-enter both and try again.");
    setError("");
    try {
      await api.signup({ fullname: f.name, email: f.email, password: f.password });
      nav("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth">
      <form className="auth-form" onSubmit={submit}>
        <p className="eyebrow">Create an account</p>
        <h1>Start Your Coding Journey</h1>
        <p className="muted">Join aktiv today and get access to interactive coding challenges, real-time feedback, and a community of learners.</p>

        <Field label="Fullname" icon="👤" placeholder="Enter your full name" value={f.name} onChange={set("name")} required />
        <Field label="Email Address" icon="✉" type="email" placeholder="you@example.com" value={f.email} onChange={set("email")} required />
        <Field label="Password" icon="🔒︎" type="password" placeholder="Create a password" value={f.password} onChange={set("password")} required minLength={8} />
        <Field label="Confirm Password" icon="🔒︎" type="password" placeholder="Confirm your password" value={f.confirm} onChange={set("confirm")} required />
        {error && <p className="error" role="alert">{error}</p>}

        <button className="btn btn-primary btn-block">Sign Up →</button>
        <div className="or"><span>OR</span></div>
        <GoogleButton>Sign Up with Google</GoogleButton>
        <p className="switch">Already have an account? <Link to="/login">Login</Link></p>
      </form>
      <AuthArt />
    </section>
  );
}
