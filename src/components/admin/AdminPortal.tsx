import { useState, useMemo } from "react";
import { Artist, GENRE_METADATA } from "../../data/artistsData";
import { BlogArticle, BlogContentSection } from "../../data/blogData";

const BLOG_CATEGORY_OPTIONS = [
  { id: "Wedding Music", color: "#BE123C" },
  { id: "Event Planning", color: "#9333EA" },
  { id: "Artist Spotlights", color: "#E11D48" },
  { id: "Sound & Acoustics", color: "#2563EB" },
  { id: "Heritage Traditions", color: "#D97706" },
];

export interface BookingInquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  artistId: string;
  artistName: string;
  eventType: string;
  city: string;
  eventDate: string;
  budget: string;
  status: "Pending" | "Confirmed" | "Completed" | "Declined";
  createdAt: string;
  notes?: string;
}

interface AdminPortalProps {
  artists: Artist[];
  featuredArtistIds: string[];
  onSetFeaturedArtistIds: (ids: string[]) => void;
  onAddArtist: (artist: Artist) => void;
  onUpdateArtist: (artist: Artist) => void;
  onDeleteArtist: (artistId: string) => void;
  articles: BlogArticle[];
  onAddArticle: (article: BlogArticle) => void;
  onUpdateArticle: (article: BlogArticle) => void;
  onDeleteArticle: (articleId: string) => void;
  bookingInquiries: BookingInquiry[];
  onUpdateInquiryStatus: (inquiryId: string, status: BookingInquiry["status"]) => void;
  onResetToDefaults: () => void;
  onExitToClient: () => void;
  onLogout: () => void;
  onPreviewArtist: (artist: Artist) => void;
  onPreviewArticle: (article: BlogArticle) => void;
}

type AdminView =
  | "artists-list"
  | "artist-form"
  | "top6"
  | "blogs-list"
  | "blog-form"
  | "bookings"
  | "settings";

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

