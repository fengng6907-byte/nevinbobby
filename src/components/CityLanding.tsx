"use client";

import { useState, useCallback, useRef } from "react";
import { useEncore } from "@/context/EncoreContext";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  Mic2, Search, Heart, Calendar, MapPin, Star, Trophy,
  ChevronRight, Radio, Users, Wifi, Sparkles,
} from "lucide-react";
import SoundWave from "./SoundWave";

type ViewKey = "patron" | "artist" | "tipjar";

interface Landmark {
  id: string;
  label: string;
  sub: string;
  view: ViewKey;
  icon: typeof Mic2;
  /** chip position, % of scene container */
  x: number;
  y: number;
}

const landmarks: Landmark[] = [
  { id: "twin", label: "Main Stage", sub: "Live band rankings", view: "artist", icon: Mic2, x: 43, y: 26 },
  { id: "kltower", label: "Gig Finder", sub: "Discover bars & book tables", view: "patron", icon: Search, x: 66, y: 34 },
  { id: "merdeka", label: "Tip Jar", sub: "Request a song on stage", view: "tipjar", icon: Heart, x: 22, y: 20 },
];

/* ---------------------------------------------------------------- */
/*  Holographic skyline (decorative SVG)                            */
/* ---------------------------------------------------------------- */

function WindowGrid({ x, y, cols, rows, w = 5, h = 3, gapX = 9, gapY = 9 }: {
  x: number; y: number; cols: number; rows: number; w?: number; h?: number; gapX?: number; gapY?: number;
}) {
  return (
    <g fill="#6CF9FF">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={x + c * gapX}
            y={y + r * gapY}
            width={w}
            height={h}
            opacity={0.55}
            className="window-blink"
            style={{ animationDelay: `${((r * cols + c) % 7) * 0.8}s` }}
          />
        ))
      )}
    </g>
  );
}

function WifiBeacon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g stroke="#00D8FF" strokeWidth="2.5" fill="none" strokeLinecap="round">
      <circle cx={cx} cy={cy} r="2" fill="#00D8FF" stroke="none" />
      <path d={`M ${cx - 7} ${cy - 5} a 10 10 0 0 1 14 0`} className="wifi-wave" />
      <path d={`M ${cx - 12} ${cy - 9} a 17 17 0 0 1 24 0`} className="wifi-wave" style={{ animationDelay: "0.5s" }} />
    </g>
  );
}

function Avatar({ x, y, color = "#6CF9FF", delay = 0 }: { x: number; y: number; color?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="10" rx="10" ry="3.5" fill={color} opacity="0.25" className="beacon-pulse" style={{ animationDelay: `${delay}s` }} />
      <circle cx="0" cy="-6" r="3.2" fill={color} />
      <path d="M -3 8 L -3 0 Q 0 -3 3 0 L 3 8 Z" fill={color} opacity="0.9" />
    </g>
  );
}

