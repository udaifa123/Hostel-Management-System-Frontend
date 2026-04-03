import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

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

// ─── Stat Card Component ───────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, dark = false, valueColor }) => (
  <Card elevation={0} sx={{
    borderRadius: 3,
    bgcolor: dark ? G[800] : '#ffffff',
    border: `1px solid ${dark ? G[700] : G[200]}`,
    boxShadow: dark ? '0 4px 16px rgba(13,51,24,0.25)' : CARD_SHADOW,
    height: '100%',
    transition: 'transform 0.15s',
    '&:hover': { transform: 'translateY(-2px)' }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" sx={{
            color: dark ? G[300] : G[600],
            fontWeight: 600, fontSize: '0.70rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'block', mb: 1
          }}>
            {label}
          </Typography>
          <Typography sx={{
            fontWeight: 700,
            color: valueColor || (dark ? '#ffffff' : G[800]),
            fontSize: '2.2rem', lineHeight: 1,
          }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{
          bgcolor: dark ? G[700] : G[100],
          width: 48, height: 48, borderRadius: 2,
        }}>
          <Icon sx={{ color: dark ? G[200] : G[600], fontSize: 24 }} />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hostelId: '',
    roomId: '',
    course: '',
    year: '',
    admissionDate: '',
    attendance: '',
    feesStatus: 'pending',
    status: 'active',
    password: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchHostels();
    fetchRooms();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await adminService.getStudents();
      console.log('Students API Response:', response);
      
      // Handle different response structures
      let studentsData = [];
      if (response.success && response.students) {
        studentsData = response.students;
      } else if (response.data && response.data.students) {
        studentsData = response.data.students;
      } else if (response.data && Array.isArray(response.data)) {
        studentsData = response.data;
      } else if (Array.isArray(response)) {
        studentsData = response;
      }
      
      // Transform the data to a consistent format
      const transformedStudents = studentsData.map(student => ({
        _id: student._id || student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        hostelName: student.hostel?.name || student.hostelName || 'Not Assigned',
        roomNumber: student.room?.roomNumber || student.roomNumber || 'N/A',
        course: student.course || student.studentDetails?.course || 'N/A',
        year: student.year || student.studentDetails?.year || 'N/A',
        attendance: student.attendance?.percentage || student.attendance || student.studentDetails?.attendance || 0,
        feesStatus: student.feesStatus || 'pending',
        status: student.status || 'active',
        admissionDate: student.admissionDate || student.createdAt?.split('T')[0] || ''
      }));
      
      setStudents(transformedStudents);
      console.log('Transformed students:', transformedStudents.length);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHostels = async () => {
    try {
      const response = await adminService.getHostels();
      console.log('Hostels API Response:', response);
      
      let hostelsData = [];
      if (response.success && response.hostels) {
        hostelsData = response.hostels;
      } else if (response.data && response.data.hostels) {
        hostelsData = response.data.hostels;
      } else if (response.data && Array.isArray(response.data)) {
        hostelsData = response.data;
      } else if (Array.isArray(response)) {
        hostelsData = response;
      }
      
      setHostels(hostelsData);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      toast.error('Failed to load hostels');
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await adminService.getRooms();
      console.log('Rooms API Response:', response);
      
      let roomsData = [];
      if (response.success && response.rooms) {
        roomsData = response.rooms;
      } else if (response.data && response.data.rooms) {
        roomsData = response.data.rooms;
      } else if (response.data && Array.isArray(response.data)) {
        roomsData = response.data;
      } else if (Array.isArray(response)) {
        roomsData = response;
      }
      
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        hostelId: student.hostelId || '',
        roomId: student.roomId || '',
        course: student.course || '',
        year: student.year || '',
        admissionDate: student.admissionDate || '',
        attendance: student.attendance || '',
        feesStatus: student.feesStatus || 'pending',
        status: student.status || 'active',
        password: ''
      });
    } else {
      setSelectedStudent(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        hostelId: '',
        roomId: '',
        course: '',
        year: '',
        admissionDate: '',
        attendance: '',
        feesStatus: 'pending',
        status: 'active',
        password: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email || !formData.phone) {
        toast.error('Please fill all required fields');
        return;
      }

      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password || 'student123',
        role: 'student',
        hostel: formData.hostelId || undefined,
        room: formData.roomId || undefined,
        course: formData.course,
        year: formData.year,
        admissionDate: formData.admissionDate,
        attendance: formData.attendance ? parseInt(formData.attendance) : 0,
        feesStatus: formData.feesStatus,
        status: formData.status
      };

      console.log('Submitting student data:', submitData);

      let response;
      if (selectedStudent) {
        const studentId = selectedStudent._id;
        response = await adminService.updateStudent(studentId, submitData);
        if (response && response.success) {
          toast.success('Student updated successfully');
          handleCloseDialog();
          await fetchStudents();
        } else {
          toast.error(response?.message || 'Failed to update student');
        }
      } else {
        response = await adminService.createStudent(submitData);
        if (response && response.success) {
          toast.success('Student created successfully');
          handleCloseDialog();
          await fetchStudents();
        } else {
          toast.error(response?.message || 'Failed to create student');
        }
      }
    } catch (error) {
      console.error('Error saving student:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save student';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const response = await adminService.deleteStudent(id);
      if (response && response.success) {
        toast.success('Student deleted successfully');
        await fetchStudents();
      } else {
        toast.error(response?.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.hostelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    inactive: students.filter(s => s.status === 'inactive').length,
    paid: students.filter(s => s.feesStatus === 'paid').length,
    pending: students.filter(s => s.feesStatus === 'pending').length,
    overdue: students.filter(s => s.feesStatus === 'overdue').length
  };

  const getAttendanceColor = (attendance) => {
    const att = parseInt(attendance);
    if (att >= 90) return G[600];
    if (att >= 75) return G[500];
    if (att >= 60) return '#F59E0B';
    return '#EF4444';
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading students...</Typography>
      </Box>
    );
  }

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
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
              <SchoolIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                Student Management
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Manage all students in the hostel system
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: `${G[600]} !important` }} />}
              label={`${stats.active} active`}
              size="small"
              sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, fontSize: '0.72rem', border: `1px solid ${G[200]}` }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: G[700], color: '#ffffff', fontWeight: 600,
                borderRadius: 2, textTransform: 'none',
                boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
                '&:hover': { bgcolor: G[800] }
              }}
            >
              Add Student
            </Button>
          </Box>
        </Paper>

        {/* ── Stat Cards ── */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <StatCard label="Total Students" value={stats.total} icon={SchoolIcon} dark />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <StatCard label="Active" value={stats.active} icon={CheckCircleIcon} valueColor={G[600]} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <StatCard label="Inactive" value={stats.inactive} icon={CancelIcon} valueColor="#b45309" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <StatCard label="Fees Paid" value={stats.paid} icon={MoneyIcon} valueColor={G[600]} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <StatCard label="Pending/Overdue" value={stats.pending + stats.overdue} icon={MoneyIcon} valueColor="#F59E0B" />
          </Grid>
        </Grid>

        {/* ── Search ── */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search students by name, email, hostel, room, or course…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: G[400], fontSize: 20 }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#ffffff', borderRadius: 2.5,
                '& fieldset': { borderColor: G[200] },
                '&:hover fieldset': { borderColor: G[400] },
                '&.Mui-focused fieldset': { borderColor: G[600] },
              },
              '& input': { color: G[800] },
              '& input::placeholder': { color: G[400] },
            }}
          />
          <IconButton 
            onClick={fetchStudents}
            sx={{
              bgcolor: '#ffffff', borderRadius: 2.5,
              border: `1px solid ${G[200]}`, color: G[600],
              '&:hover': { bgcolor: G[100], borderColor: G[400] }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* ── Table ── */}
        <TableContainer component={Paper} elevation={0} sx={{
          borderRadius: 3, bgcolor: '#ffffff',
          border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: G[50] }}>
                {['Student', 'Contact', 'Hostel & Room', 'Course & Year', 'Attendance', 'Fees', 'Status', 'Actions'].map((col, i) => (
                  <TableCell key={col} align={i === 7 ? 'right' : 'left'} sx={{
                    color: G[700], fontWeight: 700, fontSize: '0.70rem',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    borderBottom: `2px solid ${G[200]}`, py: 1.75,
                  }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student._id} hover sx={{
                    '&:hover': { bgcolor: G[50] },
                    '& td': { borderBottom: `1px solid ${G[100]}`, py: 1.75 }
                  }}>
                    {/* Name + Email */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{
                          bgcolor: G[100], color: G[700],
                          width: 38, height: 38, fontWeight: 700, fontSize: '0.95rem',
                          border: `2px solid ${G[200]}`
                        }}>
                          {student.name?.charAt(0) || 'S'}
                        </Avatar>
                        <Box>
                          <Typography sx={{ color: G[800], fontWeight: 600, fontSize: '0.875rem' }}>
                            {student.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                            <EmailIcon sx={{ fontSize: 11, color: G[400] }} />
                            <Typography variant="caption" sx={{ color: G[500] }}>
                              {student.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Phone */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: G[400] }} />
                        <Typography sx={{ color: G[700], fontSize: '0.85rem' }}>{student.phone}</Typography>
                      </Box>
                    </TableCell>

                    {/* Hostel & Room */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Avatar sx={{ bgcolor: G[100], width: 26, height: 26, borderRadius: 1 }}>
                          <HomeIcon sx={{ color: G[500], fontSize: 14 }} />
                        </Avatar>
                        <Box>
                          <Typography sx={{ color: G[800], fontSize: '0.85rem', fontWeight: 500 }}>
                            {student.hostelName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: G[500] }}>
                            Room {student.roomNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Course & Year */}
                    <TableCell>
                      <Box>
                        <Typography sx={{ color: G[800], fontSize: '0.85rem', fontWeight: 500 }}>
                          {student.course}
                        </Typography>
                        <Typography variant="caption" sx={{ color: G[500] }}>
                          {student.year}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Attendance */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ minWidth: 45 }}>
                          <Typography sx={{ 
                            color: getAttendanceColor(student.attendance), 
                            fontSize: '0.85rem', 
                            fontWeight: 600 
                          }}>
                            {student.attendance}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={student.attendance}
                          sx={{
                            width: 70,
                            height: 5,
                            borderRadius: 3,
                            bgcolor: G[200],
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getAttendanceColor(student.attendance),
                              borderRadius: 3,
                            }
                          }}
                        />
                      </Box>
                    </TableCell>

                    {/* Fees */}
                    <TableCell>
                      <Chip
                        label={student.feesStatus === 'paid' ? 'Paid' : student.feesStatus === 'pending' ? 'Pending' : 'Overdue'}
                        size="small"
                        icon={student.feesStatus === 'paid' 
                          ? <CheckCircleIcon sx={{ fontSize: '13px !important', color: `${G[600]} !important` }} />
                          : <CancelIcon sx={{ fontSize: '13px !important', color: student.feesStatus === 'pending' ? '#F59E0B' : '#EF4444' }} />
                        }
                        sx={{
                          bgcolor: student.feesStatus === 'paid' ? G[100] : student.feesStatus === 'pending' ? '#FEF3C7' : '#FEF2F2',
                          color: student.feesStatus === 'paid' ? G[700] : student.feesStatus === 'pending' ? '#B45309' : '#EF4444',
                          border: `1px solid ${student.feesStatus === 'paid' ? G[200] : student.feesStatus === 'pending' ? '#FDE68A' : '#FECACA'}`,
                          fontWeight: 600, fontSize: '0.72rem',
                        }}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={student.status === 'active' ? 'Active' : 'Inactive'}
                        size="small"
                        icon={student.status === 'active'
                          ? <CheckCircleIcon sx={{ fontSize: '13px !important', color: `${G[600]} !important` }} />
                          : <CancelIcon sx={{ fontSize: '13px !important', color: '#b45309 !important' }} />
                        }
                        sx={{
                          bgcolor: student.status === 'active' ? G[100] : '#FEF3C7',
                          color: student.status === 'active' ? G[700] : '#b45309',
                          border: `1px solid ${student.status === 'active' ? G[200] : '#fde68a'}`,
                          fontWeight: 600, fontSize: '0.72rem',
                        }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(student)} sx={{
                        color: G[600], bgcolor: G[100], borderRadius: 1.5, mr: 1,
                        border: `1px solid ${G[200]}`,
                        '&:hover': { bgcolor: G[200] }
                      }}>
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(student._id)} sx={{
                        color: '#c0392b', bgcolor: '#fef2f2', borderRadius: 1.5,
                        border: '1px solid #fecaca',
                        '&:hover': { bgcolor: '#fee2e2' }
                      }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ color: G[400], mb: 2 }}>No students found</Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{ borderColor: G[200], color: G[600] }}
                      >
                        Add your first student
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Add/Edit Student Dialog ── */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
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
          <DialogTitle sx={{ pt: 2.5, pb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: G[800], width: 38, height: 38, borderRadius: 1.5 }}>
                <SchoolIcon sx={{ color: G[200], fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                {selectedStudent ? 'Edit Student' : 'Add New Student'}
              </Typography>
            </Box>
          </DialogTitle>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank to use default (student123)"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2, bgcolor: G[50],
                    '& fieldset': { borderColor: G[200] },
                  },
                }}>
                  <InputLabel>Hostel</InputLabel>
                  <Select
                    name="hostelId"
                    value={formData.hostelId}
                    onChange={handleInputChange}
                    label="Hostel"
                  >
                    <MenuItem value="">None</MenuItem>
                    {hostels.map((hostel) => (
                      <MenuItem key={hostel._id || hostel.id} value={hostel._id || hostel.id}>
                        {hostel.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2, bgcolor: G[50],
                    '& fieldset': { borderColor: G[200] },
                  },
                }}>
                  <InputLabel>Room</InputLabel>
                  <Select
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleInputChange}
                    label="Room"
                  >
                    <MenuItem value="">None</MenuItem>
                    {rooms.map((room) => (
                      <MenuItem key={room._id || room.id} value={room._id || room.id}>
                        {room.roomNumber} - {room.hostel?.name || 'No Hostel'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g., 1st Year, 2nd Year"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Admission Date"
                  name="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Attendance (%)"
                  name="attendance"
                  type="number"
                  value={formData.attendance}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2, bgcolor: G[50],
                    '& fieldset': { borderColor: G[200] },
                  },
                }}>
                  <InputLabel>Fees Status</InputLabel>
                  <Select
                    name="feesStatus"
                    value={formData.feesStatus}
                    onChange={handleInputChange}
                    label="Fees Status"
                  >
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2, bgcolor: G[50],
                    '& fieldset': { borderColor: G[200] },
                  },
                }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={handleCloseDialog} sx={{
              color: G[600], borderRadius: 2, textTransform: 'none', fontWeight: 600,
              border: `1px solid ${G[200]}`, px: 3,
              '&:hover': { bgcolor: G[50] }
            }}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              sx={{
                bgcolor: G[700], color: '#ffffff', fontWeight: 600,
                borderRadius: 2, textTransform: 'none', px: 3,
                boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
                '&:hover': { bgcolor: G[800] }
              }}
            >
              {selectedStudent ? 'Update' : 'Create'} Student
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default AdminStudents;