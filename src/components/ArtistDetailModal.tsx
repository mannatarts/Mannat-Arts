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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-[#F3E5E8] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header / Hero Banner */}
        <div className="relative h-64 sm:h-72 bg-gray-900 overflow-hidden flex-shrink-0">
          <img
            src={artist.img}
            alt={artist.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120104] via-[#120104]/50 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer border border-white/20"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-[#E11D48] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <span>{artist.genreTitle}</span>
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
              ✓ Verified Artist
            </span>
          </div>

          {/* Bottom Hero Info */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <div className="text-xs text-white/80 font-medium uppercase tracking-wider mb-0.5">
                {artist.stageName || artist.genreTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                {artist.name}
              </h2>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-white/85 mt-1 flex-wrap">
                <span>📍 {artist.city}, {artist.state}</span>
                <span>•</span>
                <span className="text-yellow-400 font-bold">★ {artist.rating} ({artist.reviewsCount} reviews)</span>
                <span>•</span>
                <span>🎪 {artist.eventsCompleted}+ Events</span>
              </div>
            </div>

            <div className="text-left sm:text-right flex-shrink-0">
              <div className="text-xs text-white/70">Starting Fee</div>
              <div className="font-display font-bold text-2xl sm:text-3xl text-[#FB7185]">
                {artist.price}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-[#F3E5E8] bg-[#FFF8F8] px-6 flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { id: "whatElse", label: "✨ What This Artist Also Does", badge: `${artist.whatElseTheyDo.length} Skills` },
            { id: "overview", label: "📋 Bio & Details" },
            { id: "setlist", label: "🎵 Repertoire & Audio" },
            { id: "reviews", label: `⭐ Reviews (${artist.reviews.length})` },
            { id: "tech", label: "⚙️ Rider & Setup" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "border-[#E11D48] text-[#E11D48]"
                  : "border-transparent text-[#5B5B5B] hover:text-[#1A1A1A]"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] bg-[#E11D48]/10 text-[#E11D48] px-1.5 py-0.5 rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
          {/* TAB 1: What Else They Do (Highlighted Feature) */}
          {activeTab === "whatElse" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#FFF0F3] via-[#FFE4E6] to-[#FFF5F5] p-5 rounded-2xl border border-[#FCE7E9]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🌟</span>
                  <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
                    Multi-Genre Versatility &amp; Performance Styles
                  </h3>
                </div>
                <p className="font-body text-xs sm:text-sm text-[#5B5B5B]">
                  In addition to their signature <strong>{artist.genreTitle}</strong> performances,{" "}
                  <strong>{artist.name}</strong> is exceptionally skilled across these additional formats and event capabilities:
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {artist.whatElseTheyDo.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#FFF8F8] border border-[#F3E5E8] hover:border-[#E11D48]/40 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-[#F3E5E8] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <h4 className="font-display font-bold text-base text-[#1A1A1A] group-hover:text-[#E11D48] transition-colors">
                        {item.category}
                      </h4>
                    </div>
                    <p className="font-body text-xs sm:text-sm text-[#5B5B5B] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick capabilities checklist */}
              <div className="bg-white rounded-2xl p-5 border border-[#F3E5E8] shadow-sm">
                <h4 className="font-display font-bold text-sm text-[#1A1A1A] mb-3">
                  Event Types Handled Regularly:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Destination Weddings", "Sangeet & Cocktail Nights", "College & Campus Fests", "Corporate Galas & Awards", "VIP Private Baithaks", "Public Music Festivals", "Spiritual Gatherings"].map(t => (
                    <span key={t} className="text-xs font-medium bg-[#FFF5F6] text-[#BE123C] px-3 py-1 rounded-full border border-[#FCE7E9]">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Overview & Bio */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-2">
                  About {artist.name}
                </h3>
                <p className="font-body text-sm text-[#5B5B5B] leading-relaxed">
                  {artist.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#F3E5E8]">
                  <div className="text-xs text-[#5B5B5B]">Band Format</div>
                  <div className="font-display font-bold text-base text-[#1A1A1A] mt-1">{artist.bandType}</div>
                </div>
                <div className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#F3E5E8]">
                  <div className="text-xs text-[#5B5B5B]">Experience</div>
                  <div className="font-display font-bold text-base text-[#1A1A1A] mt-1">{artist.experienceYears} Years Active</div>
                </div>
                <div className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#F3E5E8]">
                  <div className="text-xs text-[#5B5B5B]">Show Duration</div>
                  <div className="font-display font-bold text-base text-[#1A1A1A] mt-1">{artist.performanceDuration}</div>
                </div>
                <div className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#F3E5E8]">
                  <div className="text-xs text-[#5B5B5B]">Travel Range</div>
                  <div className="font-display font-bold text-base text-[#1A1A1A] mt-1">Pan-India &amp; Global</div>
                </div>
              </div>

              <div>
                <h4 className="font-display font-bold text-sm text-[#1A1A1A] mb-3">
                  Core Instruments &amp; Gear
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artist.primaryInstruments.map(inst => (
                    <span key={inst} className="text-xs font-semibold bg-white border border-[#E11D48]/30 text-[#BE123C] px-3.5 py-1.5 rounded-full shadow-sm">
                      🎵 {inst}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Setlist & Audio Samples */}
          {activeTab === "setlist" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-1">
                  Sample Audio Previews
                </h3>
                <p className="font-body text-xs text-[#5B5B5B] mb-4">
                  Listen to live recordings from recent performances.
                </p>

                <div className="space-y-3">
                  {artist.sampleTracks.map(track => {
                    const isPlaying = playingTrack === track.title;
                    return (
                      <div
                        key={track.title}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                          isPlaying
                            ? "bg-[#FFF0F3] border-[#E11D48] shadow-sm"
                            : "bg-[#FFF8F8] border-[#F3E5E8] hover:border-[#E11D48]/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => setPlayingTrack(isPlaying ? null : track.title)}
                            className="w-10 h-10 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform flex-shrink-0 cursor-pointer"
                          >
                            {isPlaying ? "❚❚" : "▶"}
                          </button>
                          <div className="min-w-0">
                            <div className="font-display font-bold text-sm text-[#1A1A1A] truncate">{track.title}</div>
                            <div className="font-body text-xs text-[#5B5B5B] flex items-center gap-2">
                              <span>{track.type}</span>
                              <span>•</span>
                              <span>{track.duration}</span>
                            </div>
                          </div>
                        </div>

                        {isPlaying && (
                          <div className="flex items-end gap-1 h-6">
                            {[40, 80, 60, 100, 75, 45, 90].map((h, i) => (
                              <div
                                key={i}
                                className="w-1 bg-[#E11D48] rounded-full animate-wave-bar"
                                style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">
                  Popular Repertoire &amp; Song List
                </h3>
                <div className="bg-[#FFF8F8] p-5 rounded-2xl border border-[#F3E5E8]">
                  <ul className="space-y-2">
                    {artist.sampleSetlist.map((song, i) => (
                      <li key={i} className="font-body text-xs sm:text-sm text-[#4A4A4A] flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#E11D48]/10 text-[#E11D48] text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <span>{song}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
                  Client Feedback ({artist.reviewsCount})
                </h3>
                <div className="flex items-center gap-1.5 text-[#E11D48] font-bold text-sm">
                  <span>★ {artist.rating} out of 5.0</span>
                </div>
              </div>

              <div className="space-y-3">
                {artist.reviews.map((rev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#FFF8F8] border border-[#F3E5E8]">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-display font-bold text-sm text-[#1A1A1A]">{rev.author}</div>
                        <div className="font-body text-xs text-[#5B5B5B]">{rev.event} • {rev.city}</div>
                      </div>
                      <div className="text-yellow-400 text-xs">{"★".repeat(rev.rating)}</div>
                    </div>
                    <p className="font-body text-xs sm:text-sm text-[#4A4A4A] italic leading-relaxed">
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
              <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
                Sound &amp; Stage Requirements
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#5B5B5B]">
                The artist provides their personal instruments and in-ear monitors. The venue or event production team is requested to provide:
              </p>
              <div className="bg-[#FFF8F8] p-5 rounded-2xl border border-[#F3E5E8] space-y-2">
                {artist.techRider.map((r, i) => (
                  <div key={i} className="font-body text-xs sm:text-sm text-[#4A4A4A] flex items-center gap-2">
                    <span className="text-[#E11D48] font-bold">✓</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#F3E5E8] flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <div className="text-xs text-[#5B5B5B]">Standard Booking Fee</div>
            <div className="font-display font-bold text-xl sm:text-2xl text-[#E11D48]">
              {artist.price} <span className="text-xs font-normal text-[#5B5B5B]">/ event</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-[#5B5B5B] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(artist);
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#BE123C] text-white font-bold text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>⚡ Book This Artist</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
