import { useState, useEffect } from "react";
import {
  CMSDataStore,
  UserRole,
  Experience,
  MoodItem,
  OccasionItem,
  TestimonialItem,
  MediaItem,
  NavLinkItem,
  FooterConfig,
  GlobalSEOConfig,
  GeneralSettingsConfig,
  HomepageConfig,
} from "../../data/cmsTypes";
import { Artist, GenreInfo } from "../../data/artistsData";
import { BlogArticle } from "../../data/blogData";

import { DashboardView } from "./views/DashboardView";
import { HomepageCMSView } from "./views/HomepageCMSView";
import { ExperiencesCMSView } from "./views/ExperiencesCMSView";
import { ArtistsCMSView } from "./views/ArtistsCMSView";
import { GenresCMSView } from "./views/GenresCMSView";
import { MoodsCMSView } from "./views/MoodsCMSView";
import { OccasionsCMSView } from "./views/OccasionsCMSView";
import { StoriesCMSView } from "./views/StoriesCMSView";
import { TestimonialsCMSView } from "./views/TestimonialsCMSView";
import { RecommendationsView } from "./views/RecommendationsView";
import { FeaturedContentView } from "./views/FeaturedContentView";
import { MediaLibraryView } from "./views/MediaLibraryView";
import { NavigationCMSView } from "./views/NavigationCMSView";
import { FooterCMSView } from "./views/FooterCMSView";
import { SEOCMSView } from "./views/SEOCMSView";
import { SettingsCMSView } from "./views/SettingsCMSView";
import { UsersCMSView } from "./views/UsersCMSView";
import { ActivityLogView } from "./views/ActivityLogView";

import { ToastNotification, ToastMessage } from "./ToastNotification";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { WebsitePreviewModal } from "./WebsitePreviewModal";

import { loadCMSStore } from "../../data/cmsData";
export type { BookingInquiry } from "../../data/cmsTypes";

export type AdminCMSView =
  | "dashboard"
  | "homepage"
  | "experiences"
  | "artists"
  | "genres"
  | "moods"
  | "occasions"
  | "stories"
  | "testimonials"
  | "recommendations"
  | "featured"
  | "media"
  | "navigation"
  | "footer"
  | "seo"
  | "settings"
  | "users"
  | "activity";

export interface AdminPortalProps {
  cmsStore?: CMSDataStore;
  onUpdateHomepage?: (cfg: HomepageConfig) => void;
  onAddExperience?: (exp: Experience) => void;
  onUpdateExperience?: (exp: Experience) => void;
  onDeleteExperience?: (id: string) => void;
  onAddArtist?: (a: Artist) => void;
  onUpdateArtist?: (a: Artist) => void;
  onDeleteArtist?: (id: string) => void;
  featuredArtistIds?: string[];
  onSetFeaturedArtistIds?: (ids: string[]) => void;
  onUpdateGenre?: (genreId: string, updated: Partial<GenreInfo>) => void;
  onUpdateMoods?: (moods: MoodItem[]) => void;
  onUpdateOccasions?: (occasions: OccasionItem[]) => void;
  onAddArticle?: (a: BlogArticle) => void;
  onUpdateArticle?: (a: BlogArticle) => void;
  onDeleteArticle?: (id: string) => void;
  onUpdateTestimonials?: (t: TestimonialItem[]) => void;
  onUploadMedia?: (m: MediaItem) => void;
  onDeleteMedia?: (id: string) => void;
  onUpdateNavigation?: (nav: NavLinkItem[]) => void;
  onUpdateFooter?: (f: FooterConfig) => void;
  onUpdateSEO?: (s: GlobalSEOConfig) => void;
  onUpdateSettings?: (s: GeneralSettingsConfig) => void;
  onResetAllToDefaults?: () => void;
  onExitToClient: () => void;
  onLogout: () => void;
  onPreviewArtist?: (artist: Artist) => void;
  onPreviewArticle?: (article: BlogArticle) => void;
  onPublishAll?: () => void;

  // Legacy fallback props
  artists?: Artist[];
  articles?: BlogArticle[];
  bookingInquiries?: any[];
  onUpdateInquiryStatus?: (id: string, status: any) => void;
  onResetToDefaults?: () => void;
  genres?: Record<string, GenreInfo>;
}

