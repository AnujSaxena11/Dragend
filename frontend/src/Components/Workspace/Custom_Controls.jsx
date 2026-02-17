import { useReactFlow } from '@xyflow/react';
import { RotateCcw, RotateCw, Plus, Minus } from 'lucide-react';

function CustomControls({ onUndo, onRedo }) {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-[#202020] px-3 py-2 rounded-xl shadow-xl border border-gray-700">
            <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
                <button onClick={zoomIn} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Zoom In">
                    <Plus size={16} />
                </button>
                <button onClick={zoomOut} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Zoom Out">
                    <Minus size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1 pl-2">
                <button onClick={onUndo} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Undo (Ctrl+Z)">
                    <RotateCcw size={16} />
                </button>
                <button onClick={onRedo} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Redo (Ctrl+Y)">
                    <RotateCw size={16} />
                </button>
            </div>
        </div>
    );
}

export default CustomControls;