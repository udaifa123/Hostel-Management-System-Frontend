import React, { useState } from 'react';
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
  FormLabel
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
  CheckCircle as CheckIcon
} from '@mui/icons-material';

// ─── Green Design Tokens ───────────────────────────────────────────────
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
  50:  '#F4FBF5',
};

const CARD_SHADOW = '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)';

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Profile Settings
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@hostel.com',
    phone: '+91 9876543210',
    department: 'Administration',
    role: 'Super Admin',
    avatar: ''
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    passwordExpiryDays: 90,
    lastPasswordChange: '2024-01-15'
  });

  // Notification Settings
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

  // System Settings
  const [system, setSystem] = useState({
    hostelName: 'Greenfield Hostel',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    weekStart: 'Monday',
    language: 'English',
    theme: 'green',
    maintenanceMode: false
  });

  // Privacy Settings
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

  const getThemeColors = () => {
    switch(system.theme) {
      case 'green':
        return { primary: G[600], secondary: G[400], bg: G[50] };
      case 'blue':
        return { primary: '#1E88E5', secondary: '#64B5F6', bg: '#F0F7FF' };
      case 'dark':
        return { primary: '#1A1A2E', secondary: '#16213E', bg: '#0F0F1A' };
      default:
        return { primary: G[600], secondary: G[400], bg: G[50] };
    }
  };

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
      {/* Top accent bar */}
      <Box sx={{ height: 4, bgcolor: G[600] }} />

      <Box sx={{ p: 3 }}>

        {/* ── Header ── */}
        <Paper elevation={0} sx={{
          p: 3, mb: 4, borderRadius: 3,
          bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
          boxShadow: '0 2px 8px rgba(13,51,24,0.10)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
              <SettingsIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                System Settings
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Configure application preferences and system configurations
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            sx={{
              bgcolor: G[700], color: '#ffffff', fontWeight: 600,
              borderRadius: 2, textTransform: 'none',
              boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
              '&:hover': { bgcolor: G[800] }
            }}
          >
            Save All Settings
          </Button>
        </Paper>

        {/* ── Settings Tabs ── */}
        <Paper elevation={0} sx={{
          mb: 3, borderRadius: 2.5,
          bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
        }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: G[500],
                '&.Mui-selected': {
                  color: G[700],
                }
              },
              '& .MuiTabs-indicator': {
                bgcolor: G[600],
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

        {/* ─── Profile Settings Tab ─── */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{
                borderRadius: 3, bgcolor: '#ffffff',
                border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
                textAlign: 'center', p: 3
              }}>
                <Avatar sx={{
                  width: 120, height: 120,
                  bgcolor: G[800],
                  fontSize: '3rem',
                  mx: 'auto',
                  mb: 2
                }}>
                  {profile.name.charAt(0)}
                </Avatar>
                <Typography sx={{ fontWeight: 700, color: G[800], fontSize: '1.2rem' }}>
                  {profile.name}
                </Typography>
                <Typography variant="body2" sx={{ color: G[500], mb: 2 }}>
                  {profile.role}
                </Typography>
                <Chip
                  label="Admin"
                  size="small"
                  sx={{ bgcolor: G[100], color: G[600], fontWeight: 600 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  fullWidth
                  sx={{ mt: 2, borderColor: G[200], color: G[600] }}
                >
                  Change Avatar
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card elevation={0} sx={{
                borderRadius: 3, bgcolor: '#ffffff',
                border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
                p: 3
              }}>
                <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>
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
                          '& fieldset': { borderColor: G[200] },
                        },
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
                          '& fieldset': { borderColor: G[200] },
                        },
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
                          '& fieldset': { borderColor: G[200] },
                        },
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
                          '& fieldset': { borderColor: G[200] },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleProfileUpdate}
                      sx={{
                        bgcolor: G[700], color: '#ffffff',
                        borderRadius: 2, textTransform: 'none',
                        '&:hover': { bgcolor: G[800] }
                      }}
                    >
                      Update Profile
                    </Button>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: G[100] }} />

                <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>
                  Change Password
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => { setDialogType('password'); setOpenDialog(true); }}
                  sx={{ borderColor: G[200], color: G[600] }}
                >
                  Change Password
                </Button>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* ─── Security Settings Tab ─── */}
        {tabValue === 1 && (
          <Card elevation={0} sx={{
            borderRadius: 3, bgcolor: '#ffffff',
            border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
            p: 3
          }}>
            <Typography sx={{ fontWeight: 700, color: G[800], mb: 3 }}>
              Security Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={security.twoFactorAuth}
                      onChange={(e) => setSecurity({...security, twoFactorAuth: e.target.checked})}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
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
                      '& fieldset': { borderColor: G[200] },
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
                      '& fieldset': { borderColor: G[200] },
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
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                    />
                  }
                  label="Email notifications for new logins"
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ borderRadius: 2, bgcolor: G[50] }}>
                  Last password changed: {security.lastPasswordChange}
                </Alert>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* ─── Notification Settings Tab ─── */}
        {tabValue === 2 && (
          <Card elevation={0} sx={{
            borderRadius: 3, bgcolor: '#ffffff',
            border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
            p: 3
          }}>
            <Typography sx={{ fontWeight: 700, color: G[800], mb: 3 }}>
              Notification Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 600, color: G[700], mb: 2 }}>
                  Channels
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.smsNotifications}
                        onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                      />
                    }
                    label="SMS Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushNotifications}
                        onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                      />
                    }
                    label="Push Notifications"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 600, color: G[700], mb: 2 }}>
                  Events
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.newComplaintAlert}
                        onChange={(e) => setNotifications({...notifications, newComplaintAlert: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                      />
                    }
                    label="New Complaint Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.leaveRequestAlert}
                        onChange={(e) => setNotifications({...notifications, leaveRequestAlert: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                      />
                    }
                    label="Leave Request Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.feeReminderAlert}
                        onChange={(e) => setNotifications({...notifications, feeReminderAlert: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                      />
                    }
                    label="Fee Reminder Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.attendanceAlert}
                        onChange={(e) => setNotifications({...notifications, attendanceAlert: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                      />
                    }
                    label="Attendance Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.systemUpdateAlert}
                        onChange={(e) => setNotifications({...notifications, systemUpdateAlert: e.target.checked})}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                      />
                    }
                    label="System Update Alerts"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* ─── System Settings Tab ─── */}
        {tabValue === 3 && (
          <Card elevation={0} sx={{
            borderRadius: 3, bgcolor: '#ffffff',
            border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
            p: 3
          }}>
            <Typography sx={{ fontWeight: 700, color: G[800], mb: 3 }}>
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
                      '& fieldset': { borderColor: G[200] },
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={system.theme}
                    onChange={(e) => setSystem({...system, theme: e.target.value})}
                    label="Theme"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="green">Green (Default)</MenuItem>
                    <MenuItem value="blue">Blue</MenuItem>
                    <MenuItem value="dark">Dark Mode</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={system.maintenanceMode}
                      onChange={(e) => setSystem({...system, maintenanceMode: e.target.checked})}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                    />
                  }
                  label="Maintenance Mode"
                />
                <FormHelperText>When enabled, only admins can access the system</FormHelperText>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* ─── Privacy Settings Tab ─── */}
        {tabValue === 4 && (
          <Card elevation={0} sx={{
            borderRadius: 3, bgcolor: '#ffffff',
            border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
            p: 3
          }}>
            <Typography sx={{ fontWeight: 700, color: G[800], mb: 3 }}>
              Privacy & Data Management
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={privacy.showStudentContact}
                      onChange={(e) => setPrivacy({...privacy, showStudentContact: e.target.checked})}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
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
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
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
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
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
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
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
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
                <FormHelperText>How long to keep user activity logs</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  Changes to privacy settings may affect user experience and compliance with data protection regulations.
                </Alert>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* ─── Backup Settings Tab ─── */}
        {tabValue === 5 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{
                borderRadius: 3, bgcolor: '#ffffff',
                border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
                p: 3, textAlign: 'center'
              }}>
                <Avatar sx={{
                  bgcolor: G[100], color: G[600],
                  width: 64, height: 64, mx: 'auto', mb: 2
                }}>
                  <BackupIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography sx={{ fontWeight: 700, color: G[800], mb: 1 }}>
                  Database Backup
                </Typography>
                <Typography variant="body2" sx={{ color: G[500], mb: 2 }}>
                  Create a full backup of all system data
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<BackupIcon />}
                  onClick={() => { setDialogType('backup'); setOpenDialog(true); }}
                  sx={{
                    bgcolor: G[700], color: '#ffffff',
                    borderRadius: 2, textTransform: 'none',
                    '&:hover': { bgcolor: G[800] }
                  }}
                >
                  Create Backup
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{
                borderRadius: 3, bgcolor: '#ffffff',
                border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
                p: 3, textAlign: 'center'
              }}>
                <Avatar sx={{
                  bgcolor: G[100], color: G[600],
                  width: 64, height: 64, mx: 'auto', mb: 2
                }}>
                  <RestoreIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography sx={{ fontWeight: 700, color: G[800], mb: 1 }}>
                  Restore System
                </Typography>
                <Typography variant="body2" sx={{ color: G[500], mb: 2 }}>
                  Restore system from a previous backup
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  onClick={() => { setDialogType('restore'); setOpenDialog(true); }}
                  sx={{ borderColor: G[200], color: G[600] }}
                >
                  Restore Backup
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card elevation={0} sx={{
                borderRadius: 3, bgcolor: '#ffffff',
                border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
                p: 3
              }}>
                <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>
                  System Maintenance
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => { setDialogType('clearCache'); setOpenDialog(true); }}
                      sx={{ borderColor: G[200], color: '#EF4444' }}
                    >
                      Clear Cache
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      sx={{ borderColor: G[200], color: G[600] }}
                    >
                      Reset Settings
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      sx={{ borderColor: G[200], color: G[600] }}
                    >
                      Export Logs
                    </Button>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2, borderColor: G[100] }} />
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Last backup: March 15, 2024 at 10:30 AM
                </Alert>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* ─── Password Change Dialog ─── */}
        <Dialog
          open={openDialog && dialogType === 'password'}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
            }
          }}
        >
          <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: G[800], width: 38, height: 38 }}>
                <PasswordIcon sx={{ color: G[200] }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
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
            <Button onClick={() => setOpenDialog(false)} sx={{ color: G[600] }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handlePasswordChange}
              sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] } }}
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* ─── Backup/Restore Confirmation Dialog ─── */}
        <Dialog
          open={openDialog && (dialogType === 'backup' || dialogType === 'restore' || dialogType === 'clearCache')}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
            }
          }}
        >
          <DialogTitle>
            <Typography sx={{ fontWeight: 700, color: G[800] }}>
              {dialogType === 'backup' && 'Create Database Backup'}
              {dialogType === 'restore' && 'Restore System'}
              {dialogType === 'clearCache' && 'Clear System Cache'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: G[600] }}>
              {dialogType === 'backup' && 'This will create a complete backup of all system data. The backup file will be saved to your computer.'}
              {dialogType === 'restore' && 'This will restore the system from a previous backup. Current data will be overwritten. Are you sure?'}
              {dialogType === 'clearCache' && 'This will clear all cached data from the system. Users may experience slower performance temporarily while caches rebuild.'}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: G[600] }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={
                dialogType === 'backup' ? handleBackup :
                dialogType === 'restore' ? handleRestore :
                handleClearData
              }
              sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] } }}
            >
              {dialogType === 'backup' && 'Create Backup'}
              {dialogType === 'restore' && 'Restore'}
              {dialogType === 'clearCache' && 'Clear Cache'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
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