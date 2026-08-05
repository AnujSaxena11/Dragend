import { Input } from "./Input";

export const StepIdentity = ({ formData, errors, update }) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-gray-900">Project Identity</h3>
    <Input
      label="Project Name"
      error={errors.projectName}
      onChange={(e) => update("projectName", e.target.value)}
    />
    <textarea
      rows={3}
      placeholder="Optional description"
      onChange={(e) => update("description", e.target.value)}
      className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 outline-none"
    />
  </div>
);


