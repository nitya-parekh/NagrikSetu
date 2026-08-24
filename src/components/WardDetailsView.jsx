import React, { useState } from 'react';
import { getWardsByRegion, getAllWardsList } from '../data/dataLoader';

export default function WardDetailsView({
  allComplaints = [],
  initialWardId = 'A',
}) {
  const [selectedWardId, setSelectedWardId] = useState(initialWardId);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedComplaintId, setExpandedComplaintId] = useState(null);
  const [activeRegionTab, setActiveRegionTab] = useState('All');

  const allWards = getAllWardsList();
  const selectedWard = allWards.find((w) => w.ward_id === selectedWardId) || allWards[0];

  // Filter complaints for the active ward
  const wardComplaints = allComplaints.filter(
    (c) => c.ward_id && c.ward_id.toLowerCase() === selectedWard.ward_id.toLowerCase()
  );

  const toggleExpandComplaint = (id) => {
    setExpandedComplaintId(expandedComplaintId === id ? null : id);
  };

  const filteredWards = allWards.filter((w) => {
    if (activeRegionTab !== 'All' && w.region !== activeRegionTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.ward_id.toLowerCase().includes(q) ||
        w.ward_name.toLowerCase().includes(q) ||
        (w.areas_covered || []).some((a) => a.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8">
      {/* Top Header & Searchable Ward Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Municipal Ward Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mumbai Ward Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Explore all 24 official BMC administrative wards across the City, Western Suburbs, and Eastern Suburbs. Inspect covered localities and citizen-reported issues.
          </p>
        </div>

        {/* Region Filter & Ward Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 md:pb-0">
            {['All', 'City', 'Western Suburbs', 'Eastern Suburbs'].map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegionTab(region)}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeRegionTab === region
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Ward (e.g. A, H/West, K/East) or locality (e.g. Colaba, Bandra, Powai)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white shadow-xs"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Ward Quick Selector Chips */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Select an Administrative Ward ({filteredWards.length} available):
          </div>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
            {filteredWards.map((w) => {
              const isSelected = w.ward_id === selectedWard.ward_id;
              return (
                <button
                  key={w.ward_id}
                  onClick={() => {
                    setSelectedWardId(w.ward_id);
                    setExpandedComplaintId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold">Ward {w.ward_id}</span>
                  <span className={isSelected ? 'text-blue-100' : 'text-slate-400'}>•</span>
                  <span className="text-[11px] font-normal truncate max-w-[120px]">{w.ward_name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Ward Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Ward Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-xs font-bold">
                Ward {selectedWard.ward_id}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {selectedWard.region}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {selectedWard.ward_name}
            </h2>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 self-start sm:self-auto">
            <span className="font-semibold text-slate-700">{wardComplaints.length}</span> complaints filed in this ward
          </div>
        </div>

        {/* Localities / Areas Covered */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Areas & Localities Covered:
          </span>
          <div className="flex flex-wrap gap-2">
            {(selectedWard.areas_covered || []).map((area, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-lg border border-slate-200/60"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Ward Complaints List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-slate-900">
            Citizen Complaints in Ward {selectedWard.ward_id} ({wardComplaints.length})
          </h3>
          <span className="text-xs text-slate-400">
            Click any complaint to view comments & tracking ID
          </span>
        </div>

        {wardComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs space-y-1">
            <p className="font-medium text-slate-600">No active complaints logged for Ward {selectedWard.ward_id}.</p>
            <p className="text-[11px] text-slate-400">Citizens can file issues directly via the "Report Issue" flow.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wardComplaints.map((c) => {
              const isExpanded = expandedComplaintId === c.complaint_id;
              const status = c.status || 'Reported';
              const isPending = status === 'Pending BMC Verification';
              const isOfficiallyTracked = status === 'Officially Tracked' || status === 'Resolved';
              const isOverdue = status === 'Overdue';
              const commentsList = c.citizen_comments || c.comments || [];
              const officialId = c.grievance_id || c.grievance_tracking_id;

              return (
                <div
                  key={c.complaint_id}
                  className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all overflow-hidden"
                >
                  {/* Collapsed Card Summary Header */}
                  <div
                    onClick={() => toggleExpandComplaint(c.complaint_id)}
                    className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-900">#{c.complaint_id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-medium text-slate-600">{c.locality || c.location}</span>
                        <span className="text-slate-300">•</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isPending
                              ? 'bg-amber-100 text-amber-900 border border-amber-500'
                              : isOfficiallyTracked
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-600'
                              : isOverdue
                              ? 'bg-orange-100 text-orange-900 border border-orange-500'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {c.category}
                      </h4>

                      {c.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {c.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                      <span>{c.date}</span>
                      <svg
                        className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-blue-600' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Details: Citizen Comments & Grievance ID */}
                  {isExpanded && (
                    <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                      {/* Full description */}
                      {c.description && (
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 text-slate-700">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                            Issue Description:
                          </span>
                          <p>{c.description}</p>
                        </div>
                      )}

                      {/* Official BMC Grievance ID */}
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3.5 rounded-xl border border-slate-200/60 text-xs">
                        <span className="text-slate-500 font-medium">Official Grievance Tracking ID:</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                          {officialId || "Not yet tracked"}
                        </span>
                      </div>

                      {/* Citizen Comments Flat List */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700">
                            Citizen Observations ({commentsList.length})
                          </span>
                        </div>

                        {commentsList.length === 0 ? (
                          <div className="text-slate-400 text-[11px] bg-white p-3 rounded-xl border border-slate-200/60">
                            No citizen observations recorded yet.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {commentsList.map((cm, i) => {
                              const authorName = cm.commenter_name || cm.author || "Citizen";
                              const text = cm.comment_text || cm.text || "";
                              const commentDate = cm.date || cm.timestamp || "";

                              return (
                                <div
                                  key={i}
                                  className="bg-white p-3.5 rounded-xl border border-slate-200/60 space-y-1 shadow-xs"
                                >
                                  <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-bold text-slate-800">{authorName}</span>
                                    <span className="text-slate-400">{commentDate}</span>
                                  </div>
                                  <p className="text-slate-600 text-xs leading-relaxed">{text}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
