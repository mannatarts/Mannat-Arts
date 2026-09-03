import { useState, useMemo } from "react";
import { Artist, GenreInfo, GENRE_METADATA, ALL_ARTISTS } from "../data/artistsData";

interface GenreViewProps {
  genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";
  onSelectGenre: (genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
  onBack: () => void;
  onSelectArtist: (artist: Artist) => void;
  onBookArtist: (artist: Artist) => void;
  allArtists?: Artist[];
}

export function GenreView({
  genreId,
  onSelectGenre,
  onBack,
  onSelectArtist,
  onBookArtist,
  allArtists,
}: GenreViewProps) {
  const genreInfo: GenreInfo = GENRE_METADATA[genreId];
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

  // Featured Spotlight artist for this genre
  const spotlightArtist = useMemo(() => {
    return sourceArtists.find(a => a.genre === genreId) || sourceArtists[0];
  }, [sourceArtists, genreId]);

  return (
    <div className="min-h-screen bg-[#FAF7F6] text-[#1A1A1A] pb-28">
      {/* ── EXACT FULL-VIEWPORT BANNER PAGE (100VH FIT: NO SCROLL NEEDED) ─── */}
      <section
        className="relative h-screen max-h-screen flex flex-col justify-between text-white overflow-hidden border-b border-white/10 shadow-2xl transition-all duration-700"
        style={{ background: genreInfo.vibe.bgGradient }}
      >
        {/* Background Image: Positioned on the Right with Feather Fade on the Left Edge */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Base Solid Dark Canvas on the Left for text content */}
          <div className="absolute inset-0 bg-[#0a0510]" />

          {/* Right-Side High-Res Genre Image - Stretched wider to the left */}
          <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[70%] h-full overflow-hidden">
            <img
              key={genreInfo.heroImg}
              src={genreInfo.heroImg}
              alt={`${genreInfo.title} Live Background`}
              className="w-full h-full object-cover object-center sm:object-right opacity-90 sm:opacity-95 transition-all duration-700 brightness-100 contrast-105"
            />
            {/* Seamless Feather Fade on Left Edge where content meets the photo */}
            <div className="absolute inset-y-0 left-0 w-48 sm:w-80 bg-gradient-to-r from-[#0a0510] via-[#0a0510]/85 via-45% via-[#0a0510]/20 via-75% to-transparent" />
            
            {/* Mobile/Tablet vertical fade so text stays readable on stacked layouts */}
            <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-[#0a0510] via-[#0a0510]/80 via-60% to-transparent" />
            
            {/* Subtle top/bottom edge vignettes */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0a0510]/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0510]/80 to-transparent" />
          </div>
        </div>

        {/* Top Bar inside Banner: Logo + Genre Switcher */}
        <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
            {/* Clickable Brand Logo to return home */}
            <div
              onClick={onBack}
              className="flex items-center gap-2 cursor-pointer group select-none"
              title="Return to Home"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${genreInfo.accent}, #9333EA)` }}
              >
                <span className="text-white text-xs">♪</span>
              </div>
              <span className="font-display font-bold text-lg tracking-tight group-hover:opacity-90 transition-opacity text-white">
                StageBridge <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10" style={{ color: genreInfo.vibe.highlightColor }}>{genreInfo.title}</span>
              </span>
            </div>

            {/* Quick Switcher Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs text-white/60 font-medium mr-1 whitespace-nowrap">Switch Genre:</span>
              {(Object.keys(GENRE_METADATA) as Array<"sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional">).map(gId => {
                const meta = GENRE_METADATA[gId];
                const isActive = gId === genreId;
                return (
                  <button
                    key={gId}
                    onClick={() => onSelectGenre(gId)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "text-white shadow-xl scale-105 font-bold border border-white/40"
                        : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/15"
                    }`}
                    style={isActive ? { background: meta.vibe.bgGradient, boxShadow: `0 0 20px ${meta.vibe.radialGlow1}` } : {}}
                  >
                    <span>{meta.icon}</span>
                    <span>{meta.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Main Stage & Headline Content (Clean Left Half: Zero Clashing) */}
        <div className="flex-1 flex items-center w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <div className="w-full lg:w-[48%] max-w-2xl space-y-5">
            {/* Genre-Specific Vibe Badge & Live Indicator */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`inline-flex items-center gap-2 ${genreInfo.vibe.badgeBg} border ${genreInfo.vibe.badgeBorder} px-4 py-1.5 rounded-full text-xs font-bold ${genreInfo.vibe.badgeText} tracking-wide uppercase shadow-sm`}
              >
                <span className="text-sm">{genreInfo.icon}</span>
                <span>Exclusive {genreInfo.tag} Platform</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-xs font-semibold text-white/90">
                <span className="text-green-400 font-bold">●</span>
                <span>Verified Top Acts Ready</span>
              </div>
            </div>

            {/* Title with Genre Highlight */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-white tracking-tight">
              Experience Soulful{" "}
              <span
                style={{ color: genreInfo.vibe.highlightColor, textShadow: `0 0 40px ${genreInfo.vibe.radialGlow1}` }}
                className="italic font-serif"
              >
                {genreInfo.title}
              </span>
              <br />
              Live Stage Performances
            </h1>

            {/* Description */}
            <p className="font-body text-white/85 text-sm sm:text-base leading-relaxed max-w-xl">
              {genreInfo.longDescription}
            </p>
          </div>
        </div>

        {/* Bottom Bar: Clean Scroll Indicator */}
        <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 pb-5 pt-1 flex items-center justify-center relative z-10">
          <a
            href="#artists-grid"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 hover:text-white transition-all shadow-lg hover:scale-105 group cursor-pointer"
          >
            <span>Explore {genreInfo.title} Artists & Live Acts</span>
            <span className="text-sm">↓</span>
          </a>
        </div>
      </section>

      {/* ── ARTIST SEARCH & FILTER CONTROLS ───────────────────────────── */}
      <div id="artists-grid" className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F3E5E8] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* Search Input */}
          <div>
            <label className="block text-xs font-bold text-[#5B5B5B] mb-1 uppercase tracking-wider">
              Search Artist or Skill
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Qawwali, Sarangi, Rock Band..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#E11D48]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-xs font-bold text-[#5B5B5B] mb-1 uppercase tracking-wider">
              Location / City
            </label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#E11D48] cursor-pointer"
            >
              {allCities.map(c => (
                <option key={c} value={c}>{c === "All" ? "All Locations" : c}</option>
              ))}
            </select>
          </div>

          {/* Band Type Filter */}
          <div>
            <label className="block text-xs font-bold text-[#5B5B5B] mb-1 uppercase tracking-wider">
              Format / Setup
            </label>
            <select
              value={selectedBandType}
              onChange={e => setSelectedBandType(e.target.value)}
              className="w-full bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#E11D48] cursor-pointer"
            >
              <option value="All">All Formats</option>
              <option value="Solo">Solo Artist</option>
              <option value="Duo">Duo</option>
              <option value="Trio">Trio</option>
              <option value="4-6 Piece Band">4-6 Piece Live Band</option>
              <option value="Full Troupe (8+ Members)">Full Troupe (8+ Members)</option>
            </select>
          </div>

          {/* Budget Filter */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-[#5B5B5B] mb-1 uppercase tracking-wider">
              <span>Max Budget</span>
              <span className="text-[#E11D48] font-bold">₹{maxBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={15000}
              max={500000}
              step={10000}
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#E11D48] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5B5B5B]">
              <span>₹15k</span>
              <span>₹5L+</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ARTISTS LISTING GRID ──────────────────────────────────────── */}
      <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
            Verified {genreInfo.title} Performers ({artists.length})
          </h2>
          <span className="text-xs text-[#5B5B5B]">
            Showing talent for <strong>{genreInfo.title}</strong>
          </span>
        </div>

        {artists.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#F3E5E8]">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-1">
              No artists found matching your criteria
            </h3>
            <p className="font-body text-xs text-[#5B5B5B] mb-4">
              Try adjusting your city filter or increasing your maximum budget.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("All");
                setSelectedBandType("All");
                setMaxBudget(100000);
              }}
              className="px-4 py-2 rounded-full bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map(artist => (
              <div
                key={artist.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#F3E5E8] flex flex-col group"
              >
                {/* Photo Banner */}
                <div
                  className="relative h-60 overflow-hidden bg-gray-900 cursor-pointer"
                  onClick={() => onSelectArtist(artist)}
                >
                  <img
                    src={artist.img}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-95 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <span className="absolute top-3.5 left-3.5 bg-[#E11D48] text-white font-body text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {artist.bandType}
                  </span>
                  <span className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-sm text-green-700 font-body text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    ✓ Verified
                  </span>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-3.5 left-4 right-4 text-white">
                    <div className="font-display font-bold text-xl text-white drop-shadow-md">
                      {artist.name}
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/85 mt-0.5">
                      <span>📍 {artist.city}, {artist.state}</span>
                      <span className="text-yellow-300 font-bold">★ {artist.rating} ({artist.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Tagline */}
                  <p className="font-body text-xs text-[#5B5B5B] leading-relaxed line-clamp-2">
                    {artist.tagline}
                  </p>

                  {/* Highlight: "What this artist also does" */}
                  <div className="bg-[#FFF8F8] p-3.5 rounded-2xl border border-[#F3E5E8] space-y-2">
                    <div className="text-[11px] font-bold text-[#BE123C] uppercase tracking-wider flex items-center gap-1">
                      <span>✨ What This Artist Also Does:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {artist.whatElseTheyDo.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium bg-white text-[#4A4A4A] px-2.5 py-1 rounded-lg border border-[#F3E5E8] shadow-2xs"
                        >
                          {item.category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Instruments */}
                  <div className="flex items-center gap-1.5 text-xs text-[#5B5B5B] flex-wrap">
                    <span className="font-semibold text-[#1A1A1A]">Gear:</span>
                    {artist.primaryInstruments.slice(0, 3).map(inst => (
                      <span key={inst} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
                        {inst}
                      </span>
                    ))}
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-2 border-t border-[#F3E5E8] flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-[#5B5B5B]">Starting From</div>
                      <div className="font-display font-bold text-lg text-[#E11D48]">
                        {artist.price}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectArtist(artist)}
                        className="px-3.5 py-2 rounded-full border border-[#E11D48] text-[#E11D48] hover:bg-[#FFF0F3] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onBookArtist(artist)}
                        className="px-4 py-2 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-md transition-all hover:scale-105 cursor-pointer"
                      >
                        ⚡ Book
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
