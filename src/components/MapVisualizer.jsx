import React, { useState } from 'react';
import { IconCrosshair, IconLayers } from '../utils/svgIcons';

export default function MapVisualizer({ ward, complaints, projects }) {
  const [activeLayer, setActiveLayer] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);

  const primaryComplaint = complaints[0] || {
    complaint_id: "CMP-NEW",
    latitude: ward.coordinates ? ward.coordinates.latitude : 19.0645,
    longitude: ward.coordinates ? ward.coordinates.longitude : 72.8358,
    location: ward.locality ? ward.locality.split(',')[0] : "Main Arterial Road",
    category: "Infrastructure Defect",
    duplicate_count: 1,
    status: "Active"
  };

  const centerLat = Number(primaryComplaint.latitude || (ward.coordinates && ward.coordinates.latitude) || 19.0645);
  const centerLng = Number(primaryComplaint.longitude || (ward.coordinates && ward.coordinates.longitude) || 72.8358);
  const primaryProject = projects[0] || null;

  return (
    <div className="bg-panel border-2 border-border-heavy flex flex-col h-full">
      {/* Map Control Header */}
      <div className="bg-panel-sub border-b-2 border-border-heavy p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconCrosshair className="w-4 h-4 text-stark-orange" />
          <span className="text-xs font-bold uppercase tracking-wider text-ink-primary">
            GIS CADASTRAL MAP : WARD {ward.ward_id || "H/WEST"}
          </span>
        </div>

        {/* Center Coordinate Readout */}
        <div className="bg-border-heavy text-panel font-mono text-[11px] px-2 py-0.5 font-bold">
          LAT {centerLat.toFixed(4)}° N / LNG {centerLng.toFixed(4)}° E
        </div>
      </div>

      {/* Layer Toggles & Zoom Controls */}
      <div className="bg-panel-recessed border-b border-border-hard px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-ink-muted uppercase mr-1">LAYERS:</span>
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-2 py-0.5 text-[10px] font-bold border cursor-pointer ${
              activeLayer === 'all'
                ? 'bg-border-heavy text-panel border-border-heavy'
                : 'bg-panel text-ink-primary border-border-hard hover:bg-panel-sub'
            }`}
          >
            ALL LAYERS
          </button>
          <button
            onClick={() => setActiveLayer('roads')}
            className={`px-2 py-0.5 text-[10px] font-bold border cursor-pointer ${
              activeLayer === 'roads'
                ? 'bg-border-heavy text-panel border-border-heavy'
                : 'bg-panel text-ink-primary border-border-hard hover:bg-panel-sub'
            }`}
          >
            ROADS ONLY
          </button>
          <button
            onClick={() => setActiveLayer('hotspots')}
            className={`px-2 py-0.5 text-[10px] font-bold border cursor-pointer ${
              activeLayer === 'hotspots'
                ? 'bg-border-heavy text-panel border-border-heavy'
                : 'bg-panel text-ink-primary border-border-hard hover:bg-panel-sub'
            }`}
          >
            GRIEVANCES ({complaints.length})
          </button>
        </div>

        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 1.75))}
            className="w-6 h-6 bg-panel border border-border-hard flex items-center justify-center font-bold hover:bg-panel-sub cursor-pointer"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
            className="w-6 h-6 bg-panel border border-border-hard flex items-center justify-center font-bold hover:bg-panel-sub cursor-pointer"
            title="Zoom out"
          >
            -
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-1.5 h-6 bg-panel border border-border-hard flex items-center justify-center text-[10px] font-bold hover:bg-panel-sub cursor-pointer"
            title="Reset Zoom"
          >
            100%
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative flex-1 min-h-[360px] bg-[#d5dae2] overflow-hidden select-none border-b border-border-hard">
        <svg
          className="w-full h-full absolute inset-0"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          viewBox="0 0 600 400"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Tactical Grid Pattern */}
          <defs>
            <pattern id={`cadastral-grid-${ward.ward_id}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#d8dde5" />
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#b8c0cc" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#cadastral-grid-${ward.ward_id})`} />

          {/* Coordinate Reference Axes */}
          <line x1="0" y1="200" x2="600" y2="200" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="300" y1="0" x2="300" y2="400" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />

          {/* Ward Boundary Polygon */}
          <polygon
            points="50,40 550,35 565,365 45,365"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <text x="65" y="60" fill="#64748b" fontSize="10" fontFamily="Consolas" fontWeight="bold">
            [MCGM JURISDICTION : WARD {ward.ward_id} - {ward.ward_name ? ward.ward_name.toUpperCase() : "MUMBAI"}]
          </text>

          {/* Arterial Road Vectors */}
          {(activeLayer === 'all' || activeLayer === 'roads') && (
            <g>
              <path d="M 140,20 L 150,385" stroke="#94a3b8" strokeWidth="6" fill="none" />
              <path d="M 50,140 L 550,155" stroke="#94a3b8" strokeWidth="5" fill="none" />
              <path d="M 70,300 L 530,290" stroke="#94a3b8" strokeWidth="5" fill="none" />

              {/* Main Corridor for this ward */}
              <path
                d="M 300,20 L 300,380"
                stroke="#ea580c"
                strokeWidth="7"
                fill="none"
                strokeDasharray="10 4"
              />
              <rect x="210" y="215" width="180" height="18" fill="#1e293b" />
              <text x="300" y="228" fill="#ffedd5" fontSize="9" fontFamily="Consolas" fontWeight="bold" textAnchor="middle">
                {primaryComplaint.location ? primaryComplaint.location.toUpperCase() : "AUDIT CORRIDOR"}
              </text>
            </g>
          )}

          {/* Citizen Grievance Hotspot Marker */}
          {(activeLayer === 'all' || activeLayer === 'hotspots') && complaints.length > 0 && (
            <g transform="translate(300, 200)">
              {/* Radar target crosshair */}
              <circle cx="0" cy="0" r="30" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="0" cy="0" r="16" fill="none" stroke="#c2410c" strokeWidth="2" />
              <line x1="-34" y1="0" x2="34" y2="0" stroke="#c2410c" strokeWidth="1.5" />
              <line x1="0" y1="-34" x2="0" y2="34" stroke="#c2410c" strokeWidth="1.5" />
              <rect x="-5" y="-5" width="10" height="10" fill="#ea580c" stroke="#1e293b" strokeWidth="2" />

              {/* Tactical Callout Box */}
              <g transform="translate(20, -50)">
                <rect x="0" y="0" width="200" height="48" fill="#1e293b" stroke="#ea580c" strokeWidth="2" />
                <text x="8" y="16" fill="#fef08a" fontSize="10" fontFamily="Consolas" fontWeight="bold">
                  [!] #{primaryComplaint.complaint_id}
                </text>
                <text x="8" y="28" fill="#edf0f4" fontSize="9" fontFamily="Consolas">
                  {primaryComplaint.category ? primaryComplaint.category.toUpperCase() : "GRIEVANCE"}
                </text>
                <text x="8" y="40" fill="#fed7aa" fontSize="9" fontFamily="Consolas" fontWeight="bold">
                  {primaryComplaint.duplicate_count || 1} DUPLICATES | {primaryComplaint.status ? primaryComplaint.status.toUpperCase() : "LOGGED"}
                </text>
              </g>
            </g>
          )}

          {/* Compass Rose */}
          <g transform="translate(545, 60)">
            <rect x="-18" y="-18" width="36" height="36" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="0" y="-4" fill="#fef08a" fontSize="10" fontFamily="Consolas" fontWeight="bold" textAnchor="middle">
              N
            </text>
            <line x1="0" y1="-14" x2="0" y2="14" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="-14" y1="0" x2="14" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
            <polygon points="0,-14 -3,-3 3,-3" fill="#ea580c" />
          </g>
        </svg>

        {/* Telemetry HUD Box */}
        <div className="absolute bottom-2 left-2 bg-border-heavy text-panel p-2 max-w-[260px] text-[10px] space-y-0.5 border border-panel font-mono">
          <div className="flex justify-between border-b border-border-hard pb-0.5">
            <span className="text-stark-yellow-bright font-bold">GIS POSITION AUDIT</span>
            <span>WARD {ward.ward_id}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[9px] pt-0.5">
            <div>
              <span className="text-ink-muted block">LATITUDE:</span>
              <span className="text-panel font-bold">{centerLat.toFixed(4)}° N</span>
            </div>
            <div>
              <span className="text-ink-muted block">LONGITUDE:</span>
              <span className="text-panel font-bold">{centerLng.toFixed(4)}° E</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 bg-panel border border-border-hard px-2 py-0.5 text-[9px] font-mono font-bold text-ink-primary">
          SCALE: [ |== 250m ==| ]
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-panel p-2.5 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-ink-primary text-[10px] uppercase">
            GEOLOCATION INCIDENT MATRIX
          </span>
          <span className="bg-stark-green-bg text-stark-green-text border border-stark-green px-1.5 py-0.2 text-[9px] font-bold">
            COORDINATES VERIFIED
          </span>
        </div>
        <p className="text-ink-secondary text-[11px] leading-snug">
          {primaryProject ? (
            <>
              Incident reports correspond directly with work perimeter for <strong className="text-ink-primary">{primaryProject.project_name} ({primaryProject.project_id})</strong>.
            </>
          ) : (
            <>
              Grievance reports mapped to municipal road and infrastructure grid in <strong className="text-ink-primary">{ward.ward_name}</strong>.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
