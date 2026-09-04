import { useState } from "react";
import { OccasionItem, MediaItem } from "../../../data/cmsTypes";
import { GenreInfo } from "../../../data/artistsData";
import { MediaPickerModal } from "../MediaPickerModal";

interface OccasionsCMSViewProps {
  occasions: OccasionItem[];
  genres: Record<string, GenreInfo>;
  onUpdateOccasions: (updated: OccasionItem[]) => void;
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function OccasionsCMSView({
  occasions,
  genres,
  onUpdateOccasions,
  mediaList,
  onUploadMedia,
  onShowToast,
}: OccasionsCMSViewProps) {
  const [editingOccasion, setEditingOccasion] = useState<OccasionItem | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleOpenEdit = (occ: OccasionItem) => {
    setEditingOccasion({ ...occ });
  };

  const handleSave = () => {
    if (!editingOccasion) return;
    const updated = occasions.map((o) => (o.id === editingOccasion.id ? editingOccasion : o));
    onUpdateOccasions(updated);
    onShowToast(`Occasion "${editingOccasion.label}" saved`, "success");
    setEditingOccasion(null);
  };

  const handleToggleVisibility = (id: string) => {
    const updated = occasions.map((o) =>
      o.id === id ? { ...o, isVisible: !o.isVisible } : o
    );
    onUpdateOccasions(updated);
    onShowToast("Occasion visibility updated", "info");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Occasion Discovery CMS</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Event categories powering the "What are you planning?" discovery grid.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {occasions.map((occ) => (
          <div
            key={occ.id}
            className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif text-2xl text-[#C4952A]">{occ.icon}</span>
                <button
                  onClick={() => handleToggleVisibility(occ.id)}
                  className={`text-[10px] font-ui font-semibold px-2.5 py-0.5 rounded-full ${
                    occ.isVisible ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {occ.isVisible ? "Visible" : "Hidden"}
                </button>
              </div>

              <h3 className="font-serif text-xl font-medium text-[#1A1916]">{occ.label}</h3>
              <p className="font-ui text-xs text-[#7A776F] mt-1 line-clamp-2">{occ.desc}</p>

              <div className="mt-4 pt-3 border-t border-[#EDE8DF] text-[11px] font-ui space-y-1 text-[#4A4845]">
                <p>
                  <strong className="text-[#1A1916]">Mapped Genre:</strong> {genres[occ.genre]?.title || occ.genre}
                </p>
                <p>
                  <strong className="text-[#1A1916]">Related Styles:</strong> {occ.relatedGenres.join(", ")}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#EDE8DF] flex items-center justify-end">
              <button
                onClick={() => handleOpenEdit(occ)}
                className="font-ui text-xs font-semibold px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EDE8DF] hover:border-[#C4952A] text-[#1A1916] transition-colors"
              >
                Edit Occasion →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Occasion Editor Modal */}
      {editingOccasion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#EDE8DF] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">
                  Edit Occasion: {editingOccasion.label}
                </h3>
                <p className="font-ui text-xs text-[#7A776F]">Configures occasion grid & recommendations — see live card preview on the right</p>
              </div>
              <button
                onClick={() => setEditingOccasion(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A776F] hover:text-[#1A1916] hover:bg-[#EDE8DF]"
              >
                ✕
              </button>
            </div>

            {/* Two-column layout */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Form */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-[#EDE8DF] space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Occasion Label *
                        </label>
                        <input
                          type="text"
                          value={editingOccasion.label}
                          onChange={(e) => setEditingOccasion({ ...editingOccasion, label: e.target.value })}
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                        />
                      </div>
                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Icon Symbol
                        </label>
                        <input
                          type="text"
                          value={editingOccasion.icon}
                          onChange={(e) => setEditingOccasion({ ...editingOccasion, icon: e.target.value })}
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={editingOccasion.desc}
                        onChange={(e) => setEditingOccasion({ ...editingOccasion, desc: e.target.value })}
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Primary Destination Genre
                      </label>
                      <select
                        value={editingOccasion.genre}
                        onChange={(e) => setEditingOccasion({ ...editingOccasion, genre: e.target.value as any })}
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 capitalize focus:outline-none focus:border-[#C4952A]"
                      >
                        {Object.keys(genres).map((k) => (
                          <option key={k} value={k}>{genres[k].title}</option>
                        ))}
                      </select>
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
                          src={editingOccasion.coverImg}
                          alt="Cover"
                          className="w-20 h-14 rounded-xl object-cover border border-[#EDE8DF]"
                        />
                        <input
                          type="text"
                          value={editingOccasion.coverImg}
                          onChange={(e) => setEditingOccasion({ ...editingOccasion, coverImg: e.target.value })}
                          className="flex-1 text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C4952A]"
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
                        Live Occasion Card Preview
                      </span>
                      <span className="text-[10px] font-ui text-[#7A776F]">Updates in real-time</span>
                    </div>

                    {/* Replica of the Occasion Card */}
                    <div className="bg-white rounded-2xl border border-[#EDE8DF] p-5 shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl text-[#C4952A]">{editingOccasion.icon || "💍"}</span>
                        <span className="text-[10px] font-ui font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Live Active
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-medium text-[#1A1916]">
                        {editingOccasion.label || "Occasion Title"}
                      </h3>
                      <p className="font-ui text-xs text-[#7A776F] mt-1 line-clamp-2">
                        {editingOccasion.desc || "Occasion description will appear here..."}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#EDE8DF] text-[11px] font-ui space-y-1 text-[#4A4845]">
                        <p>
                          <strong className="text-[#1A1916]">Mapped Genre:</strong> {genres[editingOccasion.genre]?.title || editingOccasion.genre}
                        </p>
                        {editingOccasion.relatedGenres && editingOccasion.relatedGenres.length > 0 && (
                          <p>
                            <strong className="text-[#1A1916]">Related Styles:</strong> {editingOccasion.relatedGenres.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE8DF] text-[11px] font-ui text-[#7A776F]">
                      <p className="font-semibold text-[#1A1916]">Where this appears:</p>
                      <p>In the "Plan by Occasion" section on the homepage and booking planner wizard.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#EDE8DF] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingOccasion(null)}
                className="font-ui text-xs font-semibold px-4 py-2.5 rounded-full border border-[#EDE8DF] text-[#4A4845] hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="font-ui text-xs font-semibold px-6 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-sm"
              >
                Save Occasion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mediaList={mediaList}
        onUploadMedia={onUploadMedia}
        onSelectMedia={(url) => {
          if (editingOccasion) setEditingOccasion({ ...editingOccasion, coverImg: url });
        }}
        title="Select Occasion Cover Image"
      />
    </div>
  );
}
