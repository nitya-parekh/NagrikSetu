import React, { useState } from 'react';
import { IconClose, IconCheckSharp, IconAlertSquare, IconPin, IconDocument } from '../utils/svgIcons';

const CATEGORIES = [
  'Pothole / Road Damage',
  'Garbage Accumulation',
  'Water Leakage / Pipe Burst',
  'Broken Streetlight',
  'Drainage / Sewage Overflow',
  'Other Civic Defect',
];

// Utilitarian SVG placeholder photos
const SAMPLE_PHOTOS = [
  { id: 'pothole', label: 'Road / Pothole Damage', desc: 'Asphalt surface depression with water ingress' },
  { id: 'drainage', label: 'Drainage / Manhole Defect', desc: 'Sewage conduit blockage and open manhole' },
  { id: 'garbage', label: 'Garbage Waste Mound', desc: 'Uncollected refuse obstructing pedestrian path' },
];

export default function ReportIssueFlow({
  isOpen,
  onClose,
  initialWardId = 'H/West',
  wardsList = [],
  onSubmitComplaint,
}) {
  const [step, setStep] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_PHOTOS[0].id);
  const [wardId, setWardId] = useState(initialWardId);
  const [locationName, setLocationName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [additionalNote, setAdditionalNote] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  if (!isOpen) return null;

  const currentWardObj = wardsList.find(w => w.ward_id === wardId) || wardsList[0] || {};

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (step === 2 && !locationName.trim()) {
      // Default location if left empty
      setLocationName(currentWardObj.locality ? currentWardObj.locality.split(',')[0] + ' Main Road' : 'Primary Sector Road');
    }
    setStep(prev => prev + 1);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const mockId = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalLocation = locationName.trim() || (currentWardObj.locality ? currentWardObj.locality.split(',')[0] : 'Main Arterial Road');
    
    const newComplaint = {
      complaint_id: mockId,
      date: '2026-08-21',
      location: finalLocation,
      latitude: currentWardObj.coordinates ? currentWardObj.coordinates.latitude : 19.0645,
      longitude: currentWardObj.coordinates ? currentWardObj.coordinates.longitude : 72.8358,
      category: selectedCategory,
      department: selectedCategory.includes('Road') || selectedCategory.includes('Pothole')
        ? 'Roads & Traffic'
        : selectedCategory.includes('Water') || selectedCategory.includes('Drainage')
        ? 'Storm Water Drains'
        : 'Solid Waste Management',
      status: 'Logged',
      resolution_date: null,
      duplicate_count: 1,
      linked_project_id: null,
      ward_id: wardId,
      notes: additionalNote,
      photoType: selectedPhoto,
    };

    onSubmitComplaint(newComplaint);
    setSubmittedData(newComplaint);
    setStep(4); // Confirmation state
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSubmittedData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-border-heavy/80">
      <div className="bg-panel border-4 border-border-heavy w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-panel-sub border-b-2 border-border-heavy p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-border-heavy text-panel text-[10px] font-mono px-2 py-0.5 font-bold">
              CITIZEN GRIEVANCE LOG
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-ink-primary">
              Report an Issue
            </span>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-6 h-6 bg-border-heavy text-panel flex items-center justify-center font-bold hover:bg-ink-secondary cursor-pointer"
            title="Cancel"
          >
            <IconClose className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Progress Tracker (Utilitarian 3-Step) */}
        {step <= 3 && (
          <div className="bg-panel-recessed border-b border-border-hard p-2 grid grid-cols-3 gap-1 text-center font-mono text-[10px] font-bold">
            <div className={`p-1 border ${step === 1 ? 'bg-border-heavy text-panel border-border-heavy' : 'bg-panel text-ink-secondary border-border-hard'}`}>
              [1] PHOTO
            </div>
            <div className={`p-1 border ${step === 2 ? 'bg-border-heavy text-panel border-border-heavy' : 'bg-panel text-ink-secondary border-border-hard'}`}>
              [2] LOCATION
            </div>
            <div className={`p-1 border ${step === 3 ? 'bg-border-heavy text-panel border-border-heavy' : 'bg-panel text-ink-secondary border-border-hard'}`}>
              [3] CATEGORY
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: Photo Evidence */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-ink-muted uppercase">
                  STEP 1 OF 3
                </span>
                <h3 className="text-base font-bold uppercase tracking-tight text-ink-primary">
                  Provide Photographic Evidence
                </h3>
                <p className="text-xs text-ink-secondary">
                  Select evidence sample or verify visual documentation for municipal audit routing.
                </p>
              </div>

              {/* Sample Photo Pickers */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-ink-muted uppercase block">
                  SELECT EVIDENCE CLASSIFICATION:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {SAMPLE_PHOTOS.map((photo) => (
                    <button
                      type="button"
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo.id)}
                      className={`p-3 text-left border-2 cursor-pointer flex items-center justify-between ${
                        selectedPhoto === photo.id
                          ? 'bg-panel-sub border-border-heavy'
                          : 'bg-panel border-border-hard hover:bg-panel-sub'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-ink-primary font-mono uppercase">
                          {photo.label}
                        </div>
                        <div className="text-[11px] text-ink-secondary">
                          {photo.desc}
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
                        selectedPhoto === photo.id
                          ? 'bg-border-heavy text-panel border-border-heavy'
                          : 'bg-panel text-ink-muted border-border-hard'
                      }`}>
                        {selectedPhoto === photo.id ? '[SELECTED]' : '[SELECT]'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Status Confirmation */}
              <div className="bg-stark-green-bg border border-stark-green p-2 text-xs font-mono text-stark-green-text flex items-center gap-1.5">
                <IconCheckSharp className="w-4 h-4 text-stark-green" />
                <span>EVIDENCE PHOTO ATTACHED & TIMESTAMPED</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-border-heavy text-panel hover:bg-ink-secondary py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  [CONTINUE TO LOCATION]
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Ward Confirmation */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-ink-muted uppercase">
                  STEP 2 OF 3
                </span>
                <h3 className="text-base font-bold uppercase tracking-tight text-ink-primary">
                  Confirm Ward & Street Location
                </h3>
                <p className="text-xs text-ink-secondary">
                  Specify the municipal jurisdiction and exact street for ground inspection teams.
                </p>
              </div>

              {/* Ward Selector Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-ink-muted uppercase block">
                  MUNICIPAL WARD:
                </label>
                <select
                  value={wardId}
                  onChange={(e) => setWardId(e.target.value)}
                  className="w-full bg-panel-sub border-2 border-border-hard p-2 text-xs font-mono text-ink-primary focus:border-border-heavy focus:outline-none cursor-pointer"
                >
                  {wardsList.map((w) => (
                    <option key={w.ward_id} value={w.ward_id}>
                      Ward {w.ward_id} - {w.ward_name} ({w.locality})
                    </option>
                  ))}
                </select>
              </div>

              {/* Specific Street Location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-ink-muted uppercase block">
                  STREET / CORRIDOR / LANDMARK:
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder={`e.g. ${currentWardObj.locality ? currentWardObj.locality.split(',')[0] + ' Main Road' : 'Linking Road'}`}
                  className="w-full bg-panel-sub border-2 border-border-hard p-2.5 text-xs font-mono text-ink-primary focus:border-border-heavy focus:outline-none"
                />
              </div>

              <div className="bg-panel-recessed border border-border-hard p-2 text-[11px] font-mono text-ink-secondary">
                GPS CADASTRE: {currentWardObj.coordinates ? currentWardObj.coordinates.latitude : '19.0645'}° N, {currentWardObj.coordinates ? currentWardObj.coordinates.longitude : '72.8358'}° E
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-panel-sub border border-border-hard text-ink-secondary hover:bg-panel-recessed py-2.5 text-xs font-bold uppercase cursor-pointer"
                >
                  [BACK]
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-2/3 bg-border-heavy text-panel hover:bg-ink-secondary py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  [CONTINUE TO CATEGORY]
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Category & Final Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-ink-muted uppercase">
                  STEP 3 OF 3
                </span>
                <h3 className="text-base font-bold uppercase tracking-tight text-ink-primary">
                  Select Issue Classification
                </h3>
                <p className="text-xs text-ink-secondary">
                  Categorize the civic defect for departmental allocation and contractor accountability.
                </p>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-2.5 text-left border-2 cursor-pointer font-mono text-xs ${
                      selectedCategory === cat
                        ? 'bg-border-heavy text-panel border-border-heavy font-bold'
                        : 'bg-panel border-border-hard hover:bg-panel-sub text-ink-primary'
                    }`}
                  >
                    <span className="block">{cat}</span>
                  </button>
                ))}
              </div>

              {/* Optional Note */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-mono font-bold text-ink-muted uppercase block">
                  ADDITIONAL DETAILS (OPTIONAL):
                </label>
                <input
                  type="text"
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                  placeholder="e.g. Hazardous depth, recurring water pooling, pedestrian blockage"
                  className="w-full bg-panel-sub border-2 border-border-hard p-2 text-xs font-mono text-ink-primary focus:border-border-heavy focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-panel-sub border border-border-hard text-ink-secondary hover:bg-panel-recessed py-2.5 text-xs font-bold uppercase cursor-pointer"
                >
                  [BACK]
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="w-2/3 bg-stark-orange text-panel hover:bg-stark-orange-dark py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  [SUBMIT CITIZEN REPORT]
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation State */}
          {step === 4 && submittedData && (
            <div className="space-y-4 text-center py-2">
              <div className="bg-stark-green-bg border-2 border-stark-green p-4 space-y-2">
                <div className="text-xs font-bold font-mono uppercase text-stark-green-text tracking-wider">
                  [!] REPORT OFFICIALLY LOGGED
                </div>
                <div className="text-2xl font-bold font-mono text-ink-primary">
                  {submittedData.complaint_id}
                </div>
                <p className="text-xs text-stark-green-text font-mono">
                  Grievance recorded in MCGM Ward {submittedData.ward_id} audit queue.
                </p>
              </div>

              {/* Summary Audit Box */}
              <div className="bg-panel-sub border-2 border-border-hard p-3 text-left font-mono text-xs space-y-1.5">
                <div className="flex justify-between border-b border-border-hard pb-1">
                  <span className="text-ink-muted">WARD:</span>
                  <span className="font-bold text-ink-primary">Ward {submittedData.ward_id}</span>
                </div>
                <div className="flex justify-between border-b border-border-hard pb-1">
                  <span className="text-ink-muted">LOCATION:</span>
                  <span className="font-bold text-ink-primary">{submittedData.location}</span>
                </div>
                <div className="flex justify-between border-b border-border-hard pb-1">
                  <span className="text-ink-muted">CATEGORY:</span>
                  <span className="font-bold text-ink-primary">{submittedData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">AUDIT STATUS:</span>
                  <span className="bg-stark-orange-bg text-stark-orange-text px-1 font-bold">
                    [LOGGED / ROUTED]
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full bg-border-heavy text-panel hover:bg-ink-secondary py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  [VIEW IN WARD SCORECARD]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
