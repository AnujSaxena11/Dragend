import { motion } from "framer-motion";

export const ProfileTabs = ({ tab, setTab }) => {
  const tabs = ["overview", "projects"];

  return (
    <div className="px-6 sm:px-10 border-b border-gray-100 flex gap-2 bg-white">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className="relative pb-4 pt-2 px-4 capitalize text-sm font-bold transition-colors"
          style={{ color: tab === t ? "#111827" : "#9ca3af" }}
        >
          {t}
          {tab === t && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};