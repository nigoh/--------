/**
 * 経費一覧のフィルタリング・ソート機能を管理するカスタムフック
 */
import { useState, useMemo } from 'react';
import { ExpenseEntry } from '../useExpenseStore';
import { STATUS_CONFIG } from '../constants/expenseConstants';

export type SortField = 'date' | 'category' | 'amount' | 'status' | 'submittedDate';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface ExpenseFilters {
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
}

export const useExpenseListFilter = (expenses: ExpenseEntry[]) => {
  // フィルター状態
  const [filters, setFilters] = useState<ExpenseFilters>({
    searchQuery: '',
    categoryFilter: '',
    statusFilter: '',
  });

  // ソート状態
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc',
  });

  // カテゴリの一覧を取得
  const categories = useMemo(() => {
    const categorySet = new Set(expenses.map(expense => expense.category));
    return Array.from(categorySet).sort();
  }, [expenses]);

  // フィルタリングとソート処理
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch = filters.searchQuery === '' || 
        (expense.note || '').toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesCategory = filters.categoryFilter === '' || expense.category === filters.categoryFilter;
      const matchesStatus = filters.statusFilter === '' || expense.status === filters.statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // ソート処理
    filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.field];
      let bValue: any = b[sortConfig.field];

      if (sortConfig.field === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortConfig.field === 'date' || sortConfig.field === 'submittedDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [expenses, filters, sortConfig]);

  // フィルター更新関数
  const updateFilter = (key: keyof ExpenseFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // ソート処理
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // フィルタークリア
  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      categoryFilter: '',
      statusFilter: '',
    });
  };

  // アクティブなフィルター数
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.categoryFilter) count++;
    if (filters.statusFilter) count++;
    return count;
  }, [filters]);

  return {
    filters,
    sortConfig,
    categories,
    filteredAndSortedExpenses,
    updateFilter,
    handleSort,
    clearFilters,
    activeFilterCount,
  };
};
