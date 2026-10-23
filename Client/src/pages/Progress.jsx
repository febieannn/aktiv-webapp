
import { useEffect, useState } from "react";
import { BADGES, ACTIVITIES } from "../data.js";

const STATUS_KEY = "aktivActivityStatuses";

const getStatuses = () => {
  try {
    return JSON.parse(localStorage.getItem(STATUS_KEY) || "{}");
  } catch {
    return {};
  }
};

const getInitialStatuses = () =>
  Object.fromEntries(
    ACTIVITIES.map((activity) => [
      activity.id,
      getStatuses()[activity.id] || "Not Started",
    ])
  );

export default function Progress() {
  const [range, setRange] = useState("This week");
  const [statuses, setStatuses] = useState(getInitialStatuses);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const updateProgress = () => {
      setStatuses(getInitialStatuses());

      try {
        setRecent(
          JSON.parse(localStorage.getItem("aktivRecentActivity") || "[]")
        );
      } catch {
        setRecent([]);
      }
    };

    updateProgress();

    window.addEventListener("storage", updateProgress);
    window.addEventListener("aktiv-status-update", updateProgress);

    return () => {
      window.removeEventListener("storage", updateProgress);
      window.removeEventListener("aktiv-status-update", updateProgress);
    };
  }, []);

  const completedActivities = ACTIVITIES.filter(
    (activity) => statuses[activity.id] === "Complete"
  ).length;

  const inProgressActivities = ACTIVITIES.filter(
    (activity) => statuses[activity.id] === "In Progress"
  ).length;

  const stepsTotal = ACTIVITIES.reduce(
    (total, activity) => total + Math.max(1, Number(activity.steps?.[1] ?? 1)),
    0
  );

  const stepsCompleted = ACTIVITIES.reduce((total, activity) => {
    if (statuses[activity.id] === "Complete") {
      return total + Math.max(1, Number(activity.steps?.[1] ?? 1));
    }

    return total;
  }, 0);

  const recentActivities = recent.length
    ? recent
    : ACTIVITIES.filter(
        (activity) => statuses[activity.id] !== "Not Started"
      ).map((activity) => ({
        title: `${statuses[activity.id]}: ${activity.title}`,
        sub: "Activity status",
      }));

  return (
    <section className="page">
      <div className="banner">
        <div>
          <h1>Your Progress</h1>
          <p>Track what you've finished and pick up where you left off.</p>
        </div>

        <div className="banner-art" aria-hidden="true">
          <span>HTML</span>
          <span>CSS</span>
          <span>JS</span>
        </div>
      </div>

      <div className="tabs-row">
        {["This week", "This month", "All time"].map((r) => (
          <button
            key={r}
            className={`tab ${range === r ? "on" : ""}`}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="progress-grid">
        <div className="card">
          <h3>Recent Activity</h3>
          <p className="muted">Your latest activity submissions and results.</p>

          {recentActivities.length > 0 ? (
            <ul className="timeline">
              {recentActivities.map((activity, index) => (
                <li key={`${activity.title}-${index}`}>
                  <strong>{activity.title}</strong>
                  <small>{activity.sub}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">
              No submissions yet. Start an activity to see your progress here.
            </p>
          )}

        </div>

        <div className="stack">
          <div className="card stat">
            <b>{stepsCompleted}/{stepsTotal}</b>
            <span>Steps completed</span>
          </div>

          <div className="card stat">
            <b>{completedActivities}/{ACTIVITIES.length}</b>
            <span>Activities completed</span>
          </div>

          <div className="card stat">
            <b>{inProgressActivities}</b>
            <span>Activities in progress</span>
          </div>
        </div>

        <div className="card">
          <h3>Activity Progress</h3>
          <p className="muted">Progress based on submitted results.</p>

          {ACTIVITIES.map((activity) => {
            const status = statuses[activity.id] || "Not Started";

            const progress =
              status === "Complete"
                ? 100
                : status === "In Progress"
                  ? 50
                  : 0;

            const statusColor =
              status === "Complete"
                ? "ok"
                : status === "In Progress"
                  ? "wip"
                  : "new";

            return (
              <div key={activity.id} className="activity-progress">
                <p>
                  <strong>{activity.title}</strong>
                </p>

                <div
                  className="meter"
                  role="progressbar"
                  aria-label={`${activity.title} progress`}
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <i style={{ width: `${progress}%` }} />
                </div>

                <small>
                  <span className={`pill ${statusColor}`}>{status}</span>
                  {" "}{progress}%
                </small>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
