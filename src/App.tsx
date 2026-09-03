import { useState, useEffect } from "react";
import { Artist, ALL_ARTISTS, GENRE_METADATA } from "./data/artistsData";
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

/* ── SVG Icon Components ────────────────────────────────────────────────────── */

type SvgProps = { className?: string; style?: React.CSSProperties };

function IconNote({ className = "", style = {} }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" />
    </svg>
  );
}
function IconGuitar({ className = "", style = {} }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" fill="currentColor" aria-hidden>
      <path d="M85 5 65 25c-3-2-7-3-11-2L20 8 8 20l15 34c-1 4 0 8 2 11L5 85l10 10 20-20c3 2 7 3 11 2l34 15 12-12L77 46c1-4 0-8-2-11L95 15ZM50 60c-6 0-11-5-11-11s5-11 11-11 11 5 11 11-5 11-11 11Z" />
    </svg>
  );
}
function IconMic({ className = "", style = {} }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93H2c0 4.96 3.57 9.09 8.4 9.83V22h3v-4.24c4.83-.74 8.4-4.87 8.4-9.83h-2c0 4.08-3.06 7.44-7 7.93V15h-1z" />
    </svg>
  );
}
function IconVinyl({ className = "", style = {} }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" fill="currentColor" aria-hidden>
      <path d="M50 2C23.5 2 2 23.5 2 50s21.5 48 48 48 48-21.5 48-48S76.5 2 50 2zm0 68c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z" />
      <circle cx="50" cy="50" r="6" />
      <circle cx="50" cy="50" r="2.5" fill="white" />
    </svg>
  );
}
function IconStar({ className = "", style = {} }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}
function IconMandala({ className = "", style = {} }: SvgProps) {
  const spokes = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const dots = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6" aria-hidden>
      <circle cx="50" cy="50" r="48" />
      <circle cx="50" cy="50" r="36" />
      <circle cx="50" cy="50" r="24" />
      <circle cx="50" cy="50" r="12" />
      <circle cx="50" cy="50" r="4" />
      {spokes.map(a => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={50 + 12 * Math.cos(r)} y1={50 + 12 * Math.sin(r)}
            x2={50 + 48 * Math.cos(r)} y2={50 + 48 * Math.sin(r)}
          />
        );
      })}
      {dots.map(a => {
        const r = (a * Math.PI) / 180;
        return <circle key={a} cx={50 + 30 * Math.cos(r)} cy={50 + 30 * Math.sin(r)} r="4" />;
      })}
    </svg>
  );
}
function IconHeadphones({ className = "", style = {} }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1C7.03 1 3 5.03 3 10v2H1v6h4v-8H3c0-4.97 4.03-9 9-9s9 4.03 9 9h-2v8h4v-6h-2v-2c0-4.97-4.03-9-9-9zm-4 9H6v6h2v-6zm8 0h2v6h-2v-6z" />
    </svg>
  );
}

/* ── Reusable Components ────────────────────────────────────────────────────── */

function StarRating({ rating = 5, size = "sm" }: { rating?: number; size?: "sm" | "xs" }) {
  const cls = size === "xs" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${cls} ${i <= rating ? "text-[#E11D48]" : "text-gray-200"}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      ))}
    </div>
  );
}

