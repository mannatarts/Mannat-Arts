export interface Artist {
  id: string;
  name: string;
  stageName?: string;
  genre: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";
  genreTitle: string;
  tagline: string;
  bio: string;
  img: string;
  rating: number;
  reviewsCount: number;
  price: string;
  priceNum: number;
  city: string;
  state: string;
  travelsPanIndia: boolean;
  travelsInternational?: boolean;
  performanceDuration: string;
  bandType: "Solo" | "Duo" | "Trio" | "4-6 Piece Band" | "Full Troupe (8+ Members)";
  experienceYears: number;
  eventsCompleted: number;
  primaryInstruments: string[];
  themeColor: string;
  
  // "What this artist also does" - Multi-talented versatility
  whatElseTheyDo: {
    category: string;
    description: string;
    icon: string;
  }[];

  sampleSetlist: string[];
  sampleTracks: {
    title: string;
    duration: string;
    type: string;
  }[];
  techRider: string[];
  reviews: {
    author: string;
    event: string;
    city: string;
    comment: string;
    rating: number;
  }[];
}

export interface GenreVisualElement {
  title: string;
  badge: string;
  icon: string;
  img: string;
  sub: string;
}

export interface GenreInfo {
  id: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional";
  title: string;
  tag: string;
  icon: string;
  description: string;
  longDescription: string;
  heroImg: string;
  accent: string;
  popularOccasions: string[];
  avgPriceRange: string;
  
  // Rich genre-specific atmosphere and color vibe
  vibe: {
    bgGradient: string;
    radialGlow1: string;
    radialGlow2: string;
    badgeBorder: string;
    badgeBg: string;
    badgeText: string;
    highlightColor: string;
    cardAccent: string;
    btnGradient: string;
  };

  // Authentic instruments, traditions & stage elements
  elements: {
    instruments: Array<{ name: string; icon: string; role: string }>;
    traditions: Array<{ name: string; icon: string }>;
    stageVibe: string;
    soundSetup: string;
  };

  // Multi-element visual collage for unorganized decorative 3D/2D montage
  visualMontage: {
    mainVisual: GenreVisualElement;
    topFloating: GenreVisualElement;
    bottomFloating: GenreVisualElement;
    badge1: { label: string; icon: string; highlight: string };
    badge2: { label: string; icon: string; highlight: string };
  };
}

