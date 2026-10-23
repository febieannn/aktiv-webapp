
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import Modal from "../commpoents/Modal.jsx";
import ManageNotifications from "./managenotifications.jsx";
import ConfirmDeletion from "./confirmdeletion.jsx";

const TABS = [
  ["account", "Account"],
  ["notifications", "Notifications"],
  ["manage", "Manage Account"],
];

/* Password Field — No Eye Toggle */
function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  disabled = false,
  required = false,
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <div className="settings-password-wrap">
        <input
          type="password"
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
      </div>
    </label>
  );
}

const statusClass = (status) => {
  if (status === "Complete") return "ok";
  if (status === "In Progress") return "wip";
  return "new";
};

const cta = (status) => {
  if (status === "Complete") return "View Activity";
  if (status === "In Progress") return "Continue";
  return "Start Activity";
};

export default function Settings() {
  const nav = useNavigate();

  const [tab, setTab] = useState("account");
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      try {
        const response = await api.me();

        const user =
          response?.user ??
          response?.data?.user ??
          response?.data ??
          response;

        const account = {
          username:
            user?.username ??
            user?.fullname ??
            user?.full_name ??
            user?.name ??
            "",
          email: user?.email ?? "",
        };

        if (!active) return;

        setForm({
          ...account,
          password: "",
          confirm: "",
        });

        setOriginal(account);
      } catch (err) {
        if (active) {
          setError(
            err?.message ||
              "Unable to load your account information."
          );
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

  const updateField = (key) => (event) => {
    setForm((previous) => ({
      ...previous,
      [key]: event.target.value,
    }));

    setError("");
  };

  const close = () => {
    if (!saving && !signingOut && !deleting) {
      setDialog(null);
    }
  };

  const cancelChanges = () => {
    setForm({
      ...original,
      password: "",
      confirm: "",
    });

    setError("");
  };

  const saveChanges = async (event) => {
    event.preventDefault();
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
        response?.user ??
        response?.data?.user ??
        response?.data ??
        response;

      const updated = {
        username:
          user?.username ??
          user?.fullname ??
          user?.full_name ??
          user?.name ??
          changes.username,
        email: user?.email ?? changes.email,
      };

      setForm({
        ...updated,
        password: "",
        confirm: "",
      });

      setOriginal(updated);
      window.alert("Account updated successfully!");
    } catch (err) {
      setError(
        err?.message || "Unable to update your account."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setSigningOut(true);

    try {
      await api.logout();
      setDialog(null);
      nav("/login", { replace: true });
    } catch (err) {
      window.alert(err?.message || "Unable to log out.");
    } finally {
      setSigningOut(false);
    }
  };

  const handleDelete = async (password) => {
    setDeleting(true);

    try {
      await api.deleteAccount(password);
      setDialog(null);
      nav("/", { replace: true });
    } catch (err) {
      window.alert(
        err?.message || "Unable to delete your account."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="page settings">
      <header className="settings-header">
        <h1>Settings</h1>
        <p className="muted">
          Manage your profile, reminders, and account preferences.
        </p>
      </header>

      <div className="settings-layout">
        <nav
          className="side-tabs"
          aria-label="Settings sections"
          role="tablist"
          aria-orientation="vertical"
        >
          {TABS.map(([key, label]) => (
            <button
              key={key}
              id={`settings-tab-${key}`}
              type="button"
              role="tab"
              aria-selected={tab === key}
              aria-controls={`settings-panel-${key}`}
              tabIndex={tab === key ? 0 : -1}
              className={`settings-tab ${tab === key ? "on" : ""}`}
              onClick={() => {
                setTab(key);
                setError("");
              }}
              onKeyDown={(event) => {
                const currentIndex = TABS.findIndex(
                  ([tabKey]) => tabKey === tab
                );

                let nextIndex = currentIndex;

                if (
                  event.key === "ArrowDown" ||
                  event.key === "ArrowRight"
                ) {
                  nextIndex = (currentIndex + 1) % TABS.length;
                } else if (
                  event.key === "ArrowUp" ||
                  event.key === "ArrowLeft"
                ) {
                  nextIndex =
                    (currentIndex - 1 + TABS.length) %
                    TABS.length;
                } else if (event.key === "Home") {
                  nextIndex = 0;
                } else if (event.key === "End") {
                  nextIndex = TABS.length - 1;
                } else {
                  return;
                }

                event.preventDefault();

                const [nextTab] = TABS[nextIndex];
                setTab(nextTab);

                document
                  .getElementById(`settings-tab-${nextTab}`)
                  ?.focus();
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="settings-content">
          {tab === "account" && (
            <div
              id="settings-panel-account"
              role="tabpanel"
              aria-labelledby="settings-tab-account"
              className="card settings-card"
            >
              <h3>Account Settings</h3>

              <p className="muted">
                Update your profile and sign-in information.
              </p>

              {loading ? (
                <p className="muted" role="status">
                  Loading your account...
                </p>
              ) : (
                <form onSubmit={saveChanges}>
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
                        onChange={updateField("username")}
                        autoComplete="username"
                        required
                      />
                    </label>

                    <label className="field">
                      <span>Email</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={updateField("email")}
                        autoComplete="email"
                        required
                      />
                    </label>

                    <PasswordField
                      label="New Password"
                      value={form.password}
                      onChange={updateField("password")}
                      autoComplete="new-password"
                      placeholder="Leave blank to keep current password"
                    />

                    <PasswordField
                      label="Confirm Password"
                      value={form.confirm}
                      onChange={updateField("confirm")}
                      autoComplete="new-password"
                      placeholder="Confirm your new password"
                      disabled={!form.password}
                      required={Boolean(form.password)}
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-xs"
                      onClick={cancelChanges}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary btn-xs navy"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {tab === "notifications" && (
            <div
              id="settings-panel-notifications"
              role="tabpanel"
              aria-labelledby="settings-tab-notifications"
              className="settings-panel"
            >
              <ManageNotifications />
            </div>
          )}

          {tab === "manage" && (
            <div
              id="settings-panel-manage"
              role="tabpanel"
              aria-labelledby="settings-tab-manage"
              className="settings-panel"
            >
              <div className="card settings-card">
                <h3>Manage Account</h3>

                <p className="muted">
                  Manage your session and account.
                </p>

                <div className="toggle-row">
                  <div>
                    <strong>Log out</strong>
                    <small>
                      Sign out of your current Aktiv account.
                    </small>
                  </div>

                  <button
                    type="button"
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
                    <strong>Delete Account</strong>
                    <small>
                      This action may permanently remove your account
                      and associated data.
                    </small>
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger-outline btn-xs"
                    onClick={() => setDialog("delete")}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {dialog === "signout" && (
        <Modal onClose={close}>
          <h3>Sign out?</h3>

          <p>
            Are you sure you want to sign out of your Aktiv account?
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={close}
              disabled={signingOut}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-primary btn-xs navy"
              onClick={handleLogout}
              disabled={signingOut}
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </Modal>
      )}

      {dialog === "delete" && (
        <Modal onClose={close}>
          <h3>Delete Account?</h3>

          <p>
            Are you sure you want to continue? This action may not be
            reversible.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={close}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-red btn-xs"
              onClick={() => setDialog("confirm")}
            >
              Continue
            </button>
          </div>
        </Modal>
      )}

      {dialog === "confirm" && (
        <ConfirmDeletion
          onCancel={close}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
}
