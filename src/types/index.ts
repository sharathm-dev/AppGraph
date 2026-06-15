import type { Node, Edge } from "@xyflow/react";

export type AppStatus = "healthy" | "degraded" | "down";
export type NodeVariant = "service" | "database";
export type Provider = "aws" | "gcp" | "azure";
export type InspectorTab = "config" | "runtime";

export interface AppInfo {
  id: string;
  name: string;
  icon: string;
}

export interface ServiceNodeData {
  label: string;
  type: NodeVariant;
  status: AppStatus;
  cpu: number;
  memory: string;
  disk: string;
  region: string;
  cost: string;
  provider: Provider;
  sliderValue: number;
  description: string;
  [key: string]: unknown;
}

export type AppNode = Node<ServiceNodeData>;
export type AppEdge = Edge;

export interface AppGraph {
  nodes: AppNode[];
  edges: AppEdge[];
}
