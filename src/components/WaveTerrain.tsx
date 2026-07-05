"use client";

import { useEffect, useRef } from "react";

type CityKey = "kl" | "sg";

interface WaveTerrainProps {
  city: CityKey;
  className?: string;
  height?: number;
  /** normalized pin positions on the grid: x in [-1,1], depth in [0,1] */
  pins?: { x: number; z: number }[];
}

type Polyline = [number, number][]; // [x (width fraction from center), y (up from horizon)]

/* ---------------- landmark wireframes ---------------- */

function tower(x: number, w: number, h: number, spire = 0): Polyline[] {
  const lines: Polyline[] = [
    [
      [x - w, 0],
      [x - w * 0.55, h * 0.78],
      [x, h],
      [x + w * 0.55, h * 0.78],
      [x + w, 0],
    ],
  ];
  for (const f of [0.22, 0.44, 0.66]) {
    const ww = w * (1 - f * 0.45);
    lines.push([
      [x - ww, h * f],
      [x + ww, h * f],
    ]);
  }
  if (spire > 0) {
    lines.push([
      [x, h],
      [x, h + spire],
    ]);
  }
  return lines;
}

function klTower(x: number, h: number): Polyline[] {
  const w = 0.006;
  return [
    [
      [x - w, 0],
      [x - w * 0.6, h * 0.72],
      [x + w * 0.6, h * 0.72],
      [x + w, 0],
    ],
    // observation bulb
    [
      [x - 0.020, h * 0.74],
      [x - 0.012, h * 0.84],
      [x + 0.012, h * 0.84],
      [x + 0.020, h * 0.74],
      [x - 0.020, h * 0.74],
    ],
    [
      [x, h * 0.84],
      [x, h],
    ],
  ];
}

function mbsTower(x: number, lean: number, w: number, h: number): Polyline[] {
  return [
    [
      [x - w, 0],
      [x - w * 0.7 + lean, h],
      [x + w * 0.7 + lean, h],
      [x + w, 0],
    ],
    [
      [x - w * 0.85 + lean * 0.5, h * 0.5],
      [x + w * 0.85 + lean * 0.5, h * 0.5],
    ],
  ];
}

function supertree(x: number, h: number): Polyline[] {
  const lines: Polyline[] = [
    [
      [x, 0],
      [x, h * 0.62],
    ],
  ];
  for (const dx of [-0.028, -0.015, 0, 0.015, 0.028]) {
    lines.push([
      [x, h * 0.55],
      [x + dx, h],
    ]);
  }
  lines.push([
    [x - 0.028, h * 0.92],
    [x, h * 1.0],
    [x + 0.028, h * 0.92],
  ]);
  return lines;
}

const KL_LANDMARKS: Polyline[] = [
  ...tower(-0.075, 0.020, 0.30, 0.055), // Petronas 1
  ...tower(-0.025, 0.020, 0.30, 0.055), // Petronas 2
  [
    [-0.056, 0.13],
    [-0.044, 0.13],
  ], // skybridge
  ...klTower(0.16, 0.27),
  ...tower(0.30, 0.016, 0.18),
  ...tower(-0.22, 0.014, 0.14),
];

const SG_LANDMARKS: Polyline[] = [
  ...mbsTower(-0.02, 0.012, 0.02, 0.22),
  ...mbsTower(0.05, 0.012, 0.02, 0.22),
  ...mbsTower(0.12, 0.012, 0.02, 0.22),
  // skypark deck
  [
    [-0.06, 0.225],
    [0.0, 0.245],
    [0.08, 0.245],
    [0.17, 0.225],
  ],
  ...supertree(-0.20, 0.20),
  ...supertree(-0.28, 0.15),
  ...tower(0.28, 0.016, 0.17),
];

/* ---------------- component ---------------- */

