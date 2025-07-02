/**
 * 権限管理画面コンポーネント
 * 管理者向けのユーザー権限設定インターフェース
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Button,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  Divider,
  ListItemText,
  OutlinedInput,
  Pagination,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  SecurityOutlined as SecurityIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

import { usePermission } from '../hooks/usePermission';
import { useUserPermissionManagement } from '../hooks/useUserPermissionManagement';
import { PermissionGate } from './PermissionGate';
import { UserRole, Permission, DEFAULT_ROLE_PERMISSIONS } from '../types/roles';
import { spacingTokens } from '../../theme/designSystem';
import { FeatureLayout, FeatureHeader, FeatureContent } from '../../components/layout';

// Firebase Admin SDK連携（実際の実装はCloud Functions経由）
import { getFirestore, collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';

interface UserWithPermissions {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  roles: UserRole[];
  permissions: Permission[];
  department?: string;
  position?: string;
  lastLogin?: Date;
  createdAt: Date;
}

// 部門データ（実際の実装では別のAPIから取得）
const DEPARTMENTS = [
  { id: 'dev', name: '開発部' },
  { id: 'sales', name: '営業部' },
  { id: 'hr', name: '人事部' },
  { id: 'finance', name: '経理部' },
  { id: 'management', name: '経営企画部' }
];

/**
 * 権限管理画面
 */
