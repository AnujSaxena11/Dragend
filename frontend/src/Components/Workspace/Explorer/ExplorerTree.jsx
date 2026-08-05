import ExplorerItem from "./ExplorerItem";
import { fileTree } from "./mockFileTree"

function ExplorerTree() {
    return (
        <div className="mt-2">
            {fileTree.map((node, index) => (
                <ExplorerItem key={index} node={node} />
            ))}
        </div>
    );
}

export default ExplorerTree;
