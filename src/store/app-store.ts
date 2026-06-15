import { create } from "zustand";
import type { InspectorTab } from "@/types";

interface AppState {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
  setSelectedAppId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setMobilePanelOpen: (open: boolean) => void;
  toggleMobilePanel: () => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedAppId: null,
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: "config",

  setSelectedAppId: (id) =>
    set({ selectedAppId: id, selectedNodeId: null }),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),

  toggleMobilePanel: () =>
    set((state) => ({ isMobilePanelOpen: !state.isMobilePanelOpen })),

  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
}));
