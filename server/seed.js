const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'civicfix.db');
const db = new sqlite3.Database(dbPath);

const sampleReports = [
  {
    locality: "Colaba Causeway near Regal Cinema",
    ward: "A",
    category: "Broken Streetlight",
    description: "Non-functional streetlights creating dark zone along pedestrian sidewalk.",
    photo_url: "streetlight_colaba.jpg",
    status: "Officially Tracked",
    grievance_id: "MCGM-2026-51204",
    created_at: "2026-08-20 10:15:00"
  },
  {
    locality: "Walkeshwar Road near Banganga steps",
    ward: "D",
    category: "Water Leakage / Pipe Burst",
    description: "Underground main line valve leaking potable water onto carriageway.",
    photo_url: "water_leak_walkeshwar.jpg",
    status: "Officially Tracked",
    grievance_id: "MCGM-2026-38491",
    created_at: "2026-08-21 11:30:00"
  },
  {
    locality: "Dadar West near Sena Bhavan",
    ward: "G/North",
    category: "Pothole / Road Damage",
    description: "Dangerous pothole cluster near traffic junction.",
    photo_url: "dadar_pothole.jpg",
    status: "Officially Tracked",
    grievance_id: "MCGM-2026-88888",
    created_at: "2026-08-22 09:20:00"
  },
  {
    locality: "Senapati Bapat Marg, Lower Parel",
    ward: "G/South",
    category: "Drainage / Sewage Overflow",
    description: "Missing storm drain manhole cover creating hazard for pedestrians.",
    photo_url: "drain_lowerparel.jpg",
    status: "Pending BMC Verification",
    grievance_id: null,
    created_at: "2026-08-22 14:10:00"
  },
  {
    locality: "Linking Road near Waterfield Junction",
    ward: "H/West",
    category: "Pothole / Road Damage",
    description: "Deep asphalt depression ~15cm causing heavy vehicular slowdown.",
    photo_url: "linking_road_pothole.jpg",
    status: "Officially Tracked",
    grievance_id: "MCGM-2026-44120",
    created_at: "2026-08-23 08:45:00"
  },
  {
    locality: "Andheri-Kurla Road near Marol Naka Metro",
    ward: "K/East",
    category: "Pothole / Road Damage",
    description: "Asphalt crater with loose gravel under metro pillar 84.",
    photo_url: "marol_pothole.jpg",
    status: "Pending BMC Verification",
    grievance_id: null,
    created_at: "2026-08-23 12:05:00"
  },
  {
    locality: "Juhu Tara Road near Hotel Sea Princess",
    ward: "K/West",
    category: "Garbage Accumulation",
    description: "Overflowing community waste container spilling onto sidewalk.",
    photo_url: "juhu_garbage.jpg",
    status: "Officially Tracked",
    grievance_id: "MCGM-2026-72915",
    created_at: "2026-08-23 16:40:00"
  },
  {
    locality: "SV Road near Shimpoli Signal, Borivali West",
    ward: "R/Central",
    category: "Broken Streetlight",
    description: "Multiple sodium streetlights out along north-bound corridor.",
    photo_url: "borivali_light.jpg",
    status: "Pending BMC Verification",
    grievance_id: null,
    created_at: "2026-08-24 07:50:00"
  },
  {
    locality: "LBS Marg near Phoenix Marketcity, Kurla West",
    ward: "L",
    category: "Garbage Accumulation",
    description: "Unattended municipal dumper bin overflow blocking curb lane.",
    photo_url: "kurla_dump.jpg",
    status: "Officially Tracked",
    grievance_id: "MCGM-2026-61038",
    created_at: "2026-08-24 09:15:00"
  },
  {
    locality: "Central Avenue, Hiranandani Gardens, Powai",
    ward: "S",
    category: "Drainage / Sewage Overflow",
    description: "Clogged stormwater iron grating resulting in water stagnation.",
    photo_url: "powai_drain.jpg",
    status: "Pending BMC Verification",
    grievance_id: null,
    created_at: "2026-08-24 11:30:00"
  }
];

db.serialize(() => {
  console.log('Clearing old records from issues table...');
  db.run(`DELETE FROM issues`);
  db.run(`DELETE FROM sqlite_sequence WHERE name='issues'`);

  console.log('Seeding 10 fresh reports across Mumbai wards...');
  const stmt = db.prepare(`
    INSERT INTO issues (locality, ward, category, description, photo_url, status, grievance_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleReports.forEach((rep) => {
    stmt.run([
      rep.locality,
      rep.ward,
      rep.category,
      rep.description,
      rep.photo_url,
      rep.status,
      rep.grievance_id,
      rep.created_at
    ]);
  });

  stmt.finalize((err) => {
    if (err) {
      console.error('Error seeding issues:', err);
    } else {
      console.log('Successfully seeded 10 civic reports into civicfix.db!');
    }
    db.close();
  });
});
