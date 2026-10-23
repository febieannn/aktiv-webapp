
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../commpoents/Modal.jsx";
import { ACTIVITIES } from "../data.js";

const STARTER_HTML = "";
const STARTER_CSS = "";

const STATUS_KEY = "aktivActivityStatuses";
const HISTORY_KEY = "aktivRecentActivity";

const HINTS = [
  {
    title: "1. Basic HTML Structure",
    code: `<!DOCTYPE html>
<html>
<head>
  <title>My Activity</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>My first webpage.</p>
</body>
</html>`,
    description:
      "Use HTML to create the structure and content of your webpage.",
  },
  {
    title: "2. Common HTML Elements",
    code: `<h1>Main Heading</h1>
<p>A paragraph of text.</p>
<button>Click Me</button>
<img src="image.jpg" alt="Description">
<div class="container">Content here</div>`,
    description:
      "Use headings, paragraphs, buttons, images, and div elements as needed.",
  },
  {
    title: "3. CSS Selectors and Classes",
    code: `.container {
  background-color: white;
  color: black;
  padding: 20px;
  border-radius: 10px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}`,
    description:
      "Use class names to style specific HTML elements. Connect a class with class in your HTML.",
  },
  {
    title: "4. Layout with Flexbox",
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}`,
    description:
      "Flexbox helps align items, control spacing, and create flexible layouts.",
  },
  {
    title: "5. Responsive Design",
    code: `@media (max-width: 600px) {
  .container {
    flex-direction: column;
    padding: 12px;
  }
}`,
    description:
      "Use media queries to adjust your design for mobile screens.",
  },
  {
    title: "6. Check Your Work",
    code: `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}`,
    description:
      "Check your live preview, use the required HTML and CSS elements, and submit when ready.",
  },
];

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function getSavedStatuses() {
  return readStorage(STATUS_KEY, {});
}

function saveSubmission(activityId, status, passedCount, totalChecks, title) {
  const statuses = getSavedStatuses();
  const history = readStorage(HISTORY_KEY, []);

  statuses[activityId] = status;

  const entry = {
    activityId,
    title,
    status,
    sub: `${passedCount}/${totalChecks} requirements passed`,
    timestamp: Date.now(),
  };

  const updatedHistory = [
    entry,
    ...history.filter(
      (item) => String(item.activityId) !== String(activityId)
    ),
  ].slice(0, 20);

  try {
    localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Unable to save activity progress:", error);
  }

  window.dispatchEvent(new Event("aktiv-status-update"));
}

function saveStatus(activityId, status) {
  const statuses = getSavedStatuses();
  statuses[activityId] = status;

  try {
    localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
  } catch (error) {
    console.error("Unable to save activity status:", error);
  }

  window.dispatchEvent(new Event("aktiv-status-update"));
}

export default function Activity() {
  const { id } = useParams();
  const nav = useNavigate();

  const activity = useMemo(
    () =>
      ACTIVITIES.find((item) => String(item.id) === String(id)) ??
      (id ? null : ACTIVITIES[0]),
    [id]
  );

  const [html, setHtml] = useState(STARTER_HTML);
  const [css, setCss] = useState(STARTER_CSS);
  const [hints, setHints] = useState(false);
  const [view, setView] = useState("Desktop");
  const [dialog, setDialog] = useState(null);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("Not Started");

  useEffect(() => {
    if (!activity) return;

    setStatus(getSavedStatuses()[activity.id] || "Not Started");
  }, [activity]);

  const runChecks = () =>
    (activity?.checks || []).map((check, index) => {
      const code = check.file === "html" ? html : css;
      let pass = false;

      try {
        pass = new RegExp(check.re, "i").test(code);
      } catch (error) {
        console.error(`Invalid check pattern at index ${index}:`, error);
      }

      return {
        label: check.label || `Requirement ${index + 1}`,
        pass,
      };
    });

  const submit = () => {
    const checkResults = runChecks();
    const passedCount = checkResults.filter((result) => result.pass).length;

    const isComplete =
      checkResults.length > 0 &&
      passedCount === checkResults.length;

    const nextStatus = isComplete ? "Complete" : "In Progress";

    setResults(checkResults);
    setStatus(nextStatus);

    saveSubmission(
      activity.id,
      nextStatus,
      passedCount,
      checkResults.length,
      activity.title
    );

    setDialog("result");
  };

  const reset = () => {
    setHtml(STARTER_HTML);
    setCss(STARTER_CSS);
    setResults([]);
    setStatus("Not Started");

    saveStatus(activity.id, "Not Started");
    setDialog(null);
  };

  const close = () => setDialog(null);

  const passed =
    results.length > 0 && results.every((result) => result.pass);

  const statusClass =
    status === "Complete"
      ? "ok"
      : status === "In Progress"
        ? "wip"
        : "new";

  if (!activity) {
    return (
      <div className="editor-page">
        <Link to="/activities" className="back">
          ← All Activities
        </Link>
        <h1 className="editor-title">Activity Not Found</h1>
        <p>This activity does not exist. Please choose another activity.</p>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <div className="editor-top">
        <Link to="/activities" className="back">
          ← All Activities
        </Link>

        <div className="row">
          <button
            type="button"
            className="btn btn-danger-outline btn-xs"
            onClick={() => setDialog("delete")}
          >
            Delete
          </button>

          <button
            type="button"
            className="btn btn-outline btn-xs"
            onClick={() => setDialog("reset")}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn btn-primary btn-xs"
            onClick={() => setDialog("submit")}
          >
            ▷ Submit
          </button>
        </div>
      </div>

      <h1 className="editor-title">{activity.title}</h1>

      <p>
        Status: <span className={`pill ${statusClass}`}>{status}</span>
      </p>

      <div className="editor-grid">
        <div className="panes">
          <Pane
            name="INDEX.HTML"
            badge="HTML"
            value={html}
            onChange={setHtml}
          />

          <Pane
            name="STYLE.CSS"
            badge="CSS"
            value={css}
            onChange={setCss}
          />
        </div>

        <aside className="hints">
          <div className="pane-head">
            <span>HINTS &amp; CODE GUIDES</span>

            <label className="switch-ui">
              {hints ? "Visible" : "Hidden"}

              <input
                type="checkbox"
                checked={hints}
                onChange={(event) => setHints(event.target.checked)}
              />

              <i />
            </label>
          </div>

          {hints ? (
            <div className="hint-list">
              {HINTS.map((hint) => (
                <div className="hint" key={hint.title}>
                  <strong>{hint.title}</strong>
                  <p>{hint.description}</p>
                  <pre>
                    <code>{hint.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="hint-empty">
              <strong>Hints are hidden</strong>
              <p>
                Turn on the switch to view basic HTML and CSS guides,
                code examples, and styling tips.
              </p>
            </div>
          )}
        </aside>

        <section className="preview">
          <div className="pane-head">
            <span className="live">● LIVE PREVIEW</span>

            <div className="seg">
              {["Desktop", "Mobile"].map((size) => (
                <button
                  type="button"
                  key={size}
                  className={view === size ? "on" : ""}
                  onClick={() => setView(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <iframe
            title="Live preview"
            sandbox=""
            className={view === "Mobile" ? "mobile" : ""}
            srcDoc={`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css}</style>
