import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// ✅ Added Check and X icons for the save/cancel buttons
import { EllipsisVertical, Pencil, Trash2, Download, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from "react";
import { deleteProjectAPI, downloadProjectAPI, partialUpdateProject } from "../Workspace/WorkflowAPI";

const CARD_PALETTES = [
  { bg: "#f3e8ff", accent: "#a855f7" },
  { bg: "#fce7f3", accent: "#ec4899" },
  { bg: "#e0e7ff", accent: "#3b82f6" },
  { bg: "#d1fae5", accent: "#10b981" },
  { bg: "#fef3c7", accent: "#f59e0b" },
];

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const ProjectCard = ({ project, index = 0, isLatest = false, readonly = false }) => {
  const navigate = useNavigate();

  const palette = CARD_PALETTES[index % CARD_PALETTES.length];
  const nodeCount = project.canvasState?.nodes?.length ?? 0;
  const dbTypes = [...new Set(project.databaseIds.map((d) => d.type).filter(Boolean))];
  const updatedAgo = timeAgo(project.updatedAt);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(project.name);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside) };
  }, []);

  const handleClick = () => {
    if (!readonly && !isEditing) navigate(`/${project._id}/workflow`);
  };

  const startRename = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    setIsEditing(true);
  };

  const handleCancelRename = (e) => {
    if (e) e.stopPropagation();
    setIsEditing(false);
    setLocalName(project.name);
  };

  const handleSaveRename = async (e) => {
    if (e) e.stopPropagation();

    setIsEditing(false);
    const trimmedName = localName.trim();
    if (!trimmedName || trimmedName === project.name) {
      setLocalName(project.name);
      return;
    }

    if (!project._id) {
      toast.error("Project ID not found");
      return;
    }

    const loadingToast = toast.loading("Renaming project...");
    try {
      await partialUpdateProject({ projectId: project._id, projectName: trimmedName, description: project.description });
      toast.dismiss(loadingToast);
      toast.success("Project renamed successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to rename project.");
      setLocalName(project.name);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    try {
      const res = await deleteProjectAPI(project._id);
      if (res.success) {
        toast.success("Project deleted.");
      }
    } catch (error) {
      toast.error("Failed to delete project.");
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (!project._id) {
      toast.error("Project ID not found");
      return;
    }
    const loadingToast = toast.loading("Generating project files...");
    try {
      await downloadProjectAPI(project._id);
      toast.dismiss(loadingToast);
      toast.success("Project downloaded successfully!", { style: { background: '#333', color: '#fff', border: '1px solid #22c55e' } });
      navigate('/user-guide');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to download project.", { style: { background: '#333', color: '#fff', border: '1px solid #ef4444' } });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={!readonly && !isEditing ? { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 0 20px rgba(168,85,247,0.1)" } : {}}
      className={`relative rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 shadow-sm ${readonly ? "cursor-default" : "cursor-pointer"}`}
    >
      <div className="h-32 w-full relative flex items-center justify-center overflow-hidden border-b border-gray-50" style={{ background: palette.bg }}>
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-30 blur-3xl" style={{ background: palette.accent }} />
        <div className="absolute bottom-0 left-4 w-24 h-24 rounded-full opacity-20 blur-2xl" style={{ background: palette.accent }} />

        {nodeCount > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide border border-white/40 uppercase bg-white/60 backdrop-blur-md text-gray-800 shadow-sm">
              {nodeCount} Tables
            </span>
          </div>
        )}
      </div>

      {isLatest && (
        <div ref={menuRef} className="absolute top-3 right-3 z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full
                bg-white/80 backdrop-blur-lg border border-white shadow-md
                hover:bg-white hover:shadow-lg transition-all duration-200"
          >
            <EllipsisVertical size={18} className="text-gray-600 hover:text-violet-600" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={startRename}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-violet-50 transition-colors"
              >
                <Pencil size={16} className="text-violet-600" />
                Rename
              </button>

              <button
                onClick={handleDownload}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 transition-colors"
              >
                <Download size={16} className="text-blue-600" />
                Download
              </button>

              <div className="border-t border-gray-100" />

              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-5" onClick={handleClick}>
        <div className="flex items-start justify-between gap-2">

          {isEditing ? (
            <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
              <input
                autoFocus
                className="font-bold text-gray-900 text-lg leading-snug w-full border-b border-violet-500 bg-transparent focus:outline-none"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename();
                  if (e.key === 'Escape') handleCancelRename();
                }}
              />
              <button
                onClick={handleSaveRename}
                className="flex-shrink-0 p-1.5 bg-violet-100 text-violet-600 rounded-md hover:bg-violet-200 transition-colors"
                title="Save Name"
              >
                <Check size={16} />
              </button>
              <button
                onClick={handleCancelRename}
                className="flex-shrink-0 p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <h3 className="font-bold text-gray-900 text-lg leading-snug truncate">
              {localName}
            </h3>
          )}

          {updatedAgo && !isEditing && (
            <span className="text-[10px] text-gray-400 font-medium flex-shrink-0 mt-1 uppercase tracking-wider">
              {updatedAgo}
            </span>
          )}
        </div>

        {project.description ? (
          <p className="text-gray-500 text-xs mt-2 line-clamp-2 h-8">{project.description}</p>
        ) : (
          <p className="text-gray-400 text-xs mt-2 italic h-8">No description provided.</p>
        )}

        {dbTypes.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {dbTypes.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-100">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};