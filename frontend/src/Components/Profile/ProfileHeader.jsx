import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { checkUsername, updateProfile } from "./ProfileAPI";

// ─── helpers ──────────────────────────────────────────────────────────────────
function formatJoinDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function getInitials(username) {
  if (!username) return "?";
  return username.slice(0, 2).toUpperCase();
}

function usernameToHue(username) {
  if (!username) return 240;
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

const InitialsAvatar = ({ username, size = 128 }) => {
  const hue = usernameToHue(username);
  const initials = getInitials(username);
  return (
    <div
      className="flex items-center justify-center rounded-3xl border-4 border-white shadow-xl flex-shrink-0 relative overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue},80%,60%), hsl(${(hue + 40) % 360},80%,50%))`,
      }}
    >
      <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
      <span
        className="font-bold select-none relative z-10"
        style={{ fontSize: size * 0.35, color: "#fff", letterSpacing: "0.05em", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
      >
        {initials}
      </span>
    </div>
  );
};

const UsernameStatus = ({ status }) => {
  const map = {
    idle:      null,
    checking:  { text: "Checking...", color: "#9ca3af" },
    available: { text: "✓ Available", color: "#16a34a" },
    taken:     { text: "✗ Taken",     color: "#dc2626" },
  };
  const cfg = map[status];
  if (!cfg) return null;
  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs font-medium absolute -bottom-5 left-1"
      style={{ color: cfg.color }}
    >
      {cfg.text}
    </motion.span>
  );
};

const SharePopover = ({ username, onClose }) => {
  const profileUrl = `${window.location.origin}/profile/${username}`;
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute z-50 top-full mt-3 left-0 w-80 bg-white rounded-2xl border border-gray-200 shadow-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-gray-900">Share profile</p>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-3">Anyone with this link can view your workflows.</p>

      <div className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 bg-gray-50">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        <span className="flex-1 text-xs text-gray-700 truncate font-mono">{profileUrl}</span>
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={copied ? "Copied!" : "Copy link"}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{
            background: copied ? "#dcfce7" : "#fff",
            color: copied ? "#16a34a" : "#4b5563",
            border: copied ? "1px solid #bbf7d0" : "1px solid #e5e7eb"
          }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.svg
                key="check"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="w-4 h-4"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12"/>
              </motion.svg>
            ) : (
              <motion.svg
                key="copy"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="w-4 h-4"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export const ProfileHeader = ({ user, projects, onUserUpdate }) => {
  const [editMode,  setEditMode]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saveError, setSaveError] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [draftUsername, setDraftUsername] = useState(user.username ?? "");
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const debouncedUsername = useDebounce(draftUsername, 500);

  useEffect(() => {
    if (!editMode) return;
    const trimmed = debouncedUsername.trim();
    if (trimmed === (user.username ?? "") || trimmed.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    checkUsername(trimmed)
      .then((res) => setUsernameStatus(res.data.available ? "available" : "taken"))
      .catch(() => setUsernameStatus("idle"));
  }, [debouncedUsername, editMode, user.username]);

  const handleEdit = () => {
    setDraftUsername(user.username ?? "");
    setUsernameStatus("idle");
    setSaveError("");
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setSaveError("");
    setUsernameStatus("idle");
  };

  const handleSave = async () => {
    if (usernameStatus === "taken" || usernameStatus === "checking") return;
    const trimmed = draftUsername.trim();
    if (trimmed === user.username) { setEditMode(false); return; }

    setSaving(true);
    setSaveError("");
    try {
      const res = await updateProfile({ username: trimmed });
      onUserUpdate(res.data.user);
      setEditMode(false);
    } catch (err) {
      setSaveError(err?.response?.data?.msg ?? "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const canSave = usernameStatus !== "taken" && usernameStatus !== "checking" && !saving;

  const totalDBs    = projects.reduce((acc, p) => acc + p.databaseIds.length, 0);
  const totalNodes  = projects.reduce((acc, p) => acc + (p.canvasState?.nodes?.length ?? 0), 0);
  const totalEdges  = projects.reduce((acc, p) => acc + (p.canvasState?.edges?.length ?? 0), 0);
  const lastUpdated = projects.length > 0 ? [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] : null;

  const topStats = [
    { label: "Projects",  value: projects.length },
    { label: "Databases", value: totalDBs },
    { label: "Tables",    value: totalNodes },
    { label: "Relations", value: totalEdges },
  ];

  const journeyItems = [
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
      bg: "rgba(168, 85, 247, 0.1)", color: "#a855f7", label: "Last worked on", value: lastUpdated ? lastUpdated.name : "—",
    },
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3S3 13.66 3 12"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
      bg: "rgba(16, 185, 129, 0.1)", color: "#10b981", label: "DB connections", value: `${totalDBs} connected`,
    },
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
      bg: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", label: "Schema Size", value: `${totalNodes} tables`,
    },
  ];

  return (
    <div className="relative">
      
      <div className="w-full h-40 sm:h-56 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 z-10" />
        <img src={import.meta.env.VITE_PROFILE_BANNER_URL} className="w-full h-full object-cover opacity-80" alt="banner" />
      </div>

      <div className="px-6 sm:px-10 pb-8 bg-white relative z-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between relative gap-6">

          <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-8">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="-mt-16 sm:-mt-20 flex-shrink-0">
              <InitialsAvatar username={user.username} size={110} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="pb-1 pt-1 sm:pt-4">
              <div className="flex items-center gap-3 mb-2 flex-wrap relative">
                {editMode ? (
                  <div className="flex flex-col gap-1 relative">
                    <input
                      value={draftUsername}
                      onChange={(e) => setDraftUsername(e.target.value)}
                      className="text-xl font-bold tracking-tight text-gray-900 border-b-2 border-purple-500 bg-transparent outline-none px-1 py-0.5 w-48"
                      placeholder="Username" autoFocus
                    />
                    <UsernameStatus status={usernameStatus} />
                  </div>
                ) : (
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                    {user.username}
                  </h2>
                )}
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md">
                  PRO
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mb-4 mt-2">
                {user.email && <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>{user.email}</span>}
                {user.createdAt && <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>Joined {formatJoinDate(user.createdAt)}</span>}
              </div>

              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.div key="edit-btns" className="flex gap-3">
                    <button onClick={handleSave} disabled={!canSave} className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-md hover:shadow-lg disabled:opacity-50 transition-all">
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button onClick={handleCancel} className="px-5 py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="view-btns" className="flex gap-3 relative">
                    <button onClick={handleEdit} className="px-5 py-2 rounded-xl text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                      Edit Profile
                    </button>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShareOpen((v) => !v)}
                        className="px-5 py-2 rounded-xl text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                        Share
                      </button>
                      <AnimatePresence>
                        {shareOpen && (
                          <SharePopover
                            username={user.username}
                            onClose={() => setShareOpen(false)}
                          />
                        )}
                      </AnimatePresence>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div className="flex gap-6 sm:gap-10 text-center pb-1">
            {topStats.map((s, i) => (
              <div key={s.label} className="flex-shrink-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-2xl sm:text-3xl font-black text-gray-900">{s.value}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-8 rounded-2xl border border-gray-100 px-4 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 bg-gray-50/50"
        >
          {journeyItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900 leading-tight">{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};