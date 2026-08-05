import { useState, useEffect } from "react";
import ModalPortal from "../../common/ModalPortal";
import { useSchema } from "../SchemaContext";
import { AlertCircle } from "lucide-react"; 

function SchemaForm({ onClose, onSave, initialData }) {
  const { savedSchemas } = useSchema();

  const [field, setField] = useState({
    name: "",
    type: "string",
    isArray: false,
    constraint: "",
    required: false,
    unique: false,
    index: false,
    defaultValue: "",
    autoIncrement: false,
    isUuid: false,
    minLength: "",
    maxLength: "",
    regexPattern: "",
    minValue: "",
    maxValue: "",
    enumValues: "", 
    targetTable: "",
    targetField: "",
    onDelete: "Cascade",
    onUpdate: "Cascade",
    isHidden: false,
    isHashed: false,
    hashAlgorithm: "bcrypt",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setField((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleSave = () => {
    setError("");
    const trimmedName = field.name.trim();
    if (!trimmedName) {
      return setError("Field name is required.");
    }
   if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedName)) {
      return setError("Invalid name. Use only letters, numbers, and underscores (no spaces).");
    }


    if (field.constraint === "foreign") {
      if (!field.targetTable || !field.targetField) {
        return setError("Please select both a Target Model and a Target Field for the Foreign Key.");
      }
    }


    if (field.type === "string") {
      if (field.minLength !== "" && field.maxLength !== "") {
        if (parseInt(field.minLength) > parseInt(field.maxLength)) {
          return setError("Min Length cannot be greater than Max Length.");
        }
      }
      
      if (field.regexPattern) {
        try {
          new RegExp(field.regexPattern);
        } catch (e) {
          return setError(`Invalid Regex Pattern: ${e.message}`);
        }
      }
    }

    if (field.type === "number") {
      if (field.minValue !== "" && field.maxValue !== "") {
        if (parseFloat(field.minValue) > parseFloat(field.maxValue)) {
          return setError("Min Value cannot be greater than Max Value.");
        }
      }
    }

    if (field.type === "enum" && !field.enumValues.trim()) {
       return setError("Please provide at least one Enum value.");
    }

    onSave({ ...field, name: trimmedName });
  };

  const selectedTargetSchema = savedSchemas?.find(s => s.tableName === field.targetTable);

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
        <div className="bg-[#202020] text-white rounded-xl w-[500px] shadow-2xl border border-gray-700 flex flex-col max-h-[90vh]">

          <div className="px-5 py-4 border-b border-gray-700 bg-[#252525] flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
              {initialData ? "Edit Field" : "Add New Field"}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
          </div>

          <div className="p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">

  
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Basic Info</label>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Field name (e.g., user_name)" value={field.name} onChange={(e) => setField({ ...field, name: e.target.value })}
                  className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded outline-none focus:border-purple-500 transition-colors w-full" />

                <select value={field.type} onChange={(e) => setField({ ...field, type: e.target.value })}
                  className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded outline-none focus:border-purple-500 transition-colors w-full">
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="date">Date</option>
                  <option value="enum">Enum</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={field.isArray} onChange={(e) => setField({ ...field, isArray: e.target.checked })} className="accent-purple-500" />
                  Is Array / List?
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-gray-700 pt-3">
              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Constraints</label>
              <select value={field.constraint} onChange={(e) => setField({ ...field, constraint: e.target.value })}
                className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded outline-none focus:border-purple-500 transition-colors w-full">
                <option value="">No Structural Constraint</option>
                <option value="primary">Primary Key (PK)</option>
                <option value="foreign">Foreign Key (FK)</option>
              </select>

              <div className="grid grid-cols-3 gap-2 mt-1">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={field.required} onChange={(e) => setField({ ...field, required: e.target.checked })} className="accent-purple-500" />
                  Required
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={field.unique} onChange={(e) => setField({ ...field, unique: e.target.checked })} className="accent-purple-500" />
                  Unique
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={field.index} onChange={(e) => setField({ ...field, index: e.target.checked })} className="accent-purple-500" />
                  Index (Fast Search)
                </label>
              </div>
            </div>

            {field.constraint === "foreign" && (
              <div className="flex flex-col gap-3 border-t border-gray-700 pt-3 bg-blue-900/10 -mx-4 px-4 pb-3">
                <label className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mt-1">Relation Mapping</label>
                <div className="grid grid-cols-2 gap-3">
                  <select value={field.targetTable} onChange={(e) => setField({ ...field, targetTable: e.target.value, targetField: "" })}
                    className="bg-[#2a2a2a] border border-blue-500/30 px-3 py-2 text-xs rounded outline-none focus:border-blue-500 transition-colors w-full">
                    <option value="">Select Target Model...</option>
                    {savedSchemas?.map(s => (
                      <option key={s.id} value={s.tableName}>{s.tableName}</option>
                    ))}
                  </select>

                  <select value={field.targetField} onChange={(e) => setField({ ...field, targetField: e.target.value })} disabled={!field.targetTable}
                    className="bg-[#2a2a2a] border border-blue-500/30 px-3 py-2 text-xs rounded outline-none focus:border-blue-500 transition-colors w-full disabled:opacity-50">
                    <option value="">Select Target Field...</option>
                    {selectedTargetSchema?.fields.map(f => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500">On Delete</span>
                    <select value={field.onDelete} onChange={(e) => setField({ ...field, onDelete: e.target.value })} className="bg-[#2a2a2a] border border-gray-600 px-3 py-1.5 text-xs rounded outline-none">
                      <option value="Cascade">Cascade (Delete this too)</option>
                      <option value="Set Null">Set Null</option>
                      <option value="Restrict">Restrict (Prevent delete)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500">On Update</span>
                    <select value={field.onUpdate} onChange={(e) => setField({ ...field, onUpdate: e.target.value })} className="bg-[#2a2a2a] border border-gray-600 px-3 py-1.5 text-xs rounded outline-none">
                      <option value="Cascade">Cascade</option>
                      <option value="Set Null">Set Null</option>
                      <option value="Restrict">Restrict</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 border-t border-gray-700 pt-3">
              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Validation</label>

              <input placeholder="Default Value (e.g., 'pending', 0, false)" value={field.defaultValue} onChange={(e) => setField({ ...field, defaultValue: e.target.value })}
                className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded outline-none focus:border-purple-500 transition-colors w-full mb-1" />

              {field.type === "string" && (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Min Length" value={field.minLength} onChange={(e) => setField({ ...field, minLength: e.target.value })} className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded outline-none" />
                    <input type="number" placeholder="Max Length" value={field.maxLength} onChange={(e) => setField({ ...field, maxLength: e.target.value })} className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded outline-none" />
                    <input placeholder="Regex Pattern (e.g., ^[A-Z]+$)" value={field.regexPattern} onChange={(e) => setField({ ...field, regexPattern: e.target.value })} className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded outline-none col-span-2" />
                  </div>

                  <div className="min-h-[24px] flex items-center">
                    {field.constraint === "primary" && (
                      <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                        <input type="checkbox" checked={field.isUuid} onChange={(e) => setField({ ...field, isUuid: e.target.checked })} className="accent-purple-500" />
                        Auto-generate UUID (e.g., uuidv4)
                      </label>
                    )}
                  </div>
                </div> 
              )}

              {field.type === "number" && (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <input type="number" placeholder="Min Value" value={field.minValue} onChange={(e) => setField({ ...field, minValue: e.target.value })} className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded outline-none" />
                    <input type="number" placeholder="Max Value" value={field.maxValue} onChange={(e) => setField({ ...field, maxValue: e.target.value })} className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded outline-none" />
                  </div>
                  
                  <div className="min-h-[24px] flex items-center">
                    {field.constraint === "primary" && (
                      <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                        <input type="checkbox" checked={field.autoIncrement} onChange={(e) => setField({ ...field, autoIncrement: e.target.checked })} className="accent-purple-500" />
                        Auto-Increment
                      </label>
                    )}
                  </div>
                </div>
              )}

              {field.type === "enum" && (
                <input placeholder="Values (comma separated, e.g. ADMIN, USER)" value={field.enumValues} onChange={(e) => setField({ ...field, enumValues: e.target.value })}
                  className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-xs rounded outline-none focus:border-purple-500 transition-colors w-full" />
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-gray-700 pt-3">
              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Security</label>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={field.isHidden} onChange={(e) => setField({ ...field, isHidden: e.target.checked })} className="accent-purple-500" />
                  Hide from API Responses (e.g., Select: false)
                </label>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer min-h-[24px]">
                    <input type="checkbox" checked={field.isHashed} onChange={(e) => setField({ ...field, isHashed: e.target.checked })} className="accent-purple-500" />
                    Hash this field
                  </label>

                  {field.isHashed && (
                    <select value={field.hashAlgorithm} onChange={(e) => setField({ ...field, hashAlgorithm: e.target.value })}
                      className="bg-[#1f1f1f] border border-gray-600 px-2 py-1 text-[10px] rounded outline-none focus:border-purple-500 transition-colors">
                      <option value="bcrypt">bcrypt (Standard)</option>
                      <option value="argon2">argon2</option>
                      <option value="sha256">SHA-256</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

          </div>

          {error && (
            <div className="px-5 py-2 bg-red-900/20 border-t border-red-900/50 flex items-center gap-2 text-red-400 animate-in slide-in-from-bottom-2">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span className="text-xs font-medium">{error}</span>
            </div>
          )}

          <div className="p-4 border-t border-gray-700 bg-[#252525] flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-xs font-medium rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" >
              Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-2 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20 transition-all">
              {initialData ? "Update Field" : "Save Field"}
            </button>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
}

export default SchemaForm;