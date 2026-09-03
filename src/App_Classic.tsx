/**
 * App_Classic.tsx
 * ─────────────────────────────────────────────────────────────────
 * The ORIGINAL Mannat Arts / StageBridge homepage — preserved in full.
 * Runs on port 8444 via `npm run dev:classic`
 * ─────────────────────────────────────────────────────────────────
 */
import { useState, useEffect } from "react";
import { Artist, ALL_ARTISTS, GENRE_METADATA, GenreInfo } from "./data/artistsData";
import { BlogArticle, BLOG_ARTICLES } from "./data/blogData";
import { GenreView } from "./components/GenreView";
import { GenresCatalogPage } from "./components/GenresCatalogPage";
import { ArtistsPage } from "./components/ArtistsPage";
import { ArtistDetailModal } from "./components/ArtistDetailModal";
import { BookingModal } from "./components/BookingModal";
import { JournalPage } from "./components/JournalPage";
import { BlogDetailPage } from "./components/BlogDetailPage";
import { AdminPortal, BookingInquiry } from "./components/admin/AdminPortal";
import { AdminLogin } from "./components/admin/AdminLogin";

/* ── Initial data ─────────────────────────────────────────────── */
const INITIAL_INQUIRIES: BookingInquiry[] = [
  {
    id: "inq-1",
    clientName: "Vikram & Ananya Singhania",
    clientEmail: "vikram.singhania@gmail.com",
    clientPhone: "+91 98201 45678",
    artistId: "artist-1",
    artistName: "Zakir Khan & Sufi Souls",
    eventType: "Wedding Sangeet & Cocktail",
    city: "Udaipur",
    eventDate: "March 18, 2026",
    budget: "₹1,20,000",
    status: "Confirmed",
    createdAt: "Feb 24, 2026",
    notes: "Require 4-piece sufi ensemble + 2 dhol players for the grand entry.",
  },
  {
    id: "inq-2",
    clientName: "TechSphere Global Summit",
    clientEmail: "events@techsphere.io",
    clientPhone: "+91 99304 88721",
    artistId: "artist-2",
    artistName: "Highway Pulse",
    eventType: "Corporate Gala & Awards",
    city: "Bangalore",
    eventDate: "April 05, 2026",
    budget: "₹85,000",
    status: "Pending",
    createdAt: "Feb 25, 2026",
    notes: "Evening gala concert after keynotes. 90-minute indie rock set.",
  },
];

type GenreId = "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";

