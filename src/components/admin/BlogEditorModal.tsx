import { useState, useEffect } from "react";
import { BlogArticle, BlogContentSection } from "../../data/blogData";

interface BlogEditorModalProps {
  article: BlogArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: BlogArticle) => void;
}

const BLOG_CATEGORY_OPTIONS = [
  { id: "Wedding Music", color: "#C4952A" },
  { id: "Event Planning", color: "#9A7219" },
  { id: "Artist Spotlights", color: "#DDB96A" },
  { id: "Sound & Acoustics", color: "#4C0519" },
  { id: "Heritage Traditions", color: "#9A7219" },
] as const;

export function BlogEditorModal({ article, isOpen, onClose, onSave }: BlogEditorModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<BlogArticle["category"]>("Wedding Music");
  const [categoryColor, setCategoryColor] = useState("#C4952A");
  const [readTime, setReadTime] = useState("5 min read");
  const [publishedDate, setPublishedDate] = useState("Feb 25, 2026");
  const [coverImg, setCoverImg] = useState("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format");
  const [featured, setFeatured] = useState(false);
  const [authorName, setAuthorName] = useState("Roshni Malhotra");
  const [authorRole, setAuthorRole] = useState("Lead Wedding Experience Architect");
  const [authorAvatar, setAuthorAvatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format");
  const [tagsInput, setTagsInput] = useState("Wedding, Live Band, Sangeet");
  const [summary, setSummary] = useState("");
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([
    "Curate your evening into 3 distinct energy phases.",
    "Schedule dedicated sound checks 3 hours prior to guest arrival.",
  ]);
  const [sections, setSections] = useState<BlogContentSection[]>([
    {
      sectionHeading: "Setting the Stage and Opening Flow",
      paragraphs: [
        "The opening set sets the tone for the entire celebration. Start with warm acoustic arrangements before building into high-tempo party tracks.",
      ],
      quote: { text: "Resonance matters more than sheer volume.", author: "Roshni Malhotra" },
      proTip: "Pair live percussionists with the sound system for instant energy.",
    },
  ]);
  const [relatedGenre, setRelatedGenre] = useState<"sufi" | "rock" | "gazal" | "bollywood" | "carnival" | "devotional" | "">("bollywood");
  const [coverImageMode, setCoverImageMode] = useState<"upload" | "url">("upload");
  const [avatarImageMode, setAvatarImageMode] = useState<"upload" | "url">("url");

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setCoverImg(ev.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setAuthorAvatar(ev.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSubtitle(article.subtitle);
      setCategory(article.category);
      setCategoryColor(article.categoryColor || "#C4952A");
      setReadTime(article.readTime);
      setPublishedDate(article.publishedDate);
      setCoverImg(article.coverImg);
      setFeatured(Boolean(article.featured));
      setAuthorName(article.author.name);
      setAuthorRole(article.author.role);
      setAuthorAvatar(article.author.avatar);
      setTagsInput(article.tags ? article.tags.join(", ") : "");
      setSummary(article.summary);
      setKeyTakeaways(article.keyTakeaways || []);
      setSections(article.content || []);
      setRelatedGenre(article.relatedGenreId || "");
    } else {
      const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      setTitle("");
      setSubtitle("");
      setCategory("Wedding Music");
      setCategoryColor("#C4952A");
      setReadTime("5 min read");
      setPublishedDate(today);
      setCoverImg("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format");
      setFeatured(false);
      setAuthorName("StageBridge Editorial Team");
      setAuthorRole("Curator & Event Specialist");
      setAuthorAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format");
      setTagsInput("Live Music, Event Planning");
      setSummary("");
      setKeyTakeaways(["Key insight 1", "Key insight 2"]);
      setSections([
        {
          sectionHeading: "Introduction & Context",
          paragraphs: ["Write the detailed guidance for this topic here..."],
        },
      ]);
      setRelatedGenre("bollywood");
    }
  }, [article, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (newCat: BlogArticle["category"]) => {
    setCategory(newCat);
    const found = BLOG_CATEGORY_OPTIONS.find(c => c.id === newCat);
    if (found) setCategoryColor(found.color);
  };

  const handleAddTakeaway = () => {
    setKeyTakeaways(prev => [...prev, ""]);
  };

  const handleUpdateTakeaway = (idx: number, val: string) => {
    setKeyTakeaways(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleRemoveTakeaway = (idx: number) => {
    setKeyTakeaways(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddSection = () => {
    setSections(prev => [
      ...prev,
      {
        sectionHeading: `Section ${prev.length + 1}`,
        paragraphs: [""],
      },
    ]);
  };

  const handleUpdateSectionHeading = (idx: number, heading: string) => {
    setSections(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], sectionHeading: heading };
      return copy;
    });
  };

  const handleUpdateSectionParagraphs = (idx: number, text: string) => {
    setSections(prev => {
      const copy = [...prev];
      const paras = text.split("\n\n").map(s => s.trim()).filter(Boolean);
      copy[idx] = { ...copy[idx], paragraphs: paras.length > 0 ? paras : [text] };
      return copy;
    });
  };

  const handleUpdateSectionProTip = (idx: number, tip: string) => {
    setSections(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], proTip: tip || undefined };
      return copy;
    });
  };

  const handleRemoveSection = (idx: number) => {
    setSections(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const updated: BlogArticle = {
      id: article ? article.id : `blog-${Date.now()}`,
      slug: (title || "article")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      title: title.trim(),
      subtitle: subtitle.trim() || "Expert guide for live event staging and music curation.",
      category,
      categoryColor,
      readTime: readTime || "5 min read",
      publishedDate: publishedDate || "Feb 2026",
      views: article ? article.views : 120,
      initialLikes: article ? article.initialLikes : 15,
      coverImg: coverImg || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format",
      featured,
      author: {
        name: authorName || "StageBridge Curator",
        role: authorRole || "Event Specialist",
        avatar: authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format",
      },
      tags: tags.length > 0 ? tags : ["Event", "Music"],
      summary: summary.trim() || subtitle.trim() || "Detailed insights for event hosts and planners.",
      keyTakeaways: keyTakeaways.filter(Boolean),
      content: sections.length > 0 ? sections : [{ paragraphs: ["Full article content."] }],
      relatedGenreId: relatedGenre ? (relatedGenre as any) : undefined,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-8 border border-white/40 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8DF] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C4952A] to-[#9333EA] flex items-center justify-center text-white text-sm">
              📝
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#1A1A1A]">
                {article ? `Edit Story: ${article.title}` : "Write New Journal Guide"}
              </h2>
              <p className="font-body text-xs text-[#5B5B5B]">
                Publish masterclasses, tech guides, wedding checklists, and backstage interviews
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#F5F0E8] text-[#5B5B5B] hover:text-[#C4952A] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          {/* Section 1: Article Metadata */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE8DF] space-y-4">
            <h3 className="font-display font-bold text-sm text-[#9A7219] uppercase tracking-wider">
              1. Title, Category &amp; Publishing Info
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Article Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. How to Sequence Live Music for a 500-Guest Wedding"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C4952A]/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Subtitle / Deck
              </label>
              <input
                type="text"
                placeholder="e.g. A comprehensive guide on acoustic flow and DJ handoffs..."
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2.5 text-[#1A1A1A]"
              />
            </div>

            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => handleCategoryChange(e.target.value as any)}
                  className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#1A1A1A] cursor-pointer"
                >
                  {BLOG_CATEGORY_OPTIONS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                  Read Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6 min read"
                  value={readTime}
                  onChange={e => setReadTime(e.target.value)}
                  className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                  Publish Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Feb 25, 2026"
                  value={publishedDate}
                  onChange={e => setPublishedDate(e.target.value)}
                  className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                  Featured on Hero
                </label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={e => setFeatured(e.target.checked)}
                    className="rounded text-[#C4952A] focus:ring-[#C4952A]"
                  />
                  <span className="text-xs font-medium text-[#1A1A1A]">Spotlight Hero</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Cover Media & Author */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE8DF] space-y-4">
            <h3 className="font-display font-bold text-sm text-[#9A7219] uppercase tracking-wider">
              2. Cover Photo &amp; Author Credentials
            </h3>

            <div className="grid sm:grid-cols-3 gap-4 items-start">
              <div className="sm:col-span-2 space-y-3">
                {/* Cover Image Uploader */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#3A3A3A]">
                      Article Cover Photo *
                    </label>
                    <div className="flex items-center gap-1 bg-white border border-[#EDE8DF] p-0.5 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => setCoverImageMode("upload")}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                          coverImageMode === "upload"
                            ? "bg-[#C4952A] text-white"
                            : "text-[#5B5B5B] hover:text-[#1A1A1A]"
                        }`}
                      >
                        📁 Upload Cover
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverImageMode("url")}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                          coverImageMode === "url"
                            ? "bg-[#C4952A] text-white"
                            : "text-[#5B5B5B] hover:text-[#1A1A1A]"
                        }`}
                      >
                        🔗 Web URL
                      </button>
                    </div>
                  </div>

                  {coverImageMode === "upload" ? (
                    <div className="relative border-2 border-dashed border-[#E5D5D8] hover:border-[#C4952A] rounded-2xl p-4 bg-white text-center cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="space-y-1">
                        <div className="text-2xl group-hover:scale-110 transition-transform inline-block">
                          🖼️
                        </div>
                        <div className="text-xs font-semibold text-[#1A1A1A]">
                          Upload Cover Image from Computer
                        </div>
                        <div className="text-[10px] text-[#5B5B5B]">
                          PNG, JPG, WEBP (Landscape recommended)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={coverImg}
                      onChange={e => setCoverImg(e.target.value)}
                      className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Roshni Malhotra"
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                      Author Role / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Wedding Experience Architect"
                      value={authorRole}
                      onChange={e => setAuthorRole(e.target.value)}
                      className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                    />
                  </div>
                </div>

                {/* Author Avatar with Upload & URL switch */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#3A3A3A]">
                      Author Avatar Photo
                    </label>
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setAvatarImageMode("upload")}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${
                          avatarImageMode === "upload" ? "text-[#C4952A] font-bold underline" : "text-[#5B5B5B]"
                        }`}
                      >
                        Upload
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => setAvatarImageMode("url")}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${
                          avatarImageMode === "url" ? "text-[#C4952A] font-bold underline" : "text-[#5B5B5B]"
                        }`}
                      >
                        URL
                      </button>
                    </div>
                  </div>

                  {avatarImageMode === "upload" ? (
                    <div className="flex items-center gap-3 bg-white p-2 border border-[#EDE8DF] rounded-xl">
                      <img
                        src={authorAvatar}
                        alt="Avatar preview"
                        className="w-8 h-8 rounded-full object-cover border border-[#EDE8DF]"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="text-xs text-[#5B5B5B] file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#F5F0E8] file:text-[#9A7219] hover:file:bg-[#C4952A] hover:file:text-white cursor-pointer"
                      />
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={authorAvatar}
                      onChange={e => setAuthorAvatar(e.target.value)}
                      className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                    Article Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Sangeet, Live Band, Sound Tech"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Cover Preview */}
              <div className="text-center">
                <span className="block text-[11px] font-semibold text-[#5B5B5B] mb-1">Cover Preview</span>
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-100 border border-[#EDE8DF] shadow-inner relative group">
                  {coverImg ? (
                    <>
                      <img
                        src={coverImg}
                        alt="Article Cover"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImg("")}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400 p-2">
                      <span>No Image</span>
                      <span className="text-[10px] text-gray-400 mt-1">Upload or enter URL</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                Executive Summary
              </label>
              <textarea
                rows={2}
                placeholder="A short, catchy summary shown on cards..."
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Section 3: Key Takeaways Highlights */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE8DF] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-[#9A7219] uppercase tracking-wider">
                  3. Key Takeaways &amp; Executive Summary
                </h3>
                <p className="font-body text-xs text-[#5B5B5B]">
                  Bulleted golden rules shown in the highlighted callout box
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTakeaway}
                className="text-xs font-bold text-[#9A7219] bg-white border border-[#EDE8DF] hover:bg-[#F5F0E8] px-3 py-1.5 rounded-full cursor-pointer transition-colors"
              >
                + Add Point
              </button>
            </div>

            <div className="space-y-2">
              {keyTakeaways.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#EDE8DF]">
                  <span className="text-[#C4952A] font-bold text-sm">✦</span>
                  <input
                    type="text"
                    placeholder="Enter key takeaway point..."
                    value={item}
                    onChange={e => handleUpdateTakeaway(idx, e.target.value)}
                    className="flex-1 text-xs font-body border-0 focus:outline-none text-[#1A1A1A]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTakeaway(idx)}
                    className="text-xs text-red-500 hover:text-red-700 px-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Content Sections Builder */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE8DF] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-[#9A7219] uppercase tracking-wider">
                  4. Structured Content Sections
                </h3>
                <p className="font-body text-xs text-[#5B5B5B]">
                  Add headings, detailed paragraphs, and expert tips
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                className="text-xs font-bold text-[#9A7219] bg-white border border-[#EDE8DF] hover:bg-[#F5F0E8] px-3 py-1.5 rounded-full cursor-pointer transition-colors"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((sec, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-[#EDE8DF] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#9A7219]">
                      Section #{idx + 1}
                    </span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        Remove Section
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5B5B5B] mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Phase 1: The Sundowner Acoustic Prelude"
                      value={sec.sectionHeading || ""}
                      onChange={e => handleUpdateSectionHeading(idx, e.target.value)}
                      className="w-full text-xs font-body border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5B5B5B] mb-1">
                      Body Paragraphs (Separate paragraphs with blank lines)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Write your article explanation here..."
                      value={sec.paragraphs ? sec.paragraphs.join("\n\n") : ""}
                      onChange={e => handleUpdateSectionParagraphs(idx, e.target.value)}
                      className="w-full text-xs font-body border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5B5B5B] mb-1">
                      Optional Pro Tip Callout
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ask the band to prepare customized medley bridges..."
                      value={sec.proTip || ""}
                      onChange={e => handleUpdateSectionProTip(idx, e.target.value)}
                      className="w-full text-xs font-body border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#1A1A1A]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Related Genre Link */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE8DF] space-y-3">
            <h3 className="font-display font-bold text-sm text-[#9A7219] uppercase tracking-wider">
              5. Linked Performer Genre
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1">
                  Connect Performer Genre for Booking CTA
                </label>
                <select
                  value={relatedGenre}
                  onChange={e => setRelatedGenre(e.target.value as any)}
                  className="w-full text-xs font-body bg-white border border-[#EDE8DF] rounded-xl px-3.5 py-2 text-[#1A1A1A] cursor-pointer"
                >
                  <option value="">None</option>
                  <option value="sufi">Sufi &amp; Qawwali</option>
                  <option value="rock">Rock &amp; Indie</option>
                  <option value="gazal">Ghazal Mehfils</option>
                  <option value="bollywood">Bollywood Live</option>
                  <option value="carnival">Carnival &amp; Circus</option>
                  <option value="devotional">Devotional &amp; Bhajans</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-4 pb-2 border-t border-[#EDE8DF] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#EDE8DF] text-xs font-semibold text-[#5B5B5B] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C4952A] to-[#9A7219] text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              {article ? "Save Story Changes" : "Publish to StageBridge Journal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
