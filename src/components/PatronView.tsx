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

function DiscoverFeed({ onSelectVenue }: { onSelectVenue: (v: Venue) => void }) {
  const { venues, gigs, artists } = useEncore();
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const liveTonight = gigs.filter((g) => g.status === "confirmed" || g.status === "open");
  const filtered = liveTonight
    .filter(
      (g) =>
        (genreFilter === "All" || g.genre === genreFilter) &&
        (search === "" || g.venueName.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = venues.find((v) => v.id === a.venueId);
      const vb = venues.find((v) => v.id === b.venueId);
      return (vb?.booking_velocity ?? 0) - (va?.booking_velocity ?? 0);
    });

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8888A0]" />
        <input
          type="text"
          placeholder="Search venues, artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-[#16161D] border border-[#2A2A36] rounded-xl text-sm text-white placeholder-[#8888A0] focus:outline-none focus:border-purple-500/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
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

      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live Tonight
        </h2>
        <div className="space-y-3">
          {filtered.map((gig, index) => {
            const venue = venues.find((v) => v.id === gig.venueId);
            const artist = artists.find((a) => a.id === gig.confirmedArtistId);
            const isTopRanked = index === 0 && (venue?.booking_velocity ?? 0) > 0;
            return (
              <motion.div
                key={gig.id}
                layout
                layoutId={`gig-card-${gig.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ layout: { type: "spring", bounce: 0.2, duration: 0.6 } }}
                className={`bg-[#16161D] border rounded-xl p-4 hover:border-purple-500/30 transition-all cursor-pointer group ${
                  isTopRanked ? "border-amber-500/40" : "border-[#2A2A36]"
                }`}
                onClick={() => venue && onSelectVenue(venue)}
              >
                {isTopRanked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 mb-2 px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30 w-fit"
                  >
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400 tracking-wide uppercase">Trending #1 — Top Choice</span>
                  </motion.div>
                )}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{gig.venueName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        gig.status === "confirmed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {gig.status === "confirmed" ? "LIVE" : "OPEN SLOT"}
                      </span>
                      {venue && (venue.booking_velocity > 0) && (
                        <span className="flex items-center gap-0.5 text-[10px] text-[#8888A0]">
                          <TrendingUp className="w-3 h-3" />{venue.booking_velocity}
                        </span>
                      )}
                    </div>
                    {artist && (
                      <p className="text-sm text-purple-400 font-medium">{artist.name}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-[#8888A0]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {gig.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        {gig.genre}
                      </span>
                      {venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {venue.address.split(",")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#8888A0] group-hover:text-purple-400 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1 bg-[#16161D] rounded-xl p-1 w-fit">
        <button
          onClick={() => setViewMode("map")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            viewMode === "map" ? "bg-[#1E1E28] text-white" : "text-[#8888A0] hover:text-white/70"
          }`}
        >
          <Map className="w-3.5 h-3.5" /> Map
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            viewMode === "list" ? "bg-[#1E1E28] text-white" : "text-[#8888A0] hover:text-white/70"
          }`}
        >
          <List className="w-3.5 h-3.5" /> List
        </button>
      </div>

      {viewMode === "map" ? (
        <VenueMap venues={venues} onSelectVenue={onSelectVenue} />
      ) : (
        <div className="space-y-2">
          {[...venues].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).map((venue) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onSelectVenue(venue)}
              className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-4 hover:border-purple-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{venue.name}</h4>
                    {venue.booking_velocity > 2 && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> HOT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8888A0] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {venue.address} — {venue.distance}
                  </p>
                  {venue.liveAct && (
                    <p className="text-xs text-purple-400 flex items-center gap-1">
                      <Music className="w-3 h-3" /> {venue.liveAct}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-[#8888A0] group-hover:text-purple-400 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
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
