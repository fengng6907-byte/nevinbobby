"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Guitar, Mic2, Drum, UserRound, CheckCircle2, Sparkles } from "lucide-react";

const instruments = [
  { key: "guitar", label: "Guitar", icon: Guitar },
  { key: "vocals", label: "Vocals", icon: Mic2 },
  { key: "drums", label: "Drums", icon: Drum },
] as const;

/** Wireframe 3D-mesh style avatar head, drawn as glowing SVG lattice */
function WireframeHead({ style, hair }: { style: number; hair: number }) {
  const squash = 0.55 + (style / 100) * 0.25; // face shape follows Style slider
  const hairLift = (hair / 100) * 14;

  return (
    <svg viewBox="0 0 160 180" className="w-full h-auto" aria-hidden>
      <defs>
        <filter id="mesh-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        stroke="#00F0FF"
        strokeWidth="0.9"
        fill="none"
        filter="url(#mesh-glow)"
        opacity="0.9"
      >
        {/* head outline */}
        <ellipse cx="80" cy="78" rx="42" ry="52" />
        {/* latitude rings */}
        {[0.35, 0.55, 0.75].map((f) => (
          <ellipse key={f} cx="80" cy={78 - 52 + f * 104} rx={42 * Math.sin(Math.PI * f)} ry={7 * squash} />
        ))}
        {/* longitude rings */}
        {[0.3, 0.6, 1].map((f) => (
          <ellipse key={f} cx="80" cy="78" rx={42 * f * 0.62} ry="52" />
        ))}
        {/* hair crest — rises with the Hair slider */}
        <path
          d={`M 46 52 Q 80 ${18 - hairLift} 114 52`}
          stroke="#FF007F"
          strokeWidth="1.3"
        />
        <path
          d={`M 54 42 Q 80 ${8 - hairLift} 106 42`}
          stroke="#FF007F"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* shoulders */}
        <path d="M 28 168 Q 46 132 80 132 Q 114 132 132 168" />
        <path d="M 40 168 Q 56 142 80 142 Q 104 142 120 168" opacity="0.5" />
      </g>
      {/* scan line */}
      <rect x="30" y="20" width="100" height="30" fill="url(#avatar-scan)" className="building-scan" opacity="0.5" />
      <defs>
        <linearGradient id="avatar-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AvatarStudio({ className = "" }: { className?: string }) {
  const [style, setStyle] = useState(62);
  const [hair, setHair] = useState(40);
  const [instrument, setInstrument] = useState<string>("guitar");
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    setCreated(true);
    setTimeout(() => setCreated(false), 2200);
  };

  return (
    <div className={`hud-glass rounded-3xl p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/15 flex items-center justify-center">
          <UserRound className="w-3.5 h-3.5 text-[#00F0FF]" />
        </div>
        <span className="text-xs font-semibold tracking-wide">Create Your Character</span>
      </div>

      {/* wireframe mesh preview */}
      <div className="rounded-2xl bg-[#020410]/60 border border-[#0072FF]/30 p-3 mb-4 hud-float-slow">
        <WireframeHead style={style} hair={hair} />
      </div>

      {/* instrument chips */}
      <p className="text-[10px] uppercase tracking-[0.18em] text-[#8FA6E0] mb-2">Instrument</p>
      <div className="flex gap-2 mb-4">
        {instruments.map((inst) => {
          const active = instrument === inst.key;
          return (
            <button
              key={inst.key}
              onClick={() => setInstrument(inst.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all duration-300 ease-elastic ${
                active
                  ? "border-[#00F0FF]/70 bg-[#00F0FF]/10 text-[#00F0FF] wave-glow"
                  : "border-[#1A365D] bg-[#0A1432]/40 text-[#8FA6E0] hover:border-[#0072FF]/60 hover:text-white"
              }`}
            >
              <inst.icon className="w-4 h-4" />
              <span className="text-[9px] font-semibold">{inst.label}</span>
            </button>
          );
        })}
      </div>

      {/* cyberpunk sliders */}
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#8FA6E0]">Style</span>
            <span className="text-[10px] font-mono text-[#00F0FF]">{style}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={style}
            onChange={(e) => setStyle(Number(e.target.value))}
            className="cyber-range"
            aria-label="Avatar style"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#8FA6E0]">Hair</span>
            <span className="text-[10px] font-mono text-[#00F0FF]">{hair}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={hair}
            onChange={(e) => setHair(Number(e.target.value))}
            className="cyber-range"
            aria-label="Avatar hair"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {created ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full py-2.5 rounded-xl bg-[#FF007F]/15 border border-[#FF007F]/50 text-[#FF9FCB] text-xs font-semibold flex items-center justify-center gap-2 wave-glow-magenta"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Avatar Synced to Stage
          </motion.div>
        ) : (
          <motion.button
            key="create"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCreate}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0072FF] to-[#00F0FF] text-[#020410] text-xs font-bold flex items-center justify-center gap-2 transition-shadow duration-300 ease-elastic hover:wave-glow"
          >
            <Sparkles className="w-3.5 h-3.5" /> Create
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
