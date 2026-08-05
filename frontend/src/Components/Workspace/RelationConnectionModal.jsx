import { useState } from "react";
import { X, Link2 } from "lucide-react";
import ModalPortal from "../common/ModalPortal";

function RelationConnectionModal({ isOpen, onClose, onSave, sourceSchema, targetSchema }) {
  const defaultFieldName = targetSchema?.tableName ? `${targetSchema.tableName.toLowerCase()}_id` : "target_id";

  const [fkField, setFkField] = useState({
    name: defaultFieldName,
    type: "string", 
    constraint: "foreign",
    required: true,
    targetTable: targetSchema?.tableName || "",
    targetField: "",
    onDelete: "Cascade",
    onUpdate: "Cascade",
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!fkField.name || !fkField.targetField) return;
    onSave(fkField);
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
        <div className="bg-[#202020] text-white rounded-xl w-[450px] shadow-2xl border border-gray-700 overflow-hidden">
          
          <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center bg-[#252525]">
            <div className="flex items-center gap-2">
                <Link2 size={16} className="text-blue-400" />
                <h2 className="text-sm font-bold text-gray-200">Connect Tables</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={16} /></button>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="text-xs text-gray-400 bg-blue-900/10 p-3 rounded border border-blue-900/30">
               Creating a Foreign Key in <strong className="text-purple-400">{sourceSchema.tableName}</strong> that points to <strong className="text-blue-400">{targetSchema.tableName}</strong>.
            </div>

            <div className="flex flex-col gap-3">
               <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">New Field Name (in {sourceSchema.tableName})</label>
                  <input value={fkField.name} onChange={e => setFkField({...fkField, name: e.target.value})} 
                     className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded w-full outline-none focus:border-blue-500" />
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Field Type</label>
                    <select value={fkField.type} onChange={e => setFkField({...fkField, type: e.target.value})} className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded w-full outline-none">
                        <option value="string">String (UUID)</option>
                        <option value="number">Number (Auto-Inc)</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Target Field (in {targetSchema.tableName})</label>
                    <select value={fkField.targetField} onChange={e => setFkField({...fkField, targetField: e.target.value})} className="bg-[#2a2a2a] border border-blue-500/50 px-3 py-2 text-xs rounded w-full outline-none focus:border-blue-500">
                        <option value="">Select Field...</option>
                        {targetSchema.fields.map(f => (
                           <option key={f.name} value={f.name}>{f.name}</option>
                        ))}
                    </select>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">On Delete</label>
                    <select value={fkField.onDelete} onChange={e => setFkField({...fkField, onDelete: e.target.value})} className="bg-[#2a2a2a] border border-gray-600 px-3 py-1.5 text-xs rounded w-full outline-none">
                        <option value="Cascade">Cascade</option>
                        <option value="Set Null">Set Null</option>
                        <option value="Restrict">Restrict</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-300 mt-5 cursor-pointer">
                    <input type="checkbox" checked={fkField.required} onChange={e => setFkField({...fkField, required: e.target.checked})} className="accent-blue-500" />
                    Required Field (Not Null)
                  </label>
               </div>
            </div>
          </div>

          <div className="p-3 border-t border-gray-700 bg-[#252525] flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded shadow-lg transition-all">
                Create Relationship
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

export default RelationConnectionModal;