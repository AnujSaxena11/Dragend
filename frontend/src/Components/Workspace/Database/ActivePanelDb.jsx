import { useState } from "react";
import { Table, ChevronDown, ChevronRight, Database, LayoutTemplate } from "lucide-react";
import { useSchema } from "../SchemaContext"; 

function ActivePanelDb() {
  const { savedSchemas } = useSchema();
  const [isExpanded, setIsExpanded] = useState(true);

  const onDragStartNew = (event) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: "dbNode" })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragStartSaved = (event, schema) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: "tableRefNode", schema }) 
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex flex-col gap-6">
      
      <div>
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
          Creation
        </div>
        <div 
          draggable 
          onDragStart={onDragStartNew}
          className="group relative flex items-center gap-3 p-3 rounded-lg cursor-grab bg-[#2a2d2e] border border-transparent hover:border-purple-500/50 hover:bg-[#333] transition-all select-none shadow-sm hover:shadow-purple-500/10"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-l-lg" />
          <div className="p-2 rounded-md bg-[#202020] text-purple-400 group-hover:text-white group-hover:bg-purple-600 transition-all duration-300 shadow-inner">
            <Table size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
              New Schema
            </span>
            <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400 transition-colors">
              Drag to design a table
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-800 w-full" />

      <div>
        <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between cursor-pointer group mb-2"
        >
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span>Saved Models</span>
            </div>
            <span className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full border border-gray-700">
                {savedSchemas.length}
            </span>
        </div>

        {isExpanded && (
            <div className="animate-in slide-in-from-top-2 duration-200">
                {savedSchemas.length === 0 ? (
                    <div className="text-center p-6 border border-dashed border-gray-700 rounded-lg bg-[#252525]/30">
                        <LayoutTemplate size={24} className="mx-auto text-gray-600 mb-2" />
                        <span className="text-gray-500 text-[10px] block">
                           No models found.<br/>Drag "New Schema" and name it.
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                        {savedSchemas.map((schema) => (
                            <div 
                                key={schema.id || schema.tableName} 
                                draggable 
                                onDragStart={(event) => onDragStartSaved(event, schema)}
                                className="group flex items-center gap-3 p-2.5 rounded-lg cursor-grab bg-[#2a2d2e] border border-transparent hover:border-gray-500 hover:bg-[#333] transition-all select-none"
                            >
                                <div className="p-1.5 rounded-md bg-[#202020] text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors shadow-inner">
                                    <Database size={14} />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-xs font-bold text-gray-300 group-hover:text-white truncate">
                                        {schema.tableName}
                                    </span>
                                    <span className="text-[9px] text-gray-500 group-hover:text-gray-400">
                                        {schema.fields.length} Fields
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

    </div>
  );
}

export default ActivePanelDb;