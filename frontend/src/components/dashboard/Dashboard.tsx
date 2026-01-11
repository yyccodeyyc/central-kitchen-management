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
  Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Refresh,
  Assessment,
  Inventory,
  People,
  Engineering,
  Science,
  Business,
  Visibility,
  Kitchen
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ApiService } from '../../services/api';
import { DashboardData, KPI, AlertData, UserRole } from '../../types';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
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

  // 根据角色获取专属的仪表板配置
  const getRoleDashboardConfig = () => {
    switch (user?.role) {
      case 'ADMIN':
        return {
          title: '系统总览仪表板',
          subtitle: '全系统运营监控与管理',
          focus: '系统整体运营状态'
        };
      case 'PRODUCTION_MANAGER':
        return {
          title: '生产仪表板',
          subtitle: '生产流程监控与优化',
          focus: '生产效率和质量控制'
        };
      case 'QUALITY_INSPECTOR':
        return {
          title: '质量仪表板',
          subtitle: '质量检测与追溯管理',
          focus: '质量检测和问题追踪'
        };
      case 'INVENTORY_MANAGER':
        return {
          title: '库存仪表板',
          subtitle: '库存管理与物料监控',
          focus: '库存水平和物料管理'
        };
      case 'SUPPLIER_REPRESENTATIVE':
        return {
          title: '供应商仪表板',
          subtitle: '供应商管理与合作监控',
          focus: '供应商绩效和质量反馈'
        };
      case 'VIEWER':
      default:
        return {
          title: '数据概览',
          subtitle: '系统运行状态监控',
          focus: '整体系统状态查看'
        };
    }
  };

  const config = getRoleDashboardConfig();

  // 模拟图表数据
  const costTrendData = {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
    series: [{
      name: '趋势数据',
      data: [12500, 12200, 12800, 12100, 11900, 12500],
      type: 'line' as const
    }]
  };

  const qualityIssueData = [
    { name: '正常', value: 965 },
    { name: '异常', value: 35 }
  ];

  const storeRankingData = {
    xAxis: ['部门A', '部门B', '部门C', '部门D', '部门E'],
    series: [{
      name: '绩效指标',
      data: [45000, 38000, 42000, 35000, 32000],
      type: 'bar' as const
    }]
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 角色专属欢迎头部 */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 4,
        borderRadius: 3,
        mb: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          🍽️ {config.title}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
          {config.subtitle}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={config.focus}
            color="primary"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white', fontSize: '1rem', py: 1 }}
          />
        </Box>
      </Box>

      {/* KPI 卡片 */}
      {kpis && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
            📊 关键指标
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3
          }}>
            <Card sx={{
              bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              border: '1px solid #90caf9',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: 100,
                height: 100,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)'
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assessment sx={{ color: '#1976d2', mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    生产效率
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                  {kpis.productionEfficiency.toFixed(1)}%
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                    目标: 85%
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{
              bgcolor: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)',
              border: '1px solid #ba68c8',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: 100,
                height: 100,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)'
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircle sx={{ color: '#7b1fa2', mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
                    质量合格率
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#7b1fa2', mb: 1 }}>
                  {kpis.qualityPassRate.toFixed(1)}%
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                    目标: 95%
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{
              bgcolor: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
              border: '1px solid #ffb74d',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: 100,
                height: 100,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)'
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ color: '#f57c00', mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                    单位成本
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#f57c00', mb: 1 }}>
                  ¥{kpis.costPerUnit.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingDown sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                    目标: ¥12.00
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{
              bgcolor: 'linear-gradient(135deg, #e8f5e8 0%, #81c784 100%)',
              border: '1px solid #66bb6a',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: 100,
                height: 100,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)'
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People sx={{ color: '#388e3c', mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: '#388e3c', fontWeight: 'bold' }}>
                    客户满意度
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#388e3c', mb: 1 }}>
                  {kpis.customerSatisfaction.toFixed(1)}分
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                    目标: 4.5分
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* 操作面板 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
          🛠️ 系统操作
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 2
        }}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{
              py: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            刷新数据
          </Button>
          <Button
            variant="outlined"
            startIcon={<Inventory />}
            onClick={handleInventoryCheck}
            sx={{
              py: 2,
              borderRadius: 2,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.light',
                color: 'primary.dark'
              }
            }}
          >
            库存检查
          </Button>
          <Button
            variant="outlined"
            startIcon={<CheckCircle />}
            onClick={handleQualityCheck}
            sx={{
              py: 2,
              borderRadius: 2,
              borderColor: 'secondary.main',
              color: 'secondary.main',
              '&:hover': {
                borderColor: 'secondary.dark',
                backgroundColor: 'secondary.light',
                color: 'secondary.dark'
              }
            }}
          >
            质量检查
          </Button>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            sx={{
              py: 2,
              borderRadius: 2,
              borderColor: 'success.main',
              color: 'success.main',
              '&:hover': {
                borderColor: 'success.dark',
                backgroundColor: 'success.light',
                color: 'success.dark'
              }
            }}
          >
            生成报告
          </Button>
        </Box>
      </Box>

      {/* 预警信息 */}
      {alerts && (alerts.inventoryAlerts.totalAlerts > 0 || alerts.qualityAlerts.totalQualityAlerts > 0) && (
        <Alert
          severity="warning"
          sx={{
            mb: 4,
            borderRadius: 3,
            border: '1px solid #ff9800',
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
          }}
          icon={<Warning sx={{ fontSize: 28 }} />}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            ⚠️ 系统预警通知
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {alerts.inventoryAlerts.totalAlerts > 0 && (
              <Chip
                icon={<Inventory />}
                label={`库存预警: ${alerts.inventoryAlerts.totalAlerts}项`}
                color="warning"
                size="medium"
                sx={{ fontWeight: 'medium' }}
              />
            )}
            {alerts.qualityAlerts.totalQualityAlerts > 0 && (
              <Chip
                icon={<Warning />}
                label={`质量问题: ${alerts.qualityAlerts.totalQualityAlerts}项`}
                color="error"
                size="medium"
                sx={{ fontWeight: 'medium' }}
              />
            )}
          </Box>
        </Alert>
      )}

      {/* 数据可视化区域 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
          📈 数据分析
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr'
          },
          gap: 3
        }}>
          {/* 成本趋势图 */}
          <Paper sx={{
            p: 3,
            borderRadius: 3,
            height: '500px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0'
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
              💰 成本趋势分析
            </Typography>
            <LineChart
              data={costTrendData}
              title=""
              height="400px"
            />
          </Paper>

          {/* 质量分布饼图 */}
          <Paper sx={{
            p: 3,
            borderRadius: 3,
            height: '500px',
            background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)',
            border: '1px solid #fdba74'
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
              ✅ 质量合格率分布
            </Typography>
            <PieChart
              data={qualityIssueData}
              title=""
              height="400px"
              donut={true}
            />
          </Paper>
        </Box>
      </Box>

      {/* 门店绩效和产能利用率 */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '1fr 1fr'
        },
        gap: 3,
        mb: 4
      }}>
        {/* 门店销售排名 */}
        <Paper sx={{
          p: 3,
          borderRadius: 3,
          height: '450px',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)',
          border: '1px solid #7dd3fc'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
            🏪 门店销售排名
          </Typography>
          <BarChart
            data={storeRankingData}
            title=""
            height="360px"
            horizontal={true}
          />
        </Paper>

        {/* 产能利用率 */}
        <Paper sx={{
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)',
          border: '1px solid #86efac'
        }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
            ⚡ 产能利用率
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                今日目标
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                1,000 份
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                实际完成
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                890 份
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                完成率
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                89.0%
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={89.0}
            sx={{
              height: 16,
              borderRadius: 8,
              bgcolor: '#dcfce7',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: 8
              }
            }}
          />
          <Typography variant="h4" sx={{ mt: 3, textAlign: 'center', fontWeight: 'bold', color: 'success.main' }}>
            89.0%
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 1 }}>
            产能利用率
          </Typography>
        </Paper>
      </Box>

      {/* 系统状态信息 */}
      <Box sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        border: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
          🔄 系统运行状态
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'success.main',
              animation: 'pulse 2s infinite'
            }} />
            <Typography variant="body2" color="text.secondary">
              后端服务正常
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              animation: 'pulse 2s infinite'
            }} />
            <Typography variant="body2" color="text.secondary">
              前端服务正常
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'warning.main',
              animation: 'pulse 2s infinite'
            }} />
            <Typography variant="body2" color="text.secondary">
              数据库连接正常
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          最后更新时间: {new Date().toLocaleString('zh-CN')}
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
