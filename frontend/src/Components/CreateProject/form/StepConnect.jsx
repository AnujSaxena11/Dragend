import { Input } from "./Input";
import { AlertCircle, Info } from "lucide-react";

export const StepConnect = ({ formData, errors, update }) => {
  const isMongo = formData.dbType === "mongodb";
  const isLocal = formData.environment === "local";
  const isDeployed = formData.environment === "deployed";
  const isOracle = formData.dbType === "oracle";

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      <Input
        label={isMongo ? "Database Name" : "Connection / Database Name"}
        error={errors.connectionName}
        onChange={(e) => update("connectionName", e.target.value)}
        value={formData.connectionName}
        placeholder={isMongo ? "my_app_db" : "e.g., Production DB"}
      />

      {isLocal && (
        <div className="space-y-4">

          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200 shadow-sm">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <p>
              <strong>Note on Local Databases:</strong> Your database is running locally, so we can’t verify it from our servers. <span className="text-green-600 font-medium">This is normal,</span> so we’ll assume the details below are correct.
            </p>
          </div>

          {isMongo ? (
            <div className="text-xs text-purple-700 bg-purple-50 p-3 rounded-lg border border-purple-100">
              <p><strong>Local MongoDB Detected:</strong></p>
              <p className="mt-1 text-gray-600">We will automatically attempt to connect to <code>mongodb://localhost:27017/{formData.connectionName || 'your_db'}</code>.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Host"
                  onChange={(e) => update("host", e.target.value)}
                  value={formData.host || "localhost"}
                />
                <Input
                  label="Port"
                  placeholder={formData.dbType === 'postgresql' ? "5432" : formData.dbType === 'mysql' ? "3306" : "1433"}
                  onChange={(e) => update("port", e.target.value)}
                  value={formData.port}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Username"
                  onChange={(e) => update("username", e.target.value)}
                  value={formData.username}
                  placeholder="e.g., root or postgres"
                />
                <Input
                  label="Password"
                  type="password"
                  onChange={(e) => update("password", e.target.value)}
                  value={formData.password}
                />
              </div>

              {isOracle && (
                <Input
                  label="Service Name (Oracle)"
                  onChange={(e) => update("serviceName", e.target.value)}
                  value={formData.serviceName}
                  placeholder="e.g., ORCL"
                />
              )}
            </>
          )}
        </div>
      )}

      {isDeployed && (
        <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">

          <div className="flex bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => {
                update("connectionMode", "uri");
                update("authType", "uri");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${formData.connectionMode === "uri" || !formData.connectionMode
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Connection URI
            </button>
            <button
              onClick={() => {
                update("connectionMode", "credentials");
                update("authType", "credentials");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${formData.connectionMode === "credentials"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Credentials
            </button>
          </div>

          {(formData.connectionMode === "uri" || !formData.connectionMode) && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-1">

              <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Public URL Required:</strong> Please ensure you provide a publicly accessible connection string. Internal private network URLs cannot be reached by our servers to verify the connection.
                </p>
              </div>

              <Input
                label="Database URI"
                error={errors.uri}
                placeholder={isMongo ? "mongodb+srv://user:pass@cluster.mongodb.net/db" : "postgres://user:pass@host:5432/db"}
                onChange={(e) => update("uri", e.target.value)}
                value={formData.uri}
              />
            </div>
          )}

          {formData.connectionMode === "credentials" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1">

              <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm mb-2">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Public Host Required:</strong> Please ensure your Host is a public address. Internal network hosts cannot be verified.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Host"
                  onChange={(e) => update("host", e.target.value)}
                  value={formData.host}
                  placeholder="e.g., viaduct.proxy.rlwy.net"
                />
                <Input
                  label="Port"
                  onChange={(e) => update("port", e.target.value)}
                  value={formData.port}
                  placeholder={isMongo ? "27017" : "45392"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Username"
                  onChange={(e) => update("username", e.target.value)}
                  value={formData.username}
                />
                <Input
                  label="Password"
                  type="password"
                  onChange={(e) => update("password", e.target.value)}
                  value={formData.password}
                />
              </div>

              {isOracle && (
                <Input
                  label="Service Name (Oracle)"
                  onChange={(e) => update("serviceName", e.target.value)}
                  value={formData.serviceName}
                  placeholder="e.g., ORCL"
                />
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};