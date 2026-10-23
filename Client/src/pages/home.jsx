
import { useState } from "react";
import { Link } from "react-router-dom";
import { ACTIVITIES } from "../data.js";

const INITIAL_STATUS = "Not Started";

const STEPS = [
  "Create an account",
  "Choose a language",
  "Start a challenge",
  "Submit your answer",
  "Receive feedback",
  "Improve your skills",
];

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

function ActivityCard({ a, status }) {
  return (
    <article className="card act-card">
      <span className="chip big">{"</>"}</span>

      <div>
        <h3>{a.title}</h3>

        <span className={`pill ${statusClass(status)}`}>
          {status}
        </span>

        <p>{a.desc}</p>

        <Link
          to={`/activity/${a.id}`}
          className="btn btn-outline btn-xs"
        >
          {cta(status)} →
        </Link>
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

      <div className="banner-art" aria-hidden="true">
        <span>HTML</span>
        <span>CSS</span>
        <span>JS</span>
      </div>
    </div>
  );
}

/* How It Works Section */
function HowItWorks() {
  return (
    <section id="how-it-works" className="how-section">
      <h2>How It Works</h2>

      <ol className="steps">
        {STEPS.map((step, index) => (
          <li key={step} className="step-item">
            <span className="num">{index + 1}</span>
            <span className="step-label">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* Home Dashboard */
export default function Home() {
  const [statuses] = useState(() =>
    Object.fromEntries(
      ACTIVITIES.map((activity) => [
        activity.id,
        INITIAL_STATUS,
      ])
    )
  );

  return (
    <section className="page">
      <Banner
        eyebrow="Are you ready to become a good programmer?"
        title="Welcome to aktiv!"
        sub="Practice your coding skills and build interactive front-end elements. Keep going, you're doing great!"
      />

      <h2 className="section-title">Available Activities</h2>

      <p className="muted">
        Select an activity below to practice and strengthen your skills.
      </p>

      <div className="grid-3">
        {ACTIVITIES.map((a) => (
          <ActivityCard
            key={a.id}
            a={a}
            status={statuses[a.id]}
          />
        ))}
      </div>

      <HowItWorks />
    </section>
  );
}

/* Your Activities Page */
export function YourActivities() {
  const [filter, setFilter] = useState("All");

  const [statuses] = useState(() =>
    Object.fromEntries(
      ACTIVITIES.map((activity) => [
        activity.id,
        INITIAL_STATUS,
      ])
    )
  );

  const activities = ACTIVITIES.map((a) => ({
    ...a,
    status: statuses[a.id],
    completed: 0,
    total: Math.max(1, Number(a.steps?.[1] ?? 1)),
  }));

  const tabs = [
    "All",
    "Not Started",
    "In Progress",
    "Complete",
  ];

  const filteredActivities = activities.filter(
    (a) => filter === "All" || a.status === filter
  );

  return (
    <section className="page">
      <Banner
        title="Your Activities"
        sub="Track what you've finished and pick up where you left off."
      />

      <div className="split">
        <div>
          <div className="tabs-row">
            {tabs.map((tab) => {
              const count =
                tab === "All"
                  ? activities.length
                  : activities.filter(
                      (a) => a.status === tab
                    ).length;

              return (
                <button
                  key={tab}
                  type="button"
                  className={`tab ${filter === tab ? "on" : ""}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          {filteredActivities.length > 0 ? (
            filteredActivities.map((a) => (
              <div key={a.id} className="card row-card">
                <span className="chip big">{"</>"}</span>

                <div className="grow">
                  <strong>{a.title}</strong>{" "}

                  <span className={`pill ${statusClass(a.status)}`}>
                    {a.status}
                  </span>

                  <p className="muted">{a.desc}</p>

                  <div
                    className="meter"
                    role="progressbar"
                    aria-label={`${a.title} progress`}
                    aria-valuenow={0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <i style={{ width: "0%" }} />
                  </div>

                  <small>
                    0 of {a.total} steps completed (0%)
                  </small>
                </div>

                <Link
                  to={`/activity/${a.id}`}
                  className="btn btn-primary btn-xs"
                >
                  {cta(a.status)}
                </Link>
              </div>
            ))
          ) : (
            <div className="card">
              <p className="muted">
                No activities found for this status.
              </p>
            </div>
          )}
        </div>

        <aside>
          <div className="card fact">
            <h3>Daily Fun Facts</h3>
            <p>
              <b>Did you know?</b>
              <br />
              The first computer programmer was a woman named Ada
              Lovelace, in the 1840s.
            </p>
          </div>

          <div className="card">
            <strong>More info:</strong>
            <p className="muted">
              Learn more about computing history and women in tech on
              our blog.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
