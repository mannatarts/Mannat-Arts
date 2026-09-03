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

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(a => a.category === selectedCategory);
    }

    // Search query filter
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

    // Sorting
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
    <div className="min-h-screen bg-[#FFFDFD] text-[#1A1A1A] font-body pb-28">
      {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F3E5E8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div
            onClick={onBackHome}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9333EA] flex items-center justify-center text-white font-bold text-sm shadow-md">
              📖
            </div>
            <span className="font-display font-bold text-xl text-[#1A1A1A] tracking-tight">StageBridge</span>
            <span className="text-[9px] font-body text-[#E11D48] font-bold tracking-[0.2em] uppercase bg-[#E11D48]/10 px-1.5 py-0.5 rounded-full">
              Journal &amp; Guides
            </span>
          </div>

          <div className="flex items-center gap-3">
          </div>
        </div>
      </header>

      {/* ── Editorial Hero Banner ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#FFF5F7] via-[#FFF8F8] to-white py-14 px-4 sm:px-6 border-b border-[#F3E5E8]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F3] border border-[#F3E5E8] text-xs font-bold uppercase tracking-widest text-[#BE123C]">
              <span>✦ Backstage Guides &amp; Insights</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#1A1A1A] tracking-tight">
              The StageBridge <span className="text-gradient-crimson italic">Journal</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5B5B5B] leading-relaxed max-w-2xl mx-auto">
              Curated masterclasses, acoustic sequencing guides, wedding checklists, and backstage interviews from India&apos;s leading live event specialists.
            </p>
          </div>

          {/* Featured Spotlight Story */}
          {featuredArticle && (
            <div className="bg-white rounded-3xl overflow-hidden border border-[#F3E5E8] shadow-lg hover:shadow-xl transition-all grid lg:grid-cols-12 gap-0 group">
              <div
                onClick={() => onSelectArticle(featuredArticle)}
                className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden bg-gray-900 cursor-pointer"
              >
                <img
                  src={featuredArticle.coverImg}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span
                  className="absolute top-4 left-4 text-xs font-bold text-white px-3.5 py-1 rounded-full shadow-md"
                  style={{ backgroundColor: featuredArticle.categoryColor }}
                >
                  ⭐ Featured Spotlight
                </span>
                <span className="absolute bottom-4 left-4 text-xs text-white/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full font-medium">
                  {featuredArticle.readTime} • {featuredArticle.publishedDate}
                </span>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#BE123C]">
                    {featuredArticle.category}
                  </div>
                  <h2
                    onClick={() => onSelectArticle(featuredArticle)}
                    className="font-display font-bold text-2xl sm:text-3xl text-[#1A1A1A] leading-tight hover:text-[#E11D48] cursor-pointer transition-colors"
                  >
                    {featuredArticle.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5B5B5B] leading-relaxed">
                    {featuredArticle.subtitle}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#F3E5E8]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#F3E5E8]"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#1A1A1A]">
                          {featuredArticle.author.name}
                        </div>
                        <div className="text-[10px] text-[#5B5B5B]">
                          {featuredArticle.author.role}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleLike(featuredArticle.id)}
                      className="flex items-center gap-1.5 text-xs text-[#BE123C] bg-[#FFF0F3] hover:bg-[#E11D48] hover:text-white px-3 py-1.5 rounded-full transition-colors cursor-pointer font-bold"
                    >
                      <span>❤️</span>
                      <span>{likes[featuredArticle.id] ?? featuredArticle.initialLikes}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectArticle(featuredArticle)}
                    className="w-full py-3 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#F3E5E8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[#E11D48] text-white shadow-xs"
                    : "bg-[#FFF8F8] text-[#5B5B5B] border border-[#F3E5E8] hover:bg-[#FFF0F3] hover:text-[#BE123C]"
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
                placeholder="Search masterclasses, acoustics, tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-full pl-8 pr-4 py-2 text-[#1A1A1A] placeholder:text-[#5B5B5B]/60 focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#5B5B5B]">🔍</span>
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs bg-[#FFF8F8] border border-[#F3E5E8] rounded-full px-3.5 py-2 text-[#1A1A1A] cursor-pointer focus:outline-none font-medium"
            >
              <option value="latest">Latest First</option>
              <option value="popular">Most Read</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
        </div>

        {/* Articles Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#F3E5E8] shadow-xs hover:shadow-xl hover:border-[#E11D48]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div
                onClick={() => onSelectArticle(article)}
                className="relative h-52 overflow-hidden bg-gray-100 cursor-pointer"
              >
                <img
                  src={article.coverImg}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span
                  className="absolute top-3 left-3 text-[10px] font-bold text-white px-2.5 py-1 rounded-full shadow-md"
                  style={{ backgroundColor: article.categoryColor }}
                >
                  {article.category}
                </span>
                <span className="absolute bottom-2 left-3 text-[10px] text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full font-medium">
                  {article.readTime} • {article.publishedDate}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3
                    onClick={() => onSelectArticle(article)}
                    className="font-display font-bold text-lg text-[#1A1A1A] leading-snug line-clamp-2 hover:text-[#E11D48] cursor-pointer transition-colors"
                  >
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#5B5B5B] line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#F3E5E8]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#F3E5E8]"
                      />
                      <span className="text-[11px] font-semibold text-[#1A1A1A]">
                        {article.author.name}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleLike(article.id)}
                      className="flex items-center gap-1 text-xs text-[#BE123C] hover:scale-110 transition-transform cursor-pointer font-bold"
                      title="Like this story"
                    >
                      <span>❤️</span>
                      <span>{likes[article.id] ?? article.initialLikes}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {article.relatedGenreId && onSelectGenre && (
                      <button
                        onClick={() => onSelectGenre(article.relatedGenreId as any)}
                        className="text-[10px] text-[#BE123C] bg-[#FFF0F3] hover:bg-[#E11D48] hover:text-white px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer"
                      >
                        Book {article.relatedGenreId.toUpperCase()} Artists →
                      </button>
                    )}

                    <button
                      onClick={() => onSelectArticle(article)}
                      className="text-xs font-bold text-[#BE123C] hover:underline cursor-pointer ml-auto"
                    >
                      Read Full Article →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 60-Second Event Tips Carousel ───────────────────────────────── */}
        <div className="bg-[#FFF8F8] border border-[#F3E5E8] rounded-3xl p-6 sm:p-8 space-y-6 mt-12 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#BE123C] bg-[#FFF0F3] px-2.5 py-0.5 rounded-full">
                ⚡ 60-Second Event Masterclass
              </span>
              <h3 className="font-display font-bold text-xl text-[#1A1A1A]">
                Quick Tactical Event Tips
              </h3>
            </div>

            <div className="flex gap-1.5">
              {QUICK_EVENT_TIPS.map((tip, idx) => (
                <button
                  key={tip.id}
                  onClick={() => setActiveTipIdx(idx)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTipIdx === idx
                      ? "bg-[#E11D48] text-white shadow-xs scale-105"
                      : "bg-white text-[#5B5B5B] border border-[#F3E5E8] hover:bg-[#FFF0F3]"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#F3E5E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#E11D48]">💡 Tip #{activeTipIdx + 1}:</span>
                <h4 className="font-display font-bold text-sm text-[#1A1A1A]">
                  {QUICK_EVENT_TIPS[activeTipIdx].title}
                </h4>
              </div>
              <p className="text-xs text-[#5B5B5B] leading-relaxed">
                {QUICK_EVENT_TIPS[activeTipIdx].tip}
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#BE123C] bg-[#FFF0F3] px-3 py-1 rounded-full whitespace-nowrap">
              {QUICK_EVENT_TIPS[activeTipIdx].category}
            </span>
          </div>
        </div>

        {/* ── VIP Backstage Newsletter ────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#180206] via-[#330512] to-[#120106] rounded-3xl p-8 text-white shadow-xl text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-2xl inline-block animate-float">💌</span>
          <h3 className="font-display font-bold text-2xl">
            Join the StageBridge VIP Editorial Backstage
          </h3>
          <p className="text-xs text-white/70 max-w-lg mx-auto">
            Get exclusive soundcheck checklists, seasonal pricing breakdowns, and early invitations to artist showcases directly in your inbox.
          </p>

          {isSubscribed ? (
            <div className="bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-bold py-3 px-6 rounded-2xl inline-block">
              ✓ Thank you! You&apos;re now subscribed to the VIP Backstage Dispatch.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="w-full text-xs bg-white/10 border border-white/20 rounded-full px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </form>
          )}
          {newsletterError && (
            <p className="text-xs text-red-400">{newsletterError}</p>
          )}
        </div>
      </main>
    </div>
  );
}
