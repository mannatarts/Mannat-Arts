import { useState } from "react";
import { Artist } from "../data/artistsData";
import { PlatformStore } from "../services/platformStore";

interface BookingModalProps {
  artist: Artist | null;
  onClose: () => void;
}

export function BookingModal({ artist, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [generatedEnqId, setGeneratedEnqId] = useState<string>("");
  const [formData, setFormData] = useState({
    eventType: "Wedding / Sangeet",
    eventDate: "2026-09-15",
    eventCity: artist?.city || "Mumbai",
    venueType: "Indoor Luxury Banquet / Hotel",
    guestCount: "250-500 Guests",
    duration: "2 Hours Live Set",
    soundSystemRequired: "Yes (Artist / Platform Production)",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    specialNotes: "",
  });

  if (!artist) return null;

  const basePrice = artist.priceNum;
  const soundCost = formData.soundSystemRequired.startsWith("Yes") ? 15000 : 0;
  const travelCost = formData.eventCity === artist.city ? 0 : 12000;
  const totalEstimated = basePrice + soundCost + travelCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const enq = PlatformStore.createEnquiry({
        clientName: formData.contactName || "Patron",
        clientEmail: formData.contactEmail || "client@mannatarts.com",
        clientPhone: formData.contactPhone || "+91 98201 45678",
        artistId: artist.id,
        artistNameSnapshot: artist.name,
        artistSlugSnapshot: artist.id,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventLocation: formData.eventCity,
        audienceSize: formData.guestCount,
        budgetRange: `₹${totalEstimated.toLocaleString()}`,
        message: formData.specialNotes || `Booking enquiry for ${artist.name} (${formData.duration}) at ${formData.venueType}`,
        consentAgreed: true,
      });
      setGeneratedEnqId(enq.id);
    } catch (err) {
      console.warn("Could not save to PlatformStore:", err);
    }
    setStep("confirmed");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <div
        className="relative bg-[#FAF7F2] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-[#EDE8DF] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#F5F0E8] border-b border-[#EDE8DF] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={artist.img}
              alt={artist.name}
              className="w-14 h-14 rounded-2xl object-cover border border-[#EDE8DF] shadow-sm"
            />
            <div>
              <span className="label-editorial text-[#C4952A]" style={{ fontSize: "8px" }}>
                INQUIRE FOR BOOKING
              </span>
              <h2
                className="font-serif font-light text-2xl text-[#1A1916] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {artist.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-[#7A776F] hover:text-[#1A1916] flex items-center justify-center border border-[#EDE8DF] transition-transform hover:scale-105 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-editorial text-[#7A776F] block mb-2" style={{ fontSize: "8px" }}>
                    EVENT TYPE
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-[#1A1916] focus:outline-none focus:border-[#C4952A]"
                  >
                    <option>Wedding / Sangeet</option>
                    <option>Cocktail / Reception</option>
                    <option>Corporate Summit / Gala</option>
                    <option>College / Cultural Festival</option>
                    <option>Private Birthday / Anniversary</option>
                    <option>Devotional Satsang / Jagran</option>
                    <option>Public Concert / Festival</option>
                  </select>
                </div>

                <div>
                  <label className="label-editorial text-[#7A776F] block mb-2" style={{ fontSize: "8px" }}>
                    EVENT DATE
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-[#1A1916] focus:outline-none focus:border-[#C4952A]"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-editorial text-[#7A776F] block mb-2" style={{ fontSize: "8px" }}>
                    CITY / LOCATION
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Goa, Udaipur"
                    value={formData.eventCity}
                    onChange={e => setFormData({ ...formData, eventCity: e.target.value })}
                    className="w-full bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-[#1A1916] focus:outline-none focus:border-[#C4952A]"
                    required
                  />
                </div>

                <div>
                  <label className="label-editorial text-[#7A776F] block mb-2" style={{ fontSize: "8px" }}>
                    EXPECTED GUESTS
                  </label>
                  <select
                    value={formData.guestCount}
                    onChange={e => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-[#1A1916] focus:outline-none focus:border-[#C4952A]"
                  >
                    <option>Under 100 Guests</option>
                    <option>100 - 250 Guests</option>
                    <option>250 - 500 Guests</option>
                    <option>500 - 1,000 Guests</option>
                    <option>1,000+ Guests (Concert / Festival)</option>
                  </select>
                </div>
              </div>

              {/* Estimate Calculation Box */}
              <div className="bg-[#F5F0E8] p-5 rounded-2xl border border-[#EDE8DF] space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#7A776F]">
                  <span>Artist Performance Fee ({artist.bandType})</span>
                  <span className="font-ui font-semibold text-[#1A1916]">₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#7A776F]">
                  <span>Stage Sound &amp; Wireless Rider</span>
                  <span className="font-ui font-semibold text-[#1A1916]">₹{soundCost.toLocaleString()}</span>
                </div>
                {travelCost > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#7A776F]">
                    <span>Intercity Travel &amp; Logistics ({formData.eventCity})</span>
                    <span className="font-ui font-semibold text-[#1A1916]">₹{travelCost.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-[#EDE8DF] pt-3 flex items-center justify-between">
                  <span className="label-editorial text-[#1A1916]" style={{ fontSize: "9px" }}>ESTIMATED TOTAL</span>
                  <span
                    className="font-serif font-light text-2xl text-[#C4952A]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    ₹{totalEstimated.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Contact details */}
              <div className="space-y-4 pt-2">
                <h4
                  className="font-serif font-light text-lg text-[#1A1916]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Your Contact Information
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={formData.contactName}
                    onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-[#1A1916] focus:outline-none focus:border-[#C4952A]"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp Number"
                    value={formData.contactPhone}
                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-[#1A1916] focus:outline-none focus:border-[#C4952A]"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full bg-[#F5F0E8] border border-[#EDE8DF] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-ui text-[#1A1916] focus:outline-none focus:border-[#C4952A]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={onClose}
                  className="font-ui px-5 py-2.5 rounded-full border border-[#1A1916] text-xs font-semibold text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="font-ui px-7 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] font-semibold text-xs shadow-md transition-all cursor-pointer"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F5F0E8] border border-[#C4952A] text-[#C4952A] flex items-center justify-center text-2xl mx-auto shadow-sm">
                ✓
              </div>
              <h3
                className="font-serif font-light text-3xl text-[#1A1916]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Inquiry Received
              </h3>
              {generatedEnqId && (
                <div className="inline-block bg-[#F5F0E8] border border-[#EDE8DF] px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#C4952A]">
                  Ref: {generatedEnqId}
                </div>
              )}
              <p className="font-ui text-xs sm:text-sm text-[#7A776F] max-w-md mx-auto leading-relaxed">
                Our cultural curator and the artist management team will review your event details and respond directly in the client portal.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="font-ui px-8 py-3 rounded-full bg-[#1A1916] text-[#FAF7F2] hover:bg-[#2E2C28] text-xs font-semibold transition-all cursor-pointer shadow-md"
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
