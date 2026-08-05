import { SelectionCard } from "./SelectionCard";
import { Database } from "lucide-react";

const DBS = [
  { name: "PostgreSQL", logo: import.meta.env.VITE_PSQL_LOGO },
  { name: "MySQL", logo: import.meta.env.VITE_MYSQL_LOGO },
  { name: "MongoDB", logo: import.meta.env.VITE_MONGO_LOGO },
  { name: "SQLServer", logo: import.meta.env.VITE_SQLSERVER_LOGO },
  { name: "Oracle", logo: import.meta.env.VITE_ORACLE_LOGO }
];

const ENV_TYPES = [
  { label: "Local", value: "local" },
  { label: "Deployed", value: "deployed" },
];

export const StepDatabase = ({ formData, update }) => (
  <div className="space-y-6">

    {/* DB Type */}
    <div className="grid grid-cols-2 gap-3">
      {DBS.map((db) => (
        <SelectionCard
          key={db.name}
          title={db.name}
          icon={db.logo}
          selected={formData.dbType === db.name.toLowerCase()}
          onClick={() => {
            update("dbType", db.name.toLowerCase());
            // Reset environment if they change DB type to prevent stale config
            if (formData.environment) {
               update("environment", "");
               update("authType", "");
               update("uri", ""); 
            }
          }}
        />
      ))}
    </div>

    {/* Only show environment if a DB is selected */}
    {formData.dbType && (
      <div className="space-y-2 animate-in fade-in duration-200">
        <p className="text-sm font-medium text-gray-700">Environment</p>

        <div className="grid grid-cols-2 gap-3">
          {ENV_TYPES.map((env) => (
            <button
              key={env.value}
              onClick={() => {
                update("environment", env.value);
                
                if (env.value === "local") {
                  const isMongo = formData.dbType === "mongodb";
                  update("authType", isMongo ? "uri" : "credentials");
                  update("connectionMode", isMongo ? "uri" : "credentials");
                  
                  // FIX: Pre-fill a placeholder URI so your frontend validation passes!
                  if (isMongo) {
                     update("uri", "mongodb://localhost:27017/local_db");
                  }
                } else {
                  // Default deployed to URI
                  update("authType", "uri");
                  update("connectionMode", "uri");
                  update("uri", ""); // Clear the local dummy URI
                }
              }}
              className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                formData.environment === env.value
                ? "bg-purple-500 text-white border-purple-500 shadow-md"
                : "bg-white text-gray-700 hover:border-gray-300"
                }`}
            >
              {env.label}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);