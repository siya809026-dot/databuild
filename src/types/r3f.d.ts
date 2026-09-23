import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Three.js elements
      mesh: any;
      group: any;
      bufferGeometry: any;
      boxGeometry: any;
      planeGeometry: any;
      sphereGeometry: any;
      cylinderGeometry: any;
      coneGeometry: any;
      extrudeGeometry: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      spotLight: any;
      hemisphereLight: any;
    }
  }
}
