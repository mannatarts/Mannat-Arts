import { Experience, MoodItem, OccasionItem, ActivityLogItem } from "../../../data/cmsTypes";
import { Artist, GenreInfo } from "../../../data/artistsData";
import { BlogArticle } from "../../../data/blogData";

interface DashboardViewProps {
  experiences: Experience[];
  artists: Artist[];
  genres: Record<string, GenreInfo>;
  occasions: OccasionItem[];
  stories: BlogArticle[];
  activityLog: ActivityLogItem[];
  lastPublished: string;
  isLive: boolean;
  onNavigate: (view: string) => void;
  onOpenAddExperience: () => void;
  onOpenAddArtist: () => void;
  onOpenAddStory: () => void;
  onPreviewWebsite: () => void;
  onViewLiveWebsite: () => void;
}

export function DashboardView({
  experiences,
  artists,
  genres,
  occasions,
  stories,
  activityLog,
  lastPublished,
  isLive,
  onNavigate,
  onOpenAddExperience,
  onOpenAddArtist,
  onOpenAddStory,
  onPreviewWebsite,
  onViewLiveWebsite,
}: DashboardViewProps) {
  const publishedExpCount = experiences.filter((e) => e.status === "published").length;
  const publishedStoriesCount = stories.filter((s) => s.status !== "draft").length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl border border-[#EDE8DF] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-serif text-2xl font-light text-[#1A1916]">
              Good afternoon
            </span>
          </div>
          <p className="font-ui text-sm text-[#7A776F]">
            Welcome back to the <strong className="text-[#1A1916] font-semibold">Mannat Arts</strong> Content Management System.
          </p>
        </div>

        {/* Website Status Badge */}
        <div className="flex items-center gap-3 bg-[#FAF7F2] border border-[#EDE8DF] px-4 py-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
            <div>
              <p className="font-ui text-[11px] font-semibold text-[#1A1916] leading-none">
                {isLive ? "Website Live" : "Maintenance Mode"}
              </p>
              <p className="font-ui text-[10px] text-[#7A776F] mt-0.5">
                Published: {lastPublished}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-2 border-l border-[#EDE8DF] pl-3">
            <button
              onClick={onPreviewWebsite}
              className="font-ui text-[11px] font-medium text-[#C4952A] hover:underline"
            >
              Preview
            </button>
            <span className="text-xs text-[#EDE8DF]">·</span>
            <button
              onClick={onViewLiveWebsite}
              className="font-ui text-[11px] font-medium text-[#4A4845] hover:text-[#1A1916]"
            >
              View Live ↗
            </button>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Experiences",
            count: experiences.length,
            sub: `${publishedExpCount} published`,
            view: "experiences",
          },
          {
            label: "Artists",
            count: artists.length,
            sub: "Master Performers",
            view: "artists",
          },
          {
            label: "Genres",
            count: Object.keys(genres).length,
            sub: "Artistic Styles",
            view: "genres",
          },
          {
            label: "Occasions",
            count: occasions.length,
            sub: "Event Categories",
            view: "occasions",
          },
          {
            label: "Stories",
            count: stories.length,
            sub: `${publishedStoriesCount} published`,
            view: "stories",
          },
        ].map((card) => (
          <div
            key={card.label}
            onClick={() => onNavigate(card.view)}
            className="group bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-[#C4952A]/50 transition-all cursor-pointer shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-ui font-semibold text-xs text-[#1A1916]">{card.label}</span>
              <span className="font-ui text-[11px] text-[#7A776F] group-hover:text-[#C4952A] transition-colors">
                Manage →
              </span>
            </div>
            <div className="font-serif text-3xl font-light text-[#1A1916]">
              {card.count}
            </div>
            <p className="font-ui text-[11px] text-[#7A776F] mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#EDE8DF]">
        <h3 className="font-serif text-base font-medium text-[#1A1916] mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onOpenAddExperience}
            className="bg-white hover:bg-[#F5F0E8] border border-[#EDE8DF] hover:border-[#1A1916]/30 p-4 rounded-xl flex flex-col justify-center transition-all text-left shadow-xs cursor-pointer"
          >
            <p className="font-ui font-semibold text-xs text-[#1A1916]">Add Experience</p>
            <p className="font-ui text-[10px] text-[#7A776F] mt-0.5">New curated event</p>
          </button>

          <button
            onClick={onOpenAddArtist}
            className="bg-white hover:bg-[#F5F0E8] border border-[#EDE8DF] hover:border-[#1A1916]/30 p-4 rounded-xl flex flex-col justify-center transition-all text-left shadow-xs cursor-pointer"
          >
            <p className="font-ui font-semibold text-xs text-[#1A1916]">Add Artist</p>
            <p className="font-ui text-[10px] text-[#7A776F] mt-0.5">New performer profile</p>
          </button>

          <button
            onClick={onOpenAddStory}
            className="bg-white hover:bg-[#F5F0E8] border border-[#EDE8DF] hover:border-[#1A1916]/30 p-4 rounded-xl flex flex-col justify-center transition-all text-left shadow-xs cursor-pointer"
          >
            <p className="font-ui font-semibold text-xs text-[#1A1916]">Add Story</p>
            <p className="font-ui text-[10px] text-[#7A776F] mt-0.5">Editorial journal article</p>
          </button>

          <button
            onClick={() => onNavigate("homepage")}
            className="bg-white hover:bg-[#F5F0E8] border border-[#EDE8DF] hover:border-[#1A1916]/30 p-4 rounded-xl flex flex-col justify-center transition-all text-left shadow-xs cursor-pointer"
          >
            <p className="font-ui font-semibold text-xs text-[#1A1916]">Edit Homepage</p>
            <p className="font-ui text-[10px] text-[#7A776F] mt-0.5">Hero & section layout</p>
          </button>
        </div>
      </div>

      {/* Discovery Architecture Summary & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discovery Ecosystem Diagram Card */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-[#EDE8DF] shadow-xs flex flex-col justify-between">
          <div>
            <span className="font-ui text-[10px] font-bold tracking-[0.2em] text-[#C4952A] uppercase">
              Core Relationship Engine
            </span>
            <h3 className="font-serif text-lg font-medium text-[#1A1916] mt-1 mb-2">
              Artistic Discovery Flow
            </h3>
            <p className="font-ui text-xs text-[#7A776F] leading-relaxed mb-4">
              Mannat Arts connects guest emotions to extraordinary live art through unified relationships:
            </p>

            <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-xl border border-[#EDE8DF]">
              {[
                { step: "1. MOOD", desc: "Soulful, Celebrate, Energise, Immerse", color: "border-amber-400" },
                { step: "2. OCCASION", desc: "Wedding, Corporate, Festival, Baithak", color: "border-emerald-400" },
                { step: "3. GENRE", desc: "Sufi, Rock, Ghazal, Bollywood", color: "border-blue-400" },
                { step: "4. EXPERIENCE", desc: "Curated Showcase Performance", color: "border-purple-400" },
                { step: "5. ARTIST", desc: "Vetted Master Performers", color: "border-[#C4952A]" },
              ].map((item, i) => (
                <div key={item.step} className={`pl-3 border-l-2 ${item.color} py-0.5`}>
                  <p className="font-ui font-bold text-[11px] text-[#1A1916]">{item.step}</p>
                  <p className="font-ui text-[10px] text-[#7A776F]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate("recommendations")}
            className="w-full mt-4 font-ui text-xs font-semibold text-center text-[#9A7219] hover:text-[#C4952A] bg-[#FAF7F2] border border-[#EDE8DF] hover:border-[#C4952A]/40 py-2.5 rounded-xl transition-all"
          >
            Inspect Recommendation Matrix →
          </button>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#EDE8DF] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#1A1916]">Recent Activity</h3>
              <p className="font-ui text-xs text-[#7A776F]">Recent updates published by your team</p>
            </div>
            <button
              onClick={() => onNavigate("activity")}
              className="font-ui text-xs font-medium text-[#C4952A] hover:underline"
            >
              View Full Audit Log →
            </button>
          </div>

          <div className="divide-y divide-[#EDE8DF]">
            {activityLog.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EDE8DF] flex items-center justify-center text-xs font-serif text-[#C4952A]">
                    {log.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-ui text-xs text-[#1A1916]">
                      <strong className="font-semibold">{log.user}</strong> {log.action.toLowerCase()}{" "}
                      <span className="text-[#C4952A] font-medium">"{log.entityName}"</span>
                    </p>
                    <p className="font-ui text-[10px] text-[#7A776F]">
                      {log.entity} · {log.timestamp}
                    </p>
                  </div>
                </div>
                <span className="font-ui text-[10px] px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#4A4845] border border-[#EDE8DF]">
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
