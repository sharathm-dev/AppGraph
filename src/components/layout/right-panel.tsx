import { useMemo } from "react";
import { useAppStore } from "@/store/app-store";
import { AppList } from "@/components/sidebar/app-list";
import { NodeInspector } from "@/components/inspector/node-inspector";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ServiceNodeData } from "@/types";
import type { Node } from "@xyflow/react";

interface RightPanelProps {
  nodes: Node<ServiceNodeData>[];
}

function PanelContent({ nodes }: RightPanelProps) {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return undefined;
    const node = nodes.find((n) => n.id === selectedNodeId);
    return node?.data as ServiceNodeData | undefined;
  }, [nodes, selectedNodeId]);

  return (
    <div className="flex flex-col h-full">
      {/* App selector section */}
      <div className="flex-shrink-0 max-h-[45%] overflow-y-auto">
        <AppList />
      </div>

      <Separator className="bg-border" />

      {/* Inspector section */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {selectedNodeId ? (
          <NodeInspector nodeData={selectedNodeData} nodeId={selectedNodeId} />
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <p className="text-xs text-muted-foreground text-center">
              Click a node on the canvas to inspect it
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function RightPanel({ nodes }: RightPanelProps) {
  const isMobilePanelOpen = useAppStore((s) => s.isMobilePanelOpen);
  const setMobilePanelOpen = useAppStore((s) => s.setMobilePanelOpen);

  return (
    <>
      {/* Desktop: fixed panel */}
      <aside
        className="hidden md:flex w-[300px] border-l border-border bg-[oklch(0.12_0.005_270)] flex-col shrink-0 overflow-hidden"
        id="right-panel-desktop"
      >
        <PanelContent nodes={nodes} />
      </aside>

      {/* Mobile: slide-over drawer */}
      <Sheet open={isMobilePanelOpen} onOpenChange={setMobilePanelOpen}>
        <SheetContent
          side="right"
          className="w-[320px] p-0 bg-[oklch(0.12_0.005_270)] border-l border-border"
          id="right-panel-mobile"
        >
          <SheetTitle className="sr-only">Application Panel</SheetTitle>
          <PanelContent nodes={nodes} />
        </SheetContent>
      </Sheet>
    </>
  );
}
