"use client";

import { useEncore } from "@/context/EncoreContext";
import { Music, Building2, Mic2 } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { key: "patron" as const, label: "Patron", icon: Music, color: "text-purple-400" },
  { key: "venue" as const, label: "Venue", icon: Building2, color: "text-amber-400" },
  { key: "artist" as const, label: "Artist", icon: Mic2, color: "text-emerald-400" },
];

export default function Navigation() {
  const { activeView, setActiveView } = useEncore();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2A2A36] bg-[#0D0D11]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">ENCORE</span>
        </div>

        <div className="flex items-center gap-1 bg-[#16161D] rounded-xl p-1">
          {tabs.map((tab) => {
            const active = activeView === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-[#8888A0] hover:text-white/70"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#1E1E28] rounded-lg border border-[#2A2A36]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <tab.icon className={`w-4 h-4 ${active ? tab.color : ""}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-[#8888A0] hidden md:block">Interactive Prototype</div>
      </div>
    </nav>
  );
}
