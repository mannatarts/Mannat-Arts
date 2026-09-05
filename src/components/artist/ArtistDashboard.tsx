import { useState, useMemo, useEffect } from "react";
import { ArtistApplicationProfile, ClientEnquiry, NotificationItem, User } from "../../types/platform";
import { PlatformStore } from "../../services/platformStore";
import { AuthService } from "../../services/authService";

/* ─── ProfileEditor ─────────────────────────────────────────────────────────── */
const GENRE_OPTIONS = [
  { value: "sufi", label: "Sufi & Mystic" },
  { value: "rock", label: "Rock & Contemporary" },
  { value: "gazal", label: "Ghazal & Nazm" },
  { value: "bollywood", label: "Bollywood & Filmi" },
  { value: "carnival", label: "Carnival & Fusion" },
  { value: "devotional", label: "Devotional & Spiritual" },
];

const BAND_OPTIONS = [
  "Solo", "Duo", "Trio", "4-6 Piece Band", "Full Troupe (8+ Members)"
];

function ProfileEditor({
  artist,
  currentUser,
  onSaved,
}: {
  artist: ArtistApplicationProfile;
  currentUser: User;
  onSaved: (updated: ArtistApplicationProfile) => void;
}) {
  const [form, setForm] = useState<ArtistApplicationProfile>({ ...artist });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [instruments, setInstruments] = useState(artist.primaryInstruments?.join(", ") ?? "");

  const isDirty = JSON.stringify(form) !== JSON.stringify(artist);

  const set = (field: keyof ArtistApplicationProfile, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Artist name is required."); return; }
    if (!form.bio.trim()) { setError("Biography is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const instrArr = instruments.split(",").map(s => s.trim()).filter(Boolean);
      const updated = PlatformStore.updateArtistProfile(artist.id, { ...form, primaryInstruments: instrArr }, currentUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onSaved(updated);
    } catch (err: any) {
      setError(err.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const genreTitle = GENRE_OPTIONS.find(g => g.value === form.genre)?.label ?? form.genreTitle;

  return (
    <div className="max-w-5xl space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex bg-white rounded-xl border border-[#EDE8DF] p-1 gap-1">
          {(["edit", "preview"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize ${
                tab === t ? "bg-[#1A1916] text-[#FAF7F2] shadow-xs" : "text-[#7A776F] hover:text-[#1A1916]"
              }`}
            >
              {t === "edit" ? "✏ Edit Profile" : "👁 Live Preview"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">● Unsaved changes</span>
          )}
          {saved && (
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">✓ Saved!</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
          >
            {saving ? <><span className="w-3 h-3 border-2 border-[#1A1916] border-t-transparent rounded-full animate-spin" />Saving...</> : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <span>⚠️</span><span>{error}</span>
        </div>
      )}

      {/* Status note for pending/changes-requested */}
      {artist.status !== "APPROVED" && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
          <span className="text-lg">📋</span>
          <div>
            <p className="font-semibold">Profile is under review</p>
            <p className="mt-0.5">Changes you make will be re-submitted to the Mannat Arts team for approval before going live.
            {artist.changesRequestedMessage && <span> Admin note: "{artist.changesRequestedMessage}"</span>}
            </p>
          </div>
        </div>
      )}

      {tab === "edit" ? (
        <div className="grid gap-5">
          {/* ── Identity ── */}
          <section className="bg-white rounded-2xl border border-[#EDE8DF] p-6 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A776F]">Identity</h3>

            {/* Profile Photo */}
            <div>
              <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-2">Profile Photo URL</label>
              <div className="flex items-center gap-4">
                <img
                  src={form.img}
                  alt="Preview"
                  className="w-20 h-20 rounded-2xl object-cover border border-[#EDE8DF] flex-shrink-0 shadow-xs"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop"; }}
                />
                <input
                  type="url"
                  value={form.img}
                  onChange={(e) => set("img", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
              <p className="text-[10px] text-[#A8A49A] mt-1.5">Paste a direct image URL. For best results use a square image (min 400×400px).</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Artist / Ensemble Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Stage Name (optional)</label>
                <input
                  type="text"
                  value={form.stageName ?? ""}
                  onChange={(e) => set("stageName", e.target.value)}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Tagline <span className="text-[#A8A49A] font-normal">(shown on cards, 100 chars max)</span></label>
              <input
                type="text"
                maxLength={120}
                value={form.shortBio ?? ""}
                onChange={(e) => set("shortBio", e.target.value)}
                className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
              />
              <p className="text-[10px] text-[#A8A49A] mt-1">{(form.shortBio ?? "").length}/120</p>
            </div>

            <div>
              <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Full Biography *</label>
              <textarea
                rows={5}
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="Tell your artistic story — your journey, musical influences, signature style..."
                className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A] resize-none leading-relaxed"
              />
            </div>
          </section>

          {/* ── Genre & Performance ── */}
          <section className="bg-white rounded-2xl border border-[#EDE8DF] p-6 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A776F]">Genre & Performance</h3>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Primary Genre</label>
                <select
                  value={form.genre}
                  onChange={(e) => {
                    const g = GENRE_OPTIONS.find(o => o.value === e.target.value);
                    set("genre", e.target.value);
                    if (g) set("genreTitle", g.label);
                  }}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                >
                  {GENRE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Band Format</label>
                <select
                  value={form.bandType ?? ""}
                  onChange={(e) => set("bandType", e.target.value)}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                >
                  {BAND_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Experience (years)</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={form.experienceYears ?? ""}
                  onChange={(e) => set("experienceYears", Number(e.target.value))}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Performance Duration</label>
                <input
                  type="text"
                  value={form.performanceDuration ?? ""}
                  onChange={(e) => set("performanceDuration", e.target.value)}
                  placeholder="e.g. 60 - 90 minutes"
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Primary Instruments <span className="text-[#A8A49A] font-normal">(comma separated)</span></label>
                <input
                  type="text"
                  value={instruments}
                  onChange={(e) => setInstruments(e.target.value)}
                  placeholder="e.g. Harmonium, Tabla, Vocals"
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
            </div>
          </section>

          {/* ── Pricing & Location ── */}
          <section className="bg-white rounded-2xl border border-[#EDE8DF] p-6 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A776F]">Pricing & Location</h3>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Starting Honorarium</label>
                <input
                  type="text"
                  value={form.price ?? ""}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="e.g. ₹75,000"
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">State</label>
                <input
                  type="text"
                  value={form.state ?? ""}
                  onChange={(e) => set("state", e.target.value)}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1A1916] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.travelsPanIndia ?? false}
                  onChange={(e) => set("travelsPanIndia", e.target.checked)}
                  className="w-4 h-4 accent-[#C4952A]"
                />
                Available Pan-India
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1A1916] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.travelsInternational ?? false}
                  onChange={(e) => set("travelsInternational", e.target.checked)}
                  className="w-4 h-4 accent-[#C4952A]"
                />
                Available Internationally
              </label>
            </div>
          </section>

          {/* ── Social & Links ── */}
          <section className="bg-white rounded-2xl border border-[#EDE8DF] p-6 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A776F]">Social & Links</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">Instagram Handle</label>
                <input
                  type="text"
                  value={form.instagram ?? ""}
                  onChange={(e) => set("instagram", e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">YouTube Channel</label>
                <input
                  type="text"
                  value={form.youtube ?? ""}
                  onChange={(e) => set("youtube", e.target.value)}
                  placeholder="youtube.com/@yourchannel"
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>
            </div>
          </section>

          {/* Save footer */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-6">
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="flex items-center gap-2 text-sm font-semibold px-8 py-3 rounded-full bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              {saving ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : "💾 Save Profile"}
            </button>
          </div>
        </div>
      ) : (
        /* ── LIVE PREVIEW ── */
        <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 font-semibold flex items-center gap-2">
            <span>👁</span> This is how your public profile card will appear to clients
          </div>

          {/* Hero */}
          <div className="relative h-56 bg-stone-900 overflow-hidden">
            <img
              src={form.img}
              alt={form.name}
              className="w-full h-full object-cover opacity-80"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1000&fit=crop"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1916] via-[#1A1916]/40 to-transparent" />
            <div className="absolute bottom-5 left-6">
              <span className="text-[9px] font-bold text-[#DDB96A] uppercase tracking-widest block mb-1">{genreTitle}</span>
              <h2 className="font-serif text-3xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{form.name || "Your Name"}</h2>
              <p className="text-xs text-white/70 mt-1">{form.city}{form.state ? `, ${form.state}` : ""}</p>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-white/20 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20">✓ Verified Artist</span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Price + Format badges */}
            <div className="flex flex-wrap gap-2">
              {form.price && (
                <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DDB96A]/40 text-[#8C6B1F] text-xs font-bold">{form.price}</span>
              )}
              {form.bandType && (
                <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EDE8DF] text-[#4A4845] text-xs font-medium">{form.bandType}</span>
              )}
              {form.experienceYears && (
                <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EDE8DF] text-[#4A4845] text-xs font-medium">{form.experienceYears} yrs exp</span>
              )}
              {form.travelsPanIndia && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">🇮🇳 Pan India</span>
              )}
            </div>

            {/* Tagline */}
            {form.shortBio && (
              <p className="text-sm text-[#C4952A] font-semibold italic">"{form.shortBio}"</p>
            )}

            {/* Bio */}
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-[#7A776F] font-bold mb-2">About</h4>
              <p className="text-sm text-[#4A4845] leading-relaxed line-clamp-5">{form.bio || "Your biography will appear here."}</p>
            </div>

            {/* Instruments */}
            {instruments.trim() && (
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-[#7A776F] font-bold mb-2">Instruments</h4>
                <div className="flex flex-wrap gap-1.5">
                  {instruments.split(",").map(i => i.trim()).filter(Boolean).map(inst => (
                    <span key={inst} className="px-2.5 py-0.5 bg-[#FAF7F2] border border-[#EDE8DF] rounded-full text-xs text-[#4A4845]">{inst}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Social */}
            {(form.instagram || form.youtube) && (
              <div className="flex items-center gap-4 text-xs text-[#7A776F] pt-1 border-t border-[#EDE8DF]">
                {form.instagram && <span>📸 {form.instagram}</span>}
                {form.youtube && <span>▶ {form.youtube}</span>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ArtistDashboardProps {
  currentUser: User;
  onLogout: () => void;
  onViewPublicProfile: () => void;
  onBackToSite: () => void;
}

type DashView =
  | "home"
  | "profile"
  | "enquiries"
  | "enquiry-detail"
  | "analytics"
  | "notifications"
  | "settings";

export function ArtistDashboard({
  currentUser,
  onLogout,
  onViewPublicProfile,
  onBackToSite,
}: ArtistDashboardProps) {
  const [view, setView] = useState<DashView>("home");
  const [selectedEnquiry, setSelectedEnquiry] = useState<ClientEnquiry | null>(null);
  const [enquiryFilter, setEnquiryFilter] = useState<"all" | "NEW" | "VIEWED" | "RESPONDED" | "ACCEPTED" | "CLOSED">("all");
  const [responseMsg, setResponseMsg] = useState("");
  const [proposedFee, setProposedFee] = useState("");
  const [availability, setAvailability] = useState<"confirmed" | "alternative_date" | "unavailable">("confirmed");
  const [responseSent, setResponseSent] = useState(false);
  const [isSendingResponse, setIsSendingResponse] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    PlatformStore.getNotifications(currentUser.id)
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [_refreshKey, setRefreshKey] = useState(0);

  // Re-read artist from store when profile is saved
  useEffect(() => {
    const handler = () => setRefreshKey(k => k + 1);
    window.addEventListener("mannat-profile-updated", handler);
    return () => window.removeEventListener("mannat-profile-updated", handler);
  }, []);

  const artist = useMemo(() => PlatformStore.getArtistByUserId(currentUser.id), [currentUser.id, _refreshKey]);
  const enquiries = useMemo(() => PlatformStore.getEnquiries(currentUser), [currentUser]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredEnquiries = useMemo(() => {
    if (enquiryFilter === "all") return enquiries;
    return enquiries.filter((e) => e.status === enquiryFilter);
  }, [enquiries, enquiryFilter]);

  const handleViewEnquiry = (enquiry: ClientEnquiry) => {
    // Mark as viewed
    const updated = PlatformStore.markEnquiryViewed(enquiry.id, currentUser);
    setSelectedEnquiry(updated);
    setView("enquiry-detail");
    setResponseSent(false);
    setResponseMsg("");
    setProposedFee("");
  };

  const handleSendResponse = () => {
    if (!selectedEnquiry || !responseMsg.trim()) return;
    setIsSendingResponse(true);
    setTimeout(() => {
      const updated = PlatformStore.respondToEnquiry(
        selectedEnquiry.id,
        { message: responseMsg, proposedFee, availabilityStatus: availability },
        currentUser
      );
      setSelectedEnquiry(updated);
      setIsSendingResponse(false);
      setResponseSent(true);
    }, 700);
  };

  const handleMarkAllRead = () => {
    PlatformStore.markAllNotificationsAsRead(currentUser.id);
    setNotifications(PlatformStore.getNotifications(currentUser.id));
  };

  const handleMarkRead = (id: string) => {
    PlatformStore.markNotificationAsRead(id);
    setNotifications(PlatformStore.getNotifications(currentUser.id));
  };

  if (!artist) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h2 className="font-serif text-2xl text-[#1A1916]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            No artist profile linked.
          </h2>
          <p className="text-sm text-[#7A776F]">Please complete your registration first.</p>
          <button onClick={onBackToSite} className="text-xs font-semibold px-6 py-2.5 rounded-full bg-[#1A1916] text-[#FAF7F2] cursor-pointer">
            Back to Site
          </button>
        </div>
      </div>
    );
  }

  const completionPct = artist.completionPercentage ?? PlatformStore.calculateCompletion(artist);

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      NEW: "bg-blue-50 border-blue-200 text-blue-800",
      VIEWED: "bg-amber-50 border-amber-200 text-amber-800",
      RESPONDED: "bg-emerald-50 border-emerald-200 text-emerald-800",
      ACCEPTED: "bg-green-100 border-green-300 text-green-900",
      DECLINED: "bg-red-50 border-red-200 text-red-700",
      CLOSED: "bg-stone-100 border-stone-300 text-stone-600",
      INTERESTED: "bg-purple-50 border-purple-200 text-purple-800",
    };
    return `px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${map[s] ?? "bg-stone-100 text-stone-600 border-stone-200"}`;
  };

  const navItems: { id: DashView; label: string; icon: string; badge?: number }[] = [
    { id: "home", label: "Dashboard", icon: "⊞" },
    { id: "enquiries", label: "Enquiries", icon: "✉", badge: enquiries.filter(e => e.status === "NEW").length || undefined },
    { id: "profile", label: "My Profile", icon: "◎" },
    { id: "analytics", label: "Analytics", icon: "↗" },
    { id: "notifications", label: "Notifications", icon: "🔔", badge: unreadCount || undefined },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1A1916] flex" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* ─── SIDEBAR ─── */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-[#EDE8DF] flex flex-col z-40 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-[#EDE8DF]">
          <button onClick={onBackToSite} className="cursor-pointer text-left">
            <span className="font-serif text-lg font-light text-[#1A1916] block" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              MANNAT ARTS
            </span>
            <span className="text-[7px] font-bold text-[#C4952A] tracking-[0.2em] uppercase font-ui">ARTIST DASHBOARD</span>
          </button>
        </div>

        {/* Artist Mini Card */}
        <div className="px-5 py-4 border-b border-[#EDE8DF]">
          <div className="flex items-center gap-3">
            <img src={artist.img} alt={artist.name} className="w-10 h-10 rounded-full object-cover border border-[#EDE8DF]" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#1A1916] truncate">{artist.name}</p>
              <p className="text-[10px] text-[#7A776F] truncate">{artist.genreTitle}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] text-[#7A776F] mb-1">
              <span>Profile Completion</span>
              <span className="font-bold text-[#1A1916]">{completionPct}%</span>
            </div>
            <div className="h-1.5 bg-[#EDE8DF] rounded-full overflow-hidden">
              <div className="h-full bg-[#C4952A] rounded-full transition-all" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
          <div className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase ${
            artist.status === "APPROVED" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
            artist.status === "PENDING_REVIEW" ? "bg-amber-50 border-amber-200 text-amber-800" :
            artist.status === "CHANGES_REQUESTED" ? "bg-orange-50 border-orange-200 text-orange-800" :
            "bg-stone-100 border-stone-200 text-stone-600"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${artist.status === "APPROVED" ? "bg-emerald-500" : "bg-amber-400"}`} />
            {artist.status.replace(/_/g, " ")}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                view === item.id || (view === "enquiry-detail" && item.id === "enquiries")
                  ? "bg-[#1A1916] text-[#FAF7F2] shadow-sm"
                  : "text-[#4A4845] hover:bg-[#FAF7F2]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className="bg-[#C4952A] text-[#1A1916] text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center px-1.5 py-0.5">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#EDE8DF] space-y-2">
          <button
            onClick={onViewPublicProfile}
            className="w-full text-xs font-semibold py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-[#1A1916] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>👁</span> View Public Profile
          </button>
          <button
            onClick={onLogout}
            className="w-full text-xs font-semibold py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#EDE8DF] px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-[#EDE8DF] cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>
            <h1 className="font-serif font-light text-xl text-[#1A1916] hidden sm:block" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {view === "home" ? `Welcome back, ${artist.name.split(" ")[0]}` :
               view === "enquiries" ? "Client Enquiries" :
               view === "enquiry-detail" ? "Enquiry Details" :
               view === "profile" ? "My Artist Profile" :
               view === "analytics" ? "Performance Analytics" :
               view === "notifications" ? "Notifications" : "Account Settings"}
            </h1>
          </div>
          <button
            onClick={() => setView("notifications")}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FAF7F2] border border-transparent hover:border-[#EDE8DF] transition-all cursor-pointer text-base"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C4952A] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* ══ HOME / DASHBOARD VIEW ══ */}
          {view === "home" && (
            <div className="space-y-6 max-w-5xl">
              {/* Alert for changes requested */}
              {artist.status === "CHANGES_REQUESTED" && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <span className="text-amber-600 text-lg mt-0.5">⚠</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Your profile needs changes.</p>
                    <p className="text-xs text-amber-800 mt-0.5">Admin note: "{artist.changesRequestedMessage}"</p>
                    <button className="mt-2 text-xs font-bold text-amber-900 underline cursor-pointer" onClick={() => setView("profile")}>
                      Update Profile →
                    </button>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Profile Status", value: artist.status.replace(/_/g, " "), color: artist.status === "APPROVED" ? "text-emerald-700" : "text-amber-700", sub: "Current" },
                  { label: "Profile Views", value: (artist.profileViews || 0).toLocaleString(), color: "text-[#C4952A]", sub: "This month" },
                  { label: "New Enquiries", value: enquiries.filter(e => e.status === "NEW").length, color: "text-blue-700", sub: "Awaiting response" },
                  { label: "Total Enquiries", value: enquiries.length, color: "text-[#1A1916]", sub: "All time" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 border border-[#EDE8DF] shadow-xs">
                    <p className="text-[10px] text-[#7A776F] uppercase tracking-wide font-semibold mb-1">{stat.label}</p>
                    <p className={`font-serif text-2xl font-light ${stat.color}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-[#A8A49A] mt-1">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Profile Completion */}
              {completionPct < 100 && (
                <div className="bg-white rounded-2xl p-5 border border-[#EDE8DF]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1A1916]">Profile Completion — {completionPct}%</h3>
                      <p className="text-xs text-[#7A776F] mt-0.5">A complete profile gets 3x more enquiries.</p>
                    </div>
                    <button onClick={() => setView("profile")} className="text-xs font-semibold text-[#C4952A] hover:underline cursor-pointer">
                      Complete Profile →
                    </button>
                  </div>
                  <div className="h-2 bg-[#EDE8DF] rounded-full">
                    <div className="h-2 bg-gradient-to-r from-[#C4952A] to-[#DDB96A] rounded-full transition-all" style={{ width: `${completionPct}%` }} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {completionPct < 100 && !artist.videoLinks?.length && (
                      <span className="text-[10px] px-2.5 py-1 bg-[#FAF7F2] border border-[#EDE8DF] rounded-full text-[#7A776F]">+ Add a performance video</span>
                    )}
                    {(!artist.portfolioImages || artist.portfolioImages.length < 3) && (
                      <span className="text-[10px] px-2.5 py-1 bg-[#FAF7F2] border border-[#EDE8DF] rounded-full text-[#7A776F]">+ Add 3+ portfolio images</span>
                    )}
                    {!artist.instagram && (
                      <span className="text-[10px] px-2.5 py-1 bg-[#FAF7F2] border border-[#EDE8DF] rounded-full text-[#7A776F]">+ Connect Instagram</span>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Enquiries */}
              <div className="bg-white rounded-2xl border border-[#EDE8DF]">
                <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#1A1916]">Recent Enquiries</h3>
                  <button onClick={() => setView("enquiries")} className="text-xs text-[#C4952A] hover:underline cursor-pointer font-semibold">
                    View All
                  </button>
                </div>
                {enquiries.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-4xl mb-3">✉</div>
                    <p className="text-sm font-semibold text-[#1A1916] mb-1">No enquiries yet.</p>
                    <p className="text-xs text-[#7A776F] max-w-xs mx-auto">
                      When clients discover your profile, new booking enquiries will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#EDE8DF]">
                    {enquiries.slice(0, 5).map((enq) => (
                      <div key={enq.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-[#1A1916]">{enq.eventType}</span>
                            <span className={statusBadge(enq.status)}>{enq.status}</span>
                          </div>
                          <p className="text-xs text-[#7A776F] mt-0.5">
                            {enq.clientName} · {enq.eventLocation} · {new Date(enq.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <button
                          onClick={() => handleViewEnquiry(enq)}
                          className="text-xs font-semibold px-4 py-1.5 rounded-full border border-[#EDE8DF] hover:border-[#C4952A] text-[#1A1916] whitespace-nowrap cursor-pointer transition-all"
                        >
                          View →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ ENQUIRIES LIST VIEW ══ */}
          {view === "enquiries" && (
            <div className="space-y-5 max-w-4xl">
              <div className="flex items-center gap-2 flex-wrap">
                {(["all", "NEW", "VIEWED", "RESPONDED", "ACCEPTED", "CLOSED"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setEnquiryFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      enquiryFilter === f
                        ? "bg-[#1A1916] text-[#FAF7F2] border-[#1A1916]"
                        : "bg-white text-[#7A776F] border-[#EDE8DF] hover:border-[#C4952A]"
                    }`}
                  >
                    {f === "all" ? `All (${enquiries.length})` : `${f} (${enquiries.filter(e => e.status === f).length})`}
                  </button>
                ))}
              </div>

              {filteredEnquiries.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#EDE8DF]">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm font-semibold text-[#1A1916]">No {enquiryFilter !== "all" ? enquiryFilter.toLowerCase() : ""} enquiries yet.</p>
                  <p className="text-xs text-[#7A776F] mt-1">When clients send bookings, they will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEnquiries.map((enq) => (
                    <div key={enq.id} className="bg-white rounded-2xl border border-[#EDE8DF] p-5 hover:border-[#C4952A]/40 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-sm text-[#1A1916] uppercase tracking-wide">{enq.eventType}</span>
                            <span className={statusBadge(enq.status)}>{enq.status}</span>
                            <span className="text-[10px] text-[#A8A49A] font-mono">{enq.id}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#7A776F] mt-2">
                            <div>
                              <span className="text-[10px] uppercase tracking-wide text-[#A8A49A]">Client</span>
                              <p className="font-semibold text-[#1A1916] text-[11px]">{enq.clientName}</p>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wide text-[#A8A49A]">Date</span>
                              <p className="font-semibold text-[#1A1916] text-[11px]">{new Date(enq.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wide text-[#A8A49A]">Location</span>
                              <p className="font-semibold text-[#1A1916] text-[11px] truncate">{enq.eventLocation}</p>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wide text-[#A8A49A]">Audience</span>
                              <p className="font-semibold text-[#1A1916] text-[11px]">{enq.audienceSize}</p>
                            </div>
                          </div>
                          {enq.preferredMood && (
                            <p className="text-xs text-[#7A776F] mt-2">
                              Mood: <span className="font-semibold text-[#C4952A]">{enq.preferredMood}</span>
                              {enq.budgetRange && <> · Budget: <span className="font-semibold text-[#1A1916]">{enq.budgetRange}</span></>}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleViewEnquiry(enq)}
                          className="text-xs font-semibold px-4 py-2 rounded-full bg-[#1A1916] text-[#FAF7F2] hover:bg-[#2E2C28] whitespace-nowrap cursor-pointer transition-all shadow-xs"
                        >
                          View Enquiry
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ ENQUIRY DETAIL VIEW ══ */}
          {view === "enquiry-detail" && selectedEnquiry && (
            <div className="max-w-3xl space-y-5">
              <button onClick={() => setView("enquiries")} className="text-xs font-semibold text-[#7A776F] hover:text-[#1A1916] cursor-pointer flex items-center gap-1">
                ← Back to Enquiries
              </button>

              <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-[#FAF7F2] border-b border-[#EDE8DF]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-serif text-xl text-[#1A1916]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {selectedEnquiry.eventType}
                        </h2>
                        <span className={statusBadge(selectedEnquiry.status)}>{selectedEnquiry.status}</span>
                      </div>
                      <p className="text-xs text-[#7A776F] font-mono">{selectedEnquiry.id} · Received {new Date(selectedEnquiry.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Client & Event Info */}
                <div className="p-6 grid sm:grid-cols-2 gap-6 border-b border-[#EDE8DF]">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-[#7A776F] font-semibold mb-3">Client Information</h4>
                    <div className="space-y-2 text-xs">
                      <p><span className="text-[#A8A49A]">Name: </span><span className="font-semibold text-[#1A1916]">{selectedEnquiry.clientName}</span></p>
                      <p><span className="text-[#A8A49A]">Email: </span><span className="font-semibold text-[#1A1916]">{selectedEnquiry.clientEmail}</span></p>
                      <p><span className="text-[#A8A49A]">Phone: </span><span className="font-semibold text-[#1A1916]">{selectedEnquiry.clientPhone}</span></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-[#7A776F] font-semibold mb-3">Event Details</h4>
                    <div className="space-y-2 text-xs">
                      <p><span className="text-[#A8A49A]">Date: </span><span className="font-semibold text-[#1A1916]">{new Date(selectedEnquiry.eventDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span></p>
                      <p><span className="text-[#A8A49A]">Location: </span><span className="font-semibold text-[#1A1916]">{selectedEnquiry.eventLocation}</span></p>
                      <p><span className="text-[#A8A49A]">Audience: </span><span className="font-semibold text-[#1A1916]">{selectedEnquiry.audienceSize}</span></p>
                      {selectedEnquiry.budgetRange && (
                        <p><span className="text-[#A8A49A]">Budget: </span><span className="font-semibold text-[#C4952A]">{selectedEnquiry.budgetRange}</span></p>
                      )}
                      {selectedEnquiry.preferredMood && (
                        <p><span className="text-[#A8A49A]">Mood: </span><span className="font-semibold text-[#1A1916]">{selectedEnquiry.preferredMood}</span></p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="p-6 border-b border-[#EDE8DF]">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#7A776F] font-semibold mb-3">Client Message</h4>
                  <p className="text-sm text-[#4A4845] leading-relaxed italic bg-[#FAF7F2] p-4 rounded-xl border border-[#EDE8DF]">
                    "{selectedEnquiry.message}"
                  </p>
                </div>

                {/* Artist Response (if already sent) */}
                {selectedEnquiry.artistResponse && (
                  <div className="p-6 bg-emerald-50/40 border-b border-[#EDE8DF]">
                    <h4 className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold mb-3">Your Response (Sent)</h4>
                    <div className="space-y-2 text-xs">
                      <p className="text-sm text-[#4A4845] leading-relaxed bg-white p-4 rounded-xl border border-emerald-200">
                        {selectedEnquiry.artistResponse.message}
                      </p>
                      {selectedEnquiry.artistResponse.proposedFee && (
                        <p><span className="text-[#7A776F]">Proposed Fee: </span><span className="font-semibold text-[#C4952A]">{selectedEnquiry.artistResponse.proposedFee}</span></p>
                      )}
                      <p><span className="text-[#7A776F]">Availability: </span>
                        <span className={`font-semibold ${selectedEnquiry.artistResponse.availabilityStatus === "confirmed" ? "text-emerald-700" : selectedEnquiry.artistResponse.availabilityStatus === "unavailable" ? "text-red-600" : "text-amber-700"}`}>
                          {selectedEnquiry.artistResponse.availabilityStatus === "confirmed" ? "✓ Confirmed Available" : selectedEnquiry.artistResponse.availabilityStatus === "unavailable" ? "✗ Unavailable" : "~ Alternative date can be arranged"}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Response Form */}
                {!selectedEnquiry.artistResponse && (
                  <div className="p-6">
                    <h4 className="text-xs font-bold text-[#1A1916] mb-4 uppercase tracking-wide">Send Your Response</h4>
                    {responseSent ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                        <div className="text-2xl mb-2">✓</div>
                        <p className="text-sm font-semibold text-emerald-800">Response sent successfully!</p>
                        <p className="text-xs text-emerald-700 mt-1">The client has been notified.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">Your Response Message *</label>
                          <textarea
                            rows={4}
                            value={responseMsg}
                            onChange={(e) => setResponseMsg(e.target.value)}
                            placeholder="Introduce yourself, confirm your interest, describe your performance for their event..."
                            className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl p-3 focus:outline-none focus:border-[#C4952A]"
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">Proposed Performance Fee (Optional)</label>
                            <input
                              type="text"
                              value={proposedFee}
                              onChange={(e) => setProposedFee(e.target.value)}
                              placeholder="e.g. ₹1,20,000"
                              className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C4952A]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">Availability for This Date</label>
                            <select
                              value={availability}
                              onChange={(e) => setAvailability(e.target.value as any)}
                              className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2.5 focus:outline-none"
                            >
                              <option value="confirmed">✓ Confirmed Available</option>
                              <option value="alternative_date">~ Can arrange alternative date</option>
                              <option value="unavailable">✗ Unavailable for this date</option>
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={handleSendResponse}
                          disabled={isSendingResponse || !responseMsg.trim()}
                          className="text-xs font-semibold px-8 py-3 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSendingResponse ? (
                            <><span className="w-3 h-3 border-2 border-[#1A1916] border-t-transparent rounded-full animate-spin" />Sending...</>
                          ) : "Send Response →"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline */}
                {selectedEnquiry.timeline && selectedEnquiry.timeline.length > 0 && (
                  <div className="p-6 border-t border-[#EDE8DF]">
                    <h4 className="text-[10px] uppercase tracking-widest text-[#7A776F] font-semibold mb-4">Enquiry Timeline</h4>
                    <div className="space-y-3">
                      {selectedEnquiry.timeline.map((event, idx) => (
                        <div key={event.id} className="flex gap-3 text-xs">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-[#EDE8DF] flex items-center justify-center text-[10px] font-bold text-[#7A776F]">
                              {idx + 1}
                            </div>
                            {idx < selectedEnquiry.timeline.length - 1 && (
                              <div className="w-px h-full bg-[#EDE8DF] mt-1" />
                            )}
                          </div>
                          <div className="pb-3">
                            <p className="font-semibold text-[#1A1916]">{event.action}</p>
                            <p className="text-[#7A776F] text-[11px]">{event.description}</p>
                            <p className="text-[10px] text-[#A8A49A] mt-0.5 font-mono">
                              {new Date(event.timestamp).toLocaleDateString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ ANALYTICS VIEW ══ */}
          {view === "analytics" && (
            <div className="max-w-4xl space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Profile Views", value: artist.profileViews || 0, icon: "👁", color: "text-[#C4952A]" },
                  { label: "Total Enquiries", value: enquiries.length, icon: "✉", color: "text-blue-700" },
                  { label: "Responded", value: enquiries.filter(e => e.artistResponse).length, icon: "✓", color: "text-emerald-700" },
                  {
                    label: "Response Rate",
                    value: enquiries.length > 0
                      ? Math.round((enquiries.filter(e => e.artistResponse).length / enquiries.length) * 100) + "%"
                      : "—",
                    icon: "📊",
                    color: "text-purple-700"
                  },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 border border-[#EDE8DF] text-center">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className={`font-serif text-3xl font-light ${stat.color}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {stat.value}
                    </div>
                    <p className="text-[10px] text-[#7A776F] uppercase tracking-wide font-semibold mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6">
                <h3 className="text-sm font-semibold text-[#1A1916] mb-4">Enquiry Breakdown by Status</h3>
                <div className="space-y-3">
                  {(["NEW", "VIEWED", "RESPONDED", "ACCEPTED", "CLOSED"] as const).map((s) => {
                    const count = enquiries.filter(e => e.status === s).length;
                    const pct = enquiries.length > 0 ? (count / enquiries.length) * 100 : 0;
                    return (
                      <div key={s} className="flex items-center gap-3 text-xs">
                        <span className="w-20 text-[#7A776F] font-semibold">{s}</span>
                        <div className="flex-1 h-2.5 bg-[#EDE8DF] rounded-full">
                          <div className="h-full bg-[#C4952A] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-right font-mono font-bold text-[#1A1916]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══ NOTIFICATIONS VIEW ══ */}
          {view === "notifications" && (
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1A1916]">All Notifications</h2>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs font-semibold text-[#C4952A] hover:underline cursor-pointer">
                    Mark all as read
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#EDE8DF]">
                  <div className="text-4xl mb-3">🔔</div>
                  <p className="text-sm font-semibold text-[#1A1916]">No notifications yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      className={`bg-white rounded-2xl border p-4 flex items-start gap-3 cursor-pointer transition-all ${n.isRead ? "border-[#EDE8DF] opacity-70" : "border-[#C4952A]/30 shadow-xs"}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                        n.type === "enquiry" ? "bg-blue-50 text-blue-600" :
                        n.type === "application" ? "bg-amber-50 text-amber-600" :
                        n.type === "response" ? "bg-emerald-50 text-emerald-600" :
                        "bg-stone-100 text-stone-600"
                      }`}>
                        {n.type === "enquiry" ? "✉" : n.type === "application" ? "📋" : n.type === "response" ? "✓" : "📢"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1A1916]">{n.title}</p>
                        <p className="text-[11px] text-[#7A776F] mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-[#A8A49A] mt-1 font-mono">
                          {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#C4952A] mt-1.5 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ PROFILE VIEW ══ */}
          {view === "profile" && (
            <ProfileEditor
              artist={artist}
              currentUser={currentUser}
              onSaved={(updated) => {
                // Force a re-render by updating component key via a side-effect
                // The artist value is memoized from PlatformStore, so we trigger a re-read
                window.dispatchEvent(new Event("mannat-profile-updated"));
              }}
            />
          )}

          {/* ══ SETTINGS VIEW ══ */}
          {view === "settings" && (
            <div className="max-w-2xl space-y-5">
              <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 space-y-4">
                <h3 className="text-sm font-semibold text-[#1A1916]">Account Information</h3>
                <div className="space-y-3 text-xs">
                  <div><span className="text-[#7A776F]">Name: </span><span className="font-semibold">{currentUser.name}</span></div>
                  <div><span className="text-[#7A776F]">Email: </span><span className="font-semibold">{currentUser.email}</span></div>
                  <div><span className="text-[#7A776F]">Role: </span><span className="font-semibold capitalize">{currentUser.role}</span></div>
                  <div><span className="text-[#7A776F]">Status: </span><span className="font-semibold">{currentUser.status}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6">
                <h3 className="text-sm font-semibold text-[#1A1916] mb-4">Actions</h3>
                <button
                  onClick={onLogout}
                  className="text-xs font-semibold px-6 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer transition-all"
                >
                  Sign Out of Artist Portal
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
