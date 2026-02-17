import { Check } from "lucide-react";

export const SelectionCard = ({ selected, onClick, title, desc, icon }) => (
  <button
    onClick={onClick}
    className={`p-5 m-3 rounded-2xl border text-left transition-all
      ${
        selected
          ? "bg-purple-50 border-purple-400 shadow-md"
          : "bg-white border-gray-200 hover:border-gray-300"
      }
    `}
  >
    <div className="flex justify-between items-center mb-2">
      <div className="p-2 bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center">
        <img
          src={icon}
          alt={title}
          className="w-8 h-8 object-cover"
        />
      </div>

      {selected && <Check size={16} className="text-purple-600" />}
    </div>

    <h3 className="font-semibold text-gray-900">{title}</h3>
    {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
  </button>
);
