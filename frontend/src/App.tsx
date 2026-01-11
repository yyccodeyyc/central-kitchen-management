import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Menu as MenuIcon, Dashboard, Kitchen, Assessment, Inventory, People, Settings, Notifications, Logout, Person } from '@mui/icons-material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ROLE_DISPLAY_NAMES, UserRole } from './types';
import Login from './components/auth/Login';
import DashboardComponent from './components/dashboard/Dashboard';
import ProductionManagement from './components/production/ProductionManagement';
import InventoryManagement from './components/inventory/InventoryManagement';
import QualityManagement from './components/quality/QualityManagement';
import SupplierManagement from './components/supplier/SupplierManagement';
import SystemSettings from './components/settings/SystemSettings';
import './App.css';

// 创建现代化企业主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // 更现代的靛蓝色
      light: '#a5b4fc',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // 青色
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: 'rgba(148, 163, 184, 0.2)',
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.35,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.45,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f5f9',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '4px',
            '&:hover': {
              background: '#94a3b8',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(148, 163, 184, 0.08)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '8px 16px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(99, 102, 241, 0.04)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.8125rem',
        },
        colorSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#059669',
        },
        colorError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#dc2626',
        },
        colorWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#d97706',
        },
        colorInfo: {
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          color: '#4f46e5',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(148, 163, 184, 0.08)',
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#374151',
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '2px solid #e2e8f0',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.02)',
          },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
              borderColor: '#6366f1',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(148, 163, 184, 0.1)',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: '#6366f1',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
            },
            '& .MuiListItemIcon-root': {
              color: '#6366f1',
            },
          },
        },
      },
    },
  },
});

function AppContent() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  // 如果未认证，显示登录页面
  if (!isAuthenticated || !user) {
    return <Login onLogin={(user) => {
      // 登录成功后重定向到首页
      navigate('/');
    }} />;
  }

  // 根据用户角色过滤菜单项
  const getFilteredMenuItems = () => {
    const allMenuItems = [
      { text: '仪表板', icon: <Dashboard />, path: '/', key: 'dashboard', roles: ['ADMIN', 'PRODUCTION_MANAGER', 'QUALITY_INSPECTOR', 'INVENTORY_MANAGER', 'SUPPLIER_REPRESENTATIVE', 'VIEWER'] },
      { text: '生产管理', icon: <Kitchen />, path: '/production', key: 'production', roles: ['ADMIN', 'PRODUCTION_MANAGER'] },
      { text: '库存管理', icon: <Inventory />, path: '/inventory', key: 'inventory', roles: ['ADMIN', 'PRODUCTION_MANAGER', 'INVENTORY_MANAGER', 'QUALITY_INSPECTOR'] },
      { text: '质量控制', icon: <Assessment />, path: '/quality', key: 'quality', roles: ['ADMIN', 'QUALITY_INSPECTOR', 'PRODUCTION_MANAGER'] },
      { text: '供应商管理', icon: <People />, path: '/suppliers', key: 'suppliers', roles: ['ADMIN', 'SUPPLIER_REPRESENTATIVE', 'PRODUCTION_MANAGER'] },
      { text: '系统设置', icon: <Settings />, path: '/settings', key: 'settings', roles: ['ADMIN'] },
    ];

    return allMenuItems.filter(item => item.roles.includes(user.role));
  };

  const menuItems = getFilteredMenuItems();

  const handleMenuClick = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.text : '中央厨房管理系统';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* 侧边导航栏 */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            🍽️ 中央厨房管理系统
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
              {user.fullName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {user.fullName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {ROLE_DISPLAY_NAMES[user.role]}
              </Typography>
            </Box>
          </Box>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* 主内容区域 */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* 顶部导航栏 */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: 'white',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                color: 'text.primary',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {getPageTitle()}
            </Typography>

            {/* 用户菜单 */}
            <IconButton sx={{ color: 'text.secondary', mr: 1 }}>
              <Notifications />
            </IconButton>
            <IconButton
              onClick={handleUserMenuClick}
              sx={{ color: 'text.primary' }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user.fullName.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ROLE_DISPLAY_NAMES[user.role]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.department}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                退出登录
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* 路由内容 */}
        <Routes>
          <Route path="/" element={<DashboardComponent />} />
          <Route path="/production" element={<ProductionManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/quality" element={<QualityManagement />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Routes>

        {/* 页脚 */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2026 中央厨房管理系统 - 现代化企业级解决方案
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
