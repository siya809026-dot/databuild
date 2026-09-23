export const BUILDING_TYPES = [
  'residential',
  'commercial',
  'industrial',
  'office',
  'warehouse',
] as const;

export const ROOF_TYPES = [
  'flat',
  'gable',
  'hip',
  'shed',
] as const;

export const MATERIALS = [
  'concrete',
  'brick',
  'glass',
  'steel',
  'wood',
] as const;

export const COLORS = [
  '#e8e8e8',
  '#c4a882',
  '#8b4513',
  '#4a90d9',
  '#2d5a27',
  '#d4a017',
  '#8b0000',
  '#2c3e50',
] as const;

export const DEFAULT_BUILDING_PARAMS = {
  floors: 3,
  width: 10,
  depth: 8,
  floorHeight: 3,
  wallThickness: 0.3,
  rooms: 4,
  roofType: 'gable' as const,
  windowConfiguration: { perFloor: 3, width: 1.2, height: 1.5 },
  doorConfiguration: { width: 1.0, height: 2.2, count: 1 },
  material: 'concrete' as const,
  color: '#e8e8e8',
};

export const MATERIAL_PROPERTIES: Record<string, { roughness: number; metalness: number; opacity?: number }> = {
  concrete: { roughness: 0.9, metalness: 0.1 },
  brick: { roughness: 0.95, metalness: 0.05 },
  glass: { roughness: 0.1, metalness: 0.3, opacity: 0.6 },
  steel: { roughness: 0.3, metalness: 0.9 },
  wood: { roughness: 0.8, metalness: 0.0 },
};
