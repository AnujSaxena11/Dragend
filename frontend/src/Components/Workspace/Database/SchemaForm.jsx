import { useState, useEffect } from "react";
import ModalPortal from "../../common/ModalPortal";

function SchemaForm({ onClose, onSave, initialData }) {
  const [field, setField] = useState({
    name: "",
    type: "string",
    constraint: "",
    required: false,
  });
  useEffect(() => {
    if (initialData) {
      setField(initialData);
    }
  }, [initialData]);

  const handleSave = () => {
    if (!field.name.trim()) return;
    onSave(field);
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
        <div className="bg-[#202020] text-white rounded-xl w-[420px] p-5 shadow-2xl border border-gray-700">
          <h2 className="text-sm font-semibold mb-4 text-gray-200">
            {initialData ? "Edit Field" : "Add Field"}
          </h2>
          
          <div className="flex flex-col gap-3">
            <input  placeholder="Field name" value={field.name}  onChange={(e) => setField({ ...field, name: e.target.value })}
              className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-sm rounded outline-none focus:border-purple-500 transition-colors" />
            <select value={field.type} onChange={(e) => setField({ ...field, type: e.target.value })}
              className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-sm rounded outline-none focus:border-purple-500 transition-colors">
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
              <option value="json">JSON</option>
            </select>
            <select value={field.constraint} onChange={(e) => setField({ ...field, constraint: e.target.value })}
              className="bg-[#2a2a2a] border border-gray-600 px-3 py-2 text-sm rounded outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">No Constraint</option>
              <option value="primary">Primary Key</option>
              <option value="foreign">Foreign Key</option>
              <option value="unique">Unique</option>
            </select>

            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={field.required} className="accent-purple-500" onChange={(e) => setField({ ...field, required: e.target.checked })} />
              Required Field
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium rounded bg-gray-700 hover:bg-gray-600 transition-colors"  >
              Cancel
            </button>

            <button 
              onClick={handleSave} 
              className="px-3 py-1.5 text-xs font-medium rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

export default SchemaForm;