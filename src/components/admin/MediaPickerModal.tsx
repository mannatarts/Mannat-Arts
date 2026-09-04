import { useState } from "react";
import { MediaItem } from "../../data/cmsTypes";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (url: string, mediaItem?: MediaItem) => void;
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelectMedia,
  mediaList,
  onUploadMedia,
  title = "Choose from Media Library",
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadDataUrl, setUploadDataUrl] = useState("");

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.altText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmSelection = () => {
    if (activeTab === "library") {
      const item = mediaList.find((m) => m.id === selectedId);
      if (item) {
        onSelectMedia(item.url, item);
        onClose();
      }
    } else if (activeTab === "url") {
      if (urlInput.trim()) {
        onSelectMedia(urlInput.trim());
        onClose();
      }
    } else if (activeTab === "upload") {
      if (uploadDataUrl) {
        const newItem: MediaItem = {
          id: `med-${Date.now()}`,
          name: uploadName || `upload-${Date.now()}.jpg`,
          url: uploadDataUrl,
          type: "image",
          size: "450 KB",
          dimensions: "1200 × 800",
          altText: uploadAlt || uploadName || "Uploaded media",
          description: "Uploaded via Media Picker",
          uploadDate: new Date().toISOString().split("T")[0],
          usedIn: ["Content Editor"],
        };
        onUploadMedia?.(newItem);
        onSelectMedia(newItem.url, newItem);
        onClose();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setUploadDataUrl(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#EDE8DF] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between bg-white">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1A1916]">{title}</h3>
            <p className="font-ui text-xs text-[#7A776F]">Select an asset or upload a new one</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A776F] hover:text-[#1A1916] hover:bg-[#EDE8DF]/60 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 py-3 border-b border-[#EDE8DF] bg-[#F5F0E8] flex items-center gap-4">
          <button
            onClick={() => setActiveTab("library")}
            className={`font-ui text-xs font-semibold px-4 py-2 rounded-full transition-all ${
              activeTab === "library"
                ? "bg-[#1A1916] text-[#FAF7F2]"
                : "text-[#4A4845] hover:text-[#1A1916] hover:bg-white/60"
            }`}
          >
            Existing Media ({mediaList.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`font-ui text-xs font-semibold px-4 py-2 rounded-full transition-all ${
              activeTab === "upload"
                ? "bg-[#1A1916] text-[#FAF7F2]"
                : "text-[#4A4845] hover:text-[#1A1916] hover:bg-white/60"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`font-ui text-xs font-semibold px-4 py-2 rounded-full transition-all ${
              activeTab === "url"
                ? "bg-[#1A1916] text-[#FAF7F2]"
                : "text-[#4A4845] hover:text-[#1A1916] hover:bg-white/60"
            }`}
          >
            Web Image URL
          </button>

          {activeTab === "library" && (
            <div className="ml-auto w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media assets..."
                className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-full px-3 py-1.5 focus:outline-none focus:border-[#C4952A]"
              />
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "library" && (
            <div>
              {filteredMedia.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="font-ui text-sm text-[#7A776F]">No media items match your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#C4952A] shadow-md ring-2 ring-[#C4952A]/20"
                            : "border-transparent hover:border-[#C4952A]/40"
                        }`}
                      >
                        <div className="aspect-4/3 bg-[#EDE8DF] overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.altText}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-2.5 bg-white border-t border-[#EDE8DF]">
                          <p className="font-ui font-medium text-xs text-[#1A1916] truncate">{item.name}</p>
                          <p className="font-ui text-[10px] text-[#7A776F] mt-0.5">{item.dimensions} · {item.size}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-[#C4952A] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "upload" && (
            <div className="max-w-md mx-auto space-y-4 py-6">
              <div className="border-2 border-dashed border-[#C4952A]/40 hover:border-[#C4952A] bg-white rounded-2xl p-8 text-center cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="media-file-input"
                />
                <label htmlFor="media-file-input" className="cursor-pointer">
                  {uploadDataUrl ? (
                    <div className="space-y-3">
                      <img
                        src={uploadDataUrl}
                        alt="Preview"
                        className="w-40 h-28 object-cover mx-auto rounded-lg shadow-sm"
                      />
                      <p className="font-ui text-xs text-[#1A1916] font-medium">{uploadName}</p>
                      <span className="font-ui text-[11px] text-[#C4952A] hover:underline block">
                        Click to choose another image
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl text-[#C4952A]">📁</div>
                      <p className="font-ui text-sm font-semibold text-[#1A1916]">
                        Click to upload an image from your computer
                      </p>
                      <p className="font-ui text-xs text-[#7A776F]">Supports JPG, PNG, WEBP, SVG</p>
                    </div>
                  )}
                </label>
              </div>

              {uploadDataUrl && (
                <div className="space-y-3 bg-white p-4 rounded-xl border border-[#EDE8DF]">
                  <div>
                    <label className="block font-ui text-xs font-medium text-[#4A4845] mb-1">
                      Alt Text / Accessibility Description
                    </label>
                    <input
                      type="text"
                      value={uploadAlt}
                      onChange={(e) => setUploadAlt(e.target.value)}
                      placeholder="Brief description of what is in the image..."
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "url" && (
            <div className="max-w-md mx-auto space-y-4 py-8">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1.5">
                  Direct Image URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full text-xs font-ui bg-white border border-[#EDE8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4952A]"
                />
                <p className="font-ui text-[11px] text-[#7A776F] mt-1.5">
                  Paste any public HTTPS image link from Unsplash, Cloudinary, or your CDN.
                </p>
              </div>

              {urlInput && (
                <div className="p-3 bg-white rounded-xl border border-[#EDE8DF]">
                  <p className="font-ui text-[11px] text-[#7A776F] mb-2 font-medium">Live URL Preview:</p>
                  <img
                    src={urlInput}
                    alt="Preview"
                    className="w-full h-44 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#EDE8DF] bg-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="font-ui text-xs font-medium text-[#7A776F] hover:text-[#1A1916] px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={
              (activeTab === "library" && !selectedId) ||
              (activeTab === "upload" && !uploadDataUrl) ||
              (activeTab === "url" && !urlInput.trim())
            }
            className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-6 py-2.5 rounded-full transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Select Asset
          </button>
        </div>
      </div>
    </div>
  );
}
