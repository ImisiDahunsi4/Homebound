import { Link } from "react-router-dom";
import "./HomePage.css";

function PawFilled({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="12" cy="15.8" rx="4.2" ry="3.5" />
      <ellipse cx="6.2" cy="10.2" rx="2" ry="2.5" transform="rotate(-18 6.2 10.2)" />
      <ellipse cx="17.8" cy="10.2" rx="2" ry="2.5" transform="rotate(18 17.8 10.2)" />
      <ellipse cx="9.6" cy="6.6" rx="1.9" ry="2.5" transform="rotate(-8 9.6 6.6)" />
      <ellipse cx="14.4" cy="6.6" rx="1.9" ry="2.5" transform="rotate(8 14.4 6.6)" />
    </svg>
  );
}

function BurstRays({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="26"
      height="24"
      viewBox="0 0 26 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 18 1 11M12 15 11 4M18 18l6-7"
        stroke="#d5603e"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MatchBadge({
  pct,
  tone = "amber",
}: {
  pct: string;
  tone?: "amber" | "orange" | "tan";
}) {
  return (
    <span className={`match-badge match-badge--${tone}`}>
      <PawFilled size={10} className="match-badge-paw" />
      {pct}% match
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="landing">
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-eyebrow-wrap">
            <BurstRays className="hero-burst-topleft" />
            <p className="hero-eyebrow">
              REAL PEOPLE. BRIGHTER REUNIONS.
              <span className="hero-eyebrow-dot" aria-hidden="true">✦</span>
            </p>
          </div>

          <h1 className="hero-title">
            Bring them
            <br />
            <span className="hero-title-line2">
              <span className="hero-title-accent">home faster.</span>
              <svg
                className="hero-heart-doodle"
                width="54"
                height="44"
                viewBox="0 0 54 44"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M19 33C11 27 5 20 6 13c1-5 6-7 10-4 2 1.6 3.2 3.8 3.6 5.2.8-2 2.8-5.2 6.4-6 4.5-1 8.5 2.4 8 7.5-.7 6.8-8.2 13-15 17.3Z"
                  stroke="#cf4828"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M39 9l6-4M42 16l8-1M39 23l6 3"
                  stroke="#cf4828"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="hero-sub">
            Report lost or found pets, get community sightings, and let
            intelligent matching help reunite the ones who belong together.
          </p>

          <div className="hero-ctas">
            <Link to="/report/lost" className="hero-btn hero-btn--lost">
              <PawFilled size={17} />
              Report Lost Pet
            </Link>
            <Link to="/report/found" className="hero-btn hero-btn--found">
              <PawFilled size={17} />
              Report Found Pet
            </Link>
          </div>

          <Link to="/how-it-works" className="hero-how">
            <span className="hero-play">
              <svg width="9" height="10" viewBox="0 0 11 12" aria-hidden="true">
                <path d="M2 1.5v9l8-4.5z" fill="currentColor" />
              </svg>
            </span>
            <span className="hero-how-text">See How It Works</span>
            <svg
              className="hero-chevron"
              width="9"
              height="12"
              viewBox="0 0 10 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.5 2.5 7 7l-4.5 4.5"
                stroke="#cf4828"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* ---- Map composition ---- */}
        <div className="hero-map" aria-hidden="true">
          {/* Top-left decorative trees + paw print behind map corner */}
          <div className="map-corner-decor">
            <img
              src="/assets/doodles/doodle-paw-print.png"
              alt=""
              className="map-paw-doodle"
            />
            <svg
              className="map-corner-trees"
              width="120"
              height="74"
              viewBox="0 0 120 74"
              fill="none"
            >
              <ellipse cx="64" cy="64" rx="52" ry="22" fill="#cddbc0" />
              {/* Left tree */}
              <rect x="33" y="38" width="4" height="15" rx="1.5" fill="#6b4f35" />
              <circle cx="35" cy="31" r="12" fill="#6d925d" />
              <circle cx="29" cy="35" r="8" fill="#5b7f4c" />
              {/* Center tall tree */}
              <rect x="57" y="28" width="4.5" height="22" rx="1.5" fill="#6b4f35" />
              <circle cx="59" cy="20" r="14" fill="#5b7f4c" />
              <circle cx="53" cy="25" r="10" fill="#779c66" />
              <circle cx="65" cy="24" r="9" fill="#4e7040" />
              {/* Right tree */}
              <rect x="82" y="36" width="4" height="16" rx="1.5" fill="#6b4f35" />
              <circle cx="84" cy="29" r="11" fill="#779c66" />
              <circle cx="89" cy="33" r="8" fill="#5b7f4c" />
            </svg>
          </div>

          {/* Tilted map frame */}
          <div className="map-tilt">
            <div className="map-frame">
              <img
                src="/assets/illustrations/illus-map-neighborhood.png"
                alt=""
                className="map-img"
              />

              {/* Subtle street & park labels */}
              <span className="map-label" style={{ left: "11%", top: "36%" }}>
                Riverside Park
              </span>
              <span
                className="map-label map-label--road"
                style={{ left: "34%", top: "63%", transform: "rotate(-10deg)" }}
              >
                Maple St
              </span>
              <span
                className="map-label map-label--road"
                style={{ left: "63%", top: "82%", transform: "rotate(-18deg)" }}
              >
                Oak Ave
              </span>
              <span className="map-label" style={{ left: "73%", top: "53%" }}>
                Lakeside
                <br />
                Community
              </span>

              {/* Dashed route arcs + arrowhead pointing to Luna card */}
              <svg
                className="map-routes"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M25 26 Q38 38 50 38"
                  fill="none"
                  stroke="#c85a38"
                  strokeWidth="0.65"
                  strokeLinecap="round"
                  strokeDasharray="1.8 1.8"
                />
                <path
                  d="M36 53 Q44 43 50 38"
                  fill="none"
                  stroke="#c85a38"
                  strokeWidth="0.65"
                  strokeLinecap="round"
                  strokeDasharray="1.8 1.8"
                />
                <path
                  d="M48.5 36.2 L51.2 38 L48.8 40"
                  fill="none"
                  stroke="#c85a38"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M42 56 Q53 60 63 72"
                  fill="none"
                  stroke="#c85a38"
                  strokeWidth="0.65"
                  strokeLinecap="round"
                  strokeDasharray="1.8 1.8"
                />
              </svg>

              {/* controls */}
              <div className="map-search">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <span>Search by location, pet type, or name...</span>
              </div>

              <div className="map-filter">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M8 3v4M16 3v4M3 10h18" />
                </svg>
                Last 30 days
                <span className="map-filter-caret">▾</span>
              </div>

              <div className="map-zoom">
                <button type="button" tabIndex={-1}>+</button>
                <button type="button" tabIndex={-1}>−</button>
              </div>
              <button type="button" className="map-locate" tabIndex={-1}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2 19 21l-7-4-7 4z" />
                </svg>
              </button>

              {/* pins */}
              <img src="/assets/icons/icon-pin-lost.png" alt="" className="map-pin" style={{ left: "11%", top: "48%" }} />
              <img src="/assets/icons/icon-pin-lost.png" alt="" className="map-pin" style={{ left: "24%", top: "24%" }} />
              <img src="/assets/icons/icon-pin-lost.png" alt="" className="map-pin" style={{ left: "35%", top: "54%" }} />
              <img src="/assets/icons/icon-pin-lost.png" alt="" className="map-pin" style={{ left: "64%", top: "73%" }} />
              <img src="/assets/icons/icon-pin-found.png" alt="" className="map-pin" style={{ left: "38%", top: "36%" }} />
              <img src="/assets/icons/icon-pin-found.png" alt="" className="map-pin" style={{ left: "51%", top: "67%" }} />
              <img src="/assets/icons/icon-pin-found.png" alt="" className="map-pin" style={{ left: "80%", top: "49%" }} />

              {/* match card */}
              <div className="map-match">
                <svg
                  className="map-match-burst"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M4 8 9 2M10 12l8-6M13 17l7-2"
                    stroke="#d5603e"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="map-match-row">
                  <img
                    src="/assets/photos/photo-match-luna.png"
                    alt=""
                    className="map-match-photo"
                  />
                  <div className="map-match-info">
                    <span className="map-match-kicker">Possible match:</span>
                    <strong>Luna</strong>
                    <MatchBadge pct="92" tone="amber" />
                  </div>
                </div>
                <div className="map-match-meta">
                  <span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                    </svg>
                    0.8 km away
                  </span>
                  <span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    Found 2 days ago
                  </span>
                </div>
              </div>

              {/* legend */}
              <div className="map-legend">
                <div className="map-legend-row">
                  <img src="/assets/icons/icon-pin-lost.png" alt="" />
                  <span>Lost pet report</span>
                </div>
                <div className="map-legend-row">
                  <img src="/assets/icons/icon-pin-found.png" alt="" />
                  <span>Found pet report</span>
                </div>
              </div>
            </div>
          </div>

          {/* Peeking golden retriever + burst ticks + handwritten note */}
          <div className="map-dog-wrap">
            <svg
              className="map-dog-burst"
              width="24"
              height="26"
              viewBox="0 0 24 26"
              fill="none"
            >
              <path
                d="M18 5 8 2M16 12 4 12M18 19 8 22"
                stroke="#d5603e"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            <img
              src="/assets/photos/photo-dog-golden-peeking.png"
              alt=""
              className="map-dog"
            />
          </div>

          <div className="map-note">
            <span className="map-note-text">
              Every
              <br />
              pet has
              <br />a way home.
            </span>
            <svg
              className="map-note-arrow"
              width="48"
              height="24"
              viewBox="0 0 48 24"
              fill="none"
            >
              <path
                d="M2 16c10 4 22-2 22-8 0-4-5-4-6 0-1 6 10 11 25 6M38 10l6 4-5 5"
                stroke="#2e4434"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ============ STEP CARDS ============ */}
      <section className="steps">
        <img
          src="/assets/doodles/doodle-sparkle-burst.png"
          alt=""
          className="steps-sparkle steps-sparkle--left"
        />
        <img
          src="/assets/doodles/doodle-sparkle-burst.png"
          alt=""
          className="steps-sparkle steps-sparkle--right"
        />

        {/* Card 1 */}
        <article className="step">
          <div className="step-head">
            <span className="step-num step-num--orange">01</span>
            <div className="step-head-copy">
              <h3>Share a case</h3>
              <p>
                Report a lost or found pet in just a few minutes. Add photos,
                details and the last seen location.
              </p>
            </div>
          </div>
          <div className="step-body step-body--card1">
            <div className="step-cat-wrap">
              <span className="step-cat-circle" />
              <img
                src="/assets/photos/photo-cat-share-case.png"
                alt=""
                className="step-cat-img"
              />
            </div>
            <div className="step-form">
              <div className="step-form-top">
                <span className="step-form-photo">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                <span className="step-form-lines">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="step-form-bottom">
                <div className="step-form-icons">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  <i className="step-form-pill-bar" />
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M8 3v4M16 3v4M3 10h18" />
                  </svg>
                  <i className="step-form-pill-bar step-form-pill-bar--short" />
                </div>
                <span className="step-form-cta" />
              </div>
            </div>
          </div>
        </article>

        {/* Card 2 */}
        <article className="step">
          <div className="step-head">
            <span className="step-num">02</span>
            <div className="step-head-copy">
              <div className="step-title-row">
                <h3>Get local alerts</h3>
                <svg
                  className="step-bell-doodle"
                  width="34"
                  height="30"
                  viewBox="0 0 36 32"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 9c-2.5 2.5-3.2 5.8-2.2 9M4 6c-3 3.5-3.8 8-2.5 12"
                    stroke="#cf4828"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M24 12a6.5 6.5 0 0 0-13 0c0 5-2 6.8-2 6.8h17s-2-1.8-2-6.8Z"
                    stroke="#cf4828"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.5 21.5a2.3 2.3 0 0 0 4 0"
                    stroke="#cf4828"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28 8c2.2 2.2 2.8 5.2 2 8.2M31 5.5c2.8 3.2 3.5 7.4 2.2 11.2"
                    stroke="#cf4828"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p>
                Notify nearby pet lovers when a pet is lost or found. The more
                eyes, the higher the chance.
              </p>
            </div>
          </div>
          <div className="step-body step-body--center">
            <div className="notif">
              <span className="notif-icon">
                <PawFilled size={19} />
              </span>
              <div className="notif-text">
                <div className="notif-top">
                  <strong>HomeBound</strong>
                  <span>now</span>
                </div>
                <b>New sighting near you!</b>
                <p>A dog matching Luna was seen 0.8 km away.</p>
              </div>
            </div>
          </div>
        </article>

        {/* Card 3 */}
        <article className="step">
          <div className="step-head">
            <span className="step-num">03</span>
            <div className="step-head-copy">
              <h3>Review matches</h3>
              <p>
                Our intelligent matching helps connect the dots, bringing pets
                and people back together.
              </p>
            </div>
            <svg
              className="step-heart-doodle"
              width="38"
              height="32"
              viewBox="0 0 42 36"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M16 28C9 23 4 17 5 11c.8-4.2 5-6 8.2-3.4 1.7 1.3 2.7 3.1 3 4.3.7-1.7 2.3-4.3 5.3-5 3.7-.8 7 2 6.6 6.2-.6 5.6-6.8 10.8-12.1 14.9Z"
                stroke="#cf4828"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 7l4-3M34 13l5-1"
                stroke="#cf4828"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="step-body step-body--minis">
            <div className="minis">
              {[
                {
                  src: "/assets/photos/photo-match-luna.png",
                  pct: "92",
                  tone: "orange" as const,
                },
                {
                  src: "/assets/photos/photo-match-collie.png",
                  pct: "68",
                  tone: "amber" as const,
                },
                {
                  src: "/assets/photos/photo-match-tabby.png",
                  pct: "52",
                  tone: "tan" as const,
                },
              ].map((m) => (
                <div className="mini" key={m.pct}>
                  <div className="mini-photo">
                    <img src={m.src} alt="" />
                    <MatchBadge pct={m.pct} tone={m.tone} />
                  </div>
                  <span className="mini-lines">
                    <i />
                    <i />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
