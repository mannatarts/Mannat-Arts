import { useState } from "react";
import { Experience, MoodItem } from "../../../data/cmsTypes";
import { Artist, GenreInfo } from "../../../data/artistsData";
import { BlogArticle } from "../../../data/blogData";

interface FeaturedContentViewProps {
  experiences: Experience[];
  onUpdateExperience: (exp: Experience) => void;
  artists: Artist[];
  featuredArtistIds: string[];
  onSetFeaturedArtistIds: (ids: string[]) => void;
  stories: BlogArticle[];
  onUpdateStory: (story: BlogArticle) => void;
  genres: Record<string, GenreInfo>;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function FeaturedContentView({
  experiences,
  onUpdateExperience,
  artists,
  featuredArtistIds,
  onSetFeaturedArtistIds,
  stories,
  onUpdateStory,
  genres,
  onShowToast,
}: FeaturedContentViewProps) {
  const [activeTab, setActiveTab] = useState<"experiences" | "artists" | "stories">("experiences");

  const toggleExperienceFeatured = (exp: Experience) => {
    onUpdateExperience({ ...exp, isFeatured: !exp.isFeatured });
    onShowToast(`Experience "${exp.name}" featured status updated`, "info");
  };

  const toggleArtistFeatured = (id: string) => {
    const isFeat = featuredArtistIds.includes(id);
    const next = isFeat ? featuredArtistIds.filter((x) => x !== id) : [...featuredArtistIds, id];
    onSetFeaturedArtistIds(next);
    onShowToast("Artist featured status updated", "info");
  };

  const toggleStoryFeatured = (story: BlogArticle) => {
    onUpdateStory({ ...story, featured: !story.featured });
    onShowToast(`Story "${story.title}" featured status updated`, "info");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Featured Content Command Center</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Centrally curate what experiences, artists, and stories appear in prominent featured positions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDE8DF] pb-2">
        <button
          onClick={() => setActiveTab("experiences")}
          className={`font-ui text-xs font-semibold px-4 py-2 rounded-full transition-all ${
            activeTab === "experiences"
              ? "bg-[#1A1916] text-white"
              : "text-[#7A776F] hover:text-[#1A1916]"
          }`}
        >
          Featured Experiences ({experiences.filter((e) => e.isFeatured).length})
        </button>
        <button
          onClick={() => setActiveTab("artists")}
          className={`font-ui text-xs font-semibold px-4 py-2 rounded-full transition-all ${
            activeTab === "artists"
              ? "bg-[#1A1916] text-white"
              : "text-[#7A776F] hover:text-[#1A1916]"
          }`}
        >
          Featured Artists ({featuredArtistIds.length})
        </button>
        <button
          onClick={() => setActiveTab("stories")}
          className={`font-ui text-xs font-semibold px-4 py-2 rounded-full transition-all ${
            activeTab === "stories"
              ? "bg-[#1A1916] text-white"
              : "text-[#7A776F] hover:text-[#1A1916]"
          }`}
        >
          Featured Stories ({stories.filter((s) => s.featured).length})
        </button>
      </div>

      {/* Tab: Experiences */}
      {activeTab === "experiences" && (
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-xs">
          <p className="font-ui text-xs text-[#7A776F] mb-4">
            These curated experiences are prominently displayed on the homepage showcase.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-xl border border-[#EDE8DF] flex items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={exp.coverImage}
                    alt={exp.name}
                    className="w-12 h-10 object-cover rounded-lg border border-[#EDE8DF]"
                  />
                  <div>
                    <p className="font-ui font-semibold text-xs text-[#1A1916]">{exp.name}</p>
                    <p className="font-ui text-[11px] text-[#7A776F] capitalize">{exp.genres.join(", ")}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleExperienceFeatured(exp)}
                  className={`font-ui text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    exp.isFeatured
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-[#FAF7F2] text-[#7A776F] border-[#EDE8DF] hover:border-[#C4952A]"
                  }`}
                >
                  {exp.isFeatured ? "★ Featured" : "+ Feature"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Artists */}
      {activeTab === "artists" && (
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-xs">
          <p className="font-ui text-xs text-[#7A776F] mb-4">
            Highlighted artists on the homepage performers grid.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artists.map((artist) => {
              const isFeat = featuredArtistIds.includes(artist.id);
              return (
                <div
                  key={artist.id}
                  className="p-4 rounded-xl border border-[#EDE8DF] flex items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={artist.img}
                      alt={artist.name}
                      className="w-10 h-10 object-cover rounded-full border border-[#EDE8DF]"
                    />
                    <div>
                      <p className="font-ui font-semibold text-xs text-[#1A1916]">{artist.name}</p>
                      <p className="font-ui text-[11px] text-[#7A776F]">{artist.genreTitle} · {artist.city}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleArtistFeatured(artist.id)}
                    className={`font-ui text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      isFeat
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-[#FAF7F2] text-[#7A776F] border-[#EDE8DF] hover:border-[#C4952A]"
                    }`}
                  >
                    {isFeat ? "★ Featured" : "+ Feature"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Stories */}
      {activeTab === "stories" && (
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-xs">
          <p className="font-ui text-xs text-[#7A776F] mb-4">
            Lead spotlight stories appearing on journal hero sections.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="p-4 rounded-xl border border-[#EDE8DF] flex items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={story.coverImg}
                    alt={story.title}
                    className="w-12 h-9 object-cover rounded-lg border border-[#EDE8DF]"
                  />
                  <div>
                    <p className="font-ui font-semibold text-xs text-[#1A1916] line-clamp-1">{story.title}</p>
                    <p className="font-ui text-[11px] text-[#7A776F]">{story.category}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleStoryFeatured(story)}
                  className={`font-ui text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    story.featured
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-[#FAF7F2] text-[#7A776F] border-[#EDE8DF] hover:border-[#C4952A]"
                  }`}
                >
                  {story.featured ? "★ Featured" : "+ Feature"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
