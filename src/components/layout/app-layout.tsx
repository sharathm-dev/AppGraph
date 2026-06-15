import { useCallback, useMemo, useState, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { TopBar } from "./top-bar";
import { LeftRail } from "./left-rail";
import { RightPanel } from "./right-panel";
import { GraphCanvas } from "@/components/canvas/graph-canvas";
import { useAppStore } from "@/store/app-store";
import { useApps } from "@/hooks/use-apps";
import { useGraph } from "@/hooks/use-graph";
import type { ServiceNodeData } from "@/types";
import type { Node } from "@xyflow/react";

export function AppLayout() {
  const selectedAppId = useAppStore((s) => s.selectedAppId);
  const setSelectedAppId = useAppStore((s) => s.setSelectedAppId);
  const { data: apps } = useApps();
  const { data: graphData, isLoading: isGraphLoading, isError, refetch } = useGraph(selectedAppId);

  // Track nodes state for right panel
  const [currentNodes, setCurrentNodes] = useState<Node<ServiceNodeData>[]>([]);

  useEffect(() => {
    if (graphData) {
      setCurrentNodes(graphData.nodes as Node<ServiceNodeData>[]);
    }
  }, [graphData]);

  // Listen for node updates from GraphCanvas
  useEffect(() => {
    const originalUpdate = window.__graphUpdateNodeData;
    const interval = setInterval(() => {
      if (window.__selectedNodeData || graphData) {
        // Re-read nodes from DOM indirectly - we'll handle this via the canvas
      }
    }, 500);
    return () => {
      clearInterval(interval);
      if (originalUpdate) {
        window.__graphUpdateNodeData = originalUpdate;
      }
    };
  }, [graphData]);

  // Auto-select first app
  useEffect(() => {
    if (apps && apps.length > 0 && !selectedAppId) {
      setSelectedAppId(apps[0].id);
    }
  }, [apps, selectedAppId, setSelectedAppId]);

  const selectedAppName = useMemo(() => {
    if (!selectedAppId || !apps) return null;
    return apps.find((a) => a.id === selectedAppId)?.name ?? null;
  }, [selectedAppId, apps]);

  const handleAddNode = useCallback(() => {
    const newNode: Node<ServiceNodeData> = {
      id: `n-${Date.now()}`,
      type: "service",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: "New Service",
        type: "service",
        status: "healthy",
        cpu: 0.01,
        memory: "0.02 GB",
        disk: "5.00 GB",
        region: "1",
        cost: "$0.01/HR",
        provider: "aws",
        sliderValue: 50,
        description: "",
      },
    };
    // We need to add to graph via the canvas's internal state
    // Use the window bridge pattern
    window.__graphUpdateNodeData?.("__ADD_NODE__", newNode.data);
    // Actually, let's dispatch to the canvas differently
    window.dispatchEvent(
      new CustomEvent("addNode", { detail: newNode })
    );
  }, []);

  // Keyboard shortcut for fit view
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        // fitView is handled by ReactFlow instance inside TopBar
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <TopBar appName={selectedAppName} onAddNode={handleAddNode} />

        <div className="flex flex-1 min-h-0">
          <LeftRail />

          {/* Canvas area */}
          <main className="flex-1 relative min-w-0" id="canvas-area">
            {isError ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                    <span className="text-red-400 text-xl">!</span>
                  </div>
                  <p className="text-sm text-red-400">Failed to load graph</p>
                  <button
                    onClick={() => void refetch()}
                    className="text-xs text-purple-400 hover:text-purple-300 underline"
                    id="retry-graph-btn"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : (
              <GraphCanvas
                graphData={graphData}
                isLoading={isGraphLoading}
              />
            )}
          </main>

          <RightPanel nodes={currentNodes} />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
