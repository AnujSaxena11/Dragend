import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";

function ExplorerItem({ node, level = 0 }) {
    const [open, setOpen] = useState(false);

    const paddingLeft = `${level * 14}px`;

    if (node.type === "folder") {
        return (
            <div>
                <div
                    className="flex items-center gap-1 text-sm text-gray-300 hover:bg-[#2a2d2e] px-2 py-1 rounded cursor-pointer"
                    style={{ paddingLeft }}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <Folder size={16} className="text-blue-400" />
                    <span>{node.name}</span>
                </div>

                {open &&
                    node.children?.map((child, idx) => (
                        <ExplorerItem key={idx} node={child} level={level + 1} />
                    ))}
            </div>
        );
    }

    return (
        <div
            className="flex items-center gap-2 text-sm text-gray-400 hover:bg-[#2a2d2e] px-2 py-1 rounded cursor-pointer"
            style={{ paddingLeft: `${level * 14 + 20}px` }}
        >
            <File size={14} />
            <span>{node.name}</span>
        </div>
    );
}

export default ExplorerItem;
