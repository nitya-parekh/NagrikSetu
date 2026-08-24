import React, { useState } from 'react';
import logoImg from '../assets/nagriksetu-logo.png';

export default function HeaderNav({
  currentScreen,
  onNavigate,
  user,
  onLogout,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSelectNav = (screen, filter = null) => {
    setOpenDropdown(null);
    onNavigate(screen, filter);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: NagrikSetu Logo & Two-Tone Wordmark */}
        <div
          onClick={() => handleSelectNav('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <img
            src={logoImg}
            alt="NagrikSetu Logo"
            className="w-9 h-9 rounded-lg object-contain shadow-xs"
          />
          <div className="text-xl font-extrabold tracking-tight">
            <span className="text-[#0f172a]">Nagrik</span>
            <span className="text-[#16a34a]">Setu</span>
          </div>
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          {/* 1. Home */}
          <button
            onClick={() => handleSelectNav('home')}
            className={`px-3.5 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors ${
              currentScreen === 'home' ? 'text-blue-600 font-semibold bg-blue-50/60' : ''
            }`}
          >
            Home
          </button>

          {/* 2. Report Issue */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('report')}
              className={`px-3.5 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1 transition-colors ${
                currentScreen === 'report-problem' || currentScreen === 'reports' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <span>Report Issue</span>
              <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {openDropdown === 'report' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-md p-1.5 z-50">
                <button
                  onClick={() => handleSelectNav('report-problem')}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer"
                >
                  File a New Report
                </button>
                <button
                  onClick={() => handleSelectNav('reports')}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer"
                >
                  My Submissions & Grievance IDs
                </button>
              </div>
            )}
          </div>

          {/* 3. Explore Issues */}
          <button
            onClick={() => handleSelectNav('explore')}
            className={`px-3.5 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors ${
              currentScreen === 'explore' ? 'text-blue-600 font-semibold bg-blue-50/60' : ''
            }`}
          >
            Explore Issues
          </button>

          {/* 4. Ward Details */}
          <button
            onClick={() => handleSelectNav('ward-details')}
            className={`px-3.5 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors ${
              currentScreen === 'ward-details' ? 'text-blue-600 font-semibold bg-blue-50/60' : ''
            }`}
          >
            Ward Details
          </button>

          {/* 5. Map */}
          <button
            onClick={() => handleSelectNav('map')}
            className={`px-3.5 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors ${
              currentScreen === 'map' ? 'text-blue-600 font-semibold bg-blue-50/60' : ''
            }`}
          >
            Map
          </button>

          {/* 6. About */}
          <button
            onClick={() => handleSelectNav('about')}
            className={`px-3.5 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors ${
              currentScreen === 'about' ? 'text-blue-600 font-semibold bg-blue-50/60' : ''
            }`}
          >
            About
          </button>
        </nav>

        {/* Right: Solid Blue Rounded Profile CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSelectNav('profile')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Profile</span>
          </button>

          {user && (
            <button
              onClick={onLogout}
              className="text-xs text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
