/**
 * CDDiscVisual.tsx
 * ──────────────────────────────────────────────────────────────────
 * Heritage Disc Player (Pure Turntable & Spinning Disc, No Box/Card)
 * 
 * Design:
 * - Floating vintage/heritage brass & charcoal circular turntable platter
 * - Rotating vinyl/CD disc with 6 genres:
 *   Sufi -> Rock -> Devotional -> Ghazal -> Bollywood -> Carnival
 * - Heritage brass tonearm with stylus resting on the selected reading zone
 * - When a sector rotates into the needle/selected part:
 *   - The sector FLASHES with brilliant radiant light & rainbow diffraction
 *   - The genre name appears in the flash itself in glowing typography
 * - Pure player design with no outer card, container box, or status bars
 */

import { useState, useEffect, useRef } from "react";

export type GenreId = "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";

export interface GenreSector {
  id: GenreId;
  name: string;
  subtitle: string;
  color: string;       // Rich base tint
  glow: string;        // Vibrant flash color
  accent: string;      // Bright luminous highlight
  dark: string;        // Deep tone
}

export const GENRE_SECTORS: GenreSector[] = [
  {
    id: "sufi",
    name: "SUFI",
    subtitle: "Qawwali & Mystical Devotion",
    color: "#9A7219",
    glow: "#FB7185",
    accent: "#FFE4E6",
    dark: "#4C0519",
  },
  {
    id: "rock",
    name: "ROCK",
    subtitle: "Indie & Electric Anthems",
    color: "#1D4ED8",
    glow: "#60A5FA",
    accent: "#DBEAFE",
    dark: "#0F172A",
  },
  {
    id: "devotional",
    name: "DEVOTIONAL",
    subtitle: "Sacred Folk & Ancient Roots",
    color: "#C2410C",
    glow: "#FB923C",
    accent: "#FFEDD5",
    dark: "#431407",
  },
  {
    id: "gazal",
    name: "GHAZAL",
    subtitle: "Classical Baithak & Poetic Soul",
    color: "#047857",
    glow: "#34D399",
    accent: "#D1FAE5",
    dark: "#022C22",
  },
  {
    id: "bollywood",
    name: "BOLLYWOOD",
    subtitle: "Cinematic Dance & High Spirit",
    color: "#B45309",
    glow: "#FBBF24",
    accent: "#FEF3C7",
    dark: "#451A03",
  },
  {
    id: "carnival",
    name: "CARNIVAL",
    subtitle: "Theatrical Drama & Wonder",
    color: "#7E22CE",
    glow: "#C084FC",
    accent: "#F3E8FF",
    dark: "#2E1065",
  },
];

// Geometry setup (disc centered at 200, 200)
const CX = 200;
const CY = 200;
const R_OUTER = 172;
const R_MID   = 118;
const R_INNER = 54;
const R_HUB   = 32;
const R_HOLE  = 13;

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeSectorPath(startAngle: number, endAngle: number, outerR: number, innerR: number) {
  const p1 = polarToCartesian(CX, CY, outerR, startAngle);
  const p2 = polarToCartesian(CX, CY, outerR, endAngle);
  const p3 = polarToCartesian(CX, CY, innerR, endAngle);
  const p4 = polarToCartesian(CX, CY, innerR, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", p1.x, p1.y,
    "A", outerR, outerR, 0, arcSweep, 1, p2.x, p2.y,
    "L", p3.x, p3.y,
    "A", innerR, innerR, 0, arcSweep, 0, p4.x, p4.y,
    "Z",
  ].join(" ");
}

const GROOVES = [66, 78, 90, 102, 114, 126, 138, 150, 162];

