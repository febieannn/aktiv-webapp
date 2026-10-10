import { useState } from "react";
import { Link } from "react-router-dom";
import { ACTIVITIES } from "../data.js";


const statusClass = (s) => (s === "Completed" ? "ok" : s === "In progress" ? "wip" : "new");
const cta = (s) => (s === "Completed" ? "View Activity" : s === "In progress" ? "Continue" : "Start Activity");

function ActivityCard({ a }) {
  return (
    <article className="card act-card">
      <span className="chip big">{"</>"}</span>
      <div>
        <h3>{a.title}</h3>
        <span className={`pill ${statusClass(a.status)}`}>{a.status}</span>
        <p>{a.desc}</p>
        <Link to={`/activity/${a.id}`} className="btn btn-outline btn-xs">{cta(a.status)} →</Link>
      </div>
    </article>
  );
}

function Banner({ title, sub, eyebrow }) {
  return (
    <div className="banner">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      <div className="banner-art" aria-hidden="true"><span>HTML</span><span>CSS</span><span>JS</span></div>
    </div>
  );
}

/* /home — dashboard */
export default function Home() {
  return (
    <section className="page">
      <Banner eyebrow="Are you ready to become a good programmer?" title="Welcome to aktiv!"
        sub="Practice your coding skills and build interactive front-end elements. Keep going, you're doing great!" />
      <h2 className="section-title">Available Activities</h2>
      <p className="muted">Select an activity below to practice and strengthen your skills.</p>
      <div className="grid-3">{ACTIVITIES.map((a) => <ActivityCard key={a.id} a={a} />)}</div>

      <h2 id="how-it-works" className="section-title">How it works</h2>
      <p className="muted">Pick an activity, write HTML and CSS, preview it live, then submit to get instant feedback.</p>
    </section>
  );
}

/* /activities — "Your Activities" */
export function YourActivities() {
  const [filter, setFilter] = useState("All");
  const count = (s) => ACTIVITIES.filter((a) => a.status === s).length;
  const tabs = [
    ["All", ACTIVITIES.length], ["Completed", count("Completed")],
    ["In Progress", count("In progress")], ["Not Started", count("Not started")],
  ];
  const list = ACTIVITIES.filter((a) => filter === "All" || a.status.toLowerCase() === filter.toLowerCase());

  return (
    <section className="page">
      <Banner title="Your Activities" sub="Track what you've finished and pick up where you left off." />
      <div className="split">
        <div>
          <div className="tabs-row">
            {tabs.map(([t, n]) => (
              <button key={t} className={`tab ${filter === t ? "on" : ""}`} onClick={() => setFilter(t)}>{t} ({n})</button>
            ))}
          </div>
          {list.map((a) => (
            <div key={a.id} className="card row-card">
              <span className="chip big">{"</>"}</span>
              <div className="grow">
                <strong>{a.title}</strong> <span className={`pill ${statusClass(a.status)}`}>{a.status}</span>
                <p className="muted">{a.desc}</p>
                <div className="meter"><i style={{ width: `${(a.steps[0] / a.steps[1]) * 100}%` }} /></div>
                <small>{a.steps[0]} of {a.steps[1]} steps</small>
              </div>
              <Link to={`/activity/${a.id}`} className="btn btn-primary btn-xs">{cta(a.status)}</Link>
            </div>
          ))}
        </div>
        <aside>
          <div className="card fact">
            <h3>Daily Fun Facts</h3>
            <p><b>Did you know?</b><br />The first computer programmer was a woman named Ada Lovelace, in the 1840s.</p>
          </div>
          <div className="card"><strong>More info:</strong><p className="muted">Learn more about computing history and women in tech on our blog.</p></div>
        </aside>
      </div>
    </section>
  );
}
