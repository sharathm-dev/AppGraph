import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import type { ServiceNodeData, InspectorTab, NodeVariant, Provider } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NodeIcon } from "@/components/canvas/node-icon";

const statusConfig = {
  healthy: {
    label: "Healthy",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  degraded: {
    label: "Degraded",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  down: {
    label: "Down",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
} as const;

interface NodeInspectorProps {
  nodeData: ServiceNodeData | undefined;
  nodeId: string;
}

export function NodeInspector({ nodeData, nodeId }: NodeInspectorProps) {
  const activeTab = useAppStore((s) => s.activeInspectorTab);
  const setActiveTab = useAppStore((s) => s.setActiveInspectorTab);

  const [localName, setLocalName] = useState(nodeData?.label ?? "");
  const [localDescription, setLocalDescription] = useState(nodeData?.description ?? "");
  const [localSlider, setLocalSlider] = useState(nodeData?.sliderValue ?? 0);

  // Sync local state when node changes
  useEffect(() => {
    if (nodeData) {
      setLocalName(nodeData.label);
      setLocalDescription(nodeData.description ?? "");
      setLocalSlider(nodeData.sliderValue);
    }
  }, [nodeData, nodeId]);

  const updateNode = useCallback(
    (update: Partial<ServiceNodeData>) => {
      window.__graphUpdateNodeData?.(nodeId, update);
    },
    [nodeId]
  );

  const handleNameChange = (value: string) => {
    setLocalName(value);
    updateNode({ label: value });
  };

  const handleDescriptionChange = (value: string) => {
    setLocalDescription(value);
    updateNode({ description: value });
  };

  const handleSliderChange = (value: number) => {
    setLocalSlider(value);
    updateNode({ sliderValue: value });
  };

  const handleNumericInputChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setLocalSlider(num);
      updateNode({ sliderValue: num });
    }
  };

  if (!nodeData) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Select a node to inspect</p>
      </div>
    );
  }

  const status = statusConfig[nodeData.status];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Node Inspector</h3>
          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${status.className}`}>
            {status.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center justify-center">
            <NodeIcon label={nodeData.label} type={nodeData.type} className="w-4 h-4" />
          </span>
          <span className="capitalize">{nodeData.type}</span>
          <span>•</span>
          <span>{nodeData.provider.toUpperCase()}</span>
          <span>•</span>
          <span>{nodeData.cost}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as InspectorTab)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-9 px-3">
          <TabsTrigger
            value="config"
            className="text-xs data-[state=active]:bg-transparent data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-none h-full"
            id="tab-config"
          >
            Config
          </TabsTrigger>
          <TabsTrigger
            value="runtime"
            className="text-xs data-[state=active]:bg-transparent data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-none h-full"
            id="tab-runtime"
          >
            Runtime
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="flex-1 overflow-y-auto p-3 space-y-4 mt-0">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={localName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-8 text-sm bg-[oklch(0.16_0.005_270)] border-border"
              id="inspector-name"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={localDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Add a description..."
              className="text-sm bg-[oklch(0.16_0.005_270)] border-border resize-none min-h-[60px]"
              id="inspector-description"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select
              value={nodeData.type}
              onValueChange={(value) => {
                if (value) updateNode({ type: value as NodeVariant });
              }}
            >
              <SelectTrigger className="w-full bg-[oklch(0.16_0.005_270)] border-border h-8 text-sm capitalize" id="inspector-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="database">Database</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Provider */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Provider</Label>
            <Select
              value={nodeData.provider}
              onValueChange={(value) => {
                if (value) updateNode({ provider: value as Provider });
              }}
            >
              <SelectTrigger className="w-full bg-[oklch(0.16_0.005_270)] border-border h-8 text-sm" id="inspector-provider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="gcp">GCP</SelectItem>
                <SelectItem value="azure">Azure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="runtime" className="flex-1 overflow-y-auto p-3 space-y-4 mt-0">
          {/* Synced Slider + Numeric Input */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">Resource Allocation</Label>
            <div className="space-y-2">
              <Slider
                value={[localSlider]}
                onValueChange={(v) => {
                  const num = Array.isArray(v) ? v[0] : v;
                  handleSliderChange(num);
                }}
                max={100}
                min={0}
                step={1}
                className="w-full"
                id="inspector-slider"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={localSlider}
                  onChange={(e) => handleNumericInputChange(e.target.value)}
                  min={0}
                  max={100}
                  className="h-8 text-sm bg-[oklch(0.16_0.005_270)] border-border w-20"
                  id="inspector-numeric"
                />
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">Metrics</Label>
            <div className="grid grid-cols-2 gap-2">
              <MetricCard label="CPU" value={nodeData.cpu.toFixed(2)} unit="cores" />
              <MetricCard label="Memory" value={nodeData.memory} unit="" />
              <MetricCard label="Disk" value={nodeData.disk} unit="" />
              <MetricCard label="Region" value={nodeData.region} unit="" />
            </div>
          </div>

          {/* Cost */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Cost</Label>
            <div className="text-lg font-mono font-bold text-emerald-400">
              {nodeData.cost}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-[oklch(0.16_0.005_270)] border border-border rounded-lg p-2.5">
      <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-mono font-medium text-foreground">
        {value}
        {unit && <span className="text-muted-foreground text-[10px] ml-1">{unit}</span>}
      </p>
    </div>
  );
}
