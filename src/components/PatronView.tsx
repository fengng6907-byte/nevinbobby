"use client";

import { useState, useEffect, useCallback } from "react";
import { useEncore, Venue, Table, GooglePlaceVenue } from "@/context/EncoreContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Search, Star, Clock, ChevronLeft, X, CreditCard,
  CheckCircle2, Music, TrendingUp, Flame,
  Navigation, ImageIcon
} from "lucide-react";
import VenueMap from "./VenueMap";

const GOOGLE_MAPS_KEY = "AIzaSyCD_6oA5BlqCbWyBldL_7OqJ2t8K8AnHY8";

function PlacePhoto({ url, name, className }: { url: string | null | undefined; name: string; className?: string }) {
  const [error, setError] = useState(false);
  if (!url || error) {
    const gradients = [
      "from-purple-900 via-violet-800 to-indigo-900",
      "from-rose-900 via-orange-800 to-amber-900",
      "from-emerald-900 via-teal-800 to-cyan-900",
      "from-blue-900 via-indigo-800 to-purple-900",
      "from-pink-900 via-rose-800 to-red-900",
    ];
    const idx = name.charCodeAt(0) % gradients.length;
    return (
      <div className={`bg-gradient-to-br ${gradients[idx]} flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-3xl font-bold text-white/30">{name.charAt(0)}</div>
          <ImageIcon className="w-4 h-4 text-white/20 mx-auto mt-1" />
        </div>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={name}
      onError={() => setError(true)}
      className={`object-cover ${className}`}
    />
  );
}

function BarListingCard({
  venue,
  rank,
  onSelect,
}: {
  venue: Venue | GooglePlaceVenue;
  rank: number;
  onSelect: () => void;
}) {
  const isVenue = "tables" in venue;
  const isTopRanked = rank === 0;
  const availableTables = isVenue ? venue.tables.filter((t) => t.status === "available").length : null;
  const velocity = isVenue ? venue.booking_velocity : 0;
  const photoUrl = "photoUrl" in venue ? venue.photoUrl : null;
  const reviewCount = "userRatingsTotal" in venue ? (venue.userRatingsTotal ?? 0) : 0;
  const openNow = "openNow" in venue ? venue.openNow : null;
  const priceLevel = "priceLevel" in venue ? (venue.priceLevel ?? null) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(rank * 0.03, 0.3), layout: { type: "spring", bounce: 0.15, duration: 0.5 } }}
      onClick={onSelect}
      className={`bg-[#16161D] border rounded-xl overflow-hidden hover:border-purple-500/40 transition-all cursor-pointer group ${
        isTopRanked && velocity > 0 ? "border-amber-500/30 ring-1 ring-amber-500/10" : "border-[#2A2A36]"
      }`}
    >
      <div className="flex h-[130px]">
        <div className="w-[140px] sm:w-[170px] shrink-0 relative overflow-hidden">
          <PlacePhoto url={photoUrl} name={venue.name} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#16161D]/20" />
          {isTopRanked && velocity > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-amber-500/90 rounded text-[9px] font-bold text-black">
              <Flame className="w-2.5 h-2.5" /> #1 TRENDING
            </div>
          )}
          {rank > 0 && rank < 3 && velocity > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-purple-500/90 rounded text-[9px] font-bold text-white">
              TOP PICK
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-sm leading-tight truncate">{venue.name}</h3>
              {openNow !== null && (
                <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                  openNow ? "bg-emerald-500/20 text-emerald-400" : "bg-[#2A2A36] text-[#8888A0]"
                }`}>
                  {openNow ? "OPEN" : "CLOSED"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-amber-400">{venue.rating}</span>
              </div>
              {reviewCount > 0 && (
                <span className="text-[10px] text-[#8888A0]">({reviewCount.toLocaleString()})</span>
              )}
              {priceLevel !== null && priceLevel > 0 && (
                <>
                  <span className="text-[#2A2A36]">·</span>
                  <span className="text-[10px] text-[#8888A0]">{"$".repeat(priceLevel)}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#8888A0]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{venue.address}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-purple-400 font-medium">
                <Navigation className="w-3 h-3" /> {venue.distance}
              </span>
              {isVenue && velocity > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-[#8888A0]">
                  <TrendingUp className="w-3 h-3" /> {velocity}
                </span>
              )}
            </div>
            {availableTables !== null && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                availableTables > 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
              }`}>
                {availableTables > 0 ? `${availableTables} tables` : "Full"}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DiscoverFeed({ onSelectVenue, onSelectPlace }: {
  onSelectVenue: (v: Venue) => void;
  onSelectPlace: (p: GooglePlaceVenue) => void;
}) {
  const { venues } = useEncore();
  const [search, setSearch] = useState("");
  const [places, setPlaces] = useState<GooglePlaceVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "reviews">("distance");

  useEffect(() => {
    setLoading(true);
    fetch("/api/places")
      .then((r) => r.json())
      .then((data) => {
        setPlaces(data.venues || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const encoreVenueIds = new Set(venues.map((v) => v.name.toLowerCase()));

  const allItems: Array<{ type: "venue"; data: Venue } | { type: "place"; data: GooglePlaceVenue }> = [
    ...venues.map((v) => ({ type: "venue" as const, data: v })),
    ...places
      .filter((p) => !encoreVenueIds.has(p.name.toLowerCase()))
      .map((p) => ({ type: "place" as const, data: p })),
  ];

  const filtered = allItems.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return item.data.name.toLowerCase().includes(q) || item.data.address.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a.type === "venue" ? a.data.booking_velocity : 0;
    const bv = b.type === "venue" ? b.data.booking_velocity : 0;
    if (av > 0 || bv > 0) {
      if (av !== bv) return bv - av;
    }
    switch (sortBy) {
      case "rating": return b.data.rating - a.data.rating;
      case "reviews": {
        const ar = "userRatingsTotal" in a.data ? (a.data.userRatingsTotal ?? 0) : 0;
        const br = "userRatingsTotal" in b.data ? (b.data.userRatingsTotal ?? 0) : 0;
        return br - ar;
      }
      default: {
        const ad = "distanceValue" in a.data ? a.data.distanceValue : parseFloat(a.data.distance);
        const bd = "distanceValue" in b.data ? b.data.distanceValue : parseFloat(b.data.distance);
        return ad - bd;
      }
    }
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8888A0]" />
        <input
          type="text"
          placeholder="Search bars, pubs, live music..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-[#16161D] border border-[#2A2A36] rounded-xl text-sm text-white placeholder-[#8888A0] focus:outline-none focus:border-purple-500/50 transition-colors"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-[#8888A0]">
          <MapPin className="w-3.5 h-3.5 text-purple-400" />
          <span>Singapore</span>
          <span className="text-[#2A2A36]">·</span>
          <span className="font-medium text-white">{sorted.length} bars</span>
        </div>
        <div className="flex items-center gap-1 bg-[#16161D] border border-[#2A2A36] rounded-lg p-0.5">
          {(["distance", "rating", "reviews"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-all capitalize ${
                sortBy === s ? "bg-[#1E1E28] text-white" : "text-[#8888A0] hover:text-white/70"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#16161D] border border-[#2A2A36] rounded-xl h-[130px] flex overflow-hidden animate-pulse">
              <div className="w-[140px] sm:w-[170px] bg-[#1E1E28]" />
              <div className="flex-1 p-3 space-y-3">
                <div className="h-4 bg-[#1E1E28] rounded w-3/4" />
                <div className="h-3 bg-[#1E1E28] rounded w-1/2" />
                <div className="h-3 bg-[#1E1E28] rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item, index) => (
            <BarListingCard
              key={item.type === "venue" ? item.data.id : (item.data as GooglePlaceVenue).place_id}
              venue={item.data}
              rank={index}
              onSelect={() => {
                if (item.type === "venue") onSelectVenue(item.data);
                else onSelectPlace(item.data as GooglePlaceVenue);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BarDetailView({
  venue,
  place,
  onBack,
  onBook,
}: {
  venue?: Venue;
  place?: GooglePlaceVenue;
  onBack: () => void;
  onBook?: (table: Table) => void;
}) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [activeTab, setActiveTab] = useState<"floor" | "menu" | "info">("floor");

  const name = venue?.name || place?.name || "";
  const address = venue?.address || place?.address || "";
  const lat = venue?.lat || place?.lat || 0;
  const lng = venue?.lng || place?.lng || 0;
  const rating = venue?.rating || place?.rating || 0;
  const photoUrl = venue?.photoUrl || place?.photoUrl;
  const reviewCount = venue?.userRatingsTotal || place?.userRatingsTotal || 0;
  const distance = venue?.distance || place?.distance || "";
  const isEncoreVenue = !!venue;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> All Bars
      </button>

      <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl overflow-hidden">
        <div className="relative h-44 sm:h-52">
          <PlacePhoto url={photoUrl} name={name} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16161D] via-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold">{name}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-amber-400">{rating}</span>
                {reviewCount > 0 && (
                  <span className="text-xs text-[#8888A0]">({reviewCount.toLocaleString()} reviews)</span>
                )}
              </div>
              <span className="flex items-center gap-1 text-xs text-purple-400">
                <Navigation className="w-3 h-3" /> {distance}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-[#8888A0]">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{address}</span>
          </div>
          {isEncoreVenue && venue.liveAct && (
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Music className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-sm font-medium text-purple-400">{venue.liveAct}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-auto" />
            </div>
          )}
          {isEncoreVenue && (
            <div className="flex items-center gap-2 text-sm text-[#8888A0]">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{venue.openHours}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl overflow-hidden">
        <div className="p-3 border-b border-[#2A2A36] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold">Location</span>
        </div>
        <div className="h-48">
          <VenueMap
            venues={venue ? [venue] : []}
            googlePlace={place}
            onSelectVenue={() => {}}
            singlePin={{ lat, lng, name }}
          />
        </div>
      </div>

      {isEncoreVenue && venue && onBook && (
        <>
          <div className="flex gap-1 bg-[#16161D] rounded-xl p-1">
            {(["floor", "menu", "info"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === t ? "bg-[#1E1E28] text-white" : "text-[#8888A0] hover:text-white/70"
                }`}
              >
                {t === "floor" ? "Floor Plan" : t}
              </button>
            ))}
          </div>

          {activeTab === "floor" && (
            <div className="space-y-4">
              <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Select Your Table</h3>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" />Open</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" />Taken</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />VIP</span>
                  </div>
                </div>
                <div className="relative w-full aspect-[16/10] bg-[#1E1E28] rounded-xl border border-[#2A2A36] overflow-hidden">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 px-8 py-2 bg-gradient-to-r from-purple-500/20 via-purple-500/30 to-purple-500/20 rounded-full border border-purple-500/30">
                    <span className="text-xs font-semibold text-purple-400 tracking-widest uppercase">Stage</span>
                  </div>
                  {venue.tables.map((table) => {
                    const isSelected = selectedTable?.id === table.id;
                    const colorMap = {
                      available: "bg-emerald-500/20 border-emerald-500/40 hover:bg-emerald-500/30",
                      reserved: "bg-rose-500/20 border-rose-500/40",
                      "vip-locked": "bg-amber-500/20 border-amber-500/40",
                    };
                    return (
                      <motion.button
                        key={table.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTable(isSelected ? null : table)}
                        className={`absolute w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all ${colorMap[table.status]} ${
                          isSelected ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-[#1E1E28]" : ""
                        } ${table.status === "available" ? "cursor-pointer" : "cursor-default"}`}
                        style={{ left: `${table.x}%`, top: `${table.y}%`, transform: "translate(-50%, -50%)" }}
                      >
                        {table.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {selectedTable && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">Table {selectedTable.label}</h4>
                        <p className="text-sm text-[#8888A0]">{selectedTable.seats} seats</p>
                      </div>
                      <button onClick={() => setSelectedTable(null)} className="text-[#8888A0] hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-[#8888A0]">Minimum Spend</p>
                        <p className="text-xl font-bold text-amber-400">${selectedTable.minSpend}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedTable.status === "available" ? "bg-emerald-500/20 text-emerald-400" :
                        selectedTable.status === "reserved" ? "bg-rose-500/20 text-rose-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>
                        {selectedTable.status === "vip-locked" ? "VIP Locked" : selectedTable.status.charAt(0).toUpperCase() + selectedTable.status.slice(1)}
                      </span>
                    </div>
                    {selectedTable.status === "available" ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onBook(selectedTable)}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl"
                      >
                        Book Table {selectedTable.label}
                      </motion.button>
                    ) : selectedTable.status === "reserved" ? (
                      <p className="text-center text-sm text-rose-400">Reserved by {selectedTable.reservedBy || "Guest"}</p>
                    ) : (
                      <p className="text-center text-sm text-amber-400">Locked for VIP walk-ins</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === "menu" && (
            <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-5 space-y-4">
              <h3 className="font-semibold">Digital Menu</h3>
              {[
                { cat: "Signature Cocktails", items: [{ n: "Velvet Sour", p: "$22" }, { n: "Neon Fizz", p: "$20" }, { n: "Encore Old Fashioned", p: "$24" }] },
                { cat: "Beer & Cider", items: [{ n: "Tiger Draft", p: "$12" }, { n: "Asahi Super Dry", p: "$14" }, { n: "Strongbow", p: "$13" }] },
                { cat: "Bites", items: [{ n: "Truffle Fries", p: "$16" }, { n: "Wings Platter", p: "$22" }, { n: "Wagyu Sliders", p: "$28" }] },
              ].map((section) => (
                <div key={section.cat}>
                  <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">{section.cat}</h4>
                  {section.items.map((item) => (
                    <div key={item.n} className="flex items-center justify-between py-2 border-b border-[#2A2A36]/50 last:border-0">
                      <span className="text-sm">{item.n}</span>
                      <span className="text-sm font-medium text-amber-400">{item.p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === "info" && (
            <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-5 space-y-3">
              <h3 className="font-semibold">About {venue.name}</h3>
              <p className="text-sm text-[#8888A0] leading-relaxed">
                A premium live music venue in the heart of Singapore featuring nightly performances,
                craft cocktails, and an intimate atmosphere perfect for music lovers.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: "Vibe", value: venue.vibe },
                  { label: "Hours", value: venue.openHours },
                  { label: "Capacity", value: `${venue.tables.reduce((s, t) => s + t.seats, 0)} seats` },
                  { label: "WiFi", value: "Free" },
                ].map((info) => (
                  <div key={info.label} className="bg-[#1E1E28] rounded-lg p-3">
                    <p className="text-[10px] text-[#8888A0] uppercase tracking-wider">{info.label}</p>
                    <p className="text-sm font-medium mt-0.5">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!isEncoreVenue && (
        <div className="bg-[#16161D] border border-purple-500/20 rounded-xl p-5 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
            <Music className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="font-semibold">Coming Soon on ENCORE</h3>
          <p className="text-sm text-[#8888A0] leading-relaxed">
            This venue hasn&apos;t joined the ENCORE network yet. Table booking, live band schedules,
            and song requests will be available once they&apos;re onboarded.
          </p>
          <button className="px-5 py-2.5 bg-purple-500/20 text-purple-400 rounded-xl text-sm font-medium hover:bg-purple-500/30 transition-colors">
            Notify Me When Available
          </button>
        </div>
      )}
    </motion.div>
  );
}

function BookingCheckout({
  venue, table, onConfirm, onClose,
}: {
  venue: Venue; table: Table; onConfirm: () => void; onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
      onConfirm();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#16161D] border border-[#2A2A36] rounded-2xl p-6 w-full max-w-md"
      >
        {confirmed ? (
          <div className="text-center py-8 space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-400" />
            </motion.div>
            <h3 className="text-xl font-bold">Booking Confirmed!</h3>
            <p className="text-sm text-[#8888A0]">Table {table.label} at {venue.name} is reserved for you.</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 bg-[#1E1E28] border border-[#2A2A36] rounded-xl text-sm hover:bg-[#2A2A36] transition-colors">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Confirm Booking</h3>
              <button onClick={onClose} className="text-[#8888A0] hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1E1E28] rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-[#8888A0]">Venue</span><span className="font-medium">{venue.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#8888A0]">Table</span><span className="font-medium">{table.label} ({table.seats} seats)</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#8888A0]">Date</span><span className="font-medium">Tonight</span></div>
                <div className="border-t border-[#2A2A36] my-2" />
                <div className="flex justify-between text-sm"><span className="text-[#8888A0]">Min. Spend</span><span className="font-bold text-amber-400">${table.minSpend}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#8888A0]">Booking Fee</span><span className="font-medium">$10.00</span></div>
              </div>
              <div className="bg-[#1E1E28] rounded-xl p-4 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <div><p className="text-sm font-medium">Apple Pay</p><p className="text-xs text-[#8888A0]">•••• 4242</p></div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Confirm & Pay ${table.minSpend + 10}</>
                )}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function PatronView() {
  const { venues, bookTable } = useEncore();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<GooglePlaceVenue | null>(null);
  const [bookingTable, setBookingTable] = useState<{ venue: Venue; table: Table } | null>(null);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {selectedVenue || selectedPlace ? (
        <BarDetailView
          venue={selectedVenue || undefined}
          place={selectedPlace || undefined}
          onBack={() => { setSelectedVenue(null); setSelectedPlace(null); }}
          onBook={selectedVenue ? (table) => setBookingTable({ venue: selectedVenue, table }) : undefined}
        />
      ) : (
        <DiscoverFeed
          onSelectVenue={setSelectedVenue}
          onSelectPlace={setSelectedPlace}
        />
      )}

      <AnimatePresence>
        {bookingTable && (
          <BookingCheckout
            venue={bookingTable.venue}
            table={bookingTable.table}
            onConfirm={() => {
              bookTable(bookingTable.venue.id, bookingTable.table.id, "You");
              setSelectedVenue({
                ...bookingTable.venue,
                tables: bookingTable.venue.tables.map((t) =>
                  t.id === bookingTable.table.id ? { ...t, status: "reserved" as const, reservedBy: "You" } : t
                ),
              });
            }}
            onClose={() => setBookingTable(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
