import { useParams, useNavigate } from 'react-router-dom';
import { useState, Suspense } from 'react';
import { useModelStore } from '../store/modelStore';
import { useAuthStore } from '../store/authStore';
import Scene from '../components/three/Scene';
import ViewerControls from '../components/ViewerControls';
import BuildingForm from '../components/BuildingForm';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';

export default function ModelDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { models, currentModel, loadModel, currentParams, setCurrentParams, updateModel, deleteModel } = useModelStore();
  const [notification, setNotification] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load model if not already loaded
  if (id && (!currentModel || currentModel.id !== id)) {
    loadModel(id);
  }

  const model = models.find((m) => m.id === id);
  
  if (!model) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Model Not Found</h2>
        <p className="text-slate-500 mb-6">The model you're looking for doesn't exist or has been deleted.</p>
        <button onClick={() => navigate('/models')} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          Back to Models
        </button>
      </div>
    );
  }

  const handleUpdate = () => {
    updateModel(model.id, { parameters: { ...currentParams } });
    setIsEditing(false);
    setNotification('Model updated successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      deleteModel(model.id);
      navigate('/models');
    }
  };

  const handleExport = async (format: 'gltf' | 'glb') => {
    setIsExporting(true);
    try {
      const exporter = new GLTFExporter();
      const scene = new THREE.Scene();
      const { floors, width, depth, floorHeight, wallThickness, color } = currentParams;
      const totalHeight = floors * floorHeight;
      const material = new THREE.MeshStandardMaterial({ color });

      // Foundation
      const foundation = new THREE.Mesh(new THREE.BoxGeometry(width + 0.6, 0.3, depth + 0.6), new THREE.MeshStandardMaterial({ color: '#666666' }));
      foundation.position.y = -0.15;
      scene.add(foundation);

      // Walls
      const walls = [
        { geo: [width, totalHeight, wallThickness], pos: [0, totalHeight / 2, depth / 2] },
        { geo: [width, totalHeight, wallThickness], pos: [0, totalHeight / 2, -depth / 2] },
        { geo: [wallThickness, totalHeight, depth], pos: [-width / 2, totalHeight / 2, 0] },
        { geo: [wallThickness, totalHeight, depth], pos: [width / 2, totalHeight / 2, 0] },
      ];
      walls.forEach((w) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...(w.geo as [number, number, number])), material.clone());
        mesh.position.set(...(w.pos as [number, number, number]));
        mesh.castShadow = true;
        scene.add(mesh);
      });

      // Floor slabs
      for (let i = 0; i <= floors; i++) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, depth), new THREE.MeshStandardMaterial({ color: '#999999' }));
        slab.position.y = i * floorHeight;
        scene.add(slab);
      }

      const options = format === 'glb' ? { binary: true } : { binary: false };
      exporter.parse(scene, (result) => {
        const output = format === 'glb'
          ? new Blob([result as ArrayBuffer], { type: 'application/octet-stream' })
          : new Blob([JSON.stringify(result)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(output);
        link.download = `${model.name}.${format === 'glb' ? 'glb' : 'gltf'}`;
        link.click();
        URL.revokeObjectURL(link.href);
        setNotification(`Exported as ${format.toUpperCase()}!`);
        setTimeout(() => setNotification(''), 3000);
        setIsExporting(false);
      }, (error) => {
        console.error(error);
        setIsExporting(false);
      }, options);
    } catch (err) {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 bg-white border-r border-slate-200 overflow-y-auto p-4 lg:p-6 order-2 lg:order-1">
        {/* Model Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 truncate">{model.name}</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
              {model.buildingType}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Created: {new Date(model.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Parameters */}
        {isEditing ? (
          <BuildingForm />
        ) : (
          <div className="space-y-2 mb-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Parameters</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <span className="text-slate-500">Floors</span>
                <p className="font-semibold text-slate-800">{model.parameters.floors}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <span className="text-slate-500">Width</span>
                <p className="font-semibold text-slate-800">{model.parameters.width}m</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <span className="text-slate-500">Depth</span>
                <p className="font-semibold text-slate-800">{model.parameters.depth}m</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <span className="text-slate-500">Height</span>
                <p className="font-semibold text-slate-800">{(model.parameters.floors * model.parameters.floorHeight).toFixed(1)}m</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <span className="text-slate-500">Roof</span>
                <p className="font-semibold text-slate-800 capitalize">{model.parameters.roofType}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <span className="text-slate-500">Material</span>
                <p className="font-semibold text-slate-800 capitalize">{model.parameters.material}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-slate-200">
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setIsEditing(false)} className="py-2 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleUpdate} className="py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          ) : (
            <button onClick={() => { setCurrentParams(model.parameters); setIsEditing(true); }} className="w-full py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 transition">
              ✏️ Edit Parameters
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleExport('gltf')} disabled={isExporting} className="py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 transition disabled:opacity-50">
              📦 GLTF
            </button>
            <button onClick={() => handleExport('glb')} disabled={isExporting} className="py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 transition disabled:opacity-50">
              📦 GLB
            </button>
          </div>
          <button onClick={handleDelete} className="w-full py-2 text-sm font-medium border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
            🗑️ Delete Model
          </button>
          <button onClick={() => navigate('/models')} className="w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition">
            ← Back to Models
          </button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 relative order-1 lg:order-2 h-[50vh] lg:h-full">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        }>
          <Scene parameters={isEditing ? currentParams : model.parameters} />
        </Suspense>
        <div className="absolute top-4 left-4">
          <ViewerControls />
        </div>
        {notification && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}
