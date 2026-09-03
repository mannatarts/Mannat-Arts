import { useState, useMemo } from "react";
import { Artist, GenreInfo, GENRE_METADATA, ALL_ARTISTS } from "../data/artistsData";

interface ArtistsPageProps {
  initialType?: string;
  onBackHome: () => void;
  onSelectArtist: (artist: Artist) => void;
  onBookArtist: (artist: Artist) => void;
  allArtists?: Artist[];
}

export function ArtistsPage({
  initialType = "all",
  onBackHome,
  onSelectArtist,
  onBookArtist,
  allArtists,
}: ArtistsPageProps) {
  const sourceArtists = allArtists || ALL_ARTISTS;
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedBandType, setSelectedBandType] = useState("All");
  const [maxBudget, setMaxBudget] = useState<number>(120000);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Artist Type options for dynamic banner and filtering
  const artistTypes = [
    { id: "all", label: "All Artists", icon: "⭐", count: sourceArtists.length },
    { id: "sufi", label: "Sufi Performers", icon: "🕊️", count: sourceArtists.filter(a => a.genre === "sufi").length },
    { id: "rock", label: "Rock Bands", icon: "🎸", count: sourceArtists.filter(a => a.genre === "rock").length },
    { id: "gazal", label: "Ghazal Maestros", icon: "📜", count: sourceArtists.filter(a => a.genre === "gazal").length },
    { id: "bollywood", label: "Bollywood Singers", icon: "🎬", count: sourceArtists.filter(a => a.genre === "bollywood").length },
    { id: "carnival", label: "Carnival Acts", icon: "🎡", count: sourceArtists.filter(a => a.genre === "carnival").length },
    { id: "devotional", label: "Devotional Vocalists", icon: "🪔", count: sourceArtists.filter(a => a.genre === "devotional").length },
  ];

  // Dynamic banner data based on selected artist type
  const bannerData = useMemo(() => {
    if (selectedType === "all") {
      return {
        title: "India's Premier Verified Artists & Performers",
        subtitle: "Discover over 2,800+ verified vocalists, live bands, sufi ensembles, ghazal maestros, carnival troupes, and devotional artists for your memorable events.",
        badge: "✨ Verified Master Talent Roster",
        bgImg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&h=700&fit=crop&auto=format",
        accent: "#E11D48",
        stat1: `${sourceArtists.length}+ Artists`,
        stat2: "4.9/5 Avg. Rating",
        stat3: "42+ Cities Covered",
        stat4: "100% Escrow Safe",
        tags: ["Live Concerts", "Weddings & Sangeet", "Corporate Summits", "Cultural Festivals", "Private VIP Baithaks"],
      };
    }

    const genre = GENRE_METADATA[selectedType];
    if (genre) {
      return {
        title: `Elite ${genre.title} Artists & Live Troupes`,
        subtitle: genre.longDescription,
        badge: `✨ Verified ${genre.title} Performers`,
        bgImg: genre.heroImg,
        accent: genre.accent,
        stat1: genre.avgPriceRange,
        stat2: "★ 4.9/5 Rating",
        stat3: "Pan-India & Global",
        stat4: "Direct Contract",
        tags: genre.popularOccasions,
      };
    }

    return {
      title: "Discover Exceptional Live Artists",
      subtitle: "Hand-picked performers for every occasion.",
      badge: "✨ Verified Performers",
      bgImg: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=1400&h=700&fit=crop&auto=format",
      accent: "#E11D48",
      stat1: "Verified",
      stat2: "Top Rated",
      stat3: "All Formats",
      stat4: "Escrow Safe",
      tags: ["Weddings", "Concerts", "Festivals"],
    };
  }, [selectedType, sourceArtists]);

  // Filtered artist list
  const filteredArtists = useMemo(() => {
    return sourceArtists.filter(a => {
      if (selectedType !== "all" && a.genre !== selectedType) return false;
      if (selectedCity !== "All" && a.city !== selectedCity) return false;
      if (selectedBandType !== "All" && a.bandType !== selectedBandType) return false;
      if (a.priceNum > maxBudget) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = a.name.toLowerCase().includes(query) || (a.stageName && a.stageName.toLowerCase().includes(query));
        const matchesSkills = a.whatElseTheyDo.some(s => s.category.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
        const matchesInst = a.primaryInstruments.some(i => i.toLowerCase().includes(query));
        const matchesCity = a.city.toLowerCase().includes(query);
        if (!matchesName && !matchesSkills && !matchesInst && !matchesCity) return false;
      }
      return true;
    });
  }, [sourceArtists, selectedType, selectedCity, selectedBandType, maxBudget, searchTerm]);

  // Spotlight Artist for the active type
  const activeSpotlightArtist = useMemo(() => {
    if (selectedType === "all") return sourceArtists[0];
    return sourceArtists.find(a => a.genre === selectedType) || sourceArtists[0];
  }, [sourceArtists, selectedType]);

  const allCities = useMemo(() => {
    const cities = new Set<string>();
    sourceArtists.forEach(a => cities.add(a.city));
    return ["All", ...Array.from(cities)];
  }, [sourceArtists]);

  return (
    <div className="min-h-screen bg-[#FAF7F6] text-[#1A1A1A] pb-28">
      {/* ── DYNAMIC ARTIST TYPE BANNER PAGE ──────────────────────────────── */}
      <section className="relative bg-[#100104] text-white overflow-hidden border-b border-[#E11D48]/20 shadow-2xl transition-all duration-700">
        {/* Background Image that morphs according to the artist type */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            key={bannerData.bgImg}
            src={bannerData.bgImg}
            alt={bannerData.title}
            className="w-full h-full object-cover opacity-35 scale-105 transition-all duration-1000 animate-pulse-subtle"
            style={{ animationDuration: "14s" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#100104] via-[#100104]/90 to-[#100104]/60" />
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${bannerData.accent}40 0%, transparent 70%)` }} />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(225,29,72,0.2) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 pb-12 relative z-10">
          {/* Top Bar inside Banner: Clickable Brand Logo + Status */}
          <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <div
              onClick={onBackHome}
              className="flex items-center gap-2 cursor-pointer group select-none"
              title="Return to Home"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9333EA] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white text-xs">♪</span>
              </div>
              <span className="font-display font-bold text-lg tracking-tight group-hover:text-[#FB7185] transition-colors">
                StageBridge <span className="text-[#FB7185] font-sans text-xs font-semibold">Artist Directory</span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-white/80 bg-white/05 px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>2,800+ Verified Artists Ready</span>
            </div>
          </div>

          {/* Artist Type Selector Tabs directly in the Banner */}
          <div className="mb-8">
            <div className="text-xs text-white/60 font-semibold mb-2 uppercase tracking-wider">
              Select Artist Type / Genre:
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {artistTypes.map(type => {
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-gradient-to-r from-[#E11D48] to-[#FB7185] text-white shadow-xl scale-105 border border-white/30"
                        : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 hover:border-white/30"
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-black/30 text-white" : "bg-white/10 text-white/60"}`}>
                      {type.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Hero Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#E11D48]/25 border border-[#E11D48]/50 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#FB7185] tracking-wide uppercase shadow-sm">
                <span>{bannerData.badge}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185] animate-pulse" />
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-5xl font-bold leading-[1.15] text-white tracking-tight">
                {bannerData.title}
              </h1>

              {/* Subtitle */}
              <p className="font-body text-white/85 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {bannerData.subtitle}
              </p>

              {/* Key Highlights Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-white/05 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div className="text-[10px] text-white/60">Rating</div>
                  <div className="font-display font-bold text-base text-yellow-300">{bannerData.stat2}</div>
                </div>
                <div className="bg-white/05 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div className="text-[10px] text-white/60">Typical Range</div>
                  <div className="font-display font-bold text-sm text-[#FB7185]">{bannerData.stat1}</div>
                </div>
                <div className="bg-white/05 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div className="text-[10px] text-white/60">Availability</div>
                  <div className="font-display font-bold text-sm text-white">{bannerData.stat3}</div>
                </div>
                <div className="bg-white/05 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div className="text-[10px] text-white/60">Contract &amp; Escrow</div>
                  <div className="font-display font-bold text-sm text-green-400">{bannerData.stat4}</div>
                </div>
              </div>

              {/* Occasions / Capabilities Tags */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-white/60 font-semibold mr-1 text-[11px]">Recommended For:</span>
                {bannerData.tags.map(t => (
                  <span
                    key={t}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 px-2.5 py-0.5 rounded-full text-white/90 text-[11px]"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#artists-catalogue"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#BE123C] text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Browse {filteredArtists.length} Verified Artists ↓</span>
                </a>
                <button
                  onClick={() => onBookArtist(activeSpotlightArtist)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs sm:text-sm transition-all hover:scale-105 cursor-pointer"
                >
                  <span>⚡ Instant Booking Inquiry</span>
                </button>
              </div>
            </div>

            {/* Right Spotlight Card for the Selected Artist Type */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden glass-card bg-white/10 border border-white/20 shadow-2xl p-5 text-white backdrop-blur-xl group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E11D48] text-white px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <span>🌟 Featured {activeSpotlightArtist.genreTitle} Act</span>
                  </span>
                  <span className="text-xs text-yellow-300 font-bold">
                    ★ {activeSpotlightArtist.rating} ({activeSpotlightArtist.reviewsCount} reviews)
                  </span>
                </div>

                <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-black/40">
                  <img
                    src={activeSpotlightArtist.img}
                    alt={activeSpotlightArtist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  
                  {/* Listen Preview audio toggle */}
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-black/70 hover:bg-[#E11D48] backdrop-blur-md border border-white/20 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{isPlayingAudio ? "❚❚ Pause" : "▶ Audio Demo"}</span>
                    {isPlayingAudio && (
                      <div className="flex items-end gap-0.5 h-2.5">
                        <div className="w-0.5 h-full bg-white animate-wave-bar" />
                        <div className="w-0.5 h-3/4 bg-white animate-wave-bar" style={{ animationDelay: "0.2s" }} />
                        <div className="w-0.5 h-full bg-white animate-wave-bar" style={{ animationDelay: "0.4s" }} />
                      </div>
                    )}
                  </button>

                  <div className="absolute bottom-2.5 left-3">
                    <div className="font-display font-bold text-base text-white drop-shadow">
                      {activeSpotlightArtist.name}
                    </div>
                    <div className="text-[10px] text-white/80">
                      📍 {activeSpotlightArtist.city} • {activeSpotlightArtist.bandType}
                    </div>
                  </div>
                </div>

                {/* "What this artist also does" */}
                <div className="bg-black/30 rounded-2xl p-3 border border-white/10 mb-3 space-y-1">
                  <div className="text-[10px] font-bold text-[#FB7185] uppercase tracking-wider">
                    ✨ Also Performs:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeSpotlightArtist.whatElseTheyDo.slice(0, 3).map((item, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-white/15 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg border border-white/15"
                      >
                        {item.category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-[10px] text-white/60">Starting Fee</div>
                    <div className="font-display font-bold text-lg text-[#FB7185]">
                      {activeSpotlightArtist.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectArtist(activeSpotlightArtist)}
                      className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onBookArtist(activeSpotlightArtist)}
                      className="px-4 py-1.5 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-xs font-bold text-white shadow-md transition-all hover:scale-105 cursor-pointer"
                    >
                      ⚡ Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH & FILTER CONTROLS ────────────────────────────────────── */}
      <div id="artists-catalogue" className="max-w-7xl mx-auto px-6 pt-10 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F3E5E8] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-bold text-[#5B5B5B] mb-1 uppercase tracking-wider">
              Search Performer / Skill
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Qawwali, Guitar, Singer..."
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
              Band Format
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
              min="20000"
              max="150000"
              step="5000"
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#E11D48] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ── ARTISTS LISTINGS ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
            Available Performers ({filteredArtists.length})
          </h2>
          <span className="text-xs text-[#5B5B5B]">
            Showing results for <strong>{selectedType === "all" ? "All Genres" : selectedType.toUpperCase()}</strong>
          </span>
        </div>

        {filteredArtists.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#F3E5E8]">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-1">
              No performers found for this criteria
            </h3>
            <p className="font-body text-xs text-[#5B5B5B] mb-4">
              Try switching artist types or expanding your budget range.
            </p>
            <button
              onClick={() => {
                setSelectedType("all");
                setSearchTerm("");
                setSelectedCity("All");
                setSelectedBandType("All");
                setMaxBudget(120000);
              }}
              className="px-4 py-2 rounded-full bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map(artist => (
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

                  {/* Badges */}
                  <span className="absolute top-3.5 left-3.5 bg-[#E11D48] text-white font-body text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {artist.genreTitle}
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

                  {/* "What this artist also does" */}
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

                  {/* Core Instruments */}
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
