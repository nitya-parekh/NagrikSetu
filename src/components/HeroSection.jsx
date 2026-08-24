import React from 'react';

export default function HeroSection({
  onReportClick,
  onExploreMapClick,
  totalIssuesCount = 10,
}) {
  return (
    <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
        <span>Citizens United for a Better Tomorrow</span>
      </div>

      {/* Large Bold Two-Line Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
        Report. Track. <br />
        <span className="text-emerald-600">Resolve.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
        <strong>NagrikSetu</strong> bridges Mumbai citizens with municipal ward authorities. Report local infrastructure defects directly to MyBMC Assist and track citywide resolutions in real time.
      </p>

      {/* Dual Centered CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <button
          onClick={onReportClick}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Report an Issue</span>
        </button>

        <button
          onClick={onExploreMapClick}
          className="w-full sm:w-auto bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433 1.025-.638 2.378-1.637 3.528-3.082C16.92 12.756 18 10.428 18 8A8 8 0 102 8c0 2.427 1.08 4.756 3.1 7.27 1.15 1.445 2.503 2.444 3.528 3.082.311.193.571.337.757.433a5.727 5.727 0 00.281.14l.018.008.006.003zM10 11a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>Explore Map</span>
        </button>
      </div>
    </section>
  );
}
