import React, { useState } from 'react';
import { IconLinkSharp, IconAlertSquare, IconMessage, IconCamera } from '../utils/svgIcons';
import { calculateHaversineDistance, formatDistance } from '../utils/geoUtils';
import MediaCarousel from './MediaCarousel';

export default function EvidenceCard({
  complaint,
  onInspectWorkOrder,
  userLocation,
  onUpvote,
  isUpvoted = false,
  onAddComment,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const project = complaint.linkedProject;
  const workOrder = complaint.linkedWorkOrder;

  // Calculate Haversine distance from user location
  const userLat = userLocation?.latitude || 19.0600;
  const userLng = userLocation?.longitude || 72.8340;
  const cLat = Number(complaint.latitude || 19.0645);
  const cLng = Number(complaint.longitude || 72.8358);
  const distanceKm = calculateHaversineDistance(userLat, userLng, cLat, cLng);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (onAddComment) {
      onAddComment(complaint.complaint_id, {
        id: `com-${Date.now()}`,
        author: 'Citizen Auditor (You)',
        timestamp: '2026-08-22 14:30',
        text: commentInput.trim(),
        targetComplaintId: complaint.complaint_id,
      });
    }
    setCommentInput('');
  };

  const commentsList = complaint.comments || [];
  const currentUpvotes = complaint.upvotes !== undefined ? complaint.upvotes : (complaint.duplicate_count || 1);
  const hasMedia = complaint.media && complaint.media.length > 0;

  return (
    <article className="bg-panel border-b border-border-hard p-5 space-y-4">
      {/* 1. Default Compact Face: Essential Info & Upvote */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          {/* Header Row: ID + Category + Status */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="font-bold text-ink-primary">#{complaint.complaint_id}</span>
            <span className="text-ink-muted">|</span>
            <span className="text-ink-secondary">{complaint.location}</span>
            <span className="text-ink-muted">|</span>
            <span className={`px-1.5 py-0.2 text-[10px] font-bold ${
              complaint.status === 'Overdue'
                ? 'text-stark-orange border border-stark-orange'
                : 'text-stark-green border border-stark-green'
            }`}>
              [{complaint.status ? complaint.status.toUpperCase() : "LOGGED"}]
            </span>
          </div>

          {/* One-Line Issue Description */}
          <h3 className="text-sm font-bold text-ink-primary tracking-tight">
            {complaint.category || "Pothole / Road Damage"}
            {complaint.duplicate_count > 1 && (
              <span className="text-xs font-normal text-stark-yellow-text ml-2 font-mono">
                ({complaint.duplicate_count} duplicate reports)
              </span>
            )}
          </h3>
        </div>

        {/* Upvote Button on Face */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onUpvote && onUpvote(complaint.complaint_id)}
            className={`px-3 py-1.5 text-xs font-mono font-bold border cursor-pointer ${
              isUpvoted
                ? 'bg-border-heavy text-stark-yellow-bright border-border-heavy'
                : 'bg-panel-sub text-ink-primary border-border-hard hover:border-border-heavy'
            }`}
            title="Endorse this civic issue"
          >
            [+ UPVOTE ({currentUpvotes})]
          </button>
        </div>
      </div>

      {/* 2. Expand / Collapse Trigger Link */}
      <div className="flex items-center justify-between pt-1 border-t border-border-hard text-xs font-mono">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-ink-primary hover:text-stark-orange font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>[{isExpanded ? "− HIDE DETAILS" : "+ VIEW DETAILS & CONTRACT AUDIT"}]</span>
        </button>

        {hasMedia && !isExpanded && (
          <span className="text-[11px] text-ink-muted flex items-center gap-1">
            <IconCamera className="w-3.5 h-3.5 text-ink-muted" />
            <span>{complaint.media.length} MEDIA ATTACHED</span>
          </span>
        )}
      </div>

      {/* 3. Secondary Detailed Section (Expanded Only) */}
      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-border-hard text-xs font-mono">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-muted bg-panel-sub p-2.5">
            <div>
              <span>LOGGED: </span>
              <strong className="text-ink-primary">{complaint.date}</strong>
            </div>
            <div>
              <span>PROXIMITY: </span>
              <strong className="text-ink-primary">{formatDistance(distanceKm)} from you</strong>
            </div>
            <div>
              <span>COORDINATES: </span>
              <strong className="text-ink-primary">{complaint.latitude}° N, {complaint.longitude}° E</strong>
            </div>
          </div>

          {/* Media Carousel (if available) */}
          {hasMedia && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-ink-muted uppercase block">
                EVIDENCE MEDIA:
              </span>
              <MediaCarousel media={complaint.media} />
            </div>
          )}

          {/* Linked Sanctioned Project Details (Structural Layout) */}
          {project ? (
            <div className="space-y-3 pt-2">
              <div className="border-t border-border-hard pt-2">
                <div className="text-[10px] font-bold text-ink-muted uppercase">
                  LINKED MUNICIPAL INFRASTRUCTURE WORK:
                </div>
                <h4 className="text-xs font-bold text-ink-primary mt-0.5">
                  {project.project_name} ({project.project_id})
                </h4>
              </div>

              {/* Financial & Contractor Data */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] bg-panel-sub p-3">
                <div>
                  <span className="text-ink-muted block">SANCTIONED:</span>
                  <span className="font-bold text-ink-primary">₹{project.sanctioned_amount_cr} Cr</span>
                </div>
                <div>
                  <span className="text-ink-muted block">CONTRACTOR:</span>
                  <span className="font-bold text-ink-primary truncate block">
                    {workOrder ? workOrder.contractor : "Primary Contractor"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block">DEADLINE:</span>
                  <span className="font-bold text-stark-orange">{project.expected_end_date} (Expired)</span>
                </div>
              </div>

              {/* Audit Discrepancy Note */}
              <p className="text-[11px] text-ink-secondary leading-relaxed pl-2 border-l-2 border-border-heavy">
                Complaint logged for infrastructure corridor with budget of <strong>₹{project.sanctioned_amount_cr} Cr</strong>. Works past scheduled completion date of <strong>{project.expected_end_date}</strong>.
              </p>

              {/* Inspect Work Order Action */}
              <div>
                <button
                  type="button"
                  onClick={() => onInspectWorkOrder && onInspectWorkOrder(complaint)}
                  className="text-xs font-bold text-ink-primary hover:underline cursor-pointer"
                >
                  [INSPECT FULL WORK ORDER →]
                </button>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-ink-muted py-1">
              Grievance registered in municipal intake ledger. Field engineer assignment pending.
            </div>
          )}

          {/* Community Comments Section */}
          <div className="border-t border-border-hard pt-3 space-y-2">
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="text-xs font-bold text-ink-primary hover:text-stark-orange flex items-center gap-1.5 cursor-pointer"
            >
              <IconMessage className="w-3.5 h-3.5 text-ink-secondary" />
              <span>[{showComments ? "HIDE" : "VIEW"} COMMUNITY OBSERVATIONS ({commentsList.length})]</span>
            </button>

            {showComments && (
              <div className="space-y-3 bg-panel-sub p-3 border border-border-hard font-mono text-xs">
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {commentsList.length === 0 ? (
                    <div className="text-[11px] text-ink-muted py-1">
                      NO COMMUNITY OBSERVATIONS YET.
                    </div>
                  ) : (
                    commentsList.map((com) => (
                      <div key={com.id} className="border-b border-border-hard pb-1.5 last:border-b-0 space-y-0.5">
                        <div className="flex justify-between text-[10px] text-ink-muted">
                          <span className="font-bold text-ink-primary">{com.author}</span>
                          <span>{com.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-ink-secondary">{com.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2 border-t border-border-hard">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add observation..."
                    className="flex-1 bg-panel border border-border-hard p-1.5 text-xs font-mono text-ink-primary focus:border-border-heavy focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-border-heavy text-panel hover:bg-ink-secondary px-3 py-1 text-xs font-bold uppercase cursor-pointer shrink-0"
                  >
                    [POST]
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
