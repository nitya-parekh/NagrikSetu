import wardsDirectory from './wardsDirectory.json';

/**
 * Returns full list of all 24 official BMC Mumbai wards.
 */
export function getAllWardsList() {
  return wardsDirectory || [];
}

/**
 * Returns wards grouped by region (City, Western Suburbs, Eastern Suburbs).
 */
export function getWardsByRegion() {
  const wards = getAllWardsList();
  const grouped = {
    'City': [],
    'Western Suburbs': [],
    'Eastern Suburbs': [],
  };

  wards.forEach((w) => {
    if (grouped[w.region]) {
      grouped[w.region].push(w);
    } else {
      grouped['City'].push(w);
    }
  });

  return grouped;
}

/**
 * Returns detailed data for a specific ward.
 */
export function getWardById(wardId) {
  const wards = getAllWardsList();
  return wards.find((w) => w.ward_id.toLowerCase() === (wardId || '').toLowerCase()) || wards[0];
}

/**
 * Normalizes a backend SQLite issue into the complaint format expected by map & UI cards.
 */
export function normalizeBackendIssue(issue, wardsList = getAllWardsList(), dynamicUpvotes = {}, dynamicComments = {}) {
  const matchedWard = wardsList.find(
    (w) => w.ward_id.toLowerCase() === (issue.ward || '').toLowerCase()
  );

  const coords = matchedWard?.coordinates || { latitude: 19.0760, longitude: 72.8777 };
  const issueKey = `CMP-${issue.id}`;
  const extraUpvotes = dynamicUpvotes[issueKey] || dynamicUpvotes[issue.id] || 0;
  const extraComments = dynamicComments[issueKey] || dynamicComments[issue.id] || [];

  return {
    id: issue.id,
    complaint_id: `CMP-${issue.id}`,
    locality: issue.locality,
    location: issue.locality,
    ward_id: issue.ward || 'H/West',
    category: issue.category,
    description: issue.description || `Civic defect reported at ${issue.locality}`,
    photo_url: issue.photo_url,
    media: issue.photo_url
      ? [
          {
            id: `m-${issue.id}`,
            type: 'image',
            title: 'Evidence Photo',
            previewUrl: issue.photo_url,
          },
        ]
      : [],
    status: issue.status || 'Pending BMC Verification',
    grievance_id: issue.grievance_id,
    grievance_tracking_id: issue.grievance_id,
    date: issue.created_at ? issue.created_at.split(' ')[0] : '2026-08-22',
    latitude: coords.latitude,
    longitude: coords.longitude,
    duplicate_count: 1,
    upvotes: 1 + extraUpvotes,
    citizen_comments: extraComments,
    comments: extraComments,
  };
}
