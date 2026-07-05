"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type TableStatus = "available" | "reserved" | "vip-locked";

export interface Table {
  id: string;
  label: string;
  x: number;
  y: number;
  seats: number;
  minSpend: number;
  status: TableStatus;
  reservedBy?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  image: string;
  tables: Table[];
  booking_velocity: number;
  lat: number;
  lng: number;
  distance: string;
  liveAct?: string;
  vibe: string;
  coverGradient: string;
  openHours: string;
  rating: number;
  photoUrl?: string | null;
  userRatingsTotal?: number;
  openNow?: boolean | null;
  priceLevel?: number | null;
  isGooglePlace?: boolean;
}

export interface GooglePlaceVenue {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  userRatingsTotal: number;
  distance: string;
  distanceValue: number;
  photoUrl: string | null;
  openNow: boolean | null;
  priceLevel: number | null;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  rating: number;
  bio: string;
  techRider: string;
  image: string;
  walletBalance: number;
}

export interface Gig {
  id: string;
  venueId: string;
  venueName: string;
  date: string;
  time: string;
  genre: string;
  pay: string;
  status: "open" | "confirmed" | "completed";
  confirmedArtistId?: string;
  confirmedArtistName?: string;
}

export interface Bid {
  id: string;
  gigId: string;
  artistId: string;
  artistName: string;
  artistGenre: string;
  artistRating: number;
  techRider: string;
  status: "pending" | "accepted" | "declined";
  message: string;
}

export interface SongRequest {
  id: string;
  patronName: string;
  songTitle: string;
  tipAmount: number;
  timestamp: number;
}

export interface Booking {
  id: string;
  tableId: string;
  tableLabel: string;
  venueId: string;
  venueName: string;
  patronName: string;
  date: string;
}

interface EncoreContextType {
  activeView: "city" | "patron" | "venue" | "artist" | "tipjar";
  setActiveView: (v: "city" | "patron" | "venue" | "artist" | "tipjar") => void;
  venues: Venue[];
  artists: Artist[];
  gigs: Gig[];
  bids: Bid[];
  songRequests: SongRequest[];
  bookings: Booking[];
  bookTable: (venueId: string, tableId: string, patronName: string) => void;
  updateTableStatus: (venueId: string, tableId: string, status: TableStatus) => void;
  updateTableMinSpend: (venueId: string, tableId: string, minSpend: number) => void;
  postGig: (gig: Omit<Gig, "id">) => void;
  submitBid: (bid: Omit<Bid, "id" | "status">) => void;
  acceptBid: (bidId: string) => void;
  declineBid: (bidId: string) => void;
  sendSongRequest: (req: Omit<SongRequest, "id" | "timestamp">) => void;
  totalRevenue: number;
  occupancyRate: number;
}

const EncoreContext = createContext<EncoreContextType | null>(null);

export function useEncore() {
  const ctx = useContext(EncoreContext);
  if (!ctx) throw new Error("useEncore must be used within EncoreProvider");
  return ctx;
}

