import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, Alert
} from '@mui/material';
import { Inventory, Warning, CheckCircle } from '@mui/icons-material';

const InventoryManagement: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    setLoading(true);
    try {
      // 这里应该调用真实的API
      // const response = await api.getInventory();
      // setInventoryData(response.data);

      // 暂时使用模拟数据
      const mockData = [
        {
          id: 1,
          name: '鸡胸肉',
          category: '肉类',
          currentStock: 45,
          minStock: 50,
          maxStock: 200,
          unit: 'kg',
          status: 'LOW',
          lastUpdated: '2024-01-11'
        },
        {
          id: 2,
          name: '青椒',
          category: '蔬菜',
          currentStock: 120,
          minStock: 100,
          maxStock: 300,
          unit: 'kg',
          status: 'NORMAL',
          lastUpdated: '2024-01-11'
        },
        {
          id: 3,
          name: '花生米',
          category: '辅料',
          currentStock: 25,
          minStock: 30,
          maxStock: 100,
          unit: 'kg',
          status: 'LOW',
          lastUpdated: '2024-01-10'
        }
      ];
      setInventoryData(mockData);
    } catch (error) {
      console.error('加载库存数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LOW': return 'error';
      case 'NORMAL': return 'success';
      case 'HIGH': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'LOW': return <Warning />;
      case 'NORMAL': return <CheckCircle />;
      default: return <Inventory />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'LOW': return '库存不足';
      case 'NORMAL': return '库存正常';
      case 'HIGH': return '库存充足';
      default: return '未知状态';
    }
  };

  const lowStockItems = inventoryData.filter(item => item.status === 'LOW');

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          📦 库存管理
        </Typography>
        <Typography variant="body1" color="text.secondary">
          实时监控库存状态，及时补货预警
        </Typography>
      </Box>

      {/* 库存预警提示 */}
      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          ⚠️ 发现 {lowStockItems.length} 项库存不足的物料，需要及时补货
        </Alert>
      )}

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总物料种类
              </Typography>
              <Typography variant="h4" component="div">
                {inventoryData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                库存不足
              </Typography>
              <Typography variant="h4" component="div" color="error">
                {lowStockItems.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                库存正常
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {inventoryData.filter(item => item.status === 'NORMAL').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                库存充足
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {inventoryData.filter(item => item.status === 'HIGH').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 库存明细表 */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              库存明细
            </Typography>
            <Button variant="contained" startIcon={<Inventory />}>
              导出报表
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>物料名称</TableCell>
                  <TableCell>分类</TableCell>
                  <TableCell align="right">当前库存</TableCell>
                  <TableCell align="right">最低库存</TableCell>
                  <TableCell align="right">最高库存</TableCell>
                  <TableCell>单位</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>最后更新</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell align="right">{item.currentStock}</TableCell>
                    <TableCell align="right">{item.minStock}</TableCell>
                    <TableCell align="right">{item.maxStock}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(item.status)}
                        label={getStatusText(item.status)}
                        color={getStatusColor(item.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        编辑
                      </Button>
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

export default InventoryManagement;
