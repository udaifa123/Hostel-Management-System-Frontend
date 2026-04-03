import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
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
  useTheme,
  LinearProgress,
  Fade,
  Zoom,
  Rating
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Room as RoomIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Fingerprint as FingerprintIcon,
  Verified as VerifiedIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Wc as GenderIcon,
  Bloodtype as BloodIcon,
  Emergency as EmergencyIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  MenuBook as MenuBookIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Star as StarIcon,
  WorkspacePremiumRounded as PremiumIcon,
  MilitaryTech as MilitaryIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  ManageAccounts as ManageAccountsIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import studentService from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Light Green & White Theme
───────────────────────────────────────────── */
const theme = {
  navy:        '#f3f8f5',          // page background: light green-white
  navyLight:   '#eaf2ed',          // secondary background
  navyCard:    '#ffffff',          // card background: pure white
  navyHover:   '#e2ede6',          // hover state background
  border:      'rgba(5,150,105,0.12)',
  gold:        '#047857',          // primary green (replaces gold)
  goldLight:   '#059669',          // lighter green
  goldDark:    '#065f46',          // darker green
  slate:       '#4a7060',          // muted green-gray text
  slateLight:  '#7a9a87',          // lighter muted text
  white:       '#0c1a12',          // main text: dark green-black

  // Status Colors (unchanged)
  success: '#10B981',
  warning: '#F59E0B',
  error:   '#EF4444',
  info:    '#0284c7',

  // Gradients — green variants
  primaryGradient: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
  successGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  warningGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  errorGradient:   'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  goldGradient:    'linear-gradient(135deg, #047857 0%, #34d399 100%)',
  navyGradient:    'linear-gradient(135deg, #f3f8f5 0%, #eaf2ed 100%)',

  // Typography
  fontPrimary:   "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSecondary: "'SF Pro Display', 'Inter', 'Segoe UI', sans-serif",

  // Shadows — green-tinted
  cardShadow:  '0 4px 20px -4px rgba(5,150,105,0.10), 0 1px 4px rgba(5,150,105,0.06)',
  hoverShadow: '0 12px 40px -8px rgba(5,150,105,0.18)',
  goldShadow:  '0 8px 20px -6px rgba(5,150,105,0.25)',

  // Border Radius (unchanged)
  borderRadius: {
    sm:  '8px',
    md:  '12px',
    lg:  '16px',
    xl:  '24px',
    xxl: '32px'
  },

  // Spacing (unchanged)
  spacing: {
    xs:  '4px',
    sm:  '8px',
    md:  '16px',
    lg:  '24px',
    xl:  '32px',
    xxl: '48px'
  }
};

/* ─────────────────────────────────────────────
   Styled Components
───────────────────────────────────────────── */
const GlassPaper = styled(Paper)(({ theme: muiTheme }) => ({
  background: theme.navyCard,
  backdropFilter: 'blur(20px)',
  borderRadius: theme.borderRadius.xxl,
  boxShadow: theme.cardShadow,
  border: `1px solid ${alpha(theme.gold, 0.15)}`,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.hoverShadow,
    borderColor: alpha(theme.gold, 0.3)
  }
}));

const GradientCard = styled(Card)(({ gradient = theme.navyGradient }) => ({
  height: '100%',
  background: gradient,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${alpha(theme.gold, 0.15)}`,
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: theme.cardShadow,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight})`,
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.hoverShadow,
    borderColor: alpha(theme.gold, 0.4),
  }
}));

