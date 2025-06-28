import { create } from 'zustand';

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentState {
  items: EquipmentItem[];
}

export interface EquipmentActions {
  addItem: (item: Omit<EquipmentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<Omit<EquipmentItem, 'id'>>) => void;
  deleteItem: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  reset: () => void;
}

export type EquipmentStore = EquipmentState & EquipmentActions;

const initialState: EquipmentState = {
  items: [],
};

export const useEquipmentStore = create<EquipmentStore>((set) => ({
  ...initialState,
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateItem: (id, item) =>
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id
          ? { ...it, ...item, updatedAt: new Date().toISOString() }
          : it,
      ),
    })),
  deleteItem: (id) =>
    set((state) => ({ items: state.items.filter((it) => it.id !== id) })),
  adjustStock: (id, delta) =>
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id ? { ...it, quantity: it.quantity + delta } : it,
      ),
    })),
  reset: () => set(initialState),
}));
