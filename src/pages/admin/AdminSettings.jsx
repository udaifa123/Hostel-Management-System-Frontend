import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Chip,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  Collapse
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  VpnKey as PasswordIcon,
  ColorLens as ThemeIcon,
  Language as LanguageIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AdminPanelSettings as AdminIcon,
  Computer as ComputerIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Palette as PaletteIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  InvertColors as ColorfulIcon,
  Check as CheckCircleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Green Design Tokens
const G = {
  900: '#0D3318',
  800: '#1A5C2A',
  700: '#1E7A35',
  600: '#2E9142',
  500: '#3AAF51',
  400: '#5DC470',
  300: '#8FD9A0',
  200: '#C1EDCA',
  100: '#E4F7E8',
  50: '#F4FBF5',
};

const CARD_SHADOW = '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)';

// Theme definitions
const THEMES = {
  light: {
    name: 'Light',
    icon: <LightModeIcon />,
    colors: {
      primary: '#2E9142',
      secondary: '#5DC470',
      background: '#F4FBF5',
      surface: '#FFFFFF',
      text: '#0D3318',
      textSecondary: '#64748B',
      border: '#E4F7E8',
      cardBg: '#FFFFFF',
      sidebar: '#1A5C2A',
      header: '#1E7A35'
    }
  },
  dark: {
    name: 'Dark',
    icon: <DarkModeIcon />,
    colors: {
      primary: '#3AAF51',
      secondary: '#5DC470',
      background: '#121212',
      surface: '#1E1E1E',
      text: '#FFFFFF',
      textSecondary: '#A0A0A0',
      border: '#333333',
      cardBg: '#2D2D2D',
      sidebar: '#0D3318',
      header: '#1A5C2A'
    }
  },
  colorful: {
    name: 'Colorful',
    icon: <ColorfulIcon />,
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      cardBg: '#FFFFFF',
      sidebar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      header: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
    }
  },
  ocean: {
    name: 'Ocean Blue',
    icon: <PaletteIcon />,
    colors: {
      primary: '#1E88E5',
      secondary: '#42A5F5',
      background: '#E3F2FD',
      surface: '#FFFFFF',
      text: '#0D47A1',
      textSecondary: '#546E7A',
      border: '#BBDEFB',
      cardBg: '#FFFFFF',
      sidebar: '#1565C0',
      header: '#1976D2'
    }
  },
  sunset: {
    name: 'Sunset Orange',
    icon: <PaletteIcon />,
    colors: {
      primary: '#F59E0B',
      secondary: '#F97316',
      background: '#FFF7ED',
      surface: '#FFFFFF',
      text: '#7C2D12',
      textSecondary: '#9A3412',
      border: '#FED7AA',
      cardBg: '#FFFFFF',
      sidebar: '#EA580C',
      header: '#F97316'
    }
  },
  purple: {
    name: 'Royal Purple',
    icon: <PaletteIcon />,
    colors: {
      primary: '#7C3AED',
      secondary: '#A78BFA',
      background: '#F5F3FF',
      surface: '#FFFFFF',
      text: '#4C1D95',
      textSecondary: '#6D28D9',
      border: '#E9D5FF',
      cardBg: '#FFFFFF',
      sidebar: '#6D28D9',
      header: '#7C3AED'
    }
  },
  teal: {
    name: 'Teal Green',
    icon: <PaletteIcon />,
    colors: {
      primary: '#0D9488',
      secondary: '#14B8A6',
      background: '#F0FDFA',
      surface: '#FFFFFF',
      text: '#134E4A',
      textSecondary: '#115E59',
      border: '#CCFBF1',
      cardBg: '#FFFFFF',
      sidebar: '#0F766E',
      header: '#14B8A6'
    }
  }
};

const AdminSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [themeOpen, setThemeOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');

  // Apply theme to body
  useEffect(() => {
    const theme = THEMES[currentTheme];
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text;
    
    // Add theme class to body for global styles
    document.body.className = `theme-${currentTheme}`;
    
    // Store theme preference
    localStorage.setItem('adminTheme', currentTheme);
  }, [currentTheme]);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@hostel.com',
    phone: '+91 9876543210',
    department: 'Administration',
    role: 'Super Admin',
    avatar: ''
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    passwordExpiryDays: 90,
    lastPasswordChange: '2024-01-15'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newComplaintAlert: true,
    leaveRequestAlert: true,
    feeReminderAlert: true,
    attendanceAlert: false,
    systemUpdateAlert: true
  });

  const [system, setSystem] = useState({
    hostelName: 'Greenfield Hostel',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    weekStart: 'Monday',
    language: 'English',
    maintenanceMode: false
  });

  const [privacy, setPrivacy] = useState({
    showStudentContact: false,
    showStudentEmail: true,
    publicReports: false,
    dataRetentionDays: 365,
    allowDataExport: true
  });

  const handleProfileUpdate = () => {
    setSnackbarMessage('Profile updated successfully');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const handlePasswordChange = () => {
    setSnackbarMessage('Password changed successfully');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  const handleBackup = () => {
    setSnackbarMessage('Database backup completed successfully');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  const handleRestore = () => {
    setSnackbarMessage('System restored from backup');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  const handleClearData = () => {
    setSnackbarMessage('All cached data cleared');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  const handleSaveSettings = () => {
    setSnackbarMessage('All settings saved successfully');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const handleThemeChange = (themeKey) => {
    setCurrentTheme(themeKey);
    setSnackbarMessage(`${THEMES[themeKey].name} theme applied successfully`);
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setThemeOpen(false);
  };

  const currentThemeColors = THEMES[currentTheme].colors;

  return (
    <Box sx={{ 
      bgcolor: currentThemeColors.background, 
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <Box sx={{ height: 4, bgcolor: currentThemeColors.primary }} />

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Paper elevation={0} sx={{
          p: 3, mb: 4, borderRadius: 3,
          bgcolor: currentThemeColors.surface,
          border: `1px solid ${currentThemeColors.border}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: currentThemeColors.primary, width: 46, height: 46, borderRadius: 2 }}>
              <SettingsIcon sx={{ color: '#ffffff', fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: currentThemeColors.text, letterSpacing: '-0.01em' }}>
                System Settings
              </Typography>
              <Typography variant="body2" sx={{ color: currentThemeColors.textSecondary, mt: 0.25 }}>
                Configure application preferences and system configurations
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PaletteIcon />}
              onClick={() => setThemeOpen(!themeOpen)}
              sx={{
                borderColor: currentThemeColors.border,
                color: currentThemeColors.text,
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Theme: {THEMES[currentTheme].name}
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              sx={{
                bgcolor: currentThemeColors.primary,
                color: '#ffffff',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { opacity: 0.9 }
              }}
            >
              Save All Settings
            </Button>
          </Box>
        </Paper>

        {/* Theme Selection Dropdown */}
        <Collapse in={themeOpen}>
          <Paper elevation={0} sx={{
            p: 3, mb: 3, borderRadius: 3,
            bgcolor: currentThemeColors.surface,
            border: `2px solid ${currentThemeColors.primary}`,
          }}>
            <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon /> Choose Your Theme
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(THEMES).map(([key, theme]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Card
                    elevation={0}
                    onClick={() => handleThemeChange(key)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 2,
                      border: `2px solid ${currentTheme === key ? theme.colors.primary : currentThemeColors.border}`,
                      bgcolor: theme.colors.surface,
                      transition: 'all 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: theme.colors.primary, color: '#fff' }}>
                          {theme.icon}
                        </Avatar>
                        <Box flex={1}>
                          <Typography fontWeight={600} sx={{ color: theme.colors.text }}>
                            {theme.name}
                          </Typography>
                          <Box display="flex" gap={0.5} mt={0.5}>
                            <Box sx={{ width: 20, height: 20, bgcolor: theme.colors.primary, borderRadius: 1 }} />
                            <Box sx={{ width: 20, height: 20, bgcolor: theme.colors.secondary, borderRadius: 1 }} />
                            <Box sx={{ width: 20, height: 20, bgcolor: theme.colors.sidebar, borderRadius: 1 }} />
                          </Box>
                        </Box>
                        {currentTheme === key && (
                          <CheckCircleIcon sx={{ color: theme.colors.primary }} />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Collapse>

        {/* Tabs */}
        <Paper elevation={0} sx={{
          mb: 3, borderRadius: 2.5,
          bgcolor: currentThemeColors.surface,
          border: `1px solid ${currentThemeColors.border}`,
        }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: currentThemeColors.textSecondary,
                '&.Mui-selected': {
                  color: currentThemeColors.primary,
                }
              },
              '& .MuiTabs-indicator': {
                bgcolor: currentThemeColors.primary,
                height: 3,
              }
            }}
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label="Profile" />
            <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />
            <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" />
            <Tab icon={<ComputerIcon />} iconPosition="start" label="System" />
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Privacy" />
            <Tab icon={<BackupIcon />} iconPosition="start" label="Backup" />
          </Tabs>
        </Paper>

        {/* Tab Contents - Same as before with theme colors applied */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{
                borderRadius: 3, bgcolor: currentThemeColors.cardBg,
                border: `1px solid ${currentThemeColors.border}`,
                textAlign: 'center', p: 3
              }}>
                <Avatar sx={{
                  width: 120, height: 120,
                  bgcolor: currentThemeColors.primary,
                  fontSize: '3rem',
                  mx: 'auto',
                  mb: 2,
                  color: '#fff'
                }}>
                  {profile.name.charAt(0)}
                </Avatar>
                <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, fontSize: '1.2rem' }}>
                  {profile.name}
                </Typography>
                <Typography variant="body2" sx={{ color: currentThemeColors.textSecondary, mb: 2 }}>
                  {profile.role}
                </Typography>
                <Chip
                  label="Admin"
                  size="small"
                  sx={{ bgcolor: `${currentThemeColors.primary}20`, color: currentThemeColors.primary, fontWeight: 600 }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card elevation={0} sx={{
                borderRadius: 3, bgcolor: currentThemeColors.cardBg,
                border: `1px solid ${currentThemeColors.border}`,
                p: 3
              }}>
                <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, mb: 2 }}>
                  Personal Information
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: currentThemeColors.border },
                          '&:hover fieldset': { borderColor: currentThemeColors.primary },
                        },
                        '& .MuiInputLabel-root': { color: currentThemeColors.textSecondary },
                        '& .MuiInputBase-input': { color: currentThemeColors.text }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: currentThemeColors.border },
                          '&:hover fieldset': { borderColor: currentThemeColors.primary },
                        },
                        '& .MuiInputLabel-root': { color: currentThemeColors.textSecondary },
                        '& .MuiInputBase-input': { color: currentThemeColors.text }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: currentThemeColors.border },
                          '&:hover fieldset': { borderColor: currentThemeColors.primary },
                        },
                        '& .MuiInputLabel-root': { color: currentThemeColors.textSecondary },
                        '& .MuiInputBase-input': { color: currentThemeColors.text }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={profile.department}
                      onChange={(e) => setProfile({...profile, department: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: currentThemeColors.border },
                          '&:hover fieldset': { borderColor: currentThemeColors.primary },
                        },
                        '& .MuiInputLabel-root': { color: currentThemeColors.textSecondary },
                        '& .MuiInputBase-input': { color: currentThemeColors.text }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleProfileUpdate}
                      sx={{
                        bgcolor: currentThemeColors.primary,
                        color: '#ffffff',
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { opacity: 0.9 }
                      }}
                    >
                      Update Profile
                    </Button>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: currentThemeColors.border }} />

                <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, mb: 2 }}>
                  Change Password
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => { setDialogType('password'); setOpenDialog(true); }}
                  sx={{ borderColor: currentThemeColors.border, color: currentThemeColors.text }}
                >
                  Change Password
                </Button>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Security Tab */}
        {tabValue === 1 && (
          <Card elevation={0} sx={{
            borderRadius: 3, bgcolor: currentThemeColors.cardBg,
            border: `1px solid ${currentThemeColors.border}`,
            p: 3
          }}>
            <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, mb: 3 }}>
              Security Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={security.twoFactorAuth}
                      onChange={(e) => setSecurity({...security, twoFactorAuth: e.target.checked})}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                    />
                  }
                  label="Enable Two-Factor Authentication (2FA)"
                />
                <FormHelperText>Add an extra layer of security to your account</FormHelperText>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Session Timeout (minutes)"
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: currentThemeColors.border },
                    },
                  }}
                />
                <FormHelperText>Auto logout after inactivity</FormHelperText>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password Expiry (days)"
                  type="number"
                  value={security.passwordExpiryDays}
                  onChange={(e) => setSecurity({...security, passwordExpiryDays: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: currentThemeColors.border },
                    },
                  }}
                />
                <FormHelperText>Force password change after N days</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={security.loginNotifications}
                      onChange={(e) => setSecurity({...security, loginNotifications: e.target.checked})}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                    />
                  }
                  label="Email notifications for new logins"
                />
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Notifications Tab */}
        {tabValue === 2 && (
          <Card elevation={0} sx={{
            borderRadius: 3, bgcolor: currentThemeColors.cardBg,
            border: `1px solid ${currentThemeColors.border}`,
            p: 3
          }}>
            <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, mb: 3 }}>
              Notification Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 600, color: currentThemeColors.text, mb: 2 }}>
                  Channels
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.smsNotifications}
                        onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                      />
                    }
                    label="SMS Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushNotifications}
                        onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                      />
                    }
                    label="Push Notifications"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 600, color: currentThemeColors.text, mb: 2 }}>
                  Events
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.newComplaintAlert}
                        onChange={(e) => setNotifications({...notifications, newComplaintAlert: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                      />
                    }
                    label="New Complaint Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.leaveRequestAlert}
                        onChange={(e) => setNotifications({...notifications, leaveRequestAlert: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                      />
                    }
                    label="Leave Request Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.feeReminderAlert}
                        onChange={(e) => setNotifications({...notifications, feeReminderAlert: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                      />
                    }
                    label="Fee Reminder Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.attendanceAlert}
                        onChange={(e) => setNotifications({...notifications, attendanceAlert: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                      />
                    }
                    label="Attendance Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.systemUpdateAlert}
                        onChange={(e) => setNotifications({...notifications, systemUpdateAlert: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                      />
                    }
                    label="System Update Alerts"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* System Tab */}
        {tabValue === 3 && (
          <Card elevation={0} sx={{
            borderRadius: 3, bgcolor: currentThemeColors.cardBg,
            border: `1px solid ${currentThemeColors.border}`,
            p: 3
          }}>
            <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, mb: 3 }}>
              System Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hostel Name"
                  value={system.hostelName}
                  onChange={(e) => setSystem({...system, hostelName: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: currentThemeColors.border },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={system.timezone}
                    onChange={(e) => setSystem({...system, timezone: e.target.value})}
                    label="Timezone"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Asia/Kolkata">IST (UTC+5:30)</MenuItem>
                    <MenuItem value="America/New_York">EST (UTC-5:00)</MenuItem>
                    <MenuItem value="Europe/London">GMT (UTC+0:00)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={system.dateFormat}
                    onChange={(e) => setSystem({...system, dateFormat: e.target.value})}
                    label="Date Format"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Week Start</InputLabel>
                  <Select
                    value={system.weekStart}
                    onChange={(e) => setSystem({...system, weekStart: e.target.value})}
                    label="Week Start"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Monday">Monday</MenuItem>
                    <MenuItem value="Sunday">Sunday</MenuItem>
                    <MenuItem value="Saturday">Saturday</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={system.language}
                    onChange={(e) => setSystem({...system, language: e.target.value})}
                    label="Language"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Hindi">Hindi</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={system.maintenanceMode}
                      onChange={(e) => setSystem({...system, maintenanceMode: e.target.checked})}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                    />
                  }
                  label="Maintenance Mode"
                />
                <FormHelperText>When enabled, only admins can access the system</FormHelperText>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Privacy Tab */}
        {tabValue === 4 && (
          <Card elevation={0} sx={{
            borderRadius: 3, bgcolor: currentThemeColors.cardBg,
            border: `1px solid ${currentThemeColors.border}`,
            p: 3
          }}>
            <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, mb: 3 }}>
              Privacy & Data Management
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.showStudentContact}
                      onChange={(e) => setPrivacy({...privacy, showStudentContact: e.target.checked})}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                    />
                  }
                  label="Show student contact details to other students"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.showStudentEmail}
                      onChange={(e) => setPrivacy({...privacy, showStudentEmail: e.target.checked})}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                    />
                  }
                  label="Show student email addresses publicly"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.publicReports}
                      onChange={(e) => setPrivacy({...privacy, publicReports: e.target.checked})}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                    />
                  }
                  label="Allow public access to reports"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.allowDataExport}
                      onChange={(e) => setPrivacy({...privacy, allowDataExport: e.target.checked})}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: currentThemeColors.primary } }}
                    />
                  }
                  label="Allow data export for users"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data Retention Period (days)"
                  type="number"
                  value={privacy.dataRetentionDays}
                  onChange={(e) => setPrivacy({...privacy, dataRetentionDays: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: currentThemeColors.border },
                    },
                  }}
                />
                <FormHelperText>How long to keep user activity logs</FormHelperText>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Backup Tab */}
        {tabValue === 5 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{
                borderRadius: 3, bgcolor: currentThemeColors.cardBg,
                border: `1px solid ${currentThemeColors.border}`,
                p: 3, textAlign: 'center'
              }}>
                <Avatar sx={{
                  bgcolor: `${currentThemeColors.primary}20`,
                  color: currentThemeColors.primary,
                  width: 64, height: 64, mx: 'auto', mb: 2
                }}>
                  <BackupIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, mb: 1 }}>
                  Database Backup
                </Typography>
                <Typography variant="body2" sx={{ color: currentThemeColors.textSecondary, mb: 2 }}>
                  Create a full backup of all system data
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<BackupIcon />}
                  onClick={() => { setDialogType('backup'); setOpenDialog(true); }}
                  sx={{
                    bgcolor: currentThemeColors.primary,
                    color: '#ffffff',
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Create Backup
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{
                borderRadius: 3, bgcolor: currentThemeColors.cardBg,
                border: `1px solid ${currentThemeColors.border}`,
                p: 3, textAlign: 'center'
              }}>
                <Avatar sx={{
                  bgcolor: `${currentThemeColors.primary}20`,
                  color: currentThemeColors.primary,
                  width: 64, height: 64, mx: 'auto', mb: 2
                }}>
                  <RestoreIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, mb: 1 }}>
                  Restore System
                </Typography>
                <Typography variant="body2" sx={{ color: currentThemeColors.textSecondary, mb: 2 }}>
                  Restore system from a previous backup
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  onClick={() => { setDialogType('restore'); setOpenDialog(true); }}
                  sx={{ borderColor: currentThemeColors.border, color: currentThemeColors.text }}
                >
                  Restore Backup
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card elevation={0} sx={{
                borderRadius: 3, bgcolor: currentThemeColors.cardBg,
                border: `1px solid ${currentThemeColors.border}`,
                p: 3
              }}>
                <Typography sx={{ fontWeight: 700, color: currentThemeColors.text, mb: 2 }}>
                  System Maintenance
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => { setDialogType('clearCache'); setOpenDialog(true); }}
                      sx={{ borderColor: currentThemeColors.border, color: '#EF4444' }}
                    >
                      Clear Cache
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      sx={{ borderColor: currentThemeColors.border, color: currentThemeColors.text }}
                    >
                      Reset Settings
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      sx={{ borderColor: currentThemeColors.border, color: currentThemeColors.text }}
                    >
                      Export Logs
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Dialogs */}
        <Dialog
          open={openDialog && dialogType === 'password'}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: currentThemeColors.surface,
              border: `1px solid ${currentThemeColors.border}`,
            }
          }}
        >
          <Box sx={{ height: 4, bgcolor: currentThemeColors.primary, borderRadius: '12px 12px 0 0' }} />
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: currentThemeColors.primary, width: 38, height: 38 }}>
                <PasswordIcon sx={{ color: '#fff' }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: currentThemeColors.text }}>
                Change Password
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              margin="normal"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: currentThemeColors.textSecondary }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handlePasswordChange}
              sx={{ bgcolor: currentThemeColors.primary, '&:hover': { opacity: 0.9 } }}
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDialog && (dialogType === 'backup' || dialogType === 'restore' || dialogType === 'clearCache')}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: currentThemeColors.surface,
              border: `1px solid ${currentThemeColors.border}`,
            }
          }}
        >
          <DialogTitle>
            <Typography sx={{ fontWeight: 700, color: currentThemeColors.text }}>
              {dialogType === 'backup' && 'Create Database Backup'}
              {dialogType === 'restore' && 'Restore System'}
              {dialogType === 'clearCache' && 'Clear System Cache'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: currentThemeColors.textSecondary }}>
              {dialogType === 'backup' && 'This will create a complete backup of all system data. The backup file will be saved to your computer.'}
              {dialogType === 'restore' && 'This will restore the system from a previous backup. Current data will be overwritten. Are you sure?'}
              {dialogType === 'clearCache' && 'This will clear all cached data from the system. Users may experience slower performance temporarily while caches rebuild.'}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: currentThemeColors.textSecondary }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={
                dialogType === 'backup' ? handleBackup :
                dialogType === 'restore' ? handleRestore :
                handleClearData
              }
              sx={{ bgcolor: currentThemeColors.primary, '&:hover': { opacity: 0.9 } }}
            >
              {dialogType === 'backup' && 'Create Backup'}
              {dialogType === 'restore' && 'Restore'}
              {dialogType === 'clearCache' && 'Clear Cache'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={snackbarSeverity} sx={{ borderRadius: 2 }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AdminSettings;