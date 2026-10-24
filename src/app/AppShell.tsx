import { useState } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { MenuIcon, CloseIcon } from "../components/icons";
import "./AppShell.css";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report", chevron: true },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/stories", label: "Success Stories" },
  { to: "/resources", label: "Resources", chevron: true },
];

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="shell">
      <div className="hb-frame">
        <header className="shell-header">
          <Link to="/" className="shell-brand" onClick={() => setMenuOpen(false)}>
            <img
              src="/assets/branding/logo-house-paw.png"
              alt="HomeBound logo"
              className="shell-brand-mark"
            />
            <span className="shell-brand-name">
              Home<span className="shell-brand-accent">Bound</span>
            </span>
          </Link>

          <nav
            className={`shell-nav ${menuOpen ? "shell-nav--open" : ""}`}
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `shell-nav-link ${isActive ? "is-active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
              >
                <span className="shell-nav-label">{item.label}</span>
                {item.chevron && (
                  <svg
                    className="shell-chevron"
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
                  </svg>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="shell-actions">
            <Link to="/atlas" className="shell-search" aria-label="Search">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </Link>
            <Link to="/auth/sign-in" className="shell-signin">
              Sign In
            </Link>
            <button
              type="button"
              className="shell-menu-btn"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </header>

        {menuOpen && (
          <div className="shell-mobile">
            <Link to="/report/lost" className="hb-btn hb-btn--primary" onClick={() => setMenuOpen(false)}>
              Report a Lost Pet
            </Link>
            <Link to="/report/found" className="hb-btn hb-btn--found" onClick={() => setMenuOpen(false)}>
              Report a Found Pet
            </Link>
            <Link to="/auth/sign-in" className="shell-signin" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          </div>
        )}

        <main className="shell-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
