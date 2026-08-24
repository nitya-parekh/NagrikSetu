import React from 'react';

export default function TopNavDropdown({
  currentScreen,
  onNavigate,
  user,
  onLogout,
  onOpenRawModal,
}) {
  const navOptions = [
    { id: 'map', label: 'View Map' },
    { id: 'reports', label: 'My Previous Reports' },
    { id: 'report-problem', label: 'Report a New Problem' },
    { id: 'scorecards', label: 'Ward Scorecards' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <nav aria-label="Main Navigation" className="fixed top-0 left-0 right-0 z-40 bg-panel border-b-2 border-border-heavy px-4 py-2.5 font-mono text-xs text-ink-primary">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left: App Title & Dropdown Navigation */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-ink-primary uppercase tracking-tight font-sans text-sm whitespace-nowrap">
            Mumbai Civic Scorecard
          </span>

          <span className="text-border-hard">|</span>

          {/* Simple select-style navigation dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="top-nav-select" className="text-[10px] uppercase text-ink-muted font-bold sr-only">
              Navigation Menu
            </label>
            <select
              id="top-nav-select"
              value={currentScreen}
              onChange={(e) => onNavigate(e.target.value)}
              className="bg-panel-sub border border-border-hard text-ink-primary font-bold px-2.5 py-1 text-xs focus:outline-none focus:border-border-heavy cursor-pointer"
            >
              {navOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: User Status & Secondary Actions */}
        <div className="flex items-center gap-3 text-xs justify-between sm:justify-end">
          {user && (
            <span className="text-ink-muted text-[11px]">
              User: +91 {user.phone ? user.phone.slice(-4) : "Auditor"}
            </span>
          )}

          <button
            onClick={onOpenRawModal}
            className="text-ink-secondary hover:text-ink-primary underline cursor-pointer text-[11px]"
            title="Inspect mock_data.json"
          >
            [JSON]
          </button>

          <button
            onClick={onLogout}
            className="text-ink-secondary hover:text-ink-primary underline cursor-pointer text-[11px]"
          >
            [Logout]
          </button>
        </div>
      </div>
    </nav>
  );
}
