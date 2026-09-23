import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Scene from '../components/three/Scene';
import BuildingForm from '../components/BuildingForm';
import ViewerControls from '../components/ViewerControls';
import { useAuthStore } from '../store/authStore';
import { useModelStore } from '../store/modelStore';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';

export default function CreateModel() {
  const { user } = useAuthStore();
  const { currentParams, saveModel } = useModelStore();
  const navigate = useNavigate();
  const [modelName, setModelName] = useState('');
  const [buildingType, setBuildingType] = useState('residential');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState('');

  const handleSave = () => {
    if (!modelName.trim()) return;
    if (!user) return;
    
    const saved = saveModel(user.id, modelName.trim(), buildingType);
    setShowSaveModal(false);
    setNotification('Model saved successfully!');
    setTimeout(() => setNotification(''), 3000);
    navigate(`/models/${saved.id}`);
  };

  const handleExport = async (format: 'gltf' | 'glb') => {
    setIsExporting(true);
    try {
      const exporter = new GLTFExporter();
      
      // Create a temporary scene with the building
      const scene = new THREE.Scene();
      
      // Build a simple representation for export
      const { floors, width, depth, floorHeight, wallThickness, color } = currentParams;
      const totalHeight = floors * floorHeight;
      
      const material = new THREE.MeshStandardMaterial({ color });
      
      // Foundation
      const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.6, 0.3, depth + 0.6),
        new THREE.MeshStandardMaterial({ color: '#666666' })
      );
      foundation.position.y = -0.15;
      scene.add(foundation);
      
      // Walls
      const wallMat = material.clone();
      // Front
      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(width, totalHeight, wallThickness), wallMat);
      frontWall.position.set(0, totalHeight / 2, depth / 2);
      frontWall.castShadow = true;
      scene.add(frontWall);
      // Back
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(width, totalHeight, wallThickness), wallMat.clone());
      backWall.position.set(0, totalHeight / 2, -depth / 2);
      backWall.castShadow = true;
      scene.add(backWall);
      // Left
      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, totalHeight, depth), wallMat.clone());
      leftWall.position.set(-width / 2, totalHeight / 2, 0);
      leftWall.castShadow = true;
      scene.add(leftWall);
      // Right
      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, totalHeight, depth), wallMat.clone());
      rightWall.position.set(width / 2, totalHeight / 2, 0);
      rightWall.castShadow = true;
      scene.add(rightWall);
      
      // Floor slabs
      for (let i = 0; i <= floors; i++) {
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(width, 0.15, depth),
          new THREE.MeshStandardMaterial({ color: '#999999' })
        );
        slab.position.y = i * floorHeight;
        scene.add(slab);
      }

      const options = format === 'glb' ? { binary: true } : { binary: false };
      
      exporter.parse(
        scene,
        (result) => {
          const output = format === 'glb'
            ? new Blob([result as ArrayBuffer], { type: 'application/octet-stream' })
            : new Blob([JSON.stringify(result)], { type: 'application/json' });
          
          const link = document.createElement('a');
          link.href = URL.createObjectURL(output);
          link.download = `${modelName || 'building'}.${format === 'glb' ? 'glb' : 'gltf'}`;
          link.click();
          URL.revokeObjectURL(link.href);
          
          setNotification(`Exported as ${format.toUpperCase()} successfully!`);
          setTimeout(() => setNotification(''), 3000);
          setIsExporting(false);
        },
        (error) => {
          console.error('Export error:', error);
          setNotification('Export failed. Please try again.');
          setTimeout(() => setNotification(''), 3000);
          setIsExporting(false);
        },
        options
      );
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* Sidebar - Form */}
      <div className="w-full lg:w-80 xl:w-96 bg-white border-r border-slate-200 overflow-y-auto p-4 lg:p-6 order-2 lg:order-1">
        <BuildingForm />
        
        {/* Save & Export */}
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
          <button
            onClick={() => setShowSaveModal(true)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            💾 Save Model
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleExport('gltf')}
              disabled={isExporting}
              className="py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 transition disabled:opacity-50"
            >
              📦 Export GLTF
            </button>
            <button
              onClick={() => handleExport('glb')}
              disabled={isExporting}
              className="py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 transition disabled:opacity-50"
            >
              📦 Export GLB
            </button>
          </div>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 relative order-1 lg:order-2 h-[50vh] lg:h-full">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-slate-500">Loading 3D scene...</p>
            </div>
          </div>
        }>
          <Scene parameters={currentParams} />
        </Suspense>

        {/* Viewer Controls Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <ViewerControls />
        </div>

        {/* Notification */}
        {notification && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg animate-pulse">
            {notification}
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Save Model</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Building"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Building Type</label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="office">Office</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!modelName.trim()}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
