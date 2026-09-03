import { useState, useMemo } from "react";
import { BlogArticle, BLOG_ARTICLES, BLOG_CATEGORIES, QUICK_EVENT_TIPS } from "../data/blogData";

interface JournalPageProps {
  onSelectArticle: (article: BlogArticle) => void;
  likes: Record<string, number>;
  onToggleLike: (articleId: string) => void;
  onBackHome: () => void;
  onSelectGenre?: (genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
  articles?: BlogArticle[];
}

export function JournalPage({
  onSelectArticle,
  likes,
  onToggleLike,
  onBackHome,
  onSelectGenre,
  articles,
}: JournalPageProps) {
  const sourceArticles = articles || BLOG_ARTICLES;
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "likes">("latest");
  const [activeTipIdx, setActiveTipIdx] = useState(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@") || !newsletterEmail.includes(".")) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }
    setNewsletterError("");
    setIsSubscribed(true);
  };

  // Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    let result = [...sourceArticles];

    if (selectedCategory !== "all") {
      result = result.filter(a => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === "popular") {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "likes") {
      result.sort((a, b) => {
        const likesA = likes[a.id] ?? a.initialLikes ?? 0;
        const likesB = likes[b.id] ?? b.initialLikes ?? 0;
        return likesB - likesA;
      });
    }

    return result;
  }, [sourceArticles, selectedCategory, searchQuery, sortBy, likes]);

  const featuredArticle = sourceArticles.find(a => a.featured) || sourceArticles[0];

  return (
    <div className="min-h-screen text-[#1A1916] pb-28" style={{ background: "#FAF7F2", fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* ── Top Editorial Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EDE8DF] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[68px] flex items-center justify-between">
          <button
            onClick={onBackHome}
            className="flex flex-col leading-none cursor-pointer group select-none text-left"
          >
            <span
              className="font-serif text-[22px] font-light tracking-[0.06em] text-[#1A1916] group-hover:text-[#C4952A] transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.08em" }}
            >
              MANNAT ARTS
            </span>
            <span className="label-editorial text-[#C4952A] tracking-[0.22em]" style={{ fontSize: "7px" }}>
              EDITORIAL STORIES
            </span>
          </button>

          <button
            onClick={onBackHome}
            className="font-ui text-[13px] font-medium text-[#4A4845] hover:text-[#1A1916] transition-colors cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      {/* ── Editorial Hero Banner ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-6 border-b border-[#EDE8DF]" style={{ background: "#F5F0E8" }}>
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="label-editorial text-[#C4952A] tracking-[0.25em]" style={{ fontSize: "10px" }}>
              · CULTURAL DISPATCH &amp; GUIDES ·
            </span>
            <h1
              className="font-serif font-light text-4xl sm:text-5xl lg:text-6xl text-[#1A1916] tracking-tight leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The Mannat Arts <em style={{ fontStyle: "italic", color: "#C4952A" }}>Journal</em>
            </h1>
            <p className="font-ui text-[15px] text-[#7A776F] leading-relaxed max-w-2xl mx-auto">
              Curated masterclasses, acoustic sequencing guides, wedding checklists, and backstage interviews from India's leading performing artists.
            </p>
          </div>

