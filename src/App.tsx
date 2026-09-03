import { useState, useEffect, useRef } from "react";
import { Artist, GenreInfo, ALL_ARTISTS, GENRE_METADATA } from "./data/artistsData";
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
import { ClassicHomePage } from "./components/ClassicHomePage";

export const INITIAL_BOOKING_INQUIRIES: BookingInquiry[] = [
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
  {
    id: "inq-3",
    clientName: "Mehta Family Silver Jubilee",
    clientEmail: "smehta@heritagehomes.in",
    clientPhone: "+91 97112 33455",
    artistId: "artist-3",
    artistName: "Mahesh Pandit & Strings",
    eventType: "Private Ghazal Baithak",
    city: "Delhi NCR",
    eventDate: "March 29, 2026",
    budget: "₹50,000",
    status: "Pending",
    createdAt: "Feb 23, 2026",
    notes: "Low-floor baithak setup in private lawn. Traditional harmonium & tabla accompaniment.",
  },
];

/* ══════════════════════════════════════════════════════════════════
   PREMIUM MANNAT ARTS — EDITORIAL CULTURAL DISCOVERY PLATFORM
══════════════════════════════════════════════════════════════════ */

/* ── Navigation ─────────────────────────────────────────────────────────── */

interface NavbarProps {
  onHome: () => void;
  onBrowseGenres: () => void;
  onScrollToFeatured: () => void;
  onBrowseArtists: () => void;
  onScrollToBlog: () => void;
  onOpenAdmin: () => void;
  onPlanEvent: () => void;
}