export function CDDiscVisual({
  onSelectGenre,
}: {
  onSelectGenre: (g: GenreId) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [flashIntensity, setFlashIntensity] = useState(0); // 1 = full flash, decays to 0.35 active glow
  const [isHovered, setIsHovered] = useState(false);

  const rotRef = useRef(0);
  const prevIdx = useRef(-1);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(performance.now());

  // Speed: rotation speed (approx 20 seconds per full turn)
  const SPEED = 18; // degrees per second

  useEffect(() => {
    const tick = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const currentSpeed = isHovered ? SPEED * 0.4 : SPEED;
      rotRef.current = (rotRef.current + currentSpeed * dt) % 360;

      // The needle stylus sits at 12 o'clock (0 degrees).
      // Angle on disc currently under 12 o'clock needle:
      const currentAngleAtNeedle = (360 - (rotRef.current % 360)) % 360;
      const sectorIndex = Math.floor(currentAngleAtNeedle / 60) % 6;

      if (sectorIndex !== prevIdx.current) {
        prevIdx.current = sectorIndex;
        setActiveIdx(sectorIndex);
        setFlashIntensity(1); // Trigger flash pulse
      }

      setRotation(rotRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovered]);

  // Smooth decay for flash effect
  useEffect(() => {
    if (flashIntensity > 0.3) {
      const timer = setTimeout(() => {
        setFlashIntensity(prev => Math.max(0.3, prev - 0.12));
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [flashIntensity]);

  const active = GENRE_SECTORS[activeIdx];

  // Stylus contact position at top needle position (x: 200, y: 75)
  const needleContact = { x: 200, y: 70 };

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: 440, maxWidth: "100%" }}
    >
      {/* ── AMBIENT GLOW AURA (Reacts in sync with the flash) ── */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-500"
        style={{
          width: 380,
          height: 380,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${active.glow}45 0%, ${active.color}15 55%, transparent 75%)`,
          filter: "blur(60px)",
          opacity: 0.5 + flashIntensity * 0.5,
        }}
      />

      {/* ── FLASHING GENRE BANNER AT TOP OF DISC (Directly in the flash) ── */}
      <div
        className="relative z-30 flex flex-col items-center mb-3 pointer-events-none transition-all duration-300"
        style={{ minHeight: 62 }}
      >
        {/* Flash Flare Crown */}
        <div
          className="flex items-center gap-2 px-4 py-1 rounded-full backdrop-blur-md border shadow-2xl transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, rgba(26,25,22,0.92) 0%, rgba(15,14,18,0.95) 100%)`,
            borderColor: flashIntensity > 0.6 ? active.accent : `${active.glow}80`,
            boxShadow: `0 0 ${20 + flashIntensity * 30}px ${active.glow}, inset 0 0 15px ${active.glow}40`,
          }}
        >
          {/* Pulsing jewel light */}
          <span
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: active.glow,
              boxShadow: `0 0 ${10 + flashIntensity * 12}px ${active.glow}`,
            }}
          />
          <span
            className="label-editorial text-[9px] font-bold tracking-[0.26em] uppercase"
            style={{
              color: flashIntensity > 0.5 ? active.accent : active.glow,
            }}
          >
            NOW PLAYING · {active.name}
          </span>
          <span
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: active.glow,
              boxShadow: `0 0 ${10 + flashIntensity * 12}px ${active.glow}`,
            }}
          />
        </div>

        {/* Big luminous genre text inside the flash */}
        <h3
          className="font-serif tracking-[0.16em] font-light leading-tight mt-1 transition-all duration-300"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(28px, 3.8vw, 40px)",
            color: flashIntensity > 0.6 ? "#FFFFFF" : active.accent,
            textShadow: `0 0 ${18 + flashIntensity * 28}px ${active.glow}, 0 0 ${40 + flashIntensity * 40}px ${active.glow}99`,
          }}
        >
          {active.name}
        </h3>
      </div>

      {/* ── PURE HERITAGE TURNTABLE PLATTER (No box, pure acoustic disc) ── */}
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 400,
          height: 400,
          maxWidth: "100%",
          aspectRatio: "1/1",
        }}
      >
        {/* Heritage Brass & Ebony Turntable Platter Outer Ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, #1F1D24 0%, #151419 65%, #0B0A0E 100%)",
            border: "3px solid #C4952A",
            boxShadow: `
              0 25px 60px rgba(0,0,0,0.9),
              inset 0 0 45px rgba(0,0,0,0.95),
              0 0 25px rgba(196,149,42,0.2)
            `,
          }}
        />

        {/* Vintage Chamfered Platter Edge Lines */}
        <div className="absolute inset-3 rounded-full border border-[#C4952A]/30 pointer-events-none" />
        <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />

        {/* ── ROTATING DISC SVG ─────────────────────────────── */}
        <div
          className="relative z-10"
          style={{ width: 350, height: 350 }}
        >
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full cursor-pointer overflow-visible"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "none",
              filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.85))",
            }}
          >
            <defs>
              {/* Iridescent Rainbow Diffraction Sheen across Vinyl */}
              <radialGradient id="rainbowSheen" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="70%" stopColor="rgba(196,149,42,0.12)" />
                <stop offset="85%" stopColor="rgba(244,63,94,0.08)" />
                <stop offset="96%" stopColor="rgba(59,130,246,0.10)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
              </radialGradient>

              {/* Laser Flash Flare Filter */}
              <filter id="laserFlashGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Disc Outer Rim & Bevel */}
            <circle cx={CX} cy={CY} r={R_OUTER + 2} fill="#0A090D" stroke="#C4952A" strokeWidth={1.2} />

            {/* ── 6 GENRE SECTORS ─────────────────────────────── */}
            {GENRE_SECTORS.map((genre, idx) => {
              const startAngle = idx * 60;
              const endAngle   = (idx + 1) * 60;
              const midAngle   = startAngle + 30;
              const isSelected = idx === activeIdx;
              const sectorD    = describeSectorPath(startAngle, endAngle, R_OUTER, R_INNER);
              const labelCoord = polarToCartesian(CX, CY, 138, midAngle);
              const dotCoord   = polarToCartesian(CX, CY, 92, midAngle);

              return (
                <g
                  key={genre.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGenre(genre.id);
                  }}
                  className="transition-opacity duration-300"
                >
                  {/* Base Sector Wedge */}
                  <path
                    d={sectorD}
                    fill={
                      isSelected
                        ? flashIntensity > 0.5
                          ? genre.color
                          : `${genre.color}E6`
                        : "rgba(18, 17, 24, 0.96)"
                    }
                    stroke={isSelected ? genre.glow : "rgba(255,255,255,0.07)"}
                    strokeWidth={isSelected ? 1.8 : 0.8}
                    className="transition-all duration-300"
                  />

                  {/* FLASH EFFECT: When sector is selected under the needle, it flashes with brilliant light! */}
                  {isSelected && (
                    <path
                      d={sectorD}
                      fill={genre.glow}
                      opacity={0.3 + flashIntensity * 0.55}
                      filter="url(#laserFlashGlow)"
                      className="transition-opacity duration-200"
                    />
                  )}

                  {/* Acoustic Micro-grooves */}
                  {GROOVES.map(rad => {
                    const pStart = polarToCartesian(CX, CY, rad, startAngle + 1);
                    const pEnd   = polarToCartesian(CX, CY, rad, endAngle - 1);
                    return (
                      <path
                        key={rad}
                        d={`M ${pStart.x} ${pStart.y} A ${rad} ${rad} 0 0 1 ${pEnd.x} ${pEnd.y}`}
                        fill="none"
                        stroke={
                          isSelected
                            ? `${genre.accent}70`
                            : "rgba(255,255,255,0.04)"
                        }
                        strokeWidth={0.8}
                      />
                    );
                  })}

                  {/* Genre Name Embossed on the Sector */}
                  <text
                    x={labelCoord.x}
                    y={labelCoord.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isSelected ? "#FFFFFF" : "rgba(255,255,255,0.36)"}
                    fontSize={isSelected ? "12" : "10"}
                    fontFamily="'Manrope', sans-serif"
                    fontWeight="800"
                    letterSpacing="2.6"
                    transform={`rotate(${midAngle}, ${labelCoord.x}, ${labelCoord.y})`}
                    style={{
                      transition: "all 0.3s ease",
                      filter: isSelected ? `drop-shadow(0 0 8px ${genre.glow})` : "none",
                    }}
                  >
                    {genre.name}
                  </text>

                  {/* Radial Star Ornament */}
                  <text
                    x={dotCoord.x}
                    y={dotCoord.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isSelected ? genre.accent : "rgba(255,255,255,0.18)"}
                    fontSize="8"
                    fontFamily="'Cormorant Garamond', serif"
                    transform={`rotate(${midAngle}, ${dotCoord.x}, ${dotCoord.y})`}
                  >
                    ◈
                  </text>
                </g>
              );
            })}

            {/* Spoke Divider Inlays */}
            {GENRE_SECTORS.map((_, i) => {
              const angle = i * 60;
              const pInner = polarToCartesian(CX, CY, R_INNER, angle);
              const pOuter = polarToCartesian(CX, CY, R_OUTER, angle);
              return (
                <line
                  key={i}
                  x1={pInner.x}
                  y1={pInner.y}
                  x2={pOuter.x}
                  y2={pOuter.y}
                  stroke="#07060A"
                  strokeWidth={2}
                />
              );
            })}

            {/* Holographic Iridescent Vinyl Sheen */}
            <circle cx={CX} cy={CY} r={R_OUTER} fill="url(#rainbowSheen)" pointerEvents="none" />

            {/* ── CENTER VINTAGE BRASS RECORD LABEL ────────────── */}
            {/* Clamping Brass Ring */}
            <circle cx={CX} cy={CY} r={R_INNER} fill="#18161D" stroke="#C4952A" strokeWidth={1.5} />
            <circle cx={CX} cy={CY} r={R_HUB} fill="#0F0E14" stroke="#DDB96A" strokeWidth={0.8} />

            {/* Mannat Arts Heritage Gold Emblem */}
            <text
              x={CX}
              y={CY - 5}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#DDB96A"
              fontSize="7.5"
              fontFamily="'Cormorant Garamond', serif"
              fontWeight="700"
              letterSpacing="1.8"
            >
              MANNAT
            </text>
            <text
              x={CX}
              y={CY + 6}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(255,255,255,0.45)"
              fontSize="5"
              fontFamily="'Manrope', sans-serif"
              fontWeight="800"
              letterSpacing="2"
            >
              HERITAGE
            </text>

            {/* Spindle hole */}
            <circle cx={CX} cy={CY} r={R_HOLE} fill="#050508" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
            <circle cx={CX} cy={CY} r={4} fill="#C4952A" />
          </svg>
        </div>

        {/* ── HERITAGE BRASS TONEARM WITH STYLUS NEEDLE ─────── */}
        <svg
          className="absolute inset-0 z-20 pointer-events-none"
          viewBox="0 0 400 400"
          style={{ width: 400, height: 400 }}
        >
          <defs>
            {/* Brass Needle Stylus Glow */}
            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Tonearm Base Turret (Top-Right of Platter) */}
          <circle cx={345} cy={60} r={18} fill="#1E1C24" stroke="#C4952A" strokeWidth={2} />
          <circle cx={345} cy={60} r={10} fill="#C4952A" opacity={0.8} />
          <circle cx={345} cy={60} r={4} fill="#0B0A0E" />

          {/* Curved Brass Tonearm Tube extending to the 12 o'clock sector */}
          <path
            d={`M 345 60 Q 280 20, 218 54 L ${needleContact.x} ${needleContact.y}`}
            fill="none"
            stroke="#DDB96A"
            strokeWidth={3}
            strokeLinecap="round"
            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.7))"
          />

          {/* Stylus Cartridge Head */}
          <rect
            x={needleContact.x - 6}
            y={needleContact.y - 12}
            width={12}
            height={16}
            rx={2}
            fill="#1E1C24"
            stroke="#C4952A"
            strokeWidth={1}
            transform={`rotate(12, ${needleContact.x}, ${needleContact.y})`}
          />

          {/* Stylus Needle Tip Spark / Flash Focus */}
          <circle
            cx={needleContact.x}
            cy={needleContact.y + 4}
            r={flashIntensity > 0.5 ? 5 : 3.5}
            fill={active.glow}
            filter="url(#needleGlow)"
            className="transition-all duration-200"
          />

          {/* Radiant Light Rays shooting from Needle Tip when Flashing */}
          {flashIntensity > 0.4 && (
            <g opacity={flashIntensity}>
              <line x1={needleContact.x} y1={needleContact.y} x2={needleContact.x - 14} y2={needleContact.y + 12} stroke={active.accent} strokeWidth={1.5} />
              <line x1={needleContact.x} y1={needleContact.y} x2={needleContact.x} y2={needleContact.y + 16} stroke={active.accent} strokeWidth={1.5} />
              <line x1={needleContact.x} y1={needleContact.y} x2={needleContact.x + 14} y2={needleContact.y + 12} stroke={active.accent} strokeWidth={1.5} />
            </g>
          )}
        </svg>
      </div>

      {/* ── SUBTITLE & DISCOVERY CALLOUT BELOW DISC ───────────── */}
      <div className="relative z-30 flex flex-col items-center mt-3 text-center">
        <p className="font-ui text-white/80 text-[13px] font-medium tracking-wide">
          {active.subtitle}
        </p>
        <button
          onClick={() => onSelectGenre(active.id)}
          className="mt-2 flex items-center gap-1.5 label-editorial text-[9px] tracking-[0.2em] font-bold text-[#DDB96A] hover:text-white transition-colors cursor-pointer"
        >
          <span>TAP TO EXPLORE {active.name}</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
