import { useViewerStore } from '../store/viewerStore';

export default function ViewerControls() {
  const { showGrid, showWireframe, showShadows, toggleGrid, toggleWireframe, toggleShadows, resetCamera } = useViewerStore();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={toggleGrid}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
          showGrid ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
        }`}
      >
        Grid
      </button>
      <button
        onClick={toggleWireframe}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
          showWireframe ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
        }`}
      >
        Wireframe
      </button>
      <button
        onClick={toggleShadows}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
          showShadows ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
        }`}
      >
        Shadows
      </button>
      <button
        onClick={resetCamera}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:border-blue-400 transition"
      >
        Reset View
      </button>
    </div>
  );
}
