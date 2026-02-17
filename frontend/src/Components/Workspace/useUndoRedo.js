import { useState, useCallback, useEffect, useRef } from 'react';

export const useUndoRedo = ({ nodes, setNodes, edges, setEdges }) => {
    const [past, setPast] = useState([]);
    const [future, setFuture] = useState([]);
    const nodesRef = useRef(nodes);
    const edgesRef = useRef(edges);

    useEffect(() => {
        nodesRef.current = nodes;
        edgesRef.current = edges;
    }, [nodes, edges]);

    const takeSnapshot = useCallback(() => {
        setPast((oldPast) => {
            const newPast = [...oldPast, { nodes: nodesRef.current, edges: edgesRef.current }];
            return newPast.slice(-50); 
        });
        setFuture([]);
    }, []);
    const undo = useCallback(() => {
        setPast((oldPast) => {
            if (oldPast.length === 0) return oldPast;
            const previousState = oldPast[oldPast.length - 1];
            const newPast = oldPast.slice(0, oldPast.length - 1);
            setFuture((oldFuture) => [{ nodes: nodesRef.current, edges: edgesRef.current }, ...oldFuture]);
            setNodes(previousState.nodes);
            setEdges(previousState.edges);
            return newPast;
        });
    }, [setNodes, setEdges]);

    const redo = useCallback(() => {
        setFuture((oldFuture) => {
            if (oldFuture.length === 0) return oldFuture;
            const nextState = oldFuture[0];
            const newFuture = oldFuture.slice(1);
            setPast((oldPast) => [...oldPast, { nodes: nodesRef.current, edges: edgesRef.current }]);
            setNodes(nextState.nodes);
            setEdges(nextState.edges);
            return newFuture;
        });
    }, [setNodes, setEdges]);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
                event.preventDefault();
                undo();
            }
            if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
                event.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    return { undo, redo, takeSnapshot, canUndo: past.length > 0, canRedo: future.length > 0 };
};