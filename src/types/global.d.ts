import type { ServiceNodeData } from "@/types";

declare global {
  interface Window {
    __graphUpdateNodeData?: (nodeId: string, dataUpdate: Partial<ServiceNodeData>) => void;
    __selectedNodeData?: ServiceNodeData;
  }
}

export {};
