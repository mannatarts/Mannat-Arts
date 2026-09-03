import { useState } from "react";
import { Artist } from "../data/artistsData";

interface BookingModalProps {
  artist: Artist | null;
  onClose: () => void;
}

export function BookingModal({ artist, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"form" | "confirmed">("form");
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
    setStep("confirmed");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-[#F3E5E8] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#FFF0F3] via-[#FFE4E6] to-[#FFF5F5] border-b border-[#FCE7E9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={artist.img}
              alt={artist.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <div className="text-xs text-[#BE123C] font-bold uppercase tracking-wider">
                Book Artist
              </div>
              <h2 className="font-display text-xl font-bold text-[#1A1A1A]">
                {artist.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-gray-500 hover:text-black flex items-center justify-center border border-gray-200 transition-transform hover:scale-110 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#E11D48]"
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
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#E11D48]"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Goa, Udaipur"
                    value={formData.eventCity}
                    onChange={e => setFormData({ ...formData, eventCity: e.target.value })}
                    className="w-full bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#E11D48]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Expected Guests
                  </label>
                  <select
                    value={formData.guestCount}
                    onChange={e => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#E11D48]"
                  >
                    <option>Under 100 Guests</option>
                    <option>100 - 250 Guests</option>
                    <option>250 - 500 Guests</option>
                    <option>500 - 1,000 Guests</option>
                    <option>1,000+ Guests (Festival)</option>
                  </select>
                </div>
              </div>

              {/* Instant Transparent Quote Calculator */}
              <div className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#F3E5E8] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#5B5B5B]">
                  <span>Artist Performance Fee ({artist.bandType})</span>
                  <span className="font-semibold text-[#1A1A1A]">₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#5B5B5B]">
                  <span>Stage Sound &amp; Wireless Rider</span>
                  <span className="font-semibold text-[#1A1A1A]">₹{soundCost.toLocaleString()}</span>
                </div>
                {travelCost > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#5B5B5B]">
                    <span>Intercity Travel &amp; Logistics ({formData.eventCity})</span>
                    <span className="font-semibold text-[#1A1A1A]">₹{travelCost.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-[#F3E5E8] pt-2 flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-[#1A1A1A]">Estimated Total</span>
                  <span className="font-display font-bold text-xl text-[#E11D48]">
                    ₹{totalEstimated.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Contact details */}
              <div className="space-y-3 pt-2">
                <h4 className="font-display font-bold text-sm text-[#1A1A1A]">
                  Your Contact Information
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={formData.contactName}
                    onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#E11D48]"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp Number"
                    value={formData.contactPhone}
                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#E11D48]"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address for Quote &amp; Digital Contract"
                  value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-body text-[#1A1A1A] focus:outline-none focus:border-[#E11D48]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#BE123C] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>✦ Lock Date &amp; Request Official Quote</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 text-3xl flex items-center justify-center mx-auto animate-bounce">
                ✓
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1A1A1A]">
                Booking Request Sent Successfully!
              </h3>
              <p className="font-body text-sm text-[#5B5B5B] max-w-md mx-auto">
                Thank you, <strong>{formData.contactName || "valued client"}</strong>! A dedicated artist relationship manager has locked tentative calendar priority for <strong>{formData.eventDate}</strong> with <strong>{artist.name}</strong>.
              </p>
              <div className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#F3E5E8] max-w-sm mx-auto text-xs text-[#5B5B5B] text-left space-y-1">
                <div><strong>Booking Ref:</strong> SB-2026-{Math.floor(100000 + Math.random() * 900000)}</div>
                <div><strong>Artist:</strong> {artist.name}</div>
                <div><strong>Event Date:</strong> {formData.eventDate}</div>
                <div><strong>Location:</strong> {formData.eventCity}</div>
                <div><strong>Estimated Quote:</strong> ₹{totalEstimated.toLocaleString()}</div>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#E11D48] text-white font-bold text-xs hover:bg-[#BE123C] transition-colors cursor-pointer"
              >
                Done / Return to Platform
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
