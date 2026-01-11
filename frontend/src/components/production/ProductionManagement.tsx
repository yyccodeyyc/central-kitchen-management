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
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
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

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
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

  const handleCreateSchedule = () => {
    // TODO: 实现排程创建对话框
    showSnackbar('排程创建功能开发中', 'info');
  };

  const handleConfirmSchedule = async (id: number) => {
    try {
      await ApiService.confirmSchedule(id, '系统用户');
      showSnackbar('排程已确认', 'success');
      loadData();
    } catch (error) {
      showSnackbar('确认排程失败', 'error');
    }
  };

  const handleStartSchedule = async (id: number) => {
    try {
      await ApiService.startSchedule(id, '系统用户');
      showSnackbar('排程已开始', 'success');
      loadData();
    } catch (error) {
      showSnackbar('开始排程失败', 'error');
    }
  };

  const handleCompleteSchedule = async (id: number) => {
    try {
      await ApiService.completeSchedule(id, '系统用户');
      showSnackbar('排程已完成', 'success');
      loadData();
    } catch (error) {
      showSnackbar('完成排程失败', 'error');
    }
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 4,
        color: 'white',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <Typography variant="h3" gutterBottom sx={{
          fontWeight: 800,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          mb: 2
        }}>
          🏭 生产计划与排程管理
        </Typography>
        <Typography variant="h6" sx={{
          opacity: 0.9,
          fontWeight: 300,
          maxWidth: 600,
          mx: 'auto'
        }}>
          智能生产调度，优化资源配置，提升运营效率
        </Typography>
      </Box>

      {/* 标签页导航 */}
      <Box sx={{
        mb: 4,
        backgroundColor: 'white',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="production management tabs"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
            },
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              minHeight: 64,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.04)',
              },
              '&.Mui-selected': {
                color: '#6366f1',
                fontWeight: 700,
              },
            },
          }}
        >
          <Tab
            icon={<span style={{ fontSize: '1.5rem' }}>📋</span>}
            label="生产订单"
            iconPosition="start"
          />
          <Tab
            icon={<span style={{ fontSize: '1.5rem' }}>⏰</span>}
            label="生产排程"
            iconPosition="start"
          />
          <Tab
            icon={<span style={{ fontSize: '1.5rem' }}>📊</span>}
            label="生产监控"
            iconPosition="start"
          />
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
            onClick={handleCreateSchedule}
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
                        onClick={() => handleConfirmSchedule(schedule.id)}
                      >
                        确认
                      </Button>
                    )}
                    {schedule.status === 'CONFIRMED' && (
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => handleStartSchedule(schedule.id)}
                      >
                        开始
                      </Button>
                    )}
                    {schedule.status === 'IN_PROGRESS' && (
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleCompleteSchedule(schedule.id)}
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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
            📊 生产监控仪表板
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            实时监控生产状态，掌握运营情况
          </Typography>
        </Box>

        {/* 统计卡片网格 */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <Card sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'visible',
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>⏳</span>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  待处理订单
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {orders.filter(o => o.status === 'PENDING').length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                需要审批的生产订单
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'visible',
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>⚙️</span>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  进行中订单
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {orders.filter(o => o.status === 'IN_PRODUCTION').length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                当前生产线上的订单
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'visible',
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>✅</span>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  已完成订单
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {orders.filter(o => o.status === 'COMPLETED').length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                本周期完成的订单
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'visible',
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>📈</span>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  完成率
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {orders.length > 0 ? Math.round((orders.filter(o => o.status === 'COMPLETED').length / orders.length) * 100) : 0}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                订单完成百分比
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* 生产状态图表区域 */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4
        }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
                📋 订单状态分布
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {[
                  { label: '待处理', count: orders.filter(o => o.status === 'PENDING').length, color: '#f59e0b' },
                  { label: '已批准', count: orders.filter(o => o.status === 'APPROVED').length, color: '#6366f1' },
                  { label: '已排程', count: orders.filter(o => o.status === 'SCHEDULED').length, color: '#06b6d4' },
                  { label: '生产中', count: orders.filter(o => o.status === 'IN_PRODUCTION').length, color: '#10b981' },
                  { label: '已完成', count: orders.filter(o => o.status === 'COMPLETED').length, color: '#059669' },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: item.color,
                          mr: 2
                        }}
                      />
                      <Typography variant="body2">{item.label}</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
                ⏰ 近期生产活动
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {orders.slice(0, 5).map((order, index) => (
                  <Box key={order.id} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white',
                    border: '1px solid rgba(148, 163, 184, 0.1)'
                  }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(order.status),
                      mr: 2
                    }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        订单 #{order.orderNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.requiredDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip
                      label={order.status === 'PENDING' ? '待处理' :
                             order.status === 'APPROVED' ? '已批准' :
                             order.status === 'SCHEDULED' ? '已排程' :
                             order.status === 'IN_PRODUCTION' ? '生产中' :
                             order.status === 'COMPLETED' ? '已完成' : '已取消'}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Box>
                ))}
                {orders.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      暂无生产订单
                    </Typography>
                  </Box>
                )}
              </Box>
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
