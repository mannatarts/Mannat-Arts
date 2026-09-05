import { useState, useEffect, useRef, useMemo } from "react";
import { Artist, GenreInfo, ALL_ARTISTS, GENRE_METADATA } from "./data/artistsData";
import { BlogArticle, BLOG_ARTICLES } from "./data/blogData";
import { GenreView } from "./components/GenreView";
import { GenresCatalogPage } from "./components/GenresCatalogPage";
import { ArtistsPage } from "./components/ArtistsPage";
import { ArtistDetailModal } from "./components/ArtistDetailModal";
import { BookingModal } from "./components/BookingModal";
import { JournalPage } from "./components/JournalPage";
import { BlogDetailPage } from "./components/BlogDetailPage";
import { AdminPortal } from "./components/admin/AdminPortal";
import { AdminLogin } from "./components/admin/AdminLogin";
import { ArtistRegisterPage } from "./components/artist/ArtistRegisterPage";
import { ArtistApplicationStatusPage } from "./components/artist/ArtistApplicationStatusPage";
import { ArtistDashboard } from "./components/artist/ArtistDashboard";
import { ArtistAuthModal } from "./components/artist/ArtistAuthModal";
import { ClientAuthModal } from "./components/client/ClientAuthModal";
import { ClientDashboard } from "./components/client/ClientDashboard";
import { ClientEnquiryModal } from "./components/client/ClientEnquiryModal";
import { AuthService } from "./services/authService";
import { PlatformStore } from "./services/platformStore";
import { User, ArtistApplicationProfile } from "./types/platform";
import { loadCMSStore, saveCMSStore, resetCMSStore } from "./data/cmsData";
import {
  CMSDataStore,
  Experience,
  MoodItem,
  OccasionItem,
  TestimonialItem,
  MediaItem,
  NavLinkItem,
  FooterConfig,
  GlobalSEOConfig,
  GeneralSettingsConfig,
  HomepageConfig,
  HeroConfig,
  FinalCtaConfig,
  BookingInquiry,
} from "./data/cmsTypes";


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
  onPlanEvent: () => void;
  /** Opens artist registration / artist dashboard */
  onOpenArtistPortal: () => void;
  /** Opens client login / client dashboard */
  onOpenClientPortal: () => void;
  onOpenDashboard: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
  navLinks?: NavLinkItem[];
  siteName?: string;
  logoSubtitle?: string;
  /** Hidden admin route — not shown in UI */
  onOpenAdmin?: () => void;
}

