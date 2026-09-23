import { useModelStore } from '../store/modelStore';
import { BUILDING_TYPES, ROOF_TYPES, MATERIALS, COLORS } from '../utils/constants';

export default function BuildingForm() {
  const { currentParams, setCurrentParams, resetParams } = useModelStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Building Parameters</h3>
        <button onClick={resetParams} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Reset
        </button>
      </div>

      {/* Building Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Building Type</label>
        <select
          value={BUILDING_TYPES[0]}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          disabled
        >
          {BUILDING_TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Floors */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Floors: <span className="text-blue-600 font-bold">{currentParams.floors}</span>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={currentParams.floors}
          onChange={(e) => setCurrentParams({ floors: parseInt(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Width */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Width: <span className="text-blue-600 font-bold">{currentParams.width}m</span>
        </label>
        <input
          type="range"
          min={4}
          max={40}
          step={0.5}
          value={currentParams.width}
          onChange={(e) => setCurrentParams({ width: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Depth */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Depth: <span className="text-blue-600 font-bold">{currentParams.depth}m</span>
        </label>
        <input
          type="range"
          min={4}
          max={30}
          step={0.5}
          value={currentParams.depth}
          onChange={(e) => setCurrentParams({ depth: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Floor Height */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Floor Height: <span className="text-blue-600 font-bold">{currentParams.floorHeight}m</span>
        </label>
        <input
          type="range"
          min={2.5}
          max={6}
          step={0.1}
          value={currentParams.floorHeight}
          onChange={(e) => setCurrentParams({ floorHeight: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Wall Thickness */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Wall Thickness: <span className="text-blue-600 font-bold">{currentParams.wallThickness}m</span>
        </label>
        <input
          type="range"
          min={0.1}
          max={0.8}
          step={0.05}
          value={currentParams.wallThickness}
          onChange={(e) => setCurrentParams({ wallThickness: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Rooms */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Rooms per Floor: <span className="text-blue-600 font-bold">{currentParams.rooms}</span>
        </label>
        <input
          type="range"
          min={1}
          max={12}
          value={currentParams.rooms}
          onChange={(e) => setCurrentParams({ rooms: parseInt(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Windows per Floor */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Windows per Floor: <span className="text-blue-600 font-bold">{currentParams.windowConfiguration.perFloor}</span>
        </label>
        <input
          type="range"
          min={1}
          max={8}
          value={currentParams.windowConfiguration.perFloor}
          onChange={(e) => setCurrentParams({
            windowConfiguration: { ...currentParams.windowConfiguration, perFloor: parseInt(e.target.value) }
          })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Doors */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Doors: <span className="text-blue-600 font-bold">{currentParams.doorConfiguration.count}</span>
        </label>
        <input
          type="range"
          min={1}
          max={4}
          value={currentParams.doorConfiguration.count}
          onChange={(e) => setCurrentParams({
            doorConfiguration: { ...currentParams.doorConfiguration, count: parseInt(e.target.value) }
          })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Roof Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Roof Type</label>
        <div className="grid grid-cols-2 gap-2">
          {ROOF_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setCurrentParams({ roofType: type })}
              className={`px-3 py-2 text-sm rounded-lg border transition font-medium ${
                currentParams.roofType === type
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
        <div className="grid grid-cols-3 gap-2">
          {MATERIALS.map((mat) => (
            <button
              key={mat}
              onClick={() => setCurrentParams({ material: mat })}
              className={`px-2 py-2 text-xs rounded-lg border transition font-medium ${
                currentParams.material === mat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
              }`}
            >
              {mat.charAt(0).toUpperCase() + mat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Building Color</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentParams({ color })}
              className={`w-8 h-8 rounded-full border-2 transition ${
                currentParams.color === color ? 'border-blue-600 scale-110' : 'border-slate-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
