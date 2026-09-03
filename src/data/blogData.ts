export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogContentSection {
  sectionHeading?: string;
  paragraphs: string[];
  quote?: {
    text: string;
    author: string;
  };
  checklist?: string[];
  proTip?: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "Wedding Music" | "Event Planning" | "Artist Spotlights" | "Sound & Acoustics" | "Heritage Traditions";
  categoryColor: string;
  readTime: string;
  publishedDate: string;
  views: number;
  initialLikes: number;
  coverImg: string;
  author: BlogAuthor;
  tags: string[];
  featured?: boolean;
  summary: string;
  keyTakeaways: string[];
  content: BlogContentSection[];
  relatedGenreId?: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";
  featuredArtistName?: string;
  featuredArtistTag?: string;
}

export const BLOG_CATEGORIES: Array<{ id: string; label: string; icon: string }> = [
  { id: "all", label: "All Stories", icon: "✨" },
  { id: "Wedding Music", label: "Wedding Music", icon: "💍" },
  { id: "Event Planning", label: "Event Planning", icon: "📋" },
  { id: "Artist Spotlights", label: "Artist Spotlights", icon: "🌟" },
  { id: "Sound & Acoustics", label: "Sound & Acoustics", icon: "🎛️" },
  { id: "Heritage Traditions", label: "Heritage Traditions", icon: "📜" },
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "blog-1",
    slug: "curating-the-ultimate-sangeet-live-band",
    title: "How to Curate the Ultimate Sangeet & Cocktail Night with Live Performers",
    subtitle: "A step-by-step masterclass on blending soulful acoustic sets with high-octane Bollywood dance anthems.",
    category: "Wedding Music",
    categoryColor: "#C4952A",
    readTime: "6 min read",
    publishedDate: "Feb 22, 2026",
    views: 3420,
    initialLikes: 184,
    coverImg: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format",
    featured: true,
    author: {
      name: "Roshni Malhotra",
      role: "Lead Wedding Experience Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format",
    },
    tags: ["Sangeet", "Live Band", "Bollywood", "Wedding Planning", "Cocktail Night"],
    summary: "From setting the opening mood with unplugged medleys to orchestrating a dance floor explosion, learn how top planners sequence live music for destination weddings.",
    keyTakeaways: [
      "Divide your evening into three distinct sonic phases: Sundowner Acoustic, Family Anthems, and Midnight Dancefloor.",
      "Always request a dedicated sound check at least 3 hours prior to guest arrival to avoid feedback issues.",
      "Provide the band with a 'Do-Not-Play' list alongside your favorite must-have family hits.",
      "Pair live percussionists (dhol, octapad, or darbuka) with your DJ for seamless transitions between band sets."
    ],
    content: [
      {
        sectionHeading: "Phase 1: The Sundowner Entrance & Warm Acoustic Prelude",
        paragraphs: [
          "The first 45 minutes of any Sangeet set the emotional temperature of the entire night. Rather than launching immediately into high-decibel party tracks, begin with warm, layered acoustic renditions of timeless Bollywood melodies and soulful Sufi standards.",
          "This gives arriving guests the space to converse, enjoy signature drinks, and appreciate live instrumentation like acoustic guitars, violin flourishes, and subtle cajon beats without shouting over the mix."
        ],
        quote: {
          text: "A great wedding performance is not about sheer volume; it is about emotional resonance that gradually pulls every generation onto their feet.",
          author: "Roshni Malhotra"
        },
        proTip: "Ask the band to prepare customized medley bridges between 90s nostalgia and trending tracks so grandparents and youngsters both feel included early on."
      },
      {
        sectionHeading: "Phase 2: Transitioning Into Interactive Family Performance Sets",
        paragraphs: [
          "When family performances commence, your live artists should act as the musical spine of the ceremony. Live brass or dhol accents during choreographies add an authentic stadium-like excitement that prerecorded playback tracks simply cannot match.",
          "Coordinate cue sheets with the band leader so they know exact stage entrance points and can add live vocal harmonies during the couple's spotlight dance."
        ],
        checklist: [
          "Share choreographers' exact track edits with the band sound engineer 48 hours in advance.",
          "Ensure wireless handheld microphones have fresh batteries and dedicated frequency channels.",
          "Position stage monitors so family dancers can hear the rhythm clearly without echo."
        ]
      },
      {
        sectionHeading: "Phase 3: The Midnight Dance Floor Takeover",
        paragraphs: [
          "After dinner, the band should shift into high-octane celebration mode. This is where 4-to-6 piece commercial bands shine: live drums, synth leads, and dual male/female vocalists creating an infectious carnival atmosphere.",
          "For maximum momentum, have the band transition into an overlapping 20-minute set with the DJ rather than creating an abrupt silence when changing acts."
        ]
      }
    ],
    relatedGenreId: "bollywood",
    featuredArtistName: "The Royal Rhythms Ensemble",
    featuredArtistTag: "Top Rated Wedding & Bollywood Troupe"
  },
  {
    id: "blog-2",
    slug: "sufi-and-qawwali-mehfil-staging-guide",
    title: "The Art of the Sufi Mehfil: Atmosphere, Seating & Sound Dynamics",
    subtitle: "How to craft a deeply spiritual, transcendent evening with authentic harmonium, tabla, and choral chants.",
    category: "Heritage Traditions",
    categoryColor: "#9A7219",
    readTime: "5 min read",
    publishedDate: "Feb 18, 2026",
    views: 2890,
    initialLikes: 142,
    coverImg: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=500&fit=crop&auto=format",
    featured: false,
    author: {
      name: "Ustad Tariq Nizami",
      role: "Classical Music Historian & Curator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
    },
    tags: ["Sufi", "Qawwali", "Mehfil", "Heritage", "Traditional Music"],
    summary: "Discover traditional floor-seating baithak arrangements, microphone placement for multiple vocalists, and lighting aesthetics that elevate Sufi and Qawwali evenings.",
    keyTakeaways: [
      "Low-floor baithak seating with bolsters creates an intimate connection between qawwals and the audience.",
      "Use condenser boundary microphones for group clappers and dedicated dynamic mics for lead and co-singers.",
      "Warm amber (2700K) lighting with gentle lantern motifs enhances the meditative ambiance."
    ],
    content: [
      {
        sectionHeading: "Designing the Baithak: Closeness & Reverence",
        paragraphs: [
          "Unlike Western concert staging with elevated barriers, a Sufi Mehfil flourishes on proximity. The traditional low stage (chawki or takht) draped in pristine white cotton sheets and bordered by plush marigold cushions allows the energy of clapping and vocal improvisation to reverberate directly across the room.",
          "Leaving a central aisle open allows listeners to approach and appreciate the poetical verses (kalam) with heartfelt nods and traditional dad (acclaim)."
        ],
        quote: {
          text: "When the harmonium droning begins and the chorus joins in unison, space collapses and everyone becomes part of the song.",
          author: "Ustad Tariq Nizami"
        }
      },
      {
        sectionHeading: "Acoustic Clarity for Intricate Poetry",
        paragraphs: [
          "In Qawwali and Ghazal, lyricism is paramount. If consonants get lost in room reverb, the poetry loses its emotional impact. Opt for directional vocal mics with high gain-before-feedback to capture both delicate whispers and soaring crescendos."
        ],
        proTip: "Request carpets on hardwood or marble floors to naturally dampen harsh acoustic reflections and warm up the harmonium bass tones."
      }
    ],
    relatedGenreId: "sufi",
    featuredArtistName: "Zakir Khan & Sufi Souls",
    featuredArtistTag: "Celebrated Qawwali Troupe"
  },
  {
    id: "blog-3",
    slug: "rock-band-tech-rider-demystified",
    title: "Rock Band Tech Riders Demystified: What Every College & Corporate Planner Must Know",
    subtitle: "A practical breakdown of stage plots, IEMs, drum miking, and power requirements for live rock concerts.",
    category: "Sound & Acoustics",
    categoryColor: "#4C0519",
    readTime: "7 min read",
    publishedDate: "Feb 14, 2026",
    views: 2150,
    initialLikes: 98,
    coverImg: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&h=500&fit=crop&auto=format",
    featured: false,
    author: {
      name: "Arjun Dev",
      role: "Concert Audio Engineer & Tour Manager",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format",
    },
    tags: ["Rock Concert", "Tech Rider", "Stage Audio", "College Fest", "Live Production"],
    summary: "Demystify complex technical requirements: understand why stage plots matter, how to calculate amplifier power, and how to prevent blown fuses during campus festivals.",
    keyTakeaways: [
      "Never compromise on clean, isolated 3-phase power supply for high-gain guitar rigs.",
      "In-Ear Monitors (IEMs) dramatically reduce stage noise and eliminate microphone feedback loops.",
      "Schedule a minimum of 90 minutes for full line checks and drummer balance before gates open."
    ],
    content: [
      {
        sectionHeading: "Why the Tech Rider is a Contract for Sonic Quality",
        paragraphs: [
          "When a rock band submits a technical rider, it isn't an arbitrary wishlist; it represents the precise electrical and acoustic specifications needed for their signature sound. Substandard DI boxes or mismatched speaker impedance can turn heavy riffs into muddy noise.",
          "Understanding channel inputs—such as dual drum overheads, bass direct lines, and stereo guitar simulation—ensures your local audio rental company delivers exact gear without last-minute panic."
        ],
        checklist: [
          "Confirm dedicated 63A 3-phase sound distribution board separated from heavy lighting dimmers.",
          "Verify minimum 4 independent auxiliary monitor sends for musicians.",
          "Prepare spare guitar patch cables and 9V battery packs for pedals."
        ]
      },
      {
        sectionHeading: "Managing Stage Volume vs. Audience Experience",
        paragraphs: [
          "Modern touring bands prefer digital consoles and in-ear wireless packs. By keeping amplifier spill low on stage, front-of-house sound engineers can dial in a crystal-clear mix for 5,000+ festival goers without hurting front-row ears."
        ]
      }
    ],
    relatedGenreId: "rock",
    featuredArtistName: "Highway Pulse",
    featuredArtistTag: "Indie-Rock & Fusion Headliners"
  },
  {
    id: "blog-4",
    slug: "budgeting-for-live-performers-transparent-guide",
    title: "The Transparent Guide to Artist Pricing: How Budgets are Built",
    subtitle: "Learn where your booking fee goes: rehearsals, travel logistics, sound production, and entourage management.",
    category: "Event Planning",
    categoryColor: "#C4952A",
    readTime: "5 min read",
    publishedDate: "Feb 10, 2026",
    views: 4120,
    initialLikes: 215,
    coverImg: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=500&fit=crop&auto=format",
    featured: false,
    author: {
      name: "Meera Krishnan",
      role: "Director of Artist Relations",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&auto=format",
    },
    tags: ["Artist Pricing", "Budgeting", "Event Management", "Contracts", "Corporate Events"],
    summary: "Understand what influences artist rates across cities, peak festival seasons, and ensemble sizes, ensuring you get maximum value for your event investment.",
    keyTakeaways: [
      "Peak dates (November to February wedding season) command a 20-30% premium; book 3-5 months early.",
      "Solo & Duo acts offer high emotional impact at lower logistical and travel costs.",
      "StageBridge verified digital contracts protect your deposit in escrow until successful completion."
    ],
    content: [
      {
        sectionHeading: "Breaking Down the Booking Quote",
        paragraphs: [
          "When you review a quote on StageBridge, the price reflects more than just the 90 minutes of stage time. It encompasses days of tailored rehearsal, custom lyric arrangements, professional sound equipment transport, and tour management.",
          "Our transparent pricing calculator eliminates hidden agency markups, giving you clear visibility into travel allowances, hotel riders, and performance fees."
        ],
        quote: {
          text: "Transparency builds trust. When event hosts and artists agree on clear deliverables upfront, the performance always exceeds expectations.",
          author: "Meera Krishnan"
        }
      }
    ],
    relatedGenreId: "gazal",
    featuredArtistName: "Mahesh Pandit & Strings",
    featuredArtistTag: "Gazal Virtuoso & Classical Ensemble"
  },
  {
    id: "blog-5",
    slug: "carnival-and-street-performers-interactive-events",
    title: "Bringing Magic to Fairs & Festivals: The Power of Interactive Carnival Artists",
    subtitle: "From fire jugglers and stilt walkers to unicyclists and aerialists: how visual arts supercharge crowd engagement.",
    category: "Artist Spotlights",
    categoryColor: "#DDB96A",
    readTime: "4 min read",
    publishedDate: "Feb 05, 2026",
    views: 1890,
    initialLikes: 112,
    coverImg: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop&auto=format",
    featured: false,
    author: {
      name: "Sameer Varma",
      role: "Carnival & Street Spectacle Director",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&auto=format",
    },
    tags: ["Carnival", "Circus Acts", "Interactive Arts", "Mall Events", "Street Fair"],
    summary: "Discover how roaming visual performers,LED light artists, and acrobats transform standard shopping centers, campus yards, and outdoor expos into viral photo sensations.",
    keyTakeaways: [
      "Stilt walkers and LED wing dancers create immediate 360-degree photo-op moments for guests.",
      "Safety perimeters and non-flammable flooring are non-negotiable for fire arts shows.",
      "Stagger roving acts every 45 minutes to maintain sustained crowd momentum throughout the day."
    ],
    content: [
      {
        sectionHeading: "The Magic of Roving Visual Performance",
        paragraphs: [
          "Unlike static stage acts, carnival artists roam directly through the crowd. This immersive proximity breaks the fourth wall, turning passive spectators into enthusiastic participants who record and share moments across Instagram and TikTok."
        ],
        proTip: "Pair carnival jugglers and unicyclists with vibrant upbeat background brass tracks to create a buoyant European street festival energy."
      }
    ],
    relatedGenreId: "carnival",
    featuredArtistName: "The Spectrum Circus Troupe",
    featuredArtistTag: "World Class Carnival Acts"
  },
  {
    id: "blog-6",
    slug: "spiritual-ambiance-devotional-satsangs",
    title: "Creating Serenity: Organizing High-Impact Devotional Bhajans & Kirtans",
    subtitle: "Balancing traditional bhakti instruments like dholak, harmonium, and flute with serene outdoor soundscapes.",
    category: "Heritage Traditions",
    categoryColor: "#9A7219",
    readTime: "5 min read",
    publishedDate: "Jan 28, 2026",
    views: 2470,
    initialLikes: 165,
    coverImg: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=500&fit=crop&auto=format",
    featured: false,
    author: {
      name: "Pandit Ramkishan Sharma",
      role: "Devotional Music Researcher",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&auto=format",
    },
    tags: ["Devotional", "Bhajan", "Kirtan", "Satsang", "Spiritual Music"],
    summary: "A heartfelt guide on acoustic balance, floral mandap aesthetics, and collective chorus participation for sacred festivals, Mata ki Chowkis, and morning satsangs.",
    keyTakeaways: [
      "Use high-quality omnidirectional chorus mics so devotees in attendance can sing along effortlessly.",
      "Incorporate aromatic elements like sandalwood and fresh mogra to complement the auditory peace.",
      "Ensure comfortable seating for elderly devotees with backrest options near the central stage."
    ],
    content: [
      {
        sectionHeading: "The Spiritual Architecture of a Kirtan",
        paragraphs: [
          "A successful devotional evening is defined by collective peace (shanti) and upliftment. The musical progression typically moves from slow, soulful meditative prayers to rhythmic, ecstatic clapping and chorus chants that unite every participant in bliss."
        ]
      }
    ],
    relatedGenreId: "devotional",
    featuredArtistName: "Ananya Sharma Bhakti Dhara",
    featuredArtistTag: "Satsang & Bhajan Virtuoso"
  }
];

export const QUICK_EVENT_TIPS = [
  {
    icon: "⏱️",
    title: "The 3-Hour Soundcheck Rule",
    tip: "Never schedule artist soundchecks within 60 minutes of guest arrival. Professional line checks require quiet room acoustics.",
    category: "Stage Management"
  },
  {
    icon: "🔌",
    title: "Isolate Audio from Heavy Lighting",
    tip: "Always request a dedicated circuit breaker for sound gear to prevent high-pitch buzz and hum caused by LED dimmers.",
    category: "Audio Tech"
  },
  {
    icon: "📜",
    title: "The 'Do-Not-Play' List Advantage",
    tip: "Giving performers a 5-song exclusion list is even more effective than a 30-song wishlist for curating your exact party vibe.",
    category: "Music Curation"
  },
  {
    icon: "🚰",
    title: "Green Room Hospitality Checklist",
    tip: "Keep room-temperature water, herbal teas with honey, and quiet dressing areas ready for singers 1 hour prior to call time.",
    category: "Artist Hospitality"
  }
];