export default function WaveTerrain({ city, className = "", height = 440, pins = [] }: WaveTerrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cityRef = useRef<CityKey>(city);
  cityRef.current = city;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let raf = 0;
    let running = true;
    let cityMix = cityRef.current === "sg" ? 1 : 0; // 0 = KL, 1 = SG

    const pointer = { x: -9999, y: -9999, active: 0, tx: -9999, ty: -9999, ta: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const setPointer = (cx: number, cy: number, inside: boolean) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = cx - rect.left;
      pointer.ty = cy - rect.top;
      pointer.ta = inside ? 1 : 0;
    };
    const onMouseMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY, true);
    const onMouseLeave = () => { pointer.ta = 0; };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) setPointer(e.touches[0].clientX, e.touches[0].clientY, true);
    };
    const onTouchEnd = () => { pointer.ta = 0; };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchstart", onTouch, { passive: true });
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("touchcancel", onTouchEnd);

    const NX = 34; // columns
    const NZ = 20; // depth rows

    const draw = (t: number) => {
      if (!running) return;
      const time = reduceMotion ? 0 : t / 1000;
      const horizon = height * 0.36;
      const cx = W / 2;

      ctx.clearRect(0, 0, W, height);

      // ease pointer + city crossfade
      pointer.x += (pointer.tx - pointer.x) * 0.15;
      pointer.y += (pointer.ty - pointer.y) * 0.15;
      pointer.active += (pointer.ta - pointer.active) * 0.07;
      const targetMix = cityRef.current === "sg" ? 1 : 0;
      cityMix += (targetMix - cityMix) * (reduceMotion ? 1 : 0.06);

      /* ----- project grid ----- */
      const scaleAt = (d: number) => 1 - d * 0.82; // horizontal shrink toward horizon
      const rowY = (d: number) => horizon + (height - horizon - 8) * (1 - d) ** 1.7;

      // landmark hub drifts slightly between the KL and SG skylines
      const hubX = -0.03 + cityMix * 0.08;

      const waveAt = (wx: number, d: number) => {
        // layered "audio frequency" ripple, stronger up close
        const base =
          Math.sin(wx * 7 + time * 2.1 + d * 9) * 0.45 +
          Math.sin(wx * 15 - time * 3.2 + d * 4) * 0.3 +
          Math.sin(d * 16 + time * 1.4) * 0.25;
        // massive frequency peaks rising toward the landmark hub
        const hubShape =
          Math.exp(-((wx - hubX) ** 2) / 0.07) * Math.exp(-((d - 0.62) ** 2) / 0.09);
        const hubPulse = 0.55 + 0.45 * Math.sin(time * 2.3 + wx * 11);
        return base * (1 - d) * 26 + hubShape * hubPulse * 64;
      };

      // pointer lift: gaussian in screen space
      const lift = (px: number, py: number) => {
        const dx = px - pointer.x;
        const dy = py - pointer.y;
        const s2 = 2 * (W * 0.07) ** 2;
        return pointer.active * Math.exp(-(dx * dx + dy * dy) / s2) * 34;
      };

      const pt = (col: number, row: number): [number, number, number] => {
        const wx = (col / (NX - 1)) * 2 - 1;
        const d = row / (NZ - 1);
        const x = cx + wx * (W * 0.62) * (0.35 + scaleAt(d));
        let y = rowY(d);
        const disp = waveAt(wx, d);
        y -= disp;
        const l = lift(x, y);
        y -= l;
        // normalized elevation: 0 = deepest valley, 1 = tallest peak
        const elev = Math.min(1, Math.max(0, (disp + l + 20) / 92));
        return [x, y, elev];
      };

      // 16-bit elevation ramp: deep indigo valleys -> electric blue ->
      // cyan -> ultra-vibrant magenta peaks
      const RAMP: [number, [number, number, number]][] = [
        [0.0, [40, 14, 122]],   // deep indigo
        [0.45, [0, 114, 255]],  // electric blue
        [0.7, [0, 240, 255]],   // neon cyan
        [1.0, [255, 0, 127]],   // electric magenta
      ];
      const rampColor = (e: number): [number, number, number] => {
        for (let i = 1; i < RAMP.length; i++) {
          if (e <= RAMP[i][0]) {
            const [t0, c0] = RAMP[i - 1];
            const [t1, c1] = RAMP[i];
            const f = (e - t0) / (t1 - t0);
            return [
              Math.round(c0[0] + (c1[0] - c0[0]) * f),
              Math.round(c0[1] + (c1[1] - c0[1]) * f),
              Math.round(c0[2] + (c1[2] - c0[2]) * f),
            ];
          }
        }
        return RAMP[RAMP.length - 1][1];
      };

      ctx.lineWidth = 1;

      // horizontal rows (audio frequency lines), gradient injected per segment
      for (let row = 0; row < NZ; row++) {
        const d = row / (NZ - 1);
        for (let col = 0; col < NX - 1; col++) {
          const [x1, y1, e1] = pt(col, row);
          const [x2, y2, e2] = pt(col + 1, row);
          const e = (e1 + e2) / 2;
          const [r, g, b] = rampColor(e);
          const depthAlpha = 0.14 + (1 - d) * 0.42;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, depthAlpha + e * 0.55)})`;
          ctx.lineWidth = 1 + e * 0.8; // peaks read thicker, like loud frequencies
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
      ctx.lineWidth = 1;

      // vertical columns
      ctx.strokeStyle = "rgba(0, 114, 255, 0.20)";
      for (let col = 0; col < NX; col += 2) {
        ctx.beginPath();
        for (let row = 0; row < NZ; row++) {
          const [x, y] = pt(col, row);
          if (row === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      /* ----- landmarks on the horizon ----- */
      const drawLandmarks = (lines: Polyline[], alpha: number, slide: number) => {
        if (alpha <= 0.01) return;
        ctx.save();
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.75 * alpha})`;
        ctx.shadowColor = "rgba(0, 240, 255, 0.9)";
        ctx.shadowBlur = 10 * alpha;
        ctx.lineWidth = 1.4;
        for (const line of lines) {
          ctx.beginPath();
          line.forEach(([lx, ly], i) => {
            const x = cx + (lx + slide) * W;
            const y = horizon - ly * W * 0.9;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
        }
        ctx.restore();
      };
      drawLandmarks(KL_LANDMARKS, 1 - cityMix, -cityMix * 0.05);
      drawLandmarks(SG_LANDMARKS, cityMix, (1 - cityMix) * 0.05);

      // horizon line
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, "rgba(0, 240, 255, 0)");
      grad.addColorStop(0.5, "rgba(0, 240, 255, 0.45)");
      grad.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(W, horizon);
      ctx.stroke();

      /* ----- sonar venue pins ----- */
      for (let i = 0; i < pins.length; i++) {
        const { x: wx, z } = pins[i];
        const x = cx + wx * (W * 0.62) * (0.35 + scaleAt(z));
        const y = rowY(z) - waveAt(wx, z) - lift(cx + wx * W * 0.5, rowY(z));
        const phase = reduceMotion ? 0.4 : ((time * 0.45 + i * 0.37) % 1);
        const maxR = 34 * (1 - z * 0.5);
        // multi-layered sonic pings: three rings, alternating color and
        // opacity to imply distance and volume
        const rings: [number, string, number][] = [
          [phase, "255, 0, 127", 0.6],
          [(phase + 0.33) % 1, "0, 240, 255", 0.35],
          [(phase + 0.66) % 1, "255, 0, 127", 0.22],
        ];
        for (const [p, rgb, peak] of rings) {
          const rr = p * maxR;
          ctx.strokeStyle = `rgba(${rgb}, ${(1 - p) * peak})`;
          ctx.lineWidth = 1.6 - p;
          ctx.beginPath();
          ctx.ellipse(x, y, rr, rr * 0.38, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.lineWidth = 1;
        // core
        ctx.fillStyle = "rgba(0, 240, 255, 0.95)";
        ctx.shadowColor = "rgba(0, 240, 255, 0.9)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [height, pins]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full block ${className}`}
      style={{ height, touchAction: "pan-y" }}
      aria-hidden
    />
  );
}
