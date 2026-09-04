import { useState } from "react";
import { CMSUser, UserRole } from "../../../data/cmsTypes";

interface UsersCMSViewProps {
  users: CMSUser[];
  currentUserRole: UserRole;
  onChangeCurrentUserRole: (role: UserRole) => void;
  onShowToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export function UsersCMSView({
  users,
  currentUserRole,
  onChangeCurrentUserRole,
  onShowToast,
}: UsersCMSViewProps) {
  const rolePermissions: Record<UserRole, { label: string; desc: string; permissions: string[] }> = {
    super_admin: {
      label: "Super Admin",
      desc: "Unrestricted access across all content, settings, users, and deployment actions.",
      permissions: ["Manage All Content", "Publish to Live", "System Settings", "User Access", "Direct Database Resets"],
    },
    content_manager: {
      label: "Content Manager",
      desc: "Full editorial control over experiences, artists, genres, moods, occasions, and stories.",
      permissions: ["Experiences", "Artists", "Genres", "Moods & Occasions", "Stories & Blog", "Media Library"],
    },
    editor: {
      label: "Editor",
      desc: "Focused editing for homepage text, stories/blog articles, and client testimonials.",
      permissions: ["Homepage Copy", "Stories / Articles", "Testimonials", "Draft Submissions"],
    },
    viewer: {
      label: "Viewer",
      desc: "Read-only inspection privileges for stakeholder review and previews.",
      permissions: ["View Dashboard", "Preview Drafts", "Inspect Content (Read-Only)"],
    },
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DF]">
        <div>
          <h2 className="font-serif text-2xl font-light text-[#1A1916]">Team Roles & Permissions</h2>
          <p className="font-ui text-xs text-[#7A776F] mt-0.5">
            Role-based governance ensuring non-technical team members only see permitted actions.
          </p>
        </div>

        {/* Test Role Switcher */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#EDE8DF]">
          <span className="font-ui text-[11px] font-semibold text-[#7A776F] px-2">
            Simulate Role:
          </span>
          <select
            value={currentUserRole}
            onChange={(e) => {
              const r = e.target.value as UserRole;
              onChangeCurrentUserRole(r);
              onShowToast(`Switched active role to ${rolePermissions[r].label}`, "info");
            }}
            className="font-ui text-xs font-semibold bg-white border border-[#EDE8DF] rounded-lg px-3 py-1.5 text-[#1A1916]"
          >
            <option value="super_admin">Super Admin (Full)</option>
            <option value="content_manager">Content Manager</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer (Read-Only)</option>
          </select>
        </div>
      </div>

      {/* Role Definitions Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(rolePermissions) as UserRole[]).map((r) => {
          const isCurrent = currentUserRole === r;
          const info = rolePermissions[r];
          return (
            <div
              key={r}
              className={`p-5 rounded-2xl border transition-all ${
                isCurrent
                  ? "bg-white border-[#C4952A] shadow-md ring-2 ring-[#C4952A]/20"
                  : "bg-white border-[#EDE8DF] shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-lg font-medium text-[#1A1916]">{info.label}</h3>
                {isCurrent && (
                  <span className="text-[10px] font-bold text-[#C4952A] bg-[#C4952A]/10 px-2 py-0.5 rounded-full">
                    ACTIVE SESSION
                  </span>
                )}
              </div>
              <p className="font-ui text-xs text-[#7A776F] mb-3">{info.desc}</p>
              <div className="space-y-1">
                {info.permissions.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-ui text-[11px] text-[#4A4845]">
                    <span className="text-[#C4952A] font-bold">✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] p-6 shadow-xs space-y-4">
        <h3 className="font-serif text-lg font-medium text-[#1A1916]">Active Team Members</h3>
        <div className="divide-y divide-[#EDE8DF]">
          {users.map((user) => (
            <div key={user.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#EDE8DF]"
                />
                <div>
                  <p className="font-ui font-semibold text-xs text-[#1A1916]">{user.name}</p>
                  <p className="font-ui text-[11px] text-[#7A776F]">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-ui text-[10px] text-[#7A776F]">{user.lastActive}</span>
                <span className="font-ui text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EDE8DF] text-[#1A1916] capitalize">
                  {user.role.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