const initialVenues: Venue[] = [
  {
    id: "v1",
    name: "The Velvet Room",
    address: "12 Orchard Rd, Singapore",
    image: "/venues/velvet.jpg",
    booking_velocity: 3,
    lat: 1.3021,
    lng: 103.8198,
    distance: "0.5 km",
    liveAct: "Kai Chen — Acoustic",
    vibe: "Jazz · Cocktails · Intimate",
    coverGradient: "from-purple-900/80 via-violet-800/60 to-indigo-900/80",
    openHours: "7 PM – 2 AM",
    rating: 4.8,
    tables: [
      { id: "t1", label: "A1", x: 15, y: 55, seats: 2, minSpend: 80, status: "available" },
      { id: "t2", label: "A2", x: 35, y: 55, seats: 2, minSpend: 80, status: "available" },
      { id: "t3", label: "A3", x: 55, y: 55, seats: 2, minSpend: 80, status: "reserved", reservedBy: "Alex" },
      { id: "t4", label: "B1", x: 10, y: 75, seats: 4, minSpend: 150, status: "available" },
      { id: "t5", label: "B2", x: 35, y: 75, seats: 4, minSpend: 150, status: "available" },
      { id: "t6", label: "B3", x: 60, y: 75, seats: 4, minSpend: 150, status: "available" },
      { id: "t7", label: "VIP1", x: 80, y: 55, seats: 6, minSpend: 300, status: "available" },
      { id: "t8", label: "VIP2", x: 80, y: 75, seats: 8, minSpend: 500, status: "vip-locked" },
    ],
  },
  {
    id: "v2",
    name: "Neon Basement",
    address: "88 Club St, Singapore",
    image: "/venues/neon.jpg",
    booking_velocity: 1,
    lat: 1.2810,
    lng: 103.8467,
    distance: "1.2 km",
    liveAct: "The Rifts — Indie Rock",
    vibe: "Rock · Craft Beer · Underground",
    coverGradient: "from-rose-900/80 via-orange-800/60 to-amber-900/80",
    openHours: "8 PM – 3 AM",
    rating: 4.5,
    tables: [
      { id: "t9", label: "A1", x: 20, y: 60, seats: 2, minSpend: 60, status: "available" },
      { id: "t10", label: "A2", x: 45, y: 60, seats: 2, minSpend: 60, status: "available" },
      { id: "t11", label: "B1", x: 20, y: 80, seats: 4, minSpend: 120, status: "available" },
      { id: "t12", label: "VIP1", x: 70, y: 60, seats: 6, minSpend: 250, status: "available" },
    ],
  },
];

const initialArtists: Artist[] = [
  { id: "a1", name: "Luna Park", genre: "Jazz / Neo-Soul", rating: 4.8, bio: "Ethereal jazz vocalist blending neo-soul grooves with improvisational storytelling.", techRider: "2x SM58 mics, keyboard DI, monitor wedge", image: "/artists/luna.jpg", walletBalance: 2400 },
  { id: "a2", name: "The Rifts", genre: "Indie Rock", rating: 4.5, bio: "High-energy indie rock trio known for electrifying live performances.", techRider: "Full drum kit, 3x guitar amps, 4x DI boxes, 3 monitors", image: "/artists/rifts.jpg", walletBalance: 1850 },
  { id: "a3", name: "Kai Chen", genre: "Acoustic / Mandopop", rating: 4.9, bio: "Award-winning singer-songwriter fusing Mandopop melodies with fingerstyle guitar.", techRider: "1x condenser mic, acoustic DI, music stand, stool", image: "/artists/kai.jpg", walletBalance: 3200 },
];

const initialGigs: Gig[] = [
  { id: "g1", venueId: "v1", venueName: "The Velvet Room", date: "2026-07-05", time: "21:00", genre: "Jazz", pay: "$400", status: "open" },
  { id: "g2", venueId: "v1", venueName: "The Velvet Room", date: "2026-07-12", time: "20:00", genre: "Acoustic", pay: "$350", status: "confirmed", confirmedArtistId: "a3", confirmedArtistName: "Kai Chen" },
  { id: "g3", venueId: "v2", venueName: "Neon Basement", date: "2026-07-08", time: "22:00", genre: "Rock", pay: "$500", status: "open" },
  { id: "g4", venueId: "v2", venueName: "Neon Basement", date: "2026-07-15", time: "21:00", genre: "Any", pay: "$450", status: "open" },
];

const initialBids: Bid[] = [
  { id: "b1", gigId: "g1", artistId: "a1", artistName: "Luna Park", artistGenre: "Jazz / Neo-Soul", artistRating: 4.8, techRider: "2x SM58 mics, keyboard DI, monitor wedge", status: "pending", message: "Would love to bring my quartet for a smooth jazz evening!" },
];

const initialSongRequests: SongRequest[] = [
  { id: "sr1", patronName: "Jamie", songTitle: "Fly Me to the Moon", tipAmount: 10, timestamp: Date.now() - 120000 },
  { id: "sr2", patronName: "Priya", songTitle: "月亮代表我的心", tipAmount: 20, timestamp: Date.now() - 60000 },
];

