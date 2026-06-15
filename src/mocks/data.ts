import type { AppInfo, ServiceNodeData, AppGraph } from "@/types";
import type { Edge, Node } from "@xyflow/react";

export const mockApps: AppInfo[] = [
  { id: "app-1", name: "E-Commerce Platform", icon: "🛍️" },
  { id: "app-2", name: "Payment Gateway", icon: "💳" },
  { id: "app-3", name: "User Authentication", icon: "🔒" },
  { id: "app-4", name: "Inventory Management", icon: "📦" },
  { id: "app-5", name: "Analytics Dashboard", icon: "📈" },
];

const createServiceNode = (
  id: string,
  label: string,
  position: { x: number; y: number },
  status: ServiceNodeData["status"],
  opts: Partial<ServiceNodeData> = {}
): Node<ServiceNodeData> => ({
  id,
  type: "service",
  position,
  data: {
    label,
    type: "service",
    status,
    cpu: 0.02,
    memory: "0.05 GB",
    disk: "10.00 GB",
    region: "1",
    cost: "$0.03/HR",
    provider: "aws",
    sliderValue: 2,
    description: "",
    ...opts,
  },
});

const createDatabaseNode = (
  id: string,
  label: string,
  position: { x: number; y: number },
  status: ServiceNodeData["status"],
  opts: Partial<ServiceNodeData> = {}
): Node<ServiceNodeData> => ({
  id,
  type: "database",
  position,
  data: {
    label,
    type: "database",
    status,
    cpu: 0.02,
    memory: "0.05 GB",
    disk: "10.00 GB",
    region: "1",
    cost: "$0.03/HR",
    provider: "aws",
    sliderValue: 2,
    description: "",
    ...opts,
  },
});

const graphsMap: Record<string, AppGraph> = {
  "app-1": {
    nodes: [
      createServiceNode("n1", "API Gateway", { x: 50, y: 50 }, "healthy", {
        cpu: 0.05,
        memory: "0.12 GB",
        sliderValue: 45,
      }),
      createDatabaseNode("n2", "Postgres", { x: 450, y: 30 }, "healthy", {
        cpu: 0.02,
        memory: "0.05 GB",
        sliderValue: 20,
      }),
      createServiceNode("n3", "Redis", { x: 50, y: 350 }, "down", {
        cpu: 0.02,
        memory: "0.05 GB",
        sliderValue: 78,
      }),
      createDatabaseNode("n4", "Mongodb", { x: 450, y: 320 }, "degraded", {
        cpu: 0.02,
        memory: "0.05 GB",
        sliderValue: 12,
      }),
    ] as Node<ServiceNodeData>[],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e1-3", source: "n1", target: "n3", animated: true },
      { id: "e3-4", source: "n3", target: "n4", animated: true },
    ] as Edge[],
  },
  "app-2": {
    nodes: [
      createServiceNode("n1", "Auth Service", { x: 100, y: 50 }, "healthy", {
        sliderValue: 35,
      }),
      createServiceNode("n2", "User Service", { x: 450, y: 50 }, "healthy", {
        sliderValue: 60,
      }),
      createDatabaseNode("n3", "MySQL", { x: 280, y: 350 }, "healthy", {
        sliderValue: 15,
      }),
    ] as Node<ServiceNodeData>[],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e1-3", source: "n1", target: "n3", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
    ] as Edge[],
  },
  "app-3": {
    nodes: [
      createServiceNode("n1", "Gateway", { x: 250, y: 20 }, "degraded", {
        sliderValue: 88,
      }),
      createServiceNode("n2", "Worker", { x: 50, y: 300 }, "healthy", {
        sliderValue: 42,
      }),
      createDatabaseNode("n3", "Redis Cache", { x: 450, y: 300 }, "healthy", {
        sliderValue: 5,
      }),
    ] as Node<ServiceNodeData>[],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e1-3", source: "n1", target: "n3", animated: true },
    ] as Edge[],
  },
  "app-4": {
    nodes: [
      createServiceNode("n1", "API Server", { x: 50, y: 100 }, "healthy", {
        sliderValue: 25,
      }),
      createServiceNode("n2", "Job Runner", { x: 450, y: 100 }, "down", {
        sliderValue: 95,
      }),
      createDatabaseNode("n3", "PostgreSQL", { x: 250, y: 380 }, "healthy", {
        sliderValue: 10,
      }),
    ] as Node<ServiceNodeData>[],
    edges: [
      { id: "e1-3", source: "n1", target: "n3", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
    ] as Edge[],
  },
  "app-5": {
    nodes: [
      createServiceNode("n1", "gRPC Server", { x: 50, y: 50 }, "healthy", {
        sliderValue: 55,
      }),
      createServiceNode("n2", "Proxy", { x: 450, y: 50 }, "degraded", {
        sliderValue: 70,
      }),
      createDatabaseNode("n3", "Cassandra", { x: 250, y: 350 }, "healthy", {
        sliderValue: 30,
      }),
    ] as Node<ServiceNodeData>[],
    edges: [
      { id: "e1-2", source: "n1", target: "n2", animated: true },
      { id: "e2-3", source: "n2", target: "n3", animated: true },
    ] as Edge[],
  },
};

export function getMockApps(): AppInfo[] {
  return mockApps;
}

export function getMockGraph(appId: string): AppGraph | null {
  return graphsMap[appId] ?? null;
}
