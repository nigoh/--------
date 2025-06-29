import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, Stack, Avatar, Box, TablePagination, Paper, Typography } from '@mui/material';
import { Delete, Visibility, PersonOff, Person } from '@mui/icons-material';
import { Employee } from '../useEmployeeStore';

interface Props {
  employees: Employee[];
  paginated: Employee[];
  page: number;
  rows: number;
  onPage: (e: unknown, p: number) => void;
  onRows: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onView: (e: Employee) => void;
  onToggle: (e: Employee) => void;
  onDelete: (e: Employee) => void;
  onCopy: (email: string, name: string) => void;
  getInitials: (n: string) => string;
  formatDate: (d: string) => string;
}

const EmployeeListTable: React.FC<Props> = (p) => (
  <>
    <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 1 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(33,150,243,0.1)' }}>
            {['社員', '部署', '役職', 'スキル', '入社日', 'ステータス', '操作'].map((h) => (
              <TableCell key={h} align={h === '操作' ? 'center' : 'left'}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {p.paginated.map((e) => (
            <TableRow key={e.id} sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }, opacity: e.isActive ? 1 : 0.6 }}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>{p.getInitials(e.name)}</Avatar>
                  <Box>
                    <span style={{ fontWeight: 'bold' }}>{e.name}</span>
                    <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => p.onCopy(e.email, e.name)} title="クリックでコピー">{e.email}</Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{e.department}</TableCell>
              <TableCell>{e.position}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                  {e.skills.slice(0, 3).map((s) => <Chip key={s} label={s} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />)}
                  {e.skills.length > 3 && <Chip label={`+${e.skills.length - 3}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />}
                </Box>
              </TableCell>
              <TableCell>{p.formatDate(e.joinDate)}</TableCell>
              <TableCell>
                <Chip label={e.isActive ? '在籍' : '退職'} color={e.isActive ? 'success' : 'default'} size="small" icon={e.isActive ? <Person /> : <PersonOff />} />
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={0.5} justifyContent="center">
                  <Tooltip title="詳細表示">
                    <IconButton size="small" onClick={() => p.onView(e)} sx={{ color: 'primary.main' }}><Visibility fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title={e.isActive ? '退職にする' : '復職にする'}>
                    <IconButton size="small" onClick={() => p.onToggle(e)} sx={{ color: e.isActive ? 'warning.main' : 'success.main' }}>{e.isActive ? <PersonOff fontSize="small" /> : <Person fontSize="small" />}</IconButton>
                  </Tooltip>
                  <Tooltip title="削除">
                    <IconButton size="small" onClick={() => p.onDelete(e)} sx={{ color: 'error.main' }}><Delete fontSize="small" /></IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination component="div" count={p.employees.length} page={p.page} onPageChange={p.onPage} rowsPerPage={p.rows} onRowsPerPageChange={p.onRows} rowsPerPageOptions={[5, 10, 25, 50]} labelRowsPerPage="表示件数:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}件`} sx={{ mt: 1.5, '& .MuiTablePagination-toolbar': { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 1 } }} />
  </>
);

export default EmployeeListTable;
