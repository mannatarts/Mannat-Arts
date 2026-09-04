import { useState } from "react";
import { FooterConfig } from "../../../data/cmsTypes";

interface FooterCMSViewProps {
  footer: FooterConfig;
  onUpdateFooter: (updated: FooterConfig) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function FooterCMSView({
  footer,
  onUpdateFooter,
  onShowToast,
}: FooterCMSViewProps) {
  const [formData, setFormData] = useState<FooterConfig>(footer);

  const handleSave = () => {
    onUpdateFooter(formData);
    onShowToast("Footer configuration saved successfully", "success");
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Footer Management</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Configure closing branding, concierge coordinates, copyright, and social links.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-6 py-2.5 rounded-full transition-all shadow-sm"
        >
          Save Footer Changes
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 space-y-5 shadow-xs">
        <div>
          <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
            Footer Brand Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
              Contact Concierge Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
            />
          </div>

          <div>
            <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
              Contact Phone / WhatsApp
            </label>
            <input
              type="text"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
            />
          </div>
        </div>

        <div>
          <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
            Official Studio / Headquarters Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
            Copyright Notice
          </label>
          <input
            type="text"
            value={formData.copyrightText}
            onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
            className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
          />
        </div>
      </div>
    </div>
  );
}
