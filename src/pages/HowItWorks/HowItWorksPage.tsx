import "./HowItWorksPage.css";

function PhonePawIcon() {
  return (
    <svg viewBox="0 0 48 52" fill="none" aria-hidden="true" className="hiw-icon">
      <rect x="12" y="6" width="24" height="40" rx="5" stroke="#16302a" strokeWidth="2.4" />
      <line x1="20" y1="41" x2="28" y2="41" stroke="#16302a" strokeWidth="2.4" strokeLinecap="round" />
      {/* paw */}
      <ellipse cx="24" cy="27" rx="4.4" ry="3.4" fill="#f14a27" />
      <ellipse cx="17.5" cy="21.5" rx="1.8" ry="2.4" fill="#f14a27" transform="rotate(-18 17.5 21.5)" />
      <ellipse cx="22.5" cy="19.2" rx="1.8" ry="2.4" fill="#f14a27" />
      <ellipse cx="28" cy="20" rx="1.8" ry="2.4" fill="#f14a27" transform="rotate(12 28 20)" />
      <ellipse cx="31.5" cy="23.5" rx="1.7" ry="2.2" fill="#f14a27" transform="rotate(30 31.5 23.5)" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 52 52" fill="none" aria-hidden="true" className="hiw-icon">
      <path
        d="M26 12c-6.5 0-11 4.6-11 11.5 0 5.4-1.5 8.6-3.6 10.6-.9.9-.2 2.4 1.1 2.4h27c1.3 0 2-1.5 1.1-2.4-2.1-2-3.6-5.2-3.6-10.6C37 16.6 32.5 12 26 12Z"
        stroke="#16302a"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M22 40a4.2 4.2 0 0 0 8 0" stroke="#16302a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M26 8.5v3" stroke="#16302a" strokeWidth="2.4" strokeLinecap="round" />
      {/* ring ticks — upper right only, per mockup */}
      <path d="M39 8.5 44 3.5" stroke="#f14a27" strokeWidth="3" strokeLinecap="round" />
      <path d="M45.5 13.5 51 10.5" stroke="#f14a27" strokeWidth="3" strokeLinecap="round" />
      <path d="M48.5 21l5.5-1" stroke="#f14a27" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PeopleHeartIcon() {
  return (
    <svg viewBox="0 0 56 52" fill="none" aria-hidden="true" className="hiw-icon">
      {/* back person */}
      <circle cx="38" cy="26" r="6.2" stroke="#16302a" strokeWidth="2.4" />
      <path d="M28 44c0-7 4.5-11.5 10-11.5S48 37 48 44" stroke="#16302a" strokeWidth="2.4" strokeLinecap="round" />
      {/* front person */}
      <circle cx="22" cy="21" r="8" stroke="#16302a" strokeWidth="2.4" />
      <path d="M6.5 44c0-8.6 6.9-14.5 15.5-14.5 5.4 0 9.9 2.3 12.7 6" stroke="#16302a" strokeWidth="2.4" strokeLinecap="round" />
      {/* heart */}
      <path
        d="M33.4 10.2c-1.7-1.6-4.3-1.4-5.6.3-.4.5-.7 1-.8 1.2-.1-.2-.4-.7-.8-1.2-1.3-1.7-3.9-1.9-5.6-.3-1.8 1.7-1.7 4.4.2 6.3l5.9 5.4c.2.2.5.2.7 0l5.9-5.4c1.9-1.9 1.9-4.6.1-6.3Z"
        stroke="#d13d2a"
        strokeWidth="2.2"
        fill="none"
      />
    </svg>
  );
}

const STEPS = [
  {
    num: "01",
    badge: "hiw-badge--peach",
    blob: "hiw-card--peach",
    icon: <PhonePawIcon />,
    title: "Report a pet",
    desc: "Create a lost or found report in minutes with photos, location, and details.",
  },
  {
    num: "02",
    badge: "hiw-badge--sage",
    blob: "hiw-card--sage",
    icon: <BellIcon />,
    title: "Get local alerts",
    desc: "Nearby pet lovers, rescuers, and community members are notified right away.",
  },
  {
    num: "03",
    badge: "hiw-badge--amber",
    blob: "hiw-card--amber",
    icon: <PeopleHeartIcon />,
    title: "Find the match",
    desc: "Our smart matching helps connect the right pets with the right people, so they can reunite.",
  },
];

export default function HowItWorksPage() {
  return (
    <section className="hiw">
      {/* left column */}
      <div className="hiw-left">
        <div className="hiw-note">
          <img
            src="/assets/doodles/doodle-heart-outline-crop.png"
            alt=""
            className="hiw-note-heart"
          />
          <p className="hiw-note-text">
            A few steps.
            <br />
            A lot more happy
            <br />
            <span className="hiw-note-indent">endings.</span>
          </p>
        </div>

        <div className="hiw-headline-wrap">
          <svg className="hiw-burst" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M4 36 16 24" stroke="#f14a27" strokeWidth="3" strokeLinecap="round" />
            <path d="M12 38 20 30" stroke="#f14a27" strokeWidth="3" strokeLinecap="round" />
            <path d="M2 28l8-8" stroke="#f14a27" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h1 className="hiw-headline">
            How HomeBound
            <br />
            <span className="hiw-headline-accent">Works</span>
          </h1>
          <p className="hiw-sub">
            Report, connect, and reunite.
            <br />
            It's simple, and it works.
          </p>
        </div>
      </div>

      {/* right: three blob cards */}
      <div className="hiw-cards">
        {STEPS.map((s) => (
          <div className="hiw-card-wrap" key={s.num}>
            <article className={`hiw-card ${s.blob}`}>
              <span className={`hiw-badge ${s.badge}`}>{s.num}</span>
              <div className="hiw-card-body">
                <div className="hiw-icon-disc">{s.icon}</div>
                <h2 className="hiw-card-title">{s.title}</h2>
                <p className="hiw-card-desc">{s.desc}</p>
              </div>
            </article>
          </div>
        ))}
        <svg className="hiw-arrow hiw-arrow--1" viewBox="0 0 40 20" fill="none" aria-hidden="true">
          <path d="M2 10h32m0 0-6-6m6 6-6 6" stroke="#16302a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className="hiw-arrow hiw-arrow--2" viewBox="0 0 40 20" fill="none" aria-hidden="true">
          <path d="M2 10h32m0 0-6-6m6 6-6 6" stroke="#16302a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* top-right doodles */}
      <img
        src="/assets/doodles/doodle-paw-print-crop.png"
        alt=""
        className="hiw-doodle-paw"
      />
      <svg className="hiw-doodle-swirl" viewBox="0 0 140 100" fill="none" aria-hidden="true">
        <path
          d="M14 92 C 6 82, 12 68, 28 66 C 46 64, 52 76, 44 86 C 38 94, 24 94, 28 82 C 34 66, 64 54, 92 44 C 112 36, 126 28, 132 12"
          stroke="#16302a"
          strokeWidth="2"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
      </svg>
      <img
        src="/assets/doodles/doodle-heart-outline-crop.png"
        alt=""
        className="hiw-doodle-heart-tr"
      />

      {/* bottom-left dog + doodles */}
      <div className="hiw-dog-zone">
        <img
          src="/assets/doodles/doodle-heart-filled-crop.png"
          alt=""
          className="hiw-dog-heart"
        />
        <svg className="hiw-dog-ticks" viewBox="0 0 40 34" fill="none" aria-hidden="true">
          <path d="M34 4 28 12" stroke="#f14a27" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M38 12l-8 6" stroke="#f14a27" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M38 22l-10 4" stroke="#f14a27" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
        <svg className="hiw-dog-ticks hiw-dog-ticks--right" viewBox="0 0 40 34" fill="none" aria-hidden="true">
          <path d="M34 4 28 12" stroke="#f14a27" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M38 12l-8 6" stroke="#f14a27" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M38 22l-10 4" stroke="#f14a27" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
        <img
          src="/assets/photos/photo-dog-lying-down.png"
          alt="Golden retriever lying down with its chin on its paws"
          className="hiw-dog"
        />
      </div>

      {/* hills */}
      <svg className="hiw-hills" viewBox="0 0 1600 160" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="hiw-hill-back"
          d="M0 120 C 140 60, 320 40, 520 70 C 700 96, 780 40, 980 34 C 1180 28, 1330 60, 1600 44 L1600 160 L0 160 Z"
        />
        <path
          className="hiw-hill-front"
          d="M0 140 C 200 96, 420 84, 640 104 C 860 124, 1020 78, 1240 74 C 1400 70, 1520 88, 1600 80 L1600 160 L0 160 Z"
        />
      </svg>

      <img
        src="/assets/illustrations/illus-house-garden-crop.png"
        alt=""
        className="hiw-house"
      />
      <img
        src="/assets/illustrations/illus-grass-tufts-crop.png"
        alt=""
        className="hiw-grass hiw-grass--1"
      />
      <img
        src="/assets/illustrations/illus-grass-tufts-crop.png"
        alt=""
        className="hiw-grass hiw-grass--2"
      />
    </section>
  );
}
