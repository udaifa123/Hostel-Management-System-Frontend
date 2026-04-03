// frontend/src/pages/parent/ParentStudentProfile.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  Verified as VerifiedIcon,
  MeetingRoom as RoomIcon,
  Layers as FloorIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import toast from 'react-hot-toast';

// ─── Color Tokens ───────────────────────────────────────────────
const G = {
  50:  '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
};

// ─── Info Row ───────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 2,
    p: 1.8, bgcolor: G[50],
    borderRadius: 2,
    border: `1px solid ${G[100]}`,
  }}>
    <Box sx={{
      width: 36, height: 36, borderRadius: 1.5,
      bgcolor: G[100], display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {React.cloneElement(icon, { sx: { fontSize: 18, color: G[600] } })}
    </Box>
    <Box>
      <Typography variant="caption" sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: G[900], fontSize: '0.88rem', mt: 0.1 }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  </Box>
);

// ─── Section Header ─────────────────────────────────────────────
const SectionHeader = ({ title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, mt: 1 }}>
    <Box sx={{ width: 4, height: 20, bgcolor: G[500], borderRadius: 2 }} />
    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: G[800], fontSize: '0.95rem' }}>
      {title}
    </Typography>
    <Box sx={{ flex: 1, height: 1, bgcolor: G[100], ml: 1 }} />
  </Box>
);

// ─── Styled TextField ────────────────────────────────────────────
const GreenField = (props) => (
  <TextField
    {...props}
    sx={{
      mb: 2,
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        fontSize: '0.88rem',
        '& fieldset': { borderColor: G[200] },
        '&:hover fieldset': { borderColor: G[400] },
        '&.Mui-focused fieldset': { borderColor: G[500] },
      },
      '& .MuiInputLabel-root.Mui-focused': { color: G[600] },
      ...props.sx,
    }}
  />
);