export function AdminPortal({
  artists,
  featuredArtistIds,
  onSetFeaturedArtistIds,
  onAddArtist,
  onUpdateArtist,
  onDeleteArtist,
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  bookingInquiries,
  onUpdateInquiryStatus,
  onResetToDefaults,
  onExitToClient,
  onLogout,
}: AdminPortalProps) {
  const [currentView, setCurrentView] = useState<AdminView>("artists-list");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search & Filter state
  const [artistSearch, setArtistSearch] = useState("");
  const [selectedGenreFilter, setSelectedGenreFilter] = useState("all");
  const [blogSearch, setBlogSearch] = useState("");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* ── In-Page Artist Form State ─────────────────────────────────────────── */
  const [editingArtistId, setEditingArtistId] = useState<string | null>(null);
  const [artistFormData, setArtistFormData] = useState<Partial<Artist>>({
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
    performanceDuration: "90–120 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 7,
    eventsCompleted: 140,
    primaryInstruments: ["Harmonium", "Tabla", "Vocals"],
    themeColor: "#BE123C",
    whatElseTheyDo: [
      { category: "Gazal Mehfils", description: "Intimate late-night mehfil sets", icon: "📜" },
      { category: "Bollywood Acoustic", description: "Unplugged 90s Bollywood medleys", icon: "🎸" },
    ],
    sampleSetlist: ["Dama Dam Mast Qalandar", "Kun Faya Kun", "Afreen Afreen", "Chaap Tilak"],
    techRider: [
      "4 Vocal Microphones with boom stands (Shure SM58)",
      "2 Direct Inputs (DI Box) for acoustic instruments",
      "2 Stage Wedge Monitors with independent auxiliary mix",
    ],
  });

  const [artistInstrumentsInput, setArtistInstrumentsInput] = useState("");
  const [artistSetlistInput, setArtistSetlistInput] = useState("");
  const [artistTechRiderInput, setArtistTechRiderInput] = useState("");
  const [artistImageSourceMode, setArtistImageSourceMode] = useState<"upload" | "url">("upload");

  const startCreateArtist = () => {
    setEditingArtistId(null);
    const newId = `artist-${Date.now()}`;
    setArtistFormData({
      id: newId,
      name: "",
      stageName: "",
      genre: "sufi",
      genreTitle: "Sufi & Qawwali",
      tagline: "",
      bio: "",
      img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&auto=format",
      rating: 4.9,
      reviewsCount: 12,
      price: "₹40,000",
      priceNum: 40000,
      city: "Mumbai",
      state: "Maharashtra",
      travelsPanIndia: true,
      performanceDuration: "90–120 mins",
      bandType: "4-6 Piece Band",
      experienceYears: 5,
      eventsCompleted: 80,
      primaryInstruments: ["Vocals", "Guitar"],
      themeColor: "#BE123C",
      whatElseTheyDo: [
        { category: "Acoustic Pop", description: "Unplugged melodies", icon: "🎵" },
        { category: "Bollywood Dance", description: "High-energy dance hits", icon: "🎬" },
      ],
      sampleSetlist: ["Signature Anthem", "Popular Medley", "Celebration Encore"],
      sampleTracks: [{ title: "Live Concert Sample", duration: "4:30", type: "Live Concert" }],
      techRider: ["2 Wireless Vocal Mics", "2 DI Boxes for Instruments", "Stage Monitors with AUX send"],
      reviews: [],
    });
    setArtistInstrumentsInput("Vocals, Guitar");
    setArtistSetlistInput("Signature Anthem\nPopular Medley\nCelebration Encore");
    setArtistTechRiderInput("2 Wireless Vocal Mics\n2 DI Boxes for Instruments\nStage Monitors with AUX send");
    setCurrentView("artist-form");
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditArtist = (artist: Artist) => {
    setEditingArtistId(artist.id);
    setArtistFormData(artist);
    setArtistInstrumentsInput(artist.primaryInstruments ? artist.primaryInstruments.join(", ") : "");
    setArtistSetlistInput(artist.sampleSetlist ? artist.sampleSetlist.join("\n") : "");
    setArtistTechRiderInput(artist.techRider ? artist.techRider.join("\n") : "");
    setCurrentView("artist-form");
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleArtistImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP)");
      return;
    }
    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        setArtistFormData(p => ({ ...p, img: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveArtist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistFormData.name?.trim()) {
      alert("Please enter the performer / band name.");
      return;
    }

    const instruments = artistInstrumentsInput.split(",").map(s => s.trim()).filter(Boolean);
    const setlist = artistSetlistInput.split("\n").map(s => s.trim()).filter(Boolean);
    const techRider = artistTechRiderInput.split("\n").map(s => s.trim()).filter(Boolean);

    const completeArtist: Artist = {
      id: artistFormData.id || `artist-${Date.now()}`,
      name: artistFormData.name.trim(),
      stageName: artistFormData.stageName?.trim() || undefined,
      genre: artistFormData.genre || "sufi",
      genreTitle: artistFormData.genreTitle || "Sufi & Qawwali",
      tagline: artistFormData.tagline?.trim() || "Exceptional Live Performer",
      bio: artistFormData.bio?.trim() || "Renowned performer with extensive concert experience.",
      img: artistFormData.img || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&auto=format",
      rating: artistFormData.rating || 4.9,
      reviewsCount: artistFormData.reviewsCount || 10,
      price: artistFormData.price || "₹40,000",
      priceNum: artistFormData.priceNum || 40000,
      city: artistFormData.city?.trim() || "Mumbai",
      state: artistFormData.state?.trim() || "Maharashtra",
      travelsPanIndia: Boolean(artistFormData.travelsPanIndia),
      performanceDuration: artistFormData.performanceDuration || "90–120 mins",
      bandType: artistFormData.bandType || "4-6 Piece Band",
      experienceYears: Number(artistFormData.experienceYears) || 5,
      eventsCompleted: Number(artistFormData.eventsCompleted) || 50,
      primaryInstruments: instruments.length > 0 ? instruments : ["Vocals"],
      themeColor: artistFormData.themeColor || "#BE123C",
      whatElseTheyDo: artistFormData.whatElseTheyDo || [],
      sampleSetlist: setlist.length > 0 ? setlist : ["Signature Anthem"],
      sampleTracks: artistFormData.sampleTracks || [{ title: "Live Concert Demo", duration: "4:30", type: "Live Performance" }],
      techRider: techRider.length > 0 ? techRider : ["2 Vocal Mics", "Stage Monitors"],
      reviews: artistFormData.reviews || [],
    };

    if (editingArtistId) {
      onUpdateArtist(completeArtist);
      showToast(`Updated ${completeArtist.name}`);
    } else {
      onAddArtist(completeArtist);
      showToast(`Added ${completeArtist.name} to Roster`);
    }

    setCurrentView("artists-list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── In-Page Blog Story Form State ─────────────────────────────────────── */
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSubtitle, setBlogSubtitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("Wedding Music");
  const [blogCategoryColor, setBlogCategoryColor] = useState("#BE123C");
  const [blogReadTime, setBlogReadTime] = useState("5 min read");
  const [blogPublishedDate, setBlogPublishedDate] = useState("Feb 25, 2026");
  const [blogCoverImg, setBlogCoverImg] = useState("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format");
  const [blogFeatured, setBlogFeatured] = useState(false);
  const [blogAuthorName, setBlogAuthorName] = useState("Roshni Malhotra");
  const [blogAuthorRole, setBlogAuthorRole] = useState("Lead Wedding Experience Architect");
  const [blogAuthorAvatar, setBlogAuthorAvatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format");
  const [blogTagsInput, setBlogTagsInput] = useState("Wedding, Live Band, Sangeet");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogKeyTakeaways, setBlogKeyTakeaways] = useState<string[]>([
    "Curate your evening into 3 distinct energy phases.",
    "Schedule dedicated sound checks 3 hours prior to guest arrival.",
  ]);
  const [blogSections, setBlogSections] = useState<BlogContentSection[]>([
    {
      sectionHeading: "Setting the Stage and Opening Flow",
      paragraphs: [
        "The opening set sets the tone for the entire celebration. Start with warm acoustic arrangements before building into high-tempo party tracks.",
      ],
      quote: { text: "Resonance matters more than sheer volume.", author: "Roshni Malhotra" },
      proTip: "Pair live percussionists with the sound system for instant energy.",
    },
  ]);
  const [blogCoverMode, setBlogCoverMode] = useState<"upload" | "url">("upload");
  const [blogAvatarMode, setBlogAvatarMode] = useState<"upload" | "url">("url");

  const startCreateStory = () => {
    setEditingArticleId(null);
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setBlogTitle("");
    setBlogSubtitle("");
    setBlogCategory("Wedding Music");
    setBlogCategoryColor("#BE123C");
    setBlogReadTime("5 min read");
    setBlogPublishedDate(today);
    setBlogCoverImg("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format");
    setBlogFeatured(false);
    setBlogAuthorName("Roshni Malhotra");
    setBlogAuthorRole("Event Experience Specialist");
    setBlogAuthorAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format");
    setBlogTagsInput("Live Band, Sound Tech, Event Flow");
    setBlogSummary("");
    setBlogKeyTakeaways([
      "Plan dedicated artist green rooms with acoustic isolation.",
      "Conduct thorough stage rider testing prior to sound checks.",
    ]);
    setBlogSections([
      {
        sectionHeading: "Opening Set Curation",
        paragraphs: ["Structure the setlist to begin warmly and transition smoothly."],
      },
    ]);
    setCurrentView("blog-form");
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditStory = (art: BlogArticle) => {
    setEditingArticleId(art.id);
    setBlogTitle(art.title);
    setBlogSubtitle(art.subtitle);
    setBlogCategory(art.category);
    setBlogCategoryColor(art.categoryColor || "#BE123C");
    setBlogReadTime(art.readTime);
    setBlogPublishedDate(art.publishedDate);
    setBlogCoverImg(art.coverImg);
    setBlogFeatured(Boolean(art.featured));
    setBlogAuthorName(art.author.name);
    setBlogAuthorRole(art.author.role);
    setBlogAuthorAvatar(art.author.avatar);
    setBlogTagsInput(art.tags ? art.tags.join(", ") : "");
    setBlogSummary(art.summary);
    setBlogKeyTakeaways(art.keyTakeaways || []);
    setBlogSections(art.content || []);
    setCurrentView("blog-form");
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBlogCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setBlogCoverImg(ev.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBlogAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setBlogAuthorAvatar(ev.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) {
      alert("Please enter the article title.");
      return;
    }

    const tags = blogTagsInput.split(",").map(s => s.trim()).filter(Boolean);
    const existing = editingArticleId ? articles.find(a => a.id === editingArticleId) : null;

    const completeArticle: BlogArticle = {
      id: editingArticleId || `article-${Date.now()}`,
      title: blogTitle.trim(),
      subtitle: blogSubtitle.trim() || "Expert insights for memorable live events.",
      category: blogCategory,
      categoryColor: blogCategoryColor,
      readTime: blogReadTime || "5 min read",
      publishedDate: blogPublishedDate || "Feb 25, 2026",
      views: existing ? existing.views : 120,
      initialLikes: existing ? existing.initialLikes : 15,
      coverImg: blogCoverImg || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format",
      featured: blogFeatured,
      author: {
        name: blogAuthorName || "StageBridge Curator",
        role: blogAuthorRole || "Event Specialist",
        avatar: blogAuthorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format",
      },
      tags: tags.length > 0 ? tags : ["Event", "Music"],
      summary: blogSummary.trim() || blogSubtitle.trim() || "Detailed insights for event hosts.",
      keyTakeaways: blogKeyTakeaways.filter(Boolean),
      content: blogSections.length > 0 ? blogSections : [{ paragraphs: ["Complete guide content."] }],
    };

    if (editingArticleId) {
      onUpdateArticle(completeArticle);
      showToast(`Updated "${completeArticle.title}"`);
    } else {
      onAddArticle(completeArticle);
      showToast(`Published "${completeArticle.title}"`);
    }

    setCurrentView("blogs-list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Top 6 Performers Manager Handlers ─────────────────────────────────── */
  const handleToggleTopPerformer = (artistId: string) => {
    if (featuredArtistIds.includes(artistId)) {
      if (featuredArtistIds.length <= 1) {
        showToast("You must keep at least 1 featured performer for the home page.");
        return;
      }
      const updated = featuredArtistIds.filter(id => id !== artistId);
      onSetFeaturedArtistIds(updated);
      showToast("Removed from Home Top 6");
    } else {
      if (featuredArtistIds.length >= 6) {
        showToast("Maximum 6 performers allowed on Home. Uncheck one first.");
        return;
      }
      const updated = [...featuredArtistIds, artistId];
      onSetFeaturedArtistIds(updated);
      showToast("Added to Home Top 6 Showcase!");
    }
  };

  const handleAutoPickTop6 = () => {
    const sorted = [...artists].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const top6Ids = sorted.slice(0, 6).map(a => a.id);
    onSetFeaturedArtistIds(top6Ids);
    showToast("Selected Top 6 highest rated performers for Home!");
  };

  const homeFeaturedArtists = useMemo(() => {
    return featuredArtistIds
      .map(id => artists.find(a => a.id === id))
      .filter((a): a is Artist => Boolean(a));
  }, [artists, featuredArtistIds]);

  // Filtered lists
  const filteredArtists = useMemo(() => {
    let list = [...artists];
    if (selectedGenreFilter !== "all") {
      list = list.filter(a => a.genre === selectedGenreFilter);
    }
    if (artistSearch.trim()) {
      const q = artistSearch.toLowerCase();
      list = list.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          (a.stageName && a.stageName.toLowerCase().includes(q)) ||
          a.city.toLowerCase().includes(q)
      );
    }
    return list;
  }, [artists, selectedGenreFilter, artistSearch]);

  const filteredArticles = useMemo(() => {
    let list = [...articles];
    if (blogSearch.trim()) {
      const q = blogSearch.toLowerCase();
      list = list.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, blogSearch]);

  return (
    <div className="min-h-screen bg-[#FDFBFB] text-[#1A1A1A] flex font-body">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#E11D48] text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-bold animate-fadeIn flex items-center gap-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── LEFT NAVIGATION SIDEBAR ────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#F3E5E8] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-5 border-b border-[#F3E5E8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9333EA] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                ⚡
              </div>
              <div>
                <h1 className="font-display font-bold text-base text-[#1A1A1A] leading-tight">StageBridge</h1>
                <span className="text-[10px] font-bold text-[#BE123C] uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6 flex-1 overflow-y-auto">
            {/* Artists Section */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B5B5B] px-3 mb-1.5">
                Artists &amp; Performers
              </div>

              <button
                onClick={() => {
                  setCurrentView("artists-list");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === "artists-list"
                    ? "bg-[#FFF0F3] text-[#BE123C] font-bold border border-[#F3E5E8]"
                    : "text-[#5B5B5B] hover:bg-gray-50 hover:text-[#1A1A1A]"
                }`}
              >
                <span>🎭</span>
                <span>Artists Directory</span>
                <span className="ml-auto text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold">
                  {artists.length}
                </span>
              </button>

              <button
                onClick={startCreateArtist}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === "artist-form" && !editingArtistId
                    ? "bg-[#FFF0F3] text-[#BE123C] font-bold border border-[#F3E5E8]"
                    : "text-[#5B5B5B] hover:bg-gray-50 hover:text-[#1A1A1A]"
                }`}
              >
                <span>➕</span>
                <span>Add New Artist</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView("top6");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === "top6"
                    ? "bg-[#FFF0F3] text-[#BE123C] font-bold border border-[#F3E5E8]"
                    : "text-[#5B5B5B] hover:bg-gray-50 hover:text-[#1A1A1A]"
                }`}
              >
                <span>⭐</span>
                <span>Home Top 6 Performers</span>
                <span className="ml-auto text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  {featuredArtistIds.length}/6
                </span>
              </button>
            </div>

            {/* Editorial Stories Section */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B5B5B] px-3 mb-1.5">
                Editorial CMS
              </div>

              <button
                onClick={() => {
                  setCurrentView("blogs-list");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === "blogs-list"
                    ? "bg-[#FFF0F3] text-[#BE123C] font-bold border border-[#F3E5E8]"
                    : "text-[#5B5B5B] hover:bg-gray-50 hover:text-[#1A1A1A]"
                }`}
              >
                <span>📝</span>
                <span>Journal Stories</span>
                <span className="ml-auto text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold">
                  {articles.length}
                </span>
              </button>

              <button
                onClick={startCreateStory}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === "blog-form" && !editingArticleId
                    ? "bg-[#FFF0F3] text-[#BE123C] font-bold border border-[#F3E5E8]"
                    : "text-[#5B5B5B] hover:bg-gray-50 hover:text-[#1A1A1A]"
                }`}
              >
                <span>➕</span>
                <span>Write New Story</span>
              </button>
            </div>

            {/* Operations Section */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B5B5B] px-3 mb-1.5">
                Operations
              </div>

              <button
                onClick={() => {
                  setCurrentView("bookings");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === "bookings"
                    ? "bg-[#FFF0F3] text-[#BE123C] font-bold border border-[#F3E5E8]"
                    : "text-[#5B5B5B] hover:bg-gray-50 hover:text-[#1A1A1A]"
                }`}
              >
                <span>🎪</span>
                <span>Booking Leads</span>
                <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {bookingInquiries.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentView("settings");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === "settings"
                    ? "bg-[#FFF0F3] text-[#BE123C] font-bold border border-[#F3E5E8]"
                    : "text-[#5B5B5B] hover:bg-gray-50 hover:text-[#1A1A1A]"
                }`}
              >
                <span>⚙️</span>
                <span>Settings &amp; Reset</span>
              </button>
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#F3E5E8] space-y-2">
            <button
              onClick={onExitToClient}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-[#FFF0F3] text-[#1A1A1A] hover:text-[#BE123C] border border-[#F3E5E8] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>👁️</span>
              <span>View Live Website</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── RIGHT MAIN CONTENT AREA ────────────────────────────────────────── */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 min-h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-[#F3E5E8] mb-6 shadow-xs">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="text-xs font-bold bg-[#FFF0F3] text-[#BE123C] px-3.5 py-2 rounded-xl flex items-center gap-1.5"
          >
            <span>☰</span>
            <span>Admin Menu</span>
          </button>

          <span className="font-display font-bold text-sm text-[#1A1A1A]">StageBridge Console</span>

          <button
            onClick={onExitToClient}
            className="text-xs font-semibold text-[#5B5B5B] hover:text-[#1A1A1A]"
          >
            Live Site →
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* VIEW 1: ARTISTS DIRECTORY TABLE */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {currentView === "artists-list" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-[#1A1A1A]">
                  Artists &amp; Performers Directory
                </h2>
                <p className="text-xs text-[#5B5B5B] mt-0.5">
                  Manage profiles, pricing rate cards, instruments, setlists, and Home Top 6 spotlight.
                </p>
              </div>

              <button
                onClick={startCreateArtist}
                className="px-4 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>➕</span>
                <span>Add New Performer</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#F3E5E8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search artist name, city..."
                  value={artistSearch}
                  onChange={e => setArtistSearch(e.target.value)}
                  className="text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2 text-[#1A1A1A] w-full sm:w-64 focus:outline-none"
                />

                <select
                  value={selectedGenreFilter}
                  onChange={e => setSelectedGenreFilter(e.target.value)}
                  className="text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3 py-2 text-[#1A1A1A] cursor-pointer"
                >
                  <option value="all">All Genres</option>
                  <option value="sufi">Sufi</option>
                  <option value="rock">Rock</option>
                  <option value="gazal">Ghazal</option>
                  <option value="bollywood">Bollywood</option>
                  <option value="carnival">Carnival</option>
                  <option value="devotional">Devotional</option>
                </select>
              </div>

              <div className="text-xs text-[#5B5B5B] font-medium">
                Showing {filteredArtists.length} of {artists.length} performers
              </div>
            </div>

            {/* Clean Data Table */}
            <div className="bg-white border border-[#F3E5E8] rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF8F8] text-[#5B5B5B] uppercase text-[10px] border-b border-[#F3E5E8]">
                  <tr>
                    <th className="py-3.5 px-4">Performer</th>
                    <th className="py-3.5 px-4">Genre</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Starting Fee</th>
                    <th className="py-3.5 px-4 text-center">Home Top 6</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3E5E8]">
                  {filteredArtists.map(artist => {
                    const isTopPerformer = featuredArtistIds.includes(artist.id);

                    return (
                      <tr key={artist.id} className="hover:bg-[#FFF8F8] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={artist.img}
                              alt={artist.name}
                              className="w-10 h-10 rounded-xl object-cover border border-[#F3E5E8]"
                            />
                            <div>
                              <div className="font-display font-bold text-sm text-[#1A1A1A]">
                                {artist.name}
                              </div>
                              <div className="text-[10px] text-[#5B5B5B]">
                                {artist.bandType} • ★ {artist.rating} ({artist.reviewsCount} reviews)
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs"
                            style={{ backgroundColor: artist.themeColor }}
                          >
                            {artist.genreTitle}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[#5B5B5B]">
                          {artist.city}, {artist.state}
                        </td>

                        <td className="py-3.5 px-4 font-display font-bold text-sm text-[#BE123C]">
                          {artist.price}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleTopPerformer(artist.id)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                              isTopPerformer
                                ? "bg-amber-100 text-amber-900 border-amber-300 shadow-xs"
                                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-amber-50 hover:text-amber-800"
                            }`}
                            title={isTopPerformer ? "Featured on Home Top 6" : "Click to feature on Home Top 6"}
                          >
                            {isTopPerformer ? "⭐ Featured" : "+ Set Top 6"}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => startEditArtist(artist)}
                              className="px-3 py-1 rounded-lg bg-[#FFF0F3] hover:bg-[#E11D48] text-[#BE123C] hover:text-white font-bold transition-colors cursor-pointer border border-[#F3E5E8]"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete performer ${artist.name}?`)) {
                                  onDeleteArtist(artist.id);
                                  showToast(`Deleted ${artist.name}`);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 transition-colors cursor-pointer"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* VIEW 2: IN-PAGE ARTIST EDITOR FORM (NO TILES / NO POPUP MODAL) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {currentView === "artist-form" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header with Back button */}
            <div className="flex items-center justify-between border-b border-[#F3E5E8] pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView("artists-list")}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#FFF0F3] text-[#5B5B5B] hover:text-[#BE123C] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                >
                  ←
                </button>
                <div>
                  <h2 className="font-display font-bold text-2xl text-[#1A1A1A]">
                    {editingArtistId ? `Edit Performer: ${artistFormData.name}` : "Add New Performer"}
                  </h2>
                  <p className="text-xs text-[#5B5B5B]">
                    Complete all details, rates, audio samples, and technical riders.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentView("artists-list")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5B5B5B] hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveArtist}
                  className="px-5 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Save Performer
                </button>
              </div>
            </div>

            {/* In-Page Form Body */}
            <form onSubmit={handleSaveArtist} className="space-y-6">
              {/* Section 1: Basic Identity */}
              <div className="bg-white p-6 rounded-3xl border border-[#F3E5E8] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-sm text-[#BE123C] uppercase tracking-wider">
                  1. Basic Identity &amp; Genre
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Performer / Troupe Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zakir Khan & Sufi Souls"
                      value={artistFormData.name || ""}
                      onChange={e => setArtistFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Stage Moniker (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Soul Qawwal"
                      value={artistFormData.stageName || ""}
                      onChange={e => setArtistFormData(p => ({ ...p, stageName: e.target.value }))}
                      className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Primary Genre
                    </label>
                    <select
                      value={artistFormData.genre || "sufi"}
                      onChange={e => {
                        const g = e.target.value as any;
                        const meta = GENRE_METADATA[g];
                        setArtistFormData(p => ({
                          ...p,
                          genre: g,
                          genreTitle: meta ? meta.title : g.toUpperCase(),
                          themeColor: "#BE123C",
                        }));
                      }}
                      className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] cursor-pointer"
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
                      Ensemble Format
                    </label>
                    <select
                      value={artistFormData.bandType || "4-6 Piece Band"}
                      onChange={e => setArtistFormData(p => ({ ...p, bandType: e.target.value as any }))}
                      className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] cursor-pointer"
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
                    value={artistFormData.tagline || ""}
                    onChange={e => setArtistFormData(p => ({ ...p, tagline: e.target.value }))}
                    className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Biography / Story
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe artist history, prestigious concerts performed..."
                    value={artistFormData.bio || ""}
                    onChange={e => setArtistFormData(p => ({ ...p, bio: e.target.value }))}
                    className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Section 2: Photography & Rates */}
              <div className="bg-white p-6 rounded-3xl border border-[#F3E5E8] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-sm text-[#BE123C] uppercase tracking-wider">
                  2. Photography, Location &amp; Rates
                </h3>

                <div className="grid sm:grid-cols-3 gap-5 items-start">
                  <div className="sm:col-span-2 space-y-4">
                    {/* Photo Uploader */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#3A3A3A]">
                          Performer Photo *
                        </label>
                        <div className="flex items-center gap-1 bg-[#FFF8F8] border border-[#F3E5E8] p-0.5 rounded-lg text-[10px]">
                          <button
                            type="button"
                            onClick={() => setArtistImageSourceMode("upload")}
                            className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                              artistImageSourceMode === "upload"
                                ? "bg-[#E11D48] text-white"
                                : "text-[#5B5B5B]"
                            }`}
                          >
                            📁 Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setArtistImageSourceMode("url")}
                            className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                              artistImageSourceMode === "url"
                                ? "bg-[#E11D48] text-white"
                                : "text-[#5B5B5B]"
                            }`}
                          >
                            🔗 Web URL
                          </button>
                        </div>
                      </div>

                      {artistImageSourceMode === "upload" ? (
                        <div className="relative border-2 border-dashed border-[#E5D5D8] hover:border-[#E11D48] rounded-2xl p-5 bg-[#FFFDFD] text-center cursor-pointer transition-colors group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleArtistImageFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-1">
                            <div className="text-2xl group-hover:scale-110 transition-transform inline-block">📸</div>
                            <div className="text-xs font-semibold text-[#1A1A1A]">
                              Click or Drag photo from computer to upload
                            </div>
                            <div className="text-[10px] text-[#5B5B5B]">
                              Supports PNG, JPG, WEBP formats
                            </div>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={artistFormData.img || ""}
                          onChange={e => setArtistFormData(p => ({ ...p, img: e.target.value }))}
                          className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Base City</label>
                        <input
                          type="text"
                          placeholder="e.g. Mumbai"
                          value={artistFormData.city || ""}
                          onChange={e => setArtistFormData(p => ({ ...p, city: e.target.value }))}
                          className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">State</label>
                        <input
                          type="text"
                          placeholder="e.g. Maharashtra"
                          value={artistFormData.state || ""}
                          onChange={e => setArtistFormData(p => ({ ...p, state: e.target.value }))}
                          className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Starting Booking Fee (₹)</label>
                        <input
                          type="text"
                          placeholder="e.g. 50000"
                          value={artistFormData.priceNum ? String(artistFormData.priceNum) : ""}
                          onChange={e => {
                            const num = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0;
                            const formatted = num > 0 ? `₹${num.toLocaleString("en-IN")}` : "₹0";
                            setArtistFormData(p => ({ ...p, price: formatted, priceNum: num }));
                          }}
                          className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 90–120 mins"
                          value={artistFormData.performanceDuration || ""}
                          onChange={e => setArtistFormData(p => ({ ...p, performanceDuration: e.target.value }))}
                          className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Photo Preview */}
                  <div className="text-center">
                    <span className="block text-[11px] font-semibold text-[#5B5B5B] mb-1">Live Photo Preview</span>
                    <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-100 border border-[#F3E5E8] shadow-inner relative group">
                      {artistFormData.img ? (
                        <>
                          <img
                            src={artistFormData.img}
                            alt="Artist Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setArtistFormData(p => ({ ...p, img: "" }))}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center cursor-pointer transition-colors"
                            title="Remove Photo"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400 p-2">
                          <span>No Image Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Repertoire, Setlist & Tech Rider */}
              <div className="bg-white p-6 rounded-3xl border border-[#F3E5E8] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-sm text-[#BE123C] uppercase tracking-wider">
                  3. Instruments, Setlist &amp; Stage Rider
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Primary Instruments (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Harmonium, Tabla, Dholak, Vocals"
                    value={artistInstrumentsInput}
                    onChange={e => setArtistInstrumentsInput(e.target.value)}
                    className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Sample Setlist (One track per line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Dama Dam Mast Qalandar&#10;Kun Faya Kun&#10;Afreen Afreen"
                      value={artistSetlistInput}
                      onChange={e => setArtistSetlistInput(e.target.value)}
                      className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Technical Rider (One requirement per line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="4 Vocal Mics with boom stands&#10;2 DI Boxes&#10;Stage wedge monitors"
                      value={artistTechRiderInput}
                      onChange={e => setArtistTechRiderInput(e.target.value)}
                      className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                    />
                  </div>
                </div>
              </div>

              {/* Form Bottom Save Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentView("artists-list")}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#5B5B5B] hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Save Performer Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* VIEW 3: TOP 6 HOMEPAGE PERFORMERS MANAGER */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {currentView === "top6" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-[#1A1A1A]">
                  Home Top 6 Performers Showcase
                </h2>
                <p className="text-xs text-[#5B5B5B] mt-0.5">
                  Pick the exact 6 artists that will appear in the &ldquo;Featured Performers&rdquo; section on the main website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#BE123C] bg-[#FFF0F3] px-3.5 py-1.5 rounded-full border border-[#F3E5E8]">
                  {featuredArtistIds.length} of 6 selected
                </span>
                <button
                  onClick={handleAutoPickTop6}
                  className="text-xs font-bold bg-[#E11D48] hover:bg-[#BE123C] text-white px-4 py-2 rounded-full transition-colors cursor-pointer shadow-xs"
                >
                  ⚡ Auto-Pick Top 6 by Rating
                </button>
              </div>
            </div>

            {/* Currently Live Slots */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-sm text-[#1A1A1A] uppercase tracking-wider">
                Currently Live on Homepage (Slots 1 to {homeFeaturedArtists.length}):
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {homeFeaturedArtists.map((artist, idx) => (
                  <div
                    key={artist.id}
                    className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-xs flex items-center justify-between gap-3 relative group"
                  >
                    <span className="absolute -top-2.5 -left-2.5 bg-amber-400 text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                      #{idx + 1}
                    </span>

                    <div className="flex items-center gap-3">
                      <img
                        src={artist.img}
                        alt={artist.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#F3E5E8]"
                      />
                      <div>
                        <h4 className="font-display font-bold text-sm text-[#1A1A1A] line-clamp-1">
                          {artist.name}
                        </h4>
                        <div className="text-[11px] text-[#BE123C] font-semibold">
                          {artist.genreTitle} • {artist.price}
                        </div>
                        <div className="text-[10px] text-[#5B5B5B]">
                          ★ {artist.rating} ({artist.city})
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleTopPerformer(artist.id)}
                      className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-xl border border-red-200 transition-colors cursor-pointer"
                      title="Remove from Top 6"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Available to Add */}
            <div className="space-y-3 pt-4 border-t border-[#F3E5E8]">
              <h3 className="font-display font-bold text-sm text-[#5B5B5B] uppercase tracking-wider">
                Available Artists (Click to Add to Top 6):
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {artists
                  .filter(a => !featuredArtistIds.includes(a.id))
                  .map(artist => (
                    <div
                      key={artist.id}
                      className="bg-white rounded-2xl p-3 border border-[#F3E5E8] flex items-center justify-between gap-3 hover:border-[#E11D48]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={artist.img}
                          alt={artist.name}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-xs text-[#1A1A1A] line-clamp-1">
                            {artist.name}
                          </div>
                          <div className="text-[10px] text-[#5B5B5B]">
                            {artist.genreTitle} • {artist.price}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleTopPerformer(artist.id)}
                        disabled={featuredArtistIds.length >= 6}
                        className="text-xs font-bold bg-[#FFF0F3] hover:bg-[#E11D48] text-[#BE123C] hover:text-white px-3 py-1.5 rounded-xl border border-[#F3E5E8] transition-colors cursor-pointer disabled:opacity-40"
                      >
                        + Add to Top 6
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* VIEW 4: JOURNAL & BLOG STORIES LIST */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {currentView === "blogs-list" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-[#1A1A1A]">
                  Journal &amp; Guides CMS
                </h2>
                <p className="text-xs text-[#5B5B5B] mt-0.5">
                  Publish event planning masterclasses, soundcheck checklists, and backstage guides.
                </p>
              </div>

              <button
                onClick={startCreateStory}
                className="px-4 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>➕</span>
                <span>Write New Story</span>
              </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl border border-[#F3E5E8] shadow-xs flex items-center justify-between">
              <input
                type="text"
                placeholder="Search stories by headline or author..."
                value={blogSearch}
                onChange={e => setBlogSearch(e.target.value)}
                className="text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2 text-[#1A1A1A] w-full sm:w-80 focus:outline-none"
              />
              <div className="text-xs text-[#5B5B5B] font-medium hidden sm:block">
                {filteredArticles.length} published stories
              </div>
            </div>

            {/* Stories Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map(art => (
                <div
                  key={art.id}
                  className="bg-white rounded-3xl p-5 border border-[#F3E5E8] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-100">
                      <img
                        src={art.coverImg}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full shadow-md"
                        style={{ backgroundColor: art.categoryColor }}
                      >
                        {art.category}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-[#1A1A1A] line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#5B5B5B] line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F3E5E8] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={art.author.avatar}
                        alt={art.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-[11px] font-semibold text-[#1A1A1A]">
                        {art.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => startEditStory(art)}
                        className="px-3 py-1 rounded-lg bg-[#FFF0F3] hover:bg-[#E11D48] text-[#BE123C] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${art.title}"?`)) {
                            onDeleteArticle(art.id);
                            showToast(`Deleted ${art.title}`);
                          }
                        }}
                        className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs transition-colors cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* VIEW 5: IN-PAGE STORY EDITOR FORM (NO TILES / NO POPUP MODAL) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {currentView === "blog-form" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header with Back button */}
            <div className="flex items-center justify-between border-b border-[#F3E5E8] pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView("blogs-list")}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#FFF0F3] text-[#5B5B5B] hover:text-[#BE123C] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                >
                  ←
                </button>
                <div>
                  <h2 className="font-display font-bold text-2xl text-[#1A1A1A]">
                    {editingArticleId ? `Edit Story: ${blogTitle}` : "Write New Journal Guide"}
                  </h2>
                  <p className="text-xs text-[#5B5B5B]">
                    Compose tactical event planning masterclasses and checklists.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentView("blogs-list")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5B5B5B] hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStory}
                  className="px-5 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Publish Story
                </button>
              </div>
            </div>

            {/* In-Page Form Body */}
            <form onSubmit={handleSaveStory} className="space-y-6">
              {/* Section 1: Title & Category */}
              <div className="bg-white p-6 rounded-3xl border border-[#F3E5E8] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-sm text-[#BE123C] uppercase tracking-wider">
                  1. Title &amp; Publishing Info
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Article Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How to Sequence Live Music for a 500-Guest Wedding"
                    value={blogTitle}
                    onChange={e => setBlogTitle(e.target.value)}
                    className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Subtitle / Deck
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A comprehensive guide on acoustic flow and DJ handoffs..."
                    value={blogSubtitle}
                    onChange={e => setBlogSubtitle(e.target.value)}
                    className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
                  />
                </div>

                <div className="grid sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Category</label>
                    <select
                      value={blogCategory}
                      onChange={e => {
                        const val = e.target.value;
                        const match = BLOG_CATEGORY_OPTIONS.find(c => c.id === val);
                        setBlogCategory(val);
                        if (match) setBlogCategoryColor(match.color);
                      }}
                      className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3 py-2 text-[#1A1A1A] cursor-pointer"
                    >
                      {BLOG_CATEGORY_OPTIONS.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Read Time</label>
                    <input
                      type="text"
                      value={blogReadTime}
                      onChange={e => setBlogReadTime(e.target.value)}
                      className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3 py-2 text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Publish Date</label>
                    <input
                      type="text"
                      value={blogPublishedDate}
                      onChange={e => setBlogPublishedDate(e.target.value)}
                      className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3 py-2 text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Featured Spotlight</label>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={blogFeatured}
                        onChange={e => setBlogFeatured(e.target.checked)}
                        className="rounded text-[#E11D48]"
                      />
                      <span className="text-xs font-medium text-[#1A1A1A]">Spotlight Hero</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 2: Media & Author */}
              <div className="bg-white p-6 rounded-3xl border border-[#F3E5E8] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-sm text-[#BE123C] uppercase tracking-wider">
                  2. Cover Photo &amp; Author Credentials
                </h3>

                <div className="grid sm:grid-cols-3 gap-5 items-start">
                  <div className="sm:col-span-2 space-y-4">
                    {/* Cover Uploader */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#3A3A3A]">Cover Photo *</label>
                        <div className="flex items-center gap-1 bg-[#FFF8F8] border border-[#F3E5E8] p-0.5 rounded-lg text-[10px]">
                          <button
                            type="button"
                            onClick={() => setBlogCoverMode("upload")}
                            className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                              blogCoverMode === "upload" ? "bg-[#E11D48] text-white" : "text-[#5B5B5B]"
                            }`}
                          >
                            📁 Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlogCoverMode("url")}
                            className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                              blogCoverMode === "url" ? "bg-[#E11D48] text-white" : "text-[#5B5B5B]"
                            }`}
                          >
                            🔗 Web URL
                          </button>
                        </div>
                      </div>

                      {blogCoverMode === "upload" ? (
                        <div className="relative border-2 border-dashed border-[#E5D5D8] hover:border-[#E11D48] rounded-2xl p-5 bg-[#FFFDFD] text-center cursor-pointer transition-colors group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBlogCoverUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-1">
                            <div className="text-2xl group-hover:scale-110 transition-transform inline-block">🖼️</div>
                            <div className="text-xs font-semibold text-[#1A1A1A]">
                              Click or Drag cover image to upload
                            </div>
                            <div className="text-[10px] text-[#5B5B5B]">
                              PNG, JPG, WEBP (Landscape recommended)
                            </div>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={blogCoverImg}
                          onChange={e => setBlogCoverImg(e.target.value)}
                          className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Author Name</label>
                        <input
                          type="text"
                          value={blogAuthorName}
                          onChange={e => setBlogAuthorName(e.target.value)}
                          className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Author Role</label>
                        <input
                          type="text"
                          value={blogAuthorRole}
                          onChange={e => setBlogAuthorRole(e.target.value)}
                          className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                        />
                      </div>
                    </div>

                    {/* Author Avatar */}
                    <div>
                      <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Author Avatar</label>
                      <div className="flex items-center gap-3 bg-[#FFF8F8] p-2.5 border border-[#F3E5E8] rounded-xl">
                        <img
                          src={blogAuthorAvatar}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover border border-[#F3E5E8]"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBlogAvatarUpload}
                          className="text-xs text-[#5B5B5B] file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFF0F3] file:text-[#BE123C] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Cover Preview */}
                  <div className="text-center">
                    <span className="block text-[11px] font-semibold text-[#5B5B5B] mb-1">Cover Preview</span>
                    <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-100 border border-[#F3E5E8] shadow-inner relative">
                      {blogCoverImg ? (
                        <img
                          src={blogCoverImg}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">Executive Summary</label>
                  <textarea
                    rows={2}
                    value={blogSummary}
                    onChange={e => setBlogSummary(e.target.value)}
                    placeholder="Brief 2-sentence takeaway..."
                    className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Form Bottom Save Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentView("blogs-list")}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#5B5B5B] hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* VIEW 6: BOOKING LEADS TABLE */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {currentView === "bookings" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#1A1A1A]">
                Client Booking Leads &amp; Requests
              </h2>
              <p className="text-xs text-[#5B5B5B] mt-0.5">
                Review high-intent client inquiries and confirm artist bookings.
              </p>
            </div>

            <div className="bg-white border border-[#F3E5E8] rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF8F8] text-[#5B5B5B] uppercase text-[10px] border-b border-[#F3E5E8]">
                  <tr>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Performer</th>
                    <th className="py-3.5 px-4">Occasion &amp; City</th>
                    <th className="py-3.5 px-4">Event Date</th>
                    <th className="py-3.5 px-4">Budget</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3E5E8]">
                  {bookingInquiries.map(inq => (
                    <tr key={inq.id} className="hover:bg-[#FFF8F8]">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1A1A1A]">{inq.clientName}</div>
                        <div className="text-[10px] text-[#5B5B5B]">{inq.clientPhone} • {inq.clientEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#BE123C]">
                        {inq.artistName}
                      </td>

                      <td className="py-3.5 px-4 text-[#5B5B5B]">
                        {inq.eventType} ({inq.city})
                      </td>

                      <td className="py-3.5 px-4 text-[#5B5B5B]">
                        {inq.eventDate}
                      </td>

                      <td className="py-3.5 px-4 font-display font-bold text-emerald-700">
                        {inq.budget}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inq.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : inq.status === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {inq.status === "Pending" && (
                          <button
                            onClick={() => {
                              onUpdateInquiryStatus(inq.id, "Confirmed");
                              showToast(`Confirmed booking for ${inq.clientName}`);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                          >
                            Confirm Booking
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* VIEW 7: SYSTEM SETTINGS & FACTORY RESET */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {currentView === "settings" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#1A1A1A]">
                Platform Settings &amp; Data Maintenance
              </h2>
              <p className="text-xs text-[#5B5B5B] mt-0.5">
                Manage local storage backups, demo credentials, and factory reset.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#F3E5E8] shadow-xs space-y-4">
              <h3 className="font-display font-bold text-sm text-[#1A1A1A] uppercase tracking-wider">
                Active System Metrics
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#F3E5E8]">
                  <div className="font-display font-bold text-xl text-[#BE123C]">{artists.length}</div>
                  <div className="text-[10px] text-[#5B5B5B] uppercase font-bold mt-0.5">Total Artists</div>
                </div>
                <div className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#F3E5E8]">
                  <div className="font-display font-bold text-xl text-[#BE123C]">{articles.length}</div>
                  <div className="text-[10px] text-[#5B5B5B] uppercase font-bold mt-0.5">Journal Guides</div>
                </div>
                <div className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#F3E5E8]">
                  <div className="font-display font-bold text-xl text-[#BE123C]">{bookingInquiries.length}</div>
                  <div className="text-[10px] text-[#5B5B5B] uppercase font-bold mt-0.5">Inquiries</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#F3E5E8] shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-red-600">
                  Restore Factory Defaults
                </h3>
                <p className="text-xs text-[#5B5B5B] max-w-md">
                  Wipe custom additions and restore original artists, blog articles, and Top 6 showcase.
                </p>
              </div>

              <button
                onClick={() => {
                  if (window.confirm("Reset all platform data to initial state?")) {
                    onResetToDefaults();
                    showToast("Platform data restored to defaults.");
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Everything
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
