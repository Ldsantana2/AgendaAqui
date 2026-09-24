/**
 * Utility functions for location-related operations
 */

/**
 * Format a distance value with the appropriate unit
 * @param distance Distance in kilometers
 * @returns Formatted distance string (e.g., "2.5 km" or "50 m" for small distances)
 */
export function formatDistance(distance: number): string {
  console.log('Formatting distance:', distance);

  // For undefined distance, provide a meaningful message
  if (distance === undefined) {
    console.log('Distance is undefined');
    return "Distância não disponível";
  }

  // Special value (-1) indicates calculation in progress
  if (distance === -1) {
    console.log('Distance calculation in progress');
    return "Calculando...";
  }

  // For zero distance, check if it's because coordinates are identical or missing
  if (distance === 0) {
    console.log('Distance is zero');
    return "Mesmo local";
  }

  // For very small distances, show in meters instead of kilometers
  if (distance < 0.1) {
    // Convert kilometers to meters (1 km = 1000 m)
    const distanceInMeters = Math.round(distance * 1000);
    console.log('Distance is very small, converting to meters:', distanceInMeters);
    return `${distanceInMeters} m`;
  }

  console.log('Returning formatted distance:', `${distance} km`);
  return `${distance} km`;
}

/**
 * Get the user's current location using the browser's Geolocation API
 * @returns Promise that resolves to an object containing latitude and longitude
 */
export function getUserLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser');
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('User location obtained:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.log('Error getting user location:', error.message);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}
