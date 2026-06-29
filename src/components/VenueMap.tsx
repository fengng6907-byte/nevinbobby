"use client";

import { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { Venue, GooglePlaceVenue } from "@/context/EncoreContext";
import { MapPin, Navigation } from "lucide-react";

const GOOGLE_MAPS_KEY = "AIzaSyCD_6oA5BlqCbWyBldL_7OqJ2t8K8AnHY8";

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b6b8d" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#8888a0" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6b6b8d" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1e1e30" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#22223a" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2a2a44" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2a2a48" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#333355" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1e1e35" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e0e1a" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3a3a5c" }] },
];

const containerStyle = { width: "100%", height: "100%" };

interface VenueMapProps {
  venues: Venue[];
  googlePlace?: GooglePlaceVenue;
  onSelectVenue: (venue: Venue) => void;
  singlePin?: { lat: number; lng: number; name: string };
}

export default function VenueMap({ venues, googlePlace, onSelectVenue, singlePin }: VenueMapProps) {
  const { isLoaded } = useJsApiLoader({ id: "encore-map", googleMapsApiKey: GOOGLE_MAPS_KEY });
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const isSingleMode = !!singlePin;
  const center = singlePin
    ? { lat: singlePin.lat, lng: singlePin.lng }
    : { lat: 1.2900, lng: 103.8350 };

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (isSingleMode && singlePin) {
      map.setCenter({ lat: singlePin.lat, lng: singlePin.lng });
      map.setZoom(16);
    } else if (venues.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      venues.forEach((v) => bounds.extend({ lat: v.lat, lng: v.lng }));
      map.fitBounds(bounds, 60);
    }
  }, [venues, isSingleMode, singlePin]);

  if (!isLoaded) {
    return (
      <div className="h-48 bg-[#1E1E28] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#8888A0]">
          <div className="w-5 h-5 border-2 border-[#8888A0]/30 border-t-purple-400 rounded-full animate-spin" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={isSingleMode ? 16 : 13}
        onLoad={onLoad}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          backgroundColor: "#0D0D11",
        }}
      >
        {isSingleMode && singlePin && (
          <MarkerF
            position={{ lat: singlePin.lat, lng: singlePin.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#A855F7",
              fillOpacity: 1,
              strokeColor: "#7C3AED",
              strokeWeight: 3,
              scale: 12,
            }}
          />
        )}

        {!isSingleMode && venues.map((venue) => (
          <MarkerF
            key={venue.id}
            position={{ lat: venue.lat, lng: venue.lng }}
            onClick={() => setActiveMarker(venue.id)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#A855F7",
              fillOpacity: 1,
              strokeColor: "#7C3AED",
              strokeWeight: 3,
              scale: 10,
            }}
          >
            {activeMarker === venue.id && (
              <InfoWindowF
                position={{ lat: venue.lat, lng: venue.lng }}
                onCloseClick={() => setActiveMarker(null)}
              >
                <div style={{ background: "#16161D", padding: "12px", borderRadius: "12px", minWidth: "180px", border: "1px solid #2A2A36" }}>
                  <div style={{ fontWeight: 700, color: "#F0F0F5", fontSize: "14px", marginBottom: "6px" }}>{venue.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#8888A0", fontSize: "11px" }}>{venue.distance}</span>
                    <span style={{ color: "#F59E0B", fontSize: "11px" }}>★ {venue.rating}</span>
                  </div>
                  <button
                    onClick={() => onSelectVenue(venue)}
                    style={{ width: "100%", padding: "8px", background: "linear-gradient(to right, #9333EA, #A855F7)", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                  >
                    View & Book
                  </button>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>
        ))}
      </GoogleMap>
    </div>
  );
}
