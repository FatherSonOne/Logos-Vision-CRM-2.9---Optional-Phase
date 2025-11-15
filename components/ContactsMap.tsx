import React, { useState, useEffect, useRef } from 'react';
import type { Client } from '../types';
import { getCoordsForAddress } from '../utils/geocoding';

interface ContactsMapProps {
    clients: Client[];
    selectedClientId: string | null;
    onSelect: (id: string) => void;
}

// This key is specifically for Google Maps Platform APIs
const GOOGLE_MAPS_API_KEY = "AIzaSyArmLqdBGYQv8l2N8Ya3jte42dUfK829OI";

type MapComponentState = 'loading_script' | 'error' | 'ready';


const mapStyles = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#a2daf2'}],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{color: '#f7f1df'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#ffffff'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#bde6ab'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#fee36e'}],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{visibility: 'off'}],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{color: '#555555'}],
  },
  {
    elementType: 'labels.icon',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'poi',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'transit',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{color: '#cccccc'}],
  },
];

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const ContactsMap: React.FC<ContactsMapProps> = ({ clients, selectedClientId, onSelect }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});
    const [componentState, setComponentState] = useState<MapComponentState>('loading_script');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const comprehensiveErrorMessage = 
        "The map failed to load or locate contacts. Please check the following for the Google Cloud project associated with your API key:\n" +
        "1. A valid billing account is linked.\n" +
        "2. The 'Maps JavaScript API' is enabled.\n" +
        "3. The 'Geocoding API' is enabled.\n" +
        "These can be configured in the Google Cloud Console.";

    // 1. Load Google Maps script
    useEffect(() => {
        const loadMapScript = () => {
            setComponentState('loading_script');

            // Set up a global callback for authentication failures
            window.gm_authFailure = () => {
                setErrorMessage(comprehensiveErrorMessage);
                setComponentState('error');
            };

            // If script is already loaded, proceed to initialize
            if (window.google?.maps) {
                setComponentState('ready');
                return;
            }

            // Otherwise, load the script
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                // Check state to avoid race condition with auth failure
                setComponentState(prevState => prevState === 'error' ? 'error' : 'ready');
            };
            script.onerror = () => {
                setErrorMessage("Failed to load the Google Maps script. Check your network connection.");
                setComponentState('error');
            };
            document.head.appendChild(script);

            return () => {
                if (window.gm_authFailure) window.gm_authFailure = null;
            };
        };

        loadMapScript();
    }, [comprehensiveErrorMessage]);

    // 2. Initialize map object when script is ready
    useEffect(() => {
        if (componentState === 'ready' && mapRef.current && !map) {
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: 39.8283, lng: -98.5795 }, // Center of US
                zoom: 4,
                styles: mapStyles,
                disableDefaultUI: true,
                zoomControl: true,
            });
            setMap(newMap);
        }
    }, [componentState, map]);

    // 3. Geocode client addresses and place markers
    useEffect(() => {
        if (map) {
            setIsGeocoding(true);
            Object.values(markers).forEach((marker: google.maps.Marker) => marker.setMap(null));
            const newMarkers: { [key: string]: google.maps.Marker } = {};
            const bounds = new window.google.maps.LatLngBounds();

            const geocodePromises = clients.map(client =>
                getCoordsForAddress(client.location).then(result => ({ client, ...result }))
            );

            Promise.all(geocodePromises).then(results => {
                const hasRequestDenied = results.some(r => r.errorStatus === 'REQUEST_DENIED');

                if (hasRequestDenied) {
                    setErrorMessage(comprehensiveErrorMessage);
                    setComponentState('error');
                    setIsGeocoding(false);
                    return;
                }

                let hasValidCoords = false;
                results.forEach(({ client, coords }) => {
                    if (coords) {
                        hasValidCoords = true;
                        const marker = new window.google.maps.Marker({
                            position: coords,
                            map: map,
                            title: client.name,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                fillColor: '#4f46e5',
                                fillOpacity: 1,
                                strokeColor: '#ffffff',
                                strokeWeight: 2,
                            },
                        });
                        marker.addListener('click', () => onSelect(client.id));
                        newMarkers[client.id] = marker;
                        bounds.extend(coords);
                    }
                });

                setMarkers(newMarkers);
                if (hasValidCoords && !selectedClientId) {
                    map.fitBounds(bounds);
                    if (results.filter(r => r.coords).length === 1) {
                         map.setZoom(10);
                    }
                }
                setIsGeocoding(false);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, clients, onSelect, comprehensiveErrorMessage]);
    
    // 4. Animate marker on selection
    useEffect(() => {
        if (componentState === 'ready' && window.google?.maps?.Animation) {
            Object.values(markers).forEach((marker: google.maps.Marker) => marker.setAnimation(null));
            if (selectedClientId && markers[selectedClientId]) {
                markers[selectedClientId].setAnimation(window.google.maps.Animation.BOUNCE);
            }
        }
    }, [selectedClientId, markers, componentState]);

    // 5. Pan and zoom to selected marker
    useEffect(() => {
        if (map && selectedClientId && markers[selectedClientId]) {
            const marker = markers[selectedClientId];
            const position = marker.getPosition();
            if (position) {
                map.panTo(position);
                map.setZoom(14);
            }
        } else if (map && clients.length > 0) {
            // When deselected, fit all markers back into view
            const bounds = new window.google.maps.LatLngBounds();
            let validCoordsCount = 0;
            Object.values(markers).forEach((marker: google.maps.Marker) => {
                 const pos = marker.getPosition();
                 if (pos) {
                     bounds.extend(pos);
                     validCoordsCount++;
                 }
            });

            if (validCoordsCount > 0) {
                map.fitBounds(bounds);
                if (validCoordsCount === 1) {
                    const currentZoom = map.getZoom();
                    if (currentZoom > 10) {
                        map.setZoom(10);
                    }
                }
            }
        }
    }, [selectedClientId, map, markers, clients]);


    const showInitialSpinner = componentState === 'loading_script';
    const showError = componentState === 'error';

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 relative aspect-[16/7] overflow-hidden dark:bg-slate-800 dark:border-slate-700">
            {showError ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 p-4 dark:bg-slate-800/90">
                    <ErrorIcon />
                    <h3 className="mt-2 text-lg font-semibold text-rose-600">Map Unavailable</h3>
                    <p className="mt-1 text-sm text-slate-500 text-center max-w-md whitespace-pre-line">{errorMessage}</p>
                </div>
            ) : ((showInitialSpinner || isGeocoding) ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 dark:bg-slate-800/80">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                     <p className="ml-4 text-slate-600 dark:text-slate-300">{isGeocoding ? "Locating Contacts..." : "Loading Map..."}</p>
                </div>
            ) : null)}
            <div ref={mapRef} className="w-full h-full rounded-md" />
        </div>
    );
};