</head>
<body>${html}</body>
</html>`}
          />
        </section>
      </div>

      {dialog === "reset" && (
        <Modal tone="navy" onClose={close}>
          <h3>Reset activity?</h3>
          <p>
            Your code will be cleared and the activity status will
            return to Not Started.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline btn-xs light"
              onClick={close}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-white btn-xs"
              onClick={reset}
            >
              Reset
            </button>
          </div>
        </Modal>
      )}

      {dialog === "submit" && (
        <Modal tone="navy" onClose={close}>
          <h3>Submit Activity?</h3>
          <p>
            Your HTML and CSS will be checked against the activity
            requirements. Passing every configured check marks the activity
            Complete. Otherwise, it becomes In Progress.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline btn-xs light"
              onClick={close}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-white btn-xs"
              onClick={submit}
            >
              Submit
            </button>
          </div>
        </Modal>
      )}

      {dialog === "delete" && (
        <Modal tone="danger" onClose={close}>
          <h3>Leave Activity?</h3>
          <p>
            This returns you to the activities page. It will not delete
            the activity from the available activities.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline btn-xs light"
              onClick={close}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-white btn-xs"
              onClick={() => nav("/activities")}
            >
              Back to Activities
            </button>
          </div>
        </Modal>
      )}

      {dialog === "result" && (
        <Modal onClose={close}>
          <div className={`result-icon ${passed ? "ok" : "warn"}`}>
            {passed ? "✓" : "!"}
          </div>

          <h3>
            {passed ? "Activity Complete!" : "Activity In Progress"}
          </h3>

          <p>
            {passed
              ? `Great work! Your ${activity.title} passed every check.`
              : `Your ${activity.title} is not finished yet. Review the failed checks, edit your code, and submit again.`}
          </p>

          <ul className="checks">
            {results.map((result, index) => (
              <li
                key={`${result.label}-${index}`}
                className={result.pass ? "pass" : "fail"}
              >
                {result.pass ? "✓" : "✕"} {result.label}
              </li>
            ))}
          </ul>

          {results.length === 0 && (
            <p>
              No requirements are configured for this activity. Add checks
              in data.js before submitting.
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={() => nav("/activities")}
            >
              Back to Activities
            </button>

            {passed ? (
              <button
                type="button"
                className="btn btn-primary btn-xs navy"
                onClick={() => nav("/activities")}
              >
                Finish
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-xs navy"
                onClick={close}
              >
                Keep Editing
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

function Pane({ name, badge, value, onChange }) {
  return (
    <section className="pane">
      <div className="pane-head">
        <span>{name}</span>
        <em>{badge}</em>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        aria-label={name}
        placeholder={
          badge === "HTML"
            ? "Write your HTML code here..."
            : "Write your CSS code here..."
        }
      />
    </section>
  );
}
