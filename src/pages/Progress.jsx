import { useState } from "react";
import { BADGES } from "../data.js";

const RECENT = [
  { title: "Finished Step 2: Style links with hover states", sub: "Responsive Navbar • Today" },
  { title: "Started Responsive Navbar", sub: "Yesterday" },
  { title: "Completed Login Form", sub: "2 days ago" },
];

export default function Progress() {
  const [range, setRange] = useState("This week");

  return (
    <section className="page">
      <div className="banner">
        <div>
          <h1>Your Progress</h1>
          <p>Track what you've finished and pick up where you left off.</p>
        </div>
        <div className="banner-art" aria-hidden="true"><span>HTML</span><span>CSS</span><span>JS</span></div>
      </div>

      <div className="tabs-row">
        {["This week", "This month", "All time"].map((r) => (
          <button key={r} className={`tab ${range === r ? "on" : ""}`} onClick={() => setRange(r)}>{r}</button>
        ))}
      </div>

      <div className="progress-grid">
        <div className="card">
          <h3>Recent Activity</h3>
          <p className="muted">Your latest steps and achievements.</p>
          <ul className="timeline">
            {RECENT.map((r) => (
              <li key={r.title}><strong>{r.title}</strong><small>{r.sub}</small></li>
            ))}
          </ul>
          <h4>Badges</h4>
          <div className="badges">
            {BADGES.map((b) => (<div key={b}><span className="chip big round" />{b}</div>))}
          </div>
        </div>

        <div className="stack">
          <div className="card stat"><b>6/12</b><span>Steps completed</span></div>
          <div className="card stat"><b>1/4</b><span>Activities completed</span></div>
        </div>

        <div className="card">
          <h3>Activity Progress</h3>
          <p className="muted">Progress per activity</p>
          <p><strong>Login Form</strong></p>
          <div className="meter"><i style={{ width: "100%" }} /></div>
          <p><strong>Responsive Navbar</strong></p>
          <div className="meter"><i style={{ width: "50%" }} /></div>
        </div>
      </div>
    </section>
  );
}
