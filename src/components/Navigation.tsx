"use client";

import { useEncore } from "@/context/EncoreContext";
import { Music, Mic2, Heart, Building2, Search } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { key: "city" as const, label: "City", icon: Building2 },
  { key: "patron" as const, label: "Discover", icon: Search },
  { key: "artist" as const, label: "Live Bands", icon: Mic2 },
  { key: "tipjar" as const, label: "Tip Jar", icon: Heart },
];

export default function Navigation() {
  const { activeView, setActiveView } = useEncore();

  return (
    <nav className="sticky top-3 z-50 px-3">
      <div className="max-w-3xl mx-auto hud-glass rounded-2xl flex items-center justify-between h-14 px-3">
        <button
          onClick={() => setActiveView("city")}
          className="flex items-center gap-2 pl-1"
          aria-label="ENCORE home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00D8FF] to-[#5A68FF] flex items-center justify-center glow-cyan">
            <Music className="w-4 h-4 text-[#02102E]" />
          </div>
          <span className="text-base font-bold tracking-[0.14em] text-glow hidden xs:inline sm:inline">ENCORE</span>
        </button>

        <div className="flex items-center gap-1 bg-[#03102E]/40 rounded-xl p-1">
          {tabs.map((tab) => {
            const active = activeView === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-[#8FA6E0] hover:text-white/80"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-[#00F0FF]/12 border border-[#00F0FF]/40 wave-glow"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <tab.icon className={`w-4 h-4 ${active ? "text-[#00F0FF]" : ""}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
