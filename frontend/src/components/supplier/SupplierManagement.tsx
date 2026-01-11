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
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🤝 供应商管理
        </Typography>
        <Typography variant="body1" color="text.secondary">
          供应商信息管理与绩效评估
        </Typography>
      </Box>

      {/* 供应商统计 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总供应商数
              </Typography>
              <Typography variant="h4" component="div">
                {suppliers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                A级供应商
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {suppliers.filter(s => s.qualityGrade === 'A级').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                平均评分
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                活跃供应商
              </Typography>
              <Typography variant="h4" component="div" color="primary.main">
                {suppliers.filter(s => s.status === 'ACTIVE').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        编辑
                      </Button>
                      <Button size="small" variant="outlined">
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
    </Container>
  );
};

export default SupplierManagement;
