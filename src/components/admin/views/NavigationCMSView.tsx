import { useState } from "react";
import { NavLinkItem } from "../../../data/cmsTypes";

interface NavigationCMSViewProps {
  navigation: NavLinkItem[];
  onUpdateNavigation: (updated: NavLinkItem[]) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function NavigationCMSView({
  navigation,
  onUpdateNavigation,
  onShowToast,
}: NavigationCMSViewProps) {
  const [links, setLinks] = useState<NavLinkItem[]>(navigation);
  const [editingLink, setEditingLink] = useState<NavLinkItem | null>(null);

  const moveLink = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);
    const reindexed = newLinks.map((l, i) => ({ ...l, order: i + 1 }));
    setLinks(reindexed);
    onUpdateNavigation(reindexed);
    onShowToast("Navigation link reordered", "info");
  };

  const toggleVisibility = (id: string) => {
    const updated = links.map((l) => (l.id === id ? { ...l, isVisible: !l.isVisible } : l));
    setLinks(updated);
    onUpdateNavigation(updated);
    onShowToast("Link visibility toggled", "info");
  };

  const handleAddNew = () => {
    const newL: NavLinkItem = {
      id: `nav-${Date.now()}`,
      label: "New Link",
      target: "experiences",
      isVisible: true,
      order: links.length + 1,
    };
    const updated = [...links, newL];
    setLinks(updated);
    onUpdateNavigation(updated);
    setEditingLink(newL);
    onShowToast("New link created", "success");
  };

  const handleSaveEdit = () => {
    if (!editingLink) return;
    const updated = links.map((l) => (l.id === editingLink.id ? editingLink : l));
    setLinks(updated);
    onUpdateNavigation(updated);
    onShowToast("Navigation link saved", "success");
    setEditingLink(null);
  };

  const handleDelete = (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    onUpdateNavigation(updated);
    onShowToast("Link removed", "warning");
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Header Navigation</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Manage public top navigation menu links, labels, and display order.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-5 py-2.5 rounded-full transition-all shadow-sm"
        >
          + Add Menu Item
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-xs">
        <div className="p-4 bg-[#FAF7F2] border-b border-[#EDE8DF] flex items-center justify-between text-xs font-ui text-[#7A776F]">
          <span>Menu Item & Destination</span>
          <span>Order & Status</span>
        </div>

        <div className="divide-y divide-[#EDE8DF]">
          {links.map((link, idx) => (
            <div key={link.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAF7F2]/60">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveLink(idx, "up")}
                    disabled={idx === 0}
                    className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-[#7A776F] hover:bg-[#EDE8DF] disabled:opacity-20"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveLink(idx, "down")}
                    disabled={idx === links.length - 1}
                    className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-[#7A776F] hover:bg-[#EDE8DF] disabled:opacity-20"
                  >
                    ▼
                  </button>
                </div>

                <div>
                  <p className="font-ui font-semibold text-xs text-[#1A1916]">{link.label}</p>
                  <p className="font-ui text-[11px] text-[#7A776F]">Destination: {link.target}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingLink(link)}
                  className="font-ui text-xs text-[#1A1916] hover:text-[#C4952A] font-semibold px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleVisibility(link.id)}
                  className={`font-ui text-[11px] px-2.5 py-0.5 rounded-full ${
                    link.isVisible ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {link.isVisible ? "Visible" : "Hidden"}
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="text-xs text-red-500 hover:text-red-700 px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Link Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-2xl shadow-2xl border border-[#EDE8DF] p-6 space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1A1916]">Edit Menu Link</h3>

            <div className="space-y-3 bg-white p-4 rounded-xl border border-[#EDE8DF]">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                  Menu Label
                </label>
                <input
                  type="text"
                  value={editingLink.label}
                  onChange={(e) => setEditingLink({ ...editingLink, label: e.target.value })}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                  Target Destination Page / Anchor
                </label>
                <select
                  value={editingLink.target}
                  onChange={(e) => setEditingLink({ ...editingLink, target: e.target.value })}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2"
                >
                  <option value="home">Homepage (Top)</option>
                  <option value="experiences">Experiences Showcase</option>
                  <option value="genres">Genres Catalog</option>
                  <option value="artists">Artists Directory</option>
                  <option value="occasions">Occasions Discovery</option>
                  <option value="stories">Stories / Journal</option>
                  <option value="about">About Mannat Arts</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingLink(null)}
                className="font-ui text-xs font-semibold px-4 py-2 rounded-full border border-[#EDE8DF] text-[#4A4845]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="font-ui text-xs font-semibold px-5 py-2 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916]"
              >
                Save Menu Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
