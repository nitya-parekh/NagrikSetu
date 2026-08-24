import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function createStatusPinIcon(status = 'Reported') {
  let color = '#2563eb';
  let glow = 'rgba(37, 99, 235, 0.25)';

  if (status === 'Pending BMC Verification') {
    color = '#ca8a04';
    glow = 'rgba(202, 138, 4, 0.35)';
  } else if (status === 'Officially Tracked' || status === 'Resolved') {
    color = '#166534';
    glow = 'rgba(22, 101, 52, 0.35)';
  } else if (status === 'Overdue') {
    color = '#ea580c';
    glow = 'rgba(234, 88, 12, 0.35)';
  }

  return L.divIcon({
    className: 'modern-pin-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border: 2.5px solid #ffffff;
        box-shadow: 0 2px 8px ${glow};
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      ">
        •
      </div>
    `,
  });
}

const CATEGORY_FILTERS = [
  'All',
  'Pothole / Road Damage',
  'Drainage / Sewage Overflow',
  'Water Leakage / Pipe Burst',
];

export default function ModernMapVisualizer({
  allWards = [],
  dynamicComplaints = [],
  fullHeight = false,
  onOpenReportFlow,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredIncidents = dynamicComplaints.filter((inc) => {
    if (selectedCategory === 'All') return true;
    return inc.category === selectedCategory;
  });

  return (
    <div className="w-full space-y-4 font-sans">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-semibold text-slate-800">{filteredIncidents.length}</span> issues in Mumbai
        </div>
      </div>

      {/* Map Container */}
      <div className={`w-full ${fullHeight ? 'h-[75vh]' : 'h-[520px]'} bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative z-0`}>
        <MapContainer
          center={[19.0760, 72.8777]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Muted CartoDB Positron Basemap */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* Grievance Marker Pins */}
          {filteredIncidents.map((inc) => {
            const lat = Number(inc.latitude || 19.0645);
            const lng = Number(inc.longitude || 72.8358);
            const status = inc.status || 'Reported';

            return (
              <Marker
                key={inc.complaint_id}
                position={[lat, lng]}
                icon={createStatusPinIcon(status)}
              >
                <Popup>
                  <div className="p-1 space-y-2 max-w-[210px] font-sans">
                    {/* Photo Thumbnail if available */}
                    {inc.media && inc.media[0] && inc.media[0].previewUrl && (
                      <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        <img
                          src={inc.media[0].previewUrl}
                          alt="Grievance"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Category Title & Locality */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-snug">
                        {inc.category}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {inc.locality || inc.location}
                      </p>
                    </div>

                    {/* Status Pill & Date */}
                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold ${
                          status === 'Pending BMC Verification'
                            ? 'bg-amber-100 text-amber-800 border border-amber-400'
                            : status === 'Officially Tracked' || status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                            : status === 'Overdue'
                            ? 'bg-orange-100 text-orange-800 border border-orange-400'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {status}
                      </span>
                      <span className="text-slate-400">
                        {inc.date}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
