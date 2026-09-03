import { useState, useMemo } from "react";
import { Artist, GenreInfo, GENRE_METADATA, ALL_ARTISTS } from "../data/artistsData";

interface GenreViewProps {
  genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";
  onSelectGenre: (genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
  onBack: () => void;
  onSelectArtist: (artist: Artist) => void;
  onBookArtist: (artist: Artist) => void;
  allArtists?: Artist[];
  genresMap?: Record<string, GenreInfo>;
}

export function GenreView({
  genreId,
  onSelectGenre,
  onBack,
  onSelectArtist,
  onBookArtist,
  allArtists,
  genresMap,
}: GenreViewProps) {
  const genreInfo: GenreInfo = (genresMap && genresMap[genreId]) || GENRE_METADATA[genreId];
  const sourceArtists = allArtists || ALL_ARTISTS;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedBandType, setSelectedBandType] = useState("All");
  const [maxBudget, setMaxBudget] = useState<number>(100000);

  // Filter artists belonging to this genre
  const artists = useMemo(() => {
    return sourceArtists.filter(a => {
      if (a.genre !== genreId) return false;
      if (selectedCity !== "All" && a.city !== selectedCity) return false;
      if (selectedBandType !== "All" && a.bandType !== selectedBandType) return false;
      if (a.priceNum > maxBudget) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = a.name.toLowerCase().includes(query) || (a.stageName && a.stageName.toLowerCase().includes(query));
        const matchesSkills = a.whatElseTheyDo.some(s => s.category.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
        const matchesInst = a.primaryInstruments.some(i => i.toLowerCase().includes(query));
        if (!matchesName && !matchesSkills && !matchesInst) return false;
      }
      return true;
    });
  }, [sourceArtists, genreId, selectedCity, selectedBandType, maxBudget, searchTerm]);

  const allCities = useMemo(() => {
    const cities = new Set<string>();
    sourceArtists.filter(a => a.genre === genreId).forEach(a => cities.add(a.city));
    return ["All", ...Array.from(cities)];
  }, [sourceArtists, genreId]);

