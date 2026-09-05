import { useState } from "react";
import { ArtistApplicationProfile } from "../../types/platform";
import { PlatformStore } from "../../services/platformStore";
import { User } from "../../types/platform";

interface ArtistApplicationStatusPageProps {
  artist: ArtistApplicationProfile;
  currentUser?: User | null;
  onGoToDashboard: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onBackToSite: () => void;
}

export function ArtistApplicationStatusPage({
  artist: initialArtist,
  currentUser,
  onGoToDashboard,
  onEditProfile,
  onLogout,
  onBackToSite,
}: ArtistApplicationStatusPageProps) {
  const [artist, setArtist] = useState<ArtistApplicationProfile>(initialArtist);
  const [resubmitMessage, setResubmitMessage] = useState("");
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState(false);

  const status = artist.status;

  const handleResubmit = () => {
    setIsResubmitting(true);
    setTimeout(() => {
      const updated = PlatformStore.updateArtistProfile(artist.id, {
        status: "PENDING_REVIEW",
        changesRequestedMessage: undefined,
        submittedAt: new Date().toISOString(),
      });
      setArtist(updated);
      setIsResubmitting(false);
      setResubmitSuccess(true);
    }, 600);
  };

  return (
    <div
      className="min-h-screen bg-[#FAF7F2] text-[#1A1916] flex flex-col font-ui"
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      {/* Top Header */}
      <header className="border-b border-[#EDE8DF] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-3 cursor-pointer select-none text-left"
          >
            <div>
              <span
                className="font-serif text-xl sm:text-2xl font-light tracking-[0.06em] text-[#1A1916] block"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                MANNAT ARTS
              </span>
              <span className="font-ui text-[8px] font-bold text-[#C4952A] tracking-[0.2em] uppercase">
                ARTIST PORTAL
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-[#EDE8DF] hover:border-[#1A1916] text-[#4A4845] bg-white transition-all cursor-pointer"
            >
              ← Back to Site
            </button>
            <button
              onClick={onLogout}
              className="text-xs font-semibold px-4 py-2 rounded-full text-red-600 hover:bg-red-50 transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-12 sm:py-16 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-[#EDE8DF] shadow-xl text-center space-y-6 animate-fade-in">
          {/* Status Specific Hero Icons and Content */}

          {status === "PENDING_REVIEW" && (
            <>
              <div className="w-18 h-18 rounded-full bg-[#FAF7F2] border border-[#C4952A]/40 text-[#C4952A] flex items-center justify-center text-3xl mx-auto shadow-xs">
                ⏳
              </div>
              <div className="space-y-2">
                <span className="label-editorial text-[#C4952A]" style={{ fontSize: "9px" }}>
                  APPLICATION SUBMITTED
                </span>
                <h1
                  className="font-serif font-light text-3xl sm:text-4xl text-[#1A1916]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Your application has been submitted.
                </h1>
                <p className="text-xs sm:text-sm text-[#7A776F] max-w-md mx-auto leading-relaxed">
                  Thank you for joining Mannat Arts. Our cultural curation team will review your
                  profile, audio/video repertoire, and credentials. We will notify you once your application has been approved.
                </p>
              </div>

              {resubmitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold">
                  ✓ Profile resubmitted successfully for review!
                </div>
              )}

              {/* Status Badge Box */}
              <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between items-center">
                  <span className="text-[#7A776F]">Application Status:</span>
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[11px]">
                    PENDING REVIEW
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7A776F]">Artist Profile:</span>
                  <span className="font-semibold text-[#1A1916]">{artist.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7A776F]">Genre &amp; Style:</span>
                  <span className="font-semibold text-[#1A1916]">{artist.genreTitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7A776F]">Application Submitted:</span>
                  <span className="font-mono text-[#1A1916]">
                    {artist.submittedAt
                      ? new Date(artist.submittedAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Today"}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onEditProfile}
                  className="w-full sm:w-auto text-xs font-semibold px-6 py-3 rounded-full border border-[#EDE8DF] hover:border-[#C4952A] text-[#1A1916] bg-white transition-all cursor-pointer"
                >
                  Edit Application Details
                </button>
                <button
                  onClick={onBackToSite}
                  className="w-full sm:w-auto text-xs font-semibold px-8 py-3 rounded-full bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] shadow-sm transition-all cursor-pointer"
                >
                  Return to Discovery
                </button>
              </div>
            </>
          )}

          {status === "CHANGES_REQUESTED" && (
            <>
              <div className="w-18 h-18 rounded-full bg-amber-50 border border-amber-300 text-amber-600 flex items-center justify-center text-3xl mx-auto shadow-xs">
                📝
              </div>
              <div className="space-y-2">
                <span className="label-editorial text-amber-700" style={{ fontSize: "9px" }}>
                  ACTION REQUIRED
                </span>
                <h1
                  className="font-serif font-light text-3xl sm:text-4xl text-[#1A1916]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Your profile needs changes.
                </h1>
                <p className="text-xs sm:text-sm text-[#7A776F] max-w-md mx-auto">
                  Our curation team has reviewed your application and requested the following adjustments:
                </p>
              </div>

              {/* Admin message alert */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-left text-xs space-y-2 text-amber-900 max-w-md mx-auto">
                <p className="font-bold flex items-center gap-1.5">
                  <span>💬</span> Message from Mannat Arts Curation Desk:
                </p>
                <p className="text-xs italic bg-white/70 p-3 rounded-xl border border-amber-200/60 leading-relaxed font-serif text-[14px]">
                  "{artist.changesRequestedMessage || "Please upload a higher-quality profile image and add two performance videos."}"
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onEditProfile}
                  className="w-full sm:w-auto text-xs font-semibold px-8 py-3 rounded-full bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] shadow-sm transition-all cursor-pointer"
                >
                  Update Profile Now →
                </button>
                <button
                  onClick={handleResubmit}
                  disabled={isResubmitting}
                  className="w-full sm:w-auto text-xs font-semibold px-6 py-3 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isResubmitting ? "Resubmitting..." : "Resubmit for Review ✓"}
                </button>
              </div>
            </>
          )}

          {status === "REJECTED" && (
            <>
              <div className="w-18 h-18 rounded-full bg-red-50 border border-red-300 text-red-600 flex items-center justify-center text-3xl mx-auto shadow-xs">
                ✕
              </div>
              <div className="space-y-2">
                <span className="label-editorial text-red-600" style={{ fontSize: "9px" }}>
                  APPLICATION DECLINED
                </span>
                <h1
                  className="font-serif font-light text-3xl sm:text-4xl text-[#1A1916]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Application Status: Not Approved
                </h1>
                <p className="text-xs sm:text-sm text-[#7A776F] max-w-md mx-auto">
                  Thank you for your interest in Mannat Arts. Regrettably, your application does not meet our current curation criteria.
                </p>
              </div>

              {artist.rejectionReason && (
                <div className="bg-red-50/80 border border-red-200 rounded-2xl p-5 text-left text-xs space-y-1.5 text-red-900 max-w-md mx-auto">
                  <span className="font-semibold block">Reason for rejection:</span>
                  <p className="italic bg-white/70 p-3 rounded-xl border border-red-200/60 leading-relaxed font-serif text-[14px]">
                    "{artist.rejectionReason}"
                  </p>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={onBackToSite}
                  className="text-xs font-semibold px-8 py-3 rounded-full bg-[#1A1916] text-[#FAF7F2] hover:bg-[#2E2C28] transition-all cursor-pointer"
                >
                  Return to Mannat Arts Discovery
                </button>
              </div>
            </>
          )}

          {status === "APPROVED" && (
            <>
              <div className="w-18 h-18 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-xs">
                ✓
              </div>
              <div className="space-y-2">
                <span className="label-editorial text-emerald-700" style={{ fontSize: "9px" }}>
                  OFFICIALLY APPROVED
                </span>
                <h1
                  className="font-serif font-light text-3xl sm:text-4xl text-[#1A1916]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Welcome to Mannat Arts!
                </h1>
                <p className="text-xs sm:text-sm text-[#7A776F] max-w-md mx-auto">
                  Your artist profile is published and live to clients. You can now access your artist dashboard, track booking enquiries, and update your calendar.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={onGoToDashboard}
                  className="text-xs font-semibold px-8 py-3.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-md transition-all cursor-pointer"
                >
                  Open Artist Dashboard →
                </button>
              </div>
            </>
          )}

          {status === "SUSPENDED" && (
            <>
              <div className="w-18 h-18 rounded-full bg-stone-100 border border-stone-300 text-stone-600 flex items-center justify-center text-3xl mx-auto shadow-xs">
                ⏸
              </div>
              <div className="space-y-2">
                <span className="label-editorial text-stone-600" style={{ fontSize: "9px" }}>
                  ACCOUNT SUSPENDED
                </span>
                <h1
                  className="font-serif font-light text-3xl sm:text-4xl text-[#1A1916]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Profile Temporarily Inactive
                </h1>
                <p className="text-xs sm:text-sm text-[#7A776F] max-w-md mx-auto">
                  Your artist profile is currently inactive on the public platform. Please reach out to Mannat Arts management at <span className="font-semibold text-[#1A1916]">curators@mannatarts.com</span>.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
