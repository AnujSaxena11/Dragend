import { useState } from "react";
import { X, Check } from "lucide-react";
import ModalPortal from "../common/ModalPortal"; 

function FieldSelectionModal({ isOpen, onClose, onSave, schema, apiMethod }) {
  const [selectedFields, setSelectedFields] = useState({});
  if (!isOpen) return null;

  const handleToggle = (fieldName) => {
    setSelectedFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleSave = () => {
    // Convert object { id: true, name: false } to array ['id']
    const activeFields = Object.keys(selectedFields).filter((k) => selectedFields[k]);
    if (activeFields.length === 0) {
       // Optional: Allow empty if they just want a dependency
    }
    onSave(activeFields);
  };

  return (
    <ModalPortal>
       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
        <div className="bg-[#202020] text-white rounded-xl w-[400px] shadow-2xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center bg-[#252525]">
            <div className="flex flex-col">
                <h2 className="text-sm font-bold text-gray-200">Select Fields</h2>
                <span className="text-[10px] text-gray-400">
                    For {apiMethod} request on <span className="text-purple-400">{schema.tableName}</span>
                </span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={16} />
            </button>
          </div>
          <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {schema.fields.map((field) => (
              <div key={field.name}  onClick={() => handleToggle(field.name)}
                className={`flex items-center justify-between p-2 mb-1 rounded cursor-pointer border transition-all
                    ${selectedFields[field.name] ? "bg-purple-500/10 border-purple-500/50"  : "bg-[#2a2a2a] border-transparent hover:border-gray-600"} `} >
                <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                        ${selectedFields[field.name] ? "bg-purple-600 border-purple-600" : "border-gray-500"}
                    `}>
                        {selectedFields[field.name] && <Check size={10} className="text-white" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-200">{field.name}</span>
                        <span className="text-[9px] text-gray-500">{field.type}</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    {field.constraint === 'primary' && <span className="text-[8px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">PK</span>}
                    {field.constraint === 'foreign' && <span className="text-[8px] bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded">FK</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-700 bg-[#252525] flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors">
                Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded shadow-lg transition-all">
                Connect Fields
            </button>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
}

export default FieldSelectionModal;