const ProfileAvatar = styled(Avatar)({
  width: 180,
  height: 180,
  margin: '0 auto',
  border: `4px solid ${alpha(theme.gold, 0.35)}`,
  boxShadow: `0 12px 32px -8px ${alpha(theme.gold, 0.30)}`,
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 20px 48px -10px ${alpha(theme.gold, 0.45)}`,
    borderColor: theme.gold
  }
});

const InfoCard = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.md,
  padding: theme.spacing.md,
  background: '#f3f8f5',
  borderRadius: theme.borderRadius.lg,
  border: `1px solid rgba(5,150,105,0.10)`,
  transition: 'all 0.3s ease',
  boxShadow: '0 1px 3px rgba(5,150,105,0.06)',
  '&:hover': {
    borderColor: theme.gold,
    transform: 'translateX(8px)',
    background: '#eaf2ed',
    boxShadow: `0 8px 24px -6px ${alpha(theme.gold, 0.15)}`
  }
});

const StatBox = styled(Box)({
  padding: theme.spacing.md,
  background: '#f3f8f5',
  borderRadius: theme.borderRadius.lg,
  textAlign: 'center',
  border: `1px solid rgba(5,150,105,0.12)`,
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '&:hover': {
    transform: 'scale(1.05) rotate(1deg)',
    background: '#eaf2ed',
    borderColor: theme.gold
  }
});

const UploadArea = styled(Box)({
  position: 'relative',
  width: '100%',
  minHeight: 250,
  border: `3px dashed ${alpha(theme.gold, 0.35)}`,
  borderRadius: theme.borderRadius.xxl,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.md,
  padding: theme.spacing.xl,
  background: '#f3f8f5',
  transition: 'all 0.4s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.gold,
    background: '#eaf2ed',
    transform: 'scale(1.02)',
  }
});

const SectionTitle = styled(Typography)({
  fontSize: '1.35rem',
  fontWeight: 700,
  marginBottom: theme.spacing.lg,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
  color: theme.white,
  position: 'relative',
  paddingLeft: theme.spacing.sm,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '4px',
    height: '70%',
    background: `linear-gradient(180deg, ${theme.gold}, ${theme.goldLight})`,
    borderRadius: '4px',
  },
  '& svg': {
    color: theme.gold,
    fontSize: '1.8rem',
  }
});

const StyledChip = styled(Chip)({
  background: 'rgba(5,150,105,0.08)',
  color: '#047857',
  fontWeight: 600,
  borderRadius: theme.borderRadius.lg,
  border: `1px solid rgba(5,150,105,0.18)`,
  '& .MuiChip-icon': {
    color: theme.gold,
  },
  '&:hover': {
    background: 'rgba(5,150,105,0.15)',
    borderColor: theme.gold,
    transform: 'scale(1.05)',
  }
});

const StudentProfile = () => {
  const muiTheme = useTheme();
  const { user, updateUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogField, setDialogField] = useState(null);
  const [dialogValue, setDialogValue] = useState('');
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeSection, setActiveSection] = useState('personal');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    enrollmentNo: '',
    course: '',
    branch: '',
    semester: '',
    roomNo: '',
    hostelName: '',
    blockName: '',
    floorNo: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    emergencyName: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: '',
    admissionYear: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    guardianName: '',
    guardianPhone: '',
    nationality: '',
    religion: '',
    caste: '',
    aadharNo: '',
    panNo: '',
    profileImage: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      github: '',
      website: ''
    },
    achievements: [],
    skills: [],
    attendance: '',
    cgpa: '',
    backlogs: 0,
    certifications: [],
    languages: [],
    hobbies: []
  });

  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📞 Fetching profile from backend...');
      const response = await studentService.getProfile();
      console.log('✅ Profile response:', response);
      
      const profileData = response.data || response;
      
      setProfile({
        name: profileData.name || user?.name || 'Not Available',
        email: profileData.email || user?.email || 'Not Available',
        phone: profileData.phone || 'Not Available',
        studentId: profileData.studentId || profileData.enrollmentId || 'Not Available',
        enrollmentNo: profileData.enrollmentNo || profileData.registrationNo || 'Not Available',
        course: profileData.course || profileData.program || 'Not Assigned',
        branch: profileData.branch || profileData.department || 'Not Assigned',
        semester: profileData.semester || 'Not Assigned',
        roomNo: profileData.roomNo || profileData.roomNumber || 'Not Assigned',
        hostelName: profileData.hostelName || profileData.hostel || 'Not Assigned',
        blockName: profileData.blockName || profileData.block || 'Not Assigned',
        floorNo: profileData.floorNo || profileData.floor || 'Not Assigned',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        pincode: profileData.pincode || '',
        emergencyContact: profileData.emergencyContact || profileData.emergencyPhone || '',
        emergencyName: profileData.emergencyName || profileData.emergencyContactName || '',
        bloodGroup: profileData.bloodGroup || '',
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profileData.gender || '',
        admissionYear: profileData.admissionYear || '',
        parentName: profileData.parentName || '',
        parentPhone: profileData.parentPhone || '',
        parentEmail: profileData.parentEmail || '',
        guardianName: profileData.guardianName || '',
        guardianPhone: profileData.guardianPhone || '',
        nationality: profileData.nationality || 'Indian',
        religion: profileData.religion || '',
        caste: profileData.caste || '',
        aadharNo: profileData.aadharNo || '',
        panNo: profileData.panNo || '',
        profileImage: profileData.profileImage || '',
        socialLinks: profileData.socialLinks || {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          github: '',
          website: ''
        },
        achievements: profileData.achievements || [],
        skills: profileData.skills || [],
        attendance: profileData.attendance || '0%',
        cgpa: profileData.cgpa || '0.0',
        backlogs: profileData.backlogs || 0,
        certifications: profileData.certifications || [],
        languages: profileData.languages || [],
        hobbies: profileData.hobbies || []
      });

      localStorage.setItem('studentProfile', JSON.stringify(profileData));
      
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      setError('Failed to load profile data. Please try again.');
      showNotification('Failed to load profile data', 'error');
      
      const savedProfile = localStorage.getItem('studentProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File size should be less than 5MB', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file', 'error');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result); };
      reader.readAsDataURL(file);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) { clearInterval(interval); return 100; }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleSaveImage = async () => {
    if (!selectedImage) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('profileImage', selectedImage);
      const response = await studentService.uploadProfileImage(formData);
      setProfile(prev => ({ ...prev, profileImage: imagePreview }));
      showNotification('Profile photo updated successfully!', 'success');
      setImageUploadOpen(false);
      setSelectedImage(null);
      setImagePreview(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('Failed to upload image', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => { setRefreshing(true); fetchProfile(); };

  const handleEdit = () => { setEditForm({ ...profile }); setEditMode(true); };

  const handleCancel = () => { setEditMode(false); setEditForm({}); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {};
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== profile[key]) updateData[key] = editForm[key];
      });
      if (Object.keys(updateData).length === 0) {
        setEditMode(false);
        showNotification('No changes to save', 'info');
        return;
      }
      console.log('📤 Updating profile...');
      const response = await studentService.updateProfile(updateData);
      console.log('✅ Update successful');
      const updatedData = response.data || response;
      setProfile(prev => ({ ...prev, ...updatedData, ...editForm }));
      if (updateUser) updateUser(updatedData);
      localStorage.setItem('studentProfile', JSON.stringify({ ...profile, ...updatedData, ...editForm }));
      showNotification('Profile updated successfully!', 'success');
      setEditMode(false);
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      showNotification(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldClick = (field) => {
    setDialogField(field);
    setDialogValue(editForm[field] || profile[field] || '');
    setOpenDialog(true);
  };

  const handleDialogSave = () => {
    handleInputChange({ target: { name: dialogField, value: dialogValue } });
    setOpenDialog(false);
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    if (severity === 'success') toast.success(message);
    else if (severity === 'error') toast.error(message);
    else toast(message);
  };

  const getInitials = (name) => {
    if (!name || name === 'Not Available') return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderField = (label, value, icon, options = {}) => (
    <InfoCard>
      <Box sx={{ color: theme.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 45 }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: theme.slate, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px' }}>
          {label}
        </Typography>
        {options.editable && editMode ? (
          options.select ? (
            <FormControl fullWidth size="small" variant="standard">
              <Select
                name={options.fieldName}
                value={editForm[options.fieldName] || ''}
                onChange={handleInputChange}
                displayEmpty
                sx={{ mt: 0.5, fontWeight: 600, color: theme.white, '& .MuiSelect-icon': { color: theme.slate } }}
              >
                <MenuItem value="">Select {label}</MenuItem>
                {options.options?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              name={options.fieldName}
              value={editForm[options.fieldName] || ''}
              onChange={handleInputChange}
              size="small"
              variant="standard"
              type={options.type || 'text'}
              multiline={options.multiline}
              rows={options.rows}
              disabled={options.disabled}
              sx={{
                mt: 0.5,
                '& input': { fontWeight: 600, color: theme.white },
                '& .MuiInput-underline:before': { borderBottomColor: alpha(theme.gold, 0.3) },
                '& .MuiInput-underline:hover:before': { borderBottomColor: theme.gold }
              }}
              InputProps={options.disabled ? { readOnly: true } : {}}
            />
          )
        ) : (
          <Typography variant="body1" fontWeight={700} sx={{ fontSize: '1rem', color: theme.white }}>
            {value || '—'}
          </Typography>
        )}
      </Box>
      {options.editable && !editMode && !options.disabled && (
        <Tooltip title={`Edit ${label}`} arrow placement="top">
          <IconButton
            size="small"
            onClick={() => handleFieldClick(options.fieldName)}
            sx={{ color: theme.gold, backgroundColor: alpha(theme.gold, 0.10), '&:hover': { backgroundColor: alpha(theme.gold, 0.20) } }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </InfoCard>
  );

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh"
        sx={{ background: theme.navy }}>
        <GlassPaper elevation={0} sx={{ p: theme.spacing.xxl, borderRadius: theme.borderRadius.xl, textAlign: 'center', maxWidth: 400 }}>
          <CircularProgress size={70} thickness={4} sx={{ mb: 3, color: theme.gold }} />
          <Typography variant="h5" sx={{ color: theme.white, fontWeight: 700 }} gutterBottom>
            Loading Your Profile
          </Typography>
          <Typography variant="body2" sx={{ color: theme.slate, mb: 2 }}>
            Please wait while we fetch your information
          </Typography>
          <LinearProgress
            sx={{
              height: 8, borderRadius: 4,
              background: alpha(theme.gold, 0.12),
              '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight})`, borderRadius: 6 }
            }}
          />
        </GlassPaper>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: theme.navy,
      py: theme.spacing.xl,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23059669" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.6,
        pointerEvents: 'none',
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={1000}>
          <div>
            {/* Modern Header */}
            <GlassPaper sx={{ mb: theme.spacing.xl, p: theme.spacing.lg }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Avatar
                      sx={{
                        width: 90, height: 90,
                        background: theme.goldGradient,
                        fontSize: '2.5rem', fontWeight: 'bold',
                        border: `4px solid ${alpha(theme.gold, 0.30)}`,
                        boxShadow: `0 12px 32px -8px ${alpha(theme.gold, 0.30)}`,
                        color: '#ffffff'
                      }}
                    >
                      {getInitials(profile.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: theme.white }}>
                        Student Profile
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.slate, fontWeight: 500 }}>
                        Welcome back, {profile.name}! 👋
                      </Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <Chip
                          icon={<VerifiedIcon />}
                          label="Student"
                          size="small"
                          sx={{ background: alpha(theme.success, 0.12), color: theme.success, border: `1px solid ${alpha(theme.success, 0.25)}`, fontWeight: 600 }}
                        />
                        <Chip
                          label={`Semester: ${profile.semester}`}
                          size="small"
                          sx={{ background: alpha(theme.gold, 0.10), color: theme.gold, border: `1px solid ${alpha(theme.gold, 0.25)}`, fontWeight: 600 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap" gap={1}>
                    <Tooltip title="Refresh" arrow>
                      <IconButton
                        onClick={handleRefresh}
                        disabled={refreshing}
                        sx={{
                          bgcolor: '#f3f8f5',
                          border: `1px solid ${alpha(theme.gold, 0.20)}`,
                          color: theme.slate,
                          width: 45, height: 45,
                          '&:hover': { borderColor: theme.gold, color: theme.gold, transform: 'rotate(180deg)', bgcolor: '#eaf2ed' },
                          transition: 'all 0.5s ease'
                        }}
                      >
                        <RefreshIcon className={refreshing ? 'rotating' : ''} />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                      onClick={editMode ? handleSave : handleEdit}
                      sx={{
                        borderRadius: theme.borderRadius.lg,
                        px: theme.spacing.lg, py: 1.5,
                        background: editMode ? theme.successGradient : theme.goldGradient,
                        color: 'white',
                        fontWeight: 700, textTransform: 'none', fontSize: '1rem',
                        boxShadow: theme.goldShadow,
                        '&:hover': {
                          background: editMode
                            ? 'linear-gradient(135deg, #059669 30%, #047857 90%)'
                            : `linear-gradient(135deg, ${theme.goldLight}, ${theme.gold})`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 16px 28px -8px ${alpha(theme.gold, 0.45)}`,
                        }
                      }}
                    >
                      {editMode ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
                    </Button>
                    {editMode && (
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        disabled={saving}
                        sx={{
                          borderRadius: theme.borderRadius.lg,
                          px: theme.spacing.lg, py: 1.5,
                          borderColor: alpha(theme.error, 0.5),
                          color: theme.error, fontWeight: 600, textTransform: 'none',
                          '&:hover': { borderColor: theme.error, backgroundColor: alpha(theme.error, 0.08) }
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mt: theme.spacing.md, borderRadius: theme.borderRadius.lg,
                    background: alpha(theme.error, 0.07), color: '#7f1d1d',
                    border: `1px solid ${alpha(theme.error, 0.20)}`
                  }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              )}
            </GlassPaper>

            {/* Main Content Grid */}
            <Grid container spacing={4}>
              {/* Left Column */}
              <Grid item xs={12} md={4}>
                <GradientCard>
                  <CardContent sx={{ p: theme.spacing.xl }}>
                    <Box textAlign="center">
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Tooltip title="Change Profile Photo" arrow>
                            <IconButton
                              onClick={() => setImageUploadOpen(true)}
                              sx={{
                                bgcolor: theme.gold, color: '#ffffff',
                                width: 45, height: 45,
                                '&:hover': { bgcolor: theme.goldLight, transform: 'scale(1.1) rotate(10deg)' },
                                transition: 'all 0.3s ease',
                                border: `3px solid ${theme.navyCard}`,
                                boxShadow: `0 6px 16px -4px ${alpha(theme.gold, 0.4)}`,
                              }}
                            >
                              <PhotoCameraIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <ProfileAvatar src={profile.profileImage} alt={profile.name}>
                          {getInitials(profile.name)}
                        </ProfileAvatar>
                      </Badge>

                      <Typography variant="h5" fontWeight="800" sx={{ mt: 2, color: theme.white }}>
                        {profile.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.slate, mb: 2, fontWeight: 500 }}>
                        {profile.studentId} • {profile.branch || 'Student'}
                      </Typography>

                      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          label={`Semester: ${profile.semester}`}
                          size="small"
                          sx={{ background: alpha(theme.gold, 0.10), color: theme.gold, border: `1px solid ${alpha(theme.gold, 0.25)}`, fontWeight: 600 }}
                        />
                        <Chip
                          label={`Attendance: ${profile.attendance}`}
                          size="small"
                          sx={{ background: alpha(theme.success, 0.12), color: theme.success, border: `1px solid ${alpha(theme.success, 0.25)}`, fontWeight: 600 }}
                        />
                      </Stack>

                      <Divider sx={{ my: 3, borderColor: alpha(theme.gold, 0.12) }} />

                      {/* Quick Stats */}
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <StatBox>
                            <Typography variant="h4" fontWeight="800" sx={{ color: theme.gold }}>{profile.semester}</Typography>
                            <Typography variant="caption" sx={{ color: theme.slate, fontWeight: 600 }}>Semester</Typography>
                          </StatBox>
                        </Grid>
                        <Grid item xs={6}>
                          <StatBox>
                            <Typography variant="h4" fontWeight="800" sx={{ color: theme.goldLight }}>
                              {profile.course === 'Not Assigned' ? 'NA' : profile.course}
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.slate, fontWeight: 600 }}>Course</Typography>
                          </StatBox>
                        </Grid>
                        <Grid item xs={6}>
                          <StatBox>
                            <Typography variant="h4" fontWeight="800" sx={{ color: theme.success }}>{profile.cgpa}</Typography>
                            <Typography variant="caption" sx={{ color: theme.slate, fontWeight: 600 }}>CGPA</Typography>
                          </StatBox>
                        </Grid>
                        <Grid item xs={6}>
                          <StatBox>
                            <Typography variant="h4" fontWeight="800" sx={{ color: profile.backlogs === 0 ? theme.success : theme.error }}>
                              {profile.backlogs}
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.slate, fontWeight: 600 }}>Backlogs</Typography>
                          </StatBox>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3, borderColor: alpha(theme.gold, 0.12) }} />

                      {/* Contact Info */}
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" sx={{ color: theme.slate, gutterBottom: true, fontWeight: 700 }}>
                          Contact Information
                        </Typography>
                        <Stack spacing={2}>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Box sx={{ bgcolor: alpha(theme.gold, 0.10), p: 1, borderRadius: theme.borderRadius.lg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <EmailIcon fontSize="small" sx={{ color: theme.gold }} />
                            </Box>
                            <Typography variant="body2" fontWeight={600} sx={{ color: theme.white }}>{profile.email}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Box sx={{ bgcolor: alpha(theme.gold, 0.10), p: 1, borderRadius: theme.borderRadius.lg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <PhoneIcon fontSize="small" sx={{ color: theme.gold }} />
                            </Box>
                            <Typography variant="body2" fontWeight={600} sx={{ color: theme.white }}>{profile.phone}</Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {profile.languages.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle2" sx={{ color: theme.slate, gutterBottom: true, fontWeight: 700 }}>Languages</Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {profile.languages.map((lang, index) => (
                              <Chip key={index} label={lang} size="small"
                                sx={{ background: alpha(theme.gold, 0.08), color: theme.gold, fontWeight: 600, border: `1px solid ${alpha(theme.gold, 0.18)}` }} />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {profile.hobbies.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle2" sx={{ color: theme.slate, gutterBottom: true, fontWeight: 700 }}>Hobbies</Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {profile.hobbies.map((hobby, index) => (
                              <Chip key={index} label={hobby} size="small"
                                sx={{ background: alpha(theme.goldLight, 0.08), color: theme.goldLight, fontWeight: 600, border: `1px solid ${alpha(theme.goldLight, 0.18)}` }} />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </GradientCard>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={8}>
                <GradientCard>
                  <CardContent sx={{ p: theme.spacing.xl }}>
                    {/* Section Navigation */}
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 4, pb: 2, flexWrap: 'wrap', borderBottom: `2px solid ${alpha(theme.gold, 0.12)}` }}>
                      {[
                        { id: 'personal',   label: 'Personal Details',   icon: <PersonIcon />,    color: theme.gold    },
                        { id: 'academic',   label: 'Academic Info',       icon: <SchoolIcon />,    color: theme.success },
                        { id: 'hostel',     label: 'Hostel Details',      icon: <HomeIcon />,      color: theme.info    },
                        { id: 'emergency',  label: 'Emergency Contact',   icon: <EmergencyIcon />, color: theme.warning }
                      ].map(tab => (
                        <Button
                          key={tab.id}
                          startIcon={tab.icon}
                          onClick={() => setActiveSection(tab.id)}
                          sx={{
                            borderRadius: theme.borderRadius.lg,
                            px: theme.spacing.lg, py: 1.5,
                            color: activeSection === tab.id ? tab.color : theme.slate,
                            bgcolor: activeSection === tab.id ? alpha(tab.color, 0.10) : 'transparent',
                            border: `1px solid ${activeSection === tab.id ? alpha(tab.color, 0.28) : 'transparent'}`,
                            '&:hover': { bgcolor: alpha(tab.color, 0.06), transform: 'translateY(-2px)', borderColor: alpha(tab.color, 0.18) },
                            transition: 'all 0.3s ease', fontWeight: 600, textTransform: 'none',
                          }}
                        >
                          {tab.label}
                        </Button>
                      ))}
                    </Box>

                    {/* Personal Information */}
                    {activeSection === 'personal' && (
                      <Box>
                        <SectionTitle><PersonIcon />Personal Information</SectionTitle>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>{renderField('Full Name', profile.name, <PersonIcon />, { editable: true, fieldName: 'name' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Student ID', profile.studentId, <FingerprintIcon />, { editable: false, fieldName: 'studentId' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Date of Birth', profile.dateOfBirth, <CalendarIcon />, { editable: true, fieldName: 'dateOfBirth', type: 'date' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Gender', profile.gender, <GenderIcon />, { editable: true, fieldName: 'gender', select: true, options: ['Male', 'Female', 'Other', 'Not Specified'] })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Blood Group', profile.bloodGroup, <BloodIcon />, { editable: true, fieldName: 'bloodGroup', select: true, options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Not Specified'] })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Nationality', profile.nationality, <LocationIcon />, { editable: true, fieldName: 'nationality' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Aadhar Number', profile.aadharNo, <BadgeIcon />, { editable: true, fieldName: 'aadharNo' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('PAN Number', profile.panNo, <BadgeIcon />, { editable: true, fieldName: 'panNo' })}</Grid>
                        </Grid>
                        {profile.skills.length > 0 && (
                          <Box sx={{ mt: 4 }}>
                            <SectionTitle><MenuBookIcon />Skills</SectionTitle>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                              {profile.skills.map((skill, index) => <StyledChip key={index} label={skill} />)}
                            </Box>
                          </Box>
                        )}
                        {profile.achievements.length > 0 && (
                          <Box sx={{ mt: 4 }}>
                            <SectionTitle><MilitaryIcon />Achievements</SectionTitle>
                            <Grid container spacing={2}>
                              {profile.achievements.map((achievement, index) => (
                                <Grid item xs={12} key={index}>
                                  <InfoCard sx={{ p: 2 }}>
                                    <Box sx={{ fontSize: '2rem', minWidth: 50, textAlign: 'center' }}>⭐</Box>
                                    <Box>
                                      <Typography variant="body2" fontWeight={600} sx={{ color: theme.white }}>{achievement.title || achievement}</Typography>
                                      <Typography variant="caption" sx={{ color: theme.slate }}>{achievement.date || 'Recent'}</Typography>
                                    </Box>
                                  </InfoCard>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Academic Information */}
                    {activeSection === 'academic' && (
                      <Box>
                        <SectionTitle><SchoolIcon />Academic Information</SectionTitle>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>{renderField('Enrollment No', profile.enrollmentNo, <SchoolIcon />, { editable: true, fieldName: 'enrollmentNo' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Course', profile.course, <SchoolIcon />, { editable: true, fieldName: 'course' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Branch', profile.branch, <SchoolIcon />, { editable: true, fieldName: 'branch' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Semester', profile.semester, <SchoolIcon />, { editable: true, fieldName: 'semester', type: 'number' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Admission Year', profile.admissionYear, <CalendarIcon />, { editable: true, fieldName: 'admissionYear', type: 'number' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('CGPA', profile.cgpa, <AssessmentIcon />, { editable: true, fieldName: 'cgpa' })}</Grid>
                        </Grid>
                        {profile.certifications.length > 0 && (
                          <Box sx={{ mt: 4 }}>
                            <SectionTitle><PremiumIcon />Certifications</SectionTitle>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                              {profile.certifications.map((cert, index) => <StyledChip key={index} icon={<CheckCircleIcon />} label={cert} />)}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Hostel Information */}
                    {activeSection === 'hostel' && (
                      <Box>
                        <SectionTitle><HomeIcon />Hostel Information</SectionTitle>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>{renderField('Hostel Name', profile.hostelName, <HomeIcon />, { editable: true, fieldName: 'hostelName' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Block', profile.blockName, <HomeIcon />, { editable: true, fieldName: 'blockName' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Floor', profile.floorNo, <HomeIcon />, { editable: true, fieldName: 'floorNo' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Room No', profile.roomNo, <RoomIcon />, { editable: true, fieldName: 'roomNo' })}</Grid>
                        </Grid>
                        <SectionTitle sx={{ mt: 4 }}><LocationIcon />Address</SectionTitle>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>{renderField('Address', profile.address || 'Not Provided', <HomeIcon />, { editable: true, fieldName: 'address', multiline: true, rows: 2 })}</Grid>
                          <Grid item xs={12} sm={4}>{renderField('City', profile.city || 'Not Provided', <LocationIcon />, { editable: true, fieldName: 'city' })}</Grid>
                          <Grid item xs={12} sm={4}>{renderField('State', profile.state || 'Not Provided', <LocationIcon />, { editable: true, fieldName: 'state' })}</Grid>
                          <Grid item xs={12} sm={4}>{renderField('Pincode', profile.pincode || 'Not Provided', <LocationIcon />, { editable: true, fieldName: 'pincode' })}</Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Emergency Contact */}
                    {activeSection === 'emergency' && (
                      <Box>
                        <SectionTitle><EmergencyIcon />Emergency Contact</SectionTitle>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>{renderField('Parent Name', profile.parentName, <PersonIcon />, { editable: true, fieldName: 'parentName' })}</Grid>
                          <Grid item xs={12} sm={4}>{renderField('Parent Phone', profile.parentPhone, <PhoneIcon />, { editable: true, fieldName: 'parentPhone' })}</Grid>
                          <Grid item xs={12} sm={4}>{renderField('Parent Email', profile.parentEmail, <EmailIcon />, { editable: true, fieldName: 'parentEmail', type: 'email' })}</Grid>
                        </Grid>
                        <SectionTitle sx={{ mt: 4 }}><PersonIcon />Guardian Information</SectionTitle>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>{renderField('Guardian Name', profile.guardianName || 'Not Provided', <PersonIcon />, { editable: true, fieldName: 'guardianName' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Guardian Phone', profile.guardianPhone || 'Not Provided', <PhoneIcon />, { editable: true, fieldName: 'guardianPhone' })}</Grid>
                        </Grid>
                        <SectionTitle sx={{ mt: 4 }}><EmergencyIcon />Emergency Contact Person</SectionTitle>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>{renderField('Emergency Contact Name', profile.emergencyName, <PersonIcon />, { editable: true, fieldName: 'emergencyName' })}</Grid>
                          <Grid item xs={12} sm={6}>{renderField('Emergency Contact No', profile.emergencyContact, <PhoneIcon />, { editable: true, fieldName: 'emergencyContact' })}</Grid>
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </GradientCard>
              </Grid>
            </Grid>
          </div>
        </Fade>

        {/* Image Upload Dialog */}
        <Dialog
          open={imageUploadOpen}
          onClose={() => setImageUploadOpen(false)}
          maxWidth="sm" fullWidth
          TransitionComponent={Zoom}
          PaperProps={{
            sx: {
              borderRadius: theme.borderRadius.xxl, p: theme.spacing.lg,
              background: theme.navyCard,
              border: `1px solid ${alpha(theme.gold, 0.18)}`,
              boxShadow: theme.hoverShadow
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
            <Typography variant="h4" fontWeight="800" sx={{ color: theme.gold }}>Upload Profile Photo</Typography>
            <Typography variant="body2" sx={{ color: theme.slate, mt: 1 }}>Choose a clear photo of yourself</Typography>
          </DialogTitle>
          <DialogContent>
            {!imagePreview ? (
              <UploadArea>
                <input type="file" accept="image/*" onChange={handleImageUpload}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                <CloudUploadIcon sx={{ fontSize: 80, color: alpha(theme.gold, 0.5) }} />
                <Typography variant="h6" sx={{ color: theme.white, fontWeight: 600 }}>Click to upload</Typography>
                <Typography variant="body2" sx={{ color: theme.slate }}>or drag and drop</Typography>
                <Typography variant="caption" sx={{ color: alpha(theme.slate, 0.7), mt: 2 }}>Supported formats: JPG, PNG (Max 5MB)</Typography>
              </UploadArea>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                  <Avatar src={imagePreview}
                    sx={{ width: 250, height: 250, mx: 'auto', border: `6px solid ${theme.gold}`, boxShadow: `0 20px 48px -12px ${alpha(theme.gold, 0.35)}` }} />
                  <IconButton
                    onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                    sx={{ position: 'absolute', top: 10, right: 10, bgcolor: theme.error, color: 'white', '&:hover': { bgcolor: alpha(theme.error, 0.85), transform: 'scale(1.1)' }, transition: 'all 0.3s ease' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress}
                      sx={{ height: 12, borderRadius: 6, bgcolor: alpha(theme.gold, 0.10), '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight})`, borderRadius: 6 } }} />
                    <Typography variant="caption" sx={{ color: theme.slate, mt: 1, fontWeight: 600 }}>Uploading: {uploadProgress}%</Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
            <Button onClick={() => setImageUploadOpen(false)} variant="outlined" fullWidth
              sx={{ borderRadius: theme.borderRadius.lg, py: 1.5, borderColor: alpha(theme.gold, 0.30), color: theme.gold, '&:hover': { borderColor: theme.gold, backgroundColor: alpha(theme.gold, 0.08) }, fontWeight: 600 }}>
              Cancel
            </Button>
            <Button onClick={handleSaveImage} variant="contained" fullWidth
              disabled={!selectedImage || uploadProgress === 100 || saving}
              sx={{ borderRadius: theme.borderRadius.lg, py: 1.5, background: theme.goldGradient, color: 'white', fontWeight: 700,
                '&:hover': { background: `linear-gradient(135deg, ${theme.goldLight}, ${theme.gold})`, transform: 'translateY(-2px)', boxShadow: theme.goldShadow },
                '&:disabled': { background: alpha(theme.gold, 0.25), color: alpha('#fff', 0.5) } }}>
              {uploadProgress === 100 ? 'Uploaded!' : saving ? 'Uploading...' : 'Save Photo'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth
          TransitionComponent={Zoom}
          PaperProps={{
            sx: { borderRadius: theme.borderRadius.xl, background: theme.navyCard, border: `1px solid ${alpha(theme.gold, 0.18)}`, boxShadow: theme.hoverShadow }
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #eaf2ed, #d4ede1)',
            color: theme.white,
            borderTopLeftRadius: theme.borderRadius.xl, borderTopRightRadius: theme.borderRadius.xl,
            py: 3, borderBottom: `1px solid ${alpha(theme.gold, 0.15)}`
          }}>
            <Typography variant="h5" fontWeight="700">
              Edit {dialogField?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <TextField
              autoFocus margin="dense" label="Value" type="text" fullWidth variant="outlined"
              value={dialogValue} onChange={(e) => setDialogValue(e.target.value)}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: theme.borderRadius.lg, color: theme.white,
                  '& fieldset': { borderColor: alpha(theme.gold, 0.25) },
                  '&:hover fieldset': { borderColor: theme.gold },
                  '&.Mui-focused fieldset': { borderColor: theme.gold }
                },
                '& .MuiInputLabel-root': { color: theme.slate }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button onClick={() => setOpenDialog(false)} variant="outlined"
              sx={{ borderRadius: theme.borderRadius.lg, px: 4, py: 1.5, borderColor: alpha(theme.gold, 0.30), color: theme.gold, fontWeight: 600, '&:hover': { borderColor: theme.gold, backgroundColor: alpha(theme.gold, 0.08) } }}>
              Cancel
            </Button>
            <Button onClick={handleDialogSave} variant="contained"
              sx={{ borderRadius: theme.borderRadius.lg, px: 4, py: 1.5, background: theme.goldGradient, color: 'white', fontWeight: 700,
                '&:hover': { background: `linear-gradient(135deg, ${theme.goldLight}, ${theme.gold})`, transform: 'translateY(-2px)', boxShadow: theme.goldShadow } }}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open} autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Zoom}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity} variant="filled"
            sx={{
              width: '100%', borderRadius: theme.borderRadius.lg,
              boxShadow: theme.hoverShadow, fontWeight: 600,
              background: snackbar.severity === 'success' ? theme.successGradient :
                         snackbar.severity === 'error'   ? theme.errorGradient   :
                         snackbar.severity === 'warning' ? theme.warningGradient :
                         theme.primaryGradient
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <style>{`
          @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .rotating { animation: rotate 1s linear infinite; }
        `}</style>
      </Container>
    </Box>
  );
};

export default StudentProfile;