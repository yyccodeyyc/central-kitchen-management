import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Fab,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ApiService } from '../../services/api';
import { ProductionOrder, ProductionSchedule } from '../../types';

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
      id={`production-tabpanel-${index}`}
      aria-labelledby={`production-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductionManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [schedules, setSchedules] = useState<ProductionSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // 表单数据
  const [orderForm, setOrderForm] = useState({
    franchiseId: '',
    productionStandardId: '',
    quantity: '',
    priority: 'NORMAL',
    requiredDate: '',
    specialInstructions: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [tabValue]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tabValue === 0) {
        const ordersData = await ApiService.getProductionOrders();
        setOrders(ordersData);
      } else {
        const schedulesData = await ApiService.getProductionSchedules();
        setSchedules(schedulesData);
      }
    } catch (error) {
      showSnackbar('加载数据失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateOrder = () => {
    setEditingOrder(null);
    setOrderForm({
      franchiseId: '',
      productionStandardId: '',
      quantity: '',
      priority: 'NORMAL',
      requiredDate: '',
      specialInstructions: '',
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEditOrder = (order: ProductionOrder) => {
    setEditingOrder(order);
    setOrderForm({
      franchiseId: order.franchise?.id?.toString() || '',
      productionStandardId: order.productionStandard?.id?.toString() || '',
      quantity: order.quantity.toString(),
      priority: order.priority,
      requiredDate: order.requiredDate,
      specialInstructions: order.specialInstructions || '',
      notes: order.notes || ''
    });
    setDialogOpen(true);
  };

  const handleSaveOrder = async () => {
    try {
      const orderData = {
        franchise: { id: parseInt(orderForm.franchiseId) },
        productionStandard: { id: parseInt(orderForm.productionStandardId) },
        quantity: parseInt(orderForm.quantity),
        priority: orderForm.priority as any,
        requiredDate: orderForm.requiredDate,
        specialInstructions: orderForm.specialInstructions,
        notes: orderForm.notes
      };

      if (editingOrder) {
        await ApiService.updateProductionOrder(editingOrder.id, orderData);
        showSnackbar('生产订单更新成功', 'success');
      } else {
        await ApiService.createProductionOrder(orderData);
        showSnackbar('生产订单创建成功', 'success');
      }

      setDialogOpen(false);
      loadData();
    } catch (error) {
      showSnackbar('保存失败', 'error');
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (window.confirm('确定要删除这个生产订单吗？')) {
      try {
        await ApiService.deleteProductionOrder(id);
        showSnackbar('生产订单删除成功', 'success');
        loadData();
      } catch (error) {
        showSnackbar('删除失败', 'error');
      }
    }
  };

  const handleOrderAction = async (id: number, action: string) => {
    try {
      switch (action) {
        case 'approve':
          await ApiService.approveOrder(id, '系统用户');
          showSnackbar('订单已批准', 'success');
          break;
        case 'schedule':
          await ApiService.scheduleOrder(id, new Date().toISOString(), '系统用户');
          showSnackbar('订单已排程', 'success');
          break;
        case 'complete':
          await ApiService.completeOrder(id, '系统用户');
          showSnackbar('订单已完成', 'success');
          break;
      }
      loadData();
    } catch (error) {
      showSnackbar('操作失败', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'info';
      case 'SCHEDULED': return 'primary';
      case 'IN_PRODUCTION': return 'secondary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'error';
      case 'HIGH': return 'warning';
      case 'NORMAL': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        生产计划与排程管理
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="production management tabs">
          <Tab label="生产订单" />
          <Tab label="生产排程" />
          <Tab label="生产监控" />
        </Tabs>
      </Box>

      {/* 生产订单标签页 */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">生产订单管理</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateOrder}
          >
            新建订单
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>订单编号</TableCell>
                <TableCell>菜品</TableCell>
                <TableCell>数量</TableCell>
                <TableCell>优先级</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>要求日期</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>菜品 #{order.productionStandard?.id}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.priority === 'URGENT' ? '紧急' :
                             order.priority === 'HIGH' ? '高' :
                             order.priority === 'NORMAL' ? '正常' : '低'}
                      color={getPriorityColor(order.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status === 'PENDING' ? '待处理' :
                             order.status === 'APPROVED' ? '已批准' :
                             order.status === 'SCHEDULED' ? '已排程' :
                             order.status === 'IN_PRODUCTION' ? '生产中' :
                             order.status === 'COMPLETED' ? '已完成' : '已取消'}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(order.requiredDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleEditOrder(order)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteOrder(order.id)}
                      sx={{ mr: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                    {order.status === 'PENDING' && (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleOrderAction(order.id, 'approve')}
                      >
                        批准
                      </Button>
                    )}
                    {order.status === 'APPROVED' && (
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => handleOrderAction(order.id, 'schedule')}
                      >
                        排程
                      </Button>
                    )}
                    {order.status === 'SCHEDULED' && (
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleOrderAction(order.id, 'complete')}
                      >
                        完成
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* 生产排程标签页 */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">生产排程管理</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* TODO: 实现排程创建 */}}
          >
            创建排程
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>排程编号</TableCell>
                <TableCell>生产线</TableCell>
                <TableCell>开始时间</TableCell>
                <TableCell>结束时间</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>产能利用率</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.scheduleNumber}</TableCell>
                  <TableCell>{schedule.productionLine}</TableCell>
                  <TableCell>{new Date(schedule.startTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(schedule.endTime).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={schedule.status === 'PLANNED' ? '已规划' :
                             schedule.status === 'CONFIRMED' ? '已确认' :
                             schedule.status === 'IN_PROGRESS' ? '进行中' :
                             schedule.status === 'COMPLETED' ? '已完成' : '已取消'}
                      color={schedule.status === 'COMPLETED' ? 'success' :
                             schedule.status === 'IN_PROGRESS' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{schedule.capacityUtilization}%</TableCell>
                  <TableCell>
                    {schedule.status === 'PLANNED' && (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {/* TODO: 确认排程 */}}
                      >
                        确认
                      </Button>
                    )}
                    {schedule.status === 'CONFIRMED' && (
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => {/* TODO: 开始排程 */}}
                      >
                        开始
                      </Button>
                    )}
                    {schedule.status === 'IN_PROGRESS' && (
                      <Button
                        size="small"
                        color="success"
                        onClick={() => {/* TODO: 完成排程 */}}
                      >
                        完成
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* 生产监控标签页 */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>生产监控仪表板</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 300px' }}>
            <CardContent>
              <Typography variant="h6" color="primary">待处理订单</Typography>
              <Typography variant="h4">{orders.filter(o => o.status === 'PENDING').length}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 300px' }}>
            <CardContent>
              <Typography variant="h6" color="secondary">进行中订单</Typography>
              <Typography variant="h4">{orders.filter(o => o.status === 'IN_PRODUCTION').length}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 300px' }}>
            <CardContent>
              <Typography variant="h6" color="success">已完成订单</Typography>
              <Typography variant="h4">{orders.filter(o => o.status === 'COMPLETED').length}</Typography>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>

      {/* 新建/编辑订单对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingOrder ? '编辑生产订单' : '新建生产订单'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="加盟商ID"
                value={orderForm.franchiseId}
                onChange={(e) => setOrderForm({...orderForm, franchiseId: e.target.value})}
              />
              <TextField
                fullWidth
                label="生产标准ID"
                value={orderForm.productionStandardId}
                onChange={(e) => setOrderForm({...orderForm, productionStandardId: e.target.value})}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="数量"
                type="number"
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
              />
              <TextField
                fullWidth
                select
                label="优先级"
                value={orderForm.priority}
                onChange={(e) => setOrderForm({...orderForm, priority: e.target.value})}
              >
                <MenuItem value="LOW">低优先级</MenuItem>
                <MenuItem value="NORMAL">正常优先级</MenuItem>
                <MenuItem value="HIGH">高优先级</MenuItem>
                <MenuItem value="URGENT">紧急</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="要求日期"
                type="datetime-local"
                value={orderForm.requiredDate}
                onChange={(e) => setOrderForm({...orderForm, requiredDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="特殊说明"
                value={orderForm.specialInstructions}
                onChange={(e) => setOrderForm({...orderForm, specialInstructions: e.target.value})}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="备注"
              value={orderForm.notes}
              onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={handleSaveOrder} variant="contained">
            {editingOrder ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 全局添加按钮 */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateOrder}
      >
        <AddIcon />
      </Fab>

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

export default ProductionManagement;
