import { BuildingModel } from '../store/modelStore';
import { Link } from 'react-router-dom';

interface ModelCardProps {
  model: BuildingModel;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export default function ModelCard({ model, onDelete, onDuplicate }: ModelCardProps) {
  const totalHeight = model.parameters.floors * model.parameters.floorHeight;
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Preview area */}
      <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center" style={{ backgroundColor: model.parameters.color }}>
            <svg className="w-8 h-8 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-xs text-slate-500 mt-2">{model.parameters.floors}F • {model.parameters.width}×{model.parameters.depth}m</p>
        </div>
        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-slate-800 text-white rounded-full">
          {model.buildingType}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 truncate">{model.name}</h3>
        <p className="text-sm text-slate-500 mt-1">
          {model.parameters.floors} floors • {totalHeight.toFixed(1)}m tall • {model.parameters.roofType} roof
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Created: {new Date(model.createdAt).toLocaleDateString()}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <Link
            to={`/models/${model.id}`}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View 3D
          </Link>
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(model.id)}
              className="px-3 py-1.5 text-xs font-medium border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 transition"
            >
              Duplicate
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(model.id)}
              className="px-3 py-1.5 text-xs font-medium border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
