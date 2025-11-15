// This component reuses a lot of the logic from ContactsMap, but is specialized for volunteers.
// It shows clients and volunteers, and can draw lines between them.

import React, { useState, useEffect, useRef } from 'react';
import type { Volunteer, Client } from '../types';
import { getCoordsForAddress, GeocodeResult } from '../utils/geocoding';
import { calculateDistance } from '../utils/distance';

interface VolunteersMapProps {
    volunteers: Volunteer[];
    clients: Client[];
    selectedClientId: string | null;
}

const GOOGLE_MAPS_API_KEY = "AIzaSyArmLqdBGYQv8l2N8Ya3jte42dUfK829OI";

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
];

export const VolunteersMap: React.FC<VolunteersMapProps> = ({ volunteers, clients, selectedClientId }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});
    const [lines, setLines] = useState<google.maps.Polyline[]>([]);
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (window.google?.maps) {
            setIsReady(true);
            return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () => setIsReady(true);
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (isReady && mapRef.current && !map) {
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: 39.8283, lng: -98.5795 },
                zoom: 4,
                styles: mapStyles,
                disableDefaultUI: true,
                zoomControl: true,
            });
            setMap(newMap);
            setInfoWindow(new window.google.maps.InfoWindow());
        }
    }, [isReady, map]);

    useEffect(() => {
        if (map && infoWindow) {
            // Clear existing markers and lines
            Object.values(markers).forEach((marker: google.maps.Marker) => marker.setMap(null));
            lines.forEach(line => line.setMap(null));
            setMarkers({});
            setLines([]);
            infoWindow.close();

            const newMarkers: { [key: string]: google.maps.Marker } = {};
            const geocodePromises: Promise<GeocodeResult & { id: string, type: 'client' | 'volunteer', name: string }>[] = [];

            // Add selected client to geocoding queue
            const selectedClient = clients.find(c => c.id === selectedClientId);
            if (selectedClient) {
                geocodePromises.push(getCoordsForAddress(selectedClient.location).then(res => ({ ...res, id: selectedClient.id, type: 'client', name: selectedClient.name })));
            }

            // Add volunteers to geocoding queue
            volunteers.forEach(v => {
                geocodePromises.push(getCoordsForAddress(v.location).then(res => ({ ...res, id: v.id, type: 'volunteer', name: v.name })));
            });

            Promise.all(geocodePromises).then(results => {
                const bounds = new window.google.maps.LatLngBounds();
                const clientCoords = results.find(r => r.type === 'client')?.coords;

                results.forEach(({ id, type, name, coords }) => {
                    if (coords) {
                        const isClient = type === 'client';
                        const marker = new window.google.maps.Marker({
                            position: coords,
                            map: map,
                            title: name,
                            icon: {
                                path: isClient ? 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z' : google.maps.SymbolPath.CIRCLE,
                                scale: isClient ? 1 : 7,
                                fillColor: isClient ? '#c026d3' : '#4f46e5',
                                fillOpacity: 1,
                                strokeColor: '#ffffff',
                                strokeWeight: 2,
                            },
                        });
                        newMarkers[id] = marker;
                        bounds.extend(coords);
                        
                        // Add info window and lines if a client is selected
                        if (clientCoords && !isClient) {
                             const distance = calculateDistance(coords.lat, coords.lng, clientCoords.lat, clientCoords.lng);
                             marker.addListener('click', () => {
                                infoWindow.setContent(`<b>${name}</b><br>${distance.toFixed(1)} km from client`);
                                infoWindow.open(map, marker);
                             });

                             const line = new window.google.maps.Polyline({
                                 path: [coords, clientCoords],
                                 geodesic: true,
                                 strokeColor: '#6d28d9',
                                 strokeOpacity: 0.6,
                                 strokeWeight: 2,
                             });
                             line.setMap(map);
                             setLines(prev => [...prev, line]);
                        }
                    }
                });

                setMarkers(newMarkers);
                if (!bounds.isEmpty()) {
                    map.fitBounds(bounds);
                }
            });
        }
    }, [map, volunteers, selectedClientId, clients, infoWindow]);


    return <div ref={mapRef} className="w-full h-full rounded-md bg-slate-200" />;
};