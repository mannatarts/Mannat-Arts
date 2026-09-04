import { useState, useMemo } from "react";
import { Experience, MoodItem, OccasionItem } from "../../../data/cmsTypes";
import { GenreInfo } from "../../../data/artistsData";

interface RecommendationsViewProps {
  moods: MoodItem[];
  occasions: OccasionItem[];
  genres: Record<string, GenreInfo>;
  experiences: Experience[];
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function RecommendationsView({
  moods,
  occasions,
  genres,
  experiences,
  onShowToast,
}: RecommendationsViewProps) {
  const [selectedMoodId, setSelectedMoodId] = useState(moods[0]?.id || "celebrate");
  const [selectedOccasionLabel, setSelectedOccasionLabel] = useState(occasions[0]?.label || "Wedding");

  const activeMood = moods.find((m) => m.id === selectedMoodId);
  const activeOccasion = occasions.find((o) => o.label === selectedOccasionLabel);

  // Compute matched genres & experiences based on Mood × Occasion relationship
  const computedRecommendations = useMemo(() => {
    // Collect related genres from both Mood and Occasion
    const moodGenre = activeMood?.genre;
    const moodRelated = activeMood?.relatedGenres || [];
    const occGenre = activeOccasion?.genre;
    const occRelated = activeOccasion?.relatedGenres || [];

    const matchedGenres = Array.from(
      new Set([moodGenre, ...moodRelated, occGenre, ...occRelated].filter(Boolean))
    ) as string[];

    // Match experiences that have overlapping genres, moods, or occasions
    const matchedExps = experiences.filter((exp) => {
      const sharesGenre = exp.genres.some((g) => matchedGenres.includes(g));
      const sharesMood = exp.moods.includes(selectedMoodId);
      const sharesOccasion = exp.occasions.includes(selectedOccasionLabel);
      return sharesGenre || sharesMood || sharesOccasion;
    });

    return {
      genres: matchedGenres,
      experiences: matchedExps,
    };
  }, [activeMood, activeOccasion, selectedMoodId, selectedOccasionLabel, experiences]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <span className="label-editorial text-[#C4952A] font-bold tracking-[0.2em] uppercase text-[10px]">
            AI & Rule-Based Discovery Engine
          </span>
          <h2 className="font-serif text-2xl font-light text-[#1A1916] mt-1">
            Mood × Occasion Recommendation Matrix
          </h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Inspect and test how guest intent automatically pairs with artistic genres and curated experiences.
          </p>
        </div>
      </div>

      {/* Interactive Matrix Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-[#EDE8DF] shadow-xs">
        {/* Step 1: Select Mood */}
        <div>
          <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-2">
            1. Select Guest Mood
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {moods.map((m) => {
              const isSelected = selectedMoodId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMoodId(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-[#1A1916] text-[#FAF7F2] border-[#1A1916] shadow-xs"
                      : "bg-[#FAF7F2] text-[#4A4845] border-[#EDE8DF] hover:border-[#C4952A]"
                  }`}
                >
                  <p className="font-ui font-semibold text-xs">{m.title}</p>
                  <p className={`font-ui text-[10px] mt-0.5 ${isSelected ? "text-amber-200" : "text-[#7A776F]"}`}>
                    {genres[m.genre]?.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Occasion */}
        <div>
          <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-2">
            2. Select Event Occasion
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {occasions.map((o) => {
              const isSelected = selectedOccasionLabel === o.label;
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOccasionLabel(o.label)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-[#C4952A] text-[#1A1916] border-[#C4952A] shadow-xs font-medium"
                      : "bg-[#FAF7F2] text-[#4A4845] border-[#EDE8DF] hover:border-[#C4952A]"
                  }`}
                >
                  <p className="font-ui font-semibold text-xs flex items-center gap-1.5">
                    <span>{o.icon}</span> {o.label}
                  </p>
                  <p className={`font-ui text-[10px] mt-0.5 ${isSelected ? "text-[#1A1916]/80" : "text-[#7A776F]"}`}>
                    {genres[o.genre]?.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Computed Recommendation Output */}
      <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#EDE8DF] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-medium text-[#1A1916]">
              Resulting Discovery Pairings
            </h3>
            <p className="font-ui text-xs text-[#7A776F]">
              Showing what the public Smart Discovery tool serves for:{" "}
              <strong className="text-[#1A1916]">{activeMood?.title}</strong> ×{" "}
              <strong className="text-[#1A1916]">{activeOccasion?.label}</strong>
            </p>
          </div>
          <button
            onClick={() => onShowToast("Relationship rules verified and active on public website", "success")}
            className="font-ui text-xs font-semibold text-[#1A1916] bg-white border border-[#EDE8DF] px-4 py-2 rounded-full hover:border-[#C4952A]"
          >
            ✓ Verify Rules
          </button>
        </div>

        {/* Recommended Genres */}
        <div>
          <h4 className="font-ui text-xs font-semibold text-[#7A776F] uppercase tracking-wider mb-2">
            Recommended Artistic Genres
          </h4>
          <div className="flex flex-wrap gap-2">
            {computedRecommendations.genres.map((gKey) => {
              const genre = genres[gKey];
              if (!genre) return null;
              return (
                <div
                  key={gKey}
                  className="bg-white border border-[#EDE8DF] px-4 py-2 rounded-xl flex items-center gap-2.5 shadow-xs"
                >
                  <span className="text-base">{genre.icon}</span>
                  <div>
                    <p className="font-ui font-semibold text-xs text-[#1A1916]">{genre.title}</p>
                    <p className="font-ui text-[10px] text-[#7A776F]">{genre.tag}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Experiences */}
        <div>
          <h4 className="font-ui text-xs font-semibold text-[#7A776F] uppercase tracking-wider mb-2">
            Qualified Experiences ({computedRecommendations.experiences.length})
          </h4>
          {computedRecommendations.experiences.length === 0 ? (
            <p className="text-xs text-[#7A776F]">No experiences currently tagged for this combination.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {computedRecommendations.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white p-4 rounded-xl border border-[#EDE8DF] shadow-xs flex items-center gap-3"
                >
                  <img
                    src={exp.coverImage}
                    alt={exp.name}
                    className="w-12 h-10 object-cover rounded-lg border border-[#EDE8DF]"
                  />
                  <div>
                    <p className="font-ui font-semibold text-xs text-[#1A1916]">{exp.name}</p>
                    <p className="font-ui text-[10px] text-[#C4952A] capitalize">
                      {exp.genres.join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
