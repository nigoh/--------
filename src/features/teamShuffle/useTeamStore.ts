import { create } from 'zustand';

// チームデータの型定義
export interface Team {
  id: string;
  name: string;
  members: string[];
  description?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 状態の型定義
export interface TeamState {
  teams: Team[];
  loading: boolean;
  error: string | null;
}

// アクションの型定義
export interface TeamActions {
  addTeam: (team: Omit<Team, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  toggleTeamStatus: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// 統合型
export type TeamStore = TeamState & TeamActions;

const initialState: TeamState = {
  teams: [],
  loading: false,
  error: null,
};

export const useTeamStore = create<TeamStore>((set, get) => ({
  ...initialState,

  addTeam: (teamData) => {
    const newTeam: Team = {
      ...teamData,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      teams: [...state.teams, newTeam],
      error: null,
    }));
  },

  updateTeam: (id, teamData) => {
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === id ? { ...team, ...teamData, updatedAt: new Date().toISOString() } : team
      ),
      error: null,
    }));
  },

  deleteTeam: (id) => {
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== id),
      error: null,
    }));
  },

  toggleTeamStatus: (id) => {
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === id ? { ...team, isActive: !team.isActive, updatedAt: new Date().toISOString() } : team
      ),
    }));
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));