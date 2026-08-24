import React, { useState } from 'react';

export default function HomeScreen({
  wardsList,
  onSelectWard,
  onOpenReportFlow,
  onLogout,
  user,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWards = wardsList.filter((ward) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      ward.ward_id.toLowerCase().includes(q) ||
      ward.ward_name.toLowerCase().includes(q) ||
      ward.locality.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-mono">
      {/* Top Header */}
      <header className="bg-panel border-b border-border-heavy px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">
              MCGM AUDIT PORTAL
            </div>
            <h1 className="text-lg font-bold uppercase tracking-tight text-ink-primary font-sans">
              Mumbai Civic Scorecard
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {user && (
              <span className="text-ink-muted hidden sm:inline">
                Auditor: +91 {user.phone ? user.phone.slice(-4) : "User"}
              </span>
            )}
            <button
              onClick={onLogout}
              className="text-ink-secondary hover:text-ink-primary underline cursor-pointer"
            >
              [Logout]
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: Focused Location Selection */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* Uncluttered Title Section */}
        <section className="space-y-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-ink-muted uppercase tracking-widest">
              LOCATION SELECTION
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-ink-primary font-sans">
              Select Your Ward
            </h2>
            <p className="text-xs text-ink-secondary">
              Review public infrastructure contracts, project delay tracking, and ground complaints across Mumbai.
            </p>
          </div>

          {/* Clean Focused Search Input */}
          <div className="pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Ward ID (e.g. H/West, G/North, A) or area (Bandra, Dadar, Andheri, Colaba)..."
              className="w-full bg-panel border border-border-heavy p-3.5 text-xs sm:text-sm font-mono text-ink-primary placeholder:text-ink-muted focus:outline-none"
            />
          </div>
        </section>

        {/* Streamlined Ward Directory List */}
        <section className="space-y-2">
          <div className="flex justify-between items-center text-xs text-ink-muted uppercase pb-2 border-b border-border-hard">
            <span>AVAILABLE WARDS ({filteredWards.length})</span>
            <span>ACTION</span>
          </div>

          <div className="divide-y divide-border-hard">
            {filteredWards.map((ward) => (
              <div
                key={ward.ward_id}
                onClick={() => onSelectWard(ward.ward_id)}
                className="py-4 px-2 hover:bg-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink-primary text-sm font-sans">
                      Ward {ward.ward_id} : {ward.ward_name}
                    </span>
                    {ward.hasFullData && ward.delayedProjectsCount > 0 && (
                      <span className="text-[10px] text-stark-orange font-bold font-mono">
                        [{ward.delayedProjectsCount} DELAYED]
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-secondary">
                    {ward.locality}
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  {ward.hasFullData && (
                    <span className="text-xs text-ink-muted font-mono">
                      ₹{ward.totalBudgetCr} Cr Budget
                    </span>
                  )}
                  <span className="text-xs font-bold text-ink-primary underline">
                    Open Scorecard →
                  </span>
                </div>
              </div>
            ))}

            {filteredWards.length === 0 && (
              <div className="py-8 text-center text-xs text-ink-muted">
                No wards found matching "{searchQuery.toUpperCase()}".
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-hard p-6 text-center text-[10px] text-ink-muted">
        MUNICIPAL CORPORATION OF GREATER MUMBAI (MCGM) - CIVIC AUDIT COMPLIANCE PORTAL
      </footer>
    </div>
  );
}
