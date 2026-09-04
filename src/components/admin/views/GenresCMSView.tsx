import { useState } from "react";
import { GenreInfo } from "../../../data/artistsData";
import { MediaItem } from "../../../data/cmsTypes";
import { MediaPickerModal } from "../MediaPickerModal";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal";

interface GenresCMSViewProps {
  genres: Record<string, GenreInfo>;
  onUpdateGenre: (genreId: string, updated: Partial<GenreInfo>) => void;
  onAddGenre?: (genre: GenreInfo) => void;
  onDeleteGenre?: (genreId: string) => void;
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function GenresCMSView({
  genres,
  onUpdateGenre,
  onAddGenre,
  onDeleteGenre,
  mediaList,
  onUploadMedia,
  onShowToast,
}: GenresCMSViewProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editData, setEditData] = useState<GenreInfo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleOpenEdit = (key: string) => {
    setEditingKey(key);
    setEditData({ ...genres[key] });
  };

  const handleSave = () => {
    if (!editingKey || !editData) return;
    onUpdateGenre(editingKey, editData);
    onShowToast(`Genre "${editData.title}" updated`, "success");
    setEditingKey(null);
    setEditData(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Artistic Genres</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Manage genre descriptions, visual themes, traditional instruments, and stage aesthetics.
          </p>
        </div>
      </div>

      {/* Grid of Genres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(genres).map(([key, genre]) => (
          <div
            key={key}
            className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{genre.icon}</span>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1A1916]">{genre.title}</h3>
                    <p className="font-ui text-[11px] text-[#C4952A] font-semibold">{genre.tag}</p>
                  </div>
                </div>
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                  style={{ backgroundColor: genre.accent }}
                  title={`Theme accent: ${genre.accent}`}
                />
              </div>

              <p className="font-ui text-xs text-[#7A776F] leading-relaxed line-clamp-3">
                {genre.description}
              </p>

              <div className="pt-2 border-t border-[#EDE8DF] space-y-1.5 text-[11px] font-ui text-[#4A4845]">
                <p>
                  <strong className="text-[#1A1916]">Popular Occasions:</strong>{" "}
                  {genre.popularOccasions.slice(0, 3).join(", ")}
                </p>
                <p>
                  <strong className="text-[#1A1916]">Honorarium Range:</strong> {genre.avgPriceRange}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] border-t border-[#EDE8DF] flex items-center justify-between">
              <span className="font-ui text-[10px] text-[#7A776F] uppercase tracking-wider font-semibold">
                ID: {genre.id}
              </span>
              <button
                onClick={() => handleOpenEdit(key)}
                className="font-ui text-xs font-semibold px-4 py-1.5 rounded-full bg-white border border-[#EDE8DF] hover:border-[#C4952A] text-[#1A1916] transition-colors"
              >
                Edit Genre →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Genre Editor Modal */}
      {editingKey && editData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full max-w-5xl rounded-3xl shadow-2xl border border-[#EDE8DF] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">
                  Edit Genre: {editData.title}
                </h3>
                <p className="font-ui text-xs text-[#7A776F]">Modify musical style attributes and view the real-time card preview</p>
              </div>
              <button
                onClick={() => setEditingKey(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A776F] hover:text-[#1A1916] hover:bg-[#EDE8DF]"
              >
                ✕
              </button>
            </div>

            {/* Two-column layout */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Inputs */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-[#EDE8DF] space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                        />
                      </div>
                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Sub-tag / Subtitle
                        </label>
                        <input
                          type="text"
                          value={editData.tag}
                          onChange={(e) => setEditData({ ...editData, tag: e.target.value })}
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Short Summary Description
                      </label>
                      <input
                        type="text"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Full Narrative Description
                      </label>
                      <textarea
                        rows={3}
                        value={editData.longDescription}
                        onChange={(e) => setEditData({ ...editData, longDescription: e.target.value })}
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Theme Accent Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editData.accent}
                            onChange={(e) => setEditData({ ...editData, accent: e.target.value })}
                            className="w-9 h-9 rounded-lg border-none cursor-pointer"
                          />
                          <input
                            type="text"
                            value={editData.accent}
                            onChange={(e) => setEditData({ ...editData, accent: e.target.value })}
                            className="flex-1 text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Honorarium Range
                        </label>
                        <input
                          type="text"
                          value={editData.avgPriceRange}
                          onChange={(e) => setEditData({ ...editData, avgPriceRange: e.target.value })}
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Live Preview */}
                <div className="lg:col-span-5">
                  <div className="sticky top-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-ui text-[11px] font-bold text-[#C4952A] tracking-wider uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Genre Card Preview
                      </span>
                      <span className="text-[10px] font-ui text-[#7A776F]">Updates in real-time</span>
                    </div>

                    {/* Replica of the Genre Card */}
                    <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-md">
                      <div
                        className="h-2 w-full"
                        style={{ backgroundColor: editData.accent || "#C4952A" }}
                      />
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{editData.icon || "🎵"}</span>
                            <div>
                              <h3 className="font-serif text-lg font-medium text-[#1A1916]">
                                {editData.title || "Genre Title"}
                              </h3>
                              <p className="font-ui text-[11px] text-[#C4952A] font-semibold">
                                {editData.tag || "Sub-tag"}
                              </p>
                            </div>
                          </div>
                          <div
                            className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: editData.accent || "#C4952A" }}
                          />
                        </div>

                        <p className="font-ui text-xs text-[#7A776F] leading-relaxed line-clamp-3">
                          {editData.description || "Genre summary will appear here..."}
                        </p>

                        <div className="pt-3 border-t border-[#EDE8DF] space-y-1 text-[11px] font-ui text-[#4A4845]">
                          <p>
                            <strong className="text-[#1A1916]">Honorarium:</strong> {editData.avgPriceRange || "₹50,000 - ₹2,00,000"}
                          </p>
                          {editData.popularOccasions && editData.popularOccasions.length > 0 && (
                            <p>
                              <strong className="text-[#1A1916]">Occasions:</strong> {editData.popularOccasions.slice(0, 3).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-[#FAF7F2] border-t border-[#EDE8DF] flex items-center justify-between text-[10px] font-ui text-[#7A776F]">
                        <span>Public catalog card view</span>
                        <span className="text-[#C4952A] font-semibold">Explore Artists →</span>
                      </div>
                    </div>

                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE8DF] text-[11px] font-ui text-[#7A776F]">
                      <p className="font-semibold text-[#1A1916]">Where this appears:</p>
                      <p>In the Genres Catalog page and filter options across the entire website.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#EDE8DF] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingKey(null)}
                className="font-ui text-xs font-semibold px-4 py-2.5 rounded-full border border-[#EDE8DF] text-[#4A4845] hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="font-ui text-xs font-semibold px-6 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-sm"
              >
                Save Genre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
