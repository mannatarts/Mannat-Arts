import React from "react";

interface GenreVisualElementsProps {
  genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";
  accentColor: string;
  glowColor: string;
}

export const GenreFloatingElements: React.FC<GenreVisualElementsProps> = ({
  genreId,
  accentColor,
  glowColor,
}) => {
  switch (genreId) {
    case "rock":
      return (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Element 1: Electric Sunburst Guitar 3D Cutout (Top Left Outer Space) */}
          <div
            className="absolute -top-12 -left-10 sm:-left-16 w-28 sm:w-36 h-36 sm:h-44 transition-transform duration-500 hover:scale-115 hover:-rotate-12 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px ${glowColor})`, animationDuration: "5s" }}
            title="Electric Lead Guitar"
          >
            <svg viewBox="0 0 160 200" className="w-full h-full -rotate-15">
              <defs>
                <linearGradient id="guitarBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#B91C1C" />
                  <stop offset="85%" stopColor="#1E1B4B" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
                <linearGradient id="neckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
                <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#64748B" />
                </linearGradient>
              </defs>
              <rect x="75" y="10" width="10" height="90" fill="url(#neckGrad)" rx="2" />
              {[20, 30, 40, 50, 60, 70, 80, 90].map((y, i) => (
                <line key={i} x1="75" y1={y} x2="85" y2={y} stroke="#E2E8F0" strokeWidth="1" />
              ))}
              <polygon points="73,10 87,10 89,0 71,0" fill="#1E1B4B" />
              {[2, 5, 8].map(y => (
                <React.Fragment key={y}>
                  <circle cx="68" cy={y} r="2.5" fill="url(#chrome)" />
                  <circle cx="92" cy={y} r="2.5" fill="url(#chrome)" />
                </React.Fragment>
              ))}
              <path
                d="M 50 100 C 35 110, 30 135, 45 155 C 55 170, 70 185, 80 185 C 90 185, 105 170, 115 155 C 130 135, 125 110, 110 100 C 105 95, 95 95, 80 98 C 65 95, 55 95, 50 100 Z"
                fill="url(#guitarBody)"
                stroke="#F87171"
                strokeWidth="1.5"
              />
              <path d="M 60 115 Q 75 110 80 120 Q 95 135 85 155 Q 65 155 60 130 Z" fill="#F8FAFC" opacity="0.9" />
              <rect x="72" y="115" width="16" height="6" fill="#1E293B" rx="1.5" stroke="#94A3B8" strokeWidth="0.5" />
              <rect x="72" y="130" width="16" height="6" fill="#1E293B" rx="1.5" stroke="#94A3B8" strokeWidth="0.5" />
              <rect x="73" y="150" width="14" height="8" fill="url(#chrome)" rx="1" />
              <circle cx="98" cy="150" r="4" fill="#F59E0B" stroke="#78350F" strokeWidth="0.5" />
              <circle cx="94" cy="162" r="4" fill="#F59E0B" stroke="#78350F" strokeWidth="0.5" />
              <line x1="77" y1="10" x2="77" y2="152" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
              <line x1="80" y1="10" x2="80" y2="152" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
              <line x1="83" y1="10" x2="83" y2="152" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
            </svg>
          </div>

          {/* Element 2: Concert Microphone with Stage Glow (Top Right Outer Space) */}
          <div
            className="absolute -top-12 -right-8 sm:-right-14 w-24 sm:w-28 h-28 sm:h-34 transition-transform duration-500 hover:scale-115 hover:rotate-12 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px ${glowColor})`, animationDuration: "6s", animationDelay: "1s" }}
            title="Stage Vocal Microphone"
          >
            <svg viewBox="0 0 120 160" className="w-full h-full rotate-12">
              <defs>
                <linearGradient id="micGrille" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F1F5F9" />
                  <stop offset="50%" stopColor="#94A3B8" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
                <linearGradient id="micHandle" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="35" r="28" fill="none" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" className="animate-ping" style={{ animationDuration: "3s" }} />
              <circle cx="60" cy="35" r="40" fill="none" stroke="#A855F7" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <ellipse cx="60" cy="35" rx="18" ry="20" fill="url(#micGrille)" stroke="#E2E8F0" strokeWidth="1" />
              <path d="M 45 35 Q 60 25 75 35 M 45 40 Q 60 30 75 40 M 47 30 Q 60 20 73 30" stroke="#475569" strokeWidth="0.8" fill="none" />
              <rect x="50" y="52" width="20" height="6" fill="#64748B" rx="1" />
              <path d="M 52 58 L 54 125 L 66 125 L 68 58 Z" fill="url(#micHandle)" stroke="#334155" strokeWidth="1" />
              <rect x="58" y="75" width="4" height="12" fill="#E2E8F0" rx="1" />
              <rect x="59" y="77" width="2" height="4" fill="#EF4444" />
              <rect x="56" y="125" width="8" height="15" fill="#0F172A" rx="1" />
              <path d="M 60 140 Q 65 155 50 160" stroke="#0F172A" strokeWidth="3" fill="none" />
            </svg>
          </div>

          {/* Element 3: Marshall Amplifier Speaker Cabinet (Bottom Left Outer Space) */}
          <div
            className="absolute -bottom-10 -left-10 sm:-left-16 w-26 sm:w-30 h-24 sm:h-28 transition-transform duration-500 hover:scale-110 hover:rotate-3 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px rgba(0,0,0,0.6))`, animationDuration: "5.5s", animationDelay: "2s" }}
            title="Stage Amplifier"
          >
            <svg viewBox="0 0 140 120" className="w-full h-full -rotate-6">
              <defs>
                <linearGradient id="ampBox" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#090D16" />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="120" height="100" rx="8" fill="url(#ampBox)" stroke="#475569" strokeWidth="2" />
              <rect x="8" y="8" width="12" height="12" rx="3" fill="#94A3B8" />
              <rect x="120" y="8" width="12" height="12" rx="3" fill="#94A3B8" />
              <rect x="8" y="90" width="12" height="12" rx="3" fill="#94A3B8" />
              <rect x="120" y="90" width="12" height="12" rx="3" fill="#94A3B8" />
              <rect x="18" y="28" width="104" height="74" rx="4" fill="#292524" stroke="#D97706" strokeWidth="1" />
              <circle cx="46" cy="65" r="22" fill="#1C1917" stroke="#44403C" strokeWidth="2" />
              <circle cx="46" cy="65" r="8" fill="#0C0A09" stroke="#78716C" strokeWidth="1" />
              <circle cx="94" cy="65" r="22" fill="#1C1917" stroke="#44403C" strokeWidth="2" />
              <circle cx="94" cy="65" r="8" fill="#0C0A09" stroke="#78716C" strokeWidth="1" />
              <rect x="18" y="14" width="104" height="12" fill="#D97706" rx="2" />
              {[28, 42, 56, 70, 84, 98].map((x, i) => (
                <circle key={i} cx={x} cy="20" r="2.5" fill="#1E293B" stroke="#FEF3C7" strokeWidth="0.5" />
              ))}
              <circle cx="112" cy="20" r="2.5" fill="#EF4444" className="animate-pulse" />
            </svg>
          </div>

          {/* Element 4: Floating Vinyl Record (Bottom Right Outer Space) */}
          <div
            className="absolute -bottom-8 -right-8 sm:-right-14 w-20 sm:w-24 h-20 sm:h-24 transition-transform duration-500 hover:scale-120 animate-spin-slow pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 10px 20px rgba(168, 85, 247, 0.5))` }}
            title="Vinyl Disc"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#0F172A" stroke="#334155" strokeWidth="1" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1E293B" strokeWidth="1" />
              <circle cx="50" cy="50" r="36" fill="none" stroke="#334155" strokeWidth="0.8" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#1E293B" strokeWidth="0.8" />
              <circle cx="50" cy="50" r="24" fill="none" stroke="#334155" strokeWidth="0.8" />
              <circle cx="50" cy="50" r="18" fill="#9333EA" stroke="#F43F5E" strokeWidth="1.5" />
              <text x="50" y="49" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">ROCK</text>
              <text x="50" y="56" textAnchor="middle" fill="#FDE047" fontSize="4">LIVE 45</text>
              <circle cx="50" cy="50" r="4" fill="#0F172A" />
            </svg>
          </div>
        </div>
      );

    case "sufi":
      return (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Element 1: Teak Wood Harmonium (Top Left Outer Space) */}
          <div
            className="absolute -top-12 -left-10 sm:-left-16 w-30 sm:w-38 h-26 sm:h-32 transition-transform duration-500 hover:scale-115 hover:-rotate-6 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px ${glowColor})`, animationDuration: "5.5s" }}
            title="Teak Harmonium"
          >
            <svg viewBox="0 0 160 120" className="w-full h-full -rotate-8">
              <defs>
                <linearGradient id="harmoniumWood" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#78350F" />
                  <stop offset="40%" stopColor="#92400E" />
                  <stop offset="80%" stopColor="#451A03" />
                  <stop offset="100%" stopColor="#290E02" />
                </linearGradient>
                <linearGradient id="brassStop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#EAB308" />
                  <stop offset="100%" stopColor="#854D0E" />
                </linearGradient>
              </defs>
              <polygon points="15,40 145,25 155,95 25,110" fill="url(#harmoniumWood)" stroke="#B45309" strokeWidth="1.5" />
              <polygon points="15,40 25,110 35,108 25,38" fill="#451A03" stroke="#FBBF24" strokeWidth="0.5" />
              <polygon points="35,38 145,25 150,65 40,78" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
              {[42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 142].map((x, i) => (
                <line key={i} x1={x} y1={36 - i * 1} x2={x + 4} y2={76 - i * 1} stroke="#D97706" strokeWidth="1" />
              ))}
              {[47, 57, 77, 87, 97, 117, 127].map((x, i) => (
                <polygon key={i} points={`${x},${34 - i * 0.5} ${x + 5},${33 - i * 0.5} ${x + 7},${56 - i * 0.5} ${x + 2},${57 - i * 0.5}`} fill="#1C1917" />
              ))}
              <polygon points="40,82 152,68 154,92 42,106" fill="url(#harmoniumWood)" stroke="#78350F" strokeWidth="1" />
              {[55, 75, 95, 115, 135].map((x, i) => (
                <circle key={i} cx={x} cy={94 - i * 3} r="4" fill="url(#brassStop)" stroke="#78350F" strokeWidth="0.8" />
              ))}
            </svg>
          </div>

          {/* Element 2: Traditional Indian Tabla (Top Right Outer Space) */}
          <div
            className="absolute -top-12 -right-8 sm:-right-14 w-28 sm:w-34 h-26 sm:h-32 transition-transform duration-500 hover:scale-115 hover:rotate-6 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px ${glowColor})`, animationDuration: "6s", animationDelay: "1s" }}
            title="Indian Tabla & Dagga"
          >
            <svg viewBox="0 0 160 130" className="w-full h-full rotate-6">
              <defs>
                <linearGradient id="tablaWood" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#92400E" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>
                <linearGradient id="daggaBrass" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
              </defs>
              <ellipse cx="50" cy="85" rx="36" ry="32" fill="url(#daggaBrass)" stroke="#B45309" strokeWidth="1.5" />
              <ellipse cx="50" cy="55" rx="28" ry="14" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.5" />
              <ellipse cx="58" cy="55" rx="14" ry="7" fill="#1C1917" />
              <ellipse cx="50" cy="55" rx="30" ry="15" fill="none" stroke="#B45309" strokeWidth="2" strokeDasharray="3 2" />
              <ellipse cx="115" cy="85" rx="26" ry="36" fill="url(#tablaWood)" stroke="#78350F" strokeWidth="1.5" />
              <ellipse cx="115" cy="45" rx="20" ry="11" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="115" cy="45" r="7" fill="#1C1917" />
              <line x1="98" y1="48" x2="96" y2="105" stroke="#D97706" strokeWidth="1.5" />
              <line x1="115" y1="56" x2="115" y2="120" stroke="#D97706" strokeWidth="1.5" />
              <line x1="132" y1="48" x2="134" y2="105" stroke="#D97706" strokeWidth="1.5" />
              <rect x="94" y="75" width="6" height="12" rx="1.5" fill="#FEF3C7" stroke="#78350F" strokeWidth="0.5" />
              <rect x="130" y="75" width="6" height="12" rx="1.5" fill="#FEF3C7" stroke="#78350F" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Element 3: Antique Brass Mystic Lantern (Bottom Left Outer Space) */}
          <div
            className="absolute -bottom-10 -left-10 sm:-left-16 w-20 sm:w-26 h-28 sm:h-34 transition-transform duration-500 hover:scale-115 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px rgba(234, 179, 8, 0.6))`, animationDuration: "5s", animationDelay: "2s" }}
            title="Filigree Brass Lantern"
          >
            <svg viewBox="0 0 100 150" className="w-full h-full -rotate-6">
              <defs>
                <linearGradient id="lanternBrass" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#CA8A04" />
                  <stop offset="100%" stopColor="#713F12" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="15" r="10" fill="none" stroke="url(#lanternBrass)" strokeWidth="3" />
              <line x1="50" y1="25" x2="50" y2="35" stroke="url(#lanternBrass)" strokeWidth="3" />
              <path d="M 25 50 Q 50 30 75 50 Z" fill="url(#lanternBrass)" stroke="#EAB308" strokeWidth="1" />
              <rect x="28" y="50" width="44" height="60" rx="3" fill="#451A03" opacity="0.8" stroke="url(#lanternBrass)" strokeWidth="2" />
              <circle cx="50" cy="80" r="14" fill="#F59E0B" opacity="0.6" className="animate-pulse" />
              <path d="M 50 70 Q 55 78 50 86 Q 45 78 50 70 Z" fill="#FEF08A" className="animate-pulse" />
              <line x1="28" y1="50" x2="72" y2="110" stroke="#CA8A04" strokeWidth="1" opacity="0.7" />
              <line x1="72" y1="50" x2="28" y2="110" stroke="#CA8A04" strokeWidth="1" opacity="0.7" />
              <polygon points="20,110 80,110 75,125 25,125" fill="url(#lanternBrass)" />
              <circle cx="32" cy="128" r="3" fill="#CA8A04" />
              <circle cx="68" cy="128" r="3" fill="#CA8A04" />
            </svg>
          </div>

          {/* Element 4: Whirling Dervish Sacred Seal (Bottom Right Outer Space) */}
          <div
            className="absolute -bottom-8 -right-8 sm:-right-14 w-20 sm:w-24 h-20 sm:h-24 transition-transform duration-500 hover:scale-120 animate-spin-slow pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 10px 20px rgba(16, 185, 129, 0.6))` }}
            title="Whirling Sama Emblem"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="46" fill="#064E3B" stroke="#34D399" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FDE047" strokeWidth="1" strokeDasharray="4 2" />
              <path d="M 50 25 Q 52 20 55 24 Q 58 28 52 32 Z" fill="#FDE047" />
              <circle cx="50" cy="34" r="3" fill="#FEF08A" />
              <path d="M 40 42 Q 50 36 62 44 Q 50 48 40 42 Z" fill="#FEF08A" />
              <path d="M 44 46 Q 30 75 50 78 Q 70 75 56 46 Z" fill="#FFFFFF" opacity="0.95" />
              <text x="50" y="90" textAnchor="middle" fill="#34D399" fontSize="6" fontWeight="bold">SAMA • TRANCE</text>
            </svg>
          </div>
        </div>
      );

    case "gazal":
      return (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Element 1: Classical Sarangi (Top Left Outer Space) */}
          <div
            className="absolute -top-12 -left-10 sm:-left-16 w-26 sm:w-32 h-34 sm:h-42 transition-transform duration-500 hover:scale-115 hover:-rotate-12 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px ${glowColor})`, animationDuration: "5s" }}
            title="Classical Sarangi"
          >
            <svg viewBox="0 0 120 180" className="w-full h-full -rotate-12">
              <defs>
                <linearGradient id="sarangiBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#92400E" />
                  <stop offset="60%" stopColor="#451A03" />
                  <stop offset="100%" stopColor="#1E0A02" />
                </linearGradient>
              </defs>
              <polygon points="35,15 85,15 80,65 40,65" fill="url(#sarangiBody)" stroke="#D97706" strokeWidth="1" />
              {[25, 38, 52].map(y => (
                <React.Fragment key={y}>
                  <rect x="22" y={y} width="16" height="4" fill="#FEF3C7" rx="2" />
                  <rect x="82" y={y} width="16" height="4" fill="#FEF3C7" rx="2" />
                </React.Fragment>
              ))}
              <rect x="42" y="65" width="36" height="30" fill="url(#sarangiBody)" />
              <path
                d="M 35 95 C 25 110, 20 140, 35 160 C 45 170, 75 170, 85 160 C 100 140, 95 110, 85 95 Z"
                fill="url(#sarangiBody)"
                stroke="#D97706"
                strokeWidth="1.5"
              />
              <path d="M 40 105 Q 60 98 80 105 Q 85 135 80 155 Q 60 162 40 155 Z" fill="#FEF3C7" opacity="0.9" />
              <rect x="52" y="125" width="16" height="6" fill="#F8FAFC" rx="1" stroke="#475569" strokeWidth="0.5" />
              <line x1="56" y1="20" x2="56" y2="160" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
              <line x1="60" y1="20" x2="60" y2="160" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
              <line x1="64" y1="20" x2="64" y2="160" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
            </svg>
          </div>

          {/* Element 2: Iconic Vintage Shure 55 Chrome Mic (Top Right Outer Space) */}
          <div
            className="absolute -top-12 -right-8 sm:-right-14 w-22 sm:w-28 h-28 sm:h-34 transition-transform duration-500 hover:scale-115 hover:rotate-12 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px ${glowColor})`, animationDuration: "6s", animationDelay: "1s" }}
            title="Vintage Shure 55 Mic"
          >
            <svg viewBox="0 0 120 160" className="w-full h-full rotate-10">
              <defs>
                <linearGradient id="vintageChrome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#E2E8F0" />
                  <stop offset="70%" stopColor="#64748B" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
              </defs>
              <path
                d="M 35 40 C 35 15, 85 15, 85 40 C 85 75, 68 95, 60 98 C 52 95, 35 75, 35 40 Z"
                fill="url(#vintageChrome)"
                stroke="#F8FAFC"
                strokeWidth="1.5"
              />
              {[25, 33, 41, 49, 57, 65, 73, 81].map((y, i) => (
                <line key={i} x1="42" y1={y} x2="78" y2={y} stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              ))}
              <rect x="52" y="98" width="16" height="14" rx="2" fill="url(#vintageChrome)" />
              <circle cx="60" cy="105" r="3" fill="#0F172A" />
              <rect x="56" y="112" width="8" height="40" fill="url(#vintageChrome)" />
            </svg>
          </div>

          {/* Element 3: Candelabra with Lit Wax Candles (Bottom Left Outer Space) */}
          <div
            className="absolute -bottom-10 -left-10 sm:-left-16 w-22 sm:w-28 h-26 sm:h-32 transition-transform duration-500 hover:scale-115 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px rgba(245, 158, 11, 0.6))`, animationDuration: "5.5s", animationDelay: "2s" }}
            title="Mehfil Candelabra"
          >
            <svg viewBox="0 0 140 140" className="w-full h-full -rotate-6">
              <defs>
                <linearGradient id="candlestick" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
              </defs>
              <rect x="65" y="35" width="10" height="45" fill="#FFFBEB" rx="1" stroke="#FEF3C7" strokeWidth="0.5" />
              <path d="M 70 20 Q 74 27 70 34 Q 66 27 70 20 Z" fill="#F59E0B" className="animate-pulse" />
              <rect x="35" y="50" width="10" height="35" fill="#FFFBEB" rx="1" stroke="#FEF3C7" strokeWidth="0.5" />
              <path d="M 40 35 Q 44 42 40 49 Q 36 42 40 35 Z" fill="#F59E0B" className="animate-pulse" />
              <rect x="95" y="50" width="10" height="35" fill="#FFFBEB" rx="1" stroke="#FEF3C7" strokeWidth="0.5" />
              <path d="M 100 35 Q 104 42 100 49 Q 96 42 100 35 Z" fill="#F59E0B" className="animate-pulse" />
              <path d="M 40 85 Q 70 100 100 85" stroke="url(#candlestick)" strokeWidth="4" fill="none" />
              <rect x="66" y="75" width="8" height="40" fill="url(#candlestick)" />
              <ellipse cx="70" cy="118" rx="28" ry="8" fill="url(#candlestick)" />
              <ellipse cx="45" cy="120" rx="8" ry="4" fill="#E11D48" />
              <ellipse cx="95" cy="122" rx="7" ry="3" fill="#BE123C" />
            </svg>
          </div>

          {/* Element 4: Urdu Poetry Manuscript Scroll (Bottom Right Outer Space) */}
          <div
            className="absolute -bottom-8 -right-8 sm:-right-14 w-20 sm:w-24 h-20 sm:h-24 transition-transform duration-500 hover:scale-120 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 10px 20px rgba(245, 158, 11, 0.5))` }}
            title="Urdu Shayari Scroll"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full rotate-8">
              <rect x="15" y="15" width="70" height="70" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              <line x1="25" y1="30" x2="75" y2="30" stroke="#78350F" strokeWidth="2" strokeDasharray="8 4 12 3" />
              <line x1="25" y1="42" x2="75" y2="42" stroke="#78350F" strokeWidth="2" strokeDasharray="14 3 6 4" />
              <line x1="25" y1="54" x2="75" y2="54" stroke="#78350F" strokeWidth="2" strokeDasharray="10 5 10 3" />
              <line x1="25" y1="66" x2="60" y2="66" stroke="#78350F" strokeWidth="2" strokeDasharray="12 4 8 2" />
              <circle cx="68" cy="68" r="8" fill="#E11D48" stroke="#9F1239" strokeWidth="1" />
              <text x="68" y="71" textAnchor="middle" fill="#FEF08A" fontSize="6" fontWeight="bold">غزل</text>
            </svg>
          </div>
        </div>
      );

    case "bollywood":
      return (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Element 1: Cinema Director's Clapperboard (Top Left Outer Space) */}
          <div
            className="absolute -top-12 -left-10 sm:-left-16 w-26 sm:w-32 h-24 sm:h-30 transition-transform duration-500 hover:scale-115 hover:-rotate-12 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px ${glowColor})`, animationDuration: "5s" }}
            title="Cinema Clapperboard"
          >
            <svg viewBox="0 0 140 120" className="w-full h-full -rotate-12">
              <defs>
                <linearGradient id="clapperBase" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
              </defs>
              <rect x="15" y="35" width="110" height="75" rx="4" fill="url(#clapperBase)" stroke="#E2E8F0" strokeWidth="1.5" />
              <text x="25" y="55" fill="#F8FAFC" fontSize="8" fontWeight="bold">PROD: BOLLYWOOD LIVE</text>
              <text x="25" y="70" fill="#E11D48" fontSize="7" fontWeight="bold">SCENE: 01</text>
              <text x="75" y="70" fill="#E11D48" fontSize="7" fontWeight="bold">TAKE: 04</text>
              <text x="25" y="85" fill="#F8FAFC" fontSize="6">DIRECTOR: HITSTAGE</text>
              <g transform="rotate(-15 15 35)">
                <rect x="15" y="18" width="110" height="16" rx="2" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1" />
                {[20, 40, 60, 80, 100].map((x, i) => (
                  <polygon key={i} points={`${x},18 ${x + 10},18 ${x + 5},34 ${x - 5},34`} fill="#F8FAFC" />
                ))}
              </g>
            </svg>
          </div>

          {/* Element 2: Golden Film Trophy Statuette (Top Right Outer Space) */}
          <div
            className="absolute -top-12 -right-8 sm:-right-14 w-20 sm:w-26 h-30 sm:h-38 transition-transform duration-500 hover:scale-115 hover:rotate-12 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px rgba(234, 179, 8, 0.7))`, animationDuration: "6s", animationDelay: "1s" }}
            title="Film Award Trophy"
          >
            <svg viewBox="0 0 100 160" className="w-full h-full rotate-6">
              <defs>
                <linearGradient id="goldTrophy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="35%" stopColor="#FBBF24" />
                  <stop offset="70%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="25" r="10" fill="url(#goldTrophy)" />
              <path d="M 44 35 L 56 35 L 54 75 L 46 75 Z" fill="url(#goldTrophy)" />
              <path d="M 30 35 Q 20 15 50 15 Q 80 15 70 35" stroke="url(#goldTrophy)" strokeWidth="3" fill="none" />
              <ellipse cx="50" cy="80" rx="18" ry="6" fill="url(#goldTrophy)" />
              <polygon points="32,85 68,85 75,135 25,135" fill="#0F172A" stroke="url(#goldTrophy)" strokeWidth="1" />
              <rect x="35" y="105" width="30" height="14" rx="1" fill="url(#goldTrophy)" />
              <text x="50" y="115" textAnchor="middle" fill="#000000" fontSize="5" fontWeight="bold">BEST ACT</text>
            </svg>
          </div>

          {/* Element 3: Golden Film Reel (Bottom Left Outer Space) */}
          <div
            className="absolute -bottom-10 -left-10 sm:-left-16 w-22 sm:w-26 h-22 sm:h-26 transition-transform duration-500 hover:scale-115 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px rgba(225, 29, 72, 0.6))`, animationDuration: "5.5s", animationDelay: "2s" }}
            title="Golden Film Reel"
          >
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-6">
              <defs>
                <linearGradient id="filmGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#CA8A04" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="48" fill="#1E1B4B" stroke="url(#filmGold)" strokeWidth="3" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <circle
                  key={i}
                  cx={60 + 30 * Math.cos((deg * Math.PI) / 180)}
                  cy={60 + 30 * Math.sin((deg * Math.PI) / 180)}
                  r="10"
                  fill="#0F172A"
                  stroke="url(#filmGold)"
                  strokeWidth="1.5"
                />
              ))}
              <circle cx="60" cy="60" r="14" fill="url(#filmGold)" />
              <circle cx="60" cy="60" r="5" fill="#0F172A" />
            </svg>
          </div>

          {/* Element 4: Cold Pyro Sparkler Starburst (Bottom Right Outer Space) */}
          <div
            className="absolute -bottom-8 -right-8 sm:-right-14 w-20 sm:w-24 h-20 sm:h-24 transition-transform duration-500 hover:scale-120 animate-spin-slow pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 10px 20px rgba(251, 113, 133, 0.8))` }}
            title="Cold Pyro Sparklers"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 40 * Math.cos((deg * Math.PI) / 180)}
                  y2={50 + 40 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#FB7185"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
              <circle cx="50" cy="50" r="16" fill="#F43F5E" className="animate-ping" style={{ animationDuration: "2s" }} />
              <circle cx="50" cy="50" r="12" fill="#FEF08A" />
            </svg>
          </div>
        </div>
      );

    case "carnival":
      return (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Element 1: Venetian Masquerade Feather Mask (Top Left Outer Space) */}
          <div
            className="absolute -top-12 -left-10 sm:-left-16 w-28 sm:w-34 h-26 sm:h-32 transition-transform duration-500 hover:scale-115 hover:-rotate-12 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px ${glowColor})`, animationDuration: "5s" }}
            title="Venetian Feather Mask"
          >
            <svg viewBox="0 0 160 130" className="w-full h-full -rotate-10">
              <defs>
                <linearGradient id="maskGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
                <linearGradient id="featherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <path d="M 80 50 Q 40 10 30 2 C 50 20, 70 30, 80 50 Z" fill="url(#featherGrad)" />
              <path d="M 80 50 Q 80 0 80 -10 C 88 15, 90 30, 80 50 Z" fill="#F43F5E" />
              <path d="M 80 50 Q 120 10 130 2 C 110 20, 90 30, 80 50 Z" fill="url(#featherGrad)" />
              <path
                d="M 30 60 Q 80 75 130 60 Q 140 90 120 105 Q 80 115 40 105 Q 20 90 30 60 Z"
                fill="url(#maskGold)"
                stroke="#FEF3C7"
                strokeWidth="1.5"
              />
              <ellipse cx="55" cy="80" rx="14" ry="8" fill="#0F172A" stroke="#FEF3C7" strokeWidth="1" />
              <ellipse cx="105" cy="80" rx="14" ry="8" fill="#0F172A" stroke="#FEF3C7" strokeWidth="1" />
              <path d="M 40 70 Q 55 60 70 70 M 90 70 Q 105 60 120 70" stroke="#FEF08A" strokeWidth="1.5" fill="none" />
              <circle cx="80" cy="65" r="5" fill="#EF4444" stroke="#FEF08A" strokeWidth="1" />
            </svg>
          </div>

          {/* Element 2: Fire Juggling Torch (Top Right Outer Space) */}
          <div
            className="absolute -top-12 -right-8 sm:-right-14 w-22 sm:w-28 h-30 sm:h-38 transition-transform duration-500 hover:scale-115 hover:rotate-12 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px rgba(249, 115, 22, 0.8))`, animationDuration: "6s", animationDelay: "1s" }}
            title="Fire Juggling Torch"
          >
            <svg viewBox="0 0 100 160" className="w-full h-full rotate-12">
              <defs>
                <linearGradient id="fireTorch" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="30%" stopColor="#F97316" />
                  <stop offset="70%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#7F1D1D" />
                </linearGradient>
              </defs>
              <path
                d="M 50 10 C 65 30, 80 50, 65 70 C 55 80, 45 80, 35 70 C 20 50, 35 30, 50 10 Z"
                fill="url(#fireTorch)"
                className="animate-pulse"
              />
              <path d="M 50 30 C 58 45, 65 55, 55 68 C 48 74, 42 74, 38 68 C 30 55, 42 45, 50 30 Z" fill="#FEF08A" />
              <rect x="42" y="70" width="16" height="18" fill="#1C1917" stroke="#78716C" strokeWidth="1" rx="2" />
              <ellipse cx="50" cy="90" rx="14" ry="4" fill="#94A3B8" />
              <rect x="47" y="92" width="6" height="60" fill="#CBD5E1" stroke="#475569" strokeWidth="0.5" />
              {[105, 115, 125, 135].map((y, i) => (
                <rect key={i} x="46" y={y} width="8" height="4" fill="#1E293B" rx="1" />
              ))}
            </svg>
          </div>

          {/* Element 3: Samba Percussion Drum (Bottom Left Outer Space) */}
          <div
            className="absolute -bottom-10 -left-10 sm:-left-16 w-24 sm:w-30 h-24 sm:h-30 transition-transform duration-500 hover:scale-115 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px rgba(236, 72, 153, 0.6))`, animationDuration: "5.5s", animationDelay: "2s" }}
            title="Samba Drum"
          >
            <svg viewBox="0 0 140 130" className="w-full h-full -rotate-6">
              <defs>
                <linearGradient id="drumShell" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <ellipse cx="70" cy="35" rx="45" ry="18" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
              <path d="M 25 35 L 25 90 C 25 105, 115 105, 115 90 L 115 35 Z" fill="url(#drumShell)" stroke="#F43F5E" strokeWidth="1.5" />
              <ellipse cx="70" cy="90" rx="45" ry="18" fill="none" stroke="#FDE047" strokeWidth="3" />
              {[35, 52, 70, 88, 105].map((x, i) => (
                <line key={i} x1={x} y1="36" x2={x} y2="92" stroke="#FDE047" strokeWidth="1.5" />
              ))}
              <line x1="30" y1="10" x2="110" y2="60" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
              <line x1="110" y1="10" x2="30" y2="60" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          {/* Element 4: Confetti Cannon Blast (Bottom Right Outer Space) */}
          <div
            className="absolute -bottom-8 -right-8 sm:-right-14 w-20 sm:w-24 h-20 sm:h-24 transition-transform duration-500 hover:scale-120 animate-spin-slow pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 10px 20px rgba(249, 115, 22, 0.7))` }}
            title="Carnival Confetti"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {[
                { cx: 30, cy: 30, color: "#EF4444", r: 4 },
                { cx: 70, cy: 25, color: "#F59E0B", r: 5 },
                { cx: 80, cy: 65, color: "#10B981", r: 4 },
                { cx: 25, cy: 75, color: "#3B82F6", r: 5 },
                { cx: 50, cy: 80, color: "#EC4899", r: 4 },
              ].map((c, i) => (
                <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.color} />
              ))}
              <polygon points="50,15 54,35 75,35 58,48 64,68 50,54 36,68 42,48 25,35 46,35" fill="#FDE047" stroke="#F59E0B" strokeWidth="1" />
            </svg>
          </div>
        </div>
      );

    case "devotional":
      return (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Element 1: Multi-Tier Brass Aarti Diya Stand (Top Left Outer Space) */}
          <div
            className="absolute -top-12 -left-10 sm:-left-16 w-26 sm:w-34 h-34 sm:h-42 transition-transform duration-500 hover:scale-115 hover:-rotate-12 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px rgba(245, 158, 11, 0.8))`, animationDuration: "5s" }}
            title="Brass Aarti Diya Stand"
          >
            <svg viewBox="0 0 130 180" className="w-full h-full -rotate-8">
              <defs>
                <linearGradient id="aartiBrass" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="40%" stopColor="#F59E0B" />
                  <stop offset="80%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
              </defs>
              <ellipse cx="65" cy="35" rx="14" ry="5" fill="url(#aartiBrass)" />
              <path d="M 65 18 Q 70 26 65 34 Q 60 26 65 18 Z" fill="#FDE047" className="animate-pulse" />
              <ellipse cx="65" cy="60" rx="30" ry="7" fill="url(#aartiBrass)" />
              {[45, 65, 85].map((x, i) => (
                <path key={i} d={`M ${x} 46 Q ${x + 4} 53 ${x} 59 Q ${x - 4} 53 ${x} 46 Z`} fill="#FDE047" className="animate-pulse" />
              ))}
              <ellipse cx="65" cy="90" rx="46" ry="9" fill="url(#aartiBrass)" />
              {[30, 48, 65, 82, 100].map((x, i) => (
                <path key={i} d={`M ${x} 76 Q ${x + 4} 83 ${x} 89 Q ${x - 4} 83 ${x} 76 Z`} fill="#FDE047" className="animate-pulse" />
              ))}
              <ellipse cx="65" cy="120" rx="58" ry="11" fill="url(#aartiBrass)" />
              {[20, 35, 50, 65, 80, 95, 110].map((x, i) => (
                <path key={i} d={`M ${x} 105 Q ${x + 4} 112 ${x} 119 Q ${x - 4} 112 ${x} 105 Z`} fill="#FDE047" className="animate-pulse" />
              ))}
              <rect x="62" y="35" width="6" height="110" fill="url(#aartiBrass)" />
              <polygon points="35,145 95,145 105,170 25,170" fill="url(#aartiBrass)" stroke="#FBBF24" strokeWidth="1" />
              <ellipse cx="65" cy="170" rx="40" ry="8" fill="url(#aartiBrass)" />
            </svg>
          </div>

          {/* Element 2: Sacred White Shankh (Top Right Outer Space) */}
          <div
            className="absolute -top-12 -right-8 sm:-right-14 w-22 sm:w-28 h-22 sm:h-28 transition-transform duration-500 hover:scale-115 hover:rotate-12 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px rgba(234, 88, 12, 0.6))`, animationDuration: "6s", animationDelay: "1s" }}
            title="Sacred Vedic Shankh"
          >
            <svg viewBox="0 0 120 120" className="w-full h-full rotate-12">
              <defs>
                <linearGradient id="shankhWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#FEF3C7" />
                  <stop offset="80%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
              <path
                d="M 25 60 C 25 30, 60 20, 95 35 C 105 45, 100 80, 85 95 C 65 110, 35 100, 25 80 Z"
                fill="url(#shankhWhite)"
                stroke="#D97706"
                strokeWidth="1.5"
              />
              <path d="M 45 40 Q 70 50 85 75 M 55 30 Q 80 40 95 65" stroke="#B45309" strokeWidth="1.5" fill="none" />
              <ellipse cx="32" cy="72" rx="10" ry="18" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
              <text x="70" y="65" fill="#DC2626" fontSize="14" fontWeight="bold">卐</text>
            </svg>
          </div>

          {/* Element 3: Sacred Temple Brass Dholak (Bottom Left Outer Space) */}
          <div
            className="absolute -bottom-10 -left-10 sm:-left-16 w-26 sm:w-32 h-20 sm:h-26 transition-transform duration-500 hover:scale-115 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 15px 25px rgba(245, 158, 11, 0.6))`, animationDuration: "5.5s", animationDelay: "2s" }}
            title="Temple Dholak"
          >
            <svg viewBox="0 0 150 100" className="w-full h-full -rotate-6">
              <defs>
                <linearGradient id="dholakWood" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9A3412" />
                  <stop offset="50%" stopColor="#C2410C" />
                  <stop offset="100%" stopColor="#431407" />
                </linearGradient>
              </defs>
              <ellipse cx="25" cy="50" rx="12" ry="25" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.5" />
              <path d="M 25 25 Q 75 10 125 30 L 125 70 Q 75 90 25 75 Z" fill="url(#dholakWood)" stroke="#78350F" strokeWidth="1.5" />
              <ellipse cx="125" cy="50" rx="10" ry="20" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="125" cy="50" r="5" fill="#1C1917" />
              {[35, 55, 75, 95, 115].map((x, i) => (
                <React.Fragment key={i}>
                  <line x1="25" y1="50" x2={x} y2={i % 2 === 0 ? 18 : 82} stroke="#FEF08A" strokeWidth="1.5" />
                  <line x1={x} y1={i % 2 === 0 ? 18 : 82} x2="125" y2="50" stroke="#FEF08A" strokeWidth="1.5" />
                  <circle cx={x} cy="50" r="3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.5" />
                </React.Fragment>
              ))}
            </svg>
          </div>

          {/* Element 4: Temple Puja Bell (Bottom Right Outer Space) */}
          <div
            className="absolute -bottom-8 -right-8 sm:-right-14 w-20 sm:w-24 h-20 sm:h-24 transition-transform duration-500 hover:scale-120 animate-float pointer-events-auto cursor-pointer"
            style={{ filter: `drop-shadow(0 10px 20px rgba(245, 158, 11, 0.7))` }}
            title="Temple Brass Bell with Om"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full rotate-6">
              <defs>
                <linearGradient id="bellBrass" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#EAB308" />
                  <stop offset="100%" stopColor="#854D0E" />
                </linearGradient>
              </defs>
              <path d="M 48 10 L 52 10 L 54 35 L 46 35 Z" fill="url(#bellBrass)" />
              <circle cx="50" cy="12" r="4" fill="#F59E0B" />
              <path d="M 30 70 C 30 40, 70 40, 70 70 Z" fill="url(#bellBrass)" stroke="#CA8A04" strokeWidth="1" />
              <ellipse cx="50" cy="70" rx="22" ry="6" fill="url(#bellBrass)" stroke="#CA8A04" strokeWidth="1" />
              <circle cx="50" cy="76" r="3" fill="#78350F" />
              <text x="50" y="58" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="bold">ॐ</text>
              <circle cx="28" cy="78" r="6" fill="#F97316" stroke="#FEF08A" strokeWidth="0.5" />
              <circle cx="72" cy="78" r="6" fill="#F59E0B" stroke="#FEF08A" strokeWidth="0.5" />
            </svg>
          </div>
        </div>
      );

    default:
      return null;
  }
};
