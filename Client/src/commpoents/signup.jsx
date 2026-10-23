
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { AuthArt, Field } from "./login.jsx";

export default function Signup() {
  const nav = useNavigate();

  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const set = (k) => (e) =>
    setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (f.password !== f.confirm) {
      setError("Passwords don't match. Re-enter both and try again.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await api.signup({
        fullname: f.name,
        email: f.email,
        password: f.password,
      });

      nav("/home");
    } catch (err) {
      setError(err.message || "Unable to create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth">
      <form className="auth-form" onSubmit={submit}>
        <p className="eyebrow">Create an account</p>

        <h1>Start Your Coding Journey</h1>

        <p className="muted">
          Join aktiv today and get access to interactive coding challenges,
          real-time feedback, and a community of learners.
        </p>

        <Field
          label="Fullname"
          icon="👤"
          placeholder="Enter your full name"
          value={f.name}
          onChange={set("name")}
          required
        />

        <Field
          label="Email Address"
          icon="✉"
          type="email"
          placeholder="you@example.com"
          value={f.email}
          onChange={set("email")}
          required
        />

        <Field
          label="Password"
          icon="🔒︎"
          type="password"
          placeholder="Create a password"
          value={f.password}
          onChange={set("password")}
          required
          minLength={8}
        />

        <Field
          label="Confirm Password"
          icon="🔒︎"
          type="password"
          placeholder="Confirm your password"
          value={f.confirm}
          onChange={set("confirm")}
          required
        />

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={`btn btn-primary btn-block ${isLoading ? "signup-loading" : ""}`}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className="signup-spinner" aria-hidden="true" />
              Creating account...
            </>
          ) : (
            "Sign Up →"
          )}
        </button>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>

      <AuthArt />
    </section>
  );
}
