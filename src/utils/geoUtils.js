// Default mock user location in Mumbai (Bandra West)
export const DEFAULT_USER_LOCATION = {
  latitude: 19.0600,
  longitude: 72.8340,
  locality: "Bandra West (Near Hill Road)",
  ward_id: "H/West",
};

/**
 * Calculates Great-Circle distance using Haversine formula
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats distance into a crisp utilitarian label
 */
export function formatDistance(distanceKm) {
  if (distanceKm === undefined || distanceKm === null || isNaN(distanceKm)) {
    return "0.1 km away";
  }
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters}m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Identifies closest ward to a given coordinate set or locality text
 */
export function findNearestWard(userLat, userLng, wardsList = [], localityText = '') {
  if (!wardsList || wardsList.length === 0) return null;

  // Text-based matching if locality string is provided
  if (localityText && typeof localityText === 'string') {
    const query = localityText.toLowerCase();
    const matchedWard = wardsList.find((w) => {
      const nameMatch = w.ward_name.toLowerCase().includes(query) || query.includes(w.ward_id.toLowerCase());
      const areaMatch = (w.areas_covered || []).some((a) => query.includes(a.toLowerCase()) || a.toLowerCase().includes(query));
      return nameMatch || areaMatch;
    });

    if (matchedWard) {
      return {
        ward: matchedWard,
        distanceKm: 0.5,
      };
    }
  }

  // Fallback to coordinates Haversine distance
  let nearestWard = wardsList[0];
  let minDistance = Infinity;

  wardsList.forEach((w) => {
    const coords = w.coordinates || { latitude: 19.0645, longitude: 72.8358 };
    const dist = calculateHaversineDistance(userLat, userLng, coords.latitude, coords.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearestWard = w;
    }
  });

  return {
    ward: nearestWard,
    distanceKm: minDistance,
  };
}

/**
 * Trigger browser Geolocation API
 */
export function getBrowserGeolocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        latitude: DEFAULT_USER_LOCATION.latitude,
        longitude: DEFAULT_USER_LOCATION.longitude,
        source: 'fallback',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          source: 'gps',
        });
      },
      () => {
        resolve({
          latitude: DEFAULT_USER_LOCATION.latitude,
          longitude: DEFAULT_USER_LOCATION.longitude,
          source: 'fallback_error',
        });
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  });
}
