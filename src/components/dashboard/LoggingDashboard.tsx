import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { FeatureLayout, FeatureHeader, FeatureContent } from '../../components/layout';
import { 
  useLoggingAnalytics, 
  type PerformanceEndpoint,
  type UserLogin,
  type SecurityActivity,
  type FeatureUsage,
} from '../../hooks/logging';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`logging-tabpanel-${index}`}
      aria-labelledby={`logging-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

export default function LoggingDashboard() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const { analytics, isLoading, refresh } = useLoggingAnalytics();

  // メトリクスカード設定
  const metricCards = useMemo(() => [
    {
      title: 'API応答時間',
      value: `${analytics?.metrics.apiResponseTime || 0}ms`,
      description: '平均API応答時間',
      icon: SpeedIcon,
      color: theme.palette.primary.main,
      trend: 2.5,
      progress: 75,
    },
    {
      title: 'エラー率',
      value: `${analytics?.metrics.errorRate || 0}%`,
      description: '24時間のエラー率',
      icon: WarningIcon,
      color: theme.palette.error.main,
      trend: -1.2,
      progress: 15,
    },
    {
      title: '成功率',
      value: `${analytics?.metrics.successRate || 0}%`,
      description: '24時間の成功率',
      icon: CheckCircleIcon,
      color: theme.palette.success.main,
      trend: 0.8,
      progress: 98,
    },
    {
      title: 'アクティブユーザー',
      value: `${analytics?.metrics.activeUsers || 0}`,
      description: '現在のアクティブユーザー',
      icon: AnalyticsIcon,
      color: theme.palette.info.main,
      trend: 5.3,
      progress: 80,
    },
  ], [analytics, theme]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (isLoading && !analytics) {
    return (
      <FeatureLayout>
        <FeatureHeader
          title="ロギングダッシュボード"
          subtitle="データを読み込み中..."
          showAddButton={false}
        />
        <FeatureContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
          </Box>
        </FeatureContent>
      </FeatureLayout>
    );
  }

  return (
    <FeatureLayout>
      <FeatureHeader
        title="ロギングダッシュボード"
        subtitle="システムの監視・分析・パフォーマンス追跡"
        showAddButton={false}
      />
      
      <FeatureContent>
        {/* メトリクス概要カード */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, 
          gap: 3, 
          mb: 4 
        }}>
          {metricCards.map((card, index) => (
            <Card key={index} sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(card.color, 0.1)}, ${alpha(card.color, 0.05)})`,
              border: `1px solid ${alpha(card.color, 0.2)}`,
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <card.icon sx={{ color: card.color, mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: card.color }}>
                    {card.value}
                  </Typography>
                  {card.trend !== 0 && (
                    <Chip
                      size="small"
                      label={`${card.trend > 0 ? '+' : ''}${card.trend.toFixed(1)}%`}
                      color={card.trend > 0 ? 'success' : 'error'}
                      sx={{ ml: 'auto', fontWeight: 600 }}
                    />
                  )}
                </Box>
                <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {card.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.description}
                </Typography>
                {card.progress && (
                  <LinearProgress
                    variant="determinate"
                    value={card.progress}
                    sx={{ 
                      mt: 2, 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: alpha(card.color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: card.color,
                        borderRadius: 3,
                      }
                    }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* タブパネル */}
        <Paper sx={{ width: '100%', mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="ロギングダッシュボードタブ"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="パフォーマンス分析" icon={<SpeedIcon />} iconPosition="start" />
              <Tab label="ユーザー活動" icon={<AnalyticsIcon />} iconPosition="start" />
              <Tab label="セキュリティイベント" icon={<SecurityIcon />} iconPosition="start" />
              <Tab label="機能統計" icon={<TrendingUpIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* パフォーマンス分析タブ */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                パフォーマンス分析
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                gap: 3, 
                mb: 3 
              }}>
                {/* API応答時間分析 */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>API応答時間トレンド</Typography>
                    <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="text.secondary">
                        {analytics?.performanceAnalysis.slowestEndpoints.length ? 
                          `${analytics.performanceAnalysis.slowestEndpoints.length}個のエンドポイントを監視中` :
                          'チャートデータを準備中...'
                        }
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* エラー分析 */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>エラー分析</Typography>
                    <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="text.secondary">
                        {analytics?.errorAnalysis.commonErrors.length ?
                          `${analytics.errorAnalysis.commonErrors.length}種類のエラーを検出` :
                          'エラーデータを分析中...'
                        }
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* 最も遅いエンドポイント */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>最も遅いエンドポイント</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>エンドポイント</TableCell>
                          <TableCell>平均応答時間</TableCell>
                          <TableCell>呼び出し回数</TableCell>
                          <TableCell>ステータス</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analytics?.performanceAnalysis.slowestEndpoints.slice(0, 5).map((endpoint: PerformanceEndpoint, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{endpoint.endpoint}</TableCell>
                            <TableCell>{endpoint.avgResponseTime}ms</TableCell>
                            <TableCell>{endpoint.callCount}</TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                label={endpoint.avgResponseTime > 1000 ? '遅い' : '正常'} 
                                color={endpoint.avgResponseTime > 1000 ? 'error' : 'success'}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* ユーザー活動タブ */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                ユーザー活動監視
              </Typography>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                gap: 3, 
                mb: 3 
              }}>
                {/* アクティブユーザー統計 */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>リアルタイムユーザー</Typography>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                        {analytics?.metrics.activeUsers || 0}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        現在オンライン
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* 地域別アクセス */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>地域別アクセス</Typography>
                    <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="text.secondary">地域データを表示中...</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* 最近のユーザー活動 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>最近のユーザー活動</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ユーザーID</TableCell>
                          <TableCell>アクション</TableCell>
                          <TableCell>時刻</TableCell>
                          <TableCell>IP</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analytics?.userActivity.recentLogins.slice(0, 5).map((login: UserLogin, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{login.userId}</TableCell>
                            <TableCell>ログイン</TableCell>
                            <TableCell>{new Date(login.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{login.ipAddress}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* セキュリティイベントタブ */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                セキュリティイベント監視
              </Typography>

              {/* セキュリティアラート */}
              {analytics?.securityEvents.suspiciousActivities.length && analytics.securityEvents.suspiciousActivities.length > 0 && (
                <Alert 
                  severity="warning" 
                  sx={{ mb: 3 }}
                  action={
                    <Chip 
                      label={`${analytics.securityEvents.suspiciousActivities.length}件`}
                      color="warning"
                      size="small"
                    />
                  }
                >
                  疑わしい活動が検出されました
                </Alert>
              )}

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                gap: 3, 
                mb: 3 
              }}>
                {/* セキュリティスコア */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>セキュリティスコア</Typography>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h2" color="success.main" sx={{ fontWeight: 700 }}>
                        95
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        / 100点
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={95} 
                        color="success"
                        sx={{ mt: 2, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* 脅威レベル */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>脅威レベル</Typography>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Chip 
                        label="低"
                        color="success"
                        sx={{ fontSize: '1.2rem', px: 3, py: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        現在の脅威レベルは低です
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* 疑わしい活動 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>疑わしい活動</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>タイプ</TableCell>
                          <TableCell>詳細</TableCell>
                          <TableCell>時刻</TableCell>
                          <TableCell>重要度</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analytics?.securityEvents.suspiciousActivities && analytics.securityEvents.suspiciousActivities.map((activity: SecurityActivity, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{activity.type}</TableCell>
                            <TableCell>{activity.description}</TableCell>
                            <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                label={activity.severity} 
                                color={
                                  activity.severity === 'high' ? 'error' : 
                                  activity.severity === 'medium' ? 'warning' : 'info'
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* 機能統計タブ */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                機能使用統計
              </Typography>

              {/* 機能使用率 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>機能別使用率（24時間）</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>機能名</TableCell>
                          <TableCell>使用回数</TableCell>
                          <TableCell>ユニークユーザー</TableCell>
                          <TableCell>使用率</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analytics?.featureUsage && analytics.featureUsage.map((feature: FeatureUsage, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{feature.featureName}</TableCell>
                            <TableCell>{feature.usageCount}</TableCell>
                            <TableCell>{feature.uniqueUsers}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={feature.usageRate} 
                                  sx={{ width: 100, height: 6, borderRadius: 3 }}
                                />
                                <Typography variant="body2">{feature.usageRate}%</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </Paper>
      </FeatureContent>
    </FeatureLayout>
  );
}
