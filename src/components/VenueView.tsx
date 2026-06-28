"use client";

import { useState } from "react";
import { useEncore } from "@/context/EncoreContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, DollarSign, Users, Music, Calendar, Plus, X,
  CheckCircle2, XCircle, Star, ChevronDown, Lock, Unlock, TrendingUp
} from "lucide-react";

function MetricCard({ icon: Icon, label, value, accent, sub }: {
  icon: React.ElementType; label: string; value: string; accent: string; sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-[#8888A0]">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-[#8888A0] mt-1">{sub}</p>}
    </motion.div>
  );
}

function PostGigModal({ onClose }: { onClose: () => void }) {
  const { postGig, venues } = useEncore();
  const [form, setForm] = useState({ venueId: venues[0]?.id || "", date: "2026-07-20", time: "21:00", genre: "Jazz", pay: "$400" });
  const [loading, setLoading] = useState(false);

  const handlePost = () => {
    setLoading(true);
    setTimeout(() => {
      const venue = venues.find((v) => v.id === form.venueId);
      postGig({ ...form, venueName: venue?.name || "", status: "open" });
      setLoading(false);
      onClose();
    }, 1000);
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
        className="bg-[#16161D] border border-[#2A2A36] rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Post New Gig Slot</h3>
          <button onClick={onClose} className="text-[#8888A0] hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {[
          { label: "Date", key: "date", type: "date" },
          { label: "Time", key: "time", type: "time" },
          { label: "Pay", key: "pay", type: "text" },
        ].map(({ label, key, type }) => (
          <div key={key}>
            <label className="block text-xs text-[#8888A0] mb-1">{label}</label>
            <input
              type={type}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[#1E1E28] border border-[#2A2A36] rounded-xl text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs text-[#8888A0] mb-1">Genre</label>
          <div className="relative">
            <select
              value={form.genre}
              onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[#1E1E28] border border-[#2A2A36] rounded-xl text-sm focus:outline-none focus:border-purple-500/50 appearance-none"
            >
              {["Jazz", "Rock", "Acoustic", "Mandopop", "Any"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8888A0] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-[#8888A0] mb-1">Venue</label>
          <div className="relative">
            <select
              value={form.venueId}
              onChange={(e) => setForm((f) => ({ ...f, venueId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[#1E1E28] border border-[#2A2A36] rounded-xl text-sm focus:outline-none focus:border-purple-500/50 appearance-none"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8888A0] pointer-events-none" />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePost}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-4 h-4" /> Post Gig</>}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function VenueView() {
  const { venues, gigs, bids, occupancyRate, totalRevenue, acceptBid, declineBid, updateTableStatus, updateTableMinSpend } = useEncore();
  const [showPostGig, setShowPostGig] = useState(false);
  const [tab, setTab] = useState<"analytics" | "gigs" | "floor">("analytics");

  const activeBids = bids.filter((b) => b.status === "pending");
  const confirmedGigs = gigs.filter((g) => g.status === "confirmed").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Venue Dashboard</h1>
          <p className="text-sm text-[#8888A0]">The Velvet Room & Neon Basement</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPostGig(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Post Gig
        </motion.button>
      </div>

      <div className="flex gap-1 bg-[#16161D] rounded-xl p-1 w-fit">
        {(["analytics", "gigs", "floor"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t ? "bg-[#1E1E28] text-white" : "text-[#8888A0] hover:text-white/70"
            }`}
          >
            {t === "floor" ? "Floor Plan" : t}
          </button>
        ))}
      </div>

      {tab === "analytics" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Users} label="Table Occupancy" value={`${occupancyRate}%`} accent="bg-purple-500/20 text-purple-400" sub={`${venues.flatMap(v => v.tables).filter(t => t.status === "reserved").length} of ${venues.flatMap(v => v.tables).length} tables`} />
          <MetricCard icon={DollarSign} label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} accent="bg-emerald-500/20 text-emerald-400" sub="Tips + Bookings" />
          <MetricCard icon={BarChart3} label="Active Bids" value={String(activeBids.length)} accent="bg-amber-500/20 text-amber-400" sub="Awaiting review" />
          <MetricCard icon={TrendingUp} label="Confirmed Gigs" value={String(confirmedGigs)} accent="bg-rose-500/20 text-rose-400" sub="This month" />
        </div>
      )}

      {tab === "gigs" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" /> Gig Calendar
            </h2>
            {gigs.map((gig) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{gig.venueName}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        gig.status === "confirmed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {gig.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-[#8888A0]">{gig.date} at {gig.time} — {gig.genre}</p>
                    <p className="text-sm font-medium text-emerald-400">{gig.pay}</p>
                    {gig.confirmedArtistName && (
                      <p className="text-sm text-purple-400 flex items-center gap-1">
                        <Music className="w-3 h-3" /> {gig.confirmedArtistName}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" /> Incoming Bids
              {activeBids.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeBids.length}
                </span>
              )}
            </h2>
            {bids.filter((b) => b.status === "pending").length === 0 && (
              <p className="text-sm text-[#8888A0] bg-[#16161D] border border-[#2A2A36] rounded-xl p-6 text-center">
                No pending bids. Post a gig to attract artists!
              </p>
            )}
            {bids.map((bid) => {
              if (bid.status !== "pending") return null;
              const gig = gigs.find((g) => g.id === bid.gigId);
              return (
                <motion.div
                  key={bid.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{bid.artistName}</h4>
                      <p className="text-xs text-[#8888A0]">For: {gig?.venueName} — {gig?.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-amber-400 font-medium">{bid.artistRating}</span>
                    </div>
                  </div>
                  <div className="bg-[#1E1E28] rounded-lg p-3 space-y-1">
                    <p className="text-xs text-[#8888A0]">EPK Summary</p>
                    <p className="text-sm"><span className="text-purple-400">Genre:</span> {bid.artistGenre}</p>
                    <p className="text-sm"><span className="text-purple-400">Tech Rider:</span> {bid.techRider}</p>
                    <p className="text-sm text-[#8888A0] italic">&ldquo;{bid.message}&rdquo;</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => acceptBid(bid.id)}
                      className="flex-1 py-2 bg-emerald-500/20 text-emerald-400 font-semibold rounded-lg flex items-center justify-center gap-1 text-sm hover:bg-emerald-500/30 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => declineBid(bid.id)}
                      className="flex-1 py-2 bg-rose-500/20 text-rose-400 font-semibold rounded-lg flex items-center justify-center gap-1 text-sm hover:bg-rose-500/30 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "floor" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Floor Plan Yield Management</h2>
          {venues.map((venue) => (
            <div key={venue.id} className="bg-[#16161D] border border-[#2A2A36] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#2A2A36]">
                <h3 className="font-semibold">{venue.name}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#8888A0] text-xs border-b border-[#2A2A36]">
                      <th className="text-left px-4 py-3 font-medium">Table</th>
                      <th className="text-left px-4 py-3 font-medium">Seats</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Min Spend</th>
                      <th className="text-left px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venue.tables.map((table) => (
                      <tr key={table.id} className="border-b border-[#2A2A36]/50 hover:bg-[#1E1E28]/50 transition-colors">
                        <td className="px-4 py-3 font-medium">{table.label}</td>
                        <td className="px-4 py-3 text-[#8888A0]">{table.seats}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            table.status === "available" ? "bg-emerald-500/20 text-emerald-400" :
                            table.status === "reserved" ? "bg-rose-500/20 text-rose-400" :
                            "bg-amber-500/20 text-amber-400"
                          }`}>
                            {table.status === "vip-locked" ? "VIP LOCK" : table.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-amber-400">$</span>
                            <input
                              type="number"
                              value={table.minSpend}
                              onChange={(e) => updateTableMinSpend(venue.id, table.id, Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-[#1E1E28] border border-[#2A2A36] rounded-lg text-sm focus:outline-none focus:border-amber-500/50"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {table.status !== "vip-locked" ? (
                              <button
                                onClick={() => updateTableStatus(venue.id, table.id, "vip-locked")}
                                className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-xs hover:bg-amber-500/20 transition-colors flex items-center gap-1"
                              >
                                <Lock className="w-3 h-3" /> VIP Lock
                              </button>
                            ) : (
                              <button
                                onClick={() => updateTableStatus(venue.id, table.id, "available")}
                                className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                              >
                                <Unlock className="w-3 h-3" /> Unlock
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showPostGig && <PostGigModal onClose={() => setShowPostGig(false)} />}
      </AnimatePresence>
    </div>
  );
}
