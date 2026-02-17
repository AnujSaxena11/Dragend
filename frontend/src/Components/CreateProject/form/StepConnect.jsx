import { Input } from "./Input";

export const StepConnect = ({ formData, errors, update }) => (
  <div className="space-y-4">
    <Input
      label="Connection Name"
      error={errors.connectionName}
      onChange={(e) => update("connectionName", e.target.value)}
      value={formData.connectionName}
    />

    {formData.dbType === "Oracle" && formData.authType === "credentials" && (
      <Input
        label="Service Name"
        onChange={(e) => update("serviceName", e.target.value)}
        value={formData.serviceName}
      />
    )}

    {formData.authType === "uri" && (
      <Input
        label="Database URI"
        error={errors.uri}
        onChange={(e) => update("uri", e.target.value)}
        value={formData.uri}
        placeholder="postgres://user:pass@host:5432/db"
      />
    )}

    {formData.authType === "credentials" && (
      <>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Host" 
            error={errors.host}
            onChange={(e) => update("host", e.target.value)} 
            value={formData.host}
            placeholder="127.0.0.1"
          />
          <Input
            label="Port"
            error={errors.port}
            onChange={(e) => update("port", e.target.value)}
            value={formData.port}
            placeholder="3306"
          />
        </div>
        
        <Input
          label="Username"
          error={errors.username}
          onChange={(e) => update("username", e.target.value)}
          value={formData.username}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password}
          onChange={(e) => update("password", e.target.value)}
          value={formData.password}
        />
      </>
    )}

    {formData.authType === "apiKey" && (
      <>
        <Input
          label="Endpoint"
          error={errors.endpoint}
          onChange={(e) => update("endpoint", e.target.value)}
          value={formData.endpoint}
        />
        <Input
          label="API Key"
          type="password"
          error={errors.apiKey}
          onChange={(e) => update("apiKey", e.target.value)}
          value={formData.apiKey}
        />
      </>
    )}
  </div>
);