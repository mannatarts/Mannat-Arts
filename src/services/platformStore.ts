import { ALL_ARTISTS, Artist } from "../data/artistsData";
import {
  ArtistApplicationProfile,
  ArtistApplicationStatus,
  ClientEnquiry,
  EnquiryStatus,
  NotificationItem,
  PlatformActivityLog,
  User,
} from "../types/platform";

const ARTISTS_STORAGE_KEY = "mannat_platform_artists_v2";
const ENQUIRIES_STORAGE_KEY = "mannat_platform_enquiries_v2";
const NOTIFICATIONS_STORAGE_KEY = "mannat_platform_notifications_v2";
const ACTIVITY_STORAGE_KEY = "mannat_platform_activity_v2";

// Helper to convert legacy Artist to canonical ArtistApplicationProfile
function legacyToCanonicalArtist(a: Artist, index: number): ArtistApplicationProfile {
  const isApproved = true;
  return {
    id: a.id,
    userId: index === 0 ? "user-artist-1" : `user-artist-${a.id}`,
    slug: a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name: a.name,
    stageName: a.stageName,
    email: `${a.id}@mannatarts.com`,
    phone: "+91 98201 0000" + (index + 1),
    img: a.img,
    coverImg: a.img,
    shortBio: a.tagline || a.bio.slice(0, 120),
    bio: a.bio,
    city: a.city,
    state: a.state,
    country: "India",
    languages: ["Hindi", "English", "Punjabi", "Urdu"],
    genre: a.genre,
    genreTitle: a.genreTitle,
    secondaryGenres: a.genre === "sufi" ? ["gazal", "devotional"] : ["bollywood"],
    moods: ["Soulful", "Intimate", "Reflective", "Celebratory"],
    occasions: ["Wedding", "Cultural Event", "Private Celebration", "Corporate Gala"],
    performanceTypes: [a.bandType, "Acoustic Baithak", "Live Concert"],
    experienceYears: a.experienceYears || 8,
    performanceDuration: a.performanceDuration || "90 - 120 minutes",
    bandType: a.bandType || "4-6 Piece Band",
    primaryInstruments: a.primaryInstruments || ["Harmonium", "Tabla", "Vocals"],
    portfolioImages: [
      a.img,
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=600&fit=crop&auto=format&q=80",
    ],
    videoLinks: [
      {
        id: `vid-${a.id}-1`,
        title: "Live at Royal Jaipur Palace",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        platform: "youtube",
      },
    ],
    externalLinks: [{ label: "Official Website", url: "https://mannatarts.com" }],
    previousPerformances: [
      "Royal Palace Sangeet, Udaipur (Nov 2025)",
      "Global Heritage Summit, Mumbai (Jan 2026)",
      "Jodhpur Sufi Rhythms (Dec 2025)",
    ],
    sampleSetlist: a.sampleSetlist || ["Dama Dam Mast Qalandar", "Chhap Tilak", "Afreen Afreen"],
    techRider: a.techRider || ["4 Vocal Mics", "2 D.I. Boxes", "Stage Monitors"],
    availabilityStatus: "available",
    serviceLocations: ["Mumbai", "Delhi NCR", "Jaipur", "Udaipur", "Bangalore", "Goa"],
    travelsPanIndia: a.travelsPanIndia !== false,
    travelsInternational: a.travelsInternational || false,
    price: a.price,
    priceNum: a.priceNum,
    contactPreference: "platform",
    instagram: "@" + a.name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".live",
    youtube: "youtube.com/@" + a.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
    status: isApproved ? "APPROVED" : "PENDING_REVIEW",
    submittedAt: "2026-02-10T10:00:00Z",
    reviewedAt: "2026-02-12T14:30:00Z",
    reviewedBy: "Mannat Sharma",
    rating: a.rating,
    reviewsCount: a.reviewsCount,
    eventsCompleted: a.eventsCompleted,
    profileViews: 1240 + index * 180,
    completionPercentage: 95,
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-02-28T16:00:00Z",
  };
}

