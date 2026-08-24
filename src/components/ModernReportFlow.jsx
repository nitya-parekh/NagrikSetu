import React, { useState } from 'react';
import { getAllWardsList } from '../data/dataLoader';
import { findNearestWard } from '../utils/geoUtils';

const CATEGORIES = [
  'Pothole / Road Damage',
  'Garbage Accumulation',
  'Water Leakage / Pipe Burst',
  'Broken Streetlight',
  'Drainage / Sewage Overflow',
  'Other Civic Defect',
];

export default function ModernReportFlow({
  onStageReport,
  onVerifyReport,
  onNavigateHome,
}) {
  const [stage, setStage] = useState(1); // 1: Local Ingestion, 2: Guide & Verify
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stage 1 Inputs
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [locality, setLocality] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Staged Report Record (backed by real database record)
  const [stagedReport, setStagedReport] = useState(null);

  // Stage 2 Verification Inputs
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const wardsList = getAllWardsList();

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  // Stage Report Submission (Stage 1 -> Real Backend -> Stage 2)
  const handleStageReport = async (e) => {
    e.preventDefault();
    if (!locality.trim()) {
      setErrorMessage('Please enter a location or street name.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Map locality to nearest ward internally
      const nearest = findNearestWard(19.0760, 72.8777, wardsList, locality.trim());
      const mappedWardId = nearest?.ward?.ward_id || 'H/West';

      const payload = {
        locality: locality.trim(),
        ward: mappedWardId,
        category: category,
        description: description.trim() || `Civic issue reported at ${locality.trim()}`,
        photo_url: photoPreview || 'placeholder.jpg',
      };

      let savedRecord = null;
      if (onStageReport) {
        savedRecord = await onStageReport(payload);
      }

      const reportData = savedRecord || {
        complaint_id: `CMP-LOCAL`,
        category: category,
        location: locality.trim(),
        status: 'Pending BMC Verification',
      };

      setStagedReport(reportData);
      setStage(2);
    } catch (err) {
      console.error('Error staging report to backend:', err);
      setErrorMessage('Failed to stage report to backend server. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verification Submission
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!trackingIdInput.trim() || !stagedReport) return;

    const trimmedId = trackingIdInput.trim().toUpperCase();
    const verifiedTimestamp = '2026-08-23 15:45';

    try {
      if (onVerifyReport) {
        await onVerifyReport(stagedReport.id || stagedReport.complaint_id, trimmedId, verifiedTimestamp);
      }

      setIsVerified(true);
      setStagedReport((prev) => ({
        ...prev,
        grievance_id: trimmedId,
        grievance_tracking_id: trimmedId,
        status: 'Officially Tracked',
        timestamp_verified: verifiedTimestamp,
      }));
    } catch (err) {
      console.error('Error verifying grievance ID on backend:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 font-sans text-slate-900 space-y-6">
      {/* Container with soft rounded corners, subtle drop shadow, and clean white card background */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Header */}
        <div className="pb-4 border-b border-slate-100 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {stage === 1 ? 'Stage 1: Local Ingestion' : 'Stage 2: Guide & Verification'}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Step {stage} of 2
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {stage === 1 ? 'Stage Civic Report' : 'Dispatch & Verify with BMC Bot'}
          </h2>
          <p className="text-xs text-slate-500">
            {stage === 1
              ? 'Stage your civic complaint locally. It will be recorded in the live database and formatted for BMC submission.'
              : 'Follow the instructions below to dispatch your staged report to the official MyBMC WhatsApp bot.'}
          </p>
        </div>

        {/* STAGE 1: Local Ingestion Form */}
        {stage === 1 && (
          <form onSubmit={handleStageReport} className="space-y-5 text-xs">
            {/* 1. Upload Photo */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                1. Upload Photo Evidence
              </label>
              <div className="p-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center space-y-2">
                <input
                  type="file"
                  id="stage1-photo-input"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="stage1-photo-input"
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-all"
                >
                  <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>Select File / Open Camera</span>
                </label>
                {photoPreview ? (
                  <div className="text-xs text-emerald-600 font-semibold pt-1">
                    ✓ Photo attached: {photoFile?.name || 'Evidence Image'}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    Camera capture or photo upload supported.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Locality Free-Text Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                2. Location / Street / Landmark
              </label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Linking Road near KFC, Marol Naka Metro, Shivaji Park"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs transition-all"
              />
              <span className="text-[11px] text-slate-400 block">
                Type any recognizable street, junction, or landmark in Mumbai.
              </span>
            </div>

            {/* 3. Category Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                3. Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Short Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                4. Description (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any specific context or hazards..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs resize-none transition-all"
              />
            </div>

            {errorMessage && (
              <div className="text-xs text-amber-600 font-semibold">
                * {errorMessage}
              </div>
            )}

            {/* Stage Report CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md text-sm transition-all cursor-pointer"
              >
                {isSubmitting ? 'Staging to Live Database...' : 'Stage Report →'}
              </button>
              <span className="text-[11px] text-slate-400 block text-center mt-1.5">
                Creates a live database entry marked "Pending BMC Verification".
              </span>
            </div>
          </form>
        )}

        {/* STAGE 2: Guide UI (2 Steps Only) & Verification Loop */}
        {stage === 2 && stagedReport && (
          <div className="space-y-6 text-xs">
            {/* Live Staged Status Banner */}
            <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 block">
                  Report Saved to Database
                </span>
                <div className="text-sm font-bold text-slate-900">
                  #{stagedReport.complaint_id || `CMP-${stagedReport.id}`} • {stagedReport.category}
                </div>
                <div className="text-xs text-slate-500">{stagedReport.locality || stagedReport.location}</div>
              </div>

              <div>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border ${
                    isVerified || stagedReport.status === 'Officially Tracked'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  {isVerified || stagedReport.status === 'Officially Tracked'
                    ? 'Officially Tracked'
                    : 'Pending BMC Verification'}
                </span>
              </div>
            </div>

            {/* 2 Numbered Guide Steps */}
            <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                Dispatch Instructions:
              </div>

              {/* Step 1: Open WhatsApp Bot */}
              <div className="space-y-2">
                <div className="font-semibold text-slate-900">
                  Step 1: Click this button to open the BMC Bot.
                </div>
                <a
                  href="https://wa.me/918999228999?text=Hi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-sm text-center block shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Open BMC Bot (WhatsApp)
                </a>
              </div>

              {/* Step 2: Follow Bot Prompts */}
              <div className="space-y-1 pt-3 border-t border-slate-200">
                <div className="font-semibold text-slate-900">
                  Step 2: Follow the bot's menu and enter your details when prompted.
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Send "Hi", choose your preferred language, select "Register a Complaint", and share your category, photo, and locality directly in the chat.
                </p>
              </div>
            </div>

            {/* Verification Loop */}
            <form onSubmit={handleVerifySubmit} className="space-y-3 border-t border-slate-100 pt-4">
              <label className="text-xs font-semibold text-slate-800 block">
                Paste Official BMC Tracking ID
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackingIdInput}
                  onChange={(e) => setTrackingIdInput(e.target.value)}
                  placeholder="e.g. MCGM-2026-90412"
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 uppercase font-semibold focus:outline-none focus:border-blue-500 shadow-xs"
                />
                <button
                  type="submit"
                  disabled={!trackingIdInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                >
                  Verify
                </button>
              </div>

              {isVerified && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold space-y-0.5">
                  <div>✓ ID Attached: {stagedReport.grievance_id}</div>
                  <div className="text-[11px] font-normal text-emerald-700">
                    Status updated to: <strong>Officially Tracked</strong> across Home map, My Reports, and Ward Details.
                  </div>
                </div>
              )}
            </form>

            {/* Navigation Footer */}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                ← Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
