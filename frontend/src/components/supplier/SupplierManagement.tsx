import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, Rating, Avatar
} from '@mui/material';
import { People, Star, Add, Business } from '@mui/icons-material';

const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockData = [
        {
          id: 1,
          name: '河南五星食品有限公司',
          category: '肉类制品',
          qualityGrade: 'A级',
          contractPrice: 25.5,
          deliveryCycle: 2,
          contactPerson: '张经理',
          contactPhone: '13800138001',
          status: 'ACTIVE',
          rating: 4.8,
          lastDeliveryDate: '2024-01-10'
        },
        {
          id: 2,
          name: '北京新发地农产品市场',
          category: '蔬菜水果',
          qualityGrade: 'B级',
          contractPrice: 8.5,
          deliveryCycle: 1,
          contactPerson: '王经理',
          contactPhone: '13800138002',
          status: 'ACTIVE',
          rating: 4.2,
          lastDeliveryDate: '2024-01-11'
        },
        {
          id: 3,
          name: '内蒙古伊利乳业',
          category: '乳制品',
          qualityGrade: 'A级',
          contractPrice: 15.0,
          deliveryCycle: 2,
          contactPerson: '赵总',
          contactPhone: '13800138003',
          status: 'ACTIVE',
          rating: 4.9,
          lastDeliveryDate: '2024-01-09'
        }
      ];
      setSuppliers(mockData);
    } catch (error) {
      console.error('加载供应商数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A级': return 'success';
      case 'B级': return 'warning';
      case 'C级': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'BLACKLISTED': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '正常';
      case 'INACTIVE': return '停用';
      case 'BLACKLISTED': return '黑名单';
      default: return '未知';
    }
  };

  const getInitials = (name: string) => {
    return name.split('').filter(char => char !== '有限公司' && char !== '公司').slice(0, 2).join('');
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
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        borderRadius: 4,
        color: 'white',
        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
      }}>
        <Typography variant="h3" gutterBottom sx={{
          fontWeight: 800,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          mb: 2
        }}>
          🤝 供应商管理中心
        </Typography>
        <Typography variant="h6" sx={{
          opacity: 0.9,
          fontWeight: 300,
          maxWidth: 600,
          mx: 'auto'
        }}>
          供应商信息管理与绩效评估，确保供应链稳定可靠
        </Typography>
      </Box>

      {/* 供应商统计 */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        },
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
                总供应商数
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {suppliers.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              已合作供应商总数
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
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>🏆</span>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                A级供应商
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {suppliers.filter(s => s.qualityGrade === 'A级').length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              优质供应商数量
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
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>⭐</span>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                平均评分
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              供应商综合评分
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
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
                活跃供应商
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {suppliers.filter(s => s.status === 'ACTIVE').length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              正常合作供应商
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 供应商列表 */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              供应商列表
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              新增供应商
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>供应商名称</TableCell>
                  <TableCell>分类</TableCell>
                  <TableCell>质量等级</TableCell>
                  <TableCell>合同价格</TableCell>
                  <TableCell>配送周期</TableCell>
                  <TableCell>联系人</TableCell>
                  <TableCell>评分</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id} hover>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {getInitials(supplier.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">{supplier.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {supplier.contactPhone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{supplier.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={supplier.qualityGrade}
                        color={getGradeColor(supplier.qualityGrade) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>¥{supplier.contractPrice}</TableCell>
                    <TableCell>{supplier.deliveryCycle}天</TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={supplier.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {supplier.rating}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(supplier.status)}
                        color={getStatusColor(supplier.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}
                        onClick={() => {/* TODO: 实现编辑功能 */}}>
                        编辑
                      </Button>
                      <Button size="small" variant="outlined"
                        onClick={() => {/* TODO: 实现详情查看功能 */}}>
                        详情
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

export default SupplierManagement;