// Seed Pending Artist for Admin Review testing
const SEED_PENDING_ARTIST: ArtistApplicationProfile = {
  id: "artist-pending-1",
  userId: "user-artist-new",
  slug: "kabir-sufi-ensemble",
  name: "Kabir Sufi Ensemble",
  stageName: "The Mystics of Punjab",
  email: "newartist@mannatarts.com",
  phone: "+91 97110 99882",
  img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1000&fit=crop&auto=format&q=80",
  coverImg: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&h=800&fit=crop&auto=format&q=80",
  shortBio: "Soul-stirring classical qawwalis, rare mystic poetry, and ecstatic live percussion.",
  bio: "Kabir Sufi Ensemble brings together three generations of vocal traditions from the heart of Punjab. Led by master vocalist Ustad Kabir Hassan, the ensemble weaves 13th-century Sufi kalaams by Bulleh Shah, Amir Khusro, and Rumi with rich contemporary acoustic instrumentation.",
  city: "Amritsar",
  state: "Punjab",
  country: "India",
  languages: ["Punjabi", "Urdu", "Hindi"],
  genre: "sufi",
  genreTitle: "Sufi & Mystic",
  secondaryGenres: ["devotional", "gazal"],
  moods: ["Soulful", "Ecstatic", "Reflective", "Intimate"],
  occasions: ["Wedding", "Private Celebration", "Cultural Event", "Festival"],
  performanceTypes: ["Full Troupe (8+ Members)", "Acoustic Baithak", "Grand Stage Production"],
  experienceYears: 12,
  performanceDuration: "120 - 150 minutes",
  bandType: "Full Troupe (8+ Members)",
  primaryInstruments: ["Harmonium", "Tabla", "Dholak", "Sarangi", "Vocal Troupe"],
  portfolioImages: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=600&fit=crop&auto=format&q=80",
  ],
  videoLinks: [
    {
      id: "vid-kabir-1",
      title: "Chhap Tilak Live Baithak",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      platform: "youtube",
    },
    {
      id: "vid-kabir-2",
      title: "Dama Dam Mast Qalandar Heritage Festival",
      url: "https://vimeo.com/76979871",
      platform: "vimeo",
    },
  ],
  externalLinks: [
    { label: "Spotify Artist Page", url: "https://spotify.com" },
    { label: "Apple Music", url: "https://apple.com" },
  ],
  previousPerformances: [
    "Jodhpur RIFF Festival (October 2025)",
    "Amritsar Heritage Sangeet (December 2025)",
    "Oberoi Udaivilas Royal Wedding (January 2026)",
  ],
  sampleSetlist: ["Mast Qalandar", "Chhap Tilak", "Nit Khair Manga", "Sanu Ik Pal Chain"],
  techRider: ["6 Shure SM58 Vocal Mics", "4 D.I. Boxes for Harmonium & Sarangi", "2 Microphones for Tabla/Dholak"],
  availabilityStatus: "available",
  serviceLocations: ["Pan-India", "Delhi NCR", "Jaipur", "Chandigarh", "Dubai"],
  travelsPanIndia: true,
  travelsInternational: true,
  price: "₹1,25,000",
  priceNum: 125000,
  contactPreference: "platform",
  instagram: "@kabirsufiofficial",
  youtube: "youtube.com/@kabirsufi",
  status: "PENDING_REVIEW",
  submittedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  rating: 5.0,
  reviewsCount: 3,
  eventsCompleted: 64,
  profileViews: 320,
  completionPercentage: 90,
  createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
};

