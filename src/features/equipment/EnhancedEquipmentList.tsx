/**
 * 拡張備品一覧コンポーネント
 * 
 * ソート、フィルタリング、CSV出力、在庫管理機能を含む備品一覧
 * Material Design 3準拠のコンパクトデザイン
 */
import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  Paper,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Collapse,
  alpha,
  ButtonGroup,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AddCircle as AddStockIcon,
  RemoveCircle as RemoveStockIcon,
  Inventory as InventoryIcon,
  Warning as LowStockIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useEquipmentStore, EquipmentItem } from './useEquipmentStore';
import { EquipmentModal } from './EquipmentModal';
import { StockAdjustmentDialog } from './StockAdjustmentDialog';
import { surfaceStyles } from '../../theme/componentStyles';
import { spacingTokens } from '../../theme/designSystem';

// ソート関連の型定義
type SortField = 'name' | 'category' | 'quantity' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// 在庫レベルの判定
const getStockLevel = (quantity: number) => {
  if (quantity === 0) return 'out';
  if (quantity <= 5) return 'low';
  if (quantity <= 10) return 'medium';
  return 'high';
};

const stockLevelConfig = {
  out: { label: '在庫切れ', color: 'error' as const, icon: <LowStockIcon /> },
  low: { label: '在庫少', color: 'warning' as const, icon: <LowStockIcon /> },
  medium: { label: '在庫中', color: 'info' as const, icon: <InventoryIcon /> },
  high: { label: '在庫多', color: 'success' as const, icon: <InventoryIcon /> },
};

/**
 * 拡張備品一覧コンポーネント
 */
