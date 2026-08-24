import React, { useState } from 'react';
import EvidenceCard from './EvidenceCard';
import { IconFilter, IconDocument } from '../utils/svgIcons';

export default function EvidenceFeed({
  complaints,
  onInspectWorkOrder,
  userLocation,
  onUpvote,
  upvotedIds = [],
  onAddComment,
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredComplaints = complaints.filter(c => {
    if (filterStatus === 'OVERDUE') return c.status === 'Overdue' || c.status === 'Logged';
    if (filterStatus === 'LINKED') return !!c.linked_project_id;
    return true;
  });

  return (
    <div className="bg-panel border-t-2 border-border-heavy flex flex-col h-full">
      {/* Feed Header */}
      <div className="p-4 border-b border-border-hard flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            EVIDENCE DOSSIER
          </span>
          <span className="text-xs font-mono font-bold text-ink-primary">
            ({complaints.length} Records)
          </span>
        </div>

        {/* Filter Controls (Lightweight text tabs) */}
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-2 py-0.5 text-[10px] font-bold cursor-pointer ${
              filterStatus === 'ALL'
                ? 'border-b-2 border-border-heavy text-ink-primary font-bold'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            ALL
          </button>
          <span className="text-ink-muted text-[10px]">|</span>
          <button
            onClick={() => setFilterStatus('OVERDUE')}
            className={`px-2 py-0.5 text-[10px] font-bold cursor-pointer ${
              filterStatus === 'OVERDUE'
                ? 'border-b-2 border-border-heavy text-ink-primary font-bold'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            OVERDUE
          </button>
          <span className="text-ink-muted text-[10px]">|</span>
          <button
            onClick={() => setFilterStatus('LINKED')}
            className={`px-2 py-0.5 text-[10px] font-bold cursor-pointer ${
              filterStatus === 'LINKED'
                ? 'border-b-2 border-border-heavy text-ink-primary font-bold'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            CONTRACT LINKED
          </button>
        </div>
      </div>

      {/* Scrolling Content Feed */}
      <div className="divide-y divide-border-hard overflow-y-auto flex-1 max-h-[600px]">
        {filteredComplaints.length === 0 ? (
          <div className="p-8 text-center text-ink-muted text-xs font-mono">
            NO EVIDENCE RECORDS MATCHING FILTER CRITERIA
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <EvidenceCard
              key={complaint.complaint_id}
              complaint={complaint}
              onInspectWorkOrder={onInspectWorkOrder}
              userLocation={userLocation}
              onUpvote={onUpvote}
              isUpvoted={upvotedIds.includes(complaint.complaint_id)}
              onAddComment={onAddComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
