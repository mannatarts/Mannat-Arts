import { useState } from "react";

interface WebsitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishNow: () => void;
  lastSavedText?: string;
}

export function WebsitePreviewModal({
  isOpen,
  onClose,
  onPublishNow,
  lastSavedText = "Draft changes pending publish",
}: WebsitePreviewModalProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [scale, setScale] = useState<number>(100);

  if (!isOpen) return null;

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      case "desktop":
      default:
        return "100%";
    }
  };

  const getDeviceHeight = () => {
    switch (device) {
      case "mobile":
        return "720px";
      case "tablet":
        return "840px";
      case "desktop":
      default:
        return "100%";
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-[#1A1916] text-[#FAF7F2] animate-fadeIn">
      {/* Top Preview Bar */}
      <div className="h-14 px-6 bg-[#262420] border-b border-[#3A3833] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-ui text-xs font-semibold text-[#DDB96A] tracking-wider uppercase">
              Preview Mode
            </span>
          </div>
          <span className="text-[#7A776F] text-xs">|</span>
          <span className="font-ui text-xs text-[#A8A49A]">{lastSavedText}</span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-[#1A1916] p-1 rounded-xl border border-[#3A3833]">
          <button
            onClick={() => setDevice("desktop")}
            className={`font-ui text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              device === "desktop"
                ? "bg-[#C4952A] text-[#1A1916] font-semibold"
                : "text-[#A8A49A] hover:text-white"
            }`}
          >
            <span>🖥️</span> Desktop (100%)
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`font-ui text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              device === "tablet"
                ? "bg-[#C4952A] text-[#1A1916] font-semibold"
                : "text-[#A8A49A] hover:text-white"
            }`}
          >
            <span>📱</span> Tablet (768px)
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`font-ui text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              device === "mobile"
                ? "bg-[#C4952A] text-[#1A1916] font-semibold"
                : "text-[#A8A49A] hover:text-white"
            }`}
          >
            <span>📲</span> Mobile (375px)
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onPublishNow();
              onClose();
            }}
            className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-5 py-2 rounded-full transition-all shadow-md"
          >
            ✓ Publish Changes to Live
          </button>
          <button
            onClick={onClose}
            className="font-ui text-xs font-medium text-[#A8A49A] hover:text-white bg-[#3A3833] hover:bg-[#4A4843] px-4 py-2 rounded-full transition-all"
          >
            Close Preview
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#12110F]">
        <div
          className={`transition-all duration-300 bg-white rounded-xl shadow-2xl overflow-hidden border border-[#3A3833] flex flex-col ${
            device === "desktop" ? "w-full h-full max-w-7xl rounded-none border-none" : ""
          }`}
          style={{
            width: getDeviceWidth(),
            height: getDeviceHeight(),
          }}
        >
          {/* Simulated Browser Address Bar for Mobile/Tablet */}
          {device !== "desktop" && (
            <div className="h-8 bg-[#FAF7F2] border-b border-[#EDE8DF] px-3 flex items-center justify-between text-[11px] text-[#7A776F] font-ui select-none">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="bg-white px-4 py-0.5 rounded-full border border-[#EDE8DF] text-[10px] text-[#4A4845] font-medium">
                mannatarts.netlify.app
              </div>
              <div>⚡</div>
            </div>
          )}

          {/* Iframe pointing to public website preview */}
          <iframe
            src={window.location.origin + window.location.pathname}
            title="Mannat Arts Live Preview"
            className="w-full flex-1 border-none bg-[#FAF7F2]"
          />
        </div>
      </div>
    </div>
  );
}
