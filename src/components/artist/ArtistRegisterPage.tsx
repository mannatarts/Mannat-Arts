import { useState } from "react";
import { AuthService } from "../../services/authService";
import { PlatformStore } from "../../services/platformStore";
import { ArtistApplicationProfile, ArtistVideoLink } from "../../types/platform";

interface ArtistRegisterPageProps {
  onSuccess: (profile: ArtistApplicationProfile) => void;
  onGoToLogin: () => void;
  onBackToSite: () => void;
}

export function ArtistRegisterPage({
  onSuccess,
  onGoToLogin,
  onBackToSite,
}: ArtistRegisterPageProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"card" | "profile">("card");
  const [mobileViewTab, setMobileViewTab] = useState<"form" | "preview">("form");
  const [activeProfileTab, setActiveProfileTab] = useState<"about" | "media" | "booking">("about");

  // STEP 1 — ACCOUNT
  const [account, setAccount] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  // STEP 2 — ARTIST PROFILE
  const [profile, setProfile] = useState({
    stageName: "",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1000&fit=crop&auto=format&q=80",
    coverImg: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&h=800&fit=crop&auto=format&q=80",
    shortBio: "",
    bio: "",
    city: "",
    state: "",
    country: "India",
    languages: ["Hindi", "English"],
  });

  // STEP 3 — ARTISTIC INFORMATION
  const [artInfo, setArtInfo] = useState<{
    genre: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";
    genreTitle: string;
    secondaryGenres: string[];
    moods: string[];
    performanceTypes: string[];
    occasions: string[];
    experienceYears: number;
    performanceDuration: string;
    bandType: "Solo" | "Duo" | "Trio" | "4-6 Piece Band" | "Full Troupe (8+ Members)";
  }>({
    genre: "sufi",
    genreTitle: "Sufi & Mystic",
    secondaryGenres: ["devotional"],
    moods: ["Soulful", "Intimate"],
    performanceTypes: ["Acoustic Baithak", "Live Concert"],
    occasions: ["Wedding", "Private Celebration"],
    experienceYears: 6,
    performanceDuration: "90 - 120 minutes",
    bandType: "4-6 Piece Band",
  });

  // STEP 4 — PORTFOLIO
  const [portfolio, setPortfolio] = useState<{
    portfolioImages: string[];
    videoLinks: ArtistVideoLink[];
    previousPerformances: string[];
    youtubeUrl: string;
    vimeoUrl: string;
  }>({
    portfolioImages: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format&q=80",
    ],
    videoLinks: [
      {
        id: "vid-1",
        title: "Live Sangeet Performance",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        platform: "youtube",
      },
    ],
    previousPerformances: [
      "Heritage Music Festival, Rajasthan (2025)",
      "Taj Lake Palace Private Sangeet (2025)",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    vimeoUrl: "",
  });

  // STEP 5 — PROFESSIONAL INFORMATION
  const [professional, setProfessional] = useState<{
    availabilityStatus: "available" | "limited" | "unavailable";
    serviceLocations: string[];
    travelsPanIndia: boolean;
    travelsInternational: boolean;
    price: string;
    priceNum: number;
    contactPreference: "email" | "phone" | "whatsapp" | "platform";
  }>({
    availabilityStatus: "available",
    serviceLocations: ["Mumbai", "Delhi NCR", "Jaipur", "Udaipur"],
    travelsPanIndia: true,
    travelsInternational: false,
    price: "₹85,000",
    priceNum: 85000,
    contactPreference: "platform",
  });

  // STEP 6 — SOCIAL LINKS
  const [social, setSocial] = useState({
    instagram: "",
    youtube: "",
    facebook: "",
    website: "",
  });

  // STEP 7 — AGREEMENT
  const [agreement, setAgreement] = useState({
    termsAgreed: false,
    privacyAgreed: false,
  });

  // Available options
  const allMoods = ["Soulful", "Intimate", "Reflective", "Ecstatic", "Celebratory", "Energise", "Devotional"];
  const allOccasions = ["Wedding", "Private Celebration", "Corporate Gala", "Festival", "Cultural Event", "College Fest"];
  const allPerfTypes = ["Acoustic Baithak", "Live Concert", "Classical Recital", "Grand Stage Show", "Intimate Lounge"];

  // Step Validation
  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!account.fullName.trim()) {
        setErrorMsg("Please enter your full name.");
        return false;
      }
      if (!account.email.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return false;
      }
      if (!account.mobile.trim() || account.mobile.length < 8) {
        setErrorMsg("Please enter a valid mobile number.");
        return false;
      }
      if (account.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return false;
      }
      if (account.password !== account.confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!profile.stageName.trim()) {
        setErrorMsg("Please specify your Artist or Stage Name.");
        return false;
      }
      if (!profile.shortBio.trim()) {
        setErrorMsg("Please provide a concise tagline or short summary.");
        return false;
      }
      if (!profile.bio.trim() || profile.bio.length < 20) {
        setErrorMsg("Please write a detailed biography (minimum 20 characters).");
        return false;
      }
      if (!profile.city.trim() || !profile.state.trim()) {
        setErrorMsg("Please provide your primary city and state.");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!artInfo.genre) {
        setErrorMsg("Please choose your primary genre.");
        return false;
      }
      if (artInfo.moods.length === 0) {
        setErrorMsg("Please select at least one mood.");
        return false;
      }
      if (artInfo.occasions.length === 0) {
        setErrorMsg("Please select at least one suitable occasion.");
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (portfolio.portfolioImages.length === 0) {
        setErrorMsg("Please upload or provide at least one portfolio image link.");
        return false;
      }
      return true;
    }

    if (step === 5) {
      if (professional.priceNum <= 0) {
        setErrorMsg("Please enter a valid starting price / performance fee.");
        return false;
      }
      return true;
    }

    if (step === 6) {
      return true;
    }

    if (step === 7) {
      if (!agreement.termsAgreed || !agreement.privacyAgreed) {
        setErrorMsg("You must accept both the Terms and Privacy Policy to submit.");
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 7));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitApplication = async () => {
    if (!validateStep(7)) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Register User Account
      const { user } = await AuthService.register({
        name: account.fullName,
        email: account.email,
        password: account.password,
        phone: account.mobile,
        role: "artist",
      });

      // 2. Prepare video links
      const finalVideos = [...portfolio.videoLinks];
      if (portfolio.youtubeUrl && !finalVideos.some((v) => v.url === portfolio.youtubeUrl)) {
        finalVideos.push({
          id: `vid-${Date.now()}-yt`,
          title: "Performance Showcase",
          url: portfolio.youtubeUrl,
          platform: "youtube",
        });
      }
      if (portfolio.vimeoUrl && !finalVideos.some((v) => v.url === portfolio.vimeoUrl)) {
        finalVideos.push({
          id: `vid-${Date.now()}-vm`,
          title: "Vimeo Showcase",
          url: portfolio.vimeoUrl,
          platform: "vimeo",
        });
      }

      // 3. Create Canonical Artist Application Profile
      const appProfile = PlatformStore.createArtistApplication({
        userId: user.id,
        name: profile.stageName.trim() || account.fullName.trim(),
        stageName: profile.stageName.trim(),
        email: account.email.trim(),
        phone: account.mobile.trim(),
        img: profile.img,
        coverImg: profile.coverImg,
        shortBio: profile.shortBio,
        bio: profile.bio,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        languages: profile.languages,
        genre: artInfo.genre,
        genreTitle:
          artInfo.genre === "sufi"
            ? "Sufi & Mystic"
            : artInfo.genre === "gazal"
            ? "Ghazal & Classical"
            : artInfo.genre === "rock"
            ? "Indie & Fusion Rock"
            : artInfo.genre === "bollywood"
            ? "Bollywood & Folk"
            : artInfo.genre === "carnival"
            ? "Theatrical Carnival"
            : "Devotional & Spiritual",
        secondaryGenres: artInfo.secondaryGenres,
        moods: artInfo.moods,
        occasions: artInfo.occasions,
        performanceTypes: artInfo.performanceTypes,
        experienceYears: artInfo.experienceYears,
        performanceDuration: artInfo.performanceDuration,
        bandType: artInfo.bandType,
        primaryInstruments: ["Vocals", "Acoustic Instruments"],
        portfolioImages: portfolio.portfolioImages,
        videoLinks: finalVideos,
        externalLinks: social.website ? [{ label: "Official Website", url: social.website }] : [],
        previousPerformances: portfolio.previousPerformances,
        sampleSetlist: ["Sample Signature Track 1", "Sample Signature Track 2"],
        techRider: ["Vocal Mics", "D.I. Box", "Stage Monitors"],
        availabilityStatus: professional.availabilityStatus,
        serviceLocations: professional.serviceLocations,
        travelsPanIndia: professional.travelsPanIndia,
        travelsInternational: professional.travelsInternational,
        price: professional.price,
        priceNum: professional.priceNum,
        contactPreference: professional.contactPreference,
        instagram: social.instagram,
        youtube: social.youtube,
        facebook: social.facebook,
        website: social.website,
        rating: 5.0,
        reviewsCount: 0,
        eventsCompleted: 0,
      });

      // Update user with artistProfileId
      AuthService.updateUser(user.id, { artistProfileId: appProfile.id });

      setIsSubmitting(false);
      onSuccess(appProfile);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || "Something went wrong while submitting your application.");
    }
  };

  const stepsList = [
    { num: "01", label: "Account" },
    { num: "02", label: "Profile" },
    { num: "03", label: "Artistic" },
    { num: "04", label: "Portfolio" },
    { num: "05", label: "Professional" },
    { num: "06", label: "Social" },
    { num: "07", label: "Review" },
  ];

  return (
    <div
      className="min-h-screen bg-[#FAF7F2] text-[#1A1916] flex flex-col font-ui"
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      {/* Top Header */}
      <header className="border-b border-[#EDE8DF] bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
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
                ARTIST COMMUNITY ONBOARDING
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#7A776F] hidden sm:inline">Already registered?</span>
            <button
              onClick={onGoToLogin}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-[#EDE8DF] hover:border-[#C4952A] text-[#1A1916] bg-white transition-all cursor-pointer shadow-2xs"
            >
              Artist Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Stepper Progress Bar */}
      <div className="bg-[#F5F0E8] border-b border-[#EDE8DF] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div>
              <span className="label-editorial text-[#C4952A]" style={{ fontSize: "8px" }}>
                STEP {currentStep} OF 7
              </span>
              <h1
                className="font-serif font-light text-2xl sm:text-3xl text-[#1A1916]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Create Your Performer Profile
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-ui text-[#7A776F] bg-white/80 px-3.5 py-1.5 rounded-full border border-[#EDE8DF] self-start md:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time Public Profile Preview Active</span>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 py-1">
            {stepsList.map((st, idx) => {
              const stepIndex = idx + 1;
              const isPast = stepIndex < currentStep;
              const isCurrent = stepIndex === currentStep;

              return (
                <div
                  key={st.num}
                  onClick={() => {
                    if (stepIndex < currentStep) setCurrentStep(stepIndex);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? "bg-[#1A1916] text-[#FAF7F2] font-semibold shadow-xs"
                      : isPast
                      ? "bg-white text-[#C4952A] font-medium border border-[#C4952A]/30"
                      : "text-[#7A776F] opacity-60"
                  }`}
                >
                  <span className="text-[10px] font-mono">{isPast ? "✓" : st.num}</span>
                  <span>{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container: Split 2-Column on Desktop */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile View Toggle */}
        <div className="flex lg:hidden items-center justify-center mb-6 bg-[#EDE8DF]/60 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setMobileViewTab("form")}
            className={`flex-1 py-2 text-xs font-ui font-semibold rounded-xl transition-all ${
              mobileViewTab === "form" ? "bg-white text-[#1A1916] shadow-xs" : "text-[#7A776F]"
            }`}
          >
            📝 Step {currentStep} Form
          </button>
          <button
            type="button"
            onClick={() => setMobileViewTab("preview")}
            className={`flex-1 py-2 text-xs font-ui font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mobileViewTab === "preview" ? "bg-[#1A1916] text-[#FAF7F2] shadow-xs" : "text-[#7A776F]"
            }`}
          >
            <span>👁️ Live Preview Map</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ══════════════════════════════════════════════════════════════════
              LEFT COLUMN: 7-STEP ONBOARDING WIZARD FORM (7 cols)
          ══════════════════════════════════════════════════════════════════ */}
          <div className={`lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8DF] shadow-xl ${
            mobileViewTab === "preview" ? "hidden lg:block" : "block"
          }`}>
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: ACCOUNT */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2
                    className="font-serif text-2xl font-light text-[#1A1916]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    01. Artist Account Credentials
                  </h2>
                  <p className="text-xs text-[#7A776F] mt-1">
                    Create your secure login to manage your artist profile and receive booking opportunities.
                  </p>
                  <div className="mt-3 p-3 bg-stone-50 border border-[#EDE8DF] rounded-xl flex items-center gap-2 text-stone-600 text-xs">
                    <span>🔒</span>
                    <span><strong>Privacy Note:</strong> Your email, mobile number, and login details are kept private and confidential. They will NEVER be displayed publicly on client cards.</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Full Legal Name *
                      </label>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">🔒 Private (Contracts &amp; Payouts)</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Ustad Kabir Hassan"
                      value={account.fullName}
                      onChange={(e) => setAccount({ ...account, fullName: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Official Email Address *
                      </label>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">🔒 Private Login</span>
                    </div>
                    <input
                      type="email"
                      placeholder="artist@example.com"
                      value={account.email}
                      onChange={(e) => setAccount({ ...account, email: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Mobile / WhatsApp *
                      </label>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">🔒 Booking Alerts</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="+91 98201 XXXXX"
                      value={account.mobile}
                      onChange={(e) => setAccount({ ...account, mobile: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">
                      Create Password * (min. 6 chars)
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={account.password}
                      onChange={(e) => setAccount({ ...account, password: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={account.confirmPassword}
                      onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ARTIST PROFILE */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2
                    className="font-serif text-2xl font-light text-[#1A1916]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    02. Public Artist Profile &amp; Bio
                  </h2>
                  <p className="text-xs text-[#7A776F] mt-1">
                    How clients and curators discover your creative identity on Mannat Arts. Look at the preview on the right to see where each field appears!
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Artist / Stage Name *
                      </label>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        📍 Main Title on Public Card &amp; Profile Hero
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Kabir Sufi Collective"
                      value={profile.stageName}
                      onChange={(e) => setProfile({ ...profile, stageName: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                        <label className="text-xs font-semibold text-[#1A1916]">
                          Profile Photo URL *
                        </label>
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          📍 Public Card Photo
                        </span>
                      </div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={profile.img}
                        onChange={(e) => setProfile({ ...profile, img: e.target.value })}
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                      />
                      <p className="text-[10px] text-[#7A776F] mt-1">
                        High-resolution square or portrait image recommended.
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                        <label className="text-xs font-semibold text-[#1A1916]">
                          Cover Banner Image URL
                        </label>
                        <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300">
                          📍 Full Profile Hero (16:9)
                        </span>
                      </div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={profile.coverImg}
                        onChange={(e) => setProfile({ ...profile, coverImg: e.target.value })}
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                      />
                      <p className="text-[10px] text-[#7A776F] mt-1">
                        Atmospheric stage background for your profile page.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Short Headline Tagline (One sentence) *
                      </label>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        📍 Card Subtitle &amp; Hero Subtitle
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Soulful mystic poetry and transcendent live acoustic qawwalis."
                      value={profile.shortBio}
                      onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Full Artistic Biography *
                      </label>
                      <span className="text-[10px] font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-300">
                        📍 "About the Artist" Section
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Share your musical journey, training, notable traditions, prestigious festivals performed, and what makes your live experience extraordinary..."
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl p-4 focus:outline-none focus:border-[#C4952A]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#1A1916]">
                          Base City *
                        </label>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">📍 Card Pin</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Jaipur"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#1A1916]">
                          State *
                        </label>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">📍 Location</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Rajasthan"
                        value={profile.state}
                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profile.country}
                        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ARTISTIC INFORMATION */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2
                    className="font-serif text-2xl font-light text-[#1A1916]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    03. Artistic Style &amp; Discovery Matrix
                  </h2>
                  <p className="text-xs text-[#7A776F] mt-1">
                    Connect your performance with our MOOD × OCCASION × GENRE discovery engine. Notice how the badges on the preview update!
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Primary Musical Genre *
                      </label>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        📍 Top Badge on Card &amp; Main Filter Category
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(
                        [
                          { id: "sufi", label: "Sufi & Mystic" },
                          { id: "gazal", label: "Ghazal & Classical" },
                          { id: "rock", label: "Indie Rock" },
                          { id: "bollywood", label: "Bollywood & Folk" },
                          { id: "carnival", label: "Carnival & Theatrical" },
                          { id: "devotional", label: "Devotional & Spiritual" },
                        ] as const
                      ).map((g) => (
                        <button
                          type="button"
                          key={g.id}
                          onClick={() =>
                            setArtInfo({ ...artInfo, genre: g.id, genreTitle: g.label })
                          }
                          className={`p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                            artInfo.genre === g.id
                              ? "bg-[#1A1916] text-[#FAF7F2] border-[#1A1916] shadow-sm"
                              : "bg-[#FAF7F2] text-[#4A4845] border-[#EDE8DF] hover:border-[#C4952A]"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Emotional Moods &amp; Vibes *
                      </label>
                      <span className="text-[10px] font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300">
                        📍 Powers the MOOD Matching Engine &amp; Card Chips
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allMoods.map((m) => {
                        const active = artInfo.moods.includes(m);
                        return (
                          <button
                            type="button"
                            key={m}
                            onClick={() => {
                              const next = active
                                ? artInfo.moods.filter((x) => x !== m)
                                : [...artInfo.moods, m];
                              setArtInfo({ ...artInfo, moods: next });
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                              active
                                ? "bg-[#C4952A] text-[#1A1916] border-[#C4952A] font-semibold"
                                : "bg-[#FAF7F2] text-[#7A776F] border-[#EDE8DF] hover:border-[#C4952A]"
                            }`}
                          >
                            {m} {active && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Suitable Event Occasions *
                      </label>
                      <span className="text-[10px] font-semibold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-300">
                        📍 Powers the OCCASION Recommendations
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allOccasions.map((o) => {
                        const active = artInfo.occasions.includes(o);
                        return (
                          <button
                            type="button"
                            key={o}
                            onClick={() => {
                              const next = active
                                ? artInfo.occasions.filter((x) => x !== o)
                                : [...artInfo.occasions, o];
                              setArtInfo({ ...artInfo, occasions: next });
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                              active
                                ? "bg-[#1A1916] text-[#FAF7F2] border-[#1A1916] font-semibold"
                                : "bg-[#FAF7F2] text-[#7A776F] border-[#EDE8DF] hover:border-[#1A1916]"
                            }`}
                          >
                            {o} {active && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#1A1916]">
                          Band / Troupe Type
                        </label>
                        <span className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">📍 Card Meta</span>
                      </div>
                      <select
                        value={artInfo.bandType}
                        onChange={(e) => setArtInfo({ ...artInfo, bandType: e.target.value as any })}
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2.5 focus:outline-none"
                      >
                        <option>Solo</option>
                        <option>Duo</option>
                        <option>Trio</option>
                        <option>4-6 Piece Band</option>
                        <option>Full Troupe (8+ Members)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={artInfo.experienceYears}
                        onChange={(e) =>
                          setArtInfo({ ...artInfo, experienceYears: parseInt(e.target.value) || 1 })
                        }
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2.5 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">
                        Performance Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 90 - 120 minutes"
                        value={artInfo.performanceDuration}
                        onChange={(e) =>
                          setArtInfo({ ...artInfo, performanceDuration: e.target.value })
                        }
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2.5 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PORTFOLIO */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2
                    className="font-serif text-2xl font-light text-[#1A1916]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    04. Performance Portfolio &amp; Media
                  </h2>
                  <p className="text-xs text-[#7A776F] mt-1">
                    High quality media helps clients envision your live stage presence.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Portfolio Gallery Images (URLs separated by line)
                      </label>
                      <span className="text-[10px] font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-300">
                        📍 Profile Photo Carousel
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={portfolio.portfolioImages.join("\n")}
                      onChange={(e) =>
                        setPortfolio({
                          ...portfolio,
                          portfolioImages: e.target.value
                            .split("\n")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl p-3 focus:outline-none font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                        <label className="text-xs font-semibold text-[#1A1916]">
                          YouTube Live Video Link *
                        </label>
                        <span className="text-[10px] font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                          📍 Playable Video Showcase
                        </span>
                      </div>
                      <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        value={portfolio.youtubeUrl}
                        onChange={(e) => setPortfolio({ ...portfolio, youtubeUrl: e.target.value })}
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">
                        Vimeo Video Link (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://vimeo.com/..."
                        value={portfolio.vimeoUrl}
                        onChange={(e) => setPortfolio({ ...portfolio, vimeoUrl: e.target.value })}
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Notable Past Performances &amp; Venues
                      </label>
                      <span className="text-[10px] font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-300">
                        📍 Notable Stages &amp; Experience Tab
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={portfolio.previousPerformances.join("\n")}
                      onChange={(e) =>
                        setPortfolio({
                          ...portfolio,
                          previousPerformances: e.target.value
                            .split("\n")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="e.g. Royal Wedding, Rambagh Palace Jaipur&#10;Global Heritage Summit, Mumbai"
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl p-3 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: PROFESSIONAL INFORMATION */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2
                    className="font-serif text-2xl font-light text-[#1A1916]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    05. Professional &amp; Booking Logistics
                  </h2>
                  <p className="text-xs text-[#7A776F] mt-1">
                    Availability, travel flexibility, and indicative performance fee.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                        <label className="text-xs font-semibold text-[#1A1916]">
                          Starting Performance Fee (INR) *
                        </label>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          📍 "Starting From" on Card &amp; Booking Form
                        </span>
                      </div>
                      <input
                        type="number"
                        value={professional.priceNum}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setProfessional({
                            ...professional,
                            priceNum: val,
                            price: `₹${val.toLocaleString()}`,
                          });
                        }}
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#1A1916]">
                          Current Availability Status
                        </label>
                        <span className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">📍 Profile Badge</span>
                      </div>
                      <select
                        value={professional.availabilityStatus}
                        onChange={(e) =>
                          setProfessional({
                            ...professional,
                            availabilityStatus: e.target.value as any,
                          })
                        }
                        className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none"
                      >
                        <option value="available">Available for Bookings</option>
                        <option value="limited">Limited Dates Available</option>
                        <option value="unavailable">Temporarily Booked Out</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1A1916]">
                        Travel Availability
                      </span>
                      <span className="text-[10px] font-semibold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-300">
                        📍 Pan-India &amp; International Badges
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A4845]">
                        <input
                          type="checkbox"
                          checked={professional.travelsPanIndia}
                          onChange={(e) =>
                            setProfessional({
                              ...professional,
                              travelsPanIndia: e.target.checked,
                            })
                          }
                          className="rounded accent-[#C4952A]"
                        />
                        <span>Travels Pan-India</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A4845]">
                        <input
                          type="checkbox"
                          checked={professional.travelsInternational}
                          onChange={(e) =>
                            setProfessional({
                              ...professional,
                              travelsInternational: e.target.checked,
                            })
                          }
                          className="rounded accent-[#C4952A]"
                        />
                        <span>Available for International Events</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">
                      Preferred Client Contact Channel
                    </label>
                    <select
                      value={professional.contactPreference}
                      onChange={(e) =>
                        setProfessional({
                          ...professional,
                          contactPreference: e.target.value as any,
                        })
                      }
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none"
                    >
                      <option value="platform">Mannat Arts Platform Enquiries (Recommended)</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp / Phone</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: SOCIAL LINKS */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2
                    className="font-serif text-2xl font-light text-[#1A1916]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    06. Digital &amp; Social Presence
                  </h2>
                  <p className="text-xs text-[#7A776F] mt-1">
                    Connect your verified channels. These appear as clickable icons on your public profile header.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Instagram Handle or URL
                      </label>
                      <span className="text-[10px] font-semibold text-pink-800 bg-pink-100 px-2 py-0.5 rounded-full border border-pink-300">
                        📍 Profile Header Icon
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="@artistname or https://instagram.com/..."
                      value={social.instagram}
                      onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        YouTube Channel URL
                      </label>
                      <span className="text-[10px] font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                        📍 Profile Header Icon
                      </span>
                    </div>
                    <input
                      type="url"
                      placeholder="https://youtube.com/@..."
                      value={social.youtube}
                      onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <label className="text-xs font-semibold text-[#1A1916]">
                        Official Website / Portfolio Link
                      </label>
                      <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300">
                        📍 Profile Header Link
                      </span>
                    </div>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={social.website}
                      onChange={(e) => setSocial({ ...social, website: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1916] mb-1.5">
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={social.facebook}
                      onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: REVIEW & AGREEMENT */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2
                    className="font-serif text-2xl font-light text-[#1A1916]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    07. Review &amp; Submit for Approval
                  </h2>
                  <p className="text-xs text-[#7A776F] mt-1">
                    Check the Live Preview on the right to see exactly how your card and page will appear to clients before submitting.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.img}
                      alt={profile.stageName}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#EDE8DF]"
                    />
                    <div>
                      <h3
                        className="font-serif text-xl font-light text-[#1A1916]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {profile.stageName || account.fullName}
                      </h3>
                      <p className="text-xs text-[#C4952A] font-semibold">{artInfo.genreTitle}</p>
                      <p className="text-[11px] text-[#7A776F]">
                        📍 {profile.city}, {profile.state} · Starting at {professional.price}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#EDE8DF] pt-3 text-xs space-y-2">
                    <div className="flex justify-between text-[#7A776F]">
                      <span>Account Email:</span>
                      <span className="font-semibold text-[#1A1916]">{account.email}</span>
                    </div>
                    <div className="flex justify-between text-[#7A776F]">
                      <span>Moods:</span>
                      <span className="font-semibold text-[#1A1916]">{artInfo.moods.join(", ")}</span>
                    </div>
                    <div className="flex justify-between text-[#7A776F]">
                      <span>Suitable Occasions:</span>
                      <span className="font-semibold text-[#1A1916]">
                        {artInfo.occasions.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#7A776F]">
                      <span>Performance Type:</span>
                      <span className="font-semibold text-[#1A1916]">{artInfo.bandType}</span>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 text-xs text-[#4A4845] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreement.termsAgreed}
                      onChange={(e) =>
                        setAgreement({ ...agreement, termsAgreed: e.target.checked })
                      }
                      className="mt-0.5 rounded accent-[#C4952A]"
                      required
                    />
                    <span>
                      I confirm that the audio/video media provided is authentic, belongs to my ensemble,
                      and agree to the <strong>Mannat Arts Artist Terms of Service</strong>.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 text-xs text-[#4A4845] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreement.privacyAgreed}
                      onChange={(e) =>
                        setAgreement({ ...agreement, privacyAgreed: e.target.checked })
                      }
                      className="mt-0.5 rounded accent-[#C4952A]"
                      required
                    />
                    <span>
                      I agree to the <strong>Privacy Policy</strong> and consent to receiving client enquiries
                      and communications from the Mannat Arts curation desk.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#EDE8DF]">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-xs font-semibold px-6 py-2.5 rounded-full border border-[#EDE8DF] hover:border-[#1A1916] text-[#1A1916] bg-white transition-all cursor-pointer"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-xs font-semibold px-8 py-3 rounded-full bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Save &amp; Continue →
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitApplication}
                  className="text-xs font-semibold px-9 py-3.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#1A1916] border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <span>Submit for Approval ✓</span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT COLUMN: REAL-TIME PREVIEW & "WHERE INFO SHOWS" MAP (5 cols)
          ══════════════════════════════════════════════════════════════════ */}
          <div className={`lg:col-span-5 sticky top-24 space-y-4 ${
            mobileViewTab === "form" ? "hidden lg:block" : "block"
          }`}>
            {/* Preview Toolbar */}
            <div className="bg-white p-3 rounded-2xl border border-[#EDE8DF] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h4 className="font-ui text-xs font-bold text-[#1A1916]">Live Profile Preview</h4>
                  <p className="font-ui text-[10px] text-[#7A776F]">Updates synchronously as you type</p>
                </div>
              </div>

              <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={() => setPreviewMode("card")}
                  className={`text-xs px-3 py-1 rounded-lg font-ui transition-all ${
                    previewMode === "card"
                      ? "bg-[#1A1916] text-[#FAF7F2] font-semibold shadow-xs"
                      : "text-[#7A776F] hover:text-[#1A1916]"
                  }`}
                >
                  🎴 Card View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("profile")}
                  className={`text-xs px-3 py-1 rounded-lg font-ui transition-all ${
                    previewMode === "profile"
                      ? "bg-[#1A1916] text-[#FAF7F2] font-semibold shadow-xs"
                      : "text-[#7A776F] hover:text-[#1A1916]"
                  }`}
                >
                  📜 Full Page View
                </button>
              </div>
            </div>

            {/* Active Step Highlight Guidance Banner */}
            <div className="bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-3.5 text-xs text-[#4A4845] space-y-1">
              <div className="flex items-center gap-2 text-[#C4952A] font-bold text-[11px] uppercase tracking-wider">
                <span>📍</span>
                <span>
                  {currentStep === 1 && "Step 1: Private Account Credentials"}
                  {currentStep === 2 && "Step 2: Identity, Photos & Narrative"}
                  {currentStep === 3 && "Step 3: Genre, Moods & Ensemble Specs"}
                  {currentStep === 4 && "Step 4: Media, Videos & Past Stages"}
                  {currentStep === 5 && "Step 5: Booking Honorarium & Travel"}
                  {currentStep === 6 && "Step 6: Verified Social Channels"}
                  {currentStep === 7 && "Step 7: Complete Profile Dossier"}
                </span>
              </div>
              <p className="text-[11px] text-[#7A776F]">
                {currentStep === 1 && "Account credentials remain strictly private. Elements on the preview card below reflect your public stage profile."}
                {currentStep === 2 && "Stage Name, Profile Photo, Tagline, Bio, and City are highlighted with glowing badges below."}
                {currentStep === 3 && "Primary Genre pill, Emotional Moods, and Ensemble Size are highlighted below."}
                {currentStep === 4 && "Portfolio photos and video showcase preview are highlighted below."}
                {currentStep === 5 && "Starting honorarium and Pan-India / International badges are highlighted below."}
                {currentStep === 6 && "Verified Instagram, YouTube, and Website icons are highlighted below."}
                {currentStep === 7 && "Everything is synchronized. Your artist card and page look stunning and ready for curation review!"}
              </p>
            </div>

            {/* ─── PREVIEW STYLE 1: Public Card View ─── */}
            {previewMode === "card" && (
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-[#EDE8DF] transition-all flex flex-col relative group">
                {/* Visual Mapping Header Tag */}
                <div className="bg-[#1A1916] text-[#DDB96A] px-3.5 py-1.5 text-[10px] font-ui font-semibold flex items-center justify-between">
                  <span>PUBLIC DIRECTORY DISCOVERY CARD</span>
                  <span className="text-white/80">Shown on Homepage, Genre &amp; Search</span>
                </div>

                {/* Hero Photo Banner */}
                <div className="relative h-60 overflow-hidden bg-gray-900">
                  <img
                    src={profile.img || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop&auto=format&q=80"}
                    alt={profile.stageName || "Performer"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className={`bg-white/95 backdrop-blur-md text-[#1A1916] font-ui text-[10px] font-bold px-3 py-1 rounded-full shadow-sm capitalize transition-all ${
                      currentStep === 3 ? "ring-2 ring-[#C4952A] scale-105" : ""
                    }`}>
                      {artInfo.genreTitle || "Sufi & Mystic"}
                    </span>
                    <span className="text-[9px] bg-black/60 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                      [Genre: Step 3]
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                    <span className="bg-black/60 backdrop-blur-md text-[#DDB96A] border border-[#DDB96A]/30 font-ui text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      ✓ Verified Performer
                    </span>
                    <span className="text-[9px] bg-black/60 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                      [Photo: Step 2]
                    </span>
                  </div>

                  {/* Bottom Image Overlay Text */}
                  <div className="absolute bottom-3.5 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5">
                      <h3
                        className={`font-serif text-2xl text-white drop-shadow-md leading-tight transition-all ${
                          currentStep === 2 ? "text-amber-200 underline decoration-[#C4952A]" : ""
                        }`}
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {profile.stageName || account.fullName || "Artist Stage Name"}
                      </h3>
                      <span className="text-[9px] bg-amber-500/80 text-black px-1 py-0.5 rounded font-mono font-bold">
                        [Stage Name]
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-0.5">
                      <p className="font-ui text-[11px] text-white/85 font-light line-clamp-1">
                        {profile.shortBio || "Soulful mystic poetry and transcendent live acoustic concerts."}
                      </p>
                      <span className="text-[9px] bg-black/60 text-amber-200 px-1 py-0.5 rounded font-mono shrink-0">
                        [Tagline]
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 bg-white">
                  {/* Meta stats */}
                  <div className="flex items-center justify-between text-[11px] font-ui text-[#7A776F] border-b border-[#EDE8DF] pb-2.5">
                    <div className="flex items-center gap-1 text-[#C4952A] font-bold">
                      <span>★</span>
                      <span>5.0</span>
                      <span className="text-[#7A776F] font-normal">(New Artist)</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={currentStep === 2 ? "font-bold text-[#1A1916]" : ""}>
                        📍 {profile.city || "Jaipur"}, {profile.state || "Rajasthan"}
                      </span>
                      <span className="text-[9px] bg-[#FAF7F2] text-emerald-700 px-1 py-0.2 rounded font-mono">
                        [City]
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={currentStep === 3 ? "font-bold text-[#1A1916]" : ""}>
                        👥 {artInfo.bandType}
                      </span>
                      <span className="text-[9px] bg-[#FAF7F2] text-stone-600 px-1 py-0.2 rounded font-mono">
                        [Setup]
                      </span>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-[#7A776F] uppercase tracking-wider">Performer Story Snippet</span>
                      <span className="text-[9px] bg-[#FAF7F2] text-stone-600 px-1.5 py-0.2 rounded font-mono">[Bio: Step 2]</span>
                    </div>
                    <p className={`font-ui text-xs text-[#4A4845] line-clamp-2 leading-relaxed ${
                      currentStep === 2 ? "bg-amber-50/50 p-1 rounded" : ""
                    }`}>
                      {profile.bio || "Performer background, training, and signature repertoire will appear here."}
                    </p>
                  </div>

                  {/* Moods Chips */}
                  {artInfo.moods.length > 0 && (
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-[#7A776F] uppercase tracking-wider">Mood Tags</span>
                        <span className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded font-mono">[Moods: Step 3]</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {artInfo.moods.map((m, i) => (
                          <span key={i} className="text-[10px] font-ui px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EDE8DF] text-[#4A4845]">
                            ✨ {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#EDE8DF]">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-ui text-[#7A776F] uppercase tracking-wider block">Starting from</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-mono font-bold">[Step 5]</span>
                      </div>
                      <span className={`font-serif text-lg font-bold text-[#1A1916] ${
                        currentStep === 5 ? "text-[#C4952A] scale-105 inline-block" : ""
                      }`}>
                        {professional.price || "₹85,000"}
                      </span>
                    </div>
                    <span className="font-ui text-xs font-semibold px-4 py-2 rounded-full bg-[#1A1916] text-[#FAF7F2] shadow-sm">
                      View Profile →
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ─── PREVIEW STYLE 2: Full Profile View ─── */}
            {previewMode === "profile" && (
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-[#EDE8DF] flex flex-col text-[#1A1916]">
                {/* Visual Mapping Header Tag */}
                <div className="bg-[#1A1916] text-[#DDB96A] px-3.5 py-1.5 text-[10px] font-ui font-semibold flex items-center justify-between">
                  <span>DEDICATED ARTIST PROFILE PAGE</span>
                  <span className="text-white/80">Shown when client clicks "View Profile"</span>
                </div>

                {/* Cover Banner (Step 2) */}
                <div className="relative h-44 overflow-hidden bg-gray-900">
                  <img
                    src={profile.coverImg || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&h=800&fit=crop&auto=format&q=80"}
                    alt="Stage Banner"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1916] via-[#1A1916]/40 to-transparent" />

                  {/* Cover banner tag */}
                  <span className="absolute top-2 right-2 text-[9px] bg-black/70 text-blue-300 px-2 py-0.5 rounded font-mono">
                    [Cover Banner: Step 2]
                  </span>

                  {/* Top Badges */}
                  <div className="absolute top-2 left-3 flex gap-2">
                    <span className="bg-[#1A1916]/80 text-[#DDB96A] text-[9px] font-ui font-bold px-2.5 py-0.5 rounded-full border border-[#DDB96A]/30">
                      {artInfo.genreTitle || "Sufi & Mystic"}
                    </span>
                    <span className="bg-white/20 text-white text-[9px] font-ui font-semibold px-2 py-0.5 rounded-full">
                      ✓ Curated Roster
                    </span>
                  </div>

                  {/* Hero text */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-end justify-between">
                    <div>
                      <h4
                        className="font-serif text-xl font-light leading-tight"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {profile.stageName || account.fullName || "Artist Stage Name"}
                      </h4>
                      <p className="text-[10px] text-white/80 font-light mt-0.5 line-clamp-1">
                        {profile.shortBio || "Soulful mystic poetry and transcendent live acoustic qawwalis."}
                      </p>
                    </div>

                    {/* Social icons if entered */}
                    {(social.instagram || social.youtube || social.website) && (
                      <div className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full border border-white/20">
                        {social.instagram && <span title="Instagram">📸</span>}
                        {social.youtube && <span title="YouTube">🎥</span>}
                        {social.website && <span title="Website">🌐</span>}
                        <span className="text-[8px] font-mono text-pink-300">[Socials: Step 6]</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-tabs preview */}
                <div className="flex border-b border-[#EDE8DF] bg-[#FAF7F2] text-xs font-ui font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveProfileTab("about")}
                    className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                      activeProfileTab === "about"
                        ? "border-[#C4952A] text-[#1A1916] bg-white"
                        : "border-transparent text-[#7A776F] hover:text-[#1A1916]"
                    }`}
                  >
                    📖 About &amp; Heritage
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProfileTab("media")}
                    className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                      activeProfileTab === "media"
                        ? "border-[#C4952A] text-[#1A1916] bg-white"
                        : "border-transparent text-[#7A776F] hover:text-[#1A1916]"
                    }`}
                  >
                    🎬 Videos &amp; Stages
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProfileTab("booking")}
                    className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                      activeProfileTab === "booking"
                        ? "border-[#C4952A] text-[#1A1916] bg-white"
                        : "border-transparent text-[#7A776F] hover:text-[#1A1916]"
                    }`}
                  >
                    💼 Booking &amp; Travel
                  </button>
                </div>

                {/* Sub-tab content */}
                <div className="p-4 bg-white space-y-3 text-xs font-ui max-h-72 overflow-y-auto">
                  {activeProfileTab === "about" && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-[#7A776F] uppercase tracking-wider">Artistic Biography</span>
                          <span className="text-[9px] bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-mono">[Bio: Step 2]</span>
                        </div>
                        <p className="text-[#4A4845] leading-relaxed text-[11px]">
                          {profile.bio || "Full artistic heritage and musical journey will be showcased to clients here."}
                        </p>
                      </div>

                      {/* Suitable Occasions */}
                      {artInfo.occasions.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-[#7A776F] uppercase tracking-wider">Recommended Occasions</span>
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-mono">[Occasions: Step 3]</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {artInfo.occasions.map((o, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EDE8DF] text-[#4A4845]">
                                🎪 {o}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeProfileTab === "media" && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-[#7A776F] uppercase tracking-wider">Live Performance Video Reel</span>
                          <span className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.2 rounded font-mono">[YouTube: Step 4]</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-stone-900 text-white flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs">▶</div>
                            <div>
                              <p className="text-xs font-semibold truncate max-w-[180px]">Live Concert Showcase</p>
                              <p className="text-[10px] text-white/70 truncate max-w-[180px]">{portfolio.youtubeUrl || "No video linked yet"}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono">Playable</span>
                        </div>
                      </div>

                      {portfolio.previousPerformances.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-[#7A776F] uppercase tracking-wider">Notable Stages Performed</span>
                            <span className="text-[9px] bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-mono">[Venues: Step 4]</span>
                          </div>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#4A4845]">
                            {portfolio.previousPerformances.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {activeProfileTab === "booking" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE8DF]">
                        <div>
                          <span className="text-[9px] text-[#7A776F] uppercase tracking-wider block">Indicative Honorarium</span>
                          <span className="font-serif text-lg font-bold text-[#1A1916]">{professional.price || "₹85,000"}</span>
                        </div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                          [Starting Fee: Step 5]
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-[#4A4845]">
                          <span>Travels Pan-India:</span>
                          <span className="font-semibold text-emerald-700">{professional.travelsPanIndia ? "✓ Yes" : "✕ No"}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#4A4845]">
                          <span>International Events:</span>
                          <span className="font-semibold text-blue-700">{professional.travelsInternational ? "✓ Available" : "✕ Domestic only"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Profile CTA bar */}
                <div className="px-4 py-3 bg-[#FAF7F2] border-t border-[#EDE8DF] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-[#7A776F] uppercase tracking-wider block">Client Action</span>
                    <span className="text-xs font-semibold text-[#1A1916]">Enquire for Booking</span>
                  </div>
                  <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-[#C4952A] text-[#1A1916]">
                    Instant Booking Request →
                  </span>
                </div>
              </div>
            )}

            {/* Interactive "Where Each Info Field Appears" Cheat Sheet */}
            <div className="bg-white p-4 rounded-3xl border border-[#EDE8DF] shadow-xs space-y-2.5">
              <h5 className="font-ui text-xs font-bold text-[#1A1916] flex items-center gap-1.5">
                <span>🗺️</span>
                <span>Field Placement Reference Guide</span>
              </h5>
              <p className="text-[11px] text-[#7A776F]">
                Quick summary of where the information you fill in will appear on Mannat Arts:
              </p>

              <div className="space-y-1.5 text-[11px] font-ui pt-1">
                <div className="flex items-start gap-2 p-2 rounded-xl bg-[#FAF7F2] border border-[#EDE8DF]/60">
                  <span className="text-[#C4952A] font-bold">🎴 Card</span>
                  <div>
                    <p className="font-semibold text-[#1A1916]">Directory Search Card</p>
                    <p className="text-[#7A776F] text-[10px]">Photo, Stage Name, Tagline, Genre badge, City pin, Starting Price</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-xl bg-[#FAF7F2] border border-[#EDE8DF]/60">
                  <span className="text-blue-600 font-bold">🖼️ Hero</span>
                  <div>
                    <p className="font-semibold text-[#1A1916]">Dedicated Profile Header</p>
                    <p className="text-[#7A776F] text-[10px]">16:9 Cover Banner, Stage Name, Verified badge, Social links</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-xl bg-[#FAF7F2] border border-[#EDE8DF]/60">
                  <span className="text-purple-600 font-bold">📖 Story</span>
                  <div>
                    <p className="font-semibold text-[#1A1916]">About &amp; Experience Section</p>
                    <p className="text-[#7A776F] text-[10px]">Full Biography narrative, Emotional Mood chips, Occasions</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-xl bg-[#FAF7F2] border border-[#EDE8DF]/60">
                  <span className="text-red-600 font-bold">🎬 Reel</span>
                  <div>
                    <p className="font-semibold text-[#1A1916]">Media &amp; Portfolio Showcase</p>
                    <p className="text-[#7A776F] text-[10px]">Playable YouTube performance video, Portfolio gallery photos</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-xl bg-[#FAF7F2] border border-[#EDE8DF]/60">
                  <span className="text-emerald-600 font-bold">💰 Tier</span>
                  <div>
                    <p className="font-semibold text-[#1A1916]">Booking &amp; Logistics Desk</p>
                    <p className="text-[#7A776F] text-[10px]">Starting Honorarium Price, Pan-India &amp; International badges</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-bold">🔒 Private</span>
                  <div>
                    <p className="font-semibold text-[#1A1916]">Private Account Data</p>
                    <p className="text-[#7A776F] text-[10px]">Legal Name, Email, Password, Mobile — Never displayed publicly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
