/**
 * 社員一覧表示コンポーネント
 * 
 * 登録済みの社員リストを表示し、編集・削除・ステータス変更機能を提供
 */
import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useEmployeeStore } from './useEmployeeStore';
import { Employee } from './useEmployeeStore';
import { useTemporary } from '../../hooks/useTemporary';
import SearchField from './components/SearchField';
import EmployeeListTable from './components/EmployeeListTable';
import EmployeeDialogs from './components/EmployeeDialogs';

/**
 * 社員一覧コンポーネント
 */
export const EmployeeList: React.FC = () => {
  const { employees, deleteEmployee, toggleEmployeeStatus } = useEmployeeStore();
  const { toast, progress, clipboard } = useTemporary();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 検索フィルタリング
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ページネーション用データ
  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /**
   * 社員詳細表示
   */
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  /**
   * 社員詳細ダイアログを閉じる
   */
  const handleCloseDetail = () => {
    setSelectedEmployee(null);
  };

  /**
   * 削除確認ダイアログを開く
   */
  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteConfirmOpen(true);
  };

  /**
   * 削除実行
   */
  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      progress.start('社員情報を削除中...', 1);
      
      try {
        // 擬似的な遅延
        await new Promise(resolve => setTimeout(resolve, 800));
        
        deleteEmployee(employeeToDelete.id);
        progress.complete();
        
        toast.success(`${employeeToDelete.name}さんの情報を削除しました`);
        
        setDeleteConfirmOpen(false);
        setEmployeeToDelete(null);
        
        // 1秒後に進行状況をクリア
        setTimeout(() => {
          progress.clear();
        }, 1000);
        
      } catch (err) {
        progress.error();
        toast.error('削除に失敗しました');
        
        setTimeout(() => {
          progress.clear();
        }, 2000);
      }
    }
  };

  /**
   * 削除キャンセル
   */
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setEmployeeToDelete(null);
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
   * メールアドレスをクリップボードにコピー
   */
  const handleCopyEmail = (email: string, employeeName: string) => {
    clipboard.copy(email);
    toast.success(`${employeeName}さんのメールアドレスをコピーしました`);
  };

  /**
   * ページ変更
   */
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * 表示件数変更
   */
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 1.5, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold', fontSize: '1.25rem' }}>
          社員一覧
        </Typography>
        <SearchField value={searchQuery} onChange={setSearchQuery} />
      </Box>
      {employees.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>まだ社員が登録されていません</Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>「社員登録」タブから新しい社員を登録してください</Typography>
        </Box>
      ) : (
        <EmployeeListTable
          employees={filteredEmployees}
          paginated={paginatedEmployees}
          page={page}
          rows={rowsPerPage}
          onPage={handleChangePage}
          onRows={handleChangeRowsPerPage}
          onView={handleViewEmployee}
          onToggle={handleToggleStatus}
          onDelete={handleDeleteClick}
          onCopy={handleCopyEmail}
          getInitials={getInitials}
          formatDate={formatDate}
        />
      )}
      <EmployeeDialogs
        selected={selectedEmployee}
        onCloseDetail={handleCloseDetail}
        deleteOpen={deleteConfirmOpen}
        deleting={employeeToDelete}
        onCancelDelete={handleCancelDelete}
        onConfirmDelete={handleConfirmDelete}
        formatDate={formatDate}
      />
    </Paper>
  );
};
