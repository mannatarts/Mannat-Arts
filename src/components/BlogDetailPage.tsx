import { useState, useEffect } from "react";
import { BlogArticle, BLOG_ARTICLES } from "../data/blogData";

interface BlogDetailPageProps {
  article: BlogArticle;
  onBack: () => void;
  likes: Record<string, number>;
  onToggleLike: (articleId: string) => void;
  onSelectArticle: (article: BlogArticle) => void;
  onSelectGenre?: (genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
  onBrowseArtists?: () => void;
  allArticles?: BlogArticle[];
}

export function BlogDetailPage({
  article,
  onBack,
  likes,
  onToggleLike,
  onSelectArticle,
  onSelectGenre,
  onBrowseArtists,
  allArticles,
}: BlogDetailPageProps) {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [article.id]);

  const currentLikes = likes[article.id] ?? article.initialLikes;
  const isLiked = (likes[article.id] ?? 0) > article.initialLikes;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sourceArticles = allArticles || BLOG_ARTICLES;
  const otherArticles = sourceArticles.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#1A1A1A]">
      {/* ── Top Dedicated Header / Navigation Bar ────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F3E5E8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* StageBridge Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={onBack}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9333EA] flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93H2c0 4.96 3.57 9.09 8.4 9.83V22h3v-4.24c4.83-.74 8.4-4.87 8.4-9.83h-2c0 4.08-3.06 7.44-7 7.93V15h-1z" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-[#1A1A1A] tracking-tight">StageBridge</span>
            <span className="text-[9px] font-body text-[#E11D48] font-bold tracking-[0.2em] uppercase bg-[#E11D48]/10 px-1.5 py-0.5 rounded-full">Pro</span>
          </div>

          {/* Action Tools: Like & Share & Directory */}
          <div className="flex items-center gap-2.5">
            {/* Like */}
            <button
              onClick={() => onToggleLike(article.id)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isLiked
                  ? "bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white border-transparent shadow-md scale-105"
                  : "border-[#F3E5E8] text-[#5B5B5B] hover:bg-[#FFF0F3] hover:text-[#E11D48]"
              }`}
            >
              <span>❤️</span>
              <span>{currentLikes} Likes</span>
            </button>

            {/* Share */}
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-full border border-[#F3E5E8] hover:bg-[#FFF0F3] text-xs font-medium text-[#5B5B5B] hover:text-[#E11D48] transition-colors cursor-pointer flex items-center gap-1"
            >
              {copied ? <span className="text-emerald-600 font-semibold">✓ Copied</span> : <span>🔗 Share</span>}
            </button>


          </div>
        </div>
      </header>

      {/* ── Main Article Container ────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {/* Title, Subtitle & Metadata */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xs"
              style={{ backgroundColor: article.categoryColor }}
            >
              {article.category}
            </span>
            <span className="text-xs font-medium text-[#7A7A7A]">
              • {article.readTime}
            </span>
            <span className="text-xs font-medium text-[#7A7A7A]">
              • {article.publishedDate}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-[1.18] mb-5">
            {article.title}
          </h1>

          <p className="font-body text-lg sm:text-xl text-[#5B5B5B] leading-relaxed font-normal">
            {article.subtitle}
          </p>
        </div>

        {/* Author Profile Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFF8F8] border border-[#F3E5E8] mb-10">
          <div className="flex items-center gap-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <div className="font-display font-bold text-base text-[#1A1A1A]">
                {article.author.name}
              </div>
              <div className="font-body text-xs text-[#BE123C] font-semibold">
                {article.author.role}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-body text-[#7A7A7A]">
            <div className="bg-white px-3 py-1.5 rounded-full border border-[#F3E5E8]">
              👁️ <strong className="text-[#1A1A1A]">{article.views.toLocaleString()}</strong> reads
            </div>
            <div className="bg-white px-3 py-1.5 rounded-full border border-[#F3E5E8]">
              ❤️ <strong className="text-[#1A1A1A]">{currentLikes}</strong> likes
            </div>
          </div>
        </div>

        {/* Full Featured Cover Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl h-80 sm:h-[480px] bg-gray-900 mb-12">
          <img
            src={article.coverImg}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {article.tags.map(t => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Article Body (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Key Takeaways Box */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="bg-gradient-to-br from-[#FFF0F3] to-[#FFF8F8] border-2 border-[#E11D48]/20 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    ★
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[#BE123C]">
                    Key Takeaways &amp; Executive Summary
                  </h3>
                </div>
                <ul className="space-y-3">
                  {article.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#3A3A3A] font-body leading-relaxed">
                      <span className="text-[#E11D48] font-bold text-lg leading-none mt-0.5">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections Body Content */}
            <div className="space-y-10 font-body text-base sm:text-lg leading-relaxed text-[#333333]">
              {article.content.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-4">
                  {sec.sectionHeading && (
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight pt-3 border-b border-[#F3E5E8] pb-2">
                      {sec.sectionHeading}
                    </h2>
                  )}

                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-[#444444] leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {/* Pull Quote */}
                  {sec.quote && (
                    <blockquote className="my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1F030A] to-[#3B0716] text-white border-l-4 border-[#E11D48] shadow-lg">
                      <p className="font-display italic text-xl sm:text-2xl text-white/95 mb-3 leading-snug">
                        “{sec.quote.text}”
                      </p>
                      <cite className="font-body text-xs uppercase tracking-widest text-[#FB7185] font-semibold not-italic">
                        — {sec.quote.author}
                      </cite>
                    </blockquote>
                  )}

                  {/* Interactive Checklist */}
                  {sec.checklist && sec.checklist.length > 0 && (
                    <div className="my-8 bg-white p-6 rounded-2xl border border-[#F3E5E8] shadow-sm">
                      <div className="font-display font-bold text-base text-[#1A1A1A] mb-4 flex items-center gap-2">
                        <span>📋</span>
                        <span>Organizer Action Checklist (Interactive)</span>
                      </div>
                      <div className="space-y-2.5">
                        {sec.checklist.map((item, cIdx) => {
                          const checkKey = `${article.id}-${sIdx}-${cIdx}`;
                          const isChecked = checkedItems[checkKey] || false;
                          return (
                            <label
                              key={cIdx}
                              onClick={() => toggleCheck(checkKey)}
                              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${
                                isChecked
                                  ? "bg-[#FFF0F3]/70 border-[#E11D48]/30 line-through text-[#8A8A8A]"
                                  : "bg-[#FFFDFD] border-[#F3E5E8] text-[#333333] hover:bg-[#FFF5F6]"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                readOnly
                                className="mt-1 rounded text-[#E11D48] focus:ring-[#E11D48] cursor-pointer"
                              />
                              <span className="text-sm font-medium">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Pro Tip */}
                  {sec.proTip && (
                    <div className="p-5 rounded-2xl bg-[#FFF5F6] border border-[#E11D48]/20 flex items-start gap-3.5 my-6">
                      <span className="text-2xl">💡</span>
                      <div>
                        <span className="font-bold text-xs uppercase tracking-wider text-[#BE123C] block mb-1">
                          StageBridge Pro Tip:
                        </span>
                        <span className="text-sm sm:text-base text-[#4A4A4A] font-medium">
                          {sec.proTip}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Featured Genre CTA Banner */}
            {article.relatedGenreId && (
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE5EC] border-2 border-[#E11D48]/25 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E11D48] bg-[#E11D48]/10 px-3 py-1 rounded-full">
                    Featured in this guide
                  </span>
                  <h4 className="font-display font-bold text-2xl text-[#1A1A1A] mt-2">
                    Book {article.relatedGenreId.toUpperCase()} Performers
                  </h4>
                  <p className="font-body text-xs text-[#5B5B5B] max-w-md">
                    Verified artist profiles, soundclips, transparent pricing, and instant date lock-in.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {onSelectGenre && (
                    <button
                      onClick={() => onSelectGenre(article.relatedGenreId!)}
                      className="font-body font-bold text-xs px-6 py-3.5 rounded-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                    >
                      Explore {article.relatedGenreId.toUpperCase()} Artists →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Author Bio Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#F3E5E8] shadow-sm">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
                About the Author
              </h4>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#F3E5E8]"
                />
                <div>
                  <div className="font-display font-bold text-sm text-[#1A1A1A]">
                    {article.author.name}
                  </div>
                  <div className="font-body text-xs text-[#BE123C]">
                    {article.author.role}
                  </div>
                </div>
              </div>
              <p className="font-body text-xs text-[#5B5B5B] leading-relaxed">
                Contributing editor at StageBridge Journal, specializing in live sound engineering, wedding music sequencing, and classical Indian performance traditions.
              </p>
            </div>

            {/* Quick Summary Pill Card */}
            <div className="bg-[#FFF8F8] p-6 rounded-3xl border border-[#F3E5E8] space-y-3">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#BE123C]">
                Article Synopsis
              </h4>
              <p className="font-body text-xs text-[#5B5B5B] leading-relaxed">
                {article.summary}
              </p>
              <div className="pt-2 border-t border-[#F3E5E8] flex items-center justify-between text-xs font-body text-[#7A7A7A]">
                <span>Category: {article.category}</span>
                <span className="text-[#E11D48] font-bold">{article.readTime}</span>
              </div>
            </div>

            {/* Quick Share & Like CTA Box */}
            <div className="bg-gradient-to-br from-[#1F030A] to-[#3B0716] text-white p-6 rounded-3xl shadow-md space-y-4">
              <h4 className="font-display font-bold text-lg text-white">
                Found this helpful?
              </h4>
              <p className="font-body text-xs text-white/70 leading-relaxed">
                Show love to the author or share this guide with your wedding planner or event committee.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleLike(article.id)}
                  className="flex-1 font-body font-bold text-xs py-2.5 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>❤️</span>
                  <span>{currentLikes} Likes</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex-1 font-body font-bold text-xs py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  {copied ? "✓ Copied" : "🔗 Share"}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Bottom: Related Articles Shelf ──────────────────────────────── */}
        <section className="mt-20 pt-12 border-t border-[#F3E5E8]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#E11D48] uppercase tracking-widest block mb-1">
                ✦ Keep Reading
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1A1A1A]">
                More Guides from StageBridge Journal
              </h3>
            </div>
            <button
              onClick={onBack}
              className="font-body text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer"
            >
              Browse All Stories →
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {otherArticles.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(item)}
                className="group bg-white rounded-3xl overflow-hidden border border-[#F3E5E8] hover:border-[#E11D48]/40 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="h-44 overflow-hidden bg-gray-200 relative">
                  <img
                    src={item.coverImg}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold text-white px-2.5 py-1 rounded-full shadow-sm"
                    style={{ backgroundColor: item.categoryColor }}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <h4 className="font-display font-bold text-base text-[#1A1A1A] group-hover:text-[#E11D48] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-[#7A7A7A] pt-2 border-t border-[#F3E5E8]">
                    <span>{item.readTime}</span>
                    <span className="text-[#E11D48] font-bold">Read Story →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
