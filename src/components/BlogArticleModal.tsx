import { useState, useEffect } from "react";
import { BlogArticle, BLOG_ARTICLES } from "../data/blogData";

interface BlogArticleModalProps {
  article: BlogArticle | null;
  onClose: () => void;
  likes: Record<string, number>;
  onToggleLike: (articleId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  onSelectArticle: (article: BlogArticle) => void;
  onSelectGenre?: (genreId: "sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional") => void;
}

export function BlogArticleModal({
  article,
  onClose,
  likes,
  onToggleLike,
  isBookmarked,
  onToggleBookmark,
  onSelectArticle,
  onSelectGenre,
}: BlogArticleModalProps) {
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!article) return null;

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

  const otherArticles = BLOG_ARTICLES.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-8 border border-white/40 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#F3E5E8] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-sm"
              style={{ backgroundColor: article.categoryColor }}
            >
              {article.category}
            </span>
            <span className="text-xs text-[#7A7A7A] font-medium hidden sm:inline-block">
              • {article.readTime}
            </span>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Font Size Toggle */}
            <button
              onClick={() => setFontSize(f => (f === "normal" ? "large" : "normal"))}
              className="px-2.5 py-1.5 rounded-lg border border-[#F3E5E8] hover:bg-[#FFF0F3] text-xs font-semibold text-[#5B5B5B] hover:text-[#E11D48] transition-colors cursor-pointer"
              title="Toggle reading font size"
            >
              {fontSize === "normal" ? "A+" : "A-"}
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-[#FFF0F3] border-[#E11D48] text-[#E11D48]"
                  : "border-[#F3E5E8] text-[#5B5B5B] hover:bg-[#FFF0F3] hover:text-[#E11D48]"
              }`}
            >
              <span>{isBookmarked ? "🔖 Saved" : "🏷️ Save"}</span>
            </button>

            {/* Like */}
            <button
              onClick={() => onToggleLike(article.id)}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isLiked
                  ? "bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white border-transparent shadow-md scale-105"
                  : "border-[#F3E5E8] text-[#5B5B5B] hover:bg-[#FFF0F3] hover:text-[#E11D48]"
              }`}
            >
              <span>❤️</span>
              <span>{currentLikes}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-full border border-[#F3E5E8] hover:bg-[#FFF0F3] text-xs font-medium text-[#5B5B5B] hover:text-[#E11D48] transition-colors cursor-pointer flex items-center gap-1"
            >
              {copied ? <span className="text-emerald-600 font-semibold">✓ Copied</span> : <span>🔗 Share</span>}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#FFF0F3] text-[#5B5B5B] hover:text-[#E11D48] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-8 space-y-8">
          {/* Article Title & Hero Header */}
          <div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight mb-4">
              {article.title}
            </h1>
            <p className="font-body text-lg text-[#5B5B5B] leading-relaxed mb-6 font-normal">
              {article.subtitle}
            </p>

            {/* Author Profile Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF8F8] border border-[#F3E5E8]">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <div className="font-display font-bold text-sm text-[#1A1A1A]">
                    {article.author.name}
                  </div>
                  <div className="font-body text-xs text-[#BE123C] font-medium">
                    {article.author.role}
                  </div>
                </div>
              </div>
              <div className="text-right font-body text-xs text-[#7A7A7A]">
                <div>Published: {article.publishedDate}</div>
                <div className="text-emerald-600 font-semibold mt-0.5">👁️ {article.views.toLocaleString()} reads</div>
              </div>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg h-72 sm:h-96 bg-gray-900">
            <img
              src={article.coverImg}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map(t => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-white/95 backdrop-blur-md border border-white/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Takeaways Box */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="bg-gradient-to-br from-[#FFF0F3] to-[#FFF8F8] border-2 border-[#E11D48]/20 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-sm font-bold">
                  ★
                </div>
                <h3 className="font-display font-bold text-xl text-[#BE123C]">
                  Key Takeaways &amp; Highlights
                </h3>
              </div>
              <ul className="space-y-2.5">
                {article.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#3A3A3A] font-body leading-relaxed">
                    <span className="text-[#E11D48] font-bold text-base leading-none mt-1">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Content Sections */}
          <div className={`space-y-8 font-body ${fontSize === "large" ? "text-lg leading-loose" : "text-base leading-relaxed"} text-[#2B2B2B]`}>
            {article.content.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-4">
                {sec.sectionHeading && (
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight pt-2">
                    {sec.sectionHeading}
                  </h2>
                )}

                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-[#404040]">
                    {p}
                  </p>
                ))}

                {/* Pull Quote */}
                {sec.quote && (
                  <blockquote className="my-6 p-6 rounded-2xl bg-gradient-to-r from-[#1F030A] to-[#3B0716] text-white border-l-4 border-[#E11D48] shadow-md">
                    <p className="font-display italic text-lg sm:text-xl text-white/95 mb-3">
                      “{sec.quote.text}”
                    </p>
                    <cite className="font-body text-xs uppercase tracking-widest text-[#FB7185] font-semibold not-italic">
                      — {sec.quote.author}
                    </cite>
                  </blockquote>
                )}

                {/* Interactive Checklist */}
                {sec.checklist && sec.checklist.length > 0 && (
                  <div className="my-6 bg-white p-5 rounded-2xl border border-[#F3E5E8] shadow-sm">
                    <div className="font-display font-bold text-sm text-[#1A1A1A] mb-3 flex items-center gap-2">
                      <span>📋</span>
                      <span>Organizer Action Checklist (Interactive)</span>
                    </div>
                    <div className="space-y-2">
                      {sec.checklist.map((item, cIdx) => {
                        const checkKey = `${article.id}-${sIdx}-${cIdx}`;
                        const isChecked = checkedItems[checkKey] || false;
                        return (
                          <label
                            key={cIdx}
                            onClick={() => toggleCheck(checkKey)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors border ${
                              isChecked
                                ? "bg-[#FFF0F3]/60 border-[#E11D48]/30 line-through text-[#8A8A8A]"
                                : "bg-[#FFFDFD] border-[#F3E5E8] text-[#333333] hover:bg-[#FFF5F6]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="mt-1 rounded text-[#E11D48] focus:ring-[#E11D48] cursor-pointer"
                            />
                            <span className="text-xs sm:text-sm font-medium">{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pro Tip */}
                {sec.proTip && (
                  <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#E11D48]/20 flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <span className="font-bold text-xs uppercase tracking-wider text-[#BE123C] block mb-0.5">
                        Pro Tip:
                      </span>
                      <span className="text-xs sm:text-sm text-[#4A4A4A] font-medium">
                        {sec.proTip}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Related Genre & Artist Callout Card */}
          {article.relatedGenreId && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE5EC] border-2 border-[#E11D48]/25 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E11D48] bg-[#E11D48]/10 px-2.5 py-0.5 rounded-full">
                  Featured in this story
                </span>
                <h4 className="font-display font-bold text-xl text-[#1A1A1A]">
                  Ready to book {article.relatedGenreId.toUpperCase()} talent for your event?
                </h4>
                <p className="font-body text-xs text-[#5B5B5B] max-w-md">
                  Explore verified artists with real concert footage, transparent pricing, and instant date lock-in.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {onSelectGenre && (
                  <button
                    onClick={() => {
                      onClose();
                      onSelectGenre(article.relatedGenreId!);
                    }}
                    className="font-body font-bold text-xs px-5 py-3 rounded-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    Explore {article.relatedGenreId.toUpperCase()} Performers →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Related Articles Carousel / Grid */}
          <div className="pt-8 border-t border-[#F3E5E8]">
            <h3 className="font-display font-bold text-2xl text-[#1A1A1A] mb-6">
              More Stories You Might Like
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {otherArticles.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelectArticle(item)}
                  className="group bg-[#FFF8F8] rounded-2xl overflow-hidden border border-[#F3E5E8] hover:border-[#E11D48]/40 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="h-32 overflow-hidden bg-gray-200 relative">
                    <img
                      src={item.coverImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: item.categoryColor }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <h4 className="font-display font-bold text-sm text-[#1A1A1A] group-hover:text-[#E11D48] transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-[#7A7A7A]">
                      <span>{item.readTime}</span>
                      <span className="text-[#E11D48] font-bold">Read →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
