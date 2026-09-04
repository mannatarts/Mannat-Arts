import { useState } from "react";
import { TestimonialItem, MediaItem } from "../../../data/cmsTypes";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal";

interface TestimonialsCMSViewProps {
  testimonials: TestimonialItem[];
  onUpdateTestimonials: (updated: TestimonialItem[]) => void;
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function TestimonialsCMSView({
  testimonials,
  onUpdateTestimonials,
  mediaList,
  onUploadMedia,
  onShowToast,
}: TestimonialsCMSViewProps) {
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialItem | null>(null);

  const handleOpenAdd = () => {
    const newTest: TestimonialItem = {
      id: `test-${Date.now()}`,
      name: "",
      role: "",
      type: "Luxury Wedding",
      quote: "",
      rating: 5,
      isFeatured: true,
      status: "published",
    };
    setEditingTestimonial(newTest);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (t: TestimonialItem) => {
    setEditingTestimonial({ ...t });
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    if (!editingTestimonial) return;
    if (!editingTestimonial.name.trim() || !editingTestimonial.quote.trim()) {
      onShowToast("Name and testimonial quote are required", "warning");
      return;
    }

    const exists = testimonials.some((t) => t.id === editingTestimonial.id);
    let updatedList: TestimonialItem[];
    if (exists) {
      updatedList = testimonials.map((t) =>
        t.id === editingTestimonial.id ? editingTestimonial : t
      );
      onShowToast("Testimonial updated", "success");
    } else {
      updatedList = [...testimonials, editingTestimonial];
      onShowToast("New testimonial added", "success");
    }

    onUpdateTestimonials(updatedList);
    setIsEditorOpen(false);
  };

  const handleToggleFeatured = (id: string) => {
    const updated = testimonials.map((t) =>
      t.id === id ? { ...t, isFeatured: !t.isFeatured } : t
    );
    onUpdateTestimonials(updated);
    onShowToast("Homepage featured status updated", "info");
  };

  const handleDelete = (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    onUpdateTestimonials(updated);
    onShowToast("Testimonial deleted", "warning");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Client Testimonials CMS</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Reviews from event planners, corporate hosts, and luxury wedding couples.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-5 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="font-bold">+</span> Add Testimonial
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {"★".repeat(t.rating)}
                </div>
                <button
                  onClick={() => handleToggleFeatured(t.id)}
                  className={`text-[10px] font-ui font-semibold px-2.5 py-0.5 rounded-full ${
                    t.isFeatured ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-[#FAF7F2] text-[#7A776F]"
                  }`}
                >
                  {t.isFeatured ? "★ Featured on Homepage" : "☆ Not Featured"}
                </button>
              </div>

              <p className="font-ui text-xs text-[#4A4845] italic leading-relaxed line-clamp-4">
                "{t.quote}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EDE8DF] flex items-center justify-between">
              <div>
                <p className="font-ui font-semibold text-xs text-[#1A1916]">{t.name}</p>
                <p className="font-ui text-[11px] text-[#7A776F]">{t.role} · {t.type}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="font-ui text-xs text-[#1A1916] hover:text-[#C4952A] font-semibold px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(t)}
                  className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonial Editor Modal */}
      {isEditorOpen && editingTestimonial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#EDE8DF] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">
                  {editingTestimonial.name ? `Edit Testimonial` : "New Testimonial"}
                </h3>
                <p className="font-ui text-xs text-[#7A776F]">Client quote and event details — see the live card preview on the right</p>
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

                {/* Left: Form */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-[#EDE8DF] space-y-4">
                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Client / Host Name *
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.name}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                        placeholder="e.g. Priya Mehta"
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.role}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                          placeholder="e.g. Head of Events"
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                        />
                      </div>
                      <div>
                        <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                          Event Type
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.type}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, type: e.target.value })}
                          placeholder="e.g. Wedding / Corporate Gala"
                          className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                        Testimonial Quote *
                      </label>
                      <textarea
                        rows={5}
                        value={editingTestimonial.quote}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                        placeholder="Write the client's experience in their own words..."
                        className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#EDE8DF]">
                      <div className="flex items-center gap-2">
                        <label className="font-ui text-xs font-semibold text-[#1A1916]">Star Rating:</label>
                        <div className="flex items-center gap-1">
                          {[5,4,3,2,1].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditingTestimonial({ ...editingTestimonial, rating: star })}
                              className={`text-lg transition-colors ${editingTestimonial.rating >= star ? "text-amber-400" : "text-gray-200"}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingTestimonial.isFeatured}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, isFeatured: e.target.checked })}
                          className="rounded accent-[#C4952A]"
                        />
                        <span className="font-ui text-xs font-semibold text-[#1A1916]">
                          Show on Homepage
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs font-ui text-amber-800">
                    <p className="font-semibold mb-0.5">💡 Tip</p>
                    <p>Genuine, specific quotes about the event experience perform best. Try to include the type of event and what impressed the client most.</p>
                  </div>
                </div>

                {/* Right: Live Preview */}
                <div className="lg:col-span-5">
                  <div className="sticky top-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-ui text-[11px] font-bold text-[#C4952A] tracking-wider uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Card Preview
                      </span>
                      <span className="text-[10px] font-ui text-[#7A776F]">Updates in real-time</span>
                    </div>

                    {/* Exact 1:1 replica of public testimonial card */}
                    <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-md hover:border-[#C4952A]/40 transition-all">
                      {/* Stars */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {"★".repeat(editingTestimonial.rating || 5)}
                          {"☆".repeat(Math.max(0, 5 - (editingTestimonial.rating || 5)))}
                        </div>
                        {editingTestimonial.isFeatured && (
                          <span className="text-[10px] font-ui font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      {/* Quote */}
                      <p className="font-ui text-sm text-[#4A4845] italic leading-relaxed mb-5">
                        "{editingTestimonial.quote || "The client's testimonial quote will appear here as you type it..."}"
                      </p>

                      {/* Author */}
                      <div className="pt-4 border-t border-[#EDE8DF]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#C4952A]/20 flex items-center justify-center text-[#C4952A] font-bold text-sm">
                            {(editingTestimonial.name || "?").charAt(0)}
                          </div>
                          <div>
                            <p className="font-ui font-semibold text-xs text-[#1A1916]">
                              {editingTestimonial.name || "Client Name"}
                            </p>
                            <p className="font-ui text-[11px] text-[#7A776F]">
                              {[editingTestimonial.role, editingTestimonial.type].filter(Boolean).join(" · ") || "Role · Event Type"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EDE8DF] text-[11px] font-ui text-[#7A776F]">
                      <p className="font-semibold text-[#1A1916]">Where it appears:</p>
                      <p>This card shows on the homepage testimonials section and on the Reviews page.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#EDE8DF] flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="font-ui text-xs font-semibold px-4 py-2.5 rounded-full border border-[#EDE8DF] text-[#4A4845] hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="font-ui text-xs font-semibold px-6 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] shadow-sm"
              >
                Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Testimonial?"
        message="This will remove the testimonial from your website."
        itemName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget.id);
        }}
      />
    </div>
  );
}
