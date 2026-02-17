import { useState } from "react";
import { X, Plus, Trash2, Pencil, Database } from "lucide-react";
import ModalPortal from "../../common/ModalPortal"; 
import SchemaForm from "./SchemaForm"; 

function SchemaDetailModal({ isOpen, onClose, schemaData, onUpdate, onDeleteSchema }) {
    const [fields, setFields] = useState(schemaData.fields || []);
    const [showFieldForm, setShowFieldForm] = useState(false);
    const [editingFieldIndex, setEditingFieldIndex] = useState(null);

    if (!isOpen) return null;
    const handleSaveField = (fieldData) => {
        let updatedFields = [...fields];
        if (editingFieldIndex !== null) {
            updatedFields[editingFieldIndex] = fieldData;
        } else {
            updatedFields.push(fieldData);
        }
        setFields(updatedFields);
        onUpdate(updatedFields);
        setShowFieldForm(false);
        setEditingFieldIndex(null);
    };

    const handleDeleteField = (index) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);
        onUpdate(updatedFields);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[50] animate-in fade-in duration-200">
                <div className="bg-[#1e1e1e] w-[500px] rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="px-5 py-4 bg-[#252525] border-b border-gray-700 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                <Database size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-white uppercase tracking-wider">{schemaData.tableName}</h2>
                                <span className="text-[10px] text-gray-400">Manage Model Schema</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                        {fields.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-xs border border-dashed border-gray-700 rounded-lg">
                                No fields defined yet.
                            </div>
                        ) : (
                            fields.map((field, index) => (
                                <div key={index} className="group flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg border border-transparent hover:border-gray-600 transition-all">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 
                                ${field.constraint === 'primary' ? 'bg-yellow-500' :
                                                field.constraint === 'foreign' ? 'bg-blue-500' : 'bg-gray-600'}`}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-200">{field.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-mono text-purple-400 bg-purple-400/10 px-1 rounded">{field.type}</span>
                                                {field.required && <span className="text-[9px] text-gray-500">Required</span>}
                                                {field.constraint && <span className="text-[9px] text-blue-400 capitalize">{field.constraint}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingFieldIndex(index); setShowFieldForm(true); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                                            <Pencil size={12} />
                                        </button>
                                        <button onClick={() => handleDeleteField(index)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 bg-[#252525] border-t border-gray-700 flex justify-between items-center">
                        <button onClick={() => onDeleteSchema?.(schemaData.id)} className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-red-500/10 transition-colors">
                            <Trash2 size={12} /> Delete Model
                        </button>
                        <button onClick={() => { setEditingFieldIndex(null); setShowFieldForm(true); }} className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all">
                            <Plus size={14} /> Add Field
                        </button>
                    </div>
                </div>
                {showFieldForm && (
                    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20">
                        <SchemaForm initialData={editingFieldIndex !== null ? fields[editingFieldIndex] : null} onClose={() => setShowFieldForm(false)} onSave={handleSaveField}
                        />
                    </div>
                )}
            </div>
        </ModalPortal>
    );
}

export default SchemaDetailModal;