import { useMemo } from 'react';
import * as THREE from 'three';
import { BuildingParameters } from '../../store/modelStore';
import { MATERIAL_PROPERTIES } from '../../utils/constants';

interface BuildingProps {
  parameters: BuildingParameters;
  wireframe?: boolean;
}

// Factory Pattern - creates building components
function createWallMaterial(color: string, material: string, wireframe: boolean) {
  const props = MATERIAL_PROPERTIES[material] || MATERIAL_PROPERTIES.concrete;
  return new THREE.MeshStandardMaterial({
    color,
    roughness: props.roughness,
    metalness: props.metalness,
    wireframe,
    transparent: props.opacity !== undefined,
    opacity: props.opacity || 1,
  });
}

// Strategy Pattern - different roof strategies
function GableRoof({ width, depth, floorHeight }: { width: number; depth: number; floorHeight: number }) {
  const roofHeight = Math.min(width, depth) * 0.3;
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(0, roofHeight);
    shape.lineTo(width / 2, 0);
    shape.lineTo(-width / 2, 0);

    const extrudeSettings = { depth: depth, bevelEnabled: false };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [width, depth, roofHeight]);

  return (
    <mesh geometry={geometry} position={[0, floorHeight, -depth / 2]} castShadow receiveShadow>
      <meshStandardMaterial color="#8B4513" roughness={0.8} />
    </mesh>
  );
}

function FlatRoof({ width, depth }: { width: number; depth: number }) {
  return (
    <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
      <boxGeometry args={[width + 0.4, 0.2, depth + 0.4]} />
      <meshStandardMaterial color="#555555" roughness={0.9} />
    </mesh>
  );
}