// Seed Enquiries
const SEED_ENQUIRIES: ClientEnquiry[] = [
  {
    id: "ENQ-10482",
    clientId: "user-client-1",
    clientName: "Priya Sharma",
    clientEmail: "client@mannatarts.com",
    clientPhone: "+91 98201 45678",
    artistId: "artist-1",
    artistNameSnapshot: "Zakir Khan & Sufi Souls",
    artistSlugSnapshot: "zakir-khan-sufi-souls",
    eventType: "Wedding",
    eventDate: "2026-10-18",
    eventLocation: "Jaipur, Rajasthan",
    audienceSize: "150-250 Guests",
    preferredExperience: "Sufi Evening with Live Qawwals",
    preferredMood: "Soulful",
    preferredGenre: "Sufi",
    budgetRange: "₹1,00,000 - ₹1,50,000",
    message:
      "We are hosting a royal wedding sangeet at Rambagh Palace and are captivated by Zakir Khan's soulful qawwali performances. We would love a 90-minute intimate baithak set.",
    consentAgreed: true,
    status: "NEW",
    timeline: [
      {
        id: "tl-1",
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        action: "Enquiry Submitted",
        description: "Client Priya Sharma submitted enquiry ENQ-10482 for Wedding Sangeet.",
        actor: "Priya Sharma",
        actorRole: "client",
      },
    ],
    internalNotes: [
      {
        id: "note-1",
        note: "VIP client — daughter of Singhania Group trustee. Priority handling.",
        author: "Mannat Sharma",
        createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
  {
    id: "ENQ-10483",
    clientId: "user-client-1",
    clientName: "Priya Sharma",
    clientEmail: "client@mannatarts.com",
    clientPhone: "+91 98201 45678",
    artistId: "artist-2",
    artistNameSnapshot: "Highway Pulse",
    artistSlugSnapshot: "highway-pulse",
    eventType: "Corporate",
    eventDate: "2026-11-05",
    eventLocation: "Bangalore",
    audienceSize: "500+ Guests",
    preferredMood: "Energise",
    preferredGenre: "Rock",
    budgetRange: "₹80,000 - ₹1,20,000",
    message: "Annual Innovation Summit gala dinner. Need an energetic 75-minute indie rock set.",
    consentAgreed: true,
    status: "RESPONDED",
    artistResponse: {
      message:
        "Hello Priya, Highway Pulse would love to perform for your Innovation Summit! We are fully available on November 5th in Bangalore with our 5-piece band lineup.",
      proposedFee: "₹95,000 (inclusive of sound rider)",
      availabilityStatus: "confirmed",
      notes: "Stage dimensions minimum 20x16ft required.",
      respondedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
    timeline: [
      {
        id: "tl-2a",
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        action: "Enquiry Submitted",
        description: "Client submitted corporate gala inquiry.",
        actor: "Priya Sharma",
        actorRole: "client",
      },
      {
        id: "tl-2b",
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        action: "Enquiry Viewed",
        description: "Artist Highway Pulse viewed the enquiry.",
        actor: "Highway Pulse",
        actorRole: "artist",
      },
      {
        id: "tl-2c",
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        action: "Artist Responded",
        description: "Artist sent availability and fee proposal of ₹95,000.",
        actor: "Highway Pulse",
        actorRole: "artist",
      },
    ],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    respondedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
];

// Seed Notifications
const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "user-artist-1",
    role: "artist",
    title: "New Client Enquiry Received",
    message: "Priya Sharma submitted an enquiry for a Wedding in Jaipur on 18 Oct 2026.",
    type: "enquiry",
    link: "#artist/enquiries",
    isRead: false,
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    userId: "user-client-1",
    role: "client",
    title: "Artist Responded to Your Enquiry",
    message: "Highway Pulse responded to your enquiry for the Bangalore Summit.",
    type: "response",
    link: "#client/dashboard",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    userId: "user-admin-1",
    role: "admin",
    title: "New Artist Application Pending",
    message: "Kabir Sufi Ensemble submitted an application for review.",
    type: "application",
    link: "#admin/applications",
    isRead: false,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
];

export class PlatformStore {
  // ─── ARTIST PROFILES ───────────────────────────────────────────────────────
  public static getArtists(): ArtistApplicationProfile[] {
    try {
      const raw = localStorage.getItem(ARTISTS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error reading artists from storage", e);
    }
    const initial = [
      ...ALL_ARTISTS.map((a, idx) => legacyToCanonicalArtist(a, idx)),
      SEED_PENDING_ARTIST,
    ];
    PlatformStore.saveArtists(initial);
    return initial;
  }

  public static saveArtists(artists: ArtistApplicationProfile[]): void {
    try {
      localStorage.setItem(ARTISTS_STORAGE_KEY, JSON.stringify(artists));
    } catch (e) {
      console.error("Error saving artists", e);
    }
  }

  public static getArtistById(id: string): ArtistApplicationProfile | undefined {
    return PlatformStore.getArtists().find((a) => a.id === id);
  }

  public static getArtistBySlug(slug: string): ArtistApplicationProfile | undefined {
    return PlatformStore.getArtists().find((a) => a.slug === slug);
  }

  public static getArtistByUserId(userId: string): ArtistApplicationProfile | undefined {
    return PlatformStore.getArtists().find((a) => a.userId === userId);
  }

  public static getApprovedArtists(): ArtistApplicationProfile[] {
    return PlatformStore.getArtists().filter((a) => a.status === "APPROVED");
  }

  public static createArtistApplication(
    profile: Omit<ArtistApplicationProfile, "id" | "slug" | "status" | "createdAt" | "updatedAt" | "profileViews" | "completionPercentage">
  ): ArtistApplicationProfile {
    const artists = PlatformStore.getArtists();
    const id = `artist-${Date.now()}`;
    const baseSlug = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${Math.random().toString(36).substr(2, 4)}`;
    
    const newProfile: ArtistApplicationProfile = {
      ...profile,
      id,
      slug,
      status: "PENDING_REVIEW",
      submittedAt: new Date().toISOString(),
      rating: 5.0,
      reviewsCount: 0,
      eventsCompleted: 0,
      profileViews: 0,
      completionPercentage: PlatformStore.calculateCompletion(profile),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    artists.unshift(newProfile);
    PlatformStore.saveArtists(artists);

    // Record activity
    PlatformStore.addActivityLog({
      actor: profile.name,
      role: "artist",
      action: "Submitted Artist Application",
      entity: "ArtistApplication",
      entityId: id,
      entityName: profile.name,
      details: `Genre: ${profile.genreTitle}, City: ${profile.city}`,
    });

    // Notify admins
    PlatformStore.addNotification({
      userId: "user-admin-1",
      role: "admin",
      title: "New Artist Application Submitted",
      message: `${profile.name} (${profile.genreTitle}) has submitted an onboarding application for review.`,
      type: "application",
      link: "#admin/applications",
    });

    return newProfile;
  }

  public static updateArtistProfile(
    artistId: string,
    updates: Partial<ArtistApplicationProfile>,
    actorUser?: User
  ): ArtistApplicationProfile {
    const artists = PlatformStore.getArtists();
    const idx = artists.findIndex((a) => a.id === artistId);
    if (idx === -1) throw new Error("Artist profile not found");

    const prev = artists[idx];

    // Authorization rule check
    if (actorUser && actorUser.role === "artist" && actorUser.id !== prev.userId) {
      throw new Error("Unauthorized: Artists can only update their own profile.");
    }

    const updated: ArtistApplicationProfile = {
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
      completionPercentage: PlatformStore.calculateCompletion({ ...prev, ...updates }),
    };

    artists[idx] = updated;
    PlatformStore.saveArtists(artists);

    PlatformStore.addActivityLog({
      actor: actorUser ? actorUser.name : updated.name,
      role: actorUser ? actorUser.role : "artist",
      action: "Updated Artist Profile",
      entity: "ArtistProfile",
      entityId: artistId,
      entityName: updated.name,
    });

    return updated;
  }

  public static approveArtist(artistId: string, adminUser?: User): ArtistApplicationProfile {
    const admin = adminUser && adminUser.role === "admin" ? adminUser : {
      id: "admin-desk",
      email: "curators@mannatarts.com",
      name: adminUser?.name ? `${adminUser.name} (Admin)` : "Mannat Curation Desk",
      role: "admin" as const,
      status: "active" as const,
      createdAt: new Date().toISOString(),
    };

    const artists = PlatformStore.getArtists();
    const idx = artists.findIndex((a) => a.id === artistId);
    if (idx === -1) throw new Error("Artist not found");

    const artist = artists[idx];
    artist.status = "APPROVED";
    artist.reviewedAt = new Date().toISOString();
    artist.reviewedBy = admin.name;
    artist.updatedAt = new Date().toISOString();

    const historyEntry = {
      status: "APPROVED" as const,
      changedAt: new Date().toISOString(),
      changedByName: admin.name,
      reason: "Approved for public curation.",
    };
    artist.statusHistory = [...(artist.statusHistory || []), historyEntry];

    artists[idx] = artist;
    PlatformStore.saveArtists(artists);

    PlatformStore.addActivityLog({
      actor: admin.name,
      role: "admin",
      action: "Approved Artist Application",
      entity: "ArtistProfile",
      entityId: artistId,
      entityName: artist.name,
      details: "Artist is now published and searchable on public website.",
    });

    PlatformStore.addNotification({
      userId: artist.userId,
      role: "artist",
      title: "Application Approved! 🎉",
      message: `Congratulations! Your Mannat Arts profile is now officially approved and live to clients nationwide.`,
      type: "application",
      link: "#artist/dashboard",
    });

    return artist;
  }

  public static requestChanges(
    artistId: string,
    message: string,
    adminUser?: User
  ): ArtistApplicationProfile {
    const admin = adminUser && adminUser.role === "admin" ? adminUser : {
      id: "admin-desk",
      email: "curators@mannatarts.com",
      name: adminUser?.name ? `${adminUser.name} (Admin)` : "Mannat Curation Desk",
      role: "admin" as const,
      status: "active" as const,
      createdAt: new Date().toISOString(),
    };

    const artists = PlatformStore.getArtists();
    const idx = artists.findIndex((a) => a.id === artistId);
    if (idx === -1) throw new Error("Artist not found");

    const artist = artists[idx];
    artist.status = "CHANGES_REQUESTED";
    artist.changesRequestedMessage = message;
    artist.reviewedAt = new Date().toISOString();
    artist.reviewedBy = admin.name;
    artist.updatedAt = new Date().toISOString();

    const historyEntry = {
      status: "CHANGES_REQUESTED" as const,
      changedAt: new Date().toISOString(),
      changedByName: admin.name,
      reason: message,
    };
    artist.statusHistory = [...(artist.statusHistory || []), historyEntry];

    artists[idx] = artist;
    PlatformStore.saveArtists(artists);

    PlatformStore.addActivityLog({
      actor: admin.name,
      role: "admin",
      action: "Requested Changes on Application",
      entity: "ArtistProfile",
      entityId: artistId,
      entityName: artist.name,
      details: message,
    });

    PlatformStore.addNotification({
      userId: artist.userId,
      role: "artist",
      title: "Profile Changes Requested",
      message: `Admin feedback: "${message}" Please update and resubmit your profile.`,
      type: "application",
      link: "#artist/application",
    });

    return artist;
  }

  public static rejectArtist(
    artistId: string,
    reason: string,
    adminUser?: User
  ): ArtistApplicationProfile {
    const admin = adminUser && adminUser.role === "admin" ? adminUser : {
      id: "admin-desk",
      email: "curators@mannatarts.com",
      name: adminUser?.name ? `${adminUser.name} (Admin)` : "Mannat Curation Desk",
      role: "admin" as const,
      status: "active" as const,
      createdAt: new Date().toISOString(),
    };

    const artists = PlatformStore.getArtists();
    const idx = artists.findIndex((a) => a.id === artistId);
    if (idx === -1) throw new Error("Artist not found");

    const artist = artists[idx];
    artist.status = "REJECTED";
    artist.rejectionReason = reason;
    artist.reviewedAt = new Date().toISOString();
    artist.reviewedBy = admin.name;
    artist.updatedAt = new Date().toISOString();

    const historyEntry = {
      status: "REJECTED" as const,
      changedAt: new Date().toISOString(),
      changedByName: admin.name,
      reason,
    };
    artist.statusHistory = [...(artist.statusHistory || []), historyEntry];

    artists[idx] = artist;
    PlatformStore.saveArtists(artists);

    PlatformStore.addActivityLog({
      actor: admin.name,
      role: "admin",
      action: "Rejected Artist Application",
      entity: "ArtistProfile",
      entityId: artistId,
      entityName: artist.name,
      details: reason,
    });

    PlatformStore.addNotification({
      userId: artist.userId,
      role: "artist",
      title: "Application Status Update",
      message: `Your Mannat Arts application has been declined. Reason: "${reason}"`,
      type: "application",
      link: "#artist/application",
    });

    return artist;
  }

  public static suspendArtist(artistId: string, adminUser: User): ArtistApplicationProfile {
    if (adminUser.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can suspend artists.");
    }
    const artists = PlatformStore.getArtists();
    const idx = artists.findIndex((a) => a.id === artistId);
    if (idx === -1) throw new Error("Artist not found");

    const artist = artists[idx];
    artist.status = "SUSPENDED";
    artist.updatedAt = new Date().toISOString();

    artists[idx] = artist;
    PlatformStore.saveArtists(artists);

    PlatformStore.addActivityLog({
      actor: adminUser.name,
      role: "admin",
      action: "Suspended Artist",
      entity: "ArtistProfile",
      entityId: artistId,
      entityName: artist.name,
      details: "Artist removed from public listings while retaining data.",
    });

    return artist;
  }

  public static reactivateArtist(artistId: string, adminUser: User): ArtistApplicationProfile {
    if (adminUser.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can reactivate artists.");
    }
    const artists = PlatformStore.getArtists();
    const idx = artists.findIndex((a) => a.id === artistId);
    if (idx === -1) throw new Error("Artist not found");

    const artist = artists[idx];
    artist.status = "APPROVED";
    artist.updatedAt = new Date().toISOString();

    artists[idx] = artist;
    PlatformStore.saveArtists(artists);

    PlatformStore.addActivityLog({
      actor: adminUser.name,
      role: "admin",
      action: "Reactivated Artist",
      entity: "ArtistProfile",
      entityId: artistId,
      entityName: artist.name,
      details: "Artist reinstated to live public discovery.",
    });

    return artist;
  }

  public static incrementProfileViews(artistId: string): void {
    const artists = PlatformStore.getArtists();
    const artist = artists.find((a) => a.id === artistId);
    if (artist) {
      artist.profileViews = (artist.profileViews || 0) + 1;
      PlatformStore.saveArtists(artists);
    }
  }

  public static calculateCompletion(p: Partial<ArtistApplicationProfile>): number {
    let score = 0;
    if (p.img && p.img.length > 5) score += 15;
    if (p.bio && p.bio.length > 30) score += 15;
    if (p.genre) score += 15;
    if (p.portfolioImages && p.portfolioImages.length >= 2) score += 15;
    if (p.videoLinks && p.videoLinks.length >= 1) score += 15;
    if (p.priceNum && p.priceNum > 0) score += 15;
    if (p.instagram || p.youtube || p.website) score += 10;
    return Math.min(score, 100);
  }

  public static getAllEnquiries(): ClientEnquiry[] {
    return PlatformStore.getEnquiries();
  }

  public static updateArtistStatus(
    artistId: string,
    status: ArtistApplicationStatus,
    adminUser: User,
    meta?: { reason?: string; notes?: string }
  ): ArtistApplicationProfile {
    if (status === "APPROVED") {
      return PlatformStore.approveArtist(artistId, adminUser);
    }
    if (status === "CHANGES_REQUESTED") {
      return PlatformStore.requestChanges(artistId, meta?.reason || "Please update your profile details.", adminUser);
    }
    if (status === "REJECTED") {
      return PlatformStore.rejectArtist(artistId, meta?.reason || "Application declined.", adminUser);
    }
    if (status === "SUSPENDED") {
      return PlatformStore.suspendArtist(artistId, adminUser);
    }
    return PlatformStore.updateArtistProfile(artistId, { status }, adminUser);
  }

  // ─── ENQUIRIES ─────────────────────────────────────────────────────────────
  public static getEnquiries(user?: User): ClientEnquiry[] {
    let list: ClientEnquiry[] = [];
    try {
      const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
      if (raw) {
        list = JSON.parse(raw);
      } else {
        list = SEED_ENQUIRIES;
        PlatformStore.saveEnquiries(list);
      }
    } catch (e) {
      console.error("Error reading enquiries", e);
      list = SEED_ENQUIRIES;
    }

    if (!user) return list;

    // RBAC Enquiry Filtering
    if (user.role === "admin") {
      return list;
    }
    if (user.role === "artist") {
      const artist = PlatformStore.getArtistByUserId(user.id);
      if (!artist) return [];
      return list.filter((e) => e.artistId === artist.id);
    }
    if (user.role === "client") {
      return list.filter(
        (e) =>
          e.clientId === user.id ||
          e.clientEmail.toLowerCase() === user.email.toLowerCase()
      );
    }
    return [];
  }

  public static saveEnquiries(enquiries: ClientEnquiry[]): void {
    try {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(enquiries));
    } catch (e) {
      console.error("Error saving enquiries", e);
    }
  }

  public static getEnquiryById(id: string, user?: User): ClientEnquiry | undefined {
    const list = PlatformStore.getEnquiries(user);
    return list.find((e) => e.id === id);
  }

  public static createEnquiry(
    data: Omit<ClientEnquiry, "id" | "status" | "createdAt" | "updatedAt" | "timeline">
  ): ClientEnquiry {
    const enquiries = PlatformStore.getEnquiries();
    const id = `ENQ-${Math.floor(10000 + Math.random() * 90000)}`;

    const newEnquiry: ClientEnquiry = {
      ...data,
      id,
      status: "NEW",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "Enquiry Submitted",
          description: `Client ${data.clientName} submitted booking inquiry for ${data.eventType} on ${data.eventDate}.`,
          actor: data.clientName,
          actorRole: data.clientId ? "client" : "system",
        },
      ],
      internalNotes: [],
    };

    enquiries.unshift(newEnquiry);
    PlatformStore.saveEnquiries(enquiries);

    // Activity Log
    PlatformStore.addActivityLog({
      actor: data.clientName,
      role: "client",
      action: "Submitted Client Enquiry",
      entity: "Enquiry",
      entityId: id,
      entityName: `${data.eventType} with ${data.artistNameSnapshot}`,
      details: `Location: ${data.eventLocation}, Date: ${data.eventDate}`,
    });

    // Notify artist
    const artist = PlatformStore.getArtistById(data.artistId);
    if (artist) {
      PlatformStore.addNotification({
        userId: artist.userId,
        role: "artist",
        title: "New Enquiry Received",
        message: `${data.clientName} sent an enquiry for a ${data.eventType} in ${data.eventLocation} on ${data.eventDate}.`,
        type: "enquiry",
        link: "#artist/enquiries",
      });
    }

    // Notify admin
    PlatformStore.addNotification({
      userId: "user-admin-1",
      role: "admin",
      title: `New Enquiry ${id}`,
      message: `${data.clientName} enquired for artist ${data.artistNameSnapshot}.`,
      type: "enquiry",
      link: "#admin/enquiries",
    });

    return newEnquiry;
  }

  public static markEnquiryViewed(enquiryId: string, artistUser: User): ClientEnquiry {
    const list = PlatformStore.getEnquiries();
    const idx = list.findIndex((e) => e.id === enquiryId);
    if (idx === -1) throw new Error("Enquiry not found");

    const enquiry = list[idx];
    if (enquiry.status === "NEW") {
      enquiry.status = "VIEWED";
      enquiry.updatedAt = new Date().toISOString();
      enquiry.timeline.push({
        id: `tl-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: "Enquiry Viewed",
        description: `Artist ${artistUser.name} opened and reviewed the enquiry details.`,
        actor: artistUser.name,
        actorRole: "artist",
      });

      list[idx] = enquiry;
      PlatformStore.saveEnquiries(list);
    }
    return enquiry;
  }

  public static respondToEnquiry(
    enquiryId: string,
    response: {
      message: string;
      proposedFee?: string;
      availabilityStatus: "confirmed" | "alternative_date" | "unavailable";
      notes?: string;
    },
    artistUser: User
  ): ClientEnquiry {
    const list = PlatformStore.getEnquiries();
    const idx = list.findIndex((e) => e.id === enquiryId);
    if (idx === -1) throw new Error("Enquiry not found");

    const enquiry = list[idx];
    const now = new Date().toISOString();

    enquiry.status = "RESPONDED";
    enquiry.respondedAt = now;
    enquiry.updatedAt = now;
    enquiry.artistResponse = {
      ...response,
      respondedAt: now,
    };

    enquiry.timeline.push({
      id: `tl-${Date.now()}`,
      timestamp: now,
      action: "Artist Responded",
      description: `Artist ${artistUser.name} submitted availability: "${response.availabilityStatus}" with proposal${response.proposedFee ? ` (${response.proposedFee})` : ""}.`,
      actor: artistUser.name,
      actorRole: "artist",
    });

    list[idx] = enquiry;
    PlatformStore.saveEnquiries(list);

    // Record activity
    PlatformStore.addActivityLog({
      actor: artistUser.name,
      role: "artist",
      action: "Responded to Enquiry",
      entity: "Enquiry",
      entityId: enquiryId,
      entityName: `${enquiry.eventType} for ${enquiry.clientName}`,
      details: response.message.slice(0, 80),
    });

    // Notify client if registered
    if (enquiry.clientId) {
      PlatformStore.addNotification({
        userId: enquiry.clientId,
        role: "client",
        title: "Artist Responded to Your Enquiry",
        message: `${enquiry.artistNameSnapshot} has replied to enquiry ${enquiryId}. View their response now.`,
        type: "response",
        link: "#client/dashboard",
      });
    }

    return enquiry;
  }

  public static updateEnquiryStatus(
    enquiryId: string,
    status: EnquiryStatus,
    actorUser: User
  ): ClientEnquiry {
    const list = PlatformStore.getEnquiries();
    const idx = list.findIndex((e) => e.id === enquiryId);
    if (idx === -1) throw new Error("Enquiry not found");

    const enquiry = list[idx];
    const oldStatus = enquiry.status;
    enquiry.status = status;
    enquiry.updatedAt = new Date().toISOString();
    if (status === "CLOSED") {
      enquiry.closedAt = new Date().toISOString();
    }

    enquiry.timeline.push({
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: `Status Changed: ${status}`,
      description: `${actorUser.name} updated enquiry status from ${oldStatus} to ${status}.`,
      actor: actorUser.name,
      actorRole: actorUser.role,
    });

    list[idx] = enquiry;
    PlatformStore.saveEnquiries(list);

    PlatformStore.addActivityLog({
      actor: actorUser.name,
      role: actorUser.role,
      action: `Updated Enquiry Status to ${status}`,
      entity: "Enquiry",
      entityId: enquiryId,
      entityName: enquiry.artistNameSnapshot,
    });

    return enquiry;
  }

  public static addInternalAdminNote(
    enquiryId: string,
    note: string,
    adminUser: User
  ): ClientEnquiry {
    if (adminUser.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can add internal notes.");
    }
    const list = PlatformStore.getEnquiries();
    const idx = list.findIndex((e) => e.id === enquiryId);
    if (idx === -1) throw new Error("Enquiry not found");

    const enquiry = list[idx];
    if (!enquiry.internalNotes) enquiry.internalNotes = [];

    enquiry.internalNotes.push({
      id: `note-${Date.now()}`,
      note,
      author: adminUser.name,
      createdAt: new Date().toISOString(),
    });

    list[idx] = enquiry;
    PlatformStore.saveEnquiries(list);
    return enquiry;
  }

  // ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
  public static getNotifications(userId?: string): NotificationItem[] {
    let list: NotificationItem[] = [];
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (raw) {
        list = JSON.parse(raw);
      } else {
        list = SEED_NOTIFICATIONS;
        PlatformStore.saveNotifications(list);
      }
    } catch (e) {
      console.error("Error reading notifications", e);
      list = SEED_NOTIFICATIONS;
    }

    if (!userId) return list;
    return list.filter((n) => n.userId === userId);
  }

  public static saveNotifications(list: NotificationItem[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Error saving notifications", e);
    }
  }

  public static addNotification(
    n: Omit<NotificationItem, "id" | "createdAt" | "isRead">
  ): NotificationItem {
    const list = PlatformStore.getNotifications();
    const newNotif: NotificationItem = {
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newNotif);
    PlatformStore.saveNotifications(list);
    return newNotif;
  }

  public static markNotificationAsRead(id: string): void {
    const list = PlatformStore.getNotifications();
    const notif = list.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      PlatformStore.saveNotifications(list);
    }
  }

  public static markAllNotificationsAsRead(userId: string): void {
    const list = PlatformStore.getNotifications();
    list.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
    PlatformStore.saveNotifications(list);
  }

  // ─── ACTIVITY AUDIT LOG ───────────────────────────────────────────────────
  public static getActivityLogs(limit?: number): PlatformActivityLog[] {
    try {
      const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (raw) {
        const parsed: PlatformActivityLog[] = JSON.parse(raw);
        return limit ? parsed.slice(0, limit) : parsed;
      }
    } catch (e) {
      console.error("Error reading activity log", e);
    }
    const initial: PlatformActivityLog[] = [
      {
        id: "act-101",
        actor: "Mannat Sharma",
        actorName: "Mannat Sharma",
        role: "admin",
        action: "Published Artist Roster",
        entity: "Platform",
        entityId: "roster-v2",
        entityName: "Zakir Khan & Sufi Souls",
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        details: "Platform live discovery updated with verified artists.",
      },
      {
        id: "act-102",
        actor: "Kabir Sufi Ensemble",
        actorName: "Kabir Sufi Ensemble",
        role: "artist",
        action: "Submitted Artist Application",
        entity: "ArtistApplication",
        entityId: "artist-pending-1",
        entityName: "Kabir Sufi Ensemble",
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      },
    ];
    PlatformStore.saveActivityLogs(initial);
    return limit ? initial.slice(0, limit) : initial;
  }

  public static saveActivityLogs(logs: PlatformActivityLog[]): void {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error("Error saving activity logs", e);
    }
  }

  public static addActivityLog(
    log: Omit<PlatformActivityLog, "id" | "timestamp">
  ): PlatformActivityLog {
    const logs = PlatformStore.getActivityLogs();
    const newLog: PlatformActivityLog = {
      ...log,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    PlatformStore.saveActivityLogs(logs);
    return newLog;
  }
}
