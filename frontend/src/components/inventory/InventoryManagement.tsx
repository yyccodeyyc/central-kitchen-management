import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, Alert, CircularProgress,
  Snackbar, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem
} from '@mui/material';
import { Inventory, Warning, CheckCircle, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { ApiService } from '../../services/api';
import { AlertData } from '../../types';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  status: 'LOW' | 'NORMAL' | 'HIGH';
  lastUpdated: string;
  supplier?: string;
  location?: string;
  expiryDate?: string;
}

const InventoryManagement: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unit: 'kg',
    supplier: '',
    location: '',
    expiryDate: ''
  });

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    setLoading(true);
    try {
      // 调用真实的库存API
      const response = await ApiService.getInventory();
      setInventoryData(response);
    } catch (error) {
      console.error('加载库存数据失败:', error);
      showSnackbar('加载库存数据失败', 'error');
      // 如果API调用失败，使用模拟数据作为fallback
      const mockData: InventoryItem[] = [
        {
          id: 1,
          name: '鸡胸肉',
          category: '肉类',
          currentStock: 45,
          minStock: 50,
          maxStock: 200,
          unit: 'kg',
          status: 'LOW',
          lastUpdated: '2024-01-11',
          supplier: '三全食品',
          location: '冷库A区',
          expiryDate: '2024-02-11'
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
          lastUpdated: '2024-01-11',
          supplier: '本地农场',
          location: '蔬菜库',
          expiryDate: '2024-01-15'
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
          lastUpdated: '2024-01-10',
          supplier: '坚果供应商',
          location: '干货库',
          expiryDate: '2024-06-10'
        }
      ];
      setInventoryData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: '',
      currentStock: '',
      minStock: '',
      maxStock: '',
      unit: 'kg',
      supplier: '',
      location: '',
      expiryDate: ''
    });
    setDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock.toString(),
      minStock: item.minStock.toString(),
      maxStock: item.maxStock.toString(),
      unit: item.unit,
      supplier: item.supplier || '',
      location: item.location || '',
      expiryDate: item.expiryDate || ''
    });
    setDialogOpen(true);
  };

  const handleSaveItem = async () => {
    try {
      const itemData = {
        name: formData.name,
        category: formData.category,
        currentStock: parseFloat(formData.currentStock),
        minStock: parseFloat(formData.minStock),
        maxStock: parseFloat(formData.maxStock),
        unit: formData.unit,
        supplier: formData.supplier,
        location: formData.location,
        expiryDate: formData.expiryDate
      };

      if (editingItem) {
        await ApiService.updateInventoryItem(editingItem.id, itemData);
        showSnackbar('库存项目更新成功', 'success');
      } else {
        await ApiService.createInventoryItem(itemData);
        showSnackbar('库存项目创建成功', 'success');
      }

      setDialogOpen(false);
      loadInventoryData();
    } catch (error) {
      console.error('保存库存项目失败:', error);
      showSnackbar('保存失败', 'error');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm('确定要删除这个库存项目吗？')) {
      try {
        await ApiService.deleteInventoryItem(id);
        showSnackbar('库存项目删除成功', 'success');
        loadInventoryData();
      } catch (error) {
        showSnackbar('删除失败', 'error');
      }
    }
  };

  const triggerInventoryCheck = async () => {
    try {
      await ApiService.triggerInventoryCheck();
      showSnackbar('库存检查已触发', 'info');
      loadInventoryData();
    } catch (error) {
      showSnackbar('触发库存检查失败', 'error');
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Inventory />}
                onClick={triggerInventoryCheck}
              >
                库存检查
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateItem}
              >
                新增物料
              </Button>
            </Box>
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
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditItem(item)}
                        sx={{ mr: 1 }}
                      >
                        编辑
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 新增/编辑物料对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? '编辑物料' : '新增物料'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="物料名称"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <TextField
              fullWidth
              select
              label="分类"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              <MenuItem value="肉类">肉类</MenuItem>
              <MenuItem value="蔬菜">蔬菜</MenuItem>
              <MenuItem value="辅料">辅料</MenuItem>
              <MenuItem value="调料">调料</MenuItem>
              <MenuItem value="包装">包装</MenuItem>
              <MenuItem value="其他">其他</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="当前库存"
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData({...formData, currentStock: e.target.value})}
                required
              />
              <TextField
                fullWidth
                select
                label="单位"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              >
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="个">个</MenuItem>
                <MenuItem value="盒">盒</MenuItem>
                <MenuItem value="袋">袋</MenuItem>
                <MenuItem value="瓶">瓶</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="最低库存"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                required
              />
              <TextField
                fullWidth
                label="最高库存"
                type="number"
                value={formData.maxStock}
                onChange={(e) => setFormData({...formData, maxStock: e.target.value})}
                required
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="供应商"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
              />
              <TextField
                fullWidth
                label="存放位置"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </Box>
            <TextField
              fullWidth
              label="过期日期"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={handleSaveItem} variant="contained">
            {editingItem ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 消息提示 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert
          onClose={() => setSnackbar({...snackbar, open: false})}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventoryManagement;
