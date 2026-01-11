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
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🔍 质量控制
        </Typography>
        <Typography variant="body1" color="text.secondary">
          食材质量追溯与检测管理
        </Typography>
      </Box>

      {/* 质量统计 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总检查批次
              </Typography>
              <Typography variant="h4" component="div">
                {qualityData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                合格率
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {passRate}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={parseFloat(passRate)}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                不合格
              </Typography>
              <Typography variant="h4" component="div" color="error">
                {failedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                待检查
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                        <Button size="small" variant="contained" color="primary">
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
    </Container>
  );
};

export default QualityManagement;
