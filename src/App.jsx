import React, { useState, useEffect } from 'react';
import { getAllWardsList, normalizeBackendIssue } from './data/dataLoader';
import { fetchIssuesApi, createIssueApi, updateGrievanceIdApi } from './api/issuesApi';
import { DEFAULT_USER_LOCATION } from './utils/geoUtils';
import ModernLoginScreen from './components/ModernLoginScreen';
import HeaderNav from './components/HeaderNav';
import HeroSection from './components/HeroSection';
import ModernMapVisualizer from './components/ModernMapVisualizer';
import ModernEvidenceFeed from './components/ModernEvidenceFeed';
import ModernReportFlow from './components/ModernReportFlow';
import ModernMyReportsView from './components/ModernMyReportsView';
import ModernProfileView from './components/ModernProfileView';
import WardDetailsView from './components/WardDetailsView';

export default function App() {
  // Navigation & Session Restoration via localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem('civicfix_user_session');
      return savedSession ? JSON.parse(savedSession) : null;
    } catch {
      return null;
    }
  });

  const [currentScreen, setCurrentScreen] = useState(() => {
    try {
      const savedSession = localStorage.getItem('civicfix_user_session');
      return savedSession ? 'home' : 'login';
    } catch {
      return 'login';
    }
  });

  const [exploreFilter, setExploreFilter] = useState('ALL');

  // User Geolocation
  const [userLocation, setUserLocation] = useState(DEFAULT_USER_LOCATION);

  // Live Backend Issues State
  const [rawBackendIssues, setRawBackendIssues] = useState([]);
  const [dynamicUpvotes, setDynamicUpvotes] = useState({});
  const [dynamicComments, setDynamicComments] = useState({});
  const [upvotedIds, setUpvotedIds] = useState([]);
  const [userSubmittedIds, setUserSubmittedIds] = useState([]);

  // Wards directory metadata (24 official wards)
  const wardsList = getAllWardsList();

  // Load issues from real backend on mount
  const loadBackendIssues = async () => {
    try {
      const data = await fetchIssuesApi();
      if (Array.isArray(data)) {
        setRawBackendIssues(data);
      }
    } catch (err) {
      console.error('Failed to load issues from backend:', err);
    }
  };

  useEffect(() => {
    loadBackendIssues();
  }, []);

  // Format and normalize issues from live backend
  const allComplaints = rawBackendIssues.map((issue) =>
    normalizeBackendIssue(issue, wardsList, dynamicUpvotes, dynamicComments)
  );

  // Filter user's submitted reports
  const userReports = allComplaints.filter((c) =>
    userSubmittedIds.includes(c.id) || userSubmittedIds.includes(c.complaint_id)
  );

  const handleLoginSuccess = (userData) => {
    const sessionData = { ...userData, loggedIn: true };
    try {
      localStorage.setItem('civicfix_user_session', JSON.stringify(sessionData));
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
    }
    setCurrentUser(sessionData);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('civicfix_user_session');
    } catch (e) {
      console.error('Failed to clear session from localStorage:', e);
    }
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const handleNavigate = (screen, filter = null) => {
    if (filter) setExploreFilter(filter);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stage 1: Async Stage Report calling Real Backend POST /issues
  const handleStageReport = async (payload) => {
    const createdIssue = await createIssueApi(payload);
    // Add to raw backend issues state
    setRawBackendIssues((prev) => [createdIssue, ...prev]);
    // Track as user-submitted in current session
    setUserSubmittedIds((prev) => [...prev, createdIssue.id]);

    return normalizeBackendIssue(createdIssue, wardsList, dynamicUpvotes, dynamicComments);
  };

  // Stage 2: Verification Loop Handler with PATCH /issues/:id persistence
  const handleVerifyReport = async (complaintId, trackingId, timestamp) => {
    const cleanId = String(complaintId).replace(/^CMP-/, '');
    try {
      const updatedIssue = await updateGrievanceIdApi(cleanId, trackingId);
      setRawBackendIssues((prev) =>
        prev.map((issue) => {
          if (String(issue.id) === String(cleanId)) {
            return updatedIssue;
          }
          return issue;
        })
      );
    } catch (err) {
      console.error('Failed to persist grievance verification to backend:', err);
      // Fallback in-memory update
      setRawBackendIssues((prev) =>
        prev.map((issue) => {
          const idMatch = String(issue.id) === String(cleanId) || `CMP-${issue.id}` === String(complaintId);
          if (idMatch) {
            return {
              ...issue,
              grievance_id: trackingId,
              status: 'Officially Tracked',
            };
          }
          return issue;
        })
      );
    }
  };

  const handleUpvote = (complaintId) => {
    if (upvotedIds.includes(complaintId)) return;
    setUpvotedIds((prev) => [...prev, complaintId]);
    setDynamicUpvotes((prev) => ({
      ...prev,
      [complaintId]: (prev[complaintId] || 0) + 1,
    }));
  };

  const handleAddComment = (complaintId, commentObj) => {
    setDynamicComments((prev) => ({
      ...prev,
      [complaintId]: [...(prev[complaintId] || []), commentObj],
    }));
  };

  // Screen 1: Login
  if (currentScreen === 'login') {
    return <ModernLoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Modern SaaS Top Navigation Bar */}
      <HeaderNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Screen 2: HOME PAGE (Hero + Citywide Map + Evidence Feed) */}
        {currentScreen === 'home' && (
          <div className="space-y-10 pb-16">
            {/* Centered Hero Section */}
            <HeroSection
              onReportClick={() => setCurrentScreen('report-problem')}
              onExploreMapClick={() => {
                const mapEl = document.getElementById('city-map-section');
                if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
              }}
              totalIssuesCount={allComplaints.length}
            />

            {/* Citywide Map Section directly below Hero */}
            <section id="city-map-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Citywide Civic Map</h2>
                  <p className="text-xs text-slate-500">Live map plotting reported potholes, drainage overflow, and infrastructure issues across Mumbai from backend.</p>
                </div>
                <button
                  onClick={() => setCurrentScreen('map')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer self-start sm:self-auto"
                >
                  View full screen map →
                </button>
              </div>

              {/* Clean Single-Purpose Map with Live Status Pins */}
              <ModernMapVisualizer
                allWards={wardsList}
                dynamicComplaints={allComplaints}
                onOpenReportFlow={() => setCurrentScreen('report-problem')}
              />
            </section>

            {/* Recent Evidence Feed */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Recent Reported Issues</h2>
                  <p className="text-xs text-slate-500">Live citizen submissions and verified municipal issues across Mumbai.</p>
                </div>
                <button
                  onClick={() => handleNavigate('explore', 'ALL')}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Explore all issues →
                </button>
              </div>

              <ModernEvidenceFeed
                complaints={allComplaints}
                userLocation={userLocation}
                currentUser={currentUser}
                onUpvote={handleUpvote}
                upvotedIds={upvotedIds}
                onAddComment={handleAddComment}
              />
            </section>
          </div>
        )}

        {/* Screen 3: Full-Page Dedicated Map */}
        {currentScreen === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Live GIS Map</span>
                <h2 className="text-2xl font-bold text-slate-900">Mumbai Civic Map</h2>
                <p className="text-xs text-slate-500">Live map plotting issues across Mumbai. Click any pin to inspect details.</p>
              </div>
              <button
                onClick={() => setCurrentScreen('report-problem')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm cursor-pointer"
              >
                + Report an Issue
              </button>
            </div>

            <ModernMapVisualizer
              allWards={wardsList}
              dynamicComplaints={allComplaints}
              fullHeight={true}
              onOpenReportFlow={() => setCurrentScreen('report-problem')}
            />
          </div>
        )}

        {/* Screen 4: Two-Stage Report Flow (Async Real Backend Ingestion & Verification) */}
        {currentScreen === 'report-problem' && (
          <ModernReportFlow
            onStageReport={handleStageReport}
            onVerifyReport={handleVerifyReport}
            onNavigateHome={() => setCurrentScreen('home')}
          />
        )}

        {/* Screen 5: My Previous Reports (Live Backend Issues) */}
        {currentScreen === 'reports' && (
          <ModernMyReportsView
            reports={allComplaints}
            onUpdateGrievanceId={handleVerifyReport}
            onNavigateToReport={() => setCurrentScreen('report-problem')}
          />
        )}

        {/* Screen 6: Explore Issues Feed (Live Backend Data) */}
        {currentScreen === 'explore' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Public Evidence</span>
              <h2 className="text-2xl font-bold text-slate-900">Explore Citywide Issues</h2>
              <p className="text-xs text-slate-500">All live citizen submissions logged across Mumbai municipal wards.</p>
            </div>

            <ModernEvidenceFeed
              complaints={allComplaints}
              userLocation={userLocation}
              currentUser={currentUser}
              onUpvote={handleUpvote}
              upvotedIds={upvotedIds}
              onAddComment={handleAddComment}
              initialFilter={exploreFilter}
            />
          </div>
        )}

        {/* Screen 7: Functional Ward Details View (Grouped from Live Data) */}
        {currentScreen === 'ward-details' && (
          <WardDetailsView
            allComplaints={allComplaints}
            initialWardId="A"
          />
        )}

        {/* Screen 8: User Profile (Live Backend Issues) */}
        {currentScreen === 'profile' && (
          <ModernProfileView
            user={currentUser}
            submittedReports={allComplaints}
          />
        )}

        {/* Screen 9: About */}
        {currentScreen === 'about' && (
          <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-slate-700">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">About the Project</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                <span>Nagrik</span><span className="text-[#16a34a]">Setu</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">Citizens United for a Better Tomorrow</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-sm leading-relaxed">
              <p>
                <strong>NagrikSetu</strong> is a transparent citizen reporting and municipal accountability platform designed to bridge Mumbai citizens with the official <strong>MyBMC Assist</strong> helpline and track civic infrastructure resolutions in real time.
              </p>
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
                <span>Municipal Corporation of Greater Mumbai (MCGM) Citizen Engagement Portal</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Modern SaaS Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">Nagrik<span className="text-[#16a34a]">Setu</span></span>
            <span>•</span>
            <span>Citizens United for a Better Tomorrow</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button onClick={() => setCurrentScreen('home')} className="hover:text-blue-600 cursor-pointer">Home</button>
            <button onClick={() => setCurrentScreen('map')} className="hover:text-blue-600 cursor-pointer">Map</button>
            <button onClick={() => setCurrentScreen('explore')} className="hover:text-blue-600 cursor-pointer">Explore</button>
            <button onClick={() => setCurrentScreen('ward-details')} className="hover:text-blue-600 cursor-pointer">Ward Details</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
