import { useState, useEffect } from "react";
import { Artist, GENRE_METADATA, ALL_ARTISTS } from "../data/artistsData";

interface GenresCatalogPageProps {
  onSelectGenre: (genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
  onBackHome: () => void;
  onBrowseArtists?: () => void;
  artists?: Artist[];
}

export function GenresCatalogPage({
  onSelectGenre,
  onBackHome,
  artists,
}: GenresCatalogPageProps) {
  const sourceArtists = artists || ALL_ARTISTS;

  // Auto-typing genres list with distinct vivid colors
  const AUTO_TYPED_GENRES = [
    { name: "Sufi", color: "#34D399" },        // Emerald Trance
    { name: "Rock", color: "#F43F5E" },        // Electric Rose Red
    { name: "Ghazal", color: "#FDE047" },      // Luminous Mehfil Gold
    { name: "Bollywood", color: "#FB7185" },   // Bollywood Coral Pink
    { name: "Carnival", color: "#C084FC" },    // Carnival Purple
    { name: "Devotional", color: "#FBBF24" },  // Sacred Saffron Amber
  ];

  const [genreIndex, setGenreIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentItem = AUTO_TYPED_GENRES[genreIndex];
    const fullText = currentItem.name;
    const speed = isDeleting ? 45 : 90;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < fullText.length) {
          setTypedText(fullText.slice(0, typedText.length + 1));
        } else {
          // Pause when word is completely typed
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(fullText.slice(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setGenreIndex(prev => (prev + 1) % AUTO_TYPED_GENRES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, genreIndex]);

  const GENRES_LIST: Array<"sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional"> = [
    "sufi",
    "rock",
    "gazal",
    "bollywood",
    "carnival",
    "devotional",
  ];

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#1A1A1A] font-body pb-28">
      {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F3E5E8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div
            onClick={onBackHome}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9333EA] flex items-center justify-center text-white font-bold text-sm shadow-md">
              ✦
            </div>
            <span className="font-display font-bold text-xl text-[#1A1A1A] tracking-tight">StageBridge</span>
            <span className="text-[9px] font-body text-[#E11D48] font-bold tracking-[0.2em] uppercase bg-[#E11D48]/10 px-1.5 py-0.5 rounded-full">
              Genres Hub
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#5B5B5B] font-semibold hidden sm:inline">
              6 Curated Performance Traditions
            </span>
          </div>
        </div>
      </header>

      {/* ── ARTISTIC ASYMMETRICAL BANNER (Red Concert Gradient Background & Text-Only Auto-Typing) ── */}
      <section className="relative bg-gradient-to-b from-[#180208] via-[#2D0410] to-[#100106] text-white py-8 sm:py-12 px-4 sm:px-6 overflow-hidden border-b border-[#E11D48]/20 shadow-2xl">
        {/* Soft Ambient Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#E11D48]/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#9333EA]/20 blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* UNORGANIZED ASYMMETRICAL COLLAGE: Varied Sizes, Dynamic Angles */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] flex items-center justify-center">
            {/* Concentric Subtle Orbit Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[520px] h-[520px] rounded-full border border-dashed border-[#E11D48]/25 animate-spin-slow" />
              <div className="w-[380px] h-[380px] rounded-full border border-[#BE123C]/15 animate-pulse-subtle" />
            </div>

            {/* Floating 3D Musical Symbols */}
            <div className="absolute top-1/4 right-[12%] text-3xl text-[#FB7185] animate-float opacity-70 pointer-events-none z-20 font-bold">♪</div>
            <div className="absolute bottom-1/4 left-[12%] text-4xl text-amber-300 animate-float-alt opacity-70 pointer-events-none z-20 font-bold">♫</div>

            {/* ── 1. CENTER HERO CORE (Auto-Typing Headline Only) ── */}
            <div className="relative z-30 max-w-xl text-center space-y-3.5 py-4 px-4 my-auto">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-[#FB7185] shadow-sm backdrop-blur-md">
                <span>✦ 6 Master Performance Traditions</span>
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white tracking-tight leading-[1.1] flex flex-col items-center justify-center">
                <span>Explore Live</span>
                <span
                  className="italic transition-colors duration-300 min-h-[1.2em] flex items-center justify-center pt-1"
                  style={{
                    color: AUTO_TYPED_GENRES[genreIndex].color,
                    textShadow: `0 0 25px ${AUTO_TYPED_GENRES[genreIndex].color}80`,
                  }}
                >
                  <span>{typedText}</span>
                  <span className="inline-block w-1 sm:w-1.5 h-8 sm:h-12 bg-current ml-1 animate-pulse" />
                </span>
              </h1>

              <div className="pt-2 flex items-center justify-center">
                <a
                  href="#all-genres-grid"
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#BE123C] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 border border-white/20"
                >
                  <span>View All Artists Roster</span>
                  <span>↓</span>
                </a>
              </div>
            </div>

            {/* ── 2. SCATTERED FREESTYLE PURE IMAGE CARDS (UP, DOWN, LEFT, RIGHT, TOP-RIGHT CORNER) ── */}

            {/* Card 1: UP / TOP-CENTER-LEFT (Above the Heading) */}
            <div
              onClick={() => onSelectGenre("sufi")}
              className="absolute top-0 left-[18%] sm:left-[22%] lg:left-[20%] w-36 sm:w-48 lg:w-52 h-26 sm:h-34 lg:h-38 rounded-[28px] overflow-hidden shadow-2xl border-2 border-white/40 hover:border-[#34D399] transition-all duration-500 hover:scale-110 cursor-pointer group bg-black z-20 -rotate-6 hover:rotate-0"
              title="Explore Sufi"
            >
              <img
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=400&fit=crop&auto=format"
                alt="Sufi"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-10 transition-opacity" />
            </div>

            {/* Card 2: TOP-RIGHT CORNER (Floating High Right Corner) */}
            <div
              onClick={() => onSelectGenre("bollywood")}
              className="absolute top-1 right-[2%] sm:right-[4%] lg:right-[3%] w-44 sm:w-56 lg:w-64 h-32 sm:h-40 lg:h-44 rounded-[32px] overflow-hidden shadow-2xl border-2 border-white/40 hover:border-[#FB7185] transition-all duration-500 hover:scale-110 cursor-pointer group bg-black z-20 rotate-8 hover:rotate-0"
              title="Explore Bollywood"
            >
              <img
                src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=400&fit=crop&auto=format"
                alt="Bollywood"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-10 transition-opacity" />
            </div>

            {/* Card 3: LEFT SIDE (Directly on the Left Edge of Heading) */}
            <div
              onClick={() => onSelectGenre("rock")}
              className="absolute top-1/2 -translate-y-1/2 left-0 sm:left-[2%] lg:left-[1%] w-36 sm:w-44 lg:w-48 h-36 sm:h-44 lg:h-48 rounded-[30px] overflow-hidden shadow-2xl border-2 border-white/40 hover:border-[#F43F5E] transition-all duration-500 hover:scale-110 cursor-pointer group bg-black z-20 -rotate-8 hover:rotate-0 hidden md:block"
              title="Explore Rock"
            >
              <img
                src="https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=450&h=450&fit=crop&auto=format"
                alt="Rock"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-10 transition-opacity" />
            </div>

            {/* Card 4: RIGHT SIDE (Directly on the Right Edge of Heading) */}
            <div
              onClick={() => onSelectGenre("devotional")}
              className="absolute top-[55%] -translate-y-1/2 right-0 sm:right-[2%] lg:right-[1%] w-36 sm:w-46 lg:w-50 h-40 sm:h-48 lg:h-54 rounded-[36px] overflow-hidden shadow-2xl border-2 border-white/40 hover:border-[#FBBF24] transition-all duration-500 hover:scale-110 cursor-pointer group bg-black z-20 rotate-6 hover:rotate-0 hidden md:block"
              title="Explore Devotional"
            >
              <img
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=450&h=500&fit=crop&auto=format"
                alt="Devotional"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-10 transition-opacity" />
            </div>

            {/* Card 5: DOWN / BOTTOM-LEFT (Below Heading on Left) */}
            <div
              onClick={() => onSelectGenre("gazal")}
              className="absolute bottom-0 left-[10%] sm:left-[16%] lg:left-[14%] w-44 sm:w-56 lg:w-60 h-30 sm:h-36 lg:h-40 rounded-[30px] overflow-hidden shadow-2xl border-2 border-white/40 hover:border-[#FDE047] transition-all duration-500 hover:scale-110 cursor-pointer group bg-black z-20 rotate-5 hover:rotate-0"
              title="Explore Ghazal"
            >
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=550&h=400&fit=crop&auto=format"
                alt="Ghazal"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-10 transition-opacity" />
            </div>

            {/* Card 6: DOWN / BOTTOM-RIGHT (Below Heading on Right) */}
            <div
              onClick={() => onSelectGenre("carnival")}
              className="absolute bottom-0 right-[14%] sm:right-[18%] lg:right-[16%] w-40 sm:w-50 lg:w-56 h-32 sm:h-40 lg:h-44 rounded-[32px] overflow-hidden shadow-2xl border-2 border-white/40 hover:border-[#C084FC] transition-all duration-500 hover:scale-110 cursor-pointer group bg-black z-20 -rotate-5 hover:rotate-0"
              title="Explore Carnival"
            >
              <img
                src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=450&fit=crop&auto=format"
                alt="Carnival"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-10 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL 6 GENRES DETAILED DIRECTORY CATALOG ────────────────────────── */}
      <main id="all-genres-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#BE123C] uppercase tracking-widest bg-[#FFF0F3] px-3.5 py-1 rounded-full border border-[#F3E5E8]">
            ✦ Complete Performance Roster
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1A1A1A]">
            Curated Musical &amp; Entertainment Traditions
          </h2>
          <p className="text-xs sm:text-sm text-[#5B5B5B]">
            Select any genre card below to view verified artists, detailed rate cards, audio medleys, and technical riders.
          </p>
        </div>

        {/* 6 Genre Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GENRES_LIST.map(genreId => {
            const meta = GENRE_METADATA[genreId];
            if (!meta) return null;
            const genreArtists = sourceArtists.filter(a => a.genre === genreId);

            return (
              <div
                key={genreId}
                className="bg-white rounded-3xl overflow-hidden border border-[#F3E5E8] shadow-sm hover:shadow-xl hover:border-[#E11D48]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Hero Header Media */}
                <div
                  onClick={() => onSelectGenre(genreId)}
                  className="relative h-60 overflow-hidden bg-gray-900 cursor-pointer"
                >
                  <img
                    src={meta.heroImg}
                    alt={meta.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Badges on Hero */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-lg bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-md">
                      {meta.icon}
                    </span>
                    <span
                      className="text-xs font-bold text-white px-3 py-1 rounded-full shadow-md bg-[#E11D48]"
                    >
                      {genreArtists.length} Verified Artists
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display font-bold text-2xl drop-shadow-md">
                      {meta.title}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                      {meta.tag} — {meta.description}
                    </p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <p className="text-xs text-[#5B5B5B] leading-relaxed line-clamp-3">
                      {meta.longDescription}
                    </p>

                    {/* Instruments & Occasions Tags */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                        Key Instruments
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {meta.elements?.instruments?.map(inst => (
                          <span
                            key={inst.name}
                            className="text-[11px] bg-[#FFF8F8] border border-[#F3E5E8] text-[#BE123C] font-medium px-2.5 py-1 rounded-lg"
                          >
                            {inst.icon || "♪"} {inst.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F3E5E8] text-xs">
                      <div>
                        <span className="text-[#5B5B5B] block text-[10px] uppercase font-semibold">Typical Range</span>
                        <span className="font-display font-bold text-sm text-[#1A1A1A]">{meta.avgPriceRange}</span>
                      </div>
                      <div>
                        <span className="text-[#5B5B5B] block text-[10px] uppercase font-semibold">Stage &amp; Atmosphere</span>
                        <span className="font-bold text-[#BE123C] text-xs truncate block">{meta.elements?.stageVibe || "Live Concert Vibe"}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectGenre(genreId)}
                    className="w-full py-3 rounded-2xl bg-[#FFF0F3] hover:bg-[#E11D48] text-[#BE123C] hover:text-white text-xs font-bold border border-[#F3E5E8] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs group-hover:bg-[#E11D48] group-hover:text-white"
                  >
                    <span>View All {meta.title} Artists</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
