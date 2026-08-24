import React from 'react';

export default function ModernProfileView({ user, submittedReports = [] }) {
  const userName = user?.name || "Citizen User";
  const userPhone = user?.phone || "9820012345";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 font-sans space-y-6">
      {/* Profile Card with Basic User Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
            {userName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{userName}</h2>
            <p className="text-xs text-slate-500 font-medium">Mobile: +91 {userPhone}</p>
          </div>
        </div>
      </div>

      {/* Submitted Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Your Submitted Reports</h3>
          <span className="text-xs text-slate-500">
            {submittedReports.length} {submittedReports.length === 1 ? 'record' : 'records'} in database
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {submittedReports.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No reports submitted yet.
            </div>
          ) : (
            submittedReports.map((rep) => {
              const isOverdue = rep.status === 'Overdue';
              const isPending = rep.status === 'Pending BMC Verification';
              const isOfficiallyTracked = rep.status === 'Officially Tracked' || rep.status === 'Resolved';
              const trackingId = rep.grievance_tracking_id || rep.grievance_id;

              return (
                <div
                  key={rep.complaint_id || rep.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
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
                        {rep.status || 'Reported'}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900">{rep.category}</div>
                    <div className="text-slate-500">{rep.locality || rep.location}</div>
                  </div>

                  {trackingId && (
                    <div className="sm:text-right">
                      <span className="text-[10px] text-slate-400 block">BMC Tracking ID</span>
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {trackingId}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