export const EnhancedEquipmentList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { items, deleteItem, adjustStock } = useEquipmentStore();

  // 状態管理
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [itemToEdit, setItemToEdit] = useState<EquipmentItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [stockAdjustmentItem, setStockAdjustmentItem] = useState<EquipmentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc',
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // メニュー関連
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuItemId, setMenuItemId] = useState<string | null>(null);

  // カテゴリの一覧を取得
  const categories = useMemo(() => {
    const categorySet = new Set(items.map(item => item.category));
    return Array.from(categorySet).sort();
  }, [items]);

  // フィルタリングとソート処理
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.note || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
      
      let matchesStock = true;
      if (stockFilter) {
        const stockLevel = getStockLevel(item.quantity);
        matchesStock = stockLevel === stockFilter;
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    });

    // ソート処理
    filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.field];
      let bValue: any = b[sortConfig.field];

      if (sortConfig.field === 'quantity') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortConfig.field === 'createdAt' || sortConfig.field === 'updatedAt') {
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
  }, [items, searchQuery, categoryFilter, stockFilter, sortConfig]);

  // ページネーション処理
  const paginatedItems = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedItems.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedItems, page, rowsPerPage]);

  // 在庫統計
  const stockStats = useMemo(() => {
    const total = items.length;
    const outOfStock = items.filter(item => item.quantity === 0).length;
    const lowStock = items.filter(item => item.quantity > 0 && item.quantity <= 5).length;
    const totalValue = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return { total, outOfStock, lowStock, totalValue };
  }, [items]);

  // ソート処理
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // 行の展開/折りたたみ
  const toggleRowExpansion = (itemId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // モーダル操作
  const handleOpenModal = (item?: EquipmentItem) => {
    if (item) {
      setItemToEdit(item);
    } else {
      setItemToEdit(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setItemToEdit(null);
  };

  // 在庫調整ダイアログ
  const handleOpenStockDialog = (item: EquipmentItem) => {
    setStockAdjustmentItem(item);
    setStockDialogOpen(true);
  };

  const handleCloseStockDialog = () => {
    setStockDialogOpen(false);
    setStockAdjustmentItem(null);
  };

  const handleStockAdjustment = (itemId: string, delta: number) => {
    adjustStock(itemId, delta);
    handleCloseStockDialog();
  };

  // 詳細表示
  const handleViewDetail = (item: EquipmentItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  // メニュー操作
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, itemId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuItemId(null);
  };

  // CSV出力
  const handleExportCSV = () => {
    const csvData = filteredAndSortedItems.map(item => ({
      名前: item.name,
      カテゴリ: item.category,
      数量: item.quantity,
      在庫レベル: stockLevelConfig[getStockLevel(item.quantity)].label,
      備考: item.note || '',
      作成日: new Date(item.createdAt).toLocaleDateString(),
      更新日: new Date(item.updatedAt).toLocaleDateString(),
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `equipment_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダーツールバー */}
      <Paper
        elevation={1}
        sx={{
          ...surfaceStyles.surface(theme),
          mb: spacingTokens.md,
          flexShrink: 0,
        }}
      >
        <Toolbar sx={{ py: spacingTokens.sm }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            備品一覧 ({filteredAndSortedItems.length}件)
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {/* 在庫統計 */}
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              <Tooltip title="在庫切れ">
                <Badge badgeContent={stockStats.outOfStock} color="error">
                  <Chip
                    icon={<LowStockIcon />}
                    label="在庫切れ"
                    size="small"
                    color={stockStats.outOfStock > 0 ? 'error' : 'default'}
                  />
                </Badge>
              </Tooltip>
              <Tooltip title="在庫少">
                <Badge badgeContent={stockStats.lowStock} color="warning">
                  <Chip
                    icon={<LowStockIcon />}
                    label="在庫少"
                    size="small"
                    color={stockStats.lowStock > 0 ? 'warning' : 'default'}
                  />
                </Badge>
              </Tooltip>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              size="small"
            >
              新規登録
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportCSV}
              size="small"
            >
              CSV出力
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* フィルターエリア */}
      <Paper
        elevation={1}
        sx={{
          ...surfaceStyles.surface(theme),
          mb: spacingTokens.md,
          flexShrink: 0,
        }}
      >
        <Box sx={{ p: spacingTokens.md }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              placeholder="名前・カテゴリ・備考で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              size="small"
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>カテゴリ</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="カテゴリ"
              >
                <MenuItem value="">すべて</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>在庫レベル</InputLabel>
              <Select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                label="在庫レベル"
              >
                <MenuItem value="">すべて</MenuItem>
                {Object.entries(stockLevelConfig).map(([level, config]) => (
                  <MenuItem key={level} value={level}>
                    {config.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </Paper>

      {/* テーブル */}
      <Paper
        elevation={1}
        sx={{
          ...surfaceStyles.surface(theme),
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell width={40}></TableCell>
                <TableCell
                  sortDirection={sortConfig.field === 'name' ? sortConfig.direction : false}
                  onClick={() => handleSort('name')}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                >
                  名前
                </TableCell>
                <TableCell
                  sortDirection={sortConfig.field === 'category' ? sortConfig.direction : false}
                  onClick={() => handleSort('category')}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                >
                  カテゴリ
                </TableCell>
                <TableCell
                  sortDirection={sortConfig.field === 'quantity' ? sortConfig.direction : false}
                  onClick={() => handleSort('quantity')}
                  sx={{ cursor: 'pointer', fontWeight: 600, textAlign: 'right' }}
                >
                  数量
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>在庫レベル</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>備考</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>在庫操作</TableCell>
                <TableCell width={60}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((item) => {
                const stockLevel = getStockLevel(item.quantity);
                const stockConfig = stockLevelConfig[stockLevel];
                
                return (
                  <React.Fragment key={item.id}>
                    <TableRow hover>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpansion(item.id)}
                        >
                          {expandedRows.has(item.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: stockLevel === 'out' ? 'error.main' : 
                                   stockLevel === 'low' ? 'warning.main' : 'text.primary'
                          }}
                        >
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={stockConfig.icon}
                          label={stockConfig.label}
                          color={stockConfig.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {item.note || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <ButtonGroup size="small" variant="outlined">
                          <Tooltip title="在庫追加">
                            <IconButton
                              size="small"
                              onClick={() => adjustStock(item.id, 1)}
                              color="success"
                            >
                              <AddStockIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="在庫減少">
                            <IconButton
                              size="small"
                              onClick={() => adjustStock(item.id, -1)}
                              disabled={item.quantity <= 0}
                              color="error"
                            >
                              <RemoveStockIcon />
                            </IconButton>
                          </Tooltip>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, item.id)}
                        >
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    
                    {/* 展開可能な詳細行 */}
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{ py: 0, border: 0 }}
                      >
                        <Collapse in={expandedRows.has(item.id)}>
                          <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                            <Stack spacing={2}>
                              <Stack direction="row" spacing={2}>
                                <Typography variant="caption" color="text.secondary">
                                  作成日: {new Date(item.createdAt).toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  更新日: {new Date(item.updatedAt).toLocaleString()}
                                </Typography>
                              </Stack>
                              
                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                  在庫調整
                                </Typography>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleOpenStockDialog(item)}
                                  disabled={stockLevel === 'out'}
                                >
                                  在庫数量を調整
                                </Button>
                              </Box>
                            </Stack>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ページネーション */}
        <TablePagination
          component="div"
          count={filteredAndSortedItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="表示件数:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}件`}
        />
      </Paper>

      {/* コンテキストメニュー */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            const item = items.find(i => i.id === menuItemId);
            if (item) {
              handleViewDetail(item);
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>詳細表示</ListItemText>
        </MenuItem>
        
        <MenuItem
          onClick={() => {
            const item = items.find(i => i.id === menuItemId);
            if (item) {
              handleOpenModal(item);
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>編集</ListItemText>
        </MenuItem>
        
        <MenuItem
          onClick={() => {
            const item = items.find(i => i.id === menuItemId);
            if (item) {
              handleOpenStockDialog(item);
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <InventoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>在庫調整</ListItemText>
        </MenuItem>
        
        <MenuItem
          onClick={() => {
            if (menuItemId) {
              deleteItem(menuItemId);
            }
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>削除</ListItemText>
        </MenuItem>
      </Menu>

      {/* 備品登録・編集モーダル */}
      <EquipmentModal
        open={modalOpen}
        onClose={handleCloseModal}
        item={itemToEdit}
      />

      {/* 在庫調整ダイアログ */}
      <StockAdjustmentDialog
        open={stockDialogOpen}
        onClose={handleCloseStockDialog}
        item={stockAdjustmentItem}
        onAdjust={handleStockAdjustment}
      />
    </Box>
  );
};
