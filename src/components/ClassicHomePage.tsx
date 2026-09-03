/**
 * ClassicHomePage.tsx
 * The original Mannat Arts homepage — preserved for reference.
 * Includes: Hero, Ticker, StatsBar, CategoryShowcase,
 *           FeaturedArtists, HowItWorks, WeddingSection, JoinArtistCTA
 */
import { useState } from "react";
import { Artist } from "../data/artistsData";

type GenreId = "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";

/* ── Waveform animation ─────────────────────────────────────────────────── */
function Waveform({ color = "#E11D48", bars = 12 }: { color?: string; bars?: number }) {
  const hs = [45, 75, 95, 60, 85, 50, 100, 65, 80, 55, 90, 70];
  return (
    <div className="flex items-end gap-[2px]" style={{ height: "24px" }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="rounded-full flex-shrink-0"
          style={{
            width: "3px",
            height: `${hs[i % hs.length]}%`,
            backgroundColor: color,
            animation: `waveBar 1s ease-in-out infinite`,
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${0.7 + (i % 5) * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Hero Section ───────────────────────────────────────────────────────── */
interface ClassicHeroProps {
  onBrowseGenres: () => void;
  onScrollToFeatured: () => void;
  onSearchGenre: (g: GenreId) => void;
}

function ClassicHero({ onBrowseGenres, onScrollToFeatured, onSearchGenre }: ClassicHeroProps) {
  const [activeQ, setActiveQ] = useState("Wedding");
  const quickLinks = [
    { label: "Wedding", genre: "sufi" as GenreId },
    { label: "Corporate", genre: "gazal" as GenreId },
    { label: "Festival", genre: "bollywood" as GenreId },
    { label: "Indie Concert", genre: "rock" as GenreId },
    { label: "Cultural Event", genre: "devotional" as GenreId },
  ];

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ paddingTop: "68px", background: "linear-gradient(135deg, #0F0A1E 0%, #1A0A14 40%, #0A0F1E 100%)" }}
    >
      {/* Orb glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #E11D48 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #9333EA 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <Waveform color="#E11D48" bars={8} />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48]">
              Live Performance Discovery
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-white font-light leading-[1.1] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(46px, 7vw, 90px)" }}>
            Book the <em style={{ fontStyle: "italic", background: "linear-gradient(135deg,#E11D48,#FB7185)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>perfect</em><br />
            artist for your<br />
            <em style={{ fontStyle: "italic", background: "linear-gradient(135deg,#F59E0B,#FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>event.</em>
          </h1>

          <p className="font-ui text-white/60 text-[17px] leading-relaxed mb-8 max-w-lg">
            From soulful Sufi evenings to electrifying rock concerts — find and book verified performing artists across India.
          </p>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2 mb-10">
            {quickLinks.map(q => (
              <button
                key={q.label}
                onClick={() => { setActiveQ(q.label); onSearchGenre(q.genre); }}
                className={`font-ui text-[12px] font-medium px-4 py-2 rounded-full border transition-all cursor-pointer ${
                  activeQ === q.label
                    ? "bg-[#E11D48] text-white border-[#E11D48]"
                    : "bg-white/5 text-white/70 border-white/20 hover:border-[#E11D48]/60 hover:text-white"
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* CTA Row */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onBrowseGenres}
              className="font-ui font-bold text-[14px] bg-[#E11D48] hover:bg-[#BE123C] text-white px-7 py-3.5 rounded-full transition-all cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] hover:-translate-y-0.5"
            >
              Browse All Genres
            </button>
            <button
              onClick={onScrollToFeatured}
              className="font-ui font-medium text-[14px] text-white/80 hover:text-white border border-white/25 hover:border-white/50 px-7 py-3.5 rounded-full transition-all cursor-pointer"
            >
              Top Performers ↓
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, #FAF7F2 0%, transparent 100%)" }} />
    </section>
  );
}

/* ── Stats Bar ──────────────────────────────────────────────────────────── */
function ClassicStatsBar() {
  const stats = [
    { value: "1,200+", label: "Verified Artists" },
    { value: "6", label: "Performance Genres" },
    { value: "850+", label: "Events Booked" },
    { value: "40+", label: "Cities Across India" },
    { value: "4.9★", label: "Average Rating" },
  ];
  return (
    <div className="border-y border-[#EDE8DF] py-8 px-6" style={{ background: "#F5F0E8" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <p className="font-serif text-[28px] font-light text-[#C4952A] mb-0.5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</p>
            <p className="font-ui text-[11px] text-[#7A776F] font-medium tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Performer Ticker ───────────────────────────────────────────────────── */
function ClassicTicker({ onSelectGenre }: { onSelectGenre: (g: GenreId) => void }) {
  const items: { label: string; genre: GenreId }[] = [
    { label: "Sufi & Qawwali", genre: "sufi" },
    { label: "Indie Rock", genre: "rock" },
    { label: "Ghazal Baithak", genre: "gazal" },
    { label: "Bollywood Nights", genre: "bollywood" },
    { label: "Carnival & Theatre", genre: "carnival" },
    { label: "Devotional Folk", genre: "devotional" },
    { label: "Classical Fusion", genre: "gazal" },
    { label: "Wedding Ensemble", genre: "sufi" },
  ];
  const doubled = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden py-4" style={{ background: "#1A1916" }}>
      <div className="flex animate-ticker" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelectGenre(item.genre)}
            className="flex items-center gap-5 flex-shrink-0 px-8 cursor-pointer group"
          >
            <span className="font-serif text-white/50 group-hover:text-[#E11D48] transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", letterSpacing: "0.08em" }}>
              {item.label}
            </span>
            <span className="text-[#E11D48]/40 text-xs">✦</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Category Showcase ──────────────────────────────────────────────────── */
const GENRE_CARDS: { key: GenreId; label: string; sub: string; color: string; img: string }[] = [
  { key: "sufi", label: "Sufi & Qawwali", sub: "Soul-stirring devotion", color: "#9F1239", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=75" },
  { key: "rock", label: "Indie & Rock", sub: "Raw electric energy", color: "#1D4ED8", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=75" },
  { key: "gazal", label: "Ghazal & Classical", sub: "Poetic elegance", color: "#065F46", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop&q=75" },
  { key: "bollywood", label: "Bollywood & Dance", sub: "Cinematic celebration", color: "#B45309", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop&q=75" },
  { key: "carnival", label: "Carnival & Theatre", sub: "Spectacle & drama", color: "#6D28D9", img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop&q=75" },
  { key: "devotional", label: "Devotional & Folk", sub: "Living traditions", color: "#B45309", img: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&h=400&fit=crop&q=75" },
];

function ClassicCategoryShowcase({ onSelectGenre }: { onSelectGenre: (g: GenreId) => void }) {
  return (
    <section className="py-20 lg:py-28" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-ui text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48] mb-3">
            PERFORMANCE GENRES
          </p>
          <h2 className="font-serif font-light text-[#1A1916] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)" }}>
            Every genre, every occasion
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {GENRE_CARDS.map(g => (
            <button
              key={g.key}
              onClick={() => onSelectGenre(g.key)}
              className="group relative overflow-hidden rounded-xl cursor-pointer text-left"
              style={{ height: "220px" }}
            >
              <img src={g.img} alt={g.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-400"
                style={{ background: g.color }}
              />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h3 className="font-serif text-white text-[18px] font-light leading-tight mb-1 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>{g.label}</h3>
                <p className="font-ui text-white/65 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{g.sub}</p>
                <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="font-ui text-[9px] font-bold tracking-[0.2em] text-[#FB7185] uppercase">EXPLORE</span>
                  <svg className="w-3 h-3 text-[#FB7185]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Featured Artists ───────────────────────────────────────────────────── */
interface ClassicFeaturedProps {
  artists: Artist[];
  featuredArtistIds: string[];
  onSelectArtist: (a: Artist) => void;
  onBookArtist: (a: Artist) => void;
  onViewAll: () => void;
}

function ClassicFeaturedArtists({ artists, featuredArtistIds, onSelectArtist, onBookArtist, onViewAll }: ClassicFeaturedProps) {
  const featured = artists.filter(a => featuredArtistIds.includes(a.id));
  const display = featured.length > 0 ? featured : artists.slice(0, 6);

  return (
    <section id="featured-performers" className="py-20 lg:py-28" style={{ background: "#F5F0E8" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-ui text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48] mb-3">
              TOP PERFORMERS
            </p>
            <h2 className="font-serif font-light text-[#1A1916]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 3.5vw, 48px)" }}>
              Featured artists
            </h2>
          </div>
          <button onClick={onViewAll}
            className="hidden md:flex items-center gap-2 font-ui text-[13px] font-medium text-[#E11D48] hover:text-[#BE123C] transition-colors group cursor-pointer">
            View all
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.slice(0, 6).map(artist => (
            <div
              key={artist.id}
              className="group cursor-pointer rounded-xl overflow-hidden border border-[#EDE8DF] hover:border-[#E11D48]/30 transition-all duration-400 hover:shadow-xl hover:-translate-y-1"
              style={{ background: "#FAF7F2" }}
              onClick={() => onSelectArtist(artist)}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ height: "240px" }}>
                <img src={artist.img}
                  alt={artist.stageName || artist.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <button
                  onClick={e => { e.stopPropagation(); onBookArtist(artist); }}
                  className="absolute bottom-3 right-3 font-ui text-[11px] font-bold bg-[#E11D48] text-white px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                >
                  Book Now
                </button>
              </div>
              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-serif font-light text-[#1A1916] text-[20px] leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {artist.stageName || artist.name}
                    </h3>
                    <p className="font-ui text-[12px] text-[#7A776F] capitalize">{artist.genre} · {artist.city}</p>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-[#FFF8F0] px-2 py-1 rounded-full">
                    <svg className="w-3 h-3 text-[#C4952A]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                    <span className="font-ui text-[11px] font-bold text-[#C4952A]">{artist.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#EDE8DF]">
                  <span className="font-ui text-[12px] font-medium text-[#4A4845]">From {artist.price}</span>
                  <span className="font-ui text-[11px] text-[#7A776F]">{artist.bandType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button onClick={onViewAll}
            className="font-ui font-bold text-[14px] bg-[#E11D48] hover:bg-[#BE123C] text-white px-8 py-3.5 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg">
            View All Artists
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ───────────────────────────────────────────────────────── */
function ClassicHowItWorks() {
  const steps = [
    { n: "01", t: "Browse & Discover", d: "Explore 1,200+ verified performing artists across 6 genres and 40+ cities." },
    { n: "02", t: "Choose & Connect", d: "Review artist profiles, watch videos, check availability, and send a booking request." },
    { n: "03", t: "Experience & Celebrate", d: "Confirm your booking, finalise details with the artist, and enjoy a seamless performance." },
  ];
  return (
    <section className="py-20 lg:py-28" style={{ background: "#1A1916" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-ui text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48] mb-3">HOW IT WORKS</p>
          <h2 className="font-serif font-light text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4vw, 50px)" }}>
            Simple, trusted, seamless
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
          {steps.map(s => (
            <div key={s.n} className="relative">
              <span className="font-serif text-[72px] font-light text-white/10 leading-none block mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.n}</span>
              <div className="h-px bg-gradient-to-r from-[#E11D48]/60 to-transparent mb-5" />
              <h3 className="font-serif font-light text-white text-[22px] mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.t}</h3>
              <p className="font-ui text-white/50 text-[14px] leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Wedding Section ────────────────────────────────────────────────────── */
function ClassicWeddingSection({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative py-24 lg:py-36 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=900&fit=crop&q=80"
        alt="Wedding"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(26,25,22,0.92) 0%, rgba(26,25,22,0.7) 50%, rgba(26,25,22,0.3) 100%)" }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="font-ui text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48] mb-4">
            WEDDINGS & CELEBRATIONS
          </p>
          <h2 className="font-serif font-light text-white leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 64px)" }}>
            Make your wedding<br />
            <em style={{ fontStyle: "italic", color: "#DDB96A" }}>unforgettable.</em>
          </h2>
          <p className="font-ui text-white/65 text-[15px] leading-relaxed mb-8">
            From the Mehndi evening to the grand reception — curated Sufi, Ghazal and Bollywood ensembles for every ritual.
          </p>
          <button
            onClick={onExplore}
            className="font-ui font-bold text-[14px] bg-[#E11D48] hover:bg-[#BE123C] text-white px-8 py-3.5 rounded-full transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Explore Wedding Artists
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Join CTA ───────────────────────────────────────────────────────────── */
function ClassicJoinCTA() {
  return (
    <section className="py-20 lg:py-28" style={{ background: "#FAF7F2" }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <p className="font-ui text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48] mb-4">
          FOR ARTISTS
        </p>
        <h2 className="font-serif font-light text-[#1A1916] leading-tight mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4vw, 52px)" }}>
          Are you a performing artist?<br />
          <em style={{ fontStyle: "italic" }}>Join our roster.</em>
        </h2>
        <p className="font-ui text-[#7A776F] text-[15px] leading-relaxed max-w-xl mx-auto mb-10">
          Get discovered by event organisers across India. Manage bookings, showcase your work, and grow your reach.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button className="font-ui font-bold text-[14px] bg-[#1A1916] hover:bg-[#2E2C28] text-white px-8 py-3.5 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg">
            Apply as Artist
          </button>
          <button className="font-ui font-medium text-[14px] text-[#1A1916] border border-[#1A1916] hover:bg-[#1A1916] hover:text-white px-8 py-3.5 rounded-full transition-all cursor-pointer">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Classic HomePage (assembled) ───────────────────────────────────────── */
export interface ClassicHomePageProps {
  artists: Artist[];
  featuredArtistIds: string[];
  onSelectArtist: (a: Artist) => void;
  onBookArtist: (a: Artist) => void;
  onViewAllArtists: () => void;
  onBrowseGenres: () => void;
  onScrollToFeatured: () => void;
  onSelectGenre: (g: GenreId) => void;
}

export function ClassicHomePage({
  artists,
  featuredArtistIds,
  onSelectArtist,
  onBookArtist,
  onViewAllArtists,
  onBrowseGenres,
  onScrollToFeatured,
  onSelectGenre,
}: ClassicHomePageProps) {
  return (
    <>
      <ClassicHero
        onBrowseGenres={onBrowseGenres}
        onScrollToFeatured={onScrollToFeatured}
        onSearchGenre={onSelectGenre}
      />
      <ClassicTicker onSelectGenre={onSelectGenre} />
      <ClassicStatsBar />
      <ClassicCategoryShowcase onSelectGenre={onSelectGenre} />
      <ClassicFeaturedArtists
        artists={artists}
        featuredArtistIds={featuredArtistIds}
        onSelectArtist={onSelectArtist}
        onBookArtist={onBookArtist}
        onViewAll={onViewAllArtists}
      />
      <ClassicHowItWorks />
      <ClassicWeddingSection onExplore={() => onSelectGenre("sufi")} />
      <ClassicJoinCTA />
    </>
  );
}
