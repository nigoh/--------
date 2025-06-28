/**
 * 社員一覧検索・フィルタリングのカスタムフック
 * 
 * 社員データの検索、フィルタリング、ページネーション機能を分離し、
 * UIコンポーネントから独立したデータ処理ロジックを提供
 */
import { useState, useMemo } from 'react';
import { Employee } from '../useEmployeeStore';

/**
 * 検索・フィルタリング設定の型定義
 */
interface FilterConfig {
  searchQuery: string;
  statusFilter: 'all' | 'active' | 'inactive';
  departmentFilter: string;
}

/**
 * ページネーション設定の型定義
 */
interface PaginationConfig {
  page: number;
  rowsPerPage: number;
}

/**
 * 社員一覧検索・フィルタリングのカスタムフック
 */
export const useEmployeeListFilter = (employees: Employee[]) => {
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    searchQuery: '',
    statusFilter: 'all',
    departmentFilter: '',
  });

  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>({
    page: 0,
    rowsPerPage: 10,
  });

  /**
   * 検索クエリによるフィルタリング
   */
  const searchFilteredEmployees = useMemo(() => {
    const query = filterConfig.searchQuery.toLowerCase();
    if (!query) return employees;

    return employees.filter(employee =>
      employee.name.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query) ||
      employee.position.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.skills.some(skill => skill.toLowerCase().includes(query))
    );
  }, [employees, filterConfig.searchQuery]);

  /**
   * ステータスによるフィルタリング
   */
  const statusFilteredEmployees = useMemo(() => {
    switch (filterConfig.statusFilter) {
      case 'active':
        return searchFilteredEmployees.filter(emp => emp.isActive);
      case 'inactive':
        return searchFilteredEmployees.filter(emp => !emp.isActive);
      default:
        return searchFilteredEmployees;
    }
  }, [searchFilteredEmployees, filterConfig.statusFilter]);

  /**
   * 部署によるフィルタリング
   */
  const departmentFilteredEmployees = useMemo(() => {
    if (!filterConfig.departmentFilter) return statusFilteredEmployees;
    
    return statusFilteredEmployees.filter(emp => 
      emp.department === filterConfig.departmentFilter
    );
  }, [statusFilteredEmployees, filterConfig.departmentFilter]);

  /**
   * 最終的なフィルタリング結果
   */
  const filteredEmployees = departmentFilteredEmployees;

  /**
   * ページネーション適用後のデータ
   */
  const paginatedEmployees = useMemo(() => {
    const startIndex = paginationConfig.page * paginationConfig.rowsPerPage;
    return filteredEmployees.slice(
      startIndex,
      startIndex + paginationConfig.rowsPerPage
    );
  }, [filteredEmployees, paginationConfig]);

  /**
   * 利用可能な部署リストを取得
   */
  const availableDepartments = useMemo(() => {
    const departments = [...new Set(employees.map(emp => emp.department))];
    return departments.sort();
  }, [employees]);

  /**
   * 検索クエリを更新
   */
  const updateSearchQuery = (query: string) => {
    setFilterConfig(prev => ({ ...prev, searchQuery: query }));
    // 検索時は最初のページに戻る
    setPaginationConfig(prev => ({ ...prev, page: 0 }));
  };

  /**
   * ステータスフィルターを更新
   */
  const updateStatusFilter = (status: FilterConfig['statusFilter']) => {
    setFilterConfig(prev => ({ ...prev, statusFilter: status }));
    setPaginationConfig(prev => ({ ...prev, page: 0 }));
  };

  /**
   * 部署フィルターを更新
   */
  const updateDepartmentFilter = (department: string) => {
    setFilterConfig(prev => ({ ...prev, departmentFilter: department }));
    setPaginationConfig(prev => ({ ...prev, page: 0 }));
  };

  /**
   * ページを変更
   */
  const changePage = (newPage: number) => {
    setPaginationConfig(prev => ({ ...prev, page: newPage }));
  };

  /**
   * 1ページあたりの行数を変更
   */
  const changeRowsPerPage = (newRowsPerPage: number) => {
    setPaginationConfig({ page: 0, rowsPerPage: newRowsPerPage });
  };

  /**
   * フィルターをリセット
   */
  const resetFilters = () => {
    setFilterConfig({
      searchQuery: '',
      statusFilter: 'all',
      departmentFilter: '',
    });
    setPaginationConfig({ page: 0, rowsPerPage: 10 });
  };

  /**
   * 統計情報を計算
   */
  const statistics = useMemo(() => {
    const activeCount = employees.filter(emp => emp.isActive).length;
    const inactiveCount = employees.length - activeCount;
    
    return {
      total: employees.length,
      active: activeCount,
      inactive: inactiveCount,
      filtered: filteredEmployees.length,
    };
  }, [employees, filteredEmployees]);

  return {
    // フィルタリング結果
    filteredEmployees,
    paginatedEmployees,
    
    // フィルタリング設定
    filterConfig,
    paginationConfig,
    
    // 利用可能な選択肢
    availableDepartments,
    
    // フィルター操作
    updateSearchQuery,
    updateStatusFilter,
    updateDepartmentFilter,
    resetFilters,
    
    // ページネーション操作
    changePage,
    changeRowsPerPage,
    
    // 統計情報
    statistics,
  };
};

export default useEmployeeListFilter;
