import { create } from 'zustand';

interface ViewerState {
  showGrid: boolean;
  showWireframe: boolean;
  showShadows: boolean;
  cameraPosition: [number, number, number];
  
  toggleGrid: () => void;
  toggleWireframe: () => void;
  toggleShadows: () => void;
  resetCamera: () => void;
  setCameraPosition: (pos: [number, number, number]) => void;
}

export const useViewerStore = create<ViewerState>()((set) => ({
  showGrid: true,
  showWireframe: false,
  showShadows: true,
  cameraPosition: [20, 15, 20],

  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleWireframe: () => set((s) => ({ showWireframe: !s.showWireframe })),
  toggleShadows: () => set((s) => ({ showShadows: !s.showShadows })),
  resetCamera: () => set({ cameraPosition: [20, 15, 20] }),
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
}));