function AnimatedWaveform({ color = "currentColor", bars = 14 }: { color?: string; bars?: number }) {
  const heights = [45, 75, 95, 60, 85, 50, 100, 65, 80, 55, 90, 70, 45, 80];
  return (
    <div className="flex items-end gap-[2px]" style={{ height: "28px" }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="animate-wave-bar rounded-full flex-shrink-0"
          style={{
            width: "3px",
            height: `${heights[i % heights.length]}%`,
            backgroundColor: color,
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${0.7 + (i % 5) * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

function SectionBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase mb-6 border"
      style={{ background: `${color}14`, color, borderColor: `${color}28` }}
    >
      {children}
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────────────────────────── */

interface NavbarProps {
  onHome: () => void;
  onBrowseGenres: () => void;
  onScrollToFeatured: () => void;
  onBrowseArtists: () => void;
  onScrollToBlog: () => void;
}

function Navbar({ onHome, onBrowseGenres, onScrollToFeatured, onBrowseArtists, onScrollToBlog }: NavbarProps) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={onHome}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9333EA] flex items-center justify-center shadow-md">
            <IconMic className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-[#1A1A1A] tracking-tight">StageBridge</span>
          <span className="text-[9px] font-body text-[#E11D48] font-bold tracking-[0.2em] uppercase bg-[#E11D48]/10 px-1.5 py-0.5 rounded-full">Pro</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <button onClick={onHome} className="font-body text-sm font-medium text-[#5B5B5B] hover:text-[#E11D48] hover:bg-[#FFF0F3] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer">
            Home
          </button>
          
          {/* Button 1: Browse Genres */}
          <button
            onClick={onBrowseGenres}
            className="font-body text-sm font-medium text-[#5B5B5B] hover:text-[#E11D48] hover:bg-[#FFF0F3] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            Browse Genres
          </button>

          {/* Button 2: Top Performers */}
          <button
            onClick={onScrollToFeatured}
            className="font-body text-sm font-medium text-[#5B5B5B] hover:text-[#E11D48] hover:bg-[#FFF0F3] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            Top Performers
          </button>

          <a href="#how-it-works" className="font-body text-sm font-medium text-[#5B5B5B] hover:text-[#E11D48] hover:bg-[#FFF0F3] px-3.5 py-1.5 rounded-full transition-colors">
            How It Works
          </a>

          {/* Button 3: Journal / Blog */}
          <button
            onClick={onScrollToBlog}
            className="font-body text-sm font-medium text-[#5B5B5B] hover:text-[#E11D48] hover:bg-[#FFF0F3] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Journal</span>
            <span className="text-[10px] bg-[#E11D48]/10 text-[#E11D48] font-bold px-1.5 py-0.2 rounded-full">New</span>
          </button>

          <a href="#join-artist" className="font-body text-sm font-medium text-[#5B5B5B] hover:text-[#E11D48] hover:bg-[#FFF0F3] px-3.5 py-1.5 rounded-full transition-colors">
            For Artists
          </a>
        </div>



        {/* Mobile Hamburger */}
        <button className="md:hidden text-[#1A1A1A] cursor-pointer" onClick={() => setOpen(o => !o)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl px-6 py-4 border-t border-[#F3E5E8] space-y-3">
          <button onClick={() => { onHome(); setOpen(false); }} className="block w-full text-left font-body py-1 text-sm text-[#5B5B5B] hover:text-[#E11D48]">
            Home
          </button>
          <button onClick={() => { onBrowseGenres(); setOpen(false); }} className="block w-full text-left font-body py-1.5 px-3 rounded-xl text-sm font-semibold text-[#BE123C] bg-[#FFF0F3]">
            Browse Genres
          </button>
          <button onClick={() => { onScrollToFeatured(); setOpen(false); }} className="block w-full text-left font-body py-1.5 px-3 rounded-xl text-sm font-semibold text-[#BE123C] bg-[#FFF0F3]">
            Top Performers
          </button>
          <button onClick={() => { onScrollToBlog(); setOpen(false); }} className="block w-full text-left font-body py-1.5 px-3 rounded-xl text-sm font-semibold text-[#BE123C] bg-[#FFF0F3]">
            📖 Journal &amp; Event Guides
          </button>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block font-body py-1 text-sm text-[#5B5B5B]">
            How It Works
          </a>
          <a href="#join-artist" onClick={() => setOpen(false)} className="block font-body py-1 text-sm text-[#5B5B5B]">
            For Artists
          </a>
        </div>
      )}
    </nav>
  );
}

/* ── Hero Section (with Identical Matching Action Buttons) ───────────────────── */

interface HeroSectionProps {
  onBrowseGenres: () => void;
  onScrollToFeatured: () => void;
  onSearchGenre: (genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
}

function HeroSection({ onBrowseGenres, onScrollToFeatured, onSearchGenre }: HeroSectionProps) {
  const [search, setSearch] = useState({ artist: "", event: "", city: "", budget: "" });

  const handleSearchSubmit = () => {
    if (search.artist.toLowerCase().includes("sufi") || search.event.toLowerCase().includes("sufi")) {
      onSearchGenre("sufi");
    } else if (search.artist.toLowerCase().includes("rock") || search.event.toLowerCase().includes("rock")) {
      onSearchGenre("rock");
    } else if (search.artist.toLowerCase().includes("gazal") || search.artist.toLowerCase().includes("ghazal") || search.event.toLowerCase().includes("ghazal") || search.event.toLowerCase().includes("gazal")) {
      onSearchGenre("gazal");
    } else if (search.artist.toLowerCase().includes("bollywood") || search.event.toLowerCase().includes("bollywood")) {
      onSearchGenre("bollywood");
    } else if (search.artist.toLowerCase().includes("carnival") || search.event.toLowerCase().includes("carnival")) {
      onSearchGenre("carnival");
    } else if (search.artist.toLowerCase().includes("devotional") || search.artist.toLowerCase().includes("bhajan") || search.event.toLowerCase().includes("devotional")) {
      onSearchGenre("devotional");
    } else {
      onScrollToFeatured();
    }
  };

  return (
    <section className="relative bg-[#FFF8F8] pt-24 sm:pt-28 pb-14 overflow-hidden border-b border-[#F3E5E8]">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-12 right-[8%] w-[480px] h-[480px] rounded-full border border-[#E11D48]/10 animate-pulse-subtle" />
        <div className="absolute top-24 right-[12%] w-[340px] h-[340px] rounded-full border border-[#BE123C]/08 animate-pulse-subtle" style={{ animationDelay: "1.5s" }} />
        <IconNote  className="absolute top-20 left-[5%]  w-12 h-12 text-[#E11D48] animate-float"      style={{ opacity: 0.08, animationDelay: "0s" }} />
        <IconGuitar className="absolute top-36 left-[12%] w-20 h-20 text-[#BE123C] animate-float-alt" style={{ opacity: 0.06, animationDelay: "1s" }} />
        <IconVinyl className="absolute top-1/2 left-[7%] w-14 h-14 text-[#E11D48] animate-spin-slow"  style={{ opacity: 0.06 }} />
        <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(225,29,72,0.06) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column (Content & Search) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <SectionBadge color="#E11D48">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse inline-block" />
              {"India's Premier Artist Booking Platform"}
            </SectionBadge>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.1] tracking-tight">
              Find The <span className="shimmer-crimson">Perfect Artist</span>
              <br />
              <em className="font-normal italic text-[#BE123C]">For Every Event</em>
            </h1>

            <p className="font-body text-[#5B5B5B] text-sm sm:text-base leading-relaxed max-w-xl">
              Book verified master performers for Sufi nights, indie rock concerts, Ghazal mehfils, Bollywood sangeets, carnivals, and devotional gatherings across India.
            </p>
          </div>

          {/* Quick Filter Search Box */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#F3E5E8] p-3 space-y-2.5 max-w-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { key: "artist", label: "Artist Type", opts: ["Sufi Singer", "Rock Band", "Gazal Singer", "Bollywood Performer", "Carnival Artist", "Devotional / Bhajan", "DJ"] },
                { key: "event",  label: "Occasion",    opts: ["Sufi Night", "Rock Concert", "Gazal Mehfil", "Bollywood Night", "Carnival & Fair", "Devotional Gathering", "Wedding Sangeet"] },
                { key: "city",   label: "City",        opts: ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune", "Jaipur", "Lucknow", "Goa"] },
                { key: "budget", label: "Budget",      opts: ["Under ₹35K", "₹35K–₹50K", "₹50K–₹75K", "₹75K–₹1L", "Above ₹1L"] },
              ] as const).map(({ key, label, opts }) => (
                <div key={key} className="relative">
                  <select
                    className="w-full font-body text-xs text-[#3A3A3A] bg-[#FFF5F6] rounded-xl px-2.5 py-2.5 appearance-none border border-transparent focus:border-[#E11D48]/30 focus:outline-none cursor-pointer font-medium"
                    value={(search as Record<string, string>)[key]}
                    onChange={e => setSearch(s => ({ ...s, [key]: e.target.value }))}
                  >
                    <option value="">{label}</option>
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#5B5B5B] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              ))}
            </div>

            <button
              onClick={handleSearchSubmit}
              className="w-full font-body font-bold text-white bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#BE123C] py-2.5 rounded-xl text-xs tracking-wide shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.005] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>✦</span>
              <span>Find Verified Artists Now</span>
            </button>
          </div>

          {/* TWO MATCHING ACTION BUTTONS */}
          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <button
              onClick={onBrowseGenres}
              className="font-body font-bold px-6 py-3 rounded-full bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#BE123C] text-white text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span>🎭</span>
              <span>Browse Genres</span>
            </button>

            <button
              onClick={onScrollToFeatured}
              className="font-body font-bold px-6 py-3 rounded-full bg-white hover:bg-[#FFF0F3] text-[#BE123C] border border-[#F3E5E8] text-xs sm:text-sm shadow-xs hover:shadow hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span>⭐</span>
              <span>Top Performers</span>
            </button>
          </div>
        </div>

        {/* Right Column (Dynamic Artistic Montage) */}
        <div className="lg:col-span-5 relative h-[420px] sm:h-[460px] hidden lg:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-dashed border-[#E11D48]/15 animate-spin-slow" />

          {/* Card 1 – Bollywood */}
          <div
            onClick={() => onSearchGenre("bollywood")}
            className="absolute top-0 right-2 w-52 h-64 rounded-3xl overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500 bg-gray-200 cursor-pointer group border-2 border-white"
          >
            <img
              src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=500&fit=crop&auto=format"
              alt="Bollywood stage"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-3 left-3 font-body text-[11px] font-bold text-white bg-[#E11D48] px-2.5 py-0.5 rounded-full shadow-md">
              🎬 Bollywood Live
            </span>
          </div>

          {/* Card 2 – Sufi */}
          <div
            onClick={() => onSearchGenre("sufi")}
            className="absolute top-10 left-2 w-48 h-56 rounded-3xl overflow-hidden shadow-xl -rotate-3 hover:rotate-0 transition-transform duration-500 bg-gray-200 cursor-pointer group border-2 border-white"
          >
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=350&h=450&fit=crop&auto=format"
              alt="Sufi Performance"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-3 left-3 font-body text-[11px] font-bold text-white bg-[#BE123C] px-2.5 py-0.5 rounded-full shadow-md">
              🕊️ Sufi &amp; Qawwali
            </span>
          </div>

          {/* Card 3 – Ghazal */}
          <div
            onClick={() => onSearchGenre("gazal")}
            className="absolute bottom-4 right-10 w-44 h-40 rounded-2xl overflow-hidden shadow-lg rotate-3 hover:rotate-0 transition-transform duration-500 bg-gray-200 cursor-pointer group border-2 border-white"
          >
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=350&h=300&fit=crop&auto=format"
              alt="Ghazal Mehfil"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-2.5 left-2.5 font-body text-[10px] font-bold text-white bg-[#4C0519] px-2 py-0.5 rounded-full shadow-md">
              📜 Ghazal Mehfil
            </span>
          </div>

          {/* Card 4 – Rock */}
          <div
            onClick={() => onSearchGenre("rock")}
            className="absolute bottom-2 left-6 w-36 h-36 rounded-2xl overflow-hidden shadow-lg -rotate-4 hover:rotate-0 transition-transform duration-500 bg-gray-200 cursor-pointer group border-2 border-white"
          >
            <img
              src="https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=300&h=300&fit=crop&auto=format"
              alt="Rock Band"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-2 left-2 font-body text-[10px] font-bold text-white bg-[#881337] px-2 py-0.5 rounded-full shadow-md">
              🎸 Rock Live
            </span>
          </div>

          {/* Floating Soundcheck Badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-2xl px-3.5 py-1.5 shadow-lg border border-[#F3E5E8] flex items-center gap-2">
            <AnimatedWaveform color="#E11D48" bars={8} />
            <span className="font-body text-[11px] font-bold text-[#1A1A1A]">Live Soundcheck Active</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Scrolling Ticker ───────────────────────────────────────────────────────── */

function PerformerTicker({ onSelectGenre }: { onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void }) {
  const items: Array<{ label: string; genre: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional" }> = [
    { label: "🕊️ Sufi Singers & Qawwals", genre: "sufi" },
    { label: "🎸 Rock & Indie Bands", genre: "rock" },
    { label: "📜 Gazal Virtuosos", genre: "gazal" },
    { label: "🎬 Bollywood Playback", genre: "bollywood" },
    { label: "🎡 Carnival & Circus Acts", genre: "carnival" },
    { label: "🪔 Devotional Bhajans", genre: "devotional" },
  ];
  const doubled = [...items, ...items, ...items];
  return (
    <div className="bg-gradient-to-r from-[#1A050B] via-[#3B0716] to-[#1A050B] py-3.5 overflow-hidden border-y border-[#E11D48]/20">
      <div className="flex gap-0 animate-ticker" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelectGenre(item.genre)}
            className="font-body text-sm font-medium text-white/90 hover:text-[#FB7185] flex-shrink-0 px-4 cursor-pointer transition-colors"
          >
            {item.label} <span className="text-[#F43F5E] px-4">✦</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Stats Bar ──────────────────────────────────────────────────────────────── */

function StatsBar() {
  const stats = [
    { n: "2,800+", l: "Verified Artists", e: "🎤" },
    { n: "15,000+", l: "Events Booked", e: "🎪" },
    { n: "98%", l: "Client Satisfaction", e: "⭐" },
    { n: "42+", l: "Cities Covered", e: "📍" },
    { n: "6", l: "Core Performance Genres", e: "🎵" },
    { n: "4.9/5", l: "Average Rating", e: "🏆" },
  ];
  return (
    <section className="bg-white py-14 border-b border-[#F3E5E8]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 md:grid-cols-6 gap-8">
        {stats.map(s => (
          <div key={s.l} className="text-center group cursor-default">
            <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform duration-200 inline-block">{s.e}</div>
            <div className="font-display font-bold text-2xl text-[#1A1A1A] group-hover:text-[#E11D48] transition-colors">{s.n}</div>
            <div className="font-body text-xs text-[#5B5B5B] mt-0.5 leading-tight">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 6 Category Showcase Tiles: Sufi, Rock, Gazal, Bollywood, Carnival, Devotional ─ */

interface CategoryShowcaseProps {
  onSelectGenre: (genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
}

function CategoryShowcase({ onSelectGenre }: CategoryShowcaseProps) {
  const genreKeys: Array<"sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional"> = [
    "sufi", "rock", "gazal", "bollywood", "carnival", "devotional"
  ];
  const cats = genreKeys.map(k => {
    const meta = GENRE_METADATA[k];
    return {
      id: meta.id,
      title: meta.title,
      tag: meta.tag,
      sub: meta.description,
      img: meta.heroImg,
      accent: meta.accent,
      icon: meta.icon,
    };
  });

  return (
    <section id="categories" className="bg-[#FFF8F8] py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionBadge color="#E11D48">✦ Explore By Genre</SectionBadge>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            Discover Exceptional Talent Across{" "}
            <span className="text-gradient-crimson italic">Every Genre</span>
          </h2>
          <p className="font-body text-[#5B5B5B] text-lg max-w-2xl mx-auto">
            Click any genre tile to view verified artists, their complete profiles, performance setlists, and what else they do!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map(c => (
            <div
              key={c.title}
              onClick={() => onSelectGenre(c.id)}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 border border-black/5 bg-gray-900"
            >
              <img
                src={c.img}
                alt={c.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.95] group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0104]/90 via-[#0F0104]/40 via-45% to-transparent pointer-events-none" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(to top, ${c.accent}, transparent 50%)` }}
              />

              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-white bg-black/45 backdrop-blur-md border border-white/20 shadow-md">
                    <span className="text-base">{c.icon}</span>
                    <span>{c.tag}</span>
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    ↗
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-3xl font-bold text-white mb-1.5 drop-shadow-md tracking-tight">
                    {c.title}
                  </h3>
                  <p className="font-body text-white/90 text-sm leading-snug drop-shadow line-clamp-2">
                    {c.sub}
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="font-body text-xs font-bold text-white bg-[#E11D48] hover:bg-[#BE123C] px-4 py-2 rounded-full shadow-lg inline-flex items-center gap-1.5">
                      Explore {c.title} Artists →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Featured Artists ───────────────────────────────────────────────────────── */

interface FeaturedArtistsProps {
  onSelectArtist: (artist: Artist) => void;
  onBookArtist: (artist: Artist) => void;
  onViewAll: () => void;
  artists?: Artist[];
  featuredArtistIds?: string[];
}

function FeaturedArtists({ onSelectArtist, onBookArtist, onViewAll, artists, featuredArtistIds }: FeaturedArtistsProps) {
  const sourceArtists = artists || ALL_ARTISTS;
  const featured = featuredArtistIds && featuredArtistIds.length > 0
    ? featuredArtistIds.map(id => sourceArtists.find(a => a.id === id)).filter((a): a is Artist => Boolean(a))
    : sourceArtists.slice(0, 6);

  return (
    <section id="featured-performers" className="bg-[#FFF0F3] py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
          <div>
            <SectionBadge color="#E11D48">✦ Hand-picked Talent</SectionBadge>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
              Featured <span className="text-gradient-crimson italic">Performers</span>
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="font-body text-sm font-semibold text-[#E11D48] border-2 border-[#E11D48] px-5 py-2.5 rounded-full hover:bg-[#E11D48] hover:text-white transition-all duration-200 flex-shrink-0 cursor-pointer"
          >
            View All Artists Directory →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(a => (
            <div
              key={a.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm card-hover card-hover-ruby group flex flex-col border border-[#F3E5E8]"
            >
              <div
                className="relative h-56 overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => onSelectArtist(a)}
              >
                <img
                  src={a.img}
                  alt={a.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-3 left-3 font-body text-xs font-bold text-white px-3 py-1 rounded-full shadow-sm bg-[#E11D48]">
                  {a.genreTitle}
                </span>
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-green-600 text-xs font-body font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  ✓ Verified
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <h3
                        onClick={() => onSelectArtist(a)}
                        className="font-display font-bold text-lg text-[#1A1A1A] leading-tight hover:text-[#E11D48] cursor-pointer transition-colors"
                      >
                        {a.name}
                      </h3>
                      <p className="font-body text-xs text-[#5B5B5B]">{a.bandType} • {a.city}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="font-body text-[10px] text-[#5B5B5B]">Starting</div>
                      <div className="font-display font-bold text-base text-[#BE123C]">{a.price}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={a.rating} />
                    <span className="font-body text-xs text-[#5B5B5B]">({a.reviewsCount} reviews)</span>
                  </div>

                  <div className="bg-[#FFF8F8] p-2.5 rounded-xl border border-[#F3E5E8] mb-2">
                    <span className="text-[10px] font-bold text-[#BE123C] block mb-1">
                      ✨ Also Performs:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {a.whatElseTheyDo.slice(0, 2).map((item, i) => (
                        <span key={i} className="text-[10px] bg-white text-[#4A4A4A] px-2 py-0.5 rounded border border-[#F3E5E8]">
                          {item.category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F3E5E8]">
                  <button
                    onClick={() => onSelectArtist(a)}
                    className="text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer"
                  >
                    View Full Profile →
                  </button>
                  <button
                    onClick={() => onBookArtist(a)}
                    className="font-body text-xs font-bold text-white px-4 py-2 rounded-full hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer bg-[#E11D48] hover:bg-[#BE123C]"
                  >
                    ⚡ Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ───────────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    { num: "01", title: "Search & Discover",   desc: "Filter by genre (Sufi, Rock, Gazal, Bollywood, Carnival, Devotional), city, and budget. Browse verified profiles with performance clips.",  icon: "🔍", color: "#E11D48" },
    { num: "02", title: "Connect & Preview",   desc: "Watch live gig videos, read verified client feedback, check calendar availability, and see everything the artist performs.",            icon: "🎵", color: "#BE123C" },
    { num: "03", title: "Book & Celebrate",    desc: "Lock in your dates with secure digital contracts, transparent pricing calculators, and a dedicated artist relationship manager.",       icon: "🎉", color: "#10B981" },
  ];

  return (
    <section id="how-it-works" className="bg-white py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionBadge color="#E11D48">✦ Simple Process</SectionBadge>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            How <span className="text-gradient-crimson italic">StageBridge</span> Works
          </h2>
          <p className="font-body text-[#5B5B5B] text-lg max-w-xl mx-auto">
            From first search to final encore — we make booking effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div
            className="hidden md:block absolute top-11 h-px bg-gradient-to-r from-[#E11D48] via-[#BE123C] to-[#10B981]"
            style={{ left: "18%", right: "18%" }}
          />

          {steps.map(s => (
            <div key={s.num} className="relative text-center group">
              <div
                className="font-display font-black text-8xl absolute top-0 left-1/2 -translate-x-1/2 select-none leading-none"
                style={{ color: `${s.color}10` }}
              >
                {s.num}
              </div>
              <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-md group-hover:scale-110 transition-transform duration-300 z-10"
                style={{ background: `${s.color}12`, border: `2px solid ${s.color}28` }}
              >
                {s.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-[#1A1A1A] mb-3 relative z-10">{s.title}</h3>
              <p className="font-body text-[#5B5B5B] text-sm leading-relaxed relative z-10 max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Wedding & Celebrations Section ────────────────────────────────────────── */

function WeddingSection({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="bg-[#FFF1F5] py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <SectionBadge color="#E11D48">💍 Wedding &amp; Private Celebrations</SectionBadge>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6 leading-tight">
            Make Your <span className="italic" style={{ color: "#E11D48" }}>Celebration Day</span>
            <br />Unforgettable
          </h2>
          <p className="font-body text-[#5B5B5B] text-lg leading-relaxed mb-8">
            From soulful Ghazal &amp; Sufi singers who serenade your evening to high-octane Bollywood &amp; Rock live bands that keep the dance floor packed all night.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {["Ghazal Mehfils", "Sufi Ensembles", "Bollywood Live Bands", "Carnival Dancers", "Devotional Kirtans", "Rock Guitarists"].map(t => (
              <div key={t} className="flex items-center gap-2 font-body text-sm text-[#5B5B5B]">
                <svg className="w-4 h-4 text-[#E11D48] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t}
              </div>
            ))}
          </div>
          <button
            onClick={onExplore}
            className="font-body font-bold px-8 py-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #BE123C, #E11D48)" }}
          >
            Browse Wedding Artists →
          </button>
        </div>

        <div className="relative h-[500px]">
          <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-gray-200">
            <img src="https://images.unsplash.com/photo-1699521377681-b3aac449a4c6?w=700&h=600&fit=crop&auto=format" alt="Wedding singer" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(225,29,72,0.3) 0%, transparent 60%)" }} />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 max-w-[200px] border border-[#F3E5E8]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#E11D48]/10 flex items-center justify-center text-lg">💍</div>
              <div>
                <div className="font-display font-bold text-sm text-[#1A1A1A]">200+ Weddings</div>
                <div className="font-body text-xs text-[#5B5B5B]">This year alone</div>
              </div>
            </div>
            <StarRating rating={5} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Join As Artist CTA ─────────────────────────────────────────────────────── */

function JoinArtistCTA() {
  return (
    <section id="join-artist" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #180206 0%, #2A050D 25%, #4C0519 50%, #881337 80%, #0F0104 100%)" }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="text-5xl mb-6 animate-float inline-block">🎤</div>
        <h2 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Are You a Performer?
          <br />
          <span className="shimmer-crimson">Start Earning Today</span>
        </h2>
        <p className="font-body text-white/70 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Join India's largest artist booking network. Showcase all the genres and styles you perform. Set your own rates. Own your calendar. Build your legacy.
        </p>

        <div className="grid grid-cols-3 gap-8 mb-12 max-w-md mx-auto">
          {[["₹50L+", "Paid to artists"], ["2,800+", "Active profiles"], ["4.9★", "Artist rating"]].map(([n, l]) => (
            <div key={l}>
              <div className="font-display font-bold text-3xl text-[#FB7185]">{n}</div>
              <div className="font-body text-xs text-white/60 mt-1 leading-tight">{l}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            className="font-body font-bold px-10 py-4 rounded-full text-white text-lg transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer"
            style={{ background: "linear-gradient(135deg, #E11D48, #F43F5E)", boxShadow: "0 0 40px rgba(225,29,72,0.45)" }}
          >
            Create Artist Profile — Free
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────────── */

interface FooterProps {
  onSelectGenre: (g: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
  onBrowseArtists: () => void;
  onScrollToBlog?: () => void;
  onSelectArticle?: (article: BlogArticle) => void;
  articles?: BlogArticle[];
}

function Footer({ onSelectGenre, onBrowseArtists, onScrollToBlog, onSelectArticle, articles }: FooterProps) {
  const sourceArticles = articles || BLOG_ARTICLES;

  return (
    <footer className="bg-[#0D0D0D] text-white py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9333EA] flex items-center justify-center shadow-md">
                <IconMic className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl">StageBridge</span>
              <span className="text-[9px] font-body text-[#E11D48] font-bold tracking-[0.2em] uppercase bg-[#E11D48]/10 px-1.5 py-0.5 rounded-full">Pro</span>
            </div>
            <p className="font-body text-sm text-white/45 leading-relaxed mb-6 max-w-sm">
              {"India's premier platform connecting exceptional artists with unforgettable live events. Transparent pricing, verified riders, and escrow protection."}
            </p>
            <div className="flex gap-2.5">
              {["IG", "FB", "YT", "TW"].map(s => (
                <div key={s} className="w-9 h-9 rounded-full bg-white/08 hover:bg-[#E11D48] flex items-center justify-center cursor-pointer transition-colors duration-200 text-xs font-body font-bold text-white/60 hover:text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs tracking-widest uppercase text-white/35 mb-5">Explore Genres</h4>
            <div className="space-y-2.5">
              {[
                { name: "🕊️ Sufi Performers", id: "sufi" as const },
                { name: "🎸 Rock & Indie Bands", id: "rock" as const },
                { name: "📜 Gazal Mehfils", id: "gazal" as const },
                { name: "🎬 Bollywood Concerts", id: "bollywood" as const },
                { name: "🎡 Carnival & Circus", id: "carnival" as const },
                { name: "🪔 Devotional Bhajans", id: "devotional" as const },
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => onSelectGenre(g.id)}
                  className="block font-body text-sm text-white/55 hover:text-[#E11D48] transition-colors cursor-pointer text-left"
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs tracking-widest uppercase text-white/35 mb-5">Journal &amp; Guides</h4>
            <div className="space-y-2.5">
              {onScrollToBlog && (
                <button
                  onClick={onScrollToBlog}
                  className="block font-body text-sm font-semibold text-[#FB7185] hover:underline transition-colors text-left cursor-pointer"
                >
                  ✦ View All Journal Articles →
                </button>
              )}
              {sourceArticles.slice(0, 3).map(art => (
                <button
                  key={art.id}
                  onClick={() => onSelectArticle ? onSelectArticle(art) : onScrollToBlog?.()}
                  className="block font-body text-xs text-white/55 hover:text-[#E11D48] transition-colors text-left cursor-pointer line-clamp-2 leading-relaxed"
                >
                  • {art.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs tracking-widest uppercase text-white/35 mb-5">Directory &amp; Support</h4>
            <div className="space-y-2.5">
              <button onClick={onBrowseArtists} className="block font-body text-sm text-white/55 hover:text-[#E11D48] transition-colors text-left cursor-pointer">
                All Verified Performers →
              </button>
              {["Weddings & Sangeet", "College Festivals", "Corporate Summits", "About Us", "Contact & Support"].map(l => (
                <a key={l} href="#" className="block font-body text-sm text-white/55 hover:text-[#E11D48] transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/08 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-body text-xs text-white/35">
            © 2026 StageBridge. All rights reserved. Made with ♪ for artists everywhere.
          </div>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
              <a key={l} href="#" className="font-body text-xs text-white/35 hover:text-white/65 transition-colors">{l}</a>
            ))}
            <a
              href="#admin"
              className="font-body text-xs text-white/20 hover:text-white/60 transition-colors"
              title="Restricted Admin Login Gateway"
            >
              Admin Gateway 🔒
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Root App ───────────────────────────────────────────────────────────────── */

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "genres" | "genre" | "artists" | "journal" | "blog-detail" | "admin" | "admin-login">("home");
  const [activeGenre, setActiveGenre] = useState<"sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional">("sufi");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [bookingArtist, setBookingArtist] = useState<Artist | null>(null);

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("stagebridge_admin_auth") === "true";
    } catch {
      return false;
    }
  });

  // Stateful, Persistent Top 6 Featured Artist IDs for Home Page
  const [featuredArtistIds, setFeaturedArtistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("stagebridge_featured_ids");
      return saved ? JSON.parse(saved) : ["artist-1", "artist-2", "artist-3", "artist-4", "artist-5", "artist-6"];
    } catch {
      return ["artist-1", "artist-2", "artist-3", "artist-4", "artist-5", "artist-6"];
    }
  });

  const handleSetFeaturedArtistIds = (ids: string[]) => {
    setFeaturedArtistIds(ids);
    try {
      localStorage.setItem("stagebridge_featured_ids", JSON.stringify(ids));
    } catch (err) {
      console.error(err);
    }
  };

  // Stateful, Persistent Artist Directory (with LocalStorage fallback)
  const [artistsList, setArtistsList] = useState<Artist[]>(() => {
    try {
      const saved = localStorage.getItem("stagebridge_artists");
      return saved ? JSON.parse(saved) : ALL_ARTISTS;
    } catch {
      return ALL_ARTISTS;
    }
  });

  // Stateful, Persistent Blog Articles (with LocalStorage fallback)
  const [articlesList, setArticlesList] = useState<BlogArticle[]>(() => {
    try {
      const saved = localStorage.getItem("stagebridge_blogs");
      return saved ? JSON.parse(saved) : BLOG_ARTICLES;
    } catch {
      return BLOG_ARTICLES;
    }
  });

  // Stateful Booking Inquiries (with LocalStorage fallback)
  const [inquiriesList, setInquiriesList] = useState<BookingInquiry[]>(() => {
    try {
      const saved = localStorage.getItem("stagebridge_inquiries");
      return saved ? JSON.parse(saved) : INITIAL_BOOKING_INQUIRIES;
    } catch {
      return INITIAL_BOOKING_INQUIRIES;
    }
  });

  // Listen to URL hash routing (#admin / #admin-login)
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#admin" || hash === "#admin-login" || hash === "#login") {
        if (isAdminAuthenticated) {
          setCurrentPage("admin");
        } else {
          setCurrentPage("admin-login");
        }
      } else if (hash === "" && (currentPage === "admin" || currentPage === "admin-login")) {
        setCurrentPage("home");
      }
    };

    handleHashRouting();
    window.addEventListener("hashchange", handleHashRouting);
    return () => window.removeEventListener("hashchange", handleHashRouting);
  }, [isAdminAuthenticated, currentPage]);

  // Blog interactive state
  const [selectedBlogArticle, setSelectedBlogArticle] = useState<BlogArticle | null>(null);
  const [articleLikes, setArticleLikes] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    BLOG_ARTICLES.forEach(a => {
      init[a.id] = a.initialLikes;
    });
    return init;
  });

  /* ── Admin Login & Session Handlers ── */
  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem("stagebridge_admin_auth", "true");
    } catch (err) {
      console.error(err);
    }
    setCurrentPage("admin");
    window.location.hash = "#admin";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem("stagebridge_admin_auth");
    } catch (err) {
      console.error(err);
    }
    window.location.hash = "";
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Artist CRUD Handlers ── */
  const handleAddArtist = (newArtist: Artist) => {
    const updated = [newArtist, ...artistsList];
    setArtistsList(updated);
    try {
      localStorage.setItem("stagebridge_artists", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateArtist = (updatedArtist: Artist) => {
    const updated = artistsList.map(a => (a.id === updatedArtist.id ? updatedArtist : a));
    setArtistsList(updated);
    try {
      localStorage.setItem("stagebridge_artists", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArtist = (artistId: string) => {
    const updated = artistsList.filter(a => a.id !== artistId);
    setArtistsList(updated);
    // Also remove from featured if present
    if (featuredArtistIds.includes(artistId)) {
      handleSetFeaturedArtistIds(featuredArtistIds.filter(id => id !== artistId));
    }
    try {
      localStorage.setItem("stagebridge_artists", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Blog CRUD Handlers ── */
  const handleAddArticle = (newArticle: BlogArticle) => {
    const updated = [newArticle, ...articlesList];
    setArticlesList(updated);
    try {
      localStorage.setItem("stagebridge_blogs", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateArticle = (updatedArticle: BlogArticle) => {
    const updated = articlesList.map(a => (a.id === updatedArticle.id ? updatedArticle : a));
    setArticlesList(updated);
    try {
      localStorage.setItem("stagebridge_blogs", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArticle = (articleId: string) => {
    const updated = articlesList.filter(a => a.id !== articleId);
    setArticlesList(updated);
    try {
      localStorage.setItem("stagebridge_blogs", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Inquiries & Reset Handlers ── */
  const handleUpdateInquiryStatus = (inquiryId: string, status: BookingInquiry["status"]) => {
    const updated = inquiriesList.map(inq => (inq.id === inquiryId ? { ...inq, status } : inq));
    setInquiriesList(updated);
    try {
      localStorage.setItem("stagebridge_inquiries", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetToDefaults = () => {
    setArtistsList(ALL_ARTISTS);
    setArticlesList(BLOG_ARTICLES);
    setInquiriesList(INITIAL_BOOKING_INQUIRIES);
    setFeaturedArtistIds(["artist-1", "artist-2", "artist-3", "artist-4", "artist-5", "artist-6"]);
    try {
      localStorage.removeItem("stagebridge_artists");
      localStorage.removeItem("stagebridge_blogs");
      localStorage.removeItem("stagebridge_inquiries");
      localStorage.removeItem("stagebridge_featured_ids");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleArticleLike = (articleId: string) => {
    setArticleLikes(prev => {
      const base = prev[articleId] ?? 0;
      const initial = articlesList.find(a => a.id === articleId)?.initialLikes ?? 0;
      const isLiked = base > initial;
      return {
        ...prev,
        [articleId]: isLiked ? base - 1 : base + 1,
      };
    });
  };

  const handleSelectBlogArticle = (article: BlogArticle) => {
    setSelectedBlogArticle(article);
    setCurrentPage("blog-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenGenresPage = () => {
    setCurrentPage("genres");
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
        const el = document.getElementById("featured-performers");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById("featured-performers");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBackHome = () => {
    window.location.hash = "";
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToGenres = () => {
    handleOpenGenresPage();
  };

  return (
    <div className="font-body">
      {/* ONLY show Navbar on homepage! */}
      {currentPage === "home" && (
        <Navbar
          onHome={handleBackHome}
          onBrowseGenres={handleOpenGenresPage}
          onScrollToFeatured={handleScrollToFeatured}
          onBrowseArtists={handleOpenArtists}
          onScrollToBlog={handleOpenJournal}
        />
      )}

      {currentPage === "admin-login" ? (
        /* DEDICATED ADMIN AUTHENTICATION PAGE */
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={handleBackHome}
        />
      ) : currentPage === "admin" ? (
        /* STAGEBRIDGE LIGHT THEMED ADMIN MANAGEMENT PORTAL */
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
        />
      ) : currentPage === "genres" ? (
        /* DEDICATED GENRES CATALOG PAGE WITH RICH BANNER & VIDEOS */
        <>
          <GenresCatalogPage
            onSelectGenre={handleOpenGenre}
            onBackHome={handleBackHome}
            onBrowseArtists={handleOpenArtists}
            artists={artistsList}
          />
          <Footer
            onSelectGenre={handleOpenGenre}
            onBrowseArtists={handleOpenArtists}
            onScrollToBlog={handleOpenJournal}
            onSelectArticle={handleSelectBlogArticle}
            articles={articlesList}
          />
        </>
      ) : currentPage === "journal" ? (
        /* DEDICATED JOURNAL / MAGAZINE PAGE */
        <>
          <JournalPage
            onSelectArticle={handleSelectBlogArticle}
            likes={articleLikes}
            onToggleLike={handleToggleArticleLike}
            onBackHome={handleBackHome}
            onSelectGenre={handleOpenGenre}
            articles={articlesList}
          />
          <Footer
            onSelectGenre={handleOpenGenre}
            onBrowseArtists={handleOpenArtists}
            onScrollToBlog={handleOpenJournal}
            onSelectArticle={handleSelectBlogArticle}
            articles={articlesList}
          />
        </>
      ) : currentPage === "artists" ? (
        /* DEDICATED ARTISTS PAGE: Dynamic banner that morphs by artist type */
        <ArtistsPage
          onBackHome={handleBackHome}
          onSelectArtist={setSelectedArtist}
          onBookArtist={setBookingArtist}
          allArtists={artistsList}
        />
      ) : currentPage === "genre" ? (
        /* DEDICATED SPECIFIC GENRE BANNER PAGE */
        <>
          <GenreView
            genreId={activeGenre}
            onSelectGenre={handleOpenGenre}
            onBack={handleBackHome}
            onSelectArtist={setSelectedArtist}
            onBookArtist={setBookingArtist}
            allArtists={artistsList}
          />
          <Footer
            onSelectGenre={handleOpenGenre}
            onBrowseArtists={handleOpenArtists}
            onScrollToBlog={handleOpenJournal}
            onSelectArticle={handleSelectBlogArticle}
            articles={articlesList}
          />
        </>
      ) : currentPage === "blog-detail" && selectedBlogArticle ? (
        /* DEDICATED FULL-PAGE BLOG ARTICLE VIEW */
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
          <Footer
            onSelectGenre={handleOpenGenre}
            onBrowseArtists={handleOpenArtists}
            onScrollToBlog={handleOpenJournal}
            onSelectArticle={handleSelectBlogArticle}
            articles={articlesList}
          />
        </>
      ) : (
        /* HOMEPAGE VIEW (CLEAN WITHOUT CLUTTERED BLOG EMBED) */
        <>
          <HeroSection
            onBrowseGenres={handleOpenGenresPage}
            onScrollToFeatured={handleScrollToFeatured}
            onSearchGenre={handleOpenGenre}
          />
          <PerformerTicker onSelectGenre={handleOpenGenre} />
          <StatsBar />
          <CategoryShowcase onSelectGenre={handleOpenGenre} />
          <FeaturedArtists
            onSelectArtist={setSelectedArtist}
            onBookArtist={setBookingArtist}
            onViewAll={handleOpenArtists}
            artists={artistsList}
            featuredArtistIds={featuredArtistIds}
          />
          <HowItWorks />
          <WeddingSection onExplore={() => handleOpenGenre("gazal")} />

          <JoinArtistCTA />
          <Footer
            onSelectGenre={handleOpenGenre}
            onBrowseArtists={handleOpenArtists}
            onScrollToBlog={handleOpenJournal}
            onSelectArticle={handleSelectBlogArticle}
            articles={articlesList}
          />
        </>
      )}

      {/* Artist In-Depth Detail Modal */}
      <ArtistDetailModal
        artist={selectedArtist}
        onClose={() => setSelectedArtist(null)}
        onBook={artist => setBookingArtist(artist)}
      />

      {/* Interactive Booking & Rate Calculator Modal */}
      <BookingModal
        artist={bookingArtist}
        onClose={() => setBookingArtist(null)}
      />
    </div>
  );
}
