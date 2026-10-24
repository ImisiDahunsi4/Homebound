import { Link, useLocation } from "react-router-dom";
import "./ComingSoonPage.css";

/* Honest placeholder: routes exist in the sitemap but aren't built yet.
   Never render fake content to look complete (per 00-overview.md). */
export default function ComingSoonPage() {
  const { pathname } = useLocation();
  return (
    <section className="coming hb-container hb-section">
      <img
        src="/assets/doodles/doodle-paw-print.png"
        alt=""
        className="coming-paw"
      />
      <h1 className="coming-title">This page is on its way.</h1>
      <p className="coming-body">
        <code>{pathname}</code> isn't built yet — nothing here is faked.
      </p>
      <Link to="/" className="hb-btn hb-btn--ghost">
        Back to Home
      </Link>
    </section>
  );
}
