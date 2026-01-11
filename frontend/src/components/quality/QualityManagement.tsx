import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, Alert, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Snackbar, Fab, Tabs, Tab
} from '@mui/material';
import { Assessment, CheckCircle, Error, Warning, Search, Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { ApiService } from '../../services/api';
import { QualityTrace } from '../../types';

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
      id={`quality-tabpanel-${index}`}
      aria-labelledby={`quality-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const QualityManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [qualityTraces, setQualityTraces] = useState<any[]>([]);
  const [expiringItems, setExpiringItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkingItem, setCheckingItem] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // 质量检查表单
  const [checkForm, setCheckForm] = useState({
    result: 'PASS',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [tabValue]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tabValue === 0) {
        // 加载质量追溯数据
        const traces = await ApiService.getQualityTraces();
        setQualityTraces(traces);
      } else if (tabValue === 1) {
        // 加载即将过期项目
        const expiring = await ApiService.getExpiringItems();
        setExpiringItems(expiring);
      }
    } catch (error) {
      console.error('加载质量数据失败:', error);
      showSnackbar('加载数据失败', 'error');
      // Fallback to mock data
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    if (tabValue === 0) {
      const mockTraces = [
        {
          id: 1,
          batchNumber: 'JT20240101001',
          ingredientName: '鸡胸肉',
          productionDate: '2024-01-10',
          expiryDate: '2024-01-17',
          status: 'PASSED',
          inspector: '李检查',
          checkDate: '2024-01-11',
          supplierInfo: '三全食品',
          qualityCheck: '外观正常，无异味'
        },
        {
          id: 2,
          batchNumber: 'JT20240101002',
          ingredientName: '五花肉',
          productionDate: '2024-01-11',
          expiryDate: '2024-01-18',
          status: 'PENDING',
          inspector: null,
          checkDate: null,
          supplierInfo: '本地农场',
          qualityCheck: null
        },
        {
          id: 3,
          batchNumber: 'JT20240101003',
          ingredientName: '青椒',
          productionDate: '2024-01-11',
          expiryDate: '2024-01-16',
          status: 'FAILED',
          inspector: '王检查',
          checkDate: '2024-01-11',
          supplierInfo: '蔬菜供应商',
          qualityCheck: '发现农药残留超标'
        }
      ];
      setQualityTraces(mockTraces);
    } else {
      const mockExpiring = [
        {
          id: 4,
          batchNumber: 'JT20240101004',
          ingredientName: '牛肉',
          expiryDate: '2024-01-13',
          daysUntilExpiry: 1,
          status: 'ACTIVE'
        },
        {
          id: 5,
          batchNumber: 'JT20240101005',
          ingredientName: '鱼虾',
          expiryDate: '2024-01-14',
          daysUntilExpiry: 2,
          status: 'ACTIVE'
        }
      ];
      setExpiringItems(mockExpiring);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQualityCheck = (item: any) => {
    setCheckingItem(item);
    setCheckForm({
      result: 'PASS',
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleSaveCheck = async () => {
    if (!checkingItem) return;

    try {
      await ApiService.performQualityCheck(
        checkingItem.id,
        checkForm.result === 'PASS' ? 'PASSED' : 'FAILED',
        checkForm.notes
      );

      showSnackbar('质量检查完成', 'success');
      setDialogOpen(false);
      setCheckingItem(null);
      loadData();
    } catch (error) {
      console.error('保存质量检查失败:', error);
      showSnackbar('保存失败', 'error');
    }
  };

  const handleTraceQuery = (batchNumber: string) => {
    // 这里可以实现批次追溯查询
    console.log('追溯批次:', batchNumber);
    showSnackbar(`正在追溯批次 ${batchNumber}`, 'info');
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
          aria-label="quality management tabs"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #06b6d4, #0891b2)',
            },
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              minHeight: 64,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(6, 182, 212, 0.04)',
              },
              '&.Mui-selected': {
                color: '#0891b2',
                fontWeight: 700,
              },
            },
          }}
        >
          <Tab
            icon={<span style={{ fontSize: '1.5rem' }}>🔍</span>}
            label="质量追溯"
            iconPosition="start"
          />
          <Tab
            icon={<span style={{ fontSize: '1.5rem' }}>⏰</span>}
            label="即将过期"
            iconPosition="start"
          />
          <Tab
            icon={<span style={{ fontSize: '1.5rem' }}>📊</span>}
            label="质量统计"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* 质量追溯标签页 */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
            🔍 质量追溯查询
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            通过批次号追溯食材从采购到使用的全流程信息
          </Typography>
        </Box>

        {/* 追溯查询输入 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="批次号"
                placeholder="输入批次号进行追溯"
                sx={{ flex: 1 }}
              />
              <Button variant="contained" startIcon={<Search />}>
                追溯查询
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* 质量检查记录 */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                质量检查记录
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />}>
                新增检查
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>批次号</TableCell>
                    <TableCell>食材名称</TableCell>
                    <TableCell>供应商</TableCell>
                    <TableCell>生产日期</TableCell>
                    <TableCell>保质期</TableCell>
                    <TableCell>检查状态</TableCell>
                    <TableCell>检查员</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {qualityTraces.map((item: any) => (
                    <TableRow key={item.id} hover>
                      <TableCell component="th" scope="row">
                        <Button
                          size="small"
                          onClick={() => handleTraceQuery(item.batchNumber)}
                          sx={{ textTransform: 'none' }}
                        >
                          {item.batchNumber}
                        </Button>
                      </TableCell>
                      <TableCell>{item.ingredientName}</TableCell>
                      <TableCell>{item.supplierInfo}</TableCell>
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
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          sx={{ mr: 1 }}
                          onClick={() => handleTraceQuery(item.batchNumber)}
                        >
                          追溯
                        </Button>
                        {item.status === 'PENDING' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleQualityCheck(item)}
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
      </TabPanel>

      {/* 即将过期标签页 */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
            ⏰ 即将过期预警
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            监控即将到期的食材，及时处理避免浪费
          </Typography>
        </Box>

        {/* 过期预警提示 */}
        {expiringItems.length > 0 && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            ⚠️ 发现 {expiringItems.length} 项食材即将过期，请及时处理
          </Alert>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              即将过期清单
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>批次号</TableCell>
                    <TableCell>食材名称</TableCell>
                    <TableCell>过期日期</TableCell>
                    <TableCell>剩余天数</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expiringItems.map((item: any) => (
                    <TableRow key={item.id} hover>
                      <TableCell component="th" scope="row">
                        {item.batchNumber}
                      </TableCell>
                      <TableCell>{item.ingredientName}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${item.daysUntilExpiry}天`}
                          color={item.daysUntilExpiry <= 1 ? 'error' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                          处理
                        </Button>
                        <Button size="small" variant="outlined" color="error">
                          报废
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* 质量统计标签页 */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
            📊 质量统计分析
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            全面的质量数据统计和趋势分析
          </Typography>
        </Box>

        {/* 质量统计卡片 */}
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
                {qualityTraces.length}
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
                {qualityTraces.length > 0 ?
                  Math.round((qualityTraces.filter((item: any) => item.status === 'PASSED').length / qualityTraces.length) * 100) : 0}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
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
                {qualityTraces.filter((item: any) => item.status === 'FAILED').length}
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
                {qualityTraces.filter((item: any) => item.status === 'PENDING').length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                等待质量检验
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* 质量趋势图表 */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
              质量趋势分析
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                图表组件待实现
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* 质量检查对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          质量检查 - {checkingItem?.batchNumber}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              fullWidth
              label="检查结果"
              value={checkForm.result}
              onChange={(e) => setCheckForm({...checkForm, result: e.target.value})}
            >
              <MenuItem value="PASS">合格</MenuItem>
              <MenuItem value="FAIL">不合格</MenuItem>
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="检查备注"
              value={checkForm.notes}
              onChange={(e) => setCheckForm({...checkForm, notes: e.target.value})}
              placeholder="请输入质量检查的详细结果和发现的问题..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={handleSaveCheck} variant="contained" color="primary">
            提交检查结果
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

export default QualityManagement;
