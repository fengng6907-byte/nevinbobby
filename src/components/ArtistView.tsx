"use client";

import { useState } from "react";
import { useEncore } from "@/context/EncoreContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, DollarSign, Star, Music, MapPin, Clock, Send,
  Wallet, Tag, Monitor, Volume2, X, CheckCircle2, Mic2, Play, FileText
} from "lucide-react";

function ArtistDashboard() {
  const { gigs, artists, songRequests } = useEncore();
  const artist = artists[0];
  const confirmedGigs = gigs.filter((g) => g.confirmedArtistId === artist.id);
  const totalTips = songRequests.reduce((s, r) => s + r.tipAmount, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-[#8888A0]">Upcoming Gigs</span>
          </div>
          <p className="text-2xl font-bold">{confirmedGigs.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-[#8888A0]">Wallet</span>
          </div>
          <p className="text-2xl font-bold">${(artist.walletBalance + totalTips).toLocaleString()}</p>
        </motion.div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#8888A0]">Upcoming Schedule</h3>
        {confirmedGigs.length === 0 && (
          <p className="text-sm text-[#8888A0] bg-[#16161D] border border-[#2A2A36] rounded-xl p-4 text-center">
            No confirmed gigs yet. Check the marketplace!
          </p>
        )}
        {confirmedGigs.map((gig) => (
          <motion.div
            key={gig.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{gig.venueName}</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-400">CONFIRMED</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#8888A0]">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{gig.date} {gig.time}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{gig.pay}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EPKProfile() {
  const { artists } = useEncore();
  const artist = artists[0];

  return (
    <div className="space-y-4">
      <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-purple-600/30 via-emerald-600/20 to-amber-600/30 relative">
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#16161D]" />
        </div>
        <div className="px-5 pb-5 -mt-10 relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-2xl font-bold border-4 border-[#16161D] mb-3">
            {artist.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold">{artist.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-amber-400">{artist.rating}</span>
            </div>
            <span className="text-[#8888A0]">·</span>
            <span className="text-sm text-[#8888A0]">{artist.genre}</span>
          </div>
          <p className="text-sm text-[#8888A0] mt-3 leading-relaxed">{artist.bio}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            {artist.genre.split(" / ").map((g) => (
              <span key={g} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                <Tag className="w-3 h-3" />{g}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-5 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Play className="w-4 h-4 text-purple-400" /> Media</h3>
        <div className="grid grid-cols-2 gap-3">
          {["Live at The Velvet Room", "Acoustic Session"].map((title) => (
            <div key={title} className="aspect-video bg-[#1E1E28] border border-[#2A2A36] rounded-lg flex flex-col items-center justify-center gap-2 hover:border-purple-500/30 transition-colors cursor-pointer">
              <Play className="w-6 h-6 text-[#8888A0]" />
              <span className="text-[10px] text-[#8888A0]">{title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-5 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" /> Tech Rider</h3>
        <div className="bg-[#1E1E28] rounded-lg p-4">
          <p className="text-sm text-[#8888A0] leading-relaxed">{artist.techRider}</p>
        </div>
      </div>
    </div>
  );
}

function GigMarketplace() {
  const { gigs, submitBid, artists, bids } = useEncore();
  const artist = artists[0];
  const openGigs = gigs.filter((g) => g.status === "open");
  const [applying, setApplying] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [justApplied, setJustApplied] = useState<string | null>(null);

  const handleApply = (gigId: string) => {
    setLoading(true);
    setTimeout(() => {
      submitBid({
        gigId,
        artistId: artist.id,
        artistName: artist.name,
        artistGenre: artist.genre,
        artistRating: artist.rating,
        techRider: artist.techRider,
        message: message || "I'd love to perform at your venue!",
      });
      setLoading(false);
      setJustApplied(gigId);
      setApplying(null);
      setMessage("");
      setTimeout(() => setJustApplied(null), 3000);
    }, 1200);
  };

  const hasBid = (gigId: string) => bids.some((b) => b.gigId === gigId && b.artistId === artist.id);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[#8888A0]">Open Gig Slots</h3>
      {openGigs.length === 0 && (
        <p className="text-sm text-[#8888A0] bg-[#16161D] border border-[#2A2A36] rounded-xl p-6 text-center">
          No open slots right now. Check back soon!
        </p>
      )}
      {openGigs.map((gig) => (
        <motion.div
          key={gig.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-4 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold">{gig.venueName}</h4>
              <div className="flex items-center gap-3 text-xs text-[#8888A0]">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{gig.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{gig.time}</span>
                <span className="flex items-center gap-1"><Music className="w-3 h-3" />{gig.genre}</span>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-400">{gig.pay}</span>
          </div>

          <AnimatePresence mode="wait">
            {justApplied === gig.id ? (
              <motion.div
                key="applied"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-2 bg-emerald-500/20 text-emerald-400 font-medium rounded-lg flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Bid Submitted!
              </motion.div>
            ) : hasBid(gig.id) ? (
              <div className="py-2 bg-purple-500/10 text-purple-400 font-medium rounded-lg flex items-center justify-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Bid Pending
              </div>
            ) : applying === gig.id ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message to the venue..."
                  className="w-full px-3 py-2 bg-[#1E1E28] border border-[#2A2A36] rounded-lg text-sm placeholder-[#8888A0] focus:outline-none focus:border-purple-500/50 resize-none h-20"
                />
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleApply(gig.id)}
                    disabled={loading}
                    className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-1"
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-3 h-3" /> Submit Bid</>}
                  </motion.button>
                  <button onClick={() => setApplying(null)} className="px-3 py-2 bg-[#1E1E28] border border-[#2A2A36] rounded-lg text-sm text-[#8888A0]">
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="apply"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setApplying(gig.id)}
                className="w-full py-2 bg-purple-500/20 text-purple-400 font-semibold rounded-lg text-sm hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <Mic2 className="w-4 h-4" /> Apply / Submit Bid
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function StageMonitor() {
  const { songRequests } = useEncore();
  const sorted = [...songRequests].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-4">
      <div className="bg-[#16161D] border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <Monitor className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold">Live Stage Monitor</h3>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="text-xs text-[#8888A0]">Real-time song requests & tips from patrons</p>
      </div>

      <div className="space-y-3">
        {sorted.map((req, i) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium truncate">{req.songTitle}</h4>
              </div>
              <p className="text-xs text-[#8888A0]">from {req.patronName}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-bold text-emerald-400">${req.tipAmount}</span>
              <p className="text-[10px] text-[#8888A0]">
                {new Date(req.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {sorted.length > 0 && (
        <div className="bg-[#16161D] border border-[#2A2A36] rounded-xl p-4 text-center">
          <p className="text-sm text-[#8888A0]">Total Tips Tonight</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">
            ${sorted.reduce((s, r) => s + r.tipAmount, 0)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ArtistView() {
  const [tab, setTab] = useState<"dashboard" | "epk" | "marketplace" | "stage">("dashboard");

  const tabs = [
    { key: "dashboard" as const, label: "Home" },
    { key: "epk" as const, label: "EPK" },
    { key: "marketplace" as const, label: "Gigs" },
    { key: "stage" as const, label: "Stage" },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex gap-1 bg-[#16161D] rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? "bg-[#1E1E28] text-white" : "text-[#8888A0] hover:text-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <ArtistDashboard />}
      {tab === "epk" && <EPKProfile />}
      {tab === "marketplace" && <GigMarketplace />}
      {tab === "stage" && <StageMonitor />}
    </div>
  );
}