/* ─── Waveform ───────────────────────────────────────────────── */
function Waveform({ color = "#E11D48", bars = 12 }: { color?: string; bars?: number }) {
  const hs = [45, 75, 95, 60, 85, 50, 100, 65, 80, 55, 90, 70];
  return (
    <div className="flex items-end gap-[2px]" style={{ height: "24px" }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "3px",
            height: `${hs[i % hs.length]}%`,
            backgroundColor: color,
            borderRadius: "9999px",
            animation: `waveBar ${0.7 + (i % 5) * 0.15}s ease-in-out ${i * 0.07}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar({
  onHome, onBrowseGenres, onScrollToFeatured, onBrowseArtists,
  onScrollToBlog, onOpenAdmin,
}: {
  onHome: () => void; onBrowseGenres: () => void;
  onScrollToFeatured: () => void; onBrowseArtists: () => void;
  onScrollToBlog: () => void; onOpenAdmin: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const cls = "font-body text-sm font-medium text-[#5B5B5B] hover:text-[#E11D48] hover:bg-[#FFF0F3] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={{
        background: scrolled ? "rgba(255,248,248,0.97)" : "rgba(255,248,248,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid rgba(225,29,72,0.12)" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => { onHome(); setOpen(false); }} className="flex items-center gap-2.5 cursor-pointer select-none group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9333EA] flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" />
            </svg>
          </div>
          <div>
            <span className="font-display font-bold text-xl text-[#1A1A1A] tracking-tight">StageBridge</span>
            <span className="ml-1.5 text-[9px] font-body text-[#E11D48] font-bold tracking-[0.2em] uppercase bg-[#E11D48]/10 px-1.5 py-0.5 rounded-full">Pro</span>
          </div>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button onClick={onHome} className={cls}>Home</button>
          <button onClick={onBrowseGenres} className={cls}>Browse Genres</button>
          <button onClick={onScrollToFeatured} className={cls}>Top Performers</button>
          <button onClick={onBrowseArtists} className={cls}>All Artists</button>
          <button onClick={onScrollToBlog} className={cls}>Stories</button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={onOpenAdmin} className="font-body text-xs font-medium text-[#9B1F44] hover:text-[#E11D48] cursor-pointer tracking-wide transition-colors">
            Admin
          </button>
          <button onClick={onBrowseArtists} className="font-body font-bold text-sm bg-gradient-to-r from-[#E11D48] to-[#9333EA] text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            Book Now
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] cursor-pointer" onClick={() => setOpen(o => !o)}>
          <span className={`block h-px w-6 bg-[#1A1A1A] transition-all duration-300 ${open ? "rotate-45 translate-y-[8px]" : ""}`} />
          <span className={`block h-px bg-[#1A1A1A] transition-all duration-300 ${open ? "w-0 opacity-0" : "w-5"}`} />
          <span className={`block h-px w-6 bg-[#1A1A1A] transition-all duration-300 ${open ? "-rotate-45 -translate-y-[8px]" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#FFF8F8] border-t border-[#FFE4E8] px-6 py-5 space-y-4">
          {[
            { label: "Home", fn: onHome }, { label: "Browse Genres", fn: onBrowseGenres },
            { label: "Top Performers", fn: onScrollToFeatured }, { label: "All Artists", fn: onBrowseArtists },
            { label: "Stories", fn: onScrollToBlog },
          ].map(item => (
            <button key={item.label} onClick={() => { item.fn(); setOpen(false); }}
              className="block w-full text-left font-body text-[15px] font-medium text-[#2E2E2E] py-1 border-b border-[#FFE4E8] pb-3">
              {item.label}
            </button>
          ))}
          <button onClick={() => { onBrowseArtists(); setOpen(false); }}
            className="w-full font-body font-bold text-sm bg-gradient-to-r from-[#E11D48] to-[#9333EA] text-white py-3 rounded-full mt-4">
            Book Now
          </button>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero Section ───────────────────────────────────────────── */
function HeroSection({
  onBrowseGenres, onScrollToFeatured, onSearchGenre,
}: {
  onBrowseGenres: () => void;
  onScrollToFeatured: () => void;
  onSearchGenre: (g: GenreId) => void;
}) {
  const [activeQuick, setActiveQuick] = useState("Wedding");
  const quickLinks = [
    { label: "Wedding", genre: "sufi" as GenreId },
    { label: "Corporate", genre: "gazal" as GenreId },
    { label: "Festival", genre: "bollywood" as GenreId },
    { label: "Indie Concert", genre: "rock" as GenreId },
    { label: "Cultural", genre: "devotional" as GenreId },
  ];

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ paddingTop: "64px", background: "linear-gradient(135deg,#0F0A1E 0%,#1A0A14 40%,#0A0F1E 100%)" }}
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.18]"
          style={{ background: "radial-gradient(circle,#E11D48 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle,#9333EA 0%,transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full opacity-[0.10]"
          style={{ background: "radial-gradient(circle,#F59E0B 0%,transparent 70%)", filter: "blur(50px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24 w-full">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <Waveform color="#E11D48" bars={8} />
            <span className="font-body text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48]">
              Live Performance Discovery
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif font-light text-white leading-[1.1] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(44px, 7vw, 90px)" }}>
            Book the{" "}
            <em style={{ fontStyle: "italic", background: "linear-gradient(135deg,#E11D48,#FB7185)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              perfect
            </em>
            <br />artist for your{" "}
            <em style={{ fontStyle: "italic", background: "linear-gradient(135deg,#F59E0B,#FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              event.
            </em>
          </h1>

          <p className="font-body text-white/60 text-[17px] leading-relaxed mb-8 max-w-xl">
            From soulful Sufi evenings to electrifying rock concerts — discover and book verified performing artists across India for every occasion.
          </p>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {quickLinks.map(q => (
              <button key={q.label} onClick={() => { setActiveQuick(q.label); onSearchGenre(q.genre); }}
                className={`font-body text-[12px] font-medium px-4 py-2 rounded-full border transition-all cursor-pointer ${
                  activeQuick === q.label
                    ? "bg-[#E11D48] text-white border-[#E11D48] shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                    : "bg-white/5 text-white/70 border-white/20 hover:border-[#E11D48]/60 hover:text-white"
                }`}>
                {q.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={onBrowseGenres}
              className="font-body font-bold text-[14px] bg-[#E11D48] hover:bg-[#BE123C] text-white px-7 py-3.5 rounded-full transition-all cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] hover:-translate-y-0.5">
              Browse All Genres
            </button>
            <button onClick={onScrollToFeatured}
              className="font-body font-medium text-[14px] text-white/80 hover:text-white border border-white/25 hover:border-white/50 px-7 py-3.5 rounded-full transition-all cursor-pointer">
              Top Performers ↓
            </button>
          </div>
        </div>
      </div>

      {/* Bottom fade to ivory */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to top,#FFF8F8 0%,transparent 100%)" }} />
    </section>
  );
}

/* ─── Performer Ticker ───────────────────────────────────────── */
function PerformerTicker({ onSelectGenre }: { onSelectGenre: (g: GenreId) => void }) {
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
    <div className="overflow-hidden py-4 border-y border-[#1A0814]/80"
      style={{ background: "#1A0814" }}>
      <div className="flex animate-ticker" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <button key={i} onClick={() => onSelectGenre(item.genre)}
            className="flex items-center gap-5 flex-shrink-0 px-8 cursor-pointer group">
            <span className="font-body text-white/40 group-hover:text-[#E11D48] transition-colors text-[13px] font-medium tracking-widest uppercase">
              {item.label}
            </span>
            <svg className="w-3 h-3 text-[#E11D48]/30 group-hover:text-[#E11D48] transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Stats Bar ──────────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { value: "1,200+", label: "Verified Artists" },
    { value: "6", label: "Genres" },
    { value: "850+", label: "Events Completed" },
    { value: "40+", label: "Cities" },
    { value: "4.9★", label: "Average Rating" },
  ];
  return (
    <div className="py-8 px-6 border-b border-[#FFE4E8]" style={{ background: "#FFF8F8" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <p className="font-display font-bold text-[28px] text-[#E11D48] mb-0.5">{s.value}</p>
            <p className="font-body text-[11px] text-[#9B9B9B] font-medium tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Category Showcase ──────────────────────────────────────── */
const GENRE_CARDS: { key: GenreId; label: string; sub: string; color: string; emoji: string; img: string }[] = [
  { key: "sufi", label: "Sufi & Qawwali", sub: "Soul-stirring devotion", color: "#9F1239", emoji: "🎵", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=75" },
  { key: "rock", label: "Indie & Rock", sub: "Raw electric energy", color: "#1D4ED8", emoji: "🎸", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=75" },
  { key: "gazal", label: "Ghazal & Classical", sub: "Poetic elegance", color: "#065F46", emoji: "🎻", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop&q=75" },
  { key: "bollywood", label: "Bollywood & Dance", sub: "Cinematic celebration", color: "#B45309", emoji: "💃", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop&q=75" },
  { key: "carnival", label: "Carnival & Theatre", sub: "Spectacle & drama", color: "#6D28D9", emoji: "🎭", img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop&q=75" },
  { key: "devotional", label: "Devotional & Folk", sub: "Living traditions", color: "#B45309", emoji: "🪘", img: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&h=400&fit=crop&q=75" },
];

function CategoryShowcase({ onSelectGenre }: { onSelectGenre: (g: GenreId) => void }) {
  return (
    <section className="py-20 lg:py-28" style={{ background: "#FFF8F8" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="font-body text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48] mb-3 block">
            PERFORMANCE GENRES
          </span>
          <h2 className="font-serif font-light text-[#1A1A1A]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4.5vw, 52px)" }}>
            Every genre, every occasion
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {GENRE_CARDS.map(g => (
            <button key={g.key} onClick={() => onSelectGenre(g.key)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer text-left transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl"
              style={{ height: "220px" }}>
              <img src={g.img} alt={g.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-400"
                style={{ background: g.color }} />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h3 className="font-serif text-white text-[18px] font-light leading-tight mb-1 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>{g.label}</h3>
                <p className="font-body text-white/65 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{g.sub}</p>
                <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="font-body text-[9px] font-bold tracking-[0.2em] text-[#FB7185] uppercase">EXPLORE</span>
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

/* ─── Featured Artists ───────────────────────────────────────── */
function FeaturedArtists({
  artists, featuredArtistIds, onSelectArtist, onBookArtist, onViewAll,
}: {
  artists: Artist[]; featuredArtistIds: string[];
  onSelectArtist: (a: Artist) => void; onBookArtist: (a: Artist) => void;
  onViewAll: () => void;
}) {
  const featured = artists.filter(a => featuredArtistIds.includes(a.id));
  const display = featured.length > 0 ? featured : artists.slice(0, 6);

  return (
    <section id="featured-performers" className="py-20 lg:py-28 border-t border-[#FFE4E8]" style={{ background: "#FFF0F3" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-body text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48] block mb-3">TOP PERFORMERS</span>
            <h2 className="font-serif font-light text-[#1A1A1A]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4vw, 48px)" }}>
              Featured artists
            </h2>
          </div>
          <button onClick={onViewAll}
            className="hidden md:flex items-center gap-2 font-body text-[13px] font-medium text-[#E11D48] hover:text-[#BE123C] transition-colors group cursor-pointer">
            View all
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.slice(0, 6).map(artist => (
            <div key={artist.id}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#FFD6DC] hover:border-[#E11D48]/50 transition-all duration-400 hover:shadow-xl hover:-translate-y-1 bg-white"
              onClick={() => onSelectArtist(artist)}>
              <div className="relative overflow-hidden" style={{ height: "240px" }}>
                <img src={artist.img} alt={artist.stageName || artist.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <button onClick={e => { e.stopPropagation(); onBookArtist(artist); }}
                  className="absolute bottom-3 right-3 font-body text-[11px] font-bold bg-[#E11D48] text-white px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer shadow-lg">
                  Book Now
                </button>
                {/* Genre badge */}
                <div className="absolute top-3 left-3 bg-[#E11D48] text-white px-2.5 py-1 rounded-full">
                  <span className="font-body text-[9px] font-bold tracking-widest uppercase">{artist.genre}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-serif font-light text-[#1A1A1A] text-[20px] leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {artist.stageName || artist.name}
                    </h3>
                    <p className="font-body text-[12px] text-[#9B9B9B] capitalize">{artist.genre} · {artist.city}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FFF0F3] px-2 py-1 rounded-full">
                    <svg className="w-3 h-3 text-[#E11D48]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                    <span className="font-body text-[11px] font-bold text-[#E11D48]">{artist.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#FFE4E8]">
                  <span className="font-body text-[12px] font-semibold text-[#1A1A1A]">From {artist.price}</span>
                  <span className="font-body text-[11px] text-[#9B9B9B]">{artist.bandType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button onClick={onViewAll}
            className="font-body font-bold text-[14px] bg-gradient-to-r from-[#E11D48] to-[#9333EA] text-white px-8 py-3.5 rounded-full transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            View All Artists
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Browse & Discover", d: "Explore 1,200+ verified performing artists across 6 genres and 40+ cities in India." },
    { n: "02", t: "Choose & Connect", d: "Review profiles, watch videos, check rider requirements, and send a booking request." },
    { n: "03", t: "Experience & Celebrate", d: "Confirm booking, finalise details with the artist, and enjoy a seamless performance." },
  ];
  return (
    <section className="py-20 lg:py-28" style={{ background: "#1A0A14" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="font-body text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48] mb-3 block">HOW IT WORKS</span>
          <h2 className="font-serif font-light text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4vw, 50px)" }}>
            Simple, trusted, seamless
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
          {steps.map(s => (
            <div key={s.n} className="relative">
              <span className="font-serif text-[72px] font-light leading-none text-white/8 block mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(255,255,255,0.06)" }}>{s.n}</span>
              <div className="h-px mb-5" style={{ background: "linear-gradient(to right,rgba(225,29,72,0.5),transparent)" }} />
              <h3 className="font-serif font-light text-white text-[22px] mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.t}</h3>
              <p className="font-body text-white/45 text-[14px] leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Wedding Section ────────────────────────────────────────── */
function WeddingSection({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative py-24 lg:py-36 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=900&fit=crop&q=80"
        alt="Wedding" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to right,rgba(15,10,30,0.93) 0%,rgba(15,10,30,0.72) 55%,rgba(15,10,30,0.3) 100%)" }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-xl">
          <span className="font-body text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48] mb-4 block">WEDDINGS & CELEBRATIONS</span>
          <h2 className="font-serif font-light text-white leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 64px)" }}>
            Make your wedding<br />
            <em style={{ fontStyle: "italic", background: "linear-gradient(135deg,#E11D48,#FB7185)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              unforgettable.
            </em>
          </h2>
          <p className="font-body text-white/60 text-[15px] leading-relaxed mb-8">
            From the Mehndi evening to the grand reception — curated Sufi, Ghazal and Bollywood ensembles for every wedding ritual.
          </p>
          <button onClick={onExplore}
            className="font-body font-bold text-[14px] bg-[#E11D48] hover:bg-[#BE123C] text-white px-8 py-3.5 rounded-full transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1">
            Explore Wedding Artists
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Join Artist CTA ────────────────────────────────────────── */
function JoinArtistCTA() {
  return (
    <section className="py-20 lg:py-28" style={{ background: "#FFF8F8" }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <span className="font-body text-[10px] font-bold tracking-[0.25em] uppercase text-[#E11D48] mb-4 block">FOR ARTISTS</span>
        <h2 className="font-serif font-light text-[#1A1A1A] leading-tight mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4vw, 52px)" }}>
          Are you a performing artist?<br />
          <em style={{ fontStyle: "italic" }}>Join our roster.</em>
        </h2>
        <p className="font-body text-[#9B9B9B] text-[15px] leading-relaxed max-w-xl mx-auto mb-10">
          Get discovered by event organisers across India. Manage bookings, showcase your work, and grow your audience.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button className="font-body font-bold text-[14px] bg-gradient-to-r from-[#E11D48] to-[#9333EA] text-white px-8 py-3.5 rounded-full transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Apply as Artist
          </button>
          <button className="font-body font-medium text-[14px] text-[#E11D48] border border-[#E11D48]/40 hover:bg-[#E11D48] hover:text-white px-8 py-3.5 rounded-full transition-all cursor-pointer">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer({
  onSelectGenre, onBrowseArtists, onScrollToBlog,
}: {
  onSelectGenre: (g: GenreId) => void;
  onBrowseArtists: () => void;
  onScrollToBlog: () => void;
}) {
  return (
    <footer style={{ background: "#0F0A1E", color: "#6B6B6B" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E11D48] to-[#9333EA] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" /></svg>
            </div>
            <span className="font-body font-bold text-white text-lg">StageBridge</span>
          </div>
          <p className="font-body text-[13px] leading-relaxed">India's premier platform for booking live performing artists.</p>
        </div>
        <div>
          <h6 className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Genres</h6>
          {(["sufi","rock","gazal","bollywood","carnival","devotional"] as GenreId[]).map(g => (
            <button key={g} onClick={() => onSelectGenre(g)}
              className="block font-body text-[13px] capitalize text-[#6B6B6B] hover:text-[#E11D48] transition-colors cursor-pointer mb-2">{g}</button>
          ))}
        </div>
        <div>
          <h6 className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Platform</h6>
          {["For Artists","For Organisers","Browse Artists","Stories"].map(l => (
            <button key={l} onClick={l === "Browse Artists" ? onBrowseArtists : onScrollToBlog}
              className="block font-body text-[13px] text-[#6B6B6B] hover:text-[#E11D48] transition-colors cursor-pointer mb-2">{l}</button>
          ))}
        </div>
        <div>
          <h6 className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Company</h6>
          {["About","Careers","Press","Contact"].map(l => (
            <button key={l} className="block font-body text-[13px] text-[#6B6B6B] hover:text-[#E11D48] transition-colors cursor-pointer mb-2">{l}</button>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center">
        <p className="font-body text-[12px] text-[#3A3A3A]">© 2026 StageBridge. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT APP (CLASSIC)
══════════════════════════════════════════════════════════════════ */

export default function AppClassic() {
  type Page = "home" | "genres" | "genre" | "artists" | "journal" | "blog-detail" | "admin" | "admin-login";
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [activeGenre, setActiveGenre] = useState<GenreId>("sufi");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [bookingArtist, setBookingArtist] = useState<Artist | null>(null);
  const [selectedBlogArticle, setSelectedBlogArticle] = useState<BlogArticle | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [articleLikes, setArticleLikes] = useState<Record<string, number>>({});

  const [artistsList, setArtistsList] = useState<Artist[]>(() => {
    try { const s = localStorage.getItem("classic_artists"); return s ? JSON.parse(s) : ALL_ARTISTS; } catch { return ALL_ARTISTS; }
  });
  const [articlesList, setArticlesList] = useState<BlogArticle[]>(() => {
    try { const s = localStorage.getItem("classic_blogs"); return s ? JSON.parse(s) : BLOG_ARTICLES; } catch { return BLOG_ARTICLES; }
  });
  const [inquiriesList, setInquiriesList] = useState<BookingInquiry[]>(() => {
    try { const s = localStorage.getItem("classic_inquiries"); return s ? JSON.parse(s) : INITIAL_INQUIRIES; } catch { return INITIAL_INQUIRIES; }
  });
  const [featuredArtistIds, setFeaturedArtistIds] = useState<string[]>(() => {
    try { const s = localStorage.getItem("classic_featured_ids"); return s ? JSON.parse(s) : ALL_ARTISTS.slice(0, 6).map(a => a.id); } catch { return ALL_ARTISTS.slice(0, 6).map(a => a.id); }
  });
  const [genresMap, setGenresMap] = useState<Record<string, GenreInfo>>(() => {
    try { const s = localStorage.getItem("classic_genres"); return s ? { ...GENRE_METADATA, ...JSON.parse(s) } : GENRE_METADATA; } catch { return GENRE_METADATA; }
  });

  const save = (key: string, val: unknown) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

  const handleAddArtist = (a: Artist) => { const u = [...artistsList, a]; setArtistsList(u); save("classic_artists", u); };
  const handleUpdateArtist = (a: Artist) => { const u = artistsList.map(x => x.id === a.id ? a : x); setArtistsList(u); save("classic_artists", u); };
  const handleDeleteArtist = (id: string) => { const u = artistsList.filter(x => x.id !== id); setArtistsList(u); save("classic_artists", u); };
  const handleAddArticle = (a: BlogArticle) => { const u = [...articlesList, a]; setArticlesList(u); save("classic_blogs", u); };
  const handleUpdateArticle = (a: BlogArticle) => { const u = articlesList.map(x => x.id === a.id ? a : x); setArticlesList(u); save("classic_blogs", u); };
  const handleDeleteArticle = (id: string) => { const u = articlesList.filter(x => x.id !== id); setArticlesList(u); save("classic_blogs", u); };
  const handleSetFeaturedArtistIds = (ids: string[]) => { setFeaturedArtistIds(ids); save("classic_featured_ids", ids); };
  const handleUpdateInquiryStatus = (id: string, status: BookingInquiry["status"]) => {
    const u = inquiriesList.map(x => x.id === id ? { ...x, status } : x); setInquiriesList(u); save("classic_inquiries", u);
  };
  const handleUpdateGenre = (genreId: string, updated: Partial<GenreInfo>) => {
    setGenresMap(prev => {
      const next = { ...prev, [genreId]: { ...(prev[genreId] || GENRE_METADATA[genreId]), ...updated } };
      save("classic_genres", next); return next;
    });
  };
  const handleResetToDefaults = () => {
    setArtistsList(ALL_ARTISTS); setArticlesList(BLOG_ARTICLES);
    setInquiriesList(INITIAL_INQUIRIES); setFeaturedArtistIds(ALL_ARTISTS.slice(0, 6).map(a => a.id));
    setGenresMap(GENRE_METADATA);
    ["classic_artists","classic_blogs","classic_inquiries","classic_featured_ids","classic_genres"].forEach(k => { try { localStorage.removeItem(k); } catch {} });
  };
  const handleToggleLike = (id: string) => {
    setArticleLikes(prev => { const base = prev[id] ?? 0; const init = articlesList.find(a => a.id === id)?.initialLikes ?? 0; return { ...prev, [id]: base > init ? base - 1 : base + 1 }; });
  };

  const go = (page: Page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleBackHome = () => { window.location.hash = ""; go("home"); };
  const handleOpenGenre = (g: GenreId) => { setActiveGenre(g); go("genre"); };

  const footerProps = {
    onSelectGenre: handleOpenGenre,
    onBrowseArtists: () => go("artists"),
    onScrollToBlog: () => go("journal"),
  };

  return (
    <div className="font-body" style={{ background: "#FFF8F8" }}>
      {/* Waveform animation keyframes */}
      <style>{`@keyframes waveBar{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}`}</style>

      {currentPage === "home" && (
        <Navbar
          onHome={handleBackHome}
          onBrowseGenres={() => go("genres")}
          onScrollToFeatured={() => {
            if (currentPage !== "home") { go("home"); setTimeout(() => document.getElementById("featured-performers")?.scrollIntoView({ behavior: "smooth" }), 100); }
            else document.getElementById("featured-performers")?.scrollIntoView({ behavior: "smooth" });
          }}
          onBrowseArtists={() => go("artists")}
          onScrollToBlog={() => go("journal")}
          onOpenAdmin={() => { window.location.hash = "#admin"; go(isAdminAuthenticated ? "admin" : "admin-login"); }}
        />
      )}

      {currentPage === "admin-login" ? (
        <AdminLogin onLoginSuccess={() => { setIsAdminAuthenticated(true); go("admin"); }} onBackToSite={handleBackHome} />
      ) : currentPage === "admin" ? (
        <AdminPortal
          artists={artistsList} featuredArtistIds={featuredArtistIds}
          onSetFeaturedArtistIds={handleSetFeaturedArtistIds}
          onAddArtist={handleAddArtist} onUpdateArtist={handleUpdateArtist} onDeleteArtist={handleDeleteArtist}
          articles={articlesList} onAddArticle={handleAddArticle} onUpdateArticle={handleUpdateArticle} onDeleteArticle={handleDeleteArticle}
          bookingInquiries={inquiriesList} onUpdateInquiryStatus={handleUpdateInquiryStatus}
          onResetToDefaults={handleResetToDefaults} onExitToClient={handleBackHome}
          onLogout={() => { setIsAdminAuthenticated(false); handleBackHome(); }}
          onPreviewArtist={a => setSelectedArtist(a)} onPreviewArticle={a => { setSelectedBlogArticle(a); go("blog-detail"); }}
          genres={genresMap} onUpdateGenre={handleUpdateGenre}
        />
      ) : currentPage === "genres" ? (
        <>
          <GenresCatalogPage onSelectGenre={handleOpenGenre} onBackHome={handleBackHome} onBrowseArtists={() => go("artists")} artists={artistsList} />
          <Footer {...footerProps} />
        </>
      ) : currentPage === "journal" ? (
        <>
          <JournalPage onSelectArticle={a => { setSelectedBlogArticle(a); go("blog-detail"); }} likes={articleLikes} onToggleLike={handleToggleLike} onBackHome={handleBackHome} onSelectGenre={handleOpenGenre} articles={articlesList} />
          <Footer {...footerProps} />
        </>
      ) : currentPage === "artists" ? (
        <ArtistsPage onBackHome={handleBackHome} onSelectArtist={setSelectedArtist} onBookArtist={setBookingArtist} allArtists={artistsList} />
      ) : currentPage === "genre" ? (
        <>
          <GenreView genreId={activeGenre} onSelectGenre={handleOpenGenre} onBack={handleBackHome} onSelectArtist={setSelectedArtist} onBookArtist={setBookingArtist} allArtists={artistsList} genresMap={genresMap} />
          <Footer {...footerProps} />
        </>
      ) : currentPage === "blog-detail" && selectedBlogArticle ? (
        <>
          <BlogDetailPage article={selectedBlogArticle} onBack={handleBackHome} likes={articleLikes} onToggleLike={handleToggleLike} onSelectArticle={a => { setSelectedBlogArticle(a); go("blog-detail"); }} onSelectGenre={handleOpenGenre} onBrowseArtists={() => go("artists")} allArticles={articlesList} />
          <Footer {...footerProps} />
        </>
      ) : (
        /* ── CLASSIC HOMEPAGE ── */
        <>
          <HeroSection onBrowseGenres={() => go("genres")} onScrollToFeatured={() => document.getElementById("featured-performers")?.scrollIntoView({ behavior: "smooth" })} onSearchGenre={handleOpenGenre} />
          <PerformerTicker onSelectGenre={handleOpenGenre} />
          <StatsBar />
          <CategoryShowcase onSelectGenre={handleOpenGenre} />
          <FeaturedArtists artists={artistsList} featuredArtistIds={featuredArtistIds} onSelectArtist={setSelectedArtist} onBookArtist={setBookingArtist} onViewAll={() => go("artists")} />
          <HowItWorks />
          <WeddingSection onExplore={() => handleOpenGenre("sufi")} />
          <JoinArtistCTA />
          <Footer {...footerProps} />
        </>
      )}

      <ArtistDetailModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} onBook={a => setBookingArtist(a)} />
      <BookingModal artist={bookingArtist} onClose={() => setBookingArtist(null)} />
    </div>
  );
}
