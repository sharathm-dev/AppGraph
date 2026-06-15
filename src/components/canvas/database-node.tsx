import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ServiceNodeData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { NodeIcon } from "./node-icon";

const statusConfig = {
  healthy: { label: "Success", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: "✓" },
  degraded: { label: "Warning", className: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: "⚠" },
  down: { label: "Error", className: "bg-red-500/20 text-red-400 border-red-500/30", icon: "△" },
} as const;



function DatabaseNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ServiceNodeData;
  const status = statusConfig[nodeData.status];

  const sliderPercent = Math.min(100, Math.max(0, (nodeData.sliderValue / 100) * 100));

  return (
    <div
      className={`database-node-card relative rounded-xl border border-[oklch(0.3_0.005_270)] bg-[oklch(0.14_0.005_270)] p-3 min-w-[320px] max-w-[340px] shadow-xl transition-all duration-200 ${
        selected ? "ring-2 ring-purple-500/40" : ""
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-cyan-500 !w-2 !h-2 !border-0" />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center">
            <NodeIcon label={nodeData.label} type={nodeData.type} className="w-5 h-5" />
          </span>
          <span className="text-sm font-semibold text-white">{nodeData.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30 px-2 py-0.5 font-mono">
            {nodeData.cost}
          </Badge>
          <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Settings">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Metrics section */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {[
          { tab: "CPU", icon: "🖥", value: nodeData.cpu.toFixed(2) },
          { tab: "Memory", icon: "📊", value: nodeData.memory },
          { tab: "Disk", icon: "💾", value: nodeData.disk },
          { tab: "Region", icon: "🌐", value: nodeData.region }
        ].map((item, i) => (
          <div key={item.tab} className="flex flex-col gap-1 overflow-hidden">
            <span className="text-[11px] text-muted-foreground font-mono px-1 truncate">{item.value}</span>
            <button
              className={`flex items-center gap-1 px-1.5 py-1.5 rounded-md text-[10px] font-medium transition-colors ${
                i === 0
                  ? "bg-[oklch(0.25_0.01_270)] text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-[oklch(0.20_0.01_270)]"
              }`}
            >
              <span className="text-[10px] shrink-0">{item.icon}</span>
              <span className="truncate">{item.tab}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Gradient slider */}
      <div className="relative mb-2">
        <div className="gradient-slider w-full relative rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ width: `${sliderPercent}%` }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[oklch(0.3_0.005_270)] shadow-md cursor-pointer"
          style={{ left: `calc(${sliderPercent}% - 6px)` }}
        />
      </div>

      {/* Value display */}
      <div className="flex justify-end mb-2">
        <span className="text-xs text-muted-foreground font-mono">{nodeData.sliderValue.toFixed(2)}</span>
      </div>

      {/* Footer: status + provider */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${status.className}`}>
          <span className="mr-1">{status.icon}</span>
          {status.label}
        </Badge>
        <div className="flex items-center gap-1 text-[10px] font-bold">
          <span className="text-orange-400">aws</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-cyan-500 !w-2 !h-2 !border-0" />
    </div>
  );
}

export const DatabaseNode = memo(DatabaseNodeComponent);
