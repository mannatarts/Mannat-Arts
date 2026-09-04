import { useState, useMemo } from "react";
import { Experience, MoodItem, OccasionItem, MediaItem } from "../../../data/cmsTypes";
import { GenreInfo } from "../../../data/artistsData";
import { MediaPickerModal } from "../MediaPickerModal";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal";

interface ExperiencesCMSViewProps {
  experiences: Experience[];
  genres: Record<string, GenreInfo>;
  moods: MoodItem[];
  occasions: OccasionItem[];
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  onAddExperience: (exp: Experience) => void;
  onUpdateExperience: (exp: Experience) => void;
  onDeleteExperience: (id: string) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
  onPreviewExperience?: (exp: Experience) => void;
}

export function ExperiencesCMSView({
  experiences,
  genres,
  moods,
  occasions,
  mediaList,
  onUploadMedia,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
  onShowToast,
  onPreviewExperience,
}: ExperiencesCMSViewProps) {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedMood, setSelectedMood] = useState("all");
  const [selectedOccasion, setSelectedOccasion] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "published" | "draft" | "scheduled">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<"basic" | "classification" | "media" | "event" | "seo" | "publishing">("basic");
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Filtered experiences
  const filtered = useMemo(() => {
    return experiences.filter((exp) => {
      const matchesSearch =
        exp.name.toLowerCase().includes(search.toLowerCase()) ||
        exp.shortDesc.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = selectedGenre === "all" || exp.genres.includes(selectedGenre);
      const matchesMood = selectedMood === "all" || exp.moods.includes(selectedMood);
      const matchesOccasion = selectedOccasion === "all" || exp.occasions.includes(selectedOccasion);
      const matchesStatus = selectedStatus === "all" || exp.status === selectedStatus;
      return matchesSearch && matchesGenre && matchesMood && matchesOccasion && matchesStatus;
    });
  }, [experiences, search, selectedGenre, selectedMood, selectedOccasion, selectedStatus]);

  // Bulk actions
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((e) => e.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkPublish = () => {
    selectedIds.forEach((id) => {
      const target = experiences.find((e) => e.id === id);
      if (target) onUpdateExperience({ ...target, status: "published" });
    });
    onShowToast(`Published ${selectedIds.length} experiences`, "success");
    setSelectedIds([]);
  };

  const handleBulkUnpublish = () => {
    selectedIds.forEach((id) => {
      const target = experiences.find((e) => e.id === id);
      if (target) onUpdateExperience({ ...target, status: "draft" });
    });
    onShowToast(`Unpublished ${selectedIds.length} experiences`, "info");
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => onDeleteExperience(id));
    onShowToast(`Deleted ${selectedIds.length} experiences`, "warning");
    setSelectedIds([]);
  };

  // Single Actions
  const handleOpenAdd = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      name: "",
      shortDesc: "",
      fullDesc: "",
      genres: ["sufi"],
      moods: ["reflect"],
      occasions: ["Wedding"],
      coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format&q=80",
      gallery: [],
      duration: "90 - 120 minutes",
      audienceSize: "50 - 300 guests",
      location: "Indoor / Outdoor Pavilion",
      performanceType: "Live Ensemble",
      isFeatured: false,
      status: "draft",
      seoTitle: "",
      seoDesc: "",
      slug: "",
      artistIds: [],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setEditingExp(newExp);
    setActiveEditorTab("basic");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp({ ...exp });
    setActiveEditorTab("basic");
    setIsEditorOpen(true);
  };

  const handleDuplicate = (exp: Experience) => {
    const dup: Experience = {
      ...exp,
      id: `exp-${Date.now()}`,
      name: `${exp.name} (Copy)`,
      slug: `${exp.slug}-copy`,
      status: "draft",
      updatedAt: new Date().toISOString().split("T")[0],
    };
    onAddExperience(dup);
    onShowToast(`Duplicated "${exp.name}"`, "success");
  };

  const handleTogglePublish = (exp: Experience) => {
    const nextStatus = exp.status === "published" ? "draft" : "published";
    onUpdateExperience({ ...exp, status: nextStatus });
    onShowToast(`Status changed to ${nextStatus}`, "info");
  };

  const handleSaveExp = (publishStatus?: "draft" | "published") => {
    if (!editingExp) return;
    if (!editingExp.name.trim()) {
      onShowToast("Please provide an experience name", "warning");
      return;
    }

    const updated: Experience = {
      ...editingExp,
      status: publishStatus || editingExp.status,
      slug: editingExp.slug || editingExp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      seoTitle: editingExp.seoTitle || `${editingExp.name} | Mannat Arts`,
      seoDesc: editingExp.seoDesc || editingExp.shortDesc,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    const exists = experiences.some((e) => e.id === updated.id);
    if (exists) {
      onUpdateExperience(updated);
      onShowToast(`Experience "${updated.name}" updated`, "success");
    } else {
      onAddExperience(updated);
      onShowToast(`New experience "${updated.name}" created`, "success");
    }
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Artistic Experiences</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Curate signature performance experiences connecting mood, occasion, and genre.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-5 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="font-bold">+</span> Add Experience
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EDE8DF] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiences..."
            className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#C4952A]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#4A4845]"
          >
            <option value="all">All Genres</option>
            {Object.entries(genres).map(([key, g]) => (
              <option key={key} value={key}>{g.title}</option>
            ))}
          </select>

          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#4A4845]"
          >
            <option value="all">All Moods</option>
            {moods.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          <select
            value={selectedOccasion}
            onChange={(e) => setSelectedOccasion(e.target.value)}
            className="text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#4A4845]"
          >
            <option value="all">All Occasions</option>
            {occasions.map((o) => (
              <option key={o.id} value={o.label}>{o.label}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#4A4845]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar (conditional) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#1A1916] text-[#FAF7F2] px-5 py-3 rounded-xl flex items-center justify-between animate-fadeIn text-xs font-ui">
          <span className="font-semibold">{selectedIds.length} selected</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkPublish}
              className="bg-[#C4952A] text-[#1A1916] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#DDB96A]"
            >
              Publish Selected
            </button>
            <button
              onClick={handleBulkUnpublish}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg"
            >
              Unpublish
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table / Card Hybrid List */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">✨</div>
            <h4 className="font-serif text-lg font-medium text-[#1A1916]">No experiences found</h4>
            <p className="font-ui text-xs text-[#7A776F] max-w-sm mx-auto mt-1 mb-4">
              Start building your collection of artistic performance experiences.
            </p>
            <button
              onClick={handleOpenAdd}
              className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-5 py-2.5 rounded-full"
            >
              + Add Experience
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#EDE8DF] text-[11px] font-ui font-semibold text-[#7A776F] uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                      onChange={handleToggleSelectAll}
                      className="rounded accent-[#C4952A]"
                    />
                  </th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Genre</th>
                  <th className="py-3 px-4">Mood</th>
                  <th className="py-3 px-4">Occasions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8DF] text-xs font-ui">
                {filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#FAF7F2]/60 transition-colors group">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(exp.id)}
                        onChange={() => handleToggleSelect(exp.id)}
                        className="rounded accent-[#C4952A]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={exp.coverImage}
                          alt={exp.name}
                          className="w-12 h-10 object-cover rounded-lg border border-[#EDE8DF]"
                        />
                        <div>
                          <p className="font-semibold text-[#1A1916] group-hover:text-[#C4952A] transition-colors">
                            {exp.name}
                          </p>
                          <p className="text-[11px] text-[#7A776F] line-clamp-1 max-w-xs">{exp.shortDesc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#4A4845] border border-[#EDE8DF] text-[10px] font-medium">
                        {exp.genres.join(", ")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium">
                        {exp.moods.join(", ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#7A776F]">
                      {exp.occasions.slice(0, 2).join(", ")}
                      {exp.occasions.length > 2 && ` +${exp.occasions.length - 2}`}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                          exp.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-[#FAF7F2] text-[#7A776F] border border-[#EDE8DF]"
                        }`}
                      >
                        {exp.status === "published" ? "● Published" : "○ Draft"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#7A776F] whitespace-nowrap">
                      {exp.updatedAt}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="px-2.5 py-1 text-xs text-[#1A1916] bg-[#FAF7F2] hover:bg-[#EDE8DF] rounded-lg font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublish(exp)}
                          className="px-2 py-1 text-[11px] text-[#7A776F] hover:text-[#1A1916] hover:bg-[#FAF7F2] rounded-lg"
                        >
                          {exp.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleDuplicate(exp)}
                          className="px-2 py-1 text-[11px] text-[#7A776F] hover:text-[#1A1916] hover:bg-[#FAF7F2] rounded-lg"
                          title="Duplicate"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => setDeleteTarget(exp)}
                          className="px-2 py-1 text-[11px] text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
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
        )}
      </div>

      {/* Experience Editor Modal */}
      {isEditorOpen && editingExp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full max-w-6xl rounded-3xl shadow-2xl border border-[#EDE8DF] flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">
                  {editingExp.name ? `Edit: ${editingExp.name}` : "Create New Experience"}
                </h3>
                <p className="font-ui text-xs text-[#7A776F]">
                  Configure discovery classifications, narrative, and preview the live public card in real time.
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A776F] hover:text-[#1A1916] hover:bg-[#EDE8DF]"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 py-2.5 bg-[#F5F0E8] border-b border-[#EDE8DF] flex items-center gap-2 overflow-x-auto text-xs font-ui">
              {[
                { id: "basic", label: "1. Basic Info" },
                { id: "classification", label: "2. Mood & Genre Matrix" },
                { id: "media", label: "3. Media & Imagery" },
                { id: "event", label: "4. Event Specs" },
                { id: "seo", label: "5. SEO & Social" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveEditorTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                    activeEditorTab === t.id
                      ? "bg-[#1A1916] text-white"
                      : "text-[#7A776F] hover:text-[#1A1916]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Body: Split into Left Inputs (7 cols) and Right Live Preview (5 cols) */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Form Inputs */}
                <div className="lg:col-span-7 space-y-4">
              {activeEditorTab === "basic" && (
                <div className="space-y-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Experience Name *
                    </label>
                    <input
                      type="text"
                      value={editingExp.name}
                      onChange={(e) => setEditingExp({ ...editingExp, name: e.target.value })}
                      placeholder="e.g. Sufi Evening with Live Qawwals"
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                    />
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Short Tagline (Shown on cards)
                    </label>
                    <input
                      type="text"
                      value={editingExp.shortDesc}
                      onChange={(e) => setEditingExp({ ...editingExp, shortDesc: e.target.value })}
                      placeholder="e.g. Soulful mystic poetry and acoustic qawwalis."
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                    />
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Full Experience Narrative
                    </label>
                    <textarea
                      rows={5}
                      value={editingExp.fullDesc}
                      onChange={(e) => setEditingExp({ ...editingExp, fullDesc: e.target.value })}
                      placeholder="Describe the atmosphere, guest journey, instruments, and emotional climax..."
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="featured-toggle"
                      checked={editingExp.isFeatured}
                      onChange={(e) => setEditingExp({ ...editingExp, isFeatured: e.target.checked })}
                      className="rounded accent-[#C4952A]"
                    />
                    <label htmlFor="featured-toggle" className="font-ui text-xs font-semibold text-[#1A1916] cursor-pointer">
                      Feature on Homepage Curated Showcase
                    </label>
                  </div>
                </div>
              )}

              {activeEditorTab === "classification" && (
                <div className="space-y-5 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-2">
                      Artistic Genres (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(genres).map((genreKey) => {
                        const isSelected = editingExp.genres.includes(genreKey);
                        return (
                          <button
                            key={genreKey}
                            type="button"
                            onClick={() => {
                              const next = isSelected
                                ? editingExp.genres.filter((g) => g !== genreKey)
                                : [...editingExp.genres, genreKey];
                              setEditingExp({ ...editingExp, genres: next });
                            }}
                            className={`font-ui text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                              isSelected
                                ? "bg-[#1A1916] text-white border-[#1A1916]"
                                : "bg-[#FAF7F2] text-[#4A4845] border-[#EDE8DF] hover:border-[#C4952A]"
                            }`}
                          >
                            {genres[genreKey].title}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-2">
                      Mood Entrypoints (Emotional tone)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {moods.map((m) => {
                        const isSelected = editingExp.moods.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              const next = isSelected
                                ? editingExp.moods.filter((id) => id !== m.id)
                                : [...editingExp.moods, m.id];
                              setEditingExp({ ...editingExp, moods: next });
                            }}
                            className={`font-ui text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                              isSelected
                                ? "bg-[#C4952A] text-white border-[#C4952A]"
                                : "bg-[#FAF7F2] text-[#4A4845] border-[#EDE8DF] hover:border-[#C4952A]"
                            }`}
                          >
                            {m.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-2">
                      Suitable Occasions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {occasions.map((o) => {
                        const isSelected = editingExp.occasions.includes(o.label);
                        return (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => {
                              const next = isSelected
                                ? editingExp.occasions.filter((occ) => occ !== o.label)
                                : [...editingExp.occasions, o.label];
                              setEditingExp({ ...editingExp, occasions: next });
                            }}
                            className={`font-ui text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                              isSelected
                                ? "bg-emerald-800 text-white border-emerald-800"
                                : "bg-[#FAF7F2] text-[#4A4845] border-[#EDE8DF] hover:border-[#C4952A]"
                            }`}
                          >
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeEditorTab === "media" && (
                <div className="space-y-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-ui text-xs font-semibold text-[#1A1916]">
                        Cover Photo
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
                        src={editingExp.coverImage}
                        alt="Cover preview"
                        className="w-32 h-24 object-cover rounded-xl border border-[#EDE8DF]"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editingExp.coverImage}
                          onChange={(e) => setEditingExp({ ...editingExp, coverImage: e.target.value })}
                          placeholder="Image URL"
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2"
                        />
                        <p className="font-ui text-[10px] text-[#7A776F] mt-1">
                          Recommended ratio: 4:3 or 16:9 high resolution.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Performance Video URL (YouTube / Vimeo / MP4)
                    </label>
                    <input
                      type="text"
                      value={editingExp.videoUrl || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    />
                  </div>
                </div>
              )}

              {activeEditorTab === "event" && (
                <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Performance Duration
                    </label>
                    <input
                      type="text"
                      value={editingExp.duration}
                      onChange={(e) => setEditingExp({ ...editingExp, duration: e.target.value })}
                      placeholder="e.g. 90 - 120 minutes"
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Ideal Audience Size
                    </label>
                    <input
                      type="text"
                      value={editingExp.audienceSize}
                      onChange={(e) => setEditingExp({ ...editingExp, audienceSize: e.target.value })}
                      placeholder="e.g. 50 - 400 guests"
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Venue Setup / Location Type
                    </label>
                    <input
                      type="text"
                      value={editingExp.location}
                      onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                      placeholder="e.g. Indoor Ballroom / Heritage Courtyard"
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Performance Format
                    </label>
                    <input
                      type="text"
                      value={editingExp.performanceType}
                      onChange={(e) => setEditingExp({ ...editingExp, performanceType: e.target.value })}
                      placeholder="e.g. Live Troupe (4-6 Piece Ensemble)"
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    />
                  </div>
                </div>
              )}

              {activeEditorTab === "seo" && (
                <div className="space-y-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Page URL (Slug)
                    </label>
                    <div className="flex items-center text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#7A776F]">
                      <span>mannatarts.netlify.app/experiences/</span>
                      <input
                        type="text"
                        value={editingExp.slug}
                        onChange={(e) => setEditingExp({ ...editingExp, slug: e.target.value })}
                        className="flex-1 bg-transparent border-none outline-none text-[#1A1916] font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Google Search Title
                    </label>
                    <input
                      type="text"
                      value={editingExp.seoTitle}
                      onChange={(e) => setEditingExp({ ...editingExp, seoTitle: e.target.value })}
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingExp.seoDesc}
                      onChange={(e) => setEditingExp({ ...editingExp, seoDesc: e.target.value })}
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    />
                  </div>

                  {/* Google Preview Snippet */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EDE8DF]">
                    <span className="text-[10px] font-semibold text-[#7A776F] uppercase tracking-wider block mb-1">
                      Google Search Preview
                    </span>
                    <p className="text-[#1A0DAB] font-medium text-sm hover:underline cursor-pointer">
                      {editingExp.seoTitle || editingExp.name || "Experience Title"}
                    </p>
                    <p className="text-[#006621] text-[11px]">
                      mannatarts.netlify.app/experiences/{editingExp.slug || "url-path"}
                    </p>
                    <p className="text-[#545454] text-xs line-clamp-2 mt-0.5">
                      {editingExp.seoDesc || editingExp.shortDesc || "Meta description snippet shown in search engine results."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Experience Card Preview */}
            <div className="lg:col-span-5">
              <div className="sticky top-0 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-ui text-[11px] font-bold text-[#C4952A] tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Experience Card Preview
                  </span>
                  <span className="text-[10px] font-ui text-[#7A776F]">Updates in real-time</span>
                </div>

                {/* Exact 1:1 Public Experience Showcase Card */}
                <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden shadow-md border border-[#EDE8DF] hover:border-[#C4952A]/40 transition-all flex flex-col">
                  {/* Photo Banner */}
                  <div className="relative h-56 overflow-hidden bg-gray-900">
                    <img
                      src={editingExp.coverImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format&q=80"}
                      alt={editingExp.name || "Experience"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Genre Badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                      {editingExp.genres && editingExp.genres.length > 0 ? (
                        editingExp.genres.slice(0, 2).map((g) => (
                          <span key={g} className="bg-white/95 backdrop-blur-md text-[#1A1916] font-ui text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase">
                            {g}
                          </span>
                        ))
                      ) : (
                        <span className="bg-white/95 backdrop-blur-md text-[#1A1916] font-ui text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase">
                          Sufi
                        </span>
                      )}
                    </div>

                    {editingExp.isFeatured && (
                      <span className="absolute top-3.5 right-3.5 bg-[#C4952A] text-[#1A1916] font-ui text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        ★ Featured
                      </span>
                    )}

                    {/* Overlay Text */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-white">
                      <h3
                        className="font-serif font-light text-2xl text-white drop-shadow-md leading-tight"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {editingExp.name || "Experience Title"}
                      </h3>
                      <p className="font-ui text-[11px] text-white/80 font-light mt-0.5 line-clamp-1">
                        {editingExp.shortDesc || "Artistic experience short tagline"}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Meta specs */}
                    <div className="flex items-center gap-3 text-[11px] font-ui text-[#7A776F] border-b border-[#EDE8DF] pb-2.5">
                      <span className="flex items-center gap-1">⏱ {editingExp.duration || "90 - 120 mins"}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">👥 {editingExp.audienceSize || "50 - 400 guests"}</span>
                    </div>

                    <p className="font-ui text-xs text-[#4A4845] line-clamp-2 leading-relaxed">
                      {editingExp.fullDesc || "Full description narrative will appear here as guests explore this curated showcase."}
                    </p>

                    {/* Occasion chips */}
                    {editingExp.occasions && editingExp.occasions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {editingExp.occasions.slice(0, 3).map((occ) => (
                          <span key={occ} className="text-[10px] font-ui px-2 py-0.5 rounded-md bg-white border border-[#EDE8DF] text-[#7A776F]">
                            {occ}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-ui text-[11px] font-semibold text-[#C4952A]">
                        Curated by Mannat Arts
                      </span>
                      <span className="font-ui text-xs font-semibold px-4 py-2 rounded-full bg-[#1A1916] text-[#FAF7F2] shadow-sm">
                        Inquire Showcase →
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EDE8DF] text-[11px] font-ui text-[#7A776F]">
                  <p className="font-semibold text-[#1A1916]">💡 Client Tip:</p>
                  <p>This is the exact showcase card guests see on the homepage under "Curated Experiences". Any changes you make will update here in real time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
            <div className="px-6 py-4 bg-white border-t border-[#EDE8DF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-ui text-xs text-[#7A776F]">Status:</span>
                <select
                  value={editingExp.status}
                  onChange={(e) => setEditingExp({ ...editingExp, status: e.target.value as any })}
                  className="font-ui text-xs bg-[#FAF7F2] border border-[#EDE8DF] rounded-lg px-2.5 py-1 text-[#1A1916] font-medium"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="font-ui text-xs font-semibold px-4 py-2.5 rounded-full border border-[#EDE8DF] text-[#4A4845] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveExp("draft")}
                  className="font-ui text-xs font-semibold px-5 py-2.5 rounded-full border border-[#C4952A] text-[#9A7219] hover:bg-[#C4952A]/10 transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveExp("published")}
                  className="font-ui text-xs font-semibold px-6 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-sm transition-all"
                >
                  Publish Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Experience?"
        message="This action will permanently remove this experience from Mannat Arts. It will no longer be visible on discovery pages."
        itemName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteExperience(deleteTarget.id);
            onShowToast(`Deleted "${deleteTarget.name}"`, "warning");
            setDeleteTarget(null);
          }
        }}
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mediaList={mediaList}
        onUploadMedia={onUploadMedia}
        onSelectMedia={(url) => {
          if (editingExp) setEditingExp({ ...editingExp, coverImage: url });
        }}
        title="Select Experience Cover Image"
      />
    </div>
  );
}