function Navbar({
  onHome,
  onBrowseGenres,
  onScrollToFeatured,
  onBrowseArtists,
  onScrollToBlog,
  onPlanEvent,
  onOpenArtistPortal,
  onOpenClientPortal,
  onOpenDashboard,
  currentUser,
  onLogout,
  navLinks,
  siteName = "MANNAT ARTS",
  logoSubtitle = "CULTURAL EXPERIENCES",
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = "font-ui text-[13px] font-medium text-[#4A4845] hover:text-[#1A1916] transition-colors duration-200 cursor-pointer tracking-wide";

  const resolveTargetAction = (target: string) => {
    switch (target) {
      case "experiences":
      case "genres":
        return onBrowseGenres;
      case "artists":
        return onBrowseArtists;
      case "occasions":
        return onScrollToFeatured;
      case "stories":
        return onScrollToBlog;
      case "about":
      case "home":
      default:
        return onHome;
    }
  };

  const dynamicLinks = navLinks && navLinks.length > 0 ? navLinks.filter(l => l.isVisible) : null;

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
          className="flex flex-col leading-none cursor-pointer group select-none text-left"
          aria-label="Mannat Arts Home"
        >
          <span
            className="font-serif text-[22px] font-light tracking-[0.06em] text-[#1A1916] group-hover:text-[#C4952A] transition-colors duration-300 uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.08em" }}
          >
            {siteName}
          </span>
          <span className="label-editorial text-[#C4952A] tracking-[0.22em] uppercase" style={{ fontSize: "7px" }}>
            {logoSubtitle}
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          {dynamicLinks ? (
            dynamicLinks.map(l => (
              <button
                key={l.id}
                onClick={resolveTargetAction(l.target)}
                className={navLinkClass}
              >
                {l.label}
              </button>
            ))
          ) : (
            <>
              <button onClick={onBrowseGenres} className={navLinkClass}>Experiences</button>
              <button onClick={onBrowseGenres} className={navLinkClass}>Genres</button>
              <button onClick={onBrowseArtists} className={navLinkClass}>Artists</button>
              <button onClick={onScrollToFeatured} className={navLinkClass}>Occasions</button>
              <button onClick={onScrollToBlog} className={navLinkClass}>Stories</button>
              <button onClick={onHome} className={navLinkClass}>About</button>
            </>
          )}
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

          {/* Join as Artist */}
          <button
            onClick={onOpenArtistPortal}
            className="font-ui text-[12px] font-semibold text-[#8C6B1F] hover:text-[#1A1916] px-3.5 py-1.5 rounded-full border border-[#DDB96A]/50 hover:border-[#C4952A] transition-all cursor-pointer tracking-wide"
          >
            {currentUser?.role === "artist" ? "Artist Desk" : "Join as Artist"}
          </button>

          {/* Sign In or Profile Icon */}
          {!currentUser ? (
            <button
              onClick={onOpenClientPortal}
              className="font-ui text-[12px] font-medium text-[#4A4845] hover:text-[#1A1916] px-3 py-1.5 rounded-full transition-colors cursor-pointer tracking-wide"
            >
              Sign In
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-[#1A1916] text-[#FAF7F2] hover:bg-[#C4952A] transition-all flex items-center justify-center font-serif text-sm font-bold border border-[#EDE8DF] cursor-pointer shadow-xs"
                aria-label="User Profile"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#EDE8DF] shadow-xl py-2 z-50 animate-fade-in text-left">
                  <div className="px-4 py-3 border-b border-[#EDE8DF]">
                    <p className="text-xs font-bold text-[#1A1916] truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[#7A776F] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-stone-100 text-[9px] font-bold uppercase tracking-wider text-stone-700">
                      {currentUser.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenDashboard();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#1A1916] hover:bg-[#FAF7F2] font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <span>{currentUser.role === "artist" ? "🎨" : "✉"}</span>
                      <span>{currentUser.role === "artist" ? "Artist Dashboard" : "My Enquiries"}</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[#EDE8DF]">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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
        <div className="md:hidden bg-[#FAF7F2] border-t border-[#EDE8DF] px-6 py-6 space-y-3">
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
              className="block w-full text-left font-ui text-[14px] font-medium text-[#2E2C28] py-1 border-b border-[#EDE8DF] pb-2.5"
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 space-y-2">
            <button
              onClick={() => { onOpenArtistPortal(); setOpen(false); }}
              className="w-full font-ui text-xs font-semibold py-2.5 px-4 rounded-xl border border-[#DDB96A] text-[#8C6B1F] bg-[#FAF7F2] text-center"
            >
              {currentUser?.role === "artist" ? "Artist Desk" : "Join as Artist"}
            </button>

            {!currentUser ? (
              <button
                onClick={() => { onOpenClientPortal(); setOpen(false); }}
                className="w-full font-ui text-xs font-semibold py-2.5 px-4 rounded-xl border border-[#EDE8DF] text-stone-800 bg-white text-center"
              >
                Sign In
              </button>
            ) : (
              <div className="p-3 bg-white rounded-xl border border-[#EDE8DF] space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1A1916] text-[#FAF7F2] flex items-center justify-center text-xs font-bold font-serif">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1A1916] truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-[#7A776F] truncate">{currentUser.email}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#EDE8DF] flex items-center justify-between">
                  <button
                    onClick={() => { onOpenDashboard(); setOpen(false); }}
                    className="text-xs font-semibold text-[#C4952A]"
                  >
                    {currentUser.role === "artist" ? "Artist Dashboard →" : "My Enquiries →"}
                  </button>
                  <button
                    onClick={() => { onLogout?.(); setOpen(false); }}
                    className="text-xs text-red-600 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => { onPlanEvent(); setOpen(false); }}
            className="w-full font-ui font-semibold text-xs bg-[#1A1916] text-[#FAF7F2] py-3 rounded-full mt-2"
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
  heroConfig,
  onExplore,
  onFindByMood,
  onSelectGenre,
}: {
  heroConfig?: HeroConfig;
  onExplore: () => void;
  onFindByMood: () => void;
  onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
}) {
  const bg = heroConfig?.bgImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&h=1080&fit=crop&auto=format&q=85";
  const eyebrow = (heroConfig?.eyebrow && heroConfig.eyebrow.trim() !== "xyz") ? heroConfig.eyebrow : "· CULTURAL EXPERIENCE DISCOVERY ·";
  const headline = heroConfig?.headline || "Find the art that";
  const headlineItalic = heroConfig?.headlineItalic || "fits the moment.";
  const description = heroConfig?.description || "Discover performances, artists and experiences curated around your mood, occasion and purpose.";
  const primaryCta = heroConfig?.primaryCtaLabel || "Explore Experiences";
  const secondaryCta = heroConfig?.secondaryCtaLabel || "Find by Mood ↓";
  const overlayOpacity = heroConfig?.overlayOpacity ?? 0.72;

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden" style={{ paddingTop: "68px" }}>
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bg}
          alt="Live performance"
          className="w-full h-full object-cover"
        />
        {/* Cinematic overlay — dark from bottom, subtle at top */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(26,25,22,${overlayOpacity * 1.3 > 0.98 ? 0.98 : overlayOpacity * 1.3}) 0%, rgba(26,25,22,${overlayOpacity}) 35%, rgba(26,25,22,${overlayOpacity * 0.45}) 65%, rgba(26,25,22,0.12) 100%)`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20 lg:pb-28 w-full">
        {/* Eyebrow */}
        <div className="mb-6">
          <span className="label-editorial text-[#DDB96A] tracking-[0.28em]" style={{ fontSize: "10px" }}>
            {eyebrow}
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="font-serif text-white font-light leading-[1.08] tracking-[-0.01em] mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          {headline}<br />
          <em style={{ fontStyle: "italic", color: "#DDB96A" }}>{headlineItalic}</em>
        </h1>

        {/* Supporting copy */}
        <p
          className="font-ui text-[#A8A49A] font-light leading-relaxed mb-10 max-w-xl"
          style={{ fontSize: "clamp(15px, 1.6vw, 18px)" }}
        >
          {description}
        </p>

        {/* CTA Row */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={onExplore}
            className="font-ui font-semibold text-[14px] bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-7 py-3.5 rounded-full transition-all duration-300 cursor-pointer tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {primaryCta}
          </button>
          <button
            onClick={onFindByMood}
            className="font-ui font-medium text-[14px] text-white border border-white/30 hover:border-[#DDB96A] hover:text-[#DDB96A] px-7 py-3.5 rounded-full transition-all duration-300 cursor-pointer tracking-wide"
          >
            {secondaryCta}
          </button>
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

function MoodDiscovery({
  id,
  moods,
  onSelectGenre,
}: {
  id?: string;
  moods?: MoodItem[];
  onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const displayMoods = moods && moods.length > 0 ? moods : MOODS;

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
          {displayMoods.map((mood, idx) => {
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

function OccasionDiscovery({
  occasions,
  onSelectGenre,
}: {
  occasions?: OccasionItem[];
  onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
}) {
  const displayOccasions = occasions && occasions.length > 0 ? occasions : OCCASIONS;

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
          {displayOccasions.map(occ => (
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

function Testimonials({ testimonials }: { testimonials?: TestimonialItem[] }) {
  const display = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;

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
          {display.map((t, i) => (
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

function FinalCTA({
  finalCtaConfig,
  onPlanEvent,
  onExplore,
}: {
  finalCtaConfig?: FinalCtaConfig;
  onPlanEvent: () => void;
  onExplore: () => void;
}) {
  const eyebrow = finalCtaConfig?.eyebrow || "YOUR NEXT MOMENT AWAITS";
  const headline = finalCtaConfig?.headline || "You bring the occasion.";
  const italic = finalCtaConfig?.headlineItalic || "We'll find the experience.";
  const desc = finalCtaConfig?.description || "Whether you know exactly what you want or you're starting with a feeling, Mannat Arts guides you to an experience that creates a memory.";
  const primary = finalCtaConfig?.primaryCtaLabel || "Plan Your Event";
  const secondary = finalCtaConfig?.secondaryCtaLabel || "Explore Experiences";

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
            {eyebrow}
          </span>
          <h2
            className="font-serif text-white leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 5.5vw, 72px)" }}
          >
            {headline}<br />
            <em style={{ fontStyle: "italic", color: "#DDB96A" }}>{italic}</em>
          </h2>
          <p className="font-ui text-[#A8A49A] text-[15px] leading-relaxed mb-10">
            {desc}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onPlanEvent}
              className="font-ui font-semibold text-[14px] bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-8 py-4 rounded-full transition-all duration-300 cursor-pointer tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              {primary}
            </button>
            <button
              onClick={onExplore}
              className="font-ui font-medium text-[14px] text-white border border-white/30 hover:border-[#DDB96A] hover:text-[#DDB96A] px-8 py-4 rounded-full transition-all duration-300 cursor-pointer tracking-wide"
            >
              {secondary}
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
  footerConfig?: FooterConfig;
}

function Footer({ onSelectGenre, onBrowseArtists, onScrollToBlog, footerConfig }: FooterProps) {
  const desc = footerConfig?.description || "Discover experiences that make moments memorable.";
  const copyright = footerConfig?.copyrightText || "© 2026 Mannat Arts. All rights reserved.";

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
            <p className="font-ui text-[13px] text-[#A8A49A] leading-relaxed">
              {desc}
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
                  className="block font-ui text-[13px] text-[#A8A49A] hover:text-[#C4952A] transition-colors cursor-pointer"
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
                  className="block font-ui text-[13px] text-[#A8A49A] hover:text-[#C4952A] transition-colors cursor-pointer"
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
                  className="block font-ui text-[13px] text-[#A8A49A] hover:text-[#C4952A] transition-colors cursor-pointer"
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
          <p className="font-ui text-[12px] text-[#7A776F]">
            {copyright}
          </p>
          <div className="flex items-center gap-5">
            {["Genres", "Sufi", "Rock", "Ghazal", "Bollywood"].map((g, i) => (
              <button
                key={g}
                onClick={() => i > 0 && onSelectGenre(["sufi", "rock", "gazal", "bollywood", "carnival"][i - 1] as any)}
                className="font-ui text-[11px] text-[#A8A49A] hover:text-[#C4952A] transition-colors cursor-pointer"
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
  type Page =
    | "home"
    | "genres"
    | "genre"
    | "artists"
    | "journal"
    | "blog-detail"
    | "admin"
    | "admin-login"
    | "artist-register"
    | "artist-status"
    | "artist-dashboard"
    | "client-dashboard";

  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [activeGenre, setActiveGenre] = useState<"sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional">("sufi");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [bookingArtist, setBookingArtist] = useState<Artist | null>(null);
  const [selectedBlogArticle, setSelectedBlogArticle] = useState<BlogArticle | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [articleLikes, setArticleLikes] = useState<Record<string, number>>({});
  const moodRef = useRef<HTMLElement | null>(null);

  // Platform Auth & Portal States
  const [currentUser, setCurrentUser] = useState<User | null>(() => AuthService.getCurrentUser());
  const [showArtistAuthModal, setShowArtistAuthModal] = useState(false);
  const [showClientAuthModal, setShowClientAuthModal] = useState(false);
  const [currentArtistProfile, setCurrentArtistProfile] = useState<ArtistApplicationProfile | null>(() => {
    const u = AuthService.getCurrentUser();
    return u ? PlatformStore.getArtistByUserId(u.id) || null : null;
  });



  // Unified, persistent CMS Data Store (backed by localStorage with rich seed defaults)
  const [cmsStore, setCmsStore] = useState<CMSDataStore>(() => loadCMSStore());

  useEffect(() => {
    saveCMSStore(cmsStore);
  }, [cmsStore]);

  // Refresh trigger: incremented whenever an artist is approved so the merged list re-computes
  const [artistRefreshTick, setArtistRefreshTick] = useState(0);

  // Helper: convert ArtistApplicationProfile → Artist shape for display pages
  const platformProfileToArtist = (p: ArtistApplicationProfile): Artist => ({
    id: p.id,
    name: p.name,
    stageName: p.stageName || p.name,
    genre: p.genre || "sufi",
    genreTitle: p.genreTitle || "Sufi & Mystic",
    tagline: p.shortBio || p.tagline || (p.bio ? p.bio.slice(0, 100) : "Master Performer"),
    bio: p.bio || p.shortBio || "Dedicated cultural performing artist.",
    img: p.img || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=800&fit=crop&auto=format&q=75",
    rating: p.rating ?? 5.0,
    reviewsCount: p.reviewsCount ?? 0,
    price: p.price || `₹${(p.priceNum || 50000).toLocaleString("en-IN")}`,
    priceNum: p.priceNum || 50000,
    city: p.city || "Delhi NCR",
    state: p.state || "Delhi",
    travelsPanIndia: p.travelsPanIndia ?? true,
    travelsInternational: p.travelsInternational ?? false,
    performanceDuration: p.performanceDuration || "90 - 120 minutes",
    bandType: p.bandType || "4-6 Piece Band",
    experienceYears: p.experienceYears || 5,
    eventsCompleted: p.eventsCompleted ?? 0,
    primaryInstruments: p.primaryInstruments && p.primaryInstruments.length > 0 ? p.primaryInstruments : ["Vocals", "Acoustic"],
    themeColor: "#b45309",
    whatElseTheyDo: [
      {
        category: "Performance Types",
        description: p.performanceTypes?.join(", ") || "Live Concerts & Events",
        icon: "🎭",
      },
    ],
    sampleSetlist: p.sampleSetlist || ["Signature Baithak Piece", "Encore Cultural Classic"],
    sampleTracks: [],
    techRider: p.techRider || ["Standard PA System", "Vocal & Instrument Mics"],
    reviews: [],
  });

  // Merge cmsStore artists with approved PlatformStore artists (deduplicated by id)
  const artistsList = useMemo(() => {
    const cmsIds = new Set(cmsStore.artists.map((a) => a.id));
    const platformApproved = PlatformStore.getApprovedArtists()
      .filter((p) => !cmsIds.has(p.id))
      .map(platformProfileToArtist);
    return [...cmsStore.artists, ...platformApproved];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmsStore.artists, artistRefreshTick]);

  // Called when admin approves an artist — syncs to cmsStore AND triggers re-compute
  const handleSyncArtistToCMS = (approvedProfile: any) => {
    try {
      const artistObj = platformProfileToArtist(approvedProfile);
      setCmsStore((prev) => {
        const exists = prev.artists.some((a) => a.id === artistObj.id);
        const nextArtists = exists
          ? prev.artists.map((a) => (a.id === artistObj.id ? { ...a, ...artistObj } : a))
          : [artistObj, ...prev.artists];
        return {
          ...prev,
          artists: nextArtists,
          activityLog: [
            {
              id: `act-${Date.now()}`,
              user: "Curation Desk",
              action: exists ? "Updated" : "Approved & Published",
              entity: "Artist",
              entityName: artistObj.name,
              timestamp: "Just now",
            },
            ...prev.activityLog,
          ],
        };
      });
    } catch (e) {
      console.error("Error syncing approved artist to CMS:", e);
    }
    setArtistRefreshTick((t) => t + 1);
  };

  const articlesList = cmsStore.articles;
  const genresMap = cmsStore.genres;

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
      return saved ? JSON.parse(saved) : cmsStore.artists.slice(0, 6).map(a => a.id);
    } catch { return cmsStore.artists.slice(0, 6).map(a => a.id); }
  });

  // CMS Handlers
  const handleUpdateHomepage = (homepage: HomepageConfig) => {
    setCmsStore(prev => ({ ...prev, homepage }));
  };

  const handleAddExperience = (exp: Experience) => {
    setCmsStore(prev => ({
      ...prev,
      experiences: [exp, ...prev.experiences],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: "Mannat Sharma",
          action: "Added",
          entity: "Experience",
          entityName: exp.name,
          timestamp: "Just now",
        },
        ...prev.activityLog,
      ],
    }));
  };

  const handleUpdateExperience = (exp: Experience) => {
    setCmsStore(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === exp.id ? exp : e),
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: "Mannat Sharma",
          action: "Updated",
          entity: "Experience",
          entityName: exp.name,
          timestamp: "Just now",
        },
        ...prev.activityLog,
      ],
    }));
  };

  const handleDeleteExperience = (id: string) => {
    const target = cmsStore.experiences.find(e => e.id === id);
    setCmsStore(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id),
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: "Mannat Sharma",
          action: "Deleted",
          entity: "Experience",
          entityName: target?.name || id,
          timestamp: "Just now",
        },
        ...prev.activityLog,
      ],
    }));
  };

  const handleAddArtist = (a: Artist) => {
    setCmsStore(prev => ({
      ...prev,
      artists: [...prev.artists, a],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: "Mannat Sharma",
          action: "Added",
          entity: "Artist",
          entityName: a.name,
          timestamp: "Just now",
        },
        ...prev.activityLog,
      ],
    }));
  };

  const handleUpdateArtist = (a: Artist) => {
    setCmsStore(prev => ({
      ...prev,
      artists: prev.artists.map(x => x.id === a.id ? a : x),
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: "Mannat Sharma",
          action: "Updated",
          entity: "Artist",
          entityName: a.name,
          timestamp: "Just now",
        },
        ...prev.activityLog,
      ],
    }));
  };

  const handleDeleteArtist = (id: string) => {
    const target = cmsStore.artists.find(a => a.id === id);
    setCmsStore(prev => ({
      ...prev,
      artists: prev.artists.filter(x => x.id !== id),
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: "Mannat Sharma",
          action: "Deleted",
          entity: "Artist",
          entityName: target?.name || id,
          timestamp: "Just now",
        },
        ...prev.activityLog,
      ],
    }));
  };

  const handleAddArticle = (a: BlogArticle) => {
    setCmsStore(prev => ({
      ...prev,
      articles: [a, ...prev.articles],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: "Rahul Verma",
          action: "Published",
          entity: "Story",
          entityName: a.title,
          timestamp: "Just now",
        },
        ...prev.activityLog,
      ],
    }));
  };

  const handleUpdateArticle = (a: BlogArticle) => {
    setCmsStore(prev => ({
      ...prev,
      articles: prev.articles.map(x => x.id === a.id ? a : x),
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: "Rahul Verma",
          action: "Updated",
          entity: "Story",
          entityName: a.title,
          timestamp: "Just now",
        },
        ...prev.activityLog,
      ],
    }));
  };

  const handleDeleteArticle = (id: string) => {
    const target = cmsStore.articles.find(a => a.id === id);
    setCmsStore(prev => ({
      ...prev,
      articles: prev.articles.filter(x => x.id !== id),
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: "Rahul Verma",
          action: "Deleted",
          entity: "Story",
          entityName: target?.title || id,
          timestamp: "Just now",
        },
        ...prev.activityLog,
      ],
    }));
  };

  const handleUpdateGenre = (genreId: string, updated: Partial<GenreInfo>) => {
    setCmsStore(prev => {
      const current = prev.genres[genreId] || GENRE_METADATA[genreId];
      return { ...prev, genres: { ...prev.genres, [genreId]: { ...current, ...updated } } };
    });
  };

  const handleUpdateMoods = (moods: MoodItem[]) => {
    setCmsStore(prev => ({ ...prev, moods }));
  };

  const handleUpdateOccasions = (occasions: OccasionItem[]) => {
    setCmsStore(prev => ({ ...prev, occasions }));
  };

  const handleUpdateTestimonials = (testimonials: TestimonialItem[]) => {
    setCmsStore(prev => ({ ...prev, testimonials }));
  };

  const handleUploadMedia = (media: MediaItem) => {
    setCmsStore(prev => ({ ...prev, media: [media, ...prev.media] }));
  };

  const handleDeleteMedia = (id: string) => {
    setCmsStore(prev => ({ ...prev, media: prev.media.filter(m => m.id !== id) }));
  };

  const handleUpdateNavigation = (navigation: NavLinkItem[]) => {
    setCmsStore(prev => ({ ...prev, navigation }));
  };

  const handleUpdateFooter = (footer: FooterConfig) => {
    setCmsStore(prev => ({ ...prev, footer }));
  };

  const handleUpdateSEO = (seo: GlobalSEOConfig) => {
    setCmsStore(prev => ({ ...prev, seo }));
  };

  const handleUpdateSettings = (settings: GeneralSettingsConfig) => {
    setCmsStore(prev => ({ ...prev, settings }));
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
    const fresh = resetCMSStore();
    setCmsStore(fresh);
    setFeaturedArtistIds(fresh.artists.slice(0, 6).map(a => a.id));
    setInquiriesList(INITIAL_BOOKING_INQUIRIES);
  };

  // Hash routing
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#admin" || hash === "#admin-login" || hash === "#login") {
        setCurrentPage(isAdminAuthenticated ? "admin" : "admin-login");
      } else if (hash === "#artist/register" || hash === "#artist-register" || hash === "#register-artist") {
        setCurrentPage("artist-register");
      } else if (hash === "#artist/login" || hash === "#artist-login") {
        setShowArtistAuthModal(true);
      } else if (hash === "#artist/dashboard" || hash === "#artist-dashboard") {
        const u = AuthService.getCurrentUser();
        if (u?.role === "artist") {
          setCurrentPage("artist-dashboard");
        } else {
          setShowArtistAuthModal(true);
        }
      } else if (hash === "#artist/status" || hash === "#artist-status") {
        setCurrentPage("artist-status");
      } else if (hash === "#client/login" || hash === "#client-login") {
        setShowClientAuthModal(true);
      } else if (hash === "#client/dashboard" || hash === "#client-dashboard" || hash === "#my-enquiries") {
        const u = AuthService.getCurrentUser();
        if (u?.role === "client") {
          setCurrentPage("client-dashboard");
        } else {
          setShowClientAuthModal(true);
        }
      } else if (hash === "" && (currentPage === "admin" || currentPage === "admin-login")) {
        setCurrentPage("home");
      }
    };
    window.addEventListener("hashchange", handleHashRouting);
    handleHashRouting();
    return () => window.removeEventListener("hashchange", handleHashRouting);
  }, [isAdminAuthenticated, currentPage]);

  const handleOpenArtistPortal = () => {
    const u = AuthService.getCurrentUser();
    if (!u) {
      // Show the artist auth modal — user can sign in or register there
      setShowArtistAuthModal(true);
      return;
    }
    if (u.role === "artist") {
      const art = PlatformStore.getArtistByUserId(u.id);
      if (art && art.status === "APPROVED") {
        setCurrentPage("artist-dashboard");
      } else {
        setCurrentPage("artist-status");
      }
    } else {
      // Logged in but not as artist — show the artist auth modal
      setShowArtistAuthModal(true);
    }
  };

  const handleOpenClientPortal = () => {
    const u = AuthService.getCurrentUser();
    if (!u) {
      setShowClientAuthModal(true);
      return;
    }
    if (u.role === "client") {
      setCurrentPage("client-dashboard");
    } else {
      setShowClientAuthModal(true);
    }
  };

  const handleUserLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setCurrentArtistProfile(null);
    setCurrentPage("home");
    window.location.hash = "";
  };

  const handleArtistLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowArtistAuthModal(false);
    const art = PlatformStore.getArtistByUserId(user.id);
    if (art) setCurrentArtistProfile(art);
    if (art && art.status === "APPROVED") {
      setCurrentPage("artist-dashboard");
    } else {
      setCurrentPage("artist-status");
    }
  };

  const handleClientLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowClientAuthModal(false);
    setCurrentPage("client-dashboard");
  };

  const handleArtistRegistrationComplete = (profile: ArtistApplicationProfile) => {
    setCurrentArtistProfile(profile);
    const u = AuthService.getCurrentUser();
    if (u) setCurrentUser(u);
    setCurrentPage("artist-status");
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
    footerConfig: cmsStore.footer,
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
          onOpenArtistPortal={handleOpenArtistPortal}
          onOpenClientPortal={handleOpenClientPortal}
          onOpenDashboard={() => {
            const u = currentUser;
            if (u?.role === "artist") {
              setCurrentPage("artist-dashboard");
            } else if (u?.role === "client") {
              setCurrentPage("client-dashboard");
            }
          }}
          currentUser={currentUser}
          onLogout={handleUserLogout}
          navLinks={cmsStore.navigation}
          siteName={cmsStore.settings.logoText}
          logoSubtitle={cmsStore.settings.logoSubtitle}
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
          cmsStore={cmsStore}
          onUpdateHomepage={handleUpdateHomepage}
          onAddExperience={handleAddExperience}
          onUpdateExperience={handleUpdateExperience}
          onDeleteExperience={handleDeleteExperience}
          onAddArtist={handleAddArtist}
          onUpdateArtist={handleUpdateArtist}
          onDeleteArtist={handleDeleteArtist}
          featuredArtistIds={featuredArtistIds}
          onSetFeaturedArtistIds={handleSetFeaturedArtistIds}
          onUpdateGenre={handleUpdateGenre}
          onUpdateMoods={handleUpdateMoods}
          onUpdateOccasions={handleUpdateOccasions}
          onAddArticle={handleAddArticle}
          onUpdateArticle={handleUpdateArticle}
          onDeleteArticle={handleDeleteArticle}
          onUpdateTestimonials={handleUpdateTestimonials}
          onUploadMedia={handleUploadMedia}
          onDeleteMedia={handleDeleteMedia}
          onUpdateNavigation={handleUpdateNavigation}
          onUpdateFooter={handleUpdateFooter}
          onUpdateSEO={handleUpdateSEO}
          onUpdateSettings={handleUpdateSettings}
          onResetAllToDefaults={handleResetToDefaults}
          onExitToClient={handleBackHome}
          onLogout={handleLogout}
          onPreviewArtist={artist => setSelectedArtist(artist)}
          onPreviewArticle={handleSelectBlogArticle}
          onPublishAll={() => saveCMSStore(cmsStore)}
          onSyncArtistToCMS={handleSyncArtistToCMS}
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
      ) : currentPage === "artist-register" ? (
        <ArtistRegisterPage
          onSuccess={handleArtistRegistrationComplete}
          onGoToLogin={() => setShowArtistAuthModal(true)}
          onBackToSite={handleBackHome}
        />
      ) : currentPage === "artist-status" ? (
        <ArtistApplicationStatusPage
          artist={currentArtistProfile || PlatformStore.getArtists()[0]}
          currentUser={currentUser}
          onGoToDashboard={() => setCurrentPage("artist-dashboard")}
          onEditProfile={() => setCurrentPage("artist-register")}
          onLogout={handleUserLogout}
          onBackToSite={handleBackHome}
        />
      ) : currentPage === "artist-dashboard" && currentUser ? (
        <ArtistDashboard
          currentUser={currentUser}
          onLogout={handleUserLogout}
          onViewPublicProfile={() => {
            const found = artistsList.find(a => a.id === currentArtistProfile?.id) || artistsList[0];
            setSelectedArtist(found);
          }}
          onBackToSite={handleBackHome}
        />
      ) : currentPage === "client-dashboard" && currentUser ? (
        <ClientDashboard
          currentUser={currentUser}
          onLogout={handleUserLogout}
          onBackToSite={handleBackHome}
        />
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
        /* ── HOMEPAGE — Discovery Driven by CMS ── */
        <>
          {cmsStore.homepage.sections
            .slice()
            .sort((a, b) => a.order - b.order)
            .filter(section => section.isVisible)
            .map(section => {
              switch (section.id) {
                case "hero":
                  return (
                    <HeroSection
                      key={section.id}
                      heroConfig={cmsStore.homepage.hero}
                      onExplore={handleOpenGenresPage}
                      onFindByMood={handleScrollToMood}
                      onSelectGenre={handleOpenGenre}
                    />
                  );
                case "ticker":
                  return <GenreTicker key={section.id} onSelectGenre={handleOpenGenre} />;
                case "mood-discovery":
                  return (
                    <MoodDiscovery
                      key={section.id}
                      id="mood-discovery"
                      moods={cmsStore.moods}
                      onSelectGenre={handleOpenGenre}
                    />
                  );
                case "occasion-discovery":
                  return (
                    <OccasionDiscovery
                      key={section.id}
                      occasions={cmsStore.occasions}
                      onSelectGenre={handleOpenGenre}
                    />
                  );
                case "smart-discovery":
                  return <SmartDiscovery key={section.id} onSelectGenre={handleOpenGenre} />;
                case "featured-experiences":
                  return (
                    <FeaturedExperiences
                      key={section.id}
                      artists={artistsList}
                      featuredArtistIds={featuredArtistIds}
                      onSelectArtist={setSelectedArtist}
                      onBookArtist={setBookingArtist}
                      onViewAll={handleOpenArtists}
                    />
                  );
                case "genre-exploration":
                  return <GenreExploration key={section.id} onSelectGenre={handleOpenGenre} />;
                case "surprise-me":
                  return <SurpriseMe key={section.id} onSelectGenre={handleOpenGenre} />;
                case "how-it-works":
                  return <HowItWorks key={section.id} />;
                case "testimonials":
                  return <Testimonials key={section.id} testimonials={cmsStore.testimonials} />;
                case "final-cta":
                  return (
                    <FinalCTA
                      key={section.id}
                      finalCtaConfig={cmsStore.homepage.finalCta}
                      onPlanEvent={handlePlanEvent}
                      onExplore={handleOpenGenresPage}
                    />
                  );
                default:
                  return null;
              }
            })}
          <Footer {...footerProps} />
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

      {/* Artist Auth Modal — full-screen overlay */}
      {showArtistAuthModal && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          <ArtistAuthModal
            onLoginSuccess={handleArtistLoginSuccess}
            onGoToRegister={() => {
              setShowArtistAuthModal(false);
              setCurrentPage("artist-register");
            }}
            onBackToSite={() => setShowArtistAuthModal(false)}
          />
        </div>
      )}

      {/* Client Auth Modal — full-screen overlay */}
      {showClientAuthModal && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          <ClientAuthModal
            onLoginSuccess={handleClientLoginSuccess}
            onClose={() => setShowClientAuthModal(false)}
          />
        </div>
      )}
    </div>
  );
}
