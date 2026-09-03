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
  onBrowseArtists,
  artists,
}: GenresCatalogPageProps) {
  const sourceArtists = artists || ALL_ARTISTS;

  const AUTO_TYPED_GENRES = [
    { name: "Sufi & Qawwali", color: "#DDB96A" },
    { name: "Indie & Rock", color: "#60A5FA" },
    { name: "Ghazal & Classical", color: "#34D399" },
    { name: "Bollywood & Dance", color: "#FBBF24" },
    { name: "Carnival & Theatre", color: "#C084FC" },
    { name: "Devotional & Folk", color: "#FB923C" },
  ];

  const [genreIndex, setGenreIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentItem = AUTO_TYPED_GENRES[genreIndex];
    const fullText = currentItem.name;
    const speed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < fullText.length) {
          setTypedText(fullText.slice(0, typedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1600);
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
    <div className="min-h-screen text-[#1A1916] pb-28" style={{ background: "#FAF7F2", fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EDE8DF] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[68px] flex items-center justify-between">
          <button
            onClick={onBackHome}
            className="flex flex-col leading-none cursor-pointer group select-none text-left"
          >
            <span
              className="font-serif text-[22px] font-light tracking-[0.06em] text-[#1A1916] group-hover:text-[#C4952A] transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.08em" }}
            >
              MANNAT ARTS
            </span>
            <span className="label-editorial text-[#C4952A] tracking-[0.22em]" style={{ fontSize: "7px" }}>
              GENRES CATALOG
            </span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onBackHome}
              className="font-ui text-[13px] font-medium text-[#4A4845] hover:text-[#1A1916] transition-colors cursor-pointer"
            >
              ← Back to Home
            </button>
            {onBrowseArtists && (
              <button
                onClick={onBrowseArtists}
                className="font-ui text-[13px] font-semibold bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] px-5 py-2.5 rounded-full transition-all cursor-pointer"
              >
                All Artists Roster
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── EDITORIAL ASYMMETRICAL BANNER ─────────────────────────────────── */}
      <section className="relative bg-[#1A1916] text-white py-16 sm:py-20 px-6 overflow-hidden border-b border-white/10 shadow-2xl">
        {/* Soft Ambient Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C4952A]/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#B5593C]/15 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center">
            {/* Concentric Subtle Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[500px] rounded-full border border-dashed border-white/10 animate-spin-slow" />
              <div className="w-[360px] h-[360px] rounded-full border border-white/10" />
            </div>

            {/* ── CENTER HERO CORE ── */}
            <div className="relative z-30 max-w-xl text-center space-y-4 py-4 px-4 my-auto">
              <span className="label-editorial text-[#DDB96A] tracking-[0.28em] inline-block" style={{ fontSize: "10px" }}>
                · 6 CURATED PERFORMANCE TRADITIONS ·
              </span>

              <h1
                className="font-serif font-light text-white tracking-[-0.01em] leading-[1.08] flex flex-col items-center justify-center"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 6vw, 76px)" }}
              >
                <span>Discover the World of</span>
                <span
                  className="italic transition-colors duration-300 min-h-[1.2em] flex items-center justify-center pt-1"
                  style={{
                    color: AUTO_TYPED_GENRES[genreIndex].color,
                    textShadow: `0 0 25px ${AUTO_TYPED_GENRES[genreIndex].color}70`,
                  }}
                >
                  <span>{typedText}</span>
                  <span className="inline-block w-1 h-8 sm:h-12 bg-current ml-1 animate-pulse" />
                </span>
              </h1>

              <p className="font-ui text-[#A8A49A] text-[15px] font-light leading-relaxed max-w-lg mx-auto">
                Explore verified performing ensembles, traditional acoustic baithaks, and high-energy stadium acts.
              </p>

              <div className="pt-3 flex items-center justify-center">
                <a
                  href="#all-genres-grid"
                  className="font-ui font-semibold text-[13px] bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Browse All Traditions</span>
                  <span>↓</span>
                </a>
              </div>
            </div>

            {/* ── SCATTERED EDITORIAL FLOATING PHOTO SATELLITES ── */}
            {/* Top-Left */}
            <div
              onClick={() => onSelectGenre("sufi")}
              className="absolute top-0 left-[8%] sm:left-[14%] lg:left-[12%] w-36 sm:w-44 lg:w-48 h-26 sm:h-32 lg:h-36 rounded-2xl overflow-hidden shadow-2xl border border-white/20 hover:border-[#DDB96A] transition-all duration-500 hover:scale-105 cursor-pointer z-20 -rotate-6 hover:rotate-0"
              title="Explore Sufi"
            >
              <img
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=400&fit=crop&auto=format"
                alt="Sufi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-2 left-3 label-editorial text-white text-[9px]">SUFI</span>
            </div>

            {/* Top-Right */}
            <div
              onClick={() => onSelectGenre("bollywood")}
              className="absolute top-2 right-[6%] sm:right-[12%] lg:right-[10%] w-40 sm:w-48 lg:w-52 h-28 sm:h-34 lg:h-38 rounded-2xl overflow-hidden shadow-2xl border border-white/20 hover:border-[#DDB96A] transition-all duration-500 hover:scale-105 cursor-pointer z-20 rotate-6 hover:rotate-0"
              title="Explore Bollywood"
            >
              <img
                src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=400&fit=crop&auto=format"
                alt="Bollywood"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-2 left-3 label-editorial text-white text-[9px]">BOLLYWOOD</span>
            </div>

            {/* Bottom-Left */}
            <div
              onClick={() => onSelectGenre("gazal")}
              className="absolute bottom-0 left-[8%] sm:left-[12%] lg:left-[14%] w-40 sm:w-48 lg:w-52 h-28 sm:h-32 lg:h-36 rounded-2xl overflow-hidden shadow-2xl border border-white/20 hover:border-[#DDB96A] transition-all duration-500 hover:scale-105 cursor-pointer z-20 rotate-4 hover:rotate-0"
              title="Explore Ghazal"
            >
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=550&h=400&fit=crop&auto=format"
                alt="Ghazal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-2 left-3 label-editorial text-white text-[9px]">GHAZAL</span>
            </div>

            {/* Bottom-Right */}
            <div
              onClick={() => onSelectGenre("rock")}
              className="absolute bottom-0 right-[8%] sm:right-[12%] lg:right-[14%] w-36 sm:w-44 lg:w-48 h-26 sm:h-32 lg:h-36 rounded-2xl overflow-hidden shadow-2xl border border-white/20 hover:border-[#DDB96A] transition-all duration-500 hover:scale-105 cursor-pointer z-20 -rotate-4 hover:rotate-0"
              title="Explore Rock"
            >
              <img
                src="https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=450&h=450&fit=crop&auto=format"
                alt="Rock"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-2 left-3 label-editorial text-white text-[9px]">ROCK</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL 6 GENRES EDITORIAL DIRECTORY ─────────────────────────────── */}
      <main id="all-genres-grid" className="max-w-7xl mx-auto px-6 lg:px-8 py-20 space-y-12">
        <div className="max-w-xl">
          <span className="label-editorial text-[#C4952A] tracking-[0.22em] block mb-3" style={{ fontSize: "10px" }}>
            CATALOG OF GENRES
          </span>
          <h2
            className="font-serif font-light text-[#1A1916] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            Curated Performance<br />
            <em style={{ fontStyle: "italic" }}>Traditions</em>
          </h2>
          <p className="font-ui text-[#7A776F] text-[15px] leading-relaxed mt-3">
            Select any tradition below to view verified artists, detailed rate cards, audio medleys, and technical riders.
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
                className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EDE8DF] hover:border-[#C4952A]/40 transition-all duration-400 flex flex-col justify-between group lift-card"
              >
                {/* Hero Header Media */}
                <div
                  onClick={() => onSelectGenre(genreId)}
                  className="relative h-64 overflow-hidden bg-gray-900 cursor-pointer img-zoom"
                >
                  <img
                    src={meta.heroImg}
                    alt={meta.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Badges on Hero */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-xs font-semibold text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {genreArtists.length} Verified Artists
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="label-editorial text-[#DDB96A] text-[9px] tracking-widest block mb-1">
                      {meta.tag}
                    </span>
                    <h3
                      className="font-serif font-light text-2xl drop-shadow-md text-white group-hover:text-[#DDB96A] transition-colors"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {meta.title}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <p className="font-ui text-[13px] text-[#7A776F] leading-relaxed line-clamp-3">
                      {meta.longDescription}
                    </p>

                    {/* Instruments Tags */}
                    <div className="space-y-2">
                      <div className="label-editorial text-[#4A4845]" style={{ fontSize: "9px" }}>
                        SIGNATURE INSTRUMENTS
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {meta.elements?.instruments?.map(inst => (
                          <span
                            key={inst.name}
                            className="font-ui text-[11px] bg-[#F5F0E8] border border-[#EDE8DF] text-[#4A4845] font-medium px-2.5 py-1 rounded-md"
                          >
                            {inst.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EDE8DF] text-xs">
                      <div>
                        <span className="label-editorial text-[#7A776F] block" style={{ fontSize: "8px" }}>TYPICAL RANGE</span>
                        <span className="font-ui font-semibold text-[13px] text-[#1A1916] mt-0.5 block">{meta.avgPriceRange}</span>
                      </div>
                      <div>
                        <span className="label-editorial text-[#7A776F] block" style={{ fontSize: "8px" }}>ATMOSPHERE</span>
                        <span className="font-ui font-medium text-[12px] text-[#C4952A] truncate block mt-0.5">{meta.elements?.stageVibe || "Live Concert"}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectGenre(genreId)}
                    className="w-full py-3 rounded-full bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] font-ui text-[13px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:bg-[#C4952A] group-hover:text-[#1A1916]"
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
