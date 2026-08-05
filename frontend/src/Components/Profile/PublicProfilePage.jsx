import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getPublicProfile } from "./ProfileAPI";

import { ProfileTabs } from "./ProfileTabs";
import { ProfileOverview } from "./ProfileOverview";
import { MyProjects } from "./MyProjects";

// ─── helpers ──────────────────────────────────────────────────────────────────
function formatJoinDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });
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

const InitialsAvatar = ({ username, size = 96 }) => {
  const hue = usernameToHue(username);
  const initials = getInitials(username);
  return (
    <div
      className="flex items-center justify-center rounded-3xl border-4 border-white shadow-xl flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${(hue + 40) % 360},75%,45%))`,
      }}
    >
      <span
        className="font-bold select-none"
        style={{ fontSize: size * 0.32, color: "rgba(255,255,255,0.95)", letterSpacing: "0.05em" }}
      >
        {initials}
      </span>
    </div>
  );
};

// ─── Public Header (no Edit / Share buttons) ──────────────────────────────────
const PublicProfileHeader = ({ user, projects }) => {
  const totalDBs    = projects.reduce((acc, p) => acc + p.databaseIds.length, 0);
  const totalNodes  = projects.reduce((acc, p) => acc + (p.canvasState?.nodes?.length ?? 0), 0);
  const totalEdges  = projects.reduce((acc, p) => acc + (p.canvasState?.edges?.length ?? 0), 0);
  const totalAgents = projects.reduce((acc, p) => acc + (p.agentIds?.length ?? 0), 0);
  const lastUpdated = projects.length > 0
    ? [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
    : null;

  const topStats = [
    { label: "Projects",  value: projects.length },
    { label: "Databases", value: totalDBs },
    { label: "Tables",    value: totalNodes },
    { label: "Relations", value: totalEdges },
  ];

  const journeyItems = [
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
      bg: "#ede9fe", color: "#7c3aed", label: "Last worked on", value: lastUpdated ? lastUpdated.name : "—",
    },
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3S3 13.66 3 12"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
      bg: "#d1fae5", color: "#059669", label: "DB connections", value: `${totalDBs} across ${projects.length} project${projects.length !== 1 ? "s" : ""}`,
    },
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
      bg: "#dbeafe", color: "#2563eb", label: "Schema", value: `${totalNodes} tables`,
    },
    {
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
      bg: "#fce7f3", color: "#db2777", label: "Agents Used", value: totalAgents,
    },
  ];

  return (
    <div className="relative">
      {/* Banner */}
      <div className="w-full h-32 sm:h-52 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80"
          className="w-full h-full object-cover"
          alt="banner"
        />
      </div>

      <div className="px-4 sm:px-10 pb-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between relative gap-4">

          {/* Left: avatar + info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="-mt-10 sm:-mt-16 flex-shrink-0"
            >
              <InitialsAvatar username={user.username} size={96} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="pb-1 pt-1 sm:pt-4"
            >
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                  {user.username}
                </h2>
                <span
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold flex-shrink-0"
                  style={{ background: "#f1f5f9", color: "#6366f1", border: "1px solid #e0e7ff" }}
                >
                  PRO ⚡
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mb-2">
                {user.email && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    {user.email}
                  </span>
                )}
                {user.createdAt && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    Joined {formatJoinDate(user.createdAt)}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500">Backend Builder • DragEnd Creator</p>
            </motion.div>
          </div>

          {/* Right: stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex gap-5 sm:gap-8 text-center pb-1 overflow-x-auto sm:overflow-visible"
          >
            {topStats.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex-shrink-0"
              >
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Journey strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 rounded-2xl border border-gray-100 px-4 sm:px-6 py-4 grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6"
          style={{ background: "#fafafa" }}
        >
          {journeyItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && <div className="w-px h-8 bg-gray-200 -ml-3 mr-3 hidden sm:block" />}
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const PublicProfilePage = () => {
  const { username } = useParams();
  const [tab, setTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;
    getPublicProfile(username)
      .then((res) => {
        setUser(res.data.user);
        setProjects(res.data.projects ?? []);
      })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-400 text-sm font-medium"
        >
          Loading profile...
        </motion.div>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 bg-white text-sm">
        Profile <span className="font-semibold text-gray-700 mx-1">@{username}</span> not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white shadow-sm rounded-none md:rounded-2xl overflow-hidden">
        <PublicProfileHeader user={user} projects={projects} />
        <ProfileTabs tab={tab} setTab={setTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "overview" ? (
              <ProfileOverview projects={projects} readonly />
            ) : (
              <MyProjects projects={projects} readonly />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};