function Navbar({ onHome, onBrowseGenres, onScrollToFeatured, onBrowseArtists, onScrollToBlog, onOpenAdmin, onPlanEvent }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinkClass = "font-ui text-[13px] font-medium text-[#4A4845] hover:text-[#1A1916] transition-colors duration-200 cursor-pointer tracking-wide";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(250, 247, 242, 0.95)" : "rgba(250, 247, 242, 0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(196,149,42,0.15)" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 30px rgba(26,25,22,0.05)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => { onHome(); setOpen(false); }}
          className="flex flex-col leading-none cursor-pointer group select-none"
          aria-label="Mannat Arts Home"
        >
          <span
            className="font-serif text-[22px] font-light tracking-[0.06em] text-[#1A1916] group-hover:text-[#C4952A] transition-colors duration-300"
            style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.08em" }}
          >
            MANNAT ARTS
          </span>
          <span className="label-editorial text-[#C4952A] tracking-[0.22em]" style={{ fontSize: "7px" }}>
            CULTURAL EXPERIENCES
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          <button onClick={onBrowseGenres} className={navLinkClass}>Experiences</button>
          <button onClick={onBrowseGenres} className={navLinkClass}>Genres</button>
          <button onClick={onBrowseArtists} className={navLinkClass}>Artists</button>
          <button onClick={onScrollToFeatured} className={navLinkClass}>Occasions</button>
          <button onClick={onScrollToBlog} className={navLinkClass}>Stories</button>
          <button onClick={onHome} className={navLinkClass}>About</button>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search icon */}
          <button
            onClick={onBrowseArtists}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#4A4845] hover:text-[#1A1916] hover:bg-[#EDE8DF] transition-all cursor-pointer"
            aria-label="Search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
          {/* Admin link — subtle */}
          <button
            onClick={onOpenAdmin}
            className="font-ui text-[11px] font-medium text-[#9A7219] hover:text-[#C4952A] transition-colors cursor-pointer tracking-wide"
          >
            Admin
          </button>
          {/* Primary CTA */}
          <button
            onClick={onPlanEvent}
            className="font-ui text-[13px] font-semibold bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer tracking-wide shadow-sm hover:shadow-md"
          >
            Plan an Event
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] cursor-pointer"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
        >
          <span className={`block h-px w-6 bg-[#1A1916] transition-all duration-300 ${open ? "rotate-45 translate-y-[8px]" : ""}`} />
          <span className={`block h-px bg-[#1A1916] transition-all duration-300 ${open ? "w-0 opacity-0" : "w-5"}`} />
          <span className={`block h-px w-6 bg-[#1A1916] transition-all duration-300 ${open ? "-rotate-45 -translate-y-[8px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#FAF7F2] border-t border-[#EDE8DF] px-6 py-6 space-y-4">
          {[
            { label: "Experiences", action: onBrowseGenres },
            { label: "Genres", action: onBrowseGenres },
            { label: "Artists", action: onBrowseArtists },
            { label: "Stories", action: onScrollToBlog },
            { label: "About", action: onHome },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => { item.action(); setOpen(false); }}
              className="block w-full text-left font-ui text-[15px] font-medium text-[#2E2C28] py-1 border-b border-[#EDE8DF] pb-3"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { onPlanEvent(); setOpen(false); }}
            className="w-full font-ui font-semibold text-sm bg-[#1A1916] text-[#FAF7F2] py-3 rounded-full mt-4"
          >
            Plan an Event
          </button>
        </div>
      )}
    </nav>
  );
}

/* ── Hero Section ───────────────────────────────────────────────────────── */

function HeroSection({
  onExplore,
  onFindByMood,
  onSelectGenre,
}: {
  onExplore: () => void;
  onFindByMood: () => void;
  onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
}) {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden" style={{ paddingTop: "68px" }}>
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&h=1080&fit=crop&auto=format&q=85"
          alt="Live performance"
          className="w-full h-full object-cover"
        />
        {/* Cinematic overlay — dark from bottom, subtle at top */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(26,25,22,0.95) 0%, rgba(26,25,22,0.72) 35%, rgba(26,25,22,0.32) 65%, rgba(26,25,22,0.12) 100%)"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20 lg:pb-28 w-full">
        {/* Eyebrow */}
        <div className="mb-6">
          <span className="label-editorial text-[#DDB96A] tracking-[0.28em]" style={{ fontSize: "10px" }}>
            · CULTURAL EXPERIENCE DISCOVERY ·
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="font-serif text-white font-light leading-[1.08] tracking-[-0.01em] mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          Find the art that<br />
          <em style={{ fontStyle: "italic", color: "#DDB96A" }}>fits the moment.</em>
        </h1>

        {/* Supporting copy */}
        <p
          className="font-ui text-[#A8A49A] font-light leading-relaxed mb-10 max-w-xl"
          style={{ fontSize: "clamp(15px, 1.6vw, 18px)" }}
        >
          Discover performances, artists and experiences curated<br className="hidden lg:block" />
          around your mood, occasion and purpose.
        </p>

        {/* CTA Row */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={onExplore}
            className="font-ui font-semibold text-[14px] bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-7 py-3.5 rounded-full transition-all duration-300 cursor-pointer tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Explore Experiences
          </button>
          <button
            onClick={onFindByMood}
            className="font-ui font-medium text-[14px] text-white border border-white/30 hover:border-[#DDB96A] hover:text-[#DDB96A] px-7 py-3.5 rounded-full transition-all duration-300 cursor-pointer tracking-wide"
          >
            Find by Mood ↓
          </button>
        </div>

        {/* Floating genre chips — bottom right */}
        <div className="hidden lg:flex absolute bottom-28 right-8 flex-col items-end gap-2">
          {(["sufi", "rock", "gazal", "bollywood"] as const).map(g => (
            <button
              key={g}
              onClick={() => onSelectGenre(g)}
              className="label-editorial text-white/70 hover:text-[#DDB96A] border border-white/20 hover:border-[#DDB96A]/50 px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 backdrop-blur-sm"
              style={{ fontSize: "9px", background: "rgba(26,25,22,0.3)" }}
            >
              {g.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/40" />
        <span className="label-editorial text-white/40" style={{ fontSize: "8px" }}>SCROLL</span>
      </div>
    </section>
  );
}

/* ── Genre Ticker ───────────────────────────────────────────────────────── */

function GenreTicker({ onSelectGenre }: { onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void }) {
  const items = [
    { label: "Sufi & Qawwali", genre: "sufi" as const },
    { label: "Indie & Rock", genre: "rock" as const },
    { label: "Ghazal & Classical", genre: "gazal" as const },
    { label: "Bollywood & Dance", genre: "bollywood" as const },
    { label: "Carnival & Theatre", genre: "carnival" as const },
    { label: "Devotional & Folk", genre: "devotional" as const },
  ];
  const doubled = [...items, ...items, ...items];
  return (
    <div className="border-y border-[#EDE8DF] overflow-hidden py-4" style={{ background: "#F5F0E8" }}>
      <div className="flex animate-ticker gap-0" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelectGenre(item.genre)}
            className="flex items-center gap-5 flex-shrink-0 px-8 cursor-pointer group"
          >
            <span
              className="font-serif font-light text-[#4A4845] group-hover:text-[#C4952A] transition-colors duration-300"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", letterSpacing: "0.06em" }}
            >
              {item.label}
            </span>
            <span className="text-[#C4952A]/40 text-xs">·</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Mood Discovery ─────────────────────────────────────────────────────── */

const MOODS = [
  {
    id: "celebrate",
    title: "Celebrate",
    desc: "Joyful performances for unforgettable moments.",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=1000&fit=crop&auto=format&q=80",
    accent: "#C4952A",
    genre: "bollywood" as const,
  },
  {
    id: "reflect",
    title: "Feel & Reflect",
    desc: "Soulful, intimate art that moves you within.",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1000&fit=crop&auto=format&q=80",
    accent: "#6B2737",
    genre: "sufi" as const,
  },
  {
    id: "energise",
    title: "Energise",
    desc: "High-energy shows that electrify every stage.",
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=1000&fit=crop&auto=format&q=80",
    accent: "#2E2C28",
    genre: "rock" as const,
  },
  {
    id: "immerse",
    title: "Immerse",
    desc: "Deeply cultural experiences that transport you.",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1000&fit=crop&auto=format&q=80",
    accent: "#6B7B4A",
    genre: "gazal" as const,
  },
  {
    id: "discover",
    title: "Discover",
    desc: "Unexpected art forms that surprise and delight.",
    img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=1000&fit=crop&auto=format&q=80",
    accent: "#B5593C",
    genre: "carnival" as const,
  },
  {
    id: "connect",
    title: "Connect",
    desc: "Communal, spiritual gatherings that bring people together.",
    img: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=1000&fit=crop&auto=format&q=80",
    accent: "#4A1A24",
    genre: "devotional" as const,
  },
];

function MoodDiscovery({ id, onSelectGenre }: { id?: string; onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id={id} className="py-24 lg:py-36" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 lg:mb-20 max-w-xl">
          <span className="label-editorial text-[#C4952A] tracking-[0.22em] block mb-4" style={{ fontSize: "10px" }}>
            MOOD DISCOVERY
          </span>
          <h2
            className="font-serif font-light text-[#1A1916] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4.5vw, 56px)" }}
          >
            What are you in the<br />
            <em style={{ fontStyle: "italic" }}>mood for?</em>
          </h2>
          <p className="font-ui text-[#7A776F] text-[15px] leading-relaxed">
            You may not know what genre you want. Start with how you want the experience to feel.
          </p>
        </div>

        {/* Cards — editorial varied layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {MOODS.map((mood, idx) => {
            const isLarge = idx === 0 || idx === 3;
            return (
              <button
                key={mood.id}
                onClick={() => onSelectGenre(mood.genre)}
                onMouseEnter={() => setHovered(mood.id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative overflow-hidden rounded-2xl cursor-pointer text-left group ${isLarge ? "row-span-2" : ""}`}
                style={{ height: isLarge ? "440px" : "210px" }}
                aria-label={mood.title}
              >
                {/* Image */}
                <img
                  src={mood.img}
                  alt={mood.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-400"
                  style={{
                    background: `linear-gradient(to top, rgba(26,25,22,0.88) 0%, rgba(26,25,22,0.35) 55%, rgba(26,25,22,0.08) 100%)`,
                    opacity: hovered === mood.id ? 1 : 0.85,
                  }}
                />
                {/* Gold accent line — slides in on hover */}
                <div
                  className="absolute left-0 bottom-0 w-full h-[2px] transition-all duration-500"
                  style={{
                    background: mood.accent,
                    transform: hovered === mood.id ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                  }}
                />
                {/* Text */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3
                    className="font-serif font-light text-white mb-1 transition-all duration-300"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: isLarge ? "clamp(24px, 2.5vw, 32px)" : "22px",
                      transform: hovered === mood.id ? "translateY(-4px)" : "translateY(0)",
                    }}
                  >
                    {mood.title}
                  </h3>
                  <p
                    className="font-ui text-white/75 text-[13px] leading-snug transition-all duration-300"
                    style={{
                      opacity: hovered === mood.id ? 1 : 0,
                      transform: hovered === mood.id ? "translateY(0)" : "translateY(6px)",
                    }}
                  >
                    {mood.desc}
                  </p>
                  {/* Arrow */}
                  <div
                    className="mt-3 flex items-center gap-2 transition-all duration-300"
                    style={{ opacity: hovered === mood.id ? 1 : 0 }}
                  >
                    <span className="label-editorial text-[#DDB96A]" style={{ fontSize: "9px" }}>EXPLORE</span>
                    <svg className="w-3 h-3 text-[#DDB96A] transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Occasion Discovery ─────────────────────────────────────────────────── */