const RoleManagementPage: React.FC = () => {
  const theme = useTheme();
  const { isAdmin } = usePermission();
  const {
    setUserRole,
    removeUserRole,
    setUserPermissions,
    setUserDepartment,
    setUserPosition
  } = useUserPermissionManagement();
  
  // 状態
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // 編集状態
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserWithPermissions>>({});
  
  // フィルター
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string | 'all'>('all');
  
  // ダイアログ
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  
  // データ読み込み
  const loadUsers = async (pageNum = 1) => {
    if (!isAdmin()) {
      setError('この機能へのアクセス権がありません');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const db = getFirestore();
      let usersQuery = query(
        collection(db, 'users'),
        orderBy('displayName'),
        limit(pageSize)
      );
      
      // フィルターの適用
      if (roleFilter !== 'all') {
        usersQuery = query(usersQuery, where('roles', 'array-contains', roleFilter));
      }
      
      if (departmentFilter !== 'all') {
        usersQuery = query(usersQuery, where('department', '==', departmentFilter));
      }
      
      // ページネーション
      if (pageNum > 1) {
        const lastVisibleDoc = await getLastVisibleDoc(pageNum - 1);
        if (lastVisibleDoc) {
          usersQuery = query(usersQuery, startAfter(lastVisibleDoc));
        }
      }
      
      const querySnapshot = await getDocs(usersQuery);
      const userList: UserWithPermissions[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserWithPermissions;
        
        // 検索クエリのフィルタリング（クライアント側）
        if (searchQuery && !matchesSearchQuery(userData, searchQuery)) {
          return;
        }
        
        userList.push({
          ...userData,
          uid: doc.id,
          lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : undefined,
          createdAt: new Date(userData.createdAt)
        });
      });
      
      setUsers(userList);
      
      // 総ページ数の取得（実際の実装では、サーバーサイドでのページネーション処理が必要）
      const countSnapshot = await getDocs(collection(db, 'users'));
      const totalDocs = countSnapshot.size;
      setTotalPages(Math.ceil(totalDocs / pageSize));
      
    } catch (err) {
      console.error('ユーザー一覧取得エラー:', err);
      setError('ユーザー情報の読み込み中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };
  
  // ページネーション用の補助関数
  const getLastVisibleDoc = async (pageNum: number) => {
    // 実際の実装ではFirestoreのページネーション機能を使用
    return null;
  };
  
  // 検索クエリに一致するかチェック
  const matchesSearchQuery = (user: UserWithPermissions, query: string) => {
    const lowerQuery = query.toLowerCase();
    return (
      user.email.toLowerCase().includes(lowerQuery) ||
      (user.displayName && user.displayName.toLowerCase().includes(lowerQuery))
    );
  };
  
  // 初期データ読み込み
  useEffect(() => {
    loadUsers(page);
  }, [page, roleFilter, departmentFilter]);
  
  // 検索処理
  const handleSearch = () => {
    loadUsers(1);
  };
  
  // 編集開始
  const startEditing = (userId: string) => {
    const user = users.find(u => u.uid === userId);
    if (user) {
      setEditingUserId(userId);
      setEditData({
        roles: [...user.roles],
        department: user.department,
        position: user.position
      });
    }
  };
  
  // 編集キャンセル
  const cancelEditing = () => {
    setEditingUserId(null);
    setEditData({});
  };
  
  // 編集保存
  const saveEditing = async () => {
    if (!editingUserId || !editData) return;
    
    setLoading(true);
    try {
      const user = users.find(u => u.uid === editingUserId);
      if (!user) throw new Error('ユーザーが見つかりません');
      
      // ロール設定
      if (editData.roles) {
        // 追加されたロール
        const rolesToAdd = editData.roles.filter(role => !user.roles.includes(role));
        // 削除されたロール
        const rolesToRemove = user.roles.filter(role => !editData.roles!.includes(role));
        
        // ロール追加
        for (const role of rolesToAdd) {
          await setUserRole(editingUserId, role);
        }
        
        // ロール削除
        for (const role of rolesToRemove) {
          await removeUserRole(editingUserId, role);
        }
      }
      
      // 部門設定
      if (editData.department !== undefined && editData.department !== user.department) {
        await setUserDepartment(editingUserId, editData.department);
      }
      
      // 役職設定
      if (editData.position !== undefined && editData.position !== user.position) {
        await setUserPosition(editingUserId, editData.position);
      }
      
      // 編集後のデータで更新
      setUsers(prevUsers => prevUsers.map(u => {
        if (u.uid === editingUserId) {
          return {
            ...u,
            roles: editData.roles || u.roles,
            department: editData.department !== undefined ? editData.department : u.department,
            position: editData.position !== undefined ? editData.position : u.position
          };
        }
        return u;
      }));
      
      setEditingUserId(null);
      setEditData({});
    } catch (err) {
      console.error('ユーザー編集エラー:', err);
      setError('ユーザー情報の更新中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };
  
  // 権限編集ダイアログを開く
  const openPermissionDialog = (userId: string) => {
    const user = users.find(u => u.uid === userId);
    if (user) {
      setSelectedUserId(userId);
      setSelectedPermissions([...user.permissions]);
      setPermissionDialogOpen(true);
    }
  };
  
  // 権限を保存
  const savePermissions = async () => {
    if (!selectedUserId) return;
    
    setLoading(true);
    try {
      await setUserPermissions(selectedUserId, selectedPermissions);
      
      // 権限を更新
      setUsers(prevUsers => prevUsers.map(u => {
        if (u.uid === selectedUserId) {
          return {
            ...u,
            permissions: selectedPermissions
          };
        }
        return u;
      }));
      
      setPermissionDialogOpen(false);
      setSelectedUserId(null);
      setSelectedPermissions([]);
    } catch (err) {
      console.error('権限設定エラー:', err);
      setError('権限の更新中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };
  
  // 権限変更ハンドラー
  const handlePermissionToggle = (permission: Permission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };
  
  // ロール変更ハンドラー
  const handleRoleToggle = (role: UserRole) => {
    setEditData(prev => {
      const currentRoles = [...(prev.roles || [])];
      if (currentRoles.includes(role)) {
        return { ...prev, roles: currentRoles.filter(r => r !== role) };
      } else {
        return { ...prev, roles: [...currentRoles, role] };
      }
    });
  };
  
  // フィルタリングされたユーザーリスト
  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    
    if (searchQuery) {
      filtered = filtered.filter(user => matchesSearchQuery(user, searchQuery));
    }
    
    return filtered;
  }, [users, searchQuery]);
  
  // 権限をカテゴリーごとにグループ化
  const groupPermissionsByCategory = useCallback(() => {
    const categories: {[key: string]: Permission[]} = {
      '従業員管理': [],
      'タイムカード': [],
      'チーム管理': [],
      '経費精算': [],
      '機器管理': [],
      '会議室予約': [],
      'システム設定': []
    };
    
    Object.values(Permission).forEach(permission => {
      if (permission.startsWith('employee:')) {
        categories['従業員管理'].push(permission);
      } else if (permission.startsWith('timecard:')) {
        categories['タイムカード'].push(permission);
      } else if (permission.startsWith('team:')) {
        categories['チーム管理'].push(permission);
      } else if (permission.startsWith('expense:')) {
        categories['経費精算'].push(permission);
      } else if (permission.startsWith('equipment:')) {
        categories['機器管理'].push(permission);
      } else if (permission.startsWith('meeting:')) {
        categories['会議室予約'].push(permission);
      } else if (permission.startsWith('system:') || permission.startsWith('user:') || permission.startsWith('role:')) {
        categories['システム設定'].push(permission);
      }
    });
    
    return categories;
  }, []);
  
  return (
    <PermissionGate requiredRole={UserRole.ADMIN}>
      <FeatureLayout maxWidth={false}>
        <FeatureHeader
          title="権限管理"
          subtitle="ユーザーのロールと権限を管理します"
          buttons={[
            {
              text: "ユーザー追加",
              onClick: () => console.log('ユーザー追加機能を実装'),
              variant: "outlined",
              icon: <PersonAddIcon />
            }
          ]}
        />
        
        <FeatureContent variant="transparent" padding={0}>
          {/* フィルターエリア */}
          <Card sx={{ mb: spacingTokens.lg }}>
            <CardContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'flex-end' }}>
                <Box>
                  <TextField
                    label="ユーザー検索"
                    fullWidth
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="名前、メールアドレス"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton size="small" onClick={handleSearch}>
                            <SearchIcon />
                          </IconButton>
                        )
                      }
                    }}
                  />
                </Box>
                
                <Box>
                  <FormControl fullWidth>
                    <InputLabel>ロール</InputLabel>
                    <Select
                      value={roleFilter}
                      label="ロール"
                      onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
                    >
                      <MenuItem value="all">すべて</MenuItem>
                      {Object.values(UserRole).map(role => (
                        <MenuItem key={role} value={role}>
                          {getRoleDisplayName(role)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box>
                  <FormControl fullWidth>
                    <InputLabel>部門</InputLabel>
                    <Select
                      value={departmentFilter}
                      label="部門"
                      onChange={e => setDepartmentFilter(e.target.value as string)}
                    >
                      <MenuItem value="all">すべて</MenuItem>
                      {DEPARTMENTS.map(dept => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<FilterIcon />}
                    onClick={handleSearch}
                    fullWidth
                  >
                    フィルター適用
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          {/* エラー表示 */}
          {error && (
            <Alert severity="error" sx={{ mb: spacingTokens.md }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {/* ユーザーテーブル */}
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ユーザー</TableCell>
                      <TableCell>メールアドレス</TableCell>
                      <TableCell>ロール</TableCell>
                      <TableCell>部門</TableCell>
                      <TableCell>役職</TableCell>
                      <TableCell>権限</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: spacingTokens.lg }}>
                          <CircularProgress />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: spacingTokens.sm }}>
                            データ読み込み中...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: spacingTokens.lg }}>
                          <Typography variant="body1" color="text.secondary">
                            ユーザーが見つかりません
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map(user => (
                        <TableRow key={user.uid}>
                          {/* ユーザー情報 */}
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: spacingTokens.sm }}>
                              {user.photoURL ? (
                                <Box
                                  component="img"
                                  src={user.photoURL}
                                  sx={{ width: 32, height: 32, borderRadius: '50%' }}
                                  alt={user.displayName || 'ユーザー'}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {(user.displayName || user.email[0]).substring(0, 1).toUpperCase()}
                                </Box>
                              )}
                              <Typography>{user.displayName || '未設定'}</Typography>
                            </Box>
                          </TableCell>
                          
                          {/* メールアドレス */}
                          <TableCell>{user.email}</TableCell>
                          
                          {/* ロール */}
                          <TableCell>
                            {editingUserId === user.uid ? (
                              <FormControl fullWidth>
                                <Select
                                  multiple
                                  value={editData.roles || []}
                                  renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {(selected as UserRole[]).map((role) => (
                                        <Chip key={role} label={getRoleDisplayName(role)} size="small" />
                                      ))}
                                    </Box>
                                  )}
                                >
                                  {Object.values(UserRole).map(role => (
                                    <MenuItem key={role} value={role}>
                                      <Checkbox checked={(editData.roles || []).indexOf(role) > -1} />
                                      <ListItemText primary={getRoleDisplayName(role)} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ) : (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {user.roles.map(role => (
                                  <Chip
                                    key={role}
                                    label={getRoleDisplayName(role)}
                                    size="small"
                                    color={getRoleColor(role)}
                                  />
                                ))}
                              </Box>
                            )}
                          </TableCell>
                          
                          {/* 部門 */}
                          <TableCell>
                            {editingUserId === user.uid ? (
                              <FormControl fullWidth>
                                <Select
                                  value={editData.department || ''}
                                  onChange={e => setEditData({ ...editData, department: e.target.value })}
                                  displayEmpty
                                >
                                  <MenuItem value="">
                                    <em>未設定</em>
                                  </MenuItem>
                                  {DEPARTMENTS.map(dept => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      {dept.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ) : (
                              getDepartmentName(user.department)
                            )}
                          </TableCell>
                          
                          {/* 役職 */}
                          <TableCell>
                            {editingUserId === user.uid ? (
                              <TextField
                                fullWidth
                                value={editData.position || ''}
                                onChange={e => setEditData({ ...editData, position: e.target.value })}
                                placeholder="役職"
                              />
                            ) : (
                              user.position || '未設定'
                            )}
                          </TableCell>
                          
                          {/* 権限 */}
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<SecurityIcon />}
                              onClick={() => openPermissionDialog(user.uid)}
                            >
                              権限設定
                              {user.permissions.length > 0 && (
                                <Chip
                                  label={user.permissions.length}
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Button>
                          </TableCell>
                          
                          {/* 操作 */}
                          <TableCell>
                            {editingUserId === user.uid ? (
                              <Box sx={{ display: 'flex', gap: spacingTokens.sm }}>
                                <IconButton color="primary" onClick={saveEditing} disabled={loading}>
                                  <SaveIcon />
                                </IconButton>
                                <IconButton color="error" onClick={cancelEditing} disabled={loading}>
                                  <CancelIcon />
                                </IconButton>
                              </Box>
                            ) : (
                              <IconButton color="primary" onClick={() => startEditing(user.uid)} disabled={loading}>
                                <EditIcon />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* ページネーション */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: spacingTokens.md }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  disabled={loading}
                />
              </Box>
            </CardContent>
          </Card>
        </FeatureContent>
      </FeatureLayout>
      
      {/* 権限編集ダイアログ */}
      <Dialog
        open={permissionDialogOpen}
        onClose={() => setPermissionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>権限設定</DialogTitle>
        <DialogContent>
          {/* 選択ユーザー情報 */}
          {selectedUserId && (
            <Box sx={{ mb: spacingTokens.md }}>
              <Typography variant="subtitle1">
                {users.find(u => u.uid === selectedUserId)?.displayName || 'ユーザー'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {users.find(u => u.uid === selectedUserId)?.email}
              </Typography>
            </Box>
          )}
          
          <Divider sx={{ my: spacingTokens.md }} />
          
          {/* 権限選択エリア */}
          <Typography variant="subtitle2" gutterBottom>
            付与する権限を選択してください
          </Typography>
          
          {/* 権限カテゴリー別表示 */}
          {Object.entries(groupPermissionsByCategory()).map(([category, permissionList]) => (
            <Box key={category} sx={{ mb: spacingTokens.lg }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                {category}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1 }}>
                {permissionList.map(permission => (
                  <Box key={permission}>
                    <Box
                      sx={{
                        border: 1,
                        borderColor: selectedPermissions.includes(permission)
                          ? 'primary.main'
                          : 'divider',
                        borderRadius: 1,
                        p: spacingTokens.sm,
                        bgcolor: selectedPermissions.includes(permission)
                          ? 'action.selected'
                          : 'background.paper',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => handlePermissionToggle(permission)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          checked={selectedPermissions.includes(permission)}
                          color="primary"
                        />
                        <Box>
                          <Typography variant="body2" noWrap>
                            {getPermissionDisplayName(permission)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {permission}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionDialogOpen(false)}>キャンセル</Button>
          <Button onClick={savePermissions} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : '権限を保存'}
          </Button>
        </DialogActions>
      </Dialog>
    </PermissionGate>
  );
};

// ユーティリティ関数

// ロールの表示名を取得
function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: '管理者',
    [UserRole.MANAGER]: '管理職',
    [UserRole.EMPLOYEE]: '社員',
    [UserRole.GUEST]: 'ゲスト'
  };
  
  return displayNames[role] || role;
}

// 部門名を取得
function getDepartmentName(departmentId?: string): string {
  if (!departmentId) return '未設定';
  const department = DEPARTMENTS.find(d => d.id === departmentId);
  return department ? department.name : '未設定';
}

// ロールの色を取得
function getRoleColor(role: UserRole): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (role) {
    case UserRole.ADMIN:
      return 'error';
    case UserRole.MANAGER:
      return 'primary';
    case UserRole.EMPLOYEE:
      return 'success';
    case UserRole.GUEST:
      return 'default';
    default:
      return 'default';
  }
}

// 権限の表示名を取得
function getPermissionDisplayName(permission: Permission): string {
  // 権限名を「:」で分割して最後の部分を取得
  const parts = permission.split(':');
  const lastPart = parts[parts.length - 1];
  
  // アクション名の変換
  const actionMap: Record<string, string> = {
    'view': '閲覧',
    'create': '作成',
    'edit': '編集',
    'delete': '削除',
    'approve': '承認',
    'assign': '割り当て',
    'all': '全て',
    'settings': '設定',
    'management': '管理'
  };
  
  // リソース名の変換
  const resourceMap: Record<string, string> = {
    'employee': '従業員情報',
    'timecard': 'タイムカード',
    'team': 'チーム',
    'expense': '経費',
    'equipment': '機器',
    'meeting': '会議室',
    'system': 'システム',
    'user': 'ユーザー',
    'role': 'ロール'
  };
  
  // 最初の部分はリソース名
  const resource = resourceMap[parts[0]] || parts[0];
  
  // アクションとターゲットの組み合わせ
  if (parts.length === 3 && parts[2] === 'all') {
    return `${resource}（全員）${actionMap[parts[1]] || parts[1]}`;
  }
  
  // 基本的なアクションの場合
  if (parts.length === 2) {
    return `${resource}${actionMap[parts[1]] || parts[1]}`;
  }
  
  return permission;
}

// コンポーネントをデフォルトエクスポート
export default RoleManagementPage;