export const GENRE_METADATA: Record<string, GenreInfo> = {
  sufi: {
    id: "sufi",
    title: "Sufi",
    tag: "Mystic & Qawwali",
    icon: "🕊️",
    description: "Mystic poetry, qawwalis & soulful spiritual trance",
    longDescription: "Immerse your guests in centuries of divine ecstasy, mystic poetry, and high-energy acoustic qawwalis. Our Sufi artists blend traditional harmonium and tabla with modern acoustic and progressive arrangements.",
    heroImg: "/genres/sufi.jpg",
    accent: "#C4952A",
    popularOccasions: ["Sufi Nights", "Wedding Sangeet", "Cultural Festivals", "Intimate Baithaks", "Corporate Galas"],
    avgPriceRange: "₹35,000 – ₹2,50,000",
    vibe: {
      bgGradient: "linear-gradient(135deg, #1A1400 0%, #2A1E00 25%, #3A2800 50%, #6B4A00 80%, #0D0C00 100%)",
      radialGlow1: "rgba(196, 149, 42, 0.40)",
      radialGlow2: "rgba(221, 185, 106, 0.32)",
      badgeBorder: "border-[#C4952A]/50",
      badgeBg: "bg-[#C4952A]/25",
      badgeText: "text-[#DDB96A]",
      highlightColor: "#DDB96A",
      cardAccent: "#C4952A",
      btnGradient: "from-[#C4952A] via-[#DDB96A] to-[#9A7219]",
    },
    elements: {
      instruments: [
        { name: "Harmonium", icon: "🪗", role: "Melody & Taans" },
        { name: "Dholak & Tabla", icon: "🥁", role: "Trance Beats" },
        { name: "Bulbul Tarang", icon: "🪕", role: "String Ornament" },
        { name: "Acoustic Banjo", icon: "🎸", role: "Folk Harmonies" },
      ],
      traditions: [
        { name: "Amir Khusro Kalam", icon: "📜" },
        { name: "Whirling Sama", icon: "🕊️" },
        { name: "Brass Lantern Aura", icon: "🏮" },
        { name: "Intimate Baithak", icon: "🕯️" },
      ],
      stageVibe: "Mystic Candlelit Dargah Ambiance & Soaring Vocal Chorus",
      soundSetup: "Full Acoustic Stage • 6-8 Piece Ensemble • Live Clapping Percussion",
    },
    visualMontage: {
      mainVisual: {
        title: "Soulful Qawwali Ensemble",
        badge: "Live Dargah Stage",
        icon: "🕊️",
        img: "/genres/sufi.jpg",
        sub: "Khwaja & Bulleh Shah Kalams",
      },
      topFloating: {
        title: "Acoustic Harmonium",
        badge: "Lead Melody",
        icon: "🪗",
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=400&fit=crop&auto=format",
        sub: "Handcrafted Teak & Brass",
      },
      bottomFloating: {
        title: "Dholak & Tabla",
        badge: "Trance Beats",
        icon: "🥁",
        img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=400&fit=crop&auto=format",
        sub: "High-Energy Dhamal Beats",
      },
      badge1: { label: "Candlelit Lantern Aura", icon: "🏮", highlight: "Mystic Glow" },
      badge2: { label: "Whirling Sama & Ecstasy", icon: "✨", highlight: "Divine Trance" },
    },
  },
  rock: {
    id: "rock",
    title: "Rock",
    tag: "Live & Indie Bands",
    icon: "🎸",
    description: "Electrifying riffs, vocals & high-octane indie live sets",
    longDescription: "From heart-pounding classic Hindi rock anthems to soulful indie ballads and hard-rock mashups, our rock bands bring stadium-grade energy, blistering guitar solos, and infectious stage presence to every stage.",
    heroImg: "/genres/rock.jpg",
    accent: "#C4952A",
    popularOccasions: ["College Fests", "Cocktail Parties", "Music Festivals", "Corporate Annual Meets", "Destination Weddings"],
    avgPriceRange: "₹45,000 – ₹3,50,000",
    vibe: {
      bgGradient: "linear-gradient(135deg, #1A1400 0%, #2A1E00 25%, #3A2800 50%, #6B4A00 80%, #0D0C00 100%)",
      radialGlow1: "rgba(196, 149, 42, 0.40)",
      radialGlow2: "rgba(221, 185, 106, 0.32)",
      badgeBorder: "border-[#C4952A]/50",
      badgeBg: "bg-[#C4952A]/25",
      badgeText: "text-[#DDB96A]",
      highlightColor: "#DDB96A",
      cardAccent: "#C4952A",
      btnGradient: "from-[#C4952A] via-[#DDB96A] to-[#9A7219]",
    },
    elements: {
      instruments: [
        { name: "Electric Lead Guitar", icon: "🎸", role: "Distortion Riffs" },
        { name: "Bass Guitar", icon: "🎸", role: "Low-end Groove" },
        { name: "Acoustic Drum Kit", icon: "🥁", role: "Heavy Backbeats" },
        { name: "Synthesizers", icon: "🎹", role: "Prog Layers" },
      ],
      traditions: [
        { name: "Marshall Amp Stacks", icon: "🔊" },
        { name: "Concert Lasers & Smoke", icon: "⚡" },
        { name: "Wireless Stage Mics", icon: "🎙️" },
        { name: "Stadium Anthems", icon: "🔥" },
      ],
      stageVibe: "High-Voltage Stadium Concert with Pyrotechnic Visuals",
      soundSetup: "4-6 Piece Band • Stereo Line Array • Dynamic Stage Lighting Sync",
    },
    visualMontage: {
      mainVisual: {
        title: "Arena Rock Concert",
        badge: "Lead Guitarist",
        icon: "🎸",
        img: "/genres/rock.jpg",
        sub: "High-Voltage Stadium Anthems",
      },
      topFloating: {
        title: "Electric Guitar Riffs",
        badge: "Distortion Solo",
        icon: "⚡",
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=400&fit=crop&auto=format",
        sub: "Vintage Sunburst & Pedals",
      },
      bottomFloating: {
        title: "Marshall Amp Stacks",
        badge: "100W Tube Power",
        icon: "🔊",
        img: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=500&h=400&fit=crop&auto=format",
        sub: "Stage Speaker Wall",
      },
      badge1: { label: "Shure SM58 Live Vocal Mic", icon: "🎙️", highlight: "High Gain" },
      badge2: { label: "Concert Lasers & Smoke", icon: "🔥", highlight: "Arena Pyro" },
    },
  },
  gazal: {
    id: "gazal",
    title: "Gazal",
    tag: "Mehfil & Poetry",
    icon: "📜",
    description: "Soulful shayaris, harmonium & acoustic nostalgia",
    longDescription: "Rediscover the timeless elegance of classic poetry, exquisite shayaris, and delicate harmonium-sarangi melodies. Perfect for connoisseurs of authentic Urdu literature and vintage acoustic harmony.",
    heroImg: "/genres/gazal.jpg",
    accent: "#C4952A",
    popularOccasions: ["Ghazal Mehfils", "Private Anniversaries", "VIP Corporate Lounges", "Literary Gatherings", "Pre-Wedding Dinners"],
    avgPriceRange: "₹30,000 – ₹1,80,000",
    vibe: {
      bgGradient: "linear-gradient(135deg, #1A1400 0%, #2A1E00 25%, #3A2800 50%, #6B4A00 80%, #0D0C00 100%)",
      radialGlow1: "rgba(196, 149, 42, 0.40)",
      radialGlow2: "rgba(221, 185, 106, 0.32)",
      badgeBorder: "border-[#C4952A]/50",
      badgeBg: "bg-[#C4952A]/25",
      badgeText: "text-[#DDB96A]",
      highlightColor: "#DDB96A",
      cardAccent: "#C4952A",
      btnGradient: "from-[#C4952A] via-[#DDB96A] to-[#9A7219]",
    },
    elements: {
      instruments: [
        { name: "Classical Sarangi", icon: "🎻", role: "Vocal Accompaniment" },
        { name: "Concert Harmonium", icon: "🪗", role: "Acoustic Melody" },
        { name: "Bayan-Dayan Tabla", icon: "🥁", role: "Vilambit Thekas" },
        { name: "Swarmandal", icon: "✨", role: "Drone Textures" },
      ],
      traditions: [
        { name: "Ghalib & Faiz Shayaris", icon: "📜" },
        { name: "Vintage Shure 55 Mic", icon: "🎙️" },
        { name: "Candlelit Baithak", icon: "🕯️" },
        { name: "Dastangoi Couplets", icon: "🌹" },
      ],
      stageVibe: "Warm Amber Acoustic Baithak with Royal Persian Rugs",
      soundSetup: "Acoustic Vocal Mic • Velvet Reverb • Live Audience Interactive Mehfil",
    },
    visualMontage: {
      mainVisual: {
        title: "Classical Ghazal Mehfil",
        badge: "Acoustic Baithak",
        icon: "📜",
        img: "/genres/gazal.jpg",
        sub: "Ghalib & Faiz Urdu Couplets",
      },
      topFloating: {
        title: "Vintage Shure 55 Mic",
        badge: "Iconic Chrome",
        icon: "🎙️",
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=400&fit=crop&auto=format",
        sub: "Warm Candlelit Golden Bokeh",
      },
      bottomFloating: {
        title: "Classical Sarangi",
        badge: "Acoustic Strings",
        icon: "🎻",
        img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=400&fit=crop&auto=format",
        sub: "Soul-Stirring Classical Sur",
      },
      badge1: { label: "Rose Petals & Candelabras", icon: "🕯️", highlight: "Mahogany Warmth" },
      badge2: { label: "Vilambit Tabla Theka", icon: "🥁", highlight: "Bayan-Dayan" },
    },
  },
  bollywood: {
    id: "bollywood",
    title: "Bollywood",
    tag: "Chartbusters & Hits",
    icon: "🎬",
    description: "High-energy playback, chartbusters & dance anthems",
    longDescription: "Bring the magic of the silver screen to life! Our Bollywood performers and live soundstages deliver non-stop chartbusters, dance mashups, retro classics, and electrifying crowd-pleasers that keep guests dancing all night.",
    heroImg: "/genres/bollywood.jpg",
    accent: "#C4952A",
    popularOccasions: ["Wedding Sangeet", "Award Nights", "Product Launches", "Grand Anniversaries", "Festival Mega Stages"],
    avgPriceRange: "₹50,000 – ₹5,00,000",
    vibe: {
      bgGradient: "linear-gradient(135deg, #1A1400 0%, #2A1E00 25%, #3A2800 50%, #6B4A00 80%, #0D0C00 100%)",
      radialGlow1: "rgba(196, 149, 42, 0.40)",
      radialGlow2: "rgba(221, 185, 106, 0.32)",
      badgeBorder: "border-[#C4952A]/50",
      badgeBg: "bg-[#C4952A]/25",
      badgeText: "text-[#DDB96A]",
      highlightColor: "#DDB96A",
      cardAccent: "#C4952A",
      btnGradient: "from-[#C4952A] via-[#DDB96A] to-[#9A7219]",
    },
    elements: {
      instruments: [
        { name: "Playback Vocals", icon: "🎶", role: "Male & Female Duets" },
        { name: "Live Brass Section", icon: "🎺", role: "Chartbuster Horns" },
        { name: "Octapad & Percussion", icon: "🥁", role: "Dancefloor Beats" },
        { name: "Keyboards & Synth", icon: "🎹", role: "Orchestra Medleys" },
      ],
      traditions: [
        { name: "Cold Pyro Sparklers", icon: "🎆" },
        { name: "Cinema Retro Mashups", icon: "🎬" },
        { name: "Backup Dancers Sync", icon: "💃" },
        { name: "Grand Stage Lighting", icon: "🌟" },
      ],
      stageVibe: "Award-Show Silver Screen Glamour with LED Wall Backdrops",
      soundSetup: "Multi-Track Playback • Wireless In-Ear Monitors • Dancefloor DJ Fusion",
    },
    visualMontage: {
      mainVisual: {
        title: "Grand Bollywood Concert",
        badge: "Playback Stage",
        icon: "🎬",
        img: "/genres/bollywood.jpg",
        sub: "Blockbuster Choreography & Arena",
      },
      topFloating: {
        title: "Cinema Clapper & Reels",
        badge: "Film Magic",
        icon: "🎥",
        img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=400&fit=crop&auto=format",
        sub: "Silver Screen Nostalgia",
      },
      bottomFloating: {
        title: "Golden Award Trophies",
        badge: "Star Glamour",
        icon: "🏆",
        img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=400&fit=crop&auto=format",
        sub: "Sparklers & Golden Confetti",
      },
      badge1: { label: "Cold Pyro Sparklers", icon: "🎆", highlight: "Stage Blast" },
      badge2: { label: "Octapad Dance Beats", icon: "🥁", highlight: "Club Remix" },
    },
  },
  carnival: {
    id: "carnival",
    title: "Carnival",
    tag: "Circus & Street Fairs",
    icon: "🎡",
    description: "Acrobats, fire performers, circus & festive beats",
    longDescription: "Turn your event into a world of wonder! Spectacular fire breathers, aerial acrobats, stilt walkers, interactive mimes, and roaming percussion troupes that dazzle guests of all ages.",
    heroImg: "/genres/carnival.jpg",
    accent: "#C4952A",
    popularOccasions: ["Carnival Melas", "Theme Park Fairs", "Community Celebrations", "Grand Entrances", "Resort Festivals"],
    avgPriceRange: "₹40,000 – ₹2,80,000",
    vibe: {
      bgGradient: "linear-gradient(135deg, #1A1400 0%, #2A1E00 25%, #3A2800 50%, #6B4A00 80%, #0D0C00 100%)",
      radialGlow1: "rgba(196, 149, 42, 0.40)",
      radialGlow2: "rgba(221, 185, 106, 0.32)",
      badgeBorder: "border-[#C4952A]/50",
      badgeBg: "bg-[#C4952A]/25",
      badgeText: "text-[#DDB96A]",
      highlightColor: "#DDB96A",
      cardAccent: "#C4952A",
      btnGradient: "from-[#C4952A] via-[#DDB96A] to-[#9A7219]",
    },
    elements: {
      instruments: [
        { name: "Fire Poi & Torches", icon: "🔥", role: "Sparks & Eating" },
        { name: "Aerial Silk & Hoops", icon: "🎪", role: "Acrobatic Drops" },
        { name: "LED Stilt Walkers", icon: "🎭", role: "Giant Costumes" },
        { name: "Djembe & Samba Drums", icon: "🪘", role: "Roaming Rhythms" },
      ],
      traditions: [
        { name: "Venetian Masks", icon: "🎭" },
        { name: "Pixel Poi LED Shows", icon: "✨" },
        { name: "Confetti Cannons", icon: "🎉" },
        { name: "Street Mela Parade", icon: "🎪" },
      ],
      stageVibe: "Electrifying 360° Street Mela with Night Fireworks Atmosphere",
      soundSetup: "High-Impact Roaming Percussion • Safety Fire Gear • Mobile LED Light Rigs",
    },
    visualMontage: {
      mainVisual: {
        title: "Night Street Carnival Mela",
        badge: "Circus Spectacle",
        icon: "🎡",
        img: "/genres/carnival.jpg",
        sub: "Fire Dancers & Stilt Performers",
      },
      topFloating: {
        title: "Swirling Fire Torches",
        badge: "Fire Breathing",
        icon: "🔥",
        img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=400&fit=crop&auto=format",
        sub: "Flames & Blazing Embers",
      },
      bottomFloating: {
        title: "Masquerade Feather Mask",
        badge: "Venetian Gala",
        icon: "🎭",
        img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=400&fit=crop&auto=format",
        sub: "Jeweled Feathers & Gold",
      },
      badge1: { label: "Aerial Silk & Hoop Drops", icon: "🎪", highlight: "Acrobatics" },
      badge2: { label: "Samba Drums & Confetti", icon: "🪘", highlight: "360° Parade" },
    },
  },
  devotional: {
    id: "devotional",
    title: "Devotional",
    tag: "Bhajans & Kirtans",
    icon: "🪔",
    description: "Sacred bhajans, kirtans & temple symphonies",
    longDescription: "Elevate your spiritual gatherings with blissful bhajans, Vedic mantra chanting, ecstatic kirtans, and soul-stirring devotional music led by authentic, dedicated vocalists and master instrumentalists.",
    heroImg: "/genres/devotional.jpg",
    accent: "#C4952A",
    popularOccasions: ["Mata Ki Chowki", "Sundarkand Recitals", "Temple Festivals", "Housewarming & Griha Pravesh", "Bhakti Sandhyas"],
    avgPriceRange: "₹20,000 – ₹1,50,000",
    vibe: {
      bgGradient: "linear-gradient(135deg, #1A1400 0%, #2A1E00 25%, #3A2800 50%, #6B4A00 80%, #0D0C00 100%)",
      radialGlow1: "rgba(196, 149, 42, 0.40)",
      radialGlow2: "rgba(221, 185, 106, 0.32)",
      badgeBorder: "border-[#C4952A]/50",
      badgeBg: "bg-[#C4952A]/25",
      badgeText: "text-[#DDB96A]",
      highlightColor: "#DDB96A",
      cardAccent: "#C4952A",
      btnGradient: "from-[#C4952A] via-[#DDB96A] to-[#9A7219]",
    },
    elements: {
      instruments: [
        { name: "Sacred Brass Dholak", icon: "🥁", role: "Devotional Chhand" },
        { name: "Temple Manjira & Kartal", icon: "🔔", role: "Auspicious Rhythms" },
        { name: "Classic Harmonium", icon: "🪗", role: "Raga Bhakti Sur" },
        { name: "Vedic Shankh (Conch)", icon: "🐚", role: "Divine Invocations" },
      ],
      traditions: [
        { name: "Mantra Chanting", icon: "🕉️" },
        { name: "Multi-Tier Aarti Diya", icon: "🪔" },
        { name: "Fresh Marigold Mala", icon: "🌼" },
        { name: "Mata Ki Chowki", icon: "🚩" },
      ],
      stageVibe: "Sacred Sanctum with Glowing Brass Diyas & Sandalwood Incense",
      soundSetup: "Warm Temple Acoustics • Chanting Microphones • Congregational Sound Setup",
    },
    visualMontage: {
      mainVisual: {
        title: "Sacred Bhajan Sandhya",
        badge: "Temple Mandap",
        icon: "🪔",
        img: "/genres/devotional.jpg",
        sub: "Divine Kirtan & Aarti Chants",
      },
      topFloating: {
        title: "Multi-Tier Brass Diya",
        badge: "Sacred Aarti",
        icon: "🔥",
        img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&h=400&fit=crop&auto=format",
        sub: "108 Golden Sacred Flames",
      },
      bottomFloating: {
        title: "Sacred Brass Dholak",
        badge: "Bhakti Rhythm",
        icon: "🥁",
        img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&h=400&fit=crop&auto=format",
        sub: "Traditional Temple Beats",
      },
      badge1: { label: "Temple Bells & Shankh", icon: "🔔", highlight: "Vedic Chants" },
      badge2: { label: "Marigold Mala Garland", icon: "🌼", highlight: "Sacred Flora" },
    },
  },
};

