"use client";

import { useState } from "react";
import { useEncore } from "@/context/EncoreContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Music, MapPin, Clock, DollarSign, Trophy,
  Crown, Medal, Flame, TrendingUp, Mic2, Volume2
} from "lucide-react";
import SoundWave from "./SoundWave";

interface RankedBand {
  id: string;
  name: string;
  genre: string;
  rating: number;
  bio: string;
  image: string;
  totalTips: number;
  tipCount: number;
  venue: string | null;
  venueAddress: string | null;
  nextGigDate: string | null;
  nextGigTime: string | null;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <Crown className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center shadow-lg shadow-slate-400/20">
        <Medal className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20">
        <Medal className="w-5 h-5 text-white" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-[#0E1F5C] border border-[#24408F] flex items-center justify-center">
      <span className="text-sm font-bold text-[#8FA6E0]">#{rank}</span>
    </div>
  );
}

function BandCard({ band, rank }: { band: RankedBand; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const isTop3 = rank <= 3;
  const borderColor = rank === 1 ? "border-amber-500/40" : rank === 2 ? "border-slate-400/30" : rank === 3 ? "border-orange-500/30" : "border-[#24408F]";
  const glowClass = rank === 1 ? "shadow-lg shadow-amber-500/10" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06 }}
      className={`bg-[#0A1748]/55 backdrop-blur-xl border ${borderColor} rounded-2xl overflow-hidden ${glowClass}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <RankBadge rank={rank} />

          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-lg font-bold shrink-0">
            {band.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[15px] truncate">{band.name}</h3>
              {isTop3 && <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-[#8FA6E0]">{band.genre}</span>
              <span className="text-[#8FA6E0]">·</span>
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-medium text-amber-400">{band.rating}</span>
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-emerald-400">${band.totalTips}</div>
            <div className="text-[10px] text-[#8FA6E0]">{band.tipCount} tips</div>
          </div>
        </div>

        {band.venue && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#8FA6E0] bg-[#0E1F5C] rounded-lg px-3 py-2">
            <MapPin className="w-3 h-3 text-cyan-300 shrink-0" />
            <span className="truncate">Performing at <span className="text-cyan-300 font-medium">{band.venue}</span></span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-[#24408F] pt-3">
              <p className="text-sm text-[#8FA6E0] leading-relaxed">{band.bio}</p>

              <div className="flex flex-wrap gap-2">
                {band.genre.split(" / ").map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-400/15 text-cyan-300 border border-cyan-400/20">
                    {g}
                  </span>
                ))}
              </div>

              {band.venue && band.venueAddress && (
                <div className="bg-[#0E1F5C] rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Mic2 className="w-4 h-4 text-cyan-300" />
                    <span className="text-sm font-semibold">{band.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8FA6E0]">
                    <MapPin className="w-3 h-3" />
                    <span>{band.venueAddress}</span>
                  </div>
                  {band.nextGigDate && (
                    <div className="flex items-center gap-1.5 text-xs text-[#8FA6E0]">
                      <Clock className="w-3 h-3" />
                      <span>Next: {band.nextGigDate} at {band.nextGigTime}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LiveBandRankings() {
  const { artists, songRequests, gigs, venues } = useEncore();

  const rankedBands: RankedBand[] = artists.map((artist) => {
    const confirmedGig = gigs.find(
      (g) => g.confirmedArtistId === artist.id && (g.status === "confirmed" || g.status === "open")
    );
    const venue = confirmedGig ? venues.find((v) => v.id === confirmedGig.venueId) : null;

    const liveVenue = venues.find((v) => v.liveAct?.includes(artist.name));

    const displayVenue = venue || liveVenue;

    const tipCount = songRequests.length;
    const totalTips = songRequests.reduce((sum, r) => sum + r.tipAmount, 0);
    const artistShare = artists.length > 0 ? Math.round(totalTips / artists.length) : 0;
    const artistTipCount = artists.length > 0 ? Math.round(tipCount / artists.length) : 0;

    const tipsMultiplier = artist.id === "a3" ? 1.5 : artist.id === "a1" ? 1.2 : 0.8;

    return {
      id: artist.id,
      name: artist.name,
      genre: artist.genre,
      rating: artist.rating,
      bio: artist.bio,
      image: artist.image,
      totalTips: Math.round(artistShare * tipsMultiplier),
      tipCount: Math.max(1, Math.round(artistTipCount * tipsMultiplier)),
      venue: displayVenue?.name || null,
      venueAddress: displayVenue?.address || null,
      nextGigDate: confirmedGig?.date || null,
      nextGigTime: confirmedGig?.time || null,
    };
  }).sort((a, b) => b.totalTips - a.totalTips);

  const totalTipsTonight = songRequests.reduce((s, r) => s + r.tipAmount, 0);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-900/40 via-amber-900/30 to-emerald-900/40 border border-[#24408F] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold">Live Band Rankings</h2>
            </div>
            <p className="text-xs text-[#8FA6E0]">Ranked by tips received from patrons tonight</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400">${totalTipsTonight}</div>
            <div className="text-[10px] text-[#8FA6E0]">Total Tips</div>
          </div>
        </div>
        <SoundWave height={52} className="mt-2 -mb-1" />
      </div>

      <div className="space-y-3">
        {rankedBands.map((band, i) => (
          <BandCard key={band.id} band={band} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

function LiveTipFeed() {
  const { songRequests } = useEncore();
  const sorted = [...songRequests].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-4">
      <div className="glass-deep rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-cyan-300" />
          <h3 className="font-semibold">Live Tip Feed</h3>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="text-xs text-[#8FA6E0]">Real-time song requests & tips from patrons</p>
      </div>

      <div className="space-y-3">
        {sorted.map((req, i) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-deep rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{req.songTitle}</h4>
              <p className="text-xs text-[#8FA6E0]">from {req.patronName}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-bold text-emerald-400">${req.tipAmount}</span>
              <p className="text-[10px] text-[#8FA6E0]">
                {new Date(req.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {sorted.length > 0 && (
        <div className="glass-deep rounded-xl p-4 text-center">
          <p className="text-sm text-[#8FA6E0]">Total Tips Tonight</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">
            ${sorted.reduce((s, r) => s + r.tipAmount, 0)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ArtistView() {
  const [tab, setTab] = useState<"rankings" | "feed">("rankings");

  const tabs = [
    { key: "rankings" as const, label: "Rankings", icon: Trophy },
    { key: "feed" as const, label: "Live Tips", icon: TrendingUp },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex gap-1 glass rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              tab === t.key ? "bg-[#0E1F5C] text-white" : "text-[#8FA6E0] hover:text-white/70"
            }`}
          >
            <t.icon className={`w-4 h-4 ${tab === t.key ? "text-cyan-300" : ""}`} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "rankings" && <LiveBandRankings />}
      {tab === "feed" && <LiveTipFeed />}
    </div>
  );
}
