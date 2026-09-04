import { useState, useMemo } from "react";
import { ActivityLogItem } from "../../../data/cmsTypes";

interface ActivityLogViewProps {
  activityLog: ActivityLogItem[];
  onClearLog?: () => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function ActivityLogView({
  activityLog,
  onClearLog,
  onShowToast,
}: ActivityLogViewProps) {
  const [userFilter, setUserFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  const uniqueUsers = Array.from(new Set(activityLog.map((a) => a.user)));
  const uniqueEntities = Array.from(new Set(activityLog.map((a) => a.entity)));

  const filtered = useMemo(() => {
    return activityLog.filter((log) => {
      const matchUser = userFilter === "all" || log.user === userFilter;
      const matchEntity = entityFilter === "all" || log.entity === entityFilter;
      return matchUser && matchEntity;
    });
  }, [activityLog, userFilter, entityFilter]);

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Activity Audit Log</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Audit trail of team updates, publishing timestamps, and content changes.
          </p>
        </div>
        {onClearLog && (
          <button
            onClick={() => {
              onClearLog();
              onShowToast("Activity log cleared", "info");
            }}
            className="font-ui text-xs text-[#7A776F] hover:text-[#1A1916] underline"
          >
            Clear Log
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#EDE8DF] flex flex-wrap items-center gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <label className="text-xs font-ui text-[#7A776F]">User:</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-1.5 text-[#1A1916]"
          >
            <option value="all">All Team Members</option>
            {uniqueUsers.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-ui text-[#7A776F]">Content Type:</label>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="text-xs font-ui bg-[#FAF7F2] border border-[#EDE8DF] rounded-xl px-3 py-1.5 text-[#1A1916]"
          >
            <option value="all">All Entity Types</option>
            {uniqueEntities.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <span className="text-xs font-ui text-[#7A776F] ml-auto">
          {filtered.length} logged actions
        </span>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-xs">
        <div className="divide-y divide-[#EDE8DF]">
          {filtered.map((log) => (
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
  );
}
