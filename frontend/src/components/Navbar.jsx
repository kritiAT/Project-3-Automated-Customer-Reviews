import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `px-3 py-1.5 text-sm font-medium tracking-wide uppercase transition-colors ${
    isActive ? "text-ink border-b-2 border-ink" : "text-inkfade hover:text-ink"
  }`;

export default function Navbar() {
  return (
    <header className="border-b-2 border-ink">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-end justify-between">
        <NavLink to="/" className="block">
          <p className="font-mono text-xs tracking-[0.2em] text-inkfade uppercase">
            Vol. I — Customer Review Desk
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink -mt-1">
            Field Notes
          </h1>
        </NavLink>
        <nav className="flex gap-1">
          <NavLink to="/classify" className={linkClass}>
            Inspect a Review
          </NavLink>
          <NavLink to="/categories" className={linkClass}>
            Category Reports
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
