import { Artist, GenreInfo } from "./artistsData";
import { BlogArticle } from "./blogData";

export type UserRole = "super_admin" | "content_manager" | "editor" | "viewer";

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

export interface CMSUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  lastActive: string;
}

export interface ActivityLogItem {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityName: string;
  timestamp: string;
}

export interface HomepageSection {
  id: string;
  name: string;
  description: string;
  isVisible: boolean;
  order: number;
}

export interface HeroConfig {
  headline: string;
  headlineItalic: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  bgImage: string;
  overlayOpacity: number; // 0 to 1
  isVisible: boolean;
  eyebrow: string;
}

export interface FinalCtaConfig {
  eyebrow: string;
  headline: string;
  headlineItalic: string;
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  isVisible: boolean;
}

export interface HomepageConfig {
  sections: HomepageSection[];
  hero: HeroConfig;
  finalCta: FinalCtaConfig;
}

export interface Experience {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  genres: string[]; // ["sufi", "rock", etc.]
  moods: string[];  // ["celebrate", "reflect", etc.]
  occasions: string[]; // ["Wedding", "Corporate Event", etc.]
  coverImage: string;
  gallery: string[];
  videoUrl?: string;
  duration: string;
  audienceSize: string;
  location: string;
  performanceType: string;
  isFeatured: boolean;
  status: "draft" | "published" | "scheduled";
  publishedDate?: string;
  seoTitle: string;
  seoDesc: string;
  slug: string;
  socialShareImg?: string;
  artistIds: string[];
  updatedAt: string;
}

export interface MoodItem {
  id: string;
  title: string;
  desc: string;
  img: string;
  accent: string;
  genre: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";
  relatedGenres: string[];
  relatedOccasions: string[];
  isVisible: boolean;
  order: number;
}

export interface OccasionItem {
  id: string;
  label: string;
  icon: string;
  genre: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";
  desc: string;
  coverImg: string;
  relatedMoods: string[];
  relatedGenres: string[];
  recommendedExperienceIds: string[];
  isVisible: boolean;
  order: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  type: string;
  quote: string;
  photo?: string;
  rating: number;
  isFeatured: boolean;
  status: "published" | "draft";
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  size: string;
  dimensions: string;
  altText: string;
  description: string;
  uploadDate: string;
  usedIn: string[];
}

export interface NavLinkItem {
  id: string;
  label: string;
  target: string;
  isVisible: boolean;
  order: number;
}

export interface FooterNavGroup {
  title: string;
  links: { label: string; url: string }[];
}

export interface FooterConfig {
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  copyrightText: string;
  socialLinks: { platform: string; url: string }[];
  navGroups: FooterNavGroup[];
}

export interface GlobalSEOConfig {
  siteTitle: string;
  siteDescription: string;
  defaultSocialImage: string;
  favicon: string;
  keywords: string[];
  author: string;
}

export interface GeneralSettingsConfig {
  siteName: string;
  tagline: string;
  logoText: string;
  logoSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  primaryColor: string;
  accentColor: string;
  analyticsId: string;
  lastPublished: string;
  isLive: boolean;
}

export interface RecommendationOverride {
  id: string;
  moodId: string;
  occasionId: string;
  recommendedGenres: string[];
  recommendedExperienceIds: string[];
}

export interface CMSDataStore {
  homepage: HomepageConfig;
  experiences: Experience[];
  artists: Artist[];
  genres: Record<string, GenreInfo>;
  moods: MoodItem[];
  occasions: OccasionItem[];
  articles: BlogArticle[];
  testimonials: TestimonialItem[];
  media: MediaItem[];
  navigation: NavLinkItem[];
  footer: FooterConfig;
  seo: GlobalSEOConfig;
  settings: GeneralSettingsConfig;
  users: CMSUser[];
  activityLog: ActivityLogItem[];
  recommendationOverrides: RecommendationOverride[];
}
