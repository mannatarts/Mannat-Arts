import { useState } from "react";
import { MoodItem, MediaItem } from "../../../data/cmsTypes";
import { GenreInfo } from "../../../data/artistsData";
import { MediaPickerModal } from "../MediaPickerModal";

interface MoodsCMSViewProps {
  moods: MoodItem[];
  genres: Record<string, GenreInfo>;
  onUpdateMoods: (updated: MoodItem[]) => void;
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function MoodsCMSView({
  moods,
  genres,
  onUpdateMoods,
  mediaList,
  onUploadMedia,
  onShowToast,
}: MoodsCMSViewProps) {
  const [editingMood, setEditingMood] = useState<MoodItem | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleOpenEdit = (mood: MoodItem) => {
    setEditingMood({ ...mood });
  };

  const handleSaveMood = () => {
    if (!editingMood) return;
    const updated = moods.map((m) => (m.id === editingMood.id ? editingMood : m));
    onUpdateMoods(updated);
    onShowToast(`Mood "${editingMood.title}" saved`, "success");
    setEditingMood(null);
  };

  const handleToggleVisibility = (id: string) => {
    const updated = moods.map((m) =>
      m.id === id ? { ...m, isVisible: !m.isVisible } : m
    );
    onUpdateMoods(updated);
    onShowToast("Mood visibility updated", "info");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Mood Discovery CMS</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Emotional entry points that power the homepage "What are you in the mood for?" section.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {moods.map((mood) => (
          <div
            key={mood.id}
            className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="relative aspect-4/3 bg-[#1A1916] overflow-hidden">
              <img
                src={mood.img}
                alt={mood.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(26,25,22,0.85) 0%, rgba(26,25,22,0.2) 60%)`,
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-[#DDB96A] block">
                  Mapped to: {genres[mood.genre]?.title || mood.genre}
                </span>
                <h3 className="font-serif text-xl font-light mt-0.5">{mood.title}</h3>
                <p className="font-ui text-[11px] text-white/80 line-clamp-2 mt-1">{mood.desc}</p>
              </div>

              {/* Accent indicator */}
              <div
                className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: mood.accent }}
              />
            </div>

            <div className="p-4 bg-[#FAF7F2] border-t border-[#EDE8DF] flex items-center justify-between">
              <button
                onClick={() => handleToggleVisibility(mood.id)}
                className={`text-[11px] font-ui font-semibold px-3 py-1 rounded-full ${
                  mood.isVisible ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                }`}
              >
                {mood.isVisible ? "● Visible" : "○ Hidden"}
              </button>

              <button
                onClick={() => handleOpenEdit(mood)}
                className="font-ui text-xs font-semibold px-4 py-1.5 rounded-full bg-white border border-[#EDE8DF] hover:border-[#C4952A] text-[#1A1916] transition-colors"
              >
                Edit Mood →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mood Editor Modal */}
      {editingMood && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#EDE8DF] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">
                  Edit Mood: {editingMood.title}
                </h3>
                <p className="font-ui text-xs text-[#7A776F]">Configures homepage discovery cards — see live preview on the right</p>
              </div>
              <button
                onClick={() => setEditingMood(null)}
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
                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Mood Title *
                      </label>
                      <input
                        type="text"
                        value={editingMood.title}
                        onChange={(e) => setEditingMood({ ...editingMood, title: e.target.value })}
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Description / Caption
                      </label>
                      <input
                        type="text"
                        value={editingMood.desc}
                        onChange={(e) => setEditingMood({ ...editingMood, desc: e.target.value })}
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Destination Genre
                        </label>
                        <select
                          value={editingMood.genre}
                          onChange={(e) => setEditingMood({ ...editingMood, genre: e.target.value as any })}
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 capitalize focus:outline-none focus:border-[#C4952A]"
                        >
                          {Object.keys(genres).map((k) => (
                            <option key={k} value={k}>{genres[k].title}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Accent Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editingMood.accent}
                            onChange={(e) => setEditingMood({ ...editingMood, accent: e.target.value })}
                            className="w-9 h-9 rounded-lg border-none cursor-pointer"
                          />
                          <input
                            type="text"
                            value={editingMood.accent}
                            onChange={(e) => setEditingMood({ ...editingMood, accent: e.target.value })}
                            className="flex-1 text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mood Image */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-ui text-xs font-semibold text-[#1A1916]">
                          Mood Card Image
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
                          src={editingMood.img}
                          alt="Preview"
                          className="w-20 h-20 rounded-xl object-cover border border-[#EDE8DF]"
                        />
                        <input
                          type="text"
                          value={editingMood.img}
                          onChange={(e) => setEditingMood({ ...editingMood, img: e.target.value })}
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
                        Live Mood Card Preview
                      </span>
                      <span className="text-[10px] font-ui text-[#7A776F]">Updates in real-time</span>
                    </div>

                    {/* Replica of the Mood Card */}
                    <div className="relative aspect-4/3 bg-[#1A1916] rounded-2xl overflow-hidden shadow-md">
                      <img
                        src={editingMood.img || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=450&fit=crop"}
                        alt={editingMood.title || "Mood"}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, rgba(26,25,22,0.85) 0%, rgba(26,25,22,0.2) 60%)`,
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <span className="text-[10px] tracking-wider uppercase font-semibold text-[#DDB96A] block">
                          Mapped to: {genres[editingMood.genre]?.title || editingMood.genre}
                        </span>
                        <h3 className="font-serif text-xl font-light mt-0.5">
                          {editingMood.title || "Mood Title"}
                        </h3>
                        <p className="font-ui text-[11px] text-white/80 line-clamp-2 mt-1">
                          {editingMood.desc || "Description text goes here..."}
                        </p>
                      </div>

                      {/* Accent indicator */}
                      <div
                        className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: editingMood.accent || "#C4952A" }}
                      />
                    </div>

                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE8DF] text-[11px] font-ui text-[#7A776F]">
                      <p className="font-semibold text-[#1A1916]">Where this appears:</p>
                      <p>In the homepage "Curated by Mood & Emotion" carousel and guest discovery filters.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#EDE8DF] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingMood(null)}
                className="font-ui text-xs font-semibold px-4 py-2.5 rounded-full border border-[#EDE8DF] text-[#4A4845] hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMood}
                className="font-ui text-xs font-semibold px-6 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-sm"
              >
                Save Mood
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
          if (editingMood) setEditingMood({ ...editingMood, img: url });
        }}
        title="Select Mood Card Image"
      />
    </div>
  );
}
