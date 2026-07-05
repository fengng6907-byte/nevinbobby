"use client";

import { useState, useEffect } from "react";
import { useEncore, GooglePlaceVenue } from "@/context/EncoreContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music, Send, DollarSign, CheckCircle2, MapPin, ChevronDown, Star, Search
} from "lucide-react";
import SoundWave from "./SoundWave";

interface BarOption {
  id: string;
  name: string;
  address: string;
  rating: number;
}

export default function TipJarView() {
  const { venues, sendSongRequest } = useEncore();
  const [songTitle, setSongTitle] = useState("");
  const [tipAmount, setTipAmount] = useState(10);
  const [patronName, setPatronName] = useState("");
  const [sent, setSent] = useState(false);
  const [selectedBar, setSelectedBar] = useState<BarOption | null>(null);
  const [barPickerOpen, setBarPickerOpen] = useState(false);
  const [barSearch, setBarSearch] = useState("");
  const [allBars, setAllBars] = useState<BarOption[]>([]);

  useEffect(() => {
    const encoreBars: BarOption[] = venues.map((v) => ({
      id: v.id,
      name: v.name,
      address: v.address,
      rating: v.rating,
    }));

    fetch("/api/places")
      .then((r) => r.json())
      .then((data) => {
        const placeBars: BarOption[] = (data.venues || []).map((p: GooglePlaceVenue) => ({
          id: p.place_id,
          name: p.name,
          address: p.address,
          rating: p.rating,
        }));
        const seen = new Set(encoreBars.map((b) => b.name.toLowerCase()));
        const merged = [
          ...encoreBars,
          ...placeBars.filter((p) => !seen.has(p.name.toLowerCase())),
        ];
        setAllBars(merged);
      })
      .catch(() => {
        setAllBars(encoreBars);
      });
  }, [venues]);

  const filteredBars = allBars.filter((b) => {
    if (!barSearch) return true;
    const q = barSearch.toLowerCase();
    return b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q);
  });

  const handleSend = () => {
    if (!songTitle.trim() || !patronName.trim() || !selectedBar) return;
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
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-gradient-to-r from-amber-900/40 via-orange-900/30 to-rose-900/40 border border-[#24408F] rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Music className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Song Request & Tip</h2>
            <p className="text-xs text-[#8FA6E0]">Send a request to the band on stage</p>
          </div>
        </div>
        <SoundWave height={48} className="mt-2 -mb-1" />
      </div>

      <div className="glass-deep rounded-xl p-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#8FA6E0] uppercase tracking-wider mb-2 block">
            Which bar are you at?
          </label>
          <div className="relative">
            <button
              onClick={() => setBarPickerOpen(!barPickerOpen)}
              className={`w-full px-4 py-3 bg-[#0E1F5C] border rounded-xl text-sm text-left flex items-center justify-between transition-colors ${
                barPickerOpen ? "border-cyan-400/50" : "border-[#24408F]"
              }`}
            >
              {selectedBar ? (
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span className="truncate font-medium">{selectedBar.name}</span>
                </div>
              ) : (
                <span className="text-[#8FA6E0]">Select your bar...</span>
              )}
              <ChevronDown className={`w-4 h-4 text-[#8FA6E0] shrink-0 transition-transform ${barPickerOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {barPickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-20 top-full mt-2 left-0 right-0 bg-[#0E1F5C] border border-[#24408F] rounded-xl overflow-hidden shadow-xl shadow-black/40"
                >
                  <div className="p-2 border-b border-[#24408F]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8FA6E0]" />
                      <input
                        type="text"
                        placeholder="Search bars..."
                        value={barSearch}
                        onChange={(e) => setBarSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 glass-deep rounded-lg text-xs placeholder-[#8FA6E0] focus:outline-none focus:border-cyan-400/50"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredBars.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-[#8FA6E0]">No bars found</div>
                    ) : (
                      filteredBars.map((bar) => (
                        <button
                          key={bar.id}
                          onClick={() => {
                            setSelectedBar(bar);
                            setBarPickerOpen(false);
                            setBarSearch("");
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-[#0A1748] transition-colors flex items-center gap-3 ${
                            selectedBar?.id === bar.id ? "bg-cyan-400/10" : ""
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{bar.name}</div>
                            <div className="text-[10px] text-[#8FA6E0] truncate">{bar.address}</div>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-[11px] text-amber-400">{bar.rating}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#8FA6E0] uppercase tracking-wider mb-2 block">Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={patronName}
            onChange={(e) => setPatronName(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0E1F5C] border border-[#24408F] rounded-xl text-sm placeholder-[#8FA6E0] focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#8FA6E0] uppercase tracking-wider mb-2 block">Song Request</label>
          <input
            type="text"
            placeholder="Song title or request..."
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0E1F5C] border border-[#24408F] rounded-xl text-sm placeholder-[#8FA6E0] focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#8FA6E0] uppercase tracking-wider mb-2 block">Tip Amount</label>
          <div className="flex gap-2">
            {[5, 10, 20].map((amt) => (
              <button
                key={amt}
                onClick={() => setTipAmount(amt)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                  tipAmount === amt
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-[#0E1F5C] text-[#8FA6E0] border border-[#24408F] hover:border-[#2E4A9E]"
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
              <CheckCircle2 className="w-4 h-4" /> Request Sent to {selectedBar?.name}!
            </motion.div>
          ) : (
            <motion.button
              key="send"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSend}
              disabled={!songTitle.trim() || !patronName.trim() || !selectedBar}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-xl disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Request — ${tipAmount}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {selectedBar && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-deep rounded-xl p-4 flex items-center gap-3"
        >
          <MapPin className="w-4 h-4 text-cyan-300 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{selectedBar.name}</div>
            <div className="text-xs text-[#8FA6E0] truncate">{selectedBar.address}</div>
          </div>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-amber-400">{selectedBar.rating}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
