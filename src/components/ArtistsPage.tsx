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

  // Artist Type options for dynamic banner and filtering
  const artistTypes = [
    { id: "all", label: "All Artists", count: sourceArtists.length },
    { id: "sufi", label: "Sufi Performers", count: sourceArtists.filter(a => a.genre === "sufi").length },
    { id: "rock", label: "Rock Bands", count: sourceArtists.filter(a => a.genre === "rock").length },
    { id: "gazal", label: "Ghazal Maestros", count: sourceArtists.filter(a => a.genre === "gazal").length },
    { id: "bollywood", label: "Bollywood Singers", count: sourceArtists.filter(a => a.genre === "bollywood").length },
    { id: "carnival", label: "Carnival Acts", count: sourceArtists.filter(a => a.genre === "carnival").length },
    { id: "devotional", label: "Devotional Artists", count: sourceArtists.filter(a => a.genre === "devotional").length },
  ];

  // Dynamic banner data based on selected artist type
  const bannerData = useMemo(() => {
    if (selectedType === "all") {
      return {
        title: "Verified Performing Artists & Master Ensembles",
        subtitle: "Direct curation with verified vocalists, live bands, sufi ensembles, ghazal maestros, and theatrical acts for weddings, galas, and festivals.",
        badge: "VERIFIED MASTER ROSTER",
        bgImg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&h=700&fit=crop&auto=format",
        stat1: `${sourceArtists.length}+ Artists`,
        stat2: "4.9/5 Avg. Rating",
        stat3: "42+ Cities Covered",
        stat4: "Verified Artists",
        tags: ["Live Concerts", "Weddings & Sangeet", "Corporate Summits", "Cultural Festivals", "Private VIP Baithaks"],
      };
    }

    const genre = GENRE_METADATA[selectedType];
    if (genre) {
      return {
        title: `Elite ${genre.title} Artists & Live Troupes`,
        subtitle: genre.longDescription,
        badge: `VERIFIED ${genre.title.toUpperCase()} PERFORMERS`,
        bgImg: genre.heroImg,
        stat1: genre.avgPriceRange,
        stat2: "4.9/5 Rating",
        stat3: "Pan-India & Global",
        stat4: "Direct Booking",
        tags: genre.popularOccasions,
      };
    }

    return {
      title: "Discover Exceptional Live Artists",
      subtitle: "Hand-picked performers for every occasion.",
      badge: "VERIFIED PERFORMERS",
      bgImg: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=1400&h=700&fit=crop&auto=format",
      stat1: "Verified",
      stat2: "Top Rated",
      stat3: "All Formats",
      stat4: "Curated",
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
    <div className="min-h-screen pb-28 text-[#1A1916]" style={{ background: "#FAF7F2", fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* ── TOP EDITORIAL HEADER ─────────────────────────────────────────── */}
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
              ARTIST DIRECTORY
            </span>
          </button>

          <button
            onClick={onBackHome}
            className="font-ui text-[13px] font-medium text-[#4A4845] hover:text-[#1A1916] transition-colors cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      {/* ── CINEMATIC DYNAMIC BANNER ──────────────────────────────────────── */}
      <section className="relative bg-[#1A1916] text-white overflow-hidden border-b border-white/10 shadow-2xl transition-all duration-700">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            key={bannerData.bgImg}
            src={bannerData.bgImg}
            alt={bannerData.title}
            className="w-full h-full object-cover opacity-30 scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1916] via-[#1A1916]/90 to-[#1A1916]/60" />
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #C4952A 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-14 relative z-10">
          {/* Artist Type Selector Tabs */}
          <div className="mb-8">
            <span className="label-editorial text-[#DDB96A] tracking-[0.2em] block mb-3" style={{ fontSize: "9px" }}>
              BROWSE BY GENRE
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {artistTypes.map(type => {
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`font-ui px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#C4952A] text-[#1A1916] shadow-lg scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/15"
                    }`}
                  >
                    <span>{type.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-[#1A1916]/20 text-[#1A1916]" : "bg-white/10 text-white/60"}`}>
                      {type.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Hero Content Grid */}
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <span className="label-editorial text-[#DDB96A] tracking-[0.25em] inline-block" style={{ fontSize: "10px" }}>
                · {bannerData.badge} ·
              </span>

              <h1
                className="font-serif font-light text-white leading-[1.1] tracking-[-0.01em]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4.5vw, 60px)" }}
              >
                {bannerData.title}
              </h1>

              <p className="font-ui text-[#A8A49A] text-[14px] leading-relaxed max-w-2xl">
                {bannerData.subtitle}
              </p>

              {/* Key Highlights Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/05 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <div className="label-editorial text-white/60" style={{ fontSize: "8px" }}>RATING</div>
                  <div className="font-serif font-light text-xl text-[#DDB96A] mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{bannerData.stat2}</div>
                </div>
                <div className="bg-white/05 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <div className="label-editorial text-white/60" style={{ fontSize: "8px" }}>TYPICAL RANGE</div>
                  <div className="font-serif font-light text-xl text-white mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{bannerData.stat1}</div>
                </div>
                <div className="bg-white/05 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <div className="label-editorial text-white/60" style={{ fontSize: "8px" }}>AVAILABILITY</div>
                  <div className="font-ui font-semibold text-xs text-white mt-1">{bannerData.stat3}</div>
                </div>
                <div className="bg-white/05 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <div className="label-editorial text-white/60" style={{ fontSize: "8px" }}>CURATION</div>
                  <div className="font-ui font-semibold text-xs text-[#DDB96A] mt-1">{bannerData.stat4}</div>
                </div>
              </div>

              {/* Suitable Occasions Pills */}
              <div className="flex items-center gap-2 flex-wrap pt-2">
                <span className="label-editorial text-white/50" style={{ fontSize: "9px" }}>POPULAR FOR:</span>
                {bannerData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="font-ui text-xs bg-white/10 text-white/85 px-3 py-1 rounded-full border border-white/15"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Spotlight Feature Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#FAF7F2] text-[#1A1916] rounded-2xl p-6 border border-[#EDE8DF] shadow-2xl lift-card">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EDE8DF]">
                  <span className="label-editorial text-[#C4952A]" style={{ fontSize: "9px" }}>
                    FEATURED SPOTLIGHT
                  </span>
                  <span className="label-editorial text-[#7A776F] uppercase" style={{ fontSize: "9px" }}>
                    {activeSpotlightArtist.city}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={activeSpotlightArtist.img}
                    alt={activeSpotlightArtist.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#EDE8DF]"
                  />
                  <div>
                    <h3
                      className="font-serif font-light text-2xl text-[#1A1916] leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {activeSpotlightArtist.stageName || activeSpotlightArtist.name}
                    </h3>
                    <p className="font-ui text-xs text-[#7A776F] capitalize">
                      {activeSpotlightArtist.genreTitle} · {activeSpotlightArtist.bandType}
                    </p>
                  </div>
                </div>

                <p className="font-ui text-xs text-[#4A4845] leading-relaxed line-clamp-2 mb-4">
                  {activeSpotlightArtist.tagline}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#EDE8DF]">
                  <div>
                    <span className="label-editorial text-[#7A776F] block" style={{ fontSize: "8px" }}>STARTING FEE</span>
                    <span className="font-ui font-bold text-sm text-[#1A1916]">{activeSpotlightArtist.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectArtist(activeSpotlightArtist)}
                      className="font-ui text-xs font-semibold px-4 py-2 rounded-full border border-[#1A1916] text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onBookArtist(activeSpotlightArtist)}
                      className="font-ui text-xs font-semibold px-4 py-2 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] transition-all cursor-pointer shadow-md"
                    >
                      Plan Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH & FILTER CONTROLS ────────────────────────────────────── */}
      <div id="artists-catalogue" className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 mb-10">
        <div className="bg-[#FAF7F2] rounded-2xl p-6 shadow-sm border border-[#EDE8DF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
          {/* Keyword Search */}
          <div>
            <label className="label-editorial text-[#7A776F] block mb-2" style={{ fontSize: "9px" }}>
              SEARCH PERFORMER / SKILL
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Qawwali, Strings, Sufi..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-[#1A1916] placeholder-[#A8A49A] focus:outline-none focus:border-[#C4952A] transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A776F] hover:text-[#1A1916] text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* City Filter */}
          <div>
            <label className="label-editorial text-[#7A776F] block mb-2" style={{ fontSize: "9px" }}>
              LOCATION / CITY
            </label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-[#1A1916] focus:outline-none focus:border-[#C4952A] cursor-pointer transition-colors"
            >
              {allCities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Band Type */}
          <div>
            <label className="label-editorial text-[#7A776F] block mb-2" style={{ fontSize: "9px" }}>
              BAND / TROUPE FORMAT
            </label>
            <select
              value={selectedBandType}
              onChange={e => setSelectedBandType(e.target.value)}
              className="w-full bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-[#1A1916] focus:outline-none focus:border-[#C4952A] cursor-pointer transition-colors"
            >
              <option value="All">All Formats</option>
              <option value="Solo">Solo</option>
              <option value="Duo">Duo</option>
              <option value="Trio">Trio</option>
              <option value="4-6 Piece Band">4-6 Piece Band</option>
              <option value="Full Troupe (8+ Members)">Full Troupe (8+ Members)</option>
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label-editorial text-[#7A776F]" style={{ fontSize: "9px" }}>
                MAX BUDGET
              </label>
              <span className="font-ui text-xs font-bold text-[#C4952A]">
                ₹{maxBudget.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="150000"
              step="5000"
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#C4952A] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ── ARTISTS CATALOGUE CARDS GRID ─────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE8DF]">
          <h2
            className="font-serif font-light text-2xl sm:text-3xl text-[#1A1916]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Available Performers ({filteredArtists.length})
          </h2>
          <span className="font-ui text-xs text-[#7A776F]">
            Showing results for <strong className="text-[#1A1916] capitalize">{selectedType === "all" ? "All Genres" : selectedType}</strong>
          </span>
        </div>

        {filteredArtists.length === 0 ? (
          <div className="bg-[#FAF7F2] rounded-3xl p-16 text-center border border-[#EDE8DF]">
            <h3 className="font-serif text-xl font-light text-[#1A1916] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              No performers found for this criteria
            </h3>
            <p className="font-ui text-xs text-[#7A776F] mb-6">
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
              className="px-6 py-2.5 rounded-full bg-[#1A1916] text-[#FAF7F2] text-xs font-semibold hover:bg-[#2E2C28] cursor-pointer transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map(artist => (
              <div
                key={artist.id}
                className="bg-[#FAF7F2] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 border border-[#EDE8DF] hover:border-[#C4952A]/40 flex flex-col group lift-card"
              >
                {/* Photo Banner */}
                <div
                  className="relative h-64 overflow-hidden bg-gray-900 cursor-pointer img-zoom"
                  onClick={() => onSelectArtist(artist)}
                >
                  <img
                    src={artist.img}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Badges */}
                  <span className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md text-[#1A1916] font-ui text-[10px] font-bold px-3 py-1 rounded-full shadow-sm capitalize">
                    {artist.genre}
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
                  {/* Tagline */}
                  <p className="font-ui text-xs text-[#7A776F] leading-relaxed line-clamp-2">
                    {artist.tagline}
                  </p>

                  {/* Acts and styles */}
                  <div className="bg-[#F5F0E8] p-3.5 rounded-xl border border-[#EDE8DF] space-y-2">
                    <div className="label-editorial text-[#4A4845]" style={{ fontSize: "8px" }}>
                      SIGNATURE ACTS &amp; STYLES:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {artist.whatElseTheyDo.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className="font-ui text-[11px] font-medium bg-white text-[#1A1916] px-2.5 py-0.5 rounded-md border border-[#EDE8DF]"
                        >
                          {item.category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-[#EDE8DF] flex items-center justify-between">
                    <div>
                      <span className="label-editorial text-[#7A776F] block" style={{ fontSize: "8px" }}>STARTING FEE</span>
                      <span className="font-ui font-bold text-sm text-[#1A1916] mt-0.5 block">{artist.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectArtist(artist)}
                        className="font-ui text-xs font-semibold px-4 py-2 rounded-full border border-[#1A1916] text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onBookArtist(artist)}
                        className="font-ui text-xs font-semibold px-4 py-2 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] transition-all cursor-pointer shadow-sm"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
