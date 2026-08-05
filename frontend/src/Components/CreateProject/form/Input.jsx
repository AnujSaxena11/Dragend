export const Input = ({ label, error, ...props }) => (
  <div className="space-y-1 w-full">
    <label className="text-xs font-semibold text-gray-600">{label}</label>
    <input
      {...props}
      className="w-full bg-gray-100 border border-gray-300 focus:border-purple-500 rounded-xl px-4 py-3 text-gray-900 outline-none"
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
