import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile, getProjects } from "./ProfileAPI";

import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { ProfileOverview } from "./ProfileOverview";
import { MyProjects } from "./MyProjects";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const [tab, setTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, projectRes] = await Promise.all([
          getProfile(),
          getProjects(),
        ]);
        setUser(profileRes.data.user);
        setProjects(projectRes.data.projects);
      } catch (err) {
        navigate('/auth');
        console.error("Profile load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [navigate]);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-purple-600 text-sm font-medium tracking-widest uppercase"
        >
          Loading Data...
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 pt-2 pb-10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-400/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="relative max-w-5xl mx-auto bg-white shadow-2xl shadow-purple-900/5 rounded-none md:rounded-3xl border border-gray-100 overflow-hidden">
        <div className="ml-5">
          <button
            onClick={() => navigate("/")}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 
             bg-purple-600 text-white font-medium rounded-full 
             shadow-lg hover:bg-purple-700 transition-all duration-300 
             active:scale-95 z-50"
          >
            Home
          </button>
        </div>
        <ProfileHeader user={user} projects={projects} onUserUpdate={setUser} />

        <ProfileTabs tab={tab} setTab={setTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "overview" ? (
              <ProfileOverview projects={projects} />
            ) : (
              <MyProjects projects={projects} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};