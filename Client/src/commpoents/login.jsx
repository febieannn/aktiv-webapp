import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

/* Right-hand illustration shared by login + signup */
export function AuthArt() {
  return (
    <aside className="auth-art">
      <div className="art-stage">
        <span className="blob b1" /><span className="blob b2" />
        <div className="code-window">
          <div className="dots"><i /><i /><i /></div>
          <div className="bar" />
          <pre>{`function learn() {
  return {
    skills: true,
    progress: 'continuous',
    future: 'brighter'
  }
}

// Keep coding. Keep learning.`}</pre>
        </div>
      </div>
      <h2>Build Skills.<br />Create Opportunities.</h2>
      <p>Whether you're a beginner or looking to level up, aktiv gives you the tools and challenges to become a better programmer — one step at a time.</p>
    </aside>
  );
}

export function Field({ label, icon, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        <i aria-hidden="true">{icon}</i>
        <input {...props} />
      </div>
    </label>
  );
}

export function GoogleButton({ children }) {
  return (
    <button type="button" className="btn btn-outline btn-block google">
      <b>G</b> {children}
    </button>
  );
}

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.login(form);
      nav("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth">
      <form className="auth-form" onSubmit={submit}>
        <p className="eyebrow">Hello programmer</p>
        <h1>Welcome!</h1>
        <p className="muted">Log in to continue your coding journey and keep building your skills with aktiv.</p>

        <Field label="Email Address" icon="✉" type="email" placeholder="Enter your email" value={form.email} onChange={set("email")} required />
        <Field label="Password" icon="🔒" type="password" placeholder="Enter your password" value={form.password} onChange={set("password")} required />
        <a href="#" className="forgot">Forgot Password?</a>

        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-primary btn-block">Log in →</button>
        <div className="or"><span>OR</span></div>
        <GoogleButton>Log in with Google</GoogleButton>
        <p className="switch">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
      <AuthArt />
    </section>
  );
}