const OCCASIONS = [
  { label: "Wedding", icon: "◈", genre: "sufi" as const },
  { label: "Corporate Event", icon: "◎", genre: "gazal" as const },
  { label: "Festival", icon: "◉", genre: "bollywood" as const },
  { label: "Private Celebration", icon: "◈", genre: "gazal" as const },
  { label: "College / Campus", icon: "◇", genre: "rock" as const },
  { label: "Cultural Event", icon: "◆", genre: "devotional" as const },
  { label: "Brand Event", icon: "○", genre: "bollywood" as const },
  { label: "Community Event", icon: "◎", genre: "carnival" as const },
  { label: "Concert", icon: "◉", genre: "rock" as const },
];

function OccasionDiscovery({ onSelectGenre }: { onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void }) {
  return (
    <section className="py-24 lg:py-32" style={{ background: "#F5F0E8" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-14 max-w-xl">
          <span className="label-editorial text-[#B5593C] tracking-[0.22em] block mb-4" style={{ fontSize: "10px" }}>
            BY OCCASION
          </span>
          <h2
            className="font-serif font-light text-[#1A1916] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            What are you<br /><em style={{ fontStyle: "italic" }}>planning?</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "#D6CFBF" }}>
          {OCCASIONS.map(occ => (
            <button
              key={occ.label}
              onClick={() => onSelectGenre(occ.genre)}
              className="group bg-[#F5F0E8] hover:bg-[#1A1916] p-8 flex items-center justify-between transition-all duration-350 cursor-pointer text-left"
            >
              <div className="flex items-center gap-4">
                <span className="font-serif text-2xl text-[#C4952A] group-hover:text-[#DDB96A] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {occ.icon}
                </span>
                <span
                  className="font-serif font-light text-[#1A1916] group-hover:text-white transition-colors text-[18px]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {occ.label}
                </span>
              </div>
              <svg
                className="w-4 h-4 text-[#C4952A] group-hover:text-[#DDB96A] transition-all duration-300 group-hover:translate-x-1"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Smart Discovery Tool ───────────────────────────────────────────────── */

function SmartDiscovery({ onSelectGenre }: { onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void }) {
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showResults, setShowResults] = useState(false);

  const moods = ["Soulful", "Energetic", "Elegant", "Joyful", "Experimental", "Intimate"];
  const occasions = ["Wedding", "Corporate", "Festival", "Celebration", "Cultural", "Private"];
  const genres = ["Music", "Dance", "Theatre", "Folk", "Classical", "Storytelling", "Visual Arts"];
  const sizes = ["Small (under 50)", "Medium (50–200)", "Large (200+)"];

  const GENRE_MAP: Record<string, "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional"> = {
    "Soulful": "sufi", "Energetic": "rock", "Elegant": "gazal", "Joyful": "bollywood",
    "Experimental": "carnival", "Intimate": "devotional",
    "Music": "sufi", "Dance": "bollywood", "Theatre": "carnival",
    "Folk": "devotional", "Classical": "gazal", "Storytelling": "sufi", "Visual Arts": "carnival",
  };

  const ChipBtn = ({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) => (
    <button
      onClick={onSelect}
      className={`font-ui text-[13px] px-4 py-2 rounded-full border transition-all duration-250 cursor-pointer ${
        selected
          ? "bg-[#1A1916] text-[#FAF7F2] border-[#1A1916]"
          : "bg-transparent text-[#4A4845] border-[#C4952A]/40 hover:border-[#C4952A] hover:text-[#1A1916]"
      }`}
    >
      {label}
    </button>
  );

  const handleDiscover = () => {
    const key = selectedMood || selectedGenre;
    const mappedGenre = GENRE_MAP[key] || "sufi";
    setShowResults(true);
    setTimeout(() => {
      onSelectGenre(mappedGenre);
      setShowResults(false);
    }, 600);
  };

  const hasSelection = selectedMood || selectedOccasion || selectedGenre || selectedSize;

  return (
    <section className="py-24 lg:py-36" style={{ background: "#1A1916" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 lg:mb-16 text-center">
          <span className="label-editorial text-[#C4952A] tracking-[0.22em] block mb-5" style={{ fontSize: "10px" }}>
            SMART DISCOVERY
          </span>
          <h2
            className="font-serif font-light text-white leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(34px, 4.5vw, 58px)" }}
          >
            What kind of experience<br />
            <em style={{ fontStyle: "italic", color: "#DDB96A" }}>are you looking for?</em>
          </h2>
        </div>

        {/* Filters */}
        <div className="space-y-10 max-w-3xl mx-auto">
          {/* Mood */}
          <div>
            <p className="label-editorial text-[#7A776F] tracking-[0.2em] mb-4" style={{ fontSize: "9px" }}>
              MOOD
            </p>
            <div className="flex flex-wrap gap-2">
              {moods.map(m => (
                <ChipBtn key={m} label={m} selected={selectedMood === m} onSelect={() => setSelectedMood(prev => prev === m ? "" : m)} />
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div>
            <p className="label-editorial text-[#7A776F] tracking-[0.2em] mb-4" style={{ fontSize: "9px" }}>
              OCCASION
            </p>
            <div className="flex flex-wrap gap-2">
              {occasions.map(o => (
                <ChipBtn key={o} label={o} selected={selectedOccasion === o} onSelect={() => setSelectedOccasion(prev => prev === o ? "" : o)} />
              ))}
            </div>
          </div>

          {/* Genre */}
          <div>
            <p className="label-editorial text-[#7A776F] tracking-[0.2em] mb-4" style={{ fontSize: "9px" }}>
              GENRE / FORM
            </p>
            <div className="flex flex-wrap gap-2">
              {genres.map(g => (
                <ChipBtn key={g} label={g} selected={selectedGenre === g} onSelect={() => setSelectedGenre(prev => prev === g ? "" : g)} />
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <p className="label-editorial text-[#7A776F] tracking-[0.2em] mb-4" style={{ fontSize: "9px" }}>
              AUDIENCE SIZE
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map(s => (
                <ChipBtn key={s} label={s} selected={selectedSize === s} onSelect={() => setSelectedSize(prev => prev === s ? "" : s)} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="divider-ornate" />

          {/* CTA */}
          <div className="flex items-center justify-between">
            {hasSelection && (
              <button
                onClick={() => { setSelectedMood(""); setSelectedOccasion(""); setSelectedGenre(""); setSelectedSize(""); }}
                className="font-ui text-[13px] text-[#7A776F] hover:text-[#A8A49A] transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              onClick={handleDiscover}
              disabled={!hasSelection}
              className={`ml-auto font-ui font-semibold text-[14px] px-8 py-3.5 rounded-full transition-all duration-300 cursor-pointer tracking-wide ${
                hasSelection
                  ? "bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  : "bg-[#2E2C28] text-[#4A4845] cursor-not-allowed"
              }`}
            >
              {showResults ? "Discovering..." : "Discover Experiences →"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Featured Experiences ───────────────────────────────────────────────── */

function FeaturedExperiences({
  artists,
  featuredArtistIds,
  onSelectArtist,
  onBookArtist,
  onViewAll,
}: {
  artists: Artist[];
  featuredArtistIds: string[];
  onSelectArtist: (a: Artist) => void;
  onBookArtist: (a: Artist) => void;
  onViewAll: () => void;
}) {
  const featured = artists.filter(a => featuredArtistIds.includes(a.id)).slice(0, 6);
  const display = featured.length > 0 ? featured : artists.slice(0, 6);

  const MOOD_LABELS: Record<string, string[]> = {
    "sufi": ["Soulful", "Intimate"],
    "rock": ["Energetic", "Bold"],
    "gazal": ["Elegant", "Poetic"],
    "bollywood": ["Joyful", "Celebratory"],
    "carnival": ["Festive", "Playful"],
    "devotional": ["Spiritual", "Serene"],
  };

  const OCCASION_LABELS: Record<string, string[]> = {
    "sufi": ["Wedding", "Private Events"],
    "rock": ["Corporate", "Concerts"],
    "gazal": ["Cultural", "Private"],
    "bollywood": ["Celebrations", "Festivals"],
    "carnival": ["Festivals", "Brand Events"],
    "devotional": ["Cultural", "Community"],
  };

  return (
    <section id="featured-performers" className="py-24 lg:py-36" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 lg:mb-20">
          <div className="max-w-xl">
            <span className="label-editorial text-[#C4952A] tracking-[0.22em] block mb-4" style={{ fontSize: "10px" }}>
              CURATED EXPERIENCES
            </span>
            <h2
              className="font-serif font-light text-[#1A1916] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)" }}
            >
              Curated experiences for<br />
              <em style={{ fontStyle: "italic" }}>your next moment</em>
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="hidden md:flex items-center gap-2 font-ui text-[13px] font-medium text-[#4A4845] hover:text-[#1A1916] transition-colors group cursor-pointer"
          >
            View all artists
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Editorial masonry-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {display.map((artist, idx) => {
            const isFeature = idx === 0;
            const moods = MOOD_LABELS[artist.genre] || ["Artistic", "Live"];
            const occasions = OCCASION_LABELS[artist.genre] || ["Events"];

            return (
              <div
                key={artist.id}
                className={`group cursor-pointer ${isFeature ? "md:col-span-2 lg:col-span-1" : ""}`}
                onClick={() => onSelectArtist(artist)}
              >
                {/* Image container */}
                <div
                  className="relative overflow-hidden rounded-xl mb-5 img-zoom"
                  style={{ height: isFeature ? "440px" : "300px", background: "#EDE8DF" }}
                >
                  <img
                    src={artist.img || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=800&fit=crop&auto=format&q=75"}
                    alt={artist.stageName || artist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  {/* Book button — appears on hover */}
                  <button
                    onClick={e => { e.stopPropagation(); onBookArtist(artist); }}
                    className="absolute bottom-4 right-4 font-ui text-[11px] font-semibold bg-[#C4952A] text-[#1A1916] px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer shadow-lg"
                  >
                    Plan Event
                  </button>
                  {/* Top genre badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C4952A]" />
                    <span className="label-editorial text-[#1A1916] capitalize" style={{ fontSize: "8px" }}>{artist.genre}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2.5">
                  {/* Mood tags */}
                  <div className="flex items-center gap-2">
                    {moods.map(tag => (
                      <span key={tag} className="label-editorial text-[#C4952A] border border-[#C4952A]/30 px-2.5 py-1 rounded-full" style={{ fontSize: "8px" }}>
                        {tag}
                      </span>
                    ))}
                    {occasions.slice(0, 1).map(tag => (
                      <span key={tag} className="label-editorial text-[#7A776F] border border-[#C4952A]/20 px-2.5 py-1 rounded-full" style={{ fontSize: "8px" }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Name */}
                  <h3
                    className="font-serif font-light text-[#1A1916] group-hover:text-[#C4952A] transition-colors leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px, 2vw, 26px)" }}
                  >
                    {artist.stageName || artist.name}
                  </h3>

                  {/* Genre + location */}
                  <p className="font-ui text-[#7A776F] text-[13px] flex items-center gap-2">
                    <span className="capitalize">{artist.genre}</span>
                    <span className="text-[#C4952A]/50">·</span>
                    <span>{artist.city}</span>
                  </p>

                  {/* Price */}
                  <p className="font-ui text-[12px] font-medium text-[#4A4845]">
                    From {artist.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={onViewAll}
            className="font-ui font-medium text-[14px] text-[#1A1916] border border-[#1A1916] hover:bg-[#1A1916] hover:text-[#FAF7F2] px-8 py-3.5 rounded-full transition-all duration-300 cursor-pointer tracking-wide"
          >
            Explore All Artists & Experiences
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Genre Exploration ──────────────────────────────────────────────────── */

function GenreExploration({ onSelectGenre }: { onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void }) {
  const genres = [
    { key: "sufi" as const, label: "Sufi & Qawwali", desc: "Soul-stirring mystical devotion", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=75" },
    { key: "rock" as const, label: "Indie & Rock", desc: "Raw, electric and anthemic", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=75" },
    { key: "gazal" as const, label: "Ghazal & Classical", desc: "Poetic elegance in every note", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop&q=75" },
    { key: "bollywood" as const, label: "Bollywood & Dance", desc: "Vibrant, cinematic celebration", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop&q=75" },
    { key: "carnival" as const, label: "Theatre & Carnival", desc: "Spectacle, drama and wonder", img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop&q=75" },
    { key: "devotional" as const, label: "Devotional & Folk", desc: "Ancient roots, living traditions", img: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&h=400&fit=crop&q=75" },
  ];

  return (
    <section className="py-24 lg:py-36" style={{ background: "#F5F0E8" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-14 lg:mb-20">
          <div>
            <span className="label-editorial text-[#6B7B4A] tracking-[0.22em] block mb-4" style={{ fontSize: "10px" }}>
              EXPLORE GENRES
            </span>
            <h2
              className="font-serif font-light text-[#1A1916] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)" }}
            >
              Explore the world<br /><em style={{ fontStyle: "italic" }}>of performance</em>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {genres.map(g => (
            <button
              key={g.key}
              onClick={() => onSelectGenre(g.key)}
              className="group relative overflow-hidden rounded-xl cursor-pointer text-left lift-card"
              style={{ height: "240px" }}
            >
              <img
                src={g.img}
                alt={g.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h3
                  className="font-serif font-light text-white text-[20px] mb-1 leading-tight transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {g.label}
                </h3>
                <p className="font-ui text-white/65 text-[12px] transition-all duration-300" style={{ opacity: 0 }}>
                  {g.desc}
                </p>
                <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="label-editorial text-[#DDB96A]" style={{ fontSize: "8px" }}>EXPLORE</span>
                  <svg className="w-3 h-3 text-[#DDB96A] group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

/* ── Surprise Me ────────────────────────────────────────────────────────── */

function SurpriseMe({ onSelectGenre }: { onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void }) {
  const [clicked, setClicked] = useState(false);
  const genres: ("sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional")[] = ["sufi", "rock", "gazal", "bollywood", "carnival", "devotional"];

  const handleSurprise = () => {
    setClicked(true);
    const random = genres[Math.floor(Math.random() * genres.length)];
    setTimeout(() => {
      onSelectGenre(random);
      setClicked(false);
    }, 800);
  };

  return (
    <section
      className="relative py-28 lg:py-40 overflow-hidden"
      style={{ background: "#2E2C28" }}
    >
      {/* Background art texture */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1400&h=800&fit=crop&q=60"
          alt=""
          className="w-full h-full object-cover"
          aria-hidden
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <span className="label-editorial text-[#DDB96A]/70 tracking-[0.28em] block mb-6" style={{ fontSize: "10px" }}>
          SURPRISE ME
        </span>
        <h2
          className="font-serif font-light text-white leading-tight mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          Not sure what you're<br />
          <em style={{ fontStyle: "italic", color: "#DDB96A" }}>looking for?</em>
        </h2>
        <p className="font-ui text-[#A8A49A] text-[15px] leading-relaxed mb-10">
          Let Mannat Arts surprise you with something unexpected.<br />
          Art has a way of knowing what you need.
        </p>
        <button
          onClick={handleSurprise}
          disabled={clicked}
          className={`font-ui font-semibold text-[15px] bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-10 py-4 rounded-full transition-all duration-400 cursor-pointer tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1 ${clicked ? "opacity-70 scale-95" : ""}`}
        >
          {clicked ? "Finding something special..." : "Discover something unexpected"}
        </button>
      </div>
    </section>
  );
}

/* ── How It Works ───────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Tell us what you need.",
      desc: "Start with your mood, occasion or purpose. No categories to browse. Just how you want to feel.",
    },
    {
      num: "02",
      title: "Discover experiences curated for you.",
      desc: "We surface artists, genres and performances that match your vision — from intimate baithaks to stadium concerts.",
    },
    {
      num: "03",
      title: "Connect and make it happen.",
      desc: "Reach directly to the right artists and ensembles. Transparent pricing, flexible riders, and dedicated support.",
    },
  ];

  return (
    <section className="py-24 lg:py-36" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-14 lg:mb-20 max-w-lg">
          <span className="label-editorial text-[#C4952A] tracking-[0.22em] block mb-4" style={{ fontSize: "10px" }}>
            HOW IT WORKS
          </span>
          <h2
            className="font-serif font-light text-[#1A1916] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            Three steps to<br /><em style={{ fontStyle: "italic" }}>the perfect experience</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map(step => (
            <div key={step.num} className="relative">
              {/* Step number */}
              <div className="mb-6">
                <span
                  className="font-serif text-[80px] leading-none text-[#EDE8DF] select-none"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
                >
                  {step.num}
                </span>
              </div>
              <div className="divider-ornate mb-6" />
              <h3
                className="font-serif font-light text-[#1A1916] text-[22px] mb-3 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {step.title}
              </h3>
              <p className="font-ui text-[#7A776F] text-[14px] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ───────────────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    quote: "We didn't know we wanted a Sufi ensemble for our corporate gala until Mannat helped us discover one. It was the most memorable part of the evening.",
    name: "Priya Mehta",
    role: "Head of Events, TechSphere India",
    type: "Corporate Gala",
  },
  {
    quote: "Our wedding felt like a cultural poem. Every performance — the ghazal baithak at dusk, the Bollywood troupe at midnight — was perfectly curated.",
    name: "Arjun & Nayantara Kapoor",
    role: "Wedding, Udaipur Palace",
    type: "Luxury Wedding",
  },
  {
    quote: "As a festival director, I need artists who can move an audience. Mannat Arts connected me with folk performers who literally made the crowd weep with joy.",
    name: "Devika Rao",
    role: "Festival Director, Jaipur Folk Mela",
    type: "Cultural Festival",
  },
];

function Testimonials() {
  return (
    <section className="py-24 lg:py-36" style={{ background: "#F5F0E8" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-14 lg:mb-20 text-center">
          <span className="label-editorial text-[#C4952A] tracking-[0.22em] block mb-4" style={{ fontSize: "10px" }}>
            STORIES
          </span>
          <h2
            className="font-serif font-light text-[#1A1916] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            Loved by people who create<br />
            <em style={{ fontStyle: "italic" }}>unforgettable moments</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-[#FAF7F2] rounded-xl p-8 space-y-5 lift-card border border-[#EDE8DF]">
              {/* Opening quote mark */}
              <div
                className="font-serif text-[#DDB96A] text-[60px] leading-none -mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                "
              </div>
              <p className="font-ui text-[#4A4845] text-[14px] leading-relaxed italic">
                {t.quote}
              </p>
              <div className="pt-4 border-t border-[#EDE8DF]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#C4952A] text-[16px] font-serif border border-[#C4952A]/30"
                    style={{ fontFamily: "'Cormorant Garamond', serif", background: "#FFF8F0" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-ui font-semibold text-[13px] text-[#1A1916]">{t.name}</p>
                    <p className="font-ui text-[11px] text-[#7A776F]">{t.role}</p>
                  </div>
                </div>
                <span className="inline-block mt-3 label-editorial text-[#C4952A] border border-[#C4952A]/30 px-2.5 py-1 rounded-full" style={{ fontSize: "8px" }}>
                  {t.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ──────────────────────────────────────────────────────────── */

function FinalCTA({ onPlanEvent, onExplore }: { onPlanEvent: () => void; onExplore: () => void }) {
  return (
    <section className="relative py-28 lg:py-44 overflow-hidden">
      {/* Full-bleed art image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1920&h=900&fit=crop&auto=format&q=80"
          alt="Cultural performance"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(26,25,22,0.96) 0%, rgba(26,25,22,0.82) 50%, rgba(26,25,22,0.6) 100%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="label-editorial text-[#DDB96A]/70 tracking-[0.22em] block mb-6" style={{ fontSize: "10px" }}>
            YOUR NEXT MOMENT AWAITS
          </span>
          <h2
            className="font-serif font-light text-white leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 5.5vw, 72px)" }}
          >
            You bring the occasion.<br />
            <em style={{ fontStyle: "italic", color: "#DDB96A" }}>We'll find the experience.</em>
          </h2>
          <p className="font-ui text-[#A8A49A] text-[15px] leading-relaxed mb-10">
            Whether you know exactly what you want or you're starting with a feeling,<br />
            Mannat Arts guides you to an experience that creates a memory.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onPlanEvent}
              className="font-ui font-semibold text-[14px] bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-8 py-4 rounded-full transition-all duration-300 cursor-pointer tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Plan Your Event
            </button>
            <button
              onClick={onExplore}
              className="font-ui font-medium text-[14px] text-white border border-white/30 hover:border-[#DDB96A] hover:text-[#DDB96A] px-8 py-4 rounded-full transition-all duration-300 cursor-pointer tracking-wide"
            >
              Explore Experiences
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────── */

interface FooterProps {
  onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
  onBrowseArtists: () => void;
  onScrollToBlog: () => void;
  onSelectArticle: (a: BlogArticle) => void;
  articles: BlogArticle[];
}

function Footer({ onSelectGenre, onBrowseArtists, onScrollToBlog }: FooterProps) {
  return (
    <footer style={{ background: "#1A1916", color: "#7A776F" }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span
                className="font-serif font-light text-white block tracking-[0.08em] text-xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                MANNAT ARTS
              </span>
              <span className="label-editorial text-[#C4952A]" style={{ fontSize: "7px", letterSpacing: "0.2em" }}>
                CULTURAL EXPERIENCES
              </span>
            </div>
            <p className="font-ui text-[13px] text-[#4A4845] leading-relaxed">
              Discover experiences that make moments memorable.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h6 className="label-editorial text-[#A8A49A] mb-5" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>
              EXPLORE
            </h6>
            <div className="space-y-3">
              {["Experiences", "Genres", "Artists", "Occasions"].map(l => (
                <button
                  key={l}
                  onClick={l === "Artists" ? onBrowseArtists : onScrollToBlog}
                  className="block font-ui text-[13px] text-[#4A4845] hover:text-[#C4952A] transition-colors cursor-pointer"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* For Organisers */}
          <div>
            <h6 className="label-editorial text-[#A8A49A] mb-5" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>
              FOR ORGANISERS
            </h6>
            <div className="space-y-3">
              {["Plan an Event", "Find Artists", "Request a Performance", "Browse by Occasion"].map(l => (
                <button
                  key={l}
                  onClick={onBrowseArtists}
                  className="block font-ui text-[13px] text-[#4A4845] hover:text-[#C4952A] transition-colors cursor-pointer"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h6 className="label-editorial text-[#A8A49A] mb-5" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>
              COMPANY
            </h6>
            <div className="space-y-3">
              {["About Mannat Arts", "Stories & Editorial", "Contact", "For Artists"].map(l => (
                <button
                  key={l}
                  onClick={onScrollToBlog}
                  className="block font-ui text-[13px] text-[#4A4845] hover:text-[#C4952A] transition-colors cursor-pointer"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-ui text-[12px] text-[#4A4845]">
            © 2026 Mannat Arts. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Genres", "Sufi", "Rock", "Ghazal", "Bollywood"].map((g, i) => (
              <button
                key={g}
                onClick={() => i > 0 && onSelectGenre(["sufi", "rock", "gazal", "bollywood", "carnival"][i - 1] as any)}
                className="font-ui text-[11px] text-[#4A4845] hover:text-[#C4952A] transition-colors cursor-pointer"
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT APP COMPONENT
══════════════════════════════════════════════════════════════════ */

export default function App() {
  type Page = "home" | "genres" | "genre" | "artists" | "journal" | "blog-detail" | "admin" | "admin-login";
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [activeGenre, setActiveGenre] = useState<"sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional">("sufi");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [bookingArtist, setBookingArtist] = useState<Artist | null>(null);
  const [selectedBlogArticle, setSelectedBlogArticle] = useState<BlogArticle | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [articleLikes, setArticleLikes] = useState<Record<string, number>>({});
  const moodRef = useRef<HTMLElement | null>(null);

  // View mode: "discovery" = new editorial homepage, "classic" = original homepage
  const [viewMode, setViewMode] = useState<"discovery" | "classic">("discovery");

  // Stateful, Persistent Artist Directory (with LocalStorage fallback)
  const [artistsList, setArtistsList] = useState<Artist[]>(() => {
    try {
      const saved = localStorage.getItem("stagebridge_artists");
      return saved ? JSON.parse(saved) : ALL_ARTISTS;
    } catch { return ALL_ARTISTS; }
  });

  // Stateful, Persistent Blog Articles
  const [articlesList, setArticlesList] = useState<BlogArticle[]>(() => {
    try {
      const saved = localStorage.getItem("stagebridge_blogs");
      return saved ? JSON.parse(saved) : BLOG_ARTICLES;
    } catch { return BLOG_ARTICLES; }
  });

  // Stateful Booking Inquiries
  const [inquiriesList, setInquiriesList] = useState<BookingInquiry[]>(() => {
    try {
      const saved = localStorage.getItem("stagebridge_inquiries");
      return saved ? JSON.parse(saved) : INITIAL_BOOKING_INQUIRIES;
    } catch { return INITIAL_BOOKING_INQUIRIES; }
  });

  // Stateful Featured Artist IDs
  const [featuredArtistIds, setFeaturedArtistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("stagebridge_featured_ids");
      return saved ? JSON.parse(saved) : artistsList.slice(0, 6).map(a => a.id);
    } catch { return artistsList.slice(0, 6).map(a => a.id); }
  });

  // Stateful Genres Map
  const [genresMap, setGenresMap] = useState<Record<string, GenreInfo>>(() => {
    try {
      const saved = localStorage.getItem("stagebridge_genres");
      return saved ? { ...GENRE_METADATA, ...JSON.parse(saved) } : GENRE_METADATA;
    } catch { return GENRE_METADATA; }
  });

  const handleUpdateGenre = (genreId: string, updated: Partial<GenreInfo>) => {
    setGenresMap(prev => {
      const current = prev[genreId] || GENRE_METADATA[genreId];
      const updatedGenre = { ...current, ...updated };
      const nextMap = { ...prev, [genreId]: updatedGenre };
      try { localStorage.setItem("stagebridge_genres", JSON.stringify(nextMap)); } catch {}
      return nextMap;
    });
  };

  // Hash routing
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#admin" || hash === "#admin-login" || hash === "#login") {
        setCurrentPage(isAdminAuthenticated ? "admin" : "admin-login");
      } else if (hash === "" && (currentPage === "admin" || currentPage === "admin-login")) {
        setCurrentPage("home");
      }
    };
    window.addEventListener("hashchange", handleHashRouting);
    handleHashRouting();
    return () => window.removeEventListener("hashchange", handleHashRouting);
  }, [isAdminAuthenticated, currentPage]);

  // Artists CRUD
  const handleAddArtist = (a: Artist) => {
    const updated = [...artistsList, a];
    setArtistsList(updated);
    try { localStorage.setItem("stagebridge_artists", JSON.stringify(updated)); } catch {}
  };
  const handleUpdateArtist = (a: Artist) => {
    const updated = artistsList.map(x => x.id === a.id ? a : x);
    setArtistsList(updated);
    try { localStorage.setItem("stagebridge_artists", JSON.stringify(updated)); } catch {}
  };
  const handleDeleteArtist = (id: string) => {
    const updated = artistsList.filter(x => x.id !== id);
    setArtistsList(updated);
    try { localStorage.setItem("stagebridge_artists", JSON.stringify(updated)); } catch {}
  };

  // Articles CRUD
  const handleAddArticle = (a: BlogArticle) => {
    const updated = [...articlesList, a];
    setArticlesList(updated);
    try { localStorage.setItem("stagebridge_blogs", JSON.stringify(updated)); } catch {}
  };
  const handleUpdateArticle = (a: BlogArticle) => {
    const updated = articlesList.map(x => x.id === a.id ? a : x);
    setArticlesList(updated);
    try { localStorage.setItem("stagebridge_blogs", JSON.stringify(updated)); } catch {}
  };
  const handleDeleteArticle = (id: string) => {
    const updated = articlesList.filter(x => x.id !== id);
    setArticlesList(updated);
    try { localStorage.setItem("stagebridge_blogs", JSON.stringify(updated)); } catch {}
  };

  const handleSetFeaturedArtistIds = (ids: string[]) => {
    setFeaturedArtistIds(ids);
    try { localStorage.setItem("stagebridge_featured_ids", JSON.stringify(ids)); } catch {}
  };

  const handleUpdateInquiryStatus = (id: string, status: BookingInquiry["status"]) => {
    const updated = inquiriesList.map(x => x.id === id ? { ...x, status } : x);
    setInquiriesList(updated);
    try { localStorage.setItem("stagebridge_inquiries", JSON.stringify(updated)); } catch {}
  };

  const handleResetToDefaults = () => {
    setArtistsList(ALL_ARTISTS);
    setArticlesList(BLOG_ARTICLES);
    setInquiriesList(INITIAL_BOOKING_INQUIRIES);
    setFeaturedArtistIds(ALL_ARTISTS.slice(0, 6).map(a => a.id));
    setGenresMap(GENRE_METADATA);
    try {
      localStorage.removeItem("stagebridge_artists");
      localStorage.removeItem("stagebridge_blogs");
      localStorage.removeItem("stagebridge_inquiries");
      localStorage.removeItem("stagebridge_featured_ids");
      localStorage.removeItem("stagebridge_genres");
    } catch {}
  };

  const handleToggleArticleLike = (articleId: string) => {
    setArticleLikes(prev => {
      const base = prev[articleId] ?? 0;
      const initial = articlesList.find(a => a.id === articleId)?.initialLikes ?? 0;
      const isLiked = base > initial;
      return { ...prev, [articleId]: isLiked ? base - 1 : base + 1 };
    });
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setCurrentPage("admin");
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentPage("home");
    window.location.hash = "";
  };

  const handleSelectBlogArticle = (article: BlogArticle) => {
    setSelectedBlogArticle(article);
    setCurrentPage("blog-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenGenre = (genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => {
    setActiveGenre(genreId);
    setCurrentPage("genre");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenArtists = () => {
    setCurrentPage("artists");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenJournal = () => {
    setCurrentPage("journal");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToFeatured = () => {
    if (currentPage !== "home") {
      setCurrentPage("home");
      setTimeout(() => {
        document.getElementById("featured-performers")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("featured-performers")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToMood = () => {
    if (currentPage !== "home") {
      setCurrentPage("home");
      setTimeout(() => {
        document.getElementById("mood-discovery")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("mood-discovery")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBackHome = () => {
    window.location.hash = "";
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenGenresPage = () => {
    setCurrentPage("genres");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlanEvent = () => {
    handleOpenArtists();
  };

  const footerProps: FooterProps = {
    onSelectGenre: handleOpenGenre,
    onBrowseArtists: handleOpenArtists,
    onScrollToBlog: handleOpenJournal,
    onSelectArticle: handleSelectBlogArticle,
    articles: articlesList,
  };

  return (
    <div style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* Navbar on homepage only */}
      {currentPage === "home" && (
        <Navbar
          onHome={handleBackHome}
          onBrowseGenres={handleOpenGenresPage}
          onScrollToFeatured={handleScrollToFeatured}
          onBrowseArtists={handleOpenArtists}
          onScrollToBlog={handleOpenJournal}
          onPlanEvent={handlePlanEvent}
          onOpenAdmin={() => {
            setCurrentPage(isAdminAuthenticated ? "admin" : "admin-login");
            window.location.hash = "#admin";
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {currentPage === "admin-login" ? (
        <AdminLogin onLoginSuccess={handleLoginSuccess} onBackToSite={handleBackHome} />
      ) : currentPage === "admin" ? (
        <AdminPortal
          artists={artistsList}
          featuredArtistIds={featuredArtistIds}
          onSetFeaturedArtistIds={handleSetFeaturedArtistIds}
          onAddArtist={handleAddArtist}
          onUpdateArtist={handleUpdateArtist}
          onDeleteArtist={handleDeleteArtist}
          articles={articlesList}
          onAddArticle={handleAddArticle}
          onUpdateArticle={handleUpdateArticle}
          onDeleteArticle={handleDeleteArticle}
          bookingInquiries={inquiriesList}
          onUpdateInquiryStatus={handleUpdateInquiryStatus}
          onResetToDefaults={handleResetToDefaults}
          onExitToClient={handleBackHome}
          onLogout={handleLogout}
          onPreviewArtist={artist => setSelectedArtist(artist)}
          onPreviewArticle={handleSelectBlogArticle}
          genres={genresMap}
          onUpdateGenre={handleUpdateGenre}
        />
      ) : currentPage === "genres" ? (
        <>
          <GenresCatalogPage
            onSelectGenre={handleOpenGenre}
            onBackHome={handleBackHome}
            onBrowseArtists={handleOpenArtists}
            artists={artistsList}
          />
          <Footer {...footerProps} />
        </>
      ) : currentPage === "journal" ? (
        <>
          <JournalPage
            onSelectArticle={handleSelectBlogArticle}
            likes={articleLikes}
            onToggleLike={handleToggleArticleLike}
            onBackHome={handleBackHome}
            onSelectGenre={handleOpenGenre}
            articles={articlesList}
          />
          <Footer {...footerProps} />
        </>
      ) : currentPage === "artists" ? (
        <ArtistsPage
          onBackHome={handleBackHome}
          onSelectArtist={setSelectedArtist}
          onBookArtist={setBookingArtist}
          allArtists={artistsList}
        />
      ) : currentPage === "genre" ? (
        <>
          <GenreView
            genreId={activeGenre}
            onSelectGenre={handleOpenGenre}
            onBack={handleBackHome}
            onSelectArtist={setSelectedArtist}
            onBookArtist={setBookingArtist}
            allArtists={artistsList}
            genresMap={genresMap}
          />
          <Footer {...footerProps} />
        </>
      ) : currentPage === "blog-detail" && selectedBlogArticle ? (
        <>
          <BlogDetailPage
            article={selectedBlogArticle}
            onBack={handleBackHome}
            likes={articleLikes}
            onToggleLike={handleToggleArticleLike}
            onSelectArticle={handleSelectBlogArticle}
            onSelectGenre={handleOpenGenre}
            onBrowseArtists={handleOpenArtists}
            allArticles={articlesList}
          />
          <Footer {...footerProps} />
        </>
      ) : (
        /* ── HOMEPAGE — dual-view toggle ── */
        <>
          {viewMode === "discovery" ? (
            /* ── NEW: Editorial Discovery Homepage ── */
            <>
              <HeroSection
                onExplore={handleOpenGenresPage}
                onFindByMood={handleScrollToMood}
                onSelectGenre={handleOpenGenre}
              />
              <GenreTicker onSelectGenre={handleOpenGenre} />
              <MoodDiscovery id="mood-discovery" onSelectGenre={handleOpenGenre} />
              <OccasionDiscovery onSelectGenre={handleOpenGenre} />
              <SmartDiscovery onSelectGenre={handleOpenGenre} />
              <FeaturedExperiences
                artists={artistsList}
                featuredArtistIds={featuredArtistIds}
                onSelectArtist={setSelectedArtist}
                onBookArtist={setBookingArtist}
                onViewAll={handleOpenArtists}
              />
              <GenreExploration onSelectGenre={handleOpenGenre} />
              <SurpriseMe onSelectGenre={handleOpenGenre} />
              <HowItWorks />
              <Testimonials />
              <FinalCTA onPlanEvent={handlePlanEvent} onExplore={handleOpenGenresPage} />
              <Footer {...footerProps} />
            </>
          ) : (
            /* ── CLASSIC: Original Homepage ── */
            <>
              <ClassicHomePage
                artists={artistsList}
                featuredArtistIds={featuredArtistIds}
                onSelectArtist={setSelectedArtist}
                onBookArtist={setBookingArtist}
                onViewAllArtists={handleOpenArtists}
                onBrowseGenres={handleOpenGenresPage}
                onScrollToFeatured={handleScrollToFeatured}
                onSelectGenre={handleOpenGenre}
              />
              <Footer {...footerProps} />
            </>
          )}

          {/* ── View Toggle Pill (floating, bottom-center) ── */}
          <div
            className="fixed bottom-6 left-1/2 z-50 flex items-center rounded-full shadow-2xl border border-white/20 overflow-hidden"
            style={{
              transform: "translateX(-50%)",
              background: "rgba(26, 25, 22, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <button
              onClick={() => { setViewMode("discovery"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="font-ui font-semibold text-[12px] px-5 py-2.5 tracking-wide transition-all duration-300 cursor-pointer"
              style={{
                background: viewMode === "discovery" ? "#C4952A" : "transparent",
                color: viewMode === "discovery" ? "#1A1916" : "rgba(255,255,255,0.5)",
              }}
            >
              Discovery
            </button>
            <div className="w-px h-5 bg-white/10" />
            <button
              onClick={() => { setViewMode("classic"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="font-ui font-semibold text-[12px] px-5 py-2.5 tracking-wide transition-all duration-300 cursor-pointer"
              style={{
                background: viewMode === "classic" ? "#E11D48" : "transparent",
                color: viewMode === "classic" ? "white" : "rgba(255,255,255,0.5)",
              }}
            >
              Classic
            </button>
          </div>
        </>
      )}

      {/* Artist Detail Modal */}
      <ArtistDetailModal
        artist={selectedArtist}
        onClose={() => setSelectedArtist(null)}
        onBook={artist => setBookingArtist(artist)}
      />

      {/* Booking Modal */}
      <BookingModal
        artist={bookingArtist}
        onClose={() => setBookingArtist(null)}
      />
    </div>
  );
}
