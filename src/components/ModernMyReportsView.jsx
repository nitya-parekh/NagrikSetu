import React, { useState } from 'react';

export default function ModernMyReportsView({
  reports = [],
  onUpdateGrievanceId,
  onNavigateToReport,
}) {
  const [editingId, setEditingId] = useState(null);
  const [trackingIdInput, setTrackingIdInput] = useState('');

  const handleSaveId = async (complaintId) => {
    if (!trackingIdInput.trim()) return;
    const cleanId = String(complaintId).replace(/^CMP-/, '');
    const cleanTrackingId = trackingIdInput.trim().toUpperCase();
    if (onUpdateGrievanceId) {
      await onUpdateGrievanceId(cleanId, cleanTrackingId);
    }
    setEditingId(null);
    setTrackingIdInput('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Citizen Ledger
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            My Previous Reports
          </h2>
          <p className="text-xs text-slate-500">
            Track your staged and officially verified civic grievances across Mumbai.
          </p>
        </div>

        <button
          onClick={onNavigateToReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          + File New Report
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs space-y-2">
            <p className="text-slate-600 font-medium">No grievances recorded in the database yet.</p>
            <p className="text-[11px]">Click "File New Report" to stage your first civic issue.</p>
          </div>
        ) : (
          reports.map((rep) => {
            const status = rep.status || 'Pending BMC Verification';
            const isPending = status === 'Pending BMC Verification';
            const isOfficiallyTracked = status === 'Officially Tracked' || status === 'Resolved';
            const isOverdue = status === 'Overdue';
            const officialId = rep.grievance_id || rep.grievance_tracking_id;

            return (
              <div
                key={rep.complaint_id || rep.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-900">#{rep.complaint_id || `CMP-${rep.id}`}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400">{rep.date}</span>
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

                  <h3 className="text-sm font-bold text-slate-900">{rep.category}</h3>
                  <div className="text-xs text-slate-500">{rep.locality || rep.location}</div>
                  {rep.description && (
                    <p className="text-xs text-slate-600 line-clamp-1">{rep.description}</p>
                  )}
                </div>

                {/* Grievance Tracking ID Section */}
                <div className="sm:text-right shrink-0 text-xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    BMC Tracking ID
                  </span>
                  {officialId ? (
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md inline-block mt-1">
                      {officialId}
                    </span>
                  ) : (
                    <div className="pt-1">
                      {editingId === (rep.complaint_id || rep.id) ? (
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="text"
                            value={trackingIdInput}
                            onChange={(e) => setTrackingIdInput(e.target.value)}
                            placeholder="e.g. MCGM-89104"
                            className="bg-white border border-slate-300 rounded-lg p-1 text-xs uppercase w-32 focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveId(rep.id || rep.complaint_id)}
                            className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(rep.complaint_id || rep.id);
                            setTrackingIdInput('');
                          }}
                          className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-lg hover:bg-amber-100 cursor-pointer inline-block"
                        >
                          [+ Enter ID to Verify]
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
