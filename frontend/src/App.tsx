import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Menu, Dashboard, Kitchen, Assessment, Inventory, People, Settings, Notifications } from '@mui/icons-material';
import DashboardComponent from './components/dashboard/Dashboard';
import './App.css';

// 创建现代化企业主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // 现代蓝色
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#10b981', // 绿色
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const menuItems = [
    { text: '仪表板', icon: <Dashboard />, active: true },
    { text: '生产管理', icon: <Kitchen />, active: false },
    { text: '库存管理', icon: <Inventory />, active: false },
    { text: '质量控制', icon: <Assessment />, active: false },
    { text: '供应商管理', icon: <People />, active: false },
    { text: '系统设置', icon: <Settings />, active: false },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={item.active}
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
                <Menu />
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
                中央厨房管理系统
              </Typography>
              <IconButton sx={{ color: 'text.secondary' }}>
                <Notifications />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* 主要内容 */}
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <DashboardComponent />
          </Container>

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
    </ThemeProvider>
  );
}

export default App;
