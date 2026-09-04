import { useState, useMemo } from "react";
import { Artist, GenreInfo } from "../../../data/artistsData";
import { MediaItem } from "../../../data/cmsTypes";
import { MediaPickerModal } from "../MediaPickerModal";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal";

interface ArtistsCMSViewProps {
  artists: Artist[];
  genres: Record<string, GenreInfo>;
  featuredArtistIds: string[];
  onSetFeaturedArtistIds: (ids: string[]) => void;
  onAddArtist: (artist: Artist) => void;
  onUpdateArtist: (artist: Artist) => void;
  onDeleteArtist: (id: string) => void;
  mediaList: MediaItem[];
  onUploadMedia?: (item: MediaItem) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
  onPreviewArtist?: (artist: Artist) => void;
}

export function ArtistsCMSView({
  artists,
  genres,
  featuredArtistIds,
  onSetFeaturedArtistIds,
  onAddArtist,
  onUpdateArtist,
  onDeleteArtist,
  mediaList,
  onUploadMedia,
  onShowToast,
  onPreviewArtist,
}: ArtistsCMSViewProps) {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Artist | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const filtered = useMemo(() => {
    return artists.filter((a) => {
      const matchQuery =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.city.toLowerCase().includes(search.toLowerCase()) ||
        a.tagline.toLowerCase().includes(search.toLowerCase());
      const matchGenre = selectedGenre === "all" || a.genre === selectedGenre;
      return matchQuery && matchGenre;
    });
  }, [artists, search, selectedGenre]);

  const toggleFeatured = (id: string) => {
    const isFeat = featuredArtistIds.includes(id);
    const next = isFeat ? featuredArtistIds.filter((x) => x !== id) : [...featuredArtistIds, id];
    onSetFeaturedArtistIds(next);
    onShowToast(isFeat ? "Removed from featured showcase" : "Added to featured showcase", "info");
  };

  const handleOpenAdd = () => {
    const newArtist: Artist = {
      id: `artist-${Date.now()}`,
      name: "",
      genre: "sufi",
      genreTitle: "Sufi & Mystic",
      tagline: "",
      bio: "",
      img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1000&fit=crop&auto=format&q=80",
      rating: 5.0,
      reviewsCount: 1,
      price: "₹75,000",
      priceNum: 75000,
      city: "Jaipur",
      state: "Rajasthan",
      travelsPanIndia: true,
      performanceDuration: "90 - 120 minutes",
      bandType: "4-6 Piece Band",
      experienceYears: 8,
      eventsCompleted: 45,
      primaryInstruments: ["Harmonium", "Tabla", "Vocals"],
      themeColor: "#C4952A",
      whatElseTheyDo: [],
      sampleSetlist: ["Dama Dam Mast Qalandar", "Chhap Tilak", "Afreen Afreen"],
      sampleTracks: [],
      techRider: ["4 Vocal Mics", "2 D.I. Boxes", "Monitors"],
      reviews: [],
    };
    setEditingArtist(newArtist);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (artist: Artist) => {
    setEditingArtist({ ...artist });
    setIsEditorOpen(true);
  };

  const handleSaveArtist = () => {
    if (!editingArtist) return;
    if (!editingArtist.name.trim()) {
      onShowToast("Artist name is required", "warning");
      return;
    }

    const genreTitle = genres[editingArtist.genre]?.title || "Artistic Performer";
    const updated = { ...editingArtist, genreTitle };

    const exists = artists.some((a) => a.id === updated.id);
    if (exists) {
      onUpdateArtist(updated);
      onShowToast(`Artist "${updated.name}" updated`, "success");
    } else {
      onAddArtist(updated);
      onShowToast(`Artist "${updated.name}" added`, "success");
    }
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Artists & Performers</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Manage profiles, performance specs, booking tiers, and gallery assets.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="font-ui text-xs font-semibold bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916] px-5 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="font-bold">+</span> Add Artist
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EDE8DF] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artists by name, city..."
            className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#C4952A]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2 text-[#4A4845]"
          >
            <option value="all">All Genres</option>
            {Object.entries(genres).map(([k, g]) => (
              <option key={k} value={k}>{g.title}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#EDE8DF]">
            <button
              onClick={() => setViewMode("table")}
              className={`text-xs px-2.5 py-1 rounded-lg ${
                viewMode === "table" ? "bg-white font-semibold shadow-xs" : "text-[#7A776F]"
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`text-xs px-2.5 py-1 rounded-lg ${
                viewMode === "grid" ? "bg-white font-semibold shadow-xs" : "text-[#7A776F]"
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Content List: Table or Grid */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#EDE8DF] text-[11px] font-ui font-semibold text-[#7A776F] uppercase tracking-wider">
                  <th className="py-3 px-4">Artist</th>
                  <th className="py-3 px-4">Genre</th>
                  <th className="py-3 px-4">Band Format</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Honorarium Tier</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8DF] text-xs font-ui">
                {filtered.map((artist) => {
                  const isFeatured = featuredArtistIds.includes(artist.id);
                  return (
                    <tr key={artist.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={artist.img}
                            alt={artist.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#EDE8DF]"
                          />
                          <div>
                            <p className="font-semibold text-[#1A1916]">{artist.name}</p>
                            <p className="text-[11px] text-[#7A776F] line-clamp-1 max-w-xs">{artist.tagline}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#4A4845] border border-[#EDE8DF] text-[10px] font-medium">
                          {artist.genre}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#4A4845]">{artist.bandType}</td>
                      <td className="py-3 px-4 text-[#4A4845]">{artist.city}, {artist.state}</td>
                      <td className="py-3 px-4 font-semibold text-[#1A1916]">{artist.price}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleFeatured(artist.id)}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isFeatured
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "text-[#7A776F] hover:bg-[#FAF7F2]"
                          }`}
                        >
                          {isFeatured ? "★ Featured" : "☆ Feature"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(artist)}
                            className="px-2.5 py-1 text-xs text-[#1A1916] bg-[#FAF7F2] hover:bg-[#EDE8DF] rounded-lg font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onPreviewArtist?.(artist)}
                            className="px-2 py-1 text-xs text-[#7A776F] hover:text-[#1A1916]"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => setDeleteTarget(artist)}
                            className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((artist) => {
            const isFeatured = featuredArtistIds.includes(artist.id);
            return (
              <div
                key={artist.id}
                className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-4/3 bg-[#EDE8DF] overflow-hidden">
                  <img
                    src={artist.img}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className="capitalize px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px]">
                      {artist.genre}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-base font-medium text-[#1A1916]">{artist.name}</h4>
                    <p className="font-ui text-xs text-[#7A776F] line-clamp-2 mt-0.5">{artist.tagline}</p>
                    <p className="font-ui text-[11px] font-semibold text-[#C4952A] mt-2">{artist.price}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EDE8DF] flex items-center justify-between">
                    <button
                      onClick={() => toggleFeatured(artist.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isFeatured ? "bg-amber-100 text-amber-900" : "text-[#7A776F]"
                      }`}
                    >
                      {isFeatured ? "★ Featured" : "☆ Feature"}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(artist)}
                        className="font-ui text-xs text-[#1A1916] hover:text-[#C4952A] font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(artist)}
                        className="font-ui text-xs text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Artist Profile Editor Modal */}
      {isEditorOpen && editingArtist && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#EDE8DF] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1A1916]">
                  {editingArtist.name ? `Edit: ${editingArtist.name}` : "Add New Artist"}
                </h3>
                <p className="font-ui text-xs text-[#7A776F]">Performer credentials, genre, and pricing</p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A776F] hover:text-[#1A1916]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-[#EDE8DF] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Artist / Ensemble Name *
                    </label>
                    <input
                      type="text"
                      value={editingArtist.name}
                      onChange={(e) => setEditingArtist({ ...editingArtist, name: e.target.value })}
                      placeholder="e.g. Zakir Khan & Sufi Souls"
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Primary Genre
                    </label>
                    <select
                      value={editingArtist.genre}
                      onChange={(e) => setEditingArtist({ ...editingArtist, genre: e.target.value as any })}
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5 capitalize"
                    >
                      {Object.keys(genres).map((k) => (
                        <option key={k} value={k}>{genres[k].title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                    Tagline / One-liner
                  </label>
                  <input
                    type="text"
                    value={editingArtist.tagline}
                    onChange={(e) => setEditingArtist({ ...editingArtist, tagline: e.target.value })}
                    placeholder="e.g. Transcendent acoustic qawwali for grand celebrations"
                    className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                    Biography
                  </label>
                  <textarea
                    rows={4}
                    value={editingArtist.bio}
                    onChange={(e) => setEditingArtist({ ...editingArtist, bio: e.target.value })}
                    placeholder="Full artist background and musical heritage..."
                    className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={editingArtist.city}
                      onChange={(e) => setEditingArtist({ ...editingArtist, city: e.target.value })}
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Band Format
                    </label>
                    <select
                      value={editingArtist.bandType}
                      onChange={(e) => setEditingArtist({ ...editingArtist, bandType: e.target.value as any })}
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    >
                      <option value="Solo">Solo</option>
                      <option value="Duo">Duo</option>
                      <option value="Trio">Trio</option>
                      <option value="4-6 Piece Band">4-6 Piece Band</option>
                      <option value="Full Troupe (8+ Members)">Full Troupe (8+ Members)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#1A1916] mb-1">
                      Starting Honorarium
                    </label>
                    <input
                      type="text"
                      value={editingArtist.price}
                      onChange={(e) => setEditingArtist({ ...editingArtist, price: e.target.value })}
                      placeholder="e.g. ₹1,20,000"
                      className="w-full text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-4 py-2.5"
                    />
                  </div>
                </div>

                {/* Profile Photo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-ui text-xs font-semibold text-[#1A1916]">
                      Profile Photo
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
                      src={editingArtist.img}
                      alt="Artist preview"
                      className="w-20 h-20 rounded-xl object-cover border border-[#EDE8DF]"
                    />
                    <input
                      type="text"
                      value={editingArtist.img}
                      onChange={(e) => setEditingArtist({ ...editingArtist, img: e.target.value })}
                      className="flex-1 text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#EDE8DF] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="font-ui text-xs font-semibold px-4 py-2.5 rounded-full border border-[#EDE8DF] text-[#4A4845]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveArtist}
                className="font-ui text-xs font-semibold px-6 py-2.5 rounded-full bg-[#C4952A] hover:bg-[#DDB96A] text-[#1A1916]"
              >
                Save Artist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Artist?"
        message="This will remove this artist from the public directory."
        itemName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteArtist(deleteTarget.id);
            onShowToast(`Deleted "${deleteTarget.name}"`, "warning");
            setDeleteTarget(null);
          }
        }}
      />

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mediaList={mediaList}
        onUploadMedia={onUploadMedia}
        onSelectMedia={(url) => {
          if (editingArtist) setEditingArtist({ ...editingArtist, img: url });
        }}
        title="Select Artist Profile Photo"
      />
    </div>
  );
}
