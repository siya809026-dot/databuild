import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Building from './Building';
import { BuildingParameters } from '../../store/modelStore';
import { useViewerStore } from '../../store/viewerStore';

interface SceneProps {
  parameters: BuildingParameters;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-10, 10, -5]} intensity={0.3} />
    </>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#4a7c59" roughness={1} />
    </mesh>
  );
}

export default function Scene({ parameters }: SceneProps) {
  const { showGrid, showWireframe, showShadows } = useViewerStore();
  const controlsRef = useRef<any>(null);

  const totalHeight = parameters.floors * parameters.floorHeight;
  const cameraDistance = Math.max(parameters.width, parameters.depth, totalHeight) * 2;

  return (
    <Canvas
      shadows={showShadows}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #e0f0ff 100%)' }}
    >
      <PerspectiveCamera
        makeDefault
        position={[cameraDistance, cameraDistance * 0.7, cameraDistance]}
        fov={50}
      />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
      
      <Lights />
      <Ground />
      
      {showGrid && (
        <Grid
          args={[50, 50]}
          position={[0, 0.01, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#666666"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#333333"
          fadeDistance={50}
          infiniteGrid
        />
      )}

      <Building parameters={parameters} wireframe={showWireframe} />
      
      <Environment preset="city" background={false} />
    </Canvas>
  );
}
