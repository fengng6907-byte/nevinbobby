"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive holographic sound wave.
 * Bars idle on layered sine waves; pointer / finger proximity amplifies
 * them with a gaussian falloff and brightens their glow.
 */
export default function SoundWave({
  className = "",
  height = 140,
}: {
  className?: string;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let raf = 0;
    let running = true;

    // pointer state (in canvas CSS pixels); target follows input, current eases toward it
    const pointer = { x: -9999, active: 0, targetX: -9999, targetActive: 0 };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const setPointer = (clientX: number, inside: boolean) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = clientX - rect.left;
      pointer.targetActive = inside ? 1 : 0;
    };

    const onMouseMove = (e: MouseEvent) => setPointer(e.clientX, true);
    const onMouseLeave = () => { pointer.targetActive = 0; };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) setPointer(e.touches[0].clientX, true);
    };
    const onTouchEnd = () => { pointer.targetActive = 0; };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchstart", onTouchMove, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("touchcancel", onTouchEnd);

    const BAR_W = 3;
    const GAP = 4;
    const mid = height / 2;

    const draw = (t: number) => {
      if (!running) return;
      const time = t / 1000;
      ctx.clearRect(0, 0, width, height);

      // ease pointer toward target
      pointer.x += (pointer.targetX - pointer.x) * 0.18;
      pointer.active += (pointer.targetActive - pointer.active) * 0.08;

      const count = Math.max(1, Math.floor(width / (BAR_W + GAP)));
      const sigma = width * 0.06; // pointer influence radius

      for (let i = 0; i < count; i++) {
        const x = i * (BAR_W + GAP) + BAR_W / 2;
        const n = i / count;

        // idle amplitude: layered sines, tapered toward the edges
        const taper = Math.sin(Math.PI * n) ** 0.7;
        const idle = reduceMotion
          ? 0.35
          : 0.30 +
            0.22 * Math.sin(n * 11 + time * 1.8) +
            0.16 * Math.sin(n * 23 - time * 2.6) +
            0.10 * Math.sin(n * 5 + time * 0.9);

        // gaussian boost around the pointer
        const d = x - pointer.x;
        const boost = pointer.active * Math.exp(-(d * d) / (2 * sigma * sigma));

        const amp = Math.max(0.04, (idle * taper + boost * 1.35) * 0.5);
        const h = amp * height;

        // color: cyan -> neon blue across the strip, brighter near the pointer
        const hue = 190 + n * 50; // 190 (cyan) -> 240 (blue-violet)
        const light = 55 + boost * 30;
        const alpha = 0.35 + 0.45 * amp + boost * 0.35;

        // soft glow pass
        ctx.fillStyle = `hsla(${hue}, 100%, ${light}%, ${Math.min(0.25, alpha * 0.3)})`;
        ctx.fillRect(x - BAR_W * 1.6, mid - h / 2 - 2, BAR_W * 3.2, h + 4);

        // core bar
        ctx.fillStyle = `hsla(${hue}, 100%, ${light}%, ${Math.min(1, alpha)})`;
        ctx.fillRect(x - BAR_W / 2, mid - h / 2, BAR_W, h);

        // bright cap near the pointer
        if (boost > 0.25) {
          ctx.fillStyle = `hsla(${hue}, 100%, 88%, ${boost * 0.9})`;
          ctx.fillRect(x - BAR_W / 2, mid - h / 2, BAR_W, 2);
          ctx.fillRect(x - BAR_W / 2, mid + h / 2 - 2, BAR_W, 2);
        }
      }

      // center hairline
      ctx.fillStyle = "rgba(108, 249, 255, 0.18)";
      ctx.fillRect(0, mid - 0.5, width, 1);

      raf = requestAnimationFrame(draw);
    };

    // With reduced motion the idle amplitude is constant, so bars stay still
    // unless the pointer interacts with them.
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onTouchMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [height]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full block ${className}`}
      style={{ height, touchAction: "pan-y" }}
      aria-hidden
    />
  );
}
