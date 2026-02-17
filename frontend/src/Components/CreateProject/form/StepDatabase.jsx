import { SelectionCard } from "./SelectionCard";
import { Database } from "lucide-react";

const DBS = [
  { name: "PostgreSQL", logo: import.meta.env.VITE_PSQL_LOGO },
  { name: "MySQL", logo: import.meta.env.VITE_MYSQL_LOGO },
  { name: "MongoDB", logo: import.meta.env.VITE_MONGO_LOGO },
  { name: "SQL Server", logo: import.meta.env.VITE_SQLSERVER_LOGO },
  { name: "Oracle", logo: import.meta.env.VITE_ORACLE_LOGO }
];


const AUTH_TYPES = [
  { label: "URI Only", value: "uri" },
  { label: "Credentials", value: "credentials" },
  { label: "API Key", value: "apiKey" }
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
          onClick={() => update("dbType", db.name.toLowerCase())}
        />
      ))}
    </div>

    {/* Auth Type */}
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Authentication Type</p>

      <div className="grid grid-cols-3 gap-3">
        {AUTH_TYPES.map((a) => (
          <button
            key={a.value}
            onClick={() => update("authType", a.value)}
            className={`px-3 py-2 rounded-lg border text-sm ${
              formData.authType === a.value
                ? "bg-purple-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);