function HipRoof({ width, depth, floorHeight }: { width: number; depth: number; floorHeight: number }) {
  const roofHeight = Math.min(width, depth) * 0.25;
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const hw = width / 2;
    const hd = depth / 2;
    const ridgeLength = Math.max(0, Math.min(width, depth) * 0.3);
    const hr = ridgeLength / 2;

    const vertices = new Float32Array([
      // Front face
      -hw, 0, hd,  hw, 0, hd,  hr, roofHeight, 0,
      -hw, 0, hd,  hr, roofHeight, 0,  -hr, roofHeight, 0,
      // Back face
      hw, 0, -hd,  -hw, 0, -hd,  -hr, roofHeight, 0,
      hw, 0, -hd,  -hr, roofHeight, 0,  hr, roofHeight, 0,
      // Left face
      -hw, 0, -hd,  -hw, 0, hd,  -hr, roofHeight, 0,
      // Right face
      hw, 0, hd,  hw, 0, -hd,  hr, roofHeight, 0,
      // Top ridge
      -hr, roofHeight, 0,  hr, roofHeight, 0,  hr, roofHeight, 0,
    ]);

    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, [width, depth, roofHeight]);

  return (
    <mesh geometry={geometry} position={[0, floorHeight, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#8B4513" roughness={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ShedRoof({ width, depth, floorHeight }: { width: number; depth: number; floorHeight: number }) {
  const roofHeight = width * 0.15;
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const hw = width / 2;
    const hd = depth / 2;

    const vertices = new Float32Array([
      -hw, 0, -hd,  hw, roofHeight, -hd,  hw, roofHeight, hd,
      -hw, 0, -hd,  hw, roofHeight, hd,  -hw, 0, hd,
      // Top
      -hw, 0.1, -hd,  hw, roofHeight + 0.1, -hd,  hw, roofHeight + 0.1, hd,
      -hw, 0.1, -hd,  hw, roofHeight + 0.1, hd,  -hw, 0.1, hd,
    ]);

    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, [width, depth, roofHeight]);

  return (
    <mesh geometry={geometry} position={[0, floorHeight, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#666666" roughness={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Roof({ type, width, depth, floorHeight }: { type: string; width: number; depth: number; floorHeight: number }) {
  switch (type) {
    case 'gable': return <GableRoof width={width} depth={depth} floorHeight={floorHeight} />;
    case 'hip': return <HipRoof width={width} depth={depth} floorHeight={floorHeight} />;
    case 'shed': return <ShedRoof width={width} depth={depth} floorHeight={floorHeight} />;
    default: return <FlatRoof width={width} depth={depth} />;
  }
}

function Windows({ width, depth, floors, floorHeight, config, wallThickness }: {
  width: number; depth: number; floors: number; floorHeight: number;
  config: { perFloor: number; width: number; height: number }; wallThickness: number;
}) {
  const windows = useMemo(() => {
    const result: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [];
    const spacing = width / (config.perFloor + 1);
    
    for (let floor = 0; floor < floors; floor++) {
      const y = floor * floorHeight + floorHeight * 0.5;
      for (let i = 0; i < config.perFloor; i++) {
        const x = -width / 2 + spacing * (i + 1);
        // Front face
        result.push({ pos: [x, y, depth / 2 + 0.01], rot: [0, 0, 0] });
        // Back face
        result.push({ pos: [x, y, -depth / 2 - 0.01], rot: [0, Math.PI, 0] });
      }
    }
    // Side windows
    const sideSpacing = depth / (Math.max(2, Math.floor(config.perFloor * 0.7)) + 1);
    const sideCount = Math.max(2, Math.floor(config.perFloor * 0.7));
    for (let floor = 0; floor < floors; floor++) {
      const y = floor * floorHeight + floorHeight * 0.5;
      for (let i = 0; i < sideCount; i++) {
        const z = -depth / 2 + sideSpacing * (i + 1);
        result.push({ pos: [width / 2 + 0.01, y, z], rot: [0, Math.PI / 2, 0] });
        result.push({ pos: [-width / 2 - 0.01, y, z], rot: [0, -Math.PI / 2, 0] });
      }
    }
    return result;
  }, [width, depth, floors, floorHeight, config]);

  return (
    <group>
      {windows.map((w, i) => (
        <mesh key={i} position={w.pos} rotation={w.rot}>
          <planeGeometry args={[config.width, config.height]} />
          <meshStandardMaterial
            color="#87CEEB"
            transparent
            opacity={0.5}
            roughness={0.1}
            metalness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Window frames */}
      {windows.map((w, i) => (
        <mesh key={`frame-${i}`} position={w.pos} rotation={w.rot}>
          <planeGeometry args={[config.width + 0.15, config.height + 0.15]} />
          <meshStandardMaterial color="#333333" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Doors({ width, depth, config }: {
  width: number; depth: number; config: { width: number; height: number; count: number };
}) {
  const doors = useMemo(() => {
    const result: Array<[number, number, number]> = [];
    const spacing = width / (config.count + 1);
    for (let i = 0; i < config.count; i++) {
      const x = -width / 2 + spacing * (i + 1);
      result.push([x, config.height / 2, depth / 2 + 0.02]);
    }
    return result;
  }, [width, depth, config]);

  return (
    <group>
      {doors.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Door frame */}
          <mesh>
            <planeGeometry args={[config.width + 0.2, config.height + 0.1]} />
            <meshStandardMaterial color="#2c1810" side={THREE.DoubleSide} />
          </mesh>
          {/* Door */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[config.width, config.height]} />
            <meshStandardMaterial color="#5c3317" side={THREE.DoubleSide} />
          </mesh>
          {/* Door handle */}
          <mesh position={[config.width * 0.3, 0, 0.05]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#c0a000" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FloorSlab({ width, depth, wallThickness, yOffset }: {
  width: number; depth: number; wallThickness: number; yOffset: number;
}) {
  return (
    <mesh position={[0, yOffset, 0]} receiveShadow>
      <boxGeometry args={[width, 0.15, depth]} />
      <meshStandardMaterial color="#999999" roughness={0.9} />
    </mesh>
  );
}

export default function Building({ parameters, wireframe = false }: BuildingProps) {
  const { floors, width, depth, floorHeight, wallThickness, rooms, roofType,
    windowConfiguration, doorConfiguration, material, color } = parameters;

  const totalHeight = floors * floorHeight;
  const wallMaterial = useMemo(
    () => createWallMaterial(color, material, wireframe),
    [color, material, wireframe]
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Foundation */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[width + 0.6, 0.3, depth + 0.6]} />
        <meshStandardMaterial color="#666666" roughness={0.95} />
      </mesh>

      {/* Floor slabs */}
      {Array.from({ length: floors + 1 }, (_, i) => (
        <FloorSlab key={i} width={width} depth={depth} wallThickness={wallThickness} yOffset={i * floorHeight} />
      ))}

      {/* Walls - Front and Back */}
      <mesh position={[0, totalHeight / 2, depth / 2]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[width, totalHeight, wallThickness]} />
      </mesh>
      <mesh position={[0, totalHeight / 2, -depth / 2]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[width, totalHeight, wallThickness]} />
      </mesh>

      {/* Walls - Left and Right */}
      <mesh position={[width / 2, totalHeight / 2, 0]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[wallThickness, totalHeight, depth]} />
      </mesh>
      <mesh position={[-width / 2, totalHeight / 2, 0]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[wallThickness, totalHeight, depth]} />
      </mesh>

      {/* Internal walls for rooms */}
      {Array.from({ length: floors }, (_, floor) => {
        const yBase = floor * floorHeight;
        const roomWidth = width / Math.max(1, Math.ceil(Math.sqrt(rooms)));
        const roomDepth = depth / Math.max(1, Math.floor(rooms / Math.ceil(Math.sqrt(rooms))));
        const walls: JSX.Element[] = [];
        
        // Internal dividing walls
        const cols = Math.ceil(Math.sqrt(rooms));
        for (let c = 1; c < cols; c++) {
          walls.push(
            <mesh key={`iw-v-${floor}-${c}`} position={[-width/2 + c * roomWidth, yBase + floorHeight/2, 0]} castShadow>
              <boxGeometry args={[wallThickness * 0.5, floorHeight - 0.15, depth - wallThickness * 2]} />
              <meshStandardMaterial color="#dddddd" roughness={0.9} wireframe={wireframe} />
            </mesh>
          );
        }
        
        return walls;
      })}

      {/* Windows */}
      <Windows
        width={width}
        depth={depth}
        floors={floors}
        floorHeight={floorHeight}
        config={windowConfiguration}
        wallThickness={wallThickness}
      />

      {/* Doors */}
      <Doors width={width} depth={depth} config={doorConfiguration} />

      {/* Roof */}
      <group position={[0, totalHeight, 0]}>
        <Roof type={roofType} width={width} depth={depth} floorHeight={0} />
      </group>

      {/* Floor lines for visual separation */}
      {Array.from({ length: floors - 1 }, (_, i) => (
        <mesh key={`line-${i}`} position={[0, (i + 1) * floorHeight, depth / 2 + 0.02]}>
          <planeGeometry args={[width, 0.05]} />
          <meshStandardMaterial color="#333333" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
