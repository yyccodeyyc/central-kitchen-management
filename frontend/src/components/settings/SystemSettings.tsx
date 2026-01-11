import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid,
  TextField, Button, Switch, FormControlLabel, Divider,
  Alert, Paper, Avatar, IconButton
} from '@mui/material';
import { Settings, Person, Security, Notifications, Palette, Save } from '@mui/icons-material';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // 用户设置
    username: 'admin',
    email: 'admin@ckm.com',
    notifications: true,
    darkMode: false,

    // 系统设置
    autoBackup: true,
    dataRetention: 365,
    maxFileSize: 10,

    // 安全设置
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  });

  const [saveMessage, setSaveMessage] = useState('');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // 这里应该调用API保存设置
    setSaveMessage('设置已保存成功！');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          ⚙️ 系统设置
        </Typography>
        <Typography variant="body1" color="text.secondary">
          个性化设置与系统配置管理
        </Typography>
      </Box>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 用户信息设置 */}
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">用户信息</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                  {settings.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">{settings.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    管理员
                  </Typography>
                </Box>
                <IconButton sx={{ ml: 'auto' }}>
                  <Person />
                </IconButton>
              </Box>

              <TextField
                fullWidth
                label="用户名"
                value={settings.username}
                onChange={(e) => handleSettingChange('username', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="邮箱"
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  />
                }
                label="启用通知"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 界面设置 */}
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Palette sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">界面设置</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  />
                }
                label="深色模式"
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                切换应用的深色/浅色主题
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                数据显示
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="显示图表动画"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 系统设置 */}
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Settings sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">系统设置</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  />
                }
                label="自动备份"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="数据保留天数"
                type="number"
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                helperText="系统将保留的历史数据天数"
              />

              <TextField
                fullWidth
                label="最大文件大小 (MB)"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                helperText="允许上传的最大文件大小"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 安全设置 */}
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Security sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">安全设置</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  />
                }
                label="双因子认证"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="会话超时时间 (分钟)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="密码过期天数"
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                helperText="密码过期后需要修改"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 保存按钮 */}
        <Grid xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              size="large"
            >
              保存设置
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SystemSettings;
