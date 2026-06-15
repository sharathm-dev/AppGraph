import { useReactFlow } from "@xyflow/react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  appName: string | null;
  onAddNode: () => void;
}

export function TopBar({ appName, onAddNode }: TopBarProps) {
  const isMobilePanelOpen = useAppStore((s) => s.isMobilePanelOpen);
  const toggleMobilePanel = useAppStore((s) => s.toggleMobilePanel);

  let reactFlowInstance: ReturnType<typeof useReactFlow> | null = null;
  try {
    reactFlowInstance = useReactFlow();
  } catch {
    // Not inside ReactFlow provider
  }

  const handleFitView = () => {
    reactFlowInstance?.fitView({ padding: 0.3, duration: 400 });
  };

  return (
    <header className="h-12 border-b border-border bg-[oklch(0.12_0.005_270)] flex items-center justify-between px-4 shrink-0 z-20">
      {/* Left: brand */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
        </div>
        {appName && (
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-sm">⟡</span>
            <span className="text-sm font-medium text-foreground">{appName}</span>
            <span className="text-muted-foreground text-xs">▾</span>
            <span className="text-muted-foreground text-xs">⋯</span>
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFitView}
          className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
          title="Fit View (F)"
          id="fit-view-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddNode}
          className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
          title="Add Node"
          id="add-node-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
          title="Share"
          id="share-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
          title="Dark Mode"
          id="theme-btn"
        >
          🌙
        </Button>
        {/* Mobile panel toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobilePanel}
          className="md:hidden text-xs text-muted-foreground hover:text-foreground h-7 px-2"
          title="Toggle Panel"
          id="panel-toggle-btn"
        >
          {isMobilePanelOpen ? "✕" : "☰"}
        </Button>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold text-white ml-1">
          U
        </div>
      </div>
    </header>
  );
}
