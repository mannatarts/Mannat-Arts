import { useState, useMemo } from "react";
import {
  BlogArticle,
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  QUICK_EVENT_TIPS,
} from "../data/blogData";

interface BlogSectionProps {
  onSelectArticle: (article: BlogArticle) => void;
  likes: Record<string, number>;
  onToggleLike: (articleId: string) => void;
  onSelectGenre?: (genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
  articles?: BlogArticle[];
}

export function BlogSection({
  onSelectArticle,
  likes,
  onToggleLike,
  onSelectGenre,
  articles,
}: BlogSectionProps) {
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
          a.summary.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q)) ||
          a.author.name.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === "popular") {
      result.sort((a, b) => b.views - a.views);
    } else if (sortBy === "likes") {
      result.sort((a, b) => {
        const likesA = likes[a.id] ?? a.initialLikes;
        const likesB = likes[b.id] ?? b.initialLikes;
        return likesB - likesA;
      });
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, likes]);

  // Featured article (first featured or first match)
  const featuredArticle = useMemo(() => {
    return filteredArticles.find(a => a.featured) || filteredArticles[0];
  }, [filteredArticles]);

  const gridArticles = useMemo(() => {
    if (!featuredArticle) return [];
    return filteredArticles.filter(a => a.id !== featuredArticle.id);
  }, [filteredArticles, featuredArticle]);

  return (
    <section id="blog" className="bg-[#FFFDFD] py-24 relative overflow-hidden border-b border-[#F3E5E8]">
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-[#E11D48]/05 to-transparent rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-radial from-[#BE123C]/05 to-transparent rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase mb-4 border border-[#E11D48]/30 bg-[#E11D48]/10 text-[#E11D48]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
            ✦ StageBridge Journal &amp; Event Guides
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            Curated Insights &amp;{" "}
            <span className="text-gradient-crimson italic">Backstage Stories</span>
          </h2>
          <p className="font-body text-[#5B5B5B] text-lg max-w-2xl mx-auto">
            Expert guides on staging unforgettable concerts, wedding music coordination, acoustic riders, and deep dives into Indian musical traditions.
          </p>
        </div>

        {/* Category Filter Pills & Interactive Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {BLOG_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`font-body text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white border-transparent shadow-md shadow-[#E11D48]/20 scale-105"
                      : "bg-white text-[#5B5B5B] border-[#F3E5E8] hover:bg-[#FFF0F3] hover:text-[#E11D48]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <input
                type="text"
                placeholder="Search stories, tips..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full font-body text-xs bg-white border border-[#F3E5E8] rounded-full pl-8 pr-3 py-2 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 focus:border-[#E11D48]"
              />
              <svg
                className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as "latest" | "popular" | "likes")}
              className="font-body text-xs bg-white border border-[#F3E5E8] rounded-full px-3 py-2 text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 cursor-pointer"
            >
              <option value="latest">Latest First</option>
              <option value="popular">Most Read</option>
              <option value="likes">Most Liked ❤️</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-[#FFF8F8] rounded-3xl border border-[#F3E5E8] p-8 max-w-lg mx-auto">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-display font-bold text-xl text-[#1A1A1A] mb-2">
              No matching stories found
            </h3>
            <p className="font-body text-xs text-[#5B5B5B] mb-6">
              Try adjusting your search keywords or switching category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="font-body text-xs font-bold text-white bg-[#E11D48] px-5 py-2.5 rounded-full hover:bg-[#BE123C] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* HERO FEATURED STORY SPOTLIGHT */}
            {featuredArticle && (
              <div className="mb-12 bg-white rounded-3xl overflow-hidden border border-[#F3E5E8] shadow-md hover:shadow-xl transition-all duration-300">
                <div className="grid lg:grid-cols-12 gap-0">
                  {/* Hero Left: Image */}
                  <div
                    onClick={() => onSelectArticle(featuredArticle)}
                    className="lg:col-span-7 relative h-72 lg:h-[430px] overflow-hidden bg-gray-900 cursor-pointer group"
                  >
                    <img
                      src={featuredArticle.coverImg}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Badges on image */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="font-body text-[11px] font-bold text-white bg-[#E11D48] px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <span>★</span>
                        <span>Editor's Spotlight</span>
                      </span>
                      <span
                        className="font-body text-[11px] font-semibold text-white/95 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20"
                      >
                        {featuredArticle.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 font-body text-xs">
                      <span>{featuredArticle.readTime}</span>
                      <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                        👁️ {featuredArticle.views.toLocaleString()} reads
                      </span>
                    </div>
                  </div>

                  {/* Hero Right: Content & Interactivity */}
                  <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-br from-[#FFFDFD] to-[#FFF8F8]">
                    <div className="space-y-4">
                      {/* Author Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={featuredArticle.author.avatar}
                            alt={featuredArticle.author.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#F3E5E8]"
                          />
                          <div>
                            <div className="font-display font-bold text-xs text-[#1A1A1A]">
                              {featuredArticle.author.name}
                            </div>
                            <div className="font-body text-[11px] text-[#BE123C]">
                              {featuredArticle.author.role}
                            </div>
                          </div>
                        </div>

                        <span
                          className="font-body text-[10px] font-bold uppercase tracking-wider text-[#BE123C] bg-[#FFF0F3] px-2.5 py-1 rounded-full border border-[#F3E5E8]"
                        >
                          {featuredArticle.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onSelectArticle(featuredArticle)}
                        className="font-display text-2xl lg:text-3xl font-bold text-[#1A1A1A] leading-snug hover:text-[#E11D48] cursor-pointer transition-colors"
                      >
                        {featuredArticle.title}
                      </h3>

                      {/* Summary */}
                      <p className="font-body text-[#5B5B5B] text-sm leading-relaxed line-clamp-3">
                        {featuredArticle.summary}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {featuredArticle.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="font-body text-[11px] font-medium bg-[#FFF0F3] text-[#BE123C] px-2.5 py-0.5 rounded-full border border-[#F3E5E8]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#F3E5E8]">
                      {/* Like button */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onToggleLike(featuredArticle.id);
                        }}
                        className="font-body text-xs font-semibold px-3 py-1.5 rounded-full border border-[#F3E5E8] hover:border-[#E11D48]/30 hover:bg-[#FFF0F3] flex items-center gap-1.5 transition-colors cursor-pointer text-[#4A4A4A]"
                      >
                        <span>❤️</span>
                        <span>{likes[featuredArticle.id] ?? featuredArticle.initialLikes}</span>
                      </button>

                      {/* CTA Read */}
                      <button
                        onClick={() => onSelectArticle(featuredArticle)}
                        className="font-body font-bold text-xs px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Read Full Guide</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REMAINING ARTICLES GRID */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {gridArticles.map(article => {
                  const currentLikes = likes[article.id] ?? article.initialLikes;

                  return (
                    <div
                      key={article.id}
                      className="bg-white rounded-3xl overflow-hidden border border-[#F3E5E8] shadow-sm hover:shadow-xl transition-all duration-300 card-hover-ruby flex flex-col group"
                    >
                      {/* Image Header */}
                      <div
                        onClick={() => onSelectArticle(article)}
                        className="relative h-48 overflow-hidden bg-gray-100 cursor-pointer"
                      >
                        <img
                          src={article.coverImg}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        
                        <span
                          className="absolute top-3 left-3 text-[11px] font-bold text-white px-3 py-1 rounded-full shadow-md"
                          style={{ backgroundColor: article.categoryColor }}
                        >
                          {article.category}
                        </span>

                        <span className="absolute bottom-2.5 left-3 text-[11px] text-white/90 font-body font-medium">
                          {article.readTime}
                        </span>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3
                            onClick={() => onSelectArticle(article)}
                            className="font-display font-bold text-lg text-[#1A1A1A] leading-snug hover:text-[#E11D48] transition-colors cursor-pointer line-clamp-2"
                          >
                            {article.title}
                          </h3>
                          <p className="font-body text-xs text-[#5B5B5B] leading-relaxed line-clamp-2">
                            {article.summary}
                          </p>
                        </div>

                        {/* Author & Footer */}
                        <div className="pt-3 border-t border-[#F3E5E8] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={article.author.avatar}
                              alt={article.author.name}
                              className="w-7 h-7 rounded-full object-cover border border-[#F3E5E8]"
                            />
                            <span className="font-body text-xs text-[#5B5B5B] font-medium truncate max-w-[110px]">
                              {article.author.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                onToggleLike(article.id);
                              }}
                              className="text-xs font-body font-semibold text-[#5B5B5B] hover:text-[#E11D48] flex items-center gap-1 cursor-pointer"
                            >
                              <span>❤️</span>
                              <span>{currentLikes}</span>
                            </button>

                            <button
                              onClick={() => onSelectArticle(article)}
                              className="text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer ml-1"
                            >
                              Read →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* INTERACTIVE 60-SECOND EVENT PLANNER TIPS & VIP NEWSLETTER */}
        <div className="grid lg:grid-cols-12 gap-8 pt-4">
          {/* Quick Tips Interactive Accordion/Selector */}
          <div className="lg:col-span-7 bg-[#FFF5F6] rounded-3xl p-6 lg:p-8 border border-[#E11D48]/20">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">⚡</span>
              <div>
                <h3 className="font-display font-bold text-xl text-[#1A1A1A]">
                  60-Second Event Management Tips
                </h3>
                <p className="font-body text-xs text-[#5B5B5B]">
                  Quick tactical insights for seamless live performances
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {QUICK_EVENT_TIPS.map((tipItem, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTipIdx(idx)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    activeTipIdx === idx
                      ? "bg-white border-[#E11D48] shadow-md -translate-y-0.5"
                      : "bg-white/60 border-[#F3E5E8] hover:bg-white hover:border-[#E11D48]/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{tipItem.icon}</span>
                    <span className="font-display font-bold text-xs text-[#1A1A1A]">
                      {tipItem.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#BE123C] uppercase tracking-wider block mb-1">
                    {tipItem.category}
                  </span>
                  <p className="font-body text-xs text-[#5B5B5B] leading-relaxed">
                    {tipItem.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Backstage VIP Newsletter Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1F030A] via-[#3B0716] to-[#0F0104] text-white rounded-3xl p-6 lg:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E11D48]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/10 text-[#FB7185] border border-white/15">
                <span>📩</span>
                <span>VIP Backstage Pass</span>
              </div>

              <h3 className="font-display text-2xl font-bold leading-snug">
                Never Miss a Curated Guide or Exclusive Playlist
              </h3>

              <p className="font-body text-xs text-white/70 leading-relaxed">
                Join 12,000+ event planners, wedding hosts, and concert organizers receiving our weekly artist curations and sound staging checklists.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              {isSubscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center animate-fadeIn">
                  <span className="text-2xl block mb-1">🎉</span>
                  <div className="font-display font-bold text-sm text-emerald-300">
                    {"You're on the VIP Guest List!"}
                  </div>
                  <p className="font-body text-xs text-white/80 mt-1">
                    Check your inbox for our 2026 Sangeet &amp; Concert Curation Masterclass.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your work or personal email..."
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                      className="w-full font-body text-xs bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:border-transparent"
                    />
                  </div>

                  {newsletterError && (
                    <p className="text-[11px] text-[#FB7185] font-medium">{newsletterError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full font-body font-bold text-xs py-3 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#F43F5E] text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    ✦ Get Free Event Curation Guides
                  </button>
                  <p className="font-body text-[10px] text-white/40 text-center">
                    No spam ever. Unsubscribe with 1-click anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