function Skyline({ hovered }: { hovered: string | null }) {
  const glow = (id: string) => (hovered === id ? "url(#glow-strong)" : "url(#glow-soft)");
  const fill = "rgba(80, 130, 255, 0.14)";
  const fillHover = "rgba(0, 216, 255, 0.22)";
  const stroke = "#67E8F9";

  return (
    <svg
      viewBox="0 0 1000 640"
      className="w-full h-auto select-none"
      aria-hidden
      style={{ filter: "drop-shadow(0 30px 60px rgba(0,80,220,0.25))" }}
    >
      <defs>
        <filter id="glow-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-strong" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="platform-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A2C7A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#051545" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00D8FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#00D8FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00D8FF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip-twin1"><path d="M 415 190 L 449 190 L 445 420 L 419 420 Z" /></clipPath>
        <clipPath id="clip-twin2"><path d="M 471 190 L 505 190 L 501 420 L 475 420 Z" /></clipPath>
        <clipPath id="clip-merdeka"><path d="M 232 150 L 268 150 L 276 425 L 224 425 Z" /></clipPath>
      </defs>

      {/* ------ map platform ------ */}
      <g filter="url(#glow-soft)">
        <polygon points="500,330 950,478 500,626 50,478" fill="url(#platform-fill)" stroke="#22D3EE" strokeWidth="2" strokeOpacity="0.8" />
        <polygon points="500,342 926,478 500,614 74,478" fill="none" stroke="#6CF9FF" strokeWidth="0.6" strokeOpacity="0.35" />
      </g>

      {/* map streets */}
      <g stroke="#38BDF8" strokeOpacity="0.5" strokeWidth="1.4" fill="none">
        <path d="M 180 478 Q 400 400 500 478 T 830 478" />
        <path d="M 320 560 Q 480 470 660 545" />
        <path d="M 500 350 L 500 610" strokeOpacity="0.25" />
        <path d="M 260 420 L 720 560" strokeOpacity="0.3" />
        <path d="M 720 420 L 300 560" strokeOpacity="0.3" />
      </g>

      {/* neon rim under platform */}
      <polygon points="500,336 944,478 500,620 56,478" fill="none" stroke="#00D8FF" strokeWidth="4" strokeOpacity="0.16" filter="url(#glow-strong)" />

      {/* ------ decorative blocks ------ */}
      <g stroke={stroke} strokeWidth="1.4" fill={fill} filter="url(#glow-soft)">
        <rect x="120" y="330" width="52" height="110" rx="3" />
        <rect x="620" y="300" width="46" height="130" rx="3" />
        <rect x="840" y="360" width="48" height="80" rx="3" />
        <rect x="740" y="330" width="40" height="105" rx="3" />
        {/* stage arena on the right */}
        <path d="M 700 452 a 55 20 0 0 1 110 0 l -12 26 a 43 15 0 0 1 -86 0 Z" />
      </g>
      <WindowGrid x={128} y={342} cols={4} rows={9} />
      <WindowGrid x={628} y={312} cols={4} rows={11} />
      <WindowGrid x={848} y={370} cols={4} rows={6} />
      <WindowGrid x={747} y={340} cols={3} rows={9} />

      {/* stage equalizer bars */}
      <g transform="translate(728 470)">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={i * 12}
            y={-24}
            width="6"
            height="24"
            rx="2"
            fill="#00D8FF"
            opacity="0.85"
            className="eq-bar"
            style={{ animationDelay: `${i * 0.13}s` }}
            filter="url(#glow-soft)"
          />
        ))}
      </g>

      {/* ------ Merdeka 118 — Tip Jar ------ */}
      <g filter={glow("merdeka")}>
        <path
          d="M 232 150 L 268 150 L 276 425 L 224 425 Z"
          fill={hovered === "merdeka" ? fillHover : fill}
          stroke={stroke}
          strokeWidth="1.6"
        />
        <path d="M 250 92 L 254 150 L 246 150 Z" fill={fill} stroke={stroke} strokeWidth="1.4" />
        <line x1="250" y1="60" x2="250" y2="92" stroke={stroke} strokeWidth="1.6" />
        <circle cx="250" cy="58" r="2.5" fill="#00D8FF" className="beacon-pulse" />
        <g clipPath="url(#clip-merdeka)">
          <path d="M 224 200 L 276 180 M 224 260 L 276 240 M 224 320 L 276 300 M 224 380 L 276 360" stroke={stroke} strokeWidth="0.8" strokeOpacity="0.6" />
          <rect x="220" y="140" width="60" height="60" fill="url(#scan)" className="building-scan" />
        </g>
      </g>
      <WifiBeacon cx={250} cy={44} />

      {/* ------ Petronas Twin Towers — Main Stage ------ */}
      <g filter={glow("twin")}>
        {[0, 1].map((t) => {
          const ox = t * 56;
          return (
            <g key={t}>
              <path
                d={`M ${415 + ox} 190 L ${449 + ox} 190 L ${445 + ox} 420 L ${419 + ox} 420 Z`}
                fill={hovered === "twin" ? fillHover : fill}
                stroke={stroke}
                strokeWidth="1.6"
              />
              <path d={`M ${424 + ox} 160 L ${440 + ox} 160 L ${443 + ox} 190 L ${421 + ox} 190 Z`} fill={fill} stroke={stroke} strokeWidth="1.4" />
              <line x1={432 + ox} y1={118} x2={432 + ox} y2={160} stroke={stroke} strokeWidth="1.6" />
              <circle cx={432 + ox} cy={116} r="2.5" fill="#00D8FF" className="beacon-pulse" style={{ animationDelay: `${t * 0.7}s` }} />
              <g clipPath={`url(#clip-twin${t + 1})`}>
                <path d={`M ${415 + ox} 230 h 40 M ${415 + ox} 270 h 40 M ${415 + ox} 310 h 40 M ${415 + ox} 350 h 40 M ${415 + ox} 390 h 40`} stroke={stroke} strokeWidth="0.8" strokeOpacity="0.65" />
                <rect x={410 + ox} y={180} width="48" height="56" fill="url(#scan)" className="building-scan" style={{ animationDelay: `${t * 1.2}s` }} />
              </g>
            </g>
          );
        })}
        {/* skybridge */}
        <rect x="447" y="292" width="26" height="7" rx="2" fill={fill} stroke={stroke} strokeWidth="1.2" />
      </g>
      <WifiBeacon cx={488} cy={100} />

      {/* ------ KL Tower — Gig Finder ------ */}
      <g filter={glow("kltower")}>
        <path d="M 655 240 L 665 240 L 672 420 L 648 420 Z" fill={hovered === "kltower" ? fillHover : fill} stroke={stroke} strokeWidth="1.5" />
        <ellipse cx="660" cy="228" rx="22" ry="14" fill={hovered === "kltower" ? fillHover : fill} stroke={stroke} strokeWidth="1.6" />
        <ellipse cx="660" cy="222" rx="14" ry="8" fill="none" stroke={stroke} strokeWidth="1" strokeOpacity="0.7" />
        <line x1="660" y1="172" x2="660" y2="214" stroke={stroke} strokeWidth="1.6" />
        <circle cx="660" cy="170" r="2.5" fill="#00D8FF" className="beacon-pulse" style={{ animationDelay: "0.4s" }} />
      </g>
      <WifiBeacon cx={660} cy={154} />

      {/* ------ venue pins on the map ------ */}
      {[
        { x: 320, y: 505, label: 0 },
        { x: 565, y: 528, label: 1 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="16" fill="none" stroke="#00D8FF" strokeWidth="1.5" className="beacon-pulse" style={{ animationDelay: `${i * 1.1}s` }} />
          <circle cx={p.x} cy={p.y} r="5" fill="#00D8FF" filter="url(#glow-soft)" />
        </g>
      ))}

      {/* ------ tiny musicians walking the city ------ */}
      <Avatar x={260} y={470} delay={0} />
      <Avatar x={420} y={455} color="#A78BFA" delay={0.6} />
      <Avatar x={510} y={565} color="#F0ABFC" delay={1.2} />
      <Avatar x={630} y={492} delay={1.8} />
      <Avatar x={780} y={520} color="#A78BFA" delay={2.4} />
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/*  Floating HUD panels                                              */
/* ---------------------------------------------------------------- */