          {/* Featured Spotlight Story */}
          {featuredArticle && (
            <div className="bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EDE8DF] shadow-md hover:shadow-xl transition-all duration-400 grid lg:grid-cols-12 gap-0 group lift-card">
              <div
                onClick={() => onSelectArticle(featuredArticle)}
                className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden bg-gray-900 cursor-pointer img-zoom"
              >
                <img
                  src={featuredArticle.coverImg}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 label-editorial text-[9px] bg-white/90 text-[#1A1916] px-3.5 py-1 rounded-full shadow-sm font-bold">
                  FEATURED SPOTLIGHT
                </span>
                <span className="absolute bottom-4 left-4 text-xs text-white/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full font-medium">
                  {featuredArticle.readTime} • {featuredArticle.publishedDate}
                </span>
              </div>

              <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="label-editorial text-[#C4952A]" style={{ fontSize: "9px" }}>
                    {featuredArticle.category}
                  </span>
                  <h2
                    onClick={() => onSelectArticle(featuredArticle)}
                    className="font-serif font-light text-2xl sm:text-3xl text-[#1A1916] leading-tight hover:text-[#C4952A] cursor-pointer transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {featuredArticle.title}
                  </h2>
                  <p className="font-ui text-xs sm:text-sm text-[#7A776F] leading-relaxed">
                    {featuredArticle.subtitle}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#EDE8DF]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#EDE8DF]"
                      />
                      <div>
                        <div className="font-ui text-xs font-bold text-[#1A1916]">
                          {featuredArticle.author.name}
                        </div>
                        <div className="font-ui text-[10px] text-[#7A776F]">
                          {featuredArticle.author.role}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleLike(featuredArticle.id)}
                      className="flex items-center gap-1.5 text-xs text-[#1A1916] bg-[#F5F0E8] hover:bg-[#EDE8DF] px-3 py-1.5 rounded-full transition-colors cursor-pointer font-bold border border-[#EDE8DF]"
                    >
                      <span>♥</span>
                      <span>{likes[featuredArticle.id] ?? featuredArticle.initialLikes}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectArticle(featuredArticle)}
                    className="w-full py-3.5 rounded-full bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] font-ui text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Read Full Guide</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Search, Filters & Articles Grid ───────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-14 space-y-10">
        {/* Search & Category Filter Bar */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE8DF] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`font-ui px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[#C4952A] text-[#1A1916] shadow-sm"
                    : "bg-[#F5F0E8] text-[#7A776F] border border-[#EDE8DF] hover:text-[#1A1916]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search masterclasses, acoustics..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full font-ui text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-full pl-8 pr-4 py-2.5 text-[#1A1916] placeholder-[#A8A49A] focus:outline-none focus:border-[#C4952A]"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#7A776F]">🔍</span>
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="font-ui text-xs bg-[#F5F0E8] border border-[#EDE8DF] rounded-full px-4 py-2.5 text-[#1A1916] cursor-pointer focus:outline-none font-medium"
            >
              <option value="latest">Latest First</option>
              <option value="popular">Most Read</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
        </div>

        {/* Articles Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EDE8DF] shadow-sm hover:shadow-xl transition-all duration-400 flex flex-col justify-between group lift-card"
            >
              <div
                onClick={() => onSelectArticle(article)}
                className="relative h-56 overflow-hidden bg-gray-100 cursor-pointer img-zoom"
              >
                <img
                  src={article.coverImg}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute top-3 left-3 label-editorial text-[8px] bg-white text-[#1A1916] px-2.5 py-1 rounded-full shadow-sm font-bold">
                  {article.category}
                </span>
                <span className="absolute bottom-3 left-3 text-[10px] text-white/90 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-medium">
                  {article.readTime} • {article.publishedDate}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3
                    onClick={() => onSelectArticle(article)}
                    className="font-serif font-light text-xl text-[#1A1916] leading-snug line-clamp-2 hover:text-[#C4952A] cursor-pointer transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {article.title}
                  </h3>
                  <p className="font-ui text-xs text-[#7A776F] line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#EDE8DF]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#EDE8DF]"
                      />
                      <span className="font-ui text-xs font-medium text-[#1A1916]">
                        {article.author.name}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleLike(article.id)}
                      className="flex items-center gap-1 text-xs text-[#7A776F] hover:text-[#1A1916] transition-colors cursor-pointer font-medium"
                      title="Like this story"
                    >
                      <span>♥</span>
                      <span>{likes[article.id] ?? article.initialLikes}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {article.relatedGenreId && onSelectGenre && (
                      <button
                        onClick={() => onSelectGenre(article.relatedGenreId as any)}
                        className="label-editorial text-[8px] text-[#C4952A] hover:underline cursor-pointer"
                      >
                        EXPLORE {article.relatedGenreId.toUpperCase()} →
                      </button>
                    )}

                    <button
                      onClick={() => onSelectArticle(article)}
                      className="font-ui text-xs font-semibold text-[#1A1916] hover:text-[#C4952A] cursor-pointer ml-auto"
                    >
                      Read Guide →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 60-Second Event Tips Carousel ───────────────────────────────── */}
        <div className="bg-[#F5F0E8] border border-[#EDE8DF] rounded-2xl p-8 space-y-6 mt-14">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="label-editorial text-[#C4952A]" style={{ fontSize: "9px" }}>
                60-SECOND EVENT MASTERCLASS
              </span>
              <h3
                className="font-serif font-light text-2xl text-[#1A1916]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Tactical Event Guides
              </h3>
            </div>

            <div className="flex gap-2">
              {QUICK_EVENT_TIPS.map((tip, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTipIdx(idx)}
                  className={`w-8 h-8 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTipIdx === idx
                      ? "bg-[#1A1916] text-[#FAF7F2] shadow-sm"
                      : "bg-[#FAF7F2] text-[#7A776F] border border-[#EDE8DF] hover:text-[#1A1916]"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#FAF7F2] rounded-xl p-6 border border-[#EDE8DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-ui text-xs font-bold text-[#C4952A]">Tip #{activeTipIdx + 1}:</span>
                <h4 className="font-ui font-semibold text-sm text-[#1A1916]">
                  {QUICK_EVENT_TIPS[activeTipIdx].title}
                </h4>
              </div>
              <p className="font-ui text-xs text-[#7A776F] leading-relaxed">
                {QUICK_EVENT_TIPS[activeTipIdx].tip}
              </p>
            </div>
            <span className="label-editorial text-[#7A776F] bg-[#F5F0E8] px-3 py-1 rounded-full whitespace-nowrap" style={{ fontSize: "8px" }}>
              {QUICK_EVENT_TIPS[activeTipIdx].category}
            </span>
          </div>
        </div>

        {/* ── VIP Editorial Newsletter ────────────────────────────────────── */}
        <div className="bg-[#1A1916] rounded-3xl p-10 text-white text-center space-y-5 max-w-3xl mx-auto shadow-xl">
          <span className="label-editorial text-[#DDB96A] tracking-[0.25em] block" style={{ fontSize: "10px" }}>
            EDITORIAL DISPATCH
          </span>
          <h3
            className="font-serif font-light text-3xl sm:text-4xl text-white leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Join the Mannat Arts Dispatch
          </h3>
          <p className="font-ui text-xs sm:text-sm text-[#A8A49A] max-w-lg mx-auto leading-relaxed">
            Curated soundcheck checklists, seasonal acoustic breakdowns, and private invitations to exclusive artist showcases.
          </p>

          {isSubscribed ? (
            <div className="bg-white/10 border border-[#C4952A]/40 text-[#DDB96A] text-xs font-semibold py-3 px-6 rounded-full inline-block">
              ✓ Thank you. You are now subscribed to the Editorial Dispatch.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="w-full font-ui text-xs bg-white/10 border border-white/20 rounded-full px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#C4952A]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto font-ui px-8 py-3.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] text-xs font-semibold shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
          {newsletterError && (
            <p className="font-ui text-xs text-red-400">{newsletterError}</p>
          )}
        </div>
      </main>
    </div>
  );
}
