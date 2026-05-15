import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  Button,
  TextField,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  AccountCircle as AccountCircleIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      attendance: true,
      leave: true,
      fee: true,
      complaint: true
    },
    theme: 'light',
    language: 'en',
    privacy: {
      showProfile: true,
      showAttendance: true,
      showFees: false
    }
  });

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
    loadSettings();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await studentService.getProfile();
      setProfile(prev => ({
        ...prev,
        name: data.name || user?.name,
        email: data.email || user?.email,
        phone: data.phone || ''
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('studentSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = () => {
    localStorage.setItem('studentSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleLanguageChange = (event) => {
    setSettings(prev => ({ ...prev, language: event.target.value }));
  };

  const handleProfileUpdate = async () => {
    if (profile.newPassword || profile.confirmPassword) {
      if (profile.newPassword !== profile.confirmPassword) {
        toast.error('New passwords do not match!');
        return;
      }
      if (profile.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters!');
        return;
      }
    }

    setLoading(true);
    try {
      await studentService.updateProfile({
        name: profile.name,
        phone: profile.phone,
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword
      });
      
      toast.success('Profile updated successfully!');
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await studentService.deleteAccount();
      toast.success('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/student/dashboard')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#10B981' }}>
              Settings
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<AccountCircleIcon />} label="Profile" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<SecurityIcon />} label="Privacy & Security" />
            <Tab icon={<PaletteIcon />} label="Appearance" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 2, textAlign: 'center', p: 3 }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: '#10B981',
                        fontSize: '2.5rem'
                      }}
                    >
                      {profile.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="h6">{profile.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {profile.email}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{ mt: 2 }}
                      fullWidth
                    >
                      Change Photo
                    </Button>
                  </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card sx={{ borderRadius: 2, p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#10B981' }}>
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          InputProps={{
                            startAdornment: <AccountCircleIcon sx={{ mr: 1, color: '#10B981' }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={profile.email}
                          disabled
                          InputProps={{
                            startAdornment: <EmailIcon sx={{ mr: 1, color: '#10B981' }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          InputProps={{
                            startAdornment: <PhoneIcon sx={{ mr: 1, color: '#10B981' }} />
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#10B981', mt: 2 }}>
                          Change Password
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type={showPassword ? 'text' : 'password'}
                          label="Current Password"
                          value={profile.currentPassword}
                          onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                          InputProps={{
                            startAdornment: <LockIcon sx={{ mr: 1, color: '#10B981' }} />,
                            endAdornment: (
                              <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type={showNewPassword ? 'text' : 'password'}
                          label="New Password"
                          value={profile.newPassword}
                          onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                          InputProps={{
                            endAdornment: (
                              <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type={showConfirmPassword ? 'text' : 'password'}
                          label="Confirm Password"
                          value={profile.confirmPassword}
                          onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                          InputProps={{
                            endAdornment: (
                              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            )
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleProfileUpdate}
                            disabled={loading}
                            sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                          >
                            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setOpenDeleteDialog(true)}
                          >
                            Delete Account
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 4 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#10B981' }}>
                    Notification Preferences
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon sx={{ color: '#10B981' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email Notifications" 
                        secondary="Receive updates via email"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={settings.notifications.email}
                          onChange={() => handleNotificationChange('email')}
                          color="success"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon sx={{ color: '#10B981' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Push Notifications" 
                        secondary="Receive browser notifications"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={settings.notifications.push}
                          onChange={() => handleNotificationChange('push')}
                          color="success"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon sx={{ color: '#10B981' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="SMS Notifications" 
                        secondary="Receive text messages"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={settings.notifications.sms}
                          onChange={() => handleNotificationChange('sms')}
                          color="success"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>

                  <Typography variant="h6" gutterBottom sx={{ color: '#10B981', mt: 3 }}>
                    Notification Types
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                        <Typography variant="subtitle2" gutterBottom>Attendance Updates</Typography>
                        <Switch
                          checked={settings.notifications.attendance}
                          onChange={() => handleNotificationChange('attendance')}
                          color="success"
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                        <Typography variant="subtitle2" gutterBottom>Leave Requests</Typography>
                        <Switch
                          checked={settings.notifications.leave}
                          onChange={() => handleNotificationChange('leave')}
                          color="success"
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                        <Typography variant="subtitle2" gutterBottom>Fee Reminders</Typography>
                        <Switch
                          checked={settings.notifications.fee}
                          onChange={() => handleNotificationChange('fee')}
                          color="success"
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                        <Typography variant="subtitle2" gutterBottom>Complaint Updates</Typography>
                        <Switch
                          checked={settings.notifications.complaint}
                          onChange={() => handleNotificationChange('complaint')}
                          color="success"
                        />
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={saveSettings}
                      sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                    >
                      Save Notification Settings
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {tabValue === 2 && (
            <Box sx={{ p: 4 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#10B981' }}>
                    Privacy Settings
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Show Profile to Others" 
                        secondary="Allow other students to view your profile"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={settings.privacy.showProfile}
                          onChange={() => setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, showProfile: !prev.privacy.showProfile }
                          }))}
                          color="success"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText 
                        primary="Show Attendance" 
                        secondary="Make attendance visible to others"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={settings.privacy.showAttendance}
                          onChange={() => setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, showAttendance: !prev.privacy.showAttendance }
                          }))}
                          color="success"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <ListItemText 
                        primary="Show Fee Status" 
                        secondary="Display fee payment status"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={settings.privacy.showFees}
                          onChange={() => setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, showFees: !prev.privacy.showFees }
                          }))}
                          color="success"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>

                  <Typography variant="h6" gutterBottom sx={{ color: '#10B981', mt: 3 }}>
                    Security
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Button
                    variant="outlined"
                    startIcon={<LockIcon />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Two-Factor Authentication (Coming Soon)
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SecurityIcon />}
                    fullWidth
                  >
                    Login History
                  </Button>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={saveSettings}
                      sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                    >
                      Save Privacy Settings
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {tabValue === 3 && (
            <Box sx={{ p: 4 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#10B981' }}>
                    Theme
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: settings.theme === 'light' ? '2px solid #10B981' : '1px solid #e0e0e0',
                          borderRadius: 2,
                          '&:hover': { boxShadow: 3 }
                        }}
                        onClick={() => handleThemeChange('light')}
                      >
                        <LightModeIcon sx={{ fontSize: 48, color: '#FFB300', mb: 2 }} />
                        <Typography variant="h6">Light Mode</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bright and clean interface
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: settings.theme === 'dark' ? '2px solid #10B981' : '1px solid #e0e0e0',
                          borderRadius: 2,
                          bgcolor: '#1e1e2f',
                          color: 'white',
                          '&:hover': { boxShadow: 3 }
                        }}
                        onClick={() => handleThemeChange('dark')}
                      >
                        <DarkModeIcon sx={{ fontSize: 48, color: '#90A4AE', mb: 2 }} />
                        <Typography variant="h6">Dark Mode</Typography>
                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                          Easy on the eyes at night
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Typography variant="h6" gutterBottom sx={{ color: '#10B981', mt: 3 }}>
                    Language
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <FormControl fullWidth>
                    <InputLabel>Select Language</InputLabel>
                    <Select
                      value={settings.language}
                      onChange={handleLanguageChange}
                      label="Select Language"
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="ar">Arabic</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                      <MenuItem value="ml">Malayalam</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={saveSettings}
                      sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                    >
                      Save Appearance Settings
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Paper>
      </Container>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ color: '#ef4444' }}>Delete Account?</DialogTitle>
        <DialogContent>
          <Typography>
            This action cannot be undone. All your data will be permanently deleted.
            Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentSettings;