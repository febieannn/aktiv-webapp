import { useState } from "react";

const OPTIONS = [
  ["reminders", "Activity reminders", "A nudge when your last-view has to finish"],
  ["progress", "Progress updates", "Weekly summary of completed activities"],
  ["newActs", "New activities", "Tell me when new practice activities are added"],
  ["email", "Email notifications", "Send things to my email too"],
];

export default function ManageNotifications() {
  const [on, setOn] = useState({ reminders: true, progress: true, newActs: true, email: true });
  const [saved, setSaved] = useState(false);
  const toggle = (k) => { setOn({ ...on, [k]: !on[k] }); setSaved(false); };

  return (
    <div className="card settings-card">
      <h3>Manage Notifications</h3>
      <p className="muted">Choose what aktiv tells you about.</p>
      {OPTIONS.map(([key, title, desc]) => (
        <div key={key} className="toggle-row">
          <div><strong>{title}</strong><small>{desc}</small></div>
          <button role="switch" aria-checked={on[key]} aria-label={title}
            className={`toggle ${on[key] ? "on" : ""}`} onClick={() => toggle(key)} />
        </div>
      ))}
      <div className="form-actions">
        <button className="btn btn-outline btn-xs">Cancel</button>
        <button className="btn btn-primary btn-xs navy" onClick={() => setSaved(true)}>Save Changes</button>
      </div>
      {saved && <p className="muted" role="status">Notification settings saved.</p>}
    </div>
  );
}
