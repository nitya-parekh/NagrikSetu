import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { calculateHaversineDistance, formatDistance } from '../utils/geoUtils';

function createIssueDivIcon(label = "!") {
  return L.divIcon({
    className: 'brutalist-issue-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: #ea580c;
        border: 2px solid #1e293b;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #edf0f4;
        font-family: Consolas, monospace;
        font-size: 11px;
        font-weight: bold;
        box-shadow: none;
        border-radius: 0px;
        cursor: pointer;
      ">
        ${label}
      </div>
    `,
  });
}

function createUserDivIcon() {
  return L.divIcon({
    className: 'brutalist-user-marker',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
    html: `
      <div style="
        width: 26px;
        height: 26px;
        background: #166534;
        border: 2px solid #edf0f4;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #edf0f4;
        font-family: Consolas, monospace;
        font-size: 9px;
        font-weight: bold;
        box-shadow: none;
        border-radius: 0px;
      ">
        YOU
      </div>
    `,
  });
}

export default function MapHomeScreen({
  allWards = [],
  dynamicComplaints = [],
  userLocation,
  onNavigateToReport,
  onOpenWardScorecard,
}) {
  const userLat = userLocation?.latitude || 19.0600;
  const userLng = userLocation?.longitude || 72.8340;

  // Aggregate all complaints across all wards plus dynamic ones
  const allIncidents = [];
  allWards.forEach((ward) => {
    (ward.rawComplaints || []).forEach((c) => {
      allIncidents.push({
        ...c,
        ward_id: ward.ward_id,
        ward_name: ward.ward_name,
      });
    });
  });
  dynamicComplaints.forEach((dc) => {
    allIncidents.push(dc);
  });

  return (
    <div className="relative w-full h-[calc(100vh-50px)] mt-[50px] bg-canvas flex flex-col font-mono">
      {/* Real Full-Width Leaflet Map (Dominates Viewport) */}
      <div className="flex-1 w-full h-full relative z-0">
        <MapContainer
          center={[19.0760, 72.8777]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Muted CartoDB Positron Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* User Location Marker */}
          <Marker position={[userLat, userLng]} icon={createUserDivIcon()}>
            <Popup>
              <div className="p-1 font-mono space-y-1">
                <div className="font-bold text-stark-green-text">[YOUR LOCATION]</div>
                <div className="text-[10px] text-ink-secondary">{userLocation?.locality || "Bandra West"}</div>
                <div className="text-[9px] text-ink-muted">{userLat.toFixed(4)}° N, {userLng.toFixed(4)}° E</div>
              </div>
            </Popup>
          </Marker>

          {/* Citywide Issue Markers */}
          {allIncidents.map((inc) => {
            const lat = Number(inc.latitude || 19.0645);
            const lng = Number(inc.longitude || 72.8358);
            const dist = calculateHaversineDistance(userLat, userLng, lat, lng);

            return (
              <Marker
                key={inc.complaint_id}
                position={[lat, lng]}
                icon={createIssueDivIcon("!")}
              >
                <Popup>
                  <div className="p-1.5 font-mono space-y-1.5 min-w-[200px]">
                    <div className="flex justify-between items-center border-b border-border-hard pb-1">
                      <span className="font-bold text-stark-orange">#{inc.complaint_id}</span>
                      <span className="text-[9px] font-bold text-stark-orange">
                        [{inc.status ? inc.status.toUpperCase() : "REPORTED"}]
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-ink-primary block text-xs font-sans">
                        {inc.category}
                      </span>
                      <span className="text-[10px] text-ink-secondary block">
                        {inc.location}
                      </span>
                    </div>

                    <div className="text-[10px] text-ink-muted flex justify-between border-t border-border-hard pt-1">
                      <span>Proximity: {formatDistance(dist)}</span>
                      <span>{inc.duplicate_count || 1} Duplicates</span>
                    </div>

                    {inc.ward_id && (
                      <button
                        type="button"
                        onClick={() => onOpenWardScorecard && onOpenWardScorecard(inc.ward_id)}
                        className="w-full bg-border-heavy text-panel py-1 text-[10px] font-bold uppercase mt-1 cursor-pointer"
                      >
                        [Open Ward {inc.ward_id} Scorecard →]
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Minimal Bottom Overlay Bar with Single Primary CTA */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] w-[90%] max-w-md bg-panel border-2 border-border-heavy p-3 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-ink-primary block">
              {allIncidents.length} Active Civic Issues in Mumbai
            </span>
            <span className="text-[10px] text-ink-muted">
              Tap markers to inspect or log an issue
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateToReport}
            className="bg-stark-orange hover:bg-stark-orange-dark text-panel px-3.5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap"
          >
            + Report Problem
          </button>
        </div>
      </div>
    </div>
  );
}