export function AdminPortal({
  cmsStore: propStore,
  onUpdateHomepage = () => {},
  onAddExperience = () => {},
  onUpdateExperience = () => {},
  onDeleteExperience = () => {},
  onAddArtist = () => {},
  onUpdateArtist = () => {},
  onDeleteArtist = () => {},
  featuredArtistIds = [],
  onSetFeaturedArtistIds = () => {},
  onUpdateGenre = () => {},
  onUpdateMoods = () => {},
  onUpdateOccasions = () => {},
  onAddArticle = () => {},
  onUpdateArticle = () => {},
  onDeleteArticle = () => {},
  onUpdateTestimonials = () => {},
  onUploadMedia = () => {},
  onDeleteMedia = () => {},
  onUpdateNavigation = () => {},
  onUpdateFooter = () => {},
  onUpdateSEO = () => {},
  onUpdateSettings = () => {},
  onResetAllToDefaults = () => {},
  onExitToClient,
  onLogout,
  onPreviewArtist,
  onPreviewArticle,
  onPublishAll,
}: AdminPortalProps) {
  const fallbackStore = loadCMSStore();
  const cmsStore = propStore || fallbackStore;
  const [currentView, setCurrentView] = useState<AdminCMSView>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("super_admin");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keyboard shortcut: Cmd+K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addToast = (text: string, type: "success" | "info" | "warning" = "success") => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handlePublishAllChanges = () => {
    onPublishAll?.();
    const nowStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    onUpdateSettings({
      ...cmsStore.settings,
      lastPublished: nowStr,
      isLive: true,
    });
    addToast("All changes published to live website!", "success");
  };

  // SVG Icon helper — consistent 16×16 black stroked icons
  const Icon = ({ path, viewBox = "0 0 24 24" }: { path: string | string[]; viewBox?: string }) => (
    <svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox={viewBox}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {Array.isArray(path) ? path.map((d, i) => <path key={i} d={d} />) : <path d={path} />}
    </svg>
  );

  // Nav item groups (7 Simplified Business Categories)
  const navSections = [
    {
      group: "OVERVIEW",
      items: [
        {
          id: "dashboard",
          label: "Dashboard & Stats",
          icon: <Icon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
        },
      ],
    },
    {
      group: "PAGES & CONTENT",
      items: [
        {
          id: "homepage",
          label: "Homepage & Banner",
          icon: <Icon path={["M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z", "M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z", "M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"]} />,
        },
        {
          id: "experiences",
          label: "Curated Experiences",
          icon: <Icon path="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
        },
      ],
    },
    {
      group: "ARTISTS & MUSIC",
      items: [
        {
          id: "artists",
          label: "Artists & Performers",
          icon: <Icon path={["M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"]} />,
        },
        {
          id: "genres",
          label: "Music Genres",
          icon: <Icon path="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />,
        },
        {
          id: "moods",
          label: "Moods & Vibes",
          icon: <Icon path="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        },
        {
          id: "occasions",
          label: "Event Occasions",
          icon: <Icon path={["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"]} />,
        },
      ],
    },
    {
      group: "STORIES & REVIEWS",
      items: [
        {
          id: "stories",
          label: "Journal & Stories",
          icon: <Icon path={["M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"]} />,
        },
        {
          id: "testimonials",
          label: "Client Reviews",
          icon: <Icon path={["M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"]} />,
        },
      ],
    },
    {
      group: "DISCOVERY & MEDIA",
      items: [
        {
          id: "media",
          label: "Media Library",
          icon: <Icon path={["M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"]} />,
        },
        {
          id: "featured",
          label: "Featured Spotlights",
          icon: <Icon path="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
        },
        {
          id: "recommendations",
          label: "Smart Recommendations",
          icon: <Icon path="M13 10V3L4 14h7v7l9-11h-7z" />,
        },
      ],
    },
    {
      group: "WEBSITE SETUP",
      items: [
        {
          id: "navigation",
          label: "Header Navigation",
          icon: <Icon path={["M4 6h16M4 12h16M4 18h16"]} />,
        },
        {
          id: "footer",
          label: "Footer & Social Links",
          icon: <Icon path={["M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"]} />,
        },
        {
          id: "seo",
          label: "SEO & Google Previews",
          icon: <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
        },
      ],
    },
    {
      group: "SETTINGS & ACCESS",
      items: [
        {
          id: "settings",
          label: "General Settings",
          icon: <Icon path={["M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"]} />,
        },
        {
          id: "users",
          label: "Team & Permissions",
          icon: <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
        },
        {
          id: "activity",
          label: "Activity & Audit Log",
          icon: <Icon path={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"]} />,
        },
      ],
    },
  ];

  // Role permissions check
  const isViewAllowed = (view: AdminCMSView): boolean => {
    if (currentUserRole === "super_admin") return true;
    if (currentUserRole === "content_manager") {
      return ["dashboard", "experiences", "artists", "genres", "moods", "occasions", "stories", "media", "recommendations", "featured"].includes(view);
    }
    if (currentUserRole === "editor") {
      return ["dashboard", "homepage", "stories", "testimonials", "media"].includes(view);
    }
    if (currentUserRole === "viewer") {
      return ["dashboard", "experiences", "artists", "stories", "testimonials"].includes(view);
    }
    return true;
  };

  const currentViewTitle = navSections
    .flatMap((g) => g.items)
    .find((i) => i.id === currentView)?.label || "CMS";

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1A1916] flex font-ui antialiased">
      {/* ─── SIDEBAR NAVIGATION (Desktop & Tablet) ─── */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-[#EDE8DF] transition-all duration-300 z-30 select-none ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-[#EDE8DF] px-5 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="cursor-pointer" onClick={() => setCurrentView("dashboard")}>
              <span
                className="font-serif text-lg font-medium tracking-[0.06em] text-[#1A1916] block"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                MANNAT ARTS
              </span>
              <span className="font-ui text-[8px] font-bold text-[#C4952A] tracking-[0.2em] uppercase">
                CONTENT PLATFORM
              </span>
            </div>
          )}
          {sidebarCollapsed && (
            <div
              className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EDE8DF] flex items-center justify-center font-serif text-sm text-[#C4952A] font-bold mx-auto cursor-pointer"
              onClick={() => setCurrentView("dashboard")}
            >
              M
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A776F] hover:text-[#1A1916] hover:bg-[#FAF7F2] transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {navSections.map((section, sIdx) => {
            const allowedItems = section.items.filter((item) => isViewAllowed(item.id as AdminCMSView));
            if (allowedItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-1">
                {section.group && !sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-bold text-[#7A776F] tracking-[0.18em] uppercase mb-1.5">
                    {section.group}
                  </p>
                )}
                {allowedItems.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as AdminCMSView)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#1A1916] text-[#FAF7F2] shadow-xs"
                          : "text-[#4A4845] hover:text-[#1A1916] hover:bg-[#FAF7F2]"
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#EDE8DF] space-y-1 bg-[#FAF7F2]/50">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#4A4845] hover:text-[#1A1916] hover:bg-white transition-all cursor-pointer"
            title="Preview Website (Responsive Simulator)"
          >
            <Icon path={["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"]} />
            {!sidebarCollapsed && <span>Preview Website</span>}
          </button>
          <button
            onClick={onExitToClient}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#4A4845] hover:text-[#1A1916] hover:bg-white transition-all cursor-pointer"
            title="View Live Website"
          >
            <Icon path="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            {!sidebarCollapsed && <span>View Live Website</span>}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
            title="Logout"
          >
            <Icon path={["M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"]} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ─── MOBILE DRAWER (Slide-out navigation) ─── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 bg-white h-full flex flex-col z-10 shadow-2xl">
            <div className="h-16 px-5 border-b border-[#EDE8DF] flex items-center justify-between">
              <div>
                <span className="font-serif text-lg font-medium text-[#1A1916]">MANNAT ARTS</span>
                <span className="font-ui text-[8px] font-bold text-[#C4952A] block tracking-wider">
                  CMS PORTAL
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7A776F]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {navSections.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  {section.group && (
                    <p className="px-3 text-[10px] font-bold text-[#7A776F] tracking-wider uppercase mb-1">
                      {section.group}
                    </p>
                  )}
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id as AdminCMSView);
                        setMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${
                        currentView === item.id
                          ? "bg-[#1A1916] text-[#FAF7F2]"
                          : "text-[#4A4845] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#EDE8DF] space-y-2">
              <button
                onClick={() => {
                  setIsPreviewModalOpen(true);
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 bg-[#FAF7F2] rounded-xl text-center"
              >
                <Icon path={["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"]} />
                <span>Preview Website</span>
              </button>
              <button
                onClick={onExitToClient}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 bg-[#FAF7F2] rounded-xl text-center"
              >
                <Icon path="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                <span>View Live Website</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 text-red-600 rounded-xl text-center"
              >
                <Icon path={["M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"]} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#EDE8DF] px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden w-8 h-8 rounded-lg border border-[#EDE8DF] flex items-center justify-center text-sm"
              aria-label="Open menu"
            >
              ☰
            </button>

            <div className="flex items-center gap-3">
              <h1 className="font-serif text-xl font-medium text-[#1A1916] hidden sm:block">
                {currentViewTitle}
              </h1>

              {/* Live Status indicator */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Website Live</span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Global Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 bg-[#FAF7F2] hover:bg-[#EDE8DF]/60 border border-[#EDE8DF] px-3.5 py-1.5 rounded-full text-xs font-ui text-[#7A776F] transition-all cursor-pointer"
            >
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              <span className="hidden sm:inline">Search CMS...</span>
              <kbd className="hidden sm:inline text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#EDE8DF]">
                ⌘K
              </kbd>
            </button>

            {/* Quick Preview Button */}
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-[#EDE8DF] hover:border-[#C4952A] text-[#1A1916] bg-white transition-all cursor-pointer"
            >
              <Icon path={["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"]} />
              <span>Preview</span>
            </button>

            {/* Publish Changes Button */}
            <button
              onClick={handlePublishAllChanges}
              className="text-xs font-semibold px-5 py-2 rounded-full bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>✓</span> Publish to Live
            </button>

            {/* User Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#C4952A]/40 flex items-center justify-center font-serif text-xs text-[#C4952A] font-bold">
              MS
            </div>
          </div>
        </header>

        {/* View Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {currentView === "dashboard" && (
              <DashboardView
                experiences={cmsStore.experiences}
                artists={cmsStore.artists}
                genres={cmsStore.genres}
                occasions={cmsStore.occasions}
                stories={cmsStore.articles}
                activityLog={cmsStore.activityLog}
                lastPublished={cmsStore.settings.lastPublished}
                isLive={cmsStore.settings.isLive}
                onNavigate={(v) => setCurrentView(v as AdminCMSView)}
                onOpenAddExperience={() => setCurrentView("experiences")}
                onOpenAddArtist={() => setCurrentView("artists")}
                onOpenAddStory={() => setCurrentView("stories")}
                onPreviewWebsite={() => setIsPreviewModalOpen(true)}
                onViewLiveWebsite={onExitToClient}
              />
            )}

            {currentView === "homepage" && (
              <HomepageCMSView
                homepage={cmsStore.homepage}
                onUpdateHomepage={onUpdateHomepage}
                mediaList={cmsStore.media}
                onUploadMedia={onUploadMedia}
                onShowToast={addToast}
                onPreviewWebsite={() => setIsPreviewModalOpen(true)}
              />
            )}

            {currentView === "experiences" && (
              <ExperiencesCMSView
                experiences={cmsStore.experiences}
                genres={cmsStore.genres}
                moods={cmsStore.moods}
                occasions={cmsStore.occasions}
                mediaList={cmsStore.media}
                onUploadMedia={onUploadMedia}
                onAddExperience={onAddExperience}
                onUpdateExperience={onUpdateExperience}
                onDeleteExperience={onDeleteExperience}
                onShowToast={addToast}
                onPreviewExperience={() => setIsPreviewModalOpen(true)}
              />
            )}

            {currentView === "artists" && (
              <ArtistsCMSView
                artists={cmsStore.artists}
                genres={cmsStore.genres}
                featuredArtistIds={featuredArtistIds}
                onSetFeaturedArtistIds={onSetFeaturedArtistIds}
                onAddArtist={onAddArtist}
                onUpdateArtist={onUpdateArtist}
                onDeleteArtist={onDeleteArtist}
                mediaList={cmsStore.media}
                onUploadMedia={onUploadMedia}
                onShowToast={addToast}
                onPreviewArtist={onPreviewArtist}
              />
            )}

            {currentView === "genres" && (
              <GenresCMSView
                genres={cmsStore.genres}
                onUpdateGenre={onUpdateGenre}
                mediaList={cmsStore.media}
                onUploadMedia={onUploadMedia}
                onShowToast={addToast}
              />
            )}

            {currentView === "moods" && (
              <MoodsCMSView
                moods={cmsStore.moods}
                genres={cmsStore.genres}
                onUpdateMoods={onUpdateMoods}
                mediaList={cmsStore.media}
                onUploadMedia={onUploadMedia}
                onShowToast={addToast}
              />
            )}

            {currentView === "occasions" && (
              <OccasionsCMSView
                occasions={cmsStore.occasions}
                genres={cmsStore.genres}
                onUpdateOccasions={onUpdateOccasions}
                mediaList={cmsStore.media}
                onUploadMedia={onUploadMedia}
                onShowToast={addToast}
              />
            )}

            {currentView === "stories" && (
              <StoriesCMSView
                articles={cmsStore.articles}
                onAddArticle={onAddArticle}
                onUpdateArticle={onUpdateArticle}
                onDeleteArticle={onDeleteArticle}
                mediaList={cmsStore.media}
                onUploadMedia={onUploadMedia}
                onShowToast={addToast}
                onPreviewArticle={onPreviewArticle}
              />
            )}

            {currentView === "testimonials" && (
              <TestimonialsCMSView
                testimonials={cmsStore.testimonials}
                onUpdateTestimonials={onUpdateTestimonials}
                mediaList={cmsStore.media}
                onUploadMedia={onUploadMedia}
                onShowToast={addToast}
              />
            )}

            {currentView === "recommendations" && (
              <RecommendationsView
                moods={cmsStore.moods}
                occasions={cmsStore.occasions}
                genres={cmsStore.genres}
                experiences={cmsStore.experiences}
                onShowToast={addToast}
              />
            )}

            {currentView === "featured" && (
              <FeaturedContentView
                experiences={cmsStore.experiences}
                onUpdateExperience={onUpdateExperience}
                artists={cmsStore.artists}
                featuredArtistIds={featuredArtistIds}
                onSetFeaturedArtistIds={onSetFeaturedArtistIds}
                stories={cmsStore.articles}
                onUpdateStory={onUpdateArticle}
                genres={cmsStore.genres}
                onShowToast={addToast}
              />
            )}

            {currentView === "media" && (
              <MediaLibraryView
                mediaList={cmsStore.media}
                onUploadMedia={onUploadMedia}
                onDeleteMedia={onDeleteMedia}
                onShowToast={addToast}
              />
            )}

            {currentView === "navigation" && (
              <NavigationCMSView
                navigation={cmsStore.navigation}
                onUpdateNavigation={onUpdateNavigation}
                onShowToast={addToast}
              />
            )}

            {currentView === "footer" && (
              <FooterCMSView
                footer={cmsStore.footer}
                onUpdateFooter={onUpdateFooter}
                onShowToast={addToast}
              />
            )}

            {currentView === "seo" && (
              <SEOCMSView
                seo={cmsStore.seo}
                onUpdateSEO={onUpdateSEO}
                mediaList={cmsStore.media}
                onUploadMedia={onUploadMedia}
                onShowToast={addToast}
              />
            )}

            {currentView === "settings" && (
              <SettingsCMSView
                settings={cmsStore.settings}
                onUpdateSettings={onUpdateSettings}
                onResetAllToDefaults={onResetAllToDefaults}
                onShowToast={addToast}
              />
            )}

            {currentView === "users" && (
              <UsersCMSView
                users={cmsStore.users}
                currentUserRole={currentUserRole}
                onChangeCurrentUserRole={setCurrentUserRole}
                onShowToast={addToast}
              />
            )}

            {currentView === "activity" && (
              <ActivityLogView
                activityLog={cmsStore.activityLog}
                onShowToast={addToast}
              />
            )}
          </div>
        </main>
      </div>

      {/* ─── MODALS & OVERLAYS ─── */}
      {/* Global Cmd+K Search */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        experiences={cmsStore.experiences}
        artists={cmsStore.artists}
        genres={cmsStore.genres}
        moods={cmsStore.moods}
        occasions={cmsStore.occasions}
        stories={cmsStore.articles}
        onNavigateToView={(view) => setCurrentView(view as AdminCMSView)}
      />

      {/* Multi-Device Live Preview Simulator */}
      <WebsitePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onPublishNow={handlePublishAllChanges}
      />

      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
