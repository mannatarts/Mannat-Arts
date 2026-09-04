import { useState, useMemo } from "react";
import { MediaItem } from "../../../data/cmsTypes";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal";

interface MediaLibraryViewProps {
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  onDeleteMedia?: (id: string) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function MediaLibraryView({
  mediaList,
  onUploadMedia,
  onDeleteMedia,
  onShowToast,
}: MediaLibraryViewProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "image" | "video">("all");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);

  // New media form state
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const filtered = useMemo(() => {
    return mediaList.filter((m) => {
      const matchQuery =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.altText.toLowerCase().includes(search.toLowerCase());
      const matchType = selectedType === "all" || m.type === selectedType;
      return matchQuery && matchType;
    });
  }, [mediaList, search, selectedType]);

  const handleAddMedia = () => {
    if (!newUrl.trim()) {
      onShowToast("Media URL is required", "warning");
      return;
    }

    const item: MediaItem = {
      id: `med-${Date.now()}`,
      name: newName.trim() || `asset-${Date.now()}.jpg`,
      url: newUrl.trim(),
      type: "image",
      size: "1.2 MB",
      dimensions: "1920 × 1080",
      altText: newAlt.trim() || newName.trim() || "Mannat Arts media asset",
      description: newDesc.trim() || "Uploaded to media library",
      uploadDate: new Date().toISOString().split("T")[0],
      usedIn: [],
    };

    onUploadMedia?.(item);
    onShowToast(`Media asset "${item.name}" added`, "success");
    setIsAddModalOpen(false);
    setNewName("");
    setNewUrl("");
    setNewAlt("");
    setNewDesc("");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Media Library</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Store, search, and reuse high-resolution imagery and video assets across all editors.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-5 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="font-bold">+</span> Upload New Asset
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EDE8DF] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media by filename, alt text..."
            className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#C4952A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#4A4845]"
          >
            <option value="all">All File Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
          <span className="text-xs font-ui text-[#7A776F] ml-2">
            {filtered.length} assets
          </span>
        </div>
      </div>

      {/* Main Grid + Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Media Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EDE8DF] p-16 text-center">
              <div className="text-4xl mb-2">📁</div>
              <h4 className="font-serif text-lg font-medium text-[#1A1916]">No media items match</h4>
              <p className="font-ui text-xs text-[#7A776F] mt-1">Upload an image or adjust your search filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`group bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all shadow-xs hover:shadow-md ${
                      isSelected
                        ? "border-[#C4952A] ring-2 ring-[#C4952A]/20"
                        : "border-[#EDE8DF] hover:border-[#C4952A]/40"
                    }`}
                  >
                    <div className="aspect-4/3 bg-[#FAF7F2] overflow-hidden relative">
                      <img
                        src={item.url}
                        alt={item.altText}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.usedIn.length > 0 && (
                        <span className="absolute bottom-2 left-2 text-[9px] bg-black/70 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                          {item.usedIn.length} placements
                        </span>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="font-ui font-medium text-xs text-[#1A1916] truncate">{item.name}</p>
                      <p className="font-ui text-[10px] text-[#7A776F] mt-0.5">{item.dimensions} · {item.size}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Asset Inspector */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-white rounded-2xl border border-[#EDE8DF] p-5 shadow-xs space-y-4 sticky top-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DF]">
                <h4 className="font-serif text-base font-medium text-[#1A1916]">Asset Details</h4>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-xs text-[#7A776F] hover:text-[#1A1916]"
                >
                  ✕
                </button>
              </div>

              <img
                src={selectedItem.url}
                alt={selectedItem.altText}
                className="w-full h-40 object-cover rounded-xl border border-[#EDE8DF]"
              />

              <div className="space-y-2 text-xs font-ui">
                <div>
                  <p className="text-[#7A776F] text-[10px] uppercase font-bold tracking-wider">Filename</p>
                  <p className="font-semibold text-[#1A1916] truncate">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-[#7A776F] text-[10px] uppercase font-bold tracking-wider">Dimensions & Size</p>
                  <p className="text-[#4A4845]">{selectedItem.dimensions} · {selectedItem.size}</p>
                </div>
                <div>
                  <p className="text-[#7A776F] text-[10px] uppercase font-bold tracking-wider">Alt Text</p>
                  <p className="text-[#4A4845]">{selectedItem.altText}</p>
                </div>
                <div>
                  <p className="text-[#7A776F] text-[10px] uppercase font-bold tracking-wider">Uploaded</p>
                  <p className="text-[#4A4845]">{selectedItem.uploadDate}</p>
                </div>
                <div>
                  <p className="text-[#7A776F] text-[10px] uppercase font-bold tracking-wider">Used In Placements</p>
                  {selectedItem.usedIn.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedItem.usedIn.map((p, i) => (
                        <span key={i} className="text-[10px] bg-[#FAF7F2] border border-[#EDE8DF] px-2 py-0.5 rounded-md text-[#4A4845]">
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#7A776F] text-[11px]">No active placements</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDE8DF] flex items-center justify-between">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedItem.url);
                    onShowToast("Asset URL copied to clipboard", "info");
                  }}
                  className="font-ui text-xs font-medium text-[#C4952A] hover:underline"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => setDeleteTarget(selectedItem)}
                  className="font-ui text-xs text-red-600 hover:underline"
                >
                  Delete Asset
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF7F2] rounded-2xl border border-dashed border-[#EDE8DF] p-8 text-center text-xs font-ui text-[#7A776F]">
              Click on any media item to view its details, dimensions, and where it is currently used.
            </div>
          )}
        </div>
      </div>

      {/* Add Media Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full max-w-lg rounded-2xl shadow-2xl border border-[#EDE8DF] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">Add Media Asset</h3>
                <p className="font-ui text-xs text-[#7A776F]">Upload an image URL or cloud link</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A776F] hover:text-[#1A1916]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-[#EDE8DF] space-y-4">
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                    Image Public URL *
                  </label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                    Asset Name / Label
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. sufi-ensemble-stage.jpg"
                    className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    value={newAlt}
                    onChange={(e) => setNewAlt(e.target.value)}
                    placeholder="Brief description of the image content"
                    className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                  />
                </div>

                {newUrl && (
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE8DF]">
                    <p className="font-ui text-[10px] text-[#7A776F] font-semibold mb-2">Live Preview</p>
                    <img
                      src={newUrl}
                      alt="Preview"
                      className="w-full h-36 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#EDE8DF] flex items-center justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="font-ui text-xs font-semibold px-4 py-2.5 rounded-full border border-[#EDE8DF] text-[#4A4845]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedia}
                className="font-ui text-xs font-semibold px-6 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916]"
              >
                Add to Media Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Media Asset?"
        message="This asset will be permanently removed from your library. Any content using this image URL might display a broken image."
        itemName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteMedia?.(deleteTarget.id);
            onShowToast(`Deleted "${deleteTarget.name}"`, "warning");
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
