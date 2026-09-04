import { useState, useEffect } from "react";
import { HomepageConfig, HomepageSection, HeroConfig, FinalCtaConfig, MediaItem } from "../../../data/cmsTypes";
import { MediaPickerModal } from "../MediaPickerModal";

interface HomepageCMSViewProps {
  homepage: HomepageConfig;
  onUpdateHomepage: (updated: HomepageConfig) => void;
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
  onPreviewWebsite: () => void;
}

export function HomepageCMSView({
  homepage,
  onUpdateHomepage,
  mediaList,
  onUploadMedia,
  onShowToast,
  onPreviewWebsite,
}: HomepageCMSViewProps) {
  const [sections, setSections] = useState<HomepageSection[]>(homepage.sections);
  const [hero, setHero] = useState<HeroConfig>(homepage.hero);
  const [finalCta, setFinalCta] = useState<FinalCtaConfig>(homepage.finalCta);
  const [activeTab, setActiveTab] = useState<"sections" | "hero" | "final-cta">("sections");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Sync local state when parent prop changes (e.g. after reset/publish)
  useEffect(() => { setSections(homepage.sections); }, [homepage.sections]);
  useEffect(() => { setHero(homepage.hero); }, [homepage.hero]);
  useEffect(() => { setFinalCta(homepage.finalCta); }, [homepage.finalCta]);

  // Hero save uses current local hero state merged into the current homepage
  const handleSaveHero = () => {
    const updated: HomepageConfig = { sections, hero, finalCta };
    onUpdateHomepage(updated);
    onShowToast("Homepage hero saved successfully", "success");
  };

  const handleSaveFinalCta = () => {
    const updated: HomepageConfig = { sections, hero, finalCta };
    onUpdateHomepage(updated);
    onShowToast("Closing call-to-action saved successfully", "success");
  };


  // Section reordering
  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    // Update order numbers
    const reindexed = newSections.map((s, i) => ({ ...s, order: i + 1 }));
    setSections(reindexed);
    onUpdateHomepage({ sections: reindexed, hero, finalCta });
    onShowToast(`Moved "${moved.name}" ${direction}`, "info");
  };

  const toggleVisibility = (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    );
    setSections(updated);
    onUpdateHomepage({ sections: updated, hero, finalCta });
    const target = updated.find((s) => s.id === id);
    onShowToast(`Section "${target?.name}" is now ${target?.isVisible ? "Visible" : "Hidden"}`, "info");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Homepage Management</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Configure section order, hero presentation, and closing calls-to-action.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onPreviewWebsite}
            className="font-ui text-xs font-semibold px-4 py-2.5 rounded-full border border-[#EDE8DF] hover:border-[#C4952A] text-[#1A1916] bg-[#FAF7F2] transition-colors"
          >
            Preview Live Layout ↗
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDE8DF] pb-2">
        {[
          { id: "sections", label: "Page Sections & Hierarchy", count: sections.length },
          { id: "hero", label: "Hero Banner Editor" },
          { id: "final-cta", label: "Closing CTA Editor" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`font-ui text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#1A1916] text-[#FAF7F2]"
                : "text-[#7A776F] hover:text-[#1A1916] hover:bg-[#EDE8DF]/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Reorderable Sections */}
      {activeTab === "sections" && (
        <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-xs">
          <div className="p-4 bg-[#FAF7F2] border-b border-[#EDE8DF] flex items-center justify-between text-xs font-ui text-[#7A776F]">
            <span>Reorder or toggle visibility for each homepage row</span>
            <span>{sections.filter((s) => s.isVisible).length} of {sections.length} Visible</span>
          </div>

          <div className="divide-y divide-[#EDE8DF]">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className="p-4 flex items-center justify-between hover:bg-[#FAF7F2]/60 transition-colors gap-4"
              >
                {/* Left: Reorder controls + Name */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveSection(idx, "up")}
                      disabled={idx === 0}
                      className="w-6 h-6 rounded flex items-center justify-center text-xs text-[#7A776F] hover:text-[#1A1916] hover:bg-[#EDE8DF] disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Move section up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveSection(idx, "down")}
                      disabled={idx === sections.length - 1}
                      className="w-6 h-6 rounded flex items-center justify-center text-xs text-[#7A776F] hover:text-[#1A1916] hover:bg-[#EDE8DF] disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Move section down"
                    >
                      ▼
                    </button>
                  </div>

                  <span className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#EDE8DF] flex items-center justify-center font-ui text-[11px] font-semibold text-[#7A776F]">
                    {idx + 1}
                  </span>

                  <div>
                    <h4 className="font-ui font-semibold text-xs text-[#1A1916] flex items-center gap-2">
                      {section.name}
                      {section.id === "hero" && (
                        <span className="text-[9px] font-bold text-[#C4952A] bg-[#C4952A]/10 px-2 py-0.5 rounded-full">
                          PRIMARY
                        </span>
                      )}
                    </h4>
                    <p className="font-ui text-[11px] text-[#7A776F]">{section.description}</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                  {section.id === "hero" && (
                    <button
                      onClick={() => setActiveTab("hero")}
                      className="font-ui text-[11px] font-medium text-[#C4952A] hover:underline"
                    >
                      Edit Hero →
                    </button>
                  )}
                  {section.id === "final-cta" && (
                    <button
                      onClick={() => setActiveTab("final-cta")}
                      className="font-ui text-[11px] font-medium text-[#C4952A] hover:underline"
                    >
                      Edit CTA →
                    </button>
                  )}

                  {/* Toggle Visibility Switch */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="font-ui text-[11px] text-[#7A776F]">
                      {section.isVisible ? "Visible" : "Hidden"}
                    </span>
                    <div
                      onClick={() => toggleVisibility(section.id)}
                      className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                        section.isVisible ? "bg-[#1A1916]" : "bg-[#D6CFBF]"
                      }`}
                    >
                      <div
                        className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ${
                          section.isVisible ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Hero Editor */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-4">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1A1916]">Hero Banner Content</h3>
              <p className="font-ui text-xs text-[#7A776F]">
                The first visual experience visitors see when arriving at Mannat Arts.
              </p>
            </div>
            <button
              onClick={handleSaveHero}
              className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-6 py-2.5 rounded-full transition-all shadow-sm"
            >
              Save Hero Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={hero.eyebrow}
                  onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>

              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                  Main Headline (Line 1)
                </label>
                <input
                  type="text"
                  value={hero.headline}
                  onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>

              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                  Headline Italic Accent (Line 2)
                </label>
                <input
                  type="text"
                  value={hero.headlineItalic}
                  onChange={(e) => setHero({ ...hero, headlineItalic: e.target.value })}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>

              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                  Supporting Editorial Copy
                </label>
                <textarea
                  rows={3}
                  value={hero.description}
                  onChange={(e) => setHero({ ...hero, description: e.target.value })}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#C4952A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={hero.primaryCtaLabel}
                    onChange={(e) => setHero({ ...hero, primaryCtaLabel: e.target.value })}
                    className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={hero.secondaryCtaLabel}
                    onChange={(e) => setHero({ ...hero, secondaryCtaLabel: e.target.value })}
                    className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Right: Background image & Visual Preview */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-ui text-xs font-bold text-[#C4952A] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Hero Banner Preview
                  </span>
                  <button
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="font-ui text-xs text-[#C4952A] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>🖼️</span> Choose Photo
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-[#1A1916] border border-[#EDE8DF] shadow-md group">
                  <img
                    src={hero.bgImage}
                    alt="Hero banner"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay simulator */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, rgba(26,25,22,${hero.overlayOpacity}) 0%, rgba(26,25,22,${hero.overlayOpacity * 0.7}) 50%, rgba(26,25,22,0.2) 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white pointer-events-none">
                    <span className="text-[9px] tracking-[0.2em] text-[#DDB96A] font-ui">
                      {hero.eyebrow}
                    </span>
                    <h2
                      className="font-serif text-2xl sm:text-3xl font-light leading-tight mt-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {hero.headline} <em className="italic text-[#DDB96A]">{hero.headlineItalic}</em>
                    </h2>
                    <p className="font-ui text-[11px] text-white/80 line-clamp-2 mt-1 max-w-md">
                      {hero.description}
                    </p>

                    {/* Live CTA Buttons Preview */}
                    <div className="flex items-center gap-2.5 mt-3">
                      <span className="font-ui font-semibold text-[11px] bg-[#C4952A] text-[#1A1916] px-4 py-1.5 rounded-full shadow-sm">
                        {hero.primaryCtaLabel || "Explore Experiences"}
                      </span>
                      <span className="font-ui font-medium text-[11px] text-white border border-white/40 px-4 py-1.5 rounded-full">
                        {hero.secondaryCtaLabel || "Find by Mood ↓"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EDE8DF]">
                <div className="flex items-center justify-between text-xs font-ui mb-1">
                  <label className="font-semibold text-[#1A1916]">Cinematic Dark Overlay</label>
                  <span className="text-[#C4952A] font-bold">{Math.round(hero.overlayOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="0.95"
                  step="0.05"
                  value={hero.overlayOpacity}
                  onChange={(e) => setHero({ ...hero, overlayOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-[#C4952A] cursor-pointer"
                />
                <p className="text-[10px] text-[#7A776F] mt-1">Adjust overlay darkness so text is crisp and readable over the stage photo.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Final CTA Editor */}
      {activeTab === "final-cta" && (
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-4">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1A1916]">Closing Call-to-Action Banner</h3>
              <p className="font-ui text-xs text-[#7A776F]">
                The bottom invitation prompting guests to plan their event with live preview.
              </p>
            </div>
            <button
              onClick={handleSaveFinalCta}
              className="font-ui text-xs font-semibold bg-[#1A1916] hover:bg-[#2E2C28] text-white px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
            >
              Save CTA Changes
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                  Eyebrow Text
                </label>
                <input
                  type="text"
                  value={finalCta.eyebrow}
                  onChange={(e) => setFinalCta({ ...finalCta, eyebrow: e.target.value })}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                />
              </div>

              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={finalCta.headline}
                  onChange={(e) => setFinalCta({ ...finalCta, headline: e.target.value })}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                />
              </div>

              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                  Headline Italic Accent
                </label>
                <input
                  type="text"
                  value={finalCta.headlineItalic}
                  onChange={(e) => setFinalCta({ ...finalCta, headlineItalic: e.target.value })}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                />
              </div>

              <div>
                <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={finalCta.description}
                  onChange={(e) => setFinalCta({ ...finalCta, description: e.target.value })}
                  className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={finalCta.primaryCtaLabel}
                    onChange={(e) => setFinalCta({ ...finalCta, primaryCtaLabel: e.target.value })}
                    className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    value={finalCta.secondaryCtaLabel}
                    onChange={(e) => setFinalCta({ ...finalCta, secondaryCtaLabel: e.target.value })}
                    className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Right: Live Closing CTA Preview (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-ui text-[11px] font-bold text-[#C4952A] tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Banner Preview
                  </span>
                  <span className="text-[10px] font-ui text-[#7A776F]">Updates in real-time</span>
                </div>

                {/* 1:1 Live Closing CTA Banner Card */}
                <div className="bg-[#1A1916] text-[#FAF7F2] p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[320px]">
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#C4952A]/10 blur-3xl pointer-events-none" />
                  <div>
                    <span className="font-ui text-[9px] font-bold tracking-[0.2em] text-[#DDB96A] uppercase block mb-3">
                      {finalCta.eyebrow || "LET'S CREATE SOMETHING UNFORGETTABLE"}
                    </span>
                    <h3
                      className="font-serif text-2xl font-light leading-tight text-white mb-2"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {finalCta.headline || "Every extraordinary event"}{" "}
                      <em className="italic text-[#DDB96A]">{finalCta.headlineItalic || "begins with a spark."}</em>
                    </h3>
                    <p className="font-ui text-xs text-[#A8A49A] leading-relaxed line-clamp-3">
                      {finalCta.description || "Whether it's an intimate baithak under starlit skies or an electrifying 2,000-seat corporate gala..."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-4">
                    <span className="font-ui font-semibold text-xs bg-[#C4952A] text-[#1A1916] px-4 py-2 rounded-full shadow-md">
                      {finalCta.primaryCtaLabel || "Plan an Event"}
                    </span>
                    <span className="font-ui font-medium text-xs text-white border border-white/30 px-4 py-2 rounded-full">
                      {finalCta.secondaryCtaLabel || "Explore All Artists"}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE8DF] text-[11px] font-ui text-[#7A776F]">
                  <p className="font-semibold text-[#1A1916]">💡 What Visitors See:</p>
                  <p>This banner serves as the grand finale of your homepage inviting clients to get in touch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mediaList={mediaList}
        onUploadMedia={onUploadMedia}
        onSelectMedia={(url) => setHero({ ...hero, bgImage: url })}
        title="Select Hero Background Image"
      />
    </div>
  );
}
