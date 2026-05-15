import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Divider
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
  Layers as FloorIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import toast from 'react-hot-toast';

const G = {
  900: '#064e3b',
  800: '#065f46',
  700: '#047857',
  600: '#059669',
  500: '#10b981',
  400: '#34d399',
  300: '#6ee7b7',
  200: '#bbf7d0',
  100: '#d1fae5',
  50: '#ecfdf5',
};

const InfoCard = ({ icon, label, value, color = G[800] }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: '16px',
      border: `1.5px solid ${G[100]}`,
      bgcolor: '#fff',
      boxShadow: '0 4px 16px rgba(6,95,70,0.07)',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-3px)' },
      height: '100%'
    }}
  >
    <CardContent sx={{ textAlign: 'center', py: 2.5, '&:last-child': { pb: 2.5 } }}>
      <Avatar
        sx={{
          width: 45,
          height: 45,
          bgcolor: G[100],
          color: G[600],
          mx: 'auto',
          mb: 1.5,
          borderRadius: '12px'
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 22 } })}
      </Avatar>
      <Typography sx={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: color, lineHeight: 1.3 }}>
        {value || 'N/A'}
      </Typography>
    </CardContent>
  </Card>
);

const GreenField = (props) => (
  <TextField
    {...props}
    sx={{
      mb: 2,
      '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
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

const ParentStudentProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '', phone: '', email: '', address: '', emergencyContact: ''
  });
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0fdf4' }}>
        <CircularProgress sx={{ color: G[600] }} thickness={5} />
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f0fdf4', p: 3 }}>
        <Alert severity="info" sx={{ borderRadius: '16px' }}>
          No student linked to your account. Please contact the admin.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0fdf4' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
          color: 'white',
          py: 2,
          px: 3,
          boxShadow: '0 4px 20px rgba(6,95,70,0.2)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={() => navigate('/parent/dashboard')}
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Student Profile
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ p: 3 }}>
        {error && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: '16px', fontSize: '0.82rem' }}>{error}</Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '16px',
            border: '1.5px solid #d1fae5',
            bgcolor: '#fff',
            boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: G[100],
                color: G[600],
                fontSize: '1.6rem',
                fontWeight: 700,
                border: `2px solid ${G[300]}`
              }}
            >
              {student.name?.charAt(0)?.toUpperCase() || 'S'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: G[600], letterSpacing: '0.12em', fontSize: '0.7rem', fontWeight: 600 }}>
                Student Profile
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: G[800], lineHeight: 1.2, mb: 0.5 }}>
                {student.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                <Chip
                  icon={<SchoolIcon sx={{ fontSize: '14px !important' }} />}
                  label={student.course || 'Course N/A'}
                  size="small"
                  sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, fontSize: '0.72rem' }}
                />
                <Chip
                  icon={<BadgeIcon sx={{ fontSize: '14px !important' }} />}
                  label={`Semester ${student.semester || 'N/A'}`}
                  size="small"
                  sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, fontSize: '0.72rem' }}
                />
                <Chip
                  icon={<HomeIcon sx={{ fontSize: '14px !important' }} />}
                  label={student.hostelName || 'Hostel N/A'}
                  size="small"
                  sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, fontSize: '0.72rem' }}
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon sx={{ fontSize: 16 }} />}
              onClick={() => setEditDialogOpen(true)}
              sx={{
                bgcolor: G[600],
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'none',
                borderRadius: '10px',
                px: 3,
                py: 1,
                boxShadow: '0 2px 8px rgba(6,95,70,0.3)',
                '&:hover': { bgcolor: G[700] },
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUpIcon sx={{ color: G[600], fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: G[700], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Personal Information
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { icon: <PersonIcon />, label: 'Full Name', value: student.name },
            { icon: <EmailIcon />, label: 'Email Address', value: student.email },
            { icon: <PhoneIcon />, label: 'Phone Number', value: student.phoneNumber },
            { icon: <PhoneIcon />, label: 'Emergency Contact', value: student.emergencyContact },
            { icon: <LocationIcon />, label: 'Address', value: student.address },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <InfoCard icon={item.icon} label={item.label} value={item.value} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 3.5, borderColor: G[100] }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SchoolIcon sx={{ color: G[600], fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: G[700], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Academic Information
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { icon: <SchoolIcon />, label: 'Course', value: student.course },
            { icon: <SchoolIcon />, label: 'Semester', value: student.semester },
            { icon: <BadgeIcon />, label: 'Enrollment Number', value: student.enrollmentNumber },
            { icon: <BadgeIcon />, label: 'Registration No.', value: student.registrationNumber },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <InfoCard icon={item.icon} label={item.label} value={item.value} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 3.5, borderColor: G[100] }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <HomeIcon sx={{ color: G[600], fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: G[700], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Hostel Information
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            { icon: <HomeIcon />, label: 'Hostel Name', value: student.hostelName },
            { icon: <RoomIcon />, label: 'Room Number', value: student.roomNumber },
            { icon: <FloorIcon />, label: 'Floor', value: student.floor },
            { icon: <HomeIcon />, label: 'Room Type', value: student.roomType },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <InfoCard icon={item.icon} label={item.label} value={item.value} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
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
          <GreenField fullWidth label="Full Name" name="name" value={editFormData.name} onChange={handleInputChange} />
          <GreenField fullWidth label="Email Address" name="email" type="email" value={editFormData.email} onChange={handleInputChange} />
          <GreenField fullWidth label="Phone Number" name="phone" value={editFormData.phone} onChange={handleInputChange} />
          <GreenField fullWidth label="Address" name="address" multiline rows={2} value={editFormData.address} onChange={handleInputChange} />
          <GreenField fullWidth label="Emergency Contact" name="emergencyContact" value={editFormData.emergencyContact} onChange={handleInputChange} sx={{ mb: 0 }} />

          <Alert
            severity="info"
            sx={{
              mt: 2, borderRadius: '12px', fontSize: '0.78rem',
              bgcolor: G[50], color: G[800],
              border: '1px solid #d1fae5',
              '& .MuiAlert-icon': { color: G[500] },
            }}
          >
            Course, semester, and hostel changes require admin approval.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid #d1fae5', gap: 1 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: G[300], color: G[700],
              borderRadius: '10px', textTransform: 'none', fontWeight: 600,
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
              background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
              borderRadius: '10px', textTransform: 'none', fontWeight: 700,
              px: 3, boxShadow: '0 2px 8px rgba(6,95,70,0.3)',
              '&:hover': { background: 'linear-gradient(135deg, #047857 0%, #16a34a 100%)' },
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: '12px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParentStudentProfile;