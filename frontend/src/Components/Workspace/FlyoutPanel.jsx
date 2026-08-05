import ActivePanelDb from "./Database/ActivePanelDb";
import ActivePanelExplorer from "./Explorer/ActivePanelExplorer";
import ActivePanelFlow from "./CRUD/ActivePanelFlow";
import ActivePanelGit from "./ActivePanelGit";

function FlyoutPanel({ activePanel }) {
    return (
        <div className="absolute left-24 top-10 h-[90vh] w-64 bg-[#202020] rounded-2xl p-4 text-white shadow-2xl border border-[#333] z-40 animate-in slide-in-from-left-4 duration-200">
            <h2 className="text-lg font-semibold mb-4 capitalize border-b border-gray-700 pb-3 text-gray-200">
                {activePanel === 'db' ? 'Database' : activePanel}
            </h2>
            
            <div className="h-full overflow-y-auto custom-scrollbar">
                {activePanel === "db" && <ActivePanelDb />}
                {activePanel === "explorer" && <ActivePanelExplorer />}
                {activePanel === "workflow" && <ActivePanelFlow />}
                {activePanel === "git" && <ActivePanelGit />}
            </div>
        </div>
    );
}

export default FlyoutPanel;