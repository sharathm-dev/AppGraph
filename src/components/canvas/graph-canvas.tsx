import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type NodeTypes,
  addEdge,
  useReactFlow,
  type Edge,
  type Node,
  MiniMap,
  useStore,
  type MiniMapNodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ServiceNode } from "./service-node";
import { DatabaseNode } from "./database-node";
import { useAppStore } from "@/store/app-store";
import type { AppGraph, ServiceNodeData } from "@/types";

const nodeTypes: NodeTypes = {
  service: ServiceNode,
  database: DatabaseNode,
};

const CustomMiniMapNode = memo(({ id, x, y, width, height, selected }: MiniMapNodeProps) => {
  const node = useStore((s) => {
    if (s.nodeLookup instanceof Map) return s.nodeLookup.get(id);
    if (s.nodeLookup) return (s.nodeLookup as any)[id];
    return s.nodes.find((n) => n.id === id);
  });
  
  if (!node) return null;
  const data = node.data as ServiceNodeData;
  const isDB = node.type === "database";
  
  const statusColor = data.status === "healthy" ? "#34d399" : data.status === "down" ? "#f87171" : "#fbbf24";
  const statusBg = data.status === "healthy" ? "rgba(16, 185, 129, 0.2)" : data.status === "down" ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)";
  const statusLabel = data.status === "healthy" ? "Success" : data.status === "down" ? "Error" : "Warning";
  
  const sliderPercent = Math.min(100, Math.max(0, ((data.sliderValue || 0) / 100) * 100));

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Node Background */}
      <rect 
        width={width} 
        height={height} 
        rx={12} 
        fill="oklch(0.14 0.005 270)"
        stroke={selected ? "rgba(168, 85, 247, 0.4)" : "oklch(0.3 0.005 270)"}
        strokeWidth={selected ? 4 : 1}
      />
      
      {/* Top Handle */}
      <rect x={width / 2 - 8} y={-4} width={16} height={8} rx={4} fill="#06b6d4" />
      
      {/* Header */}
      <text x={12} y={28} fontSize={16}>{isDB ? "🛢️" : "⚡"}</text>
      <text x={38} y={26} fill="white" fontSize={14} fontWeight="600" fontFamily="sans-serif">
        {data.label}
      </text>
      {data.cost && (
        <g transform={`translate(${width - 65}, 12)`}>
          <rect width={50} height={18} rx={4} fill="#10b981" fillOpacity={0.15} />
          <text x={25} y={13} fill="#34d399" fontSize={10} textAnchor="middle" fontFamily="monospace">
            {data.cost}
          </text>
        </g>
      )}

      {/* Metrics Row 1: Values */}
      <g transform="translate(12, 55)">
        <text x={0} y={0} fill="#9ca3af" fontSize={11} fontFamily="monospace">{data.cpu?.toFixed(2)}</text>
        <text x={width * 0.22} y={0} fill="#9ca3af" fontSize={11} fontFamily="monospace">{data.memory}</text>
        <text x={width * 0.44} y={0} fill="#9ca3af" fontSize={11} fontFamily="monospace">{data.disk}</text>
        <text x={width * 0.66} y={0} fill="#9ca3af" fontSize={11} fontFamily="monospace">{data.region}</text>
      </g>

      {/* Metrics Row 2: Labels with dark background for the first one */}
      <g transform="translate(12, 65)">
        <rect x={-4} y={0} width={45} height={20} rx={4} fill="oklch(0.25 0.01 270)" />
        <text x={18} y={14} fill="white" fontSize={10} textAnchor="middle">🖥 CPU</text>
        
        <text x={width * 0.22} y={14} fill="#9ca3af" fontSize={10}>📊 Mem</text>
        <text x={width * 0.44} y={14} fill="#9ca3af" fontSize={10}>💾 Disk</text>
        <text x={width * 0.66} y={14} fill="#9ca3af" fontSize={10}>🌐 Reg</text>
      </g>

      {/* Slider Track */}
      <g transform={`translate(12, 105)`}>
        <rect width={width - 24} height={6} rx={3} fill="rgba(255,255,255,0.1)" />
        {/* Slider Fill (Gradient simulation) */}
        <rect width={Math.max(6, (width - 24) * (sliderPercent / 100))} height={6} rx={3} fill="url(#sliderGradient)" />
        {/* Slider Thumb */}
        <circle cx={Math.max(6, (width - 24) * (sliderPercent / 100))} cy={3} r={4} fill="white" stroke="oklch(0.3 0.005 270)" strokeWidth={1} />
        {/* Value Text */}
        <text x={width - 24} y={22} fill="#9ca3af" fontSize={10} textAnchor="end" fontFamily="monospace">
          {data.sliderValue?.toFixed(2)}
        </text>
      </g>

      {/* Footer */}
      <g transform={`translate(12, ${height - 24})`}>
        <rect width={65} height={16} rx={4} fill={statusBg} stroke={statusBg} strokeWidth={1} />
        <text x={32} y={11} fill={statusColor} fontSize={9} fontWeight="bold" textAnchor="middle">
          {data.status === 'healthy' ? '✓ ' : data.status === 'down' ? '△ ' : '⚠ '}
          {statusLabel}
        </text>
      </g>
      
      <text x={width - 12} y={height - 13} fill="#fb923c" fontSize={10} fontWeight="bold" textAnchor="end">
        {data.provider?.toUpperCase() || "AWS"}
      </text>

      {/* Bottom Handle */}
      <rect x={width / 2 - 8} y={height - 4} width={16} height={8} rx={4} fill="#06b6d4" />
      
      <defs>
        <linearGradient id="sliderGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </g>
  );
});

