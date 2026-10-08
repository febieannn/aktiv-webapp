import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../commpoents/Modal.jsx";
import { ACTIVITIES } from "../data.js";

const STARTER_HTML = `<nav class="nav">
  <span class="logo">MySite</span>
  <ul class="links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>`;
const STARTER_CSS = `body { margin: 0; font-family: sans-serif; }

.nav {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  background: #132c5e;
  color: #fff;
}`;

const HINTS = [
  "Start with the structure: which HTML elements does this need?",
  "Use class names so you can style each part in style.css.",
  "Try display: flex to line items up in a row.",
];

export default function Activity() {
  const { id } = useParams();
  const nav = useNavigate();
  const activity = useMemo(() => ACTIVITIES.find((a) => a.id === id) ?? ACTIVITIES[0], [id]);

  const [html, setHtml] = useState(STARTER_HTML);
  const [css, setCss] = useState(STARTER_CSS);
  const [hints, setHints] = useState(false);
  const [view, setView] = useState("Desktop");
  const [dialog, setDialog] = useState(null); // reset | submit | delete | result
  const [results, setResults] = useState([]);

  const runChecks = () =>
    activity.checks.map((c) => ({
      label: c.label,
      pass: new RegExp(c.re, "i").test(c.file === "html" ? html : css),
    }));

  const submit = () => { setResults(runChecks()); setDialog("result"); };
  const reset = () => { setHtml(STARTER_HTML); setCss(STARTER_CSS); setDialog(null); };
  const passed = results.length > 0 && results.every((r) => r.pass);
  const close = () => setDialog(null);

  return (
    <div className="editor-page">
      <div className="editor-top">
        <Link to="/activities" className="back">← All Activities</Link>
        <div className="row">
          <button className="btn btn-danger-outline btn-xs" onClick={() => setDialog("delete")}>Delete</button>
          <button className="btn btn-outline btn-xs" onClick={() => setDialog("reset")}>Reset</button>
          <button className="btn btn-primary btn-xs" onClick={() => setDialog("submit")}>▷ Submit</button>
        </div>
      </div>

      <h1 className="editor-title">{activity.title}</h1>

      <div className="editor-grid">
        <div className="panes">
          <Pane name="INDEX.HTML" badge="HTML" value={html} onChange={setHtml} />
          <Pane name="STYLE.CSS" badge="CSS" value={css} onChange={setCss} />
        </div>

        <aside className="hints">
          <div className="pane-head">
            <span>HINTS</span>
            <label className="switch-ui">
              {hints ? "Visible" : "Hidden"}
              <input type="checkbox" checked={hints} onChange={(e) => setHints(e.target.checked)} />
              <i />
            </label>
          </div>
          {hints ? (
            <div className="hint-list">
              {HINTS.map((h) => <p key={h} className="hint">{h}</p>)}
              <button className="btn btn-outline btn-xs" disabled>All hints shown</button>
            </div>
          ) : (
            <div className="hint-empty">
              <span aria-hidden="true">🙈</span>
              <strong>Hints are hidden</strong>
              <p>Try it on your own first. Turn the switch on if you get stuck.</p>
            </div>
          )}
        </aside>

        <section className="preview">
          <div className="pane-head">
            <span className="live">● LIVE PREVIEW</span>
            <div className="seg">
              {["Desktop", "Mobile"].map((v) => (
                <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>{v}</button>
              ))}
            </div>
          </div>
          <iframe
            title="Live preview"
            sandbox=""
            className={view === "Mobile" ? "mobile" : ""}
            srcDoc={`<style>${css}</style>${html}`}
          />
        </section>
      </div>

      {dialog === "reset" && (
        <Modal tone="navy" onClose={close}>
          <h3>Reset code to initial state?</h3>
          <p>All your unsubmitted code changes will be lost.</p>
          <div className="modal-actions">
            <button className="btn btn-outline btn-xs light" onClick={close}>Cancel</button>
            <button className="btn btn-white btn-xs" onClick={reset}>Reset</button>
          </div>
        </Modal>
      )}

      {dialog === "submit" && (
        <Modal tone="navy" onClose={close}>
          <h3>Submit Activity?</h3>
          <p>We'll check your code against this activity's requirements and show you the results.</p>
          <div className="modal-actions">
            <button className="btn btn-outline btn-xs light" onClick={close}>Cancel</button>
            <button className="btn btn-white btn-xs" onClick={submit}>Submit</button>
          </div>
        </Modal>
      )}

      {dialog === "delete" && (
        <Modal tone="danger" onClose={close}>
          <h3>Delete Activity?</h3>
          <p>This cannot be undone. All files will be permanently deleted.</p>
          <div className="modal-actions">
            <button className="btn btn-outline btn-xs light" onClick={close}>Cancel</button>
            <button className="btn btn-white btn-xs" onClick={() => nav("/activities")}>Delete</button>
          </div>
        </Modal>
      )}

      {dialog === "result" && (
        <Modal onClose={close}>
          <div className={`result-icon ${passed ? "ok" : "warn"}`}>{passed ? "✓" : "!"}</div>
          <h3>{passed ? "Nice work!" : "Almost there"}</h3>
          <p>
            {passed
              ? `Your ${activity.title} passed every check below.`
              : `You're close — here's what still needs a bit of work on ${activity.title}.`}
          </p>
          <ul className="checks">
            {results.map((r) => (
              <li key={r.label} className={r.pass ? "pass" : "fail"}>{r.pass ? "✓" : "✕"} {r.label}</li>
            ))}
          </ul>
          <div className="modal-actions">
            <button className="btn btn-outline btn-xs" onClick={() => nav("/activities")}>Back to activities</button>
            {passed ? (
              <button className="btn btn-primary btn-xs navy" onClick={() => nav("/activities")}>Next Activity</button>
            ) : (
              <button className="btn btn-primary btn-xs navy" onClick={close}>Keep editing</button>
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
      <div className="pane-head"><span>{name}</span><em>{badge}</em></div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} spellCheck="false" aria-label={name} />
    </section>
  );
}
