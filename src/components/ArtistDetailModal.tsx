import { useState } from "react";
import { Artist } from "../data/artistsData";

interface ArtistDetailModalProps {
  artist: Artist | null;
  onClose: () => void;
  onBook: (artist: Artist) => void;
}

export function ArtistDetailModal({ artist, onClose, onBook }: ArtistDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "whatElse" | "setlist" | "reviews" | "tech">("whatElse");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  if (!artist) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <div
        className="relative bg-[#FAF7F2] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-[#EDE8DF] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header / Hero Banner */}
        <div className="relative h-64 sm:h-72 bg-gray-900 overflow-hidden flex-shrink-0">
          <img
            src={artist.img}
            alt={artist.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1916] via-[#1A1916]/50 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer border border-white/20"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Top badges */}
          <div className="absolute top-4 left-5 flex flex-wrap gap-2">
            <span className="bg-[#1A1916]/80 backdrop-blur-md text-[#DDB96A] border border-[#DDB96A]/30 label-editorial text-[9px] px-3 py-1 rounded-full shadow-sm capitalize font-bold">
              {artist.genreTitle}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white font-ui text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
              ✓ Verified Artist
            </span>
          </div>

          {/* Bottom Hero Info */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <span className="label-editorial text-[#DDB96A] block mb-1" style={{ fontSize: "9px" }}>
                {artist.stageName || artist.genreTitle}
              </span>
              <h2
                className="font-serif font-light text-3xl sm:text-4xl tracking-tight leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {artist.name}
              </h2>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-white/85 mt-1 flex-wrap font-ui">
                <span>📍 {artist.city}, {artist.state}</span>
                <span>•</span>
                <span className="text-[#DDB96A] font-bold">★ {artist.rating} ({artist.reviewsCount} reviews)</span>
                <span>•</span>
                <span>🎪 {artist.eventsCompleted}+ Events Completed</span>
              </div>
            </div>

            <div className="text-left sm:text-right flex-shrink-0">
              <div className="label-editorial text-white/70" style={{ fontSize: "8px" }}>STARTING FEE</div>
              <div
                className="font-serif font-light text-2xl sm:text-3xl text-[#DDB96A]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {artist.price}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-[#EDE8DF] bg-[#F5F0E8] px-6 flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { id: "whatElse", label: "✨ Versatility & Styles", badge: `${artist.whatElseTheyDo.length}` },
            { id: "overview", label: "📋 Bio & Details" },
            { id: "setlist", label: "🎵 Repertoire & Audio" },
            { id: "reviews", label: `⭐ Reviews (${artist.reviews.length})` },
            { id: "tech", label: "⚙️ Rider & Setup" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-2 text-xs sm:text-sm font-ui font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "border-[#C4952A] text-[#1A1916]"
                  : "border-transparent text-[#7A776F] hover:text-[#1A1916]"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] bg-[#C4952A]/20 text-[#1A1916] px-1.5 py-0.2 rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-[#FAF7F2]">
          {/* TAB 1: What Else They Do */}
          {activeTab === "whatElse" && (
            <div className="space-y-6">
              <div className="bg-[#F5F0E8] p-5 rounded-2xl border border-[#EDE8DF]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🌟</span>
                  <h3
                    className="font-serif font-light text-xl text-[#1A1916]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Multi-Genre Versatility &amp; Performance Formats
                  </h3>
                </div>
                <p className="font-ui text-xs sm:text-sm text-[#7A776F]">
                  In addition to their signature <strong>{artist.genreTitle}</strong> performances,{" "}
                  <strong>{artist.name}</strong> is exceptionally skilled across these event capabilities:
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {artist.whatElseTheyDo.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-[#EDE8DF] shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="label-editorial text-[#C4952A]" style={{ fontSize: "9px" }}>
                        {skill.category}
                      </span>
                      <span className="text-sm">
                        {skill.icon}
                      </span>
                    </div>
                    <h4 className="font-ui font-semibold text-sm text-[#1A1916]">
                      {skill.description}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Bio & Details */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="label-editorial text-[#C4952A]" style={{ fontSize: "9px" }}>ABOUT THE ENSEMBLE</span>
                <p className="font-ui text-xs sm:text-sm text-[#4A4845] leading-relaxed">
                  {artist.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-[#F5F0E8] p-4 rounded-xl border border-[#EDE8DF]">
                  <span className="label-editorial text-[#7A776F]" style={{ fontSize: "8px" }}>FORMAT</span>
                  <div className="font-ui font-semibold text-sm text-[#1A1916] mt-1">{artist.bandType}</div>
                </div>
                <div className="bg-[#F5F0E8] p-4 rounded-xl border border-[#EDE8DF]">
                  <span className="label-editorial text-[#7A776F]" style={{ fontSize: "8px" }}>SET DURATION</span>
                  <div className="font-ui font-semibold text-sm text-[#1A1916] mt-1">{artist.performanceDuration}</div>
                </div>
                <div className="bg-[#F5F0E8] p-4 rounded-xl border border-[#EDE8DF]">
                  <span className="label-editorial text-[#7A776F]" style={{ fontSize: "8px" }}>EXPERIENCE</span>
                  <div className="font-ui font-semibold text-sm text-[#1A1916] mt-1">{artist.experienceYears} Years</div>
                </div>
                <div className="bg-[#F5F0E8] p-4 rounded-xl border border-[#EDE8DF]">
                  <span className="label-editorial text-[#7A776F]" style={{ fontSize: "8px" }}>TRAVELS FROM</span>
                  <div className="font-ui font-semibold text-sm text-[#1A1916] mt-1">{artist.city}</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="label-editorial text-[#7A776F]" style={{ fontSize: "9px" }}>PRIMARY INSTRUMENTS</span>
                <div className="flex flex-wrap gap-2">
                  {artist.primaryInstruments.map((inst, i) => (
                    <span
                      key={i}
                      className="font-ui text-xs bg-white text-[#1A1916] px-3 py-1 rounded-full border border-[#EDE8DF]"
                    >
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Repertoire & Audio */}
          {activeTab === "setlist" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="label-editorial text-[#C4952A]" style={{ fontSize: "9px" }}>SAMPLE TRACKS &amp; REPERTOIRE</span>
                <div className="space-y-2">
                  {artist.sampleTracks.map((track, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 rounded-xl border border-[#EDE8DF] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-sm font-bold text-[#C4952A]">{i + 1}</span>
                        <div>
                          <div className="font-ui text-sm font-semibold text-[#1A1916]">{track.title}</div>
                          <div className="font-ui text-xs text-[#7A776F]">{track.duration} • {track.type}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setPlayingTrack(playingTrack === track.title ? null : track.title)}
                        className="font-ui px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F5F0E8] hover:bg-[#EDE8DF] text-[#1A1916] transition-colors cursor-pointer border border-[#EDE8DF]"
                      >
                        {playingTrack === track.title ? "⏸ Pause" : "▶ Preview"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DF]">
                <span className="label-editorial text-[#C4952A]" style={{ fontSize: "9px" }}>CLIENT TESTIMONIALS</span>
                <span className="font-ui text-xs font-bold text-[#C4952A]">★ {artist.rating} out of 5</span>
              </div>

              <div className="space-y-3">
                {artist.reviews.map((rev, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-[#EDE8DF] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-ui font-semibold text-sm text-[#1A1916]">{rev.author}</div>
                        <div className="font-ui text-xs text-[#7A776F]">{rev.event} • {rev.city}</div>
                      </div>
                      <div className="text-[#C4952A] text-xs">{"★".repeat(rev.rating)}</div>
                    </div>
                    <p className="font-ui text-xs sm:text-sm text-[#4A4845] italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Tech Rider */}
          {activeTab === "tech" && (
            <div className="space-y-4">
              <h3
                className="font-serif font-light text-xl text-[#1A1916]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Sound &amp; Stage Requirements
              </h3>
              <p className="font-ui text-xs sm:text-sm text-[#7A776F]">
                The artist provides personal instruments and in-ear monitors. The production team is requested to provide:
              </p>
              <div className="bg-[#F5F0E8] p-5 rounded-2xl border border-[#EDE8DF] space-y-2.5">
                {artist.techRider.map((r, i) => (
                  <div key={i} className="font-ui text-xs sm:text-sm text-[#4A4845] flex items-center gap-2.5">
                    <span className="text-[#C4952A] font-bold">✓</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-t border-[#EDE8DF] flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <div className="label-editorial text-[#7A776F]" style={{ fontSize: "8px" }}>STANDARD BOOKING FEE</div>
            <div
              className="font-serif font-light text-2xl text-[#1A1916]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {artist.price} <span className="font-ui text-xs font-normal text-[#7A776F]">/ event</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="font-ui px-5 py-2.5 rounded-full border border-[#1A1916] text-xs font-semibold text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(artist);
              }}
              className="font-ui px-7 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              Plan Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
