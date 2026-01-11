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
      // TODO: 实现库存API调用
      // const response = await ApiService.getInventory();
      // setInventoryData(response);

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
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        borderRadius: 4,
        color: 'white',
        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'
      }}>
        <Typography variant="h3" gutterBottom sx={{
          fontWeight: 800,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          mb: 2
        }}>
          📦 库存管理中心
        </Typography>
        <Typography variant="h6" sx={{
          opacity: 0.9,
          fontWeight: 300,
          maxWidth: 600,
          mx: 'auto'
        }}>
          智能库存监控，精准补货预警，确保生产连续性
        </Typography>
      </Box>

      {/* 库存预警提示 */}
      {lowStockItems.length > 0 && (
        <Alert
          severity="warning"
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '1px solid #f59e0b'
          }}
          icon={<span style={{ fontSize: '1.5rem' }}>⚠️</span>}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            库存预警通知
          </Typography>
          <Typography>
            发现 <strong>{lowStockItems.length}</strong> 项库存不足的物料，需要及时补货以确保生产连续性
          </Typography>
        </Alert>
      )}

      {/* 统计卡片网格 */}
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
                总物料种类
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {inventoryData.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              管理的物料总数
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
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>🚨</span>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                库存不足
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {lowStockItems.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              需要紧急补货
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
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>✅</span>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                库存正常
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {inventoryData.filter(item => item.status === 'NORMAL').length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              库存状态良好
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
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>📈</span>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                库存充足
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {inventoryData.filter(item => item.status === 'HIGH').length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              库存充裕无忧
            </Typography>
          </CardContent>
        </Card>
      </Box>

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
    </Box>
  );
};

export default InventoryManagement;
