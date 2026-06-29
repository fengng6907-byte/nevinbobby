import { NextResponse } from "next/server";
import { sgBars } from "@/data/sgBars";

const API_KEY = "AIzaSyCD_6oA5BlqCbWyBldL_7OqJ2t8K8AnHY8";
const CENTER = { lat: 1.3000, lng: 103.8400 };

interface PlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: { location: { lat: number; lng: number } };
  rating?: number;
  user_ratings_total?: number;
  photos?: { photo_reference: string }[];
  opening_hours?: { open_now?: boolean };
  price_level?: number;
  business_status?: string;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET() {
  try {
    const queries = [
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${CENTER.lat},${CENTER.lng}&radius=5000&type=bar&keyword=live+band&key=${API_KEY}`,
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${CENTER.lat},${CENTER.lng}&radius=5000&type=bar&keyword=live+music&key=${API_KEY}`,
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=live+band+bar+Singapore&key=${API_KEY}`,
    ];

    const responses = await Promise.all(
      queries.map((url) => fetch(url).then((r) => r.json()).catch(() => ({ results: [] })))
    );

    const seen = new Set<string>();
    const allPlaces: PlaceResult[] = [];
    for (const res of responses) {
      if (res.status !== "OK") continue;
      for (const place of res.results || []) {
        if (!seen.has(place.place_id) && place.business_status !== "CLOSED_PERMANENTLY") {
          seen.add(place.place_id);
          allPlaces.push(place);
        }
      }
    }

    if (allPlaces.length >= 10) {
      const venues = allPlaces
        .filter((p) => p.rating && p.rating >= 3.5)
        .map((p) => {
          const dist = haversineKm(CENTER.lat, CENTER.lng, p.geometry.location.lat, p.geometry.location.lng);
          const photoRef = p.photos?.[0]?.photo_reference;
          return {
            place_id: p.place_id,
            name: p.name,
            address: p.vicinity || p.name,
            lat: p.geometry.location.lat,
            lng: p.geometry.location.lng,
            rating: p.rating || 0,
            userRatingsTotal: p.user_ratings_total || 0,
            distance: dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`,
            distanceValue: dist,
            photoUrl: photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}`
              : null,
            openNow: p.opening_hours?.open_now ?? null,
            priceLevel: p.price_level ?? null,
          };
        })
        .sort((a, b) => a.distanceValue - b.distanceValue)
        .slice(0, 30);

      return NextResponse.json({ venues, count: venues.length, source: "google" });
    }

    return NextResponse.json({ venues: sgBars, count: sgBars.length, source: "fallback" });
  } catch {
    return NextResponse.json({ venues: sgBars, count: sgBars.length, source: "fallback" });
  }
}
