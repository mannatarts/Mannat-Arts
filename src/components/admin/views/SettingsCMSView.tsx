import { useState } from "react";
import { GeneralSettingsConfig } from "../../../data/cmsTypes";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal";

interface SettingsCMSViewProps {
  settings: GeneralSettingsConfig;
  onUpdateSettings: (updated: GeneralSettingsConfig) => void;
  onResetAllToDefaults: () => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function SettingsCMSView({
  settings,
  onUpdateSettings,
  onResetAllToDefaults,
  onShowToast,
}: SettingsCMSViewProps) {
  const [formData, setFormData] = useState<GeneralSettingsConfig>(settings);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSave = () => {
    onUpdateSettings(formData);
    onShowToast("System settings saved", "success");
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Website Settings</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            General brand credentials, studio coordinates, and analytics.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-6 py-2.5 rounded-full transition-all shadow-sm"
        >
          Save Settings
        </button>
      </div>

      {/* General Information */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 space-y-4 shadow-xs">
        <h3 className="font-serif text-base font-medium text-[#1A1916]">General & Branding</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
              Platform Name
            </label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
            />
          </div>

          <div>
            <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
              Brand Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
              Navbar Logo Title
            </label>
            <input
              type="text"
              value={formData.logoText}
              onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
              className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
            />
          </div>

          <div>
            <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
              Navbar Logo Subtitle
            </label>
            <input
              type="text"
              value={formData.logoSubtitle}
              onChange={(e) => setFormData({ ...formData, logoSubtitle: e.target.value })}
              className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
              Brand Accent Gold Hex
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-9 h-9 rounded-lg border-none cursor-pointer"
              />
              <input
                type="text"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="flex-1 text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
              Google Analytics ID
            </label>
            <input
              type="text"
              value={formData.analyticsId}
              onChange={(e) => setFormData({ ...formData, analyticsId: e.target.value })}
              className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset to Defaults */}
      <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 space-y-3">
        <h3 className="font-serif text-base font-medium text-red-900">Reset Content Demo Defaults</h3>
        <p className="font-ui text-xs text-red-700 leading-relaxed">
          Restore all experiences, artists, genres, moods, occasions, stories, and homepage settings back to the initial demo state.
        </p>
        <button
          onClick={() => setIsResetModalOpen(true)}
          className="font-ui text-xs font-semibold px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all shadow-xs"
        >
          Reset All Data to Demo Defaults
        </button>
      </div>

      {/* Confirm Reset Modal */}
      <ConfirmDeleteModal
        isOpen={isResetModalOpen}
        title="Reset Entire CMS to Factory Defaults?"
        message="This will overwrite any changes you made in localStorage and reset all content, artists, and homepage sections to default seed data."
        onCancel={() => setIsResetModalOpen(false)}
        onConfirm={() => {
          onResetAllToDefaults();
          setIsResetModalOpen(false);
        }}
      />
    </div>
  );
}
