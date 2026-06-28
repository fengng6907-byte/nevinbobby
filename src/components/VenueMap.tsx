"use client";

import { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { Venue } from "@/context/EncoreContext";
import { MapPin, Music, Navigation, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const GOOGLE_MAPS_KEY = "AIzaSyCD_6oA5BlqCbWyBldL_7OqJ2t8K8AnHY8";

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b6b8d" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#8888a0" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6b6b8d" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1e1e30" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#4a4a6a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#22223a" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2a2a44" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2a2a48" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#333355" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#8888a0" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1e1e35" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#6b6b8d" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e0e1a" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3a3a5c" }] },
];

const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 1.2900, lng: 103.8350 };

interface VenueMapProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
}

export default function VenueMap({ venues, onSelectVenue }: VenueMapProps) {
  const { isLoaded } = useJsApiLoader({ id: "encore-map", googleMapsApiKey: GOOGLE_MAPS_KEY });
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    const bounds = new google.maps.LatLngBounds();
    venues.forEach((v) => bounds.extend({ lat: v.lat, lng: v.lng }));
    map.fitBounds(bounds, 60);
  }, [venues]);

  const handleLocate = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          mapRef.current?.panTo(loc);
          mapRef.current?.setZoom(14);
          setLocating(false);
        },
        () => {
          const simulated = { lat: 1.2920, lng: 103.8360 };
          setUserLocation(simulated);
          mapRef.current?.panTo(simulated);
          mapRef.current?.setZoom(14);
          setLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      const simulated = { lat: 1.2920, lng: 103.8360 };
      setUserLocation(simulated);
      mapRef.current?.panTo(simulated);
      mapRef.current?.setZoom(14);
      setLocating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-64 rounded-xl bg-[#1E1E28] border border-[#2A2A36] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#8888A0]">
          <div className="w-5 h-5 border-2 border-[#8888A0]/30 border-t-purple-400 rounded-full animate-spin" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A36]">
        <h3 className="text-sm font-semibold text-[#8888A0] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-400" />
          Nearby Venues
          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold">{venues.length}</span>
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLocate}
          disabled={locating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/30 transition-colors disabled:opacity-50"
        >
          {locating ? (
            <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
          ) : (
            <Navigation className="w-3 h-3" />
          )}
          {locating ? "Locating..." : "Fetch My Location"}
        </motion.button>
      </div>

      <div className="h-64 sm:h-80 relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={13}
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
          {venues.map((venue) => (
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
                  <div
                    style={{
                      background: "#16161D",
                      padding: "12px",
                      borderRadius: "12px",
                      minWidth: "180px",
                      border: "1px solid #2A2A36",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <span style={{ fontWeight: 700, color: "#F0F0F5", fontSize: "14px" }}>{venue.name}</span>
                    </div>
                    {venue.liveAct && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                        <span style={{ color: "#A855F7", fontSize: "11px" }}>&#9835;</span>
                        <span style={{ color: "#A855F7", fontSize: "12px", fontWeight: 500 }}>{venue.liveAct}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#8888A0", fontSize: "11px" }}>{venue.distance}</span>
                      <span style={{ color: "#8888A0", fontSize: "11px", display: "flex", alignItems: "center", gap: "3px" }}>
                        &#x2191; {venue.booking_velocity} bookings
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectVenue(venue)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        background: "linear-gradient(to right, #9333EA, #A855F7)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      View & Book
                    </button>
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          ))}

          {userLocation && (
            <MarkerF
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#10B981",
                fillOpacity: 1,
                strokeColor: "#059669",
                strokeWeight: 3,
                scale: 8,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
