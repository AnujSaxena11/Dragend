import { useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Database, Settings2, Trash2 } from "lucide-react";
import SchemaDetailModal from "../Database/SchemaDetailModal";
import { useSchema } from "../SchemaContext";

function TableRefNode({ id, data }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { updateSchema, deleteSchema } = useSchema();
  const { updateNodeData, deleteElements } = useReactFlow();

  const handleUpdate = (updatedFields) => {
    updateNodeData(id, { fields: updatedFields });
    updateSchema(data.id, updatedFields);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); 
    deleteSchema(data.id);
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <>
      <div className="group relative flex flex-col items-center">
        <div onClick={() => setModalOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-purple-500/30 hover:border-purple-500 shadow-lg hover:shadow-purple-500/20 flex items-center justify-center cursor-pointer transition-all duration-300 z-10"
        >
            <Database size={24} className="text-purple-400 group-hover:text-white transition-colors" />            
        </div>
        <div className="absolute top-16 flex flex-col items-center pointer-events-none">
            <span className="text-[10px] font-bold text-gray-200 bg-[#1a1a1a]/80 px-2 py-0.5 rounded-full border border-gray-700/50 backdrop-blur-sm whitespace-nowrap">
                {data.tableName}
            </span>
            <span className="text-[8px] text-gray-500 mt-0.5">
                {data.fields?.length || 0} fields
            </span>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          id="table-source" 
          className="!w-3 !h-3 !bg-purple-500 !border-2 !border-[#1a1a1a] transition-transform hover:scale-125 z-0"
          style={{ right: -4, top: 28 }} 
        />

      </div>
      {isModalOpen && (
        <SchemaDetailModal 
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            schemaData={data}
            onUpdate={handleUpdate}
            onDeleteSchema={() => handleDelete({ stopPropagation: () => {} })}
        />
      )}
    </>
  );
}
export default TableRefNode;