  return (
    <div className="min-h-screen text-white pb-28" style={{ background: "#1A1916", fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* ── FULL-VIEWPORT BANNER ─── */}
      <section
        className="relative min-h-[90vh] flex flex-col justify-between text-white overflow-hidden border-b border-white/10 shadow-2xl"
        style={{ background: genreInfo.vibe.bgGradient }}
      >
        {/* Background Image on Right with Feather Fade */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[#1A1916]" />

          <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[68%] h-full overflow-hidden">
            <img
              key={genreInfo.heroImg}
              src={genreInfo.heroImg}
              alt={`${genreInfo.title} Live Background`}
              className="w-full h-full object-cover opacity-85 transition-all duration-700 brightness-95"
            />
            {/* Seamless Feather Fade */}
            <div className="absolute inset-y-0 left-0 w-48 sm:w-80 bg-gradient-to-r from-[#1A1916] via-[#1A1916]/80 via-45% via-[#1A1916]/20 via-75% to-transparent" />
            <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-[#1A1916] via-[#1A1916]/80 via-60% to-transparent" />
          </div>
        </div>

        {/* Top Bar inside Banner: Logo + Genre Switcher */}
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-2 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <button
              onClick={onBack}
              className="flex flex-col leading-none cursor-pointer group select-none text-left"
            >
              <span
                className="font-serif text-[22px] font-light tracking-[0.06em] text-white group-hover:text-[#DDB96A] transition-colors"
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.08em" }}
              >
                MANNAT ARTS
              </span>
              <span className="label-editorial text-[#DDB96A] tracking-[0.22em]" style={{ fontSize: "7px" }}>
                {genreInfo.title.toUpperCase()} EXPERIENCE
              </span>
            </button>

            {/* Quick Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="label-editorial text-white/50 text-[9px] mr-1 whitespace-nowrap">SWITCH TRADITION:</span>
              {(Object.keys(GENRE_METADATA) as Array<"sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional">).map(gId => {
                const meta = GENRE_METADATA[gId];
                const isActive = gId === genreId;
                return (
                  <button
                    key={gId}
                    onClick={() => onSelectGenre(gId)}
                    className={`font-ui px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "text-[#1A1916] shadow-lg scale-105 bg-[#C4952A]"
                        : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/15"
                    }`}
                  >
                    <span>{meta.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Main Stage Content */}
        <div className="flex-1 flex items-center w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 relative z-10">
          <div className="w-full lg:w-[50%] max-w-2xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-editorial text-[#DDB96A] tracking-[0.25em]" style={{ fontSize: "10px" }}>
                · CULTURAL TRADITION ·
              </span>
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-xs font-semibold text-white/90">
                <span className="text-green-400 font-bold">●</span>
                <span>Verified Artists Available</span>
              </div>
            </div>

            <h1
              className="font-serif font-light text-white leading-[1.08] tracking-[-0.01em]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 5.5vw, 80px)" }}
            >
              Experience Soulful<br />
              <em style={{ fontStyle: "italic", color: "#DDB96A" }}>
                {genreInfo.title}
              </em><br />
              Performances
            </h1>

            <p className="font-ui text-[#A8A49A] text-[15px] font-light leading-relaxed max-w-xl">
              {genreInfo.longDescription}
            </p>
          </div>
        </div>

        {/* Bottom Bar: Scroll link */}
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-6 flex items-center justify-center relative z-10">
          <a
            href="#artists-grid"
            className="font-ui inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white transition-all shadow-md cursor-pointer"
          >
            <span>Explore {genreInfo.title} Performers</span>
            <span>↓</span>
          </a>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div id="artists-grid" className="w-full max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-8">
        <div className="bg-[#242320] rounded-2xl p-6 shadow-xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
          <div>
            <label className="label-editorial text-white/60 block mb-2" style={{ fontSize: "9px" }}>
              SEARCH PERFORMER
            </label>
            <input
              type="text"
              placeholder="e.g. Artist name, skill..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-white placeholder-white/40 focus:outline-none focus:border-[#C4952A]"
            />
          </div>

          <div>
            <label className="label-editorial text-white/60 block mb-2" style={{ fontSize: "9px" }}>
              LOCATION / CITY
            </label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full bg-[#1A1916] border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-white focus:outline-none focus:border-[#C4952A] cursor-pointer"
            >
              {allCities.map(c => (
                <option key={c} value={c} className="bg-[#1A1916] text-white">{c === "All" ? "All Locations" : c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-editorial text-white/60 block mb-2" style={{ fontSize: "9px" }}>
              FORMAT / SETUP
            </label>
            <select
              value={selectedBandType}
              onChange={e => setSelectedBandType(e.target.value)}
              className="w-full bg-[#1A1916] border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-white focus:outline-none focus:border-[#C4952A] cursor-pointer"
            >
              <option value="All" className="bg-[#1A1916] text-white">All Formats</option>
              <option value="Solo" className="bg-[#1A1916] text-white">Solo Artist</option>
              <option value="Duo" className="bg-[#1A1916] text-white">Duo</option>
              <option value="Trio" className="bg-[#1A1916] text-white">Trio</option>
              <option value="4-6 Piece Band" className="bg-[#1A1916] text-white">4-6 Piece Live Band</option>
              <option value="Full Troupe (8+ Members)" className="bg-[#1A1916] text-white">Full Troupe (8+ Members)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label-editorial text-white/60" style={{ fontSize: "9px" }}>MAX BUDGET</label>
              <span className="font-ui text-xs font-bold text-[#DDB96A]">₹{maxBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={15000}
              max={500000}
              step={10000}
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#C4952A] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ── ARTISTS LISTING GRID ── */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <h2
            className="font-serif font-light text-2xl sm:text-3xl text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Verified {genreInfo.title} Performers ({artists.length})
          </h2>
          <span className="font-ui text-xs text-white/60">
            Showing talent for <strong className="text-[#DDB96A]">{genreInfo.title}</strong>
          </span>
        </div>

        {artists.length === 0 ? (
          <div className="bg-[#242320] rounded-3xl p-16 text-center border border-white/10">
            <h3 className="font-serif font-light text-xl text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              No artists found matching your criteria
            </h3>
            <p className="font-ui text-xs text-white/60 mb-6">
              Try adjusting your city filter or increasing your maximum budget.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("All");
                setSelectedBandType("All");
                setMaxBudget(100000);
              }}
              className="font-ui px-6 py-2.5 rounded-full bg-[#C4952A] text-[#1A1916] text-xs font-semibold hover:bg-[#DDB96A] cursor-pointer transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map(artist => (
              <div
                key={artist.id}
                className="bg-[#242320] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-400 border border-white/10 hover:border-[#C4952A]/40 flex flex-col group lift-card"
              >
                {/* Photo Banner */}
                <div
                  className="relative h-64 overflow-hidden bg-black/50 cursor-pointer img-zoom"
                  onClick={() => onSelectArtist(artist)}
                >
                  <img
                    src={artist.img}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242320] via-black/40 to-transparent" />

                  {/* Top Badges */}
                  <span className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md text-white font-ui text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
                    {artist.bandType}
                  </span>
                  <span className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md text-[#DDB96A] border border-[#DDB96A]/30 font-ui text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    ✓ Verified
                  </span>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3
                      className="font-serif font-light text-2xl text-white drop-shadow-md group-hover:text-[#DDB96A] transition-colors leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {artist.stageName || artist.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/80 mt-1">
                      <span>{artist.city}, {artist.state}</span>
                      <span className="text-[#DDB96A] font-bold">★ {artist.rating} ({artist.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="font-ui text-xs text-white/70 leading-relaxed line-clamp-2">
                    {artist.tagline}
                  </p>

                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                    <div className="label-editorial text-[#DDB96A]" style={{ fontSize: "8px" }}>
                      ACTS &amp; STYLES:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {artist.whatElseTheyDo.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className="font-ui text-[11px] font-medium bg-white/10 text-white/90 px-2.5 py-0.5 rounded-md border border-white/10"
                        >
                          {item.category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Instrumentation */}
                  <div className="flex items-center gap-1.5 text-xs text-white/70 flex-wrap">
                    <span className="label-editorial text-white/50" style={{ fontSize: "8px" }}>INSTRUMENTS:</span>
                    {artist.primaryInstruments.slice(0, 3).map(inst => (
                      <span key={inst} className="bg-white/10 text-white/80 px-2 py-0.5 rounded-md text-[10px] border border-white/10">
                        {inst}
                      </span>
                    ))}
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <div>
                      <span className="label-editorial text-white/50 block" style={{ fontSize: "8px" }}>STARTING RATE</span>
                      <span className="font-ui font-bold text-sm text-white mt-0.5 block">{artist.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectArtist(artist)}
                        className="font-ui text-xs font-semibold px-4 py-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onBookArtist(artist)}
                        className="font-ui text-xs font-semibold px-4 py-2 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] transition-all cursor-pointer shadow-md"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
