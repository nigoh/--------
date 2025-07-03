/**
 * ナビゲーションアイテムの定義
 * SideNavigationとMobileNavDrawerで共有
 */
import React from 'react';
import {
  Dashboard as DashboardIcon,
  MeetingRoom as MeetingIcon,
  People as PeopleIcon,
  Groups as GroupsIcon,
  AccessTime as TimeIcon,
  ReceiptLong as ExpenseIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  ViewModule as DialogIcon,
  Logout as LogoutIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  BugReport as LogIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  index: number;
  badge?: string;
}

// メインナビゲーションアイテム
export const getMainNavigationItems = (): NavigationItem[] => [
  {
    id: 'dashboard',
    label: 'ダッシュボード',
    icon: React.createElement(DashboardIcon),
    index: -1, // ダッシュボード表示
  },
  {
    id: 'teams',
    label: 'チーム管理',
    icon: React.createElement(GroupsIcon),
    index: 0,
  },
  {
    id: 'employees',
    label: '社員管理',
    icon: React.createElement(PeopleIcon),
    index: 1,
  },
  {
    id: 'timecard',
    label: '勤怠管理',
    icon: React.createElement(TimeIcon),
    index: 2,
  },
  {
    id: 'meeting',
    label: 'ミーティング進行',
    icon: React.createElement(MeetingIcon),
    index: 3,
  },
  {
    id: 'expense',
    label: '経費管理',
    icon: React.createElement(ExpenseIcon),
    index: 4,
  },
  {
    id: 'equipment',
    label: '備品管理',
    icon: React.createElement(InventoryIcon),
    index: 5,
  },
  {
    id: 'dialog-demo',
    label: 'ダイアログデモ',
    icon: React.createElement(DialogIcon),
    index: 6,
  },
  {
    id: 'mfa-management',
    label: 'MFA管理',
    icon: React.createElement(SecurityIcon),
    index: 7,
  },
  {
    id: 'user-profile',
    label: 'ユーザー設定',
    icon: React.createElement(PersonIcon),
    index: 8,
  },
  {
    id: 'role-management',
    label: '権限管理',
    icon: React.createElement(AdminIcon),
    index: 9,
  },
  {
    id: 'passkey-management',
    label: 'パスキー管理',
    icon: React.createElement(SecurityIcon),
    index: 10,
  },
  {
    id: 'logging-dashboard',
    label: 'ロギングダッシュボード',
    icon: React.createElement(AnalyticsIcon),
    index: 11,
  },
  ...(process.env.NODE_ENV === 'development' ? [{
    id: 'logging-demo',
    label: 'ログ機能デモ',
    icon: React.createElement(LogIcon),
    index: 12,
    badge: 'Dev',
  }] : []),
];

// 設定ナビゲーションアイテム
export const getSettingsNavigationItems = (): NavigationItem[] => [
  {
    id: 'settings',
    label: '設定',
    icon: React.createElement(SettingsIcon),
    index: -3, // 特別な値
  },
  ...(process.env.NODE_ENV === 'development' ? [{
    id: 'performance',
    label: 'パフォーマンス',
    icon: React.createElement(SpeedIcon),
    index: -4, // 特別な値
    badge: 'Dev',
  }] : []),
  {
    id: 'logout',
    label: 'ログアウト',
    icon: React.createElement(LogoutIcon),
    index: -2, // 特別な値
  },
];
