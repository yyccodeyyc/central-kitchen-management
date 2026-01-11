import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Refresh,
  Assessment,
  Inventory,
  People
} from '@mui/icons-material';
import { ApiService } from '../../services/api';
import { DashboardData, KPI, AlertData } from '../../types';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [alerts, setAlerts] = useState<AlertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 模拟数据加载（因为后端API可能还没准备好）
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟数据
      const mockKPIs: KPI = {
        productionEfficiency: 88.9,
        qualityPassRate: 96.5,
        costPerUnit: 12.5,
        customerSatisfaction: 4.6,
        onTimeDelivery: 98.2,
        inventoryTurnover: 12.3
      };

      const mockAlerts: AlertData = {
        inventoryAlerts: {
          expiredItems: [],
          expiringSoonItems: [],
          lowStockItems: ['大白菜', '猪肉'],
          totalAlerts: 2
        },
        demandPrediction: {
          predictedDemand: { '大白菜': 500, '猪肉': 200, '鸡蛋': 300 },
          nextWeekTotal: 1000
        },
        reorderAlerts: {
          reorderItems: {},
          totalReorderAlerts: 0
        },
        qualityAlerts: {
          failedInspections: [],
          quarantinedItems: [],
          totalQualityAlerts: 0
        }
      };

      setKpis(mockKPIs);
      setAlerts(mockAlerts);
    } catch (err) {
      setError('加载数据失败，请稍后重试');
      console.error('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleInventoryCheck = async () => {
    try {
      await ApiService.triggerInventoryCheck();
      loadDashboardData();
    } catch (err) {
      console.error('Inventory check failed:', err);
    }
  };

  const handleQualityCheck = async () => {
    try {
      await ApiService.triggerQualityCheck();
      loadDashboardData();
    } catch (err) {
      console.error('Quality check failed:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          正在加载仪表板数据...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              重试
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // 模拟图表数据
  const costTrendData = {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
    series: [{
      name: '成本趋势',
      data: [12500, 12200, 12800, 12100, 11900, 12500],
      type: 'line' as const
    }]
  };

  const qualityIssueData = [
    { name: '合格', value: 965 },
    { name: '不合格', value: 35 }
  ];

  const storeRankingData = {
    xAxis: ['门店A', '门店B', '门店C', '门店D', '门店E'],
    series: [{
      name: '销售额',
      data: [45000, 38000, 42000, 35000, 32000],
      type: 'bar' as const
    }]
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 头部标题栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          🏭 中央厨房管理系统仪表板
        </Typography>
        <Box>
          <Tooltip title="手动库存检查">
            <IconButton onClick={handleInventoryCheck} sx={{ mr: 1 }}>
              <Inventory />
            </IconButton>
          </Tooltip>
          <Tooltip title="手动质量检查">
            <IconButton onClick={handleQualityCheck} sx={{ mr: 1 }}>
              <CheckCircle />
            </IconButton>
          </Tooltip>
          <Tooltip title="刷新数据">
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* KPI 卡片 */}
      {kpis && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Assessment sx={{ color: '#1976d2', mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    生产效率
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  {kpis.productionEfficiency.toFixed(1)}%
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="success.main">
                    目标: >85%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f3e5f5', border: '1px solid #ce93d8', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle sx={{ color: '#7b1fa2', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#7b1fa2' }}>
                    质量合格率
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                  {kpis.qualityPassRate.toFixed(1)}%
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="success.main">
                    目标: >95%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff3e0', border: '1px solid #ffcc02', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp sx={{ color: '#f57c00', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#f57c00' }}>
                    单位成本
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                  ¥{kpis.costPerUnit.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingDown sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="success.main" dangerouslySetInnerHTML={{ __html: '目标: <¥12.00' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e8f5e8', border: '1px solid #81c784', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People sx={{ color: '#388e3c', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#388e3c' }}>
                    客户满意度
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                  {kpis.customerSatisfaction.toFixed(1)}分
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="success.main">
                    目标: >4.5分
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* 预警信息 */}
      {alerts && (alerts.inventoryAlerts.totalAlerts > 0 || alerts.qualityAlerts.totalQualityAlerts > 0) && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            ⚠️ 系统预警
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {alerts.inventoryAlerts.totalAlerts > 0 && (
              <Chip
                icon={<Warning />}
                label={`库存预警: ${alerts.inventoryAlerts.totalAlerts}项`}
                color="warning"
                size="small"
              />
            )}
            {alerts.qualityAlerts.totalQualityAlerts > 0 && (
              <Chip
                icon={<Warning />}
                label={`质量问题: ${alerts.qualityAlerts.totalQualityAlerts}项`}
                color="error"
                size="small"
              />
            )}
          </Box>
        </Alert>
      )}

      {/* 图表区域 */}
      <Grid container spacing={3}>
        {/* 成本趋势图 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '450px', borderRadius: 2 }}>
            <LineChart
              data={costTrendData}
              title="💰 成本趋势分析 (最近6个月)"
              height="380px"
            />
          </Paper>
        </Grid>

        {/* 质量问题分布 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '450px', borderRadius: 2 }}>
            <PieChart
              data={qualityIssueData}
              title="✅ 质量合格率分布"
              height="380px"
              donut={true}
            />
          </Paper>
        </Grid>

        {/* 门店销售排名 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '450px', borderRadius: 2 }}>
            <BarChart
              data={storeRankingData}
              title="🏪 门店销售排名 (本月)"
              height="380px"
              horizontal={true}
            />
          </Paper>
        </Grid>

        {/* 产能利用率 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              ⚡ 产能利用率
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                今日目标: 1,000 份
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                实际完成: 890 份
              </Typography>
              <Typography variant="body2" color="text.secondary">
                完成率: 89.0%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={89.0}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#4caf50',
                  borderRadius: 6
                }
              }}
            />
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', fontWeight: 'bold' }}>
              89.0% 产能利用率
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 底部信息 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          🚀 学习老乡鸡和蜜雪冰城的最佳实践 - 打造中国版中央厨房连锁品牌
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