export const ALL_ARTISTS: Artist[] = [
  /* ── SUFI ARTISTS ─────────────────────────────────────────────── */
  {
    id: "sufi-1",
    name: "Ustad Kabir Ali & Ensemble",
    stageName: "Kabir Sufi Qawwals",
    genre: "sufi",
    genreTitle: "Sufi & Qawwali Ensemble",
    tagline: "7-piece traditional Qawwali troupe celebrated for electrifying mystic ecstasies.",
    bio: "Ustad Kabir Ali comes from a 4-generation lineage of Dargah qawwals. Blending timeless kalam of Bulleh Shah, Rumi, and Amir Khusro with vibrant vocal harmonies and soaring taans, their live sets build from soothing spiritual intros to euphoric trance peaks.",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=650&h=500&fit=crop&auto=format",
    rating: 4.9,
    reviewsCount: 184,
    price: "₹55,000",
    priceNum: 55000,
    city: "Delhi",
    state: "Delhi NCR",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "120 - 180 mins",
    bandType: "Full Troupe (8+ Members)",
    experienceYears: 14,
    eventsCompleted: 420,
    primaryInstruments: ["Harmonium", "Tabla", "Dholak", "Bulbul Tarang"],
    themeColor: "#6B4A00",
    whatElseTheyDo: [
      {
        category: "🎸 Sufi-Rock Fusion",
        description: "Layers acoustic sarangi with electric bass & drums for high-energy youth fests & college stages.",
        icon: "🎸",
      },
      {
        category: "📜 Ghazal & Nazm Recitals",
        description: "Conducts delicate, acoustic mehfil sessions of Ghalib & Faiz for intimate VIP dinners.",
        icon: "📜",
      },
      {
        category: "💍 Wedding Sufi Night Specials",
        description: "Curated romantic qawwalis (Mast Qalandar, Chaap Tilak, Rashk-e-Qamar) tailored for Sangeets.",
        icon: "💍",
      },
      {
        category: "🪔 Spiritual Devotional Chants",
        description: "Delivers non-denominational mystic hymns and peaceful meditation soundscapes.",
        icon: "🪔",
      },
    ],
    sampleSetlist: [
      "Dama Dum Mast Qalandar (Grand Extended Version)",
      "Chaap Tilak Sab Chheeni (Classic Baithak Style)",
      "Rashk-e-Qamar (Sufi Romance Rework)",
      "Nit Khair Manga (Sufi Folk Trance)",
      "Kun Faya Kun (Devotional Symphony)",
    ],
    sampleTracks: [
      { title: "Mast Qalandar Live at Jaipur Palace", duration: "11:42", type: "Live Qawwali" },
      { title: "Chaap Tilak Baithak Session", duration: "8:15", type: "Classical Kalam" },
      { title: "Sufi Fusion Sunset Jam", duration: "6:30", type: "Progressive Fusion" },
    ],
    techRider: ["5 Vocal Microphones (Shure SM58)", "2 Instrument Mics (Shure SM57)", "DI Box for Harmonium", "Stage Monitors (Stereo Pair)"],
    reviews: [
      { author: "Zaid Farooqui", event: "Destination Wedding Sufi Night", city: "Udaipur", comment: "Kabir Ali and his ensemble set the entire lawn on fire! 400 guests were singing and clapping for 2.5 hours non-stop. Extraordinary talent.", rating: 5 },
      { author: "Pooja Singhania", event: "Corporate Gala Dinner", city: "Gurugram", comment: "The transition from classical poetry into high-energy Qawwali left our executive guests stunned. Highest recommendation.", rating: 5 },
    ],
  },
  {
    id: "sufi-2",
    name: "Noorani Sufi Troupe",
    stageName: "Noor Sisters Project",
    genre: "sufi",
    genreTitle: "Contemporary Female Sufi Duo",
    tagline: "Soulful vocal harmonies, live rabab, and mesmerizing dervish whirl performances.",
    bio: "The Noor Sisters have redefined the sufi stage across India and the Middle East. Known for powerful vocal delivery, emotive interpretations of Punjabi mystic poetry, and accompanied by live Whirling Dervish dancers in traditional robes.",
    img: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=650&h=500&fit=crop&auto=format",
    rating: 5.0,
    reviewsCount: 126,
    price: "₹48,000",
    priceNum: 48000,
    city: "Jaipur",
    state: "Rajasthan",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "90 - 120 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 9,
    eventsCompleted: 290,
    primaryInstruments: ["Rabab", "Daf", "Acoustic Guitar", "Tabla"],
    themeColor: "#9A7219",
    whatElseTheyDo: [
      {
        category: "💃 Sufi Whirling Dance Spectacle",
        description: "Performs with choreographed Sufi Whirling Dervishes in glowing traditional robes.",
        icon: "💃",
      },
      {
        category: "🎬 Bollywood Sufi Playback",
        description: "Covers Bollywood sufi hits like 'Iktara', 'Jiya Dhadak', 'Afreen Afreen' with acoustic elegance.",
        icon: "🎬",
      },
      {
        category: "🎙️ Spoken Poetry & Storytelling",
        description: "Engages guests with historical context and English/Hindi narration before each verse.",
        icon: "🎙️",
      },
    ],
    sampleSetlist: ["Afreen Afreen (Unplugged)", "Sanu Ik Pal Chain (Acoustic)", "Tajdar-e-Haram", "Khabar-e-Tahayyur-e-Ishq"],
    sampleTracks: [
      { title: "Afreen Unplugged at Royal Courtyard", duration: "6:20", type: "Acoustic Sufi" },
      { title: "Rumi Whirling Suite", duration: "9:45", type: "Trance Dance" },
    ],
    techRider: ["4 Wireless Headset Mics", "Stereo In-Ear Monitors", "Direct Rabab line", "Percussion Mic Kit"],
    reviews: [
      { author: "Ananya Deshmukh", event: "Art & Literary Festival", city: "Pune", comment: "The vocal harmonies and the whirling dancer created an absolute spiritual atmosphere. Truly ethereal.", rating: 5 },
    ],
  },
  {
    id: "sufi-3",
    name: "Zafar Khan & Progressive Sound",
    stageName: "Zafar Sufi Project",
    genre: "sufi",
    genreTitle: "Electronic & Ambient Sufi",
    tagline: "Organic ambient soundscapes blended with live sarangi and soaring vocals.",
    bio: "Pioneering the modern chillout and progressive sufi sound, Zafar Khan merges live acoustic sarangi, harmonium, and traditional chants with subtle downtempo synths and warm basslines for high-end lounges, festivals, and modern celebrations.",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=650&h=500&fit=crop&auto=format",
    rating: 4.8,
    reviewsCount: 94,
    price: "₹40,000",
    priceNum: 40000,
    city: "Mumbai",
    state: "Maharashtra",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "90 - 150 mins",
    bandType: "Trio",
    experienceYears: 8,
    eventsCompleted: 210,
    primaryInstruments: ["Sarangi", "Synthesizers", "Percussions", "Vocals"],
    themeColor: "#9A7219",
    whatElseTheyDo: [
      {
        category: "🎧 Sufi Electronic DJ Sets",
        description: "Live hybrid DJ sets featuring live Sarangi jamming over deep organic house rhythms.",
        icon: "🎧",
      },
      {
        category: "🏢 Corporate Brand Anthem Compositions",
        description: "Composes custom inspirational theme music for corporate summits and product unveilings.",
        icon: "🏢",
      },
      {
        category: "☕ Sunset Lounge Acoustics",
        description: "Gentle acoustic sessions tailored for luxury terrace gatherings and wine tastings.",
        icon: "☕",
      },
    ],
    sampleSetlist: ["Saanson Ki Maala (Deep Chill Mix)", "Tere Bina Beswaadi (Sarangi Version)", "Allah Hoo (Ambient Suite)"],
    sampleTracks: [
      { title: "Sarangi Sunrise at Goa Beach", duration: "7:10", type: "Ambient Sufi" },
      { title: "Saanson Ki Maala Organic Remix", duration: "5:50", type: "Electronic Live" },
    ],
    techRider: ["Stereo XLR Outputs from DJ setup", "Vocal Mic (Shure Beta 58)", "Sarangi Clip-on Mic", "Monitor Wedge"],
    reviews: [
      { author: "Kunal Mehra", event: "Cocktail Party", city: "Mumbai", comment: "So refreshing! It gave our evening a classy, hypnotic lounge vibe without being loud or overwhelming.", rating: 5 },
    ],
  },

  /* ── ROCK ARTISTS ─────────────────────────────────────────────── */
  {
    id: "rock-1",
    name: "The Red Resonance",
    stageName: "The Red Resonance Band",
    genre: "rock",
    genreTitle: "Hindi & Classic Rock Live Band",
    tagline: "High-octane 5-piece rock band known for power chords, anthems, and stadium energy.",
    bio: "The Red Resonance is one of India's most booked live acts for college fests and destination sangeets. Featuring shredding guitar solos, dual vocalists, and thunderous drumming, they perform everything from Junoon & Euphoria to Coldplay and high-voltage Bollywood rock mashups.",
    img: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=650&h=500&fit=crop&auto=format",
    rating: 4.9,
    reviewsCount: 198,
    price: "₹75,000",
    priceNum: 75000,
    city: "Mumbai",
    state: "Maharashtra",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "120 - 180 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 11,
    eventsCompleted: 380,
    primaryInstruments: ["Electric Guitars", "Bass Guitar", "Drum Kit", "Keyboards", "Vocals"],
    themeColor: "#C4952A",
    whatElseTheyDo: [
      {
        category: "🎬 Bollywood Rock Mashups",
        description: "Re-imagines popular Hindi dance numbers into thunderous rock anthems with live twin guitars.",
        icon: "🎬",
      },
      {
        category: "🎸 Acoustic Unplugged Duos",
        description: "Offers a 2-piece acoustic singer-guitarist setup for cocktail hours and intimate welcomes.",
        icon: "🎸",
      },
      {
        category: "🏢 Corporate Power Anthems",
        description: "Creates custom company theme songs, high-energy walk-in intros, and award ceremony music.",
        icon: "🏢",
      },
      {
        category: "🎙️ Crowd Karaoke & Jamming",
        description: "Interactive crowd singalongs that turn the entire audience into backing vocalists.",
        icon: "🎙️",
      },
    ],
    sampleSetlist: [
      "Sayonee / Bismil (Heavy Rock Medley)",
      "Rock On / Pichle Saat Dino (Crowd Opener)",
      "Coldplay Fix You (Rock Rework with Hindi Vocals)",
      "Sadda Haq / Nadaan Parindey (Stadium Finale)",
      "Khaabon Ke Parindey (Encore Jam)",
    ],
    sampleTracks: [
      { title: "Sayonee Live at IIT Bombay Fest", duration: "7:40", type: "Live Rock" },
      { title: "Bollywood 90s Rock Mashup", duration: "8:15", type: "Studio Rock" },
    ],
    techRider: ["Full Drum Kit with Mics", "2 Guitar Tube Amplifiers", "1 Bass Amp", "4 Stage Monitors", "3 Wireless Vocal Mics"],
    reviews: [
      { author: "Vikram Rathore", event: "Annual College Festival", city: "Bengaluru", comment: "They blew the roof off! 3,000 students jumped continuously for two hours straight. Absolute rockstars.", rating: 5 },
      { author: "Sonia Kapoor", event: "Destination Wedding Sangeet", city: "Goa", comment: "The Bollywood rock mashups had both youngsters and uncles dancing on the stage. Incredible performance!", rating: 5 },
    ],
  },
  {
    id: "rock-2",
    name: "Electra Velvet",
    stageName: "Electra Velvet",
    genre: "rock",
    genreTitle: "Alternative Rock & Pop-Rock",
    tagline: "Vibrant frontwoman, synth-rock grooves, and contagious dance-rock hooks.",
    bio: "Led by powerhouse vocalist Maya Rao, Electra Velvet blends the grit of indie rock with the danceability of electronic synth-pop. Their sets are visually striking with customized lighting cues, sharp costumes, and soaring vocals.",
    img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=650&h=500&fit=crop&auto=format",
    rating: 4.9,
    reviewsCount: 142,
    price: "₹60,000",
    priceNum: 60000,
    city: "Bengaluru",
    state: "Karnataka",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "90 - 120 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 7,
    eventsCompleted: 230,
    primaryInstruments: ["Synthesizers", "Lead Guitar", "Bass", "Electronic Drums"],
    themeColor: "#DDB96A",
    whatElseTheyDo: [
      {
        category: "💍 Sangeet After-Party Dance Sets",
        description: "Delivers non-stop upbeat pop-rock and English/Hindi chartbusters from 11 PM to late night.",
        icon: "💍",
      },
      {
        category: "🎷 Jazz-Rock & Brass Collaborations",
        description: "Features a guest live saxophone and trumpet duo for royal and upscale luxury galas.",
        icon: "🎷",
      },
      {
        category: "🔥 Stage Lighting Synchronization",
        description: "Brings automated DMX lighting rig programmed to sync with live tempo and beat drops.",
        icon: "🔥",
      },
    ],
    sampleSetlist: ["Urvashi Rock Anthem", "Shut Up and Dance / Gallan Goodiyaan", "Zombie / Dil Se Re Mashup"],
    sampleTracks: [
      { title: "Dil Se Rock Revival Live", duration: "5:30", type: "Alternative Rock" },
    ],
    techRider: ["Synth Line Outs (Stereo)", "Lead Vocal Wireless Mic (Sennheiser)", "In-Ear Monitor System"],
    reviews: [
      { author: "Aditya Roy", event: "Tech Summit After-Hours Party", city: "Bengaluru", comment: "Maya's stage presence is unbelievable! They kept 600 techies dancing till 1 AM. Top notch sound.", rating: 5 },
    ],
  },
  {
    id: "rock-3",
    name: "Aarav & The Drifters",
    stageName: "The Drifters Folk-Rock",
    genre: "rock",
    genreTitle: "Folk-Rock & Acoustic Indie",
    tagline: "Soulful acoustic guitars, bansuri flute, and foot-stomping folk rhythms.",
    bio: "Blending Indian regional folk instruments (ektara, dotara, bansuri) with acoustic guitars and stomp boxes, Aarav & The Drifters offer an authentic rustic sound reminiscent of Indian Ocean and Raghu Dixit Project.",
    img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=650&h=500&fit=crop&auto=format",
    rating: 4.8,
    reviewsCount: 110,
    price: "₹45,000",
    priceNum: 45000,
    city: "Pune",
    state: "Maharashtra",
    travelsPanIndia: true,
    travelsInternational: false,
    performanceDuration: "90 - 150 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 8,
    eventsCompleted: 195,
    primaryInstruments: ["Acoustic Guitars", "Bansuri", "Cajon", "Ektara"],
    themeColor: "#9A7219",
    whatElseTheyDo: [
      {
        category: "👘 Regional Folk Fusion",
        description: "Performs authentic Rajasthani, Gujarati, and Pahadi folk tunes infused with indie chords.",
        icon: "👘",
      },
      {
        category: "☕ Bonfire & Camp Jam Sessions",
        description: "Acoustic unplugged campfire sets ideal for luxury retreats and intimate destination weekends.",
        icon: "☕",
      },
    ],
    sampleSetlist: ["Kandisa (Tribute)", "Baawra Mann (Acoustic Extended)", "Chaudhary Folk Rock"],
    sampleTracks: [{ title: "Folk Rock Sunset Live", duration: "6:10", type: "Indie Folk" }],
    techRider: ["4 DI Boxes for Acoustics", "Flute Microphone", "Percussion Mic kit"],
    reviews: [
      { author: "Neha Kothari", event: "Sundowner Wedding Reception", city: "Alibaug", comment: "The folk-rock fusion during sunset was pure magic. Everyone felt so connected to the music.", rating: 5 },
    ],
  },

  /* ── GHAZAL ARTISTS ───────────────────────────────────────────── */
  {
    id: "gazal-1",
    name: "Ustad Rahat Sharma",
    stageName: "Rahat Sharma Ghazals",
    genre: "gazal",
    genreTitle: "Classical & Urdu Ghazal Virtuoso",
    tagline: "Trained in the Gwalior Gharana; master of soulful shayaris and emotive ghazal renditions.",
    bio: "Ustad Rahat Sharma is one of the most revered ghazal vocalists of his generation. Having performed for dignitaries and literature festivals worldwide, his renditions of Jagjit Singh, Mehdi Hassan, and Mirza Ghalib evoke deep nostalgic reverence.",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=650&h=500&fit=crop&auto=format",
    rating: 5.0,
    reviewsCount: 168,
    price: "₹45,000",
    priceNum: 45000,
    city: "Lucknow",
    state: "Uttar Pradesh",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "120 - 180 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 18,
    eventsCompleted: 490,
    primaryInstruments: ["Harmonium", "Tabla", "Sarangi", "Santoor", "Swarmandal"],
    themeColor: "#9A7219",
    whatElseTheyDo: [
      {
        category: "📜 Poetry & Shayari Narration",
        description: "Explains nuances of Urdu couplets, historical anecdotes of Ghalib & Faiz before singing.",
        icon: "📜",
      },
      {
        category: "💍 Intimate Sangeet Ghazal Evenings",
        description: "Tailors romantic ghazals and vintage melody medleys for pre-wedding sit-down dinners.",
        icon: "💍",
      },
      {
        category: "🎬 Vintage Retro Bollywood Classics",
        description: "Performs golden-era classics of Mohammed Rafi, Talat Mahmood, and Mukesh with acoustic charm.",
        icon: "🎬",
      },
      {
        category: "🕊️ Spiritual Sufiana Ghazals",
        description: "Specializes in devotional rubaiyats and contemplative verses for serene gatherings.",
        icon: "🕊️",
      },
    ],
    sampleSetlist: [
      "Hothon Se Chhoo Lo Tum (Jagjit Singh Tribute)",
      "Woh Kagaz Ki Kashti (Nostalgia Special)",
      "Chitthi Aayi Hai (Live Emotive Rendition)",
      "Ranjish Hi Sahi (Mehdi Hassan Classic)",
      "Aaj Jaane Ki Zid Na Karo (Closing Gem)",
    ],
    sampleTracks: [
      { title: "Hothon Se Chhoo Lo Tum Live at Lucknow Baithak", duration: "8:20", type: "Live Ghazal" },
      { title: "Ranjish Hi Sahi Mehfil Recording", duration: "9:10", type: "Classical Mehfil" },
    ],
    techRider: ["Shure KSM9 Vocal Mic", "Harmonium DI", "Pair of Tabla Condenser Mics (AKG C414)", "Floor Carpeting"],
    reviews: [
      { author: "Dr. Farooq Rizvi", event: "50th Anniversary Golden Mehfil", city: "Delhi", comment: "There wasn't a dry eye in the hall when Rahat Ji sang 'Woh Kagaz Ki Kashti'. Absolute perfection.", rating: 5 },
      { author: "Suresh Agarwal", event: "Corporate Founders Dinner", city: "Jaipur", comment: "Class personified. His interaction and shayari explanations made every guest feel special.", rating: 5 },
    ],
  },
  {
    id: "gazal-2",
    name: "Meera Vashisth",
    stageName: "Meera Vashisth & Strings",
    genre: "gazal",
    genreTitle: "Contemporary Ghazal & Thumri",
    tagline: "Ethereal vocals paired with acoustic violin and grand piano harmonies.",
    bio: "Meera Vashisth brings a fresh, contemporary touch to the ghazal tradition, weaving delicate violin counter-melodies and piano arpeggios around romantic verses. Loved by modern audiences and classical purists alike.",
    img: "https://images.unsplash.com/photo-1530189873666-a792be008b5b?w=650&h=500&fit=crop&auto=format",
    rating: 4.9,
    reviewsCount: 118,
    price: "₹38,000",
    priceNum: 38000,
    city: "Delhi",
    state: "Delhi NCR",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "90 - 150 mins",
    bandType: "Trio",
    experienceYears: 10,
    eventsCompleted: 260,
    primaryInstruments: ["Vocals", "Acoustic Violin", "Keyboards/Piano", "Tabla"],
    themeColor: "#6B4A00",
    whatElseTheyDo: [
      {
        category: "🎻 Violin & Raga Melodic Interludes",
        description: "Features extended violin solos bridging classical Indian ragas with Western harmony.",
        icon: "🎻",
      },
      {
        category: "🏢 Literary & Corporate Retreats",
        description: "Subtle, non-intrusive ambient dinner music for high-level delegations and book launches.",
        icon: "🏢",
      },
      {
        category: "🎙️ Multilingual Ghazal Sets",
        description: "Performs ghazals in Hindi, Urdu, Gujarati, and Kashmiri with native fluency.",
        icon: "🎙️",
      },
    ],
    sampleSetlist: ["Tum Itna Jo Muskura Rahe Ho", "Dil Dhoondta Hai", "Hangama Hai Kyon Barpa"],
    sampleTracks: [{ title: "Tum Itna Jo Muskura Rahe Ho Live", duration: "6:45", type: "Acoustic Ghazal" }],
    techRider: ["Violin DI", "Piano Keyboard Stereo Out", "2 Vocal Mics", "2 Monitors"],
    reviews: [
      { author: "Kavita Sethi", event: "Art Gallery Vernissage", city: "Mumbai", comment: "Meera's voice is pure honey. The violin accompaniment gave goosebumps to everyone present.", rating: 5 },
    ],
  },

  /* ── BOLLYWOOD ARTISTS ────────────────────────────────────────── */
  {
    id: "bolly-1",
    name: "Aarohi Soundstage",
    stageName: "Aarohi Bollywood Live",
    genre: "bollywood",
    genreTitle: "High-Energy Bollywood Live Concert",
    tagline: "8-piece powerhouse ensemble bringing grand Bollywood concert energy to your stage.",
    bio: "Aarohi Soundstage is the pinnacle of live Bollywood entertainment. With two versatile playback vocalists, live brass, percussionists, and a razor-sharp rhythm section, they perform over 40 back-to-back chartbusters in a single show.",
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=650&h=500&fit=crop&auto=format",
    rating: 5.0,
    reviewsCount: 245,
    price: "₹95,000",
    priceNum: 95000,
    city: "Mumbai",
    state: "Maharashtra",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "150 - 210 mins",
    bandType: "Full Troupe (8+ Members)",
    experienceYears: 13,
    eventsCompleted: 520,
    primaryInstruments: ["Dual Vocals", "Keyboards", "Electric Guitar", "Brass/Sax", "Dhol", "Drums"],
    themeColor: "#C4952A",
    whatElseTheyDo: [
      {
        category: "💃 Choreographed Dancers Integration",
        description: "Synchronized stage dance troupe with rapid costume changes for grand entry sequences.",
        icon: "💃",
      },
      {
        category: "🎧 Live DJ + Dhol / Octapad Jam",
        description: "Seamless transition from live concert to thunderous DJ after-party with live percussion.",
        icon: "🎧",
      },
      {
        category: "💍 Complete Sangeet Emcee & Hosting",
        description: "Professional anchors who host family dance performances and bride/groom entries.",
        icon: "💍",
      },
      {
        category: "🏢 Award Night Musical Scoring",
        description: "Live stings, walk-up fanfares, and grand celebratory anthems for corporate award galas.",
        icon: "🏢",
      },
    ],
    sampleSetlist: [
      "Gallan Goodiyaan / London Thumakda (Wedding Opener)",
      "Kesariya / Tum Hi Ho (Romantic Medley)",
      "Badtameez Dil / Dilliwaali Girlfriend (Dance Finale)",
      "Jhoom Barabar Jhoom / Subha Hone Na De (High Voltage Jam)",
      "Chaiyya Chaiyya / Zingaat (Explosive Encore)",
    ],
    sampleTracks: [
      { title: "Bollywood Mega Sangeet Mashup Live", duration: "14:20", type: "Live Medley" },
      { title: "Romantic Playback Suite", duration: "8:40", type: "Acoustic Melody" },
    ],
    techRider: ["Full Stage Sound System (10KW+)", "8 IEM Wireless Systems", "Wireless Mic Kits", "Drum Kit Mics"],
    reviews: [
      { author: "Harsh Vardhan Mittal", event: "Grand Sangeet Night", city: "Delhi", comment: "Worth every single rupee! 800 guests were on the dance floor until 3 AM. The live energy was unmatchable.", rating: 5 },
      { author: "Radhika Parekh", event: "Corporate Annual Conclave", city: "Hyderabad", comment: "Professional, punctual, and sensational stage presence. They made our event the talk of the company.", rating: 5 },
    ],
  },
  {
    id: "bolly-2",
    name: "Rohan & The Hitmakers",
    stageName: "Rohan K Live",
    genre: "bollywood",
    genreTitle: "Bollywood Playback & Retro Pop",
    tagline: "Charismatic playback singer delivering 90s nostalgia and modern party hits.",
    bio: "Rohan K is known for his infectious energy, interactive crowd engagement, and uncanny vocal versatility spanning Kishore Kumar classics to Arijit Singh and Badshah hits.",
    img: "https://images.unsplash.com/photo-1595971294624-80bcf0d7eb24?w=650&h=500&fit=crop&auto=format",
    rating: 4.8,
    reviewsCount: 160,
    price: "₹65,000",
    priceNum: 65000,
    city: "Delhi",
    state: "Delhi NCR",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "120 - 180 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 9,
    eventsCompleted: 310,
    primaryInstruments: ["Vocals", "Guitars", "Keyboards", "Dholak/Octapad"],
    themeColor: "#DDB96A",
    whatElseTheyDo: [
      {
        category: "🎙️ Interactive Antakshari & Crowd Battles",
        description: "Engages tables in musical face-offs and singalong games between groom & bride sides.",
        icon: "🎙️",
      },
      {
        category: "🎷 Retro Bollywood Swing & Jazz",
        description: "Sophisticated arrangements of RD Burman and Shankar-Jaikishan for cocktail evenings.",
        icon: "🎷",
      },
      {
        category: "👘 Punjabi Dhol Closing Blast",
        description: "High-octane Punjabi bhangra finale with live dhol players joining the dance floor.",
        icon: "👘",
      },
    ],
    sampleSetlist: ["Gulaabi Aankhen (Modern Pop Mix)", "Khaike Paan Banaraswaala", "Apna Bana Le"],
    sampleTracks: [{ title: "Retro Bollywood Live Jam", duration: "9:10", type: "Retro Medley" }],
    techRider: ["4 Vocal Mics", "Dhol Clip-on Mic", "Keyboards Stereo DI"],
    reviews: [
      { author: "Deepak Chawla", event: "Silver Jubilee Celebration", city: "Chandigarh", comment: "Rohan got everyone from grandparents to 5-year-olds dancing on their feet. Super entertaining!", rating: 5 },
    ],
  },

  /* ── CARNIVAL ARTISTS ─────────────────────────────────────────── */
  {
    id: "carn-1",
    name: "Cirque Fiesta Spectacle",
    stageName: "Cirque Fiesta",
    genre: "carnival",
    genreTitle: "Acrobats, Aerialists & Fire Spectacle",
    tagline: "Breathtaking circus arts, fire dancers, and roaming carnival performers.",
    bio: "Cirque Fiesta brings international-level circus theatre to celebrations across India. Featuring fire-eaters, LED poi dancers, silk aerialists, unicyclists, and stilt-walkers in vibrant feathers and custom costumes.",
    img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=650&h=500&fit=crop&auto=format",
    rating: 5.0,
    reviewsCount: 140,
    price: "₹65,000",
    priceNum: 65000,
    city: "Goa",
    state: "Goa",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "120 - 180 mins",
    bandType: "Full Troupe (8+ Members)",
    experienceYears: 10,
    eventsCompleted: 340,
    primaryInstruments: ["Fire Props", "Aerial Silks", "LED Wings", "Carnival Drums"],
    themeColor: "#EC4899",
    whatElseTheyDo: [
      {
        category: "🔥 Fire Breathing & Pyrotechnics",
        description: "Spectacular outdoor fire juggling, fire staff twirling, and controlled fire-eating acts.",
        icon: "🔥",
      },
      {
        category: "🎪 Stilt Walkers & Living Statues",
        description: "10-foot tall costumed stilt performers greeting guests at gates for unforgettable photo-ops.",
        icon: "🎪",
      },
      {
        category: "🎭 Interactive Mimes & Close-up Magic",
        description: "Roaming sleight-of-hand magicians and playful mimes entertaining tables and kids.",
        icon: "🎭",
      },
      {
        category: "🥁 Brazilian Samba & Dhol Drumline",
        description: "High-energy mobile drumming troupe leading grand carnival parades through the venue.",
        icon: "🥁",
      },
    ],
    sampleSetlist: ["Fire Odyssey Night Show (25 mins)", "Aerial Silk Symphony (20 mins)", "Carnival Walkabout Parade (60 mins)"],
    sampleTracks: [{ title: "Carnival Live Percussion & Fire Track", duration: "5:00", type: "Carnival Beat" }],
    techRider: ["Outdoor clearance for fire safety", "Sound hookup for soundtrack", "Green room for costume changes"],
    reviews: [
      { author: "Samir Singhal", event: "Theme Park Grand Carnival", city: "Lonavala", comment: "The fire show at night was jaw-dropping. The safety precautions and professional execution were flawless.", rating: 5 },
      { author: "Tanya Sen", event: "Wedding Carnival Brunch", city: "Goa", comment: "The stilt walkers and magicians made our afternoon pool party feel like Tomorrowland meets Rio Carnival!", rating: 5 },
    ],
  },
  {
    id: "carn-2",
    name: "Mela Magic Folk Circus",
    stageName: "Mela Magic",
    genre: "carnival",
    genreTitle: "Traditional Indian Street Carnival",
    tagline: "Puppetry, Kalbelia fire dancers, magicians & traditional festive bazaar acts.",
    bio: "Mela Magic brings the timeless joy of Indian village fairs and royal melas to life with authentic puppet master storytellers, Rajasthani acrobat dancers, and live folk musicians.",
    img: "https://images.unsplash.com/photo-1544441452-326ff5a947fd?w=650&h=500&fit=crop&auto=format",
    rating: 4.8,
    reviewsCount: 96,
    price: "₹35,000",
    priceNum: 35000,
    city: "Jaipur",
    state: "Rajasthan",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "120 - 240 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 15,
    eventsCompleted: 410,
    primaryInstruments: ["Dhol", "Nagada", "Algoza", "Shehnai"],
    themeColor: "#9A7219",
    whatElseTheyDo: [
      {
        category: "🎭 Kathputli & Shadow Puppet Shows",
        description: "Intricate wooden marionette puppet theater reciting heroic folk stories.",
        icon: "🎭",
      },
      {
        category: "💃 Kalbelia & Chari Folk Dances",
        description: "Fast-spinning snake charmer dances balancing flaming brass pots on heads.",
        icon: "💃",
      },
      {
        category: "🎨 Live Caricature & Henna Stalls",
        description: "Speed caricature artists creating custom sketches for guests to take home.",
        icon: "🎨",
      },
    ],
    sampleSetlist: ["Royal Mela Welcome (Shehnai & Nagada)", "Puppet Legend of Padmavati", "Chari Fire Dance"],
    sampleTracks: [{ title: "Folk Carnival Dhol & Shehnai Intro", duration: "4:30", type: "Folk Instrumental" }],
    techRider: ["2 Wireless Microphones", "Basic PA System", "Covered puppet booth area"],
    reviews: [
      { author: "Nitin Bansal", event: "Traditional Mehendi Mela", city: "Delhi", comment: "The authentic Rajasthani bazaar atmosphere they created was the highlight of our 3-day wedding.", rating: 5 },
    ],
  },

  /* ── DEVOTIONAL ARTISTS ───────────────────────────────────────── */
  {
    id: "devo-1",
    name: "Pandit Ramesh Ji & Sangeet Ashram",
    stageName: "Ramesh Ji Bhakti Mandali",
    genre: "devotional",
    genreTitle: "Vedic Chants, Bhajans & Kirtans",
    tagline: "Sacred chants, soulful bhajans, and uplifting Krishna kirtans with master instrumentalists.",
    bio: "Pandit Ramesh Ji has dedicated over 20 years to the sacred art of Bhakti Sangeet. Accompanied by harmonium, tabla, mridangam, and bansuri flute, his devotional evenings fill the air with tranquility, devotion, and collective chanting.",
    img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=650&h=500&fit=crop&auto=format",
    rating: 5.0,
    reviewsCount: 192,
    price: "₹25,000",
    priceNum: 25000,
    city: "Varanasi",
    state: "Uttar Pradesh",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "120 - 240 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 22,
    eventsCompleted: 600,
    primaryInstruments: ["Harmonium", "Tabla", "Mridanga", "Manjira", "Bansuri"],
    themeColor: "#6B4A00",
    whatElseTheyDo: [
      {
        category: "🪔 Maha Aarti & Ganga Aarti Orchestrations",
        description: "Recreates the grand visual and acoustic spectacle of Varanasi Ganga Aarti with conch shells and brass lamps.",
        icon: "🪔",
      },
      {
        category: "📜 Sundarkand & Hanuman Chalisa Musical",
        description: "Rhythmic, continuous musical recitals of Sundarkand and 108 Hanuman Chalisa repetitions.",
        icon: "📜",
      },
      {
        category: "🕊️ Sound Healing & Vedic Chanting",
        description: "Therapeutic meditation sessions using sacred Sanskrit syllables and singing bowls.",
        icon: "🕊️",
      },
      {
        category: "💍 Sacred Vedic Wedding Chants",
        description: "Live chanting of sacred Saat Phere shlokas with live sitar and flute background accompaniment.",
        icon: "💍",
      },
    ],
    sampleSetlist: [
      "Achyutam Keshavam (Peaceful Morning Raga)",
      "Hanuman Chalisa (Chhand & Dhun Extended)",
      "Radhe Govinda Ecstatic Kirtan",
      "Ganga Aarti (Stuti & Shankh Naad)",
      "Om Jai Jagdish Hare (Grand Finale)",
    ],
    sampleTracks: [
      { title: "Achyutam Keshavam Live at Kashi Ghat", duration: "8:40", type: "Devotional Stuti" },
      { title: "Radha Krishna Kirtan Jam", duration: "12:15", type: "Live Kirtan" },
    ],
    techRider: ["4 Vocal Mics", "Harmonium Mic", "Tabla pair mics", "Floor cushions / Chaurang setup"],
    reviews: [
      { author: "Smt. Shanti Devi", event: "Griha Pravesh & Sundarkand", city: "Varanasi", comment: "Pure divine bliss. The peaceful energy Pandit Ji brought into our new home was felt by every guest.", rating: 5 },
      { author: "Alok Srivastava", event: "Mata Ki Chowki", city: "Noida", comment: "The bhajans and the Ganga aarti ceremony touched everyone's soul deeply. Truly blessed musicians.", rating: 5 },
    ],
  },
  {
    id: "devo-2",
    name: "Divya Ananda Kirtan Troupe",
    stageName: "Divya Ananda Collective",
    genre: "devotional",
    genreTitle: "Ecstatic Kirtan & Bhakti Fusion",
    tagline: "High-vibration Hare Krishna kirtans, mridanga drums, and uplifting sacred melodies.",
    bio: "Divya Ananda Collective brings contemporary acoustic instrumentation to ancient kirtan traditions, inspiring audiences of all backgrounds to dance, chant, and celebrate spiritual joy.",
    img: "https://images.unsplash.com/photo-1585302397841-b42e837d0d81?w=650&h=500&fit=crop&auto=format",
    rating: 4.9,
    reviewsCount: 135,
    price: "₹30,000",
    priceNum: 30000,
    city: "Vrindavan / Delhi",
    state: "Uttar Pradesh",
    travelsPanIndia: true,
    travelsInternational: true,
    performanceDuration: "90 - 150 mins",
    bandType: "4-6 Piece Band",
    experienceYears: 9,
    eventsCompleted: 275,
    primaryInstruments: ["Mridanga", "Kartal", "Harmonium", "Acoustic Guitar", "Flute"],
    themeColor: "#9A7219",
    whatElseTheyDo: [
      {
        category: "🥁 Ecstatic Mridanga Dance Jams",
        description: "Engages guests in joyful call-and-response chanting that culminates in ecstatic dancing.",
        icon: "🥁",
      },
      {
        category: "🏢 Corporate Wellness & Mindfulness",
        description: "Stress-relief sound bathing and guided breathwork combined with soothing flute melodies.",
        icon: "🏢",
      },
      {
        category: "🎷 Bhakti-Jazz Acoustic Sessions",
        description: "Blends acoustic saxophone and guitars with sacred mantras for modern retreats.",
        icon: "🎷",
      },
    ],
    sampleSetlist: ["Maha Mantra Ecstasy", "Govinda Jaya Jaya", "Gopala Krishna Live"],
    sampleTracks: [{ title: "Maha Mantra Live in Vrindavan", duration: "10:30", type: "Kirtan" }],
    techRider: ["Mridanga Mic Kit", "Harmonium DI", "3 Vocal Mics", "2 Monitors"],
    reviews: [
      { author: "Ritu Mathur", event: "Janmashtami Celebration", city: "Delhi", comment: "The energy in the hall was unbelievable. Nobody wanted the kirtan to stop!", rating: 5 },
    ],
  },
];
