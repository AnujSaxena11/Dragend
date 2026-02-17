import { useState, useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Pencil, Trash2, X, Save, Check } from "lucide-react";
import SchemaForm from "../Database/SchemaForm";
import toast from "react-hot-toast";
import { useSchema } from "../SchemaContext";

function DbNode({ id, data }) {
  const { updateNodeData, deleteElements } = useReactFlow();
  const { saveSchema } = useSchema();
  const [showForm, setShowForm] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const onNameChange = useCallback((evt) => {
    updateNodeData(id, { tableName: evt.target.value });
  }, [id, updateNodeData]);

  const handleSaveSchema = () => {
    if (!data.tableName || data.tableName.trim() === "") {
      toast.error("Schema Name is required!");
      return;
    }
    if (!data.fields || data.fields.length === 0) {
      toast.error("Add at least one field!");
      return;
    }
    saveSchema({
      id: id,
      tableName: data.tableName,
      fields: data.fields
    });

    toast.success(`Schema "${data.tableName}" Saved & Moved to API Panel`, {
      icon: <Check />,
      style: { background: '#333', color: '#fff' }
    });
    deleteElements({ nodes: [{ id }] });
  };

  const handleSaveField = (fieldData) => {
    data.takeSnapshot?.();
    const currentFields = [...(data.fields || [])];
    if (editingFieldIndex !== null) {
      currentFields[editingFieldIndex] = fieldData;
    } else {
      currentFields.push(fieldData);
    }
    updateNodeData(id, { fields: currentFields });
    setShowForm(false);
    setEditingFieldIndex(null);
  };

  const handleDeleteField = (e, index) => {
    e.stopPropagation();
    data.takeSnapshot?.();

    const currentFields = data.fields.filter((_, i) => i !== index);
    updateNodeData(id, { fields: currentFields });

    if (expandedIndex === index) setExpandedIndex(null);
  };

  const handleEditClick = (e, index) => {
    e.stopPropagation();
    setEditingFieldIndex(index);
    setShowForm(true);
  };

  return (
    <>
      <div className="relative w-30 bg-[#202020] text-white text-[8px] rounded-lg shadow-xl border border-gray-700 transition-all hover:border-gray-500">
        <div className="text-center p-1 border-b border-gray-700 bg-[#252525] rounded-t-lg flex justify-between items-center px-2">

          <input type="text" placeholder="SCHEMA NAME" onChange={onNameChange} value={data.tableName || ''}
            className="nodrag w-full text-[8px] font-bold bg-transparent outline-none text-left placeholder-gray-500 uppercase tracking-wide text-gray-200"
          />
          <button onClick={handleSaveSchema} className="text-gray-400 hover:text-green-400 transition-colors" title="Save & Close">
            <Save size={10} />
          </button>
        </div>
        <div className="p-1 min-h-[20px] flex flex-col gap-1">
          {(data.fields || []).map((field, index) => (
            <div onClick={(e) => { e.stopPropagation(); setExpandedIndex(expandedIndex === index ? null : index); }} key={index}
              className="relative group flex items-center justify-between bg-[#2a2a2a] rounded px-2 py-1 cursor-pointer hover:bg-[#333] border border-transparent hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                {field.constraint === 'primary' && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" title="Primary Key" />}
                {field.constraint === 'foreign' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" title="Foreign Key" />}
                <span className="truncate font-medium text-[9px] text-gray-200">{field.name}</span>
              </div>
              <span className="text-[8px] text-gray-500 font-mono">{field.type}</span>

              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#333] pl-2">
                <button onClick={(e) => handleEditClick(e, index)} className="p-1 hover:text-blue-400 text-gray-400"><Pencil size={10} /></button>
                <button onClick={(e) => handleDeleteField(e, index)} className="p-1 hover:text-red-400 text-gray-400"><Trash2 size={10} /></button>
              </div>
            </div>
          ))}
        </div>
        {expandedIndex !== null && data.fields && data.fields[expandedIndex] && (
          <div className="absolute top-0 left-full ml-3 w-25 bg-[#1f1f1f] border border-gray-600 rounded-lg shadow-2xl p-2 text-[8px] z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="font-bold text-white mb-1 text-[8px] border-b border-gray-700 pb-1 flex justify-between items-center">
              <span>{data.fields[expandedIndex].name}</span>
              <button onClick={() => setExpandedIndex(null)} className="text-gray-500 hover:text-white"><X size={12} /></button>
            </div>
            <div className="space-y-1.5 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">Constraint:</span>
                <span className="capitalize text-purple-300">{data.fields[expandedIndex].constraint || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Required:</span>
                <span className={data.fields[expandedIndex].required ? "text-green-400" : "text-gray-400"}>
                  {data.fields[expandedIndex].required ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="p-1.5 border-t border-gray-700 text-center">
          <button className="nodrag text-[9px] font-medium text-gray-400 hover:text-white hover:bg-[#333] py-1 rounded w-full transition-colors border border-dashed border-gray-700 hover:border-gray-500"
            onClick={() => { setEditingFieldIndex(null); setShowForm(true); }}>
            + Add Field
          </button>
        </div>
      </div>

      {showForm && (
        <SchemaForm
          initialData={editingFieldIndex !== null ? data.fields[editingFieldIndex] : null}
          onClose={() => { setShowForm(false); setEditingFieldIndex(null); }}
          onSave={handleSaveField}
        />
      )}
    </>
  );
}

export default DbNode;