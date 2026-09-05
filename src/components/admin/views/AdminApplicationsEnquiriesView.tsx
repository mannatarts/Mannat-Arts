import { useState, useMemo } from "react";
import { ArtistApplicationProfile, ClientEnquiry, User } from "../../../types/platform";
import { PlatformStore } from "../../../services/platformStore";
import { AuthService } from "../../../services/authService";

interface AdminApplicationsEnquiriesViewProps {
  onSyncArtistToCMS?: (artist: any) => void;
  onToast?: (msg: string, type?: "success" | "info" | "warning") => void;
}

export function AdminApplicationsEnquiriesView({
  onSyncArtistToCMS,
  onToast = () => {},
}: AdminApplicationsEnquiriesViewProps) {
  const [tab, setTab] = useState<"applications" | "enquiries" | "activity">("applications");
  const [appFilter, setAppFilter] = useState<"ALL" | "PENDING_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "REJECTED">("PENDING_REVIEW");
  const [selectedApp, setSelectedApp] = useState<ArtistApplicationProfile | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ClientEnquiry | null>(null);

  // Modal / action state for applications
  const [actionType, setActionType] = useState<"approve" | "changes" | "reject" | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Query fresh platform state
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refresh = () => setRefreshTrigger((p) => p + 1);

  const applications = useMemo(() => PlatformStore.getArtists(), [refreshTrigger]);
  const enquiries = useMemo(() => PlatformStore.getAllEnquiries(), [refreshTrigger]);
  const activityLogs = useMemo(() => PlatformStore.getActivityLogs(50), [refreshTrigger]);

  const filteredApps = useMemo(() => {
    if (appFilter === "ALL") return applications;
    return applications.filter((a) => a.status === appFilter);
  }, [applications, appFilter]);

  const currentUser: User = useMemo(() => {
    const user = AuthService.getCurrentUser();
    if (user && user.role === "admin") return user;
    return {
      id: user?.id ? `admin-${user.id}` : "admin-desk",
      email: user?.email || "curators@mannatarts.com",
      name: user?.name ? `${user.name} (Admin Desk)` : "Mannat Curation Desk",
      role: "admin",
      status: "active",
      createdAt: new Date().toISOString(),
    };
  }, []);

  const handleApprove = (app: ArtistApplicationProfile) => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const updated = PlatformStore.updateArtistStatus(app.id, "APPROVED", currentUser, {
          notes: adminNotes || "Approved for public curation.",
        });
        setIsProcessing(false);
        setActionType(null);
        setSelectedApp(updated);
        refresh();
        onToast(`Artist "${updated.stageName || updated.name}" approved and published to platform!`, "success");
        onSyncArtistToCMS?.(updated);
      } catch (err: any) {
        setIsProcessing(false);
        onToast(err?.message || "Failed to approve artist.", "warning");
      }
    }, 400);
  };

  const handleRequestChanges = (app: ArtistApplicationProfile) => {
    if (!actionReason.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const updated = PlatformStore.updateArtistStatus(app.id, "CHANGES_REQUESTED", currentUser, {
          reason: actionReason.trim(),
          notes: adminNotes,
        });
        setIsProcessing(false);
        setActionType(null);
        setActionReason("");
        setSelectedApp(updated);
        refresh();
        onToast(`Changes requested from "${updated.stageName || updated.name}".`, "warning");
      } catch (err: any) {
        setIsProcessing(false);
        onToast(err?.message || "Failed to request changes.", "warning");
      }
    }, 400);
  };

  const handleReject = (app: ArtistApplicationProfile) => {
    if (!actionReason.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const updated = PlatformStore.updateArtistStatus(app.id, "REJECTED", currentUser, {
          reason: actionReason.trim(),
          notes: adminNotes,
        });
        setIsProcessing(false);
        setActionType(null);
        setActionReason("");
        setSelectedApp(updated);
        refresh();
        onToast(`Application from "${updated.stageName || updated.name}" rejected.`, "info");
      } catch (err: any) {
        setIsProcessing(false);
        onToast(err?.message || "Failed to reject application.", "warning");
      }
    }, 400);
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* Top Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>🎭</span> Artist Platform & Booking Desk
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Review onboarding submissions, curate roster, approve talent, and monitor booking enquiries.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => { setTab("applications"); setSelectedApp(null); setSelectedEnquiry(null); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              tab === "applications" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Applications ({applications.filter((a) => a.status === "PENDING_REVIEW").length} pending)
          </button>
          <button
            onClick={() => { setTab("enquiries"); setSelectedApp(null); setSelectedEnquiry(null); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              tab === "enquiries" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => { setTab("activity"); setSelectedApp(null); setSelectedEnquiry(null); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              tab === "activity" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* ═══ TAB 1: ARTIST APPLICATIONS ═══ */}
      {tab === "applications" && !selectedApp && (
        <div className="space-y-5">
          {/* Status filter bar */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {(["PENDING_REVIEW", "CHANGES_REQUESTED", "APPROVED", "REJECTED", "ALL"] as const).map((st) => {
              const count = st === "ALL" ? applications.length : applications.filter((a) => a.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setAppFilter(st)}
                  className={`px-3 py-1.5 rounded-full font-medium border transition-all cursor-pointer ${
                    appFilter === st
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {st.replace(/_/g, " ")} ({count})
                </button>
              );
            })}
          </div>

          {/* Applications list */}
          {filteredApps.length === 0 ? (
            <div className="p-12 text-center bg-stone-50 border border-stone-200 rounded-2xl">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm font-semibold text-stone-800">No applications in this category.</p>
              <p className="text-xs text-stone-500 mt-1">Check other filters or invite new artists to register.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-amber-400/80 transition-all flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.img}
                          alt={app.stageName || app.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 leading-tight">
                            {app.stageName || app.name}
                            {app.stageName && app.stageName !== app.name && (
                              <span className="text-[11px] text-stone-500 font-normal ml-1">({app.name})</span>
                            )}
                          </h4>
                          <p className="text-xs text-amber-700 font-medium">{app.genreTitle} · {app.city}, {app.state}</p>
                          <p className="text-[10px] text-stone-400 font-mono mt-0.5">{app.id}</p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          app.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : app.status === "PENDING_REVIEW"
                            ? "bg-amber-50 text-amber-800 border-amber-200 animate-pulse"
                            : app.status === "CHANGES_REQUESTED"
                            ? "bg-orange-50 text-orange-800 border-orange-200"
                            : "bg-stone-100 text-stone-600 border-stone-200"
                        }`}
                      >
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                      {app.shortBio || app.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {app.bandType && (
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-[10px] font-medium">
                          {app.bandType}
                        </span>
                      )}
                      {app.experienceYears && (
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-[10px]">
                          {app.experienceYears} yrs exp
                        </span>
                      )}
                      {app.moods?.slice(0, 2).map((m) => (
                        <span key={m} className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md text-[10px]">
                          {m}
                        </span>
                      ))}
                      {(app.priceNum || app.price) && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md text-[10px] font-semibold">
                          From ₹{(app.priceNum || 50000).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">
                      Applied: {new Date(app.submittedAt || app.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-xs font-semibold px-4 py-1.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 cursor-pointer transition-all"
                    >
                      Review Dossier →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ APPLICATION DETAIL / DOSSIER VIEW ═══ */}
      {tab === "applications" && selectedApp && (
        <div className="space-y-6 max-w-4xl">
          <button
            onClick={() => { setSelectedApp(null); setActionType(null); }}
            className="text-xs font-semibold text-stone-500 hover:text-stone-900 cursor-pointer flex items-center gap-1"
          >
            ← Back to Applications List
          </button>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header Banner */}
            <div className="p-6 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedApp.img}
                  alt={selectedApp.stageName || selectedApp.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-stone-900">
                      {selectedApp.stageName || selectedApp.name}
                    </h3>
                    {selectedApp.stageName && selectedApp.stageName !== selectedApp.name && (
                      <span className="text-xs text-stone-500">({selectedApp.name})</span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        selectedApp.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : selectedApp.status === "PENDING_REVIEW"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : selectedApp.status === "CHANGES_REQUESTED"
                          ? "bg-orange-50 text-orange-800 border-orange-200"
                          : "bg-stone-100 text-stone-600 border-stone-200"
                      }`}
                    >
                      {selectedApp.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 font-medium mt-0.5">
                    {selectedApp.genreTitle} ({selectedApp.genre}) · {selectedApp.city}, {selectedApp.state}, {selectedApp.country || "India"}
                  </p>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">{selectedApp.email} · {selectedApp.phone}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedApp.status !== "APPROVED" && (
                  <button
                    onClick={() => setActionType("approve")}
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
                  >
                    ✓ Approve & Publish
                  </button>
                )}
                {selectedApp.status !== "CHANGES_REQUESTED" && (
                  <button
                    onClick={() => setActionType("changes")}
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all cursor-pointer shadow-xs"
                  >
                    ⚠ Request Changes
                  </button>
                )}
                {selectedApp.status !== "REJECTED" && (
                  <button
                    onClick={() => setActionType("reject")}
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer shadow-xs"
                  >
                    ✕ Reject
                  </button>
                )}
              </div>
            </div>

            {/* Action Dialog / Form */}
            {actionType && (
              <div className="p-6 bg-stone-100/70 border-b border-stone-200 animate-fadeIn">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-3">
                  {actionType === "approve" && "Confirm Approval & Public Launch"}
                  {actionType === "changes" && "Request Revisions from Artist"}
                  {actionType === "reject" && "Application Rejection Note"}
                </h4>

                {actionType !== "approve" && (
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Reason / Required Action *
                    </label>
                    <textarea
                      rows={3}
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder={
                        actionType === "changes"
                          ? "Specify which parts need updates (e.g. upload higher resolution performance videos, complete fee breakdown)..."
                          : "State professional reason for declining application..."
                      }
                      className="w-full text-xs bg-white border border-stone-300 rounded-xl p-3 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Internal Admin Notes (Optional)</label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal memo for curation records..."
                    className="w-full text-xs bg-white border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (actionType === "approve") handleApprove(selectedApp);
                      if (actionType === "changes") handleRequestChanges(selectedApp);
                      if (actionType === "reject") handleReject(selectedApp);
                    }}
                    disabled={isProcessing || (actionType !== "approve" && !actionReason.trim())}
                    className={`text-xs font-semibold px-5 py-2 rounded-xl text-white cursor-pointer disabled:opacity-50 ${
                      actionType === "approve"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : actionType === "changes"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isProcessing ? "Processing..." : `Confirm ${actionType.toUpperCase()}`}
                  </button>
                  <button
                    onClick={() => setActionType(null)}
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Dossier Tabs / Information */}
            <div className="p-6 space-y-6 text-xs text-stone-700">
              {/* Bio & Tagline */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] mb-1">Tagline & Short Bio</h4>
                <p className="text-stone-800 font-medium bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 mb-3">
                  {selectedApp.shortBio || selectedApp.tagline || "No short tagline provided."}
                </p>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] mb-1">Artist Biography</h4>
                <p className="text-stone-800 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
                  {selectedApp.bio}
                </p>
              </div>

              {/* Performance & Classification */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">Curation Classifications</h4>
                  <div><span className="text-stone-400">Genre:</span> <span className="font-semibold text-stone-900">{selectedApp.genreTitle} ({selectedApp.genre})</span></div>
                  {selectedApp.secondaryGenres && selectedApp.secondaryGenres.length > 0 && (
                    <div><span className="text-stone-400">Secondary Genres:</span> <span className="font-semibold text-stone-900">{selectedApp.secondaryGenres.join(", ")}</span></div>
                  )}
                  <div><span className="text-stone-400">Band / Troupe Type:</span> <span className="font-semibold text-stone-900">{selectedApp.bandType || "Solo / Troupe"}</span></div>
                  <div><span className="text-stone-400">Experience:</span> <span className="font-semibold text-stone-900">{selectedApp.experienceYears || "5+"} Years</span></div>
                  <div><span className="text-stone-400">Duration:</span> <span className="font-semibold text-stone-900">{selectedApp.performanceDuration || "90 - 120 mins"}</span></div>
                  <div><span className="text-stone-400">Starting Price:</span> <span className="font-semibold text-amber-700">₹{(selectedApp.priceNum || 50000).toLocaleString("en-IN")}</span></div>
                  {selectedApp.primaryInstruments && selectedApp.primaryInstruments.length > 0 && (
                    <div><span className="text-stone-400">Instruments:</span> <span className="font-semibold text-stone-900">{selectedApp.primaryInstruments.join(", ")}</span></div>
                  )}
                  {selectedApp.languages && selectedApp.languages.length > 0 && (
                    <div><span className="text-stone-400">Languages:</span> <span className="font-semibold text-stone-900">{selectedApp.languages.join(", ")}</span></div>
                  )}
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">Logistics, Reach & Contact</h4>
                  <div><span className="text-stone-400">Email:</span> <span className="font-mono text-stone-900">{selectedApp.email}</span></div>
                  <div><span className="text-stone-400">Phone:</span> <span className="font-mono text-stone-900">{selectedApp.phone}</span></div>
                  <div><span className="text-stone-400">Travels Pan-India:</span> <span className="font-semibold text-stone-900">{selectedApp.travelsPanIndia ? "Yes ✓" : "No"}</span></div>
                  <div><span className="text-stone-400">Travels International:</span> <span className="font-semibold text-stone-900">{selectedApp.travelsInternational ? "Yes ✓" : "No"}</span></div>
                  {selectedApp.serviceLocations && selectedApp.serviceLocations.length > 0 && (
                    <div><span className="text-stone-400">Base Locations:</span> <span className="font-semibold text-stone-900">{selectedApp.serviceLocations.join(", ")}</span></div>
                  )}
                  <div><span className="text-stone-400">Contact Preference:</span> <span className="font-semibold uppercase text-stone-800">{selectedApp.contactPreference || "Platform"}</span></div>
                  <div><span className="text-stone-400">Instagram:</span> <span className="text-stone-900">{selectedApp.instagram || "—"}</span></div>
                  <div><span className="text-stone-400">YouTube:</span> <span className="text-stone-900">{selectedApp.youtube || "—"}</span></div>
                  <div><span className="text-stone-400">Website:</span> <span className="text-stone-900">{selectedApp.website || "—"}</span></div>
                </div>
              </div>

              {/* Moods & Occasions */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] mb-2">Mood & Occasion Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.moods?.map((m) => (
                    <span key={m} className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full font-medium">
                      Mood: {m}
                    </span>
                  ))}
                  {selectedApp.occasions?.map((o) => (
                    <span key={o} className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full font-medium">
                      Occasion: {o}
                    </span>
                  ))}
                </div>
              </div>

              {/* Video Links */}
              {selectedApp.videoLinks && selectedApp.videoLinks.length > 0 && (
                <div>
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] mb-2">Performance Video Links</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedApp.videoLinks.map((vid, idx) => (
                      <a
                        key={idx}
                        href={vid.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-400 text-stone-900 transition-all"
                      >
                        <span className="font-medium truncate">{vid.title || `Video Showcase #${idx + 1}`}</span>
                        <span className="text-[10px] text-amber-700 uppercase font-bold tracking-wider ml-2">{vid.platform} ↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Gallery */}
              {selectedApp.portfolioImages && selectedApp.portfolioImages.length > 0 && (
                <div>
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] mb-2">Portfolio Media</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedApp.portfolioImages.map((imgUrl, i) => (
                      <img
                        key={i}
                        src={imgUrl}
                        alt="Portfolio"
                        className="w-full h-24 object-cover rounded-xl border border-stone-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Rider & Sample Setlist */}
              {((selectedApp.techRider && selectedApp.techRider.length > 0) || (selectedApp.sampleSetlist && selectedApp.sampleSetlist.length > 0)) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedApp.techRider && selectedApp.techRider.length > 0 && (
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                      <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">Technical Rider / Gear</h4>
                      <ul className="list-disc list-inside space-y-1 text-stone-700">
                        {selectedApp.techRider.map((tr, i) => (
                          <li key={i}>{tr}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedApp.sampleSetlist && selectedApp.sampleSetlist.length > 0 && (
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                      <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">Sample Setlist / Signature Pieces</h4>
                      <ul className="list-disc list-inside space-y-1 text-stone-700">
                        {selectedApp.sampleSetlist.map((sl, i) => (
                          <li key={i}>{sl}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Status Audit History or Changes Message */}
              {(selectedApp.changesRequestedMessage || (selectedApp.statusHistory && selectedApp.statusHistory.length > 0)) && (
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  {selectedApp.changesRequestedMessage && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                      <span className="font-bold block mb-1">Current Changes Requested:</span>
                      <p className="italic">"{selectedApp.changesRequestedMessage}"</p>
                    </div>
                  )}
                  {selectedApp.statusHistory && selectedApp.statusHistory.length > 0 && (
                    <div>
                      <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[10px] mb-2">Status Audit Trail</h4>
                      <div className="space-y-2">
                        {selectedApp.statusHistory.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-stone-500">
                            <span className="font-mono text-stone-400">{new Date(h.changedAt).toLocaleString()}:</span>
                            <span className="font-bold text-stone-800">{h.status}</span>
                            <span>by {h.changedByName}</span>
                            {h.reason && <span className="italic text-stone-600">("{h.reason}")</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: CLIENT BOOKING ENQUIRIES ═══ */}
      {tab === "enquiries" && !selectedEnquiry && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500">
              Total <strong>{enquiries.length}</strong> client booking enquiries across all artists.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3">Ref / Client</th>
                    <th className="px-4 py-3">Artist</th>
                    <th className="px-4 py-3">Event Date & City</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-stone-900">{enq.clientName}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{enq.id}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-900">{enq.artistNameSnapshot}</td>
                      <td className="px-4 py-3">
                        <div>{new Date(enq.eventDate).toLocaleDateString()}</div>
                        <div className="text-[10px] text-stone-400">{enq.eventLocation}</div>
                      </td>
                      <td className="px-4 py-3 text-stone-600">{enq.eventType}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                            enq.status === "RESPONDED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : enq.status === "NEW"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-stone-100 text-stone-600 border-stone-200"
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="text-xs font-semibold px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 cursor-pointer transition-all"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ENQUIRY INSPECTION MODAL / VIEW ═══ */}
      {tab === "enquiries" && selectedEnquiry && (
        <div className="space-y-5 max-w-3xl">
          <button
            onClick={() => setSelectedEnquiry(null)}
            className="text-xs font-semibold text-stone-500 hover:text-stone-900 cursor-pointer flex items-center gap-1"
          >
            ← Back to Enquiries
          </button>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-mono text-stone-400">{selectedEnquiry.id}</span>
                <h3 className="text-lg font-bold text-stone-900">
                  {selectedEnquiry.eventType} for {selectedEnquiry.clientName}
                </h3>
              </div>
              <span className="px-3 py-1 bg-stone-100 border border-stone-300 rounded-full text-xs font-bold">
                {selectedEnquiry.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                <p className="font-bold uppercase tracking-wider text-[10px] text-stone-500">Client Details</p>
                <p><span className="text-stone-400">Name:</span> <strong>{selectedEnquiry.clientName}</strong></p>
                <p><span className="text-stone-400">Email:</span> <strong>{selectedEnquiry.clientEmail}</strong></p>
                <p><span className="text-stone-400">Phone:</span> <strong>{selectedEnquiry.clientPhone}</strong></p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                <p className="font-bold uppercase tracking-wider text-[10px] text-stone-500">Event Details</p>
                <p><span className="text-stone-400">Target Artist:</span> <strong>{selectedEnquiry.artistNameSnapshot}</strong></p>
                <p><span className="text-stone-400">Event Date:</span> <strong>{selectedEnquiry.eventDate}</strong></p>
                <p><span className="text-stone-400">Location:</span> <strong>{selectedEnquiry.eventLocation}</strong></p>
                <p><span className="text-stone-400">Audience:</span> <strong>{selectedEnquiry.audienceSize}</strong></p>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
              <p className="font-bold uppercase tracking-wider text-[10px] text-stone-500 mb-1">Message from Client</p>
              <p className="text-stone-800 italic leading-relaxed">"{selectedEnquiry.message}"</p>
            </div>

            {selectedEnquiry.artistResponse && (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs space-y-2">
                <p className="font-bold uppercase tracking-wider text-[10px] text-emerald-800">Artist Response</p>
                <p className="text-emerald-900">{selectedEnquiry.artistResponse.message}</p>
                {selectedEnquiry.artistResponse.proposedFee && (
                  <p className="font-semibold text-emerald-950">Proposed Fee: {selectedEnquiry.artistResponse.proposedFee}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ TAB 3: PLATFORM AUDIT & ACTIVITY LOG ═══ */}
      {tab === "activity" && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 mb-4">Platform Audit Activity</h3>
          <div className="space-y-3 text-xs">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 font-mono text-[10px] mt-0.5">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">{log.action}</p>
                  <p className="text-stone-500 text-[11px]">{log.details}</p>
                </div>
                <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md font-mono">
                  {log.actorName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
