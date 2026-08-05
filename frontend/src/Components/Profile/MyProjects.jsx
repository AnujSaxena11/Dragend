import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "./ProjectCard";

export const MyProjects = ({ projects, readonly = false }) => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      className="px-6 sm:px-10 py-8 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          All Workflows <span className="text-gray-500 font-medium text-sm ml-2 px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full">{projects.length}</span>
        </h3>
        {!readonly && (
          <motion.button onClick={() => navigate("/new")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-md hover:shadow-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="hidden xs:inline">New Project</span>
            <span className="xs:hidden">New</span>
          </motion.button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <ProjectCard key={p._id} project={p} index={i} readonly={readonly} />
        ))}
      </div>
    </motion.div>
  );
};