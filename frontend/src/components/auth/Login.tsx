import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import {
  LockOutlined,
  Kitchen,
  AdminPanelSettings,
  Engineering,
  Science,
  Inventory,
  Business,
  Visibility
} from '@mui/icons-material';
import { ApiService } from '../../services/api';
import { User, LoginRequest, ROLE_DISPLAY_NAMES, UserRole } from '../../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 预设用户账户演示
  const demoUsers = [
    { username: 'admin', password: 'admin123', role: 'ADMIN' as UserRole, description: '系统管理员 - 拥有所有权限' },
    { username: 'pm', password: 'pm123', role: 'PRODUCTION_MANAGER' as UserRole, description: '生产主管 - 管理生产流程' },
    { username: 'qi', password: 'qi123', role: 'QUALITY_INSPECTOR' as UserRole, description: '质量检查员 - 执行质量检验' },
    { username: 'im', password: 'im123', role: 'INVENTORY_MANAGER' as UserRole, description: '库存管理员 - 管理库存数据' },
    { username: 'sr', password: 'sr123', role: 'SUPPLIER_REPRESENTATIVE' as UserRole, description: '供应商代表 - 查看供应商信息' },
    { username: 'viewer', password: 'viewer123', role: 'VIEWER' as UserRole, description: '观察员 - 只读访问权限' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 模拟登录API调用
      const mockUser: User = {
        id: 1,
        username: formData.username,
        email: `${formData.username}@ckm.com`,
        fullName: getFullName(formData.username),
        role: getRoleFromUsername(formData.username),
        department: getDepartmentFromRole(getRoleFromUsername(formData.username)),
        isActive: true,
        permissions: [], // 会在实际应用中从API获取
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      onLogin(mockUser);
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const getFullName = (username: string): string => {
    const names: Record<string, string> = {
      admin: '系统管理员',
      pm: '李生产',
      qi: '王检查',
      im: '张库存',
      sr: '赵供应商',
      viewer: '观察员'
    };
    return names[username] || username;
  };

  const getRoleFromUsername = (username: string): UserRole => {
    const roles: Record<string, UserRole> = {
      admin: 'ADMIN',
      pm: 'PRODUCTION_MANAGER',
      qi: 'QUALITY_INSPECTOR',
      im: 'INVENTORY_MANAGER',
      sr: 'SUPPLIER_REPRESENTATIVE',
      viewer: 'VIEWER'
    };
    return roles[username] || 'VIEWER';
  };

  const getDepartmentFromRole = (role: UserRole): string => {
    const departments: Record<UserRole, string> = {
      ADMIN: '信息技术部',
      PRODUCTION_MANAGER: '生产管理部',
      QUALITY_INSPECTOR: '质量控制部',
      INVENTORY_MANAGER: '仓储物流部',
      SUPPLIER_REPRESENTATIVE: '供应商管理部',
      VIEWER: '管理层'
    };
    return departments[role] || '';
  };

  const getRoleIcon = (role: UserRole) => {
    const icons: Record<UserRole, React.ReactElement> = {
      ADMIN: <AdminPanelSettings />,
      PRODUCTION_MANAGER: <Engineering />,
      QUALITY_INSPECTOR: <Science />,
      INVENTORY_MANAGER: <Inventory />,
      SUPPLIER_REPRESENTATIVE: <Business />,
      VIEWER: <Visibility />
    };
    return icons[role] || <Kitchen />;
  };

  const getRoleColor = (role: UserRole): "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default" => {
    const colors: Record<UserRole, "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default"> = {
      ADMIN: 'error',
      PRODUCTION_MANAGER: 'primary',
      QUALITY_INSPECTOR: 'success',
      INVENTORY_MANAGER: 'warning',
      SUPPLIER_REPRESENTATIVE: 'info',
      VIEWER: 'secondary'
    };
    return colors[role] || 'default';
  };

  const handleDemoLogin = (user: typeof demoUsers[0]) => {
    setFormData({ username: user.username, password: user.password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
          {/* 左侧：系统介绍 */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, color: 'white' }}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
              🍽️ 中央厨房管理系统
            </Typography>
            <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
              智能化厨房运营，精准管理每一道工序
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Chip label="生产管理" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label="质量追溯" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label="库存监控" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label="供应商协同" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label="数据分析" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            </Box>
          </Box>

          {/* 右侧：登录表单 */}
          <Box sx={{ flex: 1, width: '100%', maxWidth: 480 }}>
            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 60, height: 60 }}>
                  <LockOutlined sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  用户登录
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  请选择您的角色进行登录体验
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* 演示用户选择 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  演示账户
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {demoUsers.map((user) => (
                    <Chip
                      key={user.username}
                      icon={getRoleIcon(user.role)}
                      label={ROLE_DISPLAY_NAMES[user.role]}
                      onClick={() => handleDemoLogin(user)}
                      color={getRoleColor(user.role)}
                      variant="outlined"
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* 登录表单 */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="用户名"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="密码"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    }
                  }}
                >
                  {loading ? '登录中...' : '登录系统'}
                </Button>
              </Box>

              {/* 角色权限说明 */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>当前选择：</strong>
                  {formData.username && (
                    <>
                      {getFullName(formData.username)} -
                      {ROLE_DISPLAY_NAMES[getRoleFromUsername(formData.username)]}
                    </>
                  )}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
