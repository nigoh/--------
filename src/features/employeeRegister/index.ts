/**
 * 社員登録機能のエクスポートインデックス（リファクタリング後）
 * 
 * 関心の分離後のコンポーネント、フック、定数を統一的にエクスポート
 */

// メインコンポーネント
export { EmployeeRegister } from './EmployeeRegister';
export { EmployeeRegisterForm } from './EmployeeRegisterForm';
export { EmployeeList } from './EmployeeList';

// UIコンポーネント
export { EmployeeRegisterFormUI } from './components/EmployeeRegisterFormUI';

// カスタムフック
export { useEmployeeForm } from './hooks/useEmployeeForm';
export { useEmployeeFormValidation } from './hooks/useEmployeeFormValidation';
export { useEmployeeListFilter } from './hooks/useEmployeeListFilter';
export { useEmployeeListActions } from './hooks/useEmployeeListActions';

// ストア
export { useEmployeeStore } from './useEmployeeStore';
export type { Employee, EmployeeState, EmployeeActions, EmployeeStore } from './useEmployeeStore';

// 定数
export { DEPARTMENTS, POSITIONS, SKILL_OPTIONS } from './constants/employeeFormConstants';
export type { Department, Position, Skill } from './constants/employeeFormConstants';

// 型定義
export type { ValidationErrors, EmployeeFormData } from './hooks/useEmployeeFormValidation';
