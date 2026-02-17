import { ArrowRightLeft, FilePlus, Trash2, Save, PenTool, Database } from "lucide-react";
import { useSchema } from "../SchemaContext";
function ActivePanelFlow() {
  const { savedSchemas } = useSchema();

  const apiNodes = [
    { method: "GET", color: "bg-blue-600", icon: ArrowRightLeft, description: "Fetch Data" },
    { method: "POST", color: "bg-green-600", icon: FilePlus, description: "Create Data" },
    { method: "PUT", color: "bg-orange-500", icon: Save, description: "Update Data" },
    { method: "PATCH", color: "bg-yellow-500", icon: PenTool, description: "Modify Data" },
    { method: "DELETE", color: "bg-red-600", icon: Trash2, description: "Remove Data" },
  ];

  const onDragStart = (event, type, payload) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type, ...payload })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-800 w-full" />
      <div>
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
          API Methods
        </div>
        <div className="grid grid-cols-1 gap-3">
          {apiNodes.map(({ method, color, icon: Icon, description }) => (
            <div
              key={method}
              draggable
              onDragStart={(event) => onDragStart(event, "apiNode", { method })}
              className="group relative flex items-center gap-3 p-3 rounded-lg cursor-grab bg-[#2a2d2e] border border-transparent hover:border-gray-500 hover:bg-[#333] transition-all select-none overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${color}`} />
              <div className={`p-2 rounded-md bg-[#202020] text-gray-300 group-hover:text-white transition-colors`}>
                <Icon size={16} />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${color.replace('bg-', 'text-')}`}>
                  {method}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  {description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ActivePanelFlow;