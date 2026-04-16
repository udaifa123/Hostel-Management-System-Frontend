import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Card,
  CardContent,
  IconButton,
  Chip,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  alpha,
  Fade,
  Zoom,
  Tabs,
  Tab,
  Switch as MUISwitch,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  PrivacyTip as PrivacyTipIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Verified as VerifiedIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Translate as TranslateIcon,
  DataUsage as DataUsageIcon,
  Backup as BackupIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Info as InfoIcon,
  Emergency as EmergencyIcon,
  CloudUpload as CloudUploadIcon,
  LocationCity as LocationCityIcon,
  PinDrop as PinDropIcon,
  CalendarMonth as CalendarMonthIcon,
  Badge as BadgeIcon,
  Home as HomeIcon,
  WorkOutline as WorkOutlineIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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

const GlassPaper = styled(Paper)({
  background: '#ffffff',
  borderRadius: 16,
  boxShadow: CARD_SHADOW,
  border: `1px solid ${G[200]}`,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
});

const SettingsCard = styled(Card)({
  background: '#ffffff',
  borderRadius: 12,
  border: `1px solid ${G[200]}`,
  transition: 'all 0.3s ease',
  height: '100%',
  boxShadow: CARD_SHADOW,
});

const ProfileAvatar = styled(Avatar)({
  width: 130,
  height: 130,
  margin: '0 auto',
  border: `4px solid ${alpha(G[600], 0.3)}`,
  boxShadow: `0 8px 24px -8px ${alpha(G[600], 0.3)}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: G[600]
  }
});

const SettingItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 0',
  borderBottom: `1px solid ${alpha(G[200], 0.6)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(G[600], 0.02)
  },
  '&:last-child': {
    borderBottom: 'none'
  }
});

const SectionTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 700,
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: G[800],
  paddingLeft: '12px',
  borderLeft: `3px solid ${G[600]}`,
  '& svg': {
    color: G[600]
  }
});

const InfoRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  background: alpha(G[600], 0.04),
  borderRadius: 8,
  marginBottom: '12px',
  '&:hover': {
    background: alpha(G[600], 0.08)
  }
});