// ─── Component ──────────────────────────────────────────────────
const ParentStudentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading]           = useState(true);
  const [student, setStudent]           = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '', phone: '', email: '', address: '', emergencyContact: ''
  });
  const [error, setError]               = useState(null);
  const [snackbar, setSnackbar]         = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchStudentProfile(); }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await parentService.getStudentProfile();
      if (response && response.success && response.data) {
        setStudent(response.data);
        setEditFormData({
          name: response.data.name || '',
          phone: response.data.phoneNumber || '',
          email: response.data.email || '',
          address: response.data.address || '',
          emergencyContact: response.data.emergencyContact || ''
        });
      } else {
        const mockStudent = {
          id: 'mock123', name: 'Aysha Unaisa', email: 'unaisa@gmail.com',
          phoneNumber: '1234567890', registrationNumber: 'STU240001',
          enrollmentNumber: 'ENR2024001', course: 'BBA', semester: 3,
          roomNumber: 'A-101', floor: '1st Floor', roomType: 'Double Sharing',
          hostelName: 'Boys Hostel - A Block',
          address: 'Cherambane, Near Juma Masjid Road',
          emergencyContact: '9876543210', dateOfBirth: '2000-01-01', createdAt: '2024-01-01'
        };
        setStudent(mockStudent);
        setEditFormData({ name: mockStudent.name, phone: mockStudent.phoneNumber, email: mockStudent.email, address: mockStudent.address, emergencyContact: mockStudent.emergencyContact });
        toast('Showing demo data. Real data will appear when connected to backend.', { duration: 5000 });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      const mockStudent = {
        id: 'mock123', name: 'Aysha Unaisa', email: 'unaisa@gmail.com',
        phoneNumber: '1234567890', registrationNumber: 'STU240001',
        enrollmentNumber: 'ENR2024001', course: 'BBA', semester: 3,
        roomNumber: 'A-101', floor: '1st Floor', roomType: 'Double Sharing',
        hostelName: 'Boys Hostel - A Block',
        address: 'Cherambane, Near Juma Masjid Road',
        emergencyContact: '9876543210', dateOfBirth: '2000-01-01', createdAt: '2024-01-01'
      };
      setStudent(mockStudent);
      setEditFormData({ name: mockStudent.name, phone: mockStudent.phoneNumber, email: mockStudent.email, address: mockStudent.address, emergencyContact: mockStudent.emergencyContact });
      setError('Using demo data. Backend not connected.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await parentService.updateStudentProfile(editFormData);
      if (response && response.success) {
        setStudent(prev => ({ ...prev, ...editFormData }));
        setEditDialogOpen(false);
        setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        toast.success('Profile updated successfully');
      } else {
        setStudent(prev => ({ ...prev, ...editFormData }));
        setEditDialogOpen(false);
        setSnackbar({ open: true, message: 'Profile updated locally (demo mode)', severity: 'info' });
        toast.success('Profile updated (demo mode)');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setStudent(prev => ({ ...prev, ...editFormData }));
      setEditDialogOpen(false);
      setSnackbar({ open: true, message: 'Profile updated locally (demo mode)', severity: 'info' });
    } finally {
      setLoading(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <ParentLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress sx={{ color: G[600] }} />
        </Box>
      </ParentLayout>
    );
  }

  // ── No Student ──
  if (!student) {
    return (
      <ParentLayout>
        <Container maxWidth="lg">
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: `linear-gradient(135deg, ${G[700]}, ${G[500]})`, color: 'white' }}>
            <Typography variant="h5" fontWeight="bold">Student Profile</Typography>
          </Paper>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            No student linked to your account. Please contact the admin.
          </Alert>
        </Container>
      </ParentLayout>
    );
  }

  // ── Render ──
  return (
    <ParentLayout>
      <Box sx={{ minHeight: '100vh', background: `linear-gradient(160deg, ${G[50]} 0%, #fff 60%, ${G[100]} 100%)`, py: 4 }}>
        <Container maxWidth="lg">

          {/* ── Page Header ── */}
          <Paper
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${G[700]} 0%, ${G[500]} 100%)`,
              borderRadius: 3,
              p: { xs: 2.5, sm: 3.5 },
              mb: 3,
              boxShadow: `0 8px 32px ${G[200]}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""', position: 'absolute',
                top: -50, right: -50,
                width: 180, height: 180,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
                  Student Profile
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', mt: 0.3 }}>
                  View and manage your child's profile
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                onClick={() => setEditDialogOpen(true)}
                sx={{
                  bgcolor: '#fff',
                  color: G[700],
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.5,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: G[50], boxShadow: 'none' },
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>

          {error && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>{error}</Alert>
          )}

          {/* ── Profile Card ── */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${G[100]}`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.05)`,
            }}
          >
            {/* Avatar Banner */}
            <Box sx={{ background: G[50], borderBottom: `1px solid ${G[100]}`, p: { xs: 3, md: 4 } }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md="auto" sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Avatar
                    sx={{
                      width: 110, height: 110,
                      background: `linear-gradient(135deg, ${G[700]}, ${G[500]})`,
                      fontSize: '2.8rem', fontWeight: 700,
                      boxShadow: `0 6px 20px ${G[300]}`,
                      border: `4px solid #fff`,
                    }}
                  >
                    {student.name?.charAt(0)?.toUpperCase() || 'S'}
                  </Avatar>
                </Grid>
                <Grid item xs={12} md>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: G[900], letterSpacing: '-0.5px', textAlign: { xs: 'center', md: 'left' } }}>
                    {student.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    {[
                      { icon: <VerifiedIcon />, label: student.course || 'Course N/A' },
                      { icon: <SchoolIcon />,   label: `Semester ${student.semester || 'N/A'}` },
                      { icon: <BadgeIcon />,    label: `Reg: ${student.registrationNumber || 'N/A'}` },
                    ].map(({ icon, label }) => (
                      <Chip
                        key={label}
                        icon={React.cloneElement(icon, { sx: { fontSize: '14px !important', color: `${G[600]} !important` } })}
                        label={label}
                        size="small"
                        sx={{
                          bgcolor: G[100], color: G[800],
                          fontWeight: 600, fontSize: '0.72rem',
                          border: `1px solid ${G[200]}`,
                          '& .MuiChip-icon': { ml: 0.8 },
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Grid container spacing={4}>

                {/* Personal Information */}
                <Grid item xs={12}>
                  <SectionHeader title="Personal Information" />
                  <Grid container spacing={2}>
                    {[
                      { icon: <PersonIcon />,   label: 'Full Name',          value: student.name },
                      { icon: <EmailIcon />,    label: 'Email Address',      value: student.email },
                      { icon: <PhoneIcon />,    label: 'Phone Number',       value: student.phoneNumber },
                      { icon: <PhoneIcon />,    label: 'Emergency Contact',  value: student.emergencyContact },
                      { icon: <LocationIcon />, label: 'Address',            value: student.address },
                    ].map(({ icon, label, value }) => (
                      <Grid key={label} item xs={12} sm={6}>
                        <InfoRow icon={icon} label={label} value={value} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                {/* Academic Information */}
                <Grid item xs={12}>
                  <SectionHeader title="Academic Information" />
                  <Grid container spacing={2}>
                    {[
                      { icon: <SchoolIcon />,   label: 'Course',             value: student.course },
                      { icon: <SchoolIcon />,   label: 'Semester',           value: student.semester },
                      { icon: <BadgeIcon />,    label: 'Enrollment Number',  value: student.enrollmentNumber },
                      { icon: <BadgeIcon />,    label: 'Registration No.',   value: student.registrationNumber },
                    ].map(({ icon, label, value }) => (
                      <Grid key={label} item xs={12} sm={6} md={3}>
                        <InfoRow icon={icon} label={label} value={value} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                {/* Hostel Information */}
                <Grid item xs={12}>
                  <SectionHeader title="Hostel Information" />
                  <Grid container spacing={2}>
                    {[
                      { icon: <HomeIcon />,    label: 'Hostel Name',   value: student.hostelName },
                      { icon: <RoomIcon />,    label: 'Room Number',   value: student.roomNumber },
                      { icon: <FloorIcon />,   label: 'Floor',         value: student.floor },
                      { icon: <HomeIcon />,    label: 'Room Type',     value: student.roomType },
                    ].map(({ icon, label, value }) => (
                      <Grid key={label} item xs={12} sm={6} md={3}>
                        <InfoRow icon={icon} label={label} value={value} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* ── Edit Dialog ── */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${G[700]}, ${G[500]})`,
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2, px: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            Edit Student Profile
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)} sx={{ color: '#fff', p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, px: 3 }}>
          <GreenField fullWidth label="Full Name"        name="name"             value={editFormData.name}             onChange={handleInputChange} />
          <GreenField fullWidth label="Email Address"    name="email"  type="email" value={editFormData.email}          onChange={handleInputChange} />
          <GreenField fullWidth label="Phone Number"     name="phone"            value={editFormData.phone}            onChange={handleInputChange} />
          <GreenField fullWidth label="Address"          name="address" multiline rows={2} value={editFormData.address} onChange={handleInputChange} />
          <GreenField fullWidth label="Emergency Contact" name="emergencyContact" value={editFormData.emergencyContact} onChange={handleInputChange} sx={{ mb: 0 }} />

          <Alert
            severity="info"
            sx={{
              mt: 2, borderRadius: 2, fontSize: '0.78rem',
              bgcolor: G[50], color: G[800],
              border: `1px solid ${G[200]}`,
              '& .MuiAlert-icon': { color: G[500] },
            }}
          >
            Course, semester, and hostel changes require admin approval.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5, borderTop: `1px solid ${G[100]}`, gap: 1 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: G[300], color: G[700],
              borderRadius: 2, textTransform: 'none', fontWeight: 600,
              '&:hover': { borderColor: G[500], bgcolor: G[50] },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
            sx={{
              background: `linear-gradient(135deg, ${G[700]}, ${G[500]})`,
              borderRadius: 2, textTransform: 'none', fontWeight: 700,
              px: 3, boxShadow: 'none',
              '&:hover': { background: `linear-gradient(135deg, ${G[800]}, ${G[600]})`, boxShadow: 'none' },
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ParentLayout>
  );
};

export default ParentStudentProfile;