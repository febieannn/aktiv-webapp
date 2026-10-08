import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import Modal from "../commpoents/Modal.jsx";
import ManageNotifications from "./managenotifications.jsx";
import ConfirmDeletion from "./confirmdeletion.jsx";

const TABS = [["account", "Account"], ["notifications", "Notification"], ["manage", "Manage account / Log out"]];

export default function Settings() {
  const nav = useNavigate();
  const [tab, setTab] = useState("account");
  const [dialog, setDialog] = useState(null); // signout | delete | confirm
  const [form, setForm] = useState({ username: "jdelacruz", email: "jordandelacruz@email.com", password: "", confirm: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const close = () => setDialog(null);

  return (
    <section className="page settings">
      <h1>Settings</h1>
      <p className="muted">Manage your profile, reminders and how aktiv looks and feels.</p>

      <div className="settings-layout">
        <nav className="side-tabs" aria-label="Settings sections">
          {TABS.map(([k, label]) => (
            <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{label}</button>
          ))}
        </nav>

        <div>
          {tab === "account" && (
            <div className="card settings-card">
              <h3>Account settings</h3>
              <p className="muted">Update how you appear and how you sign in.</p>
              <div className="avatar-row">
                <span className="avatar">JD</span>
                <button className="btn btn-outline btn-xs">Edit profile</button>
              </div>
              <div className="form-grid">
                <label className="field"><span>Username</span><input value={form.username} onChange={set("username")} /></label>
                <label className="field"><span>Email</span><input type="email" value={form.email} onChange={set("email")} /></label>
                <label className="field"><span>New password</span><input type="password" value={form.password} onChange={set("password")} /></label>
                <label className="field"><span>Confirm password</span><input type="password" value={form.confirm} onChange={set("confirm")} /></label>
              </div>
              <div className="form-actions">
                <button className="btn btn-outline btn-xs">Cancel</button>
                <button className="btn btn-primary btn-xs navy" onClick={() => api.updateMe({ username: form.username, email: form.email, password: form.password || undefined }).catch((e) => window.alert(e.message))}>Save Changes</button>
              </div>
            </div>
          )}

          {tab === "notifications" && <ManageNotifications />}

          {tab === "manage" && (
            <>
              <div className="card settings-card">
                <h3>Manage account / Log out</h3>
                <div className="toggle-row">
                  <strong>Log out of account?</strong>
                  <button className="btn btn-primary btn-xs navy" onClick={() => setDialog("signout")}>Log out</button>
                </div>
              </div>
              <div className="card settings-card">
                <div className="toggle-row">
                  <div><strong>Delete account</strong><small>This removes your activities and progress and can't be undone.</small></div>
                  <button className="btn btn-danger-outline btn-xs" onClick={() => setDialog("delete")}>Delete account</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {dialog === "signout" && (
        <Modal onClose={close}>
          <h3>Sign out?</h3>
          <p>Are you sure you want to sign out of your Aktiv account? Your current session will end.</p>
          <div className="modal-actions">
            <button className="btn btn-outline btn-xs" onClick={close}>Cancel</button>
            <button className="btn btn-primary btn-xs navy" onClick={() => { api.logout(); nav("/login"); }}>Sign out</button>
          </div>
        </Modal>
      )}

      {dialog === "delete" && (
        <Modal onClose={close}>
          <h3>Delete account?</h3>
          <p>Do you want to delete your account? Your submission history will be removed and this can't be undone.</p>
          <div className="modal-actions">
            <button className="btn btn-outline btn-xs" onClick={close}>Cancel</button>
            <button className="btn btn-red btn-xs" onClick={() => setDialog("confirm")}>Delete account</button>
          </div>
        </Modal>
      )}

      {dialog === "confirm" && (
        <ConfirmDeletion
          onCancel={close}
          onConfirm={async (pw) => {
            try { await api.deleteAccount(pw); nav("/"); } catch (err) { window.alert(err.message); }
          }}
        />
      )}
    </section>
  );
}
