"use client";

import { useState, useCallback } from "react";
import { useEncore, Venue, Table } from "@/context/EncoreContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Search, Star, Clock, ChevronRight, X, CreditCard,
  CheckCircle2, Music, Send, DollarSign, Filter, TrendingUp, Flame, Map, List
} from "lucide-react";
import VenueMap from "./VenueMap";

const genres = ["All", "Jazz", "Rock", "Acoustic", "Mandopop", "Any"];

function VenueCard({ venue, rank, onSelect }: { venue: Venue; rank: number; onSelect: (v: Venue) => void }) {
  const { gigs } = useEncore();
  const venueGigs = gigs.filter((g) => g.venueId === venue.id && (g.status === "confirmed" || g.status === "open"));
  const isTopRanked = rank === 0 && venue.booking_velocity > 0;
  const availableTables = venue.tables.filter((t) => t.status === "available").length;

  return (
    <motion.div
      layout
      layoutId={`venue-card-${venue.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ layout: { type: "spring", bounce: 0.2, duration: 0.6 } }}
      onClick={() => onSelect(venue)}
      className={`bg-[#16161D] border rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all cursor-pointer group ${
        isTopRanked ? "border-amber-500/40 ring-1 ring-amber-500/20" : "border-[#2A2A36]"
      }`}
    >
      <div className={`relative h-36 bg-gradient-to-br ${venue.coverGradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#16161D]" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          {isTopRanked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-lg border border-amber-500/40 backdrop-blur-sm"
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400 tracking-wide uppercase">Trending #1</span>
            </motion.div>
          )}
          {venue.liveAct && (
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-lg border border-emerald-500/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-400">LIVE NOW</span>
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/40 rounded-lg backdrop-blur-sm">
          <MapPin className="w-3 h-3 text-purple-400" />
          <span className="text-[10px] font-bold text-white">{venue.distance}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-lg font-bold backdrop-blur-sm">
            {venue.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{venue.name}</h3>
            <p className="text-[11px] text-white/60">{venue.vibe}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#8888A0]">
            <MapPin className="w-3 h-3" />
            <span>{venue.address}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-amber-400">{venue.rating}</span>
          </div>
        </div>

        {venue.liveAct && (
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Music className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="text-xs font-medium text-purple-400 truncate">{venue.liveAct}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-[#8888A0]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {venue.openHours}
            </span>
            {venueGigs.length > 0 && (
              <span className="flex items-center gap-1">
                <Music className="w-3 h-3" /> {venueGigs.length} gig{venueGigs.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <span className={`font-semibold ${availableTables > 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {availableTables > 0 ? `${availableTables} tables open` : "Full"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#2A2A36]/50">
          <div className="flex items-center gap-1.5">
            {venue.booking_velocity > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-[#8888A0]">
                <TrendingUp className="w-3 h-3" /> {venue.booking_velocity} booked today
              </span>
            )}
          </div>
          <span className="text-xs text-purple-400 font-medium group-hover:text-purple-300 flex items-center gap-1 transition-colors">
            View & Book <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function DiscoverFeed({ onSelectVenue }: { onSelectVenue: (v: Venue) => void }) {
  const { venues, gigs } = useEncore();
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const sortedVenues = [...venues]
    .filter((v) => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (genreFilter !== "All") {
        const venueGigs = gigs.filter((g) => g.venueId === v.id);
        if (!venueGigs.some((g) => g.genre === genreFilter || genreFilter === "Any")) return false;
      }
      return true;
    })
    .sort((a, b) => b.booking_velocity - a.booking_velocity);

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8888A0]" />
        <input
          type="text"
          placeholder="Search bars near you..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-[#16161D] border border-[#2A2A36] rounded-xl text-sm text-white placeholder-[#8888A0] focus:outline-none focus:border-purple-500/50 transition-colors"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-[#8888A0] shrink-0" />
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenreFilter(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                genreFilter === g
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-[#16161D] text-[#8888A0] border border-[#2A2A36] hover:border-[#3A3A46]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-0.5 bg-[#16161D] rounded-lg p-0.5 shrink-0 ml-2">
          <button
            onClick={() => setViewMode("map")}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "map" ? "bg-[#1E1E28] text-white" : "text-[#8888A0] hover:text-white/70"
            }`}
          >
            <Map className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "list" ? "bg-[#1E1E28] text-white" : "text-[#8888A0] hover:text-white/70"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === "map" && <VenueMap venues={venues} onSelectVenue={onSelectVenue} />}

      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {viewMode === "map" ? "On the Map" : "Bars Near You"}
          <span className="text-xs font-normal text-[#8888A0]">— sorted by popularity</span>
        </h2>
        <div className="space-y-4">
          {sortedVenues.map((venue, index) => (
            <VenueCard key={venue.id} venue={venue} rank={index} onSelect={onSelectVenue} />
          ))}
          {sortedVenues.length === 0 && (
            <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-8 text-center">
              <p className="text-sm text-[#8888A0]">No bars match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SeatingMap({ venue, onBook }: { venue: Venue; onBook: (table: Table) => void }) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{venue.name} — Floor Plan</h3>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" />Available</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" />Reserved</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />VIP Lock</span>
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
                selectedTable.status === "available"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : selectedTable.status === "reserved"
                  ? "bg-rose-500/20 text-rose-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}>
                {selectedTable.status === "vip-locked" ? "VIP Locked" : selectedTable.status.charAt(0).toUpperCase() + selectedTable.status.slice(1)}
              </span>
            </div>
            {selectedTable.status === "available" ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBook(selectedTable)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all"
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-400" />
            </motion.div>
            <h3 className="text-xl font-bold">Booking Confirmed!</h3>
            <p className="text-sm text-[#8888A0]">
              Table {table.label} at {venue.name} is reserved for you.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-[#1E1E28] border border-[#2A2A36] rounded-xl text-sm hover:bg-[#2A2A36] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Confirm Booking</h3>
              <button onClick={onClose} className="text-[#8888A0] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1E1E28] rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8888A0]">Venue</span>
                  <span className="font-medium">{venue.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8888A0]">Table</span>
                  <span className="font-medium">{table.label} ({table.seats} seats)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8888A0]">Date</span>
                  <span className="font-medium">Tonight</span>
                </div>
                <div className="border-t border-[#2A2A36] my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-[#8888A0]">Min. Spend</span>
                  <span className="font-bold text-amber-400">${table.minSpend}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8888A0]">Booking Fee</span>
                  <span className="font-medium">$10.00</span>
                </div>
              </div>

              <div className="bg-[#1E1E28] rounded-xl p-4 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium">Apple Pay</p>
                  <p className="text-xs text-[#8888A0]">•••• 4242</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
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

function TipJar() {
  const { sendSongRequest } = useEncore();
  const [songTitle, setSongTitle] = useState("");
  const [tipAmount, setTipAmount] = useState(10);
  const [patronName, setPatronName] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!songTitle.trim() || !patronName.trim()) return;
    sendSongRequest({ patronName, songTitle, tipAmount });
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSongTitle("");
      setPatronName("");
      setTipAmount(10);
    }, 2000);
  };

  return (
    <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <Music className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold">Song Request & Tip</h3>
          <p className="text-xs text-[#8888A0]">Send a request to the band on stage</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Your name"
        value={patronName}
        onChange={(e) => setPatronName(e.target.value)}
        className="w-full px-4 py-2.5 bg-[#1E1E28] border border-[#2A2A36] rounded-xl text-sm placeholder-[#8888A0] focus:outline-none focus:border-purple-500/50"
      />
      <input
        type="text"
        placeholder="Song title or request..."
        value={songTitle}
        onChange={(e) => setSongTitle(e.target.value)}
        className="w-full px-4 py-2.5 bg-[#1E1E28] border border-[#2A2A36] rounded-xl text-sm placeholder-[#8888A0] focus:outline-none focus:border-purple-500/50"
      />

      <div>
        <p className="text-xs text-[#8888A0] mb-2">Tip Amount</p>
        <div className="flex gap-2">
          {[5, 10, 20].map((amt) => (
            <button
              key={amt}
              onClick={() => setTipAmount(amt)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                tipAmount === amt
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-[#1E1E28] text-[#8888A0] border border-[#2A2A36] hover:border-[#3A3A46]"
              }`}
            >
              <DollarSign className="w-3 h-3" />{amt}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full py-3 bg-emerald-500/20 text-emerald-400 font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Sent!
          </motion.div>
        ) : (
          <motion.button
            key="send"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            disabled={!songTitle.trim() || !patronName.trim()}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Send Request — ${tipAmount}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PatronView() {
  const { venues, bookTable } = useEncore();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [bookingTable, setBookingTable] = useState<{ venue: Venue; table: Table } | null>(null);
  const [tab, setTab] = useState<"discover" | "tipjar">("discover");

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex gap-1 bg-[#16161D] rounded-xl p-1">
        {[
          { key: "discover" as const, label: "Discover" },
          { key: "tipjar" as const, label: "Tip Jar" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelectedVenue(null); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? "bg-[#1E1E28] text-white" : "text-[#8888A0] hover:text-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "discover" ? (
        selectedVenue ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedVenue(null)}
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Discover
            </button>
            <SeatingMap venue={selectedVenue} onBook={(table) => setBookingTable({ venue: selectedVenue, table })} />
          </div>
        ) : (
          <DiscoverFeed onSelectVenue={setSelectedVenue} />
        )
      ) : (
        <TipJar />
      )}

      <AnimatePresence>
        {bookingTable && (
          <BookingCheckout
            venue={bookingTable.venue}
            table={bookingTable.table}
            onConfirm={() => {
              bookTable(bookingTable.venue.id, bookingTable.table.id, "You");
              setSelectedVenue({ ...bookingTable.venue, tables: bookingTable.venue.tables.map((t) => t.id === bookingTable.table.id ? { ...t, status: "reserved" as const, reservedBy: "You" } : t) });
            }}
            onClose={() => setBookingTable(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