const WardenSettings = () => {
  const { token, user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    designation: '',
    joinDate: '',
    hostelName: '',
    blockName: '',
    officeAddress: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    emergencyName: '',
    bio: '',
    profileImage: ''
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    leaveRequests: true,
    complaints: true,
    attendanceAlerts: true,
    feeAlerts: false,
    dailyDigest: true,
    profileVisibility: 'staff_only',
    showEmail: true,
    showPhone: true,
    showDepartment: true,
    theme: 'light',
    primaryColor: G[600],
    fontSize: 'medium',
    compactView: false,
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
    autoBackup: true,
    backupFrequency: 'weekly',
    dataRetention: 90
  });

  const [editForm, setEditForm] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/warden/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Profile response:', response.data);
      if (response.data && response.data.success) {
        setProfile(response.data.data);
        // Update auth context if needed
        if (setUser && response.data.data) {
          setUser(prev => ({ ...prev, ...response.data.data }));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showNotification('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/warden/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        setSettings(prev => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
    if (severity === 'success') toast.success(message);
    else if (severity === 'error') toast.error(message);
    else toast(message);
  };

  const handleEdit = () => {
    setEditForm({ ...profile });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditForm({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = async (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    try {
      await axios.put(`${API_URL}/warden/settings`, { [setting]: value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification(`${setting.replace(/([A-Z])/g, ' $1').trim()} updated`, 'success');
    } catch (error) {
      showNotification('Failed to update setting', 'error');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {};
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== profile[key]) {
          updateData[key] = editForm[key];
        }
      });
      
      if (Object.keys(updateData).length === 0) {
        setEditMode(false);
        showNotification('No changes to save', 'info');
        return;
      }
      
      const response = await axios.put(`${API_URL}/warden/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Update response:', response.data);
      
      if (response.data && response.data.success) {
        // Update local profile state
        const updatedProfile = { ...profile, ...editForm };
        setProfile(updatedProfile);
        
        // Update auth context
        if (setUser) {
          setUser(prev => ({ ...prev, ...updatedProfile }));
        }
        
        showNotification('Profile updated successfully!', 'success');
        setEditMode(false);
        
        // Refetch to ensure consistency
        await fetchProfile();
      } else {
        throw new Error(response.data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      showNotification(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }
    
    try {
      const response = await axios.put(`${API_URL}/warden/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        showNotification('Password changed successfully!', 'success');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to change password', 'error');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File size should be less than 5MB', 'error');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
    if (!selectedImage) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('profileImage', selectedImage);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await axios.post(`${API_URL}/warden/upload-profile-image`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      clearInterval(interval);
      setUploadProgress(100);
      
      if (response.data && response.data.success) {
        const imageUrl = response.data.data?.imageUrl || imagePreview;
        setProfile(prev => ({ ...prev, profileImage: imageUrl }));
        
        // Update auth context
        if (setUser) {
          setUser(prev => ({ ...prev, profileImage: imageUrl }));
        }
        
        showNotification('Profile photo updated successfully!', 'success');
        setImageUploadOpen(false);
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        throw new Error(response.data?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showNotification(error.message || 'Failed to upload image', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'W';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const exportData = () => {
    const exportData = {
      profile: {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        department: profile.department,
        designation: profile.designation,
        hostelName: profile.hostelName
      },
      settings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `warden_settings_${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
    showNotification('Data exported successfully', 'success');
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const importedData = JSON.parse(event.target.result);
            if (importedData.settings) {
              await axios.put(`${API_URL}/warden/settings`, importedData.settings, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setSettings(prev => ({ ...prev, ...importedData.settings }));
              showNotification('Settings imported successfully!', 'success');
            }
          } catch (error) {
            showNotification('Invalid file format', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const renderField = (label, value, icon, fieldName, options = {}) => (
    <InfoRow>
      <Box sx={{ color: G[600], minWidth: 40 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: G[500], fontWeight: 600 }}>
          {label}
        </Typography>
        {editMode ? (
          <TextField
            fullWidth
            name={fieldName}
            value={editForm[fieldName] || ''}
            onChange={handleInputChange}
            size="small"
            type={options.type || 'text'}
            multiline={options.multiline}
            rows={options.rows}
            sx={{ mt: 0.5 }}
            InputProps={{
              sx: { borderRadius: 2, '& fieldset': { borderColor: G[200] } }
            }}
          />
        ) : (
          <Typography variant="body1" fontWeight={600} sx={{ color: G[800] }}>
            {value || 'Not provided'}
          </Typography>
        )}
      </Box>
    </InfoRow>
  );

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading settings...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
      {/* Top accent bar */}
      <Box sx={{ height: 4, bgcolor: G[600], mb: 3, borderRadius: 2 }} />

      {/* Header */}
      <Fade in timeout={500}>
        <GlassPaper sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box display="flex" alignItems="center" gap={3}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Tooltip title="Change Photo">
                      <IconButton
                        onClick={() => setImageUploadOpen(true)}
                        sx={{ 
                          bgcolor: G[600], 
                          color: 'white', 
                          width: 32, 
                          height: 32,
                          '&:hover': { bgcolor: G[700] } 
                        }}
                      >
                        <PhotoCameraIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ProfileAvatar src={profile.profileImage}>
                    {getInitials(profile.name || user?.name || 'W')}
                  </ProfileAvatar>
                </Badge>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                    Settings
                  </Typography>
                  <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                    Manage your account preferences
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Chip
                      icon={<VerifiedIcon />}
                      label={profile.designation || 'Warden'}
                      size="small"
                      sx={{ bgcolor: alpha(G[600], 0.1), color: G[600] }}
                    />
                    <Chip
                      icon={<WorkIcon />}
                      label={profile.department || 'Hostel Management'}
                      size="small"
                      sx={{ bgcolor: alpha(G[500], 0.1), color: G[500] }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Tooltip title="Export Data">
                  <IconButton onClick={exportData} sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5 }}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Import Data">
                  <IconButton onClick={importData} sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5 }}>
                    <UploadIcon />
                  </IconButton>
                </Tooltip>
                {!editMode ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{ 
                      bgcolor: G[700], 
                      '&:hover': { bgcolor: G[800] },
                      textTransform: 'none',
                      px: 4,
                      borderRadius: 2
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={saving}
                      sx={{ bgcolor: G[600], textTransform: 'none', borderRadius: 2 }}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      sx={{ borderColor: G[200], color: G[600], textTransform: 'none', borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>
          </Grid>
        </GlassPaper>
      </Fade>

      {/* Settings Tabs */}
      <GlassPaper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{
            borderBottom: `1px solid ${G[200]}`,
            '& .MuiTab-root': { 
              textTransform: 'none', 
              fontWeight: 600, 
              minHeight: 56, 
              px: 3,
              fontSize: '0.9rem',
              color: G[500],
              '&.Mui-selected': { color: G[700] }
            },
            '& .MuiTabs-indicator': { backgroundColor: G[600], height: 3 }
          }}
        >
          <Tab icon={<PersonIcon />} label="Profile" iconPosition="start" />
          <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
          <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
          <Tab icon={<PaletteIcon />} label="Appearance" iconPosition="start" />
          <Tab icon={<LanguageIcon />} label="Language" iconPosition="start" />
          <Tab icon={<PrivacyTipIcon />} label="Privacy" iconPosition="start" />
        </Tabs>
      </GlassPaper>

      {/* Profile Tab Content - Fixed Grid */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SettingsCard>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle><PersonIcon /> Personal Information</SectionTitle>
                {renderField('Full Name', profile.name, <PersonIcon />, 'name')}
                {renderField('Email Address', profile.email, <EmailIcon />, 'email')}
                {renderField('Phone Number', profile.phone, <PhoneIcon />, 'phone')}
                {renderField('Employee ID', profile.employeeId, <BadgeIcon />, 'employeeId')}
                {renderField('Department', profile.department, <WorkOutlineIcon />, 'department')}
                {renderField('Designation', profile.designation, <VerifiedIcon />, 'designation')}
                {renderField('Date of Joining', profile.joinDate, <CalendarMonthIcon />, 'joinDate', { type: 'date' })}
              </CardContent>
            </SettingsCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SettingsCard>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle><WorkIcon /> Work Information</SectionTitle>
                {renderField('Hostel Name', profile.hostelName, <HomeIcon />, 'hostelName')}
                {renderField('Block Name', profile.blockName, <LocationCityIcon />, 'blockName')}
                {renderField('Office Address', profile.officeAddress, <PinDropIcon />, 'officeAddress', { multiline: true, rows: 2 })}
                {renderField('City', profile.city, <LocationCityIcon />, 'city')}
                {renderField('State', profile.state, <LocationCityIcon />, 'state')}
                {renderField('Pincode', profile.pincode, <PinDropIcon />, 'pincode')}
              </CardContent>
            </SettingsCard>
          </Grid>

          <Grid item xs={12}>
            <SettingsCard>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <SectionTitle><EmergencyIcon /> Emergency Contact</SectionTitle>
                    {renderField('Emergency Contact Name', profile.emergencyName, <PersonIcon />, 'emergencyName')}
                    {renderField('Emergency Contact Number', profile.emergencyContact, <PhoneIcon />, 'emergencyContact')}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SectionTitle><InfoIcon /> Bio</SectionTitle>
                    {renderField('Short Bio', profile.bio, <InfoIcon />, 'bio', { multiline: true, rows: 3 })}
                  </Grid>
                </Grid>
              </CardContent>
            </SettingsCard>
          </Grid>
        </Grid>
      )}

      {/* Notifications Tab */}
      {activeTab === 1 && (
        <SettingsCard>
          <CardContent sx={{ p: 3 }}>
            <SectionTitle><NotificationsIcon /> Notification Preferences</SectionTitle>
            
            <SettingItem>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Email Notifications</Typography>
                <Typography variant="caption" sx={{ color: G[500] }}>Receive notifications via email</Typography>
              </Box>
              <MUISwitch
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
              />
            </SettingItem>

            <SettingItem>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Push Notifications</Typography>
                <Typography variant="caption" sx={{ color: G[500] }}>Receive push notifications on browser</Typography>
              </Box>
              <MUISwitch
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
              />
            </SettingItem>

            <SettingItem>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>SMS Notifications</Typography>
                <Typography variant="caption" sx={{ color: G[500] }}>Receive SMS alerts</Typography>
              </Box>
              <MUISwitch
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
              />
            </SettingItem>

            <Divider sx={{ my: 2, borderColor: G[100] }} />

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: G[800] }}>Alert Types</Typography>
            
            <SettingItem>
              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ color: G[700] }}>Leave Requests</Typography>
              </Box>
              <MUISwitch
                checked={settings.leaveRequests}
                onChange={(e) => handleSettingChange('leaveRequests', e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
              />
            </SettingItem>

            <SettingItem>
              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ color: G[700] }}>Complaints</Typography>
              </Box>
              <MUISwitch
                checked={settings.complaints}
                onChange={(e) => handleSettingChange('complaints', e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
              />
            </SettingItem>

            <SettingItem>
              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ color: G[700] }}>Attendance Alerts</Typography>
              </Box>
              <MUISwitch
                checked={settings.attendanceAlerts}
                onChange={(e) => handleSettingChange('attendanceAlerts', e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
              />
            </SettingItem>

            <SettingItem>
              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ color: G[700] }}>Daily Digest</Typography>
                <Typography variant="caption" sx={{ color: G[500] }}>Receive daily summary of activities</Typography>
              </Box>
              <MUISwitch
                checked={settings.dailyDigest}
                onChange={(e) => handleSettingChange('dailyDigest', e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
              />
            </SettingItem>
          </CardContent>
        </SettingsCard>
      )}

      {/* Security Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SettingsCard>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle><LockIcon /> Change Password</SectionTitle>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handlePasswordChange}
                    sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, textTransform: 'none', borderRadius: 2 }}
                  >
                    Update Password
                  </Button>
                </Stack>
              </CardContent>
            </SettingsCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SettingsCard>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle><SecurityIcon /> Security Settings</SectionTitle>
                
                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Two-Factor Authentication</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Add an extra layer of security</Typography>
                  </Box>
                  <MUISwitch
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                  />
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Login Alerts</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Get notified on new logins</Typography>
                  </Box>
                  <MUISwitch
                    checked={settings.loginAlerts}
                    onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                  />
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Session Timeout</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Auto logout after inactivity</Typography>
                  </Box>
                  <Select
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                    size="small"
                    sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                  >
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                    <MenuItem value={120}>2 hours</MenuItem>
                  </Select>
                </SettingItem>
              </CardContent>
            </SettingsCard>
          </Grid>
        </Grid>
      )}

      {/* Appearance Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SettingsCard>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle><PaletteIcon /> Theme Settings</SectionTitle>
                
                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Theme Mode</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Choose light or dark theme</Typography>
                  </Box>
                  <RadioGroup
                    row
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                  >
                    <FormControlLabel value="light" control={<Radio />} label={<LightModeIcon />} />
                    <FormControlLabel value="dark" control={<Radio />} label={<DarkModeIcon />} />
                  </RadioGroup>
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Primary Color</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Choose your accent color</Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    {[G[600], '#1565c0', '#c62828', '#6a1b9a', '#e65100'].map((color) => (
                      <Box
                        key={color}
                        onClick={() => handleSettingChange('primaryColor', color)}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: color,
                          cursor: 'pointer',
                          border: settings.primaryColor === color ? `3px solid ${G[800]}` : 'none',
                          transition: 'all 0.2s ease',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      />
                    ))}
                  </Box>
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Font Size</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Adjust text size</Typography>
                  </Box>
                  <Select
                    value={settings.fontSize}
                    onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                    size="small"
                    sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                  </Select>
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Compact View</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Reduce spacing for denser layout</Typography>
                  </Box>
                  <MUISwitch
                    checked={settings.compactView}
                    onChange={(e) => handleSettingChange('compactView', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                  />
                </SettingItem>
              </CardContent>
            </SettingsCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SettingsCard>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle><BackupIcon /> Data & Backup</SectionTitle>
                
                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Auto Backup</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Automatically backup your data</Typography>
                  </Box>
                  <MUISwitch
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                  />
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Backup Frequency</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>How often to backup data</Typography>
                  </Box>
                  <Select
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    size="small"
                    disabled={!settings.autoBackup}
                    sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Data Retention</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Keep data for</Typography>
                  </Box>
                  <Select
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                    size="small"
                    sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                  >
                    <MenuItem value={30}>30 days</MenuItem>
                    <MenuItem value={90}>90 days</MenuItem>
                    <MenuItem value={180}>6 months</MenuItem>
                    <MenuItem value={365}>1 year</MenuItem>
                  </Select>
                </SettingItem>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ mt: 2, textTransform: 'none', borderColor: G[200], color: G[600], borderRadius: 2 }}
                >
                  Create Manual Backup
                </Button>
              </CardContent>
            </SettingsCard>
          </Grid>
        </Grid>
      )}

      {/* Language Tab */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SettingsCard>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle><TranslateIcon /> Language Settings</SectionTitle>
                
                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Interface Language</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Choose your preferred language</Typography>
                  </Box>
                  <Select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    size="small"
                    sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
                    <MenuItem value="mr">मराठी (Marathi)</MenuItem>
                  </Select>
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Date Format</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Choose date display format</Typography>
                  </Box>
                  <Select
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                    size="small"
                    sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Time Format</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Choose time display format</Typography>
                  </Box>
                  <Select
                    value={settings.timeFormat}
                    onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                    size="small"
                    sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                  >
                    <MenuItem value="12h">12-hour format</MenuItem>
                    <MenuItem value="24h">24-hour format</MenuItem>
                  </Select>
                </SettingItem>
              </CardContent>
            </SettingsCard>
          </Grid>
        </Grid>
      )}

      {/* Privacy Tab */}
      {activeTab === 5 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SettingsCard>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle><PrivacyTipIcon /> Privacy Settings</SectionTitle>
                
                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Profile Visibility</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Who can see your profile</Typography>
                  </Box>
                  <Select
                    value={settings.profileVisibility}
                    onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                    size="small"
                    sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                  >
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="staff_only">Staff Only</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                  </Select>
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Show Email</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Display email on profile</Typography>
                  </Box>
                  <MUISwitch
                    checked={settings.showEmail}
                    onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                  />
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Show Phone</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Display phone number</Typography>
                  </Box>
                  <MUISwitch
                    checked={settings.showPhone}
                    onChange={(e) => handleSettingChange('showPhone', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                  />
                </SettingItem>

                <SettingItem>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: G[800] }}>Show Department</Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>Display department info</Typography>
                  </Box>
                  <MUISwitch
                    checked={settings.showDepartment}
                    onChange={(e) => handleSettingChange('showDepartment', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                  />
                </SettingItem>
              </CardContent>
            </SettingsCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SettingsCard>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle><DataUsageIcon /> Data & Privacy</SectionTitle>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ mb: 2, textTransform: 'none', borderColor: G[200], color: G[600], borderRadius: 2 }}
                  onClick={exportData}
                >
                  Download My Data
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2, textTransform: 'none', borderColor: G[200], color: G[600], borderRadius: 2 }}
                  onClick={importData}
                >
                  Import Settings
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Delete Account
                </Button>

                <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                  <Typography variant="caption">
                    <WarningIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                    Deleting your account is permanent and cannot be undone. All your data will be removed.
                  </Typography>
                </Alert>
              </CardContent>
            </SettingsCard>
          </Grid>
        </Grid>
      )}

      {/* Image Upload Dialog */}
      <Dialog 
        open={imageUploadOpen} 
        onClose={() => setImageUploadOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: '#ffffff',
            border: `1px solid ${G[200]}`,
            boxShadow: '0 24px 48px rgba(13,51,24,0.15)',
          }
        }}
      >
        <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
        <DialogTitle sx={{ bgcolor: G[50], borderBottom: `1px solid ${G[100]}` }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: G[800] }}>Upload Profile Photo</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {!imagePreview ? (
            <Box
              sx={{
                border: `2px dashed ${G[200]}`,
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: alpha(G[600], 0.02),
                '&:hover': { borderColor: G[600], bgcolor: alpha(G[600], 0.05) }
              }}
              onClick={() => document.getElementById('image-upload-input').click()}
            >
              <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: G[400], mb: 2 }} />
              <Typography sx={{ color: G[700] }}>Click to upload or drag and drop</Typography>
              <Typography variant="caption" sx={{ color: G[500] }}>PNG, JPG up to 5MB</Typography>
            </Box>
          ) : (
            <Box textAlign="center">
              <Avatar src={imagePreview} sx={{ width: 200, height: 200, mx: 'auto', mb: 2 }} />
              {uploadProgress > 0 && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', color: G[600] }}>
                    {uploadProgress}% uploaded
                  </Typography>
                </Box>
              )}
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => { setSelectedImage(null); setImagePreview(null); setUploadProgress(0); }}
                sx={{ mt: 2, borderColor: G[200], borderRadius: 2 }}
              >
                Remove
              </Button>
            </Box>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: G[100] }} />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setImageUploadOpen(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3, borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveImage} 
            variant="contained" 
            disabled={!selectedImage || uploading}
            sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, px: 3, borderRadius: 2 }}
          >
            {uploading ? 'Uploading...' : 'Save Photo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WardenSettings;