/**
 * ユーザー管理機能の定数
 */
import { UserRole } from '@/auth';

// 部署マスタデータ
export const DEPARTMENTS = [
  'management', // 経営陣
  'dev',        // 開発部
  'sales',      // 営業部
  'marketing',  // マーケティング部
  'hr',         // 人事部
  'finance',    // 経理部
  'design',     // デザイン部
  'qa',         // QA部
  'support',    // サポート部
] as const;

export type Department = typeof DEPARTMENTS[number];

// 部署表示名マップ
export const DEPARTMENT_LABELS: Record<Department, string> = {
  management: '経営陣',
  dev: '開発部',
  sales: '営業部',
  marketing: 'マーケティング部',
  hr: '人事部',
  finance: '経理部',
  design: 'デザイン部',
  qa: 'QA部',
  support: 'サポート部',
};

// 役職マスタデータ
export const POSITIONS = [
  'ceo',          // CEO
  'cto',          // CTO
  'vp',           // VP
  'director',     // 部長
  'manager',      // マネージャー
  'lead',         // リード
  'senior',       // シニア
  'regular',      // 一般
  'junior',       // ジュニア
  'intern',       // インターン
] as const;

export type Position = typeof POSITIONS[number];

// 役職表示名マップ
export const POSITION_LABELS: Record<Position, string> = {
  ceo: 'CEO',
  cto: 'CTO',
  vp: 'VP',
  director: '部長',
  manager: 'マネージャー',
  lead: 'リード',
  senior: 'シニア',
  regular: '一般',
  junior: 'ジュニア',
  intern: 'インターン',
};

// スキルマスタデータ
export const SKILLS = [
  // プログラミング言語
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'PHP',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  
  // フロントエンド
  'React',
  'Vue.js',
  'Angular',
  'HTML/CSS',
  'Sass/SCSS',
  'Tailwind CSS',
  'Material-UI',
  
  // バックエンド
  'Node.js',
  'Express',
  'Next.js',
  'Nest.js',
  'Django',
  'Flask',
  'Spring Boot',
  'ASP.NET',
  
  // データベース
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Firestore',
  'DynamoDB',
  
  // クラウド
  'AWS',
  'GCP',
  'Azure',
  'Firebase',
  'Docker',
  'Kubernetes',
  
  // デザイン
  'Figma',
  'Adobe XD',
  'Photoshop',
  'Illustrator',
  'Sketch',
  
  // その他
  'Git',
  'GitHub',
  'GitLab',
  'Jira',
  'Slack',
  'Notion',
  'Excel',
  'PowerPoint',
  'プロジェクト管理',
  'チームマネジメント',
  '営業',
  'マーケティング',
  '経理',
  '人事',
] as const;

export type Skill = typeof SKILLS[number];

// ロール表示名マップ
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'システム管理者',
  [UserRole.ADMIN]: '管理者',
  [UserRole.MANAGER]: 'マネージャー',
  [UserRole.EMPLOYEE]: '社員',
  [UserRole.GUEST]: 'ゲスト',
};

// ステータスオプション
export const STATUS_OPTIONS = [
  { value: 'all', label: '全て' },
  { value: 'active', label: 'アクティブ' },
  { value: 'inactive', label: '非アクティブ' },
] as const;

// ページネーション設定
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ソートフィールドオプション
export const SORT_FIELDS = [
  { value: 'name', label: '氏名' },
  { value: 'employeeId', label: '社員番号' },
  { value: 'email', label: 'メールアドレス' },
  { value: 'department', label: '部署' },
  { value: 'position', label: '役職' },
  { value: 'joinDate', label: '入社日' },
  { value: 'lastLogin', label: '最終ログイン' },
  { value: 'createdAt', label: '作成日' },
] as const;

// バリデーション設定
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  employeeId: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[A-Z0-9-]+$/,
  },
  phone: {
    pattern: /^[0-9\-\+\(\)\s]*$/,
    maxLength: 20,
  },
  skills: {
    maxItems: 20,
  },
  notes: {
    maxLength: 1000,
  },
} as const;

// CSVエクスポート設定
export const CSV_COLUMNS = [
  { key: 'employeeId', label: '社員番号' },
  { key: 'name', label: '氏名' },
  { key: 'nameKana', label: '氏名カナ' },
  { key: 'email', label: 'メールアドレス' },
  { key: 'department', label: '部署' },
  { key: 'position', label: '役職' },
  { key: 'phone', label: '電話番号' },
  { key: 'joinDate', label: '入社日' },
  { key: 'skills', label: 'スキル' },
  { key: 'roles', label: 'ロール' },
  { key: 'isActive', label: 'ステータス' },
  { key: 'lastLogin', label: '最終ログイン' },
  { key: 'createdAt', label: '作成日' },
] as const;
