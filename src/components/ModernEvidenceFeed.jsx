import React, { useState } from 'react';
import ModernEvidenceCard from './ModernEvidenceCard';

export default function ModernEvidenceFeed({
  complaints = [],
  userLocation,
  currentUser,
  onUpvote,
  upvotedIds = [],
  onAddComment,
  initialFilter = 'ALL',
}) {
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = complaints.filter((c) => {
    if (filterStatus === 'OVERDUE' && c.status !== 'Overdue') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.category.toLowerCase().includes(q) ||
        (c.locality && c.locality.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        c.complaint_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 font-sans">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues by location or category..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Issues ({complaints.length})
          </button>
          <button
            onClick={() => setFilterStatus('OVERDUE')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterStatus === 'OVERDUE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Overdue
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No issues match the selected search or filter criteria.
          </div>
        ) : (
          filtered.map((comp) => (
            <ModernEvidenceCard
              key={comp.complaint_id}
              complaint={comp}
              userLocation={userLocation}
              currentUser={currentUser}
              onUpvote={onUpvote}
              isUpvoted={upvotedIds.includes(comp.complaint_id)}
              onAddComment={onAddComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
