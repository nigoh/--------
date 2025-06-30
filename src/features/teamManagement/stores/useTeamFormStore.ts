import { create } from 'zustand';
import type { Team, TeamMember } from './useTeamStore';
import type { TeamRole, TeamType, TeamStatus, MemberSource } from '../constants/teamConstants';

// フォーム状態の型定義
export interface TeamFormState {
  // チーム基本情報
  name: string;
  description: string;
  type: TeamType | '';
  status: TeamStatus | '';
  
  // メンバー管理
  members: TeamMember[];
  selectedEmployeeId: string;
  manualMemberName: string;
  manualMemberEmail: string;
  memberRole: TeamRole;
  
  // UI状態
  isSubmitting: boolean;
  errors: Record<string, string>;
  editingTeam: Team | null;
  isDialogOpen: boolean;
}

// フォームアクションの型定義
export interface TeamFormActions {
  // フィールド更新
  updateField: <K extends keyof TeamFormState>(field: K, value: TeamFormState[K]) => void;
  
  // メンバー管理
  addMemberFromEmployee: (employeeId: string, employeeName: string, employeeEmail?: string) => void;
  addManualMember: () => void;
  removeMember: (memberId: string) => void;
  updateMemberRole: (memberId: string, role: TeamRole) => void;
  
  // バリデーション
  validateForm: () => boolean;
  setError: (field: string, message: string) => void;
  clearErrors: () => void;
  
  // フォーム制御
  openDialog: (team?: Team) => void;
  closeDialog: () => void;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
}

// 統合型
export type TeamFormStore = TeamFormState & TeamFormActions;

const initialState: TeamFormState = {
  name: '',
  description: '',
  type: '',
  status: 'アクティブ',
  members: [],
  selectedEmployeeId: '',
  manualMemberName: '',
  manualMemberEmail: '',
  memberRole: 'メンバー',
  isSubmitting: false,
  errors: {},
  editingTeam: null,
  isDialogOpen: false,
};

export const useTeamFormStore = create<TeamFormStore>((set, get) => ({
  ...initialState,

  updateField: (field, value) => {
    const state = get();
    if (state[field] === value) return;
    
    set((state) => ({
      [field]: value,
      // エラーをクリア
      errors: { ...state.errors, [field]: '' },
    }));
  },

  addMemberFromEmployee: (employeeId, employeeName, employeeEmail) => {
    const state = get();
    
    // 既にメンバーに追加済みかチェック
    const existingMember = state.members.find(
      (member) => member.employeeId === employeeId
    );
    
    if (existingMember) {
      set((state) => ({
        errors: { ...state.errors, member: 'この社員は既にメンバーに追加されています' },
      }));
      return;
    }

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: employeeName,
      email: employeeEmail,
      role: state.memberRole,
      source: 'employee',
      employeeId: employeeId,
      joinedAt: new Date().toISOString(),
    };

    set((state) => ({
      members: [...state.members, newMember],
      selectedEmployeeId: '',
      errors: { ...state.errors, member: '' },
    }));
  },

  addManualMember: () => {
    const state = get();
    
    if (!state.manualMemberName.trim()) {
      set((state) => ({
        errors: { ...state.errors, manualMember: 'メンバー名を入力してください' },
      }));
      return;
    }

    // 同名のメンバーが既に存在するかチェック
    const existingMember = state.members.find(
      (member) => member.name.toLowerCase() === state.manualMemberName.toLowerCase()
    );
    
    if (existingMember) {
      set((state) => ({
        errors: { ...state.errors, manualMember: 'この名前のメンバーは既に追加されています' },
      }));
      return;
    }

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: state.manualMemberName.trim(),
      email: state.manualMemberEmail.trim() || undefined,
      role: state.memberRole,
      source: 'manual',
      joinedAt: new Date().toISOString(),
    };

    set((state) => ({
      members: [...state.members, newMember],
      manualMemberName: '',
      manualMemberEmail: '',
      errors: { ...state.errors, manualMember: '' },
    }));
  },

  removeMember: (memberId) => {
    set((state) => ({
      members: state.members.filter((member) => member.id !== memberId),
    }));
  },

  updateMemberRole: (memberId, role) => {
    set((state) => ({
      members: state.members.map((member) =>
        member.id === memberId ? { ...member, role } : member
      ),
    }));
  },

  validateForm: () => {
    const state = get();
    const errors: Record<string, string> = {};

    // チーム名の検証
    if (!state.name.trim()) {
      errors.name = 'チーム名を入力してください';
    } else if (state.name.length > 100) {
      errors.name = 'チーム名は100文字以内で入力してください';
    }

    // タイプの検証
    if (!state.type) {
      errors.type = 'チームタイプを選択してください';
    }

    // ステータスの検証
    if (!state.status) {
      errors.status = 'ステータスを選択してください';
    }

    // メンバーの検証
    if (state.members.length === 0) {
      errors.members = '最低1人のメンバーを追加してください';
    }

    // リーダーが設定されているかチェック
    const hasLeader = state.members.some((member) => member.role === 'リーダー');
    if (state.members.length > 1 && !hasLeader) {
      errors.members = 'リーダーを1人指定してください';
    }

    set({ errors });
    return Object.keys(errors).length === 0;
  },

  setError: (field, message) => {
    set((state) => ({
      errors: { ...state.errors, [field]: message },
    }));
  },

  clearErrors: () => {
    set({ errors: {} });
  },

  openDialog: (team) => {
    if (team) {
      // 編集モード
      set({
        ...initialState,
        name: team.name,
        description: team.description || '',
        type: team.type,
        status: team.status,
        members: [...team.members],
        editingTeam: team,
        isDialogOpen: true,
      });
    } else {
      // 新規作成モード
      set({
        ...initialState,
        isDialogOpen: true,
      });
    }
  },

  closeDialog: () => {
    set({
      ...initialState,
      isDialogOpen: false,
    });
  },

  resetForm: () => {
    set({
      ...initialState,
      isDialogOpen: get().isDialogOpen,
    });
  },

  setSubmitting: (submitting) => {
    set({ isSubmitting: submitting });
  },
}));
