/**
 * ユーザー統計カード表示コンポーネント
 */
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Groups as GroupsIcon,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { UserStats } from '../types';
import { ROLE_LABELS, DEPARTMENT_LABELS } from '../constants/userConstants';
import { UserRole } from '@/auth';

interface UserStatsCardsProps {
  stats: UserStats;
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({ stats }) => {
  const activeRate = stats.total > 0 ? (stats.active / stats.total) * 100 : 0;

  return (
    <Grid container spacing={2}>
      {/* 総ユーザー数 */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" component="div">
                総ユーザー数:
              </Typography>
              <Typography variant="body2" component="div" color="primary">
                {stats.total.toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              アクティブ: {stats.active} / 非アクティブ: {stats.inactive}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={activeRate}
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                アクティブ率: {activeRate.toFixed(1)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* ロール別統計 */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AdminIcon color="secondary" sx={{ mr: 1 }} />
              <Typography variant="body2" component="div">
                ロール別
              </Typography>
            </Box>
            <Box sx={{ mt: 1 }}>
              {Object.entries(stats.byRole).map(([role, count]) => (
                count > 0 && (
                  <Box
                    key={role}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2">
                      {ROLE_LABELS[role as UserRole]}
                    </Typography>
                    <Chip
                      label={count}
                      size="small"
                      color={role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN ? 'error' : 'default'}
                    />
                  </Box>
                )
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 部署別統計 */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WorkIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="body2" component="div">
                部署別
              </Typography>
            </Box>
            <Box sx={{ mt: 1, maxHeight: 120, overflow: 'auto' }}>
              {Object.entries(stats.byDepartment)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([dept, count]) => (
                  <Box
                    key={dept}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2">
                      {DEPARTMENT_LABELS[dept as keyof typeof DEPARTMENT_LABELS] || dept}
                    </Typography>
                    <Chip label={count} size="small" />
                  </Box>
                ))}
              {Object.keys(stats.byDepartment).length > 5 && (
                <Typography variant="caption" color="text.secondary">
                  他 {Object.keys(stats.byDepartment).length - 5} 部署
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 最近の動向 */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="body2" component="div">
                最近の動向: 
              </Typography>
              <Typography variant="body2" component="div" color="success.main">
                +{stats.recentJoins}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              最近1ヶ月の新規入社
            </Typography>
            {stats.recentJoins > 0 && (
              <Chip
                label="成長中"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
