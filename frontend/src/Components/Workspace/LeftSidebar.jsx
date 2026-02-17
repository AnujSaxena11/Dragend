import { Files, GitBranch, Database, Workflow, FileDown, Loader2 } from "lucide-react"; // Added Loader2
// import logo from '../../media/logo.png';
import { useNavigate, useParams } from 'react-router-dom'; 
import { downloadProjectAPI } from './WorkflowAPI'; 
import toast from 'react-hot-toast';
import { useState } from "react";

const items = [
    { id: "Dragend", icon: import.meta.env.VITE_MAIN_LOGO, label: "Home", isImage: true },
    { id: "db", icon: Database, label: "Database" },
    { id: "workflow", icon: Workflow, label: "Workflow" },
    { id: "git", icon: GitBranch, label: "Version Control" },
    { id: "download_project", icon: FileDown, label: "Download Project" },
];

function LeftSidebar({ activePanel, setActivePanel }) {
    const navigate = useNavigate();
    const { projectId } = useParams(); 
    const [isDownloading, setIsDownloading] = useState(false);

    const handleClick = async (id) => {
        if (id === "Dragend") {
            navigate('/');
            setActivePanel(null);
            return;
        } else if (id === 'download_project') {
            if (!projectId) {
                toast.error("Project ID not found");
                return;
            }

            setIsDownloading(true);
            const loadingToast = toast.loading("Generating project files...");

            try {
                await downloadProjectAPI(projectId);
                toast.dismiss(loadingToast);
                toast.success("Project downloaded successfully!", {
                    style: { background: '#333', color: '#fff', border: '1px solid #22c55e' }
                });
                navigate('/user-guide');
            } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Failed to download project.", {
                    style: { background: '#333', color: '#fff', border: '1px solid #ef4444' }
                });
            } finally {
                setIsDownloading(false);
            }
            return;
        }
        
        setActivePanel(activePanel === id ? null : id);
    };

    return (
        <div className="w-16 h-[90vh] bg-[#333333] flex flex-col items-center py-6 rounded-full ml-4 z-50 shadow-xl border border-white/5">
            <div className="flex flex-col gap-6 w-full items-center">
                {items.map(({ id, icon: Icon, label, isImage }) => {
                    const isActive = activePanel === id;
                    const isLoading = id === 'download_project' && isDownloading;
                    return (
                        <button key={id} title={label} onClick={() => handleClick(id)} disabled={isLoading}
                            className={`group relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200
                                ${isActive ? "text-white bg-purple-600 shadow-lg shadow-purple-500/20" : "text-gray-400 hover:text-white hover:bg-[#444]"} 
                                ${isLoading ? "cursor-wait opacity-80" : ""} `} >
                            
                            {isActive && (
                                <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r-full" />
                            )}
                            
                            {isImage ? (
                                <img src={Icon} alt={label} className="w-10 h-10 object-contain" />
                            ) : (
                                isLoading ? (
                                    <Loader2 size={20} className="animate-spin text-purple-400" />
                                ) : (
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                )
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
export default LeftSidebar;