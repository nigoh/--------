/**
 * 拡張社員一覧コンポーネント
 * 
 * ソート、フィルタリング、CSVエクスポート機能を含む社員一覧
 * Material Design 3準拠のコンパクトデザイン
 */
import React, { useState, useMemo, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useEmployeeStore, Employee } from './useEmployeeStore';
import { useTemporary } from '../../hooks/useTemporary';
import { DEPARTMENTS, Department } from './constants/employeeFormConstants';
import { EmployeeModal } from './components/EmployeeDialogs';
import { spacingTokens } from '../../theme/designSystem';
import EmployeeListHeader from './components/EmployeeListHeader';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeTable, { SortField } from './components/EmployeeTable';

// ソート方向の型定義
type SortDirection = 'asc' | 'desc';
interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface EnhancedEmployeeListProps {
  externalSearchQuery?: string;
  onExternalSearchChange?: (query: string) => void;
  triggerAddEmployee?: boolean;
  externalDepartmentFilter?: string;
  externalStatusFilter?: string;
  onExternalDepartmentChange?: (value: string) => void;
  onExternalStatusChange?: (value: string) => void;
  onExternalClearFilters?: () => void;
  hideFilters?: boolean;
}

/**
 * 拡張社員一覧コンポーネント
 */
export const EnhancedEmployeeList: React.FC<EnhancedEmployeeListProps> = ({
  externalSearchQuery,
  onExternalSearchChange,
  triggerAddEmployee = false,
  externalDepartmentFilter,
  externalStatusFilter,
  onExternalDepartmentChange,
  onExternalStatusChange,
  onExternalClearFilters,
  hideFilters = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { employees, deleteEmployee, toggleEmployeeStatus } = useEmployeeStore();
  const { toast, progress, clipboard } = useTemporary();

  // 状態管理
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '');
  const [departmentFilter, setDepartmentFilter] = useState(externalDepartmentFilter || '');
  const [statusFilter, setStatusFilter] = useState(externalStatusFilter || '');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc',
  });

  // 部署の一覧を定数から取得
  const departments = useMemo(() => {
    return DEPARTMENTS as readonly Department[];
  }, []);

  /**
   * 新規登録
   */
  const handleAddEmployee = () => {
    setEmployeeToEdit(null);
    setModalOpen(true);
  };

  // 外部検索クエリとの同期
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // 外部フィルターとの同期
  useEffect(() => {
    if (externalDepartmentFilter !== undefined) {
      setDepartmentFilter(externalDepartmentFilter);
    }
  }, [externalDepartmentFilter]);

  useEffect(() => {
    if (externalStatusFilter !== undefined) {
      setStatusFilter(externalStatusFilter);
    }
  }, [externalStatusFilter]);

  // 外部からの新規追加トリガー
  useEffect(() => {
    if (triggerAddEmployee) {
      handleAddEmployee();
    }
  }, [triggerAddEmployee]);

  // 検索クエリ変更の通知
  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    if (onExternalSearchChange) {
      onExternalSearchChange(newQuery);
    }
  };

  // 部署フィルター変更の通知
  const handleDepartmentChange = (newDepartment: string) => {
    setDepartmentFilter(newDepartment);
    if (onExternalDepartmentChange) {
      onExternalDepartmentChange(newDepartment);
    }
  };

  // ステータスフィルター変更の通知
  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    if (onExternalStatusChange) {
      onExternalStatusChange(newStatus);
    }
  };

  // フィルタークリアの通知
  const handleClearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('');
    setStatusFilter('');
    if (onExternalClearFilters) {
      onExternalClearFilters();
    }
  };

  // フィルタリングとソート
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = (
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
      const matchesStatus = !statusFilter || 
        (statusFilter === 'active' ? employee.isActive : !employee.isActive);
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // ソート
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.field];
      const bVal = b[sortConfig.field];
      
      // undefined値の処理
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;
      
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [employees, searchQuery, departmentFilter, statusFilter, sortConfig]);

  // ページネーション用データ
  const paginatedEmployees = filteredAndSortedEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /**
   * ソート処理
   */
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  /**
   * CSVエクスポート
   */
  const exportToCSV = () => {
    const headers = ['氏名', '部署', '役職', 'メール', '電話', '入社日', 'ステータス', 'スキル'];
    const csvData = filteredAndSortedEmployees.map(emp => [
      emp.name,
      emp.department,
      emp.position,
      emp.email,
      emp.phone || '',
      emp.joinDate,
      emp.isActive ? '在籍' : '退職',
      emp.skills.join(';'),
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `社員一覧_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSVファイルをダウンロードしました');
  };

  /**
   * 編集
   */
  const handleEditEmployee = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setModalOpen(true);
  };

  /**
   * 社員詳細表示
   */
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailModalOpen(true);
  };

  /**
   * 削除処理
   */
  const handleDeleteEmployee = async (employee: Employee) => {
    const confirmed = window.confirm(`本当に「${employee.name}」を削除しますか？\nこの操作は取り消せません。`);
    if (!confirmed) return;

    progress.start('社員情報を削除中...', 1);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      deleteEmployee(employee.id);
      progress.complete();
      toast.success(`${employee.name}さんの情報を削除しました`);
      
      setTimeout(() => progress.clear(), 1000);
    } catch (err) {
      progress.error();
      toast.error('削除に失敗しました');
      setTimeout(() => progress.clear(), 2000);
    }
  };

  /**
   * ステータス切り替え
   */
  const handleToggleStatus = (employee: Employee) => {
    toggleEmployeeStatus(employee.id);
    const newStatus = employee.isActive ? '無効' : '有効';
    toast.info(`${employee.name}さんのステータスを${newStatus}に変更しました`);
  };

  /**
   * メールアドレスをコピー
   */
  const handleCopyEmail = (email: string, employeeName: string) => {
    clipboard.copy(email);
    toast.success(`${employeeName}さんのメールアドレスをコピーしました`);
  };

  /**
   * 社員名の初期文字を取得
   */
  const getInitials = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  /**
   * 日付をフォーマット
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダー・フィルターエリア */}
      <Box sx={{ 
        display: 'flex', 
        gap: spacingTokens.md,
        mb: spacingTokens.sm,
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'stretch', lg: 'flex-start' }
      }}>
        {/* 左側: フィルターエリア */}
        {!hideFilters && (
          <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: '400px' } }}>
            <EmployeeFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              departments={departments}
              departmentFilter={departmentFilter}
              statusFilter={statusFilter}
              onDepartmentChange={handleDepartmentChange}
              onStatusChange={handleStatusChange}
              onClearFilters={handleClearFilters}
            />
          </Box>
        )}
        
        {/* 右側: ヘッダーエリア */}
        <Box sx={{ 
          flexShrink: 0,
          minWidth: { xs: '100%', lg: 'auto' },
          display: 'flex',
          alignItems: 'flex-end'
        }}>
          <EmployeeListHeader
            count={filteredAndSortedEmployees.length}
            onExport={exportToCSV}
            onAdd={handleAddEmployee}
            disableExport={filteredAndSortedEmployees.length === 0}
          />
        </Box>
      </Box>
      
      {/* テーブルエリア */}
      <EmployeeTable
        employees={employees}
        paginatedEmployees={paginatedEmployees}
        sortConfig={sortConfig}
        onSort={handleSort}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setPage(0);
        }}
        isMobile={isMobile}
        getInitials={getInitials}
        formatDate={formatDate}
        onView={handleViewEmployee}
        onEdit={handleEditEmployee}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteEmployee}
        onCopyEmail={handleCopyEmail}
        filteredCount={filteredAndSortedEmployees.length}
      />
      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={employeeToEdit}
      />
      {selectedEmployee && (
        <EmployeeModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          employee={selectedEmployee}
        />
      )}
    </Box>
  );
};
