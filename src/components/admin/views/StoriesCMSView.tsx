import { useState, useMemo } from "react";
import { BlogArticle, BLOG_CATEGORIES } from "../../../data/blogData";
import { MediaItem } from "../../../data/cmsTypes";
import { MediaPickerModal } from "../MediaPickerModal";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal";

interface StoriesCMSViewProps {
  articles: BlogArticle[];
  onAddArticle: (article: BlogArticle) => void;
  onUpdateArticle: (article: BlogArticle) => void;
  onDeleteArticle: (id: string) => void;
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
  onPreviewArticle?: (article: BlogArticle) => void;
}

export function StoriesCMSView({
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  mediaList,
  onUploadMedia,
  onShowToast,
  onPreviewArticle,
}: StoriesCMSViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogArticle | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const filtered = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(search.toLowerCase()) ||
        art.summary.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === "all" || art.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [articles, search, selectedCategory]);

  const handleOpenAdd = () => {
    const newArticle: BlogArticle = {
      id: `blog-${Date.now()}`,
      slug: "",
      title: "",
      subtitle: "",
      category: "Wedding Music",
      categoryColor: "#C4952A",
      readTime: "5 min read",
      publishedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      views: 120,
      initialLikes: 14,
      coverImg: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop&auto=format&q=80",
      author: {
        name: "Mannat Editorial Team",
        role: "Cultural Curator",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format&q=80",
      },
      tags: ["Curation", "Live Music"],
      featured: false,
      summary: "",
      keyTakeaways: [],
      content: [
        {
          sectionHeading: "Introduction",
          paragraphs: ["Write your story narrative here..."],
        },
      ],
    };
    setEditingArticle(newArticle);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (art: BlogArticle) => {
    setEditingArticle({ ...art });
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    if (!editingArticle) return;
    if (!editingArticle.title.trim()) {
      onShowToast("Story title is required", "warning");
      return;
    }

    const updated: BlogArticle = {
      ...editingArticle,
      slug: editingArticle.slug || editingArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    const exists = articles.some((a) => a.id === updated.id);
    if (exists) {
      onUpdateArticle(updated);
      onShowToast(`Story "${updated.title}" updated`, "success");
    } else {
      onAddArticle(updated);
      onShowToast(`New story "${updated.title}" published`, "success");
    }
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Stories & Journal CMS</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Curate editorial features, artist spotlights, and cultural traditions articles.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-5 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="font-bold">+</span> Add Story
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EDE8DF] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories by title..."
            className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#C4952A]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#4A4845]"
        >
          <option value="all">All Categories</option>
          {BLOG_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Stories Table */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EDE8DF] text-[11px] font-ui font-semibold text-[#7A776F] uppercase tracking-wider">
                <th className="py-3 px-4">Story</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4">Read Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8DF] text-xs font-ui">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={art.coverImg}
                        alt={art.title}
                        className="w-12 h-9 object-cover rounded-lg border border-[#EDE8DF]"
                      />
                      <div>
                        <p className="font-semibold text-[#1A1916] line-clamp-1">{art.title}</p>
                        <p className="text-[11px] text-[#7A776F] line-clamp-1 max-w-sm">{art.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                      style={{
                        backgroundColor: `${art.categoryColor}15`,
                        color: art.categoryColor,
                        borderColor: `${art.categoryColor}30`,
                      }}
                    >
                      {art.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#4A4845]">{art.author.name}</td>
                  <td className="py-3 px-4 text-[#7A776F]">{art.publishedDate}</td>
                  <td className="py-3 px-4 text-[#7A776F]">{art.readTime}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(art)}
                        className="px-2.5 py-1 text-xs text-[#1A1916] bg-[#FAF7F2] hover:bg-[#EDE8DF] rounded-lg font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onPreviewArticle?.(art)}
                        className="px-2 py-1 text-xs text-[#7A776F] hover:text-[#1A1916]"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setDeleteTarget(art)}
                        className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Story Editor Modal */}
      {isEditorOpen && editingArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full max-w-5xl rounded-3xl shadow-2xl border border-[#EDE8DF] flex flex-col max-h-[92vh] overflow-hidden">
            <div className="px-6 py-4 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">
                  {editingArticle.title ? `Edit Story: ${editingArticle.title}` : "Create New Story"}
                </h3>
                <p className="font-ui text-xs text-[#7A776F]">Editorial content and cover visual — see the live card preview on the right</p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A776F] hover:text-[#1A1916] hover:bg-[#EDE8DF]"
              >
                ✕
              </button>
            </div>

            {/* Two-column body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Form inputs */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-[#EDE8DF] space-y-4">
                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Story Title *
                      </label>
                      <input
                        type="text"
                        value={editingArticle.title}
                        onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                        placeholder="e.g. How Sufi Music Transforms a Wedding Reception"
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Subtitle / Deck
                      </label>
                      <input
                        type="text"
                        value={editingArticle.subtitle}
                        onChange={(e) => setEditingArticle({ ...editingArticle, subtitle: e.target.value })}
                        placeholder="e.g. A deep dive into the soul-stirring world of Qawwali..."
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Category
                        </label>
                        <select
                          value={editingArticle.category}
                          onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                        >
                          <option value="Wedding Music">Wedding Music</option>
                          <option value="Event Planning">Event Planning</option>
                          <option value="Artist Spotlights">Artist Spotlights</option>
                          <option value="Sound & Acoustics">Sound & Acoustics</option>
                          <option value="Heritage Traditions">Heritage Traditions</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Read Time
                        </label>
                        <input
                          type="text"
                          value={editingArticle.readTime}
                          onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                          placeholder="e.g. 5 min read"
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Summary / Abstract
                      </label>
                      <textarea
                        rows={3}
                        value={editingArticle.summary}
                        onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                        placeholder="A short summary shown in search results and story listings..."
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    {/* Cover Image */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-ui text-xs font-semibold text-[#1A1916]">
                          Cover Image
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsMediaPickerOpen(true)}
                          className="font-ui text-xs text-[#C4952A] hover:underline font-semibold"
                        >
                          🖼️ Choose from Media Library
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <img
                          src={editingArticle.coverImg}
                          alt="Story cover"
                          className="w-24 h-16 rounded-xl object-cover border border-[#EDE8DF]"
                        />
                        <input
                          type="text"
                          value={editingArticle.coverImg}
                          onChange={(e) => setEditingArticle({ ...editingArticle, coverImg: e.target.value })}
                          placeholder="Paste image URL or choose from library"
                          className="flex-1 text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C4952A]"
                        />
                      </div>
                    </div>

                    {/* Author */}
                    <div className="pt-2 border-t border-[#EDE8DF]">
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-2">Author Name</label>
                      <input
                        type="text"
                        value={editingArticle.author.name}
                        onChange={(e) => setEditingArticle({ ...editingArticle, author: { ...editingArticle.author, name: e.target.value } })}
                        placeholder="e.g. Mannat Editorial Team"
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="checkbox"
                        id="story-featured"
                        checked={editingArticle.featured || false}
                        onChange={(e) => setEditingArticle({ ...editingArticle, featured: e.target.checked })}
                        className="rounded accent-[#C4952A]"
                      />
                      <label htmlFor="story-featured" className="font-ui text-xs font-semibold text-[#1A1916] cursor-pointer">
                        Feature this story on homepage
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right: Live Preview */}
                <div className="lg:col-span-5">
                  <div className="sticky top-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-ui text-[11px] font-bold text-[#C4952A] tracking-wider uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Blog Card Preview
                      </span>
                      <span className="text-[10px] font-ui text-[#7A776F]">Updates in real-time</span>
                    </div>

                    {/* Blog card replica */}
                    <div className="bg-white rounded-2xl overflow-hidden border border-[#EDE8DF] shadow-md hover:border-[#C4952A]/40 transition-all">
                      {/* Cover */}
                      <div className="relative h-44 overflow-hidden bg-gray-900">
                        <img
                          src={editingArticle.coverImg || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop&auto=format&q=80"}
                          alt={editingArticle.title || "Story cover"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span
                            className="text-[10px] font-ui font-bold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: "#C4952A20", color: "#C4952A", border: "1px solid #C4952A40" }}
                          >
                            {editingArticle.category || "Category"}
                          </span>
                        </div>
                        {editingArticle.featured && (
                          <span className="absolute top-3 right-3 text-[10px] font-ui font-bold px-2.5 py-0.5 rounded-full bg-[#C4952A] text-[#1A1916]">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-serif text-base font-medium text-[#1A1916] line-clamp-2 leading-snug">
                          {editingArticle.title || "Story Title"}
                        </h3>
                        <p className="font-ui text-[11px] text-[#7A776F] line-clamp-2">
                          {editingArticle.subtitle || "Subtitle or deck will appear here..."}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-[#EDE8DF]">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#C4952A]/20 flex items-center justify-center text-[#C4952A] font-bold text-[10px]">
                              {(editingArticle.author.name || "A").charAt(0)}
                            </div>
                            <span className="font-ui text-[11px] text-[#4A4845] font-medium">
                              {editingArticle.author.name || "Author Name"}
                            </span>
                          </div>
                          <span className="font-ui text-[10px] text-[#7A776F]">
                            {editingArticle.readTime || "5 min read"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EDE8DF] text-[11px] font-ui text-[#7A776F]">
                      <p className="font-semibold text-[#1A1916]">Where it appears:</p>
                      <p>This card shows in the Stories & Journal section and on the Blog listing page.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#EDE8DF] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="font-ui text-xs font-semibold px-4 py-2.5 rounded-full border border-[#EDE8DF] text-[#4A4845] hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="font-ui text-xs font-semibold px-6 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-sm"
              >
                Save Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Story?"
        message="This will remove this article from the Mannat Arts Journal."
        itemName={deleteTarget?.title}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteArticle(deleteTarget.id);
            onShowToast(`Deleted "${deleteTarget.title}"`, "warning");
            setDeleteTarget(null);
          }
        }}
      />

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mediaList={mediaList}
        onUploadMedia={onUploadMedia}
        onSelectMedia={(url) => {
          if (editingArticle) setEditingArticle({ ...editingArticle, coverImg: url });
        }}
        title="Select Story Cover Image"
      />
    </div>
  );
}
