/**
 * 社員登録フォームの定数定義
 * 
 * フォームで使用する選択肢やオプションを一箇所に集約
 */

// 部署の選択肢
export const DEPARTMENTS = [
  '総務部',
  '人事部', 
  '経理部',
  '営業部',
  '開発部',
  'マーケティング部',
  '企画部',
  'その他'
] as const;

// 役職の選択肢
export const POSITIONS = [
  '社員',
  '主任',
  '係長',
  '課長',
  '部長',
  '取締役',
  '代表取締役',
  'インターン',
  'その他'
] as const;

// スキルのプリセット選択肢
export const SKILL_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'C#',
  'PHP',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'HTML/CSS',
  'SQL',
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'Git',
  'プロジェクト管理',
  'UI/UX',
  'デザイン',
  'マーケティング',
  '営業',
  '経理',
  '人事',
  '総務'
] as const;

// 型定義
export type Department = typeof DEPARTMENTS[number];
export type Position = typeof POSITIONS[number];
export type Skill = typeof SKILL_OPTIONS[number];