export function EncoreProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<"city" | "patron" | "venue" | "artist" | "tipjar">("city");
  const [venues, setVenues] = useState<Venue[]>(initialVenues);
  const [artists] = useState<Artist[]>(initialArtists);
  const [gigs, setGigs] = useState<Gig[]>(initialGigs);
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [songRequests, setSongRequests] = useState<SongRequest[]>(initialSongRequests);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const bookTable = useCallback((venueId: string, tableId: string, patronName: string) => {
    setVenues((prev) =>
      prev.map((v) =>
        v.id === venueId
          ? { ...v, booking_velocity: v.booking_velocity + 1, tables: v.tables.map((t) => (t.id === tableId ? { ...t, status: "reserved" as TableStatus, reservedBy: patronName } : t)) }
          : v
      )
    );
    const venue = venues.find((v) => v.id === venueId);
    const table = venue?.tables.find((t) => t.id === tableId);
    if (venue && table) {
      setBookings((prev) => [...prev, { id: `bk-${Date.now()}`, tableId, tableLabel: table.label, venueId, venueName: venue.name, patronName, date: new Date().toISOString().split("T")[0] }]);
    }
  }, [venues]);

  const updateTableStatus = useCallback((venueId: string, tableId: string, status: TableStatus) => {
    setVenues((prev) =>
      prev.map((v) =>
        v.id === venueId
          ? { ...v, tables: v.tables.map((t) => (t.id === tableId ? { ...t, status } : t)) }
          : v
      )
    );
  }, []);

  const updateTableMinSpend = useCallback((venueId: string, tableId: string, minSpend: number) => {
    setVenues((prev) =>
      prev.map((v) =>
        v.id === venueId
          ? { ...v, tables: v.tables.map((t) => (t.id === tableId ? { ...t, minSpend } : t)) }
          : v
      )
    );
  }, []);

  const postGig = useCallback((gig: Omit<Gig, "id">) => {
    setGigs((prev) => [...prev, { ...gig, id: `g-${Date.now()}` }]);
  }, []);

  const submitBid = useCallback((bid: Omit<Bid, "id" | "status">) => {
    setBids((prev) => [...prev, { ...bid, id: `b-${Date.now()}`, status: "pending" }]);
  }, []);

  const acceptBid = useCallback((bidId: string) => {
    setBids((prev) => {
      const updated = prev.map((b) => (b.id === bidId ? { ...b, status: "accepted" as const } : b));
      const accepted = updated.find((b) => b.id === bidId);
      if (accepted) {
        setGigs((g) =>
          g.map((gig) =>
            gig.id === accepted.gigId
              ? { ...gig, status: "confirmed" as const, confirmedArtistId: accepted.artistId, confirmedArtistName: accepted.artistName }
              : gig
          )
        );
      }
      return updated;
    });
  }, []);

  const declineBid = useCallback((bidId: string) => {
    setBids((prev) => prev.map((b) => (b.id === bidId ? { ...b, status: "declined" as const } : b)));
  }, []);

  const sendSongRequest = useCallback((req: Omit<SongRequest, "id" | "timestamp">) => {
    setSongRequests((prev) => [...prev, { ...req, id: `sr-${Date.now()}`, timestamp: Date.now() }]);
  }, []);

  const totalRevenue = bookings.length * 150 + songRequests.reduce((s, r) => s + r.tipAmount, 0);
  const allTables = venues.flatMap((v) => v.tables);
  const occupancyRate = Math.round((allTables.filter((t) => t.status === "reserved").length / allTables.length) * 100);

  return (
    <EncoreContext.Provider
      value={{
        activeView, setActiveView,
        venues, artists, gigs, bids, songRequests, bookings,
        bookTable, updateTableStatus, updateTableMinSpend,
        postGig, submitBid, acceptBid, declineBid, sendSongRequest,
        totalRevenue, occupancyRate,
      }}
    >
      {children}
    </EncoreContext.Provider>
  );
}
