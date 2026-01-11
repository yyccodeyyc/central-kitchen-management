import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, Alert, LinearProgress
} from '@mui/material';
import { Assessment, CheckCircle, Error, Warning, Search } from '@mui/icons-material';

const QualityManagement: React.FC = () => {
  const [qualityData, setQualityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQualityData();
  }, []);

  const loadQualityData = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockData = [
        {
          id: 1,
          batchNumber: 'JT20240101001',
          ingredientName: '鸡胸肉',
          productionDate: '2024-01-10',
          expiryDate: '2024-01-17',
          status: 'PASSED',
          inspector: '李检查',
          checkDate: '2024-01-11'
        },
        {
          id: 2,
          batchNumber: 'JT20240101002',
          ingredientName: '五花肉',
          productionDate: '2024-01-11',
          expiryDate: '2024-01-18',
          status: 'PENDING',
          inspector: null,
          checkDate: null
        },
        {
          id: 3,
          batchNumber: 'JT20240101003',
          ingredientName: '青椒',
          productionDate: '2024-01-11',
          expiryDate: '2024-01-16',
          status: 'FAILED',
          inspector: '王检查',
          checkDate: '2024-01-11'
        }
      ];
      setQualityData(mockData);
    } catch (error) {
      console.error('加载质量数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASSED': return 'success';
      case 'FAILED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASSED': return <CheckCircle />;
      case 'FAILED': return <Error />;
      case 'PENDING': return <Warning />;
      default: return <Assessment />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PASSED': return '合格';
      case 'FAILED': return '不合格';
      case 'PENDING': return '待检查';
      default: return '未知状态';
    }
  };

  const passedCount = qualityData.filter(item => item.status === 'PASSED').length;
  const failedCount = qualityData.filter(item => item.status === 'FAILED').length;
  const pendingCount = qualityData.filter(item => item.status === 'PENDING').length;
  const passRate = qualityData.length > 0 ? (passedCount / qualityData.length * 100).toFixed(1) : '0';

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      p: 4
    }}>
      {/* 页面标题区域 */}
      <Box sx={{
        mb: 4,
        textAlign: 'center',
        py: 4,
        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        borderRadius: 4,
        color: 'white',
        boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)'
      }}>
        <Typography variant="h3" gutterBottom sx={{
          fontWeight: 800,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          mb: 2
        }}>
          🔍 质量控制中心
        </Typography>
        <Typography variant="h6" sx={{
          opacity: 0.9,
          fontWeight: 300,
          maxWidth: 600,
          mx: 'auto'
        }}>
          全程质量追溯，确保食材安全与合规
        </Typography>
      </Box>

      {/* 质量统计 */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        <Card sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'visible',
          height: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: 'inherit',
          }
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>📊</span>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                总检查批次
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {qualityData.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              本期质量检查总数
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'visible',
          height: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: 'inherit',
          }
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>📈</span>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                合格率
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {passRate}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={parseFloat(passRate)}
              sx={{
                mt: 2,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                }
              }}
              color="inherit"
            />
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              质量达标百分比
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'visible',
          height: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: 'inherit',
          }
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>🚫</span>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                不合格
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {failedCount}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              需要立即处理
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'visible',
          height: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: 'inherit',
          }
        }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>⏳</span>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                待检查
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {pendingCount}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              等待质量检验
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 质量预警 */}
      {failedCount > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          ⚠️ 发现 {failedCount} 批次不合格食材，已暂停使用并通知供应商
        </Alert>
      )}

      {/* 质量检查记录 */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              质量检查记录
            </Typography>
            <Button variant="contained" startIcon={<Search />}>
              新增检查
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>批次号</TableCell>
                  <TableCell>食材名称</TableCell>
                  <TableCell>生产日期</TableCell>
                  <TableCell>保质期</TableCell>
                  <TableCell>检查状态</TableCell>
                  <TableCell>检查员</TableCell>
                  <TableCell>检查日期</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qualityData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell component="th" scope="row">
                      {item.batchNumber}
                    </TableCell>
                    <TableCell>{item.ingredientName}</TableCell>
                    <TableCell>{item.productionDate}</TableCell>
                    <TableCell>{item.expiryDate}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(item.status)}
                        label={getStatusText(item.status)}
                        color={getStatusColor(item.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.inspector || '-'}</TableCell>
                    <TableCell>{item.checkDate || '-'}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        查看
                      </Button>
                      {item.status === 'PENDING' && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => {/* TODO: 实现质量检查功能 */}}
                        >
                          检查
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QualityManagement;
