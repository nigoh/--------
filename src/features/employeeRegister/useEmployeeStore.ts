import { create } from 'zustand';

// 社員データの型定義
export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  phone?: string;
  joinDate: string;
  skills: string[];
  notes?: string; // 備考・その他情報
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 状態の型定義
export interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

// アクションの型定義
export interface EmployeeActions {
  addEmployee: (employee: Omit<Employee, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  toggleEmployeeStatus: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// 統合型
export type EmployeeStore = EmployeeState & EmployeeActions;

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  ...initialState,

  addEmployee: (employeeData) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      employees: [...state.employees, newEmployee],
      error: null,
    }));
  },

  updateEmployee: (id, employeeData) => {
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...employeeData } : emp
      ),
      error: null,
    }));
  },

  deleteEmployee: (id) => {
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
      error: null,
    }));
  },

  toggleEmployeeStatus: (id) => {
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, isActive: !emp.isActive } : emp
      ),
    }));
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
