import { useState, useEffect } from "react";
import { Artist, GENRE_METADATA } from "../../data/artistsData";
import { MediaItem } from "../../data/cmsTypes";
import { MediaPickerModal } from "./MediaPickerModal";

export interface ArtistEditorModalProps {
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (artist: Artist) => void;
  mediaList?: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
}

const GENRE_OPTIONS: Array<"sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional"> = [
  "sufi",
  "rock",
  "gazal",
  "bollywood",
  "carnival",
  "devotional",
];

const BAND_TYPES: Array<"Solo" | "Duo" | "Trio" | "4-6 Piece Band" | "Full Troupe (8+ Members)"> = [
  "Solo",
  "Duo",
  "Trio",
  "4-6 Piece Band",
  "Full Troupe (8+ Members)",
];

export function ArtistEditorModal({
  artist,
  isOpen,
  onClose,
  onSave,
  mediaList = [],
  onUploadMedia,
}: ArtistEditorModalProps) {
  const [formData, setFormData] = useState<Partial<Artist>>({
    name: "",
    stageName: "",
    genre: "sufi",
    genreTitle: "Sufi & Qawwali",
    tagline: "",
    bio: "",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&auto=format",
    rating: 4.9,
    reviewsCount: 24,
    price: "₹45,000",
    priceNum: 45000,
    city: "Mumbai",
    state: "Maharashtra",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "90–120 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 7,
    eventsCompleted: 140,
    primaryInstruments: ["Harmonium", "Tabla", "Vocals"],
    themeColor: "#9A7219",
    whatElseTheyDo: [
      { category: "Gazal Mehfils", description: "Intimate late-night mehfil sets", icon: "📜" },
      { category: "Bollywood Acoustic", description: "Unplugged 90s Bollywood medleys", icon: "🎸" },
    ],
    sampleSetlist: ["Dama Dam Mast Qalandar", "Kun Faya Kun", "Afreen Afreen", "Chaap Tilak"],
    sampleTracks: [
      { title: "Live Medley - Qawwali Nights", duration: "6:45", type: "Live Performance" },
    ],
    techRider: [
      "4 Vocal Microphones with boom stands (Shure SM58 or equivalent)",
      "2 Direct Inputs (DI Box) for acoustic instruments",
      "2 Stage Wedge Monitors with independent auxiliary mix",
    ],
    reviews: [],
  });

  const [instrumentsInput, setInstrumentsInput] = useState("");
  const [setlistInput, setSetlistInput] = useState("");
  const [techRiderInput, setTechRiderInput] = useState("");
  const [imageSourceMode, setImageSourceMode] = useState<"upload" | "url">("upload");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [previewStyle, setPreviewStyle] = useState<"card" | "detail">("card");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [detailPreviewTab, setDetailPreviewTab] = useState<"about" | "repertoire">("about");

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        setFormData(p => ({ ...p, img: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (artist) {
      setFormData(artist);
      setInstrumentsInput(artist.primaryInstruments ? artist.primaryInstruments.join(", ") : "");
      setSetlistInput(artist.sampleSetlist ? artist.sampleSetlist.join("\n") : "");
      setTechRiderInput(artist.techRider ? artist.techRider.join("\n") : "");
    } else {
      const defaultState: Partial<Artist> = {
        id: `artist-${Date.now()}`,
        name: "",
        stageName: "",
        genre: "sufi",
        genreTitle: "Sufi & Qawwali",
        tagline: "",
        bio: "",
        img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&auto=format",
        rating: 4.9,
        reviewsCount: 12,
        price: "₹45,000",
        priceNum: 45000,
        city: "Mumbai",
        state: "Maharashtra",
        travelsPanIndia: true,
        travelsInternational: false,
        performanceDuration: "90–120 mins",
        bandType: "4-6 Piece Band",
        experienceYears: 5,
        eventsCompleted: 80,
        primaryInstruments: ["Vocals", "Guitar"],
        themeColor: "#9A7219",
        whatElseTheyDo: [
          { category: "Acoustic Pop", description: "Unplugged melodies", icon: "🎵" },
          { category: "Bollywood Dance", description: "High-energy dance hits", icon: "🎬" },
        ],
        sampleSetlist: ["Signature Anthem", "Popular Medley", "Celebration Encore"],
        sampleTracks: [{ title: "Live Concert Sample", duration: "4:30", type: "Live Concert" }],
        techRider: [
          "2 Wireless Vocal Mics",
          "2 DI Boxes for Instruments",
          "Stage Monitors with AUX send",
        ],
        reviews: [],
      };
      setFormData(defaultState);
      setInstrumentsInput("Vocals, Guitar");
      setSetlistInput("Signature Anthem\nPopular Medley\nCelebration Encore");
      setTechRiderInput("2 Wireless Vocal Mics\n2 DI Boxes for Instruments\nStage Monitors with AUX send");
    }
  }, [artist, isOpen]);

  if (!isOpen) return null;

  const handleGenreChange = (genre: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => {
    const meta = GENRE_METADATA[genre];
    setFormData(prev => ({
      ...prev,
      genre,
      genreTitle: meta ? meta.title : genre.toUpperCase(),
      themeColor: "#9A7219",
    }));
  };

  const handlePriceChange = (val: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, ""), 10) || 0;
    const formatted = num > 0 ? `₹${num.toLocaleString("en-IN")}` : "₹0";
    setFormData(prev => ({
      ...prev,
      price: formatted,
      priceNum: num,
    }));
  };

  const handleVersatilityChange = (idx: number, field: "category" | "description" | "icon", value: string) => {
    setFormData(prev => {
      const items = [...(prev.whatElseTheyDo || [])];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, whatElseTheyDo: items };
    });
  };

  const handleAddVersatility = () => {
    setFormData(prev => ({
      ...prev,
      whatElseTheyDo: [
        ...(prev.whatElseTheyDo || []),
        { category: "New Style / Genre", description: "Live performance style", icon: "✨" },
      ],
    }));
  };

  const handleRemoveVersatility = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      whatElseTheyDo: (prev.whatElseTheyDo || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert("Please enter the artist or band name.");
      return;
    }

    const instruments = instrumentsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const setlist = setlistInput
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);

    const techRider = techRiderInput
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);

    const updated: Artist = {
      id: formData.id || `artist-${Date.now()}`,
      name: formData.name || "Untitled Artist",
      stageName: formData.stageName || undefined,
      genre: formData.genre || "sufi",
      genreTitle: formData.genreTitle || "Sufi & Qawwali",
      tagline: formData.tagline || "Professional Live Performer",
      bio: formData.bio || "Acclaimed live performer with extensive experience.",
      img: formData.img || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&auto=format",
      rating: Number(formData.rating) || 4.9,
      reviewsCount: Number(formData.reviewsCount) || 10,
      price: formData.price || "₹35,000",
      priceNum: Number(formData.priceNum) || 35000,
      city: formData.city || "Mumbai",
      state: formData.state || "Maharashtra",
      travelsPanIndia: formData.travelsPanIndia ?? true,
      travelsInternational: formData.travelsInternational ?? false,
      performanceDuration: formData.performanceDuration || "90 mins",
      bandType: formData.bandType || "4-6 Piece Band",
      experienceYears: Number(formData.experienceYears) || 5,
      eventsCompleted: Number(formData.eventsCompleted) || 50,
      primaryInstruments: instruments.length > 0 ? instruments : ["Vocals"],
      themeColor: "#9A7219",
      whatElseTheyDo: formData.whatElseTheyDo && formData.whatElseTheyDo.length > 0
        ? formData.whatElseTheyDo
        : [{ category: "Live Performance", description: "Signature concert sets", icon: "🎤" }],
      sampleSetlist: setlist.length > 0 ? setlist : ["Sample Track 1", "Sample Track 2"],
      sampleTracks: formData.sampleTracks || [{ title: "Live Concert Track", duration: "4:00", type: "Live" }],
      techRider: techRider.length > 0 ? techRider : ["2 Vocal Mics", "1 DI Box"],
      reviews: formData.reviews || [],
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-6 border border-[#EDE8DF] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8DF] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EDE8DF] flex items-center justify-center text-[#C4952A]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-medium text-[#1A1A1A]">
                  {artist ? `Edit Artist: ${artist.name}` : "Add New Artist"}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-ui px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Preview Active
                </span>
              </div>
              <p className="font-ui text-xs text-[#7A776F]">
                Edit profile details with side-by-side real-time preview before publishing live
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Tab Toggle */}
            <div className="flex lg:hidden bg-[#FAF7F2] p-1 rounded-xl border border-[#EDE8DF]">
              <button
                type="button"
                onClick={() => setMobileTab("edit")}
                className={`text-xs px-3 py-1 rounded-lg font-ui font-semibold ${
                  mobileTab === "edit" ? "bg-white shadow-xs text-[#1A1916]" : "text-[#7A776F]"
                }`}
              >
                ✏️ Edit
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("preview")}
                className={`text-xs px-3 py-1 rounded-lg font-ui font-semibold ${
                  mobileTab === "preview" ? "bg-white shadow-xs text-[#1A1916]" : "text-[#7A776F]"
                }`}
              >
                👁️ Preview
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EDE8DF] text-[#5B5B5B] hover:text-[#1A1916] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer border border-[#EDE8DF]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form & Preview Container */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-4 sm:px-8 py-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Inputs (7 cols) */}
            <div className={`lg:col-span-7 space-y-6 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}>
              {/* Section 1: Basic Identity */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE8DF] space-y-4">
                <h3 className="font-ui font-bold text-xs text-[#C4952A] uppercase tracking-wider flex items-center gap-2">
                  <span>1.</span> Basic Information &amp; Genre
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Artist / Troupe Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zakir Khan & Sufi Souls"
                      value={formData.name || ""}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C4952A]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Stage Name / Moniker (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Soul Qawwal"
                      value={formData.stageName || ""}
                      onChange={e => setFormData(p => ({ ...p, stageName: e.target.value }))}
                      className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C4952A]/30"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Primary Genre *
                    </label>
                    <select
                      value={formData.genre || "sufi"}
                      onChange={e => handleGenreChange(e.target.value as any)}
                      className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C4952A]/30 cursor-pointer capitalize"
                    >
                      {GENRE_OPTIONS.map(g => (
                        <option key={g} value={g}>
                          {g.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Band Ensemble Size
                    </label>
                    <select
                      value={formData.bandType || "4-6 Piece Band"}
                      onChange={e => setFormData(p => ({ ...p, bandType: e.target.value as any }))}
                      className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C4952A]/30 cursor-pointer"
                    >
                      {BAND_TYPES.map(b => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Headline Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Contemporary & Traditional Qawwali Ensemble"
                    value={formData.tagline || ""}
                    onChange={e => setFormData(p => ({ ...p, tagline: e.target.value }))}
                    className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C4952A]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Artist Biography / Story
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe artist history, prestigious concerts performed, and stage presence..."
                    value={formData.bio || ""}
                    onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                    className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C4952A]/30"
                  />
                </div>
              </div>

              {/* Section 2: Image & Location & Rates */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE8DF] space-y-4">
                <h3 className="font-ui font-bold text-xs text-[#C4952A] uppercase tracking-wider flex items-center gap-2">
                  <span>2.</span> Photography, Location &amp; Booking Rates
                </h3>

                <div className="grid sm:grid-cols-3 gap-4 items-start">
                  <div className="sm:col-span-2 space-y-3">
                    {/* Photo Options */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#3A3A3A]">
                          Artist Profile Photo *
                        </label>
                        <div className="flex items-center gap-1 bg-white border border-[#EDE8DF] p-0.5 rounded-lg text-[10px]">
                          <button
                            type="button"
                            onClick={() => setImageSourceMode("upload")}
                            className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                              imageSourceMode === "upload"
                                ? "bg-[#C4952A] text-white"
                                : "text-[#5B5B5B] hover:text-[#1A1A1A]"
                            }`}
                          >
                            📁 Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsMediaPickerOpen(true)}
                            className="px-2 py-0.5 rounded font-semibold text-[#5B5B5B] hover:text-[#C4952A] hover:bg-[#FAF7F2] transition-colors"
                          >
                            🖼️ Media Library
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageSourceMode("url")}
                            className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                              imageSourceMode === "url"
                                ? "bg-[#C4952A] text-white"
                                : "text-[#5B5B5B] hover:text-[#1A1A1A]"
                            }`}
                          >
                            🔗 Web URL
                          </button>
                        </div>
                      </div>

                      {imageSourceMode === "upload" ? (
                        <div className="relative border-2 border-dashed border-[#EDE8DF] hover:border-[#C4952A] rounded-2xl p-4 bg-white text-center cursor-pointer transition-colors group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-1">
                            <div className="text-2xl group-hover:scale-110 transition-transform inline-block">
                              📸
                            </div>
                            <div className="text-xs font-semibold text-[#1A1A1A]">
                              Click or Drag image here to upload
                            </div>
                            <div className="text-[10px] text-[#7A776F]">
                              PNG, JPG, WEBP from your computer
                            </div>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={formData.img || ""}
                          onChange={e => setFormData(p => ({ ...p, img: e.target.value }))}
                          className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C4952A]/30"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                          Base City
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mumbai"
                          value={formData.city || ""}
                          onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                          className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Maharashtra"
                          value={formData.state || ""}
                          onChange={e => setFormData(p => ({ ...p, state: e.target.value }))}
                          className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                          Starting Booking Fee (₹)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 50000"
                          value={formData.priceNum ? String(formData.priceNum) : ""}
                          onChange={e => handlePriceChange(e.target.value)}
                          className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                          Performance Duration
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 90–120 mins"
                          value={formData.performanceDuration || ""}
                          onChange={e => setFormData(p => ({ ...p, performanceDuration: e.target.value }))}
                          className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo Preview */}
                  <div className="text-center">
                    <span className="block text-[11px] font-semibold text-[#5B5B5B] mb-1">Photo Preview</span>
                    <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-100 border border-[#EDE8DF] shadow-inner relative group">
                      {formData.img ? (
                        <>
                          <img
                            src={formData.img}
                            alt="Artist Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, img: "" }))}
                            className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Image"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400 p-2">
                          <span>No Image</span>
                          <span className="text-[10px] text-gray-400 mt-1">Upload or choose</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#EDE8DF]">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Experience (Yrs)
                    </label>
                    <input
                      type="number"
                      value={formData.experienceYears || 5}
                      onChange={e => setFormData(p => ({ ...p, experienceYears: Number(e.target.value) }))}
                      className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Events Done
                    </label>
                    <input
                      type="number"
                      value={formData.eventsCompleted || 50}
                      onChange={e => setFormData(p => ({ ...p, eventsCompleted: Number(e.target.value) }))}
                      className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={formData.rating || 4.9}
                      onChange={e => setFormData(p => ({ ...p, rating: Number(e.target.value) }))}
                      className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs font-ui text-[#4A4845] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.travelsPanIndia ?? true}
                      onChange={e => setFormData(p => ({ ...p, travelsPanIndia: e.target.checked }))}
                      className="w-4 h-4 rounded border-[#EDE8DF] text-[#C4952A] focus:ring-[#C4952A]"
                    />
                    <span>Travels Pan-India</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-ui text-[#4A4845] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.travelsInternational ?? false}
                      onChange={e => setFormData(p => ({ ...p, travelsInternational: e.target.checked }))}
                      className="w-4 h-4 rounded border-[#EDE8DF] text-[#C4952A] focus:ring-[#C4952A]"
                    />
                    <span>Travels Internationally</span>
                  </label>
                </div>
              </div>

              {/* Section 3: Multi-Talented Versatility */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE8DF] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-ui font-bold text-xs text-[#C4952A] uppercase tracking-wider flex items-center gap-2">
                      <span>3.</span> Multi-Talent Versatility ("What Else They Do")
                    </h3>
                    <p className="font-ui text-xs text-[#7A776F] mt-0.5">
                      Showcase extra performance formats (e.g. Mehfils, Acoustic Sets, Folk Fusion)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVersatility}
                    className="text-xs font-bold text-[#C4952A] bg-white border border-[#EDE8DF] hover:bg-[#FAF7F2] px-3 py-1.5 rounded-full cursor-pointer transition-colors shadow-2xs"
                  >
                    + Add Style
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.whatElseTheyDo || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-[#EDE8DF]">
                      <input
                        type="text"
                        placeholder="Icon"
                        value={item.icon || "🎵"}
                        onChange={e => handleVersatilityChange(idx, "icon", e.target.value)}
                        className="w-12 text-center text-xs font-ui border border-[#EDE8DF] rounded-lg py-1.5"
                      />
                      <input
                        type="text"
                        placeholder="Category / Genre"
                        value={item.category || ""}
                        onChange={e => handleVersatilityChange(idx, "category", e.target.value)}
                        className="w-44 text-xs font-ui border border-[#EDE8DF] rounded-lg px-2.5 py-1.5"
                      />
                      <input
                        type="text"
                        placeholder="Description of what they perform"
                        value={item.description || ""}
                        onChange={e => handleVersatilityChange(idx, "description", e.target.value)}
                        className="flex-1 text-xs font-ui border border-[#EDE8DF] rounded-lg px-2.5 py-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVersatility(idx)}
                        className="text-xs text-red-500 hover:text-red-700 px-2 py-1 cursor-pointer font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Instruments, Setlist & Tech Rider */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE8DF] space-y-4">
                <h3 className="font-ui font-bold text-xs text-[#C4952A] uppercase tracking-wider flex items-center gap-2">
                  <span>4.</span> Instruments, Setlist &amp; Technical Rider
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Primary Instruments (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Harmonium, Tabla, Dholak, Vocals, Acoustic Guitar"
                    value={instrumentsInput}
                    onChange={e => setInstrumentsInput(e.target.value)}
                    className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Sample Setlist (One song per line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Dama Dam Mast Qalandar&#10;Kun Faya Kun&#10;Afreen Afreen"
                      value={setlistInput}
                      onChange={e => setSetlistInput(e.target.value)}
                      className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Tech Rider Requirements (One requirement per line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="4 Vocal Mics with boom stands&#10;2 DI Boxes&#10;2 Stage Monitors"
                      value={techRiderInput}
                      onChange={e => setTechRiderInput(e.target.value)}
                      className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Preview (5 cols) */}
            <div className={`lg:col-span-5 ${mobileTab === "edit" ? "hidden lg:block" : "block"}`}>
              <div className="sticky top-0 space-y-4">
                {/* Preview Toolbar */}
                <div className="flex items-center justify-between bg-[#FAF7F2] p-2 rounded-2xl border border-[#EDE8DF]">
                  <div className="flex items-center gap-1.5 px-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-ui text-xs font-bold text-[#1A1916]">Live Preview</span>
                  </div>

                  <div className="flex items-center bg-white p-1 rounded-xl border border-[#EDE8DF]">
                    <button
                      type="button"
                      onClick={() => setPreviewStyle("card")}
                      className={`text-xs px-2.5 py-1 rounded-lg font-ui transition-all ${
                        previewStyle === "card"
                          ? "bg-[#1A1916] text-[#FAF7F2] font-semibold shadow-xs"
                          : "text-[#7A776F] hover:text-[#1A1916]"
                      }`}
                    >
                      🎴 Card View
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewStyle("detail")}
                      className={`text-xs px-2.5 py-1 rounded-lg font-ui transition-all ${
                        previewStyle === "detail"
                          ? "bg-[#1A1916] text-[#FAF7F2] font-semibold shadow-xs"
                          : "text-[#7A776F] hover:text-[#1A1916]"
                      }`}
                    >
                      📜 Detail View
                    </button>
                  </div>
                </div>

                {/* ─── PREVIEW STYLE 1: Discovery Card Preview ─── */}
                {previewStyle === "card" && (
                  <div className="bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-lg border border-[#EDE8DF] transition-all flex flex-col">
                    {/* Hero Banner */}
                    <div className="relative h-64 overflow-hidden bg-gray-900">
                      <img
                        src={formData.img || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&auto=format"}
                        alt={formData.name || "Performer"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      {/* Top Badges */}
                      <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#1A1916] font-ui text-[10px] font-bold px-3 py-1 rounded-full shadow-sm capitalize">
                        {formData.genreTitle || formData.genre || "Sufi & Qawwali"}
                      </span>
                      <span className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md text-[#DDB96A] border border-[#DDB96A]/30 font-ui text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        ✓ Verified
                      </span>

                      {/* Bottom Image Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-serif text-2xl text-white drop-shadow-md leading-tight">
                          {formData.name || "Performer Name"}
                        </h3>
                        <p className="font-ui text-[11px] text-white/80 font-light mt-0.5 line-clamp-1">
                          {formData.tagline || "Professional Live Performer"}
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3 bg-white">
                      {/* Meta stats */}
                      <div className="flex items-center justify-between text-[11px] font-ui text-[#7A776F] border-b border-[#EDE8DF] pb-2.5">
                        <div className="flex items-center gap-1 text-[#C4952A] font-bold">
                          <span>★</span>
                          <span>{formData.rating || 4.9}</span>
                          <span className="text-[#7A776F] font-normal">({formData.reviewsCount || 10})</span>
                        </div>
                        <span>📍 {formData.city || "Mumbai"}</span>
                        <span>👥 {formData.bandType || "4-6 Piece Band"}</span>
                      </div>

                      {/* Bio snippet */}
                      <p className="font-ui text-xs text-[#4A4845] line-clamp-2 leading-relaxed">
                        {formData.bio || "Performer biography and signature artistic repertoire will appear here."}
                      </p>

                      {/* Instruments pill tags */}
                      {instrumentsInput && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {instrumentsInput.split(",").slice(0, 3).map((instr, i) => (
                            <span key={i} className="text-[10px] font-ui px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EDE8DF] text-[#4A4845]">
                              🎵 {instr.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#EDE8DF]">
                        <div>
                          <span className="text-[10px] font-ui text-[#7A776F] block uppercase tracking-wider">Starting from</span>
                          <span className="font-serif text-lg font-bold text-[#1A1916]">{formData.price || "₹45,000"}</span>
                        </div>
                        <span className="font-ui text-xs font-semibold px-4 py-2 rounded-full bg-[#1A1916] text-[#FAF7F2] shadow-sm">
                          View Profile →
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── PREVIEW STYLE 2: Full Profile Detail Preview ─── */}
                {previewStyle === "detail" && (
                  <div className="bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-lg border border-[#EDE8DF] flex flex-col text-[#1A1916]">
                    {/* Header Banner */}
                    <div className="relative h-44 overflow-hidden bg-gray-900">
                      <img
                        src={formData.img || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&auto=format"}
                        alt={formData.name || "Performer"}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1916] via-[#1A1916]/40 to-transparent" />

                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-[#1A1916]/80 text-[#DDB96A] text-[9px] font-ui font-bold px-2.5 py-0.5 rounded-full border border-[#DDB96A]/30">
                          {formData.genreTitle || "Sufi"}
                        </span>
                        <span className="bg-white/20 text-white text-[9px] font-ui font-semibold px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-serif text-xl font-medium leading-tight">
                          {formData.name || "Performer Name"}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-ui text-white/80 mt-0.5">
                          <span>📍 {formData.city}</span>
                          <span>•</span>
                          <span>★ {formData.rating}</span>
                          <span>•</span>
                          <span>🎪 {formData.eventsCompleted}+ Events</span>
                        </div>
                      </div>
                    </div>

                    {/* Sub-tabs inside Detail Preview */}
                    <div className="flex border-b border-[#EDE8DF] bg-white text-xs font-ui font-semibold">
                      <button
                        type="button"
                        onClick={() => setDetailPreviewTab("about")}
                        className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                          detailPreviewTab === "about"
                            ? "border-[#C4952A] text-[#1A1916]"
                            : "border-transparent text-[#7A776F] hover:text-[#1A1916]"
                        }`}
                      >
                        About &amp; Versatility
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetailPreviewTab("repertoire")}
                        className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                          detailPreviewTab === "repertoire"
                            ? "border-[#C4952A] text-[#1A1916]"
                            : "border-transparent text-[#7A776F] hover:text-[#1A1916]"
                        }`}
                      >
                        Repertoire &amp; Specs
                      </button>
                    </div>

                    {/* Detail Body */}
                    <div className="p-4 bg-white space-y-3 text-xs font-ui max-h-72 overflow-y-auto">
                      {detailPreviewTab === "about" ? (
                        <>
                          <div>
                            <span className="text-[10px] font-bold text-[#7A776F] uppercase tracking-wider block mb-1">
                              Artistic Heritage &amp; Bio
                            </span>
                            <p className="text-[#4A4845] leading-relaxed">
                              {formData.bio || "Full performer background will be showcased here."}
                            </p>
                          </div>

                          {/* Versatility List */}
                          {(formData.whatElseTheyDo || []).length > 0 && (
                            <div>
                              <span className="text-[10px] font-bold text-[#7A776F] uppercase tracking-wider block mb-1.5">
                                Performance Versatility
                              </span>
                              <div className="space-y-1.5">
                                {(formData.whatElseTheyDo || []).map((item, idx) => (
                                  <div key={idx} className="p-2 rounded-xl bg-[#FAF7F2] border border-[#EDE8DF] flex items-center gap-2">
                                    <span className="text-base">{item.icon || "✨"}</span>
                                    <div>
                                      <p className="font-semibold text-[#1A1916] text-[11px]">{item.category}</p>
                                      <p className="text-[10px] text-[#7A776F]">{item.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Setlist */}
                          <div>
                            <span className="text-[10px] font-bold text-[#7A776F] uppercase tracking-wider block mb-1">
                              Sample Repertoire Setlist
                            </span>
                            <div className="space-y-1">
                              {(setlistInput ? setlistInput.split("\n") : []).map((song, i) => (
                                song.trim() && (
                                  <div key={i} className="flex items-center gap-2 py-1 border-b border-[#EDE8DF]/60 text-[11px] text-[#4A4845]">
                                    <span className="text-[#C4952A]">🎵</span>
                                    <span>{song.trim()}</span>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>

                          {/* Tech Rider */}
                          <div className="pt-2">
                            <span className="text-[10px] font-bold text-[#7A776F] uppercase tracking-wider block mb-1">
                              Technical Rider Specs
                            </span>
                            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#4A4845]">
                              {(techRiderInput ? techRiderInput.split("\n") : []).map((req, i) => (
                                req.trim() && <li key={i}>{req.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Bottom action bar */}
                    <div className="px-4 py-3 bg-[#FAF7F2] border-t border-[#EDE8DF] flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-[#7A776F] uppercase tracking-wider block">Booking Tier</span>
                        <span className="font-serif text-base font-bold text-[#1A1916]">{formData.price || "₹45,000"}</span>
                      </div>
                      <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-[#C4952A] text-[#1A1916]">
                        Send Enquiry →
                      </span>
                    </div>
                  </div>
                )}

                {/* Helpful Note */}
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE8DF] text-[11px] font-ui text-[#7A776F] space-y-1">
                  <p className="font-semibold text-[#1A1916] flex items-center gap-1.5">
                    <span>👁️</span> Live Preview Explanation
                  </p>
                  <p>
                    Every change in name, photo, fee, repertoire, or bio updates this preview in real time. Switch between <strong>Card View</strong> and <strong>Detail View</strong> to inspect the guest experience before saving.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer Actions */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-4 pb-2 border-t border-[#EDE8DF] flex items-center justify-between z-20 mt-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-ui text-[#7A776F]">
              <span>💡 Press Save to apply your changes to the live CMS.</span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-[#EDE8DF] text-xs font-ui font-semibold text-[#5B5B5B] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-7 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] text-xs font-ui font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>✓</span>
                <span>{artist ? "Save Artist Changes" : "Create & Publish Artist"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mediaList={mediaList}
        onUploadMedia={onUploadMedia}
        onSelectMedia={(url) => {
          setFormData(p => ({ ...p, img: url }));
          setIsMediaPickerOpen(false);
        }}
        title="Select Artist Profile Photo"
      />
    </div>
  );
}
