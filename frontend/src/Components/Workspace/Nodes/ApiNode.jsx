import { useState, useCallback, useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Globe } from "lucide-react";

function ApiNode({ id, data, selected }) {
    const { updateNodeData } = useReactFlow();
    const [route, setRoute] = useState(data.route || '');
    useEffect(() => {
        setRoute(data.route || '');
    }, [data.route]);

    const colors = {
        GET: { bg: "bg-blue-600", border: "border-blue-500", shadow: "shadow-blue-500/20" },
        POST: { bg: "bg-green-600", border: "border-green-500", shadow: "shadow-green-500/20" },
        PUT: { bg: "bg-orange-500", border: "border-orange-500", shadow: "shadow-orange-500/20" },
        PATCH: { bg: "bg-yellow-500", border: "border-yellow-500", shadow: "shadow-yellow-500/20" },
        DELETE: { bg: "bg-red-600", border: "border-red-500", shadow: "shadow-red-500/20" },
    };

    const style = colors[data.method] || { bg: "bg-gray-600", border: "border-gray-500", shadow: "shadow-gray-500/20" };

    const onRouteChange = useCallback((evt) => {
        const newValue = evt.target.value;
        setRoute(newValue);
        updateNodeData(id, { route: newValue }); 
    }, [id, updateNodeData]);

    const onFocus = () => {
        data.takeSnapshot?.();
    };

    return (
        <div className="relative group">
            <div className={`flex items-center min-w-[140px] h-[28px] bg-[#1a1a1a] rounded-full border transition-all duration-300 ease-in-out overflow-hidden ${selected ? style.border : "border-[#333] hover:border-gray-500"} ${selected ? `shadow-md ${style.shadow}` : "shadow-sm"}`} >
                <div className={`${style.bg} h-full px-2 flex items-center justify-center min-w-[45px]`}>
                    <span className="text-[9px] font-black text-white tracking-wider">
                        {data.method}
                    </span>
                </div>

                <div className="flex-1 flex items-center px-2 relative">
                    <span className="text-gray-500 text-[10px] font-mono mr-0.5">/</span>
                    <input 
                        type="text"
                        className="nodrag w-full bg-transparent text-gray-200 text-[10px] font-mono outline-none placeholder-gray-600"
                        placeholder="path"
                        value={route} 
                        onChange={onRouteChange}
                        onFocus={onFocus}
                    />
                </div>
            </div>
            <Handle type="target" position={Position.Left} id="route-target" className="!w-2 !h-2 !bg-[#333] !border !border-gray-500 transition-colors group-hover:!border-white" style={{ left: -3 }}
            />
            <Handle type="source" position={Position.Right} id="route-source" className={`!w-2 !h-2 !bg-white !border !border-[#1a1a1a] transition-all`} style={{ right: -3 }}/>
        </div>
    );
}
export default ApiNode;