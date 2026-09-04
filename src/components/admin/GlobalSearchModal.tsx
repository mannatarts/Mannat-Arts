import { useState, useMemo } from "react";
import { Experience, MoodItem, OccasionItem } from "../../data/cmsTypes";
import { Artist, GenreInfo } from "../../data/artistsData";
import { BlogArticle } from "../../data/blogData";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiences: Experience[];
  artists: Artist[];
  genres: Record<string, GenreInfo>;
  moods: MoodItem[];
  occasions: OccasionItem[];
  stories: BlogArticle[];
  onNavigateToView: (view: string, entityId?: string) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  experiences,
  artists,
  genres,
  moods,
  occasions,
  stories,
  onNavigateToView,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedExp = experiences.filter(
      (e) => e.name.toLowerCase().includes(q) || e.shortDesc.toLowerCase().includes(q)
    );
    const matchedArtists = artists.filter(
      (a) => a.name.toLowerCase().includes(q) || a.bio.toLowerCase().includes(q)
    );
    const matchedGenres = Object.values(genres).filter(
      (g) => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
    );
    const matchedMoods = moods.filter(
      (m) => m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)
    );
    const matchedOccasions = occasions.filter(
      (o) => o.label.toLowerCase().includes(q) || o.desc.toLowerCase().includes(q)
    );
    const matchedStories = stories.filter(
      (s) => s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)
    );

    return {
      experiences: matchedExp,
      artists: matchedArtists,
      genres: matchedGenres,
      moods: matchedMoods,
      occasions: matchedOccasions,
      stories: matchedStories,
      total:
        matchedExp.length +
        matchedArtists.length +
        matchedGenres.length +
        matchedMoods.length +
        matchedOccasions.length +
        matchedStories.length,
    };
  }, [query, experiences, artists, genres, moods, occasions, stories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[115] flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#EDE8DF] overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Header */}
        <div className="p-4 bg-white border-b border-[#EDE8DF] flex items-center gap-3">
          <span className="text-[#C4952A] text-lg">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search experiences, artists, genres, moods, occasions, stories..."
            autoFocus
            className="flex-1 text-sm font-ui bg-transparent border-none outline-none text-[#1A1916] placeholder-[#7A776F]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-[#7A776F] hover:text-[#1A1916] px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] px-2.5 py-1 rounded-md text-[#7A776F] hover:text-[#1A1916]"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="text-center py-10 text-xs text-[#7A776F] font-ui">
              Type anything to search across all CMS content...
            </div>
          ) : results && results.total === 0 ? (
            <div className="text-center py-10 text-xs text-[#7A776F] font-ui">
              No results found matching "{query}".
            </div>
          ) : results ? (
            <div className="space-y-4 text-xs font-ui">
              {/* Experiences */}
              {results.experiences.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#7A776F] uppercase tracking-wider text-[10px] mb-2">
                    Experiences ({results.experiences.length})
                  </h4>
                  <div className="space-y-1">
                    {results.experiences.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => {
                          onNavigateToView("experiences", exp.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#F5F0E8] border border-[#EDE8DF] flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-medium text-[#1A1916]">{exp.name}</p>
                          <p className="text-[#7A776F] text-[11px] truncate max-w-md">{exp.shortDesc}</p>
                        </div>
                        <span className="text-[10px] bg-[#C4952A]/15 text-[#9A7219] font-medium px-2 py-0.5 rounded-full">
                          Experience
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Artists */}
              {results.artists.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#7A776F] uppercase tracking-wider text-[10px] mb-2">
                    Artists ({results.artists.length})
                  </h4>
                  <div className="space-y-1">
                    {results.artists.map((artist) => (
                      <button
                        key={artist.id}
                        onClick={() => {
                          onNavigateToView("artists", artist.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#F5F0E8] border border-[#EDE8DF] flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={artist.img}
                            alt={artist.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-[#1A1916]">{artist.name}</p>
                            <p className="text-[#7A776F] text-[11px]">{artist.genreTitle} · {artist.city}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-medium px-2 py-0.5 rounded-full">
                          Artist
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Genres */}
              {results.genres.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#7A776F] uppercase tracking-wider text-[10px] mb-2">
                    Genres ({results.genres.length})
                  </h4>
                  <div className="space-y-1">
                    {results.genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => {
                          onNavigateToView("genres", genre.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#F5F0E8] border border-[#EDE8DF] flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-medium text-[#1A1916]">{genre.icon} {genre.title}</p>
                          <p className="text-[#7A776F] text-[11px]">{genre.description}</p>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full">
                          Genre
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Moods */}
              {results.moods.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#7A776F] uppercase tracking-wider text-[10px] mb-2">
                    Moods ({results.moods.length})
                  </h4>
                  <div className="space-y-1">
                    {results.moods.map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => {
                          onNavigateToView("moods", mood.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#F5F0E8] border border-[#EDE8DF] flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-medium text-[#1A1916]">{mood.title}</p>
                          <p className="text-[#7A776F] text-[11px]">{mood.desc}</p>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                          Mood
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Occasions */}
              {results.occasions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#7A776F] uppercase tracking-wider text-[10px] mb-2">
                    Occasions ({results.occasions.length})
                  </h4>
                  <div className="space-y-1">
                    {results.occasions.map((occ) => (
                      <button
                        key={occ.id}
                        onClick={() => {
                          onNavigateToView("occasions", occ.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#F5F0E8] border border-[#EDE8DF] flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-medium text-[#1A1916]">{occ.icon} {occ.label}</p>
                          <p className="text-[#7A776F] text-[11px]">{occ.desc}</p>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
                          Occasion
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories */}
              {results.stories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#7A776F] uppercase tracking-wider text-[10px] mb-2">
                    Stories ({results.stories.length})
                  </h4>
                  <div className="space-y-1">
                    {results.stories.map((story) => (
                      <button
                        key={story.id}
                        onClick={() => {
                          onNavigateToView("stories", story.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#F5F0E8] border border-[#EDE8DF] flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-medium text-[#1A1916]">{story.title}</p>
                          <p className="text-[#7A776F] text-[11px]">{story.category} · {story.readTime}</p>
                        </div>
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-medium px-2 py-0.5 rounded-full">
                          Story
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#EDE8DF] flex items-center justify-between text-[11px] text-[#7A776F] font-ui">
          <span>Tip: Click any result to edit directly in CMS</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