function HudPanel({
  title, icon: Icon, onOpen, children, className = "", floatClass = "hud-float",
}: {
  title: string;
  icon: typeof Calendar;
  onOpen: () => void;
  children: React.ReactNode;
  className?: string;
  floatClass?: string;
}) {
  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-deep neon-ring rounded-3xl p-4 text-left w-full transition-shadow hover:glow-cyan ${floatClass} ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00D8FF]/15 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-[#6CF9FF]" />
          </div>
          <span className="text-xs font-semibold tracking-wide">{title}</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-[#8FA6E0]" />
      </div>
      {children}
    </motion.button>
  );
}

/* ---------------------------------------------------------------- */
/*  City landing                                                     */
/* ---------------------------------------------------------------- */

export default function CityLanding() {
  const { setActiveView, gigs, artists, venues, songRequests } = useEncore();
  const [hovered, setHovered] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-6, 6]);
  const rotateX = useTransform(sy, [0, 1], [4, -4]);
  const panelX = useTransform(sx, [0, 1], [10, -10]);
  const panelY = useTransform(sy, [0, 1], [6, -6]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduceMotion || !sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width);
      my.set((e.clientY - rect.top) / rect.height);
    },
    [mx, my, reduceMotion]
  );

  const openGigs = gigs.filter((g) => g.status === "open");
  const topArtists = [...artists].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const topVenues = venues.slice(0, 2);
  const totalTips = songRequests.reduce((s, r) => s + r.tipAmount, 0);

  return (
    <div className="max-w-7xl mx-auto" onMouseMove={onMouseMove}>
      {/* ------ hero heading over interactive sound wave ------ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center pt-6 pb-2 relative z-20"
      >
        {/* the wave sits behind the wordmark and reacts to mouse / touch */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
            <SoundWave height={170} />
          </div>
          <div className="relative pointer-events-none py-6">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5 text-[11px] tracking-[0.2em] uppercase text-[#8FA6E0]">
              <Sparkles className="w-3 h-3 text-[#6CF9FF]" />
              Living Digital City
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1
              className="text-5xl sm:text-7xl font-bold tracking-[0.18em] text-glow bg-clip-text text-transparent bg-gradient-to-b from-white via-[#BFEFFF] to-[#00D8FF]"
              style={{ fontFamily: "var(--font-grotesk)" }}
            >
              ENCORE
            </h1>
          </div>
        </div>
        <p className="text-sm text-[#8FA6E0] mt-1 max-w-md mx-auto">
          The entire live music scene inside one interactive digital world.
          Tap a landmark to enter its district.
        </p>
      </motion.div>

      {/* ------ interactive city scene ------ */}
      <div ref={sceneRef} className="relative" style={{ perspective: 1400 }}>
        <motion.div
          style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative max-w-4xl mx-auto"
        >
          <Skyline hovered={hovered} />

          {/* landmark chips */}
          {landmarks.map((lm, i) => (
            <motion.button
              key={lm.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView(lm.view)}
              onMouseEnter={() => setHovered(lm.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(lm.id)}
              onBlur={() => setHovered(null)}
              aria-label={`${lm.label} — ${lm.sub}`}
              className="absolute -translate-x-1/2 glass rounded-2xl pl-2 pr-3 py-1.5 flex items-center gap-2 cursor-pointer hover:glow-cyan transition-shadow"
              style={{ left: `${lm.x}%`, top: `${lm.y}%` }}
            >
              <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00D8FF] to-[#5A68FF] flex items-center justify-center shrink-0">
                <lm.icon className="w-3 h-3 text-[#02102E]" />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[11px] font-bold whitespace-nowrap">{lm.label}</span>
                <span className="block text-[9px] text-[#8FA6E0] whitespace-nowrap">{lm.sub}</span>
              </span>
            </motion.button>
          ))}

          {/* bar tags on the map */}
          {[
            { x: 32, y: 78 },
            { x: 56.5, y: 82 },
          ].map((p, i) => (
            <button
              key={i}
              onClick={() => setActiveView("patron")}
              className="absolute -translate-x-1/2 glass rounded-full px-2.5 py-1 flex items-center gap-1.5 text-[9px] font-semibold text-[#BFEFFF] hover:glow-cyan transition-shadow"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label="Open bar discovery"
            >
              <Wifi className="w-2.5 h-2.5 text-[#00D8FF]" />
              Bands Bar
            </button>
          ))}
        </motion.div>

        {/* ------ floating HUD panels (desktop) ------ */}
        <motion.div
          style={reduceMotion ? undefined : { x: panelX, y: panelY }}
          className="hidden lg:block"
        >
          <div className="absolute left-0 top-6 w-60">
            <HudPanel title="Live Gigs" icon={Radio} onOpen={() => setActiveView("artist")} floatClass="hud-float">
              <div className="space-y-2">
                {openGigs.slice(0, 2).map((g) => (
                  <div key={g.id} className="flex items-center gap-2.5 rounded-xl bg-white/5 px-2.5 py-2">
                    <div className="w-8 h-8 rounded-lg bg-[#5A68FF]/25 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[#6CF9FF] font-mono">{g.date.slice(8)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold truncate">{g.venueName}</p>
                      <p className="text-[9px] text-[#8FA6E0]">{g.genre} · {g.time} · {g.pay}</p>
                    </div>
                  </div>
                ))}
              </div>
            </HudPanel>
          </div>

          <div className="absolute left-2 bottom-10 w-60">
            <HudPanel title="Band Profiles" icon={Users} onOpen={() => setActiveView("artist")} floatClass="hud-float-slow">
              <div className="flex gap-2">
                {topArtists.map((a) => (
                  <div key={a.id} className="flex-1 rounded-xl bg-white/5 p-2 text-center min-w-0">
                    <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-[#00D8FF] to-[#5A68FF] flex items-center justify-center text-[11px] font-bold text-[#02102E]">
                      {a.name.charAt(0)}
                    </div>
                    <p className="text-[9px] font-semibold mt-1.5 truncate">{a.name}</p>
                    <p className="text-[8px] text-amber-400 flex items-center justify-center gap-0.5">
                      <Star className="w-2 h-2 fill-amber-400" />{a.rating}
                    </p>
                  </div>
                ))}
              </div>
            </HudPanel>
          </div>

          <div className="absolute right-0 top-4 w-60">
            <HudPanel title="Venue Search" icon={MapPin} onOpen={() => setActiveView("patron")} floatClass="hud-float-slower">
              <div className="space-y-2">
                {topVenues.map((v) => (
                  <div key={v.id} className="flex items-center gap-2.5 rounded-xl bg-white/5 px-2.5 py-2">
                    <MapPin className="w-3.5 h-3.5 text-[#6CF9FF] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold truncate">{v.name}</p>
                      <p className="text-[9px] text-[#8FA6E0]">{v.distance} · ★ {v.rating}</p>
                    </div>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">LIVE</span>
                  </div>
                ))}
              </div>
            </HudPanel>
          </div>

          <div className="absolute right-2 bottom-14 w-60">
            <HudPanel title="Tip Jar Tonight" icon={Trophy} onOpen={() => setActiveView("tipjar")} floatClass="hud-float">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold font-mono text-[#6CF9FF] text-glow">${totalTips}</p>
                  <p className="text-[9px] text-[#8FA6E0] mt-0.5">{songRequests.length} song requests sent</p>
                </div>
                <Heart className="w-6 h-6 text-[#5A68FF]" />
              </div>
            </HudPanel>
          </div>
        </motion.div>
      </div>

      {/* ------ HUD panels stacked (mobile / tablet) ------ */}
      <div className="lg:hidden grid sm:grid-cols-2 gap-3 mt-6 px-1">
        <HudPanel title="Live Gigs" icon={Radio} onOpen={() => setActiveView("artist")} floatClass="">
          <div className="space-y-2">
            {openGigs.slice(0, 2).map((g) => (
              <div key={g.id} className="flex items-center gap-2.5 rounded-xl bg-white/5 px-2.5 py-2">
                <div className="w-8 h-8 rounded-lg bg-[#5A68FF]/25 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-[#6CF9FF] font-mono">{g.date.slice(8)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold truncate">{g.venueName}</p>
                  <p className="text-[9px] text-[#8FA6E0]">{g.genre} · {g.time} · {g.pay}</p>
                </div>
              </div>
            ))}
          </div>
        </HudPanel>
        <HudPanel title="Venue Search" icon={MapPin} onOpen={() => setActiveView("patron")} floatClass="">
          <div className="space-y-2">
            {topVenues.map((v) => (
              <div key={v.id} className="flex items-center gap-2.5 rounded-xl bg-white/5 px-2.5 py-2">
                <MapPin className="w-3.5 h-3.5 text-[#6CF9FF] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold truncate">{v.name}</p>
                  <p className="text-[9px] text-[#8FA6E0]">{v.distance} · ★ {v.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </HudPanel>
        <HudPanel title="Band Profiles" icon={Users} onOpen={() => setActiveView("artist")} floatClass="">
          <div className="flex gap-2">
            {topArtists.map((a) => (
              <div key={a.id} className="flex-1 rounded-xl bg-white/5 p-2 text-center min-w-0">
                <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-[#00D8FF] to-[#5A68FF] flex items-center justify-center text-[11px] font-bold text-[#02102E]">
                  {a.name.charAt(0)}
                </div>
                <p className="text-[9px] font-semibold mt-1.5 truncate">{a.name}</p>
              </div>
            ))}
          </div>
        </HudPanel>
        <HudPanel title="Tip Jar Tonight" icon={Trophy} onOpen={() => setActiveView("tipjar")} floatClass="">
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold font-mono text-[#6CF9FF]">${totalTips}</p>
            <Heart className="w-6 h-6 text-[#5A68FF]" />
          </div>
        </HudPanel>
      </div>

      {/* ------ module quick-launch row ------ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-3 mt-8 pb-10"
      >
        {landmarks.map((lm) => (
          <motion.button
            key={lm.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveView(lm.view)}
            className="glass neon-ring rounded-2xl px-5 py-3 flex items-center gap-3 hover:glow-cyan transition-shadow"
          >
            <lm.icon className="w-4 h-4 text-[#6CF9FF]" />
            <span className="text-sm font-semibold">{lm.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8FA6E0]" />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
