interface Coords {
    lat: number;
    lng: number;
}

export interface GeocodeResult {
    coords: Coords | null;
    errorStatus: string | null;
}

const geocodeCache = new Map<string, GeocodeResult>();

const GOOGLE_MAPS_API_KEY = "AIzaSyArmLqdBGYQv8l2N8Ya3jte42dUfK829OI";

export async function getCoordsForAddress(address: string): Promise<GeocodeResult> {
    if (geocodeCache.has(address)) {
        return geocodeCache.get(address)!;
    }

    if (!GOOGLE_MAPS_API_KEY) {
        console.error("API key is not configured for geocoding.");
        return { coords: null, errorStatus: 'NO_API_KEY' };
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results[0]) {
            const location = data.results[0].geometry.location; // { lat, lng }
            const result: GeocodeResult = { coords: location, errorStatus: null };
            geocodeCache.set(address, result);
            return result;
        } else {
            let errorMsg = `Geocoding failed for address "${address}": ${data.status}.`;
            if (data.status === 'REQUEST_DENIED') {
                errorMsg += ' This often indicates an issue with the API key (invalid, expired, or incorrect API permissions for the Geocoding API).';
            }
            if (data.error_message) {
                errorMsg += ` Google's error: "${data.error_message}"`;
            }
            console.error(errorMsg);
            const result: GeocodeResult = { coords: null, errorStatus: data.status };
            // Only cache "not found" errors, not permission errors
            if (data.status === 'ZERO_RESULTS') {
                geocodeCache.set(address, result);
            }
            return result;
        }
    } catch (error) {
        console.error("Error fetching geocoding data:", error);
        return { coords: null, errorStatus: 'FETCH_ERROR' };
    }
}
