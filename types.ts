// This file re-exports types from src/types.ts to avoid declaration conflicts.

declare global {
    // Defined AIStudio interface to resolve type conflict for window.aistudio.
    interface AIStudio {
        openSelectKey: () => Promise<void>;
        hasSelectedApiKey: () => Promise<boolean>;
    }

    namespace google.maps {
        class Map {
            constructor(mapDiv: HTMLDivElement | null, opts?: any);
            fitBounds(bounds: LatLngBounds): void;
            setZoom(zoom: number): void;
            panTo(latLng: any): void;
            getZoom(): number;
        }

        class Marker {
            constructor(opts?: any);
            setMap(map: Map | null): void;
            setAnimation(animation: any | null): void;
            addListener(eventName: string, handler: () => void): any;
            getPosition(): any;
        }

        class LatLngBounds {
            constructor();
            extend(point: any): void;
            isEmpty(): boolean;
        }
        
        enum SymbolPath {
            CIRCLE,
        }

        enum Animation {
            BOUNCE,
        }

        class Circle {
            constructor(opts?: any);
            getBounds(): LatLngBounds | null | undefined;
        }

        class InfoWindow {
            constructor(opts?: any);
            setContent(content: string | Node): void;
            open(map: Map, anchor?: any): void;
            close(): void;
        }
        class Polyline {
            constructor(opts?: any);
            setMap(map: Map | null): void;
        }
        
        namespace places {
            class Autocomplete {
                constructor(inputElement: HTMLInputElement, opts?: any);
                getPlace(): PlaceResult;
                setBounds(bounds: LatLngBounds | null | undefined): void;
                addListener(eventName: string, handler: () => void): any;
            }

            interface PlaceResult {
                formatted_address?: string;
            }
        }
    }
    interface Window {
        google: typeof google;
        gm_authFailure?: (() => void) | null;
        aistudio?: AIStudio;
    }
}

export * from './src/types';