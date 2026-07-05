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
  Mic2, Search, Heart, MapPin, Star, Trophy,
  ChevronRight, Radio, Users, Sparkles,
} from "lucide-react";
import SoundWave from "./SoundWave";
import WaveTerrain from "./WaveTerrain";
import AvatarStudio from "./AvatarStudio";

type ViewKey = "patron" | "artist" | "tipjar";

interface Landmark {
  id: string;
  label: string;
  sub: string;
  view: ViewKey;
  icon: typeof Mic2;
  /** chip position, % of terrain container */
  x: number;
  y: number;
}

const landmarks: Landmark[] = [
  { id: "stage", label: "Main Stage", sub: "Live band rankings", view: "artist", icon: Mic2, x: 30, y: 14 },
  { id: "finder", label: "Gig Finder", sub: "Discover bars & book tables", view: "patron", icon: Search, x: 70, y: 20 },
  { id: "tipjar", label: "Tip Jar", sub: "Request a song on stage", view: "tipjar", icon: Heart, x: 50, y: 66 },
];

const VENUE_PINS = [
  { x: -0.42, z: 0.28 },
  { x: 0.18, z: 0.16 },
  { x: 0.52, z: 0.42 },
  { x: -0.12, z: 0.55 },
];

/* -------- tiny audio visualizer used inside HUD widgets -------- */
function MiniVisualizer({ magenta = false }: { magenta?: boolean }) {
  return (
    <span className="flex items-end gap-[2px] h-3.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-[3px] rounded-sm eq-bar ${magenta ? "bg-[#FF007F]" : "bg-[#00F0FF]"}`}
          style={{ height: "100%", animationDelay: `${i * 0.13}s`, animationDuration: `${0.7 + (i % 3) * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function HudPanel({
  title, icon: Icon, onOpen, children, className = "", floatClass = "hud-float", visualizer = false,
}: {
  title: string;
  icon: typeof Radio;
  onOpen?: () => void;
  children: React.ReactNode;
  className?: string;
  floatClass?: string;
  visualizer?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      className={`hud-glass rounded-3xl p-4 text-left w-full transition-shadow duration-500 ease-elastic ${floatClass} ${className} ${onOpen ? "cursor-pointer" : ""}`}
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={onOpen ? (e) => { if (e.key === "Enter") onOpen(); } : undefined}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/15 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-[#00F0FF]" />
          </div>
          <span className="text-xs font-semibold tracking-wide">{title}</span>
          {visualizer && <MiniVisualizer />}
        </div>
        {onOpen && <ChevronRight className="w-3.5 h-3.5 text-[#8FA6E0]" />}
      </div>
      {children}
    </motion.div>
  );
}

/* -------- left-stack widgets, fed by live app data -------- */

function LiveGigsWidget({ onOpen }: { onOpen: () => void }) {
  const { gigs } = useEncore();
  const list = [...gigs].slice(0, 3);
  return (
    <HudPanel title="Live Gigs" icon={Radio} onOpen={onOpen} floatClass="hud-float" visualizer>
      <div className="space-y-2">
        {list.map((g) => {
          const live = g.status === "confirmed";
          return (
            <div key={g.id} className="flex items-center gap-2.5 rounded-xl bg-[#020410]/50 border border-[#1A365D]/70 px-2.5 py-2">
              <div className="w-8 h-8 rounded-lg bg-[#0072FF]/20 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[#00F0FF] font-mono">{g.date.slice(8)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold truncate">{g.venueName}</p>
                <p className="text-[9px] text-[#8FA6E0]">{g.genre} · {g.time} · {g.pay}</p>
              </div>
              <span
                className={`shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded-md ${
                  live ? "live-badge" : "text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/35"
                }`}
              >
                {live ? "LIVE NOW" : "OPEN"}
              </span>
            </div>
          );
        })}
      </div>
    </HudPanel>
  );
}

function VenueSearchWidget({ onOpen }: { onOpen: () => void }) {
  const { venues } = useEncore();
  return (
    <HudPanel title="Venue Search" icon={MapPin} onOpen={onOpen} floatClass="hud-float-slow">
      <div className="space-y-2">
        {venues.slice(0, 2).map((v) => (
          <div key={v.id} className="flex items-center gap-2.5 rounded-xl bg-[#020410]/50 border border-[#1A365D]/70 px-2.5 py-2">
            <MapPin className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold truncate">{v.name}</p>
              <p className="text-[9px] text-[#8FA6E0]">{v.distance} · ★ {v.rating}</p>
            </div>
            <MiniVisualizer magenta />
          </div>
        ))}
      </div>
    </HudPanel>
  );
}

function BandPerformanceWidget({ onOpen }: { onOpen: () => void }) {
  const { artists } = useEncore();
  const top = [...artists].sort((a, b) => b.rating - a.rating).slice(0, 3);
  return (
    <HudPanel title="Band Performance" icon={Users} onOpen={onOpen} floatClass="" visualizer>
      <div className="flex gap-2">
        {top.map((a) => (
          <div key={a.id} className="flex-1 rounded-xl bg-[#020410]/50 border border-[#1A365D]/70 p-2 text-center min-w-0">
            <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-[#00F0FF] to-[#0072FF] flex items-center justify-center text-[11px] font-bold text-[#020410]">
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
  );
}

function TipJarWidget({ onOpen }: { onOpen: () => void }) {
  const { songRequests } = useEncore();
  const total = songRequests.reduce((s, r) => s + r.tipAmount, 0);
  return (
    <HudPanel title="Tip Jar Tonight" icon={Trophy} onOpen={onOpen} floatClass="">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold font-mono text-[#00F0FF] text-glow">${total}</p>
          <p className="text-[9px] text-[#8FA6E0] mt-0.5">{songRequests.length} song requests sent</p>
        </div>
        <Heart className="w-6 h-6 text-[#FF007F]" />
      </div>
    </HudPanel>
  );
}

/* ---------------------------------------------------------------- */

export default function CityLanding() {
  const { setActiveView } = useEncore();
  const [cityView, setCityView] = useState<"kl" | "sg">("kl");
  const reduceMotion = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const panelX = useTransform(sx, [0, 1], [8, -8]);
  const panelY = useTransform(sy, [0, 1], [5, -5]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduceMotion || !sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width);
      my.set((e.clientY - rect.top) / rect.height);
    },
    [mx, my, reduceMotion]
  );

  return (
    <div className="max-w-7xl mx-auto" onMouseMove={onMouseMove}>
      {/* ------ hero heading over interactive sound wave ------ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center pt-6 pb-2 relative z-20"
      >
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
            <SoundWave height={170} />
          </div>
          <div className="relative pointer-events-none py-6">
            <div className="inline-flex items-center gap-2 hud-glass rounded-full px-4 py-1.5 mb-5 text-[11px] tracking-[0.2em] uppercase text-[#8FA6E0]">
              <Sparkles className="w-3 h-3 text-[#00F0FF]" />
              Futuristic Waze
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] animate-pulse" />
            </div>
            <h1
              className="text-5xl sm:text-7xl font-bold tracking-[0.18em] text-glow bg-clip-text text-transparent bg-gradient-to-b from-white via-[#BFEFFF] to-[#00F0FF]"
              style={{ fontFamily: "var(--font-grotesk)" }}
            >
              ENCORE
            </h1>
          </div>
        </div>
        <p className="text-sm text-[#8FA6E0] mt-1 max-w-md mx-auto">
          The entire live music scene inside one interactive digital world.
        </p>

        {/* KL / SG viewport toggle */}
        <div className="inline-flex items-center gap-1 hud-glass rounded-full p-1 mt-4">
          {([
            { key: "kl" as const, label: "Kuala Lumpur" },
            { key: "sg" as const, label: "Singapore" },
          ]).map((c) => (
            <button
              key={c.key}
              onClick={() => setCityView(c.key)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-500 ease-elastic ${
                cityView === c.key
                  ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/50 wave-glow"
                  : "text-[#8FA6E0] border border-transparent hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ------ audio-reactive terrain HUD ------ */}
      <div ref={sceneRef} className="relative mt-2">
        <div className="grid lg:grid-cols-[240px_1fr_250px] gap-4 items-start">
          {/* left HUD stack */}
          <motion.div
            style={reduceMotion ? undefined : { x: panelX, y: panelY }}
            className="hidden lg:flex flex-col gap-4 pt-8"
          >
            <LiveGigsWidget onOpen={() => setActiveView("artist")} />
            <VenueSearchWidget onOpen={() => setActiveView("patron")} />
          </motion.div>

          {/* terrain */}
          <div className="relative">
            <WaveTerrain city={cityView} height={460} pins={VENUE_PINS} />

            {/* landmark module chips */}
            {landmarks.map((lm, i) => (
              <motion.button
                key={lm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView(lm.view)}
                aria-label={`${lm.label} — ${lm.sub}`}
                className="absolute -translate-x-1/2 hud-glass rounded-2xl pl-2 pr-3 py-1.5 flex items-center gap-2 cursor-pointer transition-shadow duration-500 ease-elastic hover:wave-glow"
                style={{ left: `${lm.x}%`, top: `${lm.y}%` }}
              >
                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#0072FF] flex items-center justify-center shrink-0">
                  <lm.icon className="w-3 h-3 text-[#020410]" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-[11px] font-bold whitespace-nowrap">{lm.label}</span>
                  <span className="block text-[9px] text-[#8FA6E0] whitespace-nowrap">{lm.sub}</span>
                </span>
              </motion.button>
            ))}

            {/* bands-bar tags near sonar pins */}
            {[
              { x: 24, y: 74 },
              { x: 62, y: 82 },
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveView("patron")}
                className="absolute -translate-x-1/2 hud-glass rounded-full px-2.5 py-1 flex items-center gap-1.5 text-[9px] font-semibold text-[#BFEFFF] transition-shadow duration-500 ease-elastic hover:wave-glow"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                aria-label="Open bar discovery"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] animate-pulse" />
                Bands Bar
              </button>
            ))}
          </div>

          {/* right HUD: avatar customization engine */}
          <motion.div
            style={reduceMotion ? undefined : { x: panelX, y: panelY }}
            className="hidden lg:block pt-2"
          >
            <AvatarStudio />
          </motion.div>
        </div>

        {/* mobile / tablet: widgets stack under terrain */}
        <div className="lg:hidden grid sm:grid-cols-2 gap-3 mt-4 px-1">
          <LiveGigsWidget onOpen={() => setActiveView("artist")} />
          <VenueSearchWidget onOpen={() => setActiveView("patron")} />
          <BandPerformanceWidget onOpen={() => setActiveView("artist")} />
          <TipJarWidget onOpen={() => setActiveView("tipjar")} />
          <AvatarStudio className="sm:col-span-2" />
        </div>

        {/* desktop bottom row */}
        <div className="hidden lg:grid grid-cols-2 gap-4 mt-4 max-w-2xl mx-auto">
          <BandPerformanceWidget onOpen={() => setActiveView("artist")} />
          <TipJarWidget onOpen={() => setActiveView("tipjar")} />
        </div>
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
            className="hud-glass rounded-2xl px-5 py-3 flex items-center gap-3 transition-shadow duration-500 ease-elastic hover:wave-glow"
          >
            <lm.icon className="w-4 h-4 text-[#00F0FF]" />
            <span className="text-sm font-semibold">{lm.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8FA6E0]" />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
