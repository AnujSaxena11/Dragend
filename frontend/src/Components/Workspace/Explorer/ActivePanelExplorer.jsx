import ExplorerTree from "./ExplorerTree";

function ActivePanelExplorer() {
  return (
    <div className="text-gray-300">
      <div className="text-xs uppercase tracking-wider mb-2 text-gray-400">
        Explorer
      </div>

      <ExplorerTree />
    </div>
  );
}

export default ActivePanelExplorer;