interface GraphCanvasProps {
  graphData: AppGraph | undefined;
  isLoading: boolean;
}

export function GraphCanvas({ graphData, isLoading }: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const hasFitted = useRef(false);

  // Context menu state
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);

  // Sync graph data from API
  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
      hasFitted.current = false;
    }
  }, [graphData, setNodes, setEdges]);

  // Fit view after nodes are rendered
  useEffect(() => {
    if (nodes.length > 0 && !hasFitted.current) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.3, duration: 400 });
        hasFitted.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [nodes, fitView]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setMenu(null);
  }, [setSelectedNodeId]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setSelectedNodeId(node.id);
      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
      });
    },
    [setSelectedNodeId]
  );

  const duplicateNode = useCallback(() => {
    if (!menu) return;
    const nodeToDuplicate = nodes.find((n) => n.id === menu.id);
    if (nodeToDuplicate) {
      const newNode = {
        ...nodeToDuplicate,
        id: `n-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
        data: { ...nodeToDuplicate.data },
        selected: true,
      };
      setNodes((nds) => nds.map((n) => ({ ...n, selected: false })).concat(newNode));
      setSelectedNodeId(newNode.id);
    }
    setMenu(null);
  }, [menu, nodes, setNodes, setSelectedNodeId]);

  const deleteNode = useCallback(() => {
    if (!menu) return;
    setNodes((nds) => nds.filter((n) => n.id !== menu.id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== menu.id && edge.target !== menu.id)
    );
    setSelectedNodeId(null);
    setMenu(null);
  }, [menu, setNodes, setEdges, setSelectedNodeId]);

  // Delete selected node on keypress
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        if (selectedNodeId) {
          setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
          setEdges((eds) =>
            eds.filter(
              (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
            )
          );
          setSelectedNodeId(null);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedNodeId, setNodes, setEdges, setSelectedNodeId]);

  const updateNodeData = useCallback(
    (nodeId: string, dataUpdate: Partial<ServiceNodeData>) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              ...(dataUpdate.type ? { type: dataUpdate.type } : {}),
              data: { ...n.data, ...dataUpdate },
            };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  // Store updateNodeData in a ref so inspector can access it
  useEffect(() => {
    window.__graphUpdateNodeData = updateNodeData;
    return () => {
      delete window.__graphUpdateNodeData;
    };
  }, [updateNodeData]);

  // Listen for addNode events
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<Node>;
      setNodes((nds) => [...nds, customEvent.detail]);
    };
    window.addEventListener("addNode", handler);
    return () => window.removeEventListener("addNode", handler);
  }, [setNodes]);

  // Get selected node data for inspector
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  useEffect(() => {
    if (selectedNode) {
      window.__selectedNodeData = selectedNode.data as ServiceNodeData;
    } else {
      window.__selectedNodeData = undefined;
    }
  }, [selectedNode]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading graph...</span>
        </div>
      </div>
    );
  }

  if (!graphData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Select an app to view its graph</p>
        </div>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onNodeContextMenu={onNodeContextMenu}
      onPaneClick={onPaneClick}
      onClick={() => setMenu(null)}
      nodeTypes={nodeTypes}
      fitView
      className="bg-transparent"
      minZoom={0.3}
      maxZoom={2}
      defaultEdgeOptions={{
        animated: true,
        style: { stroke: "oklch(0.45 0.08 270)", strokeWidth: 2 },
      }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1.5}
        color="oklch(0.3 0.005 270)"
      />
      <Controls showInteractive={false} />
      <MiniMap 
        nodeComponent={CustomMiniMapNode}
        maskColor="oklch(0.12 0.005 270 / 0.7)"
        style={{ backgroundColor: "oklch(0.14 0.005 270)", border: "1px solid oklch(0.2 0.005 270)" }}
      />
      
      {menu && (
        <div
          className="fixed z-50 bg-[oklch(0.16_0.005_270)] border border-border shadow-xl rounded-md overflow-hidden min-w-[150px] text-sm"
          style={{ top: menu.top, left: menu.left }}
        >
          <div className="flex flex-col py-1">
            <button
              onClick={duplicateNode}
              className="px-3 py-1.5 text-left text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Duplicate Node
            </button>
            <button
              onClick={deleteNode}
              className="px-3 py-1.5 text-left text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Delete Node
            </button>
          </div>
        </div>
      )}
    </ReactFlow>
  );
}
