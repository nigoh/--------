import { create } from 'zustand';
import type { TeamRole, TeamStatus, TeamType, MemberSource } from '../constants/teamConstants';

// チームメンバーの型定義
export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role: TeamRole;
  source: MemberSource; // 社員名簿 or 手動追加
  employeeId?: string; // 社員名簿から追加した場合のID
  joinedAt: string;
}

// チームデータの型定義
export interface Team {
  id: string;
  name: string;
  description?: string;
  type: TeamType;
  status: TeamStatus;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

// 状態の型定義
export interface TeamState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: TeamStatus | '';
  typeFilter: TeamType | '';
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

// アクションの型定義
export interface TeamActions {
  addTeam: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addMemberToTeam: (teamId: string, member: Omit<TeamMember, 'id' | 'joinedAt'>) => void;
  removeMemberFromTeam: (teamId: string, memberId: string) => void;
  updateTeamMember: (teamId: string, memberId: string, member: Partial<TeamMember>) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: TeamStatus | '') => void;
  setTypeFilter: (type: TeamType | '') => void;
  setSortField: (field: string) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearFilters: () => void;
  reset: () => void;
}

// 統合型
export type TeamStore = TeamState & TeamActions;

const initialState: TeamState = {
  teams: [],
  loading: false,
  error: null,
  searchQuery: '',
  statusFilter: '',
  typeFilter: '',
  sortField: 'createdAt',
  sortDirection: 'desc',
};

export const useTeamStore = create<TeamStore>((set, get) => ({
  ...initialState,

  addTeam: (teamData) => {
    const newTeam: Team = {
      ...teamData,
      id: crypto.randomUUID(),
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
        team.id === id 
          ? { ...team, ...teamData, updatedAt: new Date().toISOString() }
          : team
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

  addMemberToTeam: (teamId, memberData) => {
    const newMember: TeamMember = {
      ...memberData,
      id: crypto.randomUUID(),
      joinedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: [...team.members, newMember],
              updatedAt: new Date().toISOString(),
            }
          : team
      ),
      error: null,
    }));
  },

  removeMemberFromTeam: (teamId, memberId) => {
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: team.members.filter((member) => member.id !== memberId),
              updatedAt: new Date().toISOString(),
            }
          : team
      ),
      error: null,
    }));
  },

  updateTeamMember: (teamId, memberId, memberData) => {
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: team.members.map((member) =>
                member.id === memberId ? { ...member, ...memberData } : member
              ),
              updatedAt: new Date().toISOString(),
            }
          : team
      ),
      error: null,
    }));
  },

  setSearchQuery: (query) => {
    const state = get();
    if (state.searchQuery === query) return;
    set({ searchQuery: query });
  },

  setStatusFilter: (status) => {
    const state = get();
    if (state.statusFilter === status) return;
    set({ statusFilter: status });
  },

  setTypeFilter: (type) => {
    const state = get();
    if (state.typeFilter === type) return;
    set({ typeFilter: type });
  },

  setSortField: (field) => {
    const state = get();
    if (state.sortField === field) return;
    set({ sortField: field });
  },

  setSortDirection: (direction) => {
    const state = get();
    if (state.sortDirection === direction) return;
    set({ sortDirection: direction });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clearFilters: () => {
    set({
      searchQuery: '',
      statusFilter: '',
      typeFilter: '',
      sortField: 'createdAt',
      sortDirection: 'desc',
    });
  },

  reset: () => set(initialState),
}));

// フィルター済みのチームを取得するセレクター
export const useFilteredTeams = () => {
  const { teams, searchQuery, statusFilter, typeFilter, sortField, sortDirection } = useTeamStore();

  return teams
    .filter((team) => {
      // 検索クエリでフィルター
      if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // ステータスでフィルター
      if (statusFilter && team.status !== statusFilter) {
        return false;
      }

      // タイプでフィルター
      if (typeFilter && team.type !== typeFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const aValue = getTeamSortValue(a, sortField);
      const bValue = getTeamSortValue(b, sortField);

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
};

// ソート用の値を取得するヘルパー関数
const getTeamSortValue = (team: Team, field: string): any => {
  switch (field) {
    case 'name':
      return team.name.toLowerCase();
    case 'type':
      return team.type;
    case 'status':
      return team.status;
    case 'memberCount':
      return team.members.length;
    case 'createdAt':
    case 'updatedAt':
      return new Date(team[field]).getTime();
    default:
      return '';
  }
};
