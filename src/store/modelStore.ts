import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_BUILDING_PARAMS } from '../utils/constants';

export interface BuildingParameters {
  floors: number;
  width: number;
  depth: number;
  floorHeight: number;
  wallThickness: number;
  rooms: number;
  roofType: string;
  windowConfiguration: { perFloor: number; width: number; height: number };
  doorConfiguration: { width: number; height: number; count: number };
  material: string;
  color: string;
}

export interface BuildingModel {
  id: string;
  userId: string;
  name: string;
  buildingType: string;
  parameters: BuildingParameters;
  createdAt: string;
  updatedAt: string;
}

interface ModelState {
  models: BuildingModel[];
  currentModel: BuildingModel | null;
  currentParams: BuildingParameters;
  isLoading: boolean;
  error: string | null;
  
  setCurrentParams: (params: Partial<BuildingParameters>) => void;
  resetParams: () => void;
  saveModel: (userId: string, name: string, buildingType: string) => BuildingModel;
  updateModel: (id: string, updates: Partial<BuildingModel>) => void;
  deleteModel: (id: string) => void;
  duplicateModel: (id: string) => BuildingModel | null;
  loadModel: (id: string) => void;
  getUserModels: (userId: string) => BuildingModel[];
  clearError: () => void;
}

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      models: [],
      currentModel: null,
      currentParams: { ...DEFAULT_BUILDING_PARAMS },
      isLoading: false,
      error: null,

      setCurrentParams: (params) => {
        set((state) => ({
          currentParams: { ...state.currentParams, ...params },
        }));
      },

      resetParams: () => {
        set({ currentParams: { ...DEFAULT_BUILDING_PARAMS } });
      },

      saveModel: (userId, name, buildingType) => {
        const state = get();
        const now = new Date().toISOString();
        const newModel: BuildingModel = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
          userId,
          name,
          buildingType,
          parameters: { ...state.currentParams },
          createdAt: now,
          updatedAt: now,
        };
        
        set((s) => ({ models: [...s.models, newModel], currentModel: newModel }));
        return newModel;
      },

      updateModel: (id, updates) => {
        set((state) => ({
          models: state.models.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
          currentModel: state.currentModel?.id === id 
            ? { ...state.currentModel, ...updates, updatedAt: new Date().toISOString() }
            : state.currentModel,
        }));
      },

      deleteModel: (id) => {
        set((state) => ({
          models: state.models.filter((m) => m.id !== id),
          currentModel: state.currentModel?.id === id ? null : state.currentModel,
        }));
      },

      duplicateModel: (id) => {
        const state = get();
        const original = state.models.find((m) => m.id === id);
        if (!original) return null;
        
        const now = new Date().toISOString();
        const duplicate: BuildingModel = {
          ...original,
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
          name: `${original.name} (Copy)`,
          createdAt: now,
          updatedAt: now,
        };
        
        set((s) => ({ models: [...s.models, duplicate] }));
        return duplicate;
      },

      loadModel: (id) => {
        const state = get();
        const model = state.models.find((m) => m.id === id);
        if (model) {
          set({ currentModel: model, currentParams: { ...model.parameters } });
        }
      },

      getUserModels: (userId) => {
        return get().models.filter((m) => m.userId === userId);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'model-storage',
    }
  )
);
