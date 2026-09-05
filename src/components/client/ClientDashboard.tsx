import { useState, useMemo } from "react";
import { ClientEnquiry, NotificationItem, User } from "../../types/platform";
import { PlatformStore } from "../../services/platformStore";

interface ClientDashboardProps {
  currentUser: User;
  onLogout: () => void;
  onBackToSite: () => void;
}

export function ClientDashboard({
  currentUser,
  onLogout,
  onBackToSite,
}: ClientDashboardProps) {
  const [view, setView] = useState<"enquiries" | "detail" | "notifications">("enquiries");
  const [selectedEnquiry, setSelectedEnquiry] = useState<ClientEnquiry | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    PlatformStore.getNotifications(currentUser.id)
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const enquiries = useMemo(() => PlatformStore.getEnquiries(currentUser), [currentUser]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleViewEnquiry = (enq: ClientEnquiry) => {
    setSelectedEnquiry(enq);
    setView("detail");
  };

  const handleMarkAllRead = () => {
    PlatformStore.markAllNotificationsAsRead(currentUser.id);
    setNotifications(PlatformStore.getNotifications(currentUser.id));
  };

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

  return (
    <div
      className="min-h-screen bg-[#F5F0E8] text-[#1A1916] flex"
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-60 bg-white border-r border-[#EDE8DF] flex flex-col z-40 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-5 border-b border-[#EDE8DF]">
          <button onClick={onBackToSite} className="cursor-pointer text-left">
            <span className="font-serif text-lg font-light text-[#1A1916] block" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              MANNAT ARTS
            </span>
            <span className="text-[7px] font-bold text-[#C4952A] tracking-[0.2em] uppercase font-ui">CLIENT PORTAL</span>
          </button>
        </div>

        <div className="px-5 py-4 border-b border-[#EDE8DF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#EDE8DF] flex items-center justify-center text-[#C4952A] font-serif text-sm font-semibold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#1A1916] truncate">{currentUser.name}</p>
              <p className="text-[10px] text-[#7A776F] truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "enquiries" as const, label: "My Enquiries", icon: "✉", badge: enquiries.filter(e => e.status === "RESPONDED" && !e.artistResponse?.respondedAt).length || undefined },
            { id: "notifications" as const, label: "Notifications", icon: "🔔", badge: unreadCount || undefined },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                view === item.id || (view === "detail" && item.id === "enquiries")
                  ? "bg-[#1A1916] text-[#FAF7F2]"
                  : "text-[#4A4845] hover:bg-[#FAF7F2]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className="bg-[#C4952A] text-[#1A1916] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#EDE8DF] space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full text-xs font-semibold py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE8DF] border border-[#EDE8DF] text-[#1A1916] transition-all cursor-pointer"
          >
            ← Discover Artists
          </button>
          <button
            onClick={onLogout}
            className="w-full text-xs font-semibold py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white border-b border-[#EDE8DF] px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-[#EDE8DF] cursor-pointer" onClick={() => setMobileMenuOpen(true)}>
              ☰
            </button>
            <h1 className="font-serif font-light text-xl text-[#1A1916] hidden sm:block" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {view === "enquiries" ? "My Booking Enquiries" : view === "detail" ? "Enquiry Details" : "Notifications"}
            </h1>
          </div>
          <button
            onClick={() => setView("notifications")}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FAF7F2] transition-all cursor-pointer"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C4952A] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {/* Stats row */}
          {view === "enquiries" && (
            <div className="space-y-5 max-w-4xl">
              <div className="grid grid-cols-3 gap-4 mb-2">
                {[
                  { label: "Active", value: enquiries.filter(e => ["NEW", "VIEWED", "RESPONDED"].includes(e.status)).length, color: "text-blue-700" },
                  { label: "Responses", value: enquiries.filter(e => e.status === "RESPONDED").length, color: "text-emerald-700" },
                  { label: "Total", value: enquiries.length, color: "text-[#1A1916]" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#EDE8DF] text-center">
                    <div className={`font-serif text-2xl font-light ${s.color}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                    <div className="text-[10px] text-[#7A776F] uppercase tracking-wide font-semibold mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {enquiries.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-[#EDE8DF]">
                  <div className="text-5xl mb-4">🎵</div>
                  <h3 className="font-serif text-xl text-[#1A1916]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>No enquiries yet.</h3>
                  <p className="text-xs text-[#7A776F] mt-2 max-w-sm mx-auto">
                    Discover artists on Mannat Arts and click "Enquire" to start the booking journey.
                  </p>
                  <button
                    onClick={onBackToSite}
                    className="mt-4 text-xs font-semibold px-6 py-2.5 rounded-full bg-[#1A1916] text-[#FAF7F2] cursor-pointer"
                  >
                    Discover Artists
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-white rounded-2xl border border-[#EDE8DF] p-5 hover:border-[#C4952A]/40 transition-all cursor-pointer"
                      onClick={() => handleViewEnquiry(enq)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-sm text-[#1A1916]">{enq.artistNameSnapshot}</span>
                            <span className={statusBadge(enq.status)}>{enq.status}</span>
                          </div>
                          <p className="text-xs text-[#7A776F]">
                            {enq.eventType} · {enq.eventLocation} · {new Date(enq.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                          {enq.artistResponse && (
                            <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                              <p className="text-[11px] font-semibold text-emerald-800">Artist responded:</p>
                              <p className="text-[11px] text-emerald-700 mt-0.5 line-clamp-2">{enq.artistResponse.message}</p>
                              {enq.artistResponse.proposedFee && (
                                <p className="text-[11px] text-emerald-900 font-semibold mt-1">Fee: {enq.artistResponse.proposedFee}</p>
                              )}
                            </div>
                          )}
                          <p className="text-[10px] text-[#A8A49A] font-mono mt-1">{enq.id}</p>
                        </div>
                        <div className="text-[#C4952A] text-lg">›</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Enquiry Detail */}
          {view === "detail" && selectedEnquiry && (
            <div className="max-w-3xl space-y-5">
              <button onClick={() => setView("enquiries")} className="text-xs font-semibold text-[#7A776F] hover:text-[#1A1916] cursor-pointer flex items-center gap-1">
                ← Back to My Enquiries
              </button>

              <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden">
                <div className="p-6 bg-[#FAF7F2] border-b border-[#EDE8DF]">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-serif text-xl text-[#1A1916]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {selectedEnquiry.eventType}
                    </h2>
                    <span className={statusBadge(selectedEnquiry.status)}>{selectedEnquiry.status}</span>
                  </div>
                  <p className="text-xs text-[#7A776F]">
                    Artist: <strong>{selectedEnquiry.artistNameSnapshot}</strong> · Ref: <span className="font-mono">{selectedEnquiry.id}</span>
                  </p>
                </div>

                <div className="p-6 grid sm:grid-cols-2 gap-4 border-b border-[#EDE8DF]">
                  <div className="space-y-2 text-xs">
                    <div><span className="text-[#A8A49A]">Date: </span><span className="font-semibold text-[#1A1916]">{new Date(selectedEnquiry.eventDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span></div>
                    <div><span className="text-[#A8A49A]">Location: </span><span className="font-semibold text-[#1A1916]">{selectedEnquiry.eventLocation}</span></div>
                    <div><span className="text-[#A8A49A]">Audience: </span><span className="font-semibold text-[#1A1916]">{selectedEnquiry.audienceSize}</span></div>
                  </div>
                  <div className="space-y-2 text-xs">
                    {selectedEnquiry.preferredMood && <div><span className="text-[#A8A49A]">Mood: </span><span className="font-semibold text-[#C4952A]">{selectedEnquiry.preferredMood}</span></div>}
                    {selectedEnquiry.budgetRange && <div><span className="text-[#A8A49A]">Budget: </span><span className="font-semibold text-[#1A1916]">{selectedEnquiry.budgetRange}</span></div>}
                    <div><span className="text-[#A8A49A]">Submitted: </span><span className="font-semibold text-[#1A1916]">{new Date(selectedEnquiry.createdAt).toLocaleDateString()}</span></div>
                  </div>
                </div>

                <div className="p-6 border-b border-[#EDE8DF]">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#7A776F] font-semibold mb-3">Your Message</h4>
                  <p className="text-sm text-[#4A4845] italic bg-[#FAF7F2] p-4 rounded-xl border border-[#EDE8DF] leading-relaxed">
                    "{selectedEnquiry.message}"
                  </p>
                </div>

                {selectedEnquiry.artistResponse ? (
                  <div className="p-6 bg-emerald-50/30 border-b border-[#EDE8DF]">
                    <h4 className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold mb-3">Artist Response</h4>
                    <p className="text-sm text-[#4A4845] bg-white p-4 rounded-xl border border-emerald-200 leading-relaxed">
                      {selectedEnquiry.artistResponse.message}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs">
                      {selectedEnquiry.artistResponse.proposedFee && (
                        <div>
                          <span className="text-[#7A776F]">Proposed Fee: </span>
                          <span className="font-bold text-[#C4952A]">{selectedEnquiry.artistResponse.proposedFee}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[#7A776F]">Availability: </span>
                        <span className={`font-bold ${selectedEnquiry.artistResponse.availabilityStatus === "confirmed" ? "text-emerald-700" : selectedEnquiry.artistResponse.availabilityStatus === "unavailable" ? "text-red-600" : "text-amber-700"}`}>
                          {selectedEnquiry.artistResponse.availabilityStatus === "confirmed" ? "✓ Confirmed" : selectedEnquiry.artistResponse.availabilityStatus === "unavailable" ? "✗ Unavailable" : "~ Alternative date"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-amber-50/30">
                    <div className="flex items-center gap-2 text-amber-800">
                      <span className="text-lg">⏳</span>
                      <div>
                        <p className="text-xs font-semibold">Waiting for artist response</p>
                        <p className="text-[11px] text-amber-700 mt-0.5">The artist has been notified and will respond soon.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {selectedEnquiry.timeline && selectedEnquiry.timeline.length > 0 && (
                  <div className="p-6">
                    <h4 className="text-[10px] uppercase tracking-widest text-[#7A776F] font-semibold mb-4">Enquiry Timeline</h4>
                    <div className="space-y-3">
                      {selectedEnquiry.timeline.map((evt, idx) => (
                        <div key={evt.id} className="flex gap-3 text-xs">
                          <div className="flex flex-col items-center">
                            <div className="w-5 h-5 rounded-full bg-[#C4952A]/20 flex items-center justify-center text-[9px] font-bold text-[#C4952A]">{idx + 1}</div>
                            {idx < selectedEnquiry.timeline.length - 1 && <div className="w-px flex-1 bg-[#EDE8DF] mt-1" />}
                          </div>
                          <div className="pb-3">
                            <p className="font-semibold text-[#1A1916]">{evt.action}</p>
                            <p className="text-[10px] text-[#A8A49A] font-mono mt-0.5">{new Date(evt.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications */}
          {view === "notifications" && (
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1A1916]">Notifications</h2>
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
                      onClick={() => { PlatformStore.markNotificationAsRead(n.id); setNotifications(PlatformStore.getNotifications(currentUser.id)); }}
                      className={`bg-white rounded-2xl border p-4 flex items-start gap-3 cursor-pointer transition-all ${n.isRead ? "border-[#EDE8DF] opacity-70" : "border-[#C4952A]/30 shadow-xs"}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${n.type === "response" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                        {n.type === "response" ? "✓" : "✉"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1A1916]">{n.title}</p>
                        <p className="text-[11px] text-[#7A776F] mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-[#A8A49A] mt-1 font-mono">{new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#C4952A] mt-1 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
