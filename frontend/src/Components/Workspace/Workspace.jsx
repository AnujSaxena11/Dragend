import {
  ReactFlow, Background, BackgroundVariant, useNodesState, useEdgesState, Panel, ConnectionLineType, addEdge,
  useReactFlow, ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import toast, { Toaster } from 'react-hot-toast';
import LeftSidebar from './LeftSidebar';
import { Link, Loader2, Trash2, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import FlyoutPanel from './FlyoutPanel';
import CustomControls from './Custom_Controls';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TableRefNode from './Nodes/TableRefNode';
import DbNode from './Nodes/DbNode';
import ApiNode from './Nodes/ApiNode';
import { SchemaProvider, useSchema } from './SchemaContext';
import { saveWorkflowData, getProjectData, deleteProjectAPI } from './WorkflowAPI';
import { useUndoRedo } from './useUndoRedo';
import FieldSelectionModal from './FieldSelectionModal';
import RelationConnectionModal from './RelationConnectionModal';
import PromptArea from './LLMCreation/PromptArea';

const nodeTypes = {
  dbNode: DbNode,
  apiNode: ApiNode,
  tableRefNode: TableRefNode,
};

function WorkspaceContent() {
  const { deleteElements, fitView } = useReactFlow();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { savedSchemas, setSavedSchemas, updateSchema } = useSchema();

  const [activePanel, setActivePanel] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [isDraggingNode, setIsDraggingNode] = useState(false);

  const trashCanRef = useRef(null);

  const [apiModalConfig, setApiModalConfig] = useState({
    isOpen: false,
    params: null,
    schema: null,
    apiMethod: ''
  });

  const [relationModalConfig, setRelationModalConfig] = useState({
    isOpen: false,
    params: null,
    sourceNode: null,
    targetNode: null
  });

  const { undo, redo, takeSnapshot } = useUndoRedo({
    nodes, setNodes, edges, setEdges
  });

  const onNodesChangeWrapped = useCallback((changes) => {
    onNodesChange(changes);
    if (changes.length > 0) setIsDirty(true);
  }, [onNodesChange]);

  const onEdgesChangeWrapped = useCallback((changes) => {
    onEdgesChange(changes);
    if (changes.length > 0) setIsDirty(true);
  }, [onEdgesChange]);


  useEffect(() => {
    const loadWorkflow = async () => {
      if (!projectId) return;

      try {
        const data = await getProjectData(projectId);

        if (data.success) {
          const { canvasState, tables } = data.project;

          if (canvasState) {
            setNodes(canvasState.nodes || []);
            setEdges(canvasState.edges || []);
            if (tables && Array.isArray(tables)) {
              setSavedSchemas(tables);
            }

            setTimeout(() => setIsDirty(false), 50);
          }
        }
      } catch (error) {
        console.error("Load Error:", error);
        toast.error("Could not load project data.");
      }
    };

    loadWorkflow();
  }, [projectId, setNodes, setEdges, setSavedSchemas]);


  const onDeleteProject = async () => {
    if (!window.confirm("Are you sure? This will delete the project and all workflows permanently.")) {
      return;
    }

    try {
      const res = await deleteProjectAPI(projectId);
      if (res.success) {
        toast.success("Project deleted.");
        navigate('/');
      }
    } catch (error) {
      toast.error("Failed to delete project.");
    }
  };

  const getValidationError = useCallback((params) => {
    const sourceNode = nodes.find((n) => n.id === params.source);
    const targetNode = nodes.find((n) => n.id === params.target);
    if (!sourceNode || !targetNode) return "Invalid Connection!";
    if (params.source === params.target) return "Cannot connect a node to itself.";

    const isSourceApi = sourceNode.type === 'apiNode';
    const isTargetApi = targetNode.type === 'apiNode';

    if (isSourceApi && isTargetApi) return "Workflow Error: Cannot connect two API endpoints directly.";


    const existingEdge = edges.find((e) =>
      e.source === params.source &&
      e.target === params.target
    );
    if (existingEdge) {
      return "Connection already exists.";
    }
    return null;
  }, [nodes, edges]);

  const onConnect = useCallback((params) => {
    const error = getValidationError(params);
    if (error) {
      toast.error(error, {
        style: { background: '#333', color: '#fff', border: '1px solid #ef4444' }
      });
      return;
    }

    const sourceNode = nodes.find((n) => n.id === params.source);
    const targetNode = nodes.find((n) => n.id === params.target);

    const isSourceDb = sourceNode.type === 'dbNode' || sourceNode.type === 'tableRefNode';
    const isTargetDb = targetNode.type === 'dbNode' || targetNode.type === 'tableRefNode';

    if (isSourceDb && isTargetDb) {
      setRelationModalConfig({
        isOpen: true,
        params: params,
        sourceNode: sourceNode,
        targetNode: targetNode
      });
    } else {
      setApiModalConfig({
        isOpen: true,
        params: params,
        schema: sourceNode.data,
        apiMethod: targetNode.data.method
      });
    }
  }, [nodes, edges, getValidationError]);

  const onApiModalSave = (selectedFields) => {
    if (selectedFields.length === 0) {
      toast.error("Please select at least one field.");
      return;
    }
    const { params } = apiModalConfig;
    takeSnapshot();

    const newEdge = {
      ...params,
      id: `e${params.source}-${params.target}`,
      animated: false,
      data: { selectedFields: selectedFields },
    };

    setEdges((eds) => addEdge(newEdge, eds));
    setIsDirty(true);
    toast.success("API Linked Successfully", { icon: <Link size={16} />, style: { background: '#333', color: '#fff', border: '1px solid #22c55e' } });
    setApiModalConfig({ isOpen: false, params: null, schema: null, apiMethod: '' });
  };

  const onRelationModalSave = (newForeignKeyField) => {
    takeSnapshot();
    const { sourceNode, targetNode, params } = relationModalConfig;

    const updatedFields = [...(sourceNode.data.fields || []), newForeignKeyField];
    if (sourceNode.data.id) {
      updateSchema(sourceNode.data.id, updatedFields);
    }

    setNodes((nds) =>
      nds.map((n) =>
        n.id === sourceNode.id
          ? { ...n, data: { ...n.data, fields: updatedFields } }
          : n
      )
    );

    const newEdge = {
      ...params,
      id: `e${params.source}-${params.target}`,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 }
    };

    setEdges((eds) => addEdge(newEdge, eds));
    setIsDirty(true);
    toast.success("Relationship Created!", { icon: <Link size={16} />, style: { background: '#333', color: '#fff', border: '1px solid #3b82f6' } });
    setRelationModalConfig({ isOpen: false, params: null, sourceNode: null, targetNode: null });
  };

  const onSave = useCallback(async () => {
    if (!projectId) {
      toast.error("Project ID missing. Cannot Save.");
      return;
    }

    if (!isDirty) {
      toast("No changes to save.", {
        icon: <CheckCircle size={16} className="text-green-500" />,
        style: { background: '#333', color: '#fff', border: '1px solid #22c55e' }
      });
      return;
    }

    setIsSaving(true);

    const endpointsPayload = nodes
      .filter(n => n.type === 'apiNode')
      .map(apiNode => {
        const edge = edges.find(e => e.target === apiNode.id);
        let connectedTableName = null;
        let selectedFields = [];

        if (edge) {
          const sourceNode = nodes.find(n => n.id === edge.source);
          if (sourceNode) {
            connectedTableName = sourceNode.data.tableName;
          }
          selectedFields = edge.data?.selectedFields || [];
        }

        return {
          method: apiNode.data.method,
          route: apiNode.data.route,
          connectedTableName: connectedTableName,
          selectedFields: selectedFields
        };
      });

    const payload = {
      tables: savedSchemas,
      endpoints: endpointsPayload,
      canvasState: { nodes, edges }
    };

    try {
      await saveWorkflowData(projectId, payload);
      setIsDirty(false);
      toast.success("Workflow Saved Successfully!", { style: { background: '#333', color: '#fff', border: '1px solid #22c55e' } });
    } catch (error) {
      toast.error("Failed to save flow.", { style: { background: '#333', color: '#fff', border: '1px solid #ef4444' } });
    } finally {
      setIsSaving(false);
    }
  }, [nodes, edges, projectId, isDirty, savedSchemas]);


  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    takeSnapshot();
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const dataString = event.dataTransfer.getData('application/reactflow');
    if (!dataString) return;
    const data = JSON.parse(dataString);
    if (!data?.type) return;
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    };
    let initialData = { takeSnapshot };
    if (data.type === 'dbNode') {
      initialData = { ...initialData, tableName: "", fields: [], timestamps: false };
    } else if (data.type === 'apiNode') {
      initialData = { ...initialData, method: data.method, route: "" };
    } else if (data.type === 'tableRefNode') {
      initialData = { ...initialData, id: data.schema.id, tableName: data.schema.tableName, fields: data.schema.fields, timestamps: data.schema.timestamps };
    }
    const newNode = {
      id: `${Date.now()}`,
      type: data.type,
      position,
      data: initialData
    };
    setNodes((nds) => nds.concat(newNode));
    setIsDirty(true);
  }, [setNodes, takeSnapshot]);


  const onNodeDragStart = useCallback(() => {
    takeSnapshot();
    setIsDraggingNode(true);
  }, [takeSnapshot]);

  const onNodeDragStop = useCallback((event, node) => {
    setIsDraggingNode(false);

    if (trashCanRef.current) {
      const trashRect = trashCanRef.current.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      if (
        mouseX >= trashRect.left &&
        mouseX <= trashRect.right &&
        mouseY >= trashRect.top &&
        mouseY <= trashRect.bottom
      ) {
        deleteElements({ nodes: [{ id: node.id }] });
        setIsDirty(true);
        toast.success("Node deleted", { icon: <Trash2 size={14} />, style: { background: '#333', color: '#fff' } });
      }
    }
  }, [deleteElements]);

  const onEdgesDelete = useCallback((deletedEdges) => {
    takeSnapshot();
    setIsDirty(true);
    toast.success("Connection deleted", {
      icon: <Trash2 size={14} />,
      style: { background: '#333', color: '#fff' }
    });
  }, [takeSnapshot]);


  const handleAiGeneration = useCallback((aiData) => {
    if (!aiData || !aiData.tables) return;
    takeSnapshot(); // Save history state before doing anything

    const generatedNodes = [];
    const generatedEdges = [];
    const generatedSchemas = [];
    const tableIdMap = {};

    // 1. Process Database Tables & Layout them in a vertical column
    aiData.tables.forEach((table, index) => {
      const tableId = `ai_db_${Date.now()}_${index}`;
      tableIdMap[table.tableName] = tableId;

      generatedNodes.push({
        id: tableId,
        type: 'tableRefNode',
        position: { x: 150, y: 150 + (index * 120) },
        className: 'animate-in zoom-in duration-300',
        data: {
          id: tableId,
          tableName: table.tableName,
          fields: table.fields || [],
          timestamps: table.timestamps || false,
        }
      });

      generatedSchemas.push({
        id: tableId,
        tableName: table.tableName,
        fields: table.fields || [],
        timestamps: table.timestamps || false,
      });
    });

    // 2. Process API Endpoints & Position them next to their connected tables
    let unlinkedIndex = 0;
    aiData.endpoints.forEach((endpoint, index) => {
      const endpointId = `ai_api_${Date.now()}_${index}`;
      const targetTableId = tableIdMap[endpoint.connectedTableName];

      let xPos = 500;
      let yPos = 150;

      if (targetTableId) {
        const parentNode = generatedNodes.find(n => n.id === targetTableId);
        const existingApiEdges = generatedEdges.filter(e => e.source === targetTableId).length;
        yPos = parentNode.position.y + (existingApiEdges * 60);

        const connectedTable = aiData.tables.find(t => t.tableName === endpoint.connectedTableName);
        let validSelectedFields = endpoint.selectedFields && endpoint.selectedFields.length > 0
          ? endpoint.selectedFields
          : (connectedTable?.fields.map(f => f.name) || []);

        generatedEdges.push({
          id: `e${targetTableId}-${endpointId}`,
          source: targetTableId,
          sourceHandle: 'table-source',
          target: endpointId,
          targetHandle: 'route-target',
          animated: false,
          style: { stroke: '#10b981', strokeWidth: 2 },
          data: { selectedFields: validSelectedFields }
        });
      } else {
        yPos = 150 + (unlinkedIndex * 60);
        unlinkedIndex++;
      }

      generatedNodes.push({
        id: endpointId,
        type: 'apiNode',
        position: { x: xPos, y: yPos },
        className: 'animate-in zoom-in duration-300', // <-- ADDED: Tailwind pop-in animation
        data: {
          method: endpoint.method,
          route: endpoint.route,
        }
      });
    });

    // 3. Process Relational Database Links (Foreign Keys)
    aiData.tables.forEach((table) => {
      if (!table.fields) return;
      table.fields.forEach((field) => {
        if (field.targetTable && tableIdMap[field.targetTable]) {
          const sourceId = tableIdMap[table.tableName];
          const targetId = tableIdMap[field.targetTable];

          generatedEdges.push({
            id: `e${sourceId}-${targetId}`,
            source: sourceId,
            sourceHandle: 'table-source',
            target: targetId,
            targetHandle: 'table-target',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 }
          });
        }
      });
    });

    // --- STAGGERED ANIMATION REVEAL LOGIC ---

    // Save schemas to context immediately
    setSavedSchemas((prev) => [...prev, ...generatedSchemas]);

    let currentDelay = 0;
    const delayStep = 250; // Milliseconds between each element appearing

    // Step A: Reveal Database Nodes one by one
    const dbNodes = generatedNodes.filter(n => n.type === 'tableRefNode');
    dbNodes.forEach((node) => {
      setTimeout(() => {
        setNodes((nds) => [...nds, node]);
      }, currentDelay);
      currentDelay += delayStep;
    });

    // Step B: Reveal Database-to-Database Relationships
    const dbEdges = generatedEdges.filter(e => e.animated === true);
    if (dbEdges.length > 0) {
      setTimeout(() => {
        setEdges((eds) => [...eds, ...dbEdges]);
      }, currentDelay);
      currentDelay += delayStep;
    }

    // Step C: Reveal API Nodes and their connection lines simultaneously
    const apiNodes = generatedNodes.filter(n => n.type === 'apiNode');
    apiNodes.forEach((node) => {
      const relatedEdge = generatedEdges.find(e => e.target === node.id);
      setTimeout(() => {
        setNodes((nds) => [...nds, node]);
        if (relatedEdge) {
          setEdges((eds) => [...eds, relatedEdge]);
        }
      }, currentDelay);
      currentDelay += delayStep;
    });

    setTimeout(() => {
      setIsDirty(true);
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 1200 });
      }, 100);
      toast.success("AI Generation Complete!", {
        style: { background: '#333', color: '#fff', border: '1px solid #a855f7' }
      });
    }, currentDelay + 200);

  }, [setNodes, setEdges, setSavedSchemas, takeSnapshot]);


  return (
    <div className="h-screen w-screen bg-[#1B1B1B] relative overflow-hidden">
      <Toaster position="top-center" />

      {apiModalConfig.isOpen && (
        <FieldSelectionModal
          isOpen={apiModalConfig.isOpen}
          onClose={() => setApiModalConfig({ ...apiModalConfig, isOpen: false })}
          onSave={onApiModalSave}
          schema={apiModalConfig.schema}
          apiMethod={apiModalConfig.apiMethod}
        />
      )}

      {relationModalConfig.isOpen && (
        <RelationConnectionModal
          isOpen={relationModalConfig.isOpen}
          onClose={() => setRelationModalConfig({ ...relationModalConfig, isOpen: false })}
          onSave={onRelationModalSave}
          sourceSchema={relationModalConfig.sourceNode.data}
          targetSchema={relationModalConfig.targetNode.data}
        />
      )}

      <div className="absolute top-0 left-0 h-full z-50 flex items-center pointer-events-none">
        <div className="pointer-events-auto">
          <LeftSidebar activePanel={activePanel} setActivePanel={setActivePanel} />
        </div>
        <div className="pointer-events-auto ml-2">
          {activePanel && <FlyoutPanel activePanel={activePanel} />}
        </div>
      </div>

      <div className="w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeWrapped}
          onEdgesChange={onEdgesChangeWrapped}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgesDelete={onEdgesDelete}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={60} className='bg-[#1B1B1B]' />
          <Panel position="top-right">
            <div className="flex gap-3 m-4">
              <button onClick={onDeleteProject} className="flex items-center gap-2 px-4 py-2 border-2 border-red-900 text-gray-300 rounded-lg hover:bg-red-900 transition-colors shadow-md font-medium text-sm cursor-pointer">
                <Trash2 size={16} />
                Delete Project
              </button>


              <button onClick={onSave} disabled={isSaving || !isDirty}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md font-medium text-sm relative
                    ${isDirty
                    ? "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed opacity-75"
                  }
                `}
              >
                {isDirty && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1B1B1B]" />}

                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {isSaving ? 'Saving...' : (isDirty ? 'Save Flow' : 'Saved')}
              </button>
            </div>
          </Panel>
          <CustomControls onUndo={undo} onRedo={redo} />
          <PromptArea projectId={projectId} onSuccess={handleAiGeneration}></PromptArea>
        </ReactFlow>
        <div ref={trashCanRef} className={`absolute bottom-8 right-8 z-50 transition-all duration-300 ease-in-out transform ${isDraggingNode ? "translate-y-0 opacity-100 scale-110" : "translate-y-20 opacity-0 scale-90 pointer-events-none"}`}>
          <div className="w-16 h-16 bg-red-900/20 backdrop-blur-sm border-2 border-red-900 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <Trash2 size={25} className="text-red-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Workspace() {
  return (
    <ReactFlowProvider>
      <SchemaProvider>
        <WorkspaceContent />
      </SchemaProvider>
    </ReactFlowProvider>
  );
}

export default Workspace;