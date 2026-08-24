import React, { useState } from 'react';
import { calculateHaversineDistance, formatDistance } from '../utils/geoUtils';
import MediaCarousel from './MediaCarousel';

export default function ModernEvidenceCard({
  complaint,
  userLocation,
  currentUser,
  onUpvote,
  isUpvoted = false,
  onAddComment,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  // Haversine distance
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
        author: currentUser?.name || 'Citizen User',
        timestamp: '2026-08-22 19:56',
        text: commentInput.trim(),
        targetComplaintId: complaint.complaint_id,
      });
    }
    setCommentInput('');
  };

  const commentsList = complaint.citizen_comments || complaint.comments || [];
  const currentUpvotes = complaint.upvotes !== undefined ? complaint.upvotes : (complaint.duplicate_count || 1);
  const status = complaint.status || 'Reported';
  const isPending = status === 'Pending BMC Verification';
  const isOfficiallyTracked = status === 'Officially Tracked' || status === 'Resolved';
  const isOverdue = status === 'Overdue';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all p-5 space-y-4 font-sans">
      {/* 1. Minimal Default Face */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5">
          {/* Header Row: ID + Location + Status Pill */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-900">#{complaint.complaint_id}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">{complaint.locality || complaint.location}</span>
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

          {/* Issue Title */}
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            {complaint.category}
            {complaint.duplicate_count > 1 && (
              <span className="text-xs font-medium text-slate-500 ml-2">
                ({complaint.duplicate_count} citizens reported)
              </span>
            )}
          </h3>
        </div>

        {/* Upvote Pill Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onUpvote && onUpvote(complaint.complaint_id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              isUpvoted
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Upvote ({currentUpvotes})</span>
          </button>
        </div>
      </div>

      {/* 2. Expand / Collapse Trigger */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? 'Hide details' : 'View details & observations'}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        <span className="text-[11px] text-slate-400">
          Reported {complaint.date}
        </span>
      </div>

      {/* 3. Secondary Detailed Section (Expanded Only) */}
      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 rounded-lg p-3 text-[11px]">
            <div>
              <span className="text-slate-400">Proximity: </span>
              <strong className="text-slate-700 font-semibold">{formatDistance(distanceKm)} away</strong>
            </div>
            <div>
              <span className="text-slate-400">Coordinates: </span>
              <strong className="text-slate-700 font-semibold">{complaint.latitude}° N, {complaint.longitude}° E</strong>
            </div>
          </div>

          {/* Media Carousel (if available) */}
          {complaint.media && complaint.media.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Photo & Video Evidence
              </span>
              <MediaCarousel media={complaint.media} />
            </div>
          )}

          {/* Official BMC Tracking ID */}
          {(complaint.grievance_id || complaint.grievance_tracking_id) && (
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 flex justify-between items-center text-xs">
              <span className="text-slate-500">Official Tracking ID:</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {complaint.grievance_id || complaint.grievance_tracking_id}
              </span>
            </div>
          )}

          {/* Comments Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <span>{showComments ? 'Hide community notes' : `Community observations (${commentsList.length})`}</span>
            </button>

            {showComments && (
              <div className="space-y-2.5 bg-slate-50 rounded-lg p-3">
                <div className="space-y-2 max-h-[140px] overflow-y-auto">
                  {commentsList.length === 0 ? (
                    <div className="text-[11px] text-slate-400 py-1">
                      No community observations yet.
                    </div>
                  ) : (
                    commentsList.map((com, idx) => {
                      const author = com.commenter_name || com.author || 'Citizen';
                      const text = com.comment_text || com.text || '';
                      const date = com.date || com.timestamp || '';
                      return (
                        <div key={com.id || idx} className="text-xs space-y-0.5 border-b border-slate-200/60 pb-1.5 last:border-b-0">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span className="font-semibold text-slate-700">{author}</span>
                            <span>{date}</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">{text}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-1 border-t border-slate-200/60">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add an observation..."
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Post
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
