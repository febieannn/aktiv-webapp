
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import Modal from "../commpoents/Modal.jsx";
import ManageNotifications from "./managenotifications.jsx";
import ConfirmDeletion from "./confirmdeletion.jsx";

const TABS = [
  ["account", "Account"],
  ["notifications", "Notification"],
  ["manage", "Manage account / Log out"],
];

export default function Settings() {
  const nav = useNavigate();

  const [tab, setTab] = useState("account");
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [original, setOriginal] = useState({
    username: "",
    email: "",
  });

  const [error, setError] = useState("");

  // Load the actual logged-in user's account information.
  useEffect(() => {
    let active = true;

    async function loadAccount() {
      try {
        // Use the current-user method provided by your api.js.
        const response = await api.me();
        const user = response?.user ?? response?.data?.user ?? response?.data ?? response;

        const username =
          user.username ?? user.fullname ?? user.full_name ?? user.name ?? "";
        const email = user.email ?? "";

        if (!active) return;

        const account = { username, email };

        setForm({
          ...account,
          password: "",
          confirm: "",
        });

        setOriginal(account);
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load your account information.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAccount();

    return () => {
      active = false;
    };
  }, []);

  const set = (key) => (e) => {
    setForm((previous) => ({
      ...previous,
      [key]: e.target.value,
    }));
  };

  const close = () => setDialog(null);

  const cancelChanges = () => {
    setForm({
      ...original,
      password: "",
      confirm: "",
    });
    setError("");
  };

  const saveChanges = async () => {
    setError("");

    if (!form.username.trim() || !form.email.trim()) {
      setError("Username and email are required.");
      return;
    }

    if (form.password && form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    const changes = {
      username: form.username.trim(),
      email: form.email.trim(),
    };

    if (form.password) {
      changes.password = form.password;
    }

    setSaving(true);

    try {
      const response = await api.updateMe(changes);
      const user =
        response?.user ?? response?.data?.user ?? response?.data ?? response;

      const updated = {
        username:
          user.username ??
          user.fullname ??
          user.full_name ??
          user.name ??
          changes.username,
        email: user.email ?? changes.email,
      };

      setForm({
        ...updated,
        password: "",
        confirm: "",
      });

      setOriginal(updated);
      window.alert("Account updated successfully!");
    } catch (err) {
      setError(err.message || "Unable to update your account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page settings">
      <h1>Settings</h1>
      <p className="muted">
        Manage your profile, reminders and how aktiv looks and feels.
      </p>

      <div className="settings-layout">
        <nav className="side-tabs" aria-label="Settings sections">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              className={tab === key ? "on" : ""}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div>
          {tab === "account" && (
            <div className="card settings-card">
              <h3>Account settings</h3>
              <p className="muted">
                Update how you appear and how you sign in.
              </p>

              {loading ? (
                <p className="muted">Loading your account...</p>
              ) : (
                <>
                  {error && (
                    <p role="alert" className="settings-error">
                      {error}
                    </p>
                  )}

                  <div className="form-grid">
                    <label className="field">
                      <span>Username</span>
                      <input
                        type="text"
                        value={form.username}
                        onChange={set("username")}
                        autoComplete="username"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>Email</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        autoComplete="email"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>New password</span>
                      <input
                        type="password"
                        value={form.password}
                        onChange={set("password")}
                        autoComplete="new-password"
                        placeholder="Leave blank to keep current password"
                      />
                    </label>

                    <label className="field">
                      <span>Confirm password</span>
                      <input
                        type="password"
                        value={form.confirm}
                        onChange={set("confirm")}
                        autoComplete="new-password"
                        placeholder="Confirm new password"
                      />
                    </label>
                  </div>

                  <div className="form-actions">
                    <button
                      className="btn btn-outline btn-xs"
                      onClick={cancelChanges}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn btn-primary btn-xs navy"
                      onClick={saveChanges}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "notifications" && <ManageNotifications />}

          {tab === "manage" && (
            <>
              <div className="card settings-card">
                <h3>Manage account / Log out</h3>

                <div className="toggle-row">
                  <strong>Log out of account?</strong>
                  <button
                    className="btn btn-primary btn-xs navy"
                    onClick={() => setDialog("signout")}
                  >
                    Log out
                  </button>
                </div>
              </div>

              <div className="card settings-card">
                <div className="toggle-row">
                  <div>
                    <strong>Delete account</strong>
                    <small>
                      This removes your activities and progress and can't be
                      undone.
                    </small>
                  </div>

                  <button
                    className="btn btn-danger-outline btn-xs"
                    onClick={() => setDialog("delete")}
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {dialog === "signout" && (
        <Modal onClose={close}>
          <h3>Sign out?</h3>
          <p>
            Are you sure you want to sign out of your Aktiv account? Your
            current session will end.
          </p>

          <div className="modal-actions">
            <button
              className="btn btn-outline btn-xs"
              onClick={close}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary btn-xs navy"
              onClick={async () => {
                try {
                  await api.logout();
                  nav("/login");
                } catch (err) {
                  window.alert(err.message);
                }
              }}
            >
              Sign out
            </button>
          </div>
        </Modal>
      )}

      {dialog === "delete" && (
        <Modal onClose={close}>
          <h3>Delete account?</h3>
          <p>
            Do you want to delete your account? Your submission history will
            be removed and this can't be undone.
          </p>

          <div className="modal-actions">
            <button
              className="btn btn-outline btn-xs"
              onClick={close}
            >
              Cancel
            </button>

            <button
              className="btn btn-red btn-xs"
              onClick={() => setDialog("confirm")}
            >
              Delete account
            </button>
          </div>
        </Modal>
      )}

      {dialog === "confirm" && (
        <ConfirmDeletion
          onCancel={close}
          onConfirm={async (password) => {
            try {
              await api.deleteAccount(password);
              nav("/");
            } catch (err) {
              window.alert(err.message);
            }
          }}
        />
      )}
    </section>
  );
}
