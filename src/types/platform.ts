import { Artist, GenreInfo } from "../data/artistsData";

export type UserRole = "admin" | "artist" | "client";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastLoginAt?: string;
  artistProfileId?: string; // links 1:1 if role is artist
}

export type ArtistApplicationStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export interface ArtistVideoLink {
  id: string;
  title: string;
  url: string;
  platform: "youtube" | "vimeo" | "other";
}

export interface ArtistPortfolioItem {
  id: string;
  url: string;
  caption?: string;
}

export interface ArtistReviewItem {
  author: string;
  event: string;
  city: string;
  comment: string;
  rating: number;
  date?: string;
}

export interface ArtistApplicationProfile {
  id: string;
  userId: string;
  slug: string;
  name: string;
  stageName?: string;
  email: string;
  phone: string;
  
  // Profile
  img: string; // Profile photo
  coverImg?: string;
  shortBio: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  languages: string[];

  // Artistic Information
  genre: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";
  genreTitle: string;
  secondaryGenres: string[];
  moods: string[];
  occasions: string[];
  performanceTypes: string[];
  experienceYears: number;
  performanceDuration: string;
  bandType: "Solo" | "Duo" | "Trio" | "4-6 Piece Band" | "Full Troupe (8+ Members)";
  primaryInstruments: string[];

  // Portfolio
  portfolioImages: string[];
  videoLinks: ArtistVideoLink[];
  externalLinks: { label: string; url: string }[];
  previousPerformances: string[];
  sampleSetlist: string[];
  techRider: string[];

  // Professional & Logistics
  availabilityStatus: "available" | "limited" | "unavailable";
  customAvailabilityNotes?: string;
  serviceLocations: string[];
  travelsPanIndia: boolean;
  travelsInternational: boolean;
  price: string;
  priceNum: number;
  contactPreference: "email" | "phone" | "whatsapp" | "platform";

  // Social Links
  instagram?: string;
  youtube?: string;
  facebook?: string;
  website?: string;

  // Application & Moderation
  status: ArtistApplicationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  changesRequestedMessage?: string;
  rejectionReason?: string;
  isFeatured?: boolean;

  // Compatibility aliases
  moodTags?: string[];
  occasionTags?: string[];
  startingPrice?: number;
  duration?: string;
  tagline?: string;
  instruments?: string[];
  statusHistory?: {
    status: ArtistApplicationStatus;
    changedAt: string;
    changedByName: string;
    reason?: string;
  }[];

  // Analytics & Profile Health
  rating: number;
  reviewsCount: number;
  eventsCompleted: number;
  profileViews: number;
  completionPercentage: number;
  updatedAt: string;
  createdAt: string;
}

export type EnquiryStatus =
  | "NEW"
  | "VIEWED"
  | "RESPONDED"
  | "INTERESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "CLOSED";

export interface EnquiryTimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  actor: string;
  actorRole: UserRole | "system";
}

export interface EnquiryInternalNote {
  id: string;
  note: string;
  author: string;
  createdAt: string;
}

export interface ArtistEnquiryResponse {
  message: string;
  proposedFee?: string;
  availabilityStatus: "confirmed" | "alternative_date" | "unavailable";
  notes?: string;
  respondedAt: string;
}

export interface ClientEnquiry {
  id: string; // e.g. "ENQ-10482"
  clientId?: string; // Optional if guest enquiry, linked if registered client
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  artistId: string;
  artistNameSnapshot: string;
  artistSlugSnapshot: string;
  
  eventType: string;
  eventDate: string;
  eventLocation: string;
  audienceSize: string;
  preferredExperience?: string;
  preferredMood?: string;
  preferredGenre?: string;
  budgetRange?: string;
  message: string;
  consentAgreed: boolean;

  status: EnquiryStatus;
  artistResponse?: ArtistEnquiryResponse;
  
  timeline: EnquiryTimelineEvent[];
  internalNotes?: EnquiryInternalNote[];

  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
  closedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  type: "application" | "enquiry" | "response" | "system";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PlatformActivityLog {
  id: string;
  actor: string;
  actorName?: string;
  role: UserRole | "system";
  action: string;
  entity: string;
  entityId: string;
  entityName: string;
  timestamp: string;
  details?: string;
}
