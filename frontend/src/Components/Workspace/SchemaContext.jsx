import { createContext, useContext, useState } from "react";
const SchemaContext = createContext();

export const useSchema = () => {
    const context = useContext(SchemaContext);
    if (!context) {
        throw new Error("useSchema must be used within a SchemaProvider");
    }
    return context;
};

export const SchemaProvider = ({ children }) => {
    const [savedSchemas, setSavedSchemas] = useState([]);

    const saveSchema = (schema) => {
        setSavedSchemas((prev) => {
            const exists = prev.find((s) => s.id === schema.id);
            if (exists) {
                return prev.map((s) => (s.id === schema.id ? schema : s));
            }
            return [...prev, schema];
        });
    };

    const updateSchema = (id, updatedFields) => {
        setSavedSchemas((prev) =>
            prev.map((s) => s.id === id ? { ...s, fields: updatedFields } : s)
        );
    };

    const deleteSchema = (id) => {
        setSavedSchemas((prev) => prev.filter((s) => s.id !== id));
    }

    return (
        <SchemaContext.Provider value={{ 
            savedSchemas, 
            setSavedSchemas, 
            saveSchema, 
            updateSchema, 
            deleteSchema 
        }}>
            {children}
        </SchemaContext.Provider>
    );
};

export default SchemaContext;