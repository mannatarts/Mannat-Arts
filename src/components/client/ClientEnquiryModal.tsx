import { useState } from "react";
import { ArtistApplicationProfile } from "../../types/platform";
import { PlatformStore } from "../../services/platformStore";
import { AuthService } from "../../services/authService";

interface ClientEnquiryModalProps {
  artist: ArtistApplicationProfile;
  onClose: () => void;
  currentClientEmail?: string;
  currentClientName?: string;
  currentClientId?: string;
}

export function ClientEnquiryModal({
  artist,
  onClose,
  currentClientEmail = "",
  currentClientName = "",
  currentClientId,
}: ClientEnquiryModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [enquiryId, setEnquiryId] = useState<string | null>(null);

  const [form, setForm] = useState({
    clientName: currentClientName,
    clientEmail: currentClientEmail,
    clientPhone: "",
    eventType: "Wedding",
    eventDate: "",
    eventLocation: "",
    audienceSize: "50-150 Guests",
    preferredExperience: "",
    preferredMood: "Soulful",
    preferredGenre: artist.genreTitle,
    budgetRange: "",
    message: "",
    consent: false,
  });

  const eventTypes = [
    "Wedding", "Corporate Gala", "Festival", "Private Celebration",
    "College / Campus Event", "Cultural Event", "Brand Event", "Concert", "Other",
  ];

  const audienceSizes = [
    "Under 50 Guests", "50-150 Guests", "150-300 Guests",
    "300-500 Guests", "500-1,000 Guests", "1,000+ Guests",
  ];

  const moods = ["Soulful", "Ecstatic", "Intimate", "Celebratory", "Devotional", "Energetic", "Reflective"];

  const budgetRanges = [
    "Under ₹50,000", "₹50,000 – ₹1,00,000", "₹1,00,000 – ₹2,00,000",
    "₹2,00,000 – ₹5,00,000", "Above ₹5,00,000", "Flexible / To Discuss",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.clientName.trim()) { setErrorMsg("Please enter your name."); return; }
    if (!form.clientEmail.includes("@")) { setErrorMsg("Please enter a valid email."); return; }
    if (!form.eventDate) { setErrorMsg("Please select the event date."); return; }
    if (!form.eventLocation.trim()) { setErrorMsg("Please enter the event location."); return; }
    if (!form.message.trim()) { setErrorMsg("Please describe your event."); return; }
    if (!form.consent) { setErrorMsg("Please accept the consent to submit."); return; }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 700));

    try {
      const enquiry = PlatformStore.createEnquiry({
        clientId: currentClientId,
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone,
        artistId: artist.id,
        artistNameSnapshot: artist.name,
        artistSlugSnapshot: artist.slug,
        eventType: form.eventType,
        eventDate: form.eventDate,
        eventLocation: form.eventLocation,
        audienceSize: form.audienceSize,
        preferredExperience: form.preferredExperience || undefined,
        preferredMood: form.preferredMood || undefined,
        preferredGenre: form.preferredGenre || undefined,
        budgetRange: form.budgetRange || undefined,
        message: form.message,
        consentAgreed: form.consent,
      });

      setEnquiryId(enquiry.id);
      setIsSubmitting(false);
      setStep("success");
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || "Failed to submit enquiry. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-[#EDE8DF]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#F5F0E8] border-b border-[#EDE8DF] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <img
              src={artist.img}
              alt={artist.name}
              className="w-12 h-12 rounded-2xl object-cover border border-[#EDE8DF] shadow-sm"
            />
            <div>
              <span className="label-editorial text-[#C4952A]" style={{ fontSize: "8px" }}>
                ENQUIRE ABOUT THIS ARTIST
              </span>
              <h2
                className="font-serif font-light text-xl text-[#1A1916] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {artist.name}
              </h2>
              <p className="text-[10px] text-[#7A776F]">{artist.genreTitle} · {artist.city}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-[#7A776F] hover:text-[#1A1916] flex items-center justify-center border border-[#EDE8DF] transition-all hover:scale-105 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <span>⚠️</span> {errorMsg}
                </div>
              )}

              {/* Client Info */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#7A776F] mb-3">Your Details</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      className="w-full text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.clientEmail}
                      onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                      className="w-full text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+91 98xxx xxxxx"
                      value={form.clientPhone}
                      onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                      className="w-full text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                    />
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#7A776F] mb-3">Event Information</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1">Event Type *</label>
                    <select
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      className="w-full text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none"
                    >
                      {eventTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1">Event Date *</label>
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1">Event Location *</label>
                    <input
                      type="text"
                      placeholder="City, Venue"
                      value={form.eventLocation}
                      onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
                      className="w-full text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1">Expected Audience</label>
                    <select
                      value={form.audienceSize}
                      onChange={(e) => setForm({ ...form, audienceSize: e.target.value })}
                      className="w-full text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none"
                    >
                      {audienceSizes.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#7A776F] mb-3">Performance Preferences</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1">Preferred Mood</label>
                    <select
                      value={form.preferredMood}
                      onChange={(e) => setForm({ ...form, preferredMood: e.target.value })}
                      className="w-full text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none"
                    >
                      {moods.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1">Budget Range (Optional)</label>
                    <select
                      value={form.budgetRange}
                      onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                      className="w-full text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none"
                    >
                      <option value="">Not specified</option>
                      {budgetRanges.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">Tell the Artist About Your Event *</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share the vision for your event, the atmosphere you're curating, and any specific performance requests..."
                  className="w-full text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl p-4 focus:outline-none focus:border-[#C4952A] leading-relaxed"
                  required
                />
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 text-xs text-[#4A4845] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="mt-0.5 rounded accent-[#C4952A]"
                  required
                />
                <span>
                  I consent to Mannat Arts sharing my contact information with the artist for the
                  purpose of this booking enquiry.
                </span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold px-5 py-2.5 rounded-full border border-[#1A1916] text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs font-semibold px-8 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><span className="w-3 h-3 border-2 border-[#1A1916] border-t-transparent rounded-full animate-spin" /> Sending...</>
                  ) : "Send Enquiry →"}
                </button>
              </div>
            </form>
          ) : (
            /* SUCCESS STATE */
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
                ✓
              </div>
              <div>
                <span className="label-editorial text-[#C4952A]" style={{ fontSize: "8px" }}>ENQUIRY CONFIRMED</span>
                <h3
                  className="font-serif font-light text-3xl text-[#1A1916] mt-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Your enquiry has been sent.
                </h3>
                <p className="text-xs text-[#7A776F] mt-2 max-w-md mx-auto leading-relaxed">
                  Your request has been sent to <strong>{artist.name}</strong>. The artist will review and respond to your event details soon.
                </p>
              </div>

              {/* Reference box */}
              <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-5 text-left text-xs space-y-2.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#7A776F]">Enquiry Reference:</span>
                  <span className="font-mono font-bold text-[#1A1916]">{enquiryId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A776F]">Artist:</span>
                  <span className="font-semibold text-[#1A1916]">{artist.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A776F]">Event Type:</span>
                  <span className="font-semibold text-[#1A1916]">{form.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A776F]">Event Date:</span>
                  <span className="font-semibold text-[#1A1916]">
                    {new Date(form.eventDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A776F]">Status:</span>
                  <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-[10px] font-bold">NEW</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="text-xs font-semibold px-8 py-3 rounded-full bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] cursor-pointer transition-all"
                >
                  Return to Discovery
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
