/**
 * 社員登録機能のエクスポートインデックス（リファクタリング後）
 * 
 * 関心の分離後のコンポーネント、フック、定数を統一的にエクスポート
 */

// メインコンポーネント
export { EmployeeRegister } from './EmployeeRegister';
export { EnhancedEmployeeList } from './EnhancedEmployeeList';
export { EmployeeModal } from './components/EmployeeDialogs';

// カスタムフック
export { useEmployeeForm } from './hooks/useEmployeeForm';

// ストア
export { useEmployeeStore } from './useEmployeeStore';
export type { Employee, EmployeeState, EmployeeActions, EmployeeStore } from './useEmployeeStore';

export { useEmployeeFormStore } from './stores/useEmployeeFormStore';
export type { 
  EmployeeFormState, 
  EmployeeFormActions, 
  EmployeeFormStore,
  EmployeeFormData,
  ValidationErrors 
} from './stores/useEmployeeFormStore';

// 定数
export { DEPARTMENTS, POSITIONS, SKILL_OPTIONS } from './constants/employeeFormConstants';
export type { Department, Position, Skill } from './constants/employeeFormConstants';
