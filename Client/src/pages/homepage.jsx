import { Link } from "react-router-dom";

const FEATURES = ["Interactive Practice", "Beginner-Friendly Challenges", "Instant Code Feedback", "Progress Tracking", "Points & Levels"];
const STEPS = ["Create an account", "Choose a language", "Start a challenge", "Submit your answer", "Receive feedback", "Improve your skills"];

export default function HomePage() {
  return (
    <>
      <section id="top" className="hero">
        <div className="hero-copy">
          <h1>Practice Coding.<br />Build your skills.</h1>
          <p>Learn through challenges, get instant feedback, and improve your programming skills with aktiv — built for students who want regular, hands-on practice.</p>
          <div className="row">
            <Link to="/signup" className="btn btn-primary">Start Practising</Link>
            <a href="#features" className="btn btn-outline">Explore Features</a>
          </div>
        </div>

        <div className="hero-demo">
          <span className="tag">&lt;/&gt; aktiv runtime</span>
          <div className="demo-card">
            <div className="demo-top">
              <div className="dots"><i /><i /><i /></div>
              <div className="tabs"><b>HTML</b><span>CSS</span><span>JavaScript</span></div>
            </div>
            <pre>{`<!-- Step 1: build the card -->

<div class="card">
  <h2>Login Form</h2>
  <button>Sign in</button>
</div>`}</pre>
            <div className="demo-foot"><span>Step 1 to 3 • HTML</span><span>✓ Passed</span></div>
          </div>
        </div>
      </section>

      <section id="features" className="band white center">
        <h2>Features</h2>
        <div className="feature-row">
          {FEATURES.map((f) => (
            <div key={f} className="feature"><span className="chip" />{f}</div>
          ))}
        </div>
      </section>

      <section id="how" className="band cream center">
        <h2>How It Works</h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s}><span className="num">{i + 1}</span>{s}</li>
          ))}
        </ol>
      </section>

      <section id="why" className="band white why">
        <h2>Why aktiv?</h2>
        <p>Programming is a skill built through repetition. Aktiv gives students a steady stream of bite-sized coding challenges, instant feedback on every submission, and visible progress — so practice becomes a habit, not a chore.</p>
      </section>

      <section className="cta">
        <h2>Ready to improve your skills?</h2>
        <Link to="/signup" className="btn btn-primary">Start Practising</Link>
      </section>
    </>
  );
}
