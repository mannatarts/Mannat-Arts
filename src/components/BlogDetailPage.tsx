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
    <div className="min-h-screen text-[#1A1916] pb-28" style={{ background: "#FAF7F2", fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* ── Top Dedicated Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EDE8DF] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[68px] flex items-center justify-between">
          <button
            className="flex flex-col leading-none cursor-pointer select-none text-left"
            onClick={onBack}
          >
            <span
              className="font-serif text-[22px] font-light tracking-[0.06em] text-[#1A1916] hover:text-[#C4952A] transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.08em" }}
            >
              MANNAT ARTS
            </span>
            <span className="label-editorial text-[#C4952A] tracking-[0.22em]" style={{ fontSize: "7px" }}>
              CULTURAL STORIES
            </span>
          </button>

          {/* Action Tools: Like & Share */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleLike(article.id)}
              className={`font-ui px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isLiked
                  ? "bg-[#C4952A] text-[#1A1916] shadow-sm"
                  : "bg-[#F5F0E8] text-[#7A776F] hover:text-[#1A1916] border border-[#EDE8DF]"
              }`}
            >
              <span>♥</span>
              <span>{currentLikes} Likes</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="font-ui px-4 py-1.5 rounded-full border border-[#EDE8DF] bg-[#F5F0E8] hover:bg-[#EDE8DF] text-xs font-medium text-[#1A1916] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <span>✓ Link Copied</span> : <span>Share Guide</span>}
            </button>

            <button
              onClick={onBack}
              className="font-ui text-xs font-semibold text-[#7A776F] hover:text-[#1A1916] transition-colors cursor-pointer ml-2"
            >
              ← Back to Journal
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Article Container ────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Title, Subtitle & Metadata */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="label-editorial text-[#C4952A] bg-[#F5F0E8] px-3.5 py-1 rounded-full border border-[#EDE8DF]" style={{ fontSize: "9px" }}>
              {article.category}
            </span>
            <span className="font-ui text-xs text-[#7A776F]">
              • {article.readTime}
            </span>
            <span className="font-ui text-xs text-[#7A776F]">
              • {article.publishedDate}
            </span>
          </div>

          <h1
            className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl text-[#1A1916] leading-[1.12] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {article.title}
          </h1>

          <p className="font-ui text-base sm:text-lg text-[#7A776F] leading-relaxed max-w-3xl">
            {article.subtitle}
          </p>
        </div>

        {/* Author Profile Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#F5F0E8] border border-[#EDE8DF] mb-12">
          <div className="flex items-center gap-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border border-[#EDE8DF]"
            />
            <div>
              <div className="font-ui font-semibold text-sm text-[#1A1916]">
                {article.author.name}
              </div>
              <div className="label-editorial text-[#C4952A]" style={{ fontSize: "8px" }}>
                {article.author.role}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-ui text-[#7A776F]">
            <div className="bg-white px-3 py-1.5 rounded-full border border-[#EDE8DF]">
              👁️ <strong className="text-[#1A1916]">{article.views.toLocaleString()}</strong> reads
            </div>
            <div className="bg-white px-3 py-1.5 rounded-full border border-[#EDE8DF]">
              ♥ <strong className="text-[#1A1916]">{currentLikes}</strong> likes
            </div>
          </div>
        </div>

        {/* Full Featured Cover Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg h-80 sm:h-[460px] bg-gray-900 mb-14">
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
                  className="font-ui px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md border border-white/20"
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
              <div className="bg-[#F5F0E8] border border-[#C4952A]/30 rounded-3xl p-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#C4952A] font-serif text-xl">✦</span>
                  <h3
                    className="font-serif font-light text-xl sm:text-2xl text-[#1A1916]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Key Takeaways &amp; Executive Summary
                  </h3>
                </div>
                <ul className="space-y-3">
                  {article.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#4A4845] font-ui leading-relaxed">
                      <span className="text-[#C4952A] font-bold text-base mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections Body Content */}
            <div className="space-y-10 font-ui text-base leading-relaxed text-[#4A4845]">
              {article.content.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-4">
                  {sec.sectionHeading && (
                    <h2
                      className="font-serif font-light text-2xl sm:text-3xl text-[#1A1916] tracking-tight pt-4 border-b border-[#EDE8DF] pb-3"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {sec.sectionHeading}
                    </h2>
                  )}

                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-[#4A4845] leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {/* Checklist if section has one */}
                  {sec.checklist && sec.checklist.length > 0 && (
                    <div className="bg-[#F5F0E8] border border-[#EDE8DF] rounded-2xl p-5 space-y-3 my-4">
                      <div className="label-editorial text-[#C4952A]" style={{ fontSize: "9px" }}>
                        ACTIONABLE CHECKLIST
                      </div>
                      <div className="space-y-2">
                        {sec.checklist.map((c, i) => (
                          <label
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#EDE8DF] cursor-pointer hover:border-[#C4952A]/40 transition-colors select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checkedItems[`${article.id}-${sIdx}-${i}`] || false}
                              onChange={() => toggleCheck(`${article.id}-${sIdx}-${i}`)}
                              className="mt-0.5 accent-[#C4952A] w-4 h-4 rounded cursor-pointer"
                            />
                            <span className={`font-ui text-xs sm:text-sm ${checkedItems[`${article.id}-${sIdx}-${i}`] ? "line-through text-[#7A776F]" : "text-[#1A1916]"}`}>
                              {c}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar / Aside (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Context Card */}
            <div className="bg-[#F5F0E8] rounded-2xl p-6 border border-[#EDE8DF] space-y-4">
              <span className="label-editorial text-[#C4952A]" style={{ fontSize: "9px" }}>
                ABOUT THIS GUIDE
              </span>
              <div className="space-y-3 text-xs font-ui text-[#7A776F]">
                <div className="flex justify-between pb-2 border-b border-[#EDE8DF]">
                  <span>Tradition:</span>
                  <strong className="text-[#1A1916]">{article.category}</strong>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#EDE8DF]">
                  <span>Reading Duration:</span>
                  <strong className="text-[#1A1916]">{article.readTime}</strong>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#EDE8DF]">
                  <span>Curator:</span>
                  <strong className="text-[#1A1916]">{article.author.name}</strong>
                </div>
              </div>

              {article.relatedGenreId && onSelectGenre && (
                <button
                  onClick={() => onSelectGenre(article.relatedGenreId as any)}
                  className="w-full py-3 rounded-full bg-[#1A1916] hover:bg-[#2E2C28] text-[#FAF7F2] font-ui text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  Explore {article.relatedGenreId.toUpperCase()} Ensembles →
                </button>
              )}
            </div>

            {/* Quick Share Box */}
            <div className="bg-[#1A1916] text-white p-7 rounded-3xl shadow-md space-y-4">
              <h4
                className="font-serif font-light text-xl text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Found this helpful?
              </h4>
              <p className="font-ui text-xs text-[#A8A49A] leading-relaxed">
                Show your appreciation or share this masterclass with your event planning committee.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleLike(article.id)}
                  className="flex-1 font-ui font-semibold text-xs py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>♥</span>
                  <span>{currentLikes} Likes</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex-1 font-ui font-semibold text-xs py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  {copied ? "✓ Copied" : "Share"}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Bottom: Related Articles Shelf ──────────────────────────────── */}
        <section className="mt-20 pt-12 border-t border-[#EDE8DF]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="label-editorial text-[#C4952A] tracking-widest block mb-1" style={{ fontSize: "9px" }}>
                · KEEP READING ·
              </span>
              <h3
                className="font-serif font-light text-2xl sm:text-3xl text-[#1A1916]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                More from the Mannat Arts Journal
              </h3>
            </div>
            <button
              onClick={onBack}
              className="font-ui text-xs font-semibold text-[#1A1916] hover:text-[#C4952A] cursor-pointer"
            >
              Browse All Stories →
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {otherArticles.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(item)}
                className="group bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EDE8DF] hover:border-[#C4952A]/40 shadow-sm hover:shadow-xl transition-all duration-400 cursor-pointer flex flex-col lift-card"
              >
                <div className="h-44 overflow-hidden bg-gray-200 relative img-zoom">
                  <img
                    src={item.coverImg}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 label-editorial text-[8px] bg-white text-[#1A1916] px-2.5 py-1 rounded-full shadow-sm font-bold">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <h4
                    className="font-serif font-light text-lg text-[#1A1916] group-hover:text-[#C4952A] transition-colors line-clamp-2 leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-[#7A776F] pt-2 border-t border-[#EDE8DF]">
                    <span>{item.readTime}</span>
                    <span className="font-ui text-xs font-semibold text-[#1A1916]">Read Guide →</span>
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
