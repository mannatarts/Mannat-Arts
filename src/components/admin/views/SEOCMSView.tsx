import { useState } from "react";
import { GlobalSEOConfig, MediaItem } from "../../../data/cmsTypes";
import { MediaPickerModal } from "../MediaPickerModal";

interface SEOCMSViewProps {
  seo: GlobalSEOConfig;
  onUpdateSEO: (updated: GlobalSEOConfig) => void;
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function SEOCMSView({
  seo,
  onUpdateSEO,
  mediaList,
  onUploadMedia,
  onShowToast,
}: SEOCMSViewProps) {
  const [formData, setFormData] = useState<GlobalSEOConfig>(seo);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleSave = () => {
    onUpdateSEO(formData);
    onShowToast("Global SEO settings updated", "success");
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Search Engine Optimization (SEO)</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Optimize how Mannat Arts appears on Google, WhatsApp previews, and social media.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-6 py-2.5 rounded-full transition-all shadow-sm"
        >
          Save SEO Settings
        </button>
      </div>

      {/* Google Preview Card */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-xs space-y-2">
        <span className="text-[10px] font-semibold text-[#7A776F] uppercase tracking-wider block">
          Live Google Search Snippet Preview
        </span>
        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EDE8DF] space-y-1">
          <p className="text-[#1A0DAB] font-medium text-base hover:underline cursor-pointer">
            {formData.siteTitle || "Mannat Arts — Cultural Experiences"}
          </p>
          <p className="text-[#006621] text-xs">https://mannatarts.netlify.app</p>
          <p className="text-[#545454] text-xs leading-relaxed">
            {formData.siteDescription || "Cultural discovery platform connecting master performers with extraordinary events."}
          </p>
        </div>
      </div>

      {/* SEO Form */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 space-y-4 shadow-xs">
        <div>
          <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
            Global Website Meta Title
          </label>
          <input
            type="text"
            value={formData.siteTitle}
            onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
            className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
          />
          <p className="font-ui text-[10px] text-[#7A776F] mt-1">Recommended length: 50-60 characters</p>
        </div>

        <div>
          <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
            Global Search Meta Description
          </label>
          <textarea
            rows={3}
            value={formData.siteDescription}
            onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
            className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
          />
          <p className="font-ui text-[10px] text-[#7A776F] mt-1">Recommended length: 140-160 characters</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-ui text-xs font-semibold text-[#1A1916]">
              Default Social Sharing Card Image (OG Image)
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
              src={formData.defaultSocialImage}
              alt="Social sharing"
              className="w-28 h-16 object-cover rounded-xl border border-[#EDE8DF]"
            />
            <input
              type="text"
              value={formData.defaultSocialImage}
              onChange={(e) => setFormData({ ...formData, defaultSocialImage: e.target.value })}
              className="flex-1 text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
            Editorial Author / Organization
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
          />
        </div>
      </div>

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mediaList={mediaList}
        onUploadMedia={onUploadMedia}
        onSelectMedia={(url) => setFormData({ ...formData, defaultSocialImage: url })}
        title="Select Default Social Sharing Image"
      />
    </div>
  );
}
