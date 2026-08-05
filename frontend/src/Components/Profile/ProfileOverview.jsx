import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";

export const ProfileOverview = ({ projects, readonly = false }) => {
  const sorted = [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const recent = sorted.slice(0, 3);
  const latestId = sorted[0]?._id;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      className="px-6 sm:px-10 py-8 bg-white"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Recent Workflows</h3>
        <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Sorted by Activity</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recent.map((p, i) => (
          <ProjectCard key={p._id} project={p} index={i} isLatest={p._id === latestId} readonly={readonly} />
        ))}
      </div>
    </motion.div>